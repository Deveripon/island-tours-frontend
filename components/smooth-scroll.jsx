'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

export function SmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Handle hash navigation
        const handleHashClick = e => {
            const target = e.target;
            const anchor = target.closest('a[href^="#"]');

            if (anchor) {
                e.preventDefault();
                const hash = anchor.getAttribute('href');
                if (hash && hash !== '#') {
                    const targetElement = document.querySelector(hash);
                    if (targetElement) {
                        lenis.scrollTo(targetElement, {
                            offset: -80, // Adjust for sticky header
                            duration: 1.2 });
                    }
                }
            }
        };

        document.addEventListener('click', handleHashClick);

        // Handle initial hash on page load
        if (window.location.hash) {
            setTimeout(() => {
                const targetElement = document.querySelector(
                    window.location.hash
                );
                if (targetElement) {
                    lenis.scrollTo(targetElement, {
                        offset: -80,
                        duration: 1.2 });
                }
            }, 100);
        }

        return () => {
            lenis.destroy();
            document.removeEventListener('click', handleHashClick);
        };
    }, []);

    return null;
}

