import { ImageUploadWithSelector } from '@/app/[lang]/admin/(dashboard)/dashboard/components/common/image-upload-selector';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    ArrowDown01Icon,
    Calendar01Icon,
    Calendar04Icon,
    Copy01Icon,
    Delete02Icon,
    Edit02Icon,
    Image01Icon,
    InformationCircleIcon,
    PencilEdit01Icon,
    PlusSignIcon,
    Tick01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { EditingSheetRight } from '../../editing-forms/editing-sheet-right';
import { BlockVariantSelector } from '../common/block-variant-selector';

// Helper component to sync item image with form state and handle collapsible logic
const ItineraryItem = ({
    dayId,
    item,
    index,
    updateItem,
    removeItem,
    expanded,
    toggleExpand,
}) => {
    const { setValue } = useFormContext();
    const fieldName = `itinerary_image_${item.id}`;

    // Sync initial image value to form state so ImageUploadWithSelector can see it via watch()
    useEffect(() => {
        if (item.image) {
            setValue(fieldName, { url: item.image });
        }
    }, [item.image, setValue, fieldName]);

    return (
        <div className='flex flex-col group relative bg-background rounded-xl border border-border overflow-hidden'>
            {/* Item Header - Collapsible Trigger */}
            <div
                className={cn(
                    'flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-accent/5',
                    expanded ? 'bg-accent/5' : ''
                )}
                onClick={() => toggleExpand(item.id)}>
                <div className='w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0'>
                    {index + 1}
                </div>

                <div className='flex-1 min-w-0 grid gap-0.5'>
                    <div className='flex items-center gap-2'>
                        <span className='text-xs font-bold text-primary'>
                            {item.time || '00:00'}
                        </span>
                        <span className='text-xs text-muted-foreground'>•</span>
                        <span className='text-xs font-medium text-foreground truncate'>
                            {item.description || 'New Activity'}
                        </span>
                    </div>
                </div>

                <div className='flex items-center gap-1'>
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            removeItem(dayId, item.id);
                        }}
                        className='p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors'
                        title='Remove Activity'>
                        <HugeiconsIcon icon={Delete02Icon} size={14} />
                    </button>
                    <HugeiconsIcon
                        icon={ArrowDown01Icon}
                        size={16}
                        className={cn(
                            'text-muted-foreground transition-transform duration-200',
                            expanded ? 'rotate-180' : ''
                        )}
                    />
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className='border-t border-border/50'>
                        <div className='p-3 space-y-3'>
                            {/* Time and Title Row */}
                            <div className='space-y-2'>
                                <label className='text-[10px] font-bold text-muted-foreground  '>
                                    Time & Title
                                </label>
                                <div className='flex gap-2'>
                                    <input
                                        type='text'
                                        value={item.time}
                                        onChange={e =>
                                            updateItem(dayId, item.id, {
                                                time: e.target.value,
                                            })
                                        }
                                        className='w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                                        placeholder='Time'
                                    />
                                    <input
                                        type='text'
                                        value={item.description}
                                        onChange={e =>
                                            updateItem(dayId, item.id, {
                                                description: e.target.value,
                                            })
                                        }
                                        className='flex-1 rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                                        placeholder='Activity Title'
                                    />
                                </div>
                            </div>

                            {/* Details Row */}
                            <div className='space-y-1.5'>
                                <label className='text-[10px] font-bold text-muted-foreground  '>
                                    Description / Details (Optional)
                                </label>
                                <textarea
                                    value={item.details || ''}
                                    onChange={e =>
                                        updateItem(dayId, item.id, {
                                            details: e.target.value,
                                        })
                                    }
                                    rows={3}
                                    className='w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none placeholder:text-muted-foreground/30'
                                    placeholder='Add more details about this activity...'
                                />
                            </div>

                            {/* Image Upload */}
                            <div className='space-y-1.5'>
                                <label className='text-[10px] font-bold text-muted-foreground   flex items-center gap-1'>
                                    <HugeiconsIcon
                                        icon={Image01Icon}
                                        size={10}
                                    />
                                    Image (Optional)
                                </label>
                                <ImageUploadWithSelector
                                    fieldName={fieldName}
                                    onChange={fileData => {
                                        // Update form state manually
                                        const imageUrl =
                                            fileData?.url ||
                                            fileData?.image?.url ||
                                            null;
                                        updateItem(dayId, item.id, {
                                            image: imageUrl,
                                        });

                                        // Sync with react-hook-form state for consistency
                                        setValue(fieldName, fileData);
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const ItineraryForm = ({
    isEditing,
    setIsEditing,
    itineraryData,
    setItineraryData,
    handleSave,
    handleCancel,
    addDay,
    removeDay,
    updateDay,
    addItem,
    removeItem,
    updateItem,
    // New props for lifted mode switching
    switchToSingleDay,
    switchToMultiDay,
    watchedVariant,
    isLayoutModalOpen,
    setIsLayoutModalOpen,
    currentLayoutOptions,
    trip,
    onUpdate,
}) => {
    // Mode state: 'single' or 'multi'
    const [mode, setMode] = useState(
        itineraryData.days.length > 1 ? 'multi' : 'single'
    );
    const [pendingModeSwitch, setPendingModeSwitch] = useState(null); // Stores the mode we want to switch TO

    // We maintain expanded state for days in 'multi' mode.
    // In 'single' mode, the concept of expanding a day doesn't apply (it's always shown as flat list).
    const [expandedDays, setExpandedDays] = useState({});
    const [expandedItems, setExpandedItems] = useState({});

    // Track previous day count to detect new additions
    const prevDaysLength = useRef(itineraryData.days.length);

    const methods = useForm({ defaultValues: {} });

    // Sync mode from data if needed, but respect user choice mostly
    useEffect(() => {
        if (itineraryData.days.length > 1 && mode !== 'multi') {
            setMode('multi');
        }

        // Auto-expand new days if added
        if (itineraryData.days.length > prevDaysLength.current) {
            const lastDay = itineraryData.days[itineraryData.days.length - 1];
            if (lastDay) {
                setExpandedDays(prev => ({ ...prev, [lastDay.id]: true }));
            }
        }
        prevDaysLength.current = itineraryData.days.length;
    }, [itineraryData.days.length, mode]);

    // Ensure first day is initially expanded in Multi Mode
    useEffect(() => {
        if (mode === 'multi' && itineraryData.days.length > 0) {
            const currentIds = itineraryData.days.map(d => d.id);
            const hasAnyValidExpanded = currentIds.some(id => expandedDays[id]);

            if (!hasAnyValidExpanded) {
                setExpandedDays({ [itineraryData.days[0].id]: true });
            }
        }
    }, [mode, itineraryData.days]); // Removed expandedDays dependency to prevent loop

    const toggleDay = dayId => {
        // Toggle logic only relevant for multi mode (with headers)
        if (mode === 'single') return;

        setExpandedDays(prev => ({
            ...prev,
            [dayId]: !prev[dayId],
        }));
    };

    const toggleItem = itemId => {
        setExpandedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId],
        }));
    };
    const duplicateDay = dayId => {
        const dayIndex = itineraryData.days.findIndex(d => d.id === dayId);
        if (dayIndex === -1) return;

        const dayToDuplicate = itineraryData.days[dayIndex];
        const newDayId = crypto.randomUUID();
        const newDay = {
            ...dayToDuplicate,
            id: newDayId,
            title: `${dayToDuplicate.title || `Day ${dayIndex + 1}`} (Copy)`,
            items: dayToDuplicate.items.map(item => ({
                ...item,
                id: crypto.randomUUID(),
            })),
        };

        const newDays = [...itineraryData.days];
        newDays.splice(dayIndex + 1, 0, newDay);

        setItineraryData(prev => ({
            ...prev,
            days: newDays,
        }));

        // Auto-expand the new day
        setExpandedDays(prev => ({ ...prev, [newDayId]: true }));
    };

    const attemptSwitchToSingleDay = () => {
        if (mode === 'single') return;

        if (itineraryData.days.length > 1) {
            setPendingModeSwitch('single');
        } else {
            // Safe to switch immediately if no data loss
            performSwitchToSingleDay();
        }
    };

    const performSwitchToSingleDay = () => {
        setMode('single');
        setPendingModeSwitch(null);

        // Execute the parent's logic which handles data backup and restoration
        if (switchToSingleDay) {
            switchToSingleDay();
        }

        setExpandedDays({});
    };

    const handleSwitchToMultiDay = () => {
        if (mode === 'multi') return;
        setMode('multi');

        // Execute parent's logic
        if (switchToMultiDay) {
            switchToMultiDay();
        }

        // Force expand the first day when switching to Multi
        if (itineraryData.days.length > 0) {
            setExpandedDays({ [itineraryData.days[0].id]: true });
        }
    };

    const isMultiDay = mode === 'multi';

    return (
        <EditingSheetRight
            side='right'
            className='lg:min-w-[550px] w-full sm:w-[550px] rounded-l-3xl border-l border-border hide-scrollbar'
            open={isEditing}
            onOpenChange={setIsEditing}>
            <FormProvider {...methods}>
                <div className='h-full flex flex-col bg-background'>
                    {/* Header */}
                    <div className='sticky top-0 z-20 px-6 py-5 flex justify-between items-center bg-card border-b border-border shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-primary/10 text-primary rounded-xl'>
                                <HugeiconsIcon icon={Edit02Icon} size={20} />
                            </div>
                            <h3 className='font-black text-xl tracking-tight'>
                                Edit Itinerary
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
                        <div className='space-y-6'>
                            {currentLayoutOptions && (
                                <BlockVariantSelector
                                    icon={Calendar01Icon}
                                    lucideIconName='Calendar'
                                    label='Layout Style'
                                    watchedVariant={watchedVariant}
                                    isLayoutModalOpen={isLayoutModalOpen}
                                    setIsLayoutModalOpen={setIsLayoutModalOpen}
                                    variants={currentLayoutOptions}
                                    onSelectVariant={variantId => {
                                        setItineraryData(prev => ({
                                            ...prev,
                                            variant: variantId,
                                        }));
                                        onUpdate?.({
                                            ...itineraryData,
                                            variant: variantId,
                                        });
                                        setIsLayoutModalOpen(false);
                                    }}
                                    blockLabel='Itinerary Section'
                                    trip={trip}
                                />
                            )}
                        </div>
                        {/* General Info */}
                        <div className='space-y-6'>
                            <div className='space-y-2'>
                                <label className='text-xs font-bold text-muted-foreground     flex items-center gap-2'>
                                    <HugeiconsIcon
                                        icon={PencilEdit01Icon}
                                        size={14}
                                        className='text-primary'
                                    />
                                    Overall Title
                                </label>
                                <input
                                    type='text'
                                    value={itineraryData.title}
                                    onChange={e =>
                                        setItineraryData(prev => ({
                                            ...prev,
                                            title: e.target.value,
                                        }))
                                    }
                                    className='w-full h-12 rounded-2xl border border-border bg-background px-4 py-2 text-base font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                                    placeholder='e.g., Trip Program'
                                />
                            </div>
                            <div className='space-y-2'>
                                <label className='text-xs font-bold text-muted-foreground     flex items-center gap-2'>
                                    <HugeiconsIcon
                                        icon={InformationCircleIcon}
                                        size={14}
                                        className='text-primary'
                                    />
                                    General Description
                                </label>
                                <textarea
                                    value={itineraryData.shortDescription}
                                    onChange={e =>
                                        setItineraryData(prev => ({
                                            ...prev,
                                            shortDescription: e.target.value,
                                        }))
                                    }
                                    rows={3}
                                    className='w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none'
                                    placeholder='Add a short description...'
                                />
                            </div>
                        </div>

                        {/* Mode Selection */}
                        <div className='p-1 bg-muted rounded-xl flex'>
                            <button
                                onClick={attemptSwitchToSingleDay}
                                className={cn(
                                    'flex-1 py-2 text-xs font-bold   tracking-wider rounded-lg transition-all',
                                    !isMultiDay
                                        ? 'bg-background shadow-sm text-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}>
                                Single Day
                            </button>
                            <button
                                onClick={handleSwitchToMultiDay}
                                className={cn(
                                    'flex-1 py-2 text-xs font-bold   tracking-wider rounded-lg transition-all',
                                    isMultiDay
                                        ? 'bg-background shadow-sm text-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}>
                                Multi Day
                            </button>
                        </div>

                        {/* Days Management */}
                        <div className='space-y-6'>
                            <div className='flex items-center justify-between'>
                                <label className='text-xs font-bold text-muted-foreground     flex items-center gap-2'>
                                    <HugeiconsIcon
                                        icon={Calendar04Icon}
                                        size={14}
                                        className='text-primary'
                                    />
                                    {isMultiDay
                                        ? 'Itinerary Days'
                                        : 'Day Schedule'}
                                </label>
                                {isMultiDay && (
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        onClick={addDay}
                                        className='h-8 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 rounded-xl px-3 gap-1.5 font-bold   tracking-wider text-[10px]'>
                                        <HugeiconsIcon
                                            icon={PlusSignIcon}
                                            size={14}
                                        />
                                        Add Day
                                    </Button>
                                )}
                            </div>

                            <div className='space-y-4'>
                                <AnimatePresence>
                                    {itineraryData.days.map((day, dayIndex) => (
                                        <div
                                            key={day.id}
                                            className={cn(
                                                'border border-border rounded-2xl overflow-hidden bg-card shadow-sm transition-all',
                                                isMultiDay
                                                    ? ''
                                                    : 'border-none shadow-none bg-transparent rounded-none' // Removes card styling in single mode
                                            )}>
                                            {/* Day Header - SHOW ONLY IN MULTI DAY MODE */}
                                            {isMultiDay && (
                                                <div
                                                    className='flex items-center justify-between p-4 cursor-pointer hover:bg-accent/5 transition-colors'
                                                    onClick={() =>
                                                        toggleDay(day.id)
                                                    }>
                                                    <div className='flex items-center gap-4 flex-1'>
                                                        <div className='w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm'>
                                                            {dayIndex + 1}
                                                        </div>
                                                        <div className='flex-1'>
                                                            <h4 className='text-sm font-bold text-foreground'>
                                                                {day.title ||
                                                                    `Day ${
                                                                        dayIndex +
                                                                        1
                                                                    }`}
                                                            </h4>
                                                            <p className='text-xs text-muted-foreground'>
                                                                {day.date ||
                                                                    'No date set'}{' '}
                                                                •{' '}
                                                                {
                                                                    day.items
                                                                        .length
                                                                }{' '}
                                                                items
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className='flex items-center gap-2'>
                                                        <button
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                duplicateDay(
                                                                    day.id
                                                                );
                                                            }}
                                                            className='p-2 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-colors'
                                                            title='Duplicate Day'>
                                                            <HugeiconsIcon
                                                                icon={
                                                                    Copy01Icon
                                                                }
                                                                size={16}
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                removeDay(
                                                                    day.id
                                                                );
                                                            }}
                                                            className='p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors'
                                                            title='Delete Day'>
                                                            <HugeiconsIcon
                                                                icon={
                                                                    Delete02Icon
                                                                }
                                                                size={16}
                                                            />
                                                        </button>
                                                        <HugeiconsIcon
                                                            icon={
                                                                ArrowDown01Icon
                                                            }
                                                            size={16}
                                                            className={cn(
                                                                'text-muted-foreground transition-transform duration-200',
                                                                expandedDays[
                                                                    day.id
                                                                ]
                                                                    ? 'rotate-180'
                                                                    : ''
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Expanded Content */}
                                            <AnimatePresence>
                                                {/* In Single Mode, always show (effectively 'expanded'), otherwise check expandedDays */}
                                                {(isMultiDay
                                                    ? expandedDays[day.id]
                                                    : true) && (
                                                    <motion.div
                                                        initial={{
                                                            height: 0,
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            height: 'auto',
                                                            opacity: 1,
                                                        }}
                                                        exit={{
                                                            height: 0,
                                                            opacity: 0,
                                                        }}
                                                        className={cn(
                                                            'border-t border-border/50 bg-accent/5',
                                                            !isMultiDay &&
                                                                'border-none bg-transparent p-0'
                                                        )}>
                                                        <div
                                                            className={cn(
                                                                'p-4 space-y-6',
                                                                !isMultiDay &&
                                                                    'p-0 space-y-6'
                                                            )}>
                                                            {/* Day Details - ONLY IN MULTI DAY MODE */}
                                                            {isMultiDay && (
                                                                <div className='grid grid-cols-2 gap-4'>
                                                                    <div className='space-y-1.5'>
                                                                        <label className='text-[10px] font-bold text-muted-foreground  '>
                                                                            Day
                                                                            Title
                                                                        </label>
                                                                        <input
                                                                            type='text'
                                                                            value={
                                                                                day.title
                                                                            }
                                                                            onChange={e =>
                                                                                updateDay(
                                                                                    day.id,
                                                                                    {
                                                                                        title: e
                                                                                            .target
                                                                                            .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                            className='w-full h-8 rounded-lg border border-border bg-background px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                                                                            placeholder='e.g. Arrival'
                                                                        />
                                                                    </div>
                                                                    <div className='space-y-1.5'>
                                                                        <label className='text-[10px] font-bold text-muted-foreground  '>
                                                                            Date
                                                                            (Optional)
                                                                        </label>
                                                                        <input
                                                                            type='text'
                                                                            value={
                                                                                day.date
                                                                            }
                                                                            onChange={e =>
                                                                                updateDay(
                                                                                    day.id,
                                                                                    {
                                                                                        date: e
                                                                                            .target
                                                                                            .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                            className='w-full h-8 rounded-lg border border-border bg-background px-3 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                                                                            placeholder='e.g. Jan 10 or Day 1'
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Items List */}
                                                            <div className='space-y-3'>
                                                                <div className='flex items-center justify-between'>
                                                                    <label className='text-[10px] font-bold text-muted-foreground   flex items-center gap-1.5'>
                                                                        <HugeiconsIcon
                                                                            icon={
                                                                                Tick01Icon
                                                                            }
                                                                            size={
                                                                                12
                                                                            }
                                                                        />
                                                                        Activities
                                                                    </label>
                                                                    <Button
                                                                        onClick={() =>
                                                                            addItem(
                                                                                day.id
                                                                            )
                                                                        }
                                                                        variant='ghost'
                                                                        size='sm'
                                                                        className='h-6 text-[10px] font-bold text-primary hover:bg-primary/10 px-2'>
                                                                        <HugeiconsIcon
                                                                            icon={
                                                                                PlusSignIcon
                                                                            }
                                                                            size={
                                                                                12
                                                                            }
                                                                            className='mr-1'
                                                                        />{' '}
                                                                        Add
                                                                        Activity
                                                                    </Button>
                                                                </div>

                                                                <div
                                                                    className={cn(
                                                                        'space-y-3 pl-2',
                                                                        isMultiDay
                                                                            ? 'border-l-2 border-primary/10'
                                                                            : ''
                                                                    )}>
                                                                    {day.items.map(
                                                                        (
                                                                            item,
                                                                            idx
                                                                        ) => (
                                                                            <ItineraryItem
                                                                                key={
                                                                                    item.id
                                                                                }
                                                                                dayId={
                                                                                    day.id
                                                                                }
                                                                                item={
                                                                                    item
                                                                                }
                                                                                index={
                                                                                    idx
                                                                                }
                                                                                updateItem={
                                                                                    updateItem
                                                                                }
                                                                                removeItem={
                                                                                    removeItem
                                                                                }
                                                                                expanded={
                                                                                    expandedItems[
                                                                                        item
                                                                                            .id
                                                                                    ]
                                                                                }
                                                                                toggleExpand={
                                                                                    toggleItem
                                                                                }
                                                                            />
                                                                        )
                                                                    )}
                                                                    {day.items
                                                                        .length ===
                                                                        0 && (
                                                                        <div className='text-xs text-muted-foreground italic pl-2'>
                                                                            No
                                                                            activities
                                                                            added
                                                                            yet.
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </AnimatePresence>

                                {/* Empty State */}
                                {itineraryData.days.length === 0 && (
                                    <div className='text-center py-10 border-2 border-dashed border-border rounded-3xl bg-accent/5'>
                                        <p className='text-sm font-medium text-muted-foreground mb-3'>
                                            No days added to the itinerary yet.
                                        </p>
                                        <Button
                                            onClick={addDay}
                                            variant='default'
                                            size='sm'
                                            className='font-bold'>
                                            Add First Day
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Dialog */}
                    <AlertDialog
                        open={!!pendingModeSwitch}
                        onOpenChange={open =>
                            !open && setPendingModeSwitch(null)
                        }>
                        {/* Force max z-index to overlay sheet */}
                        <AlertDialogContent className='rounded-2xl z-[99999]'>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Switch to Single Day Mode?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will remove all days except the first
                                    one. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className='rounded-xl'>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={performSwitchToSingleDay}
                                    className='bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl'>
                                    Yes, Switch & Remove Days
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </FormProvider>
        </EditingSheetRight>
    );
};

