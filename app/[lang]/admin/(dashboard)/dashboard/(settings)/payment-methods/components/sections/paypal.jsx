'use client';

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Copy01Icon, ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import PaymentSwitcher from '../paymet-switcher';

// PayPal Configuration Schema
const paypalConfigSchema = z.object({
    paymentLabel: z.string().min(1, 'Payment label is required'),
    clientId: z.string().min(1, 'Client ID is required'),
    clientSecret: z.string().min(1, 'Client Secret is required'),
    environment: z.enum(['sandbox', 'production']),
    webhookId: z.string().optional(),
    paymentMethods: z
        .array(z.string())
        .min(1, 'Select at least one payment method') });
export default function PayPal({ paypalConfiguration, enabled, setEnabled }) {
    const [showClientSecret, setShowClientSecret] = useState(false);
    const [showWebhookId, setShowWebhookId] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(paypalConfigSchema),
        defaultValues: {
            paymentLabel: 'PayPal',
            clientId: '',
            clientSecret: '',
            environment: 'sandbox',
            webhookId: '',
            paymentMethods: ['paypal', 'card'],
        } });

    const webhookEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_APP_URL}/webhook/paypal`;

    /*     useEffect(() => {
        if (session?.user?.id) {
            const fetchPaymentMethods = async () => {
                const response = await getUserPayPalPaymentMethods(
                    session.user.id
                );
                if (response.success) {
                    const paymentMethods =
                        response.user?.paymentMethodConfiguration?.paypal || {};
                    form.reset({ ...paymentMethods });
                }
            };
            fetchPaymentMethods();
        }
    }, [form, session?.user?.id]); */

    const paymentMethodOptions = [
        { id: 'paypal', label: 'PayPal' },
        { id: 'card', label: 'Credit/Debit Card' },
        { id: 'venmo', label: 'Venmo' },
        { id: 'applepay', label: 'Apple Pay' },
        { id: 'googlepay', label: 'Google Pay' },
        { id: 'paylater', label: 'Pay in 4' },
    ];

    const onSubmit = async data => {
        const response = await updateUserPayPalConfiguration(
            session.user.id,
            data
        );
        if (response.success) {
            toast.success('Configuration Saved');
        } else {
            toast.error('An unexpected error occurred');
        }
    };

    const copyToClipboard = text => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className='space-y-6 w-full '>
            <div className='flex justify-between'>
                <p className='text-sm text-muted-foreground'>
                    You can{' '}
                    <Link
                        target='_blank'
                        href='https://developer.paypal.com/api/rest/'
                        className='text-primary hover:underline'>
                        refer to this guide
                    </Link>{' '}
                    to obtain the necessary credentials.
                </p>
                <PaymentSwitcher
                    enabled={enabled}
                    setEnabled={setEnabled}
                    paymentMethod='paypal'
                    comingSoon={true}
                />
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'>
                    <FormField
                        control={form.control}
                        name='paymentLabel'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Payment Label</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder='PayPal' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='environment'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Environment</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select environment' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value='sandbox'>
                                            Sandbox
                                        </SelectItem>
                                        <SelectItem value='production'>
                                            Production
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='clientId'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Client ID</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder='PayPal Client ID'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='clientSecret'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Client Secret</FormLabel>
                                <FormControl>
                                    <div className='relative'>
                                        <Input
                                            {...field}
                                            type={
                                                showClientSecret
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder='PayPal Client Secret'
                                        />
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='icon'
                                            className='absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8'
                                            onClick={() =>
                                                setShowClientSecret(
                                                    !showClientSecret
                                                )
                                            }>
                                            {showClientSecret ? (
                                                <HugeiconsIcon icon={ViewOffIcon} size={16} />
                                            ) : (
                                                <HugeiconsIcon icon={ViewIcon} size={16} />
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
                        name='webhookEndpoint'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Webhooks Endpoint URL</FormLabel>
                                <FormControl>
                                    <div className='flex gap-2'>
                                        <Input
                                            readOnly
                                            value={webhookEndpoint}
                                            className='flex-1'
                                        />
                                        <Button
                                            type='button'
                                            variant='outline'
                                            className={cn(
                                                'flex items-center justify-center',
                                                isCopied
                                                    ? 'bg-success text-success-foreground'
                                                    : ''
                                            )}
                                            onClick={() =>
                                                copyToClipboard(webhookEndpoint)
                                            }>
                                            <HugeiconsIcon icon={Copy01Icon} size={16} className='mr-2' />
                                            {isCopied
                                                ? 'Copied'
                                                : 'Click to copy'}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='webhookId'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Webhook ID (Optional)</FormLabel>
                                <FormControl>
                                    <div className='relative'>
                                        <Input
                                            {...field}
                                            type={
                                                showWebhookId
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder='PayPal Webhook ID'
                                        />
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='icon'
                                            className='absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8'
                                            onClick={() =>
                                                setShowWebhookId(!showWebhookId)
                                            }>
                                            {showWebhookId ? (
                                                <HugeiconsIcon icon={ViewOffIcon} size={16} />
                                            ) : (
                                                <HugeiconsIcon icon={ViewIcon} size={16} />
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
                        name='paymentMethods'
                        render={() => (
                            <FormItem>
                                <FormLabel>Payment Methods</FormLabel>
                                <div className='grid grid-cols-2 gap-4'>
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
                                                                onCheckedChange={checked => {
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
                                                        <FormLabel className='font-normal'>
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

                    <Alert className='border-primary/10 bg-primary/5'>
                        <AlertDescription className='text-sm'>
                            Ensure that you have configured the payment methods
                            in your PayPal Developer Dashboard. Visit the{' '}
                            <Link
                                target='_blank'
                                href='https://developer.paypal.com/developer/applications'
                                className='text-primary hover:underline'>
                                PayPal Developer Dashboard
                            </Link>{' '}
                            to manage your application settings.
                        </AlertDescription>
                    </Alert>

                    <Button
                        type='submit'
                        className='w-full bg-primary hover:bg-primary/90'>
                        Save Credentials
                    </Button>
                </form>
            </Form>
        </div>
    );
}

