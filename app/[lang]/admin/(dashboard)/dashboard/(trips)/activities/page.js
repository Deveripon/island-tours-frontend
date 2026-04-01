import { getAllActivityOfTenant } from '@/app/_actions/trips/activityActions';
import { getAllDestinationOfTenant } from '@/app/_actions/trips/destinations';
import PageContent from './components/page-content';

export default async function ActivitiesPage({ params }) {
    const { tenant } = await params;
    const res = await getAllActivityOfTenant(tenant, 'limit=100');

    const activities = res?.data;
    const destinationRes = await getAllDestinationOfTenant(tenant, 'limit=100');

    const destinations = destinationRes?.data;

    return (
        <div className='container space-y-6'>
            <PageContent destinations={destinations ?? []} activities={activities ?? []} />
        </div>
    );
}
