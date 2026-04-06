import {
    DummypopularActivities,
    DummypopularDestinations,
    featuredTrips,
} from '@/app/[lang]/(trips-landing-page-tenent)/data/data';
import { getAllActivities } from '@/app/_actions/trips/activityActions';
import { findAllTripsByDestination } from '@/app/_actions/trips/affiliateTripsAction';
import { getAllDestinations } from '@/app/_actions/trips/destinations';
import { generateSlug } from '@/lib/utils';
import { transformDestinationData } from '../../../components/home/populer-destinations';
import PageHero from '../../../components/page-hero';
import PopulerActivities from './components/populer-activities';
import PopulerTrips from './components/populer-trips';

const DestinationPage = async ({ params }) => {
    const { slug } = await params;

    const allDestinations = await getAllDestinations();
    const allDestinationsData = transformDestinationData(
        allDestinations?.result?.data
    );

    const destination = allDestinationsData?.find(
        destination => generateSlug(destination.name) === slug
    );

    let popularActivities = [];
    let populertrips = [];

    if (destination) {
        const activitiesRes = await getAllActivities(
            `location=${destination.country ||
            destination.city ||
            destination.region ||
            destination.name
            }`
        );

        popularActivities = activitiesRes?.result?.data || [];

        const tripsRes = await findAllTripsByDestination(destination.id);
        populertrips = tripsRes?.result?.data || [];
    }

    return (
        <>
            <PageHero
                image={destination?.image || destination?.images?.[0]?.url}
                title={destination?.name}
                subtitle={`Explore awsome trips and unforgettable actibities in 
                        ${destination?.name}`}
                subtitle2='Tours and activities in'
            />
            {populertrips?.length > 0 && (
                <PopulerTrips
                    populertrips={populertrips}
                    destination={destination}
                />
            )}

            {popularActivities?.length > 0 && (
                <PopulerActivities
                    popularActivities={popularActivities}
                    destination={destination}
                />
            )}
        </>
    );
};

export default DestinationPage;


