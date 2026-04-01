const SkeletonLine = ({ className = '' }) => (
    <div
        className={`bg-muted animate-pulse rounded ${className}`}
        aria-hidden='true'
    />
);

const SkeletonInput = () => (
    <div
        className='h-10 bg-muted animate-pulse rounded-md border border-border'
        aria-hidden='true'
    />
);

const SkeletonButton = () => (
    <div
        className='h-10 w-32 bg-primary/10 animate-pulse rounded-md border border-primary/20'
        aria-hidden='true'
    />
);

const SkeletonAvatar = () => (
    <div
        className='w-24 h-24 bg-muted animate-pulse rounded-full border-2 border-border'
        aria-hidden='true'
    />
);

const FieldSkeleton = () => (
    <div className='mb-6 space-y-2'>
        <SkeletonLine className='h-4 w-24' />
        <SkeletonInput />
    </div>
);

export default function ProfileLoadingSkeleton() {
    return (
        <div className='space-y-6'>
            {/* Profile Photo Section */}
            <div className='border border-border rounded-lg p-6 bg-card'>
                <SkeletonLine className='h-6 w-32 mb-6' />
                <div className='flex flex-col lg:flex-row items-start justify-between gap-8'>
                    {/* Left - Avatar & Button */}
                    <div className='flex items-center gap-6'>
                        <SkeletonAvatar />
                        <div className='flex flex-col gap-3'>
                            <SkeletonButton />
                            <SkeletonLine className='h-3 w-32' />
                        </div>
                    </div>

                    {/* Right - Requirements */}
                    <div className='flex-1 max-w-sm'>
                        <div className='flex items-center gap-2 mb-4'>
                            <div className='w-5 h-5 bg-muted animate-pulse rounded' />
                            <SkeletonLine className='h-4 w-40' />
                        </div>
                        <div className='space-y-3 pl-7'>
                            <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-muted animate-pulse rounded-full flex-shrink-0' />
                                <SkeletonLine className='h-3 w-44' />
                            </div>
                            <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-muted animate-pulse rounded-full flex-shrink-0' />
                                <SkeletonLine className='h-3 w-40' />
                            </div>
                            <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-muted animate-pulse rounded-full flex-shrink-0' />
                                <SkeletonLine className='h-3 w-48' />
                            </div>
                            <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-muted animate-pulse rounded-full flex-shrink-0' />
                                <SkeletonLine className='h-3 w-52' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Details Section */}
            <div className='border border-border rounded-lg p-6 bg-card'>
                <SkeletonLine className='h-6 w-32 mb-6' />
                <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-6'>
                    {/* Row 1 */}
                    <FieldSkeleton />
                    <FieldSkeleton />
                    <FieldSkeleton />

                    {/* Row 2 */}
                    <FieldSkeleton />
                    <FieldSkeleton />
                    <FieldSkeleton />

                    {/* Row 3 */}
                    <FieldSkeleton />
                    <FieldSkeleton />
                    <FieldSkeleton />
                </div>
            </div>

            {/* Change Password Section */}
            <div className='border border-border rounded-lg p-6 bg-card'>
                <SkeletonLine className='h-6 w-40 mb-6' />
                <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-6'>
                    {/* Row 1 */}
                    <FieldSkeleton />
                    <FieldSkeleton />
                    <FieldSkeleton />
                </div>
                <div className='mt-8'>
                    <SkeletonButton />
                </div>
            </div>
        </div>
    );
}

