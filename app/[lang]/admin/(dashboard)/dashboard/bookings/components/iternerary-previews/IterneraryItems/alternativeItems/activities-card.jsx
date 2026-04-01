import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin } from 'lucide-react';
import { GalleryComponent } from './gallery-card';

export default function ActivityCard({ activityData }) {
    return (
        <div className='p-4 relative'>
            <Card className={`overflow-hidden shadow-lg `}>
                <CardContent className='p-0'>
                    <div className='flex flex-col md:flex-row'>
                        {/* Image Section */}
                        <div className='relative w-68 max-sm:w-full'>
                            <GalleryComponent images={activityData?.gallery} />
                        </div>

                        {/* Content Section */}
                        <div className='flex-1 p-6'>
                            <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-4'>
                                <div className='flex-1'>
                                    <h2 className='text-lg font-semibold text-gray-900 mb-3'>
                                        {activityData.name} -{' '}
                                        {activityData.difficulty}
                                    </h2>

                                    <p className='text-sm line-clamp-2 text-ellipsis text-gray-700 mb-4 leading-relaxed '>
                                        {activityData.description}
                                    </p>

                                    <div className='flex items-center gap-4 text-sm text-gray-500'>
                                        <div className='flex items-center gap-1'>
                                            <Clock className='h-4 w-4' />
                                            <span>
                                                Duration {activityData.duration}
                                            </span>
                                        </div>
                                        <span>•</span>
                                        <div className='flex item-center gap-1'>
                                            <MapPin className='h-4 w-4' />
                                            <span>{activityData.location}</span>
                                        </div>
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

