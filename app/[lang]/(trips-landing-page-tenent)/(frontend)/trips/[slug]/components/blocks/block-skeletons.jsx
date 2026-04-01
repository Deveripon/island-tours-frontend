'use client';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

export const SkeletonTitle = () => (
    <div className='p-3 space-y-3 flex flex-col justify-center h-full !overflow-hidden'>
        <div className='h-3 w-full bg-current opacity-20 rounded-sm' />
        <div className='flex items-center gap-3'>
            <div className='flex gap-0.5'>
                {[...Array(5)].map((_, i) => (
                    <LucideIcons.Star
                        key={i}
                        className='w-1.5 h-1.5 text-current opacity-20 fill-current'
                    />
                ))}
            </div>
            <div className='flex items-center gap-1 flex-1'>
                <LucideIcons.MapPin className='w-1.5 h-1.5 text-current opacity-20' />
                <div className='h-1.5 w-1/3 bg-current opacity-10 rounded-full' />
            </div>
        </div>
    </div>
);

export const SkeletonSimpleTitle = () => (
    <div className='p-3 space-y-3 flex flex-col justify-center h-full !overflow-hidden'>
        <div className='h-3 w-full bg-current opacity-20 rounded-sm' />
    </div>
);

export const SkeletonGallery = () => (
    <div className='p-3 h-full grid grid-cols-2 grid-rows-2 gap-1.5 !overflow-hidden'>
        <div className='row-span-2 bg-current opacity-20 rounded-md' />
        <div className='bg-current opacity-10 rounded-md' />
        <div className='bg-current opacity-15 rounded-md' />
    </div>
);

export const SkeletonSummary = () => (
    <div className='p-3 h-full flex flex-col gap-3 !overflow-hidden'>
        <div className='h-2 w-1/3 bg-current opacity-20 rounded-sm mb-1' />
        <div className='flex gap-4 flex-1'>
            <div className='flex-1 space-y-3'>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className='flex gap-2 items-center'>
                        <div className='w-4 h-4 rounded-md bg-current opacity-10 flex-shrink-0' />
                        <div className='space-y-1.5 flex-1'>
                            <div className='h-1.5 w-1/2 bg-current opacity-15 rounded-full' />
                            <div className='h-1 w-full bg-current opacity-5 rounded-full' />
                        </div>
                    </div>
                ))}
            </div>
            <div className='flex-1 space-y-3'>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className='flex gap-2 items-center'>
                        <div className='w-4 h-4 rounded-md bg-current opacity-10 flex-shrink-0' />
                        <div className='space-y-1.5 flex-1'>
                            <div className='h-1.5 w-1/2 bg-current opacity-15 rounded-full' />
                            <div className='h-1 w-full bg-current opacity-5 rounded-full' />
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className='h-6 w-full bg-current opacity-10 rounded-lg mt-1' />
    </div>
);

export const SkeletonVideo = () => (
    <div className='p-3 h-full flex items-center justify-center relative'>
        <div className='w-full h-full bg-current opacity-15 rounded-xl' />
        <div className='absolute w-8 h-8 rounded-full bg-current opacity-30 flex items-center justify-center shadow-xl backdrop-blur-sm border border-current/10'>
            <LucideIcons.Play className='w-4 h-4 fill-current ml-0.5' />
        </div>
    </div>
);

export const SkeletonTourInfo = () => (
    <div className='p-3 h-full grid grid-cols-2 gap-x-4 gap-y-3 content-center !overflow-hidden'>
        {[...Array(4)].map((_, i) => (
            <div key={i} className='space-y-1.5'>
                <div className='h-1 w-1/2 bg-current opacity-10 rounded-full' />
                <div className='flex gap-1'>
                    <div className='h-3 w-12 bg-current opacity-20 rounded-md' />
                    <div className='h-3 w-8 bg-current opacity-10 rounded-md' />
                </div>
            </div>
        ))}
    </div>
);

export const SkeletonExperience = () => (
    <div className='p-3 space-y-4 relative h-full !overflow-hidden'>
        <div className='absolute left-[17px] top-4 bottom-4 w-px bg-current opacity-10' />
        {[...Array(3)].map((_, i) => (
            <div key={i} className='flex gap-3 items-start relative'>
                <div className='w-2.5 h-2.5 bg-current opacity-30 rounded-full mt-1 border-2 border-zinc-900 z-10' />
                <div className='flex-1 space-y-2'>
                    <div className='h-2 w-2/3 bg-current opacity-20 rounded-sm' />
                    <div className='h-1.5 w-full bg-current opacity-5 rounded-full' />
                </div>
            </div>
        ))}
    </div>
);

export const SkeletonImages = () => (
    <div className='p-3 h-full overflow-hidden'>
        <div className='columns-3 gap-1.5 space-y-1.5'>
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        'w-full bg-current opacity-15 rounded-md break-inside-avoid shadow-sm',
                        i % 3 === 0 ? 'h-10' : i % 3 === 1 ? 'h-16' : 'h-12'
                    )}
                />
            ))}
        </div>
    </div>
);

export const SkeletonMap = () => (
    <div className='p-3 h-full relative'>
        <div className='w-full h-full bg-current opacity-10 rounded-xl overflow-hidden'>
            <div className='w-full h-full scale-150 rotate-12 opacity-5 border-[0.5px] border-current flex flex-wrap'>
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className='w-8 h-8 border-[0.5px] border-current'
                    />
                ))}
            </div>
        </div>
        <div className='absolute bottom-5 left-5 w-1/2 h-8 bg-zinc-900/80 backdrop-blur-md rounded-lg border border-current/10 p-1.5 gap-1.5 flex items-center'>
            <div className='w-5 h-5 rounded-md bg-current opacity-20 flex-shrink-0' />
            <div className='space-y-1 flex-1'>
                <div className='h-1 w-full bg-current opacity-20 rounded-full' />
                <div className='h-1 w-2/3 bg-current opacity-10 rounded-full' />
            </div>
        </div>
        <LucideIcons.MapPin className='absolute top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-current opacity-50 animate-bounce' />
    </div>
);

export const SkeletonFAQ = () => (
    <div className='p-3 h-full space-y-1.5 flex flex-col justify-center !overflow-hidden'>
        {[...Array(3)].map((_, i) => (
            <div
                key={i}
                className={cn(
                    'rounded-lg border border-current/5 px-2 py-1.5 transition-all',
                    i === 0 ? 'bg-current opacity-15' : 'opacity-10'
                )}>
                <div className='flex items-center justify-between'>
                    <div className='h-1 w-2/3 bg-current opacity-40 rounded-full' />
                    <LucideIcons.ChevronDown
                        className={cn(
                            'w-2 h-2 opacity-50',
                            i === 0 && 'rotate-180'
                        )}
                    />
                </div>
                {i === 0 && (
                    <div className='mt-2 space-y-1'>
                        <div className='h-1 w-full bg-current opacity-20 rounded-full' />
                        <div className='h-1 w-3/4 bg-current opacity-15 rounded-full' />
                    </div>
                )}
            </div>
        ))}
    </div>
);

export const SkeletonReviews = () => (
    <div className='p-3 h-full flex flex-col justify-center gap-3 !overflow-hidden'>
        <div className='flex gap-0.5 justify-center'>
            {[...Array(5)].map((_, i) => (
                <LucideIcons.Star
                    key={i}
                    className='w-2 h-2 text-current opacity-40 fill-current'
                />
            ))}
        </div>
        <div className='space-y-1.5'>
            <div className='h-1 w-full bg-current opacity-10 rounded-full' />
            <div className='h-1 w-full bg-current opacity-10 rounded-full' />
            <div className='h-1 w-2/3 bg-current opacity-10 rounded-full self-center' />
        </div>
        <div className='flex items-center justify-center gap-2 pt-1'>
            <div className='w-5 h-5 rounded-full bg-current opacity-20' />
            <div className='space-y-1'>
                <div className='h-1.5 w-10 bg-current opacity-20 rounded-full' />
                <div className='h-1 w-6 bg-current opacity-10 rounded-full' />
            </div>
        </div>
    </div>
);

export const SkeletonTeamGrid = () => (
    <div className='p-3 h-full flex flex-col gap-3 !overflow-hidden'>
        <div className='h-2 w-2/3 bg-current opacity-20 rounded-sm' />
        <div className='grid grid-cols-2 gap-2'>
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className='bg-current opacity-10 rounded-md aspect-[3/4] relative'>
                    <div className='absolute bottom-2 left-2 right-2 h-2 bg-current opacity-20 rounded-sm' />
                </div>
            ))}
        </div>
    </div>
);

export const SkeletonTeamSlider = () => (
    <div className='p-3 h-full flex gap-3 !overflow-hidden'>
        <div className='w-1/3 space-y-2 flex flex-col justify-center'>
            <div className='h-2 w-full bg-current opacity-20 rounded-sm' />
            <div className='h-2 w-2/3 bg-current opacity-20 rounded-sm' />
            <div className='h-5 w-20 bg-current opacity-30 rounded-full mt-2' />
        </div>
        <div className='w-2/3 h-full bg-current opacity-10 rounded-md flex items-center justify-center'>
            <div className='w-2/3 h-4/5 bg-current opacity-10 rounded-md' />
        </div>
    </div>
);

export const SkeletonDescription = () => (
    <div className='p-3 space-y-2 flex flex-col h-full !overflow-hidden'>
        <div className='h-3 w-1/2 bg-current opacity-20 rounded-sm mb-2' />
        <div className='space-y-1.5'>
            <div className='h-1.5 w-full bg-current opacity-10 rounded-full' />
            <div className='h-1.5 w-full bg-current opacity-10 rounded-full' />
            <div className='h-1.5 w-3/4 bg-current opacity-10 rounded-full' />
            <div className='h-1.5 w-full bg-current opacity-10 rounded-full' />
            <div className='h-1.5 w-2/3 bg-current opacity-10 rounded-full' />
        </div>
    </div>
);

export const SkeletonItinerary = () => (
    <div className='p-3 h-full relative !overflow-hidden flex flex-col items-center justify-center '>
        {/* Container for the mini timeline */}
        <div className='relative w-full h-full max-w-[200px] py-1 flex flex-col justify-center'>
            {/* Center Line */}
            <div className='absolute left-1/2 top-0 bottom-0 w-0.5 -ml-[1px] bg-current opacity-10 rounded-full' />

            {/* Items */}
            <div className='flex flex-col gap-3 w-full'>
                {/* Item 1 - Left */}
                <div className='relative w-full h-4'>
                    <div className='absolute right-1/2 pr-3 top-0 w-full flex flex-col items-end gap-1.5'>
                        <div className='h-1.5 w-8 bg-current opacity-20 rounded-full' />
                        <div className='h-1.5 w-16 bg-current opacity-15 rounded-sm' />
                    </div>
                    <div className='absolute left-1/2 top-1 -ml-1 w-2 h-2 rounded-full border border-current opacity-30 bg-background z-10' />
                </div>

                {/* Item 2 - Right */}
                <div className='relative w-full h-4'>
                    <div className='absolute left-1/2 pl-3 top-0 w-full flex flex-col items-start gap-1.5'>
                        <div className='h-1.5 w-10 bg-current opacity-20 rounded-full' />
                        <div className='h-1.5 w-14 bg-current opacity-15 rounded-sm' />
                    </div>
                    <div className='absolute left-1/2 top-1 -ml-1 w-2 h-2 rounded-full border border-current opacity-30 bg-background z-10' />
                </div>

                {/* Item 3 - Left */}
                <div className='relative w-full h-4'>
                    <div className='absolute right-1/2 pr-3 top-0 w-full flex flex-col items-end gap-1.5'>
                        <div className='h-1.5 w-10 bg-current opacity-20 rounded-full' />
                        <div className='h-1.5 w-12 bg-current opacity-15 rounded-sm' />
                    </div>
                    <div className='absolute left-1/2 top-1 -ml-1 w-2 h-2 rounded-full border border-current opacity-30 bg-background z-10' />
                </div>

                {/* Item 4 - Right */}
                <div className='relative w-full h-4'>
                    <div className='absolute left-1/2 pl-3 top-0 w-full flex flex-col items-start gap-1.5'>
                        <div className='h-1.5 w-8 bg-current opacity-20 rounded-full' />
                        <div className='h-1.5 w-16 bg-current opacity-15 rounded-sm' />
                    </div>
                    <div className='absolute left-1/2 top-1 -ml-1 w-2 h-2 rounded-full border border-current opacity-30 bg-background z-10' />
                </div>
            </div>
        </div>
    </div>
);

