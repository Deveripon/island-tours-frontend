'use client';

import { deletePaymentById } from '@/app/_actions/paymentActions';
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
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { columns } from './columns';
import { DataTable } from './data-table';
import PaymentsSummery from './payments-summery';
const PageContent = ({ groupedPayments, Payments }) => {
    const [typeFilter, setTypeFilter] = useState('');
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [PaymentsIdToDelete, setPaymentsIdToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Listen for events
    useEffect(() => {
        const handleDelete = e => {
            const PaymentsId = e.detail;
            setPaymentsIdToDelete(PaymentsId);
            setIsShowConfirm(true);
        };
        const handleDownloadReceipt = async e => {
            const paymentId = e.detail;
            await downloadReceipt(paymentId);
        };

        // Add event listeners
        document.addEventListener('delete-Payments', handleDelete);
        document.addEventListener(
            'download-payment-slip',
            handleDownloadReceipt
        );

        // Cleanup
        return () => {
            document.removeEventListener('delete-Payments', handleDelete);
            document.removeEventListener(
                'download-payment-slip',
                handleDownloadReceipt
            );
        };
    }, [Payments]);

    // Handle clicking on type card to filter
    const handleTypeCardClick = type => {
        setTypeFilter(type === typeFilter ? '' : type);
    };

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (!PaymentsIdToDelete) return;

        setIsDeleting(true);

        try {
            const result = await deletePaymentById(PaymentsIdToDelete);

            if (result?.success === true) {
                toast.success('Payments deleted successfully');
            } else {
                const errorMessage =
                    result?.error &&
                    typeof result.error === 'object' &&
                    'message' in result.error
                        ? result.error.message
                        : result?.error || 'Failed to delete Payments';

                toast.error(errorMessage);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsDeleting(false);
            setIsShowConfirm(false);
            setPaymentsIdToDelete(null);
        }
    };

    async function downloadReceipt(paymentId) {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoices/receipt/${paymentId}`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/pdf',
                    } });

            if (!response.ok) {
                throw new Error(
                    `Failed to download the receipt: ${response.status} ${response.statusText}`
                );
            }

            // Check if the response is actually a PDF
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/pdf')) {
                throw new Error('Response is not a PDF file');
            }

            const blob = await response.blob();
            saveAs(blob, `receipt-${paymentId || 'receipt'}.pdf`);
        } catch (error) {
            // Show user-friendly error message
            alert(
                'Failed to download receipt. Please try again or contact support.'
            );
        }
    }

    // Handle delete cancellation
    const handleDeleteCancel = () => {
        setIsShowConfirm(false);
        setPaymentsIdToDelete(null);
    };

    return (
        <>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-semibold tracking-tight text-foreground'>
                        My Payments
                    </h1>
                    <p className='text-sm text-muted-foreground mt-1'>
                        View and manage all your payment transactions
                    </p>
                </div>
            </div>

            <PaymentsSummery
                groupedPayments={groupedPayments}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                handleTypeCardClick={handleTypeCardClick}
                allPayments={Payments}
            />

            <DataTable
                groupedPayments={groupedPayments}
                columns={columns}
                data={Payments}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
            />

            <AlertDialog open={isShowConfirm} onOpenChange={setIsShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this Payments and all associated data.
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
                            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default PageContent;

