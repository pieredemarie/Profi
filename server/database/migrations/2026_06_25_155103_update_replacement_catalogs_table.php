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

        Schema::table('replacement_catalogs', function (Blueprint $table) {

            $table->renameColumn('software_classes', 'software_class');

        });

        Schema::table('replacement_catalogs', function (Blueprint $table){

             $table->text('software_class')->nullable()->change();

        });

        Schema::table('replacement_catalogs', function (Blueprint $table) {

            $table->foreignId('import_batch_id')
                ->nullable()
                ->after('id')
                ->constrained('import_batches')
                ->nullOnDelete();
                
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::table('replacement_catalogs', function (Blueprint $table){

            $table->json('software_class')->nullable()->change();

        });

        Schema::table('replacement_catalogs', function (Blueprint $table){

            $table->renameColumn('software_class', 'software_classes');

        });

        Schema::table('replacement_catalogs', function (Blueprint $table) {

            $table->dropConstrainedForeignId('import_batch_id');

        });

    }
        
};
