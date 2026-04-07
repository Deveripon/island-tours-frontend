import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TradeUpIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateSiteSeo } from '@/app/_actions/settingsActions';
import { EditableSelectField } from '../../../../(user)/profile/components/editable-select-field';
import { EditableTextField } from '../../../../(user)/profile/components/editable-text-field';
import { EditableTextAreaField } from '../../../../(user)/profile/components/editable-textarea-filed';

const AdvancedSeo = ({ data, validationRules }) => {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const methods = useForm({
        defaultValues: {
            googleAnalyticsId: data?.googleAnalyticsId || '',
            googleTagManagerId: data?.googleTagManagerId || '',
            googleSearchConsole: data?.googleSearchConsole || '',
            facebookPixelId: data?.facebookPixelId || '',
            schemaType: data?.schemaType || 'organization',
            customSchema: data?.customSchema || '',
            autoGenerateSitemap: data?.autoGenerateSitemap || 'enabled',
            robotsTxt: data?.robotsTxt || '',
        },
    });

    const onSubmit = async (formData) => {
        try {
            setIsSaving(true);
            const seoRes = await updateSiteSeo({
                googleAnalyticsId: formData.googleAnalyticsId,
                googleTagManagerId: formData.googleTagManagerId,
                googleSearchConsole: formData.googleSearchConsole,
                facebookPixelId: formData.facebookPixelId,
                schemaType: formData.schemaType,
                customSchema: formData.customSchema,
                autoGenerateSitemap: formData.autoGenerateSitemap,
                robotsTxt: formData.robotsTxt,
            });

            if (seoRes && !seoRes.success) {
                toast.error(typeof seoRes.error === 'string' ? seoRes.error : (seoRes.error?.message || 'An error occurred'));
                return;
            }

            toast.success('Advanced SEO settings saved successfully');
            router.refresh();
        } catch (error) {
            toast.error('Failed to save Advanced SEO settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveField = async (fieldId, explicitValue = null) => {
        try {
            const value = explicitValue !== null ? explicitValue : methods.getValues(fieldId);
            const result = await updateSiteSeo({ [fieldId]: value });
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
                            <HugeiconsIcon icon={TradeUpIcon} size={20} />
                            Advanced SEO
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-6'>
                            <div>
                                <h4 className='text-sm font-medium text-gray-900 mb-4'>
                                    Analytics & Tracking
                                </h4>
                                <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                                    <EditableTextField
                                        id='googleAnalyticsId'
                                        label='Google Analytics ID'
                                        control={methods.control}
                                        editingField={null}
                                        setEditingField={() => {}}
                                        onSaveField={handleSaveField}
                                        isSaving={isSaving}
                                        validationRules={validationRules?.googleAnalyticsId}
                                        resetField={methods.resetField}
                                        placeholder='G-XXXXXXXXXX'
                                    />
                                    <EditableTextField
                                        id='googleTagManagerId'
                                        label='Google Tag Manager ID'
                                        control={methods.control}
                                        editingField={null}
                                        setEditingField={() => {}}
                                        onSaveField={handleSaveField}
                                        isSaving={isSaving}
                                        validationRules={validationRules?.googleTagManagerId}
                                        resetField={methods.resetField}
                                        placeholder='GTM-XXXXXXX'
                                    />
                                    <EditableTextField
                                        id='googleSearchConsole'
                                        label='Search Console Verification'
                                        control={methods.control}
                                        editingField={null}
                                        setEditingField={() => {}}
                                        onSaveField={handleSaveField}
                                        isSaving={isSaving}
                                        validationRules={validationRules?.googleSearchConsole}
                                        resetField={methods.resetField}
                                        placeholder='Verification meta tag content'
                                    />
                                    <EditableTextField
                                        id='facebookPixelId'
                                        label='Facebook Pixel ID'
                                        control={methods.control}
                                        editingField={null}
                                        setEditingField={() => {}}
                                        onSaveField={handleSaveField}
                                        isSaving={isSaving}
                                        validationRules={validationRules?.facebookPixelId}
                                        resetField={methods.resetField}
                                        placeholder='Facebook Pixel ID'
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h4 className='text-sm font-medium text-gray-900 mb-4'>
                                    Structured Data
                                </h4>
                                <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                                    <EditableSelectField
                                        id='schemaType'
                                        label='Organization Schema'
                                        control={methods.control}
                                        options={[
                                            { label: 'Disabled', value: 'disabled' },
                                            { label: 'Organization', value: 'organization' },
                                            { label: 'Local Business', value: 'local_business' },
                                            { label: 'Travel Agency', value: 'travel_agency' },
                                        ]}
                                        editingField={null}
                                        setEditingField={() => {}}
                                        onSaveField={handleSaveField}
                                        isSaving={isSaving}
                                        resetField={methods.resetField}
                                    />
                                    <div className='lg:col-span-2'>
                                        <EditableTextAreaField
                                            id='customSchema'
                                            label='Custom Schema JSON-LD'
                                            control={methods.control}
                                            editingField={null}
                                            setEditingField={() => {}}
                                            onSaveField={handleSaveField}
                                            isSaving={isSaving}
                                            validationRules={validationRules?.customSchema}
                                            resetField={methods.resetField}
                                            placeholder='Add custom JSON-LD structured data'
                                            rows={12}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h4 className='text-sm font-medium text-gray-900 mb-4'>
                                    Sitemap & Robots
                                </h4>
                                <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                                    <EditableSelectField
                                        id='autoGenerateSitemap'
                                        label='Auto-Generate Sitemap'
                                        control={methods.control}
                                        options={[
                                            { label: 'Enabled', value: 'enabled' },
                                            { label: 'Disabled', value: 'disabled' },
                                        ]}
                                        editingField={null}
                                        setEditingField={() => {}}
                                        onSaveField={handleSaveField}
                                        isSaving={isSaving}
                                        resetField={methods.resetField}
                                    />
                                    <div className='lg:col-span-2'>
                                        <EditableTextAreaField
                                            id='robotsTxt'
                                            label='Custom Robots.txt Rules'
                                            control={methods.control}
                                            editingField={null}
                                            setEditingField={() => {}}
                                            onSaveField={handleSaveField}
                                            isSaving={isSaving}
                                            validationRules={validationRules?.robotsTxt}
                                            resetField={methods.resetField}
                                            placeholder='Add custom robots.txt directives'
                                            rows={12}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className='flex justify-end mt-6 pt-6 border-t'>
                    <Button type='submit' disabled={isSaving} className='min-w-[150px]'>
                        {isSaving ? 'Saving...' : 'Save All Advanced SEO Changes'}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default AdvancedSeo;
