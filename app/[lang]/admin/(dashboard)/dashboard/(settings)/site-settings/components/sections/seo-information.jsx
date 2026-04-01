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
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { EditableSelectField } from '../../../../(user)/profile/components/editable-select-field';
import { EditableTextField } from '../../../../(user)/profile/components/editable-text-field';
import { EditableTextAreaField } from '../../../../(user)/profile/components/editable-textarea-filed';
import { ImageUploadWithSelector } from '../../../../components/common/image-upload-selector';

const SeoInformation = ({
    control,
    editingField,
    setEditingField,
    handleSaveField,
    isSaving,
    resetField,
    formValidationRules,
    robotsMetaOptions,
    seoInfo }) => {
    const { watch } = useFormContext();
    const ogImage = watch('ogImage');
    const twitterImage = watch('twitterImage');
    const [prevOgImage, setPrevOgImage] = useState(seoInfo?.ogImage);
    const [prevTwitterImage, setPrevTwitterImage] = useState(seoInfo?.twitterImage);

    useEffect(() => {
        if (ogImage && ogImage?.imageId !== prevOgImage?.imageId) {
            setEditingField('ogImage');
        }

        if (twitterImage && twitterImage?.imageId !== prevTwitterImage?.imageId) {
            setEditingField('twitterImage');
        }
    }, [
        ogImage,
        twitterImage,
        prevOgImage?.imageId,
        prevTwitterImage?.imageId,
        setEditingField,
        editingField,
    ]);

    const isOgImageEditing = editingField === 'ogImage';
    const isTwitterImageEditing = editingField === 'twitterImage';

    const handleOgImageSave = () => {
        handleSaveField('ogImage');
        setPrevOgImage(ogImage);
        setEditingField(null);
    };

    const handleOgImageCancel = () => {
        resetField('ogImage');
        setEditingField(null);
    };

    const handleTwitterImageSave = () => {
        handleSaveField('twitterImage');
        setPrevTwitterImage(twitterImage);
        setEditingField(null);
    };

    const handleTwitterImageCancel = () => {
        resetField('twitterImage');
        setEditingField(null);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <HugeiconsIcon icon={Search01Icon} size={20} />
                    SEO Settings
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='space-y-6'>
                    {/* Basic SEO */}
                    <div>
                        <h4 className='text-sm font-medium text-gray-900 mb-4'>
                            Basic SEO
                        </h4>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                            <div className='lg:col-span-2'>
                                <EditableTextField
                                    id='metaTitle'
                                    label='Meta Title'
                                    control={control}
                                    editingField={editingField}
                                    setEditingField={setEditingField}
                                    onSaveField={handleSaveField}
                                    isSaving={isSaving}
                                    validationRules={formValidationRules.metaTitle}
                                    resetField={resetField}
                                    placeholder='SEO Title (60 chars max)'
                                />
                            </div>
                            <div className='lg:col-span-2'>
                                <EditableTextAreaField
                                    id='metaDescription'
                                    label='Meta Description'
                                    control={control}
                                    editingField={editingField}
                                    setEditingField={setEditingField}
                                    onSaveField={handleSaveField}
                                    isSaving={isSaving}
                                    validationRules={formValidationRules.metaDescription}
                                    resetField={resetField}
                                    placeholder='SEO Description (160 chars max)'
                                    rows={3}
                                />
                            </div>

                            <div className='lg:col-span-2'>
                                <EditableTextField
                                    id='metaKeywords'
                                    label='Meta Keywords'
                                    control={control}
                                    editingField={editingField}
                                    setEditingField={setEditingField}
                                    onSaveField={handleSaveField}
                                    isSaving={isSaving}
                                    validationRules={formValidationRules.metaKeywords}
                                    resetField={resetField}
                                    placeholder='travel, b2b, agency, business travel'
                                />
                            </div>

                            <EditableTextField
                                id='canonicalUrl'
                                label='Canonical URL'
                                control={control}
                                editingField={editingField}
                                setEditingField={setEditingField}
                                onSaveField={handleSaveField}
                                isSaving={isSaving}
                                validationRules={formValidationRules.canonicalUrl}
                                resetField={resetField}
                                placeholder='https://yourdomain.com'
                            />

                            <EditableSelectField
                                id='robotsMeta'
                                label='Robots Meta'
                                control={control}
                                options={robotsMetaOptions}
                                editingField={editingField}
                                setEditingField={setEditingField}
                                onSaveField={handleSaveField}
                                isSaving={isSaving}
                                resetField={resetField}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Open Graph */}
                    <div>
                        <h4 className='text-sm font-medium text-gray-900 mb-4'>
                            Open Graph (Facebook)
                        </h4>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                            <EditableTextField
                                id='ogTitle'
                                label='OG Title'
                                control={control}
                                editingField={editingField}
                                setEditingField={setEditingField}
                                onSaveField={handleSaveField}
                                isSaving={isSaving}
                                validationRules={formValidationRules.ogTitle}
                                resetField={resetField}
                                placeholder='Facebook share title (95 chars max)'
                            />

                            <div className='flex flex-col space-y-4'>
                                <FormField
                                    control={control}
                                    name='ogImage'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>OG Image</FormLabel>
                                            <FormControl>
                                                <ImageUploadWithSelector
                                                    fieldName='ogImage'
                                                    onChange={field.onChange}
                                                    multiple={false}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Facebook share image (1200x630 px)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {isOgImageEditing && (
                                    <div className='flex gap-2 animate-in fade-in slide-in-from-right-2 duration-200'>
                                        <Button
                                            type='button'
                                            size='sm'
                                            onClick={handleOgImageSave}
                                            disabled={isSaving}
                                            className='transition-all duration-200 hover:scale-105 active:scale-95'>
                                            {isSaving ? 'Saving...' : 'Save'}
                                        </Button>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            size='sm'
                                            onClick={handleOgImageCancel}
                                            disabled={isSaving}
                                            className='transition-all duration-200 hover:scale-105 active:scale-95'>
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className='lg:col-span-2'>
                                <EditableTextAreaField
                                    id='ogDescription'
                                    label='OG Description'
                                    control={control}
                                    editingField={editingField}
                                    setEditingField={setEditingField}
                                    onSaveField={handleSaveField}
                                    isSaving={isSaving}
                                    validationRules={formValidationRules.ogDescription}
                                    resetField={resetField}
                                    placeholder='Facebook share description (200 chars max)'
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Twitter Cards */}
                    <div>
                        <h4 className='text-sm font-medium text-gray-900 mb-4'>
                            Twitter Cards
                        </h4>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                            <EditableTextField
                                id='twitterTitle'
                                label='Twitter Title'
                                control={control}
                                editingField={editingField}
                                setEditingField={setEditingField}
                                onSaveField={handleSaveField}
                                isSaving={isSaving}
                                validationRules={formValidationRules.twitterTitle}
                                resetField={resetField}
                                placeholder='Twitter share title (70 chars max)'
                            />

                            <div className='flex flex-col space-y-4'>
                                <FormField
                                    control={control}
                                    name='twitterImage'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Twitter Image</FormLabel>
                                            <FormControl>
                                                <ImageUploadWithSelector
                                                    fieldName='twitterImage'
                                                    onChange={field.onChange}
                                                    multiple={false}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Twitter share image (1200x675 px)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {isTwitterImageEditing && (
                                    <div className='flex gap-2 animate-in fade-in slide-in-from-right-2 duration-200'>
                                        <Button
                                            type='button'
                                            size='sm'
                                            onClick={handleTwitterImageSave}
                                            disabled={isSaving}
                                            className='transition-all duration-200 hover:scale-105 active:scale-95'>
                                            {isSaving ? 'Saving...' : 'Save'}
                                        </Button>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            size='sm'
                                            onClick={handleTwitterImageCancel}
                                            disabled={isSaving}
                                            className='transition-all duration-200 hover:scale-105 active:scale-95'>
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className='lg:col-span-2'>
                                <EditableTextAreaField
                                    id='twitterDescription'
                                    label='Twitter Description'
                                    control={control}
                                    editingField={editingField}
                                    setEditingField={setEditingField}
                                    onSaveField={handleSaveField}
                                    isSaving={isSaving}
                                    validationRules={
                                        formValidationRules.twitterDescription
                                    }
                                    resetField={resetField}
                                    placeholder='Twitter share description (200 chars max)'
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SeoInformation;
