<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


Schedule::command('external-file:download source_one')
    ->weekly()
    ->withoutOverlapping();

Schedule::command('external-file:download source_two')
    ->weekly()
    ->withoutOverlapping();