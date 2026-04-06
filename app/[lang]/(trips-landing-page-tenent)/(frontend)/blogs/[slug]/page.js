import {
    findBlogBySlug,
    findRelatedBlogs,
} from '@/app/_actions/blogs';
import { getSiteInfo } from '@/app/_actions/settingsActions';
import { Suspense } from 'react';
import BlogPostSkeleton from './components/blog-details-skeleton';
import BlogPostDetails from './components/blog-post-details';
import RelatedPostsSkeleton from './components/related-post-skeleton';
import RelatedPosts from './components/related-posts';

export async function generateMetadata({ params }) {
    const { slug } = await params;

    const [blogData, siteInfoRes] = await Promise.all([
        findBlogBySlug(slug),
        getSiteInfo()
    ]);

    const siteInfo = siteInfoRes?.data;
    const faviconUrl = siteInfo?.favicon?.image?.url;
    const post = blogData?.result?.data;
    const seo = post?.seo;

    const defaultTitle = post?.title || 'Blog Post';
    const defaultDescription = post?.description || 'Read our latest blog post';

    return {
        title: seo?.ogTitle || seo?.title || defaultTitle,
        description: seo?.ogDescription || seo?.description || defaultDescription,
        keywords: seo?.focusKeyword || '',
        robots: {
            index: seo?.robots?.includes('index') ?? true,
            follow: seo?.robots?.includes('follow') ?? true,
        },
        icons: {
            icon: [
                { url: faviconUrl, sizes: '32x32', type: 'image/x-icon' },
                { url: faviconUrl, sizes: '16x16', type: 'image/x-icon' },
            ],
            shortcut: faviconUrl,
            apple: [{ url: faviconUrl, sizes: '180x180', type: 'image/png' }],
        },
        openGraph: {
            type: 'article',
            title: seo?.ogTitle || defaultTitle,
            description: seo?.ogDescription || defaultDescription,
            url: seo?.canonical || `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}`,
            images: seo?.ogImage?.url
                ? [
                    {
                        url: seo.ogImage.url,
                        width: seo.ogImage.width,
                        height: seo.ogImage.height,
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
            authors: [post?.authorName],
        },

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

        alternates: {
            canonical:
                seo?.canonical || `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}`,
        },
        authors: [{ name: post?.authorName }],
        category: post?.category?.name,
    };
}

export default async function BlogDetailsPage({ params }) {
    const { slug } = await params;

    const [blogRes, relatedPostsRes] = await Promise.all([
        findBlogBySlug(slug),
        findRelatedBlogs(slug)
    ]);

    return (
        <div className=''>
            {/* Hero Section */}
            <Suspense fallback={<BlogPostSkeleton />}>
                <BlogPostDetails blog={blogRes?.result?.data} />
            </Suspense>

            {/* Related Posts */}
            <Suspense fallback={<RelatedPostsSkeleton />}>
                <RelatedPosts
                    relatedPosts={relatedPostsRes?.result?.data}
                />
            </Suspense>
        </div>
    );
}
