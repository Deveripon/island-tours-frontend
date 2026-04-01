'use client';
import { Card } from '@/components/ui/card';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
);

const AnalyticsChart = () => {
    const data = {
        labels: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ],
        datasets: [
            {
                label: 'Current Year',
                data: [
                    250, 370, 320, 330, 470, 490, 600, 590, 580, 500, 450, 700,
                ],
                borderColor: '#4B5563',
                backgroundColor: '#4B5563',
                fill: false,
                tension: 0.3,
            },
            {
                label: 'Past Year',
                data: [
                    200, 450, 520, 560, 570, 430, 630, 600, 660, 610, 400, 850,
                ],
                borderColor: '#D1D5DB',
                backgroundColor: '#D1D5DB',
                fill: false,
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: '#6B7280', // gray-500
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#9CA3AF', // gray-400
                },
                grid: {
                    color: '#E5E7EB', // gray-200
                },
            },
            x: {
                ticks: {
                    color: '#9CA3AF',
                },
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <Card className=' border shadow-md rounded-lg p-6'>
            <h2 className='text-sm font-semibold mb-4 text-gray-700'>
                Graph Showing Analytical Data
            </h2>
            <Line data={data} options={options} />
        </Card>
    );
};

export default AnalyticsChart;

