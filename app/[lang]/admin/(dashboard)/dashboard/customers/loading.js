const loading = () => {
    return (
        <div className='space-y-6'>
            {/* Header Skeleton */}
            <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                    <div className='h-8 bg-muted rounded animate-pulse w-48'></div>
                    <div className='h-4 bg-muted rounded animate-pulse w-64'></div>
                </div>
            </div>

            {/* Search Bar Skeleton */}
            <div className='flex items-center gap-3'>
                <div className='flex-1 min-w-[200px]'>
                    <div className='h-9 bg-muted rounded-md animate-pulse'></div>
                </div>
            </div>

            {/* Table Skeleton */}
            <div className='rounded-lg border bg-card shadow-sm'>
                {/* Table Header */}
                <div className='border-b'>
                    <div className='grid grid-cols-[40px_80px_1fr_200px_120px_120px_120px] gap-4 px-6 py-4 items-center'>
                        <div className='w-4 h-4 bg-muted rounded animate-pulse'></div>
                        <div className='h-4 bg-muted rounded animate-pulse w-12'></div>
                        <div className='h-4 bg-muted rounded animate-pulse w-24'></div>
                        <div className='h-4 bg-muted rounded animate-pulse w-20'></div>
                        <div className='h-4 bg-muted rounded animate-pulse w-16'></div>
                        <div className='h-4 bg-muted rounded animate-pulse w-20'></div>
                        <div className='h-4 bg-muted rounded animate-pulse w-16'></div>
                    </div>
                </div>

                {/* Table Rows */}
                {Array.from({ length: 8 }).map((_, index) => (
                    <div
                        key={index}
                        className='border-b last:border-b-0'>
                        <div className='grid grid-cols-[40px_80px_1fr_200px_120px_120px_120px] gap-4 px-6 py-4 items-center'>
                            {/* Checkbox */}
                            <div className='w-4 h-4 bg-muted rounded animate-pulse'></div>

                            {/* ID */}
                            <div className='h-3 bg-muted rounded animate-pulse w-16'></div>

                            {/* Customer (Avatar + Info) */}
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 bg-muted rounded-full animate-pulse'></div>
                                <div className='space-y-1.5 flex-1'>
                                    <div className='h-4 bg-muted rounded animate-pulse w-32'></div>
                                    <div className='h-3 bg-muted rounded animate-pulse w-40'></div>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className='space-y-1.5'>
                                <div className='h-3 bg-muted rounded animate-pulse w-28'></div>
                                <div className='h-3 bg-muted rounded animate-pulse w-32'></div>
                            </div>

                            {/* Status */}
                            <div className='flex justify-center'>
                                <div className='h-5 bg-muted rounded-full animate-pulse w-16'></div>
                            </div>

                            {/* Bookings */}
                            <div className='flex justify-center'>
                                <div className='h-5 bg-muted rounded-full animate-pulse w-20'></div>
                            </div>

                            {/* Joined Date */}
                            <div className='h-3 bg-muted rounded animate-pulse w-20'></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Skeleton */}
            <div className='flex items-center justify-between px-2'>
                <div className='h-4 bg-muted rounded animate-pulse w-40'></div>
                
                <div className='flex items-center space-x-2'>
                    <div className='h-9 bg-muted rounded-md animate-pulse w-20'></div>
                    <div className='flex items-center gap-1'>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className='h-9 w-9 bg-muted rounded-md animate-pulse'></div>
                        ))}
                    </div>
                    <div className='h-9 bg-muted rounded-md animate-pulse w-16'></div>
                </div>
            </div>
        </div>
    );
};

export default loading;