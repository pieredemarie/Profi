<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('import_replacements', function (Blueprint $table) {
            $table->index('foreign_product_name', 'import_replacements_foreign_product_name_index');
            $table->index('domestic_product_name', 'import_replacements_domestic_product_name_index');
        });
    }

    public function down(): void
    {
        Schema::table('import_replacements', function (Blueprint $table) {
            $table->dropIndex('import_replacements_foreign_product_name_index');
            $table->dropIndex('import_replacements_domestic_product_name_index');
        });
    }
};
