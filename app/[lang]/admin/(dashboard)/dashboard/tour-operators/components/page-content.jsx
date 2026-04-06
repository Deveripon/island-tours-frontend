'use client';

import { Permission } from '@/RBAC.config';
import { deletePartner } from '@/app/_actions/partnerActions';
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
import { useRolePermission } from '@/hooks/useRolePermission';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { columns } from './columns';
import { DataTable } from './data-table';
import { TourOperatorForm } from './tour-operator-form';

const PageContent = ({ tourOperators }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [edittourOperator, setEdittourOperator] = useState(null);
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [tourOperatorToDelete, settourOperatorToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const params = useSearchParams();

    const hasCreatePermission = useRolePermission(Permission.CREATE_PARTNER);

    // Listen for edit/delete events
    useEffect(() => {
        const handleEdit = e => {
            setEdittourOperator(e.detail);
            setIsFormOpen(true);
        };

        const handleDelete = e => {
            const tourOperatorId = e.detail;
            settourOperatorToDelete(tourOperatorId);
            setIsShowConfirm(true);
        };

        document.addEventListener('edit-tourOperator', handleEdit);
        document.addEventListener('delete-tourOperator', handleDelete);

        return () => {
            document.removeEventListener('edit-tourOperator', handleEdit);
            document.removeEventListener('delete-tourOperator', handleDelete);
        };
    }, []);

    // Create tourOperator on page load
    useEffect(() => {
        if (params.get('create') === 'true') {
            setIsFormOpen(true);
        }
    }, [params]);

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (!tourOperatorToDelete) return;

        setIsDeleting(true);

        try {
            const result = await deletePartner(tourOperatorToDelete);

            if (result?.success === true) {
                toast.success('Tour Partner deleted successfully');
            } else {
                const errorMessage =
                    result?.error &&
                    typeof result.error === 'object' &&
                    'message' in result.error
                        ? result.error.message
                        : result?.error || 'Failed to delete tour partner';

                toast.error(errorMessage);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsDeleting(false);
            setIsShowConfirm(false);
            settourOperatorToDelete(null);
        }
    };

    // Handle delete cancellation
    const handleDeleteCancel = () => {
        setIsShowConfirm(false);
        settourOperatorToDelete(null);
    };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                    <h1 className='text-2xl font-semibold tracking-tight'>
                        Tour Partners
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Manage your tour partners for your travel packages,
                        tours, and services
                    </p>
                </div>
                {hasCreatePermission && (
                    <Button size='sm' onClick={() => setIsFormOpen(true)}>
                        <Plus className='mr-2 h-4 w-4' />
                        Add Partner
                    </Button>
                )}
            </div>

            {/* Data Table */}
            <DataTable columns={columns} data={tourOperators} />

            {/* Tour Operator Form */}
            <TourOperatorForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                edittourOperator={edittourOperator}
                setEdittourOperator={setEdittourOperator}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isShowConfirm} onOpenChange={setIsShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this tour partner and all associated data.
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

