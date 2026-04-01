'use client';

import { deletepaymentsById } from '@/app/_actions/paymentActions';
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

import { getGroupedDataOfStatus } from '@/lib/utils';
import { columns } from './columns';
import { DataTable } from './data-table';
import PaymentsSummery from './payments-summery';

const PageContent = ({ Payments }) => {
    const [typeFilter, setTypeFilter] = useState('');
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [PaymentsIdToDelete, setPaymentsIdToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [paymentsData, setPaymentsData] = useState(Payments);
    const [filteredData, setFilteredData] = useState(Payments);

    const groupedData = getGroupedDataOfStatus(filteredData);

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

        document.addEventListener('delete-Payments', handleDelete);
        document.addEventListener(
            'download-payment-slip',
            handleDownloadReceipt
        );

        return () => {
            document.removeEventListener('delete-Payments', handleDelete);
            document.removeEventListener(
                'download-payment-slip',
                handleDownloadReceipt
            );
        };
    }, [Payments]);

    const handleTypeCardClick = type => {
        setTypeFilter(type === typeFilter ? '' : type);
    };

    const handleDeleteConfirm = async () => {
        if (!PaymentsIdToDelete) return;

        setIsDeleting(true);

        try {
            const result = await deletepaymentsById(PaymentsIdToDelete);

            if (result?.success === true) {
                toast.success('Payment deleted successfully');
            } else {
                const errorMessage =
                    result?.error &&
                    typeof result.error === 'object' &&
                    'message' in result.error
                        ? result.error.message
                        : result?.error || 'Failed to delete payment';

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

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/pdf')) {
                throw new Error('Response is not a PDF file');
            }

            const blob = await response.blob();
            saveAs(blob, `receipt-${paymentId || 'receipt'}.pdf`);
        } catch (error) {
            alert(
                'Failed to download receipt. Please try again or contact support.'
            );
        }
    }

    const handleDeleteCancel = () => {
        setIsShowConfirm(false);
        setPaymentsIdToDelete(null);
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                    <h1 className='text-2xl font-semibold tracking-tight'>
                        Received Payments
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Track and manage all payment transactions
                    </p>
                </div>
            </div>

            <PaymentsSummery
                groupedPayments={groupedData}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                handleTypeCardClick={handleTypeCardClick}
                allPayments={filteredData}
            />

            <DataTable
                groupedPayments={groupedData}
                columns={columns}
                data={paymentsData}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                setPaymentsData={setPaymentsData}
                onFilteredDataChange={setFilteredData}
            />

            <AlertDialog open={isShowConfirm} onOpenChange={setIsShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this payment and all associated data.
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
