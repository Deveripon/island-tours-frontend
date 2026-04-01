'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ArrowDown01Icon, Settings04Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';

const sectionList = [
    {
        id: 'quick-setup',
        label: 'Quick Setup Guide',
        description: 'Show the setup guide on dashboard',
    },
    {
        id: 'statistics',
        label: 'Statistics Overview',
        description: 'Display key metrics and analytics',
    },
    {
        id: 'recent-activity',
        label: 'Recent Activity',
        description: 'Show latest updates and changes',
    },
    {
        id: 'matrics',
        label: 'Matrics',
        description: 'Show key metrics and analytics',
    },
];

// Section Toggler Component
export default function SectionToggler({
    visibleSections,
    setVisibleSections }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = sectionId => {
        setVisibleSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId] }));
    };

    return (
        <div className='absolute top-[-20px] mx-4 left-0 right-0 z-[9999]'>
            {/* Expandable Panel */}

            <div
                className={cn(
                    'bg-card transition-all duration-400 ease-linear rounded-lg rounded-br-none rounded-t-none overflow-hidden',
                    isOpen
                        ? 'max-h-96 border border-border border-t-0'
                        : 'max-h-0'
                )}>
                <div className='p-6'>
                    <h3 className='text-sm font-semibold text-foreground mb-2'>
                        Screen elements
                    </h3>
                    <p className='text-sm text-muted-foreground mb-4'>
                        Some screen elements can be shown or hidden by using the
                        checkboxes. Expand or collapse the elements by clicking
                        on their headings, and arrange them by dragging their
                        headings or by clicking on the up and down arrows.
                    </p>

                    {/* Checkboxes Grid */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                        {sectionList.map(section => (
                            <div
                                key={section.id}
                                className='flex items-start gap-2'>
                                <Checkbox
                                    id={section.id}
                                    checked={
                                        visibleSections[section.id] ?? false
                                    }
                                    onCheckedChange={() =>
                                        handleToggle(section.id)
                                    }
                                    className='mt-0.5'
                                />
                                <div className='flex-1'>
                                    <Label
                                        htmlFor={section.id}
                                        className='text-sm font-medium leading-tight cursor-pointer'>
                                        {section.label}
                                    </Label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Screen Options Button */}
            <div className='flex justify-end'>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setIsOpen(!isOpen)}
                    className='gap-2 border-t-0 bg-card hover:bg-secondary rounded-none rounded-b-lg'>
                    <HugeiconsIcon icon={Settings04Icon} />
                    Screen Options
                    <HugeiconsIcon icon={ArrowDown01Icon} />
                </Button>
            </div>
        </div>
    );
}
