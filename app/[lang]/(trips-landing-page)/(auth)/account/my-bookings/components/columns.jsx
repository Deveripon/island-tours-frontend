'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCurrencyIcon } from '@/utils/currency-info';
import { format } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { Download02Icon } from '@hugeicons/core-free-icons';

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
                            src={
                                trip.galleryImages[0]?.image?.url ||
                                '/placeholder.svg'
                            }
                            alt={trip.title}
                            className='w-18 h-18 rounded-lg object-cover'
                        />
                        <div className='font-medium text-xs text-foreground'>
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
                    <div className='flex items-center'>
                        <div className='font-medium max-w-[100px] text-xs text-foreground'>
                            {trip.destination?.name}
                        </div>
                    </div>
                </>
            );
        },
    },
    {
        accessorKey: 'tripDate',
        header: 'From',
        cell: ({ row }) => {
            return (
                <div className='font-medium text-xs text-foreground'>
                    {format(row.getValue('tripDate'), 'dd MMM yyyy')}
                </div>
            );
        },
    },
    {
        accessorKey: 'bookingReference',
        header: 'Reference',
        cell: ({ row }) => (
            <div className='font-medium text-xs'>
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
                        className={`capitalize text-xs ${
                            status === 'CONFIRMED'
                                ? 'bg-success/10 border-success/20 text-success shadow-sm'
                                : status === 'COMPLETED'
                                ? 'bg-warning/10 border-warning/20 text-warning shadow-sm'
                                : 'bg-muted border-border text-muted-foreground shadow-sm'
                        }`}>
                        {status.toLowerCase()}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: 'totalPayable',
        header: 'Cost',
        cell: ({ row }) => {
            const pricing = row.original['pricing'];
            return (
                <div className='font-medium text-xs text-foreground'>
                    {getCurrencyIcon(row.original['currency'])} {pricing?.total}
                </div>
            );
        },
    },
    {
        accessorKey: 'paidAmount',
        header: 'Paid',
        cell: ({ row }) => {
            const pricing = row.original['pricing'];
            return (
                <div className='font-medium text-xs text-foreground'>
                    {getCurrencyIcon(row.original['currency'])}{' '}
                    {pricing?.deposit}
                </div>
            );
        },
    },
    {
        accessorKey: 'pendingAmount',
        header: 'Pending',
        cell: ({ row }) => {
            const pricing = row.original['pricing'];
            return (
                <div className='font-medium text-xs text-foreground'>
                    {getCurrencyIcon(row.original['currency'])}{' '}
                    {pricing?.total - pricing?.deposit}
                </div>
            );
        },
    },
    /*     {
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
    }, */
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
                    className='font-medium text-xs rounded-md'>
                    <HugeiconsIcon icon={Download02Icon} className='h-4 w-4' />
                    Download Invoice
                </Button>
            );
        },
    },
];

