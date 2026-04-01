'use client';
import { getAffiliateBookingBySessionId } from '@/app/_actions/bookingActions';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SuccessPageContent from './components/page-content';

export default function SuccessPage() {
    const [bookingStatus, setBookingStatus] = useState('processing');
    const [bookingData, setBookingData] = useState(null);
    const searchParams = useSearchParams();
    const session_id = searchParams.get('session_id');

    useEffect(() => {
        let timeoutId;

        const checkBookingStatus = async () => {
            try {
                const response = await getAffiliateBookingBySessionId(session_id);

                if (response?.data?.status === 'CONFIRMED') {
                    setBookingStatus('CONFIRMED');
                    setBookingData(response.data);
                } else if (response?.data?.status === 'processing') {
                    timeoutId = setTimeout(checkBookingStatus, 2000);
                }
            } catch (error) {
                setBookingStatus('error');
            }
        };

        if (session_id) {
            checkBookingStatus();
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [session_id]);

    if (bookingStatus === 'processing') {
        return (
            <div className='flex justify-center items-center min-h-screen bg-background'>
                <div className='text-center space-y-6'>
                    <div className='relative'>
                        <div className='animate-spin rounded-full h-32 w-32 border-4 border-muted mx-auto'></div>
                        <div className='animate-spin rounded-full h-32 w-32 border-t-4 border-primary absolute top-0 left-1/2 -translate-x-1/2'></div>
                    </div>
                    <div className='space-y-2'>
                        <p className='text-base font-medium text-foreground'>
                            Processing your booking...
                        </p>
                        <p className='text-sm text-muted-foreground'>
                            Please wait while we confirm your reservation
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (bookingStatus === 'CONFIRMED') {
        return <SuccessPageContent bookingData={bookingData} />;
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-background'>
            <div className='text-center max-w-md mx-auto px-6'>
                <div className='mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10'>
                    <svg
                        className='w-10 h-10 text-destructive'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                        />
                    </svg>
                </div>
                <h1 className='text-2xl font-semibold mb-3 text-foreground'>
                    Booking Failed
                </h1>
                <p className='text-muted-foreground mb-6'>
                    We encountered an issue while processing your booking. Please try again or contact support if the problem persists.
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    className='inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity shadow-sm'
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
}