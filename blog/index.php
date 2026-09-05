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
    <?php foreach ($posts as $post):
        list($categories, $tags) = wpcms_split_terms($post);
        $cat_classes = implode(' ', array_map(fn($c) => 'category-' . $c['slug'], $categories));
        $tag_classes = implode(' ', array_map(fn($t) => 'tag-' . $t['slug'], $tags));
        $slug = $post['slug'];
    ?>
    <article aria-label="<?php echo htmlspecialchars($post['title']['rendered']); ?>" class="post-<?php echo (int)$post['id']; ?> post type-post status-publish format-standard has-post-thumbnail <?php echo htmlspecialchars($cat_classes . ' ' . $tag_classes); ?> entry">
        <header class="entry-header">
            <h2 class="entry-title"><a class="entry-title-link" href="<?php echo htmlspecialchars($slug); ?>/" rel="bookmark"><?php echo $post['title']['rendered']; ?></a></h2>
            <p class="entry-meta"><time class="entry-time"><?php echo wpcms_format_date($post['date']); ?></time> by <span class="entry-author"><span class="entry-author-name"><?php echo htmlspecialchars(wpcms_author_name($post)); ?></span></span></p>
        </header>
        <div class="entry-content">
            <?php echo $post['content']['rendered']; ?>
        </div>
        <footer class="entry-footer">
            <p class="entry-meta">
                <?php if (!empty($categories)): ?>
                <span class="entry-categories">Filed Under:
                    <?php foreach ($categories as $i => $c): ?><?php echo $i ? ', ' : ' '; ?><a href="index.php?cat=<?php echo urlencode($c['slug']); ?>" rel="category tag"><?php echo htmlspecialchars($c['name']); ?></a><?php endforeach; ?>
                </span>
                <?php endif; ?>
                <?php if (!empty($tags)): ?>
                <span class="entry-tags">Tagged With:
                    <?php foreach ($tags as $i => $t): ?><?php echo $i ? ', ' : ' '; ?><a href="index.php?tag=<?php echo urlencode($t['slug']); ?>" rel="tag"><?php echo htmlspecialchars($t['name']); ?></a><?php endforeach; ?>
                </span>
                <?php endif; ?>
            </p>
        </footer>
    </article>
    <?php endforeach; ?>

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
