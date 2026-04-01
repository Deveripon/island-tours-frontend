import { Card, CardContent } from '@/components/ui/card';
import { formateToCapitalize } from '@/lib/utils';
import { MapPin, Users } from 'lucide-react';
import { GalleryComponent } from './gallery-card';

export default function TransferCard({ transferData }) {
    return (
        <div className='p-4 relative'>
            <Card className={`overflow-hidden shadow-lg`}>
                <CardContent className='p-0'>
                    <div className='flex flex-col md:flex-row'>
                        {/* Image Section */}
                        <div className='relative w-68 max-sm:w-full'>
                            <GalleryComponent images={transferData?.gallery} />
                        </div>

                        {/* Content */}
                        <div className='flex-1 p-6 pb-1'>
                            <div className='flex justify-between items-start mb-2'>
                                <div>
                                    <h3 className='font-semibold text-gray-900'>
                                        {transferData?.name}{' '}
                                    </h3>
                                    <p className='text-sm text-gray-600'>
                                        Private Transfer/Pro{' '}
                                        {transferData?.type}
                                    </p>
                                </div>
                            </div>
                            <p className='text-sm line-clamp-2 text-ellipsis text-gray-700 mb-4 leading-relaxed'>
                                {transferData?.description}
                            </p>
                            {/* Facilities */}
                            <div className='flex items-center justify-between gap-4 text-sm text-gray-600 mb-3'>
                                <div className='flex flex-wrap gap-2'>
                                    <span className='font-medium'>
                                        Facilities:
                                    </span>
                                    <div className='flex items-center gap-1'>
                                        <Users className='h-4 w-4' />
                                        <span>
                                            {transferData?.totalSeats} seater
                                        </span>
                                    </div>

                                    <div className='flex items-center gap-1'>
                                        <span>
                                            {formateToCapitalize(
                                                transferData?.serviceClass
                                            )}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <span>
                                            {transferData?.vehicleModel}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <MapPin className='w-4 h-4' />
                                        <span>{transferData?.provider}</span>
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

