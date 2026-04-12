<?php
/**
 * Angel's Floor CMS — Authentication
 *
 * POST /api/auth.php?action=login    → { email, password } → { token, user }
 * POST /api/auth.php?action=verify   → Bearer token → { valid, user }
 */

require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        handleLogin();
        break;

    case 'verify':
        handleVerify();
        break;

    default:
        jsonError('Action invalide. Utilisez: login, verify', 400);
}

function handleLogin(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonError('Méthode non autorisée', 405);
    }

    $input = getJsonInput();
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (empty($email) || empty($password)) {
        jsonError('Email et mot de passe requis', 400);
    }

    // Vérifier les identifiants
    if ($email !== ADMIN_EMAIL || !password_verify($password, ADMIN_PASSWORD_HASH)) {
        // Délai pour ralentir le brute-force
        sleep(1);
        jsonError('Identifiants incorrects', 401);
    }

    $token = generateToken($email);

    jsonResponse([
        'token' => $token,
        'user' => [
            'email' => $email,
            'name' => 'Administrateur'
        ]
    ]);
}

function handleVerify(): void {
    $payload = requireAuth();

    jsonResponse([
        'valid' => true,
        'user' => [
            'email' => $payload['email'],
            'name' => 'Administrateur'
        ]
    ]);
}
