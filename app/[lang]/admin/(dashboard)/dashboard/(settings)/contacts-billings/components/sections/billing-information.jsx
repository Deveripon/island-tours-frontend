'use client';

import { updateBillingInformation } from '@/app/_actions/settingsActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCardIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { EditableTextField } from '../editable-text-field';

const validationRules = {
    billingName: {
        required: 'Billing name is required',
    },
    billingEmail: {
        required: 'Billing email is required',
        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
    },
};

const BillingInformation = ({ data }) => {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const methods = useForm({
        defaultValues: {
            billingName: data?.billingName || '',
            billingEmail: data?.billingEmail || '',
            billingAddress: data?.billingAddress || '',
            billingCity: data?.billingCity || '',
            billingState: data?.billingState || '',
            billingZip: data?.billingZip || '',
            billingCountry: data?.billingCountry || '',
        },
    });

    const onSubmit = async (formData) => {
        try {
            setIsSaving(true);
            const result = await updateBillingInformation(formData);

            if (result && !result.success) {
                toast.error(
                    typeof result.error === 'string'
                        ? result.error
                        : result.error?.message || 'An error occurred'
                );
                return;
            }

            toast.success('Billing information saved successfully');
            router.refresh();
        } catch (error) {
            toast.error('Failed to save billing information');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className='space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <HugeiconsIcon icon={CreditCardIcon} size={20} />
                            Billing Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                            <EditableTextField
                                id='billingName'
                                label='Billing Name'
                                control={methods.control}
                                editingField={null}
                                setEditingField={() => {}}
                                onSaveField={() => {}}
                                isSaving={isSaving}
                                validationRules={validationRules.billingName}
                                resetField={methods.resetField}
                                placeholder='Name for billing'
                            />

                            <EditableTextField
                                id='billingEmail'
                                label='Billing Email'
                                control={methods.control}
                                editingField={null}
                                setEditingField={() => {}}
                                onSaveField={() => {}}
                                isSaving={isSaving}
                                validationRules={validationRules.billingEmail}
                                resetField={methods.resetField}
                                placeholder='billing@company.com'
                                type='email'
                            />

                            <EditableTextField
                                id='billingAddress'
                                label='Billing Address'
                                control={methods.control}
                                editingField={null}
                                setEditingField={() => {}}
                                onSaveField={() => {}}
                                isSaving={isSaving}
                                resetField={methods.resetField}
                                placeholder='Billing Street Address'
                            />

                            <EditableTextField
                                id='billingCity'
                                label='Billing City'
                                control={methods.control}
                                editingField={null}
                                setEditingField={() => {}}
                                onSaveField={() => {}}
                                isSaving={isSaving}
                                resetField={methods.resetField}
                                placeholder='Billing City'
                            />

                            <EditableTextField
                                id='billingState'
                                label='Billing State/Province'
                                control={methods.control}
                                editingField={null}
                                setEditingField={() => {}}
                                onSaveField={() => {}}
                                isSaving={isSaving}
                                resetField={methods.resetField}
                                placeholder='Billing State or Province'
                            />

                            <EditableTextField
                                id='billingZip'
                                label='Billing ZIP/Postal Code'
                                control={methods.control}
                                editingField={null}
                                setEditingField={() => {}}
                                onSaveField={() => {}}
                                isSaving={isSaving}
                                resetField={methods.resetField}
                                placeholder='Billing ZIP Code'
                            />

                            <EditableTextField
                                id='billingCountry'
                                label='Billing Country'
                                control={methods.control}
                                editingField={null}
                                setEditingField={() => {}}
                                onSaveField={() => {}}
                                isSaving={isSaving}
                                resetField={methods.resetField}
                                placeholder='Billing Country'
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className='flex justify-end mt-6 pt-6 border-t'>
                    <Button type='submit' disabled={isSaving} className='min-w-[150px]'>
                        {isSaving ? 'Saving...' : 'Save Billing Info'}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default BillingInformation;
