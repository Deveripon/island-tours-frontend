'use client';
import { ImageUploadWithSelector } from '@/app/[lang]/admin/(dashboard)/dashboard/components/common/image-upload-selector';
import { Button } from '@/components/ui/button';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import {
    Image01Icon,
    InformationCircleIcon,
    PencilEdit01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { FormProvider } from 'react-hook-form';
import { EditingSheetRight } from '../../editing-forms/editing-sheet-right';

export const ImagesForm = ({
    isEditing,
    setIsEditing,
    methods,
    handleSave,
    handleCancel,
}) => {
    return (
        <EditingSheetRight
            side='right'
            className='lg:min-w-[550px] w-full sm:w-[550px] rounded-l-3xl border-l border-border hide-scrollbar'
            open={isEditing}
            onOpenChange={setIsEditing}>
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(handleSave)}
                    className='h-full flex flex-col bg-background'>
                    {/* Premium Header */}
                    <div className='sticky top-0 z-20 px-6 py-5 flex justify-between items-center bg-card border-b border-border shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-primary/10 text-primary rounded-xl'>
                                <HugeiconsIcon icon={Image01Icon} size={20} />
                            </div>
                            <h3 className='font-black text-xl tracking-tight'>
                                Edit Gallery
                            </h3>
                        </div>
                        <div className='flex gap-3'>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={handleCancel}
                                className='h-10 px-5 font-bold rounded-xl'>
                                Cancel
                            </Button>
                            <Button
                                type='submit'
                                variant='default'
                                className='h-10 px-5 font-bold rounded-xl shadow-lg shadow-primary/20'>
                                Save
                            </Button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div
                        className='flex-1 overflow-y-auto px-6 py-8 space-y-8 hide-scrollbar'
                        data-lenis-prevent>
                        <div className='space-y-6'>
                            {/* Title Section */}
                            <FormField
                                control={methods.control}
                                name='title'
                                render={({ field }) => (
                                    <FormItem className='space-y-2'>
                                        <FormLabel className='text-xs font-bold text-muted-foreground     flex items-center gap-2'>
                                            <HugeiconsIcon
                                                icon={PencilEdit01Icon}
                                                size={14}
                                                className='text-primary'
                                            />
                                            Section Title
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                {...field}
                                                className='w-full h-12 rounded-2xl border border-border bg-background px-4 py-2 text-base font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                                                placeholder='e.g. Photo Gallery'
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Subtitle Section */}
                            <FormField
                                control={methods.control}
                                name='subtitle'
                                render={({ field }) => (
                                    <FormItem className='space-y-2'>
                                        <FormLabel className='text-xs font-bold text-muted-foreground     flex items-center gap-2'>
                                            <HugeiconsIcon
                                                icon={InformationCircleIcon}
                                                size={14}
                                                className='text-primary'
                                            />
                                            Short Description
                                        </FormLabel>
                                        <FormControl>
                                            <textarea
                                                {...field}
                                                className='w-full min-h-[100px] rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none'
                                                placeholder='Provide a brief overview...'
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Images Section */}
                            <FormField
                                control={methods.control}
                                name='galleryImages'
                                render={({ field }) => (
                                    <FormItem className='space-y-4'>
                                        <FormLabel className='text-xs font-bold text-muted-foreground     flex items-center gap-2'>
                                            <HugeiconsIcon
                                                icon={Image01Icon}
                                                size={14}
                                                className='text-primary'
                                            />
                                            Gallery Images
                                        </FormLabel>
                                        <FormControl>
                                            <ImageUploadWithSelector
                                                fieldName='galleryImages'
                                                onChange={field.onChange}
                                                multiple={true}
                                                maxFiles={80}
                                                removeAll={true}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </form>
            </FormProvider>
        </EditingSheetRight>
    );
};

