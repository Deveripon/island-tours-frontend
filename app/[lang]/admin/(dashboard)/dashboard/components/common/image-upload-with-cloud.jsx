import {
    deleteImages,
    moveImage,
    uploadMultipleImage,
    uploadSingleImage,
} from '@/app/_actions/imagesActions';
import {
    AlertCircleIcon,
    Cancel01Icon,
    CloudIcon,
    Upload01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

export function ImageUploaderWithCloud({
    filedName,
    onChange,
    multiple = false,
    maxFiles = 10,
    folder = 'drafts',
    userId = 'anonymous',
    tags = [],
    onUploadStateChange, // New prop to expose uploading state
}) {
    const [dragActive, setDragActive] = useState(false);
    const { watch, getValues } = useFormContext();
    const [uploadingFiles, setUploadingFiles] = useState([]);
    const [errors, setErrors] = useState([]);
    const inputRef = useRef(null);

    // Watch the form field for changes
    const formImages = watch(filedName);

    // Check if uploading is in progress
    const isUploading = uploadingFiles.length > 0;

    // Expose uploading state to parent component
    useEffect(() => {
        if (onUploadStateChange) {
            onUploadStateChange(isUploading);
        }
    }, [isUploading, onUploadStateChange]);

    // Convert stored data to displayable format
    const imagePreviewData = useMemo(() => {
        if (!formImages) return [];

        const images = Array.isArray(formImages) ? formImages : [formImages];
        return images
            .map((item, index) => {
                // If it's uploaded cloud data
                if (item && typeof item === 'object' && item.url) {
                    return {
                        id: item.id || `cloud-${index}`,
                        url: item.thumbnail || item.url,
                        fullUrl: item.url,
                        name: item.originalName || 'Uploaded Image',
                        size: item.size,
                        format: item.format,
                        isUploaded: true,
                        cloudData: item,
                    };
                }
                // If it's a File object (being processed)
                else if (item instanceof File) {
                    return {
                        id: `temp-${item.name}-${index}`,
                        url: URL.createObjectURL(item),
                        name: item.name,
                        size: item.size,
                        isTemporary: true,
                        file: item,
                    };
                }
                return null;
            })
            .filter(Boolean);
    }, [formImages]);

    // Handle file selection and upload
    const handleFiles = async files => {
        const currentImages = Array.isArray(formImages)
            ? formImages
            : formImages
              ? [formImages]
              : [];
        const fileArray = Array.from(files);
        const filesToProcess = fileArray.slice(
            0,
            maxFiles - currentImages.length
        );

        if (filesToProcess.length === 0) {
            toast.warning(`Maximum ${maxFiles} images allowed`);
            return;
        }

        // Clear previous errors
        setErrors([]);

        // Add files to uploading state for immediate preview
        setUploadingFiles(prev => [...prev, ...filesToProcess]);

        // Add File objects to form immediately for preview
        if (multiple) {
            onChange([...currentImages, ...filesToProcess]);
        } else {
            onChange(filesToProcess[0]);
        }

        // Upload files - single or multiple based on count
        try {
            let uploadResults;

            if (filesToProcess.length === 1) {
                // Single file upload
                const result = await uploadSingleImage(filesToProcess[0], {
                    folder,
                    userId,
                    tags,
                });
                uploadResults = [result.data];
            } else {
                // Multiple file upload
                const result = await uploadMultipleImage(filesToProcess, {
                    folder,
                    userId,
                    tags,
                });
                uploadResults = result.data;
            }

            if (multiple) {
                onChange([...formImages, ...uploadResults]);
            } else {
                onChange(uploadResults[0] || null);
            }

            toast.success(
                `Successfully uploaded ${uploadResults.length} image(s)`
            );
        } catch (error) {
            console.error('Upload failed:', error);
            setErrors(prev => [...prev, error.message]);

            // Remove failed files from form
            const currentFormImages = multiple
                ? Array.isArray(formImages)
                    ? formImages
                    : []
                : formImages
                  ? [formImages]
                  : [];

            const filteredImages = currentFormImages.filter(
                img =>
                    !filesToProcess.some(
                        file => img instanceof File && img.name === file.name
                    )
            );

            if (multiple) {
                onChange(filteredImages);
            } else {
                onChange(filteredImages.length > 0 ? filteredImages[0] : null);
            }

            toast.error(`Failed to upload: ${error.message}`);
        } finally {
            // Remove from uploading state
            setUploadingFiles(prev =>
                prev.filter(file => !filesToProcess.includes(file))
            );
        }
    };

    // ... rest of the component remains the same

    // Remove uploaded image - immediate UI update with background processing
    const removeImage = async index => {
        const imageToRemove = imagePreviewData[index];

        // Immediately remove from form/UI
        if (multiple && Array.isArray(formImages)) {
            const newImages = [...formImages];
            newImages.splice(index, 1);
            onChange(newImages);
        } else {
            onChange(multiple ? [] : null);
        }

        // Process cloud deletion in background (don't await)
        if (
            imageToRemove &&
            imageToRemove.isUploaded &&
            imageToRemove.cloudData?.id
        ) {
            deleteImages([imageToRemove.cloudData.id])
                .then(() => {
                    toast.success('Image deleted from cloud storage');
                })
                .catch(error => {
                    console.error('Failed to delete from cloud:', error);
                    toast.error('Failed to delete from cloud storage');
                });
        }
    };

    // Promote draft images to permanent storage
    const promoteDrafts = useCallback(
        async (newFolder = 'packages') => {
            if (!formImages) return [];

            const images = Array.isArray(formImages)
                ? formImages
                : [formImages];
            const promotedImages = [];

            for (const image of images) {
                if (image && image.cloudData?.id) {
                    try {
                        const result = await moveImage(
                            image.cloudData.id,
                            newFolder,
                            userId
                        );
                        promotedImages.push(result.data);
                    } catch (error) {
                        console.error('Failed to promote image:', error);
                        // Keep original if promotion fails
                        promotedImages.push(image);
                    }
                } else {
                    promotedImages.push(image);
                }
            }

            return multiple ? promotedImages : promotedImages[0];
        },
        [formImages, multiple, userId]
    );

    // Cleanup temporary URLs
    useEffect(() => {
        return () => {
            imagePreviewData.forEach(img => {
                if (img.isTemporary && img.url.startsWith('blob:')) {
                    URL.revokeObjectURL(img.url);
                }
            });
        };
    }, [imagePreviewData]);

    const openFileDialog = () => {
        // Prevent opening file dialog if uploading
        if (isUploading) return;
        inputRef.current?.click();
    };

    const handleDrag = e => {
        e.preventDefault();
        e.stopPropagation();

        // Prevent drag interactions if uploading
        if (isUploading) return;

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = e => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        // Prevent drop if uploading
        if (isUploading) return;

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = e => {
        e.preventDefault();

        // Prevent file selection if uploading
        if (isUploading) return;

        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    const formatFileSize = bytes => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Expose promote function for parent components
    useEffect(() => {
        if (onChange.promoteDrafts) {
            onChange.promoteDrafts = promoteDrafts;
        }
    }, [formImages, onChange, promoteDrafts]);

    return (
        <div className='space-y-4'>
            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-md p-5 transition-colors ${
                    isUploading
                        ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
                        : dragActive
                          ? 'border-primary bg-primary/5 cursor-pointer'
                          : 'border-input cursor-pointer'
                }`}
                onClick={openFileDialog}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                aria-disabled={isUploading}>
                <div className='flex flex-col items-center justify-center space-y-2 text-center'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted'>
                        <HugeiconsIcon
                            icon={Upload01Icon}
                            className='h-5 w-5 text-gray-700'
                        />
                    </div>
                    <h3 className='text-sm font-medium'>
                        {isUploading
                            ? `Uploading ${uploadingFiles.length} file(s)...`
                            : `Upload ${
                                  multiple ? 'images' : 'an image'
                              } to secure cloud storage`}
                    </h3>
                    <p className='text-sm text-gray-700'>
                        {isUploading
                            ? 'Please wait while files are being uploaded...'
                            : 'Images are automatically optimized and stored securely'}
                        <br />
                        {!isUploading && `Max ${maxFiles} images, 10MB each`}
                    </p>
                </div>

                <input
                    type='file'
                    accept='image/*'
                    multiple={multiple}
                    ref={inputRef}
                    onChange={handleChange}
                    disabled={isUploading}
                    className='hidden'
                />
            </div>

            {/* Error Messages */}
            {errors.length > 0 && (
                <div className='space-y-2'>
                    {errors.map((error, index) => (
                        <div
                            key={index}
                            className='flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-2 rounded'>
                            <HugeiconsIcon
                                icon={AlertCircleIcon}
                                className='h-4 w-4'
                            />
                            <span>{error}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Image Preview */}
            {imagePreviewData.length > 0 && (
                <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                        <h4 className='text-sm font-medium'>
                            Uploaded Images ({imagePreviewData.length})
                        </h4>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {imagePreviewData.map((img, i) => (
                            <div
                                key={img?.id}
                                className='relative rounded-md overflow-hidden border'>
                                <Image
                                    src={img?.url}
                                    height={400}
                                    width={400}
                                    alt={`Image ${i + 1}`}
                                    className='object-cover w-full h-32 md:h-40'
                                    onError={() =>
                                        console.warn(
                                            'Failed to load image preview'
                                        )
                                    }
                                />

                                {/* Remove button */}
                                <button
                                    type='button'
                                    onClick={() => removeImage(i)}
                                    className='absolute top-2 right-2 rounded-full p-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white transition-colors shadow-md'>
                                    <HugeiconsIcon
                                        icon={Cancel01Icon}
                                        className='w-4 h-4'
                                    />
                                </button>

                                {/* File info overlay */}
                                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-sm p-2'>
                                    <div className='truncate font-medium'>
                                        {img?.name}
                                    </div>
                                    <div className='flex justify-between items-center text-gray-300 mt-1'>
                                        <span>{formatFileSize(img?.size)}</span>
                                        <div className='flex items-center space-x-1'>
                                            {img?.format && (
                                                <span className='uppercase'>
                                                    {img?.format}
                                                </span>
                                            )}
                                            {img?.isUploaded && (
                                                <HugeiconsIcon
                                                    icon={CloudIcon}
                                                    className='w-3 h-3'
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

