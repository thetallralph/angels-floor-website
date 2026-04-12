<?php
/**
 * Angel's Floor CMS — Configuration
 */

// Charger le .env si présent
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        if (strpos($line, '=') === false) continue;
        [$key, $value] = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
        putenv(trim($key) . '=' . trim($value));
    }
}

function env(string $key, string $default = ''): string {
    return $_ENV[$key] ?? getenv($key) ?: $default;
}

// --- CORS ---
$allowedOrigins = env('CMS_ALLOWED_ORIGINS', '*');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if ($allowedOrigins === '*') {
    header('Access-Control-Allow-Origin: *');
} elseif ($origin && str_contains($allowedOrigins, $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// --- Configuration ---

define('JWT_SECRET', env('CMS_JWT_SECRET', 'change-me-in-production-' . md5(__DIR__)));
define('TOKEN_EXPIRY', 86400);

define('DATA_DIR', __DIR__ . '/data');
define('UPLOAD_DIR', __DIR__ . '/uploads');
define('UPLOAD_URL', '/api/uploads');

define('CONTENT_TYPES', ['products', 'blog', 'pages', 'sales-points', 'settings']);
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif']);
define('MAX_UPLOAD_SIZE', 5 * 1024 * 1024);

// Credentials — MUST be set via .env or environment variables in production
define('ADMIN_EMAIL', env('CMS_ADMIN_EMAIL', 'admin@angelsfloor.bj'));
// Si pas de hash configuré, utiliser le mot de passe par défaut (dev seulement)
$passwordHash = env('CMS_ADMIN_PASSWORD_HASH');
define('ADMIN_PASSWORD_HASH', $passwordHash ?: password_hash('admin123', PASSWORD_DEFAULT));

// Rate limiting fichier
define('RATE_LIMIT_FILE', __DIR__ . '/data/.rate_limit.json');
define('RATE_LIMIT_MAX_ATTEMPTS', 5);
define('RATE_LIMIT_WINDOW', 900); // 15 minutes

// --- Rate Limiting ---

function checkRateLimit(string $ip): void {
    $file = RATE_LIMIT_FILE;
    $data = [];

    if (file_exists($file)) {
        $data = json_decode(file_get_contents($file), true) ?: [];
    }

    $now = time();

    // Nettoyer les entrées expirées
    foreach ($data as $key => $entry) {
        if ($entry['expires'] < $now) {
            unset($data[$key]);
        }
    }

    $key = md5($ip);
    $entry = $data[$key] ?? ['attempts' => 0, 'expires' => $now + RATE_LIMIT_WINDOW];

    if ($entry['attempts'] >= RATE_LIMIT_MAX_ATTEMPTS && $entry['expires'] > $now) {
        $wait = ceil(($entry['expires'] - $now) / 60);
        jsonError("Trop de tentatives. Réessayez dans {$wait} minute(s).", 429);
    }

    $entry['attempts']++;
    $entry['expires'] = $now + RATE_LIMIT_WINDOW;
    $data[$key] = $entry;

    file_put_contents($file, json_encode($data));
}

function resetRateLimit(string $ip): void {
    $file = RATE_LIMIT_FILE;
    if (!file_exists($file)) return;

    $data = json_decode(file_get_contents($file), true) ?: [];
    unset($data[md5($ip)]);
    file_put_contents($file, json_encode($data));
}

function getClientIp(): string {
    return $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

// --- Helpers ---

function jsonResponse(mixed $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function jsonError(string $message, int $code = 400): void {
    jsonResponse(['error' => $message], $code);
}

function getJsonInput(): array {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    if ($data === null && $input !== '') {
        jsonError('JSON invalide', 400);
    }
    return $data ?? [];
}

function requireAuth(): array {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer\s+(.+)$/', $header, $matches)) {
        jsonError('Token manquant', 401);
    }

    $token = $matches[1];
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        jsonError('Token invalide', 401);
    }

    $payload = json_decode(base64_decode($parts[1]), true);
    if (!$payload || ($payload['exp'] ?? 0) < time()) {
        jsonError('Token expiré', 401);
    }

    $header_part = $parts[0];
    $payload_part = $parts[1];
    $signature = hash_hmac('sha256', "$header_part.$payload_part", JWT_SECRET);
    if (!hash_equals($signature, $parts[2])) {
        jsonError('Token invalide', 401);
    }

    return $payload;
}

function generateToken(string $email): string {
    $header = base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $payload = base64_encode(json_encode([
        'email' => $email,
        'iat' => time(),
        'exp' => time() + TOKEN_EXPIRY
    ]));
    $signature = hash_hmac('sha256', "$header.$payload", JWT_SECRET);
    return "$header.$payload.$signature";
}
