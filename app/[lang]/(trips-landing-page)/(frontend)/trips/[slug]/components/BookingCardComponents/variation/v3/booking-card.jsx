'use client';
import { createMolliePayment } from '@/app/_actions/paymentWithMollie';
import { createStripeCheckoutSession } from '@/app/_actions/paymentWithStripe';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCurrencyIcon } from '@/utils/currency-info';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Gift,
    Loader2,
    Minus,
    Plus,
    User,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useState } from 'react';
import { toast } from 'sonner';
import { useTrip } from '../../../../../../../hooks/use-trip';

import { bookingFormSchema } from '@/app/[lang]/(trips-landing-page)/utils/validations/booking-form-validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarFold } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import GuestSelection2 from '../guest/guest-selection-1';
import { PickupSelectField } from '../pickup/pickup-selection';
import DateSelector from '../v1/date-selector';
import TravelarContactInformation from '../v2/traveller-contact-info-form';

const defaultValues = {
    contactInfo: {
        name: '',
        email: '',
        mobile: {
            countryCode: '',
            number: '',
        },
        city: '',
        address: '',
    },
    specialRequests: '',
};

const steps = [
    { number: 1, label: 'Trip Details', icon: CalendarFold },
    { number: 2, label: 'Add Extras', icon: Gift },
    { number: 3, label: 'Your Info', icon: User },
];

