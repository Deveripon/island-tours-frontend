import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserIcon, UserMultiple02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

function Person({ contactInfo }) {
    return (
        <div className='flex items-start gap-4 p-4 bg-muted/50 rounded-lg border border-border'>
            <div className='w-10 h-10 bg-accent rounded-full flex items-center justify-center'>
                <HugeiconsIcon icon={UserIcon} size={18} className='text-accent-foreground' />
            </div>
            <div className='flex-1'>
                <h4 className='text-sm font-medium text-foreground tracking-tight'>
                    {contactInfo.name}
                </h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-sm text-muted-foreground'>
                    <span className='font-medium'>
                        Email:{' '}
                        <span className='text-foreground'>
                            {' '}
                            {contactInfo.email}
                        </span>
                    </span>
                    <span className='font-medium'>
                        Mobile:{' '}
                        <span className='text-foreground'>
                            {contactInfo.mobile?.cuntryCode}{' '}
                            {contactInfo.mobile?.number}
                        </span>
                    </span>
                    <span className='font-medium'>
                        Address:{' '}
                        <span className='text-foreground font-mono'>
                            {contactInfo.city} {contactInfo.address}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}

const TravellerInformation = ({ bookingData }) => {
    return (
        <Card className='shadow-sm border-border'>
            <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base font-medium text-foreground'>
                    <HugeiconsIcon icon={UserMultiple02Icon} size={18} />
                    Traveller Information
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='space-y-3'>
                    {bookingData.contactInfo && (
                        <Person contactInfo={bookingData.contactInfo} />
                    )}
                </div>

                <div className='space-y-3 flex items-center gap-2 p-4 mt-3 bg-muted/50 rounded-lg border border-border'>
                    <div className='w-10 h-10 bg-accent rounded-full flex items-center justify-center'>
                        <HugeiconsIcon icon={UserIcon} size={18} className='text-accent-foreground' />
                    </div>
                    <span className='text-sm font-medium text-foreground'>
                        Guests: {bookingData.totalGuests?.adults} Adults,
                        {bookingData.totalGuests?.children} Children ,
                        {bookingData.totalGuests?.infants} Infants
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};

export default TravellerInformation;

