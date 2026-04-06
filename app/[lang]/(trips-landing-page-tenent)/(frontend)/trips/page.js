import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import AdvancedTripFilter from './components/filter/advanced-filter';

import { getSiteInfo } from '@/app/_actions/settingsActions';
import { getAllAvailableFilterOperations } from '@/app/_actions/trips/affiliateTripsAction';
import { getAllDestinations } from '@/app/_actions/trips/destinations';
import { tripPackageOptions } from '@/data/trip-options';
import PageHero from '../../components/page-hero';
import { transformApiDataToPackageOptions } from '../../utils/trip-options';
import ExtendedSearch from './components/filter/extended-search';
import TripsListing from './components/trip-listing';
import TripsLoadingSkeliton from './components/trips-loading-skelitons';

export default async function TripsListingPage({ searchParams }) {
    const query = await searchParams;
    const url_search_params = new URLSearchParams(query);

    const [siteInfoRes, filterOptionsRes, destinationsRes] = await Promise.all([
        getSiteInfo(),
        getAllAvailableFilterOperations(),
        getAllDestinations()
    ]);

    if (!siteInfoRes?.success) {
        return notFound();
    }

    const transformedAvailableData = transformApiDataToPackageOptions(
        filterOptionsRes?.result?.data
    );

    return (
        <div className='min-h-screen dark:bg-gray-900  '>
            <PageHero
                flip={false}
                image='/activities.jpg'
                subtitle2='Trips'
                title='Explore Trips'
                subtitle='Explore your desired trip from our extended filter system'
            />
            <div className='container mx-auto px-4 py-8'>
                <ExtendedSearch
                    destinations={destinationsRes?.result?.data}
                />

                <div className='flex flex-col lg:flex-row gap-8'>
                    <AdvancedTripFilter
                        availablefilterOptions={
                            transformedAvailableData || tripPackageOptions
                        }
                    />

                    <div className='flex-1'>
                        <Suspense fallback={<TripsLoadingSkeliton />}>
                            <TripsListing
                                query={`${url_search_params.toString()}&status=ACTIVE`}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}

