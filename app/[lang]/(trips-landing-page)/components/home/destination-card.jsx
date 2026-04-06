import Image from 'next/image';

export default function DestinationCard({ destination }) {
    return (
        <article className='group relative flex flex-col snap-start overflow-hidden rounded-3xl border border-border  text-card-foreground shadow-lg dark:shadow-[0_20px_80px_rgba(15,23,42,0.95)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/60 hover:bg-accent/10 dark:hover:bg-accent/10 h-full'>
            <div className='relative aspect-[4/3] overflow-hidden w-full'>
                <Image
                    src={
                        destination.image ||
                        destination.images?.[0]?.url ||
                        '/placeholder.svg'
                    }
                    alt={destination.name}
                    fill
                    className='h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-[0.5deg]'
                />
            </div>
            <div className=' flex items-end justify-between gap-3 px-4 sm:px-5 pb-4 pt-3 relative z-40'>
                <div>
                    <h2 className='text-base font-semibold tracking-tight text-foreground'>
                        {destination.name}
                    </h2>
                    <p className='text-sm text-muted-foreground line-clamp-1'>
                        {destination.description ||
                            'Explore this amazing place'}
                    </p>
                </div>
                <span className='inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/20 backdrop-blur whitespace-nowrap'>
                    {destination.tripCount || 0} trips
                </span>
            </div>
        </article>
    );
}

