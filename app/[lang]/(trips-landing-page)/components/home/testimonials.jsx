import { testimonials } from '@/app/[lang]/(trips-landing-page)/data/data';
import Image from 'next/image';

export default function Testimonials({ content }) {
    const anonymousFallbackImage =
        'https://placehold.co/48x48/6B7280/FFFFFF?text=AA';
    return (
        <div className='font-sans flex flex-col items-center py-24 bg-muted/30 px-4 sm:px-6 lg:px-8'>
            {}
            <h1 className='text-lg md:text-lg font-bold text-center max-w-4xl leading-tight mb-4 text-foreground'>
                {content?.title || ' What Our Customers Are Saying'}
            </h1>

            {}
            <p className='text-base sm:text-sm text-muted-foreground text-center max-w-3xl mb-16'>
                {content?.subtitle ||
                    'Read what our customers have to say about their experience with our services.'}
            </p>

            {}
            <div className='w-full max-w-7xl columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4'>
                {testimonials.map((testimonial, index) => (
                    <div
                        key={index}
                        className='bg-card p-6 rounded-xl shadow-md break-inside-avoid border border-border'>
                        <div className='flex items-center mb-4'>
                            <Image
                                src={
                                    testimonial.image || anonymousFallbackImage
                                }
                                alt={testimonial.name}
                                className='w-12 h-12 rounded-full object-cover mr-4'
                                width={48}
                                height={48}
                            />
                            <div>
                                <p className='font-semibold text-foreground'>
                                    {testimonial.name}
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                    {testimonial.title}
                                </p>
                            </div>
                        </div>
                        <p className='text-base text-muted-foreground leading-relaxed'>
                            {testimonial.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

