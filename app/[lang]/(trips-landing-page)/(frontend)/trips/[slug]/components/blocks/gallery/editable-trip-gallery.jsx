'use client';

import { updateTrip } from '@/app/_actions/trips/affiliateTripsAction';
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
import { BlockEditWrapper } from '../common/block-edit-wrapper';
import { useBlockEditState } from '../context/block-edit-context';
import { GalleryForm } from './gallery-form';
import TripGallery from './trip-gallery';

const EditableTripGallery = ({
    trip,
    data: blockData,
    id,
    isBlock = false,
}) => {
    const { isAdmin, mode, MODES } = useAdmin();
    // Use the hook for block edit state
    const { isEditing, setIsEditing, onUpdate } = useBlockEditState(id);
    const isEditMode = mode === MODES.edit;
    const [selectedImage, setSelectedImage] = useState(null);
    const [galleryImagesData, setGalleryImagesData] = useState([]);

    // Default data
    const defaultData = useMemo(() => {
        return [
            'https://images.pexels.com/photos/3601421/pexels-photo-3601421.jpeg',
            'https://images.pexels.com/photos/1450340/pexels-photo-1450340.jpeg',
            'https://images.pexels.com/photos/618079/pexels-photo-618079.jpeg',
            'https://images.pexels.com/photos/3600569/pexels-photo-3600569.jpeg',
            'https://images.pexels.com/photos/3581916/pexels-photo-3581916.jpeg',
            'https://images.pexels.com/photos/1562058/pexels-photo-1562058.jpeg',
        ].map((url, index) => ({
            id: `default_${index}`,
            tripId: trip?.id || null,
            imageId: `default_image_${index}`,
            order: index,
            altText: `Default gallery image ${index + 1}`,
            caption: '',
            fileName: `default_image_${index + 1}.jpg`,
            isHero: false,
            addedAt: new Date().toISOString(),
            image: {
                id: `default_image_${index}`,
                url: url,
                thumbnail: url,
                originalName: `default_image_${index + 1}.jpg`,
                size: 0,
                format: 'jpg',
                width: 800,
                height: 600,
                cloudinaryId: `default_${index}`,
            },
            url: url,
        }));
    }, [trip?.id]);

    // Initialize form with current data
    const methods = useForm({
        defaultValues: {
            galleryImages: [],
        },
    });

    // Update form when galleryImagesData changes
    useEffect(() => {
        let sourceData = null;

        if (isBlock && blockData && blockData.galleryImages) {
            sourceData = blockData.galleryImages;
        } else if (trip?.galleryImages && trip.galleryImages.length > 0) {
            sourceData = trip.galleryImages;
        }

        if (sourceData && sourceData.length > 0) {
            setGalleryImagesData(sourceData);

            const formattedImages = sourceData.map((galleryImage, index) => ({
                imageId: galleryImage.imageId || galleryImage.image?.id,
                fileName: galleryImage.fileName || `gallery_image_${index + 1}`,
                caption: galleryImage.caption || '',
                altText: galleryImage.altText || `Gallery image ${index + 1}`,
                url: galleryImage.image?.url || galleryImage.url,
                originalGalleryItem: galleryImage,
            }));

            methods.reset({
                galleryImages: formattedImages,
            });
        } else {
            setGalleryImagesData(defaultData);

            const formattedDefaultImages = defaultData.map(
                (galleryImage, index) => ({
                    imageId: galleryImage.imageId,
                    fileName: galleryImage.fileName,
                    caption: galleryImage.caption,
                    altText: galleryImage.altText,
                    url: galleryImage.image.url,
                })
            );

            methods.reset({
                galleryImages: formattedDefaultImages,
            });
        }
    }, [defaultData, trip?.galleryImages, methods, blockData, isBlock]);

    const openModal = image => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    const handleKeyDown = useCallback(
        e => {
            if (!selectedImage) return;

            const imageUrls = galleryImagesData.map(
                item => item.image?.url || item.url
            );
            const currentIndex = imageUrls.indexOf(selectedImage);

            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                const prevIndex =
                    currentIndex === 0
                        ? imageUrls.length - 1
                        : currentIndex - 1;
                setSelectedImage(imageUrls[prevIndex]);
            } else if (e.key === 'ArrowRight') {
                const nextIndex =
                    currentIndex === imageUrls.length - 1
                        ? 0
                        : currentIndex + 1;
                setSelectedImage(imageUrls[nextIndex]);
            }
        },
        [selectedImage, galleryImagesData]
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
            const imageData =
                data.galleryImages?.map((img, index) => ({
                    imageId: img.imageId,
                    url: img.url,
                    fileName: img.fileName,
                    caption: img.caption,
                    altText: img.altText,
                    order: index,
                    ...(img.originalGalleryItem && {
                        id: img.originalGalleryItem.id,
                        tripId: img.originalGalleryItem.tripId,
                    }),
                })) || [];

            if (isBlock) {
                onUpdate({ galleryImages: imageData });
                setGalleryImagesData(imageData);
                setIsEditing(false);
                return;
            }

            const result = await updateTrip(trip?.id, {
                galleryImages: imageData,
            });

            const validGalleryImages = (
                result?.galleryImages || imageData
            ).filter(item => {
                const url = item.image?.url || item.url;
                return url && url.trim() !== '';
            });

            setGalleryImagesData(validGalleryImages);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving gallery images:', error);
        }
    };

    const handleCancel = useCallback(() => {
        const savedData = trip?.galleryImages;
        if (savedData && savedData.length > 0) {
            setGalleryImagesData(savedData);

            const formattedImages = savedData.map((galleryImage, index) => ({
                imageId: galleryImage.imageId || `gallery_${index}`,
                fileName: galleryImage.fileName || `gallery_image_${index + 1}`,
                caption: galleryImage.caption || '',
                altText: galleryImage.altText || `Gallery image ${index + 1}`,
                url: galleryImage.image?.url || galleryImage.url,
            }));

            methods.reset({
                galleryImages: formattedImages,
            });
        } else {
            setGalleryImagesData(defaultData.map(url => ({ image: { url } })));

            const formattedDefaultImages = defaultData.map(
                (imageUrl, index) => ({
                    imageId: `default_gallery_${index}`,
                    fileName: `default_gallery_image_${index + 1}`,
                    caption: '',
                    altText: `Gallery image ${index + 1}`,
                    url: imageUrl,
                })
            );

            methods.reset({
                galleryImages: formattedDefaultImages,
            });
        }
        setIsEditing(false);
    }, [defaultData, trip?.galleryImages, methods]);

    return (
        <>
            <BlockEditWrapper
                isEditMode={isEditMode}
                isAdmin={isAdmin}
                onEdit={() => setIsEditing(true)}>
                {galleryImagesData && galleryImagesData.length > 0 ? (
                    <TripGallery
                        mainImage={trip?.mainImage?.image?.url}
                        galleryImages={galleryImagesData}
                    />
                ) : (
                    <div className='flex items-center justify-center h-[500px] text-muted-foreground bg-accent/5 rounded-xl border border-dashed border-border'>
                        <p className='text-sm'>No gallery images available</p>
                    </div>
                )}
            </BlockEditWrapper>

            {/* Modal for enlarged image view */}
            {selectedImage && (
                <div
                    className='fixed inset-0 bg-black/95 backdrop-blur-md z-[9999]'
                    tabIndex={0}>
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

                    <div className='relative h-full flex items-center justify-center p-8'>
                        <button
                            className='absolute left-6 z-10 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
                            onClick={() => {
                                const imageUrls = galleryImagesData.map(
                                    item => item.image?.url || item.url
                                );
                                const currentIndex =
                                    imageUrls.indexOf(selectedImage);
                                const prevIndex =
                                    currentIndex === 0
                                        ? imageUrls.length - 1
                                        : currentIndex - 1;
                                setSelectedImage(imageUrls[prevIndex]);
                            }}
                            disabled={galleryImagesData.length <= 1}>
                            <HugeiconsIcon
                                icon={ArrowLeft01Icon}
                                className='w-6 h-6'
                            />
                        </button>

                        <div className='relative w-full h-full'>
                            <Image
                                src={selectedImage}
                                alt={`Gallery image ${
                                    galleryImagesData
                                        .map(
                                            item => item.image?.url || item.url
                                        )
                                        .indexOf(selectedImage) + 1
                                }`}
                                fill
                                className='object-contain rounded-lg'
                                priority
                            />
                        </div>

                        <button
                            className='absolute right-6 z-10 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
                            onClick={() => {
                                const imageUrls = galleryImagesData.map(
                                    item => item.image?.url || item.url
                                );
                                const currentIndex =
                                    imageUrls.indexOf(selectedImage);
                                const nextIndex =
                                    currentIndex === imageUrls.length - 1
                                        ? 0
                                        : currentIndex + 1;
                                setSelectedImage(imageUrls[nextIndex]);
                            }}
                            disabled={galleryImagesData.length <= 1}>
                            <HugeiconsIcon
                                icon={ArrowRight01Icon}
                                className='w-6 h-6'
                            />
                        </button>

                        {galleryImagesData.length > 1 && (
                            <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black/20 backdrop-blur-sm px-5 py-3 rounded-full border border-white/10'>
                                {galleryImagesData.map((item, idx) => {
                                    const imageUrl =
                                        item.image?.url || item.url;
                                    return (
                                        <button
                                            key={idx}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                imageUrl === selectedImage
                                                    ? 'bg-white w-8 shadow-lg'
                                                    : 'bg-white/40 hover:bg-white/60'
                                            }`}
                                            onClick={() =>
                                                setSelectedImage(imageUrl)
                                            }
                                        />
                                    );
                                })}
                            </div>
                        )}

                        <div className='absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium border border-white/10 shadow-lg'>
                            {galleryImagesData
                                .map(item => item.image?.url || item.url)
                                .indexOf(selectedImage) + 1}{' '}
                            / {galleryImagesData.length}
                        </div>
                    </div>
                </div>
            )}

            <GalleryForm
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                methods={methods}
                handleSave={handleSave}
                handleCancel={handleCancel}
            />
        </>
    );
};

export default EditableTripGallery;