export const SkeletonTable = () => (
    <div className='p-3 h-full flex flex-col gap-3 !overflow-hidden'>
        <div className='h-2 w-1/3 bg-current opacity-20 rounded-sm' />
        <div className='border border-current/10 rounded-lg overflow-hidden flex-1 flex flex-col'>
            {/* Header */}
            <div className='bg-current opacity-5 h-7 flex items-center px-4 gap-4'>
                <div className='h-1.5 w-16 bg-current opacity-20 rounded-full' />
                <div className='h-1.5 w-20 bg-current opacity-20 rounded-full' />
            </div>
            {/* Rows */}
            <div className='p-4 space-y-4 flex-1'>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className='flex items-center gap-4'>
                        <div className='w-4 h-4 rounded bg-current opacity-10 shrink-0' />
                        <div className='h-1.5 flex-1 bg-current opacity-10 rounded-full' />
                        <div className='h-1.5 flex-1 bg-current opacity-5 rounded-full' />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const SkeletonCTAButton = () => (
    <div className='p-3 h-full flex flex-col justify-center !overflow-hidden'>
        <div className='relative overflow-hidden rounded-xl border border-current/10 p-4 shrink-0'>
            {/* Background */}
            <div className='absolute inset-0 bg-current opacity-[0.03]' />

            {/* Decorative Circle top-right */}
            <div className='absolute top-0 right-0 w-12 h-12 bg-current opacity-5 rounded-full -mr-4 -mt-4' />

            {/* Content */}
            <div className='relative z-10 space-y-3'>
                {/* Title */}
                <div className='h-2.5 w-2/3 bg-current opacity-30 rounded-sm' />

                {/* Description */}
                <div className='space-y-1.5 mb-2'>
                    <div className='h-1 w-full bg-current opacity-20 rounded-full' />
                    <div className='h-1 w-5/6 bg-current opacity-20 rounded-full' />
                    <div className='h-1 w-4/6 bg-current opacity-20 rounded-full' />
                </div>

                {/* Button Action */}
                <div className='h-5 w-20 bg-current opacity-30 rounded-md mt-2' />
            </div>
        </div>
    </div>
);

export const SkeletonReviewSubmitForm = () => (
    <div className='p-3 h-full flex flex-col justify-center !overflow-hidden'>
        <div className='relative overflow-hidden rounded-xl border border-current/10 p-4 shrink-0 bg-current/[0.02]'>
            {/* Title */}
            <div className='h-3 w-1/3 bg-current opacity-30 rounded-sm mb-4' />
            
            <div className='grid grid-cols-2 gap-3'>
                {/* Rating & Title */}
                <div className='flex items-center gap-2'>
                    <div className='h-2 w-8 bg-current opacity-20 rounded-full' />
                    <div className='flex gap-0.5'>
                        {[...Array(5)].map((_, i) => (
                            <LucideIcons.Star key={i} className='w-2.5 h-2.5 text-current opacity-20 fill-current' />
                        ))}
                    </div>
                </div>
                <div className='h-6 w-full bg-current opacity-10 rounded-md' />

                {/* Name & Email */}
                <div className='h-6 w-full bg-current opacity-10 rounded-md' />
                <div className='h-6 w-full bg-current opacity-10 rounded-md' />

                {/* Textarea & File Upload */}
                <div className='h-16 w-full bg-current opacity-10 rounded-md' />
                <div className='h-16 w-full border border-dashed border-current/20 rounded-md flex items-center justify-center bg-current/[0.02]'>
                    <LucideIcons.UploadCloud className='w-4 h-4 text-current opacity-20' />
                </div>

                {/* Submit Button */}
                <div className='col-span-2 pt-1'>
                    <div className='h-6 w-24 bg-current opacity-30 rounded-full' />
                </div>
            </div>
        </div>
    </div>
);

export const BlockSkeleton = ({ type, className }) => {
    const skeletons = {
        TITLE_DESTINATION: <SkeletonTitle />,
        GALLERY: <SkeletonGallery />,
        TRIP_SUMMARY: <SkeletonSummary />,
        VIDEO_IMPRESSION: <SkeletonVideo />,
        TOUR_INFORMATION: <SkeletonTourInfo />,
        EXPERIENCE: <SkeletonExperience />,
        IMAGES: <SkeletonImages />,
        MAP: <SkeletonMap />,
        FAQ: <SkeletonFAQ />,
        REVIEWS: <SkeletonReviews />,
        TEAM: <SkeletonTeamGrid />,
        TEAM_GRID: <SkeletonTeamGrid />,
        TEAM_SLIDER: <SkeletonTeamSlider />,
        SIMPLE_TITLE: <SkeletonSimpleTitle />,
        DESCRIPTION: <SkeletonDescription />,
        ITINERARY: <SkeletonItinerary />,
        TABLE: <SkeletonTable />,
        CTA_BUTTON: <SkeletonCTAButton />,
        REVIEW_SUBMIT_FORM: <SkeletonReviewSubmitForm />,
    };

    return (
        <div
            className={cn(
                'relative h-full w-full !overflow-hidden rounded-lg isolate',
                className
            )}>
            {skeletons[type] || (
                <div className='h-full w-full bg-current opacity-5 animate-pulse !overflow-hidden' />
            )}
        </div>
    );
};

