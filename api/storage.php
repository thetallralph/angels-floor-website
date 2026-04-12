<?php
/**
 * Angel's Floor CMS — Storage Abstraction
 *
 * Interface commune pour JSON (maintenant) et MySQL (plus tard).
 * Pour migrer vers MySQL : créer DatabaseStorage qui implémente
 * les mêmes méthodes, puis changer 1 ligne dans config.php.
 */

interface StorageInterface {
    /** Récupérer tous les éléments d'un type */
    public function getAll(string $type, string $status = 'live'): array;

    /** Récupérer un élément par ID */
    public function getOne(string $type, string $id, string $status = 'live'): ?array;

    /** Sauvegarder un élément (crée ou met à jour dans draft) */
    public function save(string $type, string $id, array $data): bool;

    /** Publier : copier draft → live */
    public function publish(string $type, string $id): bool;

    /** Dépublier : supprimer de live (garder le draft) */
    public function unpublish(string $type, string $id): bool;

    /** Supprimer un élément (draft + live) */
    public function delete(string $type, string $id): bool;

    /** Lister les IDs disponibles */
    public function listIds(string $type, string $status = 'live'): array;

    /** Vérifier si un élément a un brouillon non publié */
    public function hasDraft(string $type, string $id): bool;
}


class JsonStorage implements StorageInterface {

    private string $baseDir;

    public function __construct(string $baseDir) {
        $this->baseDir = rtrim($baseDir, '/');
    }

    private function path(string $type, string $id, string $status): string {
        return "{$this->baseDir}/{$status}/{$type}/{$id}.json";
    }

    private function dir(string $type, string $status): string {
        return "{$this->baseDir}/{$status}/{$type}";
    }

    public function getAll(string $type, string $status = 'live'): array {
        $dir = $this->dir($type, $status);
        if (!is_dir($dir)) return [];

        $items = [];
        foreach (glob("{$dir}/*.json") as $file) {
            $data = json_decode(file_get_contents($file), true);
            if ($data !== null) {
                $id = basename($file, '.json');
                $data['_id'] = $id;
                $data['_hasDraft'] = $this->hasDraft($type, $id);
                $items[] = $data;
            }
        }
        return $items;
    }

    public function getOne(string $type, string $id, string $status = 'live'): ?array {
        $file = $this->path($type, $id, $status);
        if (!file_exists($file)) return null;

        $data = json_decode(file_get_contents($file), true);
        if ($data === null) return null;

        $data['_id'] = $id;
        $data['_hasDraft'] = $this->hasDraft($type, $id);
        $data['_isPublished'] = file_exists($this->path($type, $id, 'live'));
        return $data;
    }

    public function save(string $type, string $id, array $data): bool {
        // Toujours sauvegarder dans draft
        $file = $this->path($type, $id, 'draft');
        $dir = dirname($file);

        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        // Retirer les métadonnées internes
        unset($data['_id'], $data['_hasDraft'], $data['_isPublished']);

        // Ajouter timestamp de modification
        $data['_updatedAt'] = date('c');

        return file_put_contents($file, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)) !== false;
    }

    public function publish(string $type, string $id): bool {
        $draftFile = $this->path($type, $id, 'draft');
        $liveFile = $this->path($type, $id, 'live');

        // Si pas de draft, rien à publier
        if (!file_exists($draftFile)) return false;

        $liveDir = dirname($liveFile);
        if (!is_dir($liveDir)) {
            mkdir($liveDir, 0755, true);
        }

        // Lire le draft, ajouter date de publication
        $data = json_decode(file_get_contents($draftFile), true);
        if ($data === null) return false;

        $data['_publishedAt'] = date('c');
        unset($data['_updatedAt']);

        return file_put_contents($liveFile, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)) !== false;
    }

    public function unpublish(string $type, string $id): bool {
        $liveFile = $this->path($type, $id, 'live');
        if (file_exists($liveFile)) {
            return unlink($liveFile);
        }
        return true;
    }

    public function delete(string $type, string $id): bool {
        $deleted = true;
        $draftFile = $this->path($type, $id, 'draft');
        $liveFile = $this->path($type, $id, 'live');

        if (file_exists($draftFile)) {
            $deleted = unlink($draftFile) && $deleted;
        }
        if (file_exists($liveFile)) {
            $deleted = unlink($liveFile) && $deleted;
        }
        return $deleted;
    }

    public function listIds(string $type, string $status = 'live'): array {
        $dir = $this->dir($type, $status);
        if (!is_dir($dir)) return [];

        $ids = [];
        foreach (glob("{$dir}/*.json") as $file) {
            $ids[] = basename($file, '.json');
        }
        return $ids;
    }

    public function hasDraft(string $type, string $id): bool {
        $draftFile = $this->path($type, $id, 'draft');
        $liveFile = $this->path($type, $id, 'live');

        if (!file_exists($draftFile)) return false;
        if (!file_exists($liveFile)) return true; // draft existe mais pas live = brouillon non publié

        // Comparer le contenu
        return file_get_contents($draftFile) !== file_get_contents($liveFile);
    }
}


// --- Future DatabaseStorage ---
// class DatabaseStorage implements StorageInterface {
//     private PDO $db;
//
//     public function __construct(string $host, string $user, string $pass, string $dbname) {
//         $this->db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
//         $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
//     }
//
//     public function getAll(string $type, string $status = 'live'): array {
//         $stmt = $this->db->prepare("SELECT * FROM content WHERE type = ? AND status = ?");
//         $stmt->execute([$type, $status]);
//         return $stmt->fetchAll(PDO::FETCH_ASSOC);
//     }
//
//     // ... implémenter les autres méthodes
// }
