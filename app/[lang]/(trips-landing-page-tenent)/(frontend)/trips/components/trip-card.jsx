import { getCurrencyIcon } from '@/utils/currency-info';
import {
    ArrowUpRight01Icon,
    Calendar01Icon,
    Clock01Icon,
    Location01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDaysOfWeek } from '../../../utils';

const TripCard = ({ trip, query }) => {
    console.log(trip);
    return (
        <Link href={`/trips/${trip.slug}?${query}`}>
            <article className='group flex flex-col overflow-hidden rounded-3xl bg-card text-card-foreground ring-1 ring-border shadow-lg dark:shadow-[0_22px_60px_rgba(15,23,42,0.85)] hover:-translate-y-1 hover:shadow-xl hover:ring-primary/60 dark:hover:bg-accent/5 hover:bg-accent/5 dark:hover:shadow-[0_26px_80px_rgba(15,23,42,0.95)] transition-all duration-500 ease-out h-full'>
                <div className='relative aspect-[4/3] overflow-hidden'>
                    <Image
                        src={trip?.mainImage?.image?.url || '/placeholder.svg'}
                        alt={trip.title}
                        fill
                        className='transition-transform duration-700 ease-out group-hover:scale-105 w-full h-full object-cover'
                    />

                    <div className='flex absolute right-4 bottom-4 left-4 justify-between'>
                        <span className='inline-flex items-center rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white backdrop-blur'>
                            {trip.destination?.name}
                        </span>
                    </div>
                </div>

                <div className='flex flex-1 flex-col gap-4 px-5 pb-5 pt-4 z-20'>
                    <div className='flex items-center justify-between gap-3 text-xs text-muted-foreground'>
                        <div className='flex items-center gap-1.5'>
                            <span className='text-amber-400'>★</span>
                            <span className='text-amber-400'>★</span>
                            <span className='text-amber-400'>★</span>
                            <span className='text-amber-400'>★</span>
                            <span className='text-muted'>★</span>
                            <span className='text-foreground/70'>4.9</span>
                        </div>
                        <div className='flex flex-wrap items-center gap-1.5'>
                            <HugeiconsIcon
                                icon={Calendar01Icon}
                                className='h-3.5 w-3.5'
                            />
                            <p className='flex flex-wrap gap-1'>
                                <span>
                                    {trip?.datesAvailability?.onlyUponRequest
                                        ? 'Upon Request'
                                        : formatDaysOfWeek(
                                              trip?.datesAvailability
                                                  ?.daysOfTheWeek
                                          )}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className='div min-h-[160px]'>
                        <div className='space-y-1.5'>
                            <h2 className='text-lg tracking-tight font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors'>
                                {trip.title}
                            </h2>
                            <p className='text-base text-muted-foreground line-clamp-2'>
                                {trip.description || trip?.shortDescription}
                            </p>
                        </div>

                        <div className='mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground'>
                            <div className='flex items-center gap-1.5'>
                                <HugeiconsIcon
                                    icon={Location01Icon}
                                    className='h-3.5 w-3.5'
                                />
                                <div>
                                    {trip.destination?.city ||
                                        trip.destination?.name}
                                </div>
                            </div>
                            <div className='flex items-center gap-1.5'>
                                <HugeiconsIcon
                                    icon={Clock01Icon}
                                    className='h-3.5 w-3.5'
                                />
                                <div>{trip.duration || 'Duration N/A'}</div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-2 flex items-end justify-between gap-3'>
                        <div>
                            <p className='text-sm text-muted-foreground'>
                                From
                            </p>
                            <div className='flex items-baseline gap-1'>
                                <span className='text-xl font-semibold text-foreground'>
                                    {getCurrencyIcon(
                                        trip?.pricingConfig?.currency
                                    )}
                                    {
                                        trip?.pricingConfig?.ageCategoryPricing
                                            ?.adultsPrice
                                    }
                                </span>
                                <span className='text-xs text-muted-foreground'>
                                    {trip?.pricingConfig?.pricingModel ===
                                    'PER_PERSON'
                                        ? 'per person'
                                        : 'total'}
                                </span>
                            </div>
                        </div>
                        <button className='inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-all'>
                            <span>View details</span>
                            <HugeiconsIcon
                                icon={ArrowUpRight01Icon}
                                className='h-3.5 w-3.5'
                            />
                        </button>
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default TripCard;

