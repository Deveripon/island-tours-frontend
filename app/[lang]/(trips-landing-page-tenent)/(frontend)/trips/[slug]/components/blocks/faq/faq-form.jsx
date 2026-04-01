import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    ArrowDown01Icon,
    Delete02Icon,
    InformationCircleIcon,
    PencilEdit01Icon,
    PlusSignIcon,
    QuestionIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { EditingSheetRight } from '../../editing-forms/editing-sheet-right';

export const FAQForm = ({
    isEditing,
    setIsEditing,
    data,
    setData,
    handleSave,
    handleCancel,
    addFaq,
    removeFaq,
    updateFaq,
    openEditItem,
    setOpenEditItem,
}) => {
    return (
        <EditingSheetRight
            side='right'
            className='lg:min-w-[550px] w-full sm:w-[550px] rounded-l-3xl border-l border-border hide-scrollbar'
            open={isEditing}
            onOpenChange={setIsEditing}>
            <div className='h-full flex flex-col bg-background'>
                {/* Premium Header */}
                <div className='sticky top-0 z-20 px-6 py-5 flex justify-between items-center bg-card border-b border-border shadow-sm'>
                    <div className='flex items-center gap-3'>
                        <div className='p-2 bg-primary/10 text-primary rounded-xl'>
                            <HugeiconsIcon icon={QuestionIcon} size={20} />
                        </div>
                        <h3 className='font-black text-xl tracking-tight'>
                            Edit FAQs
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
                    {/* Section Title */}
                    <div className='space-y-6'>
                        <div className='space-y-2'>
                            <label className='text-xs font-bold text-muted-foreground   tracking-wider flex items-center gap-2'>
                                <HugeiconsIcon
                                    icon={PencilEdit01Icon}
                                    className='w-4 h-4 text-primary'
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
                                placeholder='Section Heading'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-xs font-bold text-muted-foreground   tracking-wider flex items-center gap-2'>
                                <HugeiconsIcon
                                    icon={InformationCircleIcon}
                                    className='w-4 h-4 text-primary'
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
                                className='w-full min-h-[100px] rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none'
                                placeholder='Brief overview of FAQs...'
                            />
                        </div>
                    </div>

                    {/* FAQs List */}
                    <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <label className='text-xs font-bold text-muted-foreground   tracking-wider flex items-center gap-2'>
                                <HugeiconsIcon
                                    icon={QuestionIcon}
                                    className='w-3.5 h-3.5 text-primary'
                                />
                                Question List
                            </label>
                            <Button
                                onClick={addFaq}
                                variant='outline'
                                size='sm'
                                className='h-8 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary rounded-lg px-3'>
                                <HugeiconsIcon
                                    icon={PlusSignIcon}
                                    className='w-3.5 h-3.5 mr-1.5'
                                />
                                Add FAQ
                            </Button>
                        </div>

                        <div className='space-y-3'>
                            {data.faqs.map((faq, index) => {
                                const isEditOpen = openEditItem === index;
                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            'overflow-hidden rounded-xl border transition-all duration-300',
                                            isEditOpen
                                                ? 'border-primary ring-1 ring-primary/10 bg-card'
                                                : 'border-border hover:border-primary/40 bg-accent/5'
                                        )}>
                                        <button
                                            onClick={() =>
                                                setOpenEditItem(
                                                    isEditOpen ? null : index
                                                )
                                            }
                                            className='w-full px-5 py-4 flex items-center justify-between group/item text-left'>
                                            <div className='flex items-center gap-3 overflow-hidden'>
                                                <span className='flex-shrink-0 w-6 h-6 rounded-md bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center'>
                                                    {index + 1}
                                                </span>
                                                <h4
                                                    className={cn(
                                                        'font-semibold text-sm truncate pr-4',
                                                        isEditOpen
                                                            ? 'text-primary'
                                                            : 'text-foreground'
                                                    )}>
                                                    {faq.question}
                                                </h4>
                                            </div>
                                            <div className='flex items-center gap-2 flex-shrink-0'>
                                                <div
                                                    onClick={e =>
                                                        removeFaq(e, index)
                                                    }
                                                    className='p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors group-hover/item:opacity-100 opacity-0 md:opacity-0 lg:opacity-100 cursor-pointer'>
                                                    <HugeiconsIcon
                                                        icon={Delete02Icon}
                                                        size={16}
                                                    />
                                                </div>
                                                <motion.div
                                                    animate={{
                                                        rotate: isEditOpen
                                                            ? 180
                                                            : 0,
                                                    }}
                                                    className='text-muted-foreground'>
                                                    <HugeiconsIcon
                                                        icon={ArrowDown01Icon}
                                                        size={18}
                                                    />
                                                </motion.div>
                                            </div>
                                        </button>

                                        <AnimatePresence initial={false}>
                                            {isEditOpen && (
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{
                                                        height: 'auto',
                                                    }}
                                                    exit={{ height: 0 }}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}
                                                    className='overflow-hidden'>
                                                    <div className='px-5 pb-5 pt-1 space-y-4 border-t border-border/50'>
                                                        <div className='space-y-1.5'>
                                                            <label className='text-[10px] font-bold text-muted-foreground    '>
                                                                Question
                                                            </label>
                                                            <input
                                                                type='text'
                                                                value={
                                                                    faq.question
                                                                }
                                                                onChange={e =>
                                                                    updateFaq(
                                                                        index,
                                                                        'question',
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className='w-full h-10 rounded-lg border border-border bg-background px-3 py-1 text-sm focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none transition-all'
                                                                placeholder='Type the question...'
                                                            />
                                                        </div>

                                                        <div className='space-y-1.5'>
                                                            <label className='text-[10px] font-bold text-muted-foreground    '>
                                                                Answer
                                                            </label>
                                                            <textarea
                                                                value={
                                                                    faq.answer
                                                                }
                                                                onChange={e =>
                                                                    updateFaq(
                                                                        index,
                                                                        'answer',
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className='w-full min-h-[120px] rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none transition-all resize-none'
                                                                placeholder='Provide the detailed answer...'
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>

                        {data.faqs.length === 0 && (
                            <div className='py-12 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center space-y-2'>
                                <div className='p-3 bg-accent/10 rounded-full text-muted-foreground'>
                                    <HugeiconsIcon
                                        icon={QuestionIcon}
                                        size={24}
                                    />
                                </div>
                                <p className='text-sm text-muted-foreground font-medium'>
                                    No FAQs added yet
                                </p>
                                <Button
                                    onClick={addFaq}
                                    variant='link'
                                    size='sm'
                                    className='text-primary'>
                                    Add your first question
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </EditingSheetRight>
    );
};

