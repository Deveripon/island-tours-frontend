'use client';
import Spinner from '@/components/svg/spinner';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import MediaItem from './media-item';

const MediaGridUi = ({
    filteredItems,
    bulkSelectedItems = [],
    isDeleting,
    itemToDelete,
    handleItemSelection,
    handleItemClick,
    handleDeleteItem,
    selectMode,
    getImageHeight,
    handleCopyUrl,
    selector }) => {
    function handleMediaClick(item) {
        if (selectMode) {
            handleItemSelection(item);
        } else if (selector) {
            handleItemSelection(item);
            handleItemClick(item);
        } else {
            handleItemClick(item);
        }
    }

    const gridLayout = selector
        ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4'
        : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4';

    return (
        <div className={`w-full ${gridLayout}`}>
            {filteredItems.map((item, index) => {
                const isSelected =
                    bulkSelectedItems &&
                    bulkSelectedItems?.some(
                        selectedItem => selectedItem.id === item.id
                    );

                const isBeingDeleted =
                    itemToDelete === 'bulk' && isDeleting && isSelected;

                const showSelectionUI = selectMode || selector;

                const itemDimensions = selector
                    ? 'aspect-square w-full'
                    : 'aspect-[1/1] w-full';

                return (
                    <div
                        key={item.id}
                        className={`${itemDimensions} relative transition-all duration-200 ${
                            isBeingDeleted
                                ? 'opacity-50'
                                : isSelected && showSelectionUI
                                ? 'ring-2 ring-primary/40 rounded-lg'
                                : ''
                        } ${isDeleting ? 'pointer-events-none' : ''}`}>
                        {isBeingDeleted && (
                            <div className='absolute inset-0 bg-destructive/10 z-20 rounded-lg flex items-center justify-center backdrop-blur-sm'>
                                <div className='text-destructive font-medium text-sm flex flex-col items-center'>
                                    <Spinner className='h-6 w-6 mb-2 animate-spin' />
                                    <span>Deleting...</span>
                                </div>
                            </div>
                        )}

                        {showSelectionUI && (
                            <div className='absolute top-2 left-2 z-30'>
                                <div
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all duration-200 shadow-md ${
                                        isSelected
                                            ? 'bg-primary border-primary text-primary-foreground'
                                            : 'bg-background border-border hover:border-primary hover:bg-accent/20'
                                    }`}
                                    onClick={e => {
                                        e.stopPropagation();
                                        if (!isDeleting) {
                                            handleItemSelection(item);
                                        }
                                    }}>
                                    {isSelected && (
                                        <HugeiconsIcon
                                            icon={Tick02Icon}
                                            size={14}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        <MediaItem
                            item={item}
                            onClick={
                                !isDeleting
                                    ? () => handleMediaClick(item)
                                    : () => {}
                            }
                            onDelete={!isDeleting ? handleDeleteItem : () => {}}
                            onCopyUrl={!isDeleting ? handleCopyUrl : () => {}}
                            viewMode='grid'
                            selectMode={selectMode}
                            className={`h-full w-full rounded-lg overflow-hidden transition-all duration-300 ${
                                !isDeleting
                                    ? 'hover:shadow-md hover:scale-[1.02]'
                                    : ''
                            } ${
                                isSelected && showSelectionUI
                                    ? 'border-2 border-primary shadow-md'
                                    : 'border border-border'
                            }`}
                            selector={selector}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default MediaGridUi;

