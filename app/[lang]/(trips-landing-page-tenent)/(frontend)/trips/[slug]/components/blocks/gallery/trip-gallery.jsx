'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Grid3X3, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useAdmin } from '../../../../../../hooks/useAdmin';

export default function TripGallery({ mainImage, galleryImages }) {
    const { isEditMode, isAdmin } = useAdmin();
    const [showAllImages, setShowAllImages] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const allImages = [
        mainImage,
        ...galleryImages
            .map(img => img?.image?.url || img?.url)
            .filter(url => url && url.trim() !== ''),
    ];

    const handlePrevious = useCallback(() => {
        setCurrentIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
    }, [allImages.length]);

    const handleNext = useCallback(() => {
        setCurrentIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
    }, [allImages.length]);

    const handleKeyDown = useCallback(
        e => {
            if (e.key === 'Escape') setShowAllImages(false);
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'ArrowRight') handleNext();
        },
        [setShowAllImages, handlePrevious, handleNext]
    );

    const handleImageClick = useCallback(index => {
        setCurrentIndex(index);
        setShowAllImages(true);
    }, []);

    // Add event listener for keyboard navigation
    useEffect(() => {
        if (showAllImages) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [handleKeyDown, showAllImages]);

    // Get layout based on number of images
    const getLayoutConfig = totalImages => {
        if (totalImages === 1) return { layout: 'single', showViewAll: false };
        if (totalImages === 2) return { layout: 'two', showViewAll: false };
        if (totalImages === 3) return { layout: 'three', showViewAll: false };
        if (totalImages === 4) return { layout: 'four', showViewAll: false };
        if (totalImages === 5) return { layout: 'five', showViewAll: false };
        return { layout: 'many', showViewAll: true };
    };

    const totalImages = allImages.length;
    const { layout, showViewAll } = getLayoutConfig(totalImages);

    if (showAllImages) {
        return (
            <div
                className={cn(
                    `fixed inset-0 z-300 bg-black/95 backdrop-blur-sm`
                )}
                tabIndex={0}>
                {/* Close button */}
                <div className='absolute top-4 right-4 z-20'>
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => setShowAllImages(false)}
                        className='bg-background/20 hover:bg-background/30 text-white'>
                        <X className='h-6 w-6' />
                    </Button>
                </div>

                {/* Main gallery view */}
                <div className='relative h-full flex items-center justify-center p-4'>
                    {/* Previous button */}
                    <Button
                        variant='ghost'
                        size='icon'
                        className='absolute left-4 z-10 bg-background/20 hover:bg-background/30 text-white'
                        onClick={handlePrevious}
                        disabled={allImages.length <= 1}>
                        <ChevronLeft className='h-6 w-6' />
                    </Button>

                    {/* Main image */}
                    <div className='relative w-full h-full'>
                        <Image
                            src={allImages[currentIndex]}
                            alt={`Gallery image ${currentIndex + 1}`}
                            fill
                            className='w-auto h-auto object-contain rounded-lg'
                            priority
                        />
                    </div>

                    {/* Next button */}
                    <Button
                        variant='ghost'
                        size='icon'
                        className='absolute right-4 z-10 bg-background/20 hover:bg-background/30 text-white'
                        onClick={handleNext}
                        disabled={allImages.length <= 1}>
                        <ChevronRight className='h-6 w-6' />
                    </Button>

                    {/* Pagination dots */}
                    {allImages.length > 1 && (
                        <div className='absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black/30 px-4 py-2 rounded-full'>
                            {allImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    className={cn(
                                        'w-2 h-2 rounded-full transition-all duration-200',
                                        idx === currentIndex
                                            ? 'bg-background w-6'
                                            : 'bg-background/50 hover:bg-background/70'
                                    )}
                                    onClick={() => setCurrentIndex(idx)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Image counter */}
                    <div className='absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/30 px-3 py-1 rounded-full text-white text-sm'>
                        {currentIndex + 1} / {allImages.length}
                    </div>
                </div>
            </div>
        );
    }

    const renderLayout = () => {
        const baseClasses =
            'rounded-xl overflow-hidden group cursor-pointer relative transition-transform duration-300 hover:scale-[1.02]';

        switch (layout) {
            case 'single':
                return (
                    <div className='w-full h-[350px] sm:h-[400px] md:h-[550px] lg:h-[700px]'>
                        <div
                            className={`${baseClasses} h-full`}
                            onClick={() => handleImageClick(0)}>
                            <Image
                                src={mainImage}
                                alt='Gallery image'
                                fill
                                className='object-cover transition-transform duration-300 group-hover:scale-105'
                                priority
                            />
                            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
                        </div>
                    </div>
                );

            case 'two':
                return (
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 lg:gap-4 h-[350px] sm:h-[400px] md:h-[550px] lg:h-[700px]'>
                        {allImages.map((image, index) => (
                            <div
                                key={index}
                                className={`${baseClasses}`}
                                onClick={() => handleImageClick(index)}>
                                <Image
                                    src={image}
                                    alt={`Gallery image ${index + 1}`}
                                    fill
                                    className='object-cover transition-transform duration-300 group-hover:scale-105'
                                    sizes='(max-width: 640px) 100vw, 50vw'
                                />
                                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
                            </div>
                        ))}
                    </div>
                );

            case 'three':
                return (
                    <div className='grid grid-cols-3 grid-rows-2 gap-2 md:gap-3 lg:gap-4 h-[350px] sm:h-[400px] md:h-[550px] lg:h-[700px]'>
                        {/* First image takes 2 columns and 2 rows */}
                        <div
                            className={`${baseClasses} col-span-2 row-span-2`}
                            onClick={() => handleImageClick(0)}>
                            <Image
                                src={allImages[0]}
                                alt='Gallery image 1'
                                fill
                                className='object-cover transition-transform duration-300 group-hover:scale-105'
                                sizes='66vw'
                                priority
                            />
                            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
                        </div>

                        {/* Second image - top right */}
                        <div
                            className={`${baseClasses}`}
                            onClick={() => handleImageClick(1)}>
                            <Image
                                src={allImages[1]}
                                alt='Gallery image 2'
                                fill
                                className='object-cover transition-transform duration-300 group-hover:scale-105'
                                sizes='33vw'
                            />
                            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
                        </div>

                        {/* Third image - bottom right */}
                        <div
                            className={`${baseClasses}`}
                            onClick={() => handleImageClick(2)}>
                            <Image
                                src={allImages[2]}
                                alt='Gallery image 3'
                                fill
                                className='object-cover transition-transform duration-300 group-hover:scale-105'
                                sizes='33vw'
                            />
                            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
                        </div>
                    </div>
                );
            case 'four':
                return (
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4 h-[350px] sm:h-[400px] md:h-[550px] lg:h-[700px]'>
                        {/* First image takes larger space */}
                        <div
                            className={`${baseClasses} col-span-2 row-span-2`}
                            onClick={() => handleImageClick(0)}>
                            <Image
                                src={allImages[0]}
                                alt='Gallery image 1'
                                fill
                                className='object-cover transition-transform duration-300 group-hover:scale-105'
                                sizes='(max-width: 768px) 100vw, 50vw'
                                priority
                            />
                            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
                        </div>
                        {/* Other images */}
                        {allImages.slice(1, 4).map((image, index) => (
                            <div
                                key={index + 1}
                                className={cn(
                                    baseClasses,
                                    index >= 2 && 'hidden md:block',
                                    index === 2 && 'col-span-2' // Last image (index 2) spans 2 columns
                                )}
                                onClick={() => handleImageClick(index + 1)}>
                                <Image
                                    src={image}
                                    alt={`Gallery image ${index + 2}`}
                                    fill
                                    className='object-cover transition-transform duration-300 group-hover:scale-105'
                                    sizes={
                                        index === 2
                                            ? '(max-width: 768px) 100vw, 50vw'
                                            : '(max-width: 768px) 50vw, 25vw'
                                    }
                                />
                                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
                            </div>
                        ))}
                    </div>
                );
            case 'five':
                return (
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4 h-[350px] sm:h-[400px] md:h-[550px] lg:h-[700px]'>
                        {/* First image takes larger space */}
                        <div
                            className={`${baseClasses} col-span-2 row-span-2`}
                            onClick={() => handleImageClick(0)}>
                            <Image
                                src={allImages[0]}
                                alt='Gallery image 1'
                                fill
                                className='object-cover transition-transform duration-300 group-hover:scale-105'
                                sizes='(max-width: 768px) 100vw, 50vw'
                                priority
                            />
                            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
                        </div>
                        {/* Other images in a 2x2 grid */}
                        {allImages.slice(1, 5).map((image, index) => (
                            <div
                                key={index + 1}
                                className={cn(
                                    baseClasses,
                                    index >= 2 && 'hidden md:block'
                                )}
                                onClick={() => handleImageClick(index + 1)}>
                                <Image
                                    src={image}
                                    alt={`Gallery image ${index + 2}`}
                                    fill
                                    className='object-cover transition-transform duration-300 group-hover:scale-105'
                                    sizes='(max-width: 768px) 50vw, 25vw'
                                />
                                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
                            </div>
                        ))}
                    </div>
                );

            case 'many':
            default:
                return (
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4 h-[350px] sm:h-[400px] md:h-[550px] lg:h-[700px]'>
                        {/* Main large image */}
                        <div
                            className={`${baseClasses} col-span-2 row-span-2`}
                            onClick={() => handleImageClick(0)}>
                            <Image
                                src={allImages[0]}
                                alt='Main gallery image'
                                fill
                                className='object-cover transition-transform duration-300 group-hover:scale-105'
                                sizes='(max-width: 768px) 100vw, 50vw'
                                priority
                            />
                            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
                        </div>

                        {/* Secondary images - show first 4 additional images */}
                        {allImages.slice(1, 5).map((image, index) => (
                            <div
                                key={index + 1}
                                className={cn(
                                    baseClasses,
                                    index >= 2 && 'hidden md:block'
                                )}
                                onClick={() => handleImageClick(index + 1)}>
                                <Image
                                    src={image}
                                    alt={`Gallery image ${index + 2}`}
                                    fill
                                    className='object-cover transition-transform duration-300 group-hover:scale-105'
                                    sizes='(max-width: 768px) 50vw, 25vw'
                                />
                                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />

                                {/* Show count overlay on last visible image if there are more images */}
                                {index === 3 && allImages.length > 5 && (
                                    <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
                                        <span className='text-white font-semibold text-sm'>
                                            +{allImages.length - 5}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className='relative w-full mb-5'>
            <div className=''>
                {renderLayout()}

                {/* Show all photos button - only when there are 6+ images */}
                {showViewAll && (
                    <div className='flex justify-end -mt-4'>
                        <Button
                            variant='outline'
                            className='bg-background backdrop-blur-sm hover:bg-background shadow-lg border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100'
                            onClick={() => setShowAllImages(true)}>
                            <Grid3X3 className='mr-2 h-4 w-4' />
                            Show all {allImages.length} photos
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

