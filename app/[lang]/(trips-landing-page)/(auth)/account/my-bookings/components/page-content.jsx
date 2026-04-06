'use client';

import { deleteBooking } from '@/app/_actions/bookingActions';
import { payPendingPayment } from '@/app/_actions/paymentWithStripe';
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
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import BookingsSummery from './bookings-summery';
import { columns } from './columns';
import { DataTable } from './data-table';
const PageContent = ({ groupedBookings, bookings }) => {
    const [typeFilter, setTypeFilter] = useState('');
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [BookingsIdToDelete, setBookingsIdToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Listen for events
    useEffect(() => {
        const handleDelete = e => {
            const BookingsId = e.detail;
            setBookingsIdToDelete(BookingsId);
            setIsShowConfirm(true);
        };

        const handlePayDue = async e => {
            const booking = e.detail;
            // call stripe server action -> success: return to successpage -> failure: return to booking page

            const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account/my-bookings`;
            const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account/my-bookings?payment_cancelled=true`;
            const data = {
                customerId: booking?.customerId,
                tripId: booking?.tripId,
                bookingId: booking?.id,
                currency: booking?.currency,
                amount: booking?.pendingAmount,
                success_url: successUrl,
                cancel_url: cancelUrl,
            };
            const { url } = await payPendingPayment(data);

            // Navigate to the url -> succss/failure
            window.location.assign(url);
        };

        const handleDownloadInvoice = async e => {
            const BookingsId = e.detail;
            await downloadReceipt(BookingsId);
        };

        // Add event listeners
        document.addEventListener('delete-Bookings', handleDelete);
        document.addEventListener('pay-now', handlePayDue);
        document.addEventListener('download-invoice', handleDownloadInvoice);

        // Cleanup
        return () => {
            document.removeEventListener('pay-now', handlePayDue);
            document.removeEventListener(
                'download-invoice',
                handleDownloadInvoice
            );
            document.removeEventListener('delete-Bookings', handleDelete);
        };
    }, [bookings]);

    // Handle clicking on type card to filter
    const handleTypeCardClick = type => {
        setTypeFilter(type === typeFilter ? '' : type);
    };

    // Filter Bookings based on type filter
    const filteredBookings = useMemo(() => {
        if (!typeFilter) return bookings;
        return bookings.filter(Bookings => {
            return String(Bookings.types) === typeFilter;
        });
    }, [bookings, typeFilter]);

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (!BookingsIdToDelete) return;

        setIsDeleting(true);

        try {
            const result = await deleteBooking(BookingsIdToDelete);

            if (result?.success === true) {
                toast.success('Bookings deleted successfully');
            } else {
                const errorMessage =
                    result?.error &&
                    typeof result.error === 'object' &&
                    'message' in result.error
                        ? result.error.message
                        : result?.error || 'Failed to delete Bookings';

                toast.error(errorMessage);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsDeleting(false);
            setIsShowConfirm(false);
            setBookingsIdToDelete(null);
        }
    };

    async function downloadReceipt(bookingId) {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoices/generate/${bookingId}`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/pdf',
                    } });

            if (!response.ok) {
                throw new Error(
                    `Failed to download the invoice: ${response.status} ${response.statusText}`
                );
            }

            // Check if the response is actually a PDF
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/pdf')) {
                throw new Error('Response is not a PDF file');
            }

            const blob = await response.blob();
            saveAs(blob, `invoice-${bookingId || 'receipt'}.pdf`);
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
        setBookingsIdToDelete(null);
    };

    return (
        <>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-semibold tracking-tight text-foreground'>
                        My Bookings
                    </h1>
                    <p className='text-sm text-muted-foreground mt-1'>
                        View and manage all your trip bookings
                    </p>
                </div>
            </div>

            <BookingsSummery
                groupedBookings={groupedBookings}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                handleTypeCardClick={handleTypeCardClick}
                allBookings={bookings}
            />

            <DataTable
                groupedBookings={groupedBookings}
                columns={columns}
                data={bookings}
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
                            delete this Bookings and all associated data.
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

