import {
    Call02Icon,
    Location01Icon,
    Mail01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { getSettings } from '@/app/_actions/settingsActions';

export const ContactInfo = async () => {
    const res = await getSettings();
    const companyInformations = res?.companyInformations;
    const billingInformations = res?.billingInformations;
    console.log(companyInformations);
    console.log(billingInformations);

    const contactDetails = [
        {
            icon: Location01Icon,
            title: 'Visit us',
            detail:
                companyInformations?.companyAddress ||
                billingInformations?.billingAddress ||
                'Set your address',
            secondary: `${
                companyInformations?.companyCity ||
                billingInformations?.billingCity ||
                'Set your city'
            }   ${
                (', ' + companyInformations &&
                    companyInformations?.companyCountry) ||
                (', ' + billingInformations &&
                    billingInformations?.billingCountry) ||
                ', Set your country'
            }`,
        },
        {
            icon: Call02Icon,
            title: 'Call us',
            detail: companyInformations?.companyPhone || '+1 (123) 456-7890',
            /* secondary: 'Mon-Fri 9AM-6PM EST', */
        },
        {
            icon: Mail01Icon,
            title: 'Email us',
            detail:
                companyInformations?.companyEmail ||
                billingInformations?.billingEmail,
            secondary: 'We reply within 24 hours',
        },
        /*         {
            icon: Clock01Icon,
            title: 'Business hours',
            detail: 'Monday - Friday: 9AM - 6PM',
            secondary: 'Saturday: 10AM - 4PM',
        }, */
    ];

    return (
        <div className='space-y-8'>
            <div>
                <h2 className='text-lg font-medium tracking-tight mb-2 text-foreground'>
                    Contact information
                </h2>
                <p className='text-muted-foreground text-base'>
                    We&apos;re here to help. Reach out through any of these
                    channels.
                </p>
            </div>

            <div className='space-y-6'>
                {contactDetails.map((item, index) => (
                    <div key={index} className='flex gap-4 group'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary group-hover:bg-primary/80 transition-colors'>
                            <HugeiconsIcon
                                icon={item.icon}
                                className='h-5 w-5 text-foreground'
                            />
                        </div>
                        <div className='space-y-1'>
                            <p className='text-sm font-medium leading-none text-foreground'>
                                {item.title}
                            </p>
                            <p className='text-sm text-muted-foreground'>
                                {item.detail}
                            </p>
                            <p className='text-sm text-muted-foreground'>
                                {item.secondary}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
