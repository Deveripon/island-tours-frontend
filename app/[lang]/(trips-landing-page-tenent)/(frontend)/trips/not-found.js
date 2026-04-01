'use client';
import { Button } from '@/components/ui/button';
import { Compass, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();
    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
            <div className='max-w-md mx-auto px-4 text-center'>
                {/* Simple compass icon */}
                <div className='mb-8'>
                    <div className='inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-6'>
                        <Compass className='h-12 w-12 text-primary' />
                    </div>
                </div>

                {/* Clean 404 message */}
                <div className='mb-8'>
                    <h1 className='text-6xl font-bold text-gray-900 mb-4'>
                        404
                    </h1>
                    <h2 className='text-lg font-semibold text-gray-800 mb-4'>
                        Trip Not Found
                    </h2>
                    <p className='text-gray-600 leading-relaxed'>
                        The page you&apos;re looking for doesn&apos;t exist.
                        Let&apos;s get you back on track to discover amazing
                        destinations.
                    </p>
                </div>

                {/* Simple action buttons */}
                <div className='space-y-3'>
                    <Button
                        onClick={() => router.back()}
                        className='w-full inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200'>
                        <Home className='h-5 w-5 mr-2' />
                        Back
                    </Button>
                </div>
            </div>
        </div>
    );
}

