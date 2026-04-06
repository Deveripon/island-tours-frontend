'use client';

import { formateDate } from '@/app/[lang]/(trips-landing-page-tenent)/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/currency-info';
import {
    CreditCardIcon,
    Download02Icon,
    SentIcon,
    TickDouble01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { saveAs } from 'file-saver';
import { Calendar, Clock, Home, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
const SuccessPageContent = ({ bookingData }) => {
    // Function to download receipt
    async function downloadReceipt(bookingId) {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoices/generate/${bookingId}`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/pdf',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to download the invoice: ${response.status} ${response.statusText}`
                );
            }

            // Check if the response is actually a PDF
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/pdf')) {
                throw new Error('Response is not a PDF file');
            }

            const blob = await response.blob();
            saveAs(blob, `invoice-${bookingId || 'receipt'}.pdf`);
        } catch (error) {
            // Show user-friendly error message
            alert(
                'Failed to download receipt. Please try again or contact support.'
            );
        }
    }

    // Function to add to calendar
    const addToCalendar = () => {
        if (!bookingData) return;

        const startDate = new Date(bookingData.tripStartDate || new Date());
        const endDate = new Date(bookingData.tripEndDate || new Date());

        // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
        const formatDateForGoogle = date => {
            return date
                .toISOString()
                .replace(/[-:]/g, '')
                .replace(/\.\d{3}/, '');
        };

        const formattedStartDate = formatDateForGoogle(startDate);
        const formattedEndDate = formatDateForGoogle(endDate);

        const title = encodeURIComponent(`Trip: ${bookingData?.trip?.title}`);
        const details = encodeURIComponent(
            `Booking Reference ID: ${bookingData?.bookingReference}\nTrip: ${bookingData?.trip?.title}`
        );

        // Use formatted dates in the URL
        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formattedStartDate}/${formattedEndDate}&details=${details}`;
        window.open(calendarUrl, '_blank');
    };

    // Function to share trip details
    const shareTrip = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Trip Booking Confirmed: ${bookingData?.trip?.name}`,
                    text: `I've booked a trip to ${bookingData?.trip?.name}! Booking ID: ${bookingData?.id}`,
                    url: window.location.href,
                });
            } catch (error) {}
        } else {
            // Fallback: copy to clipboard
            const shareText = `I've booked a trip to ${bookingData?.trip?.name}! Booking ID: ${bookingData?.id}`;
            navigator.clipboard.writeText(shareText);
            alert('Trip details copied to clipboard!');
        }
    };

    return (
        <div className='bg-background min-h-screen'>
            <div className='container mx-auto py-12 px-4 sm:px-6 lg:px-8 lg:py-32'>
                {/* Success Message */}
                <div className='max-w-4xl mx-auto mb-12'>
                    <div className='bg-success/10 rounded-2xl p-8 mb-8 text-center border border-success/20'>
                        <div className='relative mb-6'>
                            <div className='absolute inset-0 flex items-center justify-center'>
                                <div className='w-24 h-24 rounded-full bg-success/20 animate-ping' />
                            </div>

                            <HugeiconsIcon
                                className='h-16 w-16 text-success mx-auto relative'
                                icon={TickDouble01Icon}
                            />
                        </div>
                        <h1 className='text-3xl font-bold mb-3 text-foreground'>
                            Booking Confirmed!
                        </h1>
                        <h3 className='text-xl py-2 font-semibold text-foreground'>
                            {bookingData?.trip?.title}
                        </h3>
                        <p className='text-base text-muted-foreground mb-6 max-w-2xl mx-auto'>
                            Your booking has been successfully completed. Check
                            your email for details.
                        </p>
                        <div className='inline-block bg-card border border-border px-6 py-3 rounded-lg font-mono text-sm text-foreground shadow-sm'>
                            Booking #: {bookingData?.bookingReference}
                        </div>
                    </div>
                </div>

                <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
                    {/* Main Content */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* What's Next */}
                        <Card className='shadow-md'>
                            <CardHeader>
                                <CardTitle className='text-foreground'>
                                    What&apos;s Next?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-6'>
                                <div className='flex items-start space-x-4'>
                                    <div className='flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20'>
                                        <span className='text-sm font-bold text-primary'>
                                            1
                                        </span>
                                    </div>
                                    <div className='flex-1'>
                                        <h4 className='font-semibold text-foreground mb-1'>
                                            Confirmation Email
                                        </h4>
                                        <p className='text-sm text-muted-foreground leading-relaxed'>
                                            You&apos;ll receive a detailed
                                            confirmation email within 5 minutes
                                            with your itinerary and travel
                                            documents.
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-start space-x-4'>
                                    <div className='flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20'>
                                        <span className='text-sm font-bold text-primary'>
                                            2
                                        </span>
                                    </div>
                                    <div className='flex-1'>
                                        <h4 className='font-semibold text-foreground mb-1'>
                                            Travel Documents
                                        </h4>
                                        <p className='text-sm text-muted-foreground leading-relaxed'>
                                            Check your passport validity and
                                            visa requirements. We&apos;ll send
                                            you a pre-travel checklist.
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-start space-x-4'>
                                    <div className='flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20'>
                                        <span className='text-sm font-bold text-primary'>
                                            3
                                        </span>
                                    </div>
                                    <div className='flex-1'>
                                        <h4 className='font-semibold text-foreground mb-1'>
                                            Pre-Trip Contact
                                        </h4>
                                        <p className='text-sm text-muted-foreground leading-relaxed'>
                                            Our travel coordinator will contact
                                            you 48 hours before departure with
                                            final details.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Trip Details */}
                        {bookingData && (
                            <Card className='shadow-md'>
                                <CardHeader>
                                    <CardTitle className='text-foreground'>
                                        Trip Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <div>
                                            <h4 className='font-semibold mb-3 text-foreground'>
                                                Trip Information
                                            </h4>
                                            <div className='space-y-2 text-sm'>
                                                <p className='text-muted-foreground'>
                                                    <span className='font-medium text-foreground'>
                                                        Destination:
                                                    </span>{' '}
                                                    {
                                                        bookingData.trip
                                                            ?.destination?.name
                                                    }
                                                </p>
                                                <p className='text-muted-foreground'>
                                                    <span className='font-medium text-foreground'>
                                                        Duration:
                                                    </span>{' '}
                                                    {bookingData.trip?.duration}
                                                </p>
                                                <p className='text-muted-foreground'>
                                                    <span className='font-medium text-foreground'>
                                                        Departure:
                                                    </span>{' '}
                                                    {formateDate(
                                                        bookingData?.tripDate,
                                                        'custom'
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className='font-semibold mb-3 text-foreground'>
                                                Booking Details
                                            </h4>
                                            <div className='space-y-2 text-sm'>
                                                <p className='text-muted-foreground'>
                                                    <span className='font-medium text-foreground'>
                                                        Travelers:
                                                    </span>{' '}
                                                    {bookingData.totalGuests
                                                        ?.adults +
                                                        bookingData.totalGuests
                                                            ?.children +
                                                        bookingData.totalGuests
                                                            ?.infants}{' '}
                                                    persons
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className='space-y-6'>
                        {/* Receipt */}
                        <Card className='shadow-md'>
                            <CardHeader>
                                <CardTitle className='flex items-center text-foreground'>
                                    <HugeiconsIcon
                                        icon={CreditCardIcon}
                                        className='h-5 w-5 mr-2 text-primary'
                                    />
                                    Payment Receipt
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='space-y-3'>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>
                                            Booking ID:
                                        </span>
                                        <span className='font-mono text-foreground'>
                                            {bookingData?.id}
                                        </span>
                                    </div>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>
                                            Payment ID:
                                        </span>
                                        <span className='font-mono text-foreground'>
                                            {bookingData?.payments[0]?.id}
                                        </span>
                                    </div>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>
                                            Payment Date:
                                        </span>
                                        <span className='text-foreground'>
                                            {formateDate(
                                                bookingData?.payments[0]
                                                    ?.createdAt,
                                                'custom'
                                            )}
                                        </span>
                                    </div>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>
                                            Payment Method:
                                        </span>
                                        <span className='text-foreground capitalize'>
                                            {
                                                bookingData?.payments[0]
                                                    ?.paymentMethod
                                            }
                                        </span>
                                    </div>
                                </div>

                                <Separator />

                                <div className='space-y-2'>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>
                                            Package Total:
                                        </span>
                                        <span className='text-foreground'>
                                            {formatCurrency(
                                                bookingData?.pricing?.total ||
                                                    '0.00',
                                                bookingData?.currency
                                            )}
                                        </span>
                                    </div>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>
                                            Deposit:
                                        </span>
                                        <span className='text-foreground'>
                                            {formatCurrency(
                                                bookingData?.payments[0]
                                                    ?.amount || '0.00',
                                                bookingData?.currency
                                            )}
                                        </span>
                                    </div>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>
                                            Service Fee:
                                        </span>
                                        <span className='text-foreground'>
                                            {formatCurrency(
                                                bookingData?.pricing?.breakdown
                                                    ?.serviceChargeAmount ||
                                                    '0.00',
                                                bookingData?.currency
                                            )}
                                        </span>
                                    </div>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>
                                            Taxes:
                                        </span>
                                        <span className='text-foreground'>
                                            {formatCurrency(
                                                bookingData?.pricing?.breakdown
                                                    .taxAmount || '0.00',
                                                bookingData?.currency
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <Separator />

                                <div className='flex justify-between font-bold text-lg text-foreground pt-2'>
                                    <span>Total Deposit:</span>
                                    <span className='text-primary'>
                                        {formatCurrency(
                                            bookingData?.payments[0]?.amount ||
                                                '0.00',
                                            bookingData?.currency
                                        )}
                                    </span>
                                </div>

                                <Button
                                    className='w-full mt-4 hover:bg-primary/80 hover:text-primary-foreground'
                                    onClick={() =>
                                        downloadReceipt(bookingData?.id)
                                    }>
                                    <HugeiconsIcon icon={Download02Icon} />
                                    Download Receipt
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card className='shadow-md'>
                            <CardHeader>
                                <CardTitle className='text-foreground'>
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-3'>
                                <Button
                                    variant='outline'
                                    className='w-full dark:hover:text-primary '
                                    onClick={shareTrip}>
                                    <HugeiconsIcon icon={SentIcon} />
                                    Share Trip
                                </Button>
                                <Button
                                    variant='outline'
                                    className='w-full dark:hover:text-primary '
                                    onClick={addToCalendar}>
                                    <Calendar className='h-4 w-4 mr-2' />
                                    Add to Calendar
                                </Button>
                                <Button
                                    asChild
                                    variant='outline'
                                    className='w-full dark:hover:text-primary '>
                                    <Link href="/">
                                        <Home className='h-4 w-4 mr-2' />
                                        Back to Home
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Support */}
                        <Card className='shadow-md'>
                            <CardHeader>
                                <CardTitle className='text-foreground'>
                                    Need Help?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-3'>
                                <div className='text-sm text-muted-foreground'>
                                    <p className='mb-3 text-foreground font-medium'>
                                        Our travel experts are here to help:
                                    </p>
                                    <div className='space-y-2'>
                                        <div className='flex items-center space-x-3'>
                                            <Phone className='h-4 w-4 text-primary flex-shrink-0' />
                                            <span>+880 121 123-4567</span>
                                        </div>
                                        <div className='flex items-center space-x-3'>
                                            <Mail className='h-4 w-4 text-primary flex-shrink-0' />
                                            <span>support@travelease.com</span>
                                        </div>
                                        <div className='flex items-center space-x-3'>
                                            <Clock className='h-4 w-4 text-primary flex-shrink-0' />
                                            <span>24/7 Support Available</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPageContent;

