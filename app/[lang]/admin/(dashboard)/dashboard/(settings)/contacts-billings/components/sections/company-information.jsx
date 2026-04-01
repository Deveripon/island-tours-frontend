'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { EditableSelectField } from '../editable-select-field';
import { EditableTextField } from '../editable-text-field';

const CompanyInformation = ({
    control,
    editingField,
    setEditingField,
    handleSaveField,
    isSaving,
    resetField,
    formValidationRules,
    companySizeOptions }) => {
    return (
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
                        control={control}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        validationRules={formValidationRules.companyName}
                        resetField={resetField}
                        placeholder='Your Company Name'
                    />

                    <EditableTextField
                        id='companyEmail'
                        label='Company Email'
                        control={control}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        validationRules={formValidationRules.companyEmail}
                        resetField={resetField}
                        placeholder='company@example.com'
                        type='email'
                    />

                    <EditableTextField
                        id='companyPhone'
                        label='Company Phone'
                        control={control}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        resetField={resetField}
                        placeholder='Company Phone Number'
                    />

                    <EditableTextField
                        id='companyWebsite'
                        label='Company Website'
                        control={control}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        validationRules={formValidationRules.companyWebsite}
                        resetField={resetField}
                        placeholder='https://company.com'
                    />

                    <EditableTextField
                        id='companyAddress'
                        label='Company Address'
                        control={control}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        resetField={resetField}
                        placeholder='Street Address'
                    />

                    <EditableTextField
                        id='companyCity'
                        label='City'
                        control={control}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        resetField={resetField}
                        placeholder='City'
                    />

                    <EditableTextField
                        id='companyState'
                        label='State/Province'
                        control={control}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        resetField={resetField}
                        placeholder='State or Province'
                    />

                    <EditableTextField
                        id='companyZip'
                        label='ZIP/Postal Code'
                        control={control}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        resetField={resetField}
                        placeholder='ZIP Code'
                    />

                    <EditableTextField
                        id='companyCountry'
                        label='Country'
                        control={control}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        resetField={resetField}
                        placeholder='Country'
                    />

                    <EditableTextField
                        id='companyVat'
                        label='VAT Number'
                        control={control}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        validationRules={formValidationRules.companyVat}
                        resetField={resetField}
                        placeholder='VAT123456789'
                    />

                    <EditableSelectField
                        id='companySize'
                        label='Company Size'
                        control={control}
                        options={companySizeOptions}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        resetField={resetField}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default CompanyInformation;
