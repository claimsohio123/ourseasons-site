<?php
require_once __DIR__ . '/wp-cms-api.php';

$paged = isset($_GET['paged']) ? max(1, (int) $_GET['paged']) : 1;
$per_page = 5;

$params = ['_embed' => '1', 'per_page' => $per_page, 'page' => $paged];

$archive_title = 'Blog';
if (!empty($_GET['cat'])) {
    $cat_id = wpcms_get_term_id('category', $_GET['cat']);
    if ($cat_id) {
        $params['categories'] = $cat_id;
        $archive_title = ucwords(str_replace('-', ' ', $_GET['cat']));
    }
}
if (!empty($_GET['tag'])) {
    $tag_id = wpcms_get_term_id('post_tag', $_GET['tag']);
    if ($tag_id) {
        $params['tags'] = $tag_id;
        $archive_title = ucwords(str_replace('-', ' ', $_GET['tag']));
    }
}

$res = wpcms_fetch('posts', $params);
$posts = $res['data'];
$total_pages = $res['total_pages'];
$error = $res['error'];

$page_title = 'Blog | Exterior Remodeling Tips';
$page_description = "Our blog features knowledge distilled from the decades of experience and knowledge of our experts. Start reading today and make informed decisions.";
$banner_title = 'Blog';
include __DIR__ . '/header.php';
?>
<style>
.blog-cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:30px;margin:30px 0}
.blog-card{display:flex;flex-direction:column;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.08);transition:transform .2s ease,box-shadow .2s ease}
.blog-card:hover{transform:translateY(-4px);box-shadow:0 8px 20px rgba(0,0,0,.12)}
.blog-card-thumb-link{display:block}
.blog-card-thumb{width:100%;padding-top:60%;background-size:cover;background-position:center;background-color:#eee}
.blog-card-thumb-placeholder{background-color:#dd1808;opacity:.15}
.blog-card-body{padding:20px;display:flex;flex-direction:column;flex:1}
.blog-card-title{font-size:1.15rem;line-height:1.35;margin:0 0 8px}
.blog-card-title a{text-decoration:none;color:inherit}
.blog-card-meta{font-size:.85rem;color:#777;margin:0 0 12px}
.blog-card-excerpt{flex:1;color:#444;font-size:.95rem;line-height:1.5;margin:0 0 16px}
.blog-card-excerpt p{margin:0}
.blog-card-readmore{align-self:flex-start;display:inline-block;padding:10px 20px;background:#dd1808;color:#fff!important;border-radius:4px;text-decoration:none;font-weight:600;font-size:.9rem}
.blog-card-readmore:hover{background:#b81306}
</style>
<div class="archive-description posts-page-description"><h1 class="archive-title"><?php echo htmlspecialchars($archive_title); ?></h1></div>

<?php if ($error): ?>
    <div class="archive-description posts-page-description">
        <p>We're having trouble loading the blog right now. Please check back soon, or <a href="../contact/index.html">contact us</a> directly.</p>
    </div>
<?php elseif (empty($posts) || !is_array($posts)): ?>
    <div class="archive-description posts-page-description">
        <p>No posts found.</p>
    </div>
<?php else: ?>
    <div class="blog-cards-grid">
    <?php foreach ($posts as $post):
        list($categories, $tags) = wpcms_split_terms($post);
        $cat_classes = implode(' ', array_map(fn($c) => 'category-' . $c['slug'], $categories));
        $tag_classes = implode(' ', array_map(fn($t) => 'tag-' . $t['slug'], $tags));
        $slug = $post['slug'];
        $post_url = 'post.php?slug=' . urlencode($slug);
        $thumb = wpcms_featured_image($post);
        $excerpt = isset($post['excerpt']['rendered']) ? trim(strip_tags($post['excerpt']['rendered'])) : '';
    ?>
    <article aria-label="<?php echo htmlspecialchars($post['title']['rendered']); ?>" class="blog-card post-<?php echo (int)$post['id']; ?> post type-post status-publish format-standard has-post-thumbnail <?php echo htmlspecialchars($cat_classes . ' ' . $tag_classes); ?> entry">
        <a class="blog-card-thumb-link" href="<?php echo htmlspecialchars($post_url); ?>">
            <?php if ($thumb): ?>
            <div class="blog-card-thumb" style="background-image:url('<?php echo htmlspecialchars($thumb); ?>')"></div>
            <?php else: ?>
            <div class="blog-card-thumb blog-card-thumb-placeholder"></div>
            <?php endif; ?>
        </a>
        <div class="blog-card-body">
            <header class="entry-header">
                <h2 class="entry-title blog-card-title"><a class="entry-title-link" href="<?php echo htmlspecialchars($post_url); ?>" rel="bookmark"><?php echo $post['title']['rendered']; ?></a></h2>
                <p class="entry-meta blog-card-meta"><time class="entry-time"><?php echo wpcms_format_date($post['date']); ?></time> by <span class="entry-author"><span class="entry-author-name"><?php echo htmlspecialchars(wpcms_author_name($post)); ?></span></span></p>
            </header>
            <div class="entry-summary blog-card-excerpt">
                <p><?php echo htmlspecialchars($excerpt); ?></p>
            </div>
            <a class="blog-card-readmore" href="<?php echo htmlspecialchars($post_url); ?>">Read More</a>
        </div>
    </article>
    <?php endforeach; ?>
    </div>

    <?php if ($total_pages > 1): ?>
    <div aria-label="Pagination" class="archive-pagination pagination" role="navigation">
        <ul>
            <?php for ($p = 1; $p <= $total_pages; $p++): ?>
            <li class="<?php echo $p === $paged ? 'active' : ''; ?>">
                <a <?php echo $p === $paged ? 'aria-current="page"' : ''; ?> href="index.php?paged=<?php echo $p; ?><?php echo !empty($_GET['cat']) ? '&cat=' . urlencode($_GET['cat']) : ''; ?><?php echo !empty($_GET['tag']) ? '&tag=' . urlencode($_GET['tag']) : ''; ?>">
                    <span class="screen-reader-text">Page</span> <?php echo $p; ?>
                </a>
            </li>
            <?php endfor; ?>
        </ul>
    </div>
    <?php endif; ?>
<?php endif; ?>

<?php include __DIR__ . '/footer.php'; ?>
