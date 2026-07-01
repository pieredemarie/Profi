<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('partner_organisations', function (Blueprint $table) {
            $table->index('tin', 'partner_organisations_tin_index');
        });

        Schema::table('partner_replacements', function (Blueprint $table) {
            $table->unique(
                ['partner_organisation_id', 'registry_number'],
                'partner_replacements_unique'
            );
        });

        Schema::create('partner_replacement_staging', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('partner_organisation_id');
            $table->string('tin')->index();
            $table->text('partner_organisation_name');
            $table->text('partner_product_name');
            $table->string('registry_number');
            $table->unsignedBigInteger('import_batch_id')->nullable();

            $table->index(
                ['partner_organisation_id', 'registry_number'],
                'partner_replacement_staging_business_key_index'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partner_replacement_staging');

        Schema::table('partner_replacements', function (Blueprint $table) {
            $table->dropUnique('partner_replacements_unique');
        });

        Schema::table('partner_organisations', function (Blueprint $table) {
            $table->dropIndex('partner_organisations_tin_index');
        });
    }
};