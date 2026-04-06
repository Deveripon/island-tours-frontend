'use client';
import { createPaymentWithMollie } from '@/app/_actions/paymentWithMollie';
import { createCheckoutSession } from '@/app/_actions/paymentWithStripe';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCurrencyIcon } from '@/utils/currency-info';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Loader2,
    Minus,
    Plus,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useState } from 'react';
import { toast } from 'sonner';
import { useTrip } from '../../../../../../../hooks/use-trip';

import { bookingFormSchema } from '@/app/[lang]/(trips-landing-page-tenent)/utils/validations/booking-form-validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import GuestSelection from '../guest/guest-selection';
import { PickupSelectField } from '../pickup/pickup-selection';
import DateSelector from '../v1/date-selector';
import TravelarContactInformation from './traveller-contact-info-form';

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

export default function MinimalBookingCard({ paymentMethod }) {
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
    const searchParams = useSearchParams();
    const selectedDateFromUrl = searchParams.get('startDate');
    const userSelectedGuests = {
        adults: parseInt(searchParams.get('adults') || '1', 10),
        children: parseInt(searchParams.get('children') || '0', 10),
        infants: parseInt(searchParams.get('infants') || '0', 10),
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

            const { url } = await createCheckoutSession(data);

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
            const payment = await createPaymentWithMollie(data);

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
                <Card className='border dark:border-gray-700 shadow-sm hover:shadow-md dark:hover:shadow-gray-900/50 dark:bg-card transition-shadow'>
                    {/* Progress Steps */}
                    <div className='px-6 pt-6 pb-4'>
                        <div className='flex items-center mb-6'>
                            {[1, 2, 3].map((s, index) => (
                                <Fragment key={s}>
                                    <div
                                        className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-light transition-all
                        ${
                            step >= s
                                ? 'bg-primary text-white dark:text-gray-900'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700'
                        }
                    `}>
                                        {step > s ? (
                                            <Check className='w-4 h-4' />
                                        ) : (
                                            s
                                        )}
                                    </div>
                                    {index < 2 && (
                                        <div
                                            className={`
                            h-px flex-1 mx-2 transition-all
                            ${
                                step > s
                                    ? 'bg-gray-900 dark:bg-gray-100'
                                    : 'bg-gray-200 dark:bg-gray-700'
                            }
                        `}
                                        />
                                    )}
                                </Fragment>
                            ))}
                        </div>
                        <div className='flex justify-between text-xs font-light text-gray-500 dark:text-gray-400'>
                            <span>Details</span>
                            <span>Services</span>
                            <span>Contact</span>
                        </div>
                    </div>

                    <CardContent className='px-6 pb-6'>
                        {/* Step 1: Date & Guests */}
                        {step === 1 && (
                            <div className='space-y-6'>
                                <div>
                                    <div className='flex items-center justify-between mb-4'>
                                        <h3 className='text-sm font-light text-gray-500 dark:text-gray-400'>
                                            Starting from
                                        </h3>
                                        <div className='text-right'>
                                            <span className='text-2xl font-light text-gray-900 dark:text-gray-100'>
                                                {currencyIcon}
                                                {pricing?.unitPrice || 0}
                                            </span>
                                            <Badge
                                                variant='outline'
                                                className='ml-2 text-xs font-light dark:border-gray-600 dark:text-gray-300'>
                                                per person
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <DateSelector
                                    selectedDateFromUrl={selectedDateFromUrl}
                                />
                                <GuestSelection
                                    userSelectedGuests={userSelectedGuests}
                                />

                                <PickupSelectField
                                    value={selectedPickup?.id || ''}
                                    onValueChange={pickupObject => {
                                        updateSelectedPickup(pickupObject);
                                    }}
                                    pickups={tripData?.pickups}
                                    currency={tripData?.pricingConfig?.currency}
                                />

                                {/* Other Services */}
                                {notExtras.length > 0 && (
                                    <div className='space-y-3'>
                                        <h3 className='text-sm font-light text-gray-500 dark:text-gray-400'>
                                            Other Services
                                        </h3>
                                        {notExtras.map(additional => {
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
                                                        : 'border-gray-200 dark:border-gray-700'
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
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2: Extras */}
                        {step === 2 && (
                            <div className='space-y-4'>
                                <div className='text-center mb-6'>
                                    <h3 className='text-lg font-light text-gray-900 dark:text-gray-100 mb-1'>
                                        Enhance Your Experience
                                    </h3>
                                    <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                                        Optional extras for your trip
                                    </p>
                                </div>

                                {extras.length === 0 ? (
                                    <div className='text-center py-12 text-sm font-light text-gray-400 dark:text-gray-500'>
                                        No additional services available
                                    </div>
                                ) : (
                                    extras.map(additional => {
                                        const quantity = getAdditionalQuantity(
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
                                                            {quantity > 0 && (
                                                                <span className='px-1.5 py-0.5 text-xs bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded'>
                                                                    {quantity}
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
                                                                quantity <= 0
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
                                    })
                                )}
                            </div>
                        )}

                        {/* Step 3: Contact Info */}
                        {step === 3 && (
                        <TravelarContactInformation
                                isRequest={false}
                            />
                        )}
                    </CardContent>

                    {/* Footer */}
                    <div className='px-6 pb-6 pt-4 border-t dark:border-gray-700'>
                        <div className='space-y-2 mb-4'>
                            <div className='flex justify-between text-sm font-light'>
                                <span className='text-gray-500 dark:text-gray-400'>
                                    Service Fee
                                </span>
                                <span className='text-gray-900 dark:text-gray-100'>
                                    {currencyIcon}
                                    {pricing?.breakdown?.serviceChargeAmount?.toFixed(
                                        2
                                    ) || '0.00'}
                                </span>
                            </div>
                            {pricing?.breakdown?.additionalsCost > 0 && (
                                <div className='flex justify-between text-sm font-light'>
                                    <span className='text-gray-500 dark:text-gray-400'>
                                        Additional Services
                                    </span>
                                    <span className='text-gray-900 dark:text-gray-100'>
                                        +{currencyIcon}
                                        {pricing?.breakdown?.additionalsCost?.toFixed(
                                            2
                                        )}
                                    </span>
                                </div>
                            )}
                            <div className='flex justify-between text-sm font-light'>
                                <span className='text-gray-500 dark:text-gray-400'>
                                    Total Price
                                </span>
                                <span className='text-gray-900 dark:text-gray-100'>
                                    {currencyIcon}
                                    {pricing?.total?.toFixed(2) || '0.00'}
                                </span>
                            </div>
                            <div className='flex justify-between items-center pt-3 border-t dark:border-gray-700'>
                                <span className='text-sm font-normal text-gray-600 dark:text-gray-300'>
                                    Total Deposit
                                </span>
                                <span className='text-xl font-light text-gray-900 dark:text-gray-100'>
                                    {currencyIcon}
                                    {pricing?.deposit?.toFixed(2) || '0.00'}
                                </span>
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
                </Card>
            </form>
        </FormProvider>
    );
}

