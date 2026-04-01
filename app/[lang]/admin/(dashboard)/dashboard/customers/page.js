import { getAllCustomersOfTenant } from '@/app/_actions/settingsActions';
import PageContent from './components/page-content';

export default async function CustomersPage({ params }) {
    const { tenant } = await params;
    const res = await getAllCustomersOfTenant(tenant);

    const customers = res?.result?.data;

    return (
        <div className='container space-y-6'>
            <PageContent customers={customers ?? []} />
        </div>
    );
}
