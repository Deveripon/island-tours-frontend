import { getAllAffiliateTripsByTenant } from '@/app/_actions/trips/affiliateTripsAction';
import { AllTripPackages } from './components/data-tables/trips/all-trip-packages';

const AllTripsListingPage = async ({ params }) => {
    const { tenant } = await params;

    const response = await getAllAffiliateTripsByTenant(tenant, 'limit=100');

    const allTrips = response?.data?.data || [];

    return (
        <div className='wrapper '>
            <AllTripPackages tenantId={tenant} trips={allTrips} />
        </div>
    );
};

export default AllTripsListingPage;

