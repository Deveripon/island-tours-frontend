'use client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import { EditingSheetRight } from '../editing-forms/editing-sheet-right';
import { BLOCK_METADATA } from './block-registry';
import { BlockSkeleton } from './block-skeletons';
import { VariantSelectionDialog } from './common/variant-selection-dialog';

export default function BlockLibrarySidebar({
    open,
    onOpenChange,
    onAddBlock,
    trip,
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBlockType, setSelectedBlockType] = useState(null);
    // Group and filter blocks by category
    const categories = Object.entries(BLOCK_METADATA).reduce(
        (acc, [type, meta]) => {
            const matchesSearch =
                meta.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (meta.category &&
                    meta.category
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())) ||
                meta.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            if (!matchesSearch) return acc;

            const cat = meta.category || 'Other';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push({ type, ...meta });
            return acc;
        },
        {}
    );
    // Order of categories to display
    const categoryOrder = searchQuery
        ? Object.keys(categories)
        : ['Core', 'Visuals', 'Content', 'Social'];

    const hasResults = Object.keys(categories).length > 0;

    const handleBlockClick = type => {
        const meta = BLOCK_METADATA[type];
        if (meta?.variants && meta.variants.length > 0) {
            setSelectedBlockType(type);
        } else {
            onAddBlock(type);
        }
    };

    const handleVariantSelect = variantId => {
        if (!selectedBlockType) return;
        onAddBlock(selectedBlockType, { variant: variantId });

        setSelectedBlockType(null);
    };

    const selectedBlockMeta = selectedBlockType
        ? BLOCK_METADATA[selectedBlockType]
        : null;

    return (
        <EditingSheetRight open={open} onOpenChange={onOpenChange} side='right'>
            <div className='flex flex-col h-full bg-zinc-950 text-white'>
                <div className='p-8 pt-10 border-b border-white/5 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-20 space-y-6'>
                    <div>
                        <h2 className='text-2xl font-black tracking-tight flex items-center gap-3'>
                            <div className='w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center'>
                                <LucideIcons.Box className='w-4 h-4 text-primary' />
                            </div>
                            Block Library
                        </h2>
                        <p className='text-[11px] text-zinc-500   font-bold   mt-2'>
                            Click to add components
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className='relative group'>
                        <div className='absolute inset-y-0 left-4 flex items-center pointer-events-none'>
                            <Search
                                className={cn(
                                    'w-4 h-4 transition-colors duration-300',
                                    searchQuery
                                        ? 'text-primary'
                                        : 'text-zinc-500'
                                )}
                            />
                        </div>
                        <input
                            type='text'
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder='Search components...'
                            className='w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3 pl-11 pr-10 text-sm font-medium placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300'
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className='absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-white transition-colors'>
                                <X className='w-4 h-4' />
                            </button>
                        )}
                    </div>
                </div>

                <ScrollArea className='flex-1 pb-10'>
                    {!hasResults ? (
                        <div className='flex flex-col items-center justify-center py-20 px-8 text-center space-y-4'>
                            <div className='w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-700'>
                                <Search className='w-8 h-8' />
                            </div>
                            <div className='space-y-1'>
                                <h3 className='font-bold text-zinc-300'>
                                    No matching blocks
                                </h3>
                                <p className='text-xs text-zinc-500 max-w-[200px]'>
                                    Try searching for different keywords or
                                    browse categories.
                                </p>
                            </div>
                            <button
                                onClick={() => setSearchQuery('')}
                                className='text-xs font-bold text-primary hover:underline'>
                                Clear search
                            </button>
                        </div>
                    ) : (
                        <div className='p-8 space-y-12'>
                            {categoryOrder.map(cat => {
                                const blocks = categories[cat];
                                if (!blocks) return null;

                                return (
                                    <div key={cat} className='space-y-6'>
                                        <div className='flex items-center gap-4'>
                                            <h3 className='text-[10px] font-black   tracking-[0.3em] text-zinc-500'>
                                                {cat} Sets
                                            </h3>
                                            <div className='h-px flex-1 bg-white/5' />
                                        </div>

                                        <div className='grid grid-cols-2 gap-4'>
                                            {blocks.map(block => (
                                                <button
                                                    key={block.type}
                                                    onClick={() =>
                                                        handleBlockClick(
                                                            block.type
                                                        )
                                                    }
                                                    className='group relative flex flex-col text-left transition-all duration-300 active:scale-95'>
                                                    {/* Card with Skeleton */}
                                                    <div className='relative aspect-[16/9] rounded-xl bg-zinc-900 border border-white/5 overflow-hidden group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(var(--primary),0.1)] transition-all duration-300'>
                                                        {/* Skeleton Container */}
                                                        <div className='absolute inset-0 overflow-hidden text-zinc-700 group-hover:text-primary/40 transition-colors duration-300'>
                                                            <BlockSkeleton
                                                                type={
                                                                    block.type
                                                                }
                                                            />
                                                        </div>

                                                        {/* Overlay Actions */}
                                                        <div className='absolute inset-0 bg-zinc-950/0 group-hover:bg-zinc-950/40 transition-all duration-300 flex items-center justify-center  rounded-2xl z-10 opacity-0 group-hover:opacity-100 backdrop-blur-[1px]'>
                                                            <div className='w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-all duration-300'>
                                                                <Plus className='w-5 h-5' />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Label Section */}
                                                    <div className='mt-3 px-1'>
                                                        <h4 className='text-xs font-bold text-zinc-300 group-hover:text-white transition-colors flex items-center gap-2'>
                                                            <BlockIcon
                                                                name={
                                                                    block.icon
                                                                }
                                                                className='w-3 h-3 text-zinc-500 group-hover:text-primary transition-colors'
                                                            />
                                                            {block.label}
                                                        </h4>
                                                        <p className='text-[10px] text-zinc-600 truncate mt-1 leading-relaxed'>
                                                            {block.description}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>

                {/* Variant Selection Dialog */}
                <VariantSelectionDialog
                    open={!!selectedBlockType}
                    onOpenChange={open => !open && setSelectedBlockType(null)}
                    variants={selectedBlockMeta?.variants}
                    onSelectVariant={handleVariantSelect}
                    blockLabel={selectedBlockMeta?.label}
                    blockIcon={selectedBlockMeta?.icon}
                    trip={trip}
                />
            </div>
        </EditingSheetRight>
    );
}

const BlockIcon = ({ name, className }) => {
    const Icon = LucideIcons[name] || LucideIcons.Box;
    return <Icon className={className} />;
};

