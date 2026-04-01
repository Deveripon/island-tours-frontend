'use client';
import { X } from 'lucide-react';

export default function BulkActionBar({ selectedCount, onDeselectAll, children }) {
    if (selectedCount === 0) return null;

    return (
        <div className='px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] animate-in zoom-in-[0.98] fade-in duration-200'>
            <div className='flex items-center gap-5'>
                <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center h-6 w-6 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-xs border border-indigo-100 dark:border-indigo-500/20'>
                        {selectedCount}
                    </div>
                    <span className='text-sm font-medium text-zinc-700 dark:text-zinc-200'>
                        {selectedCount} selected
                    </span>
                </div>
                <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800" />
                <button
                    onClick={onDeselectAll}
                    className='text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1.5'>
                    <X className='h-3.5 w-3.5' />
                    Deselect all
                </button>
            </div>

            <div className='flex items-center gap-2'>
                {children}
            </div>
        </div>
    );
}
