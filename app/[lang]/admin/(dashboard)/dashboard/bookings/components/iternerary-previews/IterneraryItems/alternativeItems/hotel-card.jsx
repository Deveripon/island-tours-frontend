'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formateToCapitalize } from '@/lib/utils';
import { MapPin, Star } from 'lucide-react';
import { GalleryComponent } from './gallery-card';

export default function HotelCard({ hotelData }) {
    const renderStars = rating => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`h-4 w-4 ${
                    index < rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                }`}
            />
        ));
    };

    const getCategoryBadgeColor = category => {
        switch (category) {
            case 'LUXURY':
                return 'bg-purple-100 text-purple-800';
            case 'MID_RANGE':
                return 'bg-primary/20 text-blue-800';
            case 'BUDGET':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className=' p-4 relative'>
            <Card className={`overflow-hidden shadow-lg`}>
                <CardContent className='p-0'>
                    <div className='flex flex-col lg:flex-row'>
                        {/* Image Section */}
                        <div className='relative w-68 max-sm:w-full'>
                            <GalleryComponent images={hotelData?.gallery} />
                            {/* Category Badge */}
                            <div className='absolute top-3 left-3'>
                                <Badge
                                    className={`${getCategoryBadgeColor(
                                        hotelData.category
                                    )} text-sm px-2 py-1`}>
                                    {formateToCapitalize(hotelData.category)}
                                </Badge>
                            </div>
                        </div>

                        {/* Content */}
                        <div className='flex-1 p-6 pb-1'>
                            <div className='flex justify-between items-start mb-3'>
                                <div className='flex-1'>
                                    <div className='flex items-center gap-2 mb-2'>
                                        <h3 className='font-bold text-lg text-gray-900'>
                                            {hotelData.name}
                                        </h3>
                                        <div className='flex items-center'>
                                            {renderStars(hotelData.starRating)}
                                        </div>
                                    </div>

                                    <div className='space-y-1 '>
                                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                                            <MapPin className='h-4 w-4' />
                                            <span>{hotelData.address}</span>
                                        </div>
                                        <Badge
                                            variant='outline'
                                            className='text-sm'>
                                            {formateToCapitalize(
                                                hotelData.quality
                                            )}
                                        </Badge>
                                        <p className='text-sm line-clamp-2 text-ellipsis  text-gray-700'>
                                            {hotelData.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

