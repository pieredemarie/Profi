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
        $latestPath = $config['latest_path'];
        $archiveDir = $config['archive_dir'];

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

        $contents = $response->body();

        $timestamp = now()->format('Y-m-d_His');

        $archivePath = $archiveDir . '/' . $timestamp . '.xlsx';

        Storage::put($latestPath, $contents);
        Storage::put($archivePath, $contents);

        $this->info('File downloaded successfully.');
        $this->info("Latest saved to: $latestPath");
        $this->info("Archive saved to: $archivePath");

        return self::SUCCESS;
    }
}