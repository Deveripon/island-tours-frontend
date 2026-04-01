import { getActivitiesById } from '@/app/_actions/trips/activityActions';
import { getTripsByActivityId } from '@/app/_actions/trips/affiliateTripsAction';
import { notFound } from 'next/navigation';

import PageHero from '../../../components/page-hero';
import TripsList from './components/trips-list';

const ActivityDetailsPage = async ({ params }) => {
    const { id, tenantId } = await params;
    const res = await getActivitiesById(id);

    if (res?.success === false) {
        return notFound();
    }
    const activity = res?.result?.data;
    const response = await getTripsByActivityId(tenantId, activity?.id);

    return (
        <>
            <PageHero
                image={activity?.image || activity?.images?.[0]?.url}
                title={activity?.name}
                subtitle={`Enjoy ${activity?.name} with these amazing trips.`}
                subtitle2='Tours included activity'
            />
            <div className='container mx-auto text-left px-4'>
                <div className='flex  justify-center items-center md:items-end py-12'>
                    <p className='text-md font-dm-sans text-foreground'>
                        {activity?.description}
                    </p>
                </div>

                {response?.data?.length === 0 ? (
                    <div className='col-span-4'>
                        <p>No trips found.</p>
                    </div>
                ) : (
                    <TripsList
                        trips={response?.data}
                        tenantId={tenantId}
                        activityName={activity?.name}
                    />
                )}
            </div>
        </>
    );
};

export default ActivityDetailsPage;

