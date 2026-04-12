<?php
/**
 * Angel's Floor CMS — File Upload + Auto Resize
 *
 * POST /api/upload.php  → multipart/form-data avec champ "file"
 *                       → { success, url, filename, variants }
 *
 * GET  /api/upload.php  → liste des fichiers uploadés
 *
 * DELETE /api/upload.php?file=nom-fichier.jpg → supprimer un fichier + variants
 */

require_once __DIR__ . '/config.php';

// Tailles des variantes générées
define('IMAGE_VARIANTS', [
    'thumb' => 300,   // Thumbnail (admin, cartes)
    'medium' => 800,  // Medium (listing produits)
    'large' => 1400   // Large (détail produit)
]);

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

    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errors = [
            UPLOAD_ERR_INI_SIZE => 'Fichier trop volumineux (limite serveur)',
            UPLOAD_ERR_FORM_SIZE => 'Fichier trop volumineux',
            UPLOAD_ERR_PARTIAL => 'Upload incomplet',
            UPLOAD_ERR_NO_FILE => 'Aucun fichier',
        ];
        jsonError($errors[$file['error']] ?? 'Erreur upload', 400);
    }

    if ($file['size'] > MAX_UPLOAD_SIZE) {
        jsonError('Fichier trop volumineux (max 5MB)', 400);
    }

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ALLOWED_EXTENSIONS)) {
        jsonError('Type de fichier non autorisé. Extensions valides : ' . implode(', ', ALLOWED_EXTENSIONS), 400);
    }

    $baseName = pathinfo($file['name'], PATHINFO_FILENAME);
    $safeName = preg_replace('/[^a-z0-9\-]/', '-', strtolower($baseName));
    $safeName = preg_replace('/-+/', '-', trim($safeName, '-'));
    $filename = $safeName . '-' . substr(uniqid(), -6) . '.' . $ext;

    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0755, true);
    }

    $destination = UPLOAD_DIR . '/' . $filename;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        jsonError('Erreur lors de la sauvegarde du fichier', 500);
    }

    // Générer les variantes redimensionnées
    $variants = [];
    $rasterExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

    if (in_array($ext, $rasterExts) && function_exists('imagecreatetruecolor')) {
        foreach (IMAGE_VARIANTS as $variantName => $maxWidth) {
            $variantFilename = $safeName . '-' . substr(uniqid(), -6) . "-{$variantName}.{$ext}";
            $variantPath = UPLOAD_DIR . '/' . $variantFilename;

            if (createResizedImage($destination, $variantPath, $maxWidth, $ext)) {
                $variants[$variantName] = [
                    'url' => UPLOAD_URL . '/' . $variantFilename,
                    'filename' => $variantFilename
                ];
            }
        }
    }

    jsonResponse([
        'success' => true,
        'url' => UPLOAD_URL . '/' . $filename,
        'filename' => $filename,
        'size' => $file['size'],
        'type' => $file['type'],
        'variants' => $variants
    ]);
}

/**
 * Redimensionne une image avec GD.
 * Ne redimensionne pas si l'image est plus petite que $maxWidth.
 */
function createResizedImage(string $source, string $dest, int $maxWidth, string $ext): bool {
    $info = @getimagesize($source);
    if (!$info) return false;

    [$origW, $origH] = $info;

    // Ne pas agrandir les petites images
    if ($origW <= $maxWidth) {
        return copy($source, $dest);
    }

    $ratio = $maxWidth / $origW;
    $newW = $maxWidth;
    $newH = (int) round($origH * $ratio);

    // Créer l'image source
    $srcImage = match ($ext) {
        'jpg', 'jpeg' => @imagecreatefromjpeg($source),
        'png' => @imagecreatefrompng($source),
        'webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($source) : false,
        'gif' => @imagecreatefromgif($source),
        default => false
    };

    if (!$srcImage) return false;

    $dstImage = imagecreatetruecolor($newW, $newH);

    // Préserver la transparence pour PNG et GIF
    if (in_array($ext, ['png', 'gif'])) {
        imagealphablending($dstImage, false);
        imagesavealpha($dstImage, true);
        $transparent = imagecolorallocatealpha($dstImage, 0, 0, 0, 127);
        imagefill($dstImage, 0, 0, $transparent);
    }

    imagecopyresampled($dstImage, $srcImage, 0, 0, 0, 0, $newW, $newH, $origW, $origH);

    $success = match ($ext) {
        'jpg', 'jpeg' => imagejpeg($dstImage, $dest, 85),
        'png' => imagepng($dstImage, $dest, 8),
        'webp' => function_exists('imagewebp') ? imagewebp($dstImage, $dest, 85) : false,
        'gif' => imagegif($dstImage, $dest),
        default => false
    };

    imagedestroy($srcImage);
    imagedestroy($dstImage);

    return $success;
}

function handleList(): void {
    if (!is_dir(UPLOAD_DIR)) {
        jsonResponse([]);
        return;
    }

    $files = [];
    foreach (scandir(UPLOAD_DIR) as $file) {
        if ($file === '.' || $file === '..') continue;

        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (!in_array($ext, ALLOWED_EXTENSIONS)) continue;

        // Exclure les variantes de la liste principale
        if (preg_match('/-(thumb|medium|large)\.[a-z]+$/', $file)) continue;

        $path = UPLOAD_DIR . '/' . $file;
        $baseName = pathinfo($file, PATHINFO_FILENAME);

        // Chercher les variantes associées
        $variants = [];
        foreach (array_keys(IMAGE_VARIANTS) as $variantName) {
            $pattern = UPLOAD_DIR . "/*-{$variantName}.{$ext}";
            // Chercher par le début du nom
            $prefix = preg_replace('/-[a-f0-9]{6}$/', '', $baseName);
            foreach (glob(UPLOAD_DIR . "/{$prefix}*-{$variantName}.{$ext}") as $variantFile) {
                $variantFilename = basename($variantFile);
                $variants[$variantName] = UPLOAD_URL . '/' . $variantFilename;
                break;
            }
        }

        $files[] = [
            'filename' => $file,
            'url' => UPLOAD_URL . '/' . $file,
            'size' => filesize($path),
            'modified' => date('c', filemtime($path)),
            'variants' => $variants
        ];
    }

    usort($files, fn($a, $b) => strcmp($b['modified'], $a['modified']));
    jsonResponse($files);
}

function handleDeleteFile(): void {
    $filename = $_GET['file'] ?? '';
    if (empty($filename)) {
        jsonError('Nom de fichier requis', 400);
    }

    $filename = basename($filename);
    $path = UPLOAD_DIR . '/' . $filename;

    if (!file_exists($path)) {
        jsonError('Fichier introuvable', 404);
    }

    unlink($path);

    // Supprimer aussi les variantes
    $ext = pathinfo($filename, PATHINFO_EXTENSION);
    $baseName = pathinfo($filename, PATHINFO_FILENAME);
    $prefix = preg_replace('/-[a-f0-9]{6}$/', '', $baseName);

    foreach (array_keys(IMAGE_VARIANTS) as $variantName) {
        foreach (glob(UPLOAD_DIR . "/{$prefix}*-{$variantName}.{$ext}") as $variantFile) {
            @unlink($variantFile);
        }
    }

    jsonResponse(['success' => true, 'message' => 'Fichier et variantes supprimés']);
}
