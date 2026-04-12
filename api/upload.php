<?php
/**
 * Angel's Floor CMS — File Upload
 *
 * POST /api/upload.php  → multipart/form-data avec champ "file"
 *                       → { success, url, filename }
 *
 * GET  /api/upload.php  → liste des fichiers uploadés
 *
 * DELETE /api/upload.php?file=nom-fichier.jpg → supprimer un fichier
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        requireAuth();
        handleList();
        break;

    case 'POST':
        requireAuth();
        handleUpload();
        break;

    case 'DELETE':
        requireAuth();
        handleDeleteFile();
        break;

    default:
        jsonError('Méthode non autorisée', 405);
}

function handleUpload(): void {
    if (!isset($_FILES['file'])) {
        jsonError('Aucun fichier envoyé', 400);
    }

    $file = $_FILES['file'];

    // Vérifier les erreurs d'upload
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errors = [
            UPLOAD_ERR_INI_SIZE => 'Fichier trop volumineux (limite serveur)',
            UPLOAD_ERR_FORM_SIZE => 'Fichier trop volumineux',
            UPLOAD_ERR_PARTIAL => 'Upload incomplet',
            UPLOAD_ERR_NO_FILE => 'Aucun fichier',
        ];
        jsonError($errors[$file['error']] ?? 'Erreur upload', 400);
    }

    // Vérifier la taille
    if ($file['size'] > MAX_UPLOAD_SIZE) {
        jsonError('Fichier trop volumineux (max 5MB)', 400);
    }

    // Vérifier l'extension
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ALLOWED_EXTENSIONS)) {
        jsonError('Type de fichier non autorisé. Extensions valides : ' . implode(', ', ALLOWED_EXTENSIONS), 400);
    }

    // Générer un nom de fichier sûr
    $baseName = pathinfo($file['name'], PATHINFO_FILENAME);
    $safeName = preg_replace('/[^a-z0-9\-]/', '-', strtolower($baseName));
    $safeName = preg_replace('/-+/', '-', $safeName);
    $filename = $safeName . '-' . substr(uniqid(), -6) . '.' . $ext;

    // Créer le dossier si nécessaire
    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0755, true);
    }

    $destination = UPLOAD_DIR . '/' . $filename;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        jsonError('Erreur lors de la sauvegarde du fichier', 500);
    }

    jsonResponse([
        'success' => true,
        'url' => UPLOAD_URL . '/' . $filename,
        'filename' => $filename,
        'size' => $file['size'],
        'type' => $file['type']
    ]);
}

function handleList(): void {
    if (!is_dir(UPLOAD_DIR)) {
        jsonResponse([]);
        return;
    }

    $files = [];
    foreach (scandir(UPLOAD_DIR) as $file) {
        if ($file === '.' || $file === '..') continue;

        $path = UPLOAD_DIR . '/' . $file;
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));

        if (!in_array($ext, ALLOWED_EXTENSIONS)) continue;

        $files[] = [
            'filename' => $file,
            'url' => UPLOAD_URL . '/' . $file,
            'size' => filesize($path),
            'modified' => date('c', filemtime($path))
        ];
    }

    // Trier par date de modification (plus récent en premier)
    usort($files, fn($a, $b) => strcmp($b['modified'], $a['modified']));

    jsonResponse($files);
}

function handleDeleteFile(): void {
    $filename = $_GET['file'] ?? '';

    if (empty($filename)) {
        jsonError('Nom de fichier requis', 400);
    }

    // Sécurité : empêcher la traversée de répertoire
    $filename = basename($filename);
    $path = UPLOAD_DIR . '/' . $filename;

    if (!file_exists($path)) {
        jsonError('Fichier introuvable', 404);
    }

    if (!unlink($path)) {
        jsonError('Erreur lors de la suppression', 500);
    }

    jsonResponse(['success' => true, 'message' => 'Fichier supprimé']);
}
