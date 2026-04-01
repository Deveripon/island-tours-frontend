import { Card, CardContent } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import SightseeingCard from './alternativeItems/sightseeing-card';

export const SightseeingItemCard = ({ sightseeing }) => (
    <Card className='bg-background border border-gray-200 hover:shadow-lg transition-all duration-300'>
        <CardContent className='p-0'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b bg-gray-50 gap-3 sm:gap-0'>
                <div className='flex items-center gap-3 min-w-0 flex-1'>
                    <Eye className='w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0' />
                    <div className='min-w-0'>
                        <h4 className='font-semibold text-sm sm:text-base break-words'>
                            SIGHTSEEING • {sightseeing.name} •{' '}
                            {sightseeing.duration}
                        </h4>
                    </div>
                </div>
            </div>

            <SightseeingCard sightseeingData={sightseeing} />
        </CardContent>
    </Card>
);

