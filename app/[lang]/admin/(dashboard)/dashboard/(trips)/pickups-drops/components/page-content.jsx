'use client';

import { Permission } from '@/RBAC.config';
import { deletePickupsById } from '@/app/_actions/pickupActions';
import { Button } from '@/components/ui/button';
import { useRolePermission } from '@/hooks/useRolePermission';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DeleteConfirmationDialog from '../../../components/common/delete-confirmation-dialog';
import { columns } from './columns';
import { DataTable } from './data-table';
import { PickUpForm } from './pickup-form';

const PageContent = ({ pickups }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editpickup, setEditpickup] = useState(null);
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [pickupToDelete, setpickupToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const hasCreatePermission = useRolePermission(
        Permission.CREATE_PICKUP_DROP
    );

    // Listen for edit/delete events
    useEffect(() => {
        const handleEdit = e => {
            setEditpickup(e.detail);
            setIsFormOpen(true);
        };

        const handleDelete = e => {
            const pickupId = e.detail;
            setpickupToDelete(pickupId);
            setIsShowConfirm(true);
        };

        document.addEventListener('edit-pickup', handleEdit);
        document.addEventListener('delete-pickup', handleDelete);

        return () => {
            document.removeEventListener('edit-pickup', handleEdit);
            document.removeEventListener('delete-pickup', handleDelete);
        };
    }, []);

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (!pickupToDelete) return;

        setIsDeleting(true);

        try {
            const result = await deletePickupsById(pickupToDelete);

            if (result?.success === true) {
                toast.success('Pickup deleted successfully');
            } else {
                const errorMessage =
                    result?.error &&
                    typeof result.error === 'object' &&
                    'message' in result.error
                        ? result.error.message
                        : result?.error || 'Failed to delete pickup';

                toast.error(errorMessage);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsDeleting(false);
            setIsShowConfirm(false);
            setpickupToDelete(null);
        }
    };

    // Handle delete cancellation
    const handleDeleteCancel = () => {
        setIsShowConfirm(false);
        setpickupToDelete(null);
    };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                    <h1 className='text-2xl font-semibold tracking-tight'>
                        Pickups & Drops
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Manage pickup and drop-off locations for your trips
                    </p>
                </div>
                {hasCreatePermission && (
                    <Button size='sm' onClick={() => setIsFormOpen(true)}>
                        <Plus className='mr-2 h-4 w-4' />
                        Add Pickup/Drop
                    </Button>
                )}
            </div>

            {/* Data Table */}
            <DataTable columns={columns} data={pickups} />

            {/* Pickup Form */}
            <PickUpForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                editpickup={editpickup}
                setEditpickup={setEditpickup}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                isShowConfirm={isShowConfirm}
                setIsShowConfirm={setIsShowConfirm}
                handleDeleteConfirm={handleDeleteConfirm}
                handleDeleteCancel={handleDeleteCancel}
                isDeleting={isDeleting}
                title='Are you absolutely sure?'
                description='This action cannot be undone. This will permanently delete this pickup location and all associated data.'
            />
        </div>
    );
};

export default PageContent;

