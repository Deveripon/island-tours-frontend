import TripCard from '../../../trips/components/trip-card';

const TripsList = ({ trips, tenantId, activityName }) => {
    return (
        <section id='populer-trips' className=' py-24'>
            <div className=' mx-auto text-left px-4'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-end mb-12'>
                    <div>
                        <h2 className='text-lg font-dm-sans md:text-lg font-bold text-foreground mb-4'>
                            Trips with activity - {activityName}
                        </h2>
                    </div>
                </div>

                <div className='grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {trips?.map(trip => (
                        <TripCard
                            tenantId={tenantId}
                            key={trip.id}
                            trip={trip}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TripsList;

