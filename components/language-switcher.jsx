'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const LanguageSwitcher = ({ className }) => {
    const [currentLang, setCurrentLang] = useState('en');
    const [isAnimating, setIsAnimating] = useState(false);

    // We can still track open state if we want to rotate the chevron
    const [isOpen, setIsOpen] = useState(false);

    const timeoutRef = useRef(null);
    const router = useRouter();

    // Check if liquid-glass class is present
    const isLiquidGlass = className?.includes('liquid-glass');

    // Track scroll position for 80vh threshold
    const [scrollPast80vh, setScrollPast80vh] = useState(false);

    useEffect(() => {
        if (!isLiquidGlass) return;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const viewportHeight = window.innerHeight;
            const threshold = viewportHeight * 0.8; // 80vh

            setScrollPast80vh(scrollPosition >= threshold);
        };

        handleScroll(); // Check initial position
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLiquidGlass]);

    const languages = useMemo(
        () => [
            {
                code: 'en',
                name: 'English',
                flag: 'https://flagcdn.com/w40/us.png',
                flagLarge: 'https://flagcdn.com/w80/us.png',
            },
            {
                code: 'nl',
                name: 'Nederlands',
                flag: 'https://flagcdn.com/w40/nl.png',
                flagLarge: 'https://flagcdn.com/w80/nl.png',
            },
        ],
        []
    );

    const getLanguageFromURL = useCallback(() => {
        if (typeof window === 'undefined') return 'en';

        const segments = window.location.pathname.split('/').filter(Boolean);
        const firstSegment = segments[0];

        const supportedCodes = languages.map(lang => lang.code);
        if (supportedCodes.includes(firstSegment)) {
            return firstSegment;
        }

        return 'en';
    }, [languages]);

    const saveLanguagePreference = langCode => {
        try {
            localStorage.setItem('preferredLanguage', langCode);

            document.cookie = `preferred-language=${langCode}; path=/; max-age=${
                365 * 24 * 60 * 60
            }; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
        } catch (error) {}
    };

    useEffect(() => {
        const urlLang = getLanguageFromURL();
        setCurrentLang(urlLang);

        try {
            const storedLang = localStorage.getItem('preferredLanguage');
            if (storedLang !== urlLang) {
                saveLanguagePreference(urlLang);
            }
        } catch (error) {}
    }, [getLanguageFromURL]);

    useEffect(() => {
        const handlePopState = () => {
            const urlLang = getLanguageFromURL();
            setCurrentLang(urlLang);
            saveLanguagePreference(urlLang);
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [getLanguageFromURL]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleLanguageChange = langCode => {
        if (langCode === currentLang) return;

        setIsAnimating(true);
        saveLanguagePreference(langCode);
        setCurrentLang(langCode);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            const currentURL = new URL(window.location.href);
            const segments = currentURL.pathname.split('/').filter(Boolean);

            const supportedCodes = languages.map(lang => lang.code);
            if (supportedCodes.includes(segments[0])) {
                segments.shift();
            }

            const newPathname = `/${langCode}/${segments.join('/')}`;

            const newURL = new URL(newPathname, currentURL.origin);
            newURL.search = currentURL.search;
            newURL.hash = currentURL.hash;

            router.push(newURL.pathname + newURL.search + newURL.hash);
            setIsAnimating(false);
            timeoutRef.current = null;
        }, 100);
    };

    const currentLanguage =
        languages.find(lang => lang.code === currentLang) || languages[0];

    // --- Dynamic Styles ---
    const getButtonStyles = () => {
        if (!isLiquidGlass) {
            return 'dark:border-gray-700 dark:text-gray-100 hover:bg-muted text-foreground bg-background';
        }
        return scrollPast80vh
            ? 'border-border bg-background/80 backdrop-blur-md hover:bg-muted text-foreground'
            : 'border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:bg-muted text-foreground';
    };

    const getDropdownContentStyles = () => {
        if (!isLiquidGlass) {
            return 'bg-popover border-border';
        }
        return scrollPast80vh
            ? 'bg-background/95 backdrop-blur-xl border-border'
            : 'bg-black/40 backdrop-blur-xl border-white/10 text-forground';
    };

    const getItemStyles = isSelected => {
        if (!isLiquidGlass) {
            return isSelected ? 'bg-accent text-accent-foreground' : '';
        }
        if (scrollPast80vh) {
            return isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted';
        }
        // Glass mode
        return isSelected
            ? 'bg-white/20 text-forground'
            : 'text-forground/80 hover:bg-white/10 hover:text-forground focus:bg-white/10 focus:text-forground';
    };

    return (
        <DropdownMenu onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='ghost'
                    size='sm'
                    className={cn(
                        'relative flex items-center gap-2 px-3 h-9 rounded-full transition-all duration-300 border shadow-sm group ',
                        getButtonStyles(),
                        className
                    )}>
                    <div className='relative w-5 h-5 overflow-hidden rounded-full shadow-inner border border-black/5 dark:border-white/10 group-hover:scale-110 transition-transform'>
                        <Image
                            src={currentLanguage.flag}
                            alt={currentLanguage.name}
                            fill
                            className='object-cover'
                        />
                    </div>
                    <span className='text-xs font-medium text-foreground! uppercase tracking-wide hidden sm:inline-block'>
                        {currentLanguage.code}
                    </span>
                    <ChevronDown
                        className={cn(
                            'w-3 h-3 transition-transform duration-300 opacity-60',
                            isOpen && 'rotate-180'
                        )}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align='end'
                className={cn(
                    'w-48 p-1 flex flex-col gap-1 rounded-xl shadow-2xl animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 z-[10000]',
                    getDropdownContentStyles()
                )}
                alignOffset={-4}>
                {languages.map(language => {
                    const isSelected = currentLang === language.code;
                    return (
                        <DropdownMenuItem
                            key={language.code}
                            onClick={() => handleLanguageChange(language.code)}
                            disabled={isAnimating}
                            className={cn(
                                'flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm outline-none',
                                getItemStyles(isSelected)
                            )}>
                            <div className='flex items-center gap-3'>
                                <div className='relative w-5 h-5 rounded-full overflow-hidden shadow-sm'>
                                    <Image
                                        src={language.flag}
                                        alt={language.name}
                                        fill
                                        className='object-cover'
                                    />
                                </div>
                                <span
                                    className={cn(
                                        'font-medium',
                                        isLiquidGlass &&
                                            !scrollPast80vh &&
                                            'text-forground'
                                    )}>
                                    {language.name}
                                </span>
                            </div>

                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}>
                                    <Check
                                        className={cn(
                                            'w-4 h-4',
                                            isLiquidGlass &&
                                                !scrollPast80vh &&
                                                'text-forground'
                                        )}
                                    />
                                </motion.div>
                            )}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageSwitcher;
