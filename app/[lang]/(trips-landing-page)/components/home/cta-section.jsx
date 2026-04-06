import Image from 'next/image';

export default function CTASection() {
    return (
        <div className='py-16 md:py-22 px-4 flex items-center justify-center'>
            <div className=' w-full max-w-7xl'>
                <div className='relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl'>
                    {/* Background Image */}
                    <Image
                        fill
                        src='https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1400&h=600&fit=crop'
                        alt='Curacao water activities'
                        className='w-full h-full object-cover'
                    />

                    {/* Overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20' />

                    {/* Content */}
                    <div className='absolute inset-0 flex flex-col items-center justify-center text-center px-4 space-y-6'>
                        <h2 className='text-4xl text-normal font-nyght-serif md:text-6xl font-bold text-white'>
                            Hard to choose?
                        </h2>
                        <p className='text-xl font-nyght-serif md:text-2xl text-white/90 drop-shadow-md max-w-3xl'>
                            Discover Top 10 Must-Do Trips & Activities
                        </p>
                        <button className='bg-primary  hover:bg-primary/80 text-primary-foreground font-semibold px-8 py-3 rounded-full text-md shadow-xl hover:shadow-2xl transform  transition-all duration-300'>
                            Top 10 Tours & Activities
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

