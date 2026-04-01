'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCurrencyIcon } from '@/utils/currency-info';
import { format } from 'date-fns';
import { Download } from 'lucide-react';

import Image from 'next/image';

export const columns = [
    {
        accessorKey: 'tripName',
        header: 'Trip',
        cell: ({ row }) => {
            const trip = row.original['trip'];

            return (
                <>
                    <div className='flex pl-4 items-center gap-2'>
                        <Image
                            height={300}
                            width={300}
                            src={trip.galleryImages[0]?.url}
                            alt={trip.title}
                            className='w-18 h-18 rounded-lg object-cover'
                        />
                        <div className='font-medium max-w-28 text-gray-700'>
                            {trip.title}
                        </div>
                    </div>
                </>
            );
        },
    },
    {
        accessorKey: 'destination',
        header: 'Destination',
        cell: ({ row }) => {
            const trip = row.original['trip'];

            return (
                <>
                    <div className='flex items-center w-12'>
                        <div className='font-medium text-gray-700'>
                            {trip.destination?.name}
                        </div>
                    </div>
                </>
            );
        },
    },
    {
        accessorKey: 'tripStartDate',
        header: 'From',
        cell: ({ row }) => {
            return (
                <div className='font-medium w-20 text-gray-700'>
                    {format(row.getValue('tripStartDate'), 'dd MMM yyyy')}
                </div>
            );
        },
    },
    {
        accessorKey: 'totalDays',
        header: 'Duration',
        cell: ({ row }) => {
            return (
                <div className='font-medium text-gray-700'>
                    {row.getValue('totalDays')}{' '}
                    {row.getValue('totalDays') > 1 ? 'days' : 'day'}
                </div>
            );
        },
    },
    {
        accessorKey: 'bookingReference',
        header: 'Reference',
        cell: ({ row }) => (
            <div className='font-medium'>
                {row.getValue('bookingReference')}
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
                        className={`capitalize ${
                            status === 'CONFIRMED'
                                ? 'bg-green-100 border-green-200 text-green-600 shadow shadow-green-100'
                                : status === 'COMPLETED'
                                ? 'bg-orange-100 border-orange-100 text-orange-500 shadow shadow-orange-100'
                                : 'bg-gray-100 border-gray-200 text-gray-600 shadow shadow-gray-100'
                        }`}>
                        {status.toLowerCase()}
                    </Badge>
                    {status === 'CONFIRMED' && (
                        <Badge className='capitalize bg-gray-100 border-gray-200 text-gray-600 shadow shadow-gray-100'>
                            Pending
                        </Badge>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'totalPayable',
        header: 'Cost',
        cell: ({ row }) => {
            return (
                <div className='font-medium w-12 text-gray-700'>
                    {getCurrencyIcon(row.original['currency'])}{' '}
                    {row.getValue('totalPayable')}
                </div>
            );
        },
    },
    {
        accessorKey: 'paidAmount',
        header: 'Paid',
        cell: ({ row }) => {
            return (
                <div className='font-medium w-12 text-gray-700'>
                    {getCurrencyIcon(row.original['currency'])}{' '}
                    {row.getValue('paidAmount')}
                </div>
            );
        },
    },
    {
        accessorKey: 'pendingAmount',
        header: 'Pending',
        cell: ({ row }) => {
            return (
                <div className='font-medium w-12 text-gray-700'>
                    {row.getValue('pendingAmount') > 0 &&
                        getCurrencyIcon(row.original['currency'])}{' '}
                    {row.getValue('pendingAmount') > 0 &&
                        row.getValue('pendingAmount')}
                </div>
            );
        },
    },
    {
        accessorKey: 'dueDate',
        header: 'Pay before',
        cell: ({ row }) => {
            const pendingAmount = row.original['pendingAmount'];
            const paymentSchedule = row.original['paymentSchedule'];
            const paymentOption = row.original['paymentOption'];
            const secondInstallment =
                paymentSchedule &&
                paymentSchedule?.length > 0 &&
                paymentSchedule[1];
            if (
                pendingAmount > 0 &&
                paymentOption === 'pay_now' &&
                secondInstallment?.status === 'scheduled'
            ) {
                return (
                    <div className='font-medium w-24 text-gray-700'>
                        {secondInstallment.dueDate &&
                            format(secondInstallment.dueDate, 'dd MMM yyyy')}
                    </div>
                );
            }
        },
    },
    {
        accessorKey: 'pay-now',
        header: 'Pay now',
        cell: ({ row }) => {
            const pendingAmount = row.getValue('pendingAmount');
            if (pendingAmount > 0) {
                return (
                    <Button
                        onClick={() => {
                            // Pay now
                            document.dispatchEvent(
                                new CustomEvent('pay-now', {
                                    detail: row.original })
                            );
                        }}
                        size='sm'
                        className='font-medium bg-primary/10 rounded-full border border-primary/20 text-primary hover:bg-primary/30 '>
                        Pay Now {getCurrencyIcon(row.original['currency'])}{' '}
                        {row.getValue('pendingAmount')}
                    </Button>
                );
            } else {
                return (
                    <Button
                        size='sm'
                        className='font-medium rounded-full pointer-events-none bg-emerald-100 border border-emerald-200 text-emerald-600'>
                        Full Paid
                    </Button>
                );
            }
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const Bookings = row.original;

            return (
                <Button
                    onClick={() => {
                        // Delete Bookings
                        document.dispatchEvent(
                            new CustomEvent('download-invoice', {
                                detail: Bookings.id })
                        );
                    }}
                    size='sm'
                    variant='outline'
                    className='font-medium rounded-md'>
                    <Download className='h-4 w-4' />
                    Download Invoice
                </Button>
            );
        },
    },
];

