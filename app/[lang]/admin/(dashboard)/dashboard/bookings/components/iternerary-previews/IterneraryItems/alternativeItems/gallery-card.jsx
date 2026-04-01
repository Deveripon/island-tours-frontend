'use client';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export const GalleryComponent = ({ images, title = 'image', className }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Handle empty gallery case
    if (!images || images.length === 0) {
        return (
            <div className='relative w-full aspect-[4/3] bg-gray-200 flex items-center justify-center'>
                <span className='text-gray-500'>No images available</span>
            </div>
        );
    }

    const handlePrevious = e => {
        e.stopPropagation();
        setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = e => {
        e.stopPropagation();
        setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div
            className={cn(
                `relative w-full aspect-[4/3] bg-black overflow-hidden group`,
                className
            )}>
            {/* Current image */}
            <div className='w-full h-full relative'>
                <Image
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    src={images[activeIndex].url}
                    alt={images[activeIndex].originalName || title}
                    className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                />

                {/* Image overlay gradient */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            </div>

            {/* Navigation controls - only show if more than one image */}
            {images.length > 1 && (
                <>
                    {/* Previous button */}
                    <button
                        onClick={handlePrevious}
                        className='absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 text-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background'
                        aria-label='Previous image'>
                        <ChevronLeft size={18} />
                    </button>

                    {/* Next button */}
                    <button
                        onClick={handleNext}
                        className='absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 text-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background'
                        aria-label='Next image'>
                        <ChevronRight size={18} />
                    </button>

                    {/* Image counter */}
                    <div className='absolute bottom-3 right-3 bg-black/60 text-white text-sm py-1 px-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                        {activeIndex + 1} / {images.length}
                    </div>

                    {/* Image indicators */}
                    <div className='absolute bottom-3 left-0 right-0 flex justify-center gap-1.5'>
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={e => {
                                    e.stopPropagation();
                                    setActiveIndex(index);
                                }}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                    index === activeIndex
                                        ? 'bg-background w-3'
                                        : 'bg-background/60 hover:bg-background/80'
                                }`}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

