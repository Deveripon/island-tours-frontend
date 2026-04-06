'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import Stripe from '../icons/stripe';

export default function StripePayment() {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleStripePayment = () => {
        setIsProcessing(true);
    };

    return (
        <Card className='p-8 bg-background border border-gray-200 text-center'>
            <div className='w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6'>
                <Stripe />
            </div>

            <h2 className='text-sm font-normal text-gray-900 mb-4'>
                Pay with Stripe
            </h2>
            <p className='text-gray-600 mb-8 text-sm font-normal'>
                Fast, secure, and trusted by millions worldwide
            </p>

            <Button
                className='w-full h-12 text-sm font-normal bg-primary hover:bg-primary/90 text-white'
                onClick={handleStripePayment}
                disabled={isProcessing}>
                {isProcessing
                    ? 'Processing with Stripe...'
                    : 'Continue with Stripe'}
            </Button>

            <p className='text-sm text-gray-500 mt-4 font-normal'>
                Powered by Stripe&apos;s secure payment infrastructure
            </p>
        </Card>
    );
}

