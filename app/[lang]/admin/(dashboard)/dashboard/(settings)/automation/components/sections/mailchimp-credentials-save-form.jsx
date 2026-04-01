'use client';

import { updateTenantMailchimpConfig } from '@/app/_actions/settingsActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaMailchimp } from 'react-icons/fa';
import { toast } from 'sonner';
import { z } from 'zod';

const mailchimpSchema = z.object({
    apiKey: z.string().min(1, 'API Key is required'),
    serverPrefix: z.string().min(1, 'Server Prefix is required'),
    audienceId: z.string().min(1, 'Audience ID is required'),
});

export default function MailchimpCredentialsSaveForm({
    tenant,
    mailchimpConfig,
}) {
    const [showApiKey, setShowApiKey] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(mailchimpSchema),
        defaultValues: {
            apiKey: mailchimpConfig?.tenantMailchimp?.apiKey || '',
            serverPrefix: mailchimpConfig?.tenantMailchimp?.serverPrefix || '',
            audienceId: mailchimpConfig?.tenantMailchimp?.audienceId || '',
        },
    });

    const onSubmit = async data => {
        try {
            const response = await updateTenantMailchimpConfig(tenant, data);
            console.log(`response`, response);

            if (response.success) {
                toast.success('Mailchimp configuration saved successfully!');
            } else {
                toast.error(
                    response.error ||
                        'Failed to save configuration. Please try again.'
                );
            }
        } catch (error) {
            toast.error('An unexpected error occurred.');
        }
    };

    return (
        <div className=''>
            <div className='bg-card border border-border rounded-lg shadow-sm p-6 w-full'>
                <div className='flex items-start gap-3 mb-6'>
                    <div className='p-2 bg-muted rounded-lg flex items-center justify-center'>
                        <FaMailchimp className='w-6 h-6' />
                    </div>
                    <div className='flex-1'>
                        <h1 className='text-lg font-semibold text-card-foreground mb-1'>
                            Mailchimp Configuration
                        </h1>
                        <p className='text-sm text-muted-foreground'>
                            Input your Mailchimp API key, server prefix, and
                            audience ID to connect your Mailchimp account.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div className='space-y-2'>
                        <Label htmlFor='api-key'>API Key</Label>
                        <div className='relative'>
                            <Input
                                id='api-key'
                                type={showApiKey ? 'text' : 'password'}
                                placeholder='eg: 57************f-us19'
                                {...register('apiKey')}
                                className={
                                    errors.apiKey
                                        ? 'border-destructive focus-visible:ring-destructive'
                                        : ''
                                }
                            />
                            <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                className='absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8'
                                onClick={() => setShowApiKey(!showApiKey)}>
                                {showApiKey ? (
                                    <HugeiconsIcon
                                        icon={ViewOffIcon}
                                        size={16}
                                    />
                                ) : (
                                    <HugeiconsIcon icon={ViewIcon} size={16} />
                                )}
                            </Button>
                        </div>
                        {errors.apiKey && (
                            <p className='text-[0.8rem] text-destructive'>
                                {errors.apiKey.message}
                            </p>
                        )}
                        <p className='text-[0.8rem] text-muted-foreground'>
                            You can find your API key in your Mailchimp account
                            settings under Extras &gt; API keys.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='server-prefix'>Server Prefix</Label>
                            <Input
                                id='server-prefix'
                                placeholder='e.g. us19'
                                className={`bg-background focus:ring-2 focus:ring-[#FFE01B]/50 ${errors.serverPrefix ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                {...register('serverPrefix')}
                            />
                            {errors.serverPrefix && (
                                <p className='text-[0.8rem] text-destructive'>
                                    {errors.serverPrefix.message}
                                </p>
                            )}
                            <p className='text-[0.8rem] text-muted-foreground'>
                                The server prefix is the part of your URL after
                                "https://" (e.g., us19).
                            </p>
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='audience-id'>Audience ID</Label>
                            <Input
                                id='audience-id'
                                placeholder='e.g. 123abc456'
                                className={`bg-background focus:ring-2 focus:ring-[#FFE01B]/50 ${errors.audienceId ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                {...register('audienceId')}
                            />
                            {errors.audienceId && (
                                <p className='text-[0.8rem] text-destructive'>
                                    {errors.audienceId.message}
                                </p>
                            )}
                            <p className='text-[0.8rem] text-muted-foreground'>
                                Find your Audience ID in Audience &gt; Settings
                                &gt; Audience name and defaults.
                            </p>
                        </div>
                    </div>

                    <div className='pt-4 flex justify-end'>
                        <Button
                            type='submit'
                            disabled={isSubmitting}
                            className='px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/80 transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed'>
                            {isSubmitting ? 'Saving...' : 'Save Configuration'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

