import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export const Logo = ({ link = '/', className, logo }) => {
    const logoUrl = logo?.image?.url || logo?.url || '/tripwheel-logo.png';

    return (
        <Link
            href={link}
            className={cn('flex items-center gap-2 group', className)}>
            <div className='relative overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                <Image
                    src={logoUrl}
                    alt={'Island Tours'}
                    width={140}
                    height={140}
                    className='object-contain p-1'
                />
            </div>
            <div className='flex flex-col'>
                <span className='text-lg font-black tracking-tighter leading-none text-foreground group-hover:text-primary transition-colors'>
                    {'Island Tours'}
                </span>
                <span className='text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60'>
                    Island Tours
                </span>
            </div>
        </Link>
    );
};

