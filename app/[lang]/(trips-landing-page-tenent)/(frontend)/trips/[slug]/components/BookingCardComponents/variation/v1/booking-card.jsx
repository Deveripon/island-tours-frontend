'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { formateToCapitalize } from '@/lib/utils';
import { formatCurrency, getCurrencyIcon } from '@/utils/currency-info';
import { ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useTrip } from '../../../../../../../hooks/use-trip';
import GuestSelection from '../guest/guest-selection';
import { PickupSelectField } from '../pickup/pickup-selection';
import AdditionalSelection from './additional-selection';
import BookingPageContent from './booking-page-content';
import DateSelector from './date-selector';
import NotAdditionalSelection from './not-additional-selection';

export default function BookingCard({ tenantId, paymentMethod }) {
    const {
        tripData,
        selectedDate,
        guests,
        pricing,
        selectedPickup,
        updateSelectedDate,
        updateSelectedPickup,
        updateGuests,
    } = useTrip();
    const [showExtra, setShowExtra] = useState(false);
    const [isNext, setIsNext] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedDateFromUrl = searchParams.get('startDate');
    const userSelectedGuests = {
        adults: parseInt(searchParams.get('adults') || '1', 10),
        children: parseInt(searchParams.get('children') || '0', 10),
        infants: parseInt(searchParams.get('infants') || '0', 10),
    };

    // Current tier info
    const currentTier = pricing?.currentTier;
    const isBookingEnabled = () => {
        return (
            selectedDate &&
            guests.adults + guests.children >=
                (currentTier?.groupSizeMin || 1) &&
            (!currentTier?.groupSizeMax ||
                guests.adults + guests.children <= currentTier.groupSizeMax)
        );
    };

    const goToCheckout = e => {
        e.preventDefault();
        router.push(
            `/site/${tenantId}/trips/${tripData?.slug}/booking?checkout=${tripData?.id}`
        );
    };

    // Safe pricing display
    const displayPrice = formatCurrency(
        pricing?.discountedPrice ||
            pricing?.basePrice ||
            tripData?.startingPrice,
        tripData?.currency
    );
    const displayBasePrice = formatCurrency(
        pricing?.basePrice || tripData?.startingPrice || 0,
        tripData?.currency
    );

    const additionals = tripData?.additionals.filter(
        additional => additional.isExtra
    );

    return (
        <Card className='border-1 shadow-lg h-fit hover:shadow-xl transition-shadow duration-300 dark:bg-gray-900 dark:border-gray-800'>
            <CardHeader>
                <Badge
                    variant='destructive'
                    className='text-sm dark:border-0 w-fit px-4 py-1'>
                    Likely to sell out
                </Badge>
                <h2 className='text-lg font-bold text-gray-600 dark:text-gray-300'>
                    Make your reservation
                </h2>
            </CardHeader>

            {!isNext && (
                <CardContent className='space-y-4'>
                    <div>
                        <h3 className='text-lg font-bold text-gray-600 dark:text-gray-300'>
                            Price
                        </h3>
                        <div className='flex items-center gap-2'>
                            <span className='text-lg font-bold text-blue-600 dark:text-blue-400'>
                                {(pricing?.unitPrice > 0 &&
                                    getCurrencyIcon(
                                        tripData?.pricingConfig?.currency
                                    )) ||
                                    '$'}
                                {pricing?.unitPrice || 0}
                            </span>{' '}
                            <Badge
                                variant='secondary'
                                className='text-sm w-fit'>
                                {formateToCapitalize(
                                    tripData?.pricingConfig?.pricingModel ||
                                        'standard'
                                )}
                            </Badge>
                        </div>
                    </div>
                    {/* Tier Information */}

                    {/* Date Selection */}
                    <DateSelector selectedDateFromUrl={selectedDateFromUrl} />

                    {/* Guest Selection */}
                    <GuestSelection userSelectedGuests={userSelectedGuests} />

                    {/*   <TransferSelection tenantId={tenantId} /> */}
                    <PickupSelectField
                        value={selectedPickup?.id || ''}
                        onValueChange={pickupObject => {
                            updateSelectedPickup(pickupObject);
                        }}
                        pickups={tripData?.pickups}
                        currency={tripData?.pricingConfig?.currency}
                        className='mb-4'
                    />
                    <NotAdditionalSelection />
                    {additionals?.length > 0 && (
                        <div className='flex items-center gap-3'>
                            <Checkbox
                                className='rounded h-4 w-4'
                                id='extras'
                                name='extras'
                                onClick={() => setShowExtra(!showExtra)}
                            />
                            <Label
                                htmlFor='extras'
                                className='dark:text-gray-300'>
                                I need to add extras
                            </Label>
                        </div>
                    )}
                    {/* Extras Selection */}

                    {showExtra && <AdditionalSelection />}

                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                        Total Deposit:{' '}
                        <span className='font-semibold text-primary text-lg dark:text-primary'>
                            {tripData?.pricingConfig?.currency &&
                                getCurrencyIcon(
                                    tripData?.pricingConfig?.currency
                                )}
                            {pricing?.deposit?.toFixed(2) || '0.00'}
                        </span>
                    </h3>
                </CardContent>
            )}

            {isNext && (
                <BookingPageContent
                    paymentMethod={paymentMethod}
                    tenantId={tenantId}
                    setIsNext={setIsNext}
                />
            )}

            <CardFooter className='pt-0'>
                {!isNext && (
                    <Button
                        onClick={() => setIsNext(true)}
                        className='w-full bg-primary/90 hover:bg-primary transition-all duration-200'
                        size='lg'
                        disabled={!selectedDate}>
                        {!selectedDate
                            ? 'Select Date to Continue'
                            : !isBookingEnabled()
                              ? 'Check Guest Requirements'
                              : 'Next'}
                        <ArrowRight className='ml-2 h-4 w-4' />
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
