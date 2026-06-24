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

    public function catalogueRows(){

        return $this->hasMany(ReplacementCatalog::class, 'registry number', 'registry number');
        
    }
}
