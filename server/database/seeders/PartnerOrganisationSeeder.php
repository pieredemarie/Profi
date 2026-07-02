<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PartnerOrganisationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('partner_organisations')->insert([
            [
                'organisation_name' => 'ООО "АКСОФТ"',
                'tin' => '0272924947',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'organisation_name' => 'ООО "КОНФИДЕНТ"',
                'tin' => '7811072513',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'organisation_name' => 'ООО "КРИПТО-ПРО"',
                'tin' => '7717107991',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'organisation_name' => 'ООО "РусБИТех-Астра"',
                'tin' => '7726388700',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'organisation_name' => 'АО "ИНФОТЕКС"',
                'tin' => '7710013769',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'organisation_name' => 'ООО "ПК АКВАРИУС"',
                'tin' => '7701256405',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'organisation_name' => 'ООО "Базальт СПО"',
                'tin' => '7714350892',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'organisation_name' => 'ООО "А-РЕАЛ КОНСАЛТИНГ"',
                'tin' => '7606047112',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'organisation_name' => 'ООО "КОД БЕЗОПАСНОСТИ"',
                'tin' => '7715719244',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'organisation_name' => 'АО "ЭШЕЛОН ТЕХНОЛОГИИ"',
                'tin' => '7718859120',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'organisation_name' => 'АО "Лаборатория Касперского"',
                'tin' => '7713140469',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'organisation_name' => 'ООО «ИНФЕРИТ»',
                'tin' => '5050155270',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            ]);
    }
}
