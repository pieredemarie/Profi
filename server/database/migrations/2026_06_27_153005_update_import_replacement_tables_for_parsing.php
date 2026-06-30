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
        Schema::table('import_replacements', function (Blueprint $table){


            $table->string('foreign_product_name', 500)->change();

            $table->string('registry_number')->nullable(false)->change();
            $table->unique(['foreign_product_name', 'registry_number'], 'import_replacements_unique');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('import_replacements', function (Blueprint $table){

            
            $table->dropUnique('import_replacements_unique');
            $table->string('registry_number')->nullable()->change();
            $table->text('foreign_product_name')->change();
        });
    }
};
