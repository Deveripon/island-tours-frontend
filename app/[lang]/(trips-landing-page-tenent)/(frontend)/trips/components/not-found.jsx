'use client';
import { Calendar, Filter, MapPin, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function NoResultsFound() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleClearFilters = () => {
        // Remove all search parameters and navigate to the base URL
        router.push(window.location.pathname);
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='max-w-4xl mx-auto px-6 py-16'>
                {/* Main No Results Section */}
                <div className='text-center'>
                    <div className='max-w-md mx-auto'>
                        {/* Simple Icon Container */}
                        <div className='relative mb-8'>
                            <div className='w-24 h-24 mx-auto bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-sm'>
                                <Search className='w-8 h-8 text-gray-400' />
                            </div>
                        </div>

                        <h2 className='text-2xl font-semibold text-gray-900 mb-3'>
                            No trips found
                        </h2>

                        <p className='text-gray-600 mb-8 leading-relaxed'>
                            We couldn&apos;t find any trips matching your search
                            criteria.
                        </p>

                        {/* Suggestions */}
                        <div className='bg-white rounded-lg border border-gray-200 p-6 mb-8'>
                            <h3 className='text-sm font-medium text-gray-900 mb-4'>
                                Try adjusting your search:
                            </h3>
                            <div className='space-y-3 text-sm text-gray-600'>
                                <div className='flex items-center gap-2'>
                                    <MapPin className='w-4 h-4 text-blue-500' />
                                    <span>Search different destinations</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Calendar className='w-4 h-4 text-blue-500' />
                                    <span>
                                        Try different dates or flexible timing
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Filter className='w-4 h-4 text-blue-500' />
                                    <span>
                                        Remove some filters to see more options
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                            <button
                                onClick={handleClearFilters}
                                className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'>
                                Clear filters
                            </button>
                            <button
                                onClick={handleClearFilters}
                                className='px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium'>
                                Browse all trips
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

