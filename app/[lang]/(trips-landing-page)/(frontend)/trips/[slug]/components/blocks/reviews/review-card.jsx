'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export function ReviewCard({ review }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedImageIdx, setSelectedImageIdx] = useState(null);
    const avatarUrl =
        review.reviewerAvatar?.url ||
        (typeof review.reviewerAvatar === 'string'
            ? review.reviewerAvatar
            : null);

    return (
        <div className='dark:bg-transparent rounded-[20px] p-6 sm:p-8 w-full border border-zinc-200 dark:border-zinc-800/80 shadow-[0_2px_10px_rgb(0,0,0,0.04)] dark:shadow-none flex flex-col group'>
            {/* Header */}
            <div className='flex items-center gap-4 mb-6'>
                <div
                    className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg overflow-hidden relative shadow-sm ring-2 ring-white dark:ring-zinc-950',
                        review.avatarBg || 'bg-indigo-500'
                    )}>
                    {avatarUrl ? (
                        <Image
                            src={avatarUrl}
                            alt={review.name}
                            fill
                            className='object-cover'
                        />
                    ) : (
                        review.avatar || review.name?.charAt(0)?.toUpperCase()
                    )}
                </div>
                <div className='flex flex-col'>
                    <div className='flex items-center gap-1.5 mt-0.5'>
                        <h3 className='font-semibold text-base text-zinc-900 dark:text-zinc-100 tracking-tight leading-none'>
                            {review.name}
                        </h3>
                        {review.verified && (
                            <div className='w-4 h-4 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center'>
                                <span className='text-white text-[10px] drop-shadow-sm font-bold leading-none translate-y-[0px]'>
                                    ✓
                                </span>
                            </div>
                        )}
                    </div>
                    <time className='text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider mt-1.5'>
                        {review.timeAgo}
                    </time>
                </div>
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

            {/* Content */}
            <div className='flex flex-col gap-2 flex-1 relative z-10 text-left'>
                {review.title && (
                    <h4 className='text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 leading-snug'>
                        {review.title}
                    </h4>
                )}

                <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? 'auto' : '90px' }}
                    className={cn(
                        'relative overflow-hidden',
                        isExpanded ? '' : 'mask-image-bottom'
                    )}
                    style={
                        !isExpanded
                            ? {
                                  maskImage:
                                      'linear-gradient(to bottom, black 50%, transparent 100%)',
                                  WebkitMaskImage:
                                      'linear-gradient(to bottom, black 50%, transparent 100%)',
                              }
                            : {}
                    }>
                    <p className='text-[15px] text-zinc-700 dark:text-zinc-300 leading-relaxed font-serif italic'>
                        "{review.text}"
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

            {/* Attachments */}
            {review.images && review.images.length > 0 && (
                <div className='mt-6 pt-5 border-t border-zinc-200/60 dark:border-zinc-800/80'>
                    <div className='grid grid-cols-2 gap-2 mt-2'>
                        {review.images.slice(0, 2).map((img, idx) => {
                            const srcUrl =
                                img?.url ||
                                (typeof img === 'string' ? img : null);
                            if (!srcUrl) return null;
                            return (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedImageIdx(idx)}
                                    className='relative aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm cursor-pointer group/img'>
                                    <Image
                                        src={srcUrl}
                                        alt={`Review image ${idx + 1}`}
                                        fill
                                        className='object-cover hover:scale-105 transition-transform duration-300'
                                    />
                                    {idx === 1 && review.images.length > 2 && (
                                        <div className='absolute inset-0 bg-black/50 flex items-center justify-center transition-colors group-hover/img:bg-black/40'>
                                            <span className='text-white font-bold text-lg'>
                                                +{review.images.length - 2}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Read More Fallback (if any, although custom toggle handles text) */}
            {review.readMore && review.text?.length <= 150 && (
                <button className='mt-auto pt-5 text-[13px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors text-left group-hover:underline underline-offset-4 decoration-indigo-200 dark:decoration-indigo-900 w-max'>
                    {review.readMore}
                </button>
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

