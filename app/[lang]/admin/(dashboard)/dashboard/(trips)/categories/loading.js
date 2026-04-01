const loading = () => {
    return (
        <div className='min-h-screen space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='space-y-2'>
                    <div className='h-8 bg-gray-200 rounded animate-pulse w-48'></div>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-96'></div>
                </div>
                <div className='h-9 bg-gray-200 rounded animate-pulse w-36'></div>
            </div>

            {/* Category Summary Cards */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4'>
                {Array.from({ length: 7 }).map((_, index) => (
                    <div
                        key={index}
                        className='rounded-lg p-4 shadow-sm border bg-card'>
                        <div className='h-4 bg-gray-200 rounded animate-pulse mb-2 w-20'></div>
                        <div className='h-6 bg-gray-200 rounded animate-pulse w-12'></div>
                    </div>
                ))}
            </div>

            {/* Search and Filter Controls */}
            <div className='flex items-center gap-3'>
                <div className='h-9 bg-gray-200 rounded-md animate-pulse w-28'></div>
                <div className='flex-1 min-w-[200px]'>
                    <div className='h-9 bg-gray-200 rounded-md animate-pulse w-full max-w-xl'></div>
                </div>
            </div>

            {/* Table */}
            <div className='rounded-lg border bg-card shadow-sm'>
                {/* Table Header */}
                <div className='border-b'>
                    <div className='grid grid-cols-12 gap-4 px-6 py-4'>
                        <div className='col-span-1'>
                            <div className='h-4 bg-gray-200 rounded animate-pulse w-4'></div>
                        </div>
                        <div className='col-span-1'>
                            <div className='h-4 bg-gray-200 rounded animate-pulse w-8'></div>
                        </div>
                        <div className='col-span-2'>
                            <div className='h-4 bg-gray-200 rounded animate-pulse w-16'></div>
                        </div>
                        <div className='col-span-2'>
                            <div className='h-4 bg-gray-200 rounded animate-pulse w-12'></div>
                        </div>
                        <div className='col-span-3'>
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
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className='border-b last:border-b-0'>
                        <div className='grid grid-cols-12 gap-4 px-6 py-4 items-center'>
                            {/* Checkbox */}
                            <div className='col-span-1'>
                                <div className='h-4 w-4 bg-gray-200 rounded animate-pulse'></div>
                            </div>

                            {/* ID */}
                            <div className='col-span-1'>
                                <div className='h-3 bg-gray-200 rounded animate-pulse w-12'></div>
                            </div>

                            {/* Name */}
                            <div className='col-span-2'>
                                <div className='space-y-2'>
                                    <div className='h-4 bg-gray-200 rounded animate-pulse w-32'></div>
                                    <div className='flex items-center gap-1.5'>
                                        <div className='h-3 w-3 bg-gray-200 rounded animate-pulse'></div>
                                        <div className='h-3 bg-gray-200 rounded animate-pulse w-24'></div>
                                    </div>
                                </div>
                            </div>

                            {/* Slug */}
                            <div className='col-span-2'>
                                <div className='flex items-center gap-1.5'>
                                    <div className='h-3 w-3 bg-gray-200 rounded animate-pulse'></div>
                                    <div className='h-3 bg-gray-200 rounded animate-pulse w-28'></div>
                                </div>
                            </div>

                            {/* Category Types */}
                            <div className='col-span-3'>
                                <div className='flex flex-wrap gap-1.5'>
                                    <div className='h-6 bg-gray-200 rounded-full animate-pulse w-20'></div>
                                    <div className='h-6 bg-gray-200 rounded-full animate-pulse w-24'></div>
                                </div>
                            </div>

                            {/* Created */}
                            <div className='col-span-2'>
                                <div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div>
                            </div>

                            {/* Actions */}
                            <div className='col-span-1'>
                                <div className='h-8 w-8 bg-gray-200 rounded animate-pulse'></div>
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