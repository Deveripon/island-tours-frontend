'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, BarChart3, List } from 'lucide-react';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
} from 'recharts';

const CancelledBooking = () => {
    const [view, setView] = useState('list');

    const bookings = [
        {
            id: 1,
            bookingName: 'Booking 1',
            number: '4.5M',
            value: 4.5,
            cancelDate: '10 May 2025',
        },
        {
            id: 2,
            bookingName: 'Booking 2',
            number: '2M',
            value: 2,
            cancelDate: '8 May 2025',
        },
        {
            id: 3,
            bookingName: 'Booking 3',
            number: '6.5M',
            value: 6.5,
            cancelDate: '5 May 2025',
        },
        {
            id: 4,
            bookingName: 'Booking 4',
            number: '3M',
            value: 3,
            cancelDate: '2 May 2025',
        },
        {
            id: 5,
            bookingName: 'Booking 5',
            number: '4M',
            value: 4,
            cancelDate: '28 Apr 2025',
        },
        {
            id: 6,
            bookingName: 'Booking 6',
            number: '5M',
            value: 5,
            cancelDate: '25 Apr 2025',
        },
    ];

    const barColors = [
        '#f87171',
        '#fb923c',
        '#fbbf24',
        '#a3e635',
        '#22d3ee',
        '#a78bfa',
    ];

    return (
        <Card className='w-full'>
            <CardHeader className='border-b py-3'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                        <AlertTriangle
                            size={16}
                            className='text-red-500 mr-2'
                        />
                        <CardTitle className='text-sm font-bold'>
                            Cancelled Bookings
                        </CardTitle>
                    </div>
                    <div className='flex gap-2'>
                        <Button
                            variant={view === 'list' ? 'default' : 'outline'}
                            size='sm'
                            onClick={() => setView('list')}>
                            <List size={16} className='mr-1' />
                            List
                        </Button>
                        <Button
                            variant={view === 'chart' ? 'default' : 'outline'}
                            size='sm'
                            onClick={() => setView('chart')}>
                            <BarChart3 size={16} className='mr-1' />
                            Chart
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className='p-4'>
                {view === 'list' ? (
                    <ul className='space-y-2'>
                        {bookings.map(item => (
                            <li
                                key={item.id}
                                className='border border-red-100 rounded-md overflow-hidden transition-all duration-200'>
                                <div className='flex justify-between items-center p-3 bg-background hover:bg-slate-50'>
                                    <div className='flex items-center space-x-3'>
                                        <span className='font-normal'>
                                            {item.bookingName}
                                        </span>
                                        <Badge
                                            variant='outline'
                                            className='bg-red-50 text-red-700 border-red-200'>
                                            Cancelled
                                        </Badge>
                                    </div>
                                    <div className='flex items-center gap-4'>
                                        <span className='text-sm text-slate-500'>
                                            {item.cancelDate}
                                        </span>
                                        <span className='text-sm font-normal'>
                                            {item.number}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className='w-full h-64'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart data={bookings}>
                                <XAxis dataKey='bookingName' />
                                <Tooltip
                                    formatter={value => [`${value}M`, 'Value']}
                                    labelFormatter={label => `${label}`}
                                />
                                <Bar dataKey='value'>
                                    {bookings.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                barColors[
                                                    index % barColors.length
                                                ]
                                            }
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CancelledBooking;

