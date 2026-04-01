import { formatKey } from '@/lib/utils';
import { useMemo } from 'react';

const BookingsSummery = ({
    allBookings,
    groupedBookings,
    handleTypeCardClick,
    typeFilter,
    setTypeFilter,
}) => {
    const aggregations = useMemo(() => {
        return {
            totalRevenue: allBookings.reduce(
                (sum, booking) => sum + (booking.totalPayable || 0),
                0
            ),
            totalPaid: allBookings.reduce(
                (sum, booking) => sum + (booking.paidAmount || 0),
                0
            ),
            totalPending: allBookings.reduce(
                (sum, booking) => sum + (booking.pendingAmount || 0),
                0
            ),
        };
    }, [allBookings]);

    return (
        <div className='space-y-4'>
            {/* Status Cards */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                {Object.entries(groupedBookings).map(([status, values]) => {
                    const isActive = typeFilter === status;

                    return (
                        <div
                            key={status}
                            className={`rounded-lg p-4 border bg-card shadow-sm cursor-pointer transition-all hover:border-primary/50 ${
                                isActive
                                    ? 'ring-2 ring-primary border-primary'
                                    : ''
                            }`}
                            onClick={() => handleTypeCardClick(status)}>
                            <div className='text-sm font-medium text-muted-foreground mb-1'>
                                {status === 'CONFIRMED'
                                    ? 'Upcoming'
                                    : formatKey(status)}
                            </div>
                            <div className='text-2xl font-semibold'>
                                {values.length}
                            </div>
                        </div>
                    );
                })}

                {/* Total Card */}
                <div
                    className={`rounded-lg p-4 border border-primary/30 bg-primary/5 shadow-sm cursor-pointer transition-all hover:border-primary/50 ${
                        typeFilter === ''
                            ? 'ring-2 ring-primary border-primary'
                            : ''
                    }`}
                    onClick={() => setTypeFilter('')}>
                    <div className='text-sm font-medium text-primary mb-1'>
                        Total
                    </div>
                    <div className='text-2xl font-semibold text-primary'>
                        {allBookings.length}
                    </div>
                </div>
            </div>

            {/* Revenue Cards */}
            {/*     <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div className='rounded-lg p-4 border bg-card shadow-sm'>
                    <div className='text-sm font-medium text-muted-foreground mb-1'>
                        Total Revenue
                    </div>
                    <div className='text-2xl font-semibold text-foreground'>
                        ${aggregations.totalRevenue.toLocaleString()}
                    </div>
                </div>

                <div className='rounded-lg p-4 border bg-card shadow-sm'>
                    <div className='text-sm font-medium text-muted-foreground mb-1'>
                        Total Received
                    </div>
                    <div className='text-2xl font-semibold text-green-600 dark:text-green-400'>
                        ${aggregations.totalPaid.toLocaleString()}
                    </div>
                </div>

                <div className='rounded-lg p-4 border bg-card shadow-sm'>
                    <div className='text-sm font-medium text-muted-foreground mb-1'>
                        Total Pending
                    </div>
                    <div className='text-2xl font-semibold text-orange-600 dark:text-orange-400'>
                        ${aggregations.totalPending.toLocaleString()}
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default BookingsSummery;

