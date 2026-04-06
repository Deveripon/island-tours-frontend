'use client';
import { Card } from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

// Import your existing components
import CreditCard from './icons/card';
import PaypalIcon from './icons/paypal';
import Stripe from './icons/stripe';
import CardPayment from './methods/card-payment';
import PaypalPayment from './methods/paypal-payments';
import StripePayment from './methods/stripe-payments';

const PaymentMethods = ({ data }) => {
    const [openMethod, setOpenMethod] = useState(null);

    const handleMethodToggle = methodId => {
        setOpenMethod(openMethod === methodId ? null : methodId);
    };

    const paymentMethods = [
        {
            id: 'card',
            name: 'Credit / Debit Card',
            description: 'Visa, Mastercard, American Express',
            icon: <CreditCard />,
            component: <CardPayment data={data} />,
        },
        {
            id: 'paypal',
            name: 'PayPal',
            description: 'Pay securely with your PayPal account',
            icon: <PaypalIcon />,
            component: <PaypalPayment data={data} />,
        },
        {
            id: 'stripe',
            name: 'Stripe',
            description: 'Secure payment processing',
            icon: <Stripe />,
            component: <StripePayment data={data} />,
        },
    ];

    return (
        <Card className='p-8 bg-background border border-gray-200'>
            <div className='mb-8'>
                <h2 className='text-lg font-normal text-gray-900 mb-2'>
                    Choose Payment Method
                </h2>
                <p className='text-gray-600 font-normal'>
                    Select your preferred way to pay
                </p>
            </div>

            <div className='space-y-4'>
                {paymentMethods.map(method => (
                    <Collapsible
                        key={method.id}
                        open={openMethod === method.id}
                        onOpenChange={() => handleMethodToggle(method.id)}>
                        <CollapsibleTrigger asChild>
                            <div
                                className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                    openMethod === method.id
                                        ? 'border-primary bg-gray-50'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-4'>
                                        <div className='w-10 h-10  rounded-lg flex items-center justify-center'>
                                            {method.icon}
                                        </div>
                                        <div>
                                            <h3 className='text-base font-normal text-gray-900'>
                                                {method.name}
                                            </h3>
                                            <p className='text-sm text-gray-600 font-normal'>
                                                {method.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                        {openMethod === method.id && (
                                            <div className='w-5 h-5 bg-primary rounded-full flex items-center justify-center'>
                                                <Check className='w-3 h-3 text-white' />
                                            </div>
                                        )}
                                        {openMethod === method.id ? (
                                            <ChevronUp className='w-5 h-5 text-gray-400' />
                                        ) : (
                                            <ChevronDown className='w-5 h-5 text-gray-400' />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent className='mt-2'>
                            {method.component}
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
        </Card>
    );
};

export default PaymentMethods;

