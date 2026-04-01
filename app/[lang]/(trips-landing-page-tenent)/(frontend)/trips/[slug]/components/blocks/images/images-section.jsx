'use client';

import { updateAffiliateTripById } from '@/app/_actions/trips/affiliateTripsAction';
import {
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Cancel01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAdmin } from '../../../../../../hooks/useAdmin';
import SectionTitle from '../../section-title';
import { BlockEditWrapper } from '../common/block-edit-wrapper';
import { useBlockEditState } from '../context/block-edit-context';
import { ImagesForm } from './images-form';

const ImagesSection = ({
    trip,
    tenantId,
    data: blockData,
    id,
    isBlock = false,
}) => {
    const { isAdmin, mode, MODES } = useAdmin();
    // Use the hook for block edit state
    const { isEditing, setIsEditing, onUpdate } = useBlockEditState(id);
    const isEditMode = mode === MODES.edit;
    const [selectedImage, setSelectedImage] = useState(null);
    const [tripMemoriesData, setTripMemoriesData] = useState({
        title: 'Images',
        subtitle: '',
        images: [],
    });

    // Default data
    const defaultData = useMemo(() => {
        return {
            title: 'Images',
            subtitle: '',
            images: [
                'https://images.pexels.com/photos/3601421/pexels-photo-3601421.jpeg',
                'https://images.pexels.com/photos/1450340/pexels-photo-1450340.jpeg',
                'https://images.pexels.com/photos/1450340/pexels-photo-1450340.jpeg',
                'https://images.pexels.com/photos/618079/pexels-photo-618079.jpeg',
                'https://images.pexels.com/photos/3600569/pexels-photo-3600569.jpeg',
                'https://images.pexels.com/photos/3581916/pexels-photo-3581916.jpeg',
                'https://images.pexels.com/photos/1562058/pexels-photo-1562058.jpeg',
                'https://images.pexels.com/photos/1450340/pexels-photo-1450340.jpeg',
                'https://images.pexels.com/photos/618079/pexels-photo-618079.jpeg',
                'https://images.pexels.com/photos/3600569/pexels-photo-3600569.jpeg',
                'https://images.pexels.com/photos/3581916/pexels-photo-3581916.jpeg',
                'https://images.pexels.com/photos/1562058/pexels-photo-1562058.jpeg',
            ],
        };
    }, []);

    // Initialize form with current data
    const methods = useForm({
        defaultValues: {
            title: '',
            subtitle: '',
            galleryImages: [],
        },
    });

    // Update form and local state when trip/block data changes
    useEffect(() => {
        let savedData = null;
        if (isBlock && blockData) {
            savedData = blockData;
        } else {
            savedData = trip?.userAddedOptions?.memories;
        }

        if (savedData && savedData.images && savedData.images.length > 0) {
            setTripMemoriesData(savedData);

            const formattedImages = savedData.images.map((imageUrl, index) => ({
                imageId: `temp_${index}`,
                fileName: `image_${index + 1}`,
                caption: '',
                altText: `Travel destination image ${index + 1}`,
                url: imageUrl,
            }));

            methods.reset({
                title: savedData.title || 'Images',
                subtitle: savedData.subtitle || '',
                galleryImages: formattedImages,
            });
        } else {
            setTripMemoriesData(defaultData);

            const formattedDefaultImages = defaultData.images.map(
                (imageUrl, index) => ({
                    imageId: `default_${index}`,
                    fileName: `default_image_${index + 1}`,
                    caption: '',
                    altText: `Travel destination image ${index + 1}`,
                    url: imageUrl,
                })
            );

            methods.reset({
                title: defaultData.title,
                subtitle: defaultData.subtitle,
                galleryImages: formattedDefaultImages,
            });
        }
    }, [
        defaultData,
        trip?.userAddedOptions?.memories,
        methods,
        blockData,
        isBlock,
    ]);

    const openModal = image => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
        e => {
            if (!selectedImage) return;

            const currentIndex =
                tripMemoriesData?.images.indexOf(selectedImage);

            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                const prevIndex =
                    currentIndex === 0
                        ? tripMemoriesData.images.length - 1
                        : currentIndex - 1;
                setSelectedImage(tripMemoriesData.images[prevIndex]);
            } else if (e.key === 'ArrowRight') {
                const nextIndex =
                    currentIndex === tripMemoriesData.images.length - 1
                        ? 0
                        : currentIndex + 1;
                setSelectedImage(tripMemoriesData.images[nextIndex]);
            }
        },
        [selectedImage, tripMemoriesData.images]
    );

    useEffect(() => {
        if (selectedImage) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [selectedImage, handleKeyDown]);

    const handleSave = async data => {
        try {
            const imageUrls = data.galleryImages?.map(img => img.url) || [];

            const updatedMemoriesData = {
                title: data.title,
                subtitle: data.subtitle,
                images: imageUrls,
            };

            if (isBlock) {
                onUpdate(updatedMemoriesData);
                setTripMemoriesData(updatedMemoriesData);
                setIsEditing(false);
                return;
            }

            await updateAffiliateTripById(trip?.id, {
                userAddedOptions: {
                    ...trip?.userAddedOptions,
                    memories: updatedMemoriesData,
                },
            });

            setTripMemoriesData(updatedMemoriesData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving trip memories data:', error);
        }
    };

    const handleCancel = useCallback(() => {
        let savedData = null;
        if (isBlock && blockData) {
            savedData = blockData;
        } else {
            savedData = trip?.userAddedOptions?.memories;
        }

        if (savedData && savedData?.images?.length > 0) {
            setTripMemoriesData(savedData);

            const formattedImages = savedData?.images?.map(
                (imageUrl, index) => ({
                    imageId: `temp_${index}`,
                    fileName: `image_${index + 1}`,
                    caption: '',
                    altText: `Travel destination image ${index + 1}`,
                    url: imageUrl,
                })
            );

            methods.reset({
                title: savedData.title || 'Images',
                subtitle: savedData.subtitle || '',
                galleryImages: formattedImages,
            });
        } else {
            setTripMemoriesData(defaultData);

            const formattedDefaultImages = defaultData.images.map(
                (imageUrl, index) => ({
                    imageId: `default_${index}`,
                    fileName: `default_image_${index + 1}`,
                    caption: '',
                    altText: `Travel destination image ${index + 1}`,
                    url: imageUrl,
                })
            );

            methods.reset({
                title: defaultData.title,
                subtitle: defaultData.subtitle,
                galleryImages: formattedDefaultImages,
            });
        }
        setIsEditing(false);
    }, [
        defaultData,
        trip?.userAddedOptions?.memories,
        methods,
        blockData,
        isBlock,
    ]);

    const displayImages = useMemo(() => {
        return isEditing
            ? methods.watch('galleryImages')?.map(img => img.url) || []
            : tripMemoriesData?.images || [];
    }, [isEditing, methods, tripMemoriesData.images]);

    return (
        <>
            <BlockEditWrapper
                isEditMode={isEditMode}
                isAdmin={isAdmin}
                onEdit={() => setIsEditing(true)}>
                <SectionTitle className='text-2xl sm:text-3xl'>
                    {tripMemoriesData.title || 'Images'}
                </SectionTitle>

                {tripMemoriesData.subtitle && (
                    <p className='text-muted-foreground mb-8 text-sm sm:text-base max-w-3xl leading-relaxed'>
                        {tripMemoriesData.subtitle}
                    </p>
                )}

                {/* CSS Column Masonry Grid */}
                <div className='columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6'>
                    {displayImages.map((item, i) => {
                        const heights = [
                            'h-48',
                            'h-64',
                            'h-56',
                            'h-72',
                            'h-60',
                            'h-80',
                            'h-52',
                            'h-68',
                        ];
                        const randomHeight = heights[i % heights.length];

                        return (
                            <div
                                key={i}
                                className='break-inside-avoid mb-4 sm:mb-6 cursor-pointer relative group/img'
                                onClick={() => !isEditMode && openModal(item)}>
                                <div className='relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] bg-accent/5 border border-border'>
                                    <div
                                        className={`relative ${randomHeight} w-full`}>
                                        <Image
                                            src={item}
                                            fill
                                            alt={`Travel destination image ${
                                                i + 1
                                            }`}
                                            className='object-cover transition-transform duration-500 group-hover/img:scale-110'
                                            loading='lazy'
                                            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'
                                        />
                                        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </BlockEditWrapper>

            {/* Modal for enlarged image view */}
            {selectedImage && (
                <div
                    className='fixed inset-0 bg-black/95 backdrop-blur-md z-[9999]'
                    tabIndex={0}>
                    {/* Close button */}
                    <div className='absolute top-6 right-6 z-20'>
                        <button
                            onClick={closeModal}
                            className='bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm border border-white/20'
                            aria-label='Close modal'>
                            <HugeiconsIcon
                                icon={Cancel01Icon}
                                className='w-6 h-6'
                            />
                        </button>
                    </div>

                    {/* Main gallery view */}
                    <div className='relative h-full flex items-center justify-center p-8'>
                        {/* Previous button */}
                        <button
                            className='absolute left-6 z-10 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
                            onClick={() => {
                                const currentIndex =
                                    tripMemoriesData.images.indexOf(
                                        selectedImage
                                    );
                                const prevIndex =
                                    currentIndex === 0
                                        ? tripMemoriesData.images.length - 1
                                        : currentIndex - 1;
                                setSelectedImage(
                                    tripMemoriesData.images[prevIndex]
                                );
                            }}
                            disabled={tripMemoriesData.images.length <= 1}>
                            <HugeiconsIcon
                                icon={ArrowLeft01Icon}
                                className='w-6 h-6'
                            />
                        </button>

                        {/* Main image */}
                        <div className='relative w-full h-full'>
                            <Image
                                src={selectedImage}
                                alt={`Gallery image ${
                                    tripMemoriesData.images.indexOf(
                                        selectedImage
                                    ) + 1
                                }`}
                                fill
                                className='object-contain rounded-lg'
                                priority
                            />
                        </div>

                        {/* Next button */}
                        <button
                            className='absolute right-6 z-10 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
                            onClick={() => {
                                const currentIndex =
                                    tripMemoriesData.images.indexOf(
                                        selectedImage
                                    );
                                const nextIndex =
                                    currentIndex ===
                                    tripMemoriesData.images.length - 1
                                        ? 0
                                        : currentIndex + 1;
                                setSelectedImage(
                                    tripMemoriesData.images[nextIndex]
                                );
                            }}
                            disabled={tripMemoriesData.images.length <= 1}>
                            <HugeiconsIcon
                                icon={ArrowRight01Icon}
                                className='w-6 h-6'
                            />
                        </button>

                        {/* Pagination dots */}
                        {tripMemoriesData.images.length > 1 && (
                            <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black/20 backdrop-blur-sm px-5 py-3 rounded-full border border-white/10'>
                                {tripMemoriesData.images.map((image, idx) => (
                                    <button
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                            image === selectedImage
                                                ? 'bg-white w-8 shadow-lg'
                                                : 'bg-white/40 hover:bg-white/60'
                                        }`}
                                        onClick={() => setSelectedImage(image)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Image counter */}
                        <div className='absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium border border-white/10 shadow-lg'>
                            {tripMemoriesData.images.indexOf(selectedImage) + 1}{' '}
                            / {tripMemoriesData.images.length}
                        </div>
                    </div>
                </div>
            )}

            <ImagesForm
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                methods={methods}
                handleSave={handleSave}
                handleCancel={handleCancel}
            />
        </>
    );
};

export default ImagesSection;

