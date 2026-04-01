import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Cancel01Icon, CloudUploadIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import MediaSelector from '../../media/components/media-selector';

export function ImageUploadWithSelector({
    fieldName,
    onChange,
    removeAll = false,
    multiple = false,
    maxFiles = 50,
    previewSize,
}) {
    const [showMediaSelector, setShowMediaSelector] = useState(false);
    const { watch } = useFormContext();
    const formImages = watch(fieldName);

    // Normalize form images to always be an array for easier handling
    const normalizedFormImages = multiple
        ? Array.isArray(formImages)
            ? formImages
            : []
        : formImages
          ? [formImages]
          : [];

    // Handle media selection from gallery
    const handleMediaSelection = useCallback(
        selectedMedia => {
            if (!selectedMedia || selectedMedia.length === 0) {
                setShowMediaSelector(false);
                return;
            }

            // Helper function to transform media object to ImageDto format
            const transformToImageDto = (mediaItem, index = 0) => ({
                imageId: mediaItem?.imageId ? mediaItem.imageId : mediaItem.id,
                fileName: mediaItem.fileName || mediaItem.originalName || '',
                caption: mediaItem.caption || '',
                altText: mediaItem.altText || '',
                url: mediaItem.url,
            });

            if (!multiple) {
                // Single selection mode - take the first selected item
                const selectedItem = Array.isArray(selectedMedia)
                    ? selectedMedia[0]
                    : selectedMedia;

                const transformedItem = transformToImageDto(selectedItem);
                onChange(transformedItem);
                toast.success('Image selected successfully');
                setShowMediaSelector(false);
                return;
            }

            // Multiple selection mode - REPLACE instead of ADD
            const mediaArray = Array.isArray(selectedMedia)
                ? selectedMedia
                : [selectedMedia];

            // Check if selection exceeds maxFiles
            if (mediaArray.length > maxFiles) {
                const trimmedMedia = mediaArray.slice(0, maxFiles);

                const transformedMedia = trimmedMedia.map((item, index) =>
                    transformToImageDto(item, index)
                );
                console.table(`transformed images to add`, transformedMedia);

                onChange(transformedMedia);
                toast.warning(
                    `Selected ${mediaArray.length} images, but only ${maxFiles} are allowed. Showing first ${maxFiles} images.`
                );
            } else {
                // Replace the current selection with new selection
                const transformedMedia = mediaArray.map((item, index) =>
                    transformToImageDto(item, index)
                );
                onChange(transformedMedia);
                toast.success(
                    `Selected ${mediaArray.length} image(s) from gallery`
                );
            }

            setShowMediaSelector(false);
        },
        [multiple, maxFiles, onChange]
    );

    // Remove image
    const removeImage = index => {
        if (multiple && Array.isArray(formImages)) {
            const newImages = [...formImages];
            newImages.splice(index, 1);
            onChange(newImages);
        } else {
            // For single mode, set to null/undefined
            onChange(null);
        }
    };

    const openMediaSelector = () => {
        setShowMediaSelector(true);
    };

    // Calculate remaining slots
    const remainingSlots = multiple
        ? Math.max(0, maxFiles - normalizedFormImages.length)
        : formImages
          ? 0
          : 1;
    const canAddMore = remainingSlots > 0;

    return (
        <div className='space-y-4'>
            {/* Upload Area */}
            <div
                onClick={canAddMore ? openMediaSelector : undefined}
                className={`border-2 border-dashed rounded-md p-6 transition-colors ${
                    canAddMore
                        ? 'border-input cursor-pointer hover:border-primary hover:bg-primary/5'
                        : 'border-border cursor-not-allowed opacity-50'
                }`}>
                <div className='flex flex-col items-center justify-center space-y-2 text-center'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted'>
                        <HugeiconsIcon
                            icon={CloudUploadIcon}
                            size={20}
                            className='text-muted-foreground'
                        />
                    </div>
                    <h3 className='text-sm font-medium'>
                        {canAddMore
                            ? `Select ${
                                  multiple ? 'images' : 'an image'
                              } from your secured cloud storage`
                            : `Maximum ${
                                  multiple ? maxFiles + ' images' : '1 image'
                              } selected`}
                    </h3>
                    <p className='text-sm text-muted-foreground'>
                        Images are automatically optimized and stored securely
                        <br />
                        {multiple
                            ? `Max ${maxFiles} images, 2MB each${
                                  remainingSlots > 0
                                      ? ` (${remainingSlots} remaining)`
                                      : ''
                              }`
                            : '2MB max per image'}
                    </p>
                </div>
            </div>

            {/* Selected Images Preview */}
            {normalizedFormImages.length > 0 && (
                <div className='space-y-2'>
                    <div className='flex justify-between items-center'>
                        <p className='text-sm font-medium text-muted-foreground'>
                            Selected Images ({normalizedFormImages.length}
                            {multiple ? `/${maxFiles}` : ''})
                        </p>
                        {removeAll && (
                            <Button
                                variant='link'
                                className='text-sm text-muted-foreground hover:text-red-400 transition-colors no-underline!'
                                onClick={() => onChange([])}>
                                Remove All
                            </Button>
                        )}
                    </div>
                    <div className='grid grid-cols-3 md:grid-cols-5 gap-3'>
                        {normalizedFormImages.map((img, i) => (
                            <div key={i} className='relative group'>
                                <div
                                    className={cn(
                                        `relative w-full aspect-square dark:bg-gray-200 rounded-md`,
                                        previewSize
                                    )}>
                                    <Image
                                        src={
                                            img?.thumbnail ||
                                            img?.url ||
                                            img?.src ||
                                            '/placeholder.svg'
                                        }
                                        fill
                                        alt={`Selected ${i + 1}`}
                                        className='object-contain rounded-md border overflow-hidden'
                                    />
                                </div>

                                <button
                                    type='button'
                                    onClick={() => removeImage(i)}
                                    className='absolute top-1 right-1 w-6 h-6 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm'
                                    title='Remove image'>
                                    <HugeiconsIcon
                                        icon={Cancel01Icon}
                                        size={14}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Media Selector */}
            {showMediaSelector && (
                <MediaSelector
                    open={showMediaSelector}
                    onOpenChange={setShowMediaSelector}
                    onMediaSelect={handleMediaSelection}
                    multiple={multiple}
                    maxFiles={50}
                    currentSelection={
                        multiple
                            ? normalizedFormImages
                            : formImages
                              ? [formImages]
                              : []
                    }
                />
            )}
        </div>
    );
}

