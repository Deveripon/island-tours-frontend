'use client';
import {
    deleteImages,
    uploadMultipleImage,
    uploadSingleImage,
} from '@/app/_actions/mediaActions';
import { AlertCircle, Cloud, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

const StandaloneImageUploader = ({
    value,
    onChange,
    multiple = false,
    maxFiles = 10,
    folder = 'drafts',
    userId = 'anonymous',
    tags = [],
    onUploadStateChange,
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState([]);
    const [errors, setErrors] = useState([]);
    const inputRef = useRef(null);

    const isUploading = uploadingFiles.length > 0;

    useEffect(() => {
        if (onUploadStateChange) {
            onUploadStateChange(isUploading);
        }
    }, [isUploading, onUploadStateChange]);

    const imagePreviewData = useMemo(() => {
        if (!value) return [];

        const images = Array.isArray(value) ? value : [value];
        return images
            .map((item, index) => {
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
                } else if (item instanceof File) {
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
    }, [value]);

    const handleFiles = async files => {
        const currentImages = Array.isArray(value)
            ? value
            : value
              ? [value]
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

        setErrors([]);
        setUploadingFiles(prev => [...prev, ...filesToProcess]);

        if (multiple) {
            onChange([...currentImages, ...filesToProcess]);
        } else {
            onChange(filesToProcess[0]);
        }

        try {
            let uploadResults;

            if (filesToProcess.length === 1) {
                const result = await uploadSingleImage(filesToProcess[0], {
                    folder,
                    userId,
                    tags,
                });
                uploadResults = [result.data];
            } else {
                const result = await uploadMultipleImage(filesToProcess, {
                    folder,
                    userId,
                    tags,
                });
                uploadResults = result.data;
            }

            if (multiple) {
                onChange([...value, ...uploadResults]);
            } else {
                onChange(uploadResults[0] || null);
            }

            toast.success(
                `Successfully uploaded ${uploadResults.length} image(s)`
            );
        } catch (error) {
            console.error('Upload failed:', error);
            setErrors(prev => [...prev, error.message]);

            const currentFormImages = multiple
                ? Array.isArray(value)
                    ? value
                    : []
                : value
                  ? [value]
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
            setUploadingFiles(prev =>
                prev.filter(file => !filesToProcess.includes(file))
            );
        }
    };

    const removeImage = async index => {
        const imageToRemove = imagePreviewData[index];

        if (multiple && Array.isArray(value)) {
            const newImages = [...value];
            newImages.splice(index, 1);
            onChange(newImages);
        } else {
            onChange(multiple ? [] : null);
        }

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
        if (isUploading) return;
        inputRef.current?.click();
    };

    const handleDrag = e => {
        e.preventDefault();
        e.stopPropagation();

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

        if (isUploading) return;

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = e => {
        e.preventDefault();

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

    return (
        <div className='space-y-4'>
            <div
                className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
                    isUploading
                        ? 'border-muted bg-muted/50 cursor-not-allowed opacity-50'
                        : dragActive
                          ? 'border-primary bg-primary/5 cursor-pointer'
                          : 'border-border bg-background hover:border-primary/50 cursor-pointer'
                }`}
                onClick={openFileDialog}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                aria-disabled={isUploading}>
                <div className='flex flex-col items-center justify-center space-y-3 text-center'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
                        <Upload className='h-6 w-6 text-foreground/60' />
                    </div>
                    <h3 className='text-sm font-semibold text-foreground'>
                        {isUploading
                            ? `Uploading ${uploadingFiles.length} file(s)...`
                            : 'Upload images to secure cloud storage'}
                    </h3>
                    <p className='text-xs text-muted-foreground'>
                        {isUploading
                            ? 'Please wait while files are being uploaded...'
                            : 'Drag and drop images here or click to browse'}
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

            {errors.length > 0 && (
                <div className='space-y-2'>
                    {errors.map((error, index) => (
                        <div
                            key={index}
                            className='flex items-center space-x-2 text-destructive text-xs bg-destructive/10 p-3 rounded-md border border-destructive/20'>
                            <AlertCircle className='h-4 w-4 flex-shrink-0' />
                            <span>{error}</span>
                        </div>
                    ))}
                </div>
            )}

            {imagePreviewData.length > 0 && (
                <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                        <h4 className='text-sm font-semibold text-foreground'>
                            Uploaded Images ({imagePreviewData.length})
                        </h4>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {imagePreviewData.map((img, i) => (
                            <div
                                key={img?.id}
                                className='relative rounded-lg overflow-hidden border border-border bg-muted hover:border-primary/50 transition-colors'>
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

                                <button
                                    type='button'
                                    onClick={() => removeImage(i)}
                                    className='absolute top-2 right-2 rounded-full p-1 w-6 h-6 bg-destructive hover:bg-destructive/90 text-primary-foreground transition-colors shadow-md'>
                                    <X className='w-4 h-4' />
                                </button>

                                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-2'>
                                    <div className='truncate font-medium'>
                                        {img?.name}
                                    </div>
                                    <div className='flex justify-between items-center text-gray-300 mt-1'>
                                        <span>{formatFileSize(img?.size)}</span>
                                        <div className='flex items-center space-x-1'>
                                            {img?.format && (
                                                <span className='uppercase text-xs'>
                                                    {img?.format}
                                                </span>
                                            )}
                                            {img?.isUploaded && (
                                                <Cloud className='w-3 h-3' />
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
};

