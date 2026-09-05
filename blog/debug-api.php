<?php
header('Content-Type: text/plain');

$doc_root = $_SERVER['DOCUMENT_ROOT'] ?? '(no definido)';
echo "DOCUMENT_ROOT: $doc_root\n";
echo "dirname(__DIR__): " . dirname(__DIR__) . "\n\n";

echo "=== Contenido de public_html (dirname(__DIR__)) ===\n";
$base = dirname(__DIR__);
if (is_dir($base)) {
    foreach (scandir($base) as $item) {
        if ($item === '.' || $item === '..') continue;
        $full = $base . '/' . $item;
        echo (is_dir($full) ? '[DIR]  ' : '[FILE] ') . $item . "\n";
    }
} else {
    echo "No es un directorio accesible.\n";
}

echo "\n=== Buscando wp-load.php un nivel arriba de public_html ===\n";
$parent = dirname($base);
if (is_dir($parent)) {
    foreach (scandir($parent) as $item) {
        if ($item === '.' || $item === '..') continue;
        echo (is_dir($parent . '/' . $item) ? '[DIR]  ' : '[FILE] ') . $item . "\n";
    }
}

echo "\n=== Candidatos de wp-load.php ===\n";
$candidates = [
    $base . '/cms/wp-load.php',
    $base . '/Cms/wp-load.php',
    $base . '/CMS/wp-load.php',
    $parent . '/cms/wp-load.php',
    $parent . '/public_html/cms/wp-load.php',
];
foreach ($candidates as $c) {
    echo (file_exists($c) ? 'EXISTE -> ' : 'no existe -> ') . $c . "\n";
}
