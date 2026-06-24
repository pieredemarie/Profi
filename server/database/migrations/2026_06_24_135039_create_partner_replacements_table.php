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
        Schema::create('partner_replacements', function (Blueprint $table) {
            $table->id();
            $table->text('partner_organisation_name');
            $table->text('partner_product_name');
            $table->string('registry_number')
                ->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partner_replacements');
    }
};
