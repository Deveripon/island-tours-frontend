'use client';
import { formateDate } from '@/app/[lang]/(trips-landing-page-tenent)/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/currency-info';
import { Clock } from 'lucide-react';

const PaymentSummery = ({ data }) => {
    return (
        <div className='space-y-4'>
            {/* Price Summary */}
            <Card>
                <CardContent className='p-6'>
                    <div className='text-center mb-6'>
                        <div className='text-sm text-gray-600 mb-1'>
                            GRAND TOTAL - {data?.travellerInfo?.adults?.length}{' '}
                            Adults{' '}
                            {data?.travellerInfo?.children?.length > 0 &&
                                `| ${data?.travellerInfo?.children?.length} Children`}{' '}
                            {data?.travellerInfo?.infants?.length > 0 &&
                                `| ${data?.travellerInfo?.infants?.length} Infants`}
                        </div>
                        <div className='text-lg font-bold'>
                            {formatCurrency(
                                data?.totalPayable,
                                data?.currency || 'USD'
                            )}
                        </div>
                        <div className='text-sm text-gray-600'>
                            Inclusive of Taxes
                        </div>
                    </div>
                    <div className=' space-y-3 mt-4'>
                        <div className='flex justify-between text-sm'>
                            <span>Pay to Book</span>
                            {data?.paymentOption === 'pay_now' ? (
                                <span className=' font-semibold'>
                                    {formatCurrency(
                                        (data?.totalPayable * 25) / 100,
                                        data?.currency || 'USD'
                                    )}
                                </span>
                            ) : (
                                <span className=' font-semibold'>
                                    {formatCurrency(
                                        data?.totalPayable,
                                        data?.currency || 'USD'
                                    )}
                                </span>
                            )}
                        </div>
                        {data?.paymentOption === 'pay_now' &&
                            data?.paymentSchedule.length > 0 && (
                                <div className='flex justify-between text-sm'>
                                    <span>
                                        Before{' '}
                                        {formateDate(
                                            data?.paymentSchedule[1].dueDate
                                        )}{' '}
                                    </span>{' '}
                                    {/* before users selected trip start date */}
                                    <span title='75% of Total Payable amount'>
                                        {formatCurrency(
                                            (data?.paymentSchedule[1].amount *
                                                75) /
                                                100,
                                            data?.currency || 'USD'
                                        )}{' '}
                                        {/* 75% of total payable amount - It will manage from dashboard */}
                                    </span>
                                </div>
                            )}
                    </div>

                    <Separator className='my-4' />

                    <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                            <span>Total Basic Cost </span>
                            <span>
                                {' '}
                                {formatCurrency(
                                    data?.pricing?.subtotal,
                                    data?.currency || 'USD'
                                )}{' '}
                            </span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span>Total Discount Received </span>
                            <span>
                                {formatCurrency(
                                    data?.pricing?.totalDiscount,
                                    data?.currency || 'USD'
                                )}
                            </span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span>Total Taxes and Service Charge </span>
                            <span>
                                {formatCurrency(
                                    data?.pricing?.taxes +
                                        data?.pricing?.serviceCharges,
                                    data?.currency || 'USD'
                                )}{' '}
                            </span>
                        </div>
                    </div>
                    <Separator className='my-4' />

                    <div className='flex justify-between mt-4'>
                        <h3 className='text-lg font-semibold'>
                            Total Payable Now
                        </h3>
                        {data?.paymentOption === 'pay_now' ? (
                            <span className='font-semibold'>
                                {formatCurrency(
                                    (data?.totalPayable * 25) / 100,
                                    data?.currency || 'USD'
                                )}
                            </span>
                        ) : (
                            <span className=' font-semibold'>
                                {formatCurrency(
                                    data?.totalPayable,
                                    data?.currency || 'USD'
                                )}
                            </span>
                        )}
                    </div>
                    <div className='text-center mt-4'>
                        <div className='flex items-center justify-center gap-2 text-sm'>
                            <Clock className='w-4 h-4 text-red-500' />
                            <span className='font-semibold'>
                                Complete Payment in
                            </span>
                            <Badge variant='destructive'>03:36</Badge>
                        </div>
                        <div className='text-sm text-gray-600 mt-1'>
                            The package price will reflect once your trip
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentSummery;

