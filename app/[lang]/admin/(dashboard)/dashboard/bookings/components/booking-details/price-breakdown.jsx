import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/currency-info';
import { Clock, DollarSign } from 'lucide-react';
const PriceBreakdown = ({ bookingData }) => {
    return (
        <Card className='shadow-sm border-slate-200/60'>
            <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-3 text-sm font-medium text-slate-900'>
                    <DollarSign className='w-5 h-5 text-slate-600' />
                    Pricing Breakdown
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-5'>
                <div className='space-y-4'>
                    <div className='flex justify-between items-center'>
                        <span className='text-sm text-slate-600'>
                            Base Price
                        </span>
                        <span className='text-sm font-medium text-slate-900'>
                            {formatCurrency(
                                bookingData.pricing.basePrice,
                                bookingData.currency
                            )}
                        </span>
                    </div>

                    {bookingData.pricing.addonsPrice > 0 && (
                        <div>
                            <div className='flex justify-between items-center'>
                                <span className='text-sm text-slate-600'>
                                    Add-ons
                                </span>
                                <span className='text-sm font-medium text-slate-900'>
                                    {formatCurrency(
                                        bookingData.pricing.addonsPrice,
                                        bookingData.currency
                                    )}
                                </span>
                            </div>
                            {bookingData.pricing.addonsBreakdown &&
                                bookingData.pricing.addonsBreakdown.length >
                                    0 && (
                                    <div className='ml-4 mt-2 space-y-1'>
                                        {bookingData.pricing.addonsBreakdown.map(
                                            (addon, index) => (
                                                <div
                                                    key={index}
                                                    className='flex justify-between items-center text-sm'>
                                                    <span className='text-slate-500'>
                                                        • {addon.name}
                                                    </span>
                                                    <span className='text-slate-500'>
                                                        {formatCurrency(
                                                            addon.totalPrice,
                                                            bookingData.currency
                                                        )}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                        </div>
                    )}
                    {bookingData.pricing.discounts.map((discount, index) => (
                        <div
                            key={index}
                            className='flex justify-between items-center text-emerald-600'>
                            <div className='flex items-center gap-2'>
                                <Clock className='w-3 h-3' />
                                <span className='text-sm'>{discount.name}</span>
                            </div>
                            <span className='text-sm font-medium'>
                                -
                                {formatCurrency(
                                    discount.amount,
                                    bookingData.currency
                                )}
                            </span>
                        </div>
                    ))}

                    <div className='flex justify-between items-center'>
                        <span className='text-sm text-slate-600'>
                            Service Charges
                        </span>
                        <span className='text-sm font-medium text-slate-900'>
                            {formatCurrency(
                                bookingData.pricing.serviceCharges,
                                bookingData.currency
                            )}
                        </span>
                    </div>

                    <div className='flex justify-between items-center'>
                        <span className='text-sm text-slate-600'>Taxes</span>
                        <span className='text-sm font-medium text-slate-900'>
                            {formatCurrency(
                                bookingData.pricing.taxes,
                                bookingData.currency
                            )}
                        </span>
                    </div>

                    <Separator className='my-4' />

                    <div className='flex justify-between items-center'>
                        <span className='text-base font-medium text-slate-900'>
                            Total Amount
                        </span>
                        <span className='text-sm font-semibold text-slate-900'>
                            {formatCurrency(
                                bookingData.pricing.total,
                                bookingData.currency
                            )}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PriceBreakdown;

