'use client';

import { ImageUploadWithSelector } from '@/app/[lang]/admin/(dashboard)/dashboard/components/common/image-upload-selector';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import {
    ArrowDown01Icon,
    Delete02Icon,
    InformationCircleIcon,
    PencilEdit01Icon,
    PlusSignIcon,
    UserGroupIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { FormProvider } from 'react-hook-form';
import { EditingSheetRight } from '../../editing-forms/editing-sheet-right';
import { BlockVariantSelector } from '../common/block-variant-selector';

export function TeamForm({
    isEditing,
    setIsEditing,
    methods,
    handleSave,
    handleCancel,
    addMember,
    fields,
    remove,
    openEditItem,
    setOpenEditItem,
    watchedMembers,
    watchedVariant,
    isLayoutModalOpen,
    setIsLayoutModalOpen,
    currentLayoutOptions,
    setValue,
    trip,
    onUpdate,
}) {
    const { control, handleSubmit } = methods;

    return (
        <EditingSheetRight
            side='right'
            className='lg:min-w-[550px] w-full sm:w-[550px] rounded-l-3xl border-l border-border hide-scrollbar'
            open={isEditing}
            onOpenChange={setIsEditing}>
            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit(handleSave)}
                    className='h-full flex flex-col bg-background'>
                    {/* Header */}
                    <div className='sticky top-0 z-20 px-6 py-5 flex justify-between items-center bg-card border-b border-border shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-primary/10 text-primary rounded-xl'>
                                <HugeiconsIcon icon={UserGroupIcon} size={20} />
                            </div>
                            <h3 className='font-black text-xl tracking-tight'>
                                Edit Team Section
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

                    {/* Form Content */}
                    <div
                        className='flex-1 overflow-y-auto px-6 py-8 space-y-8 hide-scrollbar'
                        data-lenis-prevent>
                        <div className='space-y-6'>
                            {/* Layout Selector */}
                            <BlockVariantSelector
                                icon={UserGroupIcon}
                                lucideIconName='Users'
                                label='Layout Style'
                                watchedVariant={watchedVariant}
                                isLayoutModalOpen={isLayoutModalOpen}
                                setIsLayoutModalOpen={setIsLayoutModalOpen}
                                variants={currentLayoutOptions}
                                onSelectVariant={variantId => {
                                    methods.setValue('variant', variantId);
                                    onUpdate?.({
                                        ...methods.getValues(),
                                        variant: variantId,
                                    });
                                    setIsLayoutModalOpen(false);
                                }}
                                blockLabel='Team Section'
                                trip={trip}
                            />

                            <FormField
                                control={control}
                                name='title'
                                render={({ field }) => (
                                    <div className='space-y-2'>
                                        <label className='text-xs font-bold text-muted-foreground   tracking-wider flex items-center gap-2'>
                                            <HugeiconsIcon
                                                icon={PencilEdit01Icon}
                                                className='w-4 h-4 text-primary'
                                            />
                                            Section Title
                                        </label>
                                        <input
                                            {...field}
                                            className='w-full h-12 rounded-2xl border border-border bg-background px-4 py-2 text-base font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                                            placeholder='Section Heading'
                                        />
                                        {watchedVariant === 'slider' && (
                                            <p className='text-xs text-muted-foreground italic'>
                                                Optimization: The last 2 words
                                                will be highlighted in green for
                                                the slider layout.
                                            </p>
                                        )}
                                    </div>
                                )}
                            />

                            <FormField
                                control={control}
                                name='subtitle'
                                render={({ field }) => (
                                    <div className='space-y-2'>
                                        <label className='text-xs font-bold text-muted-foreground   tracking-wider flex items-center gap-2'>
                                            <HugeiconsIcon
                                                icon={InformationCircleIcon}
                                                className='w-4 h-4 text-primary'
                                            />
                                            Subtitle
                                        </label>
                                        <textarea
                                            {...field}
                                            className='w-full min-h-[100px] rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none'
                                            placeholder='Brief description...'
                                        />
                                    </div>
                                )}
                            />
                        </div>

                        <div className='space-y-4 pt-4'>
                            <div className='flex items-center justify-between'>
                                <label className='text-xs font-bold text-muted-foreground   tracking-wider flex items-center gap-2'>
                                    <HugeiconsIcon
                                        icon={UserGroupIcon}
                                        className='w-3.5 h-3.5 text-primary'
                                    />
                                    Team Members
                                </label>
                                <Button
                                    type='button'
                                    onClick={addMember}
                                    variant='outline'
                                    size='sm'
                                    className='h-8 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary rounded-lg px-3'>
                                    <HugeiconsIcon
                                        icon={PlusSignIcon}
                                        className='w-3.5 h-3.5 mr-1.5'
                                    />
                                    Add Member
                                </Button>
                            </div>

                            <div className='space-y-3'>
                                {fields.map((field, index) => {
                                    const isEditOpen = openEditItem === index;
                                    const memberName =
                                        watchedMembers[index]?.name ||
                                        'New Member';
                                    const memberRole =
                                        watchedMembers[index]?.role || 'Role';
                                    const imageVal =
                                        watchedMembers[index]?.image;
                                    const imageUrl =
                                        imageVal?.url ||
                                        (typeof imageVal === 'string'
                                            ? imageVal
                                            : null);

                                    return (
                                        <div
                                            key={field.id}
                                            className={cn(
                                                'overflow-hidden rounded-xl border transition-all duration-300',
                                                isEditOpen
                                                    ? 'border-primary ring-1 ring-primary/10 bg-card'
                                                    : 'border-border hover:border-primary/40 bg-accent/5'
                                            )}>
                                            <button
                                                type='button'
                                                onClick={() =>
                                                    setOpenEditItem(
                                                        isEditOpen
                                                            ? null
                                                            : index
                                                    )
                                                }
                                                className='w-full px-5 py-4 flex items-center justify-between group/item text-left'>
                                                <div className='flex items-center gap-3 overflow-hidden'>
                                                    <div className='flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-accent/10 relative'>
                                                        {imageUrl && (
                                                            <Image
                                                                src={imageUrl}
                                                                alt={memberName}
                                                                fill
                                                                className='object-cover'
                                                            />
                                                        )}
                                                    </div>
                                                    <div className='flex flex-col overflow-hidden'>
                                                        <h4
                                                            className={cn(
                                                                'font-semibold text-sm truncate',
                                                                isEditOpen
                                                                    ? 'text-primary'
                                                                    : 'text-foreground'
                                                            )}>
                                                            {memberName}
                                                        </h4>
                                                        <p className='text-xs text-muted-foreground truncate'>
                                                            {memberRole}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className='flex items-center gap-2 flex-shrink-0'>
                                                    <div
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            remove(index);
                                                            if (
                                                                openEditItem ===
                                                                index
                                                            )
                                                                setOpenEditItem(
                                                                    null
                                                                );
                                                        }}
                                                        className='p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-100 lg:opacity-0 group-hover/item:opacity-100 cursor-pointer'>
                                                        <HugeiconsIcon
                                                            icon={Delete02Icon}
                                                            size={16}
                                                        />
                                                    </div>
                                                    <motion.div
                                                        animate={{
                                                            rotate: isEditOpen
                                                                ? 180
                                                                : 0,
                                                        }}
                                                        className='text-muted-foreground'>
                                                        <HugeiconsIcon
                                                            icon={
                                                                ArrowDown01Icon
                                                            }
                                                            size={18}
                                                        />
                                                    </motion.div>
                                                </div>
                                            </button>

                                            <AnimatePresence initial={false}>
                                                {isEditOpen && (
                                                    <motion.div
                                                        initial={{
                                                            height: 0,
                                                        }}
                                                        animate={{
                                                            height: 'auto',
                                                        }}
                                                        exit={{
                                                            height: 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.3,
                                                        }}
                                                        className='overflow-hidden'>
                                                        <div className='px-5 pb-5 pt-1 space-y-4 border-t border-border/50'>
                                                            <FormField
                                                                control={
                                                                    control
                                                                }
                                                                name={`members.${index}.name`}
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <div className='space-y-1.5'>
                                                                        <label className='text-[10px] font-bold text-muted-foreground    '>
                                                                            Full
                                                                            Name
                                                                        </label>
                                                                        <input
                                                                            {...field}
                                                                            className='w-full h-10 rounded-lg border border-border bg-background px-3 py-1 text-sm focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none transition-all'
                                                                            placeholder='e.g. Alex Younes'
                                                                        />
                                                                    </div>
                                                                )}
                                                            />

                                                            <FormField
                                                                control={
                                                                    control
                                                                }
                                                                name={`members.${index}.role`}
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <div className='space-y-1.5'>
                                                                        <label className='text-[10px] font-bold text-muted-foreground    '>
                                                                            Role
                                                                            /
                                                                            Title
                                                                        </label>
                                                                        <input
                                                                            {...field}
                                                                            className='w-full h-10 rounded-lg border border-border bg-background px-3 py-1 text-sm focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none transition-all'
                                                                            placeholder='e.g. Founder & CEO'
                                                                        />
                                                                    </div>
                                                                )}
                                                            />

                                                            <FormField
                                                                control={
                                                                    control
                                                                }
                                                                name={`members.${index}.image`}
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <div className='space-y-1.5'>
                                                                        <label className='text-[10px] font-bold text-muted-foreground    '>
                                                                            Profile
                                                                            Photo
                                                                        </label>
                                                                        <div className='bg-background border border-border rounded-xl p-2'>
                                                                            <ImageUploadWithSelector
                                                                                fieldName={`members.${index}.image`}
                                                                                onChange={
                                                                                    field.onChange
                                                                                }
                                                                                multiple={
                                                                                    false
                                                                                }
                                                                                maxFiles={
                                                                                    1
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>

                            {watchedMembers?.length === 0 && (
                                <div className='py-12 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center space-y-2'>
                                    <div className='p-3 bg-accent/10 rounded-full text-muted-foreground'>
                                        <HugeiconsIcon
                                            icon={UserGroupIcon}
                                            size={24}
                                        />
                                    </div>
                                    <p className='text-sm text-muted-foreground font-medium'>
                                        No team members added
                                    </p>
                                    <Button
                                        type='button'
                                        onClick={addMember}
                                        variant='link'
                                        size='sm'
                                        className='text-primary'>
                                        Add your first member
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </FormProvider>
        </EditingSheetRight>
    );
}

