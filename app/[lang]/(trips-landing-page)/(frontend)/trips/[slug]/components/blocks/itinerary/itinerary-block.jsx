'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import SectionTitle from '../../section-title';
import { ItineraryBlockWrapper } from './itinerary-block-wrapper';

const ItineraryBlock = props => {
    // Scroll-based active item highlight — unique to the classic zigzag layout
    const [activeId, setActiveId] = useState(null);
    const itemRefs = useRef({});

    const setupScrollTracker = days => {
        const handleScroll = () => {
            const triggerPoint = window.innerHeight / 2;
            let currentActiveId = null;

            Object.entries(itemRefs.current).forEach(([id, ref]) => {
                if (!ref) return;
                const rect = ref.getBoundingClientRect();
                if (rect.top <= triggerPoint && rect.bottom >= triggerPoint) {
                    currentActiveId = id;
                }
            });

            // Fallback: use the last item above the trigger point
            if (!currentActiveId) {
                const sorted = Object.entries(itemRefs.current)
                    .filter(([, ref]) => ref)
                    .sort(
                        ([, a], [, b]) =>
                            a.getBoundingClientRect().top -
                            b.getBoundingClientRect().top
                    );

                for (let i = sorted.length - 1; i >= 0; i--) {
                    const [id, ref] = sorted[i];
                    if (ref.getBoundingClientRect().top < triggerPoint) {
                        currentActiveId = id;
                        break;
                    }
                }
            }

            setActiveId(currentActiveId);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    };

    return (
        <ItineraryBlockWrapper {...props} defaultVariant='classic'>
            {({ itineraryData }) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(
                    () => setupScrollTracker(itineraryData.days),
                    [itineraryData.days]
                );

                // Block View UI
                return (
                    <div className='space-y-8 py-8'>
                        {/* Header */}
                        <div className='space-y-4'>
                            <SectionTitle>{itineraryData.title}</SectionTitle>
                            {itineraryData.shortDescription && (
                                <p className='text-muted-foreground text-center max-w-2xl mx-auto text-lg font-medium'>
                                    {itineraryData.shortDescription}
                                </p>
                            )}
                        </div>

                        {/* Days */}
                        <div className='relative max-w-4xl mx-auto mt-12 px-4'>
                            {itineraryData.days.map((day, dayIndex) => (
                                <div
                                    key={day.id}
                                    className='mb-16 last:mb-0 relative'>
                                    {/* Day header — only when multiple days */}
                                    {itineraryData.days.length > 1 && (
                                        <div className='mb-8 pl-4 md:pl-0'>
                                            <h3 className='text-xl font-bold text-primary'>
                                                {day.title}
                                            </h3>
                                            {day.date && (
                                                <p className='text-sm font-medium text-muted-foreground tracking-wider'>
                                                    {day.date}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className='relative'>
                                        {/* Center line — desktop */}
                                        <div className='hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -ml-px bg-border/40' />
                                        <div
                                            className='hidden md:block absolute left-1/2 top-0 w-0.5 -ml-px bg-primary transition-all duration-500 ease-out origin-top'
                                            style={{
                                                height: getLineHeight(
                                                    day,
                                                    dayIndex,
                                                    itineraryData.days,
                                                    activeId,
                                                    itemRefs
                                                ),
                                            }}
                                        />

                                        {/* Center line — mobile */}
                                        <div className='md:hidden absolute left-6 top-0 bottom-0 w-0.5 bg-border/40' />
                                        <div
                                            className='md:hidden absolute left-6 top-0 w-0.5 bg-primary transition-all duration-500 ease-out origin-top'
                                            style={{
                                                height: getLineHeight(
                                                    day,
                                                    dayIndex,
                                                    itineraryData.days,
                                                    activeId,
                                                    itemRefs
                                                ),
                                            }}
                                        />

                                        {/* Items */}
                                        <div className='space-y-8 md:space-y-0 relative'>
                                            {day.items.map((item, index) => {
                                                const isLeft = index % 2 === 0;
                                                const isActive =
                                                    activeId === item.id;
                                                return (
                                                    <div
                                                        key={item.id}
                                                        ref={el =>
                                                            (itemRefs.current[
                                                                item.id
                                                            ] = el)
                                                        }
                                                        className={cn(
                                                            'relative md:flex items-center justify-between group',
                                                            isLeft
                                                                ? 'md:flex-row-reverse'
                                                                : 'md:flex-row'
                                                        )}>
                                                        {/* Spacer */}
                                                        <div className='hidden md:block w-1/2' />

                                                        {/* Dot */}
                                                        <div
                                                            className={cn(
                                                                'absolute md:left-1/2 left-6 w-4 h-4 rounded-full border-2 transform -translate-x-1/2 z-10 transition-all duration-500',
                                                                isActive
                                                                    ? 'bg-primary border-primary scale-125 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]'
                                                                    : 'bg-background border-muted-foreground/30'
                                                            )}>
                                                            {isActive && (
                                                                <div className='absolute inset-0 bg-primary/30 animate-ping rounded-full' />
                                                            )}
                                                        </div>

                                                        {/* Content */}
                                                        <div
                                                            className={cn(
                                                                'ml-12 md:ml-0 md:w-1/2 p-4 pt-0 md:pt-4',
                                                                isLeft
                                                                    ? 'md:pr-12 md:text-right'
                                                                    : 'md:pl-12 md:text-left'
                                                            )}>
                                                            <div
                                                                className={cn(
                                                                    'inline-block rounded-full px-4 py-1.5 text-sm font-bold mb-2 transition-colors duration-300',
                                                                    isActive
                                                                        ? 'bg-primary text-white shadow-md'
                                                                        : 'bg-accent/10 text-muted-foreground'
                                                                )}>
                                                                {item.time}
                                                            </div>

                                                            {item.image && (
                                                                <div
                                                                    className={cn(
                                                                        'relative mb-3 overflow-hidden rounded-xl h-48 w-full border border-border/50',
                                                                        isLeft
                                                                            ? 'ml-auto'
                                                                            : 'mr-auto'
                                                                    )}>
                                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                    <img
                                                                        src={
                                                                            item.image
                                                                        }
                                                                        alt={
                                                                            item.description
                                                                        }
                                                                        className='w-full h-full object-cover transition-transform duration-700 hover:scale-105'
                                                                    />
                                                                </div>
                                                            )}

                                                            <p
                                                                className={cn(
                                                                    'text-lg font-medium leading-relaxed transition-colors duration-300',
                                                                    isActive
                                                                        ? 'text-foreground'
                                                                        : 'text-muted-foreground'
                                                                )}>
                                                                {
                                                                    item.description
                                                                }
                                                            </p>
                                                            {item.details && (
                                                                <p className='mt-2 text-sm text-muted-foreground/80 leading-relaxed'>
                                                                    {
                                                                        item.details
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {day.items.length === 0 && (
                                                <div className='md:ml-[50%] md:pl-8 pl-12 text-muted-foreground italic text-sm py-4'>
                                                    No activities planned.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }}
        </ItineraryBlockWrapper>
    );
};

// ---------------------------------------------------------------------------
// Helper — compute active progress line height for a given day
// ---------------------------------------------------------------------------
function getLineHeight(day, dayIndex, allDays, activeId, itemRefs) {
    const activeItem = day.items.find(i => i.id === activeId);
    if (activeItem) {
        const el = itemRefs.current[activeId];
        if (el) return el.offsetTop + el.offsetHeight / 2;
    }

    const activeDayIndex = allDays.findIndex(d =>
        d.items.some(i => i.id === activeId)
    );
    const currentDayIndex = allDays.findIndex(d => d.id === day.id);
    return activeDayIndex > currentDayIndex ? '100%' : '0px';
}

export default ItineraryBlock;

