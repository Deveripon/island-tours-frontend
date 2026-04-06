import { getPaymentConfiguration } from '@/app/_actions/settingsActions';
import Link from 'next/link';
import Configuration from './components/cofiguration';

export default async function PaymentMethods() {
    const response = await getPaymentConfiguration();
    const configuration = response?.result?.data?.paymentMethodConfiguration;
    const preferredMethod = response?.result?.data?.preferedPaymentMethod;

    return (
        <div className='container'>
            <div className='flex  items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-semibold tracking-tight'>Payment Configuration</h1>
                    <p className='text-sm text-muted-foreground'>
                        Set up your payment processing with Stripe to start accepting
                        payments from customers worldwide.
                    </p>
                </div>
            </div>

            <Configuration
                enabledMethod={preferredMethod}
                configuration={configuration}
            />

            <div className='mt-8  rounded-lg p-4'>
                <div className='flex'>
                    <h2 className='text-xs font-semibold text-foreground'>
                        Can&apos;t find the payment gateway you are looking for?
                    </h2>
                    <Link href='#' className='text-xs ml-4 underline text-primary hover:text-primary/80'>
                        Request Payment Gateway
                    </Link>
                </div>
            </div>
        </div>
    );
}
