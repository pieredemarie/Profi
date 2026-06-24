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
        Schema::create('replacement_catalogs', function (Blueprint $table) {
            $table->id();
            $table->text('foreign_product_name');
            $table->text('domestic_product_name');
            $table->string('registry_number')
                ->nullable()
                ->index();
            $table->json('software_classes')
                ->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('replacement_catalogs');
    }
};
