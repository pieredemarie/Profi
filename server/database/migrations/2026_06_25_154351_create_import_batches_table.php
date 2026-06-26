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
        Schema::create('import_batches', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // 'replacement_catalog' or 'partner replacement' 
            $table->string('file_name');
            $table->string('source_url');
            $table->string('status');
            $table->unsignedInteger('rows_total');
            $table->unsignedInteger('rows_success');
            $table->unsignedInteger('rows_failure');
            $table->text('error_message')
                ->nullable();
            $table->timestamps();
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('import_batches');
    }
    
};
