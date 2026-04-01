import heroMockup from '@/public/assets/mockup/TripWeel.jpg';
import Image from 'next/image';
import StartFreeTrial from '../start-free-trial-button';

const CTASection = () => {
    return (
        <section className='py-20 bg-gray-50'>
            <div className='container mx-auto px-4'>
                <div className='grid lg:grid-cols-2 gap-12 items-center'>
                    <div className='space-y-6'>
                        <h2 className='text-lg lg:text-lg font-bold text-foreground'>
                            Create Your Tour Booking Website Today!
                        </h2>
                        <p className='text-sm text-gray-700'>
                            Join thousands of tour operators and activity
                            providers who are growing their business with our
                            booking platform. Start your free trial today and
                            see the difference.
                        </p>

                        <ul className='space-y-4'>
                            <li className='flex items-start space-x-3'>
                                <div className='w-5 h-5 rounded-full bg-sass-primary flex items-center justify-center mt-0.5'>
                                    <span className='text-white text-sm'>
                                        ✓
                                    </span>
                                </div>
                                <span className='text-gray-700 max-w-2xl'>
                                    Setup your website in under 10 minutes
                                </span>
                            </li>
                            <li className='flex items-start space-x-3'>
                                <div className='w-5 h-5 rounded-full bg-sass-primary flex items-center justify-center mt-0.5'>
                                    <span className='text-white text-sm'>
                                        ✓
                                    </span>
                                </div>
                                <span className='text-gray-700 max-w-2xl'>
                                    No technical skills required
                                </span>
                            </li>{' '}
                            <li className='flex items-start space-x-3'>
                                <div className='w-5 h-5 rounded-full bg-sass-primary flex items-center justify-center mt-0.5'>
                                    <span className='text-white text-sm'>
                                        ✓
                                    </span>
                                </div>
                                <span className='text-gray-700 max-w-2xl'>
                                    30-day free trial, no credit card needed
                                </span>
                            </li>
                        </ul>

                        <StartFreeTrial className='w-fit' />
                    </div>

                    <div className='relative'>
                        <Image
                            src={heroMockup}
                            alt='Final booking website mockup'
                            className='rounded-lg shadow-2xl w-full'
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;

