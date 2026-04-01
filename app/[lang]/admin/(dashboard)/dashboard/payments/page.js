import { getAllRecivedAffiliatePaymentsOfTenant } from '@/app/_actions/paymentActions';
import PageContent from './components/page-content';

export default async function MyPaymentsPage({ params }) {
    const { tenant } = await params;
    const payments = await getAllRecivedAffiliatePaymentsOfTenant(tenant);
    console.log('Payments:', payments);
    const paymentsData = payments?.result?.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return (
        <div className='container space-y-6 min-h-100vh'>
            <PageContent Payments={paymentsData ?? []} />
        </div>
    );
}
