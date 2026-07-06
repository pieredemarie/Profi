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
        $input = $request->all();

        $input['foreign_product_name'] = $this->normalizeText((string) ($input['foreign_product_name'] ?? ''));
        $input['partner_replacement'] = $this->nullableNormalizedText((string) ($input['partner_replacement'] ?? ''));

        if (array_key_exists('full_name', $input)) {
            $input['full_name'] = $this->nullableNormalizedText((string) $input['full_name']);
        }

        if (array_key_exists('phone_number', $input)) {
            $input['phone_number'] = $this->normalizePhone($input['phone_number']);
        }

        $validator = Validator::make($input, [
            'foreign_product_name' => ['required', 'string', 'max:500'],
            'phone_number' => [
                'required',
                'string',
                'regex:/^\+7\d{10}$/',
                'not_regex:/^\+7(\d)\1{9}$/',
            ],
            'full_name' => ['nullable', 'string', 'max:255'],
            'partner_replacement' => ['nullable', 'string', 'max:1000'],
        ], [
            'phone_number.regex' => 'Неверный формат телефона.',
            'phone_number.not_regex' => 'Неверный формат телефона.',
        ]);

        $validator->after(function ($validator) use ($input): void {
            $foreignProductName = $input['foreign_product_name'] ?? '';
            $partnerReplacement = $input['partner_replacement'] ?? null;

            if ($foreignProductName === '') {
                return;
            }

            $foreignProductExists = ImportReplacement::query()
                ->where('foreign_product_name', $foreignProductName)
                ->exists();

            if (! $foreignProductExists) {
                $validator->errors()->add(
                    'foreign_product_name',
                    'Выбранный зарубежный продукт не найден.'
                );

                return;
            }

            if ($partnerReplacement === null) {
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
                    'Выбранная замена не соответствует зарубежному продукту.'
                );
            }
        });

        if ($validator->fails()) {
            $errors = $validator->errors();

            return response()->json([
                'error' => [
                    'code' => 'validation_error',
                    'message' => $errors->first(),
                    'fields' => $errors->toArray(),
                ],
            ], 422);
        }

        $validated = $validator->validated();

        $application = Application::create([
            'foreign_product_name' => $validated['foreign_product_name'],
            'phone_number' => $validated['phone_number'],
            'full_name' => $validated['full_name'] ?? null,
            'partner_replacement' => $validated['partner_replacement'] ?? null,
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

        if (strlen($digits) === 10) {
            $digits = '7'.$digits;
        }

        if (strlen($digits) === 11 && str_starts_with($digits, '8')) {
            $digits = '7'.substr($digits, 1);
        }

        if (strlen($digits) === 11 && str_starts_with($digits, '7')) {
            return '+'.$digits;
        }

        return (string) $value;
    }
}
