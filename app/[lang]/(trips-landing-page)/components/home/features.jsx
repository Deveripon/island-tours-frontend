import {
    Location01Icon,
    SmartPhone01Icon,
    StarIcon,
    Tick01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import SectionTitle from './section-title';

export default function Features({ content }) {
    const features = [
        {
            icon: SmartPhone01Icon,
            title: content?.alwaysAvailable || 'Always Available',
            description:
                content?.alwaysAvailableDescription ||
                '24/7 WhatsApp & support team',
            details:
                'Get instant responses to your questions anytime, day or night. Our dedicated team is just a message away.',
        },
        {
            icon: Location01Icon,
            title: content?.localExpertise || 'Local Expertise',
            description:
                content?.localExpertiseDescription ||
                'Tours selected by island experts',
            details:
                'Every tour is handpicked by locals who know the hidden gems and best experiences the island has to offer.',
        },

        {
            icon: StarIcon,
            title:
                content?.thousandsSatisfied ||
                'Thousands of Satisfied Travelers',
            description:
                content?.thousandsSatisfiedDescription ||
                'Reviews & genuine experiences',
            details:
                'Join thousands of happy travelers who have explored the islands with us and shared their authentic experiences.',
        },
        {
            icon: Tick01Icon,
            title: content?.secureFlexible || 'Secure & Flexible Booking',
            description:
                content?.secureFlexibleDescription ||
                'Free cancellation · 20% off · Pay later',
            details:
                'Book with confidence knowing you can cancel for free, enjoy exclusive discounts, and flexible payment options.',
        },
    ];

    return (
        <section id='features' className='py-12 md:py-24 px-4 !bg-background'>
            <SectionTitle
                title='Your Local Island '
                highlightedText='Experts'
            />
            <div className='container mx-auto my-12'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                    {features.map((feature, index) => (
                        <div key={index} className=' p-6 text-center '>
                            <div className='mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/30'>
                                <HugeiconsIcon
                                    icon={feature.icon}
                                    className='h-8 w-8 text-primary'
                                />
                            </div>
                            <h3 className='text-base font-bold mb-2 dark:text-foreground'>
                                {feature.title}
                            </h3>
                            <p className='text-muted-foreground dark:text-muted-foreground text-sm'>
                                {feature.description}
                            </p>
                            {feature.details && (
                                <p className='text-muted-foreground dark:text-muted-foreground text-xs leading-relaxed'>
                                    {feature.details}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

