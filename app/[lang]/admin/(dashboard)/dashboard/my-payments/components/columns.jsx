'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Download } from 'lucide-react';

export const columns = [
    {
        accessorKey: 'transactionId',
        header: 'Transaction ID',
        cell: ({ row }) => (
            <div className='font-medium'>{row.getValue('transactionId')}</div>
        ),
    },
    {
        accessorKey: 'paymentMethod',
        header: 'Payment Method',
        cell: ({ row }) => (
            <div className='font-medium'>{row.getValue('paymentMethod')}</div>
        ),
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => (
            <div className='font-medium'>{row.getValue('amount')}</div>
        ),
    },

    {
        accessorKey: 'currency',
        header: 'Currency',
        cell: ({ row }) => (
            <div className='font-medium'>{row.getValue('currency')}</div>
        ),
    },

    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status');

            return (
                <div className='flex items-center gap-2'>
                    <Badge
                        className={`capitalize ${
                            status === 'COMPLETED'
                                ? 'bg-green-100 border-green-200 text-green-600 shadow shadow-green-100'
                                : status === 'PENDING'
                                ? 'bg-orange-100 border-orange-100 text-orange-500 shadow shadow-orange-100'
                                : 'bg-gray-100 border-gray-200 text-gray-600 shadow shadow-gray-100'
                        }`}>
                        {status.toLowerCase()}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: 'paid_for',
        header: 'Paid for',
        cell: ({ row }) => {
            const bookings = row.original['booking'];
            return (
                <div className='font-medium text-gray-700'>
                    {bookings?.trip?.title}
                </div>
            );
        },
    },
    {
        accessorKey: 'bookingReference',
        header: 'Booking Reference',
        cell: ({ row }) => {
            const bookings = row.original['booking'];
            return (
                <div className='font-medium text-gray-700'>
                    {bookings?.bookingReference}
                </div>
            );
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Payment Date',
        cell: ({ row }) => {
            return (
                <div className='font-medium text-gray-700'>
                    {format(new Date(row.original.createdAt), 'dd MMM yyyy')}
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const payment = row.original;

            return (
                <Button
                    onClick={() => {
                        document.dispatchEvent(
                            new CustomEvent('download-payment-slip', {
                                detail: payment.id })
                        );
                    }}
                    size='sm'
                    variant='outline'
                    className='font-medium rounded-md'>
                    <Download className='h-4 w-4' />
                    Download Receipt
                </Button>
            );
        },
    },
];

