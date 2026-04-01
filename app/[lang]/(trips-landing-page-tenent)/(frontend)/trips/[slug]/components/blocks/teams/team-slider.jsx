'use client';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { UserIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import { TeamBlockWrapper, getMemberImageUrl } from './team-block-wrapper';

const TeamSlider = props => (
    <TeamBlockWrapper {...props} defaultVariant='slider'>
        {({ watchedTitle, watchedSubtitle, watchedMembers }) => (
            <div className='py-16 px-4 md:px-8 rounded-xl overflow-hidden bg-primary/20'>
                <div className='max-w-7xl mx-auto'>
                    <div className='flex flex-col lg:flex-row items-start gap-12 lg:gap-20'>
                        {/* Left — title & subtitle */}
                        <div className='w-full lg:w-1/3 space-y-8 z-10'>
                            <div className='space-y-6'>
                                <h2 className='text-2xl sm:text-3xl mb-4 text-white font-bold leading-[1.1]'>
                                    {watchedTitle
                                        .split(' ')
                                        .map((word, i, arr) => (
                                            <span
                                                key={i}
                                                className={
                                                    i >= arr.length - 2
                                                        ? 'text-[#22c55e]'
                                                        : 'text-white'
                                                }>
                                                {word}{' '}
                                            </span>
                                        ))}
                                </h2>
                                <p className='text-foreground text-lg leading-relaxed max-w-md'>
                                    {watchedSubtitle}
                                </p>
                            </div>
                        </div>

                        {/* Right — carousel */}
                        <div className='w-full lg:w-2/3 min-w-0'>
                            <Carousel
                                opts={{ align: 'start', loop: true }}
                                className='w-full'>
                                <CarouselContent className='-ml-4'>
                                    {watchedMembers?.map((member, index) => {
                                        const imageUrl =
                                            getMemberImageUrl(member);
                                        return (
                                            <CarouselItem
                                                key={index}
                                                className='pl-4 basis-1/3'>
                                                <div className='group/card relative aspect-[3/4] overflow-hidden rounded-2xl bg-white/5 border border-white/10'>
                                                    {imageUrl ? (
                                                        <Image
                                                            src={imageUrl}
                                                            alt={
                                                                member.name ||
                                                                'Team member'
                                                            }
                                                            fill
                                                            className='object-cover transition-transform duration-700 group-hover/card:scale-110'
                                                        />
                                                    ) : (
                                                        <div className='w-full h-full flex items-center justify-center text-white/20'>
                                                            <HugeiconsIcon
                                                                icon={UserIcon}
                                                                size={64}
                                                            />
                                                        </div>
                                                    )}
                                                    <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent' />
                                                    <div className='absolute bottom-0 left-0 w-full md:p-6 p-2 text-white'>
                                                        <h3 className='md:text-xl text-sm font-bold mb-1'>
                                                            {member.name}
                                                        </h3>
                                                        <p className='md:text-sm text-xs text-white/70 font-medium md:tracking-wide'>
                                                            {member.role}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CarouselItem>
                                        );
                                    })}
                                </CarouselContent>
                                <div className='flex gap-4 mt-8 justify-center lg:justify-start'>
                                    <CarouselPrevious className='static translate-y-0 translate-x-0 h-12 w-12 rounded-full border border-primary! bg-primary/10! text-white hover:bg-primary hover:text-primary transition-colors' />
                                    <CarouselNext className='static translate-y-0 translate-x-0 h-12 w-12 rounded-full border border-primary! bg-primary/10! text-white hover:bg-primary hover:text-primary transition-colors' />
                                </div>
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </TeamBlockWrapper>
);

export default TeamSlider;

