'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, User } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export function ReviewCardWide({ review }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedImageIdx, setSelectedImageIdx] = useState(null);
    const avatarUrl =
        review.reviewerAvatar?.url ||
        (typeof review.reviewerAvatar === 'string'
            ? review.reviewerAvatar
            : null);

    // Parse the date to the format in the image (DD.MM.YYYY) if available.
    // Assuming review.timeAgo holds the string or we fallback.
    const dateText = review.timeAgo || '26.08.2025';

    return (
        <div className='dark:bg-transparent rounded-[20px] p-6 sm:p-8 w-full border border-zinc-200 dark:border-zinc-800/80 shadow-[0_2px_10px_rgb(0,0,0,0.04)] dark:shadow-none flex flex-col'>
            {/* Header: User & Date */}
            <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-3'>
                    <div
                        className={cn(
                            'w-11 h-11 rounded-full flex items-center justify-center text-zinc-400 font-semibold text-sm overflow-hidden relative bg-zinc-100 dark:bg-zinc-800/50',
                            review.avatarBg
                        )}>
                        {avatarUrl ? (
                            <Image
                                src={avatarUrl}
                                alt={review.name}
                                fill
                                className='object-cover'
                            />
                        ) : (
                            <User className='w-5 h-5 text-zinc-400' />
                        )}
                    </div>
                    <div className='flex flex-col'>
                        <h3 className='font-semibold text-[15px] text-zinc-900 dark:text-zinc-100 leading-none tracking-tight'>
                            {review.name}
                        </h3>
                    </div>
                </div>
                <time className='text-zinc-400 dark:text-zinc-500 text-[13px] font-medium'>
                    {dateText}
                </time>
            </div>

            {/* Rating */}
            <div className='flex items-center gap-2 mb-4'>
                <div className='flex gap-0.5 shrink-0'>
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={cn(
                                'w-3.5 h-3.5',
                                i < review.rating
                                    ? 'fill-[#21b8c7] text-[#21b8c7]'
                                    : 'fill-zinc-200 text-zinc-200 dark:fill-zinc-800 dark:text-zinc-800'
                            )}
                        />
                    ))}
                </div>
                <span className='text-[13px] font-medium text-zinc-500 dark:text-zinc-400'>
                    {Number(review.rating || 5).toFixed(1)}
                </span>
            </div>

            {/* Content Text */}
            <div className='flex flex-col gap-2 relative z-10 text-left mb-4'>
                {review.title && (
                    <h4 className='text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 leading-snug'>
                        {review.title}
                    </h4>
                )}

                <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? 'auto' : '52px' }}
                    className={cn(
                        'relative overflow-hidden',
                        isExpanded ? '' : 'mask-image-bottom'
                    )}
                    style={
                        !isExpanded
                            ? {
                                  maskImage:
                                      'linear-gradient(to bottom, black 40%, transparent 100%)',
                                  WebkitMaskImage:
                                      'linear-gradient(to bottom, black 40%, transparent 100%)',
                              }
                            : {}
                    }>
                    <p className='text-[14.5px] text-zinc-600 dark:text-zinc-300 leading-[1.6] font-sans pr-4'>
                        {review.text}
                    </p>
                </motion.div>

                {review.text?.length > 150 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className='mt-1.5 text-[14px] font-semibold text-[#21b8c7] hover:text-[#1996a3] transition-colors text-left w-max z-20'>
                        {isExpanded ? 'Read Less' : 'Read More'}
                    </button>
                )}
            </div>

            {/* Attachments (Horizontal Row) */}
            {review.images && review.images.length > 0 && (
                <div className='flex flex-wrap gap-3 mt-1'>
                    {review.images.map((img, idx) => {
                        const srcUrl =
                            img?.url || (typeof img === 'string' ? img : null);
                        if (!srcUrl) return null;
                        return (
                            <div
                                key={idx}
                                onClick={() => setSelectedImageIdx(idx)}
                                className='relative w-[90px] h-[72px] rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm cursor-pointer group/img'>
                                <Image
                                    src={srcUrl}
                                    alt={`Review image ${idx + 1}`}
                                    fill
                                    className='object-cover hover:scale-105 transition-transform duration-300'
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Lightbox Viewer */}
            <Dialog
                open={selectedImageIdx !== null}
                onOpenChange={open => {
                    if (!open) setSelectedImageIdx(null);
                }}>
                <DialogContent className='max-w-5xl w-[90vw] p-0 overflow-hidden bg-transparent border-none shadow-none text-white [&>button]:text-white [&>button]:bg-black/50 hover:[&>button]:bg-black/80 [&>button]:z-50  [&>button]:rounded-full [&>button]:top-4 [&>button]:right-4'>
                    <DialogTitle className='sr-only'>
                        Review Attachment
                    </DialogTitle>
                    {selectedImageIdx !== null && (
                        <div className='relative w-full h-[80vh] flex items-center justify-center'>
                            <Image
                                src={
                                    review.images[selectedImageIdx]?.url ||
                                    (typeof review.images[selectedImageIdx] ===
                                    'string'
                                        ? review.images[selectedImageIdx]
                                        : '')
                                }
                                alt={`Review Attachment ${selectedImageIdx + 1}`}
                                fill
                                className='object-contain'
                            />

                            {review.images.length > 1 && (
                                <>
                                    <button
                                        onClick={e => {
                                            e.stopPropagation();
                                            setSelectedImageIdx(prev =>
                                                prev === 0
                                                    ? review.images.length - 1
                                                    : prev - 1
                                            );
                                        }}
                                        className='absolute left-2 sm:left-4 z-40 p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors backdrop-blur-sm'>
                                        <ChevronLeft className='w-6 h-6' />
                                    </button>
                                    <button
                                        onClick={e => {
                                            e.stopPropagation();
                                            setSelectedImageIdx(prev =>
                                                prev ===
                                                review.images.length - 1
                                                    ? 0
                                                    : prev + 1
                                            );
                                        }}
                                        className='absolute right-2 sm:right-4 z-40 p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors backdrop-blur-sm'>
                                        <ChevronRight className='w-6 h-6' />
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

