const Skeleton = ({ className = '', ...props }) => (
    <div className={`animate-pulse rounded-md bg-muted ${className}`} {...props} />
);

const GuidesAssignmentSkeleton = () => {
    return (
        <div className='space-y-8 pt-4'>
            {/* Assigned Guides Section Skeleton */}
            <div className='rounded-md border shadow-sm'>
                <div className='p-4 border-b bg-muted/50'>
                    <div className='flex items-center gap-2'>
                        <Skeleton className='h-6 w-24' />
                        <Skeleton className='h-4 w-32' />
                    </div>
                    <Skeleton className='h-4 w-80 mt-1' />
                </div>
                <div className='p-4'>
                    <div className='space-y-4'>
                        {/* Skeleton for 2 assigned guides */}
                        {[1, 2].map(index => (
                            <div key={index} className='flex gap-4 items-center p-4 border rounded-md'>
                                {/* Avatar skeleton */}
                                <Skeleton className='h-10 w-10 rounded-full' />

                                {/* Guide info skeleton */}
                                <div className='flex-grow'>
                                    <Skeleton className='h-5 w-32 mb-2' />
                                    <div className='flex gap-2'>
                                        <Skeleton className='h-5 w-20' />
                                        <Skeleton className='h-5 w-16' />
                                    </div>
                                </div>

                                {/* Notes input skeleton */}
                                <div className='flex items-center gap-2 flex-grow'>
                                    <Skeleton className='h-9 flex-grow' />
                                    <Skeleton className='h-9 w-28' />
                                </div>

                                {/* Remove button skeleton */}
                                <Skeleton className='h-9 w-9' />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Available Guides Section Skeleton */}
            <div className='rounded-md border shadow-sm'>
                <div className='p-4 border-b bg-muted/50'>
                    <Skeleton className='h-6 w-48 mb-1' />
                    <Skeleton className='h-4 w-64' />
                </div>

                {/* Search and filter skeleton */}
                <div className='p-4 border-b flex gap-4 flex-wrap'>
                    <div className='relative flex-grow max-w-sm'>
                        <Skeleton className='h-9 w-full' />
                    </div>
                    <Skeleton className='h-9 w-44' />
                </div>

                {/* Table skeleton */}
                <div className='overflow-x-auto'>
                    <div className='w-full'>
                        {/* Table header skeleton */}
                        <div className='border-b'>
                            <div className='flex'>
                                <div className='w-[250px] p-4'>
                                    <Skeleton className='h-4 w-12' />
                                </div>
                                <div className='flex-1 p-4'>
                                    <Skeleton className='h-4 w-12' />
                                </div>
                                <div className='flex-1 p-4'>
                                    <Skeleton className='h-4 w-20' />
                                </div>
                                <div className='flex-1 p-4'>
                                    <Skeleton className='h-4 w-18' />
                                </div>
                                <div className='flex-1 p-4'>
                                    <Skeleton className='h-4 w-12' />
                                </div>
                                <div className='w-24 p-4 text-right'>
                                    <Skeleton className='h-4 w-12 ml-auto' />
                                </div>
                            </div>
                        </div>

                        {/* Table rows skeleton */}
                        {[1, 2, 3, 4, 5].map(index => (
                            <div key={index} className='border-b'>
                                <div className='flex'>
                                    {/* Guide column */}
                                    <div className='w-[250px] p-4'>
                                        <div className='flex items-center gap-3'>
                                            <Skeleton className='h-10 w-10 rounded-full' />
                                            <div>
                                                <Skeleton className='h-4 w-24 mb-1' />
                                                <Skeleton className='h-3 w-20' />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email column */}
                                    <div className='flex-1 p-4 flex items-center'>
                                        <Skeleton className='h-4 w-36' />
                                    </div>

                                    {/* Specialties column */}
                                    <div className='flex-1 p-4'>
                                        <div className='flex flex-wrap gap-1'>
                                            <Skeleton className='h-5 w-16' />
                                            <Skeleton className='h-5 w-20' />
                                        </div>
                                    </div>

                                    {/* Languages column */}
                                    <div className='flex-1 p-4'>
                                        <div className='flex flex-wrap gap-1'>
                                            <Skeleton className='h-5 w-14' />
                                            <Skeleton className='h-5 w-12' />
                                        </div>
                                    </div>

                                    {/* Status column */}
                                    <div className='flex-1 p-4 flex items-center'>
                                        <Skeleton className='h-5 w-16' />
                                    </div>

                                    {/* Actions column */}
                                    <div className='w-24 p-4 flex justify-end items-center'>
                                        <Skeleton className='h-8 w-8' />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuidesAssignmentSkeleton;

