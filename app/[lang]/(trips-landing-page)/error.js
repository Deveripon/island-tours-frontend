'use client'; // Error boundaries must be Client Components
import {
    Alert02Icon,
    Call02Icon,
    Clock01Icon,
    HeadphonesIcon,
    Home01Icon,
    Mail01Icon,
    RefreshIcon,
    Shield01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service to see the original error
    }, [error]);

    return (
        <div>
            {/* Hero Section with Error */}
            <div className='relative min-h-screen flex items-center justify-center pt-24 overflow-hidden'>
                {/* Background with gradient overlay */}
                <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background'></div>

                {/* Floating elements for visual interest */}
                <div className='absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full opacity-20 animate-pulse'></div>
                <div className='absolute top-40 right-20 w-32 h-32 bg-primary/20 rounded-full opacity-20 animate-pulse delay-1000'></div>
                <div className='absolute bottom-40 left-20 w-16 h-16 bg-accent/20 rounded-full opacity-20 animate-pulse delay-500'></div>
                <div className='absolute bottom-20 right-10 w-24 h-24 bg-primary/20 rounded-full opacity-20 animate-pulse delay-700'></div>

                <div className='relative z-10 max-w-4xl mx-auto px-4 text-center'>
                    {/* Error Icon with animation */}
                    <div className='mb-8'>
                        <div className='inline-flex items-center justify-center w-32 h-32 bg-background rounded-full shadow-2xl mb-8 relative'>
                            <div className='absolute inset-0 bg-gradient-to-r from-warning to-destructive rounded-full opacity-10 animate-ping'></div>
                            <HugeiconsIcon icon={Alert02Icon} className='h-16 w-16 text-warning relative z-10' />
                        </div>
                    </div>

                    {/* Main Error Message */}
                    <div className='mb-12'>
                        <h1 className='text-6xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-primary/50 bg-clip-text text-transparent mb-6'>
                            Oops!
                        </h1>
                        <h2 className='text-lg md:text-lg font-bold text-foreground mb-6'>
                            We&apos;re experiencing some turbulence
                        </h2>
                        <p className='text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
                            Our travel experts are working hard to get
                            everything back on track. Your adventure is just a
                            moment away!
                        </p>
                    </div>

                    {/* Error Details Card */}
                    <div className='bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-12 max-w-2xl mx-auto border border-border'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-sm'>
                            <div className='text-center'>
                                <div className='text-muted-foreground font-medium'>
                                    Error Code
                                </div>
                                <div className='text-foreground font-bold mt-1'>
                                    ERR_500_SYSTEM
                                </div>
                            </div>
                            <div className='text-center'>
                                <div className='text-muted-foreground font-medium'>
                                    Time
                                </div>
                                <div className='text-foreground font-bold mt-1'>
                                    {new Date().toLocaleTimeString()}
                                </div>
                            </div>
                            <div className='text-center'>
                                <div className='text-muted-foreground font-medium'>
                                    Reference
                                </div>
                                <div className='text-foreground font-bold mt-1'>
                                    TRV-
                                    {Math.random()
                                        .toString(36)
                                        .substr(2, 6)
                                        .toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-col sm:flex-row gap-4 justify-center mb-16'>
                        <button
                            onClick={
                                // Attempt to recover by trying to re-render the segment
                                () => reset()
                            }
                            className='group inline-flex items-center px-8 py-4 bg-primary text-white rounded-xl
                            hover:bg-primary  transition-all duration-300 shadow-lg hover:shadow-xl transform
                            hover:scale-105 hover:-translate-y-1'>
                            <HugeiconsIcon icon={RefreshIcon} className='h-5 w-5 mr-3 group-hover:rotate-180 transition-transform duration-500' />
                            Try Again
                        </button>
                        <Link
                            href={'/site'}
                            className='group inline-flex items-center px-8 py-4 bg-background text-primary border-2 border-primary rounded-xl hover:bg-primary/10 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1'>
                            <HugeiconsIcon icon={Home01Icon} className='h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300' />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>

            {/* Status Section */}
            <div className='py-20 bg-background'>
                <div className='max-w-6xl mx-auto px-4'>
                    <div className='text-center mb-16'>
                        <h3 className='text-lg font-bold text-foreground mb-4'>
                            What&apos;s Happening?
                        </h3>
                        <p className='text-lg text-muted-foreground'>
                            We&apos;re working around the clock to restore full
                            service
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {/* Status Item 1 */}
                        <div className='group bg-gradient-to-br from-success/10 to-success/5 rounded-2xl p-8 border border-success/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2'>
                            <div className='flex items-center mb-4'>
                                <div className='w-12 h-12 bg-success rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300'>
                                    <HugeiconsIcon icon={Shield01Icon} className='h-6 w-6 text-white' />
                                </div>
                                <div>
                                    <h4 className='font-bold text-foreground'>
                                        Your Data is Safe
                                    </h4>
                                    <div className='flex items-center mt-1'>
                                        <div className='w-2 h-2 bg-success rounded-full mr-2 animate-pulse'></div>
                                        <span className='text-sm text-success font-medium'>
                                            Secure
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className='text-muted-foreground'>
                                All your bookings, preferences, and personal
                                information remain completely secure and
                                protected.
                            </p>
                        </div>

                        {/* Status Item 2 */}
                        <div className='group bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2'>
                            <div className='flex items-center mb-4'>
                                <div className='w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300'>
                                    <HugeiconsIcon icon={Clock01Icon} className='h-6 w-6 text-white' />
                                </div>
                                <div>
                                    <h4 className='font-bold text-foreground'>
                                        Quick Resolution
                                    </h4>
                                    <div className='flex items-center mt-1'>
                                        <div className='w-2 h-2 bg-primary rounded-full mr-2 animate-pulse'></div>
                                        <span className='text-sm text-primary font-medium'>
                                            In Progress
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className='text-muted-foreground'>
                                Our technical team is actively working on a fix.
                                Expected resolution within 15-30 minutes.
                            </p>
                        </div>

                        {/* Status Item 3 */}
                        <div className='group bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2'>
                            <div className='flex items-center mb-4'>
                                <div className='w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300'>
                                    <HugeiconsIcon icon={HeadphonesIcon} className='h-6 w-6 text-white' />
                                </div>
                                <div>
                                    <h4 className='font-bold text-foreground'>
                                        24/7 Support
                                    </h4>
                                    <div className='flex items-center mt-1'>
                                        <div className='w-2 h-2 bg-primary rounded-full mr-2 animate-pulse'></div>
                                        <span className='text-sm text-primary font-medium'>
                                            Available
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className='text-muted-foreground'>
                                Need immediate help? Our support team is
                                standing by to assist you with any urgent travel
                                needs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Support Section */}
            <div className='py-20 bg-gradient-to-r from-primary via-primary/80 to-primary/60'>
                <div className='max-w-4xl mx-auto px-4 text-center'>
                    <div className='bg-card/10 backdrop-blur-md rounded-3xl p-12 border border-border/20'>
                        <h3 className='text-lg font-bold text-white mb-6'>
                            Need Immediate Assistance?
                        </h3>
                        <p className='text-lg text-primary/20 mb-8 max-w-2xl mx-auto'>
                            If you have an urgent travel matter or need help
                            with an active booking, our expert support team is
                            here to help you 24/7.
                        </p>

                        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                            <a
                                href='mailto:support@travelease.com'
                                className='group inline-flex items-center px-8 py-4 bg-background text-primary rounded-xl hover:bg-primary/10 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1'>
                                <HugeiconsIcon icon={Mail01Icon} className='h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300' />
                                Email Support
                            </a>
                            <a
                                href='tel:+15551234567'
                                className='group inline-flex items-center px-8 py-4 bg-background/20 text-white border-2 border-white/30 rounded-xl hover:bg-background/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm'>
                                <HugeiconsIcon icon={Call02Icon} className='h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300' />
                                Call: (555) 123-4567
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

