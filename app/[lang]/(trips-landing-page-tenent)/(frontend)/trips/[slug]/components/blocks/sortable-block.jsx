'use client';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Delete02Icon,
    DragDropHorizontalIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const SortableBlock = ({ id, children, onDelete, isEditMode }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        position: 'relative',
        opacity: isDragging ? 0.3 : 1,
    };

    if (!isEditMode) {
        return <div className='mb-20 last:mb-0'>{children}</div>;
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'group/sortable relative mb-20 last:mb-0 transition-all',
                isDragging && ''
            )}>
            {/* Drag Handle & Controls - Positioned outside but attached */}
            <div className='absolute -top-4 left-1/2 -translate-x-1/2 z-[100] opacity-0 group-hover/sortable:opacity-100 transition-opacity flex items-center gap-1 bg-white dark:bg-zinc-800 rounded shadow-lg border p-1  duration-200'>
                <div
                    {...attributes}
                    {...listeners}
                    className='p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full cursor-grab active:cursor-grabbing '
                    title='Drag to reorder'>
                    <HugeiconsIcon icon={DragDropHorizontalIcon} size={16} />
                </div>
                <div className='w-[1px] h-4 bg-gray-200 dark:bg-zinc-700' />
                <button
                    onClick={e => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className='p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full cursor-pointer text-red-500 transition-colors'
                    title='Remove block'>
                    <HugeiconsIcon icon={Delete02Icon} size={16} />
                </button>
            </div>

            {children}
        </div>
    );
};

export default SortableBlock;

