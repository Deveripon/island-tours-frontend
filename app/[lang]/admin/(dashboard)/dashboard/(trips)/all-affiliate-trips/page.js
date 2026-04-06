import { getAllTrips } from '@/app/_actions/trips/affiliateTripsAction';
import { AllTripPackages } from './components/data-tables/trips/all-trip-packages';

const AllTripsListingPage = async ({ params }) => {

    const response = await getAllTrips('limit=100');

    const tripsData = response?.result?.data?.data || [];

    return (
        <div className='wrapper '>
            <AllTripPackages trips={tripsData} />
        </div>
    );
};

export default AllTripsListingPage;

