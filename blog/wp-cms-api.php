<?php
// Cliente simple para la API REST del WordPress "headless" instalado en /cms
// Cambia esta constante si alguna vez mueves el WordPress a otra carpeta/subdominio.
define('WPCMS_API_BASE', 'https://fourseasonsconstructionllc.com/cms/wp-json/wp/v2');

/**
 * Hace un GET a la API REST de WordPress.
 * Devuelve ['data' => array|null, 'total_pages' => int, 'error' => string|null]
 */
function wpcms_fetch($path, $params = []) {
    $url = WPCMS_API_BASE . '/' . ltrim($path, '/');
    if (!empty($params)) {
        $url .= '?' . http_build_query($params);
    }

    $result = ['data' => null, 'total_pages' => 1, 'error' => null];

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 12,
            CURLOPT_HEADER => true,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_USERAGENT => 'FourSeasonsSite/1.0',
        ]);
        $response = curl_exec($ch);
        if ($response === false) {
            $result['error'] = curl_error($ch);
            curl_close($ch);
            return $result;
        }
        $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $headers_raw = substr($response, 0, $header_size);
        $body = substr($response, $header_size);

        if ($status < 200 || $status >= 300) {
            $result['error'] = "HTTP $status";
            return $result;
        }

        if (preg_match('/X-WP-TotalPages:\s*(\d+)/i', $headers_raw, $m)) {
            $result['total_pages'] = (int) $m[1];
        }

        $decoded = json_decode($body, true);
        if ($decoded === null && json_last_error() !== JSON_ERROR_NONE) {
            $result['error'] = 'Respuesta inválida del CMS';
            return $result;
        }
        $result['data'] = $decoded;
        return $result;
    }

    // Fallback sin cURL
    $context = stream_context_create(['http' => ['timeout' => 12, 'ignore_errors' => true]]);
    $body = @file_get_contents($url, false, $context);
    if ($body === false) {
        $result['error'] = 'No se pudo conectar con el CMS';
        return $result;
    }
    if (isset($http_response_header)) {
        foreach ($http_response_header as $h) {
            if (preg_match('/X-WP-TotalPages:\s*(\d+)/i', $h, $m)) {
                $result['total_pages'] = (int) $m[1];
            }
        }
    }
    $decoded = json_decode($body, true);
    $result['data'] = $decoded;
    return $result;
}

/** Resuelve el ID de un término (categoría o etiqueta) a partir de su slug. */
function wpcms_get_term_id($taxonomy, $slug) {
    $endpoint = $taxonomy === 'post_tag' ? 'tags' : 'categories';
    $res = wpcms_fetch($endpoint, ['slug' => $slug]);
    if (!empty($res['data']) && isset($res['data'][0]['id'])) {
        return (int) $res['data'][0]['id'];
    }
    return null;
}

/** Separa los términos embebidos de un post en categorías y etiquetas. */
function wpcms_split_terms($post) {
    $categories = [];
    $tags = [];
    if (!empty($post['_embedded']['wp:term'])) {
        foreach ($post['_embedded']['wp:term'] as $group) {
            foreach ($group as $term) {
                if (($term['taxonomy'] ?? '') === 'category') {
                    $categories[] = $term;
                } elseif (($term['taxonomy'] ?? '') === 'post_tag') {
                    $tags[] = $term;
                }
            }
        }
    }
    return [$categories, $tags];
}

function wpcms_featured_image($post) {
    if (!empty($post['_embedded']['wp:featuredmedia'][0]['source_url'])) {
        return $post['_embedded']['wp:featuredmedia'][0]['source_url'];
    }
    return null;
}

function wpcms_author_name($post) {
    if (!empty($post['_embedded']['author'][0]['name'])) {
        return $post['_embedded']['author'][0]['name'];
    }
    return 'Four Seasons Construction, LLC';
}

function wpcms_format_date($iso_date) {
    $ts = strtotime($iso_date);
    return $ts ? date('F j, Y', $ts) : '';
}
