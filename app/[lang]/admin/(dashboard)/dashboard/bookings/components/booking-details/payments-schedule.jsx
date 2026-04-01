import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formateToCapitalize } from '@/lib/utils';
import { formatCurrency } from '@/utils/currency-info';
import { format } from 'date-fns';
import { CreditCard } from 'lucide-react';

const PaymentSchedule = ({ bookingData }) => {
    return (
        <Card className='shadow-sm border-slate-200/60'>
            <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-3 text-sm font-medium text-slate-900'>
                    <CreditCard className='w-5 h-5 text-slate-600' />
                    Payment Schedule
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                {bookingData.paymentSchedule.map((payment, index) => (
                    <div
                        key={payment.id}
                        className='p-4 border border-slate-200/60 rounded-lg bg-slate-50/30'>
                        <div className='flex justify-between items-start mb-3'>
                            <div>
                                <p className='text-sm font-medium text-slate-900'>
                                    {payment.description}
                                </p>
                                <p className='text-sm text-slate-600 mt-1 font-medium'>
                                    Due:{' '}
                                    {payment.dueDate === 'immediate'
                                        ? 'Immediate'
                                        : format(
                                              payment.dueDate,
                                              'dd MMM yyyy'
                                          )}
                                </p>
                            </div>
                            <Badge
                                className={`text-sm font-medium ${
                                    payment.status === 'COMPLETED'
                                        ? 'bg-green-100 text-green-800 border-green-200'
                                        : 'bg-red-100 text-red-800 border-red-200'
                                }`}>
                                {formateToCapitalize(payment.status)}
                            </Badge>
                        </div>
                        <p className='text-base font-semibold text-slate-900'>
                            {formatCurrency(
                                payment.amount,
                                bookingData.currency
                            )}
                        </p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default PaymentSchedule;

