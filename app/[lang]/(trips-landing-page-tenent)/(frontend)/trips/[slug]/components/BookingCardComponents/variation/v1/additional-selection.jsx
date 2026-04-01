'use client';
import { Button } from '@/components/ui/button';
import { getCurrencyIcon } from '@/utils/currency-info';
import { Info } from 'lucide-react';
import { useTrip } from '../../../../../../../hooks/use-trip';

const AdditionalSelection = () => {
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

    const additionals = tripData?.additionals.filter(
        additional => additional.isExtra
    );

    return (
        <div>
            <h3 className='text-sm font-semibold mb-2 text-gray-500 dark:text-gray-400'>
                Additional Services
            </h3>

            <div className='space-y-3'>
                <h4 className='font-medium text-sm mb-3 text-gray-900 dark:text-gray-100'>
                    Available Additional Services
                </h4>

                {additionals?.length === 0 ? (
                    <p className='text-sm text-gray-500 dark:text-gray-400 py-4 text-center'>
                        No additional services available
                    </p>
                ) : (
                    additionals?.map(additional => {
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
                                            className='dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700'
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
                                            className='dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700'
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

                {/* Instructions */}
                <div className='text-sm text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-900 rounded'>
                    <Info className='h-3 w-3 inline mr-1' />
                    Use + and - buttons to select quantity for each additional
                    service
                </div>
            </div>
        </div>
    );
};

export default AdditionalSelection;

