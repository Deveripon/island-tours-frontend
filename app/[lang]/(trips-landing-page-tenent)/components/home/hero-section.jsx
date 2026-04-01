import { getAllDestinationOfTenant } from '@/app/_actions/trips/destinations';
import { ArrowDownDoubleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import HeroSearchBox from './hero-search-box';

export default async function HeroSection({ preferences, tenantId, content }) {
    const destinations = await getAllDestinationOfTenant(tenantId);

    return (
        <section
            id='home'
            className='relative w-full h-screen min-h-[600px] max-h-[900px] flex items-center justify-center  overflow-y-visible'>
            {/* Background Video with Overlay */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className='absolute inset-0 w-full h-full object-cover  z-0'>
                <source src='/video.mp4' type='video/mp4' />
            </video>

            {/* Overlay */}
            <div className='absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60 z-0' />

            {/* Hero Content */}
            <div className='relative z-10 flex flex-col items-center justify-center w-full h-full px-4 sm:px-6 lg:px-8 py-20'>
                <div className='max-w-7xl w-full mx-auto space-y-8 md:space-y-12'>
                    {/* Title */}
                    <div className='text-center space-y-4'>
                        <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[75px] font-light font-nyght-serif text-white leading-tight lg:leading-[1.1] tracking-tight drop-shadow-2xl'>
                            {content?.title}
                        </h1>
                        {content?.subtitle && (
                            <p className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[75px] font-light font-nyght-serif text-white leading-tight lg:leading-[1.1] tracking-tight drop-shadow-2xl italic'>
                                {content?.subtitle}
                            </p>
                        )}
                    </div>

                    {/* Search Box */}
                    <div className='w-full max-w-5xl mx-auto'>
                        <HeroSearchBox
                            className='liquid-glass-enhanced'
                            destinations={destinations?.data}
                            content={content?.searchForm}
                            preferences={preferences}
                            tenantId={tenantId}
                        />
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className='absolute  rounded-4xl bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce'>
                <HugeiconsIcon icon={ArrowDownDoubleIcon} className='text-white' />
            </div>
        </section>
    );
}

