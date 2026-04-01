const BlogCardSkeleton = () => {
    return (
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden'>
            {/* Image Skeleton */}
            <div className='relative overflow-hidden h-56 bg-gray-200 dark:bg-gray-700 animate-pulse' />
            {/* Content */}
            <div className='p-6'>
                {/* Category Badge Skeleton */}
                <div className='inline-block h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 animate-pulse' />
                {/* Title Skeleton */}
                <div className='flex items-start justify-between mb-2'>
                    <div className='flex-1 space-y-2'>
                        <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5' />
                        <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/5' />
                    </div>
                    <div className='w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0 ml-2 animate-pulse' />
                </div>
                {/* Description Skeleton */}
                <div className='space-y-2 mb-6 mt-4'>
                    <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full' />
                    <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5' />
                </div>
                {/* Author Info Skeleton */}
                <div className='flex items-center'>
                    <div className='w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 animate-pulse' />
                    <div className='flex-1 space-y-2'>
                        <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24' />
                        <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20' />
                    </div>
                </div>
            </div>
        </div>
    );
};

const BlogListSkeleton = ({ count = 8 }) => {
    return (
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 pb-16'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                {Array.from({ length: count }).map((_, index) => (
                    <BlogCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
};

export default BlogListSkeleton;
