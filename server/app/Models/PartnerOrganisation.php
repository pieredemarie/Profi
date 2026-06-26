<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartnerOrganisation extends Model
{
    protected $fillable = [

        'organisation_name',
        'tin',

    ];

    public function partnerReplacements(){

        return $this->hasMany(PartnerReplacement::class);
        
    }
}
