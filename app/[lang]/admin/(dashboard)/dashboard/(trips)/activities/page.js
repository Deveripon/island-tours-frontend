import { getAllActivities } from '@/app/_actions/trips/activityActions';
import { getAllDestinations } from '@/app/_actions/trips/destinations';
import PageContent from './components/page-content';

export default async function ActivitiesPage() {
    const res = await getAllActivities('limit=100');

    const activities = res?.result?.data;
    const destinationRes = await getAllDestinations();

    const destinations = destinationRes?.result?.data;

    return (
        <div className='container space-y-6'>
            <PageContent
                destinations={destinations ?? []}
                activities={activities ?? []}
            />
        </div>
    );
}
