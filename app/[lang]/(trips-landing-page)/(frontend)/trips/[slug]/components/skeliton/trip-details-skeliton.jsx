const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}
            {...props}
        />
    );
};

export default function TripDetailSkeleton() {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            {/* Header */}
            <div className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
                <div className='max-w-7xl mx-auto px-4 py-4'>
                    <div className='flex items-center justify-between'>
                        <Skeleton className='h-8 w-48' />
                        <div className='flex space-x-4'>
                            <Skeleton className='h-8 w-16' />
                            <Skeleton className='h-8 w-16' />
                        </div>
                    </div>
                </div>
            </div>

            <div className='max-w-7xl mx-auto px-4 py-6'>
                {/* Title Section */}
                <div className='mb-6'>
                    <Skeleton className='h-8 w-80 mb-2' />
                    <div className='flex items-center space-x-4'>
                        <Skeleton className='h-4 w-20' />
                        <Skeleton className='h-4 w-24' />
                    </div>
                </div>

                {/* Hero Images */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
                    <Skeleton className='h-64 col-span-2' />
                    <div className='space-y-4'>
                        <Skeleton className='h-32' />
                        <Skeleton className='h-28' />
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Main Content */}
                    <div className='lg:col-span-2 space-y-8'>
                        {/* Quick Info Cards */}
                        <div className='grid grid-cols-3 gap-4'>
                            {[1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className='bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                                    <Skeleton className='h-6 w-16 mb-2' />
                                    <Skeleton className='h-4 w-20 mb-1' />
                                    <Skeleton className='h-3 w-12' />
                                </div>
                            ))}
                        </div>

                        {/* Trip Overview */}
                        <div className='bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <Skeleton className='h-6 w-32 mb-4' />
                            <div className='space-y-3'>
                                <Skeleton className='h-4 w-full' />
                                <Skeleton className='h-4 w-full' />
                                <Skeleton className='h-4 w-3/4' />
                            </div>
                            <Skeleton className='h-48 w-full mt-4 rounded-lg' />
                            <div className='space-y-3 mt-4'>
                                <Skeleton className='h-4 w-full' />
                                <Skeleton className='h-4 w-full' />
                                <Skeleton className='h-4 w-2/3' />
                            </div>
                        </div>

                        {/* Itinerary */}
                        <div className='bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <Skeleton className='h-6 w-24 mb-6' />

                            {/* Day tabs */}
                            <div className='flex space-x-4 mb-6'>
                                {[1, 2, 3, 4].map(i => (
                                    <Skeleton key={i} className='h-8 w-16' />
                                ))}
                            </div>

                            {/* Day content */}
                            <div className='space-y-6'>
                                <div className='border-l-4 border-blue-200 dark:border-blue-800 pl-4'>
                                    <Skeleton className='h-5 w-48 mb-2' />
                                    <Skeleton className='h-4 w-24 mb-4' />
                                </div>

                                {/* Activity cards */}
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div
                                        key={i}
                                        className='flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg'>
                                        <Skeleton className='h-12 w-12 rounded-full flex-shrink-0' />
                                        <div className='flex-1'>
                                            <div className='flex items-center justify-between mb-2'>
                                                <Skeleton className='h-5 w-40' />
                                                <Skeleton className='h-4 w-16' />
                                            </div>
                                            <Skeleton className='h-16 w-24 rounded mb-2' />
                                            <Skeleton className='h-4 w-32' />
                                        </div>
                                        <div className='flex space-x-2'>
                                            <Skeleton className='h-6 w-16' />
                                            <Skeleton className='h-6 w-16' />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* What's Included */}
                        <div className='bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <Skeleton className='h-6 w-32 mb-4' />
                            <Skeleton className='h-16 w-16 rounded-lg mb-4' />
                            <Skeleton className='h-4 w-24' />
                        </div>

                        {/* Map */}
                        <div className='bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <Skeleton className='h-6 w-32 mb-4' />
                            <Skeleton className='h-64 w-full rounded-lg' />
                        </div>

                        {/* Reviews */}
                        <div className='bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <Skeleton className='h-6 w-24 mb-4' />
                            <div className='text-center py-8'>
                                <Skeleton className='h-4 w-32 mx-auto mb-2' />
                                <Skeleton className='h-3 w-24 mx-auto' />
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className='bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <Skeleton className='h-6 w-12 mb-6' />
                            <div className='space-y-4'>
                                {[1, 2, 3, 4].map(i => (
                                    <div
                                        key={i}
                                        className='border-b border-gray-200 dark:border-gray-700 pb-4'>
                                        <Skeleton className='h-4 w-3/4 mb-2' />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className='space-y-6'>
                        {/* Pricing Card */}
                        <div className='bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 sticky top-6'>
                            <div className='flex items-center space-x-2 mb-4'>
                                <Skeleton className='h-8 w-16' />
                                <Skeleton className='h-4 w-20' />
                            </div>

                            <div className='space-y-4 mb-6'>
                                {[1, 2, 3, 4].map(i => (
                                    <div
                                        key={i}
                                        className='flex justify-between'>
                                        <Skeleton className='h-4 w-20' />
                                        <Skeleton className='h-4 w-12' />
                                    </div>
                                ))}
                                <div className='border-t border-gray-200 dark:border-gray-700 pt-4'>
                                    <div className='flex justify-between items-center'>
                                        <Skeleton className='h-5 w-16' />
                                        <Skeleton className='h-6 w-20' />
                                    </div>
                                </div>
                            </div>

                            <Skeleton className='h-12 w-full mb-3' />
                            <Skeleton className='h-10 w-full' />
                        </div>

                        {/* Additional Info */}
                        <div className='bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <div className='space-y-4'>
                                {[1, 2, 3].map(i => (
                                    <div
                                        key={i}
                                        className='flex items-center space-x-3'>
                                        <Skeleton className='h-5 w-5 rounded-full' />
                                        <Skeleton className='h-4 w-32' />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

