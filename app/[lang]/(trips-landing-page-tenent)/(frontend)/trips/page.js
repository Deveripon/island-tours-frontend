import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import AdvancedTripFilter from './components/filter/advanced-filter';

import { getTenantById } from '@/app/_actions/settingsActions';
import { getAllTripFilterOptions } from '@/app/_actions/trips/affiliateTripsAction';
import { getAllDestinationOfTenant } from '@/app/_actions/trips/destinations';
import { tripPackageOptions } from '@/data/trip-options';
import PageHero from '../../components/page-hero';
import { transformApiDataToPackageOptions } from '../../utils/trip-options';
import ExtendedSearch from './components/filter/extended-search';
import TripsListing from './components/trip-listing';
import TripsLoadingSkeliton from './components/trips-loading-skelitons';
export default async function TripsListingPage({ searchParams, params }) {
    const query = await searchParams;
    const url_search_params = new URLSearchParams(query);
    const { tenantId } = await params;
    const isDemo = tenantId === 'demo';

    const res = !isDemo && (await getTenantById(tenantId));
    if (!isDemo) {
        if (res?.success === false || !res.result?.data?.tenantId) {
            return notFound();
        }
    }

    const allAvailableTripFilterOptions = await getAllTripFilterOptions(tenantId);
    const transformedAvailableData = transformApiDataToPackageOptions(
        allAvailableTripFilterOptions?.data
    );
    const destinations = await getAllDestinationOfTenant(tenantId);
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
                    destinations={destinations?.data}
                    tenantId={tenantId}
                    siteOwner={res?.user?.id}
                />

                <div className='flex flex-col lg:flex-row gap-8'>
                    <AdvancedTripFilter
                        availablefilterOptions={
                            !isDemo ? transformedAvailableData : tripPackageOptions
                        }
                        siteOwner={res?.user?.id}
                    />

                    <div className='flex-1'>
                        <Suspense fallback={<TripsLoadingSkeliton />}>
                            <TripsListing
                                isDemo={isDemo}
                                tenantId={tenantId}
                                siteOwner={res?.user?.id}
                                query={`${url_search_params.toString()}&status=ACTIVE&tenantId=${tenantId}`}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
