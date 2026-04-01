import { cn } from '@/lib/utils';
import { PlaneIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import Link from 'next/link';

export function Logo({ className, link, preferences, logo }) {
    return (
        <Link href={link ? link : '/'} className='flex  items-center space-x-2'>
            {logo?.url || preferences?.logo ? (
                <div className='relative h-10 w-auto max-w-[180px] flex items-center'>
                    <Image
                        src={logo?.url || preferences?.logo}
                        width={300}
                        height={300}
                        alt={preferences?.business_name || 'TravelEase'}
                        className={cn(
                            `h-full w-auto object-contain`,
                            className
                        )}
                        priority
                    />
                </div>
            ) : (
                <>
                    <HugeiconsIcon
                        icon={PlaneIcon}
                        className={cn(`h-6 w-6 text-primary`, className)}
                    />
                    <span
                        className={cn(
                            `text-lg font-bold text-primary`,
                            className
                        )}>
                        {preferences?.business_name || 'TravelEase'}
                    </span>
                </>
            )}
        </Link>
    );
}

