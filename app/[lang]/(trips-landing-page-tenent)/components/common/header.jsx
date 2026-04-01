'use client';
import LanguageSwitcher from '@/components/language-switcher';
import { ModeToggle } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { AuthButton } from './auth-button';
import MobileMenu from './mobile-menu';
import Navigation from './navigation';
import { Logo } from './tenent-logo';

export default function Header({ preferences, tenantId, logo }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { mode, MODES, isTripDetailsPage, isAdmin } = useAdmin();
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };
    const editMode = mode === MODES.edit;

    if (editMode) {
        return null;
    }

    return (
        <>
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out',
                    isAdmin && isTripDetailsPage ? 'mt-[50px]' : 'mt-0',
                    isScrolled
                        ? 'py-3 bg-background/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-b border-border/40'
                        : 'py-6 bg-transparent'
                )}>
                <div className='max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16'>
                    <div className='flex items-center justify-between gap-8 h-12'>
                        {/* Logo Area */}
                        <div className='flex-shrink-0 z-50'>
                            <Logo
                                link={`/site/${tenantId}`}
                                preferences={preferences}
                                logo={logo}
                                className={cn(
                                    'transition-all duration-500',
                                    isScrolled ? 'scale-95' : 'scale-110'
                                )}
                            />
                        </div>

                        {/* Centered Navigation */}
                        <div className='hidden lg:flex items-center justify-center flex-1'>
                            <Navigation
                                className='liquid-glass'
                                tenantId={tenantId}
                                isScrolled={isScrolled}
                                isMobile={false}
                                isTripDetailsPage={isTripDetailsPage}
                            />
                        </div>

                        {/* Action Area */}
                        <div className='flex items-center gap-2 sm:gap-4'>
                            <div className='hidden xl:flex items-center gap-4 pr-4 border-r border-border/50'>
                                <LanguageSwitcher className='h-9 border-0 bg-accent/30 hover:bg-accent/50 shadow-none transition-all' />
                                <ModeToggle
                                    isTripDetailsPage={isTripDetailsPage}
                                    className='h-9 w-9'
                                />
                            </div>

                            <div className='hidden lg:flex'>
                                <AuthButton
                                    tenantId={tenantId}
                                    variant='default'
                                    size='sm'
                                    className='h-10 px-6 rounded-full font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95'
                                />
                            </div>

                            {/* Mobile Menu Trigger */}
                            <Button
                                variant='ghost'
                                size='icon'
                                className={cn(
                                    'lg:hidden z-50 h-10 w-10 rounded-xl transition-all duration-300',
                                    'bg-accent/10 hover:bg-accent/10 border border-border/50'
                                )}
                                onClick={() => setIsMobileMenuOpen(true)}>
                                <HugeiconsIcon
                                    icon={Menu01Icon}
                                    className='h-6 w-6 text-foreground'
                                />
                                <span className='sr-only'>
                                    Open mobile menu
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu}>
                <Navigation
                    className='liquid-glass'
                    tenantId={tenantId}
                    onClose={closeMobileMenu}
                    isMobileMenu={true}
                    isScrolled={isScrolled}
                    isMobile={true}
                />
            </MobileMenu>
        </>
    );
}

