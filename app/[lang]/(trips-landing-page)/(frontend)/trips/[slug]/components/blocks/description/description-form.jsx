'use client';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import {
    Edit02Icon,
    File02Icon,
    TypeCursorIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { EditingSheetRight } from '../../editing-forms/editing-sheet-right';

export function DescriptionForm({
    isEditing,
    setIsEditing,
    description,
    title,
    setDescription,
    setTitle,
    handleSave,
    handleCancel,
}) {
    const onSave = () => {
        handleSave(description, title);
    };

    return (
        <EditingSheetRight
            side='right'
            className='lg:min-w-[600px] w-full sm:w-[600px] rounded-l-3xl border-l border-border hide-scrollbar'
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
                            Edit Description
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
                            onClick={onSave}
                            className='h-10 px-5 font-bold rounded-xl shadow-lg shadow-primary/20'>
                            Save
                        </Button>
                    </div>
                </div>

                <div className='flex-1 overflow-y-auto px-6 py-8 space-y-8 hide-scrollbar'>
                    {/* Title Input */}
                    <div className='space-y-2'>
                        <label className='text-xs font-bold text-muted-foreground     flex items-center gap-2'>
                            <HugeiconsIcon
                                icon={TypeCursorIcon}
                                size={14}
                                className='text-primary'
                            />
                            Section Title
                        </label>
                        <input
                            type='text'
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className='w-full h-12 rounded-2xl border border-border bg-background px-4 py-2 text-base font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                            placeholder='e.g., Full Description'
                        />
                    </div>

                    {/* Description Input */}
                    <div className='space-y-2'>
                        <label className='text-xs font-bold text-muted-foreground     flex items-center gap-2'>
                            <HugeiconsIcon
                                icon={File02Icon}
                                size={14}
                                className='text-primary'
                            />
                            Content
                        </label>
                        <RichTextEditor
                            value={description}
                            onChange={setDescription}
                            placeholder='Write a detailed description of the trip...'
                        />
                    </div>
                </div>
            </div>
        </EditingSheetRight>
    );
}

