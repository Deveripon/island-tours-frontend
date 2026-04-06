'use client';
import { useUrl } from '@/app/[lang]/(trips-landing-page)/hooks/use-url';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/currency-info';
import { CreditCard, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PaymentProcessing from '../payment-processing';

export default function CardPayment({ data }) {
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: '',
    });
    const router = useRouter();
    const [showProcessing, setShowProcessing] = useState(false);
    const { fullUrl } = useUrl();
    const handleInputChange = (field, value) => {
        let formattedValue = value;

        if (field === 'number') {
            formattedValue = value
                .replace(/\s/g, '')
                .replace(/(.{4})/g, '$1 ')
                .trim();
        } else if (field === 'expiry') {
            formattedValue = value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '$1/$2');
        }

        setCardDetails(prev => ({ ...prev, [field]: formattedValue }));
    };

    const handlePayment = () => {
        if (
            cardDetails.number &&
            cardDetails.expiry &&
            cardDetails.cvv &&
            cardDetails.name
        ) {
            setShowProcessing(true);
            // Simulate payment processing
            setTimeout(() => {
                setShowProcessing(false);
                // Redirect to success page or handle payment success
                router.replace(`${fullUrl}/success`);
            }, 2000);
        }
    };

    return (
        <Card className='p-8 bg-background border  border-gray-200'>
            <div className='flex items-center gap-3 mb-8'>
                <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center'>
                    <CreditCard className='w-5 h-5 text-gray-600' />
                </div>
                <div>
                    <h2 className='text-sm font-normal text-gray-900'>
                        Enter Card Details
                    </h2>
                    <p className='text-gray-600 font-normal text-sm'>
                        Your information is secure and encrypted
                    </p>
                </div>
            </div>

            <div className='space-y-3'>
                <div>
                    <label className=' text-sm font-normal text-gray-700 mb-3'>
                        Card Number
                    </label>
                    <Input
                        placeholder='1234 5678 9012 3456'
                        value={cardDetails.number}
                        onChange={e =>
                            handleInputChange('number', e.target.value)
                        }
                        maxLength={19}
                        className='text-sm border-gray-300 focus:border-gray-900 focus:ring-gray-900'
                    />
                </div>

                <div className='grid grid-cols-2 gap-6'>
                    <div>
                        <label className='block text-sm font-normal text-gray-700 mb-3'>
                            Expiry Date
                        </label>
                        <Input
                            placeholder='MM/YY'
                            value={cardDetails.expiry}
                            onChange={e =>
                                handleInputChange('expiry', e.target.value)
                            }
                            maxLength={5}
                            className='text-sm border-gray-300 focus:border-gray-900 focus:ring-gray-900'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-normal text-gray-700 mb-3'>
                            CVV
                        </label>
                        <Input
                            placeholder='123'
                            type='password'
                            value={cardDetails.cvv}
                            onChange={e =>
                                handleInputChange('cvv', e.target.value)
                            }
                            maxLength={4}
                            className='text-sm border-gray-300 focus:border-gray-900 focus:ring-gray-900'
                        />
                    </div>
                </div>

                <div>
                    <label className='block text-sm font-normal text-gray-700 mb-3'>
                        Cardholder Name
                    </label>
                    <Input
                        placeholder='Name as on card'
                        value={cardDetails.name}
                        onChange={e =>
                            handleInputChange('name', e.target.value)
                        }
                        className='text-sm border-gray-300 focus:border-gray-900 focus:ring-gray-900'
                    />
                </div>
            </div>

            <div className='mt-8 p-3 bg-gray-50 rounded-lg'>
                <div className='flex items-center gap-3'>
                    <Lock className='w-5 h-5 text-emerald-600' />
                    <div>
                        <div className='font-normal text-emerald-900'>
                            256-bit SSL Encryption
                        </div>
                        <div className='text-sm text-emerald-600 font-normal'>
                            Your card details are completely secure
                        </div>
                    </div>
                </div>
            </div>

            <Button
                className='w-full mt-8 h-12 text-sm font-normal bg-primary hover:bg-primary/90 text-white'
                onClick={handlePayment}
                disabled={
                    !cardDetails.number ||
                    !cardDetails.expiry ||
                    !cardDetails.cvv ||
                    !cardDetails.name
                }>
                Pay{' '}
                {data?.paymentOption === 'pay_now' ? (
                    <span className='font-semibold'>
                        {formatCurrency(
                            (data?.totalPayable * 25) / 100,
                            data?.currency || 'USD'
                        )}
                    </span>
                ) : (
                    <span className=' font-semibold'>
                        {formatCurrency(
                            data?.totalPayable,
                            data?.currency || 'USD'
                        )}
                    </span>
                )}{' '}
                Securely
            </Button>
            {showProcessing && <PaymentProcessing />}
        </Card>
    );
}

