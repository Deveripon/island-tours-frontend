const BlogPostSkeleton = () => {
    return (
        <article className='max-w-6xl pt-24 mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            {/* Category Badge Skeleton */}
            <div className='mb-6'>
                <div className='inline-block h-7 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse'></div>
            </div>

            {/* Title Skeleton */}
            <div className='mb-6 space-y-3'>
                <div className='h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 animate-pulse'></div>
                <div className='h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 animate-pulse'></div>
            </div>

            {/* Meta Information Skeleton */}
            <div className='flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700'>
                {/* Author */}
                <div className='flex items-center'>
                    <div className='w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 animate-pulse'></div>
                    <div className='h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'></div>
                </div>
                {/* Date */}
                <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'></div>
                    <div className='h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'></div>
                </div>
                {/* Read time */}
                <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'></div>
                    <div className='h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'></div>
                </div>
            </div>

            {/* Featured Image Skeleton */}
            <div className='mb-12 relative rounded-2xl aspect-video overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse shadow-2xl'></div>

            {/* Article Content Skeleton */}
            <div className='space-y-6'>
                {/* First paragraph (intro) */}
                <div className='space-y-3'>
                    <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse'></div>
                    <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse'></div>
                    <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse'></div>
                </div>

                {/* Heading */}
                <div className='mt-12 mb-6'>
                    <div className='h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3 animate-pulse'></div>
                </div>

                {/* Paragraph */}
                <div className='space-y-3'>
                    <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse'></div>
                    <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse'></div>
                    <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse'></div>
                </div>

                {/* Paragraph */}
                <div className='space-y-3'>
                    <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse'></div>
                    <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse'></div>
                    <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-4/5 animate-pulse'></div>
                </div>

                {/* Quote box */}
                <div className='bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-300 dark:border-gray-600 p-6 my-8 rounded-r-lg'>
                    <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse'></div>
                    <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse mt-3'></div>
                </div>

                {/* Heading */}
                <div className='mt-12 mb-6'>
                    <div className='h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 animate-pulse'></div>
                </div>

                {/* Paragraph */}
                <div className='space-y-3'>
                    <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse'></div>
                    <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse'></div>
                    <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-11/12 animate-pulse'></div>
                </div>

                {/* Subheading */}
                <div className='mt-8 mb-4'>
                    <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/5 animate-pulse'></div>
                </div>

                {/* Paragraph */}
                <div className='space-y-3'>
                    <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse'></div>
                    <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse'></div>
                    <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-4/5 animate-pulse'></div>
                </div>

                {/* Paragraph */}
                <div className='space-y-3 mb-8'>
                    <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse'></div>
                    <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse'></div>
                    <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse'></div>
                </div>
            </div>

            {/* Comments Section Skeleton */}
            <div className='mt-16 pt-8 border-t border-gray-200 dark:border-gray-700'>
                <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 mb-6 animate-pulse'></div>
                <div className='space-y-4'>
                    <div className='h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse'></div>
                    <div className='h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse'></div>
                </div>
            </div>
        </article>
    );
};

export default BlogPostSkeleton;
