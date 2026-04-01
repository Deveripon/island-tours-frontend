'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { Download02Icon } from '@hugeicons/core-free-icons';

export const columns = [
    {
        accessorKey: 'transactionId',
        header: 'Transaction ID',
        cell: ({ row }) => (
            <div className='font-medium text-xs'>
                {row.getValue('transactionId')}
            </div>
        ),
    },
    {
        accessorKey: 'paymentMethod',
        header: 'Payment Method',
        cell: ({ row }) => (
            <div className='font-medium text-xs'>
                {row.getValue('paymentMethod')}
            </div>
        ),
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => (
            <div className='font-medium text-xs'>{row.getValue('amount')}</div>
        ),
    },

    {
        accessorKey: 'currency',
        header: 'Currency',
        cell: ({ row }) => (
            <div className='font-medium text-xs'>
                {row.getValue('currency')}
            </div>
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
                        className={`capitalize text-xs ${
                            status === 'COMPLETED'
                                ? 'bg-success/10 border-success/20 text-success shadow-sm'
                                : status === 'PENDING'
                                ? 'bg-warning/10 border-warning/20 text-warning shadow-sm'
                                : status === 'FAILED'
                                ? 'bg-destructive/10 border-destructive/20 text-destructive shadow-sm'
                                : 'bg-muted border-border text-muted-foreground shadow-sm'
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
                <div className='font-medium text-xs text-foreground'>
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
                <div className='font-medium text-xs text-foreground'>
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
                <div className='font-medium text-xs text-foreground'>
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
                    className='font-medium text-xs rounded-md'>
                    <HugeiconsIcon icon={Download02Icon} className='h-4 w-4' />
                    Download Receipt
                </Button>
            );
        },
    },
];

