import { getAllBookingsofUser } from '@/app/_actions/bookingActions';
import { auth } from '@/auth';
import { getGroupedDataOfStatus } from '@/lib/utils';
import PageContent from './components/page-content';

export default async function MyBookingsPage({ params }) {
    const { tenantId } = await params;
    const session = await auth();
    const bookings = await getAllBookingsofUser(session?.user?.id, tenantId);

    const bookingsData = bookings?.result?.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const groupedData = getGroupedDataOfStatus(bookingsData);

    return (
        <div className='container py-6 space-y-6'>
            <PageContent
                tenant={tenantId}
                groupedBookings={groupedData}
                bookings={bookingsData ?? []}
            />
        </div>
    );
}

