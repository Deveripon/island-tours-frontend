'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const LoadMoreButton = ({ aggregation }) => {
    const params = useSearchParams();
    const router = useRouter();

    const handleLoadMore = () => {
        const searchParams = new URLSearchParams(params);
        const currentLimit = parseInt(searchParams.get('limit') || '10', 10);
        searchParams.set('limit', (currentLimit + 10).toString());
        router.push(`?${searchParams.toString()}`, { scroll: false });
    };

    // Don't show button if we've loaded all items
    const currentLimit = parseInt(params.get('limit') || '10', 10);
    if (!aggregation || currentLimit >= aggregation.total) {
        return null;
    }

    return (
        <div className='text-center mt-12'>
            <button
                onClick={handleLoadMore}
                className='inline-flex bg-primary/10 rounded-xl items-center px-6 py-3 text-sm font-semibold text-primary hover:text-primary hover:bg-primary/20 transition-colors'>
                <span className='mr-2'>↓</span>
                Load more
            </button>
        </div>
    );
};

export default LoadMoreButton;
