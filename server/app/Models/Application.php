<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [

        'foreign_product_name',
        'partner_replacement',
        'full_name',
        'phone_number',

    ];

    protected $casts = [

        'partner_replacement_list' => 'array',

    ];
}
