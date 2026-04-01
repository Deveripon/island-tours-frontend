import { getAllpickupsOfTenant } from '@/app/_actions/pickupActions';
import PageContent from './components/page-content';

export default async function PickupsPage({ params }) {
    const { tenant } = await params;
    const res = await getAllpickupsOfTenant(tenant);

    // Make sure both categories passed are of the same type
    const pickupData = res?.result?.data;

    return (
        <div className='container space-y-6'>
            <PageContent pickups={pickupData ?? []} />
        </div>
    );
}
