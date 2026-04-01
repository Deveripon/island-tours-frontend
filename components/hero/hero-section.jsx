import heroMockup from '@/public/assets/mockup/TripWeel.jpg';
import Image from 'next/image';
import StartFreeTrial from '../start-free-trial-button';
import ViewLiveDemoButton from '../view-demo-button';

const HeroSection = ({ content }) => {
    return (
        <section className='py-20 '>
            <div className='container mx-auto px-4'>
                <div className='grid lg:grid-cols-2 gap-12 items-center'>
                    <div className='space-y-8'>
                        <div className='space-y-4'>
                            <h1 className='text-lg lg:text-5xl font-bold leading-tight text-foreground'>
                                {content?.title}
                            </h1>
                            <p className='text-sm text-gray-700 max-w-lg'>
                                {content?.subtitle}
                            </p>
                        </div>

                        <div className='flex flex-col sm:flex-row gap-4'>
                            <StartFreeTrial text={content?.cta} />
                            <ViewLiveDemoButton text={content?.secondaryCta} />
                        </div>

                        <div className='flex items-center space-x-4 text-sm text-gray-700'>
                            {content?.features?.map((feature, index) => (
                                <span key={index}>✓ {feature}</span>
                            ))}
                        </div>
                    </div>

                    <div className='relative'>
                        <Image
                            height={500}
                            width={500}
                            src={heroMockup}
                            alt='Booking website mockup'
                            className='rounded-lg shadow-2xl w-full'
                        />
                    </div>
                </div>
            </div>
            {/* Mobile optimization - scroll indicator */}
            <div className='absolute bottom-6 left-1/2 transform -translate-x-1/2 sm:hidden'>
                <div className='w-6 h-10 border-2 border-white/50 rounded-full flex justify-center'>
                    <div className='w-1 h-3 bg-background/50 rounded-full mt-2 animate-bounce'></div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

