import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail01Icon, Location01Icon, SmartPhone01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const CustomerContactInformation = ({ bookingData }) => {
    return (
        <Card className='shadow-sm border-border'>
            <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base font-medium text-foreground'>
                    <HugeiconsIcon icon={Mail01Icon} size={18} />
                    Contact Information
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='flex items-center gap-3'>
                        <HugeiconsIcon icon={Mail01Icon} size={16} className='text-muted-foreground' />
                        <div>
                            <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                                Email
                            </p>
                            <p className='text-sm font-medium text-foreground mt-1'>
                                {bookingData.contactInfo.email}
                            </p>
                            {!bookingData.contactInfo.emailVerified && (
                                <Badge
                                    variant='outline'
                                    className='text-xs mt-2 font-medium'>
                                    Not Verified
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <HugeiconsIcon icon={SmartPhone01Icon} size={16} className='text-muted-foreground' />
                        <div>
                            <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                                Mobile
                            </p>
                            <p className='text-sm font-medium text-foreground mt-1 font-mono'>
                                {bookingData.contactInfo.mobile.countryCode}{' '}
                                {bookingData.contactInfo.mobile.number}
                            </p>
                            {!bookingData.contactInfo.mobile.verified && (
                                <Badge
                                    variant='outline'
                                    className='text-xs mt-2 font-medium'>
                                    Not Verified
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
                <div className='flex items-start gap-3'>
                    <HugeiconsIcon icon={Location01Icon} size={16} className='text-muted-foreground mt-1' />
                    <div>
                        <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                            Address
                        </p>
                        <p className='text-sm font-medium text-foreground mt-1 leading-relaxed'>
                            {bookingData.contactInfo.address}
                        </p>
                        <p className='text-sm text-muted-foreground mt-1'>
                            {bookingData.contactInfo.city}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CustomerContactInformation;

