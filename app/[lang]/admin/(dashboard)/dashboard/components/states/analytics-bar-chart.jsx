'use client';
import { TrendingUp } from 'lucide-react';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const Card = ({ children, className = '' }) => (
    <div
        className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children, className = '' }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
        {children}
    </div>
);

const CardTitle = ({ children, className = '' }) => (
    <h3
        className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
        {children}
    </h3>
);

const CardDescription = ({ children, className = '' }) => (
    <p className={`text-sm text-gray-700 ${className}`}>{children}</p>
);

const CardContent = ({ children, className = '' }) => (
    <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = '' }) => (
    <div className={`flex p-6 pt-0 ${className}`}>{children}</div>
);

// Modified chart data for the bar chart format
const chartData = [
    { month: 'Jan', currentYear: 250, pastYear: 200 },
    { month: 'Feb', currentYear: 370, pastYear: 450 },
    { month: 'Mar', currentYear: 320, pastYear: 520 },
    { month: 'Apr', currentYear: 330, pastYear: 560 },
    { month: 'May', currentYear: 470, pastYear: 570 },
    { month: 'Jun', currentYear: 490, pastYear: 430 },
    { month: 'Jul', currentYear: 600, pastYear: 630 },
    { month: 'Aug', currentYear: 590, pastYear: 600 },
    { month: 'Sep', currentYear: 580, pastYear: 660 },
    { month: 'Oct', currentYear: 500, pastYear: 610 },
    { month: 'Nov', currentYear: 450, pastYear: 400 },
    { month: 'Dec', currentYear: 700, pastYear: 850 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className='bg-background p-4 rounded shadow border'>
                <p className='font-bold mb-2'>{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className='flex items-center gap-2'>
                        <div
                            className='w-3 h-3 rounded-full'
                            style={{ backgroundColor: entry.color }}
                        />
                        <p className='text-sm'>
                            {entry.name}: {entry.value}
                        </p>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const AnalyticalBarChart = () => {
    const [visibleMonths, setVisibleMonths] = useState(12); // Default to showing 6 months

    const displayData = chartData.slice(0, visibleMonths);

    return (
        <Card className='w-full  mx-auto'>
            <CardHeader>
                <CardTitle>Bar Chart - Monthly Comparison</CardTitle>
                <CardDescription>Current Year vs Past Year</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='mb-4 flex gap-4'>
                    <button
                        onClick={() => setVisibleMonths(6)}
                        className={`px-3 py-1 rounded text-sm ${
                            visibleMonths === 6
                                ? 'bg-gray-800 text-white'
                                : 'bg-gray-200'
                        }`}>
                        6 Months
                    </button>
                    <button
                        onClick={() => setVisibleMonths(12)}
                        className={`px-3 py-1 rounded text-sm ${
                            visibleMonths === 12
                                ? 'bg-gray-800 text-white'
                                : 'bg-gray-200'
                        }`}>
                        12 Months
                    </button>
                </div>

                <div className='h-80 w-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart
                            data={displayData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}>
                            <CartesianGrid
                                strokeDasharray='3 3'
                                vertical={false}
                            />
                            <XAxis
                                dataKey='month'
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar
                                dataKey='currentYear'
                                name='Current Year'
                                fill='var(--color-blue-400)'
                                radius={4}
                            />
                            <Bar
                                dataKey='pastYear'
                                name='Past Year'
                                fill='var(--color-primary/20)'
                                radius={4}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
            <CardFooter className='flex-col items-start gap-2 text-sm'>
                <div className='flex gap-2 font-medium leading-none'>
                    Trending up by 5.2% this month{' '}
                    <TrendingUp className='h-4 w-4' />
                </div>
                <div className='leading-none text-gray-500'>
                    Showing monthly comparison for{' '}
                    {visibleMonths === 6
                        ? 'the first half of the year'
                        : 'the full year'}
                </div>
            </CardFooter>
        </Card>
    );
};

export default AnalyticalBarChart;

