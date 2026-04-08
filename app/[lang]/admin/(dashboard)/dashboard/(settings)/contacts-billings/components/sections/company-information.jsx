'use client';

import { updateCompanyInfo } from '@/app/_actions/settingsActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { EditableSelectField } from '../editable-select-field';
import { EditableTextField } from '../editable-text-field';

const companySizeOptions = [
    { label: '1-10 employees', value: '1-10' },
    { label: '11-50 employees', value: '11-50' },
    { label: '51-200 employees', value: '51-200' },
    { label: '201-500 employees', value: '201-500' },
    { label: '501-1000 employees', value: '501-1000' },
    { label: '1000+ employees', value: '1000+' },
];

const validationRules = {
    companyName: {
        required: 'Company name is required',
        minLength: { value: 2, message: 'Company name must be at least 2 characters' },
    },
    companyEmail: {
        required: 'Company email is required',
        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
    },
    companyWebsite: {
        pattern: { value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, message: 'Invalid website URL' },
    },
    companyVat: {
        pattern: { value: /^[A-Z]{2}[0-9A-Z]+$/, message: 'Invalid VAT number format' },
    },
};

const CompanyInformation = ({ data }) => {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const methods = useForm({
        defaultValues: {
            companyName: data?.companyName || '',
            companyEmail: data?.companyEmail || '',
            companyPhone: data?.companyPhone || '',
            companyWebsite: data?.companyWebsite || '',
            companyAddress: data?.companyAddress || '',
            companyCity: data?.companyCity || '',
            companyState: data?.companyState || '',
            companyZip: data?.companyZip || '',
            companyCountry: data?.companyCountry || '',
            companyVat: data?.companyVat || '',
            companySize: data?.companySize || '',
        },
    });

    const onSubmit = async (formData) => {
        try {
            setIsSaving(true);
            const result = await updateCompanyInfo(formData);

            if (result && !result.success) {
                toast.error(
                    typeof result.error === 'string'
                        ? result.error
                        : result.error?.message || 'An error occurred'
                );
                return;
            }

            toast.success('Company information saved successfully');
            router.refresh();
        } catch (error) {
            toast.error('Failed to save company information');
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
                            <HugeiconsIcon icon={Building03Icon} size={20} />
                            Company Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                            <EditableTextField
                                id='companyName'
                                label='Company Name'
                                control={methods.control}
                                editingField={null}
                                setEditingField={() => {}}
                                onSaveField={() => {}}
                                isSaving={isSaving}
                                validationRules={validationRules.companyName}
                                resetField={methods.resetField}
                                placeholder='Your Company Name'
                            />

                            <EditableTextField
                                id='companyEmail'
                                label='Company Email'
                                control={methods.control}
                                editingField={null}
                                setEditingField={() => {}}
                                onSaveField={() => {}}
                                isSaving={isSaving}
                                validationRules={validationRules.companyEmail}
                                resetField={methods.resetField}
                                placeholder='company@example.com'
                                type='email'
                            />

                            <EditableTextField
                                id='companyPhone'
                                label='Company Phone'
                                control={methods.control}
                                editingField={null}
                                setEditingField={() => {}}
                                onSaveField={() => {}}
                                isSaving={isSaving}
                                resetField={methods.resetField}
                                placeholder='Company Phone Number'
                            />

                            <EditableTextField
                                id='companyWebsite'
                                label='Company Website'
                                control={methods.control}
                                editingField={null}
                                setEditingField={() => {}}
                                onSaveField={() => {}}
                                isSaving={isSaving}
                                validationRules={validationRules.companyWebsite}
                                resetField={methods.resetField}
                                placeholder='https://company.com'
                            />

                            <EditableTextField
                                id='companyAddress'
                                label='Company Address'
                                control={methods.control}
                                editingField={null}
                                setEditingField={() => {}}
                                onSaveField={() => {}}
                                isSaving={isSaving}
                                resetField={methods.resetField}
                                placeholder='Street Address'
                            />

                            <EditableTextField
                                id='companyCity'
                                label='City'
                                control={methods.control}
                                editingField={null}
                                setEditingField={() => {}}
                                onSaveField={() => {}}
                                isSaving={isSaving}
                                resetField={methods.resetField}
                                placeholder='City'
                            />

                            <EditableTextField
                                id='companyState'
                                label='State/Province'
                                control={methods.control}
                                editingField={null}
                                setEditingField={() => {}}
                                onSaveField={() => {}}
                                isSaving={isSaving}
                                resetField={methods.resetField}
                                placeholder='State or Province'
                            />

                            <EditableTextField
                                id='companyZip'
                                label='ZIP/Postal Code'
                                control={methods.control}
                                editingField={null}
                                setEditingField={() => {}}
                                onSaveField={() => {}}
                                isSaving={isSaving}
                                resetField={methods.resetField}
                                placeholder='ZIP Code'
                            />

                            <EditableTextField
                                id='companyCountry'
                                label='Country'
                                control={methods.control}
                                editingField={null}
                                setEditingField={() => {}}
                                onSaveField={() => {}}
                                isSaving={isSaving}
                                resetField={methods.resetField}
                                placeholder='Country'
                            />

                            <EditableTextField
                                id='companyVat'
                                label='VAT Number'
                                control={methods.control}
                                editingField={null}
                                setEditingField={() => {}}
                                onSaveField={() => {}}
                                isSaving={isSaving}
                                validationRules={validationRules.companyVat}
                                resetField={methods.resetField}
                                placeholder='VAT123456789'
                            />

                            <EditableSelectField
                                id='companySize'
                                label='Company Size'
                                control={methods.control}
                                options={companySizeOptions}
                                editingField={null}
                                setEditingField={() => {}}
                                onSaveField={() => {}}
                                isSaving={isSaving}
                                resetField={methods.resetField}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className='flex justify-end mt-6 pt-6 border-t'>
                    <Button type='submit' disabled={isSaving} className='min-w-[150px]'>
                        {isSaving ? 'Saving...' : 'Save Company Info'}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default CompanyInformation;
