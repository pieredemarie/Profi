<?php

namespace App\Console\Commands;

use App\Imports\ImportReplacementRows;
use App\Models\ImportBatch;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class ImportReplacements extends Command
{
    protected $signature = 'import:replacements';

    protected $description = 'Download and delta import ImportReplacement from Excel';

    public function handle(): int
    {
        $this->info('Downloading latest file...');

        $downloadStatus = $this->call('external-file:download', [
            'source' => 'import_replacement',
        ]);

        if ($downloadStatus !== self::SUCCESS) {
            $this->error('Download failed.');

            return self::FAILURE;
        }

        $filePath = storage_path('app/private/imports/import_replacement/latest.xlsx');

        if (! file_exists($filePath)) {
            $this->error('Download failed - file not found.');

            return self::FAILURE;
        }

        $batch = ImportBatch::create([
            'type' => 'import_replacement',
            'file_name' => basename($filePath),
            'source_url' => $filePath,
            'status' => 'processing',
            'rows_total' => 0,
            'rows_success' => 0,
            'rows_failure' => 0,
        ]);

        try {
            DB::table('import_replacement_staging')->truncate();

            Excel::import(new ImportReplacementRows($batch->id), $filePath);

            $totalRows = DB::table('import_replacement_staging')->count();

            $uniqueRows = DB::query()
                ->fromSub(
                    DB::table('import_replacement_staging')
                        ->select('foreign_product_name', 'domestic_product_name')
                        ->distinct(),
                    'unique_replacements'
                )
                ->count();

            if ($totalRows === 0) {
                throw new \RuntimeException('No import replacement rows found.');
            }

            $batch->update([
                'rows_total' => $totalRows,
            ]);

            DB::transaction(function () use (&$deletedRows, &$updatedRows, &$insertedRows): void {
                $deletedRows = DB::affectingStatement('
                    DELETE live
                    FROM import_replacements live
                    LEFT JOIN (
                        SELECT DISTINCT
                            foreign_product_name,
                            domestic_product_name
                        FROM import_replacement_staging
                    ) staging
                        ON staging.foreign_product_name = live.foreign_product_name
                        AND staging.domestic_product_name = live.domestic_product_name
                    WHERE staging.foreign_product_name IS NULL
                ');

                $updatedRows = DB::affectingStatement('
                    UPDATE import_replacements live
                    INNER JOIN (
                        SELECT
                            foreign_product_name,
                            domestic_product_name,
                            MAX(registry_number) AS registry_number,
                            MAX(software_class) AS software_class
                        FROM import_replacement_staging
                        GROUP BY foreign_product_name, domestic_product_name
                    ) staging
                        ON staging.foreign_product_name = live.foreign_product_name
                        AND staging.domestic_product_name = live.domestic_product_name
                    SET
                        live.registry_number = staging.registry_number,
                        live.software_class = staging.software_class,
                        live.updated_at = NOW()
                    WHERE NOT (live.registry_number <=> staging.registry_number)
                       OR NOT (live.software_class <=> staging.software_class)
                ');

                $insertedRows = DB::affectingStatement('
                    INSERT INTO import_replacements
                        (
                            foreign_product_name,
                            domestic_product_name,
                            registry_number,
                            software_class,
                            import_batch_id,
                            created_at,
                            updated_at
                        )
                    SELECT
                        staging.foreign_product_name,
                        staging.domestic_product_name,
                        staging.registry_number,
                        staging.software_class,
                        staging.import_batch_id,
                        NOW(),
                        NOW()
                    FROM (
                        SELECT
                            foreign_product_name,
                            domestic_product_name,
                            MAX(registry_number) AS registry_number,
                            MAX(software_class) AS software_class,
                            MAX(import_batch_id) AS import_batch_id
                        FROM import_replacement_staging
                        GROUP BY foreign_product_name, domestic_product_name
                    ) staging
                    LEFT JOIN import_replacements live
                        ON live.foreign_product_name = staging.foreign_product_name
                        AND live.domestic_product_name = staging.domestic_product_name
                    WHERE live.id IS NULL
                ');
            });

            $batch->update([
                'status' => 'completed',
                'rows_success' => $uniqueRows,
                'rows_failure' => max(0, $totalRows - $uniqueRows),
            ]);

            $this->info("Import completed.");
            $this->info("Rows staged: $totalRows");
            $this->info("Unique rows: $uniqueRows");
            $this->info("Inserted: $insertedRows");
            $this->info("Updated: $updatedRows");
            $this->info("Deleted: $deletedRows");

            return self::SUCCESS;
        } catch (Throwable $e) {
            $batch->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            $this->error('Import failed: '.$e->getMessage());

            return self::FAILURE;
        }
    }
}