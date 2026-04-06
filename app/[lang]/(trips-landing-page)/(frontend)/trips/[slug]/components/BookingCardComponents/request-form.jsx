'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTrip } from '../../../../../hooks/use-trip';
import GuestSelection from './variation/guest/guest-selection';
import BookingPageContent from './variation/v1/booking-page-content';
import DateSelector from './variation/v1/date-selector';

export default function RequestForm() {
    const { tripData, selectedDate, guests, pricing } = useTrip();
    const [showExtra, setShowExtra] = useState(false);
    const [isNext, setIsNext] = useState(false);
    const router = useRouter();

    const goToCheckout = e => {
        e.preventDefault();
        router.push(
            `/trips/${tripData?.id}/booking?checkout=${tripData?.id}`
        );
    };

    return (
        <Card className='border-1 shadow-lg hover:shadow-xl overflow-visible transition-shadow duration-300 dark:bg-gray-900 dark:border-gray-800'>
            <CardHeader>
                <Badge
                    variant='destructive'
                    className='text-sm w-fit px-4 py-1'>
                    Likely to sell out
                </Badge>
                <h2 className='text-lg font-bold text-gray-600 dark:text-gray-300'>
                    Request for {tripData?.title}
                </h2>
            </CardHeader>

            {!isNext && (
                <CardContent className='space-y-4'>
                    {/* Date Selection */}
                    <DateSelector isRequest={true} />

                    {/* Guest Selection */}
                    <GuestSelection isRequest={true} />
                </CardContent>
            )}

            {isNext && (
                <BookingPageContent isRequest={true} />
            )}

            <CardFooter className='pt-0'>
                {!isNext && (
                    <Button
                        onClick={() => setIsNext(true)}
                        className='w-full bg-primary/90 hover:bg-primary transition-all duration-200'
                        size='lg'
                        disabled={!selectedDate}>
                        {!selectedDate ? 'Select Date to Continue' : 'Next'}
                        <ArrowRight className='ml-2 h-4 w-4' />
                    </Button>
                )}
                {isNext && (
                    <div className='flex gap-2 justify-between items-center w-full'>
                        <Button
                            onClick={() => setIsNext(false)}
                            variant='outline'
                            className='w-fit transition-all duration-200 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                            size='lg'>
                            <ArrowLeft className='mr-2 h-4 w-4' />
                            Back
                        </Button>
                        <Button
                            onClick={() => setIsNext(false)}
                            className='w-fit bg-primary/90 hover:bg-primary transition-all duration-200'
                            size='lg'>
                            Send Request
                            <ArrowRight className='ml-2 h-4 w-4' />
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}

