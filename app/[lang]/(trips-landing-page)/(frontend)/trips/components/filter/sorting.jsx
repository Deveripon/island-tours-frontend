'use client';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SlidersHorizontal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const Sorting = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    // Get current sort value from search params or default to 'recommended'
    const currentSort = searchParams.get('sort') || 'recommended';

    const handleSortChange = value => {
        const params = new URLSearchParams(searchParams.toString());

        if (value === 'recommended') {
            // Remove sort param if it's the default value
            params.delete('sort');
        } else {
            params.set('sort', value);
        }
        const newUrl = `${window.location.pathname}${
            params.toString() ? '?' + params.toString() : ''
        }`;
        router.replace(newUrl, { scroll: false });
    };

    return (
        <div className='flex items-center space-x-4'>
            <Select value={currentSort} onValueChange={handleSortChange}>
                <SelectTrigger className='w-48 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'>
                    <SlidersHorizontal className='mr-2 h-4 w-4 text-gray-600 dark:text-gray-400' />
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600'>
                    <SelectItem
                        value='recommended'
                        className='text-gray-900 dark:text-gray-100 focus:bg-blue-50 focus:text-blue-900 dark:focus:bg-gray-700 dark:focus:text-gray-100'>
                        Recommended
                    </SelectItem>
                    <SelectItem
                        value='price-low'
                        className='text-gray-900 dark:text-gray-100 focus:bg-blue-50 focus:text-blue-900 dark:focus:bg-gray-700 dark:focus:text-gray-100'>
                        Price: Low to High
                    </SelectItem>
                    <SelectItem
                        value='price-high'
                        className='text-gray-900 dark:text-gray-100 focus:bg-blue-50 focus:text-blue-900 dark:focus:bg-gray-700 dark:focus:text-gray-100'>
                        Price: High to Low
                    </SelectItem>
                    <SelectItem
                        value='rating'
                        className='text-gray-900 dark:text-gray-100 focus:bg-blue-50 focus:text-blue-900 dark:focus:bg-gray-700 dark:focus:text-gray-100'>
                        Highest Rated
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default Sorting;

