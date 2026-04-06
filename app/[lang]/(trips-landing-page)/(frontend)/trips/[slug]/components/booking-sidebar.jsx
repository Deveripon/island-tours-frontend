'use client';
import BookingFormPreview from '@/app/[lang]/admin/(dashboard)/dashboard/(trips)/create-affiliate-trips/components/trip-package/pricing/form-preview/booking-form-preview';
import { updateTrip } from '@/app/_actions/trips/affiliateTripsAction';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
    Edit02Icon,
    Ticket01Icon,
    TypeCursorIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useState } from 'react';
import { useAdmin } from '../../../../hooks/useAdmin';
import RequestForm from './BookingCardComponents/request-form';
import BookingCard from './BookingCardComponents/variation/v1/booking-card';
import MinimalBookingCard from './BookingCardComponents/variation/v2/booking-card';
import ElegantBookingCard from './BookingCardComponents/variation/v3/booking-card';
import SidebarBookingCard from './BookingCardComponents/variation/v4/booking-card';
import { EditingSheetRight } from './editing-forms/editing-sheet-right';

const BookingSidebar = ({ paymentMethod, bookingForm, trip }) => {
    const { mode, MODES, isAdmin } = useAdmin();
    const isEditMode = mode === MODES.edit;
    const [isEditing, setIsEditing] = useState(false);
    const [selectedBookingForm, setSelectedBookingForm] = useState(
        bookingForm || 'v2'
    );

    useEffect(() => {
        setSelectedBookingForm(bookingForm || 'v2');
    }, [bookingForm]);

    const handleSave = async () => {
        try {
            await updateTrip(trip?.id, {
                bookingForm: selectedBookingForm,
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update booking form:', error);
        }
    };

    const handleCancel = () => {
        setSelectedBookingForm(bookingForm || 'v2');
        setIsEditing(false);
    };

    return (
        <div
            id='sidebar'
            className={cn(
                'lg:col-span-3 space-y-6 mt-8 relative group',
                !trip?.datesAvailability?.onlyUponRequest &&
                    bookingForm === 'v4' &&
                    'lg:col-span-4',
                isEditMode &&
                    isAdmin &&
                    'border border-dashed p-4 border-border hover:border-primary/50 h-fit rounded-lg transition-all duration-300'
            )}>
            <div
                id='booking-card'
                className={cn(
                    'sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-scroll'
                )}>
                {trip?.datesAvailability?.onlyUponRequest ? (
                    <RequestForm />
                ) : (
                    <>
                        {bookingForm === 'v1' && (
                            <BookingCard
                                paymentMethod={paymentMethod}
                            />
                        )}
                        {bookingForm === 'v2' && (
                            <MinimalBookingCard
                                paymentMethod={paymentMethod}
                            />
                        )}
                        {bookingForm === 'v3' && (
                            <ElegantBookingCard
                                paymentMethod={paymentMethod}
                            />
                        )}{' '}
                        {bookingForm === 'v4' && (
                            <SidebarBookingCard
                                paymentMethod={paymentMethod}
                            />
                        )}
                    </>
                )}
            </div>

            {/* Edit Trigger Overlay */}
            {isEditMode && isAdmin && (
                <div
                    className='absolute inset-0 cursor-pointer rounded-lg bg-transparent z-10'
                    onClick={e => {
                        e.stopPropagation();
                        setIsEditing(true);
                    }}>
                    <div className='hidden group-hover:flex absolute top-2 right-2 bg-primary text-white p-2 rounded-full shadow-sm'>
                        <HugeiconsIcon icon={Edit02Icon} size={16} />
                    </div>
                </div>
            )}

            {/* Editing Sheet */}
            <EditingSheetRight
                side='right'
                className='lg:min-w-[550px] w-full sm:w-[550px] rounded-l-3xl border-l border-border hide-scrollbar'
                open={isEditing}
                onOpenChange={setIsEditing}>
                <div className='h-full flex flex-col bg-background'>
                    {/* Premium Header - Matched with ExperienceSection */}
                    <div className='sticky top-0 z-20 px-6 py-5 flex justify-between items-center bg-card border-b border-border shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-primary/10 text-primary rounded-xl'>
                                <HugeiconsIcon icon={Ticket01Icon} size={20} />
                            </div>
                            <h3 className='font-black text-xl tracking-tight'>
                                Edit Booking Form
                            </h3>
                        </div>
                        <div className='flex gap-3'>
                            <Button
                                variant='outline'
                                onClick={handleCancel}
                                className='h-10 px-5 font-bold rounded-xl'>
                                Cancel
                            </Button>
                            <Button
                                variant='default'
                                onClick={handleSave}
                                className='h-10 px-5 font-bold rounded-xl shadow-lg shadow-primary/20'>
                                Save
                            </Button>
                        </div>
                    </div>

                    <div
                        className='flex-1 overflow-y-auto px-6 py-8 space-y-8 hide-scrollbar'
                        data-lenis-prevent>
                        <div className='space-y-6'>
                            <div className='space-y-2'>
                                <label className='text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2'>
                                    <HugeiconsIcon
                                        icon={TypeCursorIcon}
                                        size={14}
                                        className='text-primary'
                                    />
                                    Booking Form Style
                                </label>
                                <Select
                                    value={selectedBookingForm}
                                    onValueChange={setSelectedBookingForm}>
                                    <SelectTrigger className='w-full h-12 rounded-2xl border border-border bg-background px-4 text-base font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'>
                                        <SelectValue placeholder='Select Form Style' />
                                    </SelectTrigger>
                                    <SelectContent className='z-[500]'>
                                        <SelectItem value='v1'>
                                            Booking Form v1
                                        </SelectItem>
                                        <SelectItem value='v2'>
                                            Booking Form v2
                                        </SelectItem>
                                        <SelectItem value='v3'>
                                            Booking Form v3
                                        </SelectItem>
                                        <SelectItem value='v4'>
                                            Booking Form v4
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className='flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10'>
                                    <div className='w-1.5 h-1.5 rounded-full bg-primary animate-pulse' />
                                    <p className='text-[10px] text-muted-foreground font-bold uppercase tracking-tight'>
                                        Select the visual style of your booking
                                        form.
                                    </p>
                                </div>
                            </div>

                            <div className='space-y-2 pt-4 border-t border-border'>
                                <label className='text-xs font-bold text-muted-foreground uppercase tracking-widest'>
                                    Preview
                                </label>
                                <div className='rounded-xl border border-border overflow-hidden bg-muted/20'>
                                    <div className='overflow-x-auto p-4 custom-scrollbar'>
                                        <div className='min-w-[500px]'>
                                            <BookingFormPreview
                                                bookingForm={
                                                    selectedBookingForm
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </EditingSheetRight>
        </div>
    );
};

export default BookingSidebar;

