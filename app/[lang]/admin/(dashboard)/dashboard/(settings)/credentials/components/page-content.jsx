'use client';

import { deleteApiKey } from '@/app/_actions/apiKeysActions';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Add01Icon,
    Alert02Icon,
    Database01Icon,
    Key01Icon,
    SecurityCheckIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ApiKeyForm } from './api-key-creation-form';
import { columns } from './columns';
import { DataTable } from './data-table';

const PageContent = ({ apiKeys }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [apiKeysToDelete, setApiKeysToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Listen for delete events
    useEffect(() => {
        const handleDelete = e => {
            const apiKeysId = e.detail;
            setApiKeysToDelete(apiKeysId);
            setIsShowConfirm(true);
        };

        // Add event listeners
        document.addEventListener('delete-apiKeys', handleDelete);

        // Cleanup
        return () => {
            document.removeEventListener('delete-apiKeys', handleDelete);
        };
    }, []);

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (!apiKeysToDelete) return;

        setIsDeleting(true);

        try {
            const result = await deleteApiKey(apiKeysToDelete);

            if (result?.success === true) {
                toast.success('API key deleted successfully');
            } else {
                const errorMessage =
                    result?.error &&
                    typeof result.error === 'object' &&
                    'message' in result.error
                        ? result.error.message
                        : result?.error || 'Failed to delete API key';

                toast.error(errorMessage);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsDeleting(false);
            setIsShowConfirm(false);
            setApiKeysToDelete(null);
        }
    };

    // Handle delete cancellation
    const handleDeleteCancel = () => {
        setIsShowConfirm(false);
        setApiKeysToDelete(null);
    };

    // Calculate stats
    const totalKeys = apiKeys?.length || 0;
    const activeKeys =
        apiKeys?.filter(key => key.status !== 'inactive')?.length || totalKeys;

    return (
        <div className='space-y-6'>
            {/* Header Section */}
            <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <div className='space-y-1'>
                        <h1 className='text-2xl font-semibold tracking-tight'>
                            API Keys
                        </h1>
                        <p className='text-sm text-muted-foreground'>
                            Manage your API keys to access your account
                            programmatically. Keep them secure and never share
                            them publicly.
                        </p>
                    </div>
                    <Button size='sm' onClick={() => setIsFormOpen(true)}>
                        <HugeiconsIcon
                            icon={Add01Icon}
                            size={16}
                            className='mr-2'
                        />
                        Create API Key
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <Card className='border-border bg-card shadow-sm'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium text-foreground'>
                                Total API Keys
                            </CardTitle>
                            <HugeiconsIcon
                                icon={Database01Icon}
                                size={16}
                                className='text-primary'
                            />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold text-foreground'>
                                {totalKeys}
                            </div>
                            <p className='text-xs text-muted-foreground mt-1'>
                                {totalKeys === 1 ? 'key' : 'keys'} in your
                                account
                            </p>
                        </CardContent>
                    </Card>

                    <Card className='border-border bg-card shadow-sm'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium text-foreground'>
                                Active Keys
                            </CardTitle>
                            <HugeiconsIcon
                                icon={SecurityCheckIcon}
                                size={16}
                                className='text-success'
                            />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold text-foreground'>
                                {activeKeys}
                            </div>
                            <p className='text-xs text-muted-foreground mt-1'>
                                currently active and usable
                            </p>
                        </CardContent>
                    </Card>

                    <Card className='border-border bg-card shadow-sm'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium text-foreground'>
                                Security Status
                            </CardTitle>
                            <HugeiconsIcon
                                icon={Key01Icon}
                                size={16}
                                className='text-muted-foreground'
                            />
                        </CardHeader>
                        <CardContent>
                            <div className='flex items-center gap-2'>
                                <Badge
                                    variant='default'
                                    className='bg-success/10 text-success hover:bg-success/10'>
                                    Secure
                                </Badge>
                            </div>
                            <p className='text-xs text-muted-foreground mt-1'>
                                All keys are encrypted
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Main Content */}
            {totalKeys === 0 ? (
                <Card className='text-center p-4 border-border bg-card shadow-sm'>
                    <CardContent className='space-y-4'>
                        <div className='mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center'>
                            <HugeiconsIcon
                                icon={Key01Icon}
                                size={24}
                                className='text-muted-foreground'
                            />
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-lg font-semibold text-foreground'>
                                No API Keys Yet
                            </h3>
                            <p className='text-sm text-muted-foreground max-w-md mx-auto'>
                                Get started by creating your first API key.
                                You&apos;ll be able to use it to access your
                                account programmatically.
                            </p>
                        </div>
                        <Button
                            variant='outline'
                            onClick={() => setIsFormOpen(true)}
                            className='gap-2'>
                            <HugeiconsIcon icon={Add01Icon} size={16} />
                            Create Your First API Key
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card className='border-border bg-card shadow-sm'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <HugeiconsIcon icon={Key01Icon} size={20} />
                            Your API Keys
                        </CardTitle>
                        <CardDescription>
                            View and manage all your API keys. Click the eye
                            icon to reveal keys or use the copy button to copy
                            them to your clipboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='px-8 py-4'>
                        <DataTable columns={columns} data={apiKeys} />
                    </CardContent>
                </Card>
            )}

            {/* API Key Form Modal */}
            <ApiKeyForm open={isFormOpen} onOpenChange={setIsFormOpen} />

            {/* Confirmation Dialog for Delete */}
            <AlertDialog open={isShowConfirm} onOpenChange={setIsShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className='flex items-center gap-3'>
                            <div>
                                <AlertDialogTitle className='text-lg'>
                                    Delete API Key?
                                </AlertDialogTitle>
                            </div>
                        </div>
                        <AlertDialogDescription className='text-base mt-3'>
                            This action cannot be undone. This will permanently
                            delete this API key and any applications using it
                            will lose access immediately.
                            <br />
                            <br />
                            <strong>Are you sure you want to continue?</strong>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='gap-3'>
                        <AlertDialogCancel
                            onClick={handleDeleteCancel}
                            disabled={isDeleting}
                            className='gap-2'>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2'>
                            {isDeleting ? (
                                <>
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <HugeiconsIcon
                                        icon={Alert02Icon}
                                        size={16}
                                    />
                                    Yes, Delete Key
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default PageContent;

