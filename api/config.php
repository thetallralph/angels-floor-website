<?php
/**
 * Angel's Floor CMS — Configuration
 */

// CORS pour le frontend SvelteKit
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// --- Configuration ---

// Clé secrète pour les tokens JWT (CHANGER EN PRODUCTION)
define('JWT_SECRET', getenv('CMS_JWT_SECRET') ?: 'change-me-in-production-angels-floor-2024');

// Durée de validité du token (24h)
define('TOKEN_EXPIRY', 86400);

// Chemin vers les données
define('DATA_DIR', __DIR__ . '/data');
define('UPLOAD_DIR', __DIR__ . '/uploads');
define('UPLOAD_URL', '/api/uploads');

// Types de contenu autorisés
define('CONTENT_TYPES', ['products', 'blog', 'pages', 'sales-points', 'settings']);

// Extensions d'images autorisées
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif']);

// Taille max upload (5MB)
define('MAX_UPLOAD_SIZE', 5 * 1024 * 1024);

// Identifiants admin (CHANGER EN PRODUCTION)
// Peut être défini via variables d'environnement
define('ADMIN_EMAIL', getenv('CMS_ADMIN_EMAIL') ?: 'admin@angelsfloor.bj');
define('ADMIN_PASSWORD_HASH', getenv('CMS_ADMIN_PASSWORD_HASH') ?: password_hash('admin123', PASSWORD_DEFAULT));

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

    // Vérifier la signature
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
