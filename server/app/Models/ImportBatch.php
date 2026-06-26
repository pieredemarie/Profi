<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImportBatch extends Model
{
    protected $fillable = [

        'type',
        'file_name',
        'source_url',
        'status',
        'rows_total',
        'rows_success',
        'rows_failure',
        'error_message',

    ];

    public function replacementCatalogs(){

        return $this->hasMany(ReplacementCatalog::class);

    }

    public function partnerReplacements(){

        return $this->hasMany(PartnerReplacement::class);
        
    }
    
}
