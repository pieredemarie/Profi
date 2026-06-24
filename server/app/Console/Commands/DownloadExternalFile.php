<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class DownloadExternalFile extends Command
{
    protected $signature = 'external-file:download {source}';

    protected $description = 'Download an external Excel file';

    public function handle(): int
    {
        $source = $this->argument('source');

        $config = config("services.external_files.$source");

        if (! $config) {
            $this->error("Unknown source: $source");

            return self::FAILURE;
        }

        $url = $config['url'];
        $path = $config['path'];

        if (! $url) {
            $this->error("Missing URL for source: $source");

            return self::FAILURE;
        }

        $this->info("Downloading source: $source");
        $this->info("URL: $url");

        $response = Http::timeout(60)->get($url);

        $this->info('Status: ' . $response->status());
        $this->info('Content-Type: ' . $response->header('Content-Type'));
        $this->info('Content-Disposition: ' . $response->header('Content-Disposition'));

        if (! $response->successful()) {
            $this->error('Download failed. HTTP status: ' . $response->status());

            return self::FAILURE;
        }

        Storage::put($path, $response->body());

        $this->info("File downloaded successfully.");
        $this->info("Saved to: $path");

        return self::SUCCESS;
    }
}