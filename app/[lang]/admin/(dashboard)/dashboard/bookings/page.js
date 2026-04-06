import { getAllBookings } from '@/app/_actions/bookingActions';
import { getGroupedDataOfStatus } from '@/lib/utils';
import PageContent from './components/page-content';

export default async function Bookings() {
    const bookings = await getAllBookings();
    console.log('Bookings:', bookings);
    const bookingsData = bookings?.result?.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const groupedData = getGroupedDataOfStatus(bookingsData);
    console.log('Grouped Data:', groupedData);

    return (
        <div className='container space-y-6'>
            <PageContent
                groupedBookings={groupedData}
                bookings={bookingsData ?? []}
            />
        </div>
    );
}
