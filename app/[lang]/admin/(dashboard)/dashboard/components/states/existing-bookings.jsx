'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, ChevronDown, ChevronUp, List } from 'lucide-react';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
} from 'recharts';

const ExistingBooking = () => {
    const [view, setView] = useState('list');
    const [expandedItem, setExpandedItem] = useState(null);

    const bookings = [
        {
            id: 1,
            bookingName: 'Booking 1',
            number: '4.5M',
            value: 4.5,
            status: 'active',
        },
        {
            id: 2,
            bookingName: 'Booking 2',
            number: '2M',
            value: 2,
            status: 'pending',
        },
        {
            id: 3,
            bookingName: 'Booking 3',
            number: '6.5M',
            value: 6.5,
            status: 'active',
        },
        {
            id: 4,
            bookingName: 'Booking 4',
            number: '3M',
            value: 3,
            status: 'active',
        },
        {
            id: 5,
            bookingName: 'Booking 5',
            number: '4M',
            value: 4,
            status: 'pending',
        },
        {
            id: 6,
            bookingName: 'Booking 6',
            number: '5M',
            value: 5,
            status: 'completed',
        },
    ];

    const getStatusColor = status => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-primary/20 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const toggleItem = id => {
        setExpandedItem(expandedItem === id ? null : id);
    };

    const barColors = [
        '#8884d8',
        '#83a6ed',
        '#8dd1e1',
        '#82ca9d',
        '#a4de6c',
        '#d0ed57',
    ];

    return (
        <Card className='w-full'>
            <CardHeader className='border-b py-3'>
                <div className='flex items-center justify-between'>
                    <CardTitle className='text-sm font-bold'>
                        Existing Bookings
                    </CardTitle>
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
                                className='border rounded-md overflow-hidden transition-all duration-200'>
                                <div
                                    onClick={() => toggleItem(item.id)}
                                    className={`flex justify-between items-center p-3 cursor-pointer
                                        ${
                                            expandedItem === item.id
                                                ? 'bg-slate-50'
                                                : 'bg-background hover:bg-slate-50'
                                        }`}>
                                    <div className='flex items-center'>
                                        {expandedItem === item.id ? (
                                            <ChevronUp
                                                size={16}
                                                className='mr-2 text-slate-400'
                                            />
                                        ) : (
                                            <ChevronDown
                                                size={16}
                                                className='mr-2 text-slate-400'
                                            />
                                        )}
                                        <span className='font-normal'>
                                            {item.bookingName}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                        <Badge
                                            variant='outline'
                                            className={getStatusColor(
                                                item.status
                                            )}>
                                            {item.status}
                                        </Badge>
                                        <span className='text-sm font-normal'>
                                            {item.number}
                                        </span>
                                    </div>
                                </div>

                                {expandedItem === item.id && (
                                    <div className='bg-slate-50 p-3 border-t'>
                                        <div className='grid grid-cols-2 gap-3 text-sm'>
                                            <div>
                                                <p className='text-slate-500'>
                                                    Booking ID
                                                </p>
                                                <p>
                                                    BK-{item.id}00{item.id}
                                                </p>
                                            </div>
                                            <div>
                                                <p className='text-slate-500'>
                                                    Total Value
                                                </p>
                                                <p>{item.number}</p>
                                            </div>
                                        </div>
                                        <div className='mt-3 flex justify-end'>
                                            <Button size='sm' variant='outline'>
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                )}
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

export default ExistingBooking;

