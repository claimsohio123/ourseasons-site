<?php
header('Content-Type: text/plain');
echo "__DIR__: " . __DIR__ . "\n";
echo "dirname(__DIR__): " . dirname(__DIR__) . "\n";
echo "DOCUMENT_ROOT: " . ($_SERVER['DOCUMENT_ROOT'] ?? '(unset)') . "\n\n";

$candidates = [
    dirname(__DIR__) . '/cms/wp-load.php',
    rtrim($_SERVER['DOCUMENT_ROOT'] ?? '', '/') . '/cms/wp-load.php',
];
foreach ($candidates as $c) {
    echo "$c => " . (file_exists($c) ? 'EXISTS' : 'missing') . "\n";
}

echo "\nListing of " . dirname(__DIR__) . ":\n";
$items = @scandir(dirname(__DIR__));
echo $items ? implode("\n", $items) : "(scandir failed)";

echo "\n\nListing of " . rtrim($_SERVER['DOCUMENT_ROOT'] ?? '', '/') . ":\n";
$items2 = @scandir($_SERVER['DOCUMENT_ROOT'] ?? '');
echo $items2 ? implode("\n", $items2) : "(scandir failed)";
