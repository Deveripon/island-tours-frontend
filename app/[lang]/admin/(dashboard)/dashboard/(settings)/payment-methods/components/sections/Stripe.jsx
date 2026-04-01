'use client';
import { updateStripeConfigurationOfTennat } from '@/app/_actions/settingsActions';
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
    Alert01Icon,
    Copy01Icon,
    LockIcon,
    Settings01Icon,
    ViewIcon,
    ViewOffIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import PaymentSwitcher from '../paymet-switcher';

const stripeConfigSchema = z.object({
    paymentLabel: z.string().min(1, 'Payment label is required'),
    publishableKey: z.string().min(1, 'Publishable key is required'),
    secretKey: z.string().min(1, 'Secret key is required'),
    webhookSecret: z.string().min(1, 'Webhook secret is required'),
    paymentMethods: z
        .array(z.string())
        .min(1, 'Select at least one payment method'),
});

export default function Stripe({
    stripeConfiguration,
    enabled,
    setEnabled,
    tenant,
}) {
    const [showPublishableKey, setShowPublishableKey] = useState(false);
    const [showSecretKey, setShowSecretKey] = useState(false);
    const [showWebhookSecret, setShowWebhookSecret] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const { data: session } = useSession();
    const abortControllerRef = useRef(null);
    const copyTimeoutRef = useRef(null);

    // Check if this payment method is enabled
    const isEnabled = enabled === 'stripe';

    const form = useForm({
        resolver: zodResolver(stripeConfigSchema),
        defaultValues: {
            paymentLabel: stripeConfiguration?.paymentLabel ?? 'Stripe',
            publishableKey: stripeConfiguration?.publishableKey ?? '',
            secretKey: stripeConfiguration?.secretKey ?? '',
            webhookSecret: stripeConfiguration?.webhookSecret ?? '',
            paymentMethods: stripeConfiguration?.paymentMethods ?? [
                'card',
                'link',
            ],
        },
    });

    const webhookEndpoint = `${
        process.env.NEXT_PUBLIC_BACKEND_APP_URL || 'http://localhost:5050'
    }/webhook/stripe`;

    const paymentMethodOptions = [
        { id: 'card', label: 'Card' },
        { id: 'link', label: 'Link' },
        { id: 'amazon_pay', label: 'Amazon Pay' },
        { id: 'cash_app_pay', label: 'Cash App Pay' },
        { id: 'ideal', label: 'iDEAL' },
        { id: 'sepa_debit', label: 'SEPA Direct Debit' },
        { id: 'bank_transfer', label: 'Bank Transfer' },
    ];

    const onSubmit = async data => {
        if (!isEnabled) {
            toast.error('Please enable Stripe first to save configuration');
            return;
        }

        if (!session?.user?.id || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await updateStripeConfigurationOfTennat(
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

    const copyToClipboard = async text => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Copied to clipboard');
            setIsCopied(true);

            // Clear previous timeout
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }

            // Set new timeout
            copyTimeoutRef.current = setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (err) {
            toast.error('Failed to copy to clipboard');
        }
    };

    const handleRetry = () => {
        setError(null);
        // Reset form or retry logic here
    };

    // Show error state with retry option
    if (error) {
        return (
            <div className='space-y-6 w-full'>
                <Alert className='border-destructive/20 bg-destructive/10'>
                    <HugeiconsIcon
                        icon={Alert01Icon}
                        size={16}
                        className='text-destructive'
                    />
                    <AlertDescription className='text-sm text-destructive'>
                        {error}
                        <Button
                            variant='outline'
                            size='sm'
                            className='ml-2'
                            onClick={handleRetry}>
                            Try Again
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className='space-y-6 w-full'>
            <div className='flex justify-between items-start'>
                <p className='text-sm text-gray-500'>
                    You can{' '}
                    <a
                        target='_blank'
                        href='https://docs.stripe.com/keys'
                        className='text-primary hover:underline'
                        rel='noopener noreferrer'>
                        refer to this guide
                    </a>{' '}
                    to obtain the necessary keys.
                </p>
                <PaymentSwitcher
                    tenant={tenant}
                    enabled={enabled}
                    setEnabled={setEnabled}
                    paymentMethod='stripe'
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
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder='Stripe'
                                            disabled={
                                                !isEnabled || isSubmitting
                                            }
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
                            name='publishableKey'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex items-center gap-2'>
                                        Publishable Key
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
                                                    showPublishableKey
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                placeholder='pk_test_...'
                                                disabled={
                                                    !isEnabled || isSubmitting
                                                }
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
                                                    setShowPublishableKey(
                                                        !showPublishableKey
                                                    )
                                                }>
                                                {showPublishableKey ? (
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
                            control={form.control}
                            name='secretKey'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex items-center gap-2'>
                                        Secret Key
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
                                                    showSecretKey
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                placeholder='sk_test_...'
                                                disabled={
                                                    !isEnabled || isSubmitting
                                                }
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
                                                    setShowSecretKey(
                                                        !showSecretKey
                                                    )
                                                }>
                                                {showSecretKey ? (
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
                            name='webhookSecret'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex items-center gap-2'>
                                        Webhook Secret
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
                                                    showWebhookSecret
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                placeholder='whsec_...'
                                                disabled={
                                                    !isEnabled || isSubmitting
                                                }
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
                                                    setShowWebhookSecret(
                                                        !showWebhookSecret
                                                    )
                                                }>
                                                {showWebhookSecret ? (
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

                        <div
                            className={cn(
                                'space-y-2',
                                !isEnabled && 'opacity-50'
                            )}>
                            <p className='text-sm text-gray-500'>
                                View how to obtain{' '}
                                <a
                                    target='_blank'
                                    href='https://dashboard.stripe.com/test/workbench/webhooks'
                                    className={cn(
                                        'text-primary hover:underline',
                                        !isEnabled && 'pointer-events-none'
                                    )}
                                    rel='noopener noreferrer'>
                                    Webhooks Signing Secret
                                </a>{' '}
                                from Stripe.
                            </p>
                        </div>

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
                                                    return (
                                                        <FormItem
                                                            key={method.id}
                                                            className='flex flex-row items-start space-x-3 space-y-0'>
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(
                                                                        method.id
                                                                    )}
                                                                    disabled={
                                                                        !isEnabled ||
                                                                        isSubmitting
                                                                    }
                                                                    onCheckedChange={checked => {
                                                                        if (
                                                                            !isEnabled
                                                                        )
                                                                            return;
                                                                        return checked
                                                                            ? field.onChange(
                                                                                  [
                                                                                      ...field.value,
                                                                                      method.id,
                                                                                  ]
                                                                              )
                                                                            : field.onChange(
                                                                                  field.value?.filter(
                                                                                      value =>
                                                                                          value !==
                                                                                          method.id
                                                                                  )
                                                                              );
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel
                                                                className={cn(
                                                                    'font-normal',
                                                                    (!isEnabled ||
                                                                        isSubmitting) &&
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
                                here, you will also need to enable them from
                                your Stripe Dashboard. To enable them, please
                                visit the{' '}
                                <a
                                    target='_blank'
                                    href='https://dashboard.stripe.com/test/settings/payment_methods/'
                                    className={cn(
                                        'text-primary hover:underline',
                                        !isEnabled && 'pointer-events-none'
                                    )}
                                    rel='noopener noreferrer'>
                                    Stripe payment settings page
                                </a>
                                .
                            </AlertDescription>
                        </Alert>

                        <Button
                            type='button'
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={!isEnabled || isSubmitting}
                            className={cn(
                                'w-full transition-all duration-200',
                                isEnabled && !isSubmitting
                                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                            )}>
                            {!isEnabled ? (
                                <>
                                    <HugeiconsIcon
                                        icon={LockIcon}
                                        size={16}
                                        className='mr-2'
                                    />
                                    Enable Stripe to Save
                                </>
                            ) : isSubmitting ? (
                                <>
                                    <div className='w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent' />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <HugeiconsIcon
                                        icon={Settings01Icon}
                                        size={16}
                                        className='mr-2'
                                    />
                                    Save Configuration
                                </>
                            )}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

