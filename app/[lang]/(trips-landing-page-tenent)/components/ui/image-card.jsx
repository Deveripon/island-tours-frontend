'use client';

import { Badge } from '@/components/ui/badge';
import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { GalleryComponent } from './gallery-card';

export const ItemCard = ({ data }) => {
    return (
        <div className='border rounded-lg bg-background overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-lg'>
            {/* Image Gallery */}
            <div className='relative overflow-hidden'>
                {data?.images && (
                    <GalleryComponent
                        images={data.images || []}
                        title={data?.title}
                    />
                )}

                {/* Category Badge */}
                {data?.category && (
                    <div className='absolute top-4 left-4 z-10'>
                        <Badge variant='secondary'>{data.category}</Badge>
                    </div>
                )}
            </div>

            {/* Card Content */}
            <div className='py-5 px-6 flex-grow'>
                <h3 className='font-semibold text-sm mb-2 line-clamp-1'>
                    {data.title}
                </h3>
                <p className='text-sm text-gray-600 line-clamp-3'>
                    {data.description}
                </p>
            </div>

            {/* Card Footer */}
            <div className='pt-0 pb-4 px-6'>
                <button className='w-fit  flex gap-2  bg-primary hover:bg-primary/90 transition-colors duration-300 text-white py-2 px-4 rounded-md text-sm'>
                    Learn More
                    <HugeiconsIcon icon={ArrowUpRight01Icon} className='h-4 w-4 mt-[2px]' />
                </button>
            </div>
        </div>
    );
};

const ImageCard = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <div className='border-b pb-8 mb-8'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {data.map(item => (
                    <ItemCard key={item.id} data={item} />
                ))}
            </div>
        </div>
    );
};

export default ImageCard;

