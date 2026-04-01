import { getAllAffiliateTripsByTenant } from '@/app/_actions/trips/affiliateTripsAction';
import { Button } from '@/components/ui/button';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import TripCard from '../../(frontend)/trips/components/trip-card';
import { featuredTrips } from '../../data/data';
import SectionTitle from './section-title';

export default async function FeaturedTrips({ tenantId, content, isDemo }) {
    const res =
        !isDemo && (await getAllAffiliateTripsByTenant(tenantId, 'limit=8'));
    const allFeaturedTrips = !isDemo ? res?.data?.data : featuredTrips;

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
                    {allFeaturedTrips?.map(trip => (
                        <TripCard
                            tenantId={tenantId}
                            key={trip.id}
                            trip={trip}
                        />
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

