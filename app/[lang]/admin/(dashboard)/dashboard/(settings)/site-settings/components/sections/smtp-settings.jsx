import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail01Icon, ServerStack03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateSMTPConfig } from '@/app/_actions/settingsActions';
import { EditableSelectField } from '../../../../(user)/profile/components/editable-select-field';
import { EditableTextField } from '../../../../(user)/profile/components/editable-text-field';

const SMTPSettings = ({ data, validationRules }) => {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const methods = useForm({
        defaultValues: {
            smtpHost: data?.smtpHost || '',
            smtpPort: data?.smtpPort || '',
            smtpUsername: data?.smtpUsername || '',
            smtpPassword: data?.smtpPassword || '',
            smtpSecure: data?.smtpSecure ?? true,
        },
    });

    const onSubmit = async (formData) => {
        try {
            setIsSaving(true);
            const result = await updateSMTPConfig({
                smtpHost: formData.smtpHost,
                smtpPort: formData.smtpPort,
                smtpUsername: formData.smtpUsername,
                smtpPassword: formData.smtpPassword,
                smtpSecure: formData.smtpSecure,
            });

            if (result && !result.success) {
                toast.error(typeof result.error === 'string' ? result.error : result.error?.message || 'An error occurred');
                return;
            }

            toast.success('SMTP settings saved successfully');
            router.refresh();
        } catch (error) {
            toast.error('Failed to save SMTP settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveField = async (fieldId, explicitValue = null) => {
        try {
            const value = explicitValue !== null ? explicitValue : methods.getValues(fieldId);
            const result = await updateSMTPConfig({ [fieldId]: value });
            if (result && !result.success) { toast.error(typeof result.error === 'string' ? result.error : result.error?.message || 'An error occurred'); return; }
            toast.success('Updated successfully');
            router.refresh();
        } catch (e) { toast.error('Failed to update'); }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className='space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <HugeiconsIcon icon={Mail01Icon} size={20} />
                            SMTP Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-6'>
                            <div>
                                <h4 className='text-sm font-medium text-gray-900 mb-4 flex items-center gap-2'>
                                    <HugeiconsIcon icon={ServerStack03Icon} size={16} />
                                    SMTP Configuration
                                </h4>
                                <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                                    <EditableTextField
                                        id='smtpHost'
                                        label='SMTP Host'
                                        control={methods.control}
                                        editingField={null}
                                        setEditingField={() => {}}
                                        onSaveField={handleSaveField}
                                        isSaving={isSaving}
                                        validationRules={validationRules?.smtpHost}
                                        resetField={methods.resetField}
                                        placeholder='smtp.gmail.com'
                                    />
                                    <EditableTextField
                                        id='smtpPort'
                                        label='SMTP Port'
                                        control={methods.control}
                                        editingField={null}
                                        setEditingField={() => {}}
                                        onSaveField={handleSaveField}
                                        isSaving={isSaving}
                                        validationRules={validationRules?.smtpPort}
                                        resetField={methods.resetField}
                                        placeholder='587'
                                    />
                                    <EditableTextField
                                        id='smtpUsername'
                                        label='SMTP Username'
                                        control={methods.control}
                                        editingField={null}
                                        setEditingField={() => {}}
                                        onSaveField={handleSaveField}
                                        isSaving={isSaving}
                                        validationRules={validationRules?.smtpUsername}
                                        resetField={methods.resetField}
                                        placeholder='your-email@domain.com'
                                    />
                                    <EditableTextField
                                        id='smtpPassword'
                                        label='SMTP Password'
                                        control={methods.control}
                                        editingField={null}
                                        setEditingField={() => {}}
                                        onSaveField={handleSaveField}
                                        isSaving={isSaving}
                                        validationRules={validationRules?.smtpPassword}
                                        resetField={methods.resetField}
                                        placeholder='••••••••'
                                    />
                                    <EditableSelectField
                                        id='smtpSecure'
                                        label='Use TLS/SSL'
                                        control={methods.control}
                                        options={[
                                            { value: true, label: 'Yes (TLS/SSL)' },
                                            { value: false, label: 'No' },
                                        ]}
                                        editingField={null}
                                        setEditingField={() => {}}
                                        onSaveField={handleSaveField}
                                        isSaving={isSaving}
                                        resetField={methods.resetField}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className='flex justify-end mt-6 pt-6 border-t'>
                    <Button type='submit' disabled={isSaving} className='min-w-[150px]'>
                        {isSaving ? 'Saving...' : 'Save SMTP Settings'}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default SMTPSettings;
