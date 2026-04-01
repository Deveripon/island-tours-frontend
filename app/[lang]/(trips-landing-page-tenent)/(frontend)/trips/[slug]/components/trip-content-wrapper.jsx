'use client';
import { saveTripDraft } from '@/app/_actions/trips/trip-draft';
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
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAdmin } from '../../../../hooks/useAdmin';
import BlockLibrarySidebar from './blocks/block-library-sidebar';
import {
    BLOCK_COMPONENTS,
    DEFAULT_BLOCKS,
    DEMO_CONTENT,
} from './blocks/block-registry';
import {
    BlockEditProvider,
    useBlockEdit,
} from './blocks/context/block-edit-context';
import DemoOverlay from './blocks/demo-overlay';
import SortableBlock from './blocks/sortable-block';
import BookingSidebar from './booking-sidebar';

const TripContentWrapperInner = ({
    trip,
    tenantId,
    paymentMethod,
    bookingForm,
}) => {
    const { mode, MODES, setMode, isAdmin } = useAdmin();
    const { blocks, actions } = useBlockEdit();

    const isEditMode = mode === MODES.edit;
    const isPreviewMode = mode === MODES.preview;

    const [isLoading, setIsLoading] = useState(false);
    const [showDemoOverlay, setShowDemoOverlay] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [activeId, setActiveId] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: '',
        description: '',
        onConfirm: () => {},
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        variant: 'default',
    });

    // Demo Overlay logic
    useEffect(() => {
        const hasDbBlocks = trip?.userAddedOptions?.blocks?.length > 0;
        const hasBlocks = blocks?.length > 2;

        if (isPreviewMode && !hasDbBlocks && !hasBlocks) {
            setShowDemoOverlay(true);
        } else {
            setShowDemoOverlay(false);
        }
    }, [isPreviewMode, trip, blocks]);

    const handleLoadDemo = async () => {
        setIsLoading(true);
        setLoadingProgress(0);

        const progressInterval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 95) return prev;
                return prev + (100 - prev) * 0.1;
            });
        }, 100);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            await saveTripDraft(trip.id, DEMO_CONTENT);
            // We manually set blocks here to avoid re-triggering the load effect immediately
            // but the context should pick it up. For simplicity, we can reload.
            window.location.reload(); // Simplest way to ensure everything is in sync after demo load
        } catch (error) {
            console.error('Failed to load demo content:', error);
            toast.error('Failed to load demo content');
        } finally {
            clearInterval(progressInterval);
            setIsLoading(false);
        }
    };

    const handleSelfEdit = () => {
        setShowDemoOverlay(false);
        setMode(MODES.edit);
    };

    const handleAddBlock = (type, data = {}) => {
        actions.addBlock(type, data);
        setShowSidebar(false);
    };

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = event => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = event => {
        const { active, over } = event;
        if (active && over) {
            actions.reorderBlocks(active.id, over.id);
        }
        setActiveId(null);
    };

    const renderBlocks = () => {
        const displayBlocks = blocks || [];

        if (displayBlocks.length === 0) {
            if (isEditMode) {
                return (
                    <div className='flex flex-col items-center justify-center py-10 px-6 border border-dashed border-foreground/10 hover:border-primary/50 transition-all rounded-lg bg-background backdrop-blur-sm'>
                        <div className='w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 text-primary ring-1 ring-primary/20'>
                            <Plus className='w-8 h-8' />
                        </div>
                        <p className='text-foreground text-sm mb-8 max-w-[240px] text-center font-medium'>
                            Your layout is currently empty. Start by adding your
                            first section.
                        </p>
                        <Button
                            onClick={() => setShowSidebar(true)}
                            className='h-12 px-8 rounded-lg bg-primary hover:bg-primary/90 text-foreground shadow-xl shadow-primary/20 transition-all active:scale-95'>
                            <Plus className='w-4 h-4' /> Add Component
                        </Button>
                    </div>
                );
            }
            return null;
        }

        const blocksContent = displayBlocks.map((block, index) => {
            const Component = BLOCK_COMPONENTS[block.type];
            if (!Component) return null;

            if (!isEditMode) {
                return (
                    <div key={block.id || index} className='mb-20 last:mb-0'>
                        <Component
                            trip={trip}
                            tenantId={tenantId}
                            data={block.data}
                            id={block.id}
                            isBlock={true}
                        />
                    </div>
                );
            }

            return (
                <SortableBlock
                    key={block.id || index}
                    id={block.id}
                    isEditMode={isEditMode}
                    onDelete={() => actions.removeBlock(block.id)}>
                    <Component
                        trip={trip}
                        tenantId={tenantId}
                        data={block.data}
                        id={block.id}
                        isBlock={true}
                    />
                </SortableBlock>
            );
        });

        if (!isEditMode) {
            return <div className='space-y-0'>{blocksContent}</div>;
        }

        return (
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}>
                <SortableContext
                    items={displayBlocks}
                    strategy={verticalListSortingStrategy}>
                    <div className='space-y-0'>{blocksContent}</div>
                </SortableContext>
                <DragOverlay dropAnimation={null}>
                    {activeId ? (
                        <div className='opacity-80 scale-[1.02] shadow-2xl rounded-xl overflow-hidden cursor-grabbing'>
                            {(() => {
                                const activeBlock = displayBlocks.find(
                                    b => b.id === activeId
                                );
                                if (!activeBlock) return null;
                                const Component =
                                    BLOCK_COMPONENTS[activeBlock.type];
                                if (!Component) return null;
                                return (
                                    <Component
                                        trip={trip}
                                        tenantId={tenantId}
                                        data={activeBlock.data}
                                        id={activeBlock.id}
                                        isBlock={true}
                                        isDragging={true}
                                    />
                                );
                            })()}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        );
    };

    const handleDiscard = () => {
        setConfirmDialog({
            isOpen: true,
            title: 'Discard Draft?',
            description:
                'This will permanently discard your current unsaved changes and revert to the last published version. This action cannot be undone.',
            confirmText: 'Discard Changes',
            cancelText: 'Keep Editing',
            variant: 'destructive',
            onConfirm: async () => {
                await actions.discardDraft();
            },
        });
    };

    return (
        <>
            <BlockLibrarySidebar
                open={showSidebar}
                onOpenChange={setShowSidebar}
                onAddBlock={handleAddBlock}
                trip={trip}
                tenantId={tenantId}
            />

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12'>
                <div
                    className={cn(
                        'lg:col-span-9 mt-6 space-y-20',
                        !trip?.datesAvailability?.onlyUponRequest &&
                            bookingForm === 'v4' &&
                            'lg:col-span-8'
                    )}>
                    {renderBlocks()}

                    {showDemoOverlay && isAdmin && (
                        <DemoOverlay
                            onLoadDemo={handleLoadDemo}
                            onSelfEdit={handleSelfEdit}
                            isLoading={isLoading}
                            progress={loadingProgress}
                        />
                    )}

                    {isEditMode && blocks?.length > 0 && (
                        <div className='border p-8 border-dashed hover:border-primary/50 transition-all border-foreground/10 rounded-lg flex justify-center'>
                            <button
                                onClick={() => setShowSidebar(true)}
                                className='group relative flex flex-col items-center gap-4 transition-all'>
                                <div className='w-14 h-14 rounded-full border border-dashed border-foreground/10 flex items-center justify-center bg-background group-hover:bg-primary/10 group-hover:border-primary/50 group-hover:scale-105 transition-all duration-300'>
                                    <Plus className='w-6 h-6 text-foreground/40 group-hover:text-primary transition-colors' />
                                </div>
                                <span className='text-[10px]  text-foreground/20 group-hover:text-primary transition-colors'>
                                    Add Section
                                </span>
                            </button>
                        </div>
                    )}
                </div>

                <BookingSidebar
                    trip={trip}
                    tenantId={tenantId}
                    paymentMethod={paymentMethod}
                    bookingForm={bookingForm}
                />
            </div>

            <ConfirmationDialog
                dialog={confirmDialog}
                setDialog={setConfirmDialog}
            />
        </>
    );
};

const ConfirmationDialog = ({ dialog, setDialog }) => (
    <AlertDialog
        open={dialog.isOpen}
        onOpenChange={open => setDialog(prev => ({ ...prev, isOpen: open }))}>
        <AlertDialogContent className='bg-zinc-900 border-white/10 text-white rounded-2xl'>
            <AlertDialogHeader>
                <AlertDialogTitle className='text-xl font-bold'>
                    {dialog.title}
                </AlertDialogTitle>
                <AlertDialogDescription className='text-white/60 text-sm'>
                    {dialog.description}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className='mt-6 gap-3'>
                <AlertDialogCancel className='rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white'>
                    {dialog.cancelText}
                </AlertDialogCancel>
                <AlertDialogAction
                    onClick={dialog.onConfirm}
                    className={cn(
                        'rounded-xl font-bold',
                        dialog.variant === 'destructive'
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-primary hover:bg-primary/90 text-white'
                    )}>
                    {dialog.confirmText}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);

const TripContentWrapper = props => (
    <BlockEditProvider trip={props.trip} defaultBlocks={DEFAULT_BLOCKS}>
        <TripContentWrapperInner {...props} />
    </BlockEditProvider>
);

export default TripContentWrapper;

