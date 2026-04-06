import { getAllDestinations } from '@/app/_actions/trips/destinations';
import HeroSearchBox from './hero-search-box';
export default async function Hero({ preferences, content }) {
    const res = await getAllDestinations();
    const destinations = res?.result?.data;

    return (
        <div
            id='#home'
            className='relative h-[60vh] flex items-center justify-center'>
            {/* Background Image */}
            <div
                className='absolute inset-0 bg-cover bg-center bg-no-repeat'
                style={{
                    backgroundImage: `url(${heroBgImage.src})`,
                    backgroundPosition: 'center 30%',
                }}>
                <div className='absolute inset-0 bg-black/40 dark:bg-black/60' />
            </div>

            {/* Hero Content */}
            <div className='relative container mx-auto px-4 text-white z-10'>
                <div className='max-w-4xl mx-auto text-center mb-8'>
                    <h1 className='text-lg md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-2xl'>
                        {content?.title}
                    </h1>
                    <p className='text-lg md:text-xl text-white/90 mb-8 drop-shadow-lg'>
                        {content?.subtitle}
                    </p>
                </div>

                {/* Search Box */}
                <div className='absolute w-6xl max-lg:hidden top-[105%] left-1/2 transform -translate-x-1/2 translate-y-1/2 z-[999]'>
                    <HeroSearchBox
                        destinations={destinations}
                        content={content?.searchForm}
                        preferences={preferences}
                    />
                </div>
            </div>
        </div>
    );
}


