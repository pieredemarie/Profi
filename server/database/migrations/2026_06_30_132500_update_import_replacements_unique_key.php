<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('import_replacements', function (Blueprint $table) {
            $table->dropUnique('import_replacements_unique');
        });

        Schema::table('import_replacements', function (Blueprint $table) {
            $table->string('domestic_product_name', 255)->change();

            $table->unique(
                ['foreign_product_name', 'domestic_product_name'],
                'import_replacements_unique'
            );
        });

        Schema::table('import_replacement_staging', function (Blueprint $table) {
            $table->string('domestic_product_name', 255)->change();
        });
    }

    public function down(): void
    {
        Schema::table('import_replacements', function (Blueprint $table) {
            $table->dropUnique('import_replacements_unique');
        });

        Schema::table('import_replacements', function (Blueprint $table) {
            $table->text('domestic_product_name')->change();

            $table->unique(
                ['foreign_product_name', 'registry_number'],
                'import_replacements_unique'
            );
        });

        Schema::table('import_replacement_staging', function (Blueprint $table) {
            $table->text('domestic_product_name')->change();
        });
    }
};