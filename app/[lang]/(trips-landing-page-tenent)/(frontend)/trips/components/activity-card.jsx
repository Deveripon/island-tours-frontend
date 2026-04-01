import { Badge } from '@/components/ui/badge';
import {
    ArrowUpRight01Icon,
    Clock01Icon,
    Location01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import Link from 'next/link';

const Activity = ({ activity, tenantId }) => {
    // Get the first image from the images array
    const mainImage = activity?.images?.[0];

    return (
        <Link href={`/site/${tenantId}/activities/${activity?.id}`}>
            <article className='group flex flex-col overflow-hidden rounded-3xl bg-card text-card-foreground ring-1 ring-border shadow-lg dark:shadow-[0_22px_60px_rgba(15,23,42,0.85)] hover:-translate-y-1 hover:shadow-xl hover:ring-primary/60 dark:hover:bg-accent/10 dark:hover:shadow-[0_26px_80px_rgba(15,23,42,0.95)] transition-all duration-500 ease-out h-full'>
                <div className='relative aspect-[4/3] overflow-hidden'>
                    <Image
                        src={
                            mainImage?.image?.url ||
                            mainImage?.url ||
                            '/placeholder.svg'
                        }
                        alt={mainImage?.altText || activity?.name}
                        fill
                        className='transition-transform duration-700 ease-out group-hover:scale-105 w-full h-full object-cover'
                    />

                    <div className='flex absolute right-4 bottom-4 left-4 justify-between'>
                        {activity?.location && (
                            <span className='inline-flex items-center rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white backdrop-blur'>
                                {activity?.location?.name ||
                                    activity?.location?.city}
                            </span>
                        )}
                    </div>
                </div>

                <div className='flex flex-1 flex-col gap-4 px-5 pb-5 pt-4'>
                    <div className='flex items-center justify-between gap-3 text-xs text-muted-foreground'>
                        <div className='flex items-center gap-1.5'>
                            <span className='text-amber-400'>★</span>
                            <span className='text-amber-400'>★</span>
                            <span className='text-amber-400'>★</span>
                            <span className='text-amber-400'>★</span>
                            <span className='text-muted'>★</span>
                            <span className='text-foreground/70'>4.9</span>
                        </div>
                        {activity?.duration && (
                            <div className='flex flex-wrap items-center gap-1.5'>
                                <HugeiconsIcon
                                    icon={Clock01Icon}
                                    className='h-3.5 w-3.5'
                                />
                                <span>{activity?.duration}</span>
                            </div>
                        )}
                    </div>

                    <div className='div min-h-[140px]'>
                        <div className='space-y-1.5'>
                            <h2 className='text-lg tracking-tight font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors'>
                                {activity?.name}
                            </h2>
                            <p className='text-base text-muted-foreground line-clamp-2'>
                                {activity?.description}
                            </p>
                        </div>

                        <div className='mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground'>
                            {activity?.location && (
                                <div className='flex items-center gap-1.5'>
                                    <HugeiconsIcon
                                        icon={Location01Icon}
                                        className='h-3.5 w-3.5'
                                    />
                                    <div>
                                        {activity?.location?.name ||
                                            activity?.location?.city}
                                    </div>
                                </div>
                            )}
                            {activity?.difficulty && (
                                <Badge
                                    variant='outline'
                                    className={`text-xs ${
                                        activity?.difficulty.includes('Easy')
                                            ? 'border-green-500/50 text-green-600 dark:border-green-500/30 dark:text-green-400'
                                            : activity?.difficulty.includes(
                                                  'Moderate'
                                              )
                                            ? 'border-yellow-500/50 text-yellow-600 dark:border-yellow-500/30 dark:text-yellow-400'
                                            : activity?.difficulty.includes(
                                                  'Challenging'
                                              )
                                            ? 'border-orange-500/50 text-orange-600 dark:border-orange-500/30 dark:text-orange-400'
                                            : 'border-red-500/50 text-red-600 dark:border-red-500/30 dark:text-red-400'
                                    }`}>
                                    {activity?.difficulty}
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className='mt-2 flex items-end justify-between gap-3'>
                        <div>{/* Price placeholder if needed */}</div>
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

export default Activity;

