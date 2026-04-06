'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import AiSupportAgent from './components/ai-support-agent';
// Animation variants for super smooth slide directions
const slideVariants = {
    // Slide from right - subtle and smooth
    slideRight: {
        initial: { x: '1%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '-1%', opacity: 0 },
    },
    // Slide from left - subtle and smooth
    slideLeft: {
        initial: { x: '-1%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '1%', opacity: 0 },
    },
    // Slide from top - subtle and smooth
    slideDown: {
        initial: { y: '-1%', opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: '1%', opacity: 0 },
    },
    // Slide from bottom - subtle and smooth
    slideUp: {
        initial: { y: '.5%', opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: '-.5%', opacity: 0 },
    },
    // Fade only - ultra smooth
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
};
export default function Page({
    loggedInUser,
    children,
    preferences,
    animationType,
    lang,
    content,
    pendingInquiries,
    pendingReviewsCount,
}) {
    // Get the animation variant based on the prop
    const currentVariant =
        slideVariants[animationType] || slideVariants.slideUp;
    const pathname = usePathname();
    return (
        <SidebarProvider
            className='bg-[#fafafa] shadow-none font-general-sans font-[400]'
            style={{
                '--sidebar-width': 'calc(var(--spacing) * 72)',
                '--header-height': 'calc(var(--spacing) * 12)',
            }}>
            <AppSidebar
                pendingInquiries={pendingInquiries}
                pendingReviewsCount={pendingReviewsCount}
                variant='inset'
                lang={lang}
                preferences={preferences}
                menuItems='dashboardB2B' 
                userRole={loggedInUser?.role}
            />
            <SidebarInset className='bg-white dark:bg-sidebar !shadow-none'>
                <SiteHeader
                    preferences={preferences}
                    loggedInUser={loggedInUser}
                />
                <div className='flex flex-1 flex-col p-5 rounded-2xl bg-[#F4F7FB] dark:bg-[#1E2A3D]'>
                    <div className='@container/main flex flex-1 flex-col gap-2'>
                        <div suppressHydrationWarning className={cn()}>
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={pathname} // This ensures animation triggers on route change
                                    initial={currentVariant.initial}
                                    animate={currentVariant.animate}
                                    exit={currentVariant.exit}
                                    transition={{
                                        stiffness: 300,
                                        duration: 0.2,
                                    }}
                                    className='px-4 py-8 will-change-transform relative'>
                                    {children}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </SidebarInset>
            <AiSupportAgent />
        </SidebarProvider>
    );
}

