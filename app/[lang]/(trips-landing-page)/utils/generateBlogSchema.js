/**
 * Generate JSON-LD structured data for blog posts
 * @param {Object} post - Blog post data
 * @param {string} slug - Blog post slug
 * @returns {Object} JSON-LD structured data
 */
export function generateBlogSchema(post, slug) {
    if (!post) return null;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';
    const postUrl = `${baseUrl}/blog/${slug}`;
    const seo = post.seo;

    // Calculate reading time
    const readPerMinute = 225;
    const wordCount = post?.content?.length || 0;
    const readingTime = Math.ceil(wordCount / readPerMinute) || 1;

    // Build the schema
    const schema = {
        '@context': 'https://schema.org',
        '@type': seo?.schemaType || 'BlogPosting',
        '@id': postUrl,
        headline: post.title,
        description:
            seo?.ogDescription || seo?.description || post.description || '',
        image: seo?.ogImage?.url || post.mainImage?.url || '',
        datePublished: post.createdAt,
        dateModified: post.updatedAt || post.createdAt,
        author: {
            '@type': 'Person',
            name: post.createdBy?.name || 'Anonymous',
            ...(post.createdBy?.image?.url && {
                image: {
                    '@type': 'ImageObject',
                    url: post.createdBy.image.url,
                } }),
        },
        publisher: {
            '@type': 'Organization',
            name: process.env.NEXT_PUBLIC_SITE_NAME || 'Your Site Name',
            logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/logo.png`, // Replace with your actual logo path
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': postUrl,
        },
        url: postUrl,
        wordCount: wordCount,
        timeRequired: `PT${readingTime}M`,
        ...(post.category &&
            post.category.length > 0 && {
                articleSection: post.category[0] }),
        ...(seo?.focusKeyword && {
            keywords: seo.focusKeyword }),
    };

    // Add image object if available
    if (seo?.ogImage?.url || post.mainImage?.url) {
        const imageUrl = seo?.ogImage?.url || post.mainImage?.url;
        const imageWidth = seo?.ogImage?.image?.width || post.mainImage?.width;
        const imageHeight =
            seo?.ogImage?.image?.height || post.mainImage?.height;

        schema.image = {
            '@type': 'ImageObject',
            url: imageUrl,
            ...(imageWidth && { width: imageWidth }),
            ...(imageHeight && { height: imageHeight }),
        };
    }

    // Add comment count if available
    if (post.comments && post.comments.length > 0) {
        schema.commentCount = post.comments.length;
    }

    return schema;
}

