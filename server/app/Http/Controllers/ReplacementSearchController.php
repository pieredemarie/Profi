<?php

namespace App\Http\Controllers;

use App\Models\ImportReplacement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReplacementSearchController extends Controller
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
    public function partnerReplacementsByForeignProductName(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'foreign_product_name' => ['required', 'string', 'max:500'],
        ]);

        $foreignProductName = $this->normalizeQuery($validated['foreign_product_name']);

        if ($foreignProductName === '') {
            return response()->json([]);
        }

        $importReplacements = ImportReplacement::query()
            ->select([
                'foreign_product_name',
                'registry_number',
                'software_class',
            ])
            ->with([
                'partnerReplacements' => function ($query): void {
                    $query->select([
                        'partner_product_name',
                        'partner_organisation_name',
                        'registry_number',
                    ]);
                },
            ])
            ->where('foreign_product_name', $foreignProductName)
            ->whereHas('partnerReplacements')
            ->orderBy('registry_number')
            ->get();

        $matches = $importReplacements
            ->flatMap(function (ImportReplacement $importReplacement): array {
                return $importReplacement->partnerReplacements
                    ->map(fn ($partnerReplacement): array => [
                        'partner_product_name' => $partnerReplacement->partner_product_name,
                        'partner_organisation_name' => $partnerReplacement->partner_organisation_name,
                        'registry_number' => $partnerReplacement->registry_number,
                        'software_class' => $importReplacement->software_class,
                    ])
                    ->all();
            })
            ->values();

        return response()->json($matches);
    }

    private function normalizeQuery(string $query): string
    {
        return trim(preg_replace('/\s+/u', ' ', $query));
    }
}
