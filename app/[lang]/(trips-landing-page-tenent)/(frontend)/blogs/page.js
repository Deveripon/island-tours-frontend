import { Suspense } from 'react';
import PageHero from '../../components/page-hero';
import BlogList from './components/blog-list';
import BlogListSkeleton from './components/blog-list-loading-skeleton';
import BlogSearch from './components/blog-search';

export default async function BlogPage({ searchParams }) {
    return (
        <div className='min-h-screen bg-background'>
            {/* Header Section */}
            <PageHero
                flip={false}
                image='/blog.jpg'
                subtitle2='Blog'
                title='Latest blogs and news'
                subtitle='The latest industry news, interviews, technologies, and resources.'
            />

            <div className='container mx-auto space-y-8'>
                <BlogSearch />
                {/* Blog Grid */}
                <Suspense fallback={<BlogListSkeleton />}>
                    <BlogList searchParams={searchParams} />
                </Suspense>
            </div>
        </div>
    );
}

