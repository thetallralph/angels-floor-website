<?php
/**
 * Angel's Floor CMS — Content API
 *
 * Routes publiques (pas d'auth) :
 *   GET /api/content.php?type=products                    → tous les produits live
 *   GET /api/content.php?type=products&id=fonio-precuit   → un produit live
 *
 * Routes admin (auth requise) :
 *   GET    /api/content.php?type=products&status=draft              → tous les brouillons
 *   GET    /api/content.php?type=products&id=fonio&status=draft     → un brouillon
 *   POST   /api/content.php?type=products&id=fonio-precuit          → sauvegarder draft
 *   POST   /api/content.php?type=products&id=fonio&action=publish   → publier
 *   POST   /api/content.php?type=products&id=fonio&action=unpublish → dépublier
 *   DELETE /api/content.php?type=products&id=fonio-precuit           → supprimer
 *   GET    /api/content.php?type=products&action=list-all           → draft + live combinés
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/storage.php';

// Initialiser le storage (changer cette ligne pour passer à MySQL)
$storage = new JsonStorage(DATA_DIR);

$type = $_GET['type'] ?? '';
$id = $_GET['id'] ?? '';
$action = $_GET['action'] ?? '';
$status = $_GET['status'] ?? 'live';
$method = $_SERVER['REQUEST_METHOD'];

// Valider le type de contenu
if (empty($type) || !in_array($type, CONTENT_TYPES)) {
    jsonError('Type de contenu invalide. Types valides : ' . implode(', ', CONTENT_TYPES), 400);
}

// --- Routes ---

switch ($method) {
    case 'GET':
        handleGet($storage, $type, $id, $action, $status);
        break;

    case 'POST':
        requireAuth();
        handlePost($storage, $type, $id, $action);
        break;

    case 'DELETE':
        requireAuth();
        handleDelete($storage, $type, $id);
        break;

    default:
        jsonError('Méthode non autorisée', 405);
}

// --- Handlers ---

function handleGet(StorageInterface $storage, string $type, string $id, string $action, string $status): void {
    // Liste combinée draft + live (admin seulement)
    if ($action === 'list-all') {
        requireAuth();
        $items = getAdminList($storage, $type);
        jsonResponse($items);
        return;
    }

    // Un seul élément
    if (!empty($id)) {
        // Accès aux drafts = admin seulement
        if ($status === 'draft') {
            requireAuth();
        }
        $item = $storage->getOne($type, $id, $status);
        if ($item === null) {
            jsonError('Contenu introuvable', 404);
        }
        jsonResponse($item);
        return;
    }

    // Liste complète
    if ($status === 'draft') {
        requireAuth();
    }
    $items = $storage->getAll($type, $status);
    jsonResponse($items);
}

function handlePost(StorageInterface $storage, string $type, string $id, string $action): void {
    if (empty($id)) {
        jsonError('ID requis', 400);
    }

    // Actions spéciales
    if ($action === 'publish') {
        if ($storage->publish($type, $id)) {
            jsonResponse(['success' => true, 'message' => 'Contenu publié']);
        } else {
            jsonError('Aucun brouillon à publier', 404);
        }
        return;
    }

    if ($action === 'unpublish') {
        if ($storage->unpublish($type, $id)) {
            jsonResponse(['success' => true, 'message' => 'Contenu dépublié']);
        } else {
            jsonError('Erreur lors de la dépublication', 500);
        }
        return;
    }

    // Sauvegarder un brouillon
    $data = getJsonInput();
    if (empty($data)) {
        jsonError('Données requises', 400);
    }

    if ($storage->save($type, $id, $data)) {
        jsonResponse(['success' => true, 'message' => 'Brouillon sauvegardé', 'id' => $id], 201);
    } else {
        jsonError('Erreur lors de la sauvegarde', 500);
    }
}

function handleDelete(StorageInterface $storage, string $type, string $id): void {
    if (empty($id)) {
        jsonError('ID requis', 400);
    }

    if ($storage->delete($type, $id)) {
        jsonResponse(['success' => true, 'message' => 'Contenu supprimé']);
    } else {
        jsonError('Erreur lors de la suppression', 500);
    }
}

/**
 * Liste combinée pour l'admin : montre tous les éléments (live + draft)
 * avec leur statut de publication
 */
function getAdminList(StorageInterface $storage, string $type): array {
    $liveIds = $storage->listIds($type, 'live');
    $draftIds = $storage->listIds($type, 'draft');
    $allIds = array_unique(array_merge($liveIds, $draftIds));

    $items = [];
    foreach ($allIds as $id) {
        // Priorité au draft pour l'admin
        $item = $storage->getOne($type, $id, 'draft')
             ?? $storage->getOne($type, $id, 'live');

        if ($item !== null) {
            $item['_status'] = in_array($id, $liveIds) ? 'published' : 'draft';
            if (in_array($id, $draftIds) && in_array($id, $liveIds)) {
                $item['_status'] = $storage->hasDraft($type, $id) ? 'modified' : 'published';
            }
            $items[] = $item;
        }
    }

    return $items;
}
