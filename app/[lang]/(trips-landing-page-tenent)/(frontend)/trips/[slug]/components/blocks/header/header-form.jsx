import { Button } from '@/components/ui/button';
import { TypeCursorIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { EditingSheetRight } from '../../editing-forms/editing-sheet-right';

export const HeaderForm = ({
    isEditing,
    setIsEditing,
    editedTitle,
    setEditedTitle,
    handleSave,
    handleCancel,
    isMainTitle = false,
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
                            <HugeiconsIcon icon={TypeCursorIcon} size={20} />
                        </div>
                        <h3 className='font-black text-xl tracking-tight'>
                            Edit Header
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
                        <div className='space-y-2'>
                            <label className='text-xs font-bold text-muted-foreground     flex items-center gap-2'>
                                <HugeiconsIcon
                                    icon={TypeCursorIcon}
                                    size={14}
                                    className='text-primary'
                                />
                                {isMainTitle ? 'Heading Text' : 'Trip Title'}
                            </label>
                            <input
                                type='text'
                                value={editedTitle}
                                onChange={e => setEditedTitle(e.target.value)}
                                className='w-full h-12 rounded-2xl border border-border bg-background px-4 py-2 text-base font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                                placeholder={
                                    isMainTitle ? 'Heading Text' : 'Trip Title'
                                }
                            />
                            {isMainTitle && (
                                <div className='flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10'>
                                    <div className='w-1.5 h-1.5 rounded-full bg-primary animate-pulse' />
                                    <p className='text-[10px] text-muted-foreground font-bold   tracking-tight'>
                                        This is the main title displayed on the
                                        trip page.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </EditingSheetRight>
    );
};

