import { generateSlug } from '@/lib/utils';
import {
    FacebookIcon,
    InstagramIcon,
    LinkedinIcon,
    TwitterIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { Logo } from './tenent-logo';

export default function Footer({
    tenantId,
    preferences,
    companyInformations,
    logo,
    tenantSocialMedia,
    destinations }) {
    return (
        <footer className='relative mt-24 mb-6 mx-4 overflow-hidden rounded-3xl'>
            {/* Gradient Background */}
            <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5' />

            {/* Glass Effect Overlay */}
            <div className='absolute inset-0 liquid-glass' />

            {/* Content Container */}
            <div className='relative container mx-auto px-6 lg:px-8 py-16'>
                {/* Top Section - Logo, Description & Newsletter */}
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16'>
                    {/* Brand Section */}
                    <div className='lg:col-span-5 space-y-6'>
                        <div className='flex items-center space-x-3 mb-6'>
                            <Logo
                                className='text-foreground transition-all duration-300 hover:scale-105'
                                link={`/site/${tenantId}`}
                                preferences={preferences}
                                logo={logo}
                            />
                        </div>
                        <p className='text-muted-foreground text-base leading-relaxed max-w-md'>
                            Discover the beauty of islands through unforgettable
                            tours and activities with Island Tours.
                            <br />
                            <br />
                            All tours we offer are carefully selected to meet
                            the highest standards. Whether you&apos;re seeking
                            active, cultural, or aquatic adventures, we have you
                            covered! Our online booking process is easy and 100%
                            secure.
                        </p>

                        {/* Social Media Links */}
                        <div className='flex items-center gap-3 pt-4'>
                            <span className='text-sm font-medium text-foreground'>
                                Follow us:
                            </span>
                            <div className='flex gap-2'>
                                <Link
                                    target='_blank'
                                    href={tenantSocialMedia?.facebookUrl || '#'}
                                    className='group relative w-10 h-10 rounded-xl bg-muted/50 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/20'>
                                    <HugeiconsIcon
                                        icon={FacebookIcon}
                                        className='h-5 w-5 text-muted-foreground group-hover:text-primary-foreground transition-colors'
                                    />
                                    <span className='sr-only'>Facebook</span>
                                </Link>

                                <Link
                                    target='_blank'
                                    href={tenantSocialMedia?.twitterUrl || '#'}
                                    className='group relative w-10 h-10 rounded-xl bg-muted/50 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/20'>
                                    <HugeiconsIcon
                                        icon={TwitterIcon}
                                        className='h-5 w-5 text-muted-foreground group-hover:text-primary-foreground transition-colors'
                                    />
                                    <span className='sr-only'>Twitter</span>
                                </Link>

                                <Link
                                    target='_blank'
                                    href={
                                        tenantSocialMedia?.instagramUrl || '#'
                                    }
                                    className='group relative w-10 h-10 rounded-xl bg-muted/50 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/20'>
                                    <HugeiconsIcon
                                        icon={InstagramIcon}
                                        className='h-5 w-5 text-muted-foreground group-hover:text-primary-foreground transition-colors'
                                    />
                                    <span className='sr-only'>Instagram</span>
                                </Link>

                                <Link
                                    target='_blank'
                                    href={tenantSocialMedia?.linkedinUrl || '#'}
                                    className='group relative w-10 h-10 rounded-xl bg-muted/50 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/20'>
                                    <HugeiconsIcon
                                        icon={LinkedinIcon}
                                        className='h-5 w-5 text-muted-foreground group-hover:text-primary-foreground transition-colors'
                                    />
                                    <span className='sr-only'>Linkedin</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Links Grid */}
                <div
                    className={`grid gap-8 mb-12 pb-12 border-b border-border/50 ${
                        destinations?.length > 5
                            ? 'grid-cols-2 md:grid-cols-5'
                            : 'grid-cols-2 md:grid-cols-4'
                    }`}>
                    {/* Destinations */}
                    <div
                        className={
                            destinations?.length > 5
                                ? 'col-span-2 md:col-span-2'
                                : ''
                        }>
                        <h3 className='text-sm font-bold text-foreground mb-5 uppercase tracking-wider'>
                            Destinations
                        </h3>
                        {destinations?.length > 5 ? (
                            <div className='grid grid-cols-2 gap-x-8'>
                                <ul className='space-y-3'>
                                    {destinations.slice(0, 5).map(dest => (
                                        <li key={dest.id || dest.name}>
                                            <Link
                                                href={`/site/${tenantId}/destinations/${generateSlug(
                                                    dest.name
                                                )}`}
                                                className='group flex items-center text-muted-foreground hover:text-primary transition-all duration-200'>
                                                <span className='w-0 group-hover:w-2 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-200 rounded-full' />
                                                {dest.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <ul className='space-y-3'>
                                    {destinations.slice(5, 10).map(dest => (
                                        <li key={dest.id || dest.name}>
                                            <Link
                                                href={`/site/${tenantId}/destinations/${generateSlug(
                                                    dest.name
                                                )}`}
                                                className='group flex items-center text-muted-foreground hover:text-primary transition-all duration-200'>
                                                <span className='w-0 group-hover:w-2 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-200 rounded-full' />
                                                {dest.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <ul className='space-y-3'>
                                {destinations?.slice(0, 5).map(dest => (
                                    <li key={dest.id || dest.name}>
                                        <Link
                                            href={`/site/${tenantId}/destinations/${generateSlug(
                                                dest.name
                                            )}`}
                                            className='group flex items-center text-muted-foreground hover:text-primary transition-all duration-200'>
                                            <span className='w-0 group-hover:w-2 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-200 rounded-full' />
                                            {dest.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className='text-sm font-bold text-foreground mb-5 uppercase tracking-wider'>
                            Quick Links
                        </h3>
                        <ul className='space-y-3'>
                            {[
                                {
                                    label: 'About Us',
                                    href: `/site/${tenantId}/#about`,
                                },
                                {
                                    label: 'Contact',
                                    href: `/site/${tenantId}/contact`,
                                },
                                {
                                    label: 'FAQ',
                                    href: `/site/${tenantId}/#faq`,
                                },
                                {
                                    label: 'Terms & Conditions',
                                    href: `/site/${tenantId}/#terms`,
                                },
                                {
                                    label: 'Privacy Policy',
                                    href: `/site/${tenantId}/#privacy`,
                                },
                            ].map(link => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className='group flex items-center text-muted-foreground hover:text-primary transition-all duration-200'>
                                        <span className='w-0 group-hover:w-2 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-200 rounded-full' />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div className='col-span-2 md:col-span-1'>
                        <h3 className='text-sm font-bold text-foreground mb-5 uppercase tracking-wider'>
                            Contact Us
                        </h3>
                        <address className='not-italic text-muted-foreground space-y-3 text-sm'>
                            <p className='leading-relaxed'>
                                {companyInformations?.companyAddress ||
                                    '123 Main Street'}
                            </p>
                            <p>
                                {companyInformations?.companyCity ||
                                    'Wanderlust City, WC 12345'}
                            </p>
                            <p>
                                {companyInformations?.companyCountry ||
                                    'United States'}
                            </p>
                            <p className='pt-2'>
                                <span className='font-semibold text-foreground'>
                                    Email:
                                </span>
                                <br />
                                <a
                                    href={`mailto:${
                                        companyInformations?.companyEmail ||
                                        'info@travelease.com'
                                    }`}
                                    className='hover:text-primary transition-colors'>
                                    {companyInformations?.companyEmail ||
                                        'info@travelease.com'}
                                </a>
                            </p>
                            <p>
                                <span className='font-semibold text-foreground'>
                                    Phone:
                                </span>
                                <br />
                                <a
                                    href={`tel:${
                                        companyInformations?.companyPhone ||
                                        '+1 (555) 123-4567'
                                    }`}
                                    className='hover:text-primary transition-colors'>
                                    {companyInformations?.companyPhone ||
                                        '+1 (555) 123-4567'}
                                </a>
                            </p>
                        </address>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className='flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground'>
                    <p className='text-center md:text-left'>
                        © {new Date().getFullYear()}{' '}
                        <span className='font-semibold text-foreground'>
                            {preferences?.business_name}
                        </span>{' '}
                        . All rights reserved.
                    </p>
                    <div className='flex items-center gap-6'>
                        <Link
                            href='#'
                            className='hover:text-primary transition-colors'>
                            Privacy
                        </Link>
                        <Link
                            href='#'
                            className='hover:text-primary transition-colors'>
                            Terms
                        </Link>
                        <Link
                            href='#'
                            className='hover:text-primary transition-colors'>
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

