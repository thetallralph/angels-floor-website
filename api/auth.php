<?php
/**
 * Angel's Floor CMS — Authentication
 *
 * POST /api/auth.php?action=login         → { email, password } → { token, user }
 * POST /api/auth.php?action=verify        → Bearer token → { valid, user }
 * POST /api/auth.php?action=change-password → Bearer token + { current, new } → { success }
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
    case 'change-password':
        handleChangePassword();
        break;
    default:
        jsonError('Action invalide. Utilisez: login, verify, change-password', 400);
}

function handleLogin(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonError('Méthode non autorisée', 405);
    }

    $ip = getClientIp();
    checkRateLimit($ip);

    $input = getJsonInput();
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (empty($email) || empty($password)) {
        jsonError('Email et mot de passe requis', 400);
    }

    if ($email !== ADMIN_EMAIL || !password_verify($password, ADMIN_PASSWORD_HASH)) {
        sleep(1);
        jsonError('Identifiants incorrects', 401);
    }

    // Login réussi — reset le rate limit
    resetRateLimit($ip);

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

function handleChangePassword(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonError('Méthode non autorisée', 405);
    }

    requireAuth();

    $input = getJsonInput();
    $currentPassword = $input['current'] ?? '';
    $newPassword = $input['new'] ?? '';

    if (empty($currentPassword) || empty($newPassword)) {
        jsonError('Mot de passe actuel et nouveau requis', 400);
    }

    if (strlen($newPassword) < 8) {
        jsonError('Le nouveau mot de passe doit faire au moins 8 caractères', 400);
    }

    // Vérifier le mot de passe actuel
    if (!password_verify($currentPassword, ADMIN_PASSWORD_HASH)) {
        jsonError('Mot de passe actuel incorrect', 401);
    }

    // Générer le nouveau hash
    $newHash = password_hash($newPassword, PASSWORD_DEFAULT);

    // Sauvegarder dans le fichier .env
    $envFile = __DIR__ . '/.env';
    $envContent = '';

    if (file_exists($envFile)) {
        $envContent = file_get_contents($envFile);
        // Remplacer ou ajouter la ligne
        if (preg_match('/^CMS_ADMIN_PASSWORD_HASH=.*/m', $envContent)) {
            $envContent = preg_replace('/^CMS_ADMIN_PASSWORD_HASH=.*/m', "CMS_ADMIN_PASSWORD_HASH={$newHash}", $envContent);
        } else {
            $envContent .= "\nCMS_ADMIN_PASSWORD_HASH={$newHash}\n";
        }
    } else {
        $envContent = "CMS_ADMIN_PASSWORD_HASH={$newHash}\n";
    }

    if (file_put_contents($envFile, $envContent) === false) {
        jsonError('Erreur lors de la sauvegarde. Contactez l\'administrateur technique.', 500);
    }

    jsonResponse([
        'success' => true,
        'message' => 'Mot de passe changé avec succès. Reconnectez-vous.'
    ]);
}
