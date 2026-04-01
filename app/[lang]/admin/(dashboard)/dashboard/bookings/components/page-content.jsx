'use client';

import { deleteBookingById } from '@/app/_actions/bookingActions';
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import BookingDetails from './booking-details';
import BookingsSummery from './bookings-summery';
import { columns } from './columns';
import { DataTable } from './data-table';

const PageContent = ({ groupedBookings, bookings }) => {
    const [typeFilter, setTypeFilter] = useState('');
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [BookingsIdToDelete, setBookingsIdToDelete] = useState(null);
    const [bookingToShowDetails, setBookingToShowDetails] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isShowDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const handleDelete = e => {
            const BookingsId = e.detail;
            setBookingsIdToDelete(BookingsId);
            setIsShowConfirm(true);
        };

        const handleSentReminder = async e => {
            const booking = e.detail;
            toast.success('This feature is coming soon...');
        };

        const handleDownloadInvoice = async e => {
            const BookingsId = e.detail;
            await downloadReceipt(BookingsId);
        };

        const handleViewDetails = e => {
            const booking = e.detail;
            setShowDetails(true);
            setBookingToShowDetails(booking);
        };

        document.addEventListener('delete-Bookings', handleDelete);
        document.addEventListener('send-payment-reminder', handleSentReminder);
        document.addEventListener('download-invoice', handleDownloadInvoice);
        document.addEventListener('view-details', handleViewDetails);

        return () => {
            document.removeEventListener(
                'send-payment-reminder',
                handleSentReminder
            );
            document.removeEventListener(
                'download-invoice',
                handleDownloadInvoice
            );
            document.removeEventListener('delete-Bookings', handleDelete);
            document.removeEventListener('view-details', handleViewDetails);
        };
    }, [bookings]);

    const handleTypeCardClick = type => {
        setTypeFilter(type === typeFilter ? '' : type);
    };

    const handleDeleteConfirm = async () => {
        if (!BookingsIdToDelete) return;

        setIsDeleting(true);

        try {
            const result = await deleteBookingById(BookingsIdToDelete);

            if (result?.success === true) {
                toast.success('Booking deleted successfully');
            } else {
                const errorMessage =
                    result?.error &&
                    typeof result.error === 'object' &&
                    'message' in result.error
                        ? result.error.message
                        : result?.error || 'Failed to delete booking';

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

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/pdf')) {
                throw new Error('Response is not a PDF file');
            }

            const blob = await response.blob();
            saveAs(blob, `invoice-${bookingId || 'receipt'}.pdf`);
        } catch (error) {
            alert(
                'Failed to download receipt. Please try again or contact support.'
            );
        }
    }

    const handleDeleteCancel = () => {
        setIsShowConfirm(false);
        setBookingsIdToDelete(null);
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                    <h1 className='text-2xl font-semibold tracking-tight'>
                        Bookings & Reservations
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Manage and track all your travel bookings
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
                            delete this booking and all associated data.
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

            <Sheet
                open={isShowDetails}
                onOpenChange={() => {
                    setShowDetails(false);
                }}>
                <SheetContent className='sm:max-w-3xl rounded-lg overflow-scroll'>
                    <SheetHeader>
                        <SheetTitle>Booking Details</SheetTitle>
                        <SheetDescription>
                            Here are the details of the booking.
                        </SheetDescription>
                    </SheetHeader>
                    <div className='py-6'>
                        <BookingDetails bookingData={bookingToShowDetails} />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default PageContent;

