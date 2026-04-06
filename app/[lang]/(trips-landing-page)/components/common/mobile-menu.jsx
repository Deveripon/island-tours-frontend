'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

export default function MobileMenu({ isOpen, onClose, children }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                        'fixed inset-0 z-[200] lg:hidden',
                        'bg-background',
                        'flex flex-col'
                    )}>
                    {/* Header with close button */}
                    <div className='flex justify-end p-4'>
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={onClose}
                            className='h-10 w-10 rounded-full'>
                            <HugeiconsIcon
                                icon={Cancel01Icon}
                                className='h-5 w-5'
                            />
                            <span className='sr-only'>Close menu</span>
                        </Button>
                    </div>

                    {/* Navigation content */}
                    <div className='flex-1 flex flex-col items-center justify-center px-6'>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className='w-full'>
                            {children}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

