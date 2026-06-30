<?php

namespace App\Imports;

use App\Models\ImportReplacementStagingTable;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithStartRow;

class ImportReplacementRows implements ToModel, WithBatchInserts, WithChunkReading, WithStartRow
{
    public function __construct(private int $batchId)
    {
    }

    public function startRow(): int
    {
        return 2;
    }

    public function model(array $row)
    {
        $foreignProductName = $this->clean($row[0] ?? '');
        $domesticProductName = $this->clean($row[1] ?? '');
        $registryNumber = $this->cleanRegistryNumber($row[2] ?? '');

        if ($foreignProductName === '' || $domesticProductName === '' || $registryNumber === '') {
            return null;
        }

        $softwareClass = collect(array_slice($row, 3))
            ->map(fn ($value) => $this->clean($value))
            ->filter()
            ->unique()
            ->values()
            ->implode(' | ');

        return new ImportReplacementStagingTable([
            'foreign_product_name' => $foreignProductName,
            'domestic_product_name' => $domesticProductName,
            'registry_number' => $registryNumber,
            'software_class' => $softwareClass ?: null,
            'import_batch_id' => $this->batchId,
        ]);
    }

    public function batchSize(): int
    {
        return 1000;
    }

    public function chunkSize(): int
    {
        return 1000;
    }

    private function clean(mixed $value): string
    {
        return trim(preg_replace('/\s+/u', ' ', (string) $value));
    }

    private function cleanRegistryNumber(mixed $value): string
    {
        $value = $this->clean($value);

        if (preg_match('/№\s*(\d+)/u', $value, $match)) {
            return $match[1];
        }

        if (preg_match('/^(\d+)\s+от\b/u', $value, $match)) {
            return $match[1];
        }

        return $value;
    }
}