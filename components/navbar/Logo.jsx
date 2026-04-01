import { cn } from '@/lib/utils';
import { Plane } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function Logo({ className, link, logoImage }) {
    return (
        <Link href={link ? link : '/'} className='flex items-center space-x-2'>
            {logoImage ? (
                <Image
                    src={logoImage}
                    width={800}
                    height={800}
                    alt='TripWheel'
                    className={cn(` w-36`, className)}
                />
            ) : (
                <>
                    <Plane
                        className={cn(`h-6 w-6 text-sass-primary`, className)}
                    />
                    <span className={cn(`text-lg font-bold `, className)}>
                        TripWheel
                    </span>
                </>
            )}
        </Link>
    );
}

export default Logo;

