'use client';

import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { VariantSelectionDialog } from './variant-selection-dialog';

export const BlockVariantSelector = ({
    label = 'Layout Style',
    icon, // Hugeicons icon component
    lucideIconName, // Lucide icon name for dialog
    watchedVariant,
    isLayoutModalOpen,
    setIsLayoutModalOpen,
    variants,
    onSelectVariant,
    blockLabel,
    trip,
}) => {
    // Find the current variant name
    const currentVariant = variants.find(v => v.id === watchedVariant);
    const variantName = currentVariant?.label || watchedVariant || 'Standard';

    return (
        <div className='space-y-3 pb-4 border-b border-border/50'>
            <label className='text-xs font-bold text-muted-foreground   tracking-wider flex items-center gap-2'>
                <HugeiconsIcon icon={icon} className='w-4 h-4 text-primary' />
                {label}
            </label>
            <Button
                type='button'
                variant='outline'
                className='w-full justify-start font-normal h-12 rounded-xl border-border bg-card hover:bg-accent/50 hover:text-accent-foreground'
                onClick={() => setIsLayoutModalOpen(true)}>
                <div className='flex items-center gap-3'>
                    <div className='text-muted-foreground'>
                        <HugeiconsIcon icon={icon} className='w-4 h-4' />
                    </div>
                    <div className='flex flex-col items-start'>
                        <span className='text-xs font-bold   tracking-wider'>
                            {variantName}
                        </span>
                    </div>
                </div>
                <span className='ml-auto text-[10px] font-black   tracking-wider text-muted-foreground bg-accent/10 px-2 py-1 rounded-md'>
                    Switch
                </span>
            </Button>

            <VariantSelectionDialog
                open={isLayoutModalOpen}
                onOpenChange={setIsLayoutModalOpen}
                variants={variants}
                onSelectVariant={onSelectVariant}
                blockLabel={blockLabel}
                blockIcon={lucideIconName}
                trip={trip}
                currentVariantId={watchedVariant}
            />
        </div>
    );
};

