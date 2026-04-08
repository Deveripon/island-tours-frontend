'use client';

import { updateWebhooks } from '@/app/_actions/settingsActions';
import { Button } from '@/components/ui/button';
import { Upload01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function N8nWebhookSetup({ existingN8nCatchUrl }) {
    const [n8nUrl, setn8nUrl] = useState(existingN8nCatchUrl || '');
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    const webhookConfig = {
        id: 'leads',
        title: 'Push Leads via n8n',
        icon: 'Zap',
        description:
            'Save catch hooks to push leads through n8n from your Database',

        instructions: [
            'Create a new n8n workflow',
            'Choose "Webhooks" as the trigger',
            'Select "POST" as the HTTP Method',
            'Copy the webhook URL provided by n8n',
            'Paste it below and click "Save URL"',
        ],
    };

    const handleSaveUrl = async () => {
        if (!n8nUrl.trim()) return;
        setIsSaving(true);
        setSaveStatus(null);

        try {
            const response = await updateWebhooks({
                type: 'n8n_leads_catch_url',
                url: n8nUrl.trim(),
            });

            if (response.success) {
                setSaveStatus('success');
                setTimeout(() => setSaveStatus(null), 3000);
                toast.success('n8n URL saved successfully!');
            } else {
                setSaveStatus('error');
                toast.error(
                    typeof response.error === 'string'
                        ? response.error
                        : response.error?.message || 'Failed to save n8n URL. Please try again.'
                );
            }
        } catch (error) {
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className=''>
            <div className='bg-card border border-border rounded-lg shadow-sm p-6 w-full'>
                <div className='flex items-start gap-3 mb-6'>
                    <div className='p-2 bg-muted rounded-lg'>
                        <HugeiconsIcon
                            icon={Upload01Icon}
                            className='w-5 h-5 text-muted-foreground'
                        />
                    </div>
                    <div className='flex-1'>
                        <h1 className='text-lg font-semibold text-card-foreground mb-1'>
                            {webhookConfig.title}
                        </h1>
                        <p className='text-sm text-muted-foreground'>
                            {webhookConfig.description}
                        </p>
                    </div>
                </div>

                <div className='space-y-6'>
                    <div>
                        <h3 className='text-md font-medium text-muted-foreground mb-3'>
                            Setup Instructions
                        </h3>
                        <ol className='space-y-2'>
                            {webhookConfig.instructions.map(
                                (instruction, index) => (
                                    <li
                                        key={index}
                                        className='flex gap-3 text-sm text-muted-foreground'>
                                        <span className='flex-shrink-0 w-5 h-5 flex items-center justify-center bg-muted rounded-full text-xs font-medium text-foreground'>
                                            {index + 1}
                                        </span>
                                        <span className='pt-0.5'>
                                            {instruction}
                                        </span>
                                    </li>
                                )
                            )}
                        </ol>
                    </div>

                    <div className='border-t border-border pt-6'>
                        <label className='block text-sm font-medium text-muted-foreground mb-2'>
                            Your n8n Webhook URL
                        </label>
                        <div className='flex gap-2'>
                            <input
                                type='url'
                                value={n8nUrl}
                                onChange={e => setn8nUrl(e.target.value)}
                                placeholder='https://username.n8n.cloud/webhook/fec89872-bd92-4f5...'
                                className='flex-1 px-3 py-2 border border-input bg-background rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                            />
                            <Button
                                onClick={handleSaveUrl}
                                disabled={isSaving || !n8nUrl.trim()}
                                className='px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/80 transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed'>
                                {isSaving ? 'Saving...' : 'Save URL'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

