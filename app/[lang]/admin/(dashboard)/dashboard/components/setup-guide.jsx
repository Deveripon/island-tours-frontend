import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const SetupGuide = ({ tenant, loggedInUser }) => {
    const setupSteps = [
        {
            number: 1,
            title: 'Create a Tour',
            description:
                'Build your first tour package with itinerary, dates, pricing, and other details.',
            buttonText: 'Create a Tour',
            linkTo: `/${tenant}/dashboard/create-affiliate-trips`,
        },
        {
            number: 2,
            title: 'Customize Your Website',
            description:
                'Tailor your site to match your brand and attract more customers.',
            buttonText: 'Website Settings',
            linkTo: `/${tenant}/dashboard/site-settings`,
        },
        {
            number: 3,
            title: 'Set Up Payment',
            description:
                'Enable secure payments to start accepting bookings online.',
            buttonText: 'Set Up Payment',
            linkTo: `/${tenant}/dashboard/payment-methods`,
        },
        {
            number: 4,
            title: 'Set Up Your Email Settings',
            description:
                'Configure your SMTP in Tripcart to ensure emails are sent from your own domain.',
            buttonText: 'Email Configuration',
            linkTo: `/${tenant}/dashboard/site-settings`,
        },
        /*         {
            number: 5,
            title: 'Set Up Your Custom Domain',
            description: 'Use your own domain to give your site a professional look.',
            buttonText: 'Domain Configuration',
            linkTo: `/${tenant}/dashboard/`,
        }, */
    ];

    const stagingUrl = `${process.env.NEXT_PUBLIC_STAGING_APP_URL}/site/${tenant}`;

    return (
        <div className='w-full'>
            <div className='mb-6'>
                <h1 className='text-lg font-semibold text-foreground mb-2'>
                    Welcome
                    {loggedInUser?.user?.name
                        ? ` ${loggedInUser?.user?.name}`
                        : ''}
                    , your new site is almost ready
                </h1>
                <p className='text-sm text-muted-foreground'>
                    Follow these quick steps to configure your site. You can
                    visit your staging site at{' '}
                    <Link
                        href={stagingUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary hover:underline font-medium transition-colors'>
                        {`${process.env.NEXT_PUBLIC_STAGING_APP_URL}/site/${tenant}`}
                    </Link>
                    .
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Setup Guide</CardTitle>
                    <CardDescription>
                        Complete these steps to get your site up and running
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className='space-y-1'>
                        {setupSteps.map((step, index) => (
                            <div
                                key={step.number}
                                className='flex items-start gap-4'>
                                {/* Step Number with Connector */}
                                <div className='flex-shrink-0 flex flex-col items-center'>
                                    <div className='w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary border border-primary/20'>
                                        {step.number}
                                    </div>
                                    {index < setupSteps.length - 1 && (
                                        <div className='w-px h-10 bg-border mt-2' />
                                    )}
                                </div>

                                {/* Step Content */}
                                <div className='flex-1 min-w-0 pt-0.5'>
                                    <h3 className='font-medium text-foreground mb-1.5 leading-none'>
                                        {step.title}
                                    </h3>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        {step.description}
                                    </p>
                                </div>

                                {/* Action Button */}
                                <div className='flex-shrink-0'>
                                    <Link
                                        href={step.linkTo}
                                        variant='outline'
                                        size='sm'
                                        className='gap-2 flex items-center border p-[6px] px-3 text-sm rounded-full hover:bg-secondary transform transition-colors duration-200'>
                                        {step.buttonText}
                                        <ChevronRight className='w-4 h-4' />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
