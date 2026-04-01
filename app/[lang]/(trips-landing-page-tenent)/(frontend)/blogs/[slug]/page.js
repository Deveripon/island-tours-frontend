import {
    getBlogBySlug,
    getRelatedBlogs,
} from '@/app/_actions/blogs';
import { Suspense } from 'react';
import BlogPostSkeleton from './components/blog-details-skeleton';
import BlogPostDetails from './components/blog-post-details';
import RelatedPostsSkeleton from './components/related-post-skeleton';
import RelatedPosts from './components/related-posts';

/* export async function generateMetadata({ params }) {
    const { slug, tenantId } = await params;

    // Fetch blog data (replace with your actual data fetching function)
    const blogData = await getBlogBySlug(slug);
    const { result: siteInfo } = await getTenantsSiteInfo(tenantId);
    const faviconUrl = siteInfo?.data?.favicon?.image?.url;
    const post = blogData?.blog?.data;
    const seo = post?.seo;

    // Fallback values
    const defaultTitle = post?.title || 'Blog Post';
    const defaultDescription = post?.description || 'Read our latest blog post';

    return {
        title: seo?.ogTitle || seo?.title || defaultTitle,
        description: seo?.ogDescription || seo?.description || defaultDescription,

        // Keywords
        keywords: seo?.focusKeyword || '',

        // Robots meta tag
        robots: {
            index: seo?.robots?.includes('index') ?? true,
            follow: seo?.robots?.includes('follow') ?? true,
        },
        // Favicon and app icons
        icons: {
            icon: [
                { url: faviconUrl, sizes: '32x32', type: 'image/x-icon' },
                { url: faviconUrl, sizes: '16x16', type: 'image/x-icon' },
            ],
            shortcut: faviconUrl,
            apple: [{ url: faviconUrl, sizes: '180x180', type: 'image/png' }],
            other: [
                {
                    rel: 'icon',
                    type: 'image/png',
                    sizes: '192x192',
                    url: faviconUrl,
                },
                {
                    rel: 'icon',
                    type: 'image/png',
                    sizes: '512x512',
                    url: faviconUrl,
                },
            ],
        },
        // Open Graph
        openGraph: {
            type: 'article',
            title: seo?.ogTitle || defaultTitle,
            description: seo?.ogDescription || defaultDescription,
            url: seo?.canonical || `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}`,
            images: seo?.ogImage?.url
                ? [
                      {
                          url: seo.ogImage.url,
                          width: seo.ogImage.image?.width,
                          height: seo.ogImage.image?.height,
                          alt: seo.ogImage.altText || defaultTitle,
                      },
                  ]
                : post?.mainImage?.url
                  ? [
                        {
                            url: post.mainImage.url,
                            alt: defaultTitle,
                        },
                    ]
                  : [],
            publishedTime: post?.createdAt,
            modifiedTime: post?.updatedAt || post?.createdAt,
            authors: [post?.createdBy?.name],
        },

        // Twitter Card
        twitter: {
            card: seo?.twitterCard || 'summary_large_image',
            title: seo?.twitterTitle || defaultTitle,
            description: seo?.twitterDescription || defaultDescription,
            images: seo?.ogImage?.url
                ? [seo.ogImage.url]
                : post?.mainImage?.url
                  ? [post.mainImage.url]
                  : [],
        },

        // Canonical URL
        alternates: {
            canonical:
                seo?.canonical || `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}`,
        },

        // Additional metadata
        authors: [{ name: post?.createdBy?.name }],
        category: post?.category?.[0],
    };
} */
export default async function BlogDetailsPage({ params }) {
    const { slug, tenantId } = await params;

    const blog = await getBlogBySlug(slug);

    const relatedPosts = await getRelatedBlogs(slug);

    return (
        <>
            <div className=''>
                {/* Hero Section */}
                <Suspense fallback={<BlogPostSkeleton />}>
                    <BlogPostDetails blog={blog} />
                </Suspense>

                {/* Related Posts */}
                <Suspense fallback={<RelatedPostsSkeleton />}>
                    <RelatedPosts
                        tenantId={tenantId}
                        relatedPosts={relatedPosts}
                    />
                </Suspense>

                {/* Newsletter Section */}
                {/*  <NewsLatter /> */}
            </div>
        </>
    );
}
