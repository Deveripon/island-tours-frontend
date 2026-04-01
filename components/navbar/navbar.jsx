'use client';
import tripwheelLogo from '@/public/tripwheel-logo.png';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../language-switcher';
import Logo from './Logo';
import NavigationBar from './navigation';
export function Navbar({ content, lang }) {
    const pathname = usePathname();
    const isOnboarding = pathname.includes('/onboarding');

    return (
        <div className='border-b sticky top-0 z-50 bg-background/25 dark:bg-black/25 backdrop-blur-3xl'>
            <div className='flex h-16 items-center px-4 container mx-auto'>
                <Logo logoImage={tripwheelLogo} />
                <NavigationBar lang={lang} />

                <div className='ml-auto flex items-center gap-4 max-lg:hidden'>
                    {!isOnboarding && (
                        <>
                            <Link
                                href='/sign-in'
                                className='px-6 py-2 xs:px-6 xs:py-3 flex items-center justify-center gap-2 rounded-lg text-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 leading-relaxed text-sm sm:text-base hover:bg-gray-100'>
                                {content.signin}
                            </Link>
                            <Link
                                href='/sign-up'
                                className='px-6 py-2 xs:px-6 xs:py-3 flex items-center justify-center gap-2 rounded-lg bg-sass-primary text-white leading-relaxed text-sm tracking-tighter sm:text-base hover:bg-sass-primary/90'>
                                {content.startFreeTrial}
                                <ArrowRight size={16} className='w-4 h-4' />
                            </Link>

                            <Link
                                target='_blank'
                                href={
                                    process.env
                                        .NEXT_PUBLIC_MEETING_LINK_FOR_DEMO
                                }
                                className='px-6 py-2 xs:px-6 xs:py-3 flex items-center justify-center gap-2 rounded-lg  text-gray-600 dark:text-white leading-relaxed text-sm sm:text-base border-2 border-gray-200 hover:bg-sass-primary/90 transition-colors duration-300 tracking-tighter hover:text-white'>
                                {content.bookAdemo}
                                <ArrowRight size={16} className='w-4 h-4' />
                            </Link>
                        </>
                    )}
                    <LanguageSwitcher />
                </div>

                {/*    <div className='theme-switcher ml-5'>
                    <ModeToggle />
                </div> */}
            </div>
        </div>
    );
}

