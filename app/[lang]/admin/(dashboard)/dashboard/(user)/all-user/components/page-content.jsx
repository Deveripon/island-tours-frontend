'use client';

import { Permission } from '@/RBAC.config';
import { deleteUser } from '@/app/_actions/membersActions';
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
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { columns } from './columns';
import { DataTable } from './data-table';
import { UserForm } from './user-form';

const PageContent = ({ users, tenantId }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const owner = users.find(user => !user.createdById);

    const hasCreatePermission = useRolePermission(Permission.CREATE_USER);

    // Function to check if user can be deleted
    const canDeleteUser = userId => {
        if (userId === owner.id) {
            return {
                canDelete: false,
                reason: 'Cannot delete the account owner',
            };
        }

        const userToCheck = users.find(user => user.id === userId);

        if (!userToCheck) {
            return { canDelete: false, reason: 'User not found' };
        }

        const adminUsers = users.filter(user => user.role === 'ADMIN');
        if (userToCheck.role === 'ADMIN' && adminUsers.length === 1) {
            return {
                canDelete: false,
                reason: 'Cannot delete the last admin user',
            };
        }

        return { canDelete: true, reason: null };
    };

    // Listen for edit/delete events
    useEffect(() => {
        const handleEdit = e => {
            e.preventDefault();
            e.stopPropagation();
            setEditUser(e.detail);
            setIsFormOpen(true);
        };

        const handleDelete = e => {
            e.preventDefault();
            e.stopPropagation();

            const userId = e.detail;
            const deleteCheck = canDeleteUser(userId);

            if (!deleteCheck.canDelete) {
                toast.error(deleteCheck.reason);
                return;
            }

            setUserToDelete(userId);
            setIsShowConfirm(true);
        };

        document.addEventListener('edit-users', handleEdit);
        document.addEventListener('delete-users', handleDelete);

        return () => {
            document.removeEventListener('edit-users', handleEdit);
            document.removeEventListener('delete-users', handleDelete);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users]);

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (!userToDelete) {
            return;
        }

        const deleteCheck = canDeleteUser(userToDelete);
        if (!deleteCheck.canDelete) {
            toast.error(deleteCheck.reason);
            handleDeleteCancel();
            return;
        }

        setIsDeleting(true);

        try {
            const result = await deleteUser(userToDelete);

            if (result?.success === true) {
                toast.success('User deleted successfully');
            } else {
                const errorMessage =
                    result?.error &&
                    typeof result.error === 'object' &&
                    'message' in result.error
                        ? result.error.message
                        : result?.error || 'Failed to delete user';

                toast.error(errorMessage);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsDeleting(false);
            setIsShowConfirm(false);
            setUserToDelete(null);
        }
    };

    // Handle delete cancellation
    const handleDeleteCancel = () => {
        setIsShowConfirm(false);
        setUserToDelete(null);
    };

    // Handle form close
    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditUser(null);
    };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                    <h1 className='text-2xl font-semibold tracking-tight'>
                        Users
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Manage user accounts and their permissions
                    </p>
                </div>
                {hasCreatePermission && (
                    <Button size='sm' onClick={() => setIsFormOpen(true)}>
                        <Plus className='mr-2 h-4 w-4' />
                        Add User
                    </Button>
                )}
            </div>

            {/* Data Table */}
            <DataTable columns={columns} data={users} />

            {/* User Form */}
            <UserForm
                open={isFormOpen}
                onOpenChange={handleFormClose}
                editUser={editUser}
                setEditUser={setEditUser}
                tenantId={tenantId}
                tenantUser={owner}
            />

            {/* Delete Confirmation Dialog */}

            <AlertDialog open={isShowConfirm} onOpenChange={handleDeleteCancel}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className='text-muted-foreground text-sm'>
                            This action cannot be undone. This will permanently
                            delete this user and all associated data.
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

