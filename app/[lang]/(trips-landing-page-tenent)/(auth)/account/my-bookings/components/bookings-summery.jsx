import { formatKey } from '@/lib/utils';

const BookingsSummery = ({
    allBookings,
    groupedBookings,
    handleTypeCardClick,
    typeFilter,
    setTypeFilter }) => {
    return (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4'>
            {Object.entries(groupedBookings).map(([status, values]) => {
                // Check if this card is the active filter
                const isActive = typeFilter === status;

                return (
                    <div
                        key={status}
                        className={`rounded-lg p-4 shadow-sm border transition-all duration-200 ${
                            status === 'CONFIRMED'
                                ? 'bg-success/10 border-success/20 text-success hover:bg-success/15'
                                : status === 'COMPLETED'
                                ? 'bg-warning/10 border-warning/20 text-warning hover:bg-warning/15'
                                : 'bg-card border-border text-card-foreground hover:bg-accent'
                        } cursor-pointer hover:scale-105 ${
                            isActive ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleTypeCardClick(status)}>
                        <div className='text-sm font-medium mb-1'>
                            {formatKey(status)}
                        </div>
                        <div className='text-lg font-bold'>
                            {values.length}
                        </div>
                    </div>
                );
            })}
            <div
                className={`bg-primary/10 rounded-lg p-4 shadow-sm border border-primary/20 cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-primary/15 ${
                    typeFilter === '' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setTypeFilter('')}>
                <div className='text-sm text-primary font-medium mb-1'>
                    Total
                </div>
                <div className='text-lg font-bold text-primary'>
                    {allBookings.length}
                </div>
            </div>
        </div>
    );
};

export default BookingsSummery;

