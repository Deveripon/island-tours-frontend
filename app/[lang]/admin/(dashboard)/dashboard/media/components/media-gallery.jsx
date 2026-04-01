'use client';
import { Permission } from '@/RBAC.config';
import { deleteBulkMedia, deleteMediaById } from '@/app/_actions/mediaActions';
import Spinner from '@/components/svg/spinner';
import { Button } from '@/components/ui/button';
import { useRolePermission } from '@/hooks/useRolePermission';
import { Delete02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import BulkActionSpinner from './bulk-action-spinner';
import DeleteConfirmationDialog from './delete-confimation-dialog';
import MasonrySkeletonWithStyles from './loading-skeliton';
import MediaEditor from './media-editor';
import MediaGridUi from './media-grid-ui';
import MediaListUi from './media-list-ui';
import { MediaUploader } from './media-uploader';
import NoMediaUi from './no-media-ui';

export default function MediaGallery({
    searchTerm = '',
    viewMode = 'grid',
    isFormOpen,
    setIsFormOpen,
    selectMode,
    bulkSelectedItems = [],
    setbulkSelectedItems,
    mediaItems,
    setMediaItems,
    loading,
    selector,
    handleInserToForm,
    currentSelection,
    multiple,
    maxFiles,
}) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const filteredItems = useMemo(() => {
        if (!mediaItems || mediaItems.length === 0) {
            return [];
        }

        if (!searchTerm || searchTerm.trim() === '') {
            return mediaItems;
        }

        const searchLower = searchTerm.toLowerCase();
        return mediaItems.filter(item => {
            return (
                item?.originalName?.toLowerCase().includes(searchLower) ||
                item?.fileName?.toLowerCase().includes(searchLower)
            );
        });
    }, [mediaItems, searchTerm]);

    const handleItemClick = item => {
        if (selectMode) {
            handleItemSelection(item);
        } else {
            setSelectedItem(item);
        }
    };

    const handleItemSelection = selectedItem => {
        if (!selectedItem) return;

        if (selector) {
            // Handle single selection mode
            if (!multiple) {
                setbulkSelectedItems([selectedItem]);
                return;
            }

            // Handle multiple selection mode
            const currentItems = bulkSelectedItems || currentSelection || [];

            // Fix: Compare by ID instead of object reference
            const isAlreadySelected = currentItems.some(
                item => item.id === selectedItem.id
            );

            if (isAlreadySelected) {
                // Remove item if already selected - compare by ID
                setbulkSelectedItems(prev =>
                    (prev || []).filter(item => item.id !== selectedItem.id)
                );
            } else {
                // Add item if not selected, but check max limit first
                if (currentItems.length >= maxFiles) {
                    toast.warning(`Maximum ${maxFiles} images allowed`);
                    return;
                }
                setbulkSelectedItems(prev => [...(prev || []), selectedItem]);
            }
        } else {
            // Non-selector mode logic - also fix here
            setbulkSelectedItems(prev => {
                const currentItems = prev || [];
                const isAlreadySelected = currentItems.some(
                    item => item.id === selectedItem.id
                );

                if (isAlreadySelected) {
                    return currentItems.filter(
                        item => item.id !== selectedItem.id
                    );
                } else {
                    return [...currentItems, selectedItem];
                }
            });
        }
    };

    const handleDeleteItem = id => {
        setIsShowConfirm(true);
        setItemToDelete(id);
    };

    const handleBulkDelete = () => {
        if (bulkSelectedItems.length === 0) return;
        setIsShowConfirm(true);
        setItemToDelete('bulk');
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;

        setIsDeleting(true);

        try {
            if (itemToDelete === 'bulk') {
                // Delete the bulk items
                setMediaItems(prevItems =>
                    prevItems.filter(item => !bulkSelectedItems.includes(item))
                );

                const mediaIds = bulkSelectedItems.map(item => item.id);
                const res = await deleteBulkMedia(mediaIds);

                if (res?.success) {
                    setbulkSelectedItems([]);
                    toast.success(
                        `${res.result.count} media files deleted successfully`
                    );
                }

                if (res?.result?.count < bulkSelectedItems.length) {
                    toast.error('Some files could not be deleted');
                }
            } else {
                // Handle single delete
                setMediaItems(prevItems =>
                    prevItems.filter(item => item.id !== itemToDelete)
                );

                const result = await deleteMediaById(itemToDelete);
                if (result?.success) {
                    toast.success('Media deleted successfully');
                }
            }

            setIsShowConfirm(false);
            setItemToDelete(null);
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCopyUrl = async item => {
        try {
            await navigator.clipboard.writeText(item.url);
            toast.success('Copied');
        } catch (error) {}
    };

    const handleEditItem = item => {
        setSelectedItem(item);
    };

    const getImageHeight = item => {
        if (!item.width || !item.height) return 250;

        const aspectRatio = item.width / item.height;
        const baseWidth = 250;
        let calculatedHeight = baseWidth / aspectRatio;

        return Math.max(200, Math.min(400, calculatedHeight));
    };

    const hasManagePermission = useRolePermission(Permission.MANAGE_MEDIA);
    if (loading) {
        return (
            <div className='border rounded-lg shadow'>
                <div className='min-h-[60vh] mx-auto flex justify-center items-center p-6'>
                    <MasonrySkeletonWithStyles />
                </div>
            </div>
        );
    }

    // When selector is true and item is selected, show side-by-side layout
    if (selector && selectedItem) {
        return (
            <div className=''>
                <div className='flex gap-4 mb-3 h-[70vh]'>
                    {/* Gallery Grid - 70% width */}
                    <div className='w-[70%] border rounded-lg shadow'>
                        <div
                            data-lenis-prevent
                            className='min-h-full max-h-full overflow-y-auto hide-scrollbar mx-auto p-6'>
                            {(!loading && !filteredItems) ||
                            filteredItems.length === 0 ? (
                                <NoMediaUi
                                    searchTerm={searchTerm}
                                    setIsFormOpen={setIsFormOpen}
                                    isDeleting={isDeleting}
                                />
                            ) : (
                                <MediaGridUi
                                    filteredItems={filteredItems}
                                    bulkSelectedItems={bulkSelectedItems}
                                    isDeleting={isDeleting}
                                    itemToDelete={itemToDelete}
                                    handleItemSelection={handleItemSelection}
                                    handleEditItem={handleEditItem}
                                    handleItemClick={handleItemClick}
                                    handleDeleteItem={handleDeleteItem}
                                    selectMode={selectMode}
                                    getImageHeight={getImageHeight}
                                    handleCopyUrl={handleCopyUrl}
                                    selector={selector}
                                />
                            )}
                        </div>
                        {/* Upload Modal */}
                        {/* <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                            <DialogContent className='max-w-4xl z-[999] max-h-[80vh] overflow-y-auto hide-scrollbar'>
                                <DialogHeader>
                                    <DialogTitle>Upload Media</DialogTitle>
                                </DialogHeader>
                                <div className='mt-4'>
                                    <MediaUploader
                                        folder='users/media'
                                        multiple={multiple}
                                        maxFiles={maxFiles || 20}
                                        setMediaItems={setMediaItems}
                                        selector={selector}
                                        setbulkSelectedItems={
                                            setbulkSelectedItems
                                        }
                                        setIsFormOpen={setIsFormOpen}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog> */}
                        <MediaUploader
                            folder='users/media'
                            multiple
                            maxFiles={maxFiles || 50}
                            setMediaItems={setMediaItems}
                            selector={selector}
                            setbulkSelectedItems={setbulkSelectedItems}
                            setIsFormOpen={setIsFormOpen}
                            isFormOpen={isFormOpen}
                            bulkSelectedItems={bulkSelectedItems}
                        />
                    </div>

                    {/* Media Editor - 30% width */}
                    <div className='w-[30%]'>
                        <MediaEditor
                            selector={selector}
                            item={selectedItem}
                            onClose={() => setSelectedItem(null)}
                            onUpdateSuccess={updatedItem => {
                                setMediaItems(prev =>
                                    prev.map(item =>
                                        item.id === updatedItem.id
                                            ? updatedItem
                                            : item
                                    )
                                );
                            }}
                        />
                    </div>
                </div>
                <hr className=' outline-0 border-t border-primary/30' />
                <div className='flex justify-end mt-2 items-center gap-4'>
                    <h5>Selected {bulkSelectedItems.length} items</h5>
                    <div className='flex items-center space-x-4'>
                        <Button
                            onClick={handleInserToForm}
                            size='lg'
                            className='rounded'>
                            Insert
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Selection Header */}
            {!selector && selectMode && (
                <div className='flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg mb-4'>
                    <div className='flex items-center space-x-4'>
                        <h4 className='text-sm font-medium text-foreground'>
                            {bulkSelectedItems.length} item
                            {bulkSelectedItems.length !== 1 ? 's' : ''} selected
                        </h4>
                        {bulkSelectedItems.length > 0 && (
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setbulkSelectedItems([])}
                                className='text-primary border-border hover:bg-accent hover:text-accent-foreground'
                                disabled={isDeleting}>
                                Clear Selection
                            </Button>
                        )}
                    </div>
                    {bulkSelectedItems.length > 0 && hasManagePermission && (
                        <Button
                            variant='destructive'
                            size='sm'
                            onClick={handleBulkDelete}
                            disabled={isDeleting}
                            className='flex items-center relative overflow-hidden'>
                            {isDeleting ? (
                                <>
                                    <Spinner className='h-4 w-4 mr-2 animate-spin' />
                                    <span>Deleting...</span>
                                </>
                            ) : (
                                <>
                                    <HugeiconsIcon
                                        icon={Delete02Icon}
                                        size={16}
                                        className='mr-2'
                                    />
                                    Delete Selected ({bulkSelectedItems.length})
                                </>
                            )}
                        </Button>
                    )}
                </div>
            )}

            {!selectedItem ? (
                <div className='border border-border rounded-lg shadow-sm relative'>
                    <div
                        data-lenis-prevent
                        className={` min-h-[60vh] ${
                            bulkSelectedItems?.length > 0
                                ? 'max-h-[70vh]'
                                : 'max-h-[75vh]'
                        }  overflow-y-auto hide-scrollbar mx-auto p-6`}>
                        {/* Subtle overlay when bulk deleting to show items are being processed */}
                        {itemToDelete === 'bulk' && isDeleting ? (
                            <BulkActionSpinner
                                bulkSelectedItems={bulkSelectedItems.length}
                                title='Deleting Media Files'
                                state='Deleteing'
                            />
                        ) : (
                            <>
                                {!filteredItems ||
                                filteredItems.length === 0 ? (
                                    <NoMediaUi
                                        searchTerm={searchTerm}
                                        setIsFormOpen={setIsFormOpen}
                                        isDeleting={isDeleting}
                                    />
                                ) : viewMode === 'list' ? (
                                    // List View
                                    <MediaListUi
                                        filteredItems={filteredItems}
                                        bulkSelectedItems={bulkSelectedItems}
                                        isDeleting={isDeleting}
                                        itemToDelete={itemToDelete}
                                        handleItemSelection={
                                            handleItemSelection
                                        }
                                        handleEditItem={handleEditItem}
                                        handleItemClick={handleItemClick}
                                        handleDeleteItem={handleDeleteItem}
                                        selectMode={selectMode}
                                        handleCopyUrl={handleCopyUrl}
                                    />
                                ) : (
                                    <MediaGridUi
                                        filteredItems={filteredItems}
                                        bulkSelectedItems={bulkSelectedItems}
                                        isDeleting={isDeleting}
                                        itemToDelete={itemToDelete}
                                        handleItemSelection={
                                            handleItemSelection
                                        }
                                        handleEditItem={handleEditItem}
                                        handleItemClick={handleItemClick}
                                        handleDeleteItem={handleDeleteItem}
                                        selectMode={selectMode}
                                        getImageHeight={getImageHeight}
                                        handleCopyUrl={handleCopyUrl}
                                        selector={selector}
                                    />
                                )}
                            </>
                        )}
                    </div>

                    {/* Upload Modal */}
                    {/*                   <Dialog open={isFormOpen} onO penChange={setIsFormOpen}>
                        <DialogContent className='max-w-4xl z-99999 max-h-[80vh] overflow-y-auto hide-scrollbar'>
                            <DialogHeader>
                                <DialogTitle>Upload Media</DialogTitle>
                            </DialogHeader>
                            <div className='mt-4'>
             
                            </div>
                        </DialogContent>
                    </Dialog> */}
                    <MediaUploader
                        folder='users/media'
                        multiple
                        maxFiles={maxFiles || 50}
                        setMediaItems={setMediaItems}
                        selector={selector}
                        setbulkSelectedItems={setbulkSelectedItems}
                        setIsFormOpen={setIsFormOpen}
                        isFormOpen={isFormOpen}
                        bulkSelectedItems={bulkSelectedItems}
                    />
                    {bulkSelectedItems.length > 0 && (
                        <div className='p-3'>
                            <hr className=' outline-0 border-t border-primary/30' />
                            <div className='flex justify-end mt-2 items-center gap-4'>
                                <h5>
                                    Selected {bulkSelectedItems.length} items
                                </h5>
                                <div className='flex items-center space-x-4'>
                                    <Button
                                        onClick={handleInserToForm}
                                        size='lg'
                                        className='rounded'>
                                        Insert
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className='flex items-center justify-center min-h-[60vh]'>
                    <MediaEditor
                        selector={selector}
                        item={selectedItem}
                        onClose={() => setSelectedItem(null)}
                        onUpdateSuccess={updatedItem => {
                            setMediaItems(prev =>
                                prev.map(item =>
                                    item.id === updatedItem.id
                                        ? updatedItem
                                        : item
                                )
                            );
                        }}
                    />
                </div>
            )}

            {isShowConfirm && (
                <DeleteConfirmationDialog
                    open={isShowConfirm}
                    setOpen={setIsShowConfirm}
                    handleDeleteCancel={() => setIsShowConfirm(false)}
                    handleDeleteConfirm={handleDeleteConfirm}
                />
            )}
        </>
    );
}

