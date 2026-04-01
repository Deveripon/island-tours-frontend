'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Notification01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { SwitchField } from '../switch-filed';

const NotificationPreference = ({ control, handleSaveField, isSaving }) => {
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

