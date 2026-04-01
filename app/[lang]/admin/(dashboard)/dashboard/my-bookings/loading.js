const loading = () => {
    return (
        <div className=' min-h-screen '>
            <div className=''>
                {/* Stats Cards */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                    {/* Upcoming Card */}
                    <div className='bg-orange-50 p-6 rounded-lg'>
                        <div className='h-4 bg-gray-200 rounded animate-pulse mb-2 w-20'></div>
                        <div className='h-8 bg-gray-200 rounded animate-pulse mb-1 w-12'></div>
                    </div>

                    {/* Completed Card */}
                    <div className='bg-green-50 p-6 rounded-lg'>
                        <div className='h-4 bg-gray-200 rounded animate-pulse mb-2 w-20'></div>
                        <div className='h-8 bg-gray-200 rounded animate-pulse mb-1 w-8'></div>
                    </div>

                    {/* Draft Card */}
                    <div className='bg-gray-50 p-6 rounded-lg'>
                        <div className='h-4 bg-gray-200 rounded animate-pulse mb-2 w-16'></div>
                        <div className='h-8 bg-gray-200 rounded animate-pulse mb-1 w-8'></div>
                    </div>

                    {/* Total Card */}
                    <div className='bg-primary/10 p-6 rounded-lg border-2 border-primary/20'>
                        <div className='h-4 bg-gray-200 rounded animate-pulse mb-2 w-12'></div>
                        <div className='h-8 bg-gray-200 rounded animate-pulse mb-1 w-12'></div>
                    </div>
                </div>

                {/* Revenue Stats */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                    <div className='bg-green-50 p-6 rounded-lg'>
                        <div className='h-6 bg-gray-200 rounded animate-pulse mb-2 w-32'></div>
                        <div className='h-4 bg-gray-200 rounded animate-pulse w-24'></div>
                    </div>
                    <div className='bg-green-50 p-6 rounded-lg'>
                        <div className='h-6 bg-gray-200 rounded animate-pulse mb-2 w-32'></div>
                        <div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div>
                    </div>
                    <div className='bg-orange-50 p-6 rounded-lg'>
                        <div className='h-6 bg-gray-200 rounded animate-pulse mb-2 w-32'></div>
                        <div className='h-4 bg-gray-200 rounded animate-pulse w-24'></div>
                    </div>
                </div>

                {/* Search and Controls */}
                <div className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-4'>
                    <div className='h-10 bg-gray-200 rounded-lg animate-pulse w-64'></div>
                    <div className='flex gap-3'>
                        <div className='h-9 bg-gray-200 rounded animate-pulse w-20'></div>
                        <div className='h-9 bg-gray-200 rounded animate-pulse w-16'></div>
                        <div className='h-9 bg-gray-200 rounded animate-pulse w-16'></div>
                    </div>
                </div>

                {/* Table */}
                <div className='bg-background rounded-lg shadow-sm overflow-hidden'>
                    {/* Table Header */}
                    <div className='bg-gray-50 px-6 py-4 border-b'>
                        <div className='grid grid-cols-12 gap-4'>
                            <div className='col-span-1'>
                                <div className='h-4 bg-gray-200 rounded animate-pulse w-8'></div>
                            </div>
                            <div className='col-span-2'>
                                <div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div>
                            </div>
                            <div className='col-span-1'>
                                <div className='h-4 bg-gray-200 rounded animate-pulse w-12'></div>
                            </div>
                            <div className='col-span-1'>
                                <div className='h-4 bg-gray-200 rounded animate-pulse w-16'></div>
                            </div>
                            <div className='col-span-1'>
                                <div className='h-4 bg-gray-200 rounded animate-pulse w-18'></div>
                            </div>
                            <div className='col-span-1'>
                                <div className='h-4 bg-gray-200 rounded animate-pulse w-14'></div>
                            </div>
                            <div className='col-span-1'>
                                <div className='h-4 bg-gray-200 rounded animate-pulse w-16'></div>
                            </div>
                            <div className='col-span-1'>
                                <div className='h-4 bg-gray-200 rounded animate-pulse w-14'></div>
                            </div>
                            <div className='col-span-1'>
                                <div className='h-4 bg-gray-200 rounded animate-pulse w-16'></div>
                            </div>
                            <div className='col-span-1'>
                                <div className='h-4 bg-gray-200 rounded animate-pulse w-16'></div>
                            </div>
                            <div className='col-span-1'>
                                <div className='h-4 bg-gray-200 rounded animate-pulse w-16'></div>
                            </div>
                        </div>
                    </div>

                    {/* Table Rows */}
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className='px-6 py-4 border-b border-gray-100 last:border-b-0'>
                            <div className='grid grid-cols-12 gap-4 items-center'>
                                {/* Trip Image */}
                                <div className='col-span-1'>
                                    <div className='w-12 h-12 bg-gray-200 rounded-lg animate-pulse'></div>
                                </div>

                                {/* Trip Details */}
                                <div className='col-span-2'>
                                    <div className='h-4 bg-gray-200 rounded animate-pulse mb-2 w-32'></div>
                                    <div className='h-3 bg-gray-200 rounded animate-pulse w-24'></div>
                                </div>

                                {/* From */}
                                <div className='col-span-1'>
                                    <div className='h-4 bg-gray-200 rounded animate-pulse w-16'></div>
                                </div>

                                {/* Duration */}
                                <div className='col-span-1'>
                                    <div className='h-4 bg-gray-200 rounded animate-pulse w-12'></div>
                                </div>

                                {/* Reference */}
                                <div className='col-span-1'>
                                    <div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div>
                                </div>

                                {/* Status */}
                                <div className='col-span-1'>
                                    <div className='h-6 bg-gray-200 rounded-full animate-pulse w-18'></div>
                                </div>

                                {/* Total Price */}
                                <div className='col-span-1'>
                                    <div className='h-4 bg-gray-200 rounded animate-pulse w-14'></div>
                                </div>

                                {/* Received */}
                                <div className='col-span-1'>
                                    <div className='h-4 bg-gray-200 rounded animate-pulse w-12'></div>
                                </div>

                                {/* Pending */}
                                <div className='col-span-1'>
                                    <div className='h-4 bg-gray-200 rounded animate-pulse w-12'></div>
                                </div>

                                {/* Due Date */}
                                <div className='col-span-1'>
                                    <div className='h-4 bg-gray-200 rounded animate-pulse w-16'></div>
                                </div>

                                {/* Actions */}
                                <div className='col-span-1'>
                                    <div className='flex flex-col gap-2'>
                                        <div className='h-3 bg-gray-200 rounded animate-pulse w-16'></div>
                                        <div className='h-3 bg-gray-200 rounded animate-pulse w-14'></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className='flex justify-between items-center mt-6'>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-32'></div>
                    <div className='flex gap-2'>
                        <div className='h-8 bg-gray-200 rounded animate-pulse w-12'></div>
                        <div className='h-8 bg-gray-200 rounded animate-pulse w-16'></div>
                        <div className='h-8 bg-gray-200 rounded animate-pulse w-16'></div>
                        <div className='h-8 bg-gray-200 rounded animate-pulse w-12'></div>
                        <div className='h-8 bg-gray-200 rounded animate-pulse w-12'></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default loading;

