<?php

namespace App\Http\Controllers;

use App\Models\ImportReplacement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReplacementsBySoftwareClass extends Controller
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

    public function withPartnerReplacementsBySoftwareClass(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'software_class' => ['required', 'string', 'max:255'],
        ]);

        $softwareClass = $this->normalizeSoftwareClass($validated['software_class']);

        if ($softwareClass === '') {
            return response()->json([]);
        }

        $matches = ImportReplacement::query()
            ->select([
                'foreign_product_name',
                'domestic_product_name',
                'registry_number',
                'software_class',
            ])
            ->whereNotNull('software_class')
            ->whereRaw(
                'CONCAT("|", REPLACE(software_class, " | ", "|"), "|") LIKE ? ESCAPE "\\\\"',
                ['%|'.$this->escapeLike($softwareClass).'|%']
            )
            ->whereHas('partnerReplacements')
            ->orderBy('foreign_product_name')
            ->orderBy('domestic_product_name')
            ->get()
            ->map(fn (ImportReplacement $replacement): array => [
                'foreign_product_name' => $replacement->foreign_product_name,
                'domestic_product_name' => $replacement->domestic_product_name,
                'registry_number' => $replacement->registry_number,
                'software_class' => $replacement->software_class,
            ])
            ->values();

        return response()->json($matches);
    }

    private function normalizeSoftwareClass(string $softwareClass): string
    {
        return trim(preg_replace('/\s+/u', ' ', $softwareClass));
    }

    private function escapeLike(string $value): string
    {
        return str_replace(
            ['\\', '%', '_'],
            ['\\\\', '\\%', '\\_'],
            $value
        );
    }
}
