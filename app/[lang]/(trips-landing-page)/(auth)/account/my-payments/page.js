import { getPaymentsByCustomerId } from '@/app/_actions/paymentActions';
import { auth } from '@/auth';
import { getGroupedDataOfStatus } from '@/lib/utils';
import PageContent from './components/page-content';

export default async function MyPaymentsPage() {
    const session = await auth();
    const payments = await getPaymentsByCustomerId(session?.user?.id);
    console.log(`customers payment`, payments);

    const paymentsData = payments?.result?.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const groupedData = getGroupedDataOfStatus(paymentsData);

    return (
        <div className='container py-6 space-y-6'>
            <PageContent
                groupedPayments={groupedData}
                Payments={paymentsData ?? []}
            />
        </div>
    );
}

