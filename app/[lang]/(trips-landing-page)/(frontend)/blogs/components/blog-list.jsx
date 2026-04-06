import { getAllBlogs } from '@/app/_actions/blogs';
import { FaceIdIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import BlogCard from './blog-card';
import SearchClearButton from './clear-search-button';
import LoadMoreButton from './load-more-button';

const BlogList = async ({ searchParams }) => {
    const query = await searchParams;
    const url_search_params = new URLSearchParams(query);
    const searchQuery = `${url_search_params.toString()}&status=PUBLISHED`;
    const res = await getAllBlogs(searchQuery);
    const allPosts = res?.result?.blogs;

    const { blogs, ...aggregation } = res?.result || {};
    const searchTerm = url_search_params.get('search');
    const hasResults = allPosts && allPosts.length > 0;

    return (
        <div className=''>
            {/* Search Results Indicator */}
            {searchTerm && (
                <div className='max-w-7xl mb-8'>
                    <p className='text-sm text-muted-foreground'>
                        {hasResults ? (
                            <>
                                Found{' '}
                                <span className='font-semibold text-foreground'>
                                    {aggregation?.total || 0}
                                </span>{' '}
                                result{aggregation?.total !== 1 ? 's' : ''} for{' '}
                                <span className='font-semibold text-foreground'>
                                    {searchTerm}
                                </span>
                            </>
                        ) : (
                            <>
                                No results found for{' '}
                                <span className='font-semibold text-foreground'>
                                    {searchTerm}
                                </span>
                            </>
                        )}
                    </p>
                </div>
            )}

            {/* Not Found State */}
            {!hasResults ? (
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center'>
                    <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4'>
                        <HugeiconsIcon
                            icon={FaceIdIcon}
                            className='w-8 h-8 text-muted-foreground'
                        />
                    </div>
                    <h3 className='text-lg font-semibold text-foreground mb-2'>
                        {searchTerm ? 'No blogs found' : 'No blogs available'}
                    </h3>
                    <p className='text-muted-foreground mb-6'>
                        {searchTerm
                            ? 'Try adjusting your search terms or clear the search to see all blogs.'
                            : 'Check back later for new content.'}
                    </p>
                    {searchTerm && <SearchClearButton />}
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                    {allPosts.map(post => (
                        <BlogCard
                            key={post.id}
                            post={post}
                        />
                    ))}
                </div>
            )}

            {/* Load More Button */}
            <LoadMoreButton aggregation={aggregation} />
        </div>
    );
};

export default BlogList;

