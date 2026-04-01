'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCurrencyIcon } from '@/utils/currency-info';
import { Download, Eye } from 'lucide-react';
import Image from 'next/image';

export const columns = [
    {
        accessorKey: 'trip',
        header: 'Trip Details',
        cell: ({ row }) => {
            const trip = row.getValue('trip');
            const url = trip?.mainImage?.image?.url;
            const destination = trip?.destination?.name;

            return (
                <div className='flex items-center gap-3 max-w-[300px]'>
                    <Image
                        height={300}
                        width={300}
                        src={url || '/placeholder.svg'}
                        alt={trip?.title || 'trip image'}
                        className='w-16 h-16 rounded-lg object-cover flex-shrink-0'
                    />
                    <div className='space-y-1 min-w-0'>
                        <div className='font-medium text-sm truncate'>
                            {trip?.title}
                        </div>
                        {destination && (
                            <div className='text-xs text-muted-foreground truncate'>
                                {destination}
                            </div>
                        )}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'bookingReference',
        header: 'Reference',
        cell: ({ row }) => (
            <div className='font-mono text-sm'>
                {row.getValue('bookingReference')}
            </div>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status');

            const statusStyles = {
                CONFIRMED: 'bg-success/10 text-success border-success/20',
                COMPLETED: 'bg-success/10 text-success border-success/20',
                PENDING: 'bg-yellow-50 border-yellow-200 text-yellow-700',
                CANCELLED: 'bg-red-50 border-red-200 text-red-700',
            };

            return (
                <Badge
                    variant='secondary'
                    className={`capitalize ${
                        statusStyles[status] ||
                        'bg-gray-50 border-gray-200 text-gray-700'
                    }`}>
                    {status === 'CONFIRMED'
                        ? 'Confirmed'
                        : status?.toLowerCase()}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'payments',
        header: 'Amount Received',
        cell: ({ row }) => {
            const payments = row.getValue('payments');
            const amount = payments?.[0]?.amount || 0;
            const currency = row.original.currency;

            return (
                <div className='font-medium text-sm'>
                    {getCurrencyIcon(currency)} {amount.toLocaleString()}
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const booking = row.original;

            return (
                <div className='flex items-center gap-2'>
                    <Button
                        onClick={() => {
                            document.dispatchEvent(
                                new CustomEvent('download-invoice', {
                                    detail: booking.id })
                            );
                        }}
                        size='sm'
                        variant='outline'>
                        <Download className='h-4 w-4 mr-1.5' />
                        Invoice
                    </Button>
                    <Button
                        onClick={() => {
                            document.dispatchEvent(
                                new CustomEvent('view-details', {
                                    detail: booking })
                            );
                        }}
                        size='sm'
                        variant='outline'>
                        <Eye className='h-4 w-4 mr-1.5' />
                        Details
                    </Button>
                </div>
            );
        },
    },
];

