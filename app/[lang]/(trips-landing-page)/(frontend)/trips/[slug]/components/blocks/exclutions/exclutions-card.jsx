import Image from 'next/image';

export default function ExclusionsCard({ exclusion }) {
    return (
        <div className='border border-red-200 rounded-lg p-4 bg-red-50'>
            <div className='flex items-start space-x-3'>
                {/* <div className='flex-shrink-0 mt-1'>{getCategoryIcon(exclusion.category)}</div> */}
                <div className='flex-grow'>
                    <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-medium text-red-800 bg-red-200 px-2 py-1 rounded-full'>
                            {exclusion?.category}
                        </span>
                    </div>
                    <p className='text-sm text-gray-700 mb-3'>
                        {exclusion?.description}
                    </p>

                    {/* Gallery */}
                    {exclusion?.gallery && exclusion?.gallery.length > 0 && (
                        <div className='flex space-x-2'>
                            {exclusion.gallery.slice(0, 2).map(image => (
                                <div
                                    key={image.id}
                                    className='relative w-12 h-12 rounded overflow-hidden'>
                                    <Image
                                        src={image.thumbnail || image.url}
                                        alt={image.originalName}
                                        fill
                                        className='object-cover'
                                    />
                                </div>
                            ))}
                            {exclusion.gallery.length > 2 && (
                                <div className='w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500'>
                                    +{exclusion.gallery.length - 2}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

