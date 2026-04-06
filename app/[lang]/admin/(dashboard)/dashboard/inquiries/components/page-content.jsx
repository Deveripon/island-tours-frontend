'use client';

import {
    deleteInquiry,
    bulkDeleteInquiries,
    updateInquiryStatus,
} from '@/app/_actions/inquiryActions';
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

const PageContent = ({ groupedInquiries, inquiries }) => {
    const [typeFilter, setTypeFilter] = useState('');
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [inquiryIdToDelete, setInquiryIdToDelete] = useState(null);
    const [inquiryToShowDetails, setInquiryToShowDetails] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isShowDetails, setShowDetails] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    const [loading, setLoading] = useState(false);

    // Listen for events
    useEffect(() => {
        const handleTrashMultiple = async e => {
            try {
                setLoading(true);
                const inquiriesForTrash = e.detail;

                if (inquiriesForTrash.length > 4) {
                    toast.info(
                        `Multiple Inquiries Moving to Trash, it may take a while`
                    );
                }

                const result = await Promise.all(
                    inquiriesForTrash.map(item =>
                        updateInquiryStatus(item.id, [
                            ...item.status,
                            'TRASHED',
                        ])
                    )
                );
                setRowSelection({});
                toast.info(`Inquiries Trashed Successfully`);
            } catch (error) {
                toast.warning(`Something went wrong, please try again`);
            } finally {
                setLoading(false);
            }
        };

        const handleRestoreAll = async e => {
            try {
                setLoading(true);
                const inquiryIds = e.detail.map(inq => inq.id);
                const previousStatuses = e.detail.map(inq => inq.status);

                if (inquiryIds.length > 4) {
                    toast.info(
                        `Multiple Inquiries Moving from Trash, it may take a while`
                    );
                }

                const result = await Promise.all(
                    inquiryIds.map((id, index) =>
                        updateInquiryStatus(
                            id,
                            previousStatuses[index].filter(s => s !== 'TRASHED')
                        )
                    )
                );
                setRowSelection({});
                toast.info(`Inquiries Restored Successfully`);
            } catch (error) {
                toast.warning(`Something went wrong, please try again`);
            } finally {
                setLoading(false);
            }
        };

        const handleTrash = async e => {
            const inquiryId = e.detail.id;
            const result = await updateInquiryStatus(inquiryId, [
                ...e.detail.status,
                'TRASHED',
            ]);
            if (result?.success) {
                toast.info('Inquiries Moved to Trash');
            }
        };

        const handleRestore = async e => {
            const inquiryId = e.detail.id;
            const result = await updateInquiryStatus(
                inquiryId,
                e.detail.status.filter(s => s !== 'TRASHED')
            );
            if (result?.success) {
                toast.info('Inquiries Restored Successfully');
            }
        };

        const handleDelete = e => {
            const inquiryId = e.detail;
            setInquiryIdToDelete(inquiryId);
            setIsShowConfirm(true);
        };

        const handleDeleteMultiple = async e => {
            const inquiryIds = e.detail;
            setInquiryIdToDelete(inquiryIds);
            setIsShowConfirm(true);
        };

        const replyToInquiry = e => {
            const inquiryId = e.detail;
        };

        const handleViewDetails = e => {
            const currentInquiry = e.detail;
            setShowDetails(true);
            setInquiryToShowDetails(currentInquiry);
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
    }, []);

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (!inquiryIdToDelete) return;

        setIsDeleting(true);

        try {
            let result;
            if (Array.isArray(inquiryIdToDelete)) {
                setLoading(true);
                result = await bulkDeleteInquiries(inquiryIdToDelete);
            } else {
                result = await deleteInquiry(inquiryIdToDelete);
            }

            if (result?.success === true) {
                toast.success('Inquiries deleted successfully');
                setShowDetails(false);
                setRowSelection({});
            } else {
                const errorMessage =
                    result?.error &&
                    typeof result.error === 'object' &&
                    'message' in result.error
                        ? result.error.message
                        : result?.error || 'Failed to delete inquiries';

                toast.error(errorMessage);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
            setIsDeleting(false);
            setIsShowConfirm(false);
            setInquiryIdToDelete(null);
        }
    };

    // Handle delete cancellation
    const handleDeleteCancel = () => {
        setIsShowConfirm(false);
        setInquiryIdToDelete(null);
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
                groupedInquiries={groupedInquiries}
                columns={columns}
                data={inquiries}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                selected={rowSelection}
                onSelectionChange={setRowSelection}
                loading={loading}
                isDeleting={isDeleting}
                inquiryIdToDelete={inquiryIdToDelete}
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
                            inquiryData={inquiryToShowDetails}
                            onBack={() => setShowDetails(false)}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default PageContent;

