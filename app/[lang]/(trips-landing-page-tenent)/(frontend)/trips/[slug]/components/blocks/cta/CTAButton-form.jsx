'use client';
import { Button } from '@/components/ui/button';
import {
    CursorPointer02Icon,
    Edit02Icon,
    Link01Icon,
    Txt02Icon,
    TypeCursorIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { EditingSheetRight } from '../../editing-forms/editing-sheet-right';

export default function CTAButtonForm({
    isEditing,
    setIsEditing,
    editedData,
    setEditedData,
    handleSave,
    handleCancel,
}) {
    return (
        <EditingSheetRight
            side='right'
            open={isEditing}
            onOpenChange={setIsEditing}>
            <div className='h-full flex flex-col bg-background'>
                {/* Header */}
                <div className='sticky top-0 z-20 px-6 py-5 flex justify-between items-center bg-card border-b border-border shadow-sm'>
                    <div className='flex items-center gap-3'>
                        <div className='p-2 bg-primary/10 text-primary rounded-xl'>
                            <HugeiconsIcon icon={Edit02Icon} size={20} />
                        </div>
                        <h3 className='font-black text-xl tracking-tight'>
                            Edit Call to Action
                        </h3>
                    </div>
                    <div className='flex gap-3'>
                        <Button
                            variant='outline'
                            onClick={handleCancel}
                            className='h-10 px-5 font-bold rounded-xl'>
                            Cancel
                        </Button>
                        <Button
                            variant='default'
                            onClick={handleSave}
                            className='h-10 px-5 font-bold rounded-xl shadow-lg shadow-primary/20'>
                            Save
                        </Button>
                    </div>
                </div>

                <div
                    className='flex-1 overflow-y-auto px-6 py-8 space-y-8 hide-scrollbar'
                    data-lenis-prevent>
                    <div className='space-y-6'>
                        {/* Title Input */}
                        <div className='space-y-2'>
                            <label className='text-xs font-bold text-muted-foreground     flex items-center gap-2'>
                                <HugeiconsIcon
                                    icon={TypeCursorIcon}
                                    size={14}
                                    className='text-primary'
                                />
                                Call to Action Title
                            </label>
                            <input
                                type='text'
                                value={editedData.title}
                                onChange={e =>
                                    setEditedData(prev => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                                className='w-full h-12 rounded-2xl border border-border bg-background px-4 py-2 text-base outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                                placeholder='e.g., Book Your Adventure!'
                            />
                        </div>

                        {/* Description Input */}
                        <div className='space-y-2'>
                            <label className='text-xs  text-muted-foreground     flex items-center gap-2'>
                                <HugeiconsIcon
                                    icon={Txt02Icon}
                                    size={14}
                                    className='text-primary'
                                />
                                Description
                            </label>
                            <textarea
                                value={editedData.description}
                                onChange={e =>
                                    setEditedData(prev => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                rows={4}
                                className='w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none'
                                placeholder='Write a short description to encourage booking...'
                            />
                        </div>

                        {/* Button Text Input */}
                        <div className='space-y-2'>
                            <label className='text-xs font-bold text-muted-foreground     flex items-center gap-2'>
                                <HugeiconsIcon
                                    icon={CursorPointer02Icon}
                                    size={14}
                                    className='text-primary'
                                />
                                Button Text
                            </label>
                            <input
                                type='text'
                                value={editedData.buttonText}
                                onChange={e =>
                                    setEditedData(prev => ({
                                        ...prev,
                                        buttonText: e.target.value,
                                    }))
                                }
                                className='w-full h-12 rounded-2xl border border-border bg-background px-4 py-2 text-base  outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                                placeholder='e.g., Book Now'
                            />
                        </div>

                        {/* Link Input */}
                        <div className='space-y-2'>
                            <label className='text-xs text-muted-foreground     flex items-center gap-2'>
                                <HugeiconsIcon
                                    icon={Link01Icon}
                                    size={14}
                                    className='text-primary'
                                />
                                Button Link
                            </label>
                            <input
                                type='text'
                                value={editedData.link}
                                onChange={e =>
                                    setEditedData(prev => ({
                                        ...prev,
                                        link: e.target.value,
                                    }))
                                }
                                className='w-full h-12 rounded-2xl border border-border bg-background px-4 py-2 text-base  outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                                placeholder='e.g., #sidebar or /checkout'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </EditingSheetRight>
    );
}

