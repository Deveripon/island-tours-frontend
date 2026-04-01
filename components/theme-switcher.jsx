'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Moon02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ModeToggle({ className, isTripDetailsPage }) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Track scroll position for liquid-glass threshold
    const [scrollPast80vh, setScrollPast80vh] = useState(false);
    const isLiquidGlass = className?.includes('liquid-glass');

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button
                size='icon'
                variant='ghost'
                className={cn('size-10', className)}
                disabled>
                <Sun className='size-5' />
            </Button>
        );
    }

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <Button
            size='icon'
            variant='outline'
            onClick={toggleTheme}
            className={cn(
                'relative rounded-full bg-transparent border-transparent hover:border-border transition-all duration-200 overflow-hidden',
                className
            )}
            title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}>
            <Sun
                className={cn(
                    'size-5 transition-all duration-300',
                    resolvedTheme === 'dark'
                        ? 'scale-0 -rotate-90'
                        : 'scale-100 rotate-0'
                )}
            />
            <HugeiconsIcon
                icon={Moon02Icon}
                className={cn(
                    'absolute size-5 transition-all duration-300',
                    resolvedTheme === 'dark'
                        ? 'scale-100 rotate-0'
                        : 'scale-0 rotate-90'
                )}
            />
            <span className='sr-only'>Toggle theme</span>
        </Button>
    );
}
