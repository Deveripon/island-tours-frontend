'use client';
import { Button } from '@/components/ui/button';
import {
    InformationCircleIcon,
    MapPinpoint01Icon,
    PencilEdit01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { EditingSheetRight } from '../../editing-forms/editing-sheet-right';

export const MapForm = ({
    isEditing,
    setIsEditing,
    data,
    setData,
    handleSave,
    handleCancel,
}) => {
    return (
        <EditingSheetRight
            side='right'
            className='lg:min-w-[550px] w-full sm:w-[550px] rounded-l-3xl border-l border-border hide-scrollbar'
            open={isEditing}
            onOpenChange={setIsEditing}>
            <div className='h-full flex flex-col bg-background'>
                {/* Premium Header - Matched with ExperienceSection */}
                <div className='sticky top-0 z-20 px-6 py-5 flex justify-between items-center bg-card border-b border-border shadow-sm'>
                    <div className='flex items-center gap-3'>
                        <div className='p-2 bg-primary/10 text-primary rounded-xl'>
                            <HugeiconsIcon icon={MapPinpoint01Icon} size={20} />
                        </div>
                        <h3 className='font-black text-xl tracking-tight'>
                            Edit Map
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
                    {/* Section Information */}
                    <div className='space-y-6'>
                        <div className='space-y-2'>
                            <label className='text-xs font-bold text-muted-foreground     flex items-center gap-2'>
                                <HugeiconsIcon
                                    icon={PencilEdit01Icon}
                                    size={14}
                                    className='text-primary'
                                />
                                Section Title
                            </label>
                            <input
                                type='text'
                                value={data.title}
                                onChange={e =>
                                    setData({
                                        ...data,
                                        title: e.target.value,
                                    })
                                }
                                className='w-full h-12 rounded-2xl border border-border bg-background px-4 py-2 text-base font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                                placeholder='View Details in Map'
                            />
                        </div>

                        <div className='space-y-2'>
                            <label className='text-xs font-bold text-muted-foreground     flex items-center gap-2'>
                                <HugeiconsIcon
                                    icon={InformationCircleIcon}
                                    size={14}
                                    className='text-primary'
                                />
                                Short Description
                            </label>
                            <textarea
                                value={data.shortDescription}
                                onChange={e =>
                                    setData({
                                        ...data,
                                        shortDescription: e.target.value,
                                    })
                                }
                                className='w-full min-h-[100px] rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none'
                                placeholder='Brief description of the map...'
                            />
                        </div>

                        <div className='space-y-2'>
                            <label className='text-xs font-bold text-muted-foreground     flex items-center gap-2'>
                                <HugeiconsIcon
                                    icon={MapPinpoint01Icon}
                                    size={14}
                                    className='text-primary'
                                />
                                Map Embed / URL
                            </label>
                            <textarea
                                value={data.iframe}
                                onChange={e =>
                                    setData({
                                        ...data,
                                        iframe: e.target.value,
                                    })
                                }
                                className='w-full min-h-[160px] rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none'
                                placeholder='Paste Google Maps embed code or URL here...'
                            />
                            <div className='flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10'>
                                <div className='w-1.5 h-1.5 rounded-full bg-primary animate-pulse' />
                                <p className='text-[10px] text-muted-foreground font-bold   tracking-tight'>
                                    Supports Google Maps embed HTML or URLs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </EditingSheetRight>
    );
};

