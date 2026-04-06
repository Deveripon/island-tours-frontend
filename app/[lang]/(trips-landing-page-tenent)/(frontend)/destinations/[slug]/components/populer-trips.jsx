import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import TripCard from '../../../trips/components/trip-card';

export default function PopulerTrips({ populertrips, destination }) {
    return (
        <section
            id='populer-trips'
            className='bg-gray-50 dark:bg-gray-900 py-24'>
            <div className='container mx-auto text-left px-4'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-end mb-12'>
                    <div>
                        <h2 className='text-lg md:text-lg font-bold text-gray-600 dark:text-gray-200 mb-4'>
                            Popular Trips in {destination?.name}
                        </h2>
                    </div>
                </div>

                <div className='grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {populertrips?.length === 0 && (
                        <div className='col-span-4'>
                            <p>No trips found.</p>
                        </div>
                    )}
                    {populertrips?.slice(0, 12).map(trip => (
                        <TripCard
                            key={trip.id}
                            trip={trip}
                        />
                    ))}
                </div>

                <div className='mt-8 text-center md:hidden'>
                    <Button variant='outline'>
                        View all trips
                        <ArrowRight className='ml-2 h-4 w-4' />
                    </Button>
                </div>
            </div>
        </section>
    );
}

