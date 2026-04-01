'use client';

import SectionTitle from '@/app/[lang]/(trips-landing-page-tenent)/(frontend)/trips/[slug]/components/section-title';
import { UserIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import { getMemberImageUrl, TeamBlockWrapper } from './team-block-wrapper';

const TeamGrid = props => (
    <TeamBlockWrapper {...props} defaultVariant='grid'>
        {({ watchedTitle, watchedSubtitle, watchedMembers }) => (
            <div className='w-full'>
                {/* Header */}
                <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12'>
                    <div className='max-w-3xl'>
                        <SectionTitle className='text-2xl sm:text-3xl'>
                            {watchedTitle}
                        </SectionTitle>
                        {watchedSubtitle && (
                            <p className='text-muted-foreground mb-8 text-sm sm:text-base max-w-3xl leading-relaxed'>
                                {watchedSubtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Grid */}
                <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {watchedMembers?.map((member, index) => {
                        const imageUrl = getMemberImageUrl(member);
                        return (
                            <div
                                key={index}
                                className='group/card relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-500'>
                                <div className='aspect-[3/4] relative overflow-hidden'>
                                    {imageUrl ? (
                                        <Image
                                            src={imageUrl}
                                            alt={member.name || 'Team member'}
                                            fill
                                            className='object-cover transition-transform duration-700 group-hover/card:scale-105'
                                        />
                                    ) : (
                                        <div className='w-full h-full bg-accent/10 flex items-center justify-center text-muted-foreground'>
                                            <HugeiconsIcon
                                                icon={UserIcon}
                                                size={48}
                                            />
                                        </div>
                                    )}
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover/card:opacity-80 transition-opacity duration-300' />
                                </div>
                                <div className='absolute bottom-0 left-0 w-full p-6 text-white translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300'>
                                    <h3 className='text-xl font-bold mb-1'>
                                        {member.name}
                                    </h3>
                                    <p className='text-sm font-medium text-white/80'>
                                        {member.role}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}
    </TeamBlockWrapper>
);

export default TeamGrid;

