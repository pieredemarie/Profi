<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImportReplacementStagingTable extends Model
{
    protected $table = 'import_replacement_staging';
    public $timestamps = false;
    protected $guarded = [];
}
