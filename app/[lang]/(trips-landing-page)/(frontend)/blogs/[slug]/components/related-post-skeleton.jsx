const RelatedPostsSkeleton = () => {
    return (
        <section className='bg-white dark:bg-gray-900 py-16 mt-16'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Title Skeleton */}
                <div className='h-9 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mb-8 animate-pulse'></div>
                {/* Cards Grid */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    {[1, 2, 3].map(item => (
                        <RelatedBlogCardSkeleton key={item} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const RelatedBlogCardSkeleton = () => {
    return (
        <div className='group cursor-pointer'>
            {/* Image Skeleton */}
            <div className='rounded-xl overflow-hidden mb-4 shadow-md bg-gray-200 dark:bg-gray-700 h-48 animate-pulse'></div>
            {/* Category Skeleton */}
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2 animate-pulse'></div>
            {/* Title Skeleton */}
            <div className='space-y-2 mb-3'>
                <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse'></div>
                <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse'></div>
            </div>
            {/* Meta Info Skeleton */}
            <div className='flex items-center gap-4'>
                <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse'></div>
                <div className='h-4 w-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'></div>
                <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse'></div>
            </div>
        </div>
    );
};

export default RelatedPostsSkeleton;
export { RelatedBlogCardSkeleton };