import { Card, CardContent } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import ActivityCard from './alternativeItems/activities-card';

export const ActivityItemCard = ({ activity }) => (
    <Card className='bg-background border border-gray-200 hover:shadow-lg transition-all duration-300'>
        <CardContent className='p-0'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b bg-gray-50 gap-3 sm:gap-0'>
                <div className='flex items-center gap-3 min-w-0 flex-1'>
                    <Camera className='w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0' />
                    <div className='min-w-0'>
                        <h4 className='font-semibold text-sm sm:text-base break-words'>
                            ACTIVITY • {activity.name} • {activity.duration}
                        </h4>
                    </div>
                </div>
            </div>

            <ActivityCard activityData={activity} inIternery={true} />
        </CardContent>
    </Card>
);

