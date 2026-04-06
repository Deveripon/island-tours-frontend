import Activity from '../../../trips/components/activity-card';

export default function PopulerActivities({
    popularActivities,
    destination }) {
    return (
        <section
            id='populer-activities'
            className=' bg-background dark:bg-gray-900 py-24'>
            <div className='container mx-auto text-left px-4'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-end mb-12'>
                    <div>
                        <h2 className='text-lg md:text-lg text-gray-600 dark:text-gray-200 font-bold mb-4'>
                            Popular Activities in {destination?.name}
                        </h2>
                    </div>
                </div>

                {popularActivities?.length === 0 && (
                    <div className='col-span-4'>
                        <p>No Activities found.</p>
                    </div>
                )}
                <div className='grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {popularActivities?.slice(0, 12).map(activity => (
                        <Activity
                            key={activity.id}
                            activity={activity}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

