import { updateAffiliateTripById } from '@/app/_actions/trips/affiliateTripsAction';
import {
    discardTripDraft,
    getTripDraft,
    saveTripDraft,
} from '@/app/_actions/trips/trip-draft';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { toast } from 'sonner';

const BlockEditContext = createContext(null);

export function BlockEditProvider({ children, trip, defaultBlocks = [] }) {
    const [blocks, setBlocks] = useState(null);
    const [editingBlockId, setEditingBlockId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const tripId = trip?.id;

    // Load initial blocks or draft
    useEffect(() => {
        if (!tripId) return;

        const loadBlocks = async () => {
            try {
                const res = await getTripDraft(tripId);
                if (res.success && res.data) {
                    setBlocks(res.data);
                } else if (trip?.userAddedOptions?.blocks) {
                    setBlocks(trip.userAddedOptions.blocks);
                } else {
                    setBlocks(defaultBlocks);
                }
            } catch (error) {
                console.error('Failed to load blocks:', error);
                setBlocks(defaultBlocks);
            }
        };

        loadBlocks();
    }, [tripId, trip?.userAddedOptions?.blocks, defaultBlocks]);

    // Block CRUD actions
    const addBlock = useCallback((type, data = {}) => {
        const newBlock = {
            id: crypto.randomUUID(),
            type,
            data,
        };
        setBlocks(prev => (prev ? [...prev, newBlock] : [newBlock]));
        setEditingBlockId(newBlock.id);
        return newBlock;
    }, []);

    const removeBlock = useCallback(blockId => {
        setBlocks(prev => prev.filter(block => block.id !== blockId));
    }, []);

    const updateBlockData = useCallback((blockId, newData) => {
        setBlocks(prev =>
            prev
                ? prev.map(block =>
                      block.id === blockId ? { ...block, data: newData } : block
                  )
                : []
        );
    }, []);

    const reorderBlocks = useCallback((activeId, overId) => {
        if (activeId !== overId) {
            setBlocks(items => {
                if (!items) return items;
                const oldIndex = items.findIndex(item => item.id === activeId);
                const newIndex = items.findIndex(item => item.id === overId);

                if (oldIndex === -1 || newIndex === -1) return items;

                const newItems = [...items];
                const [movedItem] = newItems.splice(oldIndex, 1);
                newItems.splice(newIndex, 0, movedItem);
                return newItems;
            });
        }
    }, []);

    // Persistence actions
    const handleSaveDraft = useCallback(async () => {
        if (!blocks || !tripId) return;

        setIsSaving(true);
        const res = await saveTripDraft(tripId, blocks);
        if (res.success) {
            toast.success('Draft saved');
        } else {
            toast.error('Failed to save draft');
        }
        setIsSaving(false);
        return res;
    }, [blocks, tripId]);

    const handlePublish = useCallback(async () => {
        if (!blocks || !tripId) return;

        setIsPublishing(true);
        try {
            const res = await updateAffiliateTripById(tripId, {
                userAddedOptions: {
                    ...trip?.userAddedOptions,
                    blocks: blocks || [],
                },
            });
            await discardTripDraft(tripId);
            toast.success('Published successfully');
            setIsPublishing(false);
            return res;
        } catch (error) {
            console.error('Failed to publish:', error);
            toast.error('Failed to publish');
            setIsPublishing(false);
            throw error;
        }
    }, [blocks, tripId, trip?.userAddedOptions]);

    const handleDiscardDraft = useCallback(async () => {
        if (!tripId) return;

        setIsSaving(true);
        try {
            await discardTripDraft(tripId);
            // Re-load published blocks
            if (trip?.userAddedOptions?.blocks) {
                setBlocks(trip.userAddedOptions.blocks);
            } else {
                setBlocks(defaultBlocks);
            }
            toast.success('Draft discarded');
        } catch (error) {
            toast.error('Failed to discard draft');
        } finally {
            setIsSaving(false);
        }
    }, [tripId, trip?.userAddedOptions?.blocks, defaultBlocks]);

    // Handle global editor events
    useEffect(() => {
        const handleSaveEvent = () => handleSaveDraft();
        const handlePublishEvent = () => handlePublish();
        const handleDiscardEvent = () => handleDiscardDraft();

        document.addEventListener('EDITOR_SAVE_DRAFT', handleSaveEvent);
        document.addEventListener('EDITOR_PUBLISH', handlePublishEvent);
        document.addEventListener('EDITOR_DISCARD', handleDiscardEvent);

        return () => {
            document.removeEventListener('EDITOR_SAVE_DRAFT', handleSaveEvent);
            document.removeEventListener('EDITOR_PUBLISH', handlePublishEvent);
            document.removeEventListener('EDITOR_DISCARD', handleDiscardEvent);
        };
    }, [handleSaveDraft, handlePublish, handleDiscardDraft]);

    // Dispatch status updates for global UI (AdminBar)
    useEffect(() => {
        document.dispatchEvent(
            new CustomEvent('EDITOR_STATUS_UPDATE', {
                detail: { isSaving: isSaving || isPublishing },
            })
        );
    }, [isSaving, isPublishing]);

    const value = useMemo(
        () => ({
            blocks,
            editingBlockId,
            setEditingBlockId,
            isSaving,
            isPublishing,
            actions: {
                addBlock,
                removeBlock,
                updateBlockData,
                reorderBlocks,
                saveDraft: handleSaveDraft,
                publish: handlePublish,
                discardDraft: handleDiscardDraft,
                getBlockState: blockId => ({
                    isEditing: editingBlockId === blockId,
                    setIsEditing: value =>
                        setEditingBlockId(value ? blockId : null),
                    onUpdate: data => updateBlockData(blockId, data),
                    updateData: data => updateBlockData(blockId, data),
                }),
            },
        }),
        [
            blocks,
            editingBlockId,
            isSaving,
            isPublishing,
            addBlock,
            removeBlock,
            updateBlockData,
            reorderBlocks,
            handleSaveDraft,
            handlePublish,
            handleDiscardDraft,
        ]
    );

    return (
        <BlockEditContext.Provider value={value}>
            {children}
        </BlockEditContext.Provider>
    );
}

export function useBlockEdit() {
    const context = useContext(BlockEditContext);
    if (!context) {
        throw new Error('useBlockEdit must be used within BlockEditProvider');
    }
    return context;
}

export function useBlockEditState(blockId) {
    const { actions } = useBlockEdit();
    return actions.getBlockState(blockId);
}

