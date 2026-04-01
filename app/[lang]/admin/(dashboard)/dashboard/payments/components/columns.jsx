'use client';
import { Badge } from '@/components/ui/badge';
import { getCurrencyIcon } from '@/utils/currency-info';
import { format } from 'date-fns';
import { CreditCard, Hash } from 'lucide-react';

export const columns = [
    {
        accessorKey: 'transactionId',
        header: 'Transaction ID',
        cell: ({ row }) => (
            <div className='flex items-center gap-1.5 max-w-[200px]'>
                <Hash className='h-3 w-3 text-muted-foreground flex-shrink-0' />
                <span className='font-mono text-xs text-muted-foreground truncate'>
                    {row.getValue('transactionId')}
                </span>
            </div>
        ),
    },
    {
        accessorKey: 'paid_for',
        header: 'Trip Details',
        cell: ({ row }) => {
            const booking = row.original.booking;
            const tripTitle = booking?.trip?.title;
            const bookingRef = booking?.bookingReference;

            return (
                <div className='max-w-[250px] space-y-1'>
                    <div className='font-medium text-sm truncate'>
                        {tripTitle || 'N/A'}
                    </div>
                    {bookingRef && (
                        <div className='text-xs text-muted-foreground truncate'>
                            Ref: {bookingRef}
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => {
            const amount = row.getValue('amount');
            const currency = row.original.currency;

            return (
                <div className='font-semibold text-sm'>
                    {getCurrencyIcon(currency)} {amount?.toLocaleString()}
                </div>
            );
        },
    },
    {
        accessorKey: 'paymentMethod',
        header: 'Payment Method',
        cell: ({ row }) => {
            const method = row.getValue('paymentMethod');
            
            return (
                <div className='flex items-center gap-1.5'>
                    <CreditCard className='h-3 w-3 text-muted-foreground' />
                    <span className='text-sm capitalize'>
                        {method?.toLowerCase().replace('_', ' ')}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status');

            const statusStyles = {
                COMPLETED: 'bg-emerald-50 border-emerald-200 text-emerald-700',
                PENDING: 'bg-orange-50 border-orange-200 text-orange-700',
                FAILED: 'bg-red-50 border-red-200 text-red-700',
                CANCELED: 'bg-gray-50 border-gray-200 text-gray-700',
            };

            return (
                <Badge
                    variant='secondary'
                    className={`capitalize ${
                        statusStyles[status] || 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}>
                    {status === 'COMPLETED' ? 'Succeeded' : status?.toLowerCase()}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Received Date',
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt);
            
            return (
                <div className='text-sm text-muted-foreground'>
                    {format(date, 'dd MMM yyyy')}
                </div>
            );
        },
    },
];