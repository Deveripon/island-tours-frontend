import Image from 'next/image';

const PageHero = async ({
    image,
    title = '',
    subtitle = '',
    subtitle2 = '',
    flip = true,
}) => {
    return (
        <div
            id='home'
            className='relative h-[55vh] md:h-[60vh] flex items-center justify-center'>
            {/* Background Image with Next.js Image */}
            <Image
                src={image || '/placeholder.svg'}
                alt={title || 'Activities'}
                fill
                blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII='
                className={`absolute inset-0 object-cover ${
                    flip ? 'scale-x-[-1]' : ''
                }`}
                quality={100}
                priority
            />
            <div className='absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/60' />

            {/* Hero Content */}
            <div className='relative container mx-auto text-left px-4 text-white z-10'>
                <div className='mx-auto text-left mb-8'>
                    <h3 className='text-lg md:text-xl text-white/90 mb-2'>
                        {subtitle2}
                    </h3>
                    <h1 className='text-4xl font-nyght-serif md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-2xl'>
                        {title}
                    </h1>
                    <p className='text-lg md:text-xl text-white/90 drop-shadow-lg'>
                        {subtitle}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PageHero;

