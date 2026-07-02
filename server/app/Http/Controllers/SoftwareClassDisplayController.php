<?php

namespace App\Http\Controllers;

use App\Models\ImportReplacement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SoftwareClassDisplayController extends Controller
{
    public function softwareClasses(): JsonResponse
    {
        $softwareClasses = ImportReplacement::query()
            ->whereNotNull('software_class')
            ->pluck('software_class')
            ->flatMap(function (?string $softwareClass): array {
                return collect(explode('|', $softwareClass ?? ''))
                    ->map(fn (string $class) => trim($class))
                    ->filter()
                    ->all();
            })
            ->unique()
            ->sort()
            ->values();

        return response()->json($softwareClasses);
    }
}
