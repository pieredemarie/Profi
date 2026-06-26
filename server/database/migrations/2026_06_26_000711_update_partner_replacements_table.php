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
        Schema::table('partner_replacements', function (Blueprint $table) {

            $table->foreignId('import_batch_id')
            
                ->nullable()
                ->after('id')
                ->constrained('import_batches')
                ->nullOnDelete();

            $table->foreignId('partner_organisation_id')

                ->nullable()
                ->after('import_batch_id')
                ->constrained('partner_organisations')
                ->nullOnDelete();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('partner_replacements', function (Blueprint $table) {

            $table->dropConstrainedForeignId('partner_organisation_id');
            $table->dropConstrainedForeignId('import_batch_id');

        });
    }
};
