import { getAllPayments } from '@/app/_actions/paymentActions';
import PageContent from './components/page-content';

export default async function MyPaymentsPage() {
    const payments = await getAllPayments();
    console.log('Payments:', payments);
    const paymentsData = payments?.payments?.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return (
        <div className='container space-y-6 min-h-100vh'>
            <PageContent Payments={paymentsData ?? []} />
        </div>
    );
}
