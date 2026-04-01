import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';

const TripSummery = () => {
    return (
        <Card className='p-8 bg-background border border-gray-200'>
            <div className='flex items-start gap-6'>
                <div className='w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center'>
                    <span className='text-lg'>🏔️</span>
                </div>
                <div className='flex-1'>
                    <h1 className='text-lg font-normal text-gray-900 mb-3'>
                        Kashmir Paradise Package
                    </h1>
                    <div className='flex items-center gap-6 text-gray-600 mb-4'>
                        <div className='flex items-center gap-2'>
                            <Calendar className='w-4 h-4' />
                            <span className='text-sm font-normal'>
                                Aug 28 - Sep 3, 2025
                            </span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <User className='w-4 h-4' />
                            <span className='text-sm font-normal'>
                                2 Travelers
                            </span>
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <Badge
                            variant='outline'
                            className='text-gray-600 border-gray-300 font-normal'>
                            6 Nights • 7 Days
                        </Badge>
                        <Badge
                            variant='outline'
                            className='text-gray-600 border-gray-300 font-normal'>
                            Srinagar
                        </Badge>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default TripSummery;

