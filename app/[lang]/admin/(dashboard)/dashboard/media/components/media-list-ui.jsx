'use client';
import Spinner from '@/components/svg/spinner';
import { Button } from '@/components/ui/button';
import { useRolePermission } from '@/hooks/useRolePermission';
import { formateDate, formatFileSize } from '@/lib/utils';
import { Permission } from '@/RBAC.config';
import {
    Copy01Icon,
    Delete01Icon,
    PencilEdit02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Check, ExternalLink } from 'lucide-react';
import Image from 'next/image';

const MediaListUi = ({
    filteredItems,
    bulkSelectedItems,
    isDeleting,
    itemToDelete,
    handleItemSelection,
    handleEditItem,
    handleItemClick,
    handleDeleteItem,
    handleCopyUrl,
    selectMode }) => {
    const hasManagePermission = useRolePermission(Permission.MANAGE_MEDIA);

    return (
        <div className='space-y-3 rounded-lg border border-border bg-card shadow-sm'>
            {filteredItems.map(item => {
                const isSelected = bulkSelectedItems.includes(item);
                const isBeingDeleted =
                    itemToDelete === 'bulk' && isDeleting && isSelected;

                return (
                    <div
                        onClick={() => {
                            if (selectMode && !isDeleting) {
                                handleItemSelection(item);
                            } else if (!isDeleting) {
                                handleEditItem(item);
                            }
                        }}
                        key={item.id}
                        className={`flex items-center px-4 py-3 border-b border-border transition-all duration-200 relative last:border-b-0 ${
                            isBeingDeleted
                                ? 'opacity-50 bg-destructive/5 cursor-not-allowed'
                                : isSelected && selectMode
                                ? 'bg-primary/5 ring-1 ring-primary/20 hover:bg-primary/8'
                                : 'hover:bg-accent/30 cursor-pointer'
                        } ${isDeleting ? 'pointer-events-none' : ''}`}>
                        {/* Deletion overlay */}
                        {isBeingDeleted && (
                            <div className='absolute inset-0 flex items-center justify-center bg-destructive/10 rounded-lg backdrop-blur-sm'>
                                <div className='text-destructive font-medium text-sm flex items-center'>
                                    <Spinner className='h-4 w-4 mr-2 animate-spin' />
                                    Deleting...
                                </div>
                            </div>
                        )}

                        {selectMode && (
                            <div className='flex-shrink-0 mr-4'>
                                <div
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                                        isSelected
                                            ? 'bg-primary border-primary text-primary-foreground'
                                            : 'border-border hover:border-primary hover:bg-accent/20'
                                    }`}
                                    onClick={e => {
                                        e.stopPropagation();
                                        !isDeleting &&
                                            handleItemSelection(item);
                                    }}>
                                    {isSelected && (
                                        <Check className='h-4 w-4' />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Thumbnail */}
                        <div
                            className='flex-shrink-0 w-16 h-16 mr-4 cursor-pointer'
                            onClick={e => {
                                e.stopPropagation();
                                !isDeleting && handleItemClick(item);
                            }}>
                            <Image
                                height={200}
                                width={200}
                                src={item.thumbnail || item.url}
                                alt={item.fileName || item.originalName}
                                className='w-full h-full object-cover rounded-md'
                                onError={e => {
                                    e.target.src = '/placeholder-image.png';
                                }}
                            />
                        </div>

                        {/* File Info */}
                        <div className='flex-grow min-w-0'>
                            <h4 className='font-medium max-w-[500px] text-foreground truncate text-sm'>
                                {item.fileName || item.originalName}
                            </h4>
                            <p className='text-xs text-muted-foreground'>
                                {formatFileSize(item.size)} •{' '}
                                {formateDate(item.uploadedAt, 'medium')}
                            </p>
                        </div>

                        {/* Actions */}
                        {!selectMode && !isDeleting && (
                            <div className='flex items-center gap-2 ml-4 flex-shrink-0'>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleCopyUrl(item);
                                    }}
                                    className='h-8 px-2.5 text-xs'>
                                    <HugeiconsIcon icon={Copy01Icon} />
                                    Copy URL
                                </Button>
                                {hasManagePermission && (
                                    <>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleEditItem(item);
                                            }}
                                            className='h-8 px-2.5 text-xs'>
                                            <HugeiconsIcon
                                                icon={PencilEdit02Icon}
                                            />
                                            Edit
                                        </Button>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleDeleteItem(item.id);
                                            }}
                                            className='h-8 px-2.5 text-xs text-destructive hover:text-destructive'>
                                            <HugeiconsIcon
                                                icon={Delete01Icon}
                                            />
                                        </Button>
                                    </>
                                )}

                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={e => {
                                        e.stopPropagation();
                                        window.open(item.url, '_blank');
                                    }}
                                    className='h-8 px-2.5 text-xs'>
                                    <ExternalLink className='h-3.5 w-3.5' />
                                </Button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default MediaListUi;

