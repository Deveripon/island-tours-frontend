'use client';
import { Package, Users, Video } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

const menuItems = [
    {
        icon: <Package className='h-5 w-5 transform rotate-180 mb-8' />,
        label: 'Documentation',
        href: '/documentation',
    },
    {
        icon: <Video className='h-5 w-5 transform rotate-90 mb-3' />,
        label: 'Tutorials',
        href: '#',
    },
    {
        icon: <Users className='h-5 w-5 transform rotate-180 mb-5' />,
        label: 'Community',
        href: '#',
    },
];

export default function VerticalMenu() {
    const { theme } = useTheme();

    return (
        <div className='min-h-screen bg-background flex'>
            <nav className='w-12 bg-background border-r border-border shadow-sm flex flex-col items-center py-6'>
                <ul className='flex flex-col items-center justify-center h-full gap-y-6 w-full'>
                    {menuItems.map((item, index) => (
                        <li
                            key={item.label}
                            className='w-10 flex hover:bg-primary group hover:border-primary border border-transparent duration-300 transition-colors rounded-full min-h-[160px] flex-col'>
                            <Link
                                href={item.href}
                                className='flex flex-col items-center justify-center p-2 text-gray-700 group-hover:text-white transition-colors duration-200 rounded-lg'
                                title={item.label}>
                                <div className='flex flex-col items-center space-y-2'>
                                    <div className='icon'>
                                        <span className='transition-colors duration-200 group-hover:text-white'>
                                            {item.icon}
                                        </span>
                                    </div>
                                    <span className='text-sm font-normal treking-tight transform rotate-90 whitespace-nowrap group-hover:text-white'>
                                        {item.label}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

