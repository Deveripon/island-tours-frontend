import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    ActivityIcon,
    ArrowDown01Icon,
    Delete02Icon,
    Edit02Icon,
    InformationCircleIcon,
    LeftToRightListNumberIcon,
    PencilEdit01Icon,
    PlusSignIcon,
    Settings02Icon,
    Tick01Icon,
    TypeCursorIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { EditingSheetRight } from '../../editing-forms/editing-sheet-right';

export const ExperienceForm = ({
    isEditing,
    setIsEditing,
    experienceData,
    setExperienceData,
    handleSave,
    handleCancel,
    updateSection,
    deleteSection,
    addNewSection,
    toggleSectionCollapse,
    collapsedSections,
    renderIcon,
    sectionTypes,
    iconCategories,
}) => {
    // Type Selector Component with Visual Previews
    const TypeSelector = ({ value, onChange, className = '' }) => {
        const [isOpen, setIsOpen] = useState(false);
        const selectedType = sectionTypes.find(type => type.value === value);

        return (
            <div className={`relative ${className}`}>
                <button
                    type='button'
                    onClick={() => setIsOpen(!isOpen)}
                    className='flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-bold text-foreground hover:border-primary/50 transition-all min-w-[130px] shadow-sm'>
                    {selectedType && (
                        <HugeiconsIcon
                            icon={selectedType.icon}
                            size={14}
                            className='text-primary'
                        />
                    )}
                    <span className='flex-1 text-left truncate'>
                        {selectedType?.label || 'Select Type'}
                    </span>
                    <HugeiconsIcon
                        icon={ArrowDown01Icon}
                        size={12}
                        className={cn(
                            'text-muted-foreground transition-transform duration-300',
                            isOpen && 'rotate-180'
                        )}
                    />
                </button>

                {isOpen && (
                    <div
                        data-lenis-prevent
                        onWheel={e => e.stopPropagation()}
                        className='absolute right-2 z-[1001] mt-2 w-64 max-h-[260px] overflow-y-auto bg-card rounded-2xl shadow-xl border border-border p-2 animate-in fade-in zoom-in duration-200 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent overscroll-contain touch-pan-y'>
                        <div className='space-y-1'>
                            {sectionTypes.map(type => (
                                <button
                                    key={type.value}
                                    onClick={() => {
                                        onChange(type.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        'w-full p-3 text-left transition-all rounded-xl border',
                                        value === type.value
                                            ? 'bg-primary/5 border-primary/20 text-primary'
                                            : 'border-transparent text-foreground hover:bg-accent/50 hover:border-border'
                                    )}>
                                    <div className='flex items-center gap-3'>
                                        <div
                                            className={cn(
                                                'p-2 rounded-lg',
                                                value === type.value
                                                    ? 'bg-primary text-white'
                                                    : 'bg-muted text-muted-foreground'
                                            )}>
                                            <HugeiconsIcon
                                                icon={type.icon}
                                                size={16}
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <div className='font-bold text-xs   tracking-tight'>
                                                {type.label}
                                            </div>
                                            <div className='mt-2 scale-90 origin-left opacity-60'>
                                                {type.preview}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {isOpen && (
                    <div
                        className='fixed inset-0 z-[90]'
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </div>
        );
    };

    // Custom Icon Selector Component
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
                                        <div className='w-5 h-5 mb-1'>
                                            {renderIcon(
                                                icon.value,
                                                'w-full h-full'
                                            )}
                                        </div>
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
                    'rounded-2xl border transition-all duration-300 relative',
                    isCollapsed
                        ? 'overflow-hidden border-border bg-accent/5 hover:border-primary/40'
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
                            <div className='w-5 h-5'>
                                {renderIcon(section.icon)}
                            </div>
                        </div>
                        <div className='overflow-hidden'>
                            <h4
                                className={cn(
                                    'font-bold text-sm truncate pr-4',
                                    isCollapsed
                                        ? 'text-foreground'
                                        : 'text-primary'
                                )}>
                                {section.title || 'Untitled Section'}
                            </h4>
                            <p className='text-[10px] text-muted-foreground   font-bold tracking-tight'>
                                {
                                    sectionTypes.find(
                                        t => t.value === section.type
                                    )?.label
                                }{' '}
                                •{' '}
                                {section.type === 'bullet-list' ||
                                section.type === 'check-list'
                                    ? `${section.items?.length || 0} items`
                                    : 'Text content'}
                            </p>
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <div
                            onClick={e => {
                                e.stopPropagation();
                                deleteSection(section.id);
                            }}
                            className='p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover/item:opacity-100 hidden lg:block'>
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
                                {/* Section Configuration */}
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='space-y-1.5'>
                                        <label className='text-[10px] font-bold text-muted-foreground     flex items-center gap-1.5'>
                                            <HugeiconsIcon
                                                icon={TypeCursorIcon}
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
                                            className='w-full h-10 rounded-xl border border-border bg-background px-4 py-1 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium'
                                            placeholder='e.g., Highlights'
                                        />
                                    </div>
                                    <div className='space-y-1.5'>
                                        <label className='text-[10px] font-bold text-muted-foreground     flex items-center gap-1.5'>
                                            <HugeiconsIcon
                                                icon={ActivityIcon}
                                                size={10}
                                                className='text-primary'
                                            />
                                            Layout Type
                                        </label>
                                        <TypeSelector
                                            value={section.type}
                                            onChange={typeValue =>
                                                updateSection(section.id, {
                                                    type: typeValue,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Subtitle for applicable sections */}
                                {(section.type === 'bullet-list' ||
                                    section.type === 'check-list') && (
                                    <div className='space-y-1.5'>
                                        <label className='text-[10px] font-bold text-muted-foreground     flex items-center gap-1.5'>
                                            <HugeiconsIcon
                                                icon={PencilEdit01Icon}
                                                size={10}
                                                className='text-primary'
                                            />
                                            Optional Subtitle
                                        </label>
                                        <input
                                            type='text'
                                            value={section.subtitle || ''}
                                            onChange={e =>
                                                updateSection(section.id, {
                                                    subtitle: e.target.value,
                                                })
                                            }
                                            className='w-full h-10 rounded-xl border border-border bg-background px-4 py-1 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium'
                                            placeholder='e.g., Available at an extra cost'
                                        />
                                    </div>
                                )}

                                {/* Icon Grid Selector */}
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

                                {/* Content based on section type */}
                                {(section.type === 'bullet-list' ||
                                    section.type === 'check-list') && (
                                    <div className='space-y-3'>
                                        <label className='text-[10px] font-bold text-muted-foreground     flex items-center gap-1.5'>
                                            <HugeiconsIcon
                                                icon={LeftToRightListNumberIcon}
                                                size={10}
                                                className='text-primary'
                                            />
                                            List Items
                                        </label>
                                        <div className='space-y-2'>
                                            {section.items?.map(
                                                (item, itemIndex) => (
                                                    <div
                                                        key={itemIndex}
                                                        className='group/line flex gap-2 items-center'>
                                                        <div className='flex-1 flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all'>
                                                            <span className='text-[10px] font-bold text-primary opacity-50'>
                                                                {itemIndex + 1}
                                                            </span>
                                                            <input
                                                                type='text'
                                                                value={item}
                                                                onChange={e => {
                                                                    const newItems =
                                                                        [
                                                                            ...(section.items ||
                                                                                []),
                                                                        ];
                                                                    newItems[
                                                                        itemIndex
                                                                    ] =
                                                                        e.target.value;
                                                                    updateSection(
                                                                        section.id,
                                                                        {
                                                                            items: newItems,
                                                                        }
                                                                    );
                                                                }}
                                                                className='bg-transparent text-sm outline-none w-full font-medium'
                                                                placeholder='Add info...'
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                const newItems =
                                                                    section.items.filter(
                                                                        (
                                                                            _,
                                                                            i
                                                                        ) =>
                                                                            i !==
                                                                            itemIndex
                                                                    );
                                                                updateSection(
                                                                    section.id,
                                                                    {
                                                                        items: newItems,
                                                                    }
                                                                );
                                                            }}
                                                            className='p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all opacity-0 group-line/line:opacity-100'>
                                                            <HugeiconsIcon
                                                                icon={
                                                                    Delete02Icon
                                                                }
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
                                                    items: [
                                                        ...(section.items ||
                                                            []),
                                                        'New Item',
                                                    ],
                                                });
                                            }}
                                            className='w-full h-9 bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary rounded-xl text-xs gap-2 font-bold   tracking-wider'>
                                            <HugeiconsIcon
                                                icon={PlusSignIcon}
                                                size={14}
                                            />
                                            Add List Item
                                        </Button>
                                    </div>
                                )}

                                {(section.type === 'description' ||
                                    section.type === 'single-paragraph') && (
                                    <div className='space-y-1.5'>
                                        <label className='text-[10px] font-bold text-muted-foreground     flex items-center gap-1.5'>
                                            <HugeiconsIcon
                                                icon={LeftToRightListNumberIcon}
                                                size={10}
                                                className='text-primary'
                                            />
                                            {section.type === 'description'
                                                ? 'Full Description'
                                                : 'Paragraph Text'}
                                        </label>
                                        <textarea
                                            value={section.content || ''}
                                            onChange={e =>
                                                updateSection(section.id, {
                                                    content: e.target.value,
                                                })
                                            }
                                            rows={
                                                section.type === 'description'
                                                    ? 8
                                                    : 4
                                            }
                                            className='w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none'
                                            placeholder='Add content here...'
                                        />
                                    </div>
                                )}

                                {section.type === 'meeting-info' && (
                                    <div className='space-y-4 pt-2'>
                                        <div className='space-y-1.5'>
                                            <label className='text-[10px] font-bold text-muted-foreground    '>
                                                Location Details
                                            </label>
                                            <input
                                                type='text'
                                                value={section.location || ''}
                                                onChange={e =>
                                                    updateSection(section.id, {
                                                        location:
                                                            e.target.value,
                                                    })
                                                }
                                                className='w-full h-10 rounded-xl border border-border bg-background px-4 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                                                placeholder='e.g., The pier of Santa Barbara Beach'
                                            />
                                        </div>
                                        <div className='space-y-1.5'>
                                            <label className='text-[10px] font-bold text-muted-foreground    '>
                                                Timing
                                            </label>
                                            <input
                                                type='text'
                                                value={section.time || ''}
                                                onChange={e =>
                                                    updateSection(section.id, {
                                                        time: e.target.value,
                                                    })
                                                }
                                                className='w-full h-10 rounded-xl border border-border bg-background px-4 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                                                placeholder='e.g., Boat departure time: 07:30 AM'
                                            />
                                        </div>
                                        <div className='grid grid-cols-2 gap-3'>
                                            <div className='space-y-1.5'>
                                                <label className='text-[10px] font-bold text-muted-foreground    '>
                                                    Button Text
                                                </label>
                                                <input
                                                    type='text'
                                                    value={
                                                        section.linkText || ''
                                                    }
                                                    onChange={e =>
                                                        updateSection(
                                                            section.id,
                                                            {
                                                                linkText:
                                                                    e.target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                    className='w-full h-10 rounded-xl border border-border bg-background px-4 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                                                />
                                            </div>
                                            <div className='space-y-1.5'>
                                                <label className='text-[10px] font-bold text-muted-foreground    '>
                                                    Maps URL
                                                </label>
                                                <input
                                                    type='text'
                                                    value={
                                                        section.linkUrl || ''
                                                    }
                                                    onChange={e =>
                                                        updateSection(
                                                            section.id,
                                                            {
                                                                linkUrl:
                                                                    e.target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                    className='w-full h-10 rounded-xl border border-border bg-background px-4 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                {/* Premium Header - Matched with ExperienceSection */}
                <div className='sticky top-0 z-20 px-6 py-5 flex justify-between items-center bg-card border-b border-border shadow-sm'>
                    <div className='flex items-center gap-3'>
                        <div className='p-2 bg-primary/10 text-primary rounded-xl'>
                            <HugeiconsIcon icon={Edit02Icon} size={20} />
                        </div>
                        <h3 className='font-black text-xl tracking-tight'>
                            Edit Experience
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

                <div
                    className='flex-1 overflow-y-auto px-6 py-8 space-y-10 hide-scrollbar'
                    data-lenis-prevent>
                    {/* Title & Top Description */}
                    <div className='space-y-6'>
                        <div className='space-y-2'>
                            <label className='text-xs font-bold text-muted-foreground     flex items-center gap-2'>
                                <HugeiconsIcon
                                    icon={PencilEdit01Icon}
                                    size={14}
                                    className='text-primary'
                                />
                                Block Heading
                            </label>
                            <input
                                type='text'
                                value={experienceData.title}
                                onChange={e =>
                                    setExperienceData(prev => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                                className='w-full h-12 rounded-2xl border border-border bg-background px-4 py-2 text-base font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                                placeholder='e.g., Experience'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-xs font-bold text-muted-foreground     flex items-center gap-2'>
                                <HugeiconsIcon
                                    icon={InformationCircleIcon}
                                    size={14}
                                    className='text-primary'
                                />
                                Introduction text
                            </label>
                            <textarea
                                value={experienceData.shortDescription}
                                onChange={e =>
                                    setExperienceData(prev => ({
                                        ...prev,
                                        shortDescription: e.target.value,
                                    }))
                                }
                                rows={3}
                                className='w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none'
                                placeholder='Add a brief intro for the experience block...'
                            />
                        </div>
                    </div>

                    {/* Dynamic Sections */}
                    <div className='space-y-6'>
                        <div className='flex items-center justify-between'>
                            <label className='text-xs font-bold text-muted-foreground     flex items-center gap-2'>
                                <HugeiconsIcon
                                    icon={Tick01Icon}
                                    size={14}
                                    className='text-primary'
                                />
                                Content Sections
                            </label>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={addNewSection}
                                className='h-8 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 rounded-xl px-3 gap-1.5 font-bold   tracking-wider text-[10px]'>
                                <HugeiconsIcon icon={PlusSignIcon} size={14} />
                                Add Section
                            </Button>
                        </div>

                        <div className='space-y-4'>
                            {experienceData.sections.map((section, index) =>
                                renderEditableSection(section, index)
                            )}
                        </div>
                    </div>

                    {/* Booking Promotion Toggle */}
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
                                    setExperienceData(prev => ({
                                        ...prev,
                                        showBookingButton:
                                            !prev.showBookingButton,
                                    }))
                                }
                                className={cn(
                                    'w-12 h-6 rounded-full transition-colors relative',
                                    experienceData.showBookingButton
                                        ? 'bg-primary'
                                        : 'bg-muted'
                                )}>
                                <div
                                    className={cn(
                                        'absolute top-1 w-4 h-4 bg-white rounded-full transition-all',
                                        experienceData.showBookingButton
                                            ? 'right-1'
                                            : 'left-1'
                                    )}
                                />
                            </button>
                        </div>

                        {experienceData.showBookingButton && (
                            <div className='space-y-6 animate-in fade-in slide-in-from-top-4 duration-300'>
                                <div className='space-y-2'>
                                    <label className='text-xs font-bold text-muted-foreground   tracking-wider'>
                                        Promo Title
                                    </label>
                                    <input
                                        type='text'
                                        value={experienceData.bookingTitle}
                                        onChange={e =>
                                            setExperienceData(prev => ({
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
                                        value={experienceData.bookingContent}
                                        onChange={e =>
                                            setExperienceData(prev => ({
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

