<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ImportBatch;
use App\Imports\ImportReplacementRows;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class ImportReplacements extends Command
{
    protected $signature = 'import:replacements';
    protected $description = 'Download and delta import ImportReplacement from Excel';

    public function handle()
    {

        $this->info('Downloading latest file...');
        $this->call('external-file:download', ['source'=>'import_replacement']);

        $filePath = storage_path('app/private/imports/import_replacement/latest.xlsx');

        if (!file_exists($filePath)) {
            $this->error('Download failed – file not found.');
            return 1;
        }


        $batch = ImportBatch::create([
            'type'        => 'import_replacement',
            'file_name'   => basename($filePath),
            'source_url'  => $filePath,
            'status'      => 'processing',
            'rows_total'  => 0,
            'rows_success'=> 0,
            'rows_failure'=> 0,
        ]);

        try {

            DB::table('import_replacement_staging')->truncate();

            Excel::import(new ImportReplacementRows($batch->id), $filePath);

            $totalRows = DB::table('import_replacement_staging')->count();
            $batch->update(['rows_total' => $totalRows]);

            if ($totalRows === 0) {
                throw new \Exception('No rows with registry numbers found.');
            }


            DB::transaction(function () use ($batch, $totalRows) {

                DB::table('import_replacements as live')
                    ->leftJoin('import_replacement_staging as staging', function ($join) {
                        $join->on('live.foreign_product_name', '=', 'staging.foreign_product_name')
                             ->on('live.registry_number', '=', 'staging.registry_number');
                    })
                    ->whereNull('staging.foreign_product_name')
                    ->delete();

                DB::statement('
                    INSERT INTO import_replacements
                        (foreign_product_name, domestic_product_name, registry_number, software_class, import_batch_id, created_at, updated_at)
                    SELECT
                        foreign_product_name,
                        domestic_product_name,
                        registry_number,
                        software_class,
                        import_batch_id,
                        NOW(),
                        NOW()
                    FROM import_replacement_staging
                    ON DUPLICATE KEY UPDATE
                        domestic_product_name = VALUES(domestic_product_name),
                        software_class = VALUES(software_class),
                        import_batch_id    = VALUES(import_batch_id),
                        updated_at         = NOW()
                ');
            });

            $batch->update([
                'status'       => 'completed',
                'rows_success' => $totalRows,
            ]);

            $this->info("Import completed – $totalRows rows processed.");

        } catch (\Exception $e) {
            $batch->update([
                'status'        => 'failed',
                'error_message' => $e->getMessage(),
            ]);
            $this->error('Import failed: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
