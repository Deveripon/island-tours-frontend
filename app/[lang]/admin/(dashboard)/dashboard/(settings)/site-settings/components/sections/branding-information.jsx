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
import { PaintBoardIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateSiteInfo, updateSiteTheme } from '@/app/_actions/settingsActions';
import { ImageUploadWithSelector } from '../../../../components/common/image-upload-selector';
import { ColorPickerField } from '../../../../(user)/profile/components/color-picker-field';

const BrandingInformation = ({ data, siteInfo, validationRules }) => {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const methods = useForm({
        defaultValues: {
            logo: siteInfo?.logo || '',
            favicon: siteInfo?.favicon || '',
            primaryColor: data?.primaryColor || '#3b82f6',
            secondaryColor: data?.secondaryColor || '#64748b',
            accentColor: data?.accentColor || '#f59e0b',
        },
    });

    const onSubmit = async (formData) => {
        try {
            setIsSaving(true);

            // Theme colors — always safe to send
            const themeRes = await updateSiteTheme({
                primaryColor: formData.primaryColor,
                secondaryColor: formData.secondaryColor,
                accentColor: formData.accentColor,
            });
            if (themeRes && !themeRes.success) {
                toast.error(typeof themeRes.error === 'string' ? themeRes.error : themeRes.error?.message || 'An error occurred');
                return;
            }

            // Only send logo/favicon if they are actual image objects
            const imagePayload = {};
            if (formData.logo && typeof formData.logo === 'object' && formData.logo.imageId) {
                imagePayload.logo = formData.logo;
            }
            if (formData.favicon && typeof formData.favicon === 'object' && formData.favicon.imageId) {
                imagePayload.favicon = formData.favicon;
            }

            if (Object.keys(imagePayload).length > 0) {
                const infoRes = await updateSiteInfo(imagePayload);
                if (infoRes && !infoRes.success) {
                    toast.error(typeof infoRes.error === 'string' ? infoRes.error : infoRes.error?.message || 'An error occurred');
                    return;
                }
            }

            toast.success('Branding settings saved successfully');
            router.refresh();
        } catch (error) {
            toast.error('Failed to save branding settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveFieldInfo = async (fieldId, explicitValue = null) => {
        try {
            const value = explicitValue !== null ? explicitValue : methods.getValues(fieldId);
            // Don't send image fields unless they are valid image objects
            if ((fieldId === 'logo' || fieldId === 'favicon') &&
                (!value || typeof value !== 'object' || !value.imageId)) {
                toast.error('Please select a valid image first');
                return;
            }
            const result = await updateSiteInfo({ [fieldId]: value });
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
                            <HugeiconsIcon icon={PaintBoardIcon} size={20} />
                            Site Branding
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                <div>
                                    <h3 className='text-sm font-medium text-gray-900 mb-4'>
                                        Logos
                                    </h3>
                                    <div className='space-y-6'>
                                        <FormField
                                            control={methods.control}
                                            name='logo'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Main Logo</FormLabel>
                                                    <FormControl>
                                                        <ImageUploadWithSelector
                                                            fieldName='logo'
                                                            onChange={(val) => {
                                                                field.onChange(val);
                                                                handleSaveFieldInfo('logo', val);
                                                            }}
                                                            multiple={false}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Recommended size: 200x50px (SVG or
                                                        PNG)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={methods.control}
                                            name='favicon'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Favicon</FormLabel>
                                                    <FormControl>
                                                        <ImageUploadWithSelector
                                                            fieldName='favicon'
                                                            onChange={(val) => {
                                                                field.onChange(val);
                                                                handleSaveFieldInfo('favicon', val);
                                                            }}
                                                            multiple={false}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Appears in browser tabs. Size:
                                                        32x32px (.ico or .png)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className='flex justify-between items-center mb-4'>
                                        <h3 className='text-sm font-medium text-gray-900'>Colors</h3>
                                        <Button 
                                            type='button' 
                                            variant='ghost' 
                                            size='sm' 
                                            className='text-xs text-muted-foreground hover:text-foreground'
                                            onClick={() => {
                                                methods.resetField('primaryColor', { defaultValue: data?.primaryColor || '#3b82f6' });
                                                methods.resetField('secondaryColor', { defaultValue: data?.secondaryColor || '#64748b' });
                                                methods.resetField('accentColor', { defaultValue: data?.accentColor || '#f59e0b' });
                                            }}
                                        >
                                            Revert to Original Colors
                                        </Button>
                                    </div>
                                    <div className='grid grid-cols-1 gap-y-4'>
                                        <ColorPickerField
                                            id='primaryColor'
                                            label='Primary Color'
                                            control={methods.control}
                                            validationRules={validationRules?.primaryColor}
                                            placeholder='#3b82f6'
                                        />

                                        <ColorPickerField
                                            id='secondaryColor'
                                            label='Secondary Color'
                                            control={methods.control}
                                            validationRules={validationRules?.secondaryColor}
                                            placeholder='#64748b'
                                        />

                                        <ColorPickerField
                                            id='accentColor'
                                            label='Accent Color'
                                            control={methods.control}
                                            validationRules={validationRules?.accentColor}
                                            placeholder='#f59e0b'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className='flex justify-end mt-6 pt-6 border-t'>
                    <Button type='submit' disabled={isSaving} className='min-w-[150px]'>
                        {isSaving ? 'Saving...' : 'Save All Branding Changes'}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default BrandingInformation;
