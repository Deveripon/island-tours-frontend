import { ImageUploadWithSelector } from '@/app/[lang]/admin/(dashboard)/dashboard/components/common/image-upload-selector';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import {
    ArrowDown01Icon,
    Delete02Icon,
    InformationCircleIcon,
    LayoutGridIcon,
    PencilEdit01Icon,
    PlusSignIcon,
    StarIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { FormProvider } from 'react-hook-form';
import { EditingSheetRight } from '../../editing-forms/editing-sheet-right';
import { BlockVariantSelector } from '../common/block-variant-selector';

export const ReviewForm = ({
    isEditing,
    setIsEditing,
    methods,
    handleSave,
    handleCancel,
    addReview,
    remove,
    openEditItem,
    setOpenEditItem,
    // Variant switching props (mirrors itinerary-form pattern)
    currentLayoutOptions,
    watchedVariant,
    isLayoutModalOpen,
    setIsLayoutModalOpen,
    reviewData,
    setReviewData,
    onUpdate,
    trip,
}) => {
    const { control, watch, handleSubmit } = methods;
    const watchedReviews = watch('reviews');

    return (
        <EditingSheetRight
            open={isEditing}
            onOpenChange={setIsEditing}
            className='lg:min-w-[550px] w-full sm:w-[550px] rounded-l-3xl border-l border-border hide-scrollbar'>
            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit(handleSave)}
                    className='h-full flex flex-col bg-background'>
                    {/* Header */}
                    <div className='sticky top-0 z-20 px-6 py-5 flex justify-between items-center bg-card border-b border-border shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-primary/10 text-primary rounded-xl'>
                                <HugeiconsIcon icon={StarIcon} size={20} />
                            </div>
                            <h3 className='font-black text-xl tracking-tight'>
                                Edit Reviews
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
                                className='h-10 px-5 font-bold rounded-xl shadow-lg shadow-primary/20'>
                                Save
                            </Button>
                        </div>
                    </div>

                    <div
                        className='flex-1 overflow-y-auto px-6 py-8 space-y-8 hide-scrollbar'
                        data-lenis-prevent>
                        {/* Layout Variant Selector */}
                        {currentLayoutOptions && (
                            <BlockVariantSelector
                                icon={LayoutGridIcon}
                                lucideIconName='LayoutGrid'
                                label='Layout Style'
                                watchedVariant={watchedVariant}
                                isLayoutModalOpen={isLayoutModalOpen}
                                setIsLayoutModalOpen={setIsLayoutModalOpen}
                                variants={currentLayoutOptions}
                                onSelectVariant={variantId => {
                                    if (setReviewData) {
                                        setReviewData(prev => ({
                                            ...prev,
                                            variant: variantId,
                                        }));
                                    }
                                    // Merge full current form values with the new variant
                                    // so onUpdate doesn't wipe reviews/title/subtitle from block data
                                    const currentFormValues =
                                        methods.getValues();
                                    onUpdate?.({
                                        ...currentFormValues,
                                        variant: variantId,
                                    });
                                    setIsLayoutModalOpen(false);
                                }}
                                blockLabel='Reviews Section'
                                trip={trip}
                            />
                        )}

                        {/* Section Title */}
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
                                </div>
                            )}
                        />

                        {/* Subtitle */}
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

                        {/* Reviews List */}
                        <div className='space-y-4'>
                            <div className='flex justify-between items-center'>
                                <label className='text-xs font-bold text-muted-foreground   tracking-wider flex items-center gap-2'>
                                    <HugeiconsIcon
                                        icon={StarIcon}
                                        className='w-3.5 h-3.5 text-primary'
                                    />
                                    Reviews List
                                </label>
                                <Button
                                    type='button'
                                    size='sm'
                                    onClick={addReview}
                                    variant='outline'
                                    className='h-8 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary rounded-lg px-3'>
                                    <HugeiconsIcon
                                        icon={PlusSignIcon}
                                        className='w-3.5 h-3.5 mr-1.5'
                                    />
                                    Add Review
                                </Button>
                            </div>

                            <div className='space-y-3'>
                                {watchedReviews?.map((field, index) => {
                                    const isEditOpen = openEditItem === index;
                                    const reviewName =
                                        watchedReviews[index]?.name ||
                                        'New Reviewer';
                                    const reviewRating =
                                        watchedReviews[index]?.rating || 5;
                                    const reviewerAvatarVal =
                                        watchedReviews[index]?.reviewerAvatar;
                                    const avatarUrl =
                                        reviewerAvatarVal?.url ||
                                        (typeof reviewerAvatarVal === 'string'
                                            ? reviewerAvatarVal
                                            : null);

                                    return (
                                        <div
                                            key={field.id || index}
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
                                                    <div className='flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-accent/10 relative flex items-center justify-center text-xs font-bold text-white'>
                                                        {avatarUrl ? (
                                                            <Image
                                                                src={avatarUrl}
                                                                alt={reviewName}
                                                                fill
                                                                className='object-cover'
                                                            />
                                                        ) : (
                                                            <div
                                                                className={cn(
                                                                    'w-full h-full flex items-center justify-center',
                                                                    watchedReviews[
                                                                        index
                                                                    ]
                                                                        ?.avatarBg ||
                                                                        'bg-blue-500'
                                                                )}>
                                                                {watchedReviews[
                                                                    index
                                                                ]?.avatar ||
                                                                    'R'}
                                                            </div>
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
                                                            {reviewName}
                                                        </h4>
                                                        <div className='flex gap-1 text-xs text-muted-foreground'>
                                                            <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
                                                            <span>
                                                                {reviewRating}
                                                                /5
                                                            </span>
                                                        </div>
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
                                                        className='p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors group-hover/item:opacity-100 opacity-0 md:opacity-0 lg:opacity-100 cursor-pointer'>
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
                                                        exit={{ height: 0 }}
                                                        transition={{
                                                            duration: 0.3,
                                                        }}
                                                        className='overflow-hidden'>
                                                        <div className='px-5 pb-5 pt-1 space-y-4 border-t border-border/50'>
                                                            <div className='grid grid-cols-2 gap-4'>
                                                                <FormField
                                                                    control={
                                                                        control
                                                                    }
                                                                    name={`reviews.${index}.name`}
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <div className='space-y-1.5'>
                                                                            <label className='text-[10px] font-bold text-muted-foreground    '>
                                                                                Reviewer
                                                                                Name
                                                                            </label>
                                                                            <input
                                                                                {...field}
                                                                                className='w-full h-10 rounded-lg border border-border bg-background px-3 py-1 text-sm focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none transition-all'
                                                                            />
                                                                        </div>
                                                                    )}
                                                                />
                                                                <FormField
                                                                    control={
                                                                        control
                                                                    }
                                                                    name={`reviews.${index}.rating`}
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <div className='space-y-1.5'>
                                                                            <label className='text-[10px] font-bold text-muted-foreground    '>
                                                                                Rating
                                                                                (1-5)
                                                                            </label>
                                                                            <input
                                                                                {...field}
                                                                                type='number'
                                                                                min='1'
                                                                                max='5'
                                                                                className='w-full h-10 rounded-lg border border-border bg-background px-3 py-1 text-sm focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none transition-all'
                                                                            />
                                                                        </div>
                                                                    )}
                                                                />
                                                            </div>

                                                            <FormField
                                                                control={
                                                                    control
                                                                }
                                                                name={`reviews.${index}.text`}
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <div className='space-y-1.5'>
                                                                        <label className='text-[10px] font-bold text-muted-foreground    '>
                                                                            Review
                                                                            Text
                                                                        </label>
                                                                        <textarea
                                                                            {...field}
                                                                            className='w-full min-h-[100px] rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none transition-all resize-none'
                                                                        />
                                                                    </div>
                                                                )}
                                                            />

                                                            <FormField
                                                                control={
                                                                    control
                                                                }
                                                                name={`reviews.${index}.reviewerAvatar`}
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <div className='space-y-1.5'>
                                                                        <label className='text-[10px] font-bold text-muted-foreground    '>
                                                                            Reviewer
                                                                            Photo
                                                                        </label>
                                                                        <div className='bg-background border border-border rounded-xl p-2'>
                                                                            <ImageUploadWithSelector
                                                                                fieldName={`reviews.${index}.reviewerAvatar`}
                                                                                onChange={
                                                                                    field.onChange
                                                                                }
                                                                                multiple={
                                                                                    false
                                                                                }
                                                                                maxFiles={
                                                                                    1
                                                                                }
                                                                                value={
                                                                                    field.value
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            />

                                                            <FormField
                                                                control={
                                                                    control
                                                                }
                                                                name={`reviews.${index}.images`}
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <div className='space-y-1.5'>
                                                                        <label className='text-[10px] font-bold text-muted-foreground    '>
                                                                            Review
                                                                            Attachments
                                                                        </label>
                                                                        <div className='bg-background border border-border rounded-xl p-2'>
                                                                            <ImageUploadWithSelector
                                                                                fieldName={`reviews.${index}.images`}
                                                                                onChange={
                                                                                    field.onChange
                                                                                }
                                                                                multiple={
                                                                                    true
                                                                                }
                                                                                maxFiles={
                                                                                    10
                                                                                }
                                                                                value={
                                                                                    field.value ||
                                                                                    []
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
                        </div>
                    </div>
                </form>
            </FormProvider>
        </EditingSheetRight>
    );
};

