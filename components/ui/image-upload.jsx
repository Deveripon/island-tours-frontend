'use client';
import { base64ToFile, fileToBase64 } from '@/lib/utils';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useFormContext, useRef, useState } from 'react';
export function ImageUpload({
    value,
    filedName,
    onChange,
    multiple = false,
    maxFiles = 10 }) {
    const [dragActive, setDragActive] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const inputRef = useRef(null);
    const { watch } = useFormContext();

    // Watch the form field for changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const formImages = watch(filedName) || (multiple ? [] : null);

    // Convert stored data back to displayable format
    /*    const imagePreviewData = useMemo(() => {
        if (!formImages) return [];
        
        const images = Array.isArray(formImages) ? formImages : [formImages];
        return images
            .map((item, index) => {
                // If it's already processed data with base64
                if (item && typeof item === 'object' && item.data) {
                    return {
                        id: `${item.name}-${item.size}-${index}`,
                        url: item.data, // Use the base64 data URL directly
                        name: item.name,
                        size: item.size,
                        type: item.type,
                        isPersisted: true,
                    };
                }
                // If it's a File object (fresh upload)
                else if (item instanceof File) {
                    return {
                        id: `${item.name}-${item.size}-${index}`,
                        url: URL.createObjectURL(item), // Temporary blob for immediate preview
                        name: item.name,
                        size: item.size,
                        type: item.type,
                        isTemporary: true,
                    };
                }
                return null;
            })
            .filter(Boolean);
    }, [formImages]); */

    // Process File objects to base64 for persistence using your utility function
    useEffect(() => {
        const processFiles = async () => {
            if (!formImages) return;

            const images = Array.isArray(formImages)
                ? formImages
                : [formImages];
            const hasFileObjects = images.some(item => item instanceof File);

            if (hasFileObjects) {
                setIsProcessing(true);
                try {
                    const processedImages = await Promise.all(
                        images.map(async item => {
                            if (item instanceof File) {
                                // Use your utility function
                                return await fileToBase64(item);
                            }
                            return item; // Already processed
                        })
                    );

                    // Update form with processed data
                    if (multiple) {
                        onChange(processedImages);
                    } else {
                        onChange(processedImages[0]);
                    }
                } catch (error) {
                } finally {
                    setIsProcessing(false);
                }
            }
        };

        processFiles();
    }, [formImages, multiple, onChange]);

    // Cleanup temporary blob URLs
    useEffect(() => {
        return () => {
            imagePreviewData.forEach(img => {
                if (img.isTemporary && img.url.startsWith('blob:')) {
                    URL.revokeObjectURL(img.url);
                }
            });
        };
    }, []);

    const openFileDialog = () => {
        inputRef.current?.click();
    };

    const handleChange = e => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    const handleDrag = e => {
        e.preventDefault();
        e.stopPropagation();
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
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFiles = files => {
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

        if (filesToProcess.length === 0) return;

        if (multiple) {
            // For multiple files, add to existing array
            onChange([...currentImages, ...filesToProcess]);
        } else {
            // For single file, replace
            onChange(filesToProcess[0]);
        }
    };

    const removeImage = index => {
        if (multiple && Array.isArray(formImages)) {
            const newImages = [...formImages];
            newImages.splice(index, 1);
            onChange(newImages);
        } else {
            onChange(multiple ? [] : null);
        }
    };

    // Helper function to format file size
    const formatFileSize = bytes => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Function to convert persisted data back to File objects for upload
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getFilesForUpload = () => {
        if (!formImages) return [];

        const images = Array.isArray(formImages) ? formImages : [formImages];
        return images
            .map(item => {
                if (item instanceof File) {
                    return item;
                } else if (item && typeof item === 'object' && item.data) {
                    // Convert base64 data back to File using your utility function
                    return base64ToFile(item);
                }
                return null;
            })
            .filter(Boolean);
    };

    // Expose the function to parent components if needed
    useEffect(() => {
        if (onChange.getFiles) {
            onChange.getFiles = getFilesForUpload;
        }
    }, [formImages, getFilesForUpload, onChange]);

    return (
        <div className='space-y-4'>
            <div
                className={`border-2 border-dashed rounded-md p-5 cursor-pointer transition-colors ${
                    dragActive
                        ? 'border-sass-primary bg-sass-primary/5'
                        : 'border-input'
                } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={openFileDialog}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}>
                <div className='flex flex-col items-center justify-center space-y-2 text-center'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted'>
                        <Upload className='h-5 w-5 text-gray-700' />
                    </div>
                    <h3 className='text-sm font-medium'>
                        {isProcessing
                            ? 'Processing images...'
                            : `Drag ${
                                  multiple ? 'images' : 'an image'
                              } here or click to upload`}
                    </h3>
                    <p className='text-sm text-gray-700'>
                        {multiple
                            ? `Upload up to ${maxFiles} images (max 5MB each)`
                            : 'Upload one image (max 5MB)'}
                    </p>
                </div>
                <input
                    type='file'
                    accept='image/*'
                    multiple={multiple}
                    ref={inputRef}
                    onChange={handleChange}
                    className='hidden'
                    disabled={isProcessing}
                />
            </div>

            {/* Processing indicator */}
            {isProcessing && (
                <div className='flex items-center justify-center space-x-2 text-sm text-gray-700'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-sass-primary'></div>
                    <span>Converting images for storage...</span>
                </div>
            )}

            {/* Image Preview Section */}
            {imagePreviewData.length > 0 && (
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {imagePreviewData.map((img, i) => (
                        <div
                            key={img.id}
                            className='relative rounded-md overflow-hidden border'>
                            <Image
                                height={160}
                                width={350}
                                src={img.url}
                                alt={`Uploaded image ${i + 1}`}
                                className='object-cover w-full h-32 md:h-40'
                                onError={() => {}}
                            />
                            <button
                                type='button'
                                onClick={() => removeImage(i)}
                                className='absolute top-1 right-1 rounded-full p-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white transition-colors'
                                disabled={isProcessing}>
                                <X className='w-4 h-4' />
                            </button>
                            {/* File info overlay */}
                            <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-sm p-2'>
                                <div className='truncate font-medium'>
                                    {img.name}
                                </div>
                                <div className='text-gray-300'>
                                    {formatFileSize(img.size)}
                                    {img.isPersisted && (
                                        <span className='ml-1'>📁</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

