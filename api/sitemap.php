<?php
/**
 * Angel's Floor CMS — Dynamic Sitemap Generator
 *
 * GET /api/sitemap.php ��� XML sitemap
 *
 * Reads live content and generates a sitemap.xml dynamically.
 */

require_once __DIR__ . '/storage.php';

$storage = new JsonStorage(__DIR__ . '/data');

$baseUrl = 'https://angelsfloor.com';

header('Content-Type: application/xml; charset=utf-8');

$urls = [];

// Pages statiques
$staticPages = [
    ['loc' => '/', 'priority' => '1.0', 'changefreq' => 'weekly'],
    ['loc' => '/produits', 'priority' => '0.9', 'changefreq' => 'weekly'],
    ['loc' => '/a-propos', 'priority' => '0.7', 'changefreq' => 'monthly'],
    ['loc' => '/impact', 'priority' => '0.7', 'changefreq' => 'monthly'],
    ['loc' => '/contact', 'priority' => '0.6', 'changefreq' => 'monthly'],
    ['loc' => '/points-de-vente', 'priority' => '0.6', 'changefreq' => 'monthly'],
    ['loc' => '/grossistes', 'priority' => '0.6', 'changefreq' => 'monthly'],
    ['loc' => '/cgv', 'priority' => '0.3', 'changefreq' => 'yearly'],
    ['loc' => '/mentions-legales', 'priority' => '0.3', 'changefreq' => 'yearly'],
];

foreach ($staticPages as $page) {
    $urls[] = $page;
}

// Produits dynamiques
$products = $storage->getAll('products', 'live');
foreach ($products as $product) {
    $slug = $product['slug'] ?? $product['_id'] ?? '';
    if ($slug) {
        $urls[] = [
            'loc' => "/produits/{$slug}",
            'priority' => '0.8',
            'changefreq' => 'weekly',
            'lastmod' => $product['_publishedAt'] ?? date('c')
        ];
    }
}

// Articles de blog dynamiques
$articles = $storage->getAll('blog', 'live');
foreach ($articles as $article) {
    $slug = $article['_id'] ?? '';
    if ($slug) {
        $urls[] = [
            'loc' => "/blog/{$slug}",
            'priority' => '0.7',
            'changefreq' => 'monthly',
            'lastmod' => $article['_publishedAt'] ?? $article['date'] ?? date('c')
        ];
    }
}

// Générer le XML
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

foreach ($urls as $url) {
    echo "  <url>\n";
    echo "    <loc>{$baseUrl}{$url['loc']}</loc>\n";
    if (isset($url['lastmod'])) {
        $date = substr($url['lastmod'], 0, 10); // YYYY-MM-DD
        echo "    <lastmod>{$date}</lastmod>\n";
    }
    echo "    <changefreq>{$url['changefreq']}</changefreq>\n";
    echo "    <priority>{$url['priority']}</priority>\n";
    echo "  </url>\n";
}

echo '</urlset>';
