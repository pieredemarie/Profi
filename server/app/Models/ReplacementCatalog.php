<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relationship_Name;

class ReplacementCatalog extends Model
{
    protected $fillable = [
        'import_batch_id',
        'foreign_product_name',
        'domestic_product_name',
        'registry_number',
        'software_classes',
    ];
    protected $casts = [
        'software_classes' => 'array',
    ];
}
