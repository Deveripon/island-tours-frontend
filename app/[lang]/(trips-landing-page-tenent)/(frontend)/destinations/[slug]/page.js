import {
    DummypopularActivities,
    DummypopularDestinations,
    featuredTrips,
} from '@/app/[lang]/(trips-landing-page-tenent)/data/data';
import { getAllActivityOfTenant } from '@/app/_actions/trips/activityActions';
import { getTripsByDestinationOfATenant } from '@/app/_actions/trips/affiliateTripsAction';
import { getAllDestinationOfTenant } from '@/app/_actions/trips/destinations';
import { generateSlug } from '@/lib/utils';
import { transformDestinationData } from '../../../components/home/populer-destinations';
import PageHero from '../../../components/page-hero';
import PopulerActivities from './components/populer-activities';
import PopulerTrips from './components/populer-trips';

const DestinationPage = async ({ params }) => {
    const { tenantId, slug } = await params;
    const isDemo = tenantId === 'demo';

    let destination, popularActivities, populertrips;

    if (isDemo) {
        // Demo mode - use dummy data
        destination = DummypopularDestinations.find(
            destination => generateSlug(destination.name) === slug
        );
        popularActivities = DummypopularActivities;
        populertrips = featuredTrips;
    } else {
        // Get destinations
        const allDestinations = await getAllDestinationOfTenant(tenantId);
        const allDestinationsData = transformDestinationData(
            allDestinations?.data
        );

        destination = allDestinationsData?.find(
            destination => generateSlug(destination.name) === slug
        );

        if (destination) {
            // Get activities for this destination
            const activities = await getAllActivityOfTenant(
                tenantId,
                `location=${destination.country ||
                destination.city ||
                destination.region ||
                destination.name
                }`
            );

            popularActivities =
                activities?.data && activities.data.length > 0
                    ? activities.data
                    : [];

            // Get trips for this destination
            const response = await getTripsByDestinationOfATenant(
                tenantId,
                destination.id
            );

            populertrips =
                response?.data && response.data.length > 0
                    ? response?.data
                    : [];
        }
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
                    tenantId={tenantId}
                    destination={destination}
                />
            )}

            {popularActivities?.length > 0 && (
                <PopulerActivities
                    popularActivities={popularActivities}
                    tenantId={tenantId}
                    destination={destination}
                />
            )}
        </>
    );
};

export default DestinationPage;

