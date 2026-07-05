<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\ImportReplacement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApplicationCreateController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->all();

        if (isset($data['phone_number'])) {
            $data['phone_number'] = $this->normalizePhone($data['phone_number']);
        }
        $validator = Validator::make($request->all(), [
            'foreign_product_name' => ['required', 'string', 'max:500'],

            'phone_number' => [
                'required',
                'string',
                'regex:/^\+7[3489]\d{9}$/',
                'not_regex:/^\+7(\d)\1{9}$/',
            ],

            'full_name' => ['nullable', 'string', 'max:255'],
            'partner_replacement' => ['nullable', 'string', 'max:1000'],
        ]);

        $validator->after(function ($validator) use ($request): void {
            $foreignProductName = $this->normalizeText(
                $request->input('foreign_product_name', '')
            );

            $partnerReplacement = $this->normalizeText(
                $request->input('partner_replacement', '')
            );

            if ($foreignProductName === '') {
                return;
            }

            $foreignProductExists = ImportReplacement::query()
                ->where('foreign_product_name', $foreignProductName)
                ->exists();

            if (! $foreignProductExists) {
                $validator->errors()->add(
                    'foreign_product_name',
                    'The selected foreign product does not exist.'
                );

                return;
            }

            if ($partnerReplacement === '') {
                return;
            }

            $partnerReplacementMatchesProduct = ImportReplacement::query()
                ->where('foreign_product_name', $foreignProductName)
                ->whereHas('partnerReplacements', function ($query) use ($partnerReplacement): void {
                    $query->where('partner_product_name', $partnerReplacement);
                })
                ->exists();

            if (! $partnerReplacementMatchesProduct) {
                $validator->errors()->add(
                    'partner_replacement',
                    'The selected partner replacement does not match this foreign product.'
                );
            }
        });

        $validated = $validator->validate();

        $application = Application::create([
            'foreign_product_name' => $this->normalizeText($validated['foreign_product_name']),
            'phone_number' => $validated['phone_number'],
            'full_name' => isset($validated['full_name'])
                ? $this->nullableNormalizedText($validated['full_name'])
                : null,
            'partner_replacement' => isset($validated['partner_replacement'])
                ? $this->nullableNormalizedText($validated['partner_replacement'])
                : null,
        ]);

        return response()->json([
            'message' => 'Application created successfully.',
            'application' => [
                'foreign_product_name' => $application->foreign_product_name,
                'phone_number' => $application->phone_number,
                'full_name' => $application->full_name,
                'partner_replacement' => $application->partner_replacement,
            ],
        ], 201);
    }

    private function normalizeText(string $value): string
    {
        return trim(preg_replace('/\s+/u', ' ', $value));
    }

    private function nullableNormalizedText(string $value): ?string
    {
        $value = $this->normalizeText($value);

        return $value === '' ? null : $value;
    }
    private function normalizePhone(mixed $value): string
    {
        $digits = preg_replace('/\D+/', '', (string) $value);

        if (strlen($digits) === 11 && str_starts_with($digits, '8')) {
            $digits = '7'.substr($digits, 1);
        }

        if (strlen($digits) === 11 && str_starts_with($digits, '7')) {
            return '+'.$digits;
        }

        return (string) $value;
    }
}