<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::rename('replacement_catalogs', 'import_replacements');

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::rename( 'import_replacements', 'replacement_catalogs');
        
    }

};
