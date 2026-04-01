import { getAllBookingsofUser } from '@/app/_actions/bookingActions';
import { auth } from '@/auth';
import { getGroupedDataOfStatus } from '@/lib/utils';
import PageContent from './components/page-content';

export default async function MyBookingsPage({ params }) {
    const session = await auth();
    const { tenant } = await params;
    const bookings = await getAllBookingsofUser(session?.user?.id);

    const bookingsData = bookings?.result?.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const groupedData = getGroupedDataOfStatus(bookingsData);

    return (
        <div className='container py-6 space-y-6'>
            <PageContent
                tenant={tenant}
                groupedBookings={groupedData}
                bookings={bookingsData ?? []}
            />
        </div>
    );
}

