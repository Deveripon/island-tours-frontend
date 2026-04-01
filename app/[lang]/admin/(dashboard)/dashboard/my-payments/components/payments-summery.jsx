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

                return (
                    <div
                        key={status}
                        className={`rounded-lg p-4 shadow-sm border ${
                            status === 'COMPLETED'
                                ? 'bg-emerald-100 border-emerald-100 text-emerald-500'
                                : 'border-gray-200'
                        } ${
                            status === 'PENDING'
                                ? 'bg-orange-100 border-orange-100 text-orange-500'
                                : 'text-gray-700'
                        } 
                          ${
                              status === 'CENCELED'
                                  ? 'bg-yellow-50-100 border-YEbg-yellow-50-100 text-YEbg-yellow-50-500'
                                  : 'text-gray-700'
                          }
                           ${
                               status === 'FAILED'
                                   ? 'bg-red-100 border-red-100 text-red-500'
                                   : 'text-gray-700'
                           }   
                        } cursor-pointer transition-transform hover:scale-105 ${
                            isActive ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleTypeCardClick(status)}>
                        <div className={`text-sm font-medium mb-1`}>
                            {formatKey(status)}
                        </div>
                        <div className={`text-lg font-bold`}>
                            {values.length}
                        </div>
                    </div>
                );
            })}
            <div
                className={`bg-primary/10 rounded-lg p-4 shadow-sm border border-primary/20 cursor-pointer transition-transform hover:scale-105 ${
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

