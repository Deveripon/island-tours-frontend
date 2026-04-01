'use client';

import { useSearchParams } from 'next/navigation';

const PageTitleDescription = ({ title, description }) => {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    return (
        <div className='flex items-center justify-between'>
            <div className='space-y-1'>
                <h1 className='text-2xl font-semibold tracking-tight'>
                    {mode === 'update'
                        ? 'Update trip package'
                        : title || 'Create New Trip Package'}
                </h1>
                <p className='text-sm text-muted-foreground'>
                    {mode === 'update'
                        ? 'Update your trip package to get more Impression and Convertion'
                        : 'Fill out the form below to create a comprehensive trip package.'}
                </p>
            </div>
        </div>
    );
};

export default PageTitleDescription;