export default function ElegantBookingCard({ paymentMethod }) {
    const {
        tripData,
        selectedDate,
        guests,
        pricing,
        selectedPickup,
        selectedAdditionals,
        updateSelectedDate,
        updateSelectedPickup,
        updateGuests,
        updateSelectedAdditionals,
        getAdditionalQuantity,
    } = useTrip();

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedDateFromUrl = searchParams.get('startDate');
    const userSelectedGuests = {
        adults: parseInt(searchParams.get('adults') || '1', 10),
        children: parseInt(searchParams.get('children') || '0', 10),
        infants: parseInt(searchParams.get('infants') || '0', 10),
    };

    const notExtras = tripData?.additionals?.filter(a => !a.isExtra) || [];
    const extras = tripData?.additionals?.filter(a => a.isExtra) || [];

    const handleQuantityUpdate = (additionalId, increment) => {
        const currentQuantity = getAdditionalQuantity(additionalId);
        const newQuantity = increment
            ? currentQuantity + 1
            : Math.max(0, currentQuantity - 1);

        if (newQuantity === 0) {
            const updatedAdditionals = selectedAdditionals.filter(
                item => item.id !== additionalId
            );
            updateSelectedAdditionals(updatedAdditionals);
        } else {
            const additional = tripData?.additionals?.find(
                a => a.id === additionalId
            );
            if (!additional) return;

            const updatedAdditionals = selectedAdditionals.some(
                item => item.id === additionalId
            )
                ? selectedAdditionals.map(item =>
                      item.id === additionalId
                          ? { ...item, quantity: newQuantity }
                          : item
                  )
                : [
                      ...selectedAdditionals,
                      { ...additional, quantity: newQuantity },
                  ];

            updateSelectedAdditionals(updatedAdditionals);
        }
    };

    const form = useForm({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: defaultValues,
        mode: 'onChange',
    });

    const currency = tripData?.pricingConfig?.currency.split(' ')[0] || 'USD';
    const currencyIcon = getCurrencyIcon(currency);

    async function handlePayment(data) {
        setIsLoading(true);
        const bookingData = {
            ...data,
            tripDate: selectedDate,
            totalGuests: guests,
            tripId: tripData?.id,
            pricing,
            currency: currency || 'USD',
        };

        switch (paymentMethod) {
            case 'stripe':
                await handlePayWithStripe(bookingData);
                setIsLoading(false);
                break;
            case 'mollie':
                await handlePayWithMollie(bookingData);
                setIsLoading(false);
                break;
            default:
                await handlePayWithStripe(bookingData);
                setIsLoading(false);
                break;
        }
    }

    async function handlePayWithStripe(bookingData) {
        try {
            setIsLoading(true);
            const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/trips/${tripData?.slug}/payment/success?method=stripe`;
            const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/trips/${tripData?.slug}/booking?checkout=${tripData?.id}&payment_cancelled=true`;
            const data = {
                booking_data: {
                    ...bookingData,
                    paymentMethod: 'stripe',
                },
                success_url: successUrl,
                cancel_url: cancelUrl,
            };

            const { url } = await createStripeCheckoutSession(data);
            window.location.assign(url);
            setIsLoading(false);
        } catch (error) {
            toast.error(
                'An error occurred while saving booking information. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function handlePayWithMollie(bookingData) {
        try {
            setIsLoading(true);
            const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/trips/${tripData?.slug}/payment/success?method=mollie`;
            const data = {
                success_url: successUrl,
                booking_data: {
                    ...bookingData,
                    paymentMethod: 'mollie',
                },
            };
            const payment = await createMolliePayment(data);
            window.location.assign(payment?._links?.checkout?.href);
            setIsLoading(false);
        } catch (error) {
            toast.error(
                'An error occurred while saving booking information. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    }

    const handleProceedToPayment = async () => {
        const isValid = await form.trigger();

        if (!isValid) {
            toast.error('Please fill in all required fields correctly.');
            return;
        }

        const formData = form.getValues();
        await handlePayment(formData);
    };

    const isStep1Valid = selectedDate && guests.adults >= 1;

    return (
        <FormProvider {...form}>
            <form
                className='space-y-2'
                onSubmit={form.handleSubmit(handlePayment)}>
                <Card className='border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden dark:bg-gray-900'>
                    {/* Header with Price */}
                    <div className='bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-6 py-6 border-b-2 border-gray-200 dark:border-gray-700'>
                        <div className='flex items-end justify-between'>
                            <div>
                                <p className='text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-light mb-1'>
                                    From
                                </p>
                                <div className='flex items-baseline gap-1'>
                                    <span className='text-4xl font-light text-gray-900 dark:text-white'>
                                        {currencyIcon}
                                        {pricing?.unitPrice || 0}
                                    </span>
                                    <span className='text-sm text-gray-500 dark:text-gray-400 font-light mb-1'>
                                        /person
                                    </span>
                                </div>
                            </div>
                            <Badge
                                variant='outline'
                                className='bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-light px-3 py-1'>
                                Step {step} of 3
                            </Badge>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className='px-6 py-4 bg-gray-100 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'>
                        <div className='flex items-center justify-between'>
                            {steps.map((s, index) => {
                                const Icon = s.icon;
                                const isActive = step === s.number;
                                const isCompleted = step > s.number;

                                return (
                                    <Fragment key={s.number}>
                                        <div className='flex flex-col items-center gap-2 flex-1'>
                                            <div
                                                className={`
                                                    w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                                                    ${
                                                        isCompleted
                                                            ? 'bg-primary text-gray-100 shadow-md'
                                                            : isActive
                                                              ? 'bg-primary text-gray-100 shadow-lg scale-110'
                                                              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-2 border-gray-200 dark:border-gray-700'
                                                    }
                                                `}>
                                                {isCompleted ? (
                                                    <Check className='w-5 h-5' />
                                                ) : (
                                                    <Icon className='w-5 h-5' />
                                                )}
                                            </div>
                                            <span
                                                className={`
                                                    text-xs font-light text-center transition-colors
                                                    ${
                                                        isActive || isCompleted
                                                            ? 'text-gray-900 dark:text-white'
                                                            : 'text-gray-400 dark:text-gray-500'
                                                    }
                                                `}>
                                                {s.label}
                                            </span>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div
                                                className={`
                                                    h-0.5 flex-1 mx-2 mt-[-20px] transition-all duration-300
                                                    ${
                                                        step > s.number
                                                            ? 'bg-gray-900 dark:bg-gray-100'
                                                            : 'bg-gray-200 dark:bg-gray-700'
                                                    }
                                                `}
                                            />
                                        )}
                                    </Fragment>
                                );
                            })}
                        </div>
                    </div>

                    <CardContent className='px-6 py-6 dark:bg-gray-900'>
                        {/* Step 1: Date & Guests */}
                        {step === 1 && (
                            <div className='space-y-6 animate-in fade-in duration-300'>
                                <div className='space-y-4'>
                                    <DateSelector
                                        selectedDateFromUrl={
                                            selectedDateFromUrl
                                        }
                                    />
                                    {/*         <GuestSelection
                                        userSelectedGuests={userSelectedGuests}
                                    /> */}
                                    <GuestSelection2
                                        userSelectedGuests={userSelectedGuests}
                                    />
                                    <PickupSelectField
                                        value={selectedPickup?.id || ''}
                                        onValueChange={pickupObject => {
                                            updateSelectedPickup(pickupObject);
                                        }}
                                        pickups={tripData?.pickups}
                                        currency={
                                            tripData?.pricingConfig?.currency
                                        }
                                    />
                                </div>

                                {notExtras.length > 0 && (
                                    <div className='space-y-3 pt-4 border-t border-gray-400 dark:border-gray-800'>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-1 h-5 bg-gray-900 dark:bg-gray-100 rounded-full'></div>
                                            <h3 className='text-base font-light text-gray-900 dark:text-white'>
                                                Included Services
                                            </h3>
                                        </div>
                                        {notExtras.map(additional => {
                                            const quantity =
                                                getAdditionalQuantity(
                                                    additional.id
                                                );
                                            return (
                                                <div
                                                    key={additional.id}
                                                    className={`
                                                        group p-4 rounded-lg border transition-all duration-200
                                                        ${
                                                            quantity > 0
                                                                ? 'border-gray-900 dark:border-gray-500 bg-gray-50 dark:bg-gray-800 shadow-sm'
                                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                        }
                                                    `}>
                                                    <div className='flex items-center justify-between'>
                                                        <div className='flex-1'>
                                                            <div className='flex items-center gap-1 mb-1'>
                                                                <h5 className='text-sm font-normal text-gray-900 dark:text-white'>
                                                                    {
                                                                        additional.name
                                                                    }
                                                                </h5>
                                                                {quantity >
                                                                    0 && (
                                                                    <Badge className='bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs h-5 px-2'>
                                                                        {
                                                                            quantity
                                                                        }
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className='text-xs font-light text-gray-500 dark:text-gray-400'>
                                                                {additional.priceImpact ===
                                                                0
                                                                    ? 'Complimentary'
                                                                    : `${
                                                                          additional.priceImpact >
                                                                          0
                                                                              ? '+'
                                                                              : ''
                                                                      }${currencyIcon}${Math.abs(
                                                                          additional.priceImpact
                                                                      )} each`}
                                                            </p>
                                                        </div>
                                                        <div className='flex items-center gap-3 ml-4'>
                                                            <Button
                                                                size='icon'
                                                                variant='outline'
                                                                type='button'
                                                                onClick={() =>
                                                                    handleQuantityUpdate(
                                                                        additional.id,
                                                                        false
                                                                    )
                                                                }
                                                                disabled={
                                                                    quantity <=
                                                                    0
                                                                }
                                                                className='h-7 w-7 rounded-full dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700'>
                                                                <Minus className='w-3.5 h-3.5' />
                                                            </Button>
                                                            <span className='w-8 text-center text-sm font-light text-gray-900 dark:text-white'>
                                                                {quantity}
                                                            </span>
                                                            <Button
                                                                size='icon'
                                                                variant='outline'
                                                                type='button'
                                                                onClick={() =>
                                                                    handleQuantityUpdate(
                                                                        additional.id,
                                                                        true
                                                                    )
                                                                }
                                                                className='h-7 w-7 rounded-full dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700'>
                                                                <Plus className='w-3.5 h-3.5' />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2: Extras */}
                        {step === 2 && (
                            <div className='space-y-5 animate-in fade-in duration-300'>
                                <div className='text-center py-4'>
                                    <div className='inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 mb-3'>
                                        <Gift className='w-8 h-8 text-gray-900 dark:text-white' />
                                    </div>
                                    <h3 className='text-xl font-light text-gray-900 dark:text-white mb-2'>
                                        Make It Special
                                    </h3>
                                    <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                                        Add optional extras to enhance your
                                        experience
                                    </p>
                                </div>

                                {extras.length === 0 ? (
                                    <div className='text-center py-16 rounded-lg bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700'>
                                        <p className='text-sm font-light text-gray-400 dark:text-gray-500'>
                                            No additional services available at
                                            this time
                                        </p>
                                    </div>
                                ) : (
                                    <div className='space-y-3'>
                                        {extras.map(additional => {
                                            const quantity =
                                                getAdditionalQuantity(
                                                    additional.id
                                                );
                                            return (
                                                <div
                                                    key={additional.id}
                                                    className={`
                                            p-4 rounded border transition-all
                                            ${
                                                quantity > 0
                                                    ? 'border-gray-900 dark:border-gray-500 bg-gray-50 dark:bg-gray-800'
                                                    : 'border-gray-700 dark:border-gray-700'
                                            }
                                        `}>
                                                    <div className='flex items-start justify-between mb-2'>
                                                        <div className='flex-1'>
                                                            <div className='flex items-center gap-2'>
                                                                <h5 className='text-sm font-normal text-gray-900 dark:text-gray-100'>
                                                                    {
                                                                        additional.name
                                                                    }
                                                                </h5>
                                                                {quantity >
                                                                    0 && (
                                                                    <span className='px-1.5 py-0.5 text-xs bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded'>
                                                                        {
                                                                            quantity
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className='text-xs font-light text-gray-500 dark:text-gray-400 mt-1'>
                                                                {additional.priceImpact ===
                                                                0
                                                                    ? 'Free'
                                                                    : `${
                                                                          additional.priceImpact >
                                                                          0
                                                                              ? '+'
                                                                              : ''
                                                                      }${currencyIcon}${Math.abs(
                                                                          additional.priceImpact
                                                                      )} each`}
                                                            </p>
                                                        </div>
                                                        <div className='flex items-center gap-2'>
                                                            <Button
                                                                size='icon'
                                                                variant='outline'
                                                                onClick={() =>
                                                                    handleQuantityUpdate(
                                                                        additional.id,
                                                                        false
                                                                    )
                                                                }
                                                                disabled={
                                                                    quantity <=
                                                                    0
                                                                }
                                                                className='h-7 w-7 rounded-full dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700'>
                                                                <Minus className='w-3 h-3' />
                                                            </Button>
                                                            <span className='w-6 text-center text-sm font-light dark:text-gray-300'>
                                                                {quantity}
                                                            </span>
                                                            <Button
                                                                size='icon'
                                                                variant='outline'
                                                                onClick={() =>
                                                                    handleQuantityUpdate(
                                                                        additional.id,
                                                                        true
                                                                    )
                                                                }
                                                                className='h-7 w-7 rounded-full dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700'>
                                                                <Plus className='w-3 h-3' />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    {quantity > 0 &&
                                                        additional.priceImpact !==
                                                            0 && (
                                                            <div className='text-xs font-light text-right text-gray-600 dark:text-gray-400 mt-2 pt-2 border-t dark:border-gray-700'>
                                                                Subtotal:{' '}
                                                                {currencyIcon}
                                                                {(
                                                                    additional.priceImpact *
                                                                    quantity
                                                                ).toFixed(2)}
                                                            </div>
                                                        )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 3: Contact Info */}
                        {step === 3 && (
                            <div className='animate-in fade-in duration-300'>
                                <TravelarContactInformation isRequest={false} />
                            </div>
                        )}
                    </CardContent>

                    {/* Footer with Pricing */}
                    <div className='border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900'>
                        <div className='px-6 py-5'>
                            <div className='space-y-3 mb-5'>
                                <div className='flex justify-between items-center text-sm font-light'>
                                    <span className='text-gray-600 dark:text-gray-400'>
                                        Service Fee
                                    </span>
                                    <span className='text-gray-900 dark:text-white'>
                                        {currencyIcon}
                                        {pricing?.breakdown?.serviceChargeAmount?.toFixed(
                                            2
                                        ) || '0.00'}
                                    </span>
                                </div>
                                {pricing?.breakdown?.additionalsCost > 0 && (
                                    <div className='flex justify-between items-center text-sm font-light'>
                                        <span className='text-gray-600 dark:text-gray-400'>
                                            Additional Services
                                        </span>
                                        <span className='text-gray-900 dark:text-white'>
                                            +{currencyIcon}
                                            {pricing?.breakdown?.additionalsCost?.toFixed(
                                                2
                                            )}
                                        </span>
                                    </div>
                                )}
                                <div className='flex justify-between items-center text-sm font-light'>
                                    <span className='text-gray-600 dark:text-gray-400'>
                                        Total Price
                                    </span>
                                    <span className='text-gray-900 dark:text-white'>
                                        {currencyIcon}
                                        {pricing?.total?.toFixed(2) || '0.00'}
                                    </span>
                                </div>
                                <div className='h-px bg-gray-200 dark:bg-gray-700 my-3'></div>
                                <div className='flex justify-between items-center pt-2'>
                                    <div>
                                        <p className='text-xs text-gray-500 dark:text-gray-400 font-light mb-1'>
                                            Total Deposit
                                        </p>
                                        <p className='text-2xl font-light text-gray-900 dark:text-white'>
                                            {currencyIcon}
                                            {pricing?.deposit?.toFixed(2) ||
                                                '0.00'}
                                        </p>
                                    </div>
                                    <Badge
                                        variant='outline'
                                        className='bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-light px-3 py-1.5'>
                                        Due Today
                                    </Badge>
                                </div>
                            </div>

                            <div className='flex gap-3'>
                                {step > 1 && (
                                    <Button
                                        type='button'
                                        variant='outline'
                                        onClick={() => setStep(step - 1)}
                                        className='flex-1 h-11 transition-all text-gray-300 bg-gray-1000 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 duration-200 dark:border-gray-500'>
                                        <ArrowLeft className='w-4 h-4 mr-2' />
                                        Back
                                    </Button>
                                )}
                                {step < 3 ? (
                                    <Button
                                        type='button'
                                        onClick={() => setStep(step + 1)}
                                        disabled={step === 1 && !isStep1Valid}
                                        className='flex-1 h-11 bg-primary hover:bg-primary/80 text-white  font-light'>
                                        Continue
                                        <ArrowRight className='w-4 h-4 ml-2' />
                                    </Button>
                                ) : (
                                    <Button
                                        type='button'
                                        onClick={handleProceedToPayment}
                                        disabled={isLoading}
                                        className='flex-1 h-11 bg-primary hover:bg-primary/80 text-white font-light'>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Proceed to Payment
                                                <ArrowRight className='w-4 h-4 ml-2' />
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </form>
        </FormProvider>
    );
}

