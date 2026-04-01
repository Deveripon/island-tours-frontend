export default function TripsLoadingSkeleton() {
    return (
        <div className='flex-1'>
            <div className='flex justify-between items-center mb-6'>
                <div className='h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'></div>
                <div className='h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'></div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className='bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700'>
                        <div className='h-48 bg-gray-200 dark:bg-gray-700 animate-pulse'></div>
                        <div className='p-4 space-y-3'>
                            <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'></div>
                            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4'></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

