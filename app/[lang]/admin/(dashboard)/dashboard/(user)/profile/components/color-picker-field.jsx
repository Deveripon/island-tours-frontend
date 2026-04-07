'use client';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { HexColorInput, HexColorPicker } from 'react-colorful';

/**
 * Production-ready color picker field integrated with react-hook-form.
 * Uses react-colorful for the color selection UI.
 */
export const ColorPickerField = ({
    id,
    label,
    control,
    validationRules = {},
    placeholder = '#000000',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef(null);
    const triggerRef = useRef(null);

    // Close picker when clicking outside
    const handleOutsideClick = useCallback((e) => {
        if (
            popoverRef.current &&
            !popoverRef.current.contains(e.target) &&
            triggerRef.current &&
            !triggerRef.current.contains(e.target)
        ) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, handleOutsideClick]);

    return (
        <Controller
            name={id}
            control={control}
            rules={validationRules}
            render={({ field, fieldState: { error } }) => {
                const currentColor = field.value || placeholder || '#3b82f6';

                return (
                    <div className='mb-6'>
                        <Label
                            htmlFor={id}
                            className='text-sm font-semibold text-foreground mb-2 block'>
                            {label}
                        </Label>

                        <div className='relative flex items-center gap-3'>
                            {/* Color swatch trigger */}
                            <button
                                ref={triggerRef}
                                type='button'
                                onClick={() => setIsOpen((prev) => !prev)}
                                className={cn(
                                    'w-10 h-10 rounded-md border-2 border-border',
                                    'transition-all duration-200 hover:scale-105 active:scale-95',
                                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                                    'shadow-sm flex-shrink-0',
                                    error && 'border-destructive'
                                )}
                                style={{ backgroundColor: currentColor }}
                                aria-label={`Pick ${label}`}
                            />

                            {/* Hex input */}
                            <div className='flex items-center flex-1 relative'>
                                <span className='absolute left-3 text-muted-foreground text-sm font-mono select-none'>
                                    #
                                </span>
                                <HexColorInput
                                    id={id}
                                    color={currentColor.replace('#', '')}
                                    onChange={(hex) => field.onChange(`#${hex}`)}
                                    className={cn(
                                        'w-full h-10 pl-7 pr-3 rounded-md',
                                        'bg-background border border-border',
                                        'text-foreground font-mono text-sm uppercase',
                                        'transition-all duration-200',
                                        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-primary',
                                        error && 'border-destructive focus:ring-destructive'
                                    )}
                                    placeholder={placeholder.replace('#', '')}
                                    prefixed={false}
                                />
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <p className='mt-1 text-xs font-medium text-destructive'>
                                {error.message}
                            </p>
                        )}

                        {/* Color picker popover */}
                        {isOpen && (
                            <div
                                ref={popoverRef}
                                className={cn(
                                    'absolute z-50 mt-2',
                                    'bg-popover border border-border rounded-xl shadow-xl',
                                    'p-4',
                                    'animate-in fade-in zoom-in-95 duration-150'
                                )}>
                                <HexColorPicker
                                    color={currentColor}
                                    onChange={field.onChange}
                                    style={{ width: '220px', height: '200px' }}
                                />

                                {/* Quick presets */}
                                <div className='mt-3 pt-3 border-t border-border'>
                                    <p className='text-xs text-muted-foreground mb-2 font-medium'>
                                        Presets
                                    </p>
                                    <div className='flex flex-wrap gap-2'>
                                        {[
                                            '#3b82f6',
                                            '#6366f1',
                                            '#8b5cf6',
                                            '#ec4899',
                                            '#ef4444',
                                            '#f97316',
                                            '#eab308',
                                            '#22c55e',
                                            '#14b8a6',
                                            '#64748b',
                                            '#0f172a',
                                            '#ffffff',
                                        ].map((preset) => (
                                            <button
                                                key={preset}
                                                type='button'
                                                onClick={() => {
                                                    field.onChange(preset);
                                                    setIsOpen(false);
                                                }}
                                                className={cn(
                                                    'w-6 h-6 rounded-md border-2 flex-shrink-0',
                                                    'transition-all duration-150 hover:scale-110 active:scale-95',
                                                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
                                                    currentColor === preset
                                                        ? 'border-primary ring-2 ring-primary ring-offset-1'
                                                        : 'border-border'
                                                )}
                                                style={{ backgroundColor: preset }}
                                                title={preset}
                                                aria-label={`Set color to ${preset}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Current value display */}
                                <div className='mt-3 pt-3 border-t border-border flex items-center justify-between'>
                                    <span className='text-xs text-muted-foreground font-mono'>
                                        {currentColor.toUpperCase()}
                                    </span>
                                    <button
                                        type='button'
                                        onClick={() => setIsOpen(false)}
                                        className='text-xs text-primary hover:text-primary/80 font-medium transition-colors'>
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            }}
        />
    );
};
