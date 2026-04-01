import { Progress } from '@/components/ui/progress';
import {
    Cancel01Icon,
    File02Icon,
    Tick02Icon,
    Upload02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Import your actual server actions and toast
import { uploadMultipleImage } from '@/app/_actions/imagesActions';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import Image from 'next/image';
import { toast } from 'sonner';

// Enhanced Media Uploader with Progress and 2MB size limit
export const MediaUploader = ({
    value,
    setMediaItems,
    multiple = true,
    maxFiles = 50,
    maxFileSize = 2 * 1024 * 1024, // 2MB in bytes
    folder = 'drafts',
    selector = false, // New prop to indicate selector mode
    setbulkSelectedItems, // New prop for selector mode
    setIsFormOpen, // New prop to close the dialog
    isFormOpen,
    bulkSelectedItems,
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [errors, setErrors] = useState([]);
    // Store preview URLs to prevent flickering
    const [previewUrls, setPreviewUrls] = useState({});
    const inputRef = useRef(null);

    // Add state to track if file dialog was opened
    const [fileDialogOpened, setFileDialogOpened] = useState(false);

    useEffect(() => {
        if (isFormOpen && !fileDialogOpened) {
            setFileDialogOpened(true);
            inputRef.current?.click();
        }
    }, [isFormOpen, fileDialogOpened]);

    // Add focus event listener to detect when user returns without selecting files
    useEffect(() => {
        const handleWindowFocus = () => {
            if (fileDialogOpened && isFormOpen) {
                // Small delay to ensure file input change event has time to fire if files were selected
                setTimeout(() => {
                    if (fileDialogOpened && isFormOpen) {
                        // If we reach here, user likely cancelled the dialog
                        setIsFormOpen(false);
                        setFileDialogOpened(false);
                    }
                }, 300);
            }
        };

        window.addEventListener('focus', handleWindowFocus);
        return () => window.removeEventListener('focus', handleWindowFocus);
    }, [fileDialogOpened, isFormOpen, setIsFormOpen]);

    const isUploading = uploadingFiles.length > 0;

    const imagePreviewData = useMemo(() => {
        const images = [];
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
    }, []);

    // Create stable preview URLs for uploading files
    const createPreviewUrl = useCallback(
        (file, id) => {
            if (!previewUrls[id]) {
                const url = URL.createObjectURL(file);
                setPreviewUrls(prev => ({
                    ...prev,
                    [id]: url,
                }));
                return url;
            }
            return previewUrls[id];
        },
        [previewUrls]
    );

    // Clean up preview URLs when upload is complete or cancelled
    const cleanupPreviewUrl = useCallback(
        id => {
            if (previewUrls[id]) {
                URL.revokeObjectURL(previewUrls[id]);
                setPreviewUrls(prev => {
                    const newUrls = { ...prev };
                    delete newUrls[id];
                    return newUrls;
                });
            }
        },
        [previewUrls]
    );

    const validateFiles = files => {
        const validFiles = [];
        const invalidFiles = [];

        Array.from(files).forEach(file => {
            // Check file size
            if (file.size > maxFileSize) {
                invalidFiles.push({
                    file,
                    error: `File "${
                        file.name
                    }" is too large. Maximum size is ${formatFileSize(
                        maxFileSize
                    )}.`,
                });
                return;
            }

            // Check file type // Only image file now
            if (
                !file.type.startsWith('image/') /*  &&
                !file.type.includes('pdf') &&
                !file.type.includes('document') &&
                !file.type.includes('word') */
            ) {
                invalidFiles.push({
                    file,
                    error: `File "${file.name}" is not a supported format.`,
                });
                return;
            }

            validFiles.push(file);
        });

        return { validFiles, invalidFiles };
    };

    const simulateProgress = fileId => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 95) {
                progress = 95;
                clearInterval(interval);
            }
            setUploadProgress(prev => ({
                ...prev,
                [fileId]: Math.min(progress, 95),
            }));
        }, 200);
        return interval;
    };

    // Function to remove file from upload progress list
    const removeUploadingFile = fileId => {
        // Clean up preview URL
        cleanupPreviewUrl(fileId);

        setUploadingFiles(prev => prev.filter(({ id }) => id !== fileId));
        setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
        });
    };

    const openFileDialog = () => {
        if (isUploading) return;
        setFileDialogOpened(true);
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
        } else {
            // Handle case where no files were selected (user cancelled)
            setFileDialogOpened(false);
        }

        // Reset the input value to allow selecting the same file again
        e.target.value = '';
    };

    const formatFileSize = bytes => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Fixed handleFiles function with proper selector mode and error handling
    const handleFiles = async files => {
        const currentImages = Array.isArray(value)
            ? value
            : value
              ? [value]
              : [];

        // Validate files first
        const { validFiles, invalidFiles } = validateFiles(files);

        // Create file objects for ALL files (valid and invalid) to show in progress
        const allFileObjects = [
            ...validFiles.map(file => ({
                file,
                id: `upload-${file.name}-${Date.now()}-${Math.random()}`,
                progress: 0,
                isValid: true,
                error: null,
            })),
            ...invalidFiles.map(({ file, error }) => ({
                file,
                id: `invalid-${file.name}-${Date.now()}-${Math.random()}`,
                progress: 0,
                isValid: false,
                error: error,
            })),
        ];

        // Create preview URLs for image files immediately
        allFileObjects.forEach(({ file, id }) => {
            if (file.type.startsWith('image/')) {
                createPreviewUrl(file, id);
            }
        });

        // Add all files to uploading state to show in progress list
        setUploadingFiles(prev => [...prev, ...allFileObjects]);

        if (validFiles.length === 0) {
            return;
        }

        const filesToProcess = validFiles.slice(
            0,
            maxFiles - currentImages.length
        );

        if (filesToProcess.length === 0) {
            toast.warning(`Maximum ${maxFiles} images allowed`);
            return;
        }

        if (filesToProcess.length < validFiles.length) {
            toast.warning(
                `Only ${filesToProcess.length} files will be uploaded due to the ${maxFiles} file limit`
            );
        }

        setErrors([]);

        // Get only the valid file objects that will be processed
        const validFileObjects = allFileObjects.filter(
            obj => obj.isValid && filesToProcess.includes(obj.file)
        );

        // Start progress simulation only for valid files
        const progressIntervals = validFileObjects.map(({ id }) =>
            simulateProgress(id)
        );

        try {
            const result = await uploadMultipleImage(filesToProcess, {
                folder,
            });

            if (result.error) {
                throw new Error(result.error);
            }

            // Complete progress for all valid files
            validFileObjects.forEach(({ id }) => {
                setUploadProgress(prev => ({ ...prev, [id]: 100 }));
            });

            // Clear intervals
            progressIntervals.forEach(clearInterval);

            // Clean up preview URLs for completed uploads
            setTimeout(() => {
                validFileObjects.forEach(({ id }) => {
                    cleanupPreviewUrl(id);
                    removeUploadingFile(id);
                });
            }, 1000);

            // Update Gallery
            setMediaItems(prev => [...result.uploadedMediaData, ...prev]);

            // Handle selector mode auto-selection and dialog closing
            if (selector && invalidFiles.length === 0) {
                // Auto-select the newly uploaded images

                if (multiple && setbulkSelectedItems) {
                    setbulkSelectedItems(prev => {
                        const currentItems = prev || [];
                        const newItems = [
                            ...currentItems,
                            ...result.uploadedMediaData,
                        ];

                        // Respect maxFiles limit
                        if (newItems.length > maxFiles) {
                            toast.warning(`Maximum ${maxFiles} images allowed`);
                            return currentItems;
                        }

                        return newItems;
                    });
                } else {
                    setbulkSelectedItems(result.uploadedMediaData[0]);
                }

                // Close the dialog after a brief delay to show success
                setTimeout(() => {
                    if (setIsFormOpen) {
                        setIsFormOpen(false);
                    }
                }, 1500);
            }

            setTimeout(() => {
                if (setIsFormOpen) {
                    setIsFormOpen(false);
                }
            }, 1500);
            toast.success(
                `Successfully uploaded ${result.uploadedMediaData.length} image(s)`
            );
        } catch (error) {
            setErrors(prev => [...prev, error.message]);

            // Clear intervals on error
            progressIntervals.forEach(clearInterval);

            // Clean up preview URLs for failed uploads
            validFileObjects.forEach(({ id }) => {
                cleanupPreviewUrl(id);
            });

            // Remove failed files from form
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
        }
    };

    return (
        <div className='space-y-4 z-999'>
            {/* Upload Area */}
            <div
                className={`border-2 hide-scrollbar hidden border-dashed rounded-lg p-8 transition-all duration-200 ${
                    isUploading
                        ? 'border-primary/30 bg-primary/5 cursor-not-allowed'
                        : dragActive
                          ? 'border-primary bg-primary/5 cursor-pointer'
                          : 'border-border hover:border-primary/50 cursor-pointer'
                }`}
                onClick={openFileDialog}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                aria-disabled={isUploading}>
                <div className='flex flex-col items-center justify-center space-y-4 text-center'>
                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${
                            isUploading ? 'bg-primary/10' : 'bg-muted'
                        }`}>
                        <HugeiconsIcon
                            icon={Upload02Icon}
                            size={24}
                            className={`${
                                isUploading
                                    ? 'text-primary'
                                    : 'text-muted-foreground'
                            }`}
                        />
                    </div>
                    <div>
                        <h3 className='text-sm font-medium text-foreground'>
                            {isUploading
                                ? `Uploading ${uploadingFiles.length} file(s)...`
                                : 'Upload files to secure cloud storage'}
                        </h3>
                        <p className='text-sm text-muted-foreground mt-1'>
                            {isUploading
                                ? 'Please wait while files are being processed...'
                                : 'Drag and drop your images here, or click to browse'}
                        </p>
                        <p className='text-sm text-muted-foreground mt-1'>
                            {multiple
                                ? `Up to ${maxFiles} files`
                                : 'Single file'}{' '}
                            • PNG, JPG, GIF up to 2MB each
                            {selector && ' • Images will be auto-selected'}
                        </p>
                    </div>
                </div>

                <input
                    type='file'
                    accept='image/*,.pdf,.doc,.docx'
                    multiple={multiple}
                    ref={inputRef}
                    onChange={handleChange}
                    disabled={isUploading}
                    className='hidden'
                />
            </div>

            {uploadingFiles.length > 0 && (
                <Dialog
                    open={uploadingFiles.length > 0}
                    onOpenChange={() => {
                        // Handle dialog close
                        setUploadingFiles([]);
                        setUploadProgress({});
                        setErrors([]);
                        setFileDialogOpened(false);
                        if (setIsFormOpen) {
                            setIsFormOpen(false);
                        }
                    }}>
                    <DialogContent
                        data-lenis-prevent
                        className='max-w-4xl z-[100000] max-h-[80vh] overflow-y-auto hide-scrollbar whitespace-nowrap overflow-x-hidden'>
                        <DialogHeader>
                            <DialogTitle>
                                Upload Progress {uploadingFiles.length}{' '}
                                file(s){' '}
                            </DialogTitle>
                        </DialogHeader>
                        {/* Upload Progress */}

                        <div className='space-y-3 hide-scrollbar'>
                            {uploadingFiles.map(
                                ({ file, id, isValid, error }) => (
                                    <div
                                        key={id}
                                        className={`rounded-lg p-4 hide-scrollbar ${
                                            isValid
                                                ? 'bg-muted'
                                                : 'bg-destructive/10 border border-destructive/20'
                                        }`}>
                                        <div className='flex items-center justify-between mb-2'>
                                            <div className='flex items-center space-x-3'>
                                                <div className='flex-shrink-0'>
                                                    {file.type.startsWith(
                                                        'image/'
                                                    ) ? (
                                                        <div className='relative w-12 h-12 rounded-md overflow-hidden border border-gray-200'>
                                                            <Image
                                                                alt='file preview'
                                                                src={
                                                                    previewUrls[
                                                                        id
                                                                    ] ||
                                                                    URL.createObjectURL(
                                                                        file
                                                                    )
                                                                }
                                                                fill
                                                                sizes='48px'
                                                                className='object-cover'
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className='w-12 h-12 rounded-md border border-border flex items-center justify-center bg-muted'>
                                                            <HugeiconsIcon
                                                                icon={
                                                                    File02Icon
                                                                }
                                                                size={24}
                                                                className={`${
                                                                    isValid
                                                                        ? 'text-muted-foreground'
                                                                        : 'text-destructive'
                                                                }`}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='max-w-xl flex-1'>
                                                    <p
                                                        className={`text-sm font-medium truncate ${
                                                            isValid
                                                                ? 'text-foreground'
                                                                : 'text-destructive'
                                                        }`}>
                                                        {file.name}
                                                    </p>
                                                    <p
                                                        className={`text-sm ${
                                                            isValid
                                                                ? 'text-muted-foreground'
                                                                : 'text-destructive'
                                                        }`}>
                                                        {formatFileSize(
                                                            file.size
                                                        )}
                                                        {!isValid &&
                                                            ' - Too large (max 2MB)'}
                                                    </p>
                                                    {!isValid && (
                                                        <p className='text-sm text-destructive mt-1'>
                                                            {error}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                {!isValid ? (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                removeUploadingFile(
                                                                    id
                                                                )
                                                            }
                                                            className='text-destructive hover:text-destructive/80 transition-colors p-1'
                                                            title='Remove file'>
                                                            <HugeiconsIcon
                                                                icon={
                                                                    Cancel01Icon
                                                                }
                                                                size={16}
                                                            />
                                                        </button>
                                                    </>
                                                ) : uploadProgress[id] ===
                                                  100 ? (
                                                    <HugeiconsIcon
                                                        icon={Tick02Icon}
                                                        size={20}
                                                        className='text-success'
                                                    />
                                                ) : (
                                                    <span className='text-sm font-medium text-primary'>
                                                        {Math.round(
                                                            uploadProgress[
                                                                id
                                                            ] || 0
                                                        )}
                                                        %
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {isValid && (
                                            <Progress
                                                value={uploadProgress[id] || 0}
                                                className='h-2'
                                            />
                                        )}
                                    </div>
                                )
                            )}
                        </div>

                        {/* Error Messages */}
                        {errors.length > 0 && (
                            <div className='space-y-2'>
                                {errors.map((error, index) => (
                                    <div
                                        key={index}
                                        className='flex items-center space-x-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg border border-destructive/20'>
                                        <span>{error}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default MediaUploader;

