import { getAllLeads } from '@/app/_actions/leadsActions';
import PageContent from './components/page-content';

export default async function leadsPage() {
    const res = await getAllLeads();

    const leads = res?.result?.data;

    return (
        <div className='container space-y-6'>
            <PageContent leads={leads ?? []} />
        </div>
    );
}
