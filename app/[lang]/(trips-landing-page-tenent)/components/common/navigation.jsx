'use client';
import LanguageSwitcher from '@/components/language-switcher';
import { ModeToggle } from '@/components/theme-switcher';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Shield01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthButton } from './auth-button';

const Navigation = ({
    isMobileMenu = false,
    onClose,
    isScrolled = false,
    isMobile = false,
    className,
    isTripDetailsPage = false,
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const [hoveredPath, setHoveredPath] = useState(null);
    const [currentHash, setCurrentHash] = useState('');

    useEffect(() => {
        const handleHashChange = () => setCurrentHash(window.location.hash);
        handleHashChange(); // Set initial hash
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const isPaymentPage = /\/payment$/.test(pathname);
    const isHomePage = pathname === '/' || pathname.endsWith('/') || pathname.split('/').pop() === '';

    const isLiquidGlass = className?.includes('liquid-glass');
    const [scrollPast80vh, setScrollPast80vh] = useState(false);

    useEffect(() => {
        if (!isLiquidGlass) return;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const viewportHeight = window.innerHeight;
            const threshold = viewportHeight * 0.8;
            setScrollPast80vh(scrollPosition >= threshold);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLiquidGlass]);

    const handleLinkClick = (e, action) => {
        if (action) {
            e.preventDefault();
            action();
        }
        if (onClose) onClose();
    };

    const scrollToSection = sectionId => {
        return () => {
            if (onClose) onClose();
            const currentPath = window.location.pathname;
            const targetPath = '/';

            if (
                currentPath === targetPath ||
                currentPath.endsWith('/')
            ) {
                setTimeout(() => {
                    const element = document.getElementById(sectionId);
                    if (element) {
                        element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                        });
                        window.history.pushState(null, '', `#${sectionId}`);
                        setCurrentHash(`#${sectionId}`);
                    }
                }, 100);
            } else {
                router.push(`/#${sectionId}`);
            }
        };
    };

    const menuItems = [
        {
            label: 'Explore',
            href: '/trips',
            icon: 'explore',
        },
        {
            label: 'Destinations',
            href: '/#destinations',
            action: scrollToSection('destinations'),
            icon: 'location',
        },
        {
            label: 'Blogs & News',
            href: '/blogs',
            icon: 'article',
        },
        {
            label: 'Contact',
            href: '/contact',
            icon: 'mail',
        },
    ];

    const getIsActive = item => {
        if (item.href.includes('#')) {
            const [path, hash] = item.href.split('#');
            const normalizedItemPath = path.endsWith('/') && path !== '/'
                ? path.slice(0, -1)
                : path;
            const normalizedCurrentPath = pathname.endsWith('/') && pathname !== '/'
                ? pathname.slice(0, -1)
                : pathname;

            const isOnBasePage = normalizedCurrentPath.endsWith(normalizedItemPath) || (normalizedItemPath === '/' && (normalizedCurrentPath === '' || normalizedCurrentPath.length <= 3));
            return isOnBasePage && currentHash === `#${hash}`;
        }

        const normalizedItemPath = item.href.endsWith('/') && item.href !== '/'
            ? item.href.slice(0, -1)
            : item.href;
        const normalizedCurrentPath = pathname.endsWith('/') && pathname !== '/'
            ? pathname.slice(0, -1)
            : pathname;

        const isActivePath = normalizedCurrentPath.endsWith(normalizedItemPath);

        if (item.label === 'Explore') {
            return (
                isActivePath ||
                (pathname.includes('/trips') && !pathname.includes('/blogs'))
            );
        }

        return isActivePath;
    };

    if (isPaymentPage) {
        return (
            <div
                className={cn(
                    'flex items-center justify-center',
                    isMobileMenu && 'mt-8'
                )}>
                <Badge
                    variant='outline'
                    className={cn(
                        'font-bold px-4 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2 border-2',
                        isLiquidGlass
                            ? 'text-white border-white/30 bg-white/10'
                            : 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5'
                    )}>
                    <HugeiconsIcon icon={Shield01Icon} className='w-4 h-4' />
                    Secure Checkout
                </Badge>
            </div>
        );
    }

    if (isMobileMenu) {
        return (
            <nav className='flex flex-col items-center justify-between h-full py-8 px-6'>
                <div className='flex flex-col items-center space-y-2 w-full max-w-sm flex-1 justify-center'>
                    {menuItems.map((item, index) => {
                        const isActive = getIsActive(item);
                        return (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className='w-full'>
                                <Link
                                    href={item.href}
                                    onClick={e =>
                                        handleLinkClick(e, item.action)
                                    }
                                    className={cn(
                                        'block text-center py-3 px-6 rounded-xl text-lg font-medium transition-all duration-200',
                                        isActive
                                            ? 'text-primary bg-primary/5'
                                            : 'text-foreground/70 hover:text-foreground hover:bg-accent/30'
                                    )}>
                                    {item.label}
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                <div className='w-full space-y-3 pt-6 border-t border-border/50'>
                    <div className='flex items-center justify-center gap-3'>
                        <LanguageSwitcher className='h-10 w-full max-w-[140px]' />
                        <ModeToggle className='h-10 w-10' />
                    </div>
                    <AuthButton
                        onClose={() => onClose()}
                        variant='default'
                        size='lg'
                        className='w-full h-12 rounded-xl font-medium'
                    />
                </div>
            </nav>
        );
    }

    return (
        <nav
            className='relative flex items-center p-1 bg-accent/10 sm:bg-accent/5 rounded-full border border-border/30 backdrop-blur-sm'
            onMouseLeave={() => setHoveredPath(null)}>
            {menuItems.map(item => {
                const isActive = getIsActive(item);
                const isHovered = hoveredPath === item.href;

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        onMouseEnter={() => setHoveredPath(item.href)}
                        onClick={e => handleLinkClick(e, item.action)}
                        className={cn(
                            'relative px-5 py-2.5 text-sm font-semibold transition-all duration-300 rounded-full',
                            isActive
                                ? isTripDetailsPage
                                    ? 'text-primary'
                                    : 'text-primary dark:text-primary'
                                : isTripDetailsPage
                                  ? 'text-gray-700 dark:text-gray-100 hover:text-white'
                                  : 'text-muted-foreground hover:text-foreground',
                            isLiquidGlass &&
                                !scrollPast80vh &&
                                !isTripDetailsPage &&
                                !isActive &&
                                'text-white/80 hover:text-white'
                        )}>
                        {/* Hover Background */}
                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className='absolute inset-0 bg-accent/50 dark:bg-accent/50 rounded-full -z-10 shadow-sm border border-border/20'
                                    transition={{
                                        duration: 0.2,
                                    }}
                                />
                            )}
                        </AnimatePresence>

                        <span className='relative z-10'>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
};


export default Navigation;

