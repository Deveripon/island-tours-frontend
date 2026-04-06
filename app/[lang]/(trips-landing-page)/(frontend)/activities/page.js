import { getAllActivities } from '@/app/_actions/trips/activityActions';
import PageHero from '../../components/page-hero';
import Activity from '../trips/components/activity-card';

const ActivitiesListPage = async () => {
    const response = await getAllActivities();

    const activities =
        response?.result?.data?.filter(
            activity => activity?._count?.affiliateTrips > 0
        ) || [];

    return (
        <>
            <PageHero
                image='/activities.jpg'
                title='Explore Top Activities'
                subtitle2='Activities'
                subtitle='Uncover unforgettable adventures and experiences that make every trip truly extraordinary.
'
            />

            <section
                id='activities'
                className='bg-muted/30 py-24'>
                <div className='container mx-auto text-left px-4'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-end mb-12'>
                        <div>
                            <h2 className='text-lg md:text-lg text-foreground font-bold mb-4'>
                                Popular Activities
                            </h2>
                        </div>
                    </div>

                    {activities?.length === 0 && (
                        <div className='col-span-4'>
                            <p>No Activities found.</p>
                        </div>
                    )}
                    <div className='grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {activities?.map(activity => (
                            <Activity
                                key={activity.id}
                                activity={activity}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ActivitiesListPage;


