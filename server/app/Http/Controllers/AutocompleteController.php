<?php

namespace App\Http\Controllers;

use App\Models\ImportReplacement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AutocompleteController extends Controller
{
    public function importReplacements(Request $request): JsonResponse
    {
        $query = $this->normalizeQuery($request->query('query', ''));
        $softwareClasses = $this->normalizeSoftwareClasses($request->query('software_classes', []));

        if (mb_strlen($query) < 2) {
            return response()->json([]);
        }

        $search = mb_strtolower($query, 'UTF-8');
        $like = '%'.$this->escapeLike($search).'%';
        $prefixLike = $this->escapeLike($search).'%';

        $matches = ImportReplacement::query()
            ->select('foreign_product_name')
            ->whereRaw('LOWER(foreign_product_name) LIKE ? ESCAPE "\\\\"', [$like])
            ->when($softwareClasses !== [], function ($query) use ($softwareClasses): void {
                $query->where(function ($query) use ($softwareClasses): void {
                    foreach ($softwareClasses as $softwareClass) {
                        $query->orWhereRaw(
                            'CONCAT("|", REPLACE(software_class, " | ", "|"), "|") LIKE ? ESCAPE "\\\\"',
                            ['%|'.$this->escapeLike($softwareClass).'|%']
                        );
                    }
                });
            })
            ->distinct()
            ->orderByRaw(
                '
                CASE
                    WHEN LOWER(foreign_product_name) = ? THEN 0
                    WHEN LOWER(foreign_product_name) LIKE ? ESCAPE "\\\\" THEN 1
                    ELSE 2
                END
                ',
                [$search, $prefixLike]
            )
            ->orderByRaw('LOCATE(?, LOWER(foreign_product_name))', [$search])
            ->orderByRaw('CHAR_LENGTH(foreign_product_name)')
            ->orderBy('foreign_product_name')
            ->limit(5)
            ->pluck('foreign_product_name')
            ->map(fn (string $name) => [
                'label' => $name,
                'value' => $name,
            ])
            ->values();

        return response()->json($matches);
    }

    private function normalizeQuery(mixed $query): string
    {
        return trim(preg_replace('/\s+/u', ' ', (string) $query));
    }

    private function normalizeSoftwareClasses(mixed $softwareClasses): array
    {
        if (is_string($softwareClasses)) {
            $softwareClasses = explode(',', $softwareClasses);
        }

        if (! is_array($softwareClasses)) {
            return [];
        }

        return collect($softwareClasses)
            ->map(fn (mixed $softwareClass) => $this->normalizeQuery($softwareClass))
            ->filter()
            ->unique()
            ->values()
            ->all();
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