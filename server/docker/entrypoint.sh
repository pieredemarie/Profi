#!/usr/bin/env sh
set -eu

if [ ! -d vendor ]; then
    composer install --no-interaction --prefer-dist
fi

if [ ! -f .env ]; then
    cp .env.example .env
fi

if ! grep -q '^APP_KEY=base64:' .env 2>/dev/null; then
    php artisan key:generate --force
fi

echo "Waiting for MySQL at ${DB_HOST}:${DB_PORT}..."
until php -r '
$host = getenv("DB_HOST");
$port = getenv("DB_PORT") ?: "3306";
$db = getenv("DB_DATABASE");
$user = getenv("DB_USERNAME");
$pass = getenv("DB_PASSWORD");
try {
    new PDO("mysql:host={$host};port={$port};dbname={$db}", $user, $pass);
    exit(0);
} catch (Throwable $e) {
    exit(1);
}
' > /dev/null 2>&1; do
    sleep 2
done

php artisan config:clear
php artisan migrate --force

php artisan serve --host=0.0.0.0 --port=8000
