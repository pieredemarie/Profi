<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartnerReplacement extends Model
{
    protected $fillable = [
        'partner_organisation_name',
        'partner_product_name',
        'registry_number',
    ];


    public function importBatch(){

        return $this->belongsTo(ImportBatch::class);

    }

    public function partnerList(){

        return $this->belongsTo(PartnerList::class);

    }

    public function catalogueRows(){

        return $this->hasMany(ReplacementCatalog::class, 'registry number', 'registry number');
        
    }
}
