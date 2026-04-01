'use client';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { getCurrencyIcon } from '@/utils/currency-info';
import {
    InformationCircleIcon,
    UserMultiple02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect } from 'react';
import { useTrip } from '../../../../../../../hooks/use-trip';

const GuestSelection = ({ isRequest, userSelectedGuests }) => {
    const { guests, updateGuests, tripData } = useTrip();

    useEffect(() => {
        if (userSelectedGuests) {
            updateGuests(userSelectedGuests);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Extract pricing limits from tripData
    const pricingLimits = tripData?.pricingConfig?.ageCategoryPricing || {};
    const maxAdults = pricingLimits.maxAdults || 20;
    const maxChildren = pricingLimits.maxChildren || 20;
    const maxInfants = pricingLimits.maxInfants || 10;

    // Age ranges from pricing config
    const adultsMinAge = pricingLimits.adultsMinAge || 13;
    const adultsMaxAge = pricingLimits.adultsMaxAge || 100;
    const childrenMinAge = pricingLimits.childrenMinAge || 4;
    const childrenMaxAge = pricingLimits.childrenMaxAge || 12;
    const infantsMinAge = pricingLimits.infantsMinAge || 0;
    const infantsMaxAge = pricingLimits.infantsMaxAge || 2;

    const adultPrice = tripData?.pricingConfig?.ageCategoryPricing?.adultsPrice;
    const childPrice =
        tripData?.pricingConfig?.ageCategoryPricing?.childrensPrice;
    const infantPrice =
        tripData?.pricingConfig?.ageCategoryPricing?.infantsPrice || 0;

    // Handle guest updates with validation based on pricing config
    const handleGuestUpdate = (guestType, increment) => {
        const newGuests = { ...guests };

        if (increment) {
            if (guestType === 'adults') {
                newGuests.adults = Math.min(maxAdults, newGuests.adults + 1);
            } else if (guestType === 'children') {
                newGuests.children = Math.min(
                    maxChildren,
                    newGuests.children + 1
                );
            } else if (guestType === 'infants') {
                newGuests.infants = Math.min(maxInfants, newGuests.infants + 1);
            }
        } else {
            if (guestType === 'adults') {
                newGuests.adults = Math.max(1, newGuests.adults - 1);
            } else if (guestType === 'children') {
                newGuests.children = Math.max(0, newGuests.children - 1);
            } else if (guestType === 'infants') {
                newGuests.infants = Math.max(0, newGuests.infants - 1);
            }
        }

        updateGuests(newGuests);
    };

    return (
        <div>
            <h3 className='text-sm font-semibold mb-2 text-muted-foreground'>
                Guests <span className='text-destructive'>*</span>
            </h3>
            {!isRequest && tripData?.pricingConfig?.affiliateCommission && (
                <div className='text-sm text-foreground p-2 mb-3 bg-muted rounded'>
                    <HugeiconsIcon
                        icon={InformationCircleIcon}
                        size={12}
                        className='inline mr-1'
                    />
                    Now you have to diposit only{' '}
                    {
                        tripData?.pricingConfig?.affiliateCommission
                            ?.commissionValue
                    }{' '}
                    {tripData?.pricingConfig?.affiliateCommission
                        ?.commissionType === 'PERCENTAGE'
                        ? '%'
                        : getCurrencyIcon(
                              tripData?.pricingConfig?.currency
                          )}{' '}
                    for per person
                </div>
            )}

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant='outline'
                        className='w-full justify-start text-left font-normal border-border bg-card text-foreground hover:bg-accent'>
                        <HugeiconsIcon
                            icon={UserMultiple02Icon}
                            size={16}
                            className='mr-2'
                        />
                        {guests.adults + guests.children} Guest
                        {guests.adults + guests.children !== 1 ? 's' : ''}
                        {guests.infants > 0 &&
                            `, ${guests.infants} Infant${
                                guests.infants !== 1 ? 's' : ''
                            }`}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-80 bg-card border-border'>
                    <div className='space-y-4'>
                        {/* Adults */}
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='font-medium text-foreground'>
                                    Adults (
                                    {getCurrencyIcon(
                                        tripData?.pricingConfig?.currency
                                    )}
                                    {`${adultPrice}`}){' '}
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                    Age {adultsMinAge}+
                                </p>
                            </div>
                            <div className='flex items-center space-x-3'>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='border-border bg-card text-foreground hover:bg-accent'
                                    onClick={() =>
                                        handleGuestUpdate('adults', false)
                                    }
                                    disabled={guests.adults <= 1}>
                                    -
                                </Button>
                                <span className='min-w-[2rem] text-center text-foreground'>
                                    {guests.adults}
                                </span>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='border-border bg-card text-foreground hover:bg-accent'
                                    onClick={() =>
                                        handleGuestUpdate('adults', true)
                                    }
                                    disabled={guests.adults >= maxAdults}>
                                    +
                                </Button>
                            </div>
                        </div>

                        {/* Children */}
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='font-medium text-foreground'>
                                    Children (
                                    {getCurrencyIcon(
                                        tripData?.pricingConfig?.currency
                                    )}
                                    {`${childPrice}`}){' '}
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                    Ages {childrenMinAge}-{childrenMaxAge}
                                </p>
                            </div>
                            <div className='flex items-center space-x-3'>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='border-border bg-card text-foreground hover:bg-accent'
                                    onClick={() =>
                                        handleGuestUpdate('children', false)
                                    }
                                    disabled={guests.children <= 0}>
                                    -
                                </Button>
                                <span className='min-w-[2rem] text-center text-foreground'>
                                    {guests.children}
                                </span>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='border-border bg-card text-foreground hover:bg-accent'
                                    onClick={() =>
                                        handleGuestUpdate('children', true)
                                    }
                                    disabled={guests.children >= maxChildren}>
                                    +
                                </Button>
                            </div>
                        </div>

                        {/* Infants */}
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='font-medium text-foreground'>
                                    Infants (
                                    {`${
                                        infantPrice === 0
                                            ? 'Free'
                                            : getCurrencyIcon(
                                                  tripData?.pricingConfig
                                                      ?.currency
                                              )
                                    }`}
                                    ){' '}
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                    Under {infantsMaxAge + 1}
                                </p>
                            </div>
                            <div className='flex items-center space-x-3'>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='border-border bg-card text-foreground hover:bg-accent'
                                    onClick={() =>
                                        handleGuestUpdate('infants', false)
                                    }
                                    disabled={guests.infants <= 0}>
                                    -
                                </Button>
                                <span className='min-w-[2rem] text-center text-foreground'>
                                    {guests.infants}
                                </span>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='border-border bg-card text-foreground hover:bg-accent'
                                    onClick={() =>
                                        handleGuestUpdate('infants', true)
                                    }
                                    disabled={guests.infants >= maxInfants}>
                                    +
                                </Button>
                            </div>
                        </div>

                        {/* Guest Limits Info */}
                        {pricingLimits && (
                            <div className='text-sm text-foreground p-2 bg-muted rounded'>
                                <HugeiconsIcon
                                    icon={InformationCircleIcon}
                                    size={12}
                                    className='inline mr-1'
                                />
                                Max guests: {maxAdults} adults, {maxChildren}{' '}
                                children, {maxInfants} infants
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default GuestSelection;

