import BookingFormStaticPreviewv1 from './preview-version1';
import BookingFormStaticPreviewv2 from './preview-version2';
import BookingFormStaticPreviewv3 from './preview-version3';
import BookingFormStaticPreviewv4 from './preview-version4';

const BookingFormPreview = ({ bookingForm }) => {
    return (
        <div className='booking-form-preview col-span-2'>
            {bookingForm === 'v1' && <BookingFormStaticPreviewv1 />}
            {bookingForm === 'v2' && <BookingFormStaticPreviewv2 />}
            {bookingForm === 'v3' && <BookingFormStaticPreviewv3 />}
            {bookingForm === 'v4' && <BookingFormStaticPreviewv4 />}
        </div>
    );
};

export default BookingFormPreview;

