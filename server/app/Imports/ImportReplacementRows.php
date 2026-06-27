<?php

namespace App\Imports;

use App\Models\ImportReplacementStagingTable;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class ImportReplacementRows implements ToModel, WithBatchInserts, WithChunkReading{

    private $batchId;

    public function __construct($batchId)
    {
        return $this->batchId = $batchId;
    }

    public function model (array $row){

        if (empty($row[2])) {
            return null;
        }

        return new ImportReplacementStagingTable([
            'foreign_product_name'  => $row[0] ?? '',
            'domestic_product_name' => $row[1] ?? '',
            'registry_number'       => $row[2],
            'software_class'        => $row[3] ?? null,
            'import_batch_id'       => $this->batchId,
        ]);

    }
    public function batchSize(): int { return 1000; }
    public function chunkSize(): int { return 1000; }
}
?>