import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertCircleIcon, ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export function FormNavigation({
    formSections,
    activeTab,
    setActiveTab,
    tabsWithErrors,
    currentTabIndex,
    isSidebarOpen,
    setIsSidebarOpen,
    title,
    className }) {
    const [collapse, setCollapse] = useState(false);

    const mainSections = formSections?.filter(item => item.id !== 'seo') || [];
    const seoSections = formSections?.filter(item => item.id === 'seo') || [];

    return (
        <div className={cn('col-span-12 lg:col-span-3', className)}>
            {/* Mobile: Horizontal scrollable tabs */}
            <div className='lg:hidden mb-4 bg-muted rounded-lg'>
                <div className='flex gap-2 p-2 overflow-x-auto scrollbar-hide'>
                    {/* Main Sections */}
                    {mainSections.map(section => (
                        <button
                            key={section.id}
                            type='button'
                            onClick={() => setActiveTab(section.id)}
                            className={cn(
                                'flex-shrink-0 h-16 flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200 min-w-[80px]',
                                activeTab === section.id
                                    ? 'bg-card text-primary-foreground shadow-md scale-105'
                                    : 'bg-muted hover:bg-muted hover:text-foreground hover:shadow-sm'
                            )}>
                            <HugeiconsIcon
                                className={cn(
                                    'h-6 w-6 ',
                                    activeTab === section.id
                                        ? 'text-primary'
                                        : ''
                                )}
                                icon={section.icon}
                            />
                            {tabsWithErrors.includes(section.id) && (
                                <span className='absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-destructive/10'>
                                    <HugeiconsIcon
                                        icon={AlertCircleIcon}
                                        className='h-2 w-2 text-destructive'
                                    />
                                </span>
                            )}
                        </button>
                    ))}

                    {/* SEO Sections */}
                    {seoSections.map(section => (
                        <button
                            key={section.id}
                            type='button'
                            onClick={() => setActiveTab(section.id)}
                            className={cn(
                                'flex-shrink-0 h-16 flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200 min-w-[80px]',
                                activeTab === section.id
                                    ? 'bg-card text-primary-foreground shadow-md scale-105'
                                    : 'bg-muted hover:bg-muted hover:text-foreground hover:shadow-sm'
                            )}>
                            <HugeiconsIcon
                                className={cn(
                                    'h-6 w-6 ',
                                    activeTab === section.id
                                        ? 'text-primary'
                                        : ''
                                )}
                                icon={section.icon}
                            />
                            {tabsWithErrors.includes(section.id) && (
                                <span className='absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-destructive/10'>
                                    <HugeiconsIcon
                                        icon={AlertCircleIcon}
                                        className='h-2 w-2 text-destructive'
                                    />
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Desktop: Vertical sidebar */}
            <Card className='hidden lg:block border-r-0 bg-muted h-full min-h-[80vh] rounded-tr-none rounded-br-none overflow-hidden'>
                <div className='mt-12'>
                    <nav className='space-y-1'>
                        {mainSections.map(section => {
                            const Icon = section.icon;
                            const isActive = activeTab === section.id;
                            return (
                                <button
                                    key={section.id}
                                    type='button'
                                    onClick={() => setActiveTab(section.id)}
                                    className={cn(
                                        'w-full p-2 py-3 pl-4 rounded-r-none text-left transition-all duration-200 group relative overflow-hidden border-l-6 border-transparent ',
                                        isActive
                                            ? 'bg-card shadow-xl border-l-6 border-primary text-primary'
                                            : 'text-muted-foreground shadow-inner shadow-muted hover:bg-muted/50 hover:text-foreground hover:shadow-sm '
                                    )}>
                                    <div className='relative flex justify-left text-sm items-center gap-3'>
                                        <HugeiconsIcon
                                            className={cn(
                                                'h-6 w-6 transition-all duration-200',
                                                isActive
                                                    ? 'text-primary scale-110'
                                                    : 'text-muted-foreground group-hover:text-foreground group-hover:scale-105'
                                            )}
                                            icon={Icon}
                                        />
                                        {section.label}
                                    </div>
                                    {/* Error badge */}
                                    {tabsWithErrors.includes(section.id) && (
                                        <span className='absolute right-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive/10'>
                                            <HugeiconsIcon
                                                icon={AlertCircleIcon}
                                                className='h-3 w-3 text-destructive'
                                            />
                                        </span>
                                    )}
                                </button>
                            );
                        })}

                        {/* SEO Section Header */}
                        <div className='pt-4 pb-2 px-4'>
                            <div
                                onClick={() => setCollapse(!collapse)}
                                className='flex cursor-pointer justify-between items-center group'>
                                <h3 className='font-medium text-xs uppercase text-muted-foreground group-hover:text-primary transition-colors'>
                                    SEO Configuration
                                </h3>
                                <motion.div
                                    animate={{ rotate: collapse ? 180 : 0 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: 'easeInOut',
                                    }}>
                                    <HugeiconsIcon
                                        icon={ArrowDown01Icon}
                                        className='h-3 w-3 font-normal text-muted-foreground group-hover:text-primary transition-colors'
                                    />
                                </motion.div>
                            </div>
                        </div>

                        {/* SEO Items */}
                        <AnimatePresence initial={false}>
                            {collapse && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{
                                        duration: 0.2,
                                        ease: 'easeInOut',
                                    }}
                                    style={{ overflow: 'hidden' }}>
                                    <div className='space-y-1'>
                                        {seoSections.map(section => {
                                            const Icon = section.icon;
                                            const isActive =
                                                activeTab === section.id;
                                            return (
                                                <button
                                                    key={section.id}
                                                    type='button'
                                                    onClick={() =>
                                                        setActiveTab(section.id)
                                                    }
                                                    className={cn(
                                                        'w-full p-2 py-3 pl-4 rounded-r-none text-left transition-all duration-200 group relative overflow-hidden border-l-6 border-transparent ',
                                                        isActive
                                                            ? 'bg-card shadow-xl border-l-6 border-primary text-primary'
                                                            : 'text-muted-foreground shadow-inner shadow-muted hover:bg-muted/50 hover:text-foreground hover:shadow-sm '
                                                    )}>
                                                    <div className='relative flex justify-left text-sm items-center gap-3'>
                                                        <HugeiconsIcon
                                                            className={cn(
                                                                'h-6 w-6 transition-all duration-200',
                                                                isActive
                                                                    ? 'text-primary scale-110'
                                                                    : 'text-muted-foreground group-hover:text-foreground group-hover:scale-105'
                                                            )}
                                                            icon={Icon}
                                                        />
                                                        {section.label}
                                                    </div>
                                                    {/* Error badge */}
                                                    {tabsWithErrors.includes(
                                                        section.id
                                                    ) && (
                                                        <span className='absolute right-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive/10'>
                                                            <HugeiconsIcon
                                                                icon={
                                                                    AlertCircleIcon
                                                                }
                                                                className='h-3 w-3 text-destructive'
                                                            />
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </nav>
                </div>
            </Card>
        </div>
    );
}

