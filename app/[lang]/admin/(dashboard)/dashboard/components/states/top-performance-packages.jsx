'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    BarChart3,
    ChevronDown,
    ChevronUp,
    List,
    MoreHorizontal,
    Package,
} from 'lucide-react';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
} from 'recharts';

const TopPerformingPackage = () => {
    const [view, setView] = useState('table');
    const [sortField, setSortField] = useState('sales');
    const [sortDirection, setSortDirection] = useState('desc');

    const packages = [
        {
            id: 1,
            name: 'Phuket 7 days 6 Nights',
            sales: 30,
            revenue: '$70,030',
            numericRevenue: 70030,
        },
        {
            id: 2,
            name: 'India 5 days 4 Nights',
            sales: 40,
            revenue: '$5,000',
            numericRevenue: 5000,
        },
        {
            id: 3,
            name: 'Bali 3 days 4 Nights',
            sales: 20,
            revenue: '$70,030',
            numericRevenue: 70030,
        },
        {
            id: 4,
            name: 'Kenya 7 days 8 Nights',
            sales: 50,
            revenue: '$70,030',
            numericRevenue: 70030,
        },
    ];

    const handleSort = field => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedPackages = [...packages].sort((a, b) => {
        const modifier = sortDirection === 'asc' ? 1 : -1;

        if (sortField === 'name') {
            return a.name.localeCompare(b.name) * modifier;
        } else if (sortField === 'sales') {
            return (a.sales - b.sales) * modifier;
        } else {
            return (a.numericRevenue - b.numericRevenue) * modifier;
        }
    });

    const barColors = ['#3b82f6', '#6366f1', '#8b5cf6', '#d946ef'];

    const renderSortIcon = field => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? (
            <ChevronUp className='h-4 w-4 ml-1' />
        ) : (
            <ChevronDown className='h-4 w-4 ml-1' />
        );
    };

    return (
        <Card className='w-full'>
            <CardHeader className='border-b py-3'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                        <Package size={16} className='text-primary/90 mr-2' />
                        <CardTitle className='text-sm font-bold'>
                            Top Performing Packages
                        </CardTitle>
                    </div>
                    <div className='flex gap-2'>
                        <Button
                            variant={view === 'table' ? 'default' : 'outline'}
                            size='sm'
                            onClick={() => setView('table')}>
                            <List size={16} className='mr-1' />
                            Table
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
                {view === 'table' ? (
                    <div className='relative overflow-x-auto'>
                        <table className='w-full text-sm text-left'>
                            <thead className='text-sm uppercase bg-slate-50 border-b'>
                                <tr>
                                    <th
                                        scope='col'
                                        className='px-4 py-3 cursor-pointer w-1/2'
                                        onClick={() => handleSort('name')}>
                                        <div className='flex items-center'>
                                            <span>Package</span>
                                            {renderSortIcon('name')}
                                        </div>
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-4 py-3 cursor-pointer'
                                        onClick={() => handleSort('sales')}>
                                        <div className='flex items-center'>
                                            <span>Sales</span>
                                            {renderSortIcon('sales')}
                                        </div>
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-4 py-3 cursor-pointer'
                                        onClick={() => handleSort('revenue')}>
                                        <div className='flex items-center'>
                                            <span>Revenue</span>
                                            {renderSortIcon('revenue')}
                                        </div>
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-4 py-3 text-right'>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedPackages.map(item => (
                                    <tr
                                        key={item.id}
                                        className='bg-background border-b hover:bg-slate-50'>
                                        <td className='px-4 py-3 font-normal'>
                                            {item.name}
                                        </td>
                                        <td className='px-4 py-3'>
                                            {item.sales}
                                        </td>
                                        <td className='px-4 py-3'>
                                            {item.revenue}
                                        </td>
                                        <td className='px-4 py-3 text-right'>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                        className='h-8 w-8 p-0'>
                                                        <MoreHorizontal className='h-4 w-4' />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align='end'>
                                                    <DropdownMenuItem>
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        Edit Package
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        Generate Report
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className='w-full h-64'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart data={sortedPackages}>
                                <XAxis dataKey='name' tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(value, name) => {
                                        return name === 'sales'
                                            ? [value, 'Sales']
                                            : [`$${value}`, 'Revenue'];
                                    }}
                                />
                                <Bar
                                    dataKey='sales'
                                    name='Sales'
                                    fill='#3b82f6'>
                                    {sortedPackages.map((entry, index) => (
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

export default TopPerformingPackage;

