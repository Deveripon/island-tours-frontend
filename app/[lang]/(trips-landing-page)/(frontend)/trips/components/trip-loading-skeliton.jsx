const SearchResultsSkeleton = () => {
    const SkeletonCard = () => (
        <div className='bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700'>
            {/* Image Skeleton */}
            <div className='relative'>
                <div className='skeleton h-48 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse'></div>
                {/* Heart Icon Placeholder */}
                <div className='absolute top-3 right-3 skeleton w-8 h-8 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse'></div>
                {/* Location Badge */}
                <div className='absolute bottom-3 left-3 skeleton h-6 w-32 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse'></div>
            </div>

            {/* Content */}
            <div className='p-4'>
                {/* Stars */}
                <div className='flex gap-1 mb-2'>
                    <div className='skeleton w-4 h-4 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse'></div>
                    <div className='skeleton w-4 h-4 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse'></div>
                </div>

                {/* Duration */}
                <div className='flex items-center gap-2 mb-3'>
                    <div className='skeleton w-4 h-4 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse'></div>
                    <div className='skeleton h-3 w-28 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse'></div>
                </div>

                {/* Title */}
                <div className='skeleton h-6 w-full rounded mb-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse'></div>

                {/* Tags */}
                <div className='flex flex-wrap gap-2 mb-4'>
                    <div className='skeleton h-6 w-20 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse'></div>
                    <div className='skeleton h-6 w-24 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse'></div>
                    <div className='skeleton h-6 w-16 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse'></div>
                    <div className='skeleton h-6 w-20 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse'></div>
                </div>

                {/* Price and Button */}
                <div className='flex items-center justify-between'>
                    <div>
                        <div className='skeleton h-8 w-16 rounded mb-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse'></div>
                        <div className='skeleton h-3 w-20 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse'></div>
                    </div>
                    <div className='skeleton h-10 w-28 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse'></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className='bg-gray-50 dark:bg-gray-900 p-5 min-h-screen'>
            <div className='mx-auto'>
                {/* Search Results Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        </div>
    );
};

export default SearchResultsSkeleton;

