import { getB2cCustomers } from '@/app/_actions/customerActions';
import PageContent from './components/page-content';

export default async function CustomersPage() {
    const res = await getB2cCustomers();

    const customers = res?.data;

    return (
        <div className='container space-y-6'>
            <PageContent customers={customers ?? []} />
        </div>
    );
}
