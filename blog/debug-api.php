<?php
require_once __DIR__ . '/wp-cms-api.php';
header('Content-Type: text/plain');

echo "Bootstrap OK: " . var_export(wpcms_bootstrap(), true) . "\n";
echo "dirname(__DIR__): " . dirname(__DIR__) . "\n";
echo "Expected wp-load: " . dirname(__DIR__) . "/cms/wp-load.php\n";
echo "File exists: " . var_export(file_exists(dirname(__DIR__) . '/cms/wp-load.php'), true) . "\n\n";

$res = wpcms_fetch('posts', ['per_page' => 3]);
echo "Error: " . var_export($res['error'], true) . "\n";
echo "Total pages: " . var_export($res['total_pages'], true) . "\n";
echo "Data count: " . (is_array($res['data']) ? count($res['data']) : 'n/a') . "\n";
if (is_array($res['data'])) {
    foreach ($res['data'] as $p) {
        echo " - " . $p['title']['rendered'] . " (" . $p['slug'] . ")\n";
    }
}
