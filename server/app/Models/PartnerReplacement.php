<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartnerReplacement extends Model
{
    protected $fillable = [
        'import_batch_id',
        'partner_organisation_id',
        'partner_organisation_name',
        'partner_product_name',
        'registry_number',
    ];

    public function importBatch()
    {
        return $this->belongsTo(ImportBatch::class);
    }

    public function partnerOrganisation()
    {
        return $this->belongsTo(PartnerOrganisation::class);
    }

    public function catalogueRows()
    {
        return $this->hasMany(ImportReplacement::class, 'registry_number', 'registry_number');
    }
}