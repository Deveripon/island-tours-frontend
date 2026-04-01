'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useUrl() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [urlData, setUrlData] = useState({
        fullUrl: '',
        origin: '',
        pathname: '',
        search: '',
        searchParams: new URLSearchParams() });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const origin = window.location.origin;
            const search = searchParams.toString();
            const fullUrl = `${origin}${pathname}${search ? `?${search}` : ''}`;

            setUrlData({
                fullUrl,
                origin,
                pathname,
                search,
                searchParams });
        }
    }, [pathname, searchParams]);

    return urlData;
}

