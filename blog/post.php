<?php
require_once __DIR__ . '/wp-cms-api.php';

$slug = isset($_GET['slug']) ? preg_replace('/[^a-z0-9\-]/', '', strtolower($_GET['slug'])) : '';

if ($slug === '') {
    header('Location: index.php');
    exit;
}

$res = wpcms_fetch('posts', ['slug' => $slug, '_embed' => '1']);
$posts = $res['data'];

if ($res['error'] || empty($posts) || !is_array($posts)) {
    http_response_code(404);
    $page_title = 'Page Not Found';
    $page_description = 'The page you are looking for could not be found.';
    $banner_title = 'Not Found';
    include __DIR__ . '/header.php';
    ?>
    <div class="archive-description posts-page-description">
        <h1 class="archive-title">This Page Does Not Exist</h1>
        <p>Sorry, we couldn't find that article. <a href="index.php">Back to the blog</a> or <a href="../contact/index.html">contact us</a> for help.</p>
    </div>
    <?php
    include __DIR__ . '/footer.php';
    exit;
}

$post = $posts[0];
list($categories, $tags) = wpcms_split_terms($post);
$cat_classes = implode(' ', array_map(fn($c) => 'category-' . $c['slug'], $categories));
$tag_classes = implode(' ', array_map(fn($t) => 'tag-' . $t['slug'], $tags));

$page_title = $post['title']['rendered'];
$meta_desc = isset($post['excerpt']['rendered']) ? trim(strip_tags($post['excerpt']['rendered'])) : '';
$page_description = $meta_desc !== '' ? $meta_desc : $page_title;
$banner_title = $post['title']['rendered'];
include __DIR__ . '/header.php';
?>
<article aria-label="<?php echo htmlspecialchars($post['title']['rendered']); ?>" class="post-<?php echo (int)$post['id']; ?> post type-post status-publish format-standard has-post-thumbnail <?php echo htmlspecialchars($cat_classes . ' ' . $tag_classes); ?> entry">
    <header class="entry-header">
        <h2 class="entry-title"><?php echo $post['title']['rendered']; ?></h2>
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
<?php include __DIR__ . '/footer.php'; ?>
