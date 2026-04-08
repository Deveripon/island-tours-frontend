'use client';

import { updateNotificationPreferences } from '@/app/_actions/settingsActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Notification01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { SwitchField } from '../switch-filed';

const NotificationPreference = ({ data }) => {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const { control } = useForm({
        defaultValues: {
            emailNotifications: data?.emailNotifications ?? true,
            smsNotifications: data?.smsNotifications ?? false,
            marketingEmails: data?.marketingEmails ?? false,
            securityAlerts: data?.securityAlerts ?? true,
            billingAlerts: data?.billingAlerts ?? true,
        },
    });

    const handleSaveField = async (fieldId, value) => {
        try {
            setIsSaving(true);
            const result = await updateNotificationPreferences({ [fieldId]: value });

            if (result && !result.success) {
                toast.error(
                    typeof result.error === 'string'
                        ? result.error
                        : result.error?.message || 'An error occurred'
                );
                return;
            }

            toast.success('Preference updated');
            router.refresh();
        } catch (error) {
            toast.error('Failed to update preference');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <HugeiconsIcon icon={Notification01Icon} size={20} />
                    Notification Preferences
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='space-y-4'>
                    <SwitchField
                        id='emailNotifications'
                        label='Email Notifications'
                        description='Receive notifications via email'
                        control={control}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                    />
                    <Separator />
                    <SwitchField
                        id='smsNotifications'
                        label='SMS Notifications'
                        description='Receive notifications via SMS'
                        control={control}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                    />
                    <Separator />
                    <SwitchField
                        id='marketingEmails'
                        label='Marketing Emails'
                        description='Receive marketing and promotional emails'
                        control={control}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                    />
                    <Separator />
                    <SwitchField
                        id='securityAlerts'
                        label='Security Alerts'
                        description='Receive security-related notifications'
                        control={control}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                    />
                    <Separator />
                    <SwitchField
                        id='billingAlerts'
                        label='Billing Alerts'
                        description='Receive billing and payment notifications'
                        control={control}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default NotificationPreference;
