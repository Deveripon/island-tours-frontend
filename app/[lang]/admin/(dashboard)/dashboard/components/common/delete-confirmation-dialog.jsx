'use client';

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
const DeleteConfirmationDialog = ({
    isShowConfirm,
    setIsShowConfirm,
    handleDeleteConfirm,
    handleDeleteCancel,
    isDeleting,
    title = 'Are you absolutely sure?',
    description = 'This action cannot be undone. This will permanently delete this and all associated data.' }) => {
    return (
        <AlertDialog  open={isShowConfirm} onOpenChange={setIsShowConfirm}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription className='text-muted-foreground text-sm'>
                        {description}
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
    );
};

export default DeleteConfirmationDialog;

