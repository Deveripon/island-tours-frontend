import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { updateSiteInfo } from '@/app/_actions/settingsActions';

import { EditableTextAreaField } from '../../../../(user)/profile/components/editable-textarea-filed';
import BookingFormSelection from '../booking-form-selection';
import { EditableTextField } from '../../../../(user)/profile/components/editable-text-field';
import FAQSection from '../faq-adding-section';
import InstagramSection from '../instagram-section';
import PartnerSection from '../partner-section';

const SiteInformation = ({ data, validationRules }) => {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const methods = useForm({
        defaultValues: {
            siteName: data?.siteName || '',
            siteTagline: data?.siteTagline || '',
            siteDescription: data?.siteDescription || '',
            bookingForm: data?.bookingForm || 'v2',
            faqs: data?.faqs || [],
            enableWhatsappChat: data?.enableWhatsappChat || false,
            whatsappNumber: data?.whatsappNumber || '',
            partners: data?.partners || [],
            instagramWidgetId: data?.instagramWidgetId || '',
            enableInstagram: data?.enableInstagram || false,
        },
    });

    const onSubmit = async (formData) => {
        try {
            setIsSaving(true);
            const result = await updateSiteInfo({
                siteName: formData.siteName,
                siteTagline: formData.siteTagline,
                siteDescription: formData.siteDescription,
                bookingForm: formData.bookingForm,
                enableWhatsappChat: formData.enableWhatsappChat,
                whatsappNumber: formData.whatsappNumber,
                faqs: formData.faqs,
                partners: formData.partners,
                instagramWidgetId: formData.instagramWidgetId,
                enableInstagram: formData.enableInstagram,
            });

            if (result && !result.success) {
                toast.error(typeof result.error === 'string' ? result.error : result.error?.message || 'An error occurred');
                return;
            }

            toast.success('General settings saved successfully');
            router.refresh();
        } catch (error) {
            toast.error('Failed to save general settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveField = async (fieldId, explicitValue = null) => {
        try {
            const value = explicitValue !== null ? explicitValue : methods.getValues(fieldId);
            const result = await updateSiteInfo({ [fieldId]: value });
            if (result && !result.success) {
                toast.error(typeof result.error === 'string' ? result.error : result.error?.message || 'An error occurred');
                return;
            }
            toast.success('Updated successfully');
            router.refresh();
        } catch(error) {
            toast.error('Failed to update');
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className='space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <HugeiconsIcon icon={Globe02Icon} size={20} />
                            Site Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4'>
                            <EditableTextField
                                id='siteName'
                                label='Site Name'
                                control={methods.control}
                                editingField={null}
                                setEditingField={() => {}}
                                onSaveField={handleSaveField}
                                isSaving={isSaving}
                                validationRules={validationRules?.siteName}
                                resetField={methods.resetField}
                                placeholder='Your Travel Agency Name'
                            />

                            <EditableTextField
                                id='siteTagline'
                                label='Site Tagline'
                                control={methods.control}
                                editingField={null}
                                setEditingField={() => {}}
                                onSaveField={handleSaveField}
                                isSaving={isSaving}
                                validationRules={validationRules?.siteTagline}
                                resetField={methods.resetField}
                                placeholder='Your Journey Begins Here'
                            />

                            <div className='lg:col-span-2'>
                                <EditableTextAreaField
                                    id='siteDescription'
                                    label='Site Description'
                                    control={methods.control}
                                    editingField={null}
                                    setEditingField={() => {}}
                                    onSaveField={handleSaveField}
                                    isSaving={isSaving}
                                    validationRules={validationRules?.siteDescription}
                                    resetField={methods.resetField}
                                    placeholder='Describe your B2B travel agency services...'
                                    rows={4}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <BookingFormSelection
                    control={methods.control}
                    isSaving={isSaving}
                    resetField={methods.resetField}
                    handleSaveField={handleSaveField}
                    setEditingField={() => {}}
                    editingField={null}
                    formValidationRules={validationRules}
                />
                
                <FAQSection
                    control={methods.control}
                    isSaving={isSaving}
                    resetField={methods.resetField}
                    handleSaveField={handleSaveField}
                    setEditingField={() => {}}
                    editingField={null}
                />

                <PartnerSection
                    control={methods.control}
                    isSaving={isSaving}
                    resetField={methods.resetField}
                    handleSaveField={handleSaveField}
                    setEditingField={() => {}}
                    editingField={null}
                />
                
                <InstagramSection
                    control={methods.control}
                    isSaving={isSaving}
                    resetField={methods.resetField}
                    handleSaveField={handleSaveField}
                    setEditingField={() => {}}
                    editingField={null}
                />

                <div className='flex justify-end mt-6 pt-6 border-t'>
                    <Button type='submit' disabled={isSaving} className='min-w-[150px]'>
                        {isSaving ? 'Saving...' : 'Save All General Changes'}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default SiteInformation;
