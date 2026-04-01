import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane } from 'lucide-react';

export const FlightItemCard = ({
    filght,
    destination = '',
    arrival,
    onModify }) => (
    <Card className='bg-background border border-gray-200 hover:shadow-lg transition-all duration-300'>
        <CardContent className='p-0'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b bg-gray-50 gap-3 sm:gap-0'>
                <div className='flex items-center gap-3 min-w-0 flex-1'>
                    <Plane className='w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0' />
                    <div className='min-w-0'>
                        <h4 className='font-semibold text-sm sm:text-base break-words'>
                            FLIGHT • {arrival ? 'Arrival' : 'Departure'}{' '}
                            {destination}
                        </h4>
                    </div>
                </div>
                {filght && (
                    <div className='flex gap-2 justify-end sm:justify-start'>
                        <Button
                            variant='outline'
                            size='sm'
                            className='text-primary border-primary/20 text-sm sm:text-sm px-2 sm:px-3'
                            onClick={() => onModify(hotel, 'hotel')}>
                            CHANGE
                        </Button>
                    </div>
                )}
            </div>

            <div className='p-3 sm:p-4'>
                <h4 className='text-sm sm:text-base font-medium mb-2'>
                    {arrival ? 'Arrival to' : 'Departure from'} {destination}
                </h4>
                <p className='text-red-400 text-sm sm:text-sm'>
                    <strong className='font-medium'>Please Note:</strong>{' '}
                    {arrival
                        ? `You need to reach ${destination} on your own`
                        : `You need to depart from ${destination} on your own`}
                </p>
            </div>
        </CardContent>
    </Card>
);

