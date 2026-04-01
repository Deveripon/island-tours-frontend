import { getAllLeadsOfaTenant } from '@/app/_actions/leadsActions';
import PageContent from './components/page-content';

export default async function leadsPage({ params }) {
    const { tenant } = await params;
    const res = await getAllLeadsOfaTenant(tenant);

    const leads = res?.data?.data;

    return (
        <div className='container space-y-6'>
            <PageContent tenant={tenant} leads={leads ?? []} />
        </div>
    );
}
