'use client';

import { Permission } from '@/RBAC.config';
import { deleteActivitiesById } from '@/app/_actions/trips/activityActions';
import { Button } from '@/components/ui/button';
import { useRolePermission } from '@/hooks/useRolePermission';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DeleteConfirmationDialog from '../../../components/common/delete-confirmation-dialog';
import ActivitiesFormSection from './activities-form-section';
import { columns } from './columns';
import { DataTable } from './data-table';

const PageContent = ({ activities, destinations }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editactivities, setEditactivities] = useState(null);
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [activitiesToDelete, setactivitiesToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const params = useSearchParams();

    const hasCreatePermission = useRolePermission(Permission.CREATE_ACTIVITY);

    // Listen for edit/delete events
    useEffect(() => {
        const handleEdit = e => {
            setEditactivities(e.detail);
            setIsFormOpen(true);
        };

        const handleDelete = e => {
            const activitiesId = e.detail;
            setactivitiesToDelete(activitiesId);
            setIsShowConfirm(true);
        };

        document.addEventListener('edit-activities', handleEdit);
        document.addEventListener('delete-activities', handleDelete);

        return () => {
            document.removeEventListener('edit-activities', handleEdit);
            document.removeEventListener('delete-activities', handleDelete);
        };
    }, []);

    // Create activity on page load
    useEffect(() => {
        if (params.get('create') === 'true' || params.get('open') === 'true') {
            setIsFormOpen(true);
        }
    }, [params]);

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (!activitiesToDelete) return;

        setIsDeleting(true);

        try {
            const result = await deleteActivitiesById(activitiesToDelete);

            if (result?.success === true) {
                toast.success('Activity deleted successfully');
            } else {
                const errorMessage =
                    result?.error &&
                    typeof result.error === 'object' &&
                    'message' in result.error
                        ? result.error.message
                        : result?.error || 'Failed to delete activity';

                toast.error(errorMessage);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsDeleting(false);
            setIsShowConfirm(false);
            setactivitiesToDelete(null);
        }
    };

    // Handle delete cancellation
    const handleDeleteCancel = () => {
        setIsShowConfirm(false);
        setactivitiesToDelete(null);
    };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                    <h1 className='text-2xl font-semibold tracking-tight'>
                        Activities
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Manage activities for your travel packages, tours, and
                        services
                    </p>
                </div>
                {hasCreatePermission && (
                    <Button size='sm' onClick={() => setIsFormOpen(true)}>
                        <Plus className='mr-2 h-4 w-4' />
                        Add Activity
                    </Button>
                )}
            </div>

            {/* Data Table */}
            <DataTable columns={columns} data={activities} />

            {/* Activity Form */}
            <ActivitiesFormSection
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                editactivities={editactivities}
                setEditactivities={setEditactivities}
                destinations={destinations}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                isShowConfirm={isShowConfirm}
                setIsShowConfirm={setIsShowConfirm}
                handleDeleteConfirm={handleDeleteConfirm}
                handleDeleteCancel={handleDeleteCancel}
                isDeleting={isDeleting}
                title='Are you absolutely sure?'
                description='This action cannot be undone. This will permanently delete this activity and all associated data.'
            />
        </div>
    );
};

export default PageContent;

