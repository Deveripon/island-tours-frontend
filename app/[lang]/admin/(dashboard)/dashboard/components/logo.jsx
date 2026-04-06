import { cn } from '@/lib/utils';
import { Plane } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function Logo({ className, link, preferences }) {
    return (
        <Link
            href={link ? link : '/admin/dashboard'}
            className='flex items-center space-x-2'>
            {preferences?.logo ? (
                <Image
                    src={preferences?.logo?.url}
                    width={300}
                    height={300}
                    alt={preferences?.siteName || 'Island Tours'}
                    className={cn(`h-12 w-12`, className)}
                />
            ) : (
                <>
                    <Plane className={cn(`h-6 w-6`, className)} />
                    <span className={cn(`text-lg font-bold`, className)}>
                        {preferences?.siteName || 'Island Tours'}
                    </span>
                </>
            )}
        </Link>
    );
}

export default Logo;


