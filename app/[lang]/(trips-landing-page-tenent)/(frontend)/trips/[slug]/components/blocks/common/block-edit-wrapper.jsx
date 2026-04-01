'use client';

import { cn } from '@/lib/utils';
import { Edit02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

/**
 * A reusable wrapper for block components that provides
 * edit mode styling and an interactive overlay.
 */
export function BlockEditWrapper({
    children,
    isEditMode,
    isAdmin,
    onEdit,
    className,
}) {
    const showEditUI = isEditMode && isAdmin;

    return (
        <div
            className={cn(
                'relative group w-full',
                showEditUI &&
                    'border border-dashed border-border p-6 sm:p-10 rounded-lg hover:border-primary transition-all duration-300',
                className
            )}>
            {children}

            {/* Edit Mode Overlay */}
            {showEditUI && (
                <div
                    className='absolute inset-0 cursor-pointer rounded-lg bg-transparent z-10'
                    onClick={onEdit}>
                    <div className='hidden group-hover:flex absolute top-2 right-2 bg-primary text-white p-2 rounded-full shadow-sm'>
                        <HugeiconsIcon icon={Edit02Icon} size={16} />
                    </div>
                </div>
            )}
        </div>
    );
}

