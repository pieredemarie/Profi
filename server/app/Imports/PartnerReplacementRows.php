<?php

namespace App\Imports;

use App\Models\PartnerOrganisation;
use App\Models\PartnerReplacementStagingTable;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithStartRow;

class PartnerReplacementRows implements ToModel, WithBatchInserts, WithChunkReading, WithStartRow
{
    private Collection $partnerOrganisationsByTin;

    public function __construct(private int $batchId)
    {
        $this->partnerOrganisationsByTin = PartnerOrganisation::query()
            ->select(['id', 'organisation_name', 'tin'])
            ->get()
            ->keyBy(fn (PartnerOrganisation $organisation) => $this->cleanTin($organisation->tin));
    }

    public function startRow(): int
    {
        return 6;
    }

    public function model(array $row)
    {
        $registryNumber = $this->clean($row[0] ?? '');
        $partnerProductName = $this->clean($row[1] ?? '');
        $sourceOrganisationName = $this->clean($row[11] ?? '');
        $tin = $this->cleanTin($row[14] ?? '');

        if ($registryNumber === '' || $partnerProductName === '' || $tin === '') {
            return null;
        }

        $partnerOrganisation = $this->partnerOrganisationsByTin->get($tin);

        if (! $partnerOrganisation) {
            return null;
        }

        return new PartnerReplacementStagingTable([
            'partner_organisation_id' => $partnerOrganisation->id,
            'tin' => $tin,
            'partner_organisation_name' => $sourceOrganisationName ?: $partnerOrganisation->organisation_name,
            'partner_product_name' => $partnerProductName,
            'registry_number' => $registryNumber,
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

    private function cleanTin(mixed $value): string
    {
        $tin = preg_replace('/\D+/u', '', $this->clean($value)) ?? '';

        if (mb_strlen($tin) === 9) {
            return '0'.$tin;
        }

        return $tin;
    }
}