'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import * as LucideIcons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { useBlockEdit } from '../context/block-edit-context';

// Helper to resolve Lucide icons by name
const BlockIcon = ({ name, className }) => {
    const Icon = LucideIcons[name] || LucideIcons.Box;
    return <Icon className={className} />;
};

export function VariantSelectionDialog({
    open,
    onOpenChange,
    variants,
    onSelectVariant,
    blockLabel,
    blockIcon, // Can be a Lucide icon name string
    trip, // Needed for preview rendering
    currentVariantId: currentVariantIdProp, // Explicit override
}) {
    if (!variants || variants.length === 0) return null;
    const { blocks, editingBlockId } = useBlockEdit();
    const currentBlock = blocks?.find(b => b.id === editingBlockId);
    // Prefer the explicitly passed prop, fall back to block context
    const currentVariantId =
        currentVariantIdProp ?? currentBlock?.data?.variant;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='z-[999999] bg-zinc-950 border-white/10 text-white w-[95vw] max-w-[1400px] h-[90vh] md:h-[85vh] p-0 overflow-hidden gap-0 flex flex-col'>
                <DialogHeader className='p-6 border-b border-white/5 bg-white/5 shrink-0'>
                    <DialogTitle className='text-xl font-bold flex items-center gap-2'>
                        {/* Render Icon */}
                        {blockIcon && (
                            <div className='w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center'>
                                <BlockIcon
                                    name={blockIcon}
                                    className='w-4 h-4 text-primary'
                                />
                            </div>
                        )}
                        Choose {blockLabel || 'Layout'}
                    </DialogTitle>
                    <DialogDescription className='text-zinc-400'>
                        Select a layout variation for this section. You can
                        change this later.
                    </DialogDescription>
                </DialogHeader>

                <div className='flex-1 overflow-y-auto p-8 grid grid-cols-1 xl:grid-cols-2 gap-8 bg-transparent'>
                    {variants.map(variant => {
                        const VariantComponent = variant.component;
                        const defaultData = variant.defaultData || {};
                        const isActive = variant.id === currentVariantId;

                        return (
                            <div
                                key={variant.id}
                                role='button'
                                tabIndex={0}
                                onClick={() =>
                                    !isActive && onSelectVariant(variant.id)
                                }
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        !isActive &&
                                            onSelectVariant(variant.id);
                                    }
                                }}
                                className={`group overflow-hidden relative flex flex-col text-left transition-all duration-300 h-fit outline-none ${isActive ? 'cursor-default' : 'active:scale-[0.99] cursor-pointer'}`}>
                                <div
                                    className={`relative w-full rounded-2xl bg-zinc-900 border overflow-hidden transition-all duration-500 ${isActive ? 'border-primary ring-1 ring-primary shadow-[0_0_30px_rgba(var(--primary),0.2)]' : 'border-white/10 group-hover:border-primary/50 group-hover:shadow-[0_0_40px_rgba(var(--primary),0.15)]'}`}>
                                    <div className='relative h-[320px] pointer-events-none select-none '>
                                        {/* Live Component Preview - Scaled down */}
                                        <div className='absolute top-0 left-0 w-[200%] origin-top-left transform scale-50'>
                                            <div className='p-8 w-full overflow-hidden'>
                                                {VariantComponent ? (
                                                    <VariantComponent
                                                        isBlock={true}
                                                        preview={true}
                                                        data={defaultData}
                                                        trip={trip}
                                                        onUpdate={() => {}} // No-op for preview
                                                    />
                                                ) : (
                                                    <div className='h-64 w-full flex items-center justify-center text-zinc-500'>
                                                        Preview not available
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Gradient overlay */}
                                        <div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zinc-950 to-transparent opacity-60' />
                                    </div>

                                    {/* Select Overlay */}
                                    {isActive ? (
                                        <div className='absolute inset-0 bg-zinc-950/60 flex items-center justify-center backdrop-blur-[1px] z-10 rounded-2xl'>
                                            <div className='px-4 py-2 rounded-full bg-primary/20 border border-primary text-primary font-bold text-xs   tracking-wider shadow-xl flex items-center gap-2'>
                                                <span className='w-1.5 h-1.5 rounded-full bg-primary animate-pulse' />
                                                Active Layout
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px] z-10 rounded-2xl'>
                                            <div className='w-8 h-8 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary/90'>
                                                <ArrowRight className='w-4 h-4' />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className='mt-5 px-1 space-y-1.5 text-center'>
                                    <h4 className='text-lg font-bold text-zinc-200 group-hover:text-primary transition-colors'>
                                        {variant.label}
                                    </h4>
                                    <p className='text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors leading-relaxed max-w-md mx-auto'>
                                        {variant.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}

