'use client';

import {
    deleteAInqueryById,
    deleteMultipleInqueryById,
    updateInqueryStatus,
} from '@/app/_actions/inqueryActions';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DeleteConfirmationDialog from '../../components/common/delete-confirmation-dialog';
import { columns } from './columns';
import { DataTable } from './data-table';
import { InquiryDetails } from './inquiry-details';

const PageContent = ({ groupedInquries, inquries, tenant }) => {
    const [typeFilter, setTypeFilter] = useState('');
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [InquriesIdToDelete, setInquriesIdToDelete] = useState(null);
    const [inquiresToShowDetails, setInquiresToShowDetails] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isShowDetails, setShowDetails] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    const [loading, setLoading] = useState(false);

    // Listen for events
    useEffect(() => {
        const handleTrashMultiple = async e => {
            try {
                setLoading(true);
                const Inquries = e.detail;

                if (Inquries.length > 4) {
                    toast.info(
                        `Multiple Inquries Moving to Trash, it may take a while`
                    );
                }

                const result = await Promise.all(
                    Inquries.map(item =>
                        updateInqueryStatus(item.id, {
                            status: [...item.status, 'TRASHED'] })
                    )
                );
                setRowSelection({});
                toast.info(`Inquries Trashed Successfully`);
            } catch (error) {
                toast.warning(`Something went wrong, please try again`);
            } finally {
                setLoading(false);
            }
        };

        const handleRestoreAll = async e => {
            try {
                setLoading(true);
                const InquriesIds = e.detail.map(inq => inq.id);
                const previousStatuses = e.detail.map(inq => inq.status);

                if (InquriesIds.length > 4) {
                    toast.info(
                        `Multiple Inquries Moving from Trash, it may take a while`
                    );
                }

                const result = await Promise.all(
                    InquriesIds.map((id, index) =>
                        updateInqueryStatus(id, {
                            status: previousStatuses[index].filter(
                                s => s !== 'TRASHED'
                            ) })
                    )
                );
                setRowSelection({});
                toast.info(`Inquries Restored Successfully`);
            } catch (error) {
                toast.warning(`Something went wrong, please try again`);
            } finally {
                setLoading(false);
            }
        };

        const handleTrash = async e => {
            const InquriesId = e.detail.id;
            const result = await updateInqueryStatus(InquriesId, {
                status: [...e.detail.status, 'TRASHED'] });
            if (result?.success) {
                toast.info('Inquries Moved to Trash');
            }
        };

        const handleRestore = async e => {
            const InquriesId = e.detail.id;
            const result = await updateInqueryStatus(InquriesId, {
                status: [...e.detail.status.filter(s => s !== 'TRASHED')] });
            if (result?.success) {
                toast.info('Inquries Restored Successfully');
            }
        };

        const handleDelete = e => {
            const InquriesId = e.detail;
            setInquriesIdToDelete(InquriesId);
            setIsShowConfirm(true);
        };

        const handleDeleteMultiple = async e => {
            const InquriesIds = e.detail;
            setInquriesIdToDelete(InquriesIds);
            setIsShowConfirm(true);
        };

        const replyToInquiry = e => {
            const InquriesId = e.detail;
        };

        const handleViewDetails = e => {
            const inquires = e.detail;
            setShowDetails(true);
            setInquiresToShowDetails(inquires);
        };

        // Add event listeners
        document.addEventListener('delete-inquiry', handleDelete);
        document.addEventListener('delete-all-inquiries', handleDeleteMultiple);
        document.addEventListener('trash-inquiry', handleTrash);
        document.addEventListener('trash-all-inquiries', handleTrashMultiple);
        document.addEventListener('view-inquiry-details', handleViewDetails);
        document.addEventListener('reply-inquiry', replyToInquiry);
        document.addEventListener('restore-inquiry', handleRestore);
        document.addEventListener('restore-all-inquiries', handleRestoreAll);

        // Cleanup
        return () => {
            document.removeEventListener('reply-inquiry', replyToInquiry);
            document.removeEventListener('delete-inquiry', handleDelete);
            document.removeEventListener('trash-inquiry', handleTrash);
            document.removeEventListener(
                'view-inquiry-details',
                handleViewDetails
            );
            document.removeEventListener(
                'delete-all-inquiries',
                handleDeleteMultiple
            );
            document.removeEventListener(
                'trash-all-inquiries',
                handleTrashMultiple
            );
            document.removeEventListener('restore-inquiry', handleRestore);
            document.removeEventListener(
                'restore-all-inquiries',
                handleRestoreAll
            );
        };
    }, [tenant]);

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (!InquriesIdToDelete) return;

        setIsDeleting(true);

        try {
            let result;
            if (Array.isArray(InquriesIdToDelete)) {
                setLoading(true);
                result = await deleteMultipleInqueryById(
                    { ids: InquriesIdToDelete },
                    tenant
                );
            } else {
                result = await deleteAInqueryById(InquriesIdToDelete, tenant);
            }

            if (result?.success === true) {
                toast.success('Inquries deleted successfully');
                setShowDetails(false);
                setRowSelection({});
            } else {
                const errorMessage =
                    result?.error &&
                    typeof result.error === 'object' &&
                    'message' in result.error
                        ? result.error.message
                        : result?.error || 'Failed to delete Inquries';

                toast.error(errorMessage);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
            setIsDeleting(false);
            setIsShowConfirm(false);
            setInquriesIdToDelete(null);
        }
    };

    // Handle delete cancellation
    const handleDeleteCancel = () => {
        setIsShowConfirm(false);
        setInquriesIdToDelete(null);
    };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                    <h1 className='text-2xl font-semibold tracking-tight'>
                        Customer Inquiries
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Manage customer inquiries and respond to messages
                    </p>
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                groupedInquries={groupedInquries}
                columns={columns}
                data={inquries}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                selected={rowSelection}
                onSelectionChange={setRowSelection}
                loading={loading}
                isDeleting={isDeleting}
                inquriesIdToDelete={InquriesIdToDelete}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                isShowConfirm={isShowConfirm}
                setIsShowConfirm={setIsShowConfirm}
                handleDeleteConfirm={handleDeleteConfirm}
                handleDeleteCancel={handleDeleteCancel}
                isDeleting={isDeleting}
                title='Are you absolutely sure?'
                description='This action cannot be undone. This will permanently delete this inquiry and all associated data.'
            />

            {/* Inquiry Details Sheet */}
            <Sheet
                open={isShowDetails}
                onOpenChange={() => {
                    setShowDetails(false);
                }}>
                <SheetContent className='sm:max-w-3xl rounded-lg overflow-scroll'>
                    <SheetHeader className='sr-only'>
                        <SheetTitle>Details</SheetTitle>
                        <SheetDescription>
                            Here are the details of the inquiry.
                        </SheetDescription>
                    </SheetHeader>
                    <div className='py-6'>
                        <InquiryDetails
                            inquiryData={inquiresToShowDetails}
                            onBack={() => setShowDetails(false)}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default PageContent;

