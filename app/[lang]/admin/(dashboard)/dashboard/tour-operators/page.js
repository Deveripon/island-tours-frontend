import { getAllAffiliatesOfTenant } from '@/app/_actions/partnerActions';
import PageContent from './components/page-content';

export default async function TourOperatorPage({ params }) {
    const { tenant } = await params;
    const res = await getAllAffiliatesOfTenant(tenant);

    // Make sure both categories passed are of the same type
    const tourOperatorsData = res?.result?.data;

    return (
        <div className='container space-y-6'>
            <PageContent tourOperators={tourOperatorsData ?? []} />
        </div>
    );
}
