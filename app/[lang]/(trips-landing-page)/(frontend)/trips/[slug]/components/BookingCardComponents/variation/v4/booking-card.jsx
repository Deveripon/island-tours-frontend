'use client';
import { createMolliePayment } from '@/app/_actions/paymentWithMollie';
import { createStripeCheckoutSession } from '@/app/_actions/paymentWithStripe';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCurrencyIcon } from '@/utils/currency-info';
import {
    ArrowRight,
    Calendar,
    Check,
    CreditCard,
    Gift,
    Loader2,
    MapPin,
    Minus,
    Plus,
    User,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTrip } from '../../../../../../../hooks/use-trip';

import { bookingFormSchema } from '@/app/[lang]/(trips-landing-page)/utils/validations/booking-form-validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import GuestSelection from '../guest/guest-selection';
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

export default function SidebarBookingCard({ paymentMethod }) {
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

    const [activeSection, setActiveSection] = useState('details');
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

    const isDetailsComplete = selectedDate && guests.adults >= 1;
    const isContactComplete =
        form.watch('contactInfo.name') && form.watch('contactInfo.email');

    const sections = [
        {
            id: 'details',
            label: 'Trip Details',
            icon: Calendar,
            complete: isDetailsComplete,
        },
        {
            id: 'extras',
            label: 'Add Extras',
            icon: Gift,
            complete: true,
        },
        {
            id: 'contact',
            label: 'Contact Info',
            icon: User,
            complete: isContactComplete,
        },
    ];

    return (
        <FormProvider {...form}>
            <div className='space-y-2 min-w-[450px]'>
                <Card className='border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden dark:bg-gray-900'>
                    <div className='flex'>
                        {/* Sidebar Navigation */}
                        <div className='w-40 bg-gray-900 dark:bg-gray-950 text-white p-6 flex flex-col justify-between'>
                            <div className='space-y-6'>
                                <div className='pb-6 border-b border-gray-700 dark:border-gray-800'>
                                    <p className='text-xs uppercase tracking-wider text-gray-400 mb-2'>
                                        Starting from
                                    </p>
                                    <div className='flex items-baseline gap-1'>
                                        <span className='text-3xl font-light'>
                                            {currencyIcon}
                                            {pricing?.unitPrice || 0}
                                        </span>
                                    </div>
                                    <p className='text-xs text-gray-400 mt-1 font-light'>
                                        per person
                                    </p>
                                </div>

                                <nav className='space-y-2'>
                                    {sections.map(section => {
                                        const Icon = section.icon;
                                        const isActive =
                                            activeSection === section.id;

                                        return (
                                            <button
                                                key={section.id}
                                                type='button'
                                                className={`
                                                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all
                                                    ${
                                                        isActive
                                                            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                                                            : 'text-gray-300 dark:text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-900'
                                                    }
                                                `}>
                                                <div
                                                    className={`
                                                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                                                    ${
                                                        isActive
                                                            ? 'bg-primary text-white'
                                                            : section.complete
                                                              ? 'bg-primary text-white'
                                                              : 'bg-gray-800 dark:bg-gray-900 text-gray-400'
                                                    }
                                                `}>
                                                    {section.complete &&
                                                    !isActive ? (
                                                        <Check className='w-4 h-4' />
                                                    ) : (
                                                        <Icon className='w-4 h-4' />
                                                    )}
                                                </div>
                                                <span className='text-sm font-light'>
                                                    {section.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>

                            <div className='pt-6 border-t border-gray-700 dark:border-gray-800 space-y-2'>
                                <div className='flex justify-between items-center text-xs'>
                                    <span className='text-gray-400 font-light'>
                                        Service Fee
                                    </span>
                                    <span className='text-white font-light'>
                                        {currencyIcon}
                                        {pricing?.breakdown?.serviceChargeAmount?.toFixed(
                                            2
                                        ) || '0.00'}
                                    </span>
                                </div>
                                {pricing?.breakdown?.additionalsCost > 0 && (
                                    <div className='flex justify-between items-center text-xs'>
                                        <span className='text-gray-400 font-light'>
                                            Extras
                                        </span>
                                        <span className='text-white font-light'>
                                            +{currencyIcon}
                                            {pricing?.breakdown?.additionalsCost?.toFixed(
                                                2
                                            )}
                                        </span>
                                    </div>
                                )}
                                <div className='flex justify-between items-center text-xs'>
                                    <span className='text-gray-400 font-light'>
                                        Total Price
                                    </span>
                                    <span className='text-white font-light'>
                                        {currencyIcon}
                                        {pricing?.total?.toFixed(2) || '0.00'}
                                    </span>
                                </div>
                                <div className='h-px bg-gray-700 dark:bg-gray-800 my-3'></div>
                                <div className='flex justify-between items-center'>
                                    <span className='text-sm text-gray-300 dark:text-gray-400 font-light'>
                                        Total
                                    </span>
                                    <span className='text-xl font-light text-white'>
                                        {currencyIcon}
                                        {pricing?.deposit?.toFixed(2) || '0.00'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className='flex-1'>
                            <CardContent className='p-6 dark:bg-gray-900'>
                                {/* Details Section */}
                                {activeSection === 'details' && (
                                    <div className='space-y-6'>
                                        <div>
                                            <h2 className='text-2xl font-light text-gray-900 dark:text-gray-100 mb-1'>
                                                Plan Your Trip
                                            </h2>
                                            <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                                                Select your preferred date and
                                                number of guests
                                            </p>
                                        </div>

                                        <div className='space-y-4'>
                                            <DateSelector
                                                selectedDateFromUrl={
                                                    selectedDateFromUrl
                                                }
                                            />
                                            <GuestSelection
                                                userSelectedGuests={
                                                    userSelectedGuests
                                                }
                                            />
                                            <PickupSelectField
                                                value={selectedPickup?.id || ''}
                                                onValueChange={pickupObject => {
                                                    updateSelectedPickup(
                                                        pickupObject
                                                    );
                                                }}
                                                pickups={tripData?.pickups}
                                                currency={
                                                    tripData?.pricingConfig
                                                        ?.currency
                                                }
                                            />
                                        </div>

                                        {notExtras.length > 0 && (
                                            <div className='space-y-3 pt-6 border-t border-gray-100 dark:border-gray-800'>
                                                <h3 className='text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                                                    <MapPin className='w-4 h-4' />
                                                    Included Services
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
                                                                p-4 rounded-lg border transition-all
                                                                ${
                                                                    quantity > 0
                                                                        ? 'border-gray-900 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                                                                        : 'border-gray-200 dark:border-gray-700'
                                                                }
                                                            `}>
                                                            <div className='flex items-center justify-between'>
                                                                <div className='flex-1'>
                                                                    <div className='flex items-center gap-2 mb-1'>
                                                                        <h5 className='text-sm font-normal text-gray-900 dark:text-gray-100'>
                                                                            {
                                                                                additional.name
                                                                            }
                                                                        </h5>
                                                                        {quantity >
                                                                            0 && (
                                                                            <span className='px-2 py-0.5 text-xs bg-gray-900 dark:bg-gray-700 text-white rounded-full'>
                                                                                {
                                                                                    quantity
                                                                                }
                                                                            </span>
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
                                                                <div className='flex items-center gap-2 ml-4'>
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
                                                                        className='dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 h-8 w-8 p-0'>
                                                                        <Minus className='w-3 h-3' />
                                                                    </Button>
                                                                    <span className='w-6 text-center text-sm font-light dark:text-gray-300'>
                                                                        {
                                                                            quantity
                                                                        }
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
                                                                        className='dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 h-8 w-8 p-0'>
                                                                        <Plus className='w-3 h-3' />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        <Button
                                            type='button'
                                            onClick={() =>
                                                setActiveSection('extras')
                                            }
                                            disabled={!isDetailsComplete}
                                            className='w-full h-12 bg-primary text-white hover:bg-primary/80 font-light shadow-md hover:shadow-lg transition-all'>
                                            Continue to Extras
                                            <ArrowRight className='w-4 h-4 ml-2' />
                                        </Button>
                                    </div>
                                )}

                                {/* Extras Section */}
                                {activeSection === 'extras' && (
                                    <div className='space-y-6'>
                                        <div>
                                            <h2 className='text-2xl font-light text-gray-900 dark:text-gray-100 mb-1'>
                                                Enhance Your Experience
                                            </h2>
                                            <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                                                Add optional extras to make your
                                                trip more memorable
                                            </p>
                                        </div>

                                        {extras.length === 0 ? (
                                            <div className='text-center py-16 rounded-lg bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700'>
                                                <Gift className='w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3' />
                                                <p className='text-sm font-light text-gray-400 dark:text-gray-500'>
                                                    No additional services
                                                    available
                                                </p>
                                            </div>
                                        ) : (
                                            <div className='space-y-3'>
                                                {extras.map(additional => {
                                                    const quantity =
                                                        getAdditionalQuantity(
                                                            additional.id
                                                        );
                                                    const subtotal =
                                                        additional.priceImpact *
                                                        quantity;

                                                    return (
                                                        <div
                                                            key={additional.id}
                                                            className={`
                                                                p-4 rounded-lg border transition-all
                                                                ${
                                                                    quantity > 0
                                                                        ? 'border-gray-900 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 shadow-sm'
                                                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                                }
                                                            `}>
                                                            <div className='flex items-start justify-between mb-3'>
                                                                <div className='flex-1'>
                                                                    <div className='flex items-center gap-2 mb-1'>
                                                                        <h5 className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                                                                            {
                                                                                additional.name
                                                                            }
                                                                        </h5>
                                                                        {quantity >
                                                                            0 && (
                                                                            <span className='px-2 py-0.5 text-xs bg-gray-900 dark:bg-gray-700 text-white rounded-full'>
                                                                                {
                                                                                    quantity
                                                                                }
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className='text-xs font-light text-gray-500 dark:text-gray-400'>
                                                                        {additional.priceImpact ===
                                                                        0
                                                                            ? 'Free of charge'
                                                                            : `${
                                                                                  additional.priceImpact >
                                                                                  0
                                                                                      ? '+'
                                                                                      : ''
                                                                              }${currencyIcon}${Math.abs(
                                                                                  additional.priceImpact
                                                                              )} per item`}
                                                                    </p>
                                                                </div>
                                                                <div className='flex items-center gap-2 ml-4'>
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
                                                                        className='dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 h-8 w-8 p-0'>
                                                                        <Minus className='w-3 h-3' />
                                                                    </Button>
                                                                    <span className='w-6 text-center text-sm font-light dark:text-gray-300'>
                                                                        {
                                                                            quantity
                                                                        }
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
                                                                        className='dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 h-8 w-8 p-0'>
                                                                        <Plus className='w-3 h-3' />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            {quantity > 0 &&
                                                                additional.priceImpact !==
                                                                    0 && (
                                                                    <div className='flex items-center justify-between pt-2 mt-2 border-t border-gray-200 dark:border-gray-700'>
                                                                        <span className='text-xs font-light text-gray-500 dark:text-gray-400'>
                                                                            Subtotal
                                                                        </span>
                                                                        <span className='text-sm font-normal text-gray-900 dark:text-gray-100'>
                                                                            {
                                                                                currencyIcon
                                                                            }
                                                                            {subtotal.toFixed(
                                                                                2
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        <Button
                                            type='button'
                                            onClick={() =>
                                                setActiveSection('contact')
                                            }
                                            className='w-full h-12 bg-primary text-white hover:bg-primary/80 font-light shadow-md hover:shadow-lg transition-all'>
                                            Continue to Contact Info
                                            <ArrowRight className='w-4 h-4 ml-2' />
                                        </Button>
                                    </div>
                                )}

                                {/* Contact Section */}
                                {activeSection === 'contact' && (
                                    <div className='space-y-6'>
                                        <div>
                                            <h2 className='text-2xl font-light text-gray-900 dark:text-gray-100 mb-1'>
                                                Contact Information
                                            </h2>
                                            <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                                                We&apos;ll use this to send your
                                                booking confirmation
                                            </p>
                                        </div>

                                        <TravelarContactInformation
                                            isRequest={false}
                                        />

                                        <Button
                                            type='button'
                                            onClick={handleProceedToPayment}
                                            disabled={isLoading}
                                            className='w-full h-12 bg-primary text-white hover:bg-primary/80 font-light shadow-md hover:shadow-lg transition-all'>
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard className='w-4 h-4 mr-2' />
                                                    Proceed to Payment
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </div>
                    </div>
                </Card>
            </div>
        </FormProvider>
    );
}

