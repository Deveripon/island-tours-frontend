import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar03Icon, Clock01Icon, Location01Icon, Airplane01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { format } from 'date-fns';

const TripOverview = ({ bookingData }) => {
    return (
        <Card className='shadow-sm border-border'>
            <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base font-medium text-foreground'>
                    <HugeiconsIcon icon={Airplane01Icon} size={18} />
                    Trip Overview
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div>
                    <h3 className='text-base font-medium text-foreground tracking-tight leading-tight'>
                        {bookingData.trip.title}
                    </h3>
                    <div className='flex items-center gap-2 text-muted-foreground mt-2'>
                        <HugeiconsIcon icon={Location01Icon} size={16} />
                        <span className='text-sm font-medium'>
                            {bookingData.trip.destination.name}
                        </span>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pt-2'>
                    <div className='flex items-center gap-3'>
                        <HugeiconsIcon icon={Calendar03Icon} size={16} className='text-muted-foreground' />
                        <div>
                            <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                                Start Date
                            </p>
                            <p className='text-sm font-medium text-foreground mt-1'>
                                {format(bookingData.tripDate, 'dd/MM/yyyy')}
                            </p>
                        </div>
                    </div>
                    {/*                     <div className='flex items-center gap-3'>
                        <CalendarDays className='w-4 h-4 text-slate-500' />
                        <div>
                            <p className='text-sm font-medium text-slate-500 uppercase tracking-wider'>
                                End Date
                            </p>
                            <p className='text-sm font-medium text-slate-900 mt-1'>
                                {format(bookingData.tripEndDate, 'dd/MM/yyyy')}
                            </p>
                        </div>
                    </div> */}
                    <div className='flex items-center gap-3'>
                        <HugeiconsIcon icon={Clock01Icon} size={16} className='text-muted-foreground' />
                        <div>
                            <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                                Duration
                            </p>
                            <p className='text-sm font-medium text-foreground mt-1'>
                                {bookingData.trip.duration}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TripOverview;

