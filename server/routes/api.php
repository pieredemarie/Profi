<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AutocompleteController;
use App\Http\Controllers\SoftwareClassDisplayController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/import_replacements',[AutocompleteController::class, 'importReplacements']);
Route::get('/import_replacements/software-classes', [SoftwareClassDisplayController::class, 'softwareClasses']);