'use client';
import { useCallback, useEffect, useState } from 'react';
import { reviewColumns } from './columns';
import { DataTable } from './data-table';

import {
    bulkUpdateReviewStatus,
    deleteMultipleReviewsById,
    updateReviewStatus,
} from '@/app/_actions/reviewActions';
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Calendar,
    CheckCircle2,
    Mail,
    MapPin,
    MessageSquare,
    Star,
    Trash2,
    User,
    XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const PageContent = ({ tenant, reviews }) => {
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [reviewsToDelete, setReviewsToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [activeReview, setActiveReview] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleUpdateStatus = useCallback(
        async (id, status) => {
            setIsUpdating(true);
            try {
                const result = await updateReviewStatus(id, status, tenant);
                if (result?.success) {
                    toast.success(
                        `Review ${status.toLowerCase()} successfully`
                    );
                    if (activeReview?.id === id) {
                        setActiveReview(prev => ({ ...prev, status }));
                    }
                } else {
                    toast.error(
                        result?.error?.message ||
                            'Failed to update review status'
                    );
                }
            } catch (error) {
                toast.error('An unexpected error occurred');
            } finally {
                setIsUpdating(false);
            }
        },
        [tenant, activeReview]
    );

    const handleBulkUpdateStatus = useCallback(
        async (ids, status) => {
            setIsUpdating(true);
            try {
                const result = await bulkUpdateReviewStatus(
                    ids,
                    status,
                    tenant
                );
                if (result?.success) {
                    toast.success(`${ids.length} reviews updated successfully`);
                } else {
                    toast.error(
                        result?.error?.message ||
                            'Failed to update reviews status'
                    );
                }
            } catch (error) {
                toast.error('An unexpected error occurred');
            } finally {
                setIsUpdating(false);
            }
        },
        [tenant]
    );

    const handleDeleteConfirm = async () => {
        if (!reviewsToDelete) return;

        setIsDeleting(true);

        try {
            const result = await deleteMultipleReviewsById(
                reviewsToDelete.ids,
                tenant
            );

            if (result?.success) {
                toast.success('Reviews deleted successfully');
                if (reviewsToDelete.ids.includes(activeReview?.id)) {
                    setIsSheetOpen(false);
                }
            } else {
                toast.error(
                    result?.error?.message || 'Failed to delete reviews'
                );
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsDeleting(false);
            setIsShowConfirm(false);
            setReviewsToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setIsShowConfirm(false);
        setReviewsToDelete(null);
    };

    useEffect(() => {
        const handleStatusUpdate = e => {
            const { id, status } = e.detail;
            handleUpdateStatus(id, status);
        };

        const handleBulkStatusUpdate = e => {
            const { ids, status } = e.detail;
            handleBulkUpdateStatus(ids, status);
        };

        const handleDelete = e => {
            const { ids } = e.detail;
            setReviewsToDelete({ ids });
            setIsShowConfirm(true);
        };

        const handleViewReview = e => {
            const { review } = e.detail;
            setActiveReview(review);
            setIsSheetOpen(true);
        };

        document.addEventListener('update-review-status', handleStatusUpdate);
        document.addEventListener('bulk-update-status', handleBulkStatusUpdate);
        document.addEventListener('delete-reviews', handleDelete);
        document.addEventListener('view-review', handleViewReview);

        return () => {
            document.removeEventListener(
                'update-review-status',
                handleStatusUpdate
            );
            document.removeEventListener(
                'bulk-update-status',
                handleBulkStatusUpdate
            );
            document.removeEventListener('delete-reviews', handleDelete);
            document.removeEventListener('view-review', handleViewReview);
        };
    }, [handleUpdateStatus, handleBulkUpdateStatus]);

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                    <h1 className='text-2xl font-semibold tracking-tight'>
                        Trip Reviews
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Manage and moderate customer reviews for your trips
                    </p>
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                isUpdating={isUpdating}
                isDeleting={isDeleting}
                columns={reviewColumns}
                data={reviews || []}
            />

            {/* Review Details Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className='sm:max-w-[480px] p-0 overflow-y-auto bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800/80'>
                    {/* Header */}
                    <div className='px-6 py-5 border-b border-zinc-100 dark:border-zinc-800/50 flex flex-col gap-4'>
                        <div className='flex items-center justify-between'>
                            <Badge
                                variant='outline'
                                className={cn(
                                    'capitalize border-0 font-medium px-2.5 py-0.5 rounded-full text-xs',
                                    activeReview?.status === 'APPROVED' && 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
                                    activeReview?.status === 'REJECTED' && 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
                                    activeReview?.status === 'PENDING' && 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
                                    (!activeReview?.status || activeReview?.status === 'SECONDARY') && 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
                                )}>
                                {activeReview?.status?.toLowerCase()}
                            </Badge>
                            <span className='text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider'>
                                <Calendar className='h-3 w-3' />
                                {activeReview?.createdAt &&
                                    new Date(activeReview.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                            </span>
                        </div>
                        <SheetTitle className='text-xl font-semibold text-zinc-900 dark:text-zinc-100'>
                            {activeReview?.title || 'Review Details'}
                        </SheetTitle>
                    </div>

                    {activeReview && (
                        <div className='px-6 py-6 space-y-8'>
                            {/* Reviewer / Trip Info Block */}
                            <div className='flex flex-col gap-6'>
                                <div className='flex items-center gap-4'>
                                    <Avatar className='h-10 w-10 ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-full'>
                                        <AvatarImage src={activeReview.reviewerAvatar} />
                                        <AvatarFallback className='bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium text-sm'>
                                            {activeReview.reviewerName?.charAt(0).toUpperCase() || 'R'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <span className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
                                            {activeReview.reviewerName || 'Anonymous'}
                                        </span>
                                        <span className='text-[13px] text-zinc-500 dark:text-zinc-400'>
                                            {activeReview.reviewerEmail}
                                        </span>
                                    </div>
                                </div>

                                <div className='flex flex-col gap-1.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50'>
                                    <span className='text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide'>
                                        Target Trip
                                    </span>
                                    <span className='text-sm font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-2'>
                                        <MapPin className='h-3.5 w-3.5 text-zinc-400' />
                                        {activeReview.trip?.title}
                                    </span>
                                </div>
                            </div>

                            {/* Stars & Text */}
                            <div className='space-y-4'>
                                <div className='flex items-center gap-1'>
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                'h-4 w-4 drop-shadow-sm',
                                                i < activeReview.rating
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'fill-zinc-200 text-zinc-200 dark:fill-zinc-800 dark:text-zinc-800'
                                            )}
                                        />
                                    ))}
                                </div>
                                <div className='relative'>
                                    <p className='text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap font-serif italic'>
                                        "{activeReview.content}"
                                    </p>
                                </div>
                            </div>

                            {/* Attachments */}
                            {(activeReview.images?.length > 0 || activeReview.videos?.length > 0) && (
                                <div className='space-y-3 pt-6 border-t border-zinc-100 dark:border-zinc-800/50'>
                                    <span className='text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide'>
                                        Attachments
                                    </span>
                                    <div className='grid grid-cols-2 gap-3'>
                                        {activeReview.images?.map((img, idx) => (
                                            <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                                <img
                                                    src={img}
                                                    alt={`Review ${idx}`}
                                                    className='object-cover w-full h-full hover:scale-105 transition-transform duration-300'
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className='pt-8 space-y-3'>
                                {activeReview.status !== 'APPROVED' && (
                                    <Button
                                        onClick={() => handleUpdateStatus(activeReview.id, 'APPROVED')}
                                        disabled={isUpdating}
                                        className='w-full h-10 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-medium transition-colors gap-2'>
                                        <CheckCircle2 className='h-4 w-4' />
                                        Approve Review
                                    </Button>
                                )}
                                {activeReview.status !== 'REJECTED' && (
                                    <Button
                                        variant='outline'
                                        onClick={() => handleUpdateStatus(activeReview.id, 'REJECTED')}
                                        disabled={isUpdating}
                                        className='w-full h-10 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-medium transition-colors gap-2'>
                                        <XCircle className='h-4 w-4' />
                                        Reject Review
                                    </Button>
                                )}
                                <Button
                                    variant='ghost'
                                    onClick={() => {
                                        setReviewsToDelete({ ids: [activeReview.id] });
                                        setIsShowConfirm(true);
                                    }}
                                    disabled={isDeleting}
                                    className='w-full h-10 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-500/10 font-medium transition-colors gap-2'>
                                    <Trash2 className='h-4 w-4' />
                                    Delete Forever
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isShowConfirm} onOpenChange={setIsShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete{' '}
                            {reviewsToDelete?.ids?.length > 1
                                ? 'these reviews'
                                : 'this review'}{' '}
                            and all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={handleDeleteCancel}
                            disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default PageContent;

