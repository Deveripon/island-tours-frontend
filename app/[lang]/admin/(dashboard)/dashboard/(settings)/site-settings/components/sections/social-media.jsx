import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateSocialMedia } from '@/app/_actions/settingsActions';
import { EditableTextField } from '../../../../(user)/profile/components/editable-text-field';

const SocialMedia = ({ data, validationRules }) => {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const methods = useForm({
        defaultValues: {
            facebookUrl: data?.facebookUrl || '',
            twitterUrl: data?.twitterUrl || '',
            linkedinUrl: data?.linkedinUrl || '',
            instagramUrl: data?.instagramUrl || '',
        },
    });

    const onSubmit = async (formData) => {
        try {
            setIsSaving(true);
            const result = await updateSocialMedia({
                facebookUrl: formData.facebookUrl,
                twitterUrl: formData.twitterUrl,
                linkedinUrl: formData.linkedinUrl,
                instagramUrl: formData.instagramUrl,
            });

            if (result && !result.success) {
                toast.error(typeof result.error === 'string' ? result.error : result.error?.message || 'An error occurred');
                return;
            }

            toast.success('Social media settings saved successfully');
            router.refresh();
        } catch (error) {
            toast.error('Failed to save social media settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveField = async (fieldId, explicitValue = null) => {
        try {
            const value = explicitValue !== null ? explicitValue : methods.getValues(fieldId);
            const result = await updateSocialMedia({ [fieldId]: value });
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
                            <HugeiconsIcon icon={Link01Icon} size={20} />
                            Social Media Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-6'>
                            <div>
                                <h4 className='text-sm font-medium text-gray-900 mb-4'>
                                    Social Media Links
                                </h4>
                                <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                                    <EditableTextField
                                        id='facebookUrl'
                                        label='Facebook URL'
                                        control={methods.control}
                                        editingField={null}
                                        setEditingField={() => {}}
                                        onSaveField={handleSaveField}
                                        isSaving={isSaving}
                                        validationRules={validationRules?.socialUrl}
                                        resetField={methods.resetField}
                                        placeholder='https://facebook.com/yourpage'
                                    />
                                    <EditableTextField
                                        id='twitterUrl'
                                        label='Twitter/X URL'
                                        control={methods.control}
                                        editingField={null}
                                        setEditingField={() => {}}
                                        onSaveField={handleSaveField}
                                        isSaving={isSaving}
                                        validationRules={validationRules?.socialUrl}
                                        resetField={methods.resetField}
                                        placeholder='https://twitter.com/yourhandle'
                                    />
                                    <EditableTextField
                                        id='linkedinUrl'
                                        label='LinkedIn URL'
                                        control={methods.control}
                                        editingField={null}
                                        setEditingField={() => {}}
                                        onSaveField={handleSaveField}
                                        isSaving={isSaving}
                                        validationRules={validationRules?.socialUrl}
                                        resetField={methods.resetField}
                                        placeholder='https://linkedin.com/company/yourcompany'
                                    />
                                    <EditableTextField
                                        id='instagramUrl'
                                        label='Instagram URL'
                                        control={methods.control}
                                        editingField={null}
                                        setEditingField={() => {}}
                                        onSaveField={handleSaveField}
                                        isSaving={isSaving}
                                        validationRules={validationRules?.socialUrl}
                                        resetField={methods.resetField}
                                        placeholder='https://instagram.com/yourhandle'
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className='flex justify-end mt-6 pt-6 border-t'>
                    <Button type='submit' disabled={isSaving} className='min-w-[150px]'>
                        {isSaving ? 'Saving...' : 'Save Social Media Settings'}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default SocialMedia;
