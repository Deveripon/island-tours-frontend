'use client';

import { generateColorVariants } from '@/utils/colorUtils';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function DynamicThemeProvider({ theme, children }) {
    const pathname = usePathname();
    const primaryColor = theme?.primaryColor;
    console.log(`primaryColor`, primaryColor);
    console.log(`theme`, theme);

    useEffect(() => {
        if (primaryColor) {
            const colorVariants = generateColorVariants(
                primaryColor,
                theme?.secondaryColor,
                theme?.accentColor
            );

            // Apply the colors to CSS custom properties
            const root = document.documentElement;

            // Core primary colors
            root.style.setProperty('--primary', colorVariants.primary);
            root.style.setProperty(
                '--primary-foreground',
                colorVariants.primaryForeground
            );

            // Primary variants
            root.style.setProperty(
                '--primary-light',
                colorVariants.primaryLight
            );
            root.style.setProperty('--primary-dark', colorVariants.primaryDark);

            // Update ring colors (focus states)
            root.style.setProperty('--ring', colorVariants.primary);

            // Accent colors
            if (colorVariants.accent) {
                root.style.setProperty('--accent', colorVariants.accent);
                root.style.setProperty(
                    '--accent-foreground',
                    colorVariants.accentForeground
                );
            }

            // Secondary colors
            if (colorVariants.secondary) {
                root.style.setProperty('--secondary', colorVariants.secondary);
                root.style.setProperty(
                    '--secondary-foreground',
                    colorVariants.secondaryForeground
                );
            }
        }
    }, [pathname, primaryColor, theme?.accentColor, theme?.secondaryColor]);

    return <>{children}</>;
}
