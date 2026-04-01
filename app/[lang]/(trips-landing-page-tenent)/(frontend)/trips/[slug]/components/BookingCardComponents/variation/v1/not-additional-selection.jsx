'use client';
import { Button } from '@/components/ui/button';
import { getCurrencyIcon } from '@/utils/currency-info';
import { useTrip } from '../../../../../../../hooks/use-trip';

const NotAdditionalSelection = () => {
    const {
        tripData,
        selectedAdditionals,
        updateSelectedAdditionals,
        pricing,
        updateAdditionalQuantity,
        getAdditionalQuantity,
    } = useTrip();

    // Handle quantity updates using provider functions
    const handleQuantityUpdate = (additionalId, increment) => {
        const currentQuantity = getAdditionalQuantity(additionalId);
        const newQuantity = increment
            ? currentQuantity + 1
            : Math.max(0, currentQuantity - 1);

        if (newQuantity === 0) {
            // Remove the additional by filtering it out
            const updatedAdditionals = selectedAdditionals.filter(
                item => item.id !== additionalId
            );
            updateSelectedAdditionals(updatedAdditionals);
        } else {
            // Update or add the additional
            const additional = tripData?.additionals?.find(
                a => a.id === additionalId
            );
            if (!additional) return;

            const updatedAdditionals = selectedAdditionals.some(
                item => item.id === additionalId
            )
                ? selectedAdditionals.map(item =>
                      item.id === additionalId
                          ? { ...item, quantity: newQuantity }
                          : item
                  )
                : [
                      ...selectedAdditionals,
                      { ...additional, quantity: newQuantity },
                  ];

            updateSelectedAdditionals(updatedAdditionals);
        }
    };

    // Handle direct removal from chip
    const handleRemoveAdditional = additionalId => {
        const updatedAdditionals = selectedAdditionals.filter(
            item => item.id !== additionalId
        );
        updateSelectedAdditionals(updatedAdditionals);
    };

    const currencyIcon = getCurrencyIcon(tripData?.pricingConfig?.currency);

    // Calculate totals from selected additionals
    const selectedCount = selectedAdditionals.length;
    const totalAdditionalCost = selectedAdditionals.reduce(
        (total, additional) => {
            return (
                total +
                (additional.priceImpact || 0) * (additional.quantity || 1)
            );
        },
        0
    );

    const notAdditional = tripData?.additionals.filter(
        additional => !additional.isExtra
    );
    if (!notAdditional || notAdditional.length === 0) {
        return null;
    }

    return (
        <div>
            <h3 className='text-sm font-semibold mb-2 text-gray-500 dark:text-gray-400'>
                Other Services
            </h3>

            {/*          {selectedAdditionals.length > 0 && (
                <div className='text-sm text-gray-700 dark:text-gray-300 p-2 mb-3 bg-blue-50 dark:bg-blue-900/20 rounded'>
                    <Info className='h-3 w-3 inline mr-1' />
                    {selectedAdditionals.length} additional service
                    {selectedAdditionals.length !== 1 ? 's' : ''} selected
                    {pricing?.breakdown?.additionalsCost > 0 && (
                        <span className='ml-1'>
                            (+{currencyIcon}
                            {pricing?.breakdown?.additionalsCost})
                        </span>
                    )}
                </div>
            )} */}

            {/* Always visible content - no popover */}

            <div className='space-y-3'>
                {tripData?.additionals?.length === 0 ? (
                    <p className='text-sm text-gray-500 dark:text-gray-400 py-4 text-center'>
                        No additional services available
                    </p>
                ) : (
                    notAdditional?.map(additional => {
                        const quantity = getAdditionalQuantity(additional.id);
                        const hasQuantity = quantity > 0;

                        return (
                            <div
                                key={additional.id}
                                className={`p-3 rounded-lg border transition-colors ${
                                    hasQuantity
                                        ? 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                                        : 'border-gray-200 dark:border-gray-700'
                                }`}>
                                <div className='flex items-center justify-between mb-2'>
                                    <div className='flex-1'>
                                        <div className='flex items-center mb-1'>
                                            <h5 className='font-medium text-sm text-gray-900 dark:text-gray-100'>
                                                {additional.name}
                                            </h5>
                                            {hasQuantity && (
                                                <span className='ml-2 px-2 py-0.5 text-sm bg-blue-600 dark:bg-blue-500 text-white rounded-full font-medium'>
                                                    {quantity}
                                                </span>
                                            )}
                                        </div>

                                        <div className='text-sm text-gray-700 dark:text-gray-300'>
                                            {additional.priceImpact === 0 ? (
                                                <span className='text-green-600 dark:text-green-400 font-medium'>
                                                    Free
                                                </span>
                                            ) : additional.priceImpact > 0 ? (
                                                <span className='font-medium'>
                                                    +{currencyIcon}
                                                    {
                                                        additional.priceImpact
                                                    }{' '}
                                                    each
                                                </span>
                                            ) : (
                                                <span className='text-green-600 dark:text-green-400 font-medium'>
                                                    {currencyIcon}
                                                    {Math.abs(
                                                        additional.priceImpact
                                                    )}{' '}
                                                    discount each
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Always visible quantity controls */}
                                    <div className='flex items-center space-x-2 ml-4'>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            className='dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 h-8 w-8 p-0'
                                            onClick={() =>
                                                handleQuantityUpdate(
                                                    additional.id,
                                                    false
                                                )
                                            }
                                            disabled={quantity <= 0}>
                                            -
                                        </Button>
                                        <span className='min-w-[2rem] text-center text-sm font-medium text-gray-900 dark:text-gray-100'>
                                            {quantity}
                                        </span>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            className='dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 h-8 w-8 p-0'
                                            onClick={() =>
                                                handleQuantityUpdate(
                                                    additional.id,
                                                    true
                                                )
                                            }>
                                            +
                                        </Button>
                                    </div>
                                </div>

                                {/* Show total cost for this service when quantity > 0 */}
                                {hasQuantity &&
                                    additional.priceImpact !== 0 && (
                                        <div className='text-sm text-right font-medium text-blue-700 dark:text-blue-400 mt-2 pt-2 border-t border-blue-200 dark:border-blue-800'>
                                            Subtotal:{' '}
                                            {additional.priceImpact > 0
                                                ? '+'
                                                : ''}
                                            {currencyIcon}
                                            {additional.priceImpact * quantity}
                                        </div>
                                    )}
                            </div>
                        );
                    })
                )}

                {/* Overall Summary */}
                {/*        {selectedCount > 0 && (
                    <div className='mt-4 pt-3 border-t border-gray-200 dark:border-gray-700'>
                        <div className='flex justify-between items-center text-sm'>
                            <span className='font-medium text-gray-900 dark:text-gray-100'>
                                Total Additional Cost:
                            </span>
                            <span className='font-semibold text-gray-900 dark:text-gray-100'>
                                {totalAdditionalCost === 0
                                    ? 'Free'
                                    : `${
                                          totalAdditionalCost > 0 ? '+' : ''
                                      }${currencyIcon}${totalAdditionalCost}`}
                            </span>
                        </div>
                    </div>
                )}
 */}
                {/* Instructions */}
                {/*       <div className='text-sm text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-900 rounded'>
                    <Info className='h-3 w-3 inline mr-1' />
                    Use + and - buttons to select quantity for each additional
                    service
                </div> */}
            </div>

            {/* Selected additionals display as chips */}
            {/*      {selectedCount > 0 && (
                <div className='mt-2'>
                    <div className='text-sm text-gray-600 dark:text-gray-400 mb-1'>Selected:</div>
                    <div className='flex flex-wrap gap-1'>
                        {selectedAdditionals.map(additional => (
                            <span
                                key={additional.id}
                                className='inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'>
                                {additional.name}
                                <span className='ml-1 font-medium'>
                                    ×{additional.quantity}
                                </span>
                                {additional.priceImpact !== 0 && (
                                    <span className='ml-1'>
                                        ({additional.priceImpact > 0 ? '+' : ''}
                                        {currencyIcon}
                                        {additional.priceImpact *
                                            additional.quantity}
                                        )
                                    </span>
                                )}
                                <button
                                    onClick={() =>
                                        handleRemoveAdditional(additional.id)
                                    }
                                    className='ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5'>
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default NotAdditionalSelection;

