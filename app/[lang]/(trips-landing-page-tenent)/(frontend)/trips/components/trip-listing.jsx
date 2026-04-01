import { featuredTrips } from '@/app/[lang]/(trips-landing-page-tenent)/data/data';
import { getAllAffiliateTripsByTenant } from '@/app/_actions/trips/affiliateTripsAction';
import { extractQueryParam, sortTrips } from '../../../utils';
import Sorting from './filter/sorting';
import NoResultsFound from './not-found';
import Pagination from './pagination';
import TripCard from './trip-card';

const TripsListing = async ({ query, tenantId, isDemo }) => {
    const res = await getAllAffiliateTripsByTenant(tenantId, query);

    const sortValue = extractQueryParam(query, 'sort');
    const demoTrips = featuredTrips;
    // Filter active trips
    const activeTrips =
        res?.data?.data.filter(trip => trip.status === 'ACTIVE') || [];

    // Sort trips based on sort parameter
    const sortedTrips = isDemo
        ? sortTrips(demoTrips, sortValue)
        : sortTrips(activeTrips, sortValue);

    return (
        <>
            {/* Sort and Results Count */}
            <div className='flex justify-between items-center mb-6'>
                {/*   <p className='text-gray-600'>{trips.length} trips found</p> */}
                <Sorting />
            </div>{' '}
            {sortedTrips?.length === 0 && <NoResultsFound />}
            {/* Trip Cards Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
                {sortedTrips?.map(trip => (
                    <TripCard
                        query={query}
                        tenantId={tenantId}
                        trip={trip}
                        key={trip?.id}
                    />
                ))}
            </div>
            {sortedTrips?.length > 10 && <Pagination />}
        </>
    );
};

export default TripsListing;

