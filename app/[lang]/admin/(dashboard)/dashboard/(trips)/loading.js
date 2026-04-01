const loading = () => {
    return (
        <div className='min-h-screen'>
            <div className=''>
                {/* Header */}
                <div className='mb-8'>
                    <div className='h-8 bg-muted rounded animate-pulse w-48 mb-2'></div>
                    <div className='h-4 bg-muted/70 rounded animate-pulse w-64'></div>
                </div>

                {/* Controls */}
                <div className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-4'>
                    <div className='flex gap-4'>
                        {/* Dropdown filters */}
                        <div className='h-10 bg-muted rounded-lg animate-pulse w-32'></div>
                        <div className='h-10 bg-muted rounded-lg animate-pulse w-24'></div>
                        {/* Search bar */}
                        <div className='h-10 bg-muted rounded-lg animate-pulse w-64'></div>
                    </div>
                    {/* Create button */}
                    <div className='h-10 bg-primary/20 rounded-lg animate-pulse w-48'></div>
                </div>

                {/* Table */}
                <div className='bg-card rounded-lg shadow-sm border border-border overflow-hidden'>
                    {/* Table Header */}
                    <div className='bg-muted/50 px-6 py-4 border-b border-border'>
                        <div className='grid grid-cols-12 gap-4 items-center'>
                            <div className='col-span-1'>
                                <div className='w-4 h-4 bg-muted-foreground/20 rounded animate-pulse'></div>
                            </div>
                            <div className='col-span-1'>
                                <div className='h-4 bg-muted-foreground/30 rounded animate-pulse w-20'></div>
                            </div>
                            <div className='col-span-1'>
                                <div className='h-4 bg-muted-foreground/30 rounded animate-pulse w-12'></div>
                            </div>
                            <div className='col-span-3'>
                                <div className='h-4 bg-muted-foreground/30 rounded animate-pulse w-12'></div>
                            </div>
                            <div className='col-span-2'>
                                <div className='h-4 bg-muted-foreground/30 rounded animate-pulse w-20'></div>
                            </div>
                            <div className='col-span-1'>
                                <div className='h-4 bg-muted-foreground/30 rounded animate-pulse w-16'></div>
                            </div>
                            <div className='col-span-1'>
                                <div className='h-4 bg-muted-foreground/30 rounded animate-pulse w-12'></div>
                            </div>
                            <div className='col-span-1'>
                                <div className='h-4 bg-muted-foreground/30 rounded animate-pulse w-14'></div>
                            </div>
                            <div className='col-span-1'>
                                <div className='h-4 bg-muted-foreground/30 rounded animate-pulse w-24'></div>
                            </div>
                        </div>
                    </div>

                    {/* Table Rows */}
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className='px-6 py-4 border-b border-border/50 last:border-b-0'>
                            <div className='grid grid-cols-12 gap-4 items-center'>
                                {/* Checkbox */}
                                <div className='col-span-1'>
                                    <div className='w-4 h-4 bg-muted rounded animate-pulse'></div>
                                </div>

                                {/* Package ID */}
                                <div className='col-span-1'>
                                    <div className='h-4 bg-muted rounded animate-pulse w-16'></div>
                                </div>

                                {/* Image */}
                                <div className='col-span-1'>
                                    <div className='w-16 h-16 bg-muted rounded-lg animate-pulse'></div>
                                </div>

                                {/* Title */}
                                <div className='col-span-3'>
                                    <div className='h-4 bg-muted rounded animate-pulse w-full mb-2'></div>
                                    <div className='h-3 bg-muted/70 rounded animate-pulse w-3/4'></div>
                                </div>

                                {/* Destination */}
                                <div className='col-span-2'>
                                    <div className='h-4 bg-muted rounded animate-pulse w-32'></div>
                                </div>

                                {/* Duration */}
                                <div className='col-span-1'>
                                    <div className='h-4 bg-muted rounded animate-pulse w-20'></div>
                                </div>

                                {/* Price */}
                                <div className='col-span-1'>
                                    <div className='h-4 bg-muted rounded animate-pulse w-16'></div>
                                </div>

                                {/* Status */}
                                <div className='col-span-1'>
                                    <div className='h-6 bg-muted rounded-full animate-pulse w-16'></div>
                                </div>

                                {/* Created Date */}
                                <div className='col-span-1'>
                                    <div className='h-4 bg-muted rounded animate-pulse w-20'></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className='flex justify-between items-center mt-6'>
                    <div className='h-4 bg-muted rounded animate-pulse w-32'></div>
                    <div className='flex gap-2'>
                        <div className='h-8 bg-muted rounded animate-pulse w-16'></div>
                        <div className='h-8 bg-primary/30 rounded animate-pulse w-8'></div>
                        <div className='h-8 bg-muted rounded animate-pulse w-12'></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default loading;

