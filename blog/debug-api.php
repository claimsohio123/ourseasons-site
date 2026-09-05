<?php
require_once __DIR__ . '/wp-cms-api.php';
header('Content-Type: text/plain');

echo "API base: " . WPCMS_API_BASE . "\n\n";

$res = wpcms_fetch('posts', ['per_page' => 1]);
echo "Error: " . var_export($res['error'], true) . "\n";
echo "Total pages: " . var_export($res['total_pages'], true) . "\n";
echo "Data is null: " . var_export($res['data'] === null, true) . "\n";
echo "Data count: " . (is_array($res['data']) ? count($res['data']) : 'n/a') . "\n\n";

echo "curl_init exists: " . var_export(function_exists('curl_init'), true) . "\n";
echo "allow_url_fopen: " . var_export(ini_get('allow_url_fopen'), true) . "\n";
echo "PHP version: " . phpversion() . "\n";
