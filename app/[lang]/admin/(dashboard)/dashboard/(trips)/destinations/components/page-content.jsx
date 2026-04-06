'use client';

import { Permission } from '@/RBAC.config';
import { deleteDestination } from '@/app/_actions/trips/destinations';
import { Button } from '@/components/ui/button';
import { useRolePermission } from '@/hooks/useRolePermission';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DeleteConfirmationDialog from '../../../components/common/delete-confirmation-dialog';
import { columns } from './columns';
import { DataTable } from './data-table';
import { DestinationForm } from './destination-form';

const PageContent = ({ destinations }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editDestination, setEditDestination] = useState(null);
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [destinationToDelete, setDestinationToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const params = useSearchParams();

    const hasCreatePermission = useRolePermission(
        Permission.CREATE_DESTINATION
    );

    // Listen for edit/delete events
    useEffect(() => {
        const handleEdit = e => {
            setEditDestination(e.detail);
            setIsFormOpen(true);
        };

        const handleDelete = e => {
            const destinationId = e.detail;
            setDestinationToDelete(destinationId);
            setIsShowConfirm(true);
        };

        document.addEventListener('edit-destination', handleEdit);
        document.addEventListener('delete-destination', handleDelete);

        return () => {
            document.removeEventListener('edit-destination', handleEdit);
            document.removeEventListener('delete-destination', handleDelete);
        };
    }, []);

    // Create destination on page load
    useEffect(() => {
        if (params.get('create') === 'true') {
            setIsFormOpen(true);
        }
    }, [params]);

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (!destinationToDelete) return;

        setIsDeleting(true);

        try {
            const result = await deleteDestination(destinationToDelete);

            if (result?.success === true) {
                toast.success('Destination deleted successfully');
            } else {
                const errorMessage =
                    result?.error &&
                    typeof result.error === 'object' &&
                    'message' in result.error
                        ? result.error.message
                        : result?.error || 'Failed to delete destination';

                toast.error(errorMessage);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsDeleting(false);
            setIsShowConfirm(false);
            setDestinationToDelete(null);
        }
    };

    // Handle delete cancellation
    const handleDeleteCancel = () => {
        setIsShowConfirm(false);
        setDestinationToDelete(null);
    };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                    <h1 className='text-2xl font-semibold tracking-tight'>
                        Destinations
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Manage destinations for your travel packages, tours, and
                        services
                    </p>
                </div>
                {hasCreatePermission && (
                    <Button size='sm' onClick={() => setIsFormOpen(true)}>
                        <Plus className='mr-2 h-4 w-4' />
                        Add Destination
                    </Button>
                )}
            </div>

            {/* Data Table */}
            <DataTable columns={columns} data={destinations} />

            {/* Destination Form */}
            <DestinationForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                editDestination={editDestination}
                setEditDestination={setEditDestination}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                isShowConfirm={isShowConfirm}
                setIsShowConfirm={setIsShowConfirm}
                handleDeleteConfirm={handleDeleteConfirm}
                handleDeleteCancel={handleDeleteCancel}
                isDeleting={isDeleting}
                title='Are you absolutely sure?'
                description='This action cannot be undone. This will permanently delete this destination and all associated data.'
            />
        </div>
    );
};

export default PageContent;

