<?php

namespace App\Console\Commands;

use App\Imports\PartnerReplacementRows;
use App\Models\ImportBatch;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class ImportPartnerReplacements extends Command
{
    protected $signature = 'import:partner-replacements';

    protected $description = 'Download and delta import PartnerReplacement from registry export Excel';

    public function handle(): int
    {
        $this->info('Downloading latest registry export...');

        $downloadStatus = $this->call('external-file:download', [
            'source' => 'registry_export',
        ]);

        if ($downloadStatus !== self::SUCCESS) {
            $this->error('Download failed.');

            return self::FAILURE;
        }

        $filePath = storage_path('app/private/imports/registry_export/latest.xlsx');

        if (! file_exists($filePath)) {
            $this->error('Download failed - file not found.');

            return self::FAILURE;
        }

        $batch = ImportBatch::create([
            'type' => 'partner_replacement',
            'file_name' => basename($filePath),
            'source_url' => $filePath,
            'status' => 'processing',
            'rows_total' => 0,
            'rows_success' => 0,
            'rows_failure' => 0,
        ]);

        try {
            DB::table('partner_replacement_staging')->truncate();

            Excel::import(new PartnerReplacementRows($batch->id), $filePath);

            $totalRows = DB::table('partner_replacement_staging')->count();

            $uniqueRows = DB::query()
                ->fromSub(
                    DB::table('partner_replacement_staging')
                        ->select('partner_organisation_id', 'registry_number', 'partner_product_name')
                        ->distinct(),
                    'unique_partner_replacements'
                )
                ->count();

            $batch->update([
                'rows_total' => $totalRows,
            ]);

            if ($totalRows === 0) {
                throw new \RuntimeException('No partner replacement rows matched partner organisation TINs.');
            }

            DB::transaction(function () use (&$deletedRows, &$updatedRows, &$insertedRows): void {
                $deletedRows = DB::affectingStatement('
                    DELETE live
                    FROM partner_replacements live
                    INNER JOIN partner_organisations organisations
                        ON organisations.id = live.partner_organisation_id
                    LEFT JOIN (
                        SELECT DISTINCT
                            partner_organisation_id,
                            registry_number,
                            partner_product_name
                        FROM partner_replacement_staging
                    ) staging
                        ON staging.partner_organisation_id = live.partner_organisation_id
                        AND staging.registry_number = live.registry_number
                        AND staging.partner_product_name = live.partner_product_name
                    WHERE staging.partner_organisation_id IS NULL
                ');

                $updatedRows = DB::affectingStatement('
                    UPDATE partner_replacements live
                    INNER JOIN (
                        SELECT
                            partner_organisation_id,
                            registry_number,
                            partner_product_name,
                            MAX(partner_organisation_name) AS partner_organisation_name
                        FROM partner_replacement_staging
                        GROUP BY partner_organisation_id, registry_number, partner_product_name
                    ) staging
                        ON staging.partner_organisation_id = live.partner_organisation_id
                        AND staging.registry_number = live.registry_number
                        AND staging.partner_product_name = live.partner_product_name
                    SET
                        live.partner_organisation_name = staging.partner_organisation_name,
                        live.updated_at = NOW()
                    WHERE NOT (live.partner_organisation_name <=> staging.partner_organisation_name)
                ');

                $insertedRows = DB::affectingStatement('
                    INSERT INTO partner_replacements
                        (
                            import_batch_id,
                            partner_organisation_id,
                            partner_organisation_name,
                            partner_product_name,
                            registry_number,
                            created_at,
                            updated_at
                        )
                    SELECT
                        staging.import_batch_id,
                        staging.partner_organisation_id,
                        staging.partner_organisation_name,
                        staging.partner_product_name,
                        staging.registry_number,
                        NOW(),
                        NOW()
                    FROM (
                        SELECT
                            partner_organisation_id,
                            registry_number,
                            partner_product_name,
                            MAX(import_batch_id) AS import_batch_id,
                            MAX(partner_organisation_name) AS partner_organisation_name
                        FROM partner_replacement_staging
                        GROUP BY partner_organisation_id, registry_number, partner_product_name
                    ) staging
                    LEFT JOIN partner_replacements live
                        ON live.partner_organisation_id = staging.partner_organisation_id
                        AND live.registry_number = staging.registry_number
                        AND live.partner_product_name = staging.partner_product_name
                    WHERE live.id IS NULL
                ');
            });

            $batch->update([
                'status' => 'completed',
                'rows_success' => $uniqueRows,
                'rows_failure' => max(0, $totalRows - $uniqueRows),
            ]);

            $this->info('Import completed.');
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