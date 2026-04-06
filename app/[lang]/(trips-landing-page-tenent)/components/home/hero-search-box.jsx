'use client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FormDatePicker } from '../ui/date-picker';
import GuestSelecetionPopup from '../ui/guest-selection-popup';
import DestinationSearch from './destination-search';

const HeroSearchBox = ({ preferences, content, destinations, className }) => {
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [guests, setGuests] = useState({
        adults: 1,
        children: 0,
        infants: 0 });
    const searchParams = useSearchParams();
    const router = useRouter();

    const createparamsString = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (destination.trim() !== '') {
            params.set('destination', destination);
        }

        if (guests?.adults) {
            params.set('adults', guests.adults.toString());
        }

        if (guests?.children) {
            params.set('children', guests.children.toString());
        }

        if (guests?.infants) {
            params.set('infants', guests.infants.toString());
        }

        if (startDate && startDate !== null) {
            const dateString =
                startDate instanceof Date
                    ? startDate.toISOString().split('T')[0]
                    : startDate;
            params.set('startDate', dateString);
        }

        return params.toString();
    }, [
        destination,
        guests.adults,
        guests.children,
        guests.infants,
        searchParams,
        startDate,
    ]);

    const handleSearch = () => {
        router.push(`/trips?${createparamsString()}`);
    };


    const handleDateChange = value => {
        setStartDate(value);
    };

    // Check if liquid-glass class is present
    const isLiquidGlass =
        className?.includes('liquid-glass') ||
        className?.includes('liquid-glass-enhanced');

    return (
        <div
            className={cn(
                'max-w-5xl mx-auto rounded-xl p-10',
                !isLiquidGlass && 'shadow-lg',
                className
            )}>
            <Tabs defaultValue='trips' className='w-full'>
                <TabsContent value='trips' className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                        {/* Destination */}
                        <DestinationSearch
                            availableDestinations={destinations}
                            destination={destination}
                            setDestination={setDestination}
                            content={content}
                            iconColor='text-white'
                            className={cn(
                                'shadow',
                                '!border-white/20 !text-white !bg-white/10 backdrop-blur-md placeholder:text-white',
                                isLiquidGlass
                                    ? '!border-white/20 !bg-white/10 backdrop-blur-md !text-white placeholder:text-white/70'
                                    : '!border-input !bg-background dark:!border-input placeholder:text-muted-foreground dark:placeholder:text-muted-foreground'
                            )}
                        />

                        {/* Date Picker */}
                        <FormDatePicker
                            disablePastDates={true}
                            value={startDate}
                            onChange={handleDateChange}
                            dateFormat='short'
                            placeholder={content?.datePlaceholder}
                            className={cn(
                                'col-span-2 !h-10 border',
                                isLiquidGlass
                                    ? '!bg-white/10 backdrop-blur-md !text-white !border-white/20 placeholder:text-white/70 liquid-glass'
                                    : '!bg-background text-foreground dark:text-foreground !border-input dark:!border-input placeholder:text-muted-foreground dark:placeholder:text-muted-foreground'
                            )}
                        />

                        {/* Guests */}
                        <GuestSelecetionPopup
                            content={content || {}}
                            guests={guests}
                            setGuests={setGuests}
                            className={cn(
                                'shadow',
                                isLiquidGlass
                                    ? '!border-white/20 !bg-white/10 backdrop-blur-md !text-white liquid-glass '
                                    : '!border-input !bg-background dark:!border-input'
                            )}
                        />

                        <Button
                            onClick={handleSearch}
                            className='w-full bg-primary shadow text-primary-foreground hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background transition-colors rounded-md md:w-auto md:px-8'
                            size='lg'>
                            {content?.findTrips}
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default HeroSearchBox;
