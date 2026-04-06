import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    AlignBoxMiddleLeftIcon,
    AlignBoxTopRightIcon,
    ArrowDown01Icon,
    Delete02Icon,
    Edit02Icon,
    InformationCircleIcon,
    Layout01Icon,
    LeftToRightListNumberIcon,
    PencilEdit01Icon,
    PlusSignIcon,
    Settings02Icon,
    Tick01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { EditingSheetRight } from '../../editing-forms/editing-sheet-right';

export const SummaryForm = ({
    isEditing,
    setIsEditing,
    tripSummaryData,
    setTripSummaryData,
    handleSave,
    handleCancel,
    updateSection,
    deleteSection,
    addNewSection,
    toggleSectionCollapse,
    collapsedSections,
    renderIcon,
    iconCategories,
}) => {
    // Icon Grid Selector Component
    const IconGridSelector = ({ value, onChange }) => {
        const [searchTerm, setSearchTerm] = useState('');
        const filteredCategories = iconCategories
            .map(cat => ({
                ...cat,
                icons: cat.icons.filter(icon =>
                    icon.label.toLowerCase().includes(searchTerm.toLowerCase())
                ),
            }))
            .filter(cat => cat.icons.length > 0);

        return (
            <div className='space-y-4 pt-4'>
                <div className='flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all'>
                    <Search className='w-4 h-4 text-muted-foreground' />
                    <input
                        className='bg-transparent text-sm outline-none w-full'
                        placeholder='Search icons...'
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className='max-h-[300px] overflow-y-auto pr-2 space-y-4 hide-scrollbar'>
                    {filteredCategories.map(cat => (
                        <div key={cat.name} className='space-y-2'>
                            <p className='text-[10px] font-bold text-muted-foreground   tracking-wider'>
                                {cat.name}
                            </p>
                            <div className='grid grid-cols-4 gap-2'>
                                {cat.icons.map(icon => (
                                    <button
                                        key={icon.value}
                                        onClick={() => onChange(icon.value)}
                                        className={cn(
                                            'aspect-square flex flex-col items-center justify-center p-2 rounded-xl border transition-all',
                                            value === icon.value
                                                ? 'bg-primary border-primary text-white'
                                                : 'bg-accent/5 border-border hover:border-primary/50 text-foreground'
                                        )}>
                                        <icon.component className='w-5 h-5 mb-1' />
                                        <span className='text-[8px] font-medium truncate w-full text-center'>
                                            {icon.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderEditableSection = (section, index) => {
        const isCollapsed = collapsedSections[section.id] !== false;

        return (
            <div
                key={section.id}
                className={cn(
                    'overflow-hidden rounded-2xl border transition-all duration-300',
                    isCollapsed
                        ? 'border-border bg-accent/5 hover:border-primary/40'
                        : 'border-primary ring-1 ring-primary/10 bg-card shadow-sm'
                )}>
                {/* Fixed Trigger Header */}
                <div
                    className='w-full px-5 py-4 flex items-center justify-between group/item cursor-pointer'
                    onClick={() => toggleSectionCollapse(section.id)}>
                    <div className='flex items-center gap-4 overflow-hidden'>
                        <div
                            className={cn(
                                'p-2.5 rounded-xl transition-colors',
                                isCollapsed
                                    ? 'bg-background text-muted-foreground'
                                    : 'bg-primary/10 text-primary'
                            )}>
                            {renderIcon(section.icon, 'w-5 h-5')}
                        </div>
                        <div className='overflow-hidden'>
                            <h4
                                className={cn(
                                    'font-bold text-sm truncate pr-4',
                                    isCollapsed
                                        ? 'text-foreground'
                                        : 'text-primary'
                                )}>
                                {section.title}
                            </h4>
                            <p className='text-[10px] text-muted-foreground   font-bold tracking-tight'>
                                {section.column === 'left'
                                    ? 'Left Column'
                                    : 'Right Column'}{' '}
                                • {section.content?.length || 0} Lines
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div
                            onClick={e => deleteSection(e, section.id)}
                            className='p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors group-hover/item:opacity-100 opacity-0 md:opacity-0 lg:opacity-100'>
                            <HugeiconsIcon icon={Delete02Icon} size={18} />
                        </div>
                        <motion.div
                            animate={{ rotate: isCollapsed ? 0 : 180 }}
                            className='text-muted-foreground'>
                            <HugeiconsIcon icon={ArrowDown01Icon} size={20} />
                        </motion.div>
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className='overflow-hidden'>
                            <div className='px-5 pb-6 pt-2 space-y-6 border-t border-border/50'>
                                {/* Basic Info Grid */}
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='space-y-1.5'>
                                        <label className='text-[10px] font-bold text-muted-foreground     flex items-center gap-1.5'>
                                            <HugeiconsIcon
                                                icon={Edit02Icon}
                                                size={10}
                                                className='text-primary'
                                            />
                                            Section Title
                                        </label>
                                        <input
                                            type='text'
                                            value={section.title}
                                            onChange={e =>
                                                updateSection(section.id, {
                                                    title: e.target.value,
                                                })
                                            }
                                            className='w-full h-10 rounded-xl border border-border bg-background px-4 py-1 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all'
                                            placeholder='e.g., Departure'
                                        />
                                    </div>
                                    <div className='space-y-1.5'>
                                        <label className='text-[10px] font-bold text-muted-foreground     flex items-center gap-1.5'>
                                            <HugeiconsIcon
                                                icon={Layout01Icon}
                                                size={10}
                                                className='text-primary'
                                            />
                                            Grid Column
                                        </label>
                                        <div className='flex gap-1 p-1 bg-background border border-border rounded-xl'>
                                            <button
                                                onClick={() =>
                                                    updateSection(section.id, {
                                                        column: 'left',
                                                    })
                                                }
                                                className={cn(
                                                    'flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-semibold transition-all',
                                                    section.column === 'left'
                                                        ? 'bg-primary text-white shadow-sm'
                                                        : 'hover:bg-accent/50 text-muted-foreground'
                                                )}>
                                                <HugeiconsIcon
                                                    icon={
                                                        AlignBoxMiddleLeftIcon
                                                    }
                                                    size={14}
                                                />
                                                Left
                                            </button>
                                            <button
                                                onClick={() =>
                                                    updateSection(section.id, {
                                                        column: 'right',
                                                    })
                                                }
                                                className={cn(
                                                    'flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-semibold transition-all',
                                                    section.column === 'right'
                                                        ? 'bg-primary text-white shadow-sm'
                                                        : 'hover:bg-accent/50 text-muted-foreground'
                                                )}>
                                                <HugeiconsIcon
                                                    icon={AlignBoxTopRightIcon}
                                                    size={14}
                                                />
                                                Right
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Lines */}
                                <div className='space-y-2.5'>
                                    <label className='text-[10px] font-bold text-muted-foreground     flex items-center gap-1.5'>
                                        <HugeiconsIcon
                                            icon={LeftToRightListNumberIcon}
                                            size={10}
                                            className='text-primary'
                                        />
                                        Content Lines
                                    </label>
                                    <div className='space-y-2'>
                                        {section.content?.map(
                                            (line, lIndex) => (
                                                <div
                                                    key={lIndex}
                                                    className='flex gap-2 items-center group/line'>
                                                    <div className='flex-1 flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all'>
                                                        <span className='text-[10px] font-bold text-primary opacity-50'>
                                                            {lIndex + 1}
                                                        </span>
                                                        <input
                                                            type='text'
                                                            value={line}
                                                            onChange={e => {
                                                                const newContent =
                                                                    [
                                                                        ...section.content,
                                                                    ];
                                                                newContent[
                                                                    lIndex
                                                                ] =
                                                                    e.target.value;
                                                                updateSection(
                                                                    section.id,
                                                                    {
                                                                        content:
                                                                            newContent,
                                                                    }
                                                                );
                                                            }}
                                                            className='bg-transparent text-sm outline-none w-full font-medium'
                                                            placeholder='Add info...'
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const newContent =
                                                                section.content.filter(
                                                                    (_, i) =>
                                                                        i !==
                                                                        lIndex
                                                                );
                                                            updateSection(
                                                                section.id,
                                                                {
                                                                    content:
                                                                        newContent,
                                                                }
                                                            );
                                                        }}
                                                        className='p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all opacity-0 group-line/line:opacity-100'>
                                                        <HugeiconsIcon
                                                            icon={Delete02Icon}
                                                            size={14}
                                                        />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        onClick={() => {
                                            updateSection(section.id, {
                                                content: [
                                                    ...(section.content || []),
                                                    'New Line',
                                                ],
                                            });
                                        }}
                                        className='w-full h-9 bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary rounded-xl text-xs gap-2 font-bold'>
                                        <HugeiconsIcon
                                            icon={PlusSignIcon}
                                            size={14}
                                        />
                                        Add Content Line
                                    </Button>
                                </div>

                                {/* Icon Grid Selector - RE-ADDED & IMPROVED */}
                                <div className='space-y-2.5 border-t border-border/50 pt-6'>
                                    <label className='text-[10px] font-bold text-muted-foreground     flex items-center gap-1.5'>
                                        <HugeiconsIcon
                                            icon={Settings02Icon}
                                            size={10}
                                            className='text-primary'
                                        />
                                        Choose Section Icon
                                    </label>
                                    <IconGridSelector
                                        value={section.icon}
                                        onChange={newIcon =>
                                            updateSection(section.id, {
                                                icon: newIcon,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <EditingSheetRight
            side='right'
            className='lg:min-w-[550px] w-full sm:w-[550px] rounded-l-3xl border-l border-border hide-scrollbar'
            open={isEditing}
            onOpenChange={setIsEditing}>
            <div className='h-full flex flex-col bg-background'>
                <div className='sticky top-0 z-20 px-6 py-5 flex justify-between items-center bg-card border-b border-border shadow-sm'>
                    <div className='flex items-center gap-3'>
                        <div className='p-2 bg-primary/10 text-primary rounded-xl'>
                            <HugeiconsIcon icon={Edit02Icon} size={20} />
                        </div>
                        <h3 className='font-black text-xl tracking-tight'>
                            Edit Summary
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
                            Save All
                        </Button>
                    </div>
                </div>

                <div className='flex-1 overflow-y-auto px-6 py-8 space-y-10 hide-scrollbar'>
                    {/* Title & Description */}
                    <div className='space-y-6'>
                        <div className='space-y-2'>
                            <label className='text-xs font-bold text-muted-foreground   tracking-wider flex items-center gap-2'>
                                <HugeiconsIcon
                                    icon={PencilEdit01Icon}
                                    className='w-4 h-4 text-primary'
                                />
                                Main Heading
                            </label>
                            <input
                                type='text'
                                value={tripSummaryData.title}
                                onChange={e =>
                                    setTripSummaryData(prev => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                                className='w-full h-12 rounded-2xl border border-border bg-background px-4 py-2 text-base font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                                placeholder='e.g., About this trip'
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
                                value={tripSummaryData.shortDescription}
                                onChange={e =>
                                    setTripSummaryData(prev => ({
                                        ...prev,
                                        shortDescription: e.target.value,
                                    }))
                                }
                                rows={4}
                                className='w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none'
                                placeholder='Briefly describe the trip...'
                            />
                        </div>
                    </div>

                    {/* Trip Info Sections */}
                    <div className='space-y-6'>
                        <div className='flex items-center justify-between'>
                            <label className='text-xs font-bold text-muted-foreground   tracking-wider flex items-center gap-2'>
                                <HugeiconsIcon
                                    icon={Tick01Icon}
                                    className='w-4 h-4 text-primary'
                                />
                                Information Cards
                            </label>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={addNewSection}
                                className='h-8 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 rounded-xl px-3 gap-1.5 font-bold text-[10px]'>
                                <HugeiconsIcon icon={PlusSignIcon} size={12} />
                                Add Card
                            </Button>
                        </div>

                        <div className='space-y-4'>
                            {tripSummaryData.sections.map((section, index) =>
                                renderEditableSection(section, index)
                            )}
                        </div>
                    </div>

                    {/* Booking Prompt Toggle */}
                    <div className='pt-6 border-t border-border/50 space-y-6'>
                        <div className='flex items-center justify-between p-4 bg-accent/5 rounded-2xl border border-border/50'>
                            <div className='flex items-center gap-3'>
                                <div className='p-2 bg-primary/10 text-primary rounded-xl'>
                                    <HugeiconsIcon
                                        icon={Settings02Icon}
                                        size={20}
                                    />
                                </div>
                                <div>
                                    <h4 className='font-bold text-sm'>
                                        Booking Promotion
                                    </h4>
                                    <p className='text-[10px] text-muted-foreground font-bold   tracking-tight'>
                                        Show deposit call-to-action
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() =>
                                    setTripSummaryData(prev => ({
                                        ...prev,
                                        showBookingSection:
                                            !prev.showBookingSection,
                                    }))
                                }
                                className={cn(
                                    'w-12 h-6 rounded-full transition-colors relative',
                                    tripSummaryData.showBookingSection
                                        ? 'bg-primary'
                                        : 'bg-muted'
                                )}>
                                <div
                                    className={cn(
                                        'absolute top-1 w-4 h-4 bg-white rounded-full transition-all',
                                        tripSummaryData.showBookingSection
                                            ? 'right-1'
                                            : 'left-1'
                                    )}
                                />
                            </button>
                        </div>

                        {tripSummaryData.showBookingSection && (
                            <div className='space-y-6 animate-in fade-in slide-in-from-top-4 duration-300'>
                                <div className='space-y-2'>
                                    <label className='text-xs font-bold text-muted-foreground   tracking-wider'>
                                        Promo Title
                                    </label>
                                    <input
                                        type='text'
                                        value={tripSummaryData.bookingTitle}
                                        onChange={e =>
                                            setTripSummaryData(prev => ({
                                                ...prev,
                                                bookingTitle: e.target.value,
                                            }))
                                        }
                                        className='w-full h-10 rounded-xl border border-border bg-background px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-xs font-bold text-muted-foreground   tracking-wider'>
                                        Promo Details
                                    </label>
                                    <textarea
                                        value={tripSummaryData.bookingContent}
                                        onChange={e =>
                                            setTripSummaryData(prev => ({
                                                ...prev,
                                                bookingContent: e.target.value,
                                            }))
                                        }
                                        rows={3}
                                        className='w-full rounded-xl border border-border bg-background px-4 py-3 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none'
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </EditingSheetRight>
    );
};

