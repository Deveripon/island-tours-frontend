import { getAllDestinationOfTenant } from '@/app/_actions/trips/destinations';
import PageContent from './components/page-content';

export default async function DestinationPage({ params }) {
    const { tenant } = await params;
    const res = await getAllDestinationOfTenant(tenant);

    // Make sure both categories passed are of the same type
    const destnationsData = res?.data;

    return (
        <div className='container space-y-6'>
            <PageContent destinations={destnationsData ?? []} />
        </div>
    );
}
