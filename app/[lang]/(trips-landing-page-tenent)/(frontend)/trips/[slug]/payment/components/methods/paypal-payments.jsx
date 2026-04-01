'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import PaypalIcon from '../icons/paypal';

export default function PaypalPayment() {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePaypalPayment = () => {
        setIsProcessing(true);
    };

    return (
        <Card className='p-8 bg-background border border-gray-200 text-center'>
            <div className='w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6'>
                <PaypalIcon />
            </div>

            <h2 className='text-sm font-normal text-gray-900 mb-4'>
                Pay with PayPal
            </h2>
            <p className='text-gray-600 mb-8 text-sm font-normal'>
                You&apos;ll be redirected to PayPal to complete your payment
                securely
            </p>

            <Button
                className='w-full h-12 text-sm font-normal bg-primary hover:bg-primary/90 text-white'
                onClick={handlePaypalPayment}
                disabled={isProcessing}>
                {isProcessing
                    ? 'Redirecting to PayPal...'
                    : 'Continue with PayPal'}
            </Button>

            <p className='text-sm text-gray-500 mt-4 font-normal'>
                By clicking continue, you agree to PayPal&apos;s terms and
                conditions
            </p>
        </Card>
    );
}

