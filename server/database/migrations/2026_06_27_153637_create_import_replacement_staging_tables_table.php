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
        Schema::create('import_replacement_staging', function (Blueprint $table) {
            $table->string('foreign_product_name', 500);
            $table->text('domestic_product_name');
            $table->string('registry_number');
            $table->text('software_class')->nullable();
            $table->unsignedBigInteger('import_batch_id')->nullable();
            //$table->unique(['foreign_product_name', 'registry_number'], 'staging_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('import_replacement_staging_tables');
    }
};
