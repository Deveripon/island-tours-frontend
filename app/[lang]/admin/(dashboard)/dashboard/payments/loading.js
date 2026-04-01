const loading = () => {
    return (
        <div className='min-h-screen space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='space-y-2'>
                    <div className='h-8 bg-gray-200 rounded animate-pulse w-56'></div>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-72'></div>
                </div>
            </div>

            {/* Summary Section */}
            <div className='space-y-4'>
                {/* Status Cards */}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className='rounded-lg p-4 shadow-sm border bg-card'>
                            <div className='h-4 bg-gray-200 rounded animate-pulse mb-2 w-20'></div>
                            <div className='h-7 bg-gray-200 rounded animate-pulse w-12'></div>
                        </div>
                    ))}
                </div>

                {/* Revenue Cards */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className='rounded-lg p-4 shadow-sm border bg-card'>
                            <div className='h-4 bg-gray-200 rounded animate-pulse mb-2 w-28'></div>
                            <div className='h-7 bg-gray-200 rounded animate-pulse w-32'></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filter Controls */}
            <div className='space-y-4'>
                <div className='flex items-center gap-3 flex-wrap'>
                    <div className='h-9 bg-gray-200 rounded animate-pulse w-28'></div>
                    <div className='h-9 bg-gray-200 rounded animate-pulse w-32'></div>
                    <div className='flex-1 min-w-[200px] max-w-xl'>
                        <div className='h-9 bg-gray-200 rounded-md animate-pulse w-full'></div>
                    </div>
                </div>

                {/* Date Range */}
                <div className='flex items-center gap-2 flex-wrap'>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div>
                    <div className='h-9 bg-gray-200 rounded animate-pulse w-32'></div>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-8'></div>
                    <div className='h-9 bg-gray-200 rounded animate-pulse w-32'></div>
                </div>
            </div>

            {/* Table */}
            <div className='rounded-lg border bg-card shadow-sm'>
                {/* Table Header */}
                <div className='border-b'>
                    <div className='grid grid-cols-12 gap-4 px-6 py-4'>
                        <div className='col-span-2'>
                            <div className='h-4 bg-gray-200 rounded animate-pulse w-24'></div>
                        </div>
                        <div className='col-span-3'>
                            <div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div>
                        </div>
                        <div className='col-span-2'>
                            <div className='h-4 bg-gray-200 rounded animate-pulse w-16'></div>
                        </div>
                        <div className='col-span-2'>
                            <div className='h-4 bg-gray-200 rounded animate-pulse w-28'></div>
                        </div>
                        <div className='col-span-2'>
                            <div className='h-4 bg-gray-200 rounded animate-pulse w-16'></div>
                        </div>
                        <div className='col-span-1'>
                            <div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div>
                        </div>
                    </div>
                </div>

                {/* Table Rows */}
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className='border-b last:border-b-0'>
                        <div className='grid grid-cols-12 gap-4 px-6 py-4 items-center'>
                            {/* Transaction ID */}
                            <div className='col-span-2'>
                                <div className='flex items-center gap-1.5'>
                                    <div className='h-3 w-3 bg-gray-200 rounded animate-pulse'></div>
                                    <div className='h-3 bg-gray-200 rounded animate-pulse w-28'></div>
                                </div>
                            </div>

                            {/* Trip Details */}
                            <div className='col-span-3'>
                                <div className='space-y-2'>
                                    <div className='h-4 bg-gray-200 rounded animate-pulse w-40'></div>
                                    <div className='h-3 bg-gray-200 rounded animate-pulse w-24'></div>
                                </div>
                            </div>

                            {/* Amount */}
                            <div className='col-span-2'>
                                <div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div>
                            </div>

                            {/* Payment Method */}
                            <div className='col-span-2'>
                                <div className='flex items-center gap-1.5'>
                                    <div className='h-3 w-3 bg-gray-200 rounded animate-pulse'></div>
                                    <div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className='col-span-2'>
                                <div className='h-6 bg-gray-200 rounded-full animate-pulse w-20'></div>
                            </div>

                            {/* Date */}
                            <div className='col-span-1'>
                                <div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className='flex items-center justify-between px-2'>
                <div className='h-4 bg-gray-200 rounded animate-pulse w-40'></div>
                <div className='flex items-center space-x-2'>
                    <div className='h-9 bg-gray-200 rounded animate-pulse w-20'></div>
                    <div className='flex items-center gap-1'>
                        <div className='h-9 w-9 bg-gray-200 rounded animate-pulse'></div>
                        <div className='h-9 w-9 bg-gray-200 rounded animate-pulse'></div>
                        <div className='h-9 w-9 bg-gray-200 rounded animate-pulse'></div>
                    </div>
                    <div className='h-9 bg-gray-200 rounded animate-pulse w-16'></div>
                </div>
            </div>
        </div>
    );
};

export default loading;