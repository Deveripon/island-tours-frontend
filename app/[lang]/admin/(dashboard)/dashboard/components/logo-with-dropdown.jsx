'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Logo component with hover dropdown
export const LogoWithDropdown = ({ preferences, tenant }) => {
    return (
        <div className='relative'>
            {/* Logo */}
            <Link
                href={`/${tenant}/dashboard`}
                className='flex items-center space-x-2'>
                <span className={cn(`text-md font-bold`)}>
                    {tenant === 'i-am-admin'
                        ? 'TripWheel'
                        : preferences?.business_name || 'TravelEase'}
                </span>
            </Link>
        </div>
    );
};
