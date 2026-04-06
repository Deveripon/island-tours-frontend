'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Logo component with hover dropdown
export const LogoWithDropdown = ({ preferences }) => {
    return (
        <div className='relative'>
            {/* Logo */}
            <Link
                href="/admin/dashboard"
                className='flex items-center space-x-2'>
                <span className={cn(`text-md font-bold`)}>
                    {preferences?.business_name || 'TripWheel'}
                </span>
            </Link>
        </div>
    );
};
