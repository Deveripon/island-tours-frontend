'use client';
import { useCallback, useEffect, useState } from 'react';
import { leadsColumns } from './columns';
import { DataTable } from './data-table';

import {
    deleteMultipleleadsById,
    pushAllLeadToMailchimp,
    pushBulkLeadsToMailchimp,
    pushLeadsTon8n,
    pushLeadsToZapier,
    pushLeadToMailchimp,
} from '@/app/_actions/leadsActions';
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
import { toast } from 'sonner';

const PageContent = ({ tenant, leads }) => {
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [leadsToDelete, setLeadsToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPushingZapier, setIsPushingZapier] = useState(false);
    const [isPushingN8n, setIsPushingN8n] = useState(false);
    const [isPushingMailchimp, setIsPushingMailchimp] = useState(false);

    const handlePushBulkToZapier = useCallback(
        async leadIds => {
            if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
                toast.error('No leads selected to push');
                return;
            }

            setIsPushingZapier(true);

            try {
                const result = await pushLeadsToZapier(leadIds, tenant);
                if (result?.success) {
                    toast.success('Leads pushed to Zapier successfully');
                } else {
                    const errorMessage =
                        'Leads push to Zapier failed - See Your Zapier configuration from: Settings -> automation -> zapier';
                    toast.error(errorMessage);
                }
            } catch (error) {
                toast.error(
                    'An unexpected error occurred while pushing to Zapier'
                );
            } finally {
                setIsPushingZapier(false);
            }
        },
        [tenant]
    );

    const handlePushBulkTon8n = useCallback(
        async leadIds => {
            if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
                toast.error('No leads selected to push');
                return;
            }
            console.log('leadIds', leadIds);
            setIsPushingN8n(true);

            try {
                const result = await pushLeadsTon8n(leadIds, tenant);
                if (result?.success) {
                    toast.success('Leads pushed to n8n successfully');
                } else {
                    const errorMessage =
                        'Leads push to n8n failed - See Your n8n configuration from: Settings -> automation -> n8n';
                    toast.error(errorMessage);
                }
            } catch (error) {
                toast.error(
                    'An unexpected error occurred while pushing to n8n'
                );
            } finally {
                setIsPushingN8n(false);
            }
        },
        [tenant]
    );

    const handlePushToMailchimp = useCallback(
        async leadId => {
            if (!leadId) return;

            setIsPushingMailchimp(true);

            try {
                const result = await pushLeadToMailchimp(leadId, tenant);
                if (result?.success) {
                    toast.success('Lead pushed to Mailchimp successfully');
                } else {
                    const errorMessage =
                        'Lead push to Mailchimp failed - See Your Mailchimp configuration from: Settings -> automation -> mailchimp';
                    toast.error(errorMessage);
                }
            } catch (error) {
                toast.error(
                    'An unexpected error occurred while pushing to Mailchimp'
                );
            } finally {
                setIsPushingMailchimp(false);
            }
        },
        [tenant]
    );

    const handlePushBulkToMailchimp = useCallback(
        async leadIds => {
            if (!leadIds || leadIds.length === 0) return;

            setIsPushingMailchimp(true);

            try {
                const result = await pushBulkLeadsToMailchimp(leadIds, tenant);
                if (result?.success) {
                    toast.success('Leads pushed to Mailchimp successfully');
                } else {
                    const errorMessage =
                        'Lead push to Mailchimp failed - See Your Mailchimp configuration from: Settings -> automation -> mailchimp';
                    toast.error(errorMessage);
                }
            } catch (error) {
                toast.error(
                    'An unexpected error occurred while pushing to Mailchimp'
                );
            } finally {
                setIsPushingMailchimp(false);
            }
        },
        [tenant]
    );

    const handlePushAllToMailchimp = useCallback(async () => {
        setIsPushingMailchimp(true);

        try {
            const result = await pushAllLeadToMailchimp(tenant);
            if (result?.success) {
                toast.success('All leads pushed to Mailchimp successfully');
            } else {
                const errorMessage =
                    'Lead push to Mailchimp failed - See Your Mailchimp configuration from: Settings -> automation -> mailchimp';
                toast.error(errorMessage);
            }
        } catch (error) {
            toast.error(
                'An unexpected error occurred while pushing to Mailchimp'
            );
        } finally {
            setIsPushingMailchimp(false);
        }
    }, [tenant]);

    const handleDeleteConfirm = async () => {
        if (!leadsToDelete) return;

        setIsDeleting(true);

        try {
            const result = await deleteMultipleleadsById(leadsToDelete, tenant);

            if (result?.success) {
                toast.success('Leads deleted successfully');
            } else {
                const errorMessage =
                    result?.error &&
                    typeof result.error === 'object' &&
                    'message' in result.error
                        ? result.error.message
                        : result?.error || 'Failed to delete Leads';

                toast.error(errorMessage);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsDeleting(false);
            setIsShowConfirm(false);
            setLeadsToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setIsShowConfirm(false);
        setLeadsToDelete(null);
    };

    useEffect(() => {
        const handlePushToZapier = e => {
            const leadIds = e.detail?.ids;
            handlePushBulkToZapier(leadIds);
        };

        const handlePushTon8n = e => {
            const leadIds = e.detail?.ids;
            handlePushBulkTon8n(leadIds);
        };

        const handleDelete = e => {
            const categoryIds = e.detail;
            setLeadsToDelete(categoryIds);
            setIsShowConfirm(true);
        };

        const handlePushToMailchimpEvent = e => {
            const leadId = e.detail?.id;
            handlePushToMailchimp(leadId);
        };

        const handlePushBulkToMailchimpEvent = e => {
            const leadIds = e.detail?.ids;
            handlePushBulkToMailchimp(leadIds);
        };

        const handlePushAllToMailchimpEvent = () => {
            handlePushAllToMailchimp();
        };

        document.addEventListener('push-to-zapier', handlePushToZapier);
        document.addEventListener('push-to-n8n', handlePushTon8n);
        document.addEventListener(
            'push-to-mailchimp',
            handlePushToMailchimpEvent
        );
        document.addEventListener(
            'push-bulk-to-mailchimp',
            handlePushBulkToMailchimpEvent
        );
        document.addEventListener(
            'push-all-to-mailchimp',
            handlePushAllToMailchimpEvent
        );
        document.addEventListener('delete-leads', handleDelete);

        return () => {
            document.removeEventListener('push-to-zapier', handlePushToZapier);
            document.removeEventListener('push-to-n8n', handlePushTon8n);
            document.removeEventListener(
                'push-to-mailchimp',
                handlePushToMailchimpEvent
            );
            document.removeEventListener(
                'push-bulk-to-mailchimp',
                handlePushBulkToMailchimpEvent
            );
            document.removeEventListener(
                'push-all-to-mailchimp',
                handlePushAllToMailchimpEvent
            );
            document.removeEventListener('delete-leads', handleDelete);
        };
    }, [
        handlePushBulkToZapier,
        handlePushBulkTon8n,
        handlePushToMailchimp,
        handlePushBulkToMailchimp,
        handlePushAllToMailchimp,
    ]);

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                    <h1 className='text-2xl font-semibold tracking-tight'>
                        Collected Leads
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Manage and track your business leads from various
                        sources
                    </p>
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                isPushingZapier={isPushingZapier}
                isPushingN8n={isPushingN8n}
                isPushingMailchimp={isPushingMailchimp}
                isDeleting={isDeleting}
                columns={leadsColumns}
                data={leads || []}
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
                            delete{' '}
                            {Array.isArray(leadsToDelete?.ids)
                                ? 'these leads'
                                : 'this lead'}{' '}
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

