'use client';
import { FormDatePicker } from '@/components/ui/date-picker';
import { getDate } from '@/utils/form-utils';
import { useEffect } from 'react';
import { useTrip } from '../../../../../../../hooks/use-trip';

const DateSelector = ({ isRequest, selectedDateFromUrl }) => {
    const { selectedDate, updateSelectedDate, tripData } = useTrip();

    useEffect(() => {
        if (selectedDateFromUrl) {
            updateSelectedDate(selectedDateFromUrl);
        }
    }, [selectedDateFromUrl, updateSelectedDate]);
    // Handle date selection properly
    const handleDateSelect = date => {
        updateSelectedDate(date);
    };

    const tripStartFromDate =
        tripData?.datesAvailability?.isFixedDeparture === false &&
        getDate(tripData?.datesAvailability?.dateRangeStart);
    const tripEndDate =
        tripData?.datesAvailability?.isFixedDeparture === false &&
        getDate(tripData?.datesAvailability?.dateRangeEnd);
    const FixedDepurtureDates =
        tripData?.datesAvailability?.isFixedDeparture === true &&
        tripData?.datesAvailability?.departureDates;
    const blackoutDates = tripData?.datesAvailability?.blackoutDates;
    return (
        <div>
            <h3 className='text-sm font-semibold mb-2 text-muted-foreground'>
                Trip Date <span className='text-destructive'>*</span>
            </h3>

            <FormDatePicker
                disablePastDates={true}
                minDate={tripStartFromDate}
                maxDate={tripEndDate}
                disabledDates={blackoutDates}
                dateFormat='short'
                enabledDatesOnly={FixedDepurtureDates}
                enabledDaysOfWeek={
                    !isRequest
                        ? tripData?.datesAvailability?.daysOfTheWeek
                        : null
                }
                placeholder='Select trip date'
                value={selectedDate}
                onChange={value => handleDateSelect(value)}
                className='col-span-2 !h-10 !bg-transparent text-foreground !border-border placeholder:text-muted-foreground border'
            />
        </div>
    );
};

export default DateSelector;

