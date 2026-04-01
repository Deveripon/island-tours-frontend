import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';

const SectionTabs = ({ formSections, activeTab, setActiveTab, className }) => {
    return (
        <div className={cn('col-span-12 lg:col-span-3', className)}>
            {/* Mobile: Horizontal scrollable tabs */}
            <div className='lg:hidden mb-4 bg-muted rounded-lg'>
                <div className='flex gap-2 p-2 overflow-x-auto  scrollbar-hide'>
                    {formSections?.map(section => {
                        return (
                            <button
                                key={section.id}
                                type='button'
                                onClick={() => setActiveTab(section.id)}
                                className={cn(
                                    'flex-shrink-0 flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200 min-w-[80px] min-h-[80px]',
                                    activeTab === section.id
                                        ? 'bg-card text-primary-foreground shadow-md scale-105'
                                        : 'bg-muted  hover:bg-muted hover:text-foreground hover:shadow-sm'
                                )}>
                                <HugeiconsIcon
                                    icon={section.icon}
                                    className={cn(
                                        'h-6 w-6',
                                        activeTab === section.id
                                            ? 'text-primary'
                                            : ''
                                    )}
                                />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Desktop: Vertical sidebar */}
            <Card className='hidden lg:block border-r-0 bg-muted h-full rounded-tr-none rounded-br-none overflow-hidden'>
                <div className='mt-12'>
                    <nav className='space-y-1'>
                        {formSections?.map(section => {
                            const isActive = activeTab === section.id;

                            return (
                                <button
                                    key={section.id}
                                    type='button'
                                    onClick={() => setActiveTab(section.id)}
                                    className={cn(
                                        'w-full py-[6px] pl-4 rounded-r-none text-left transition-all duration-200 group relative overflow-hidden border-l-6 border-transparent min-h-[50px] flex items-center',
                                        isActive
                                            ? 'bg-card shadow-xl border-l-6 border-primary text-primary'
                                            : 'text-muted-foreground shadow-inner shadow-muted hover:bg-muted/50 hover:text-foreground hover:shadow-sm '
                                    )}>
                                    <div className='relative flex justify-left text-sm items-center gap-3'>
                                        <HugeiconsIcon
                                            className={cn(
                                                'h-5 w-5 transition-all duration-200',
                                                isActive
                                                    ? 'text-primary scale-110'
                                                    : 'text-muted-foreground group-hover:text-foreground group-hover:scale-105'
                                            )}
                                            icon={section.icon}
                                        />
                                        {section?.label}
                                    </div>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </Card>
        </div>
    );
};

export default SectionTabs;

