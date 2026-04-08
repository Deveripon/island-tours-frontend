import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateSiteSeo } from '@/app/_actions/settingsActions';
import { EditableSelectField } from '../../../../(user)/profile/components/editable-select-field';
import { EditableTextField } from '../../../../(user)/profile/components/editable-text-field';
import { EditableTextAreaField } from '../../../../(user)/profile/components/editable-textarea-filed';
import { ImageUploadWithSelector } from '../../../../components/common/image-upload-selector';

const robotsMetaOptions = [
    { label: 'Index, Follow', value: 'index, follow' },
    { label: 'No Index, Follow', value: 'noindex, follow' },
    { label: 'Index, No Follow', value: 'index, nofollow' },
    { label: 'No Index, No Follow', value: 'noindex, nofollow' },
];

const isValidImageObject = value =>
    value && typeof value === 'object' && (value.imageId || value.id);

const SeoInformation = ({ data, validationRules }) => {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const methods = useForm({
        defaultValues: {
            metaTitle: data?.metaTitle || '',
            metaDescription: data?.metaDescription || '',
            metaKeywords: data?.metaKeywords || '',
            canonicalUrl: data?.canonicalUrl || '',
            robotsMeta: data?.robotsMeta || 'index, follow',
            ogTitle: data?.ogTitle || '',
            ogDescription: data?.ogDescription || '',
            ogImage: data?.ogImage || '',
            twitterTitle: data?.twitterTitle || '',
            twitterDescription: data?.twitterDescription || '',
            twitterImage: data?.twitterImage || '',
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

    const onSubmit = async formData => {
        const payload = {
            metaTitle: formData.metaTitle,
            metaDescription: formData.metaDescription,
            metaKeywords: formData.metaKeywords,
            ogTitle: formData.ogTitle,
            ogDescription: formData.ogDescription,
            ogImage: formData.ogImage,
            twitterTitle: formData.twitterTitle,
            twitterDescription: formData.twitterDescription,
            twitterImage: formData.twitterImage,
            canonicalUrl: formData.canonicalUrl,
            robotsMeta: formData.robotsMeta,
            googleAnalyticsId: formData.googleAnalyticsId,
            googleTagManagerId: formData.googleTagManagerId,
            googleSearchConsole: formData.googleSearchConsole,
            facebookPixelId: formData.facebookPixelId,
            schemaType: formData.schemaType,
            customSchema: formData.customSchema,
            autoGenerateSitemap: formData.autoGenerateSitemap,
            robotsTxt: formData.robotsTxt,
        };
        if (!isValidImageObject(formData.ogImage)) delete payload.ogImage;
        if (!isValidImageObject(formData.twitterImage))
            delete payload.twitterImage;

        try {
            setIsSaving(true);
            console.log(`payload`, JSON.stringify(payload, null, 2));

            const seoRes = await updateSiteSeo(payload);

            if (seoRes && !seoRes.success) {
                toast.error(
                    typeof seoRes.error === 'string'
                        ? seoRes.error
                        : seoRes.error?.message || 'An error occurred'
                );
                return;
            }

            toast.success('SEO settings saved successfully');
            router.refresh();
        } catch (error) {
            toast.error('Failed to save SEO settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveField = async (fieldId, explicitValue = null) => {
        try {
            const value =
                explicitValue !== null
                    ? explicitValue
                    : methods.getValues(fieldId);
            if (
                (fieldId === 'ogImage' || fieldId === 'twitterImage') &&
                !isValidImageObject(value)
            ) {
                toast.error('Please select a valid image first');
                return;
            }
            const result = await updateSiteSeo({ [fieldId]: value });
            if (result && !result.success) {
                toast.error(
                    typeof result.error === 'string'
                        ? result.error
                        : result.error?.message || 'An error occurred'
                );
                return;
            }
            toast.success('Updated successfully');
            router.refresh();
        } catch (e) {
            toast.error('Failed to update');
        }
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className='space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <HugeiconsIcon icon={Search01Icon} size={20} />
                            SEO Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-6'>
                            <div>
                                <h4 className='text-sm font-medium text-gray-900 mb-4'>
                                    Basic SEO
                                </h4>
                                <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                                    <div className='lg:col-span-2'>
                                        <EditableTextField
                                            id='metaTitle'
                                            label='Meta Title'
                                            control={methods.control}
                                            editingField={null}
                                            setEditingField={() => {}}
                                            onSaveField={handleSaveField}
                                            isSaving={isSaving}
                                            validationRules={
                                                validationRules?.metaTitle
                                            }
                                            resetField={methods.resetField}
                                            placeholder='SEO Title (60 chars max)'
                                        />
                                    </div>
                                    <div className='lg:col-span-2'>
                                        <EditableTextAreaField
                                            id='metaDescription'
                                            label='Meta Description'
                                            control={methods.control}
                                            editingField={null}
                                            setEditingField={() => {}}
                                            onSaveField={handleSaveField}
                                            isSaving={isSaving}
                                            validationRules={
                                                validationRules?.metaDescription
                                            }
                                            resetField={methods.resetField}
                                            placeholder='SEO Description (160 chars max)'
                                            rows={3}
                                        />
                                    </div>

                                    <div className='lg:col-span-2'>
                                        <EditableTextField
                                            id='metaKeywords'
                                            label='Meta Keywords'
                                            control={methods.control}
                                            editingField={null}
                                            setEditingField={() => {}}
                                            onSaveField={handleSaveField}
                                            isSaving={isSaving}
                                            validationRules={
                                                validationRules?.metaKeywords
                                            }
                                            resetField={methods.resetField}
                                            placeholder='travel, b2b, agency, business travel'
                                        />
                                    </div>

                                    <EditableTextField
                                        id='canonicalUrl'
                                        label='Canonical URL'
                                        control={methods.control}
                                        editingField={null}
                                        setEditingField={() => {}}
                                        onSaveField={handleSaveField}
                                        isSaving={isSaving}
                                        validationRules={
                                            validationRules?.canonicalUrl
                                        }
                                        resetField={methods.resetField}
                                        placeholder='https://yourdomain.com'
                                    />

                                    <EditableSelectField
                                        id='robotsMeta'
                                        label='Robots Meta'
                                        control={methods.control}
                                        options={robotsMetaOptions || []}
                                        editingField={null}
                                        setEditingField={() => {}}
                                        onSaveField={handleSaveField}
                                        isSaving={isSaving}
                                        resetField={methods.resetField}
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h4 className='text-sm font-medium text-gray-900 mb-4'>
                                    Open Graph (Facebook)
                                </h4>
                                <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                                    <EditableTextField
                                        id='ogTitle'
                                        label='OG Title'
                                        control={methods.control}
                                        editingField={null}
                                        setEditingField={() => {}}
                                        onSaveField={handleSaveField}
                                        isSaving={isSaving}
                                        validationRules={
                                            validationRules?.ogTitle
                                        }
                                        resetField={methods.resetField}
                                        placeholder='Facebook share title (95 chars max)'
                                    />

                                    <div className='flex flex-col space-y-4'>
                                        <FormField
                                            control={methods.control}
                                            name='ogImage'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        OG Image
                                                    </FormLabel>
                                                    <FormControl>
                                                        <ImageUploadWithSelector
                                                            fieldName='ogImage'
                                                            onChange={val => {
                                                                field.onChange(
                                                                    val
                                                                );
                                                            }}
                                                            multiple={false}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Facebook share image
                                                        (1200x630 px)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className='lg:col-span-2'>
                                        <EditableTextAreaField
                                            id='ogDescription'
                                            label='OG Description'
                                            control={methods.control}
                                            editingField={null}
                                            setEditingField={() => {}}
                                            onSaveField={handleSaveField}
                                            isSaving={isSaving}
                                            validationRules={
                                                validationRules?.ogDescription
                                            }
                                            resetField={methods.resetField}
                                            placeholder='Facebook share description (200 chars max)'
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h4 className='text-sm font-medium text-gray-900 mb-4'>
                                    Twitter Cards
                                </h4>
                                <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                                    <EditableTextField
                                        id='twitterTitle'
                                        label='Twitter Title'
                                        control={methods.control}
                                        editingField={null}
                                        setEditingField={() => {}}
                                        onSaveField={handleSaveField}
                                        isSaving={isSaving}
                                        validationRules={
                                            validationRules?.twitterTitle
                                        }
                                        resetField={methods.resetField}
                                        placeholder='Twitter share title (70 chars max)'
                                    />

                                    <div className='flex flex-col space-y-4'>
                                        <FormField
                                            control={methods.control}
                                            name='twitterImage'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Twitter Image
                                                    </FormLabel>
                                                    <FormControl>
                                                        <ImageUploadWithSelector
                                                            fieldName='twitterImage'
                                                            onChange={val => {
                                                                field.onChange(
                                                                    val
                                                                );
                                                            }}
                                                            multiple={false}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Twitter share image
                                                        (1200x675 px)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className='lg:col-span-2'>
                                        <EditableTextAreaField
                                            id='twitterDescription'
                                            label='Twitter Description'
                                            control={methods.control}
                                            editingField={null}
                                            setEditingField={() => {}}
                                            onSaveField={handleSaveField}
                                            isSaving={isSaving}
                                            validationRules={
                                                validationRules?.twitterDescription
                                            }
                                            resetField={methods.resetField}
                                            placeholder='Twitter share description (200 chars max)'
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className='flex justify-end mt-6 pt-6 border-t'>
                    <Button
                        type='submit'
                        disabled={isSaving}
                        className='min-w-[150px]'>
                        {isSaving ? 'Saving...' : 'Save All SEO Changes'}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default SeoInformation;

