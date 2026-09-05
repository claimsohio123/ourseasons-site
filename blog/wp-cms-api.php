<?php
// Puente directo (sin HTTP) hacia el WordPress "headless" instalado en /cms.
// Evita llamar por HTTPS al propio servidor (falla detrás del CDN de Hostinger)
// cargando WordPress como librería PHP en el mismo proceso.

function wpcms_bootstrap() {
    static $ready = null;
    if ($ready !== null) return $ready;

    if (!defined('WP_USE_THEMES')) define('WP_USE_THEMES', false);

    $candidates = [
        dirname(__DIR__) . '/cms/wp-load.php',
        rtrim($_SERVER['DOCUMENT_ROOT'] ?? '', '/') . '/cms/wp-load.php',
    ];

    foreach ($candidates as $path) {
        if ($path && file_exists($path)) {
            require_once $path;
            $ready = true;
            return true;
        }
    }
    $ready = false;
    return false;
}

/** Convierte un WP_Post en un arreglo con la misma forma que la REST API (para no tocar las plantillas). */
function wpcms_post_to_array($post) {
    $post_id = $post->ID;
    $categories = [];
    foreach (wp_get_post_categories($post_id, ['fields' => 'all']) as $term) {
        $categories[] = ['id' => $term->term_id, 'name' => $term->name, 'slug' => $term->slug, 'taxonomy' => 'category'];
    }
    $tags = [];
    foreach (wp_get_post_tags($post_id, ['fields' => 'all']) as $term) {
        $tags[] = ['id' => $term->term_id, 'name' => $term->name, 'slug' => $term->slug, 'taxonomy' => 'post_tag'];
    }

    $embedded = ['wp:term' => [$categories, $tags]];

    $thumb_url = get_the_post_thumbnail_url($post_id, 'full');
    if ($thumb_url) {
        $embedded['wp:featuredmedia'] = [['source_url' => $thumb_url]];
    }

    $author_name = get_the_author_meta('display_name', $post->post_author);
    $embedded['author'] = [['name' => $author_name ?: 'Four Seasons Construction, LLC']];

    return [
        'id' => $post_id,
        'slug' => $post->post_name,
        'date' => $post->post_date,
        'title' => ['rendered' => get_the_title($post_id)],
        'content' => ['rendered' => apply_filters('the_content', $post->post_content)],
        'excerpt' => ['rendered' => apply_filters('the_excerpt', get_the_excerpt($post_id))],
        '_embedded' => $embedded,
    ];
}

/**
 * Reemplaza las llamadas REST que usaban las plantillas.
 * Soporta path 'posts' (listado o por slug) — devuelve la misma forma que antes.
 */
function wpcms_fetch($path, $params = []) {
    $result = ['data' => null, 'total_pages' => 1, 'error' => null];

    if (!wpcms_bootstrap()) {
        $result['error'] = 'No se pudo cargar WordPress desde /cms';
        return $result;
    }

    if ($path === 'posts') {
        $args = [
            'post_type' => 'post',
            'post_status' => 'publish',
            'posts_per_page' => $params['per_page'] ?? 10,
            'paged' => $params['page'] ?? 1,
        ];
        if (!empty($params['slug'])) {
            $args['name'] = $params['slug'];
            $args['posts_per_page'] = 1;
        }
        if (!empty($params['categories'])) {
            $args['cat'] = (int) $params['categories'];
        }
        if (!empty($params['tags'])) {
            $args['tag_id'] = (int) $params['tags'];
        }

        $query = new WP_Query($args);
        $posts = [];
        foreach ($query->posts as $p) {
            $posts[] = wpcms_post_to_array($p);
        }
        $result['data'] = $posts;
        $result['total_pages'] = max(1, (int) $query->max_num_pages);
        wp_reset_postdata();
        return $result;
    }

    if ($path === 'categories' || $path === 'tags') {
        $taxonomy = $path === 'tags' ? 'post_tag' : 'category';
        if (!empty($params['slug'])) {
            $term = get_term_by('slug', $params['slug'], $taxonomy);
            $result['data'] = $term ? [['id' => $term->term_id, 'name' => $term->name, 'slug' => $term->slug]] : [];
        }
        return $result;
    }

    $result['error'] = "Ruta no soportada: $path";
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
