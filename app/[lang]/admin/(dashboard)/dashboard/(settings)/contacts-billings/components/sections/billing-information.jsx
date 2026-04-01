'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCardIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { EditableTextField } from '../editable-text-field';

const BillingInformation = ({
    control,
    editingField,
    setEditingField,
    handleSaveField,
    isSaving,
    resetField,
    formValidationRules }) => {
    return (
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
                        control={control}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        validationRules={formValidationRules.billingName}
                        resetField={resetField}
                        placeholder='Name for billing'
                    />

                    <EditableTextField
                        id='billingEmail'
                        label='Billing Email'
                        control={control}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        validationRules={formValidationRules.billingEmail}
                        resetField={resetField}
                        placeholder='billing@company.com'
                        type='email'
                    />

                    <EditableTextField
                        id='billingAddress'
                        label='Billing Address'
                        control={control}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        resetField={resetField}
                        placeholder='Billing Street Address'
                    />

                    <EditableTextField
                        id='billingCity'
                        label='Billing City'
                        control={control}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        resetField={resetField}
                        placeholder='Billing City'
                    />

                    <EditableTextField
                        id='billingState'
                        label='Billing State/Province'
                        control={control}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        resetField={resetField}
                        placeholder='Billing State or Province'
                    />

                    <EditableTextField
                        id='billingZip'
                        label='Billing ZIP/Postal Code'
                        control={control}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        resetField={resetField}
                        placeholder='Billing ZIP Code'
                    />

                    <EditableTextField
                        id='billingCountry'
                        label='Billing Country'
                        control={control}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        resetField={resetField}
                        placeholder='Billing Country'
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default BillingInformation;
