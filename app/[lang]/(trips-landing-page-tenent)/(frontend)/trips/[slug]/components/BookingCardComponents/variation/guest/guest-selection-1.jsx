'use client';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { getCurrencyIcon } from '@/utils/currency-info';
import { Info, Users } from 'lucide-react';
import { useEffect } from 'react';
import { useTrip } from '../../../../../../../hooks/use-trip';

const GuestSelection2 = ({ isRequest, userSelectedGuests }) => {
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

    // Handle guest updates
    const handleAdultsChange = value => {
        updateGuests({ ...guests, adults: parseInt(value) });
    };

    const handleChildrenChange = value => {
        updateGuests({ ...guests, children: parseInt(value) });
    };

    const handleInfantsChange = value => {
        updateGuests({ ...guests, infants: parseInt(value) });
    };

    // Generate options arrays
    const adultOptions = Array.from({ length: maxAdults }, (_, i) => i + 1);
    const childrenOptions = Array.from(
        { length: maxChildren + 1 },
        (_, i) => i
    );
    const infantOptions = Array.from({ length: maxInfants + 1 }, (_, i) => i);

    return (
        <div>
            <h3 className='text-sm font-semibold mb-2 text-gray-500 dark:text-gray-400'>
                Guests <span className='text-red-500 dark:text-red-400'>*</span>
            </h3>

            {!isRequest && tripData?.pricingConfig?.affiliateCommission && (
                <div className='text-sm text-gray-700 dark:text-gray-300 p-2 mb-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700'>
                    <Info className='h-3 w-3 inline mr-1' />
                    Now you have to deposit only{' '}
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

            <div className='space-y-4'>
                {/* Adults Select */}
                <div>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5'>
                        Adults (
                        {getCurrencyIcon(tripData?.pricingConfig?.currency)}
                        {adultPrice}) - Age {adultsMinAge}+
                    </label>
                    <Select
                        value={guests.adults.toString()}
                        onValueChange={handleAdultsChange}>
                        <SelectTrigger className='w-full bg-transparent text-gray-900 dark:text-gray-100 dark:border-gray-700'>
                            <SelectValue placeholder='Select adults' />
                        </SelectTrigger>
                        <SelectContent className='w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:border-gray-700'>
                            {adultOptions.map(num => (
                                <SelectItem key={num} value={num.toString()}>
                                    {num} Adult{num !== 1 ? 's' : ''}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Children Select */}
                <div>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5'>
                        Children (
                        {getCurrencyIcon(tripData?.pricingConfig?.currency)}
                        {childPrice}) - Ages {childrenMinAge}-{childrenMaxAge}
                    </label>
                    <Select
                        value={guests.children.toString()}
                        onValueChange={handleChildrenChange}>
                        <SelectTrigger className='w-full bg-transparent text-gray-900 dark:text-gray-100 dark:border-gray-700'>
                            <SelectValue placeholder='Select children' />
                        </SelectTrigger>
                        <SelectContent className='w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:border-gray-700'>
                            {childrenOptions.map(num => (
                                <SelectItem key={num} value={num.toString()}>
                                    {num} {num === 0 ? 'No' : ''} Child
                                    {num !== 1 ? 'ren' : ''}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Infants Select */}
                <div>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5'>
                        Infants (
                        {infantPrice === 0
                            ? 'Free'
                            : `${getCurrencyIcon(
                                  tripData?.pricingConfig?.currency
                              )}${infantPrice}`}
                        ) - Under {infantsMaxAge + 1}
                    </label>
                    <Select
                        value={guests.infants.toString()}
                        onValueChange={handleInfantsChange}>
                        <SelectTrigger className='w-full bg-transparent text-gray-900 dark:text-gray-100 dark:border-gray-700'>
                            <SelectValue placeholder='Select infants' />
                        </SelectTrigger>
                        <SelectContent className='w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:border-gray-700'>
                            {infantOptions.map(num => (
                                <SelectItem key={num} value={num.toString()}>
                                    {num} {num === 0 ? 'No' : ''} Infant
                                    {num !== 1 ? 's' : ''}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Guest Summary */}
                <div className='flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900/50'>
                    <Users className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                    <span className='text-sm font-medium text-gray-800 dark:text-gray-200'>
                        Total: {guests.adults + guests.children} Guest
                        {guests.adults + guests.children !== 1 ? 's' : ''}
                        {guests.infants > 0 &&
                            `, ${guests.infants} Infant${
                                guests.infants !== 1 ? 's' : ''
                            }`}
                    </span>
                </div>

                {/* Guest Limits Info */}
                {pricingLimits && (
                    <div className='text-sm text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700'>
                        <Info className='h-3 w-3 inline mr-1' />
                        Max guests: {maxAdults} adults, {maxChildren} children,{' '}
                        {maxInfants} infants
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuestSelection2;

