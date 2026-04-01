import { getAllPaymentsOfUser } from '@/app/_actions/paymentActions';
import { auth } from '@/auth';
import { getGroupedDataOfStatus } from '@/lib/utils';
import PageContent from './components/page-content';

export default async function MyPaymentsPage({ params }) {
    const { tenantId } = await params;
    const session = await auth();
    const payments = await getAllPaymentsOfUser(session?.user?.id, tenantId);

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

