import { cn } from '@/lib/utils';
import { Plane } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function Logo({ className, link, preferences }) {
    return (
        <Link href={link ? link : '/'} className='flex items-center space-x-2'>
            {preferences?.logo ? (
                <Image
                    src={preferences?.logo}
                    width={300}
                    height={300}
                    alt={preferences?.business_name || 'TravelEase'}
                    className={cn(`h-12 w-12`, className)}
                />
            ) : (
                <>
                    <Plane className={cn(`h-6 w-6`, className)} />
                    <span className={cn(`text-lg font-bold`, className)}>
                        {preferences?.business_name || 'TravelEase'}
                    </span>
                </>
            )}
        </Link>
    );
}

export default Logo;

