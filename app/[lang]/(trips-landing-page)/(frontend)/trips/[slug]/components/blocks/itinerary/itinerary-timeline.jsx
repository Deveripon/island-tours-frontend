'use client';

import { cn } from '@/lib/utils';
import { Location01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import SectionTitle from '../../section-title';
import { ItineraryBlockWrapper } from './itinerary-block-wrapper';

const ItineraryTimeline = props => (
    <ItineraryBlockWrapper {...props} defaultVariant='timeline'>
        {({ itineraryData }) => {
            // Active day tab — unique to the timeline layout
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [activeDayIndex, setActiveDayIndex] = useState(0);
            const activeDay =
                itineraryData.days[activeDayIndex] || itineraryData.days[0];

            // Timeline View UI
            return (
                <div className='py-12'>
                    {/* Header */}
                    <div className='mb-8 pl-4 lg:pl-0 flex flex-col items-center justify-center md:items-start md:justify-start'>
                        <SectionTitle className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80'>
                            {itineraryData.title}
                        </SectionTitle>
                        {itineraryData.shortDescription && (
                            <p className='text-muted-foreground mt-4 text-center md:text-left max-w-2xl text-lg'>
                                {itineraryData.shortDescription}
                            </p>
                        )}
                    </div>

                    {/* Day tabs — only when multiple days */}
                    {itineraryData.days.length > 1 && (
                        <div className='flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl mb-12 max-w-fit mx-auto md:mx-0 overflow-x-auto hide-scrollbar border border-border/50'>
                            {itineraryData.days.map((day, idx) => (
                                <button
                                    key={day.id}
                                    onClick={() => setActiveDayIndex(idx)}
                                    className={cn(
                                        'px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap',
                                        activeDayIndex === idx
                                            ? 'bg-background text-primary shadow-sm shadow-black/5 ring-1 ring-border/50'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    )}>
                                    {day.title}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Active day content */}
                    {activeDay && (
                        <div className='max-w-5xl mx-auto md:mx-0'>
                            {activeDay.date && (
                                <div className='mb-8'>
                                    <p className='text-sm font-bold text-muted-foreground pl-10 md:pl-28'>
                                        {activeDay.date}
                                    </p>
                                </div>
                            )}

                            <div className='relative pl-12 md:pl-28 pb-10'>
                                {/* Vertical timeline line */}
                                <div className='absolute left-[20px] md:left-[55px] top-6 bottom-0 w-px bg-border max-md:hidden' />
                                <div className='absolute left-[20px] md:left-[55px] top-6 bottom-0 w-px bg-border md:hidden' />

                                <div className='space-y-16'>
                                    {activeDay.items.map(item => (
                                        <div
                                            key={item.id}
                                            className='relative flex flex-col md:flex-row gap-6 md:gap-10 group items-start'>
                                            {/* Timeline node */}
                                            <div className='absolute top-0 -left-12 md:-left-28 w-12 md:w-28 flex flex-col items-center justify-start'>
                                                <div className='w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center ring-8 ring-background z-10 transition-transform duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]'>
                                                    <HugeiconsIcon
                                                        icon={Location01Icon}
                                                        size={20}
                                                        className='md:w-6 md:h-6'
                                                    />
                                                </div>
                                                <span className='text-xs md:text-sm font-extrabold mt-3 text-center text-foreground w-full block bg-background py-1'>
                                                    {item.time}
                                                </span>
                                            </div>

                                            {/* Image */}
                                            {item.image && (
                                                <div className='w-full md:w-[320px] aspect-[4/3] rounded-2xl overflow-hidden shrink-0 border border-border/40 bg-muted/20 relative group-hover:shadow-xl group-hover:border-primary/20 transition-all duration-500 mt-2 md:mt-0'>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={item.image}
                                                        alt={item.description}
                                                        className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                                                    />
                                                </div>
                                            )}

                                            {/* Text */}
                                            <div className='flex-1 flex flex-col justify-start pt-1 md:pt-2 w-full'>
                                                <h4 className='text-xl md:text-[22px] font-bold text-foreground mb-4 leading-snug group-hover:text-primary transition-colors duration-300'>
                                                    {item.description}
                                                </h4>
                                                {item.details && (
                                                    <p className='text-muted-foreground leading-relaxed text-[15px] md:text-base'>
                                                        {item.details}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {activeDay.items.length === 0 && (
                                        <div className='text-muted-foreground italic text-sm py-4'>
                                            No activities planned for this day.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }}
    </ItineraryBlockWrapper>
);

export default ItineraryTimeline;

