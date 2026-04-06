'use client';

import { useAdmin } from '@/app/[lang]/(trips-landing-page)/hooks/useAdmin';
import Link from 'next/link';

const BreadCrumbs = ({ last }) => {
    const { mode, MODES } = useAdmin();
    const editMode = mode === MODES.edit;
    if (editMode) {
        return null;
    }
    return (
        <nav className='text-sm md:pt-42 pt-24  text-muted-foreground'>
            <Link href='/' className='hover:text-foreground transition-colors'>
                Home
            </Link>
            <span className='mx-2'>/</span>
            <Link
                href='/trips'
                className='hover:text-foreground transition-colors'>
                Trips
            </Link>
            <span className='mx-2'>/</span>
            <span className='text-foreground font-medium'>{last}</span>
        </nav>
    );
};

export default BreadCrumbs;

