const loading = () => {
    return (
        <div className='space-y-6'>
            {/* Header Skeleton */}
            <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                    <div className='h-8 bg-muted rounded animate-pulse w-56'></div>
                    <div className='h-4 bg-muted rounded animate-pulse w-72'></div>
                </div>
            </div>

            {/* Summary Cards Skeleton */}
            <div className='space-y-4'>
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3'>
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            className='bg-muted/30 rounded-lg p-4 border border-muted shadow-sm'>
                            <div className='flex items-center justify-between mb-2'>
                                <div className='h-4 w-4 bg-muted rounded animate-pulse'></div>
                                <div className='h-8 w-12 bg-muted rounded animate-pulse'></div>
                            </div>
                            <div className='h-3 bg-muted rounded animate-pulse w-16'></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Search Bar Skeleton */}
            <div className='flex items-center justify-between gap-2'>
                <div className='flex-1 max-w-4xl'>
                    <div className='h-10 bg-muted rounded-md animate-pulse'></div>
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className='border-b'>
                <div className='flex items-center justify-between px-6'>
                    <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-2'>
                            <div className='w-4 h-4 bg-muted rounded animate-pulse'></div>
                            <div className='h-4 bg-muted rounded animate-pulse w-20'></div>
                        </div>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className='h-10 bg-muted rounded animate-pulse w-24'></div>
                        ))}
                    </div>
                    <div className='h-8 bg-muted rounded animate-pulse w-28'></div>
                </div>
            </div>

            {/* Inbox List Skeleton */}
            <div className='min-h-[59vh] border border-muted rounded-lg overflow-hidden'>
                {Array.from({ length: 10 }).map((_, index) => (
                    <div
                        key={index}
                        className='border-b last:border-b-0'>
                        <div className='grid grid-cols-12 px-6 py-4 gap-4'>
                            {/* Left section - checkbox + icon + content */}
                            <div className='col-span-9 flex items-center gap-4'>
                                <div className='w-4 h-4 bg-muted rounded animate-pulse'></div>
                                <div className='w-4 h-4 bg-muted rounded animate-pulse'></div>
                                
                                <div className='flex gap-4 flex-1'>
                                    <div className='h-4 bg-muted rounded animate-pulse w-32'></div>
                                    <div className='h-4 bg-muted rounded animate-pulse w-48'></div>
                                    <div className='h-4 bg-muted rounded animate-pulse w-40'></div>
                                    <div className='h-4 bg-muted rounded animate-pulse flex-1 max-w-md'></div>
                                </div>
                            </div>

                            {/* Right section - status + date + actions */}
                            <div className='col-span-3 flex items-center justify-end gap-2'>
                                <div className='h-6 bg-muted rounded-full animate-pulse w-16'></div>
                                <div className='h-4 bg-muted rounded animate-pulse w-24'></div>
                                <div className='flex gap-1'>
                                    <div className='h-8 w-8 bg-muted rounded animate-pulse'></div>
                                    <div className='h-8 w-8 bg-muted rounded animate-pulse'></div>
                                    <div className='h-8 w-8 bg-muted rounded animate-pulse'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Skeleton */}
            <div className='flex justify-end'>
                <div className='flex items-center gap-2'>
                    <div className='h-9 bg-muted rounded-md animate-pulse w-14'></div>
                    <div className='h-9 bg-muted rounded-md animate-pulse w-20'></div>
                    <div className='h-9 bg-muted rounded-md animate-pulse w-32'></div>
                    <div className='h-9 bg-muted rounded-md animate-pulse w-16'></div>
                    <div className='h-9 bg-muted rounded-md animate-pulse w-14'></div>
                </div>
            </div>
        </div>
    );
};

export default loading;