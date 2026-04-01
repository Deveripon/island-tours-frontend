'use client';

import { updateMollieConfigurationOfTenant } from '@/app/_actions/settingsActions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Copy01Icon,
    LockIcon,
    Settings01Icon,
    ViewIcon,
    ViewOffIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import PaymentSwitcher from '../paymet-switcher';

// Mollie Configuration Schema
const mollieConfigSchema = z.object({
    paymentLabel: z.string().min(1, 'Payment label is required'),
    apiKey: z.string().min(1, 'API key is required'),
    paymentMethods: z
        .array(z.string())
        .min(1, 'Select at least one payment method'),
});
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_APP_URL;
export default function Mollie({
    mollieConfiguration,
    enabled,
    setEnabled,
    tenant,
}) {
    const [showApiKey, setShowApiKey] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const { data: session } = useSession();
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Check if this payment method is enabled
    const isEnabled = enabled === 'mollie';

    const form = useForm({
        resolver: zodResolver(mollieConfigSchema),
        defaultValues: {
            paymentLabel: mollieConfiguration?.paymentLabel || 'Mollie',
            apiKey: mollieConfiguration?.apiKey || '',
            paymentMethods: mollieConfiguration?.paymentMethods || [
                'creditcard',
            ],
        },
    });

    const webhookEndpoint = `${
        backendUrl || 'http://localhost:5050'
    }/webhook/mollie`;

    const paymentMethodOptions = [
        { id: 'applepay', label: 'Apple Pay' },
        { id: 'bancomatpay', label: 'Bancomat Pay' },
        { id: 'bancontact', label: 'Bancontact' },
        { id: 'banktransfer', label: 'Bank Transfer' },
        { id: 'blik', label: 'BLIK' },
        { id: 'creditcard', label: 'Credit Card' },
        { id: 'directdebit', label: 'Direct Debit' },
        { id: 'eps', label: 'EPS' },
        { id: 'giftcard', label: 'Gift Card' },
        { id: 'ideal', label: 'iDEAL' },
        { id: 'in3', label: 'in3' },
        { id: 'kbc', label: 'KBC' },
        { id: 'klarna', label: 'Klarna' },
        { id: 'mbway', label: 'MB WAY' },
        { id: 'paypal', label: 'PayPal' },
        { id: 'swish', label: 'Swish' },
    ];

    const onSubmit = async data => {
        if (!isEnabled) {
            toast.error('Please enable Mollie first to save configuration');
            return;
        }

        if (!session?.user?.id || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await updateMollieConfigurationOfTenant(
                tenant,
                data
            );

            if (response.success) {
                toast.success('Configuration saved successfully');
            } else {
                const errorMessage =
                    response.error || 'Failed to save configuration';
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (err) {
            console.error('Error saving configuration:', err);
            const errorMessage = 'An unexpected error occurred while saving';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyToClipboard = text => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className='space-y-6 w-full'>
            <div className='flex justify-between items-start'>
                <p className='text-sm text-gray-500'>
                    You can{' '}
                    <a
                        target='_blank'
                        href='https://docs.mollie.com/overview/authentication'
                        className='text-blue-600 hover:underline'
                        rel='noopener noreferrer'>
                        refer to this guide
                    </a>{' '}
                    to obtain the necessary keys.
                </p>
                <PaymentSwitcher
                    tenant={tenant}
                    enabled={enabled}
                    setEnabled={setEnabled}
                    paymentMethod='mollie'
                />
            </div>

            {/* Form with conditional editing */}
            <div
                className={cn(
                    'transition-all duration-300 relative',
                    !isEnabled && 'opacity-60'
                )}>
                {!isEnabled && (
                    <div className='absolute inset-0 z-10 bg-transparent cursor-not-allowed' />
                )}

                <Form {...form}>
                    <div className='space-y-6'>
                        <FormField
                            control={form.control}
                            name='paymentLabel'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex items-center gap-2'>
                                        Payment Label
                                        {!isEnabled && (
                                            <HugeiconsIcon
                                                icon={LockIcon}
                                                size={12}
                                                className='text-muted-foreground'
                                            />
                                        )}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value || ''}
                                            placeholder='Mollie'
                                            disabled={!isEnabled}
                                            className={cn(
                                                !isEnabled &&
                                                    'bg-gray-50 cursor-not-allowed'
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='apiKey'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex items-center gap-2'>
                                        API Key
                                        {!isEnabled && (
                                            <HugeiconsIcon
                                                icon={LockIcon}
                                                size={12}
                                                className='text-muted-foreground'
                                            />
                                        )}
                                    </FormLabel>
                                    <FormControl>
                                        <div className='relative'>
                                            <Input
                                                {...field}
                                                type={
                                                    showApiKey
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                placeholder='API Key (live_... or test_...)'
                                                disabled={!isEnabled}
                                                className={cn(
                                                    !isEnabled &&
                                                        'bg-gray-50 cursor-not-allowed'
                                                )}
                                            />
                                            <Button
                                                type='button'
                                                variant='ghost'
                                                size='icon'
                                                disabled={!isEnabled}
                                                className='absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8'
                                                onClick={() =>
                                                    setShowApiKey(!showApiKey)
                                                }>
                                                {showApiKey ? (
                                                    <HugeiconsIcon
                                                        icon={ViewOffIcon}
                                                        size={16}
                                                    />
                                                ) : (
                                                    <HugeiconsIcon
                                                        icon={ViewIcon}
                                                        size={16}
                                                    />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='webhookEndpoint'
                            render={() => (
                                <FormItem>
                                    <FormLabel className='flex items-center gap-2'>
                                        Webhooks Endpoint URL
                                        {!isEnabled && (
                                            <HugeiconsIcon
                                                icon={LockIcon}
                                                size={12}
                                                className='text-muted-foreground'
                                            />
                                        )}
                                    </FormLabel>
                                    <FormControl>
                                        <div className='flex gap-2'>
                                            <Input
                                                readOnly
                                                value={webhookEndpoint}
                                                className={cn(
                                                    'flex-1',
                                                    !isEnabled &&
                                                        'bg-gray-50 cursor-not-allowed'
                                                )}
                                                disabled={!isEnabled}
                                            />
                                            <Button
                                                type='button'
                                                variant='outline'
                                                disabled={!isEnabled}
                                                className={cn(
                                                    'flex items-center justify-center',
                                                    isCopied
                                                        ? 'bg-green-600 text-white'
                                                        : '',
                                                    !isEnabled &&
                                                        'opacity-50 cursor-not-allowed'
                                                )}
                                                onClick={() =>
                                                    copyToClipboard(
                                                        webhookEndpoint
                                                    )
                                                }>
                                                <HugeiconsIcon
                                                    icon={Copy01Icon}
                                                    size={16}
                                                    className='mr-2'
                                                />
                                                {isCopied ? 'Copied' : 'Copy'}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='paymentMethods'
                            render={() => (
                                <FormItem>
                                    <FormLabel className='flex items-center gap-2'>
                                        Payment Methods
                                        {!isEnabled && (
                                            <HugeiconsIcon
                                                icon={LockIcon}
                                                size={12}
                                                className='text-muted-foreground'
                                            />
                                        )}
                                    </FormLabel>
                                    <div
                                        className={cn(
                                            'grid grid-cols-2 gap-4 p-4 border rounded-lg',
                                            !isEnabled
                                                ? 'bg-muted border-border'
                                                : 'bg-card border-border'
                                        )}>
                                        {paymentMethodOptions.map(method => (
                                            <FormField
                                                key={method.id}
                                                control={form.control}
                                                name='paymentMethods'
                                                render={({ field }) => {
                                                    // Ensure field.value is always an array
                                                    const currentValue =
                                                        Array.isArray(
                                                            field.value
                                                        )
                                                            ? field.value
                                                            : [];

                                                    return (
                                                        <FormItem
                                                            key={method.id}
                                                            className='flex flex-row items-start space-x-3 space-y-0'>
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={currentValue.includes(
                                                                        method.id
                                                                    )}
                                                                    disabled={
                                                                        !isEnabled
                                                                    }
                                                                    onCheckedChange={checked => {
                                                                        if (
                                                                            !isEnabled
                                                                        )
                                                                            return;

                                                                        const newValue =
                                                                            checked
                                                                                ? [
                                                                                      ...currentValue,
                                                                                      method.id,
                                                                                  ]
                                                                                : currentValue.filter(
                                                                                      value =>
                                                                                          value !==
                                                                                          method.id
                                                                                  );

                                                                        field.onChange(
                                                                            newValue
                                                                        );
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel
                                                                className={cn(
                                                                    'font-normal',
                                                                    !isEnabled &&
                                                                        'text-muted-foreground cursor-not-allowed'
                                                                )}>
                                                                {method.label}
                                                            </FormLabel>
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Alert
                            className={cn(
                                'border-primary/10 bg-primary/5',
                                !isEnabled && 'opacity-50'
                            )}>
                            <AlertDescription className='text-sm'>
                                After enabling your preferred payment methods
                                here, you will also need to activate them in
                                your Mollie Dashboard. Visit the{' '}
                                <a
                                    target='_blank'
                                    href='https://my.mollie.com/dashboard/settings/payment-methods'
                                    className={cn(
                                        'text-primary hover:underline',
                                        !isEnabled && 'pointer-events-none'
                                    )}
                                    rel='noopener noreferrer'>
                                    Mollie payment methods settings
                                </a>{' '}
                                to enable them.
                            </AlertDescription>
                        </Alert>

                        <Button
                            type='button'
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={!isEnabled}
                            className={cn(
                                'w-full transition-all duration-200',
                                isEnabled
                                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                            )}>
                            {isEnabled ? (
                                <>
                                    <HugeiconsIcon
                                        icon={Settings01Icon}
                                        size={16}
                                        className='mr-2'
                                    />
                                    Save Configuration
                                </>
                            ) : (
                                <>
                                    <HugeiconsIcon
                                        icon={LockIcon}
                                        size={16}
                                        className='mr-2'
                                    />
                                    Enable Mollie to Save
                                </>
                            )}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

