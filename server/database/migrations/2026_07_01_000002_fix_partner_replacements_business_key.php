<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('partner_replacements', function (Blueprint $table) {
            $table->index(
                'partner_organisation_id',
                'partner_replacements_partner_organisation_id_index'
            );
        });

        Schema::table('partner_replacements', function (Blueprint $table) {
            $table->dropUnique('partner_replacements_unique');
        });

        Schema::table('partner_replacements', function (Blueprint $table) {
            $table->string('registry_number', 50)->change();
            $table->string('partner_product_name', 500)->change();

            $table->unique(
                ['partner_organisation_id', 'registry_number', 'partner_product_name'],
                'partner_replacements_unique'
            );
        });

        Schema::table('partner_replacement_staging', function (Blueprint $table) {
            $table->dropIndex('partner_replacement_staging_business_key_index');
        });

        Schema::table('partner_replacement_staging', function (Blueprint $table) {
            $table->string('registry_number', 50)->change();
            $table->string('partner_product_name', 500)->change();

            $table->index(
                ['partner_organisation_id', 'registry_number', 'partner_product_name'],
                'partner_replacement_staging_business_key_index'
            );
        });
    }

    public function down(): void
    {
        Schema::table('partner_replacement_staging', function (Blueprint $table) {
            $table->dropIndex('partner_replacement_staging_business_key_index');
        });

        Schema::table('partner_replacement_staging', function (Blueprint $table) {
            $table->text('partner_product_name')->change();

            $table->index(
                ['partner_organisation_id', 'registry_number'],
                'partner_replacement_staging_business_key_index'
            );
        });

        Schema::table('partner_replacements', function (Blueprint $table) {
            $table->dropUnique('partner_replacements_unique');
        });

        Schema::table('partner_replacements', function (Blueprint $table) {
            $table->text('partner_product_name')->change();

            $table->unique(
                ['partner_organisation_id', 'registry_number'],
                'partner_replacements_unique'
            );
        });

        Schema::table('partner_replacements', function (Blueprint $table) {
            $table->dropIndex('partner_replacements_partner_organisation_id_index');
        });
    }
};