'use client';
import { useTrip } from '@/app/[lang]/(trips-landing-page)/hooks/use-trip';
import { bookingFormSchema } from '@/app/[lang]/(trips-landing-page)/utils/validations/booking-form-validations';
import { createMolliePayment } from '@/app/_actions/paymentWithMollie';
import { createStripeCheckoutSession } from '@/app/_actions/paymentWithStripe';
import { Button } from '@/components/ui/button';
import { getCurrencyIcon } from '@/utils/currency-info';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import TravelarContactInformation from './traveller-contact-information';

const defaultValues = {
    contactInfo: {
        name: '',
        email: '',
        mobile: {
            countryCode: '', // or a default country code
            number: '',
        },
        city: '',
        address: '',
    },
    specialRequests: '',
};

export default function BookingPageContent({
    isRequest,
    setIsNext,
    paymentMethod,
}) {
    const { pricing, guests, tripData, selectedDate } = useTrip();
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: defaultValues,
        mode: 'onChange',
    });

    const currency = tripData?.pricingConfig?.currency.split(' ')[0] || 'USD';
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
        // Implement Stripe payment logic here
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

    return (
        <>
            <FormProvider {...form}>
                <form
                    className='space-y-2'
                    onSubmit={form.handleSubmit(handlePayment)}>
                    <TravelarContactInformation isRequest={isRequest} />

                    <h6 className='text-sm px-6 mt-4 font-medium text-gray-500 dark:text-gray-400'>
                        Reservation or Service Fee :{' '}
                        {getCurrencyIcon(tripData?.pricingConfig?.currency)}
                        {pricing?.breakdown?.serviceChargeAmount}
                    </h6>
                    <h3 className='text-sm px-6 font-medium text-gray-500 dark:text-gray-400'>
                        Total Desposit:{' '}
                        <span className='font-semibold text-primary dark:text-primary text-lg'>
                            {tripData?.pricingConfig?.currency &&
                                getCurrencyIcon(
                                    tripData?.pricingConfig?.currency
                                )}
                            {pricing?.deposit.toFixed(2)}
                        </span>
                    </h3>
                    {!isRequest && (
                        <div className='flex px-6 gap-2 justify-between items-center'>
                            <Button
                                onClick={() => setIsNext(false)}
                                variant='outline'
                                className='w-fit transition-all text-gray-300 bg-gray-1000 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 duration-200 dark:border-gray-500'
                                size='lg'>
                                <ArrowLeft className='mr-2 h-4 w-4' />
                                Back
                            </Button>
                            <Button
                                type='submit'
                                variant='default'
                                className='w-fit bg-primary/90 hover:bg-primary transition-all duration-200'
                                size='lg'>
                                {isLoading && (
                                    <span className='flex items-center'>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />{' '}
                                        Processing...
                                    </span>
                                )}
                                {!isLoading && (
                                    <span className='flex items-center'>
                                        Make Payment
                                        <ArrowRight className='mr-2 h-4 w-4' />
                                    </span>
                                )}
                            </Button>
                        </div>
                    )}
                </form>
            </FormProvider>
            {/*             {openModal && (
                <PaymentGatewaySelection
                    isLoading={isLoading}
                    openModal={openModal}
                    setIsOpen={setOpenModal}
                    handlePayWithStripe={handlePayWithStripe}
                    handlePayWithMollie={handlePayWithMollie}
                />
            )} */}
        </>
    );
}

