import { findAllTrips } from '@/app/_actions/trips/affiliateTripsAction';
import { Suspense } from 'react';
import TripCard from '../../components/trip-card';
import TripsLoadingSkeliton from '../../components/trips-loading-skelitons';

const ReletedTrips = async ({ trip }) => {
    const destination = trip?.destination;

    const trips = await findAllTrips(
        `destination=${
            destination.country ||
            destination.city ||
            destination.region ||
            destination.name
        }&limit=6`
    );

    const reletaedTrips = trips?.result?.data.filter(t => t.id !== trip?.id);

    if (!reletaedTrips || reletaedTrips.length === 0) return null;
    return (
        <div className='pb-6 sm:pb-8 mb-6 sm:mb-8 border-b border-border'>
            <h2 className='text-lg sm:text-lg font-bold mb-4 sm:mb-6 text-foreground'>
                Related Trips
            </h2>

            <div className='grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                <Suspense fallback={<TripsLoadingSkeliton />}>
                    {reletaedTrips.map(trip => (
                        <TripCard
                            key={trip.id}
                            trip={trip}
                        />
                    ))}
                </Suspense>
            </div>
        </div>
    );
};

export default ReletedTrips;

