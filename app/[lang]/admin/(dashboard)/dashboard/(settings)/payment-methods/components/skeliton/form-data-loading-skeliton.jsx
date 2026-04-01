const LoadingSkeleton = () => {
    return (
        <div className='space-y-6 p-6 animate-pulse'>
            {/* Payment Label Field */}
            <div className='space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-24'></div>
                <div className='h-10 bg-gray-200 rounded'></div>
            </div>

            {/* Publishable Key Field */}
            <div className='space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-28'></div>
                <div className='relative'>
                    <div className='h-10 bg-gray-200 rounded'></div>
                    <div className='absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-gray-300 rounded'></div>
                </div>
            </div>

            {/* Secret Key Field */}
            <div className='space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-20'></div>
                <div className='relative'>
                    <div className='h-10 bg-gray-200 rounded'></div>
                    <div className='absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-gray-300 rounded'></div>
                </div>
            </div>

            {/* Webhook Endpoint Field */}
            <div className='space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-40'></div>
                <div className='flex gap-2'>
                    <div className='h-10 bg-gray-200 rounded flex-1'></div>
                    <div className='h-10 bg-gray-200 rounded w-28'></div>
                </div>
            </div>

            {/* Webhook Secret Field */}
            <div className='space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-28'></div>
                <div className='relative'>
                    <div className='h-10 bg-gray-200 rounded'></div>
                    <div className='absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-gray-300 rounded'></div>
                </div>
            </div>

            {/* Help Text */}
            <div className='space-y-2'>
                <div className='h-3 bg-gray-200 rounded w-32'></div>
                <div className='h-3 bg-gray-200 rounded w-48'></div>
            </div>

            {/* Payment Methods */}
            <div className='space-y-4'>
                <div className='h-4 bg-gray-200 rounded w-32'></div>
                <div className='grid grid-cols-2 gap-4'>
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className='flex items-center space-x-3'>
                            <div className='h-4 w-4 bg-gray-200 rounded border'></div>
                            <div className='h-4 bg-gray-200 rounded w-20'></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Alert Box */}
            <div className='border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 rounded-lg p-4'>
                <div className='space-y-2'>
                    <div className='h-3 bg-blue-300 rounded w-full'></div>
                    <div className='h-3 bg-blue-300 rounded w-3/4'></div>
                    <div className='h-3 bg-blue-300 rounded w-1/2'></div>
                </div>
            </div>

            {/* Submit Button */}
            <div className='h-10 bg-gray-200 rounded w-full'></div>
        </div>
    );
};

export default LoadingSkeleton;

