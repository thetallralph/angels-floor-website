<?php
/**
 * Angel's Floor CMS — Migration des données existantes
 *
 * Ce script copie les fichiers JSON existants de src/content/
 * vers api/data/live/ pour initialiser le CMS.
 *
 * Usage : php migrate.php
 * (à exécuter une seule fois)
 */

$srcDir = __DIR__ . '/../src/content';
$liveDir = __DIR__ . '/data/live';

$mapping = [
    'products' => 'products',
    'blog' => 'blog',
    'pages' => 'pages',
    'sales-points' => 'sales-points',
    'settings' => 'settings',
];

$count = 0;

foreach ($mapping as $src => $dest) {
    $srcPath = "{$srcDir}/{$src}";
    $destPath = "{$liveDir}/{$dest}";

    if (!is_dir($srcPath)) {
        echo "⏭  Dossier source inexistant : {$src}/\n";
        continue;
    }

    if (!is_dir($destPath)) {
        mkdir($destPath, 0755, true);
    }

    foreach (glob("{$srcPath}/*.json") as $file) {
        $filename = basename($file);
        $destFile = "{$destPath}/{$filename}";

        if (file_exists($destFile)) {
            echo "⏭  Existe déjà : {$dest}/{$filename}\n";
            continue;
        }

        $data = json_decode(file_get_contents($file), true);
        if ($data === null) {
            echo "❌ JSON invalide : {$src}/{$filename}\n";
            continue;
        }

        // Ajouter la date de publication
        $data['_publishedAt'] = date('c');

        file_put_contents($destFile, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        echo "✅ Migré : {$src}/{$filename} → {$dest}/{$filename}\n";
        $count++;
    }
}

echo "\n🎉 Migration terminée : {$count} fichier(s) migré(s).\n";
