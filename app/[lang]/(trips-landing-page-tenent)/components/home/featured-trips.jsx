import { findAllTrips } from '@/app/_actions/trips/affiliateTripsAction';
import { Button } from '@/components/ui/button';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import TripCard from '../../(frontend)/trips/components/trip-card';
import SectionTitle from './section-title';

export default async function FeaturedTrips({ content }) {
    const res = await findAllTrips('limit=8');
    const allFeaturedTrips = res?.result?.data;
    console.log(`allFeaturedTrips`, allFeaturedTrips);

    if (!allFeaturedTrips || allFeaturedTrips.length === 0) {
        return null;
    }

    return (
        <section
            id='trips'
            className='bg-background dark:bg-background py-16 md:py-22'>
            <div className='container mx-auto px-4'>
                <div>
                    <SectionTitle
                        title={'Explore Most Popular'}
                        highlightedText='Trips'
                    />
                </div>

                <div className='grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {allFeaturedTrips?.data?.map(trip => (
                        <TripCard key={trip.id} trip={trip} />
                    ))}
                </div>

                <div className='mt-8 text-center md:hidden'>
                    <Button variant='outline'>
                        View all trips
                        <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            className='ml-2 h-4 w-4'
                        />
                    </Button>
                </div>
            </div>
        </section>
    );
}

