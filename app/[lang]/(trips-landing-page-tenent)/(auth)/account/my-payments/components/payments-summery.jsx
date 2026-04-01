import { formatKey } from '@/lib/utils';

const PaymentsSummery = ({
    allPayments,
    groupedPayments,
    handleTypeCardClick,
    typeFilter,
    setTypeFilter }) => {
    return (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4'>
            {Object.entries(groupedPayments).map(([status, values]) => {
                // Check if this card is the active filter
                const isActive = typeFilter === status;

                // Determine color scheme based on status
                let colorClasses = 'bg-card border-border text-card-foreground hover:bg-accent';
                if (status === 'COMPLETED') {
                    colorClasses = 'bg-success/10 border-success/20 text-success hover:bg-success/15';
                } else if (status === 'PENDING') {
                    colorClasses = 'bg-warning/10 border-warning/20 text-warning hover:bg-warning/15';
                } else if (status === 'FAILED') {
                    colorClasses = 'bg-destructive/10 border-destructive/20 text-destructive hover:bg-destructive/15';
                } else if (status === 'CANCELED') {
                    colorClasses = 'bg-info/10 border-info/20 text-info hover:bg-info/15';
                }

                return (
                    <div
                        key={status}
                        className={`rounded-lg p-4 shadow-sm border transition-all duration-200 ${colorClasses} cursor-pointer hover:scale-105 ${
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
                    {allPayments.length}
                </div>
            </div>
        </div>
    );
};

export default PaymentsSummery;

