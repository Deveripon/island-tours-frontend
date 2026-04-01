'use client';

import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const BlogSearch = () => {
    const params = useSearchParams();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(params.get('search') || '');

    // Sync input with URL changes (e.g., when clicking "Clear search" button)
    useEffect(() => {
        setSearchTerm(params.get('search') || '');
    }, [params]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            const searchParams = new URLSearchParams(params);

            if (searchTerm.trim()) {
                searchParams.set('search', searchTerm);
            } else {
                searchParams.delete('search');
            }

            searchParams.delete('page');
            searchParams.delete('limit');

            router.push(`?${searchParams.toString()}`);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    return (
        <div className='max-w-md mt-12 relative'>
            <HugeiconsIcon
                icon={Search01Icon}
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4'
            />
            <input
                type='text'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder='Search'
                className='w-full text-sm pl-10 pr-4 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
            />
        </div>
    );
};

export default BlogSearch;
