'use client';

import {
    removeProfilePhoto,
    updateUserInformationById,
} from '@/app/_actions/userActions';

import { AnimatedProgress } from '@/components/common/animate-progress';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import ImageCropper from './image-cropper';

const MAX_SIZE_MB = 5;

const ProfilePhotoSection = ({ user }) => {
    const { data: session } = useSession();
    const fileInputRef = useRef(null);
    const [currentPhoto, setCurrentPhoto] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [tempPhotoUrl, setTempPhotoUrl] = useState('');

    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    const [openCropper, setOpenCropper] = useState(false);

    useEffect(() => {
        if (user) {
            let imageUrl = '';
            if (typeof user.image === 'string') {
                imageUrl = user.image;
            } else if (
                user.image &&
                typeof user.image === 'object' &&
                user.image.url
            ) {
                imageUrl = user.image.url;
            }

            if (imageUrl) {
                setCurrentPhoto(imageUrl);
            } else {
                setCurrentPhoto('');
            }
        }
    }, [user]);

    const handleFileChange = e => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');

        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setError('File too large. Max size is 5MB.');
            return;
        }

        if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
            setError('Invalid format. Only PNG, JPG, or WEBP allowed.');
            return;
        }

        const url = URL.createObjectURL(file);
        setTempPhotoUrl(url);
        setOpenCropper(true);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCropperClose = () => {
        setTempPhotoUrl('');
        setOpenCropper(false);
        setSelectedFile(null);
        setError('');
    };

    const handleCropComplete = async (file, blobUrl) => {
        setSelectedFile(file);
        setCurrentPhoto(blobUrl);
        setOpenCropper(false);

        if (file && session?.user?.id) {
            setUploading(true);

            try {
                const formData = new FormData();
                formData.append('file', file);

                const uploadRes = await fetch('/api/uploads/profile-photo', {
                    method: 'POST',
                    body: formData });

                const uploadData = await uploadRes.json();

                if (uploadRes.ok) {
                    const publicId =
                        typeof user?.image === 'object' &&
                        user?.image?.public_id
                            ? user.image.public_id
                            : null;

                    if (publicId) {
                        await removeProfilePhoto(publicId);
                    }

                    await updateUserInformationById(session.user.id, {
                        image: {
                            url: uploadData.url,
                            public_id: uploadData.publicId,
                        } });

                    setCurrentPhoto(uploadData.url);
                    setSelectedFile(null);
                } else {
                    setError('Failed to upload. Try again.');
                }
            } catch (error) {
                setError('Something went wrong.');
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <div className='flex w-full flex-col lg:flex-row gap-8'>
            {/* Left Section */}
            <div className='flex lg:w-1/2 w-full pr-6 border-b lg:border-b-0 lg:border-r border-border pb-6 lg:pb-0'>
                <div className='flex items-center gap-6 w-full'>
                    {/* Avatar */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className='relative w-28 h-28 rounded-full bg-muted shadow-sm overflow-hidden ring-2 ring-border'>
                        <Image
                            src={
                                currentPhoto || 'https://github.com/shadcn.png'
                            }
                            alt='Profile'
                            width={112}
                            height={112}
                            sizes='(max-width: 768px) 80px, 112px'
                            quality={90}
                            className='object-cover rounded-full'
                        />
                    </motion.div>

                    {/* Controls */}
                    <div className='flex flex-col gap-3'>
                        <input
                            type='file'
                            accept='image/png, image/jpeg, image/webp'
                            className='hidden'
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />

                        {uploading ? (
                            <AnimatedProgress
                                target={100}
                                speed={40}
                                className='bg-primary w-40 h-2'
                            />
                        ) : (
                            <Button
                                size='sm'
                                variant='default'
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className='gap-2 bg-primary hover:bg-primary/90 text-primary-foreground'>
                                <Upload className='w-4 h-4' />
                                Upload Photo
                            </Button>
                        )}

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    className='text-xs font-medium text-destructive'>
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className='flex justify-center items-center text-sm lg:w-1/2 w-full'>
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className='max-w-sm'>
                    <h3 className='font-semibold mb-3 text-foreground'>
                        📸 Image requirements:
                    </h3>
                    <ul className='list-disc pl-5 space-y-2 text-muted-foreground'>
                        <li className='text-sm'>Minimum size: 400 x 400px</li>
                        <li className='text-sm'>Maximum file size: 5MB</li>
                        <li className='text-sm'>Clear face or company logo</li>
                        <li className='text-sm'>
                            Supported formats: JPG, PNG, WEBP
                        </li>
                    </ul>
                </motion.div>
            </div>

            <ImageCropper
                open={openCropper}
                imageSrc={tempPhotoUrl || ''}
                onClose={handleCropperClose}
                onCropComplete={handleCropComplete}
            />
        </div>
    );
};

export default ProfilePhotoSection;

