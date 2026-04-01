import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
    ArrowRight01Icon,
    Clock01Icon,
    Location01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import Link from 'next/link';
import SectionTitle from './section-title';

export default function ActivitiesSection({ activities, tenantId }) {
    if (!activities || activities.length === 0) {
        return null;
    }

    // Determine layout based on number of items (max 4 displayed)
    const displayCount = Math.min(activities.length, 4);
    const displayActivities = activities.slice(0, displayCount);

    // Helper to render an activity card
    const renderActivityCard = (activity, className, showDetails = true) => (
        <Link
            key={activity.id}
            href={`/site/${tenantId}/activities/${activity.id}`}
            className={cn('group relative block h-full w-full', className)}>
            <Card className='h-full w-full p-0 overflow-hidden border-0 shadow-none rounded-xl relative isolate'>
                <Image
                    fill
                    src={activity.images?.[0]?.url || '/placeholder.jpg'}
                    alt={activity.name}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90' />
                <div className='absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col items-start justify-end text-white'>
                    <h2 className='text-xl md:text-3xl font-nyght-serif font-bold mb-2 leading-tight drop-shadow-lg transform transition-transform duration-500 group-hover:-translate-y-1'>
                        {activity.name}
                    </h2>
                    {showDetails && (
                        <div className='flex flex-wrap items-center gap-2 text-xs md:text-sm font-medium text-white/90 transform transition-all duration-500 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'>
                            <span className='flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full border border-white/10'>
                                <HugeiconsIcon
                                    icon={Location01Icon}
                                    className='w-3.5 h-3.5'
                                />
                                {activity.location?.city}
                            </span>
                            {activity.duration && (
                                <span className='flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10'>
                                    <HugeiconsIcon
                                        icon={Clock01Icon}
                                        className='w-3.5 h-3.5'
                                    />
                                    {activity.duration}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    );

    // Helper to render the "View All" card
    const renderViewAllCard = className => (
        <Link
            href={`/site/${tenantId}/activities`}
            className={cn('group relative block h-full w-full', className)}>
            <Card className='h-full w-full p-0 overflow-hidden border-0 shadow-none rounded-xl relative isolate bg-black'>
                <Image
                    fill
                    src={activities[0]?.images?.[0]?.url || '/placeholder.svg'}
                    alt='View all activities'
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40'
                />
                <div className='absolute inset-0 bg-black/40' />
                <div className='absolute inset-0 flex flex-col items-center justify-center text-white p-6'>
                    <div className='w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 border border-white/20 group-hover:scale-110 transition-transform duration-500'>
                        <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            className='w-5 h-5'
                        />
                    </div>
                    <h3 className='text-xl font-nyght-serif font-bold text-center mb-1'>
                        View All
                    </h3>
                    <p className='text-xs text-white/80 text-center font-medium'>
                        Discover more
                    </p>
                </div>
            </Card>
        </Link>
    );

    return (
        <div className='min-h-screen bg-transparent py-16 md:py-24 px-4'>
            <div className='container mx-auto max-w-7xl'>
                <SectionTitle
                    title='Explore Our Top'
                    highlightedText='Activities'
                />

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[200px]'>
                    {/* Case 1: Only 1 activity available */}
                    {displayCount === 1 &&
                        renderActivityCard(
                            displayActivities[0],
                            'md:col-span-3 md:row-span-2'
                        )}

                    {/* Case 2: 2 Activities available -> Show 1 Activity + View All */}
                    {displayCount === 2 && (
                        <>
                            {renderActivityCard(
                                displayActivities[0],
                                'md:col-span-2 md:row-span-2'
                            )}
                            {renderViewAllCard('md:col-span-1 md:row-span-1')}
                        </>
                    )}

                    {/* Case 3: 3 Activities available -> Show 2 Activities + View All */}
                    {displayCount === 3 && (
                        <>
                            {renderActivityCard(
                                displayActivities[0],
                                'md:col-span-3 md:row-span-2'
                            )}
                            {renderActivityCard(
                                displayActivities[1],
                                'md:col-span-2 md:row-span-1'
                            )}
                            {renderViewAllCard('md:col-span-1 md:row-span-1')}
                        </>
                    )}

                    {/* Case 4: 4+ Activities available -> Show 3 Activities + View All */}
                    {displayCount >= 4 && (
                        <>
                            {renderActivityCard(
                                displayActivities[0],
                                'md:col-span-3 md:row-span-2'
                            )}
                            {renderActivityCard(
                                displayActivities[1],
                                'md:col-span-1 md:row-span-1'
                            )}
                            {renderActivityCard(
                                displayActivities[2],
                                'md:col-span-1 md:row-span-1'
                            )}
                            {renderViewAllCard('md:col-span-1 md:row-span-1')}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

