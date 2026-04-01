import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { EditableTextAreaField } from '../../../../(user)/profile/components/editable-textarea-filed';
import BookingFormSelection from '../booking-form-selection';

import { EditableTextField } from '../../../../(user)/profile/components/editable-text-field';
import FAQSection from '../faq-adding-section';
import InstagramSection from '../instagram-section';
import PartnerSection from '../partner-section';
const SiteInformation = ({
    control,
    editingField,
    setEditingField,
    handleSaveField,
    isSaving,
    resetField,
    formValidationRules }) => {
    return (
        <div className='space-y-3'>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <HugeiconsIcon icon={Globe02Icon} size={20} />
                        Site Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                        <EditableTextField
                            id='siteName'
                            label='Site Name'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={formValidationRules.siteName}
                            resetField={resetField}
                            placeholder='Your Travel Agency Name'
                        />

                        <EditableTextField
                            id='siteTagline'
                            label='Site Tagline'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={formValidationRules.siteTagline}
                            resetField={resetField}
                            placeholder='Your Journey Begins Here'
                        />

                        <div className='lg:col-span-2'>
                            <EditableTextAreaField
                                id='siteDescription'
                                label='Site Description'
                                control={control}
                                editingField={editingField}
                                setEditingField={setEditingField}
                                onSaveField={handleSaveField}
                                isSaving={isSaving}
                                validationRules={
                                    formValidationRules.siteDescription
                                }
                                resetField={resetField}
                                placeholder='Describe your B2B travel agency services...'
                                rows={4}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <BookingFormSelection
                control={control}
                isSaving={isSaving}
                resetField={resetField}
                handleSaveField={handleSaveField}
                setEditingField={setEditingField}
                editingField={editingField}
                formValidationRules={formValidationRules}
            />
            <FAQSection
                control={control}
                isSaving={isSaving}
                resetField={resetField}
                handleSaveField={handleSaveField}
                setEditingField={setEditingField}
                editingField={editingField}
            />

            <PartnerSection
                control={control}
                isSaving={isSaving}
                resetField={resetField}
                handleSaveField={handleSaveField}
                setEditingField={setEditingField}
                editingField={editingField}
            />
            {/* Instagram Integration Section */}
            <InstagramSection
                control={control}
                isSaving={isSaving}
                resetField={resetField}
                handleSaveField={handleSaveField}
                setEditingField={setEditingField}
                editingField={editingField}
            />
        </div>
    );
};

export default SiteInformation;
