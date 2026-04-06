import { useCallback, useState } from 'react';

export const useBookingState = () => {
    const [selectedDate, setSelectedDate] = useState();
    const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
    const [appliedPromoCodes, setAppliedPromoCodes] = useState([]);

    const updateGuests = useCallback(newGuests => {
        setGuests(newGuests);
    }, []);

    const updateSelectedDate = useCallback(date => {
        setSelectedDate(date);
    }, []);

    const updateAppliedPromoCodes = useCallback(codes => {
        setAppliedPromoCodes(codes);
    }, []);

    return {
        selectedDate,
        guests,
        appliedPromoCodes,
        updateGuests,
        updateSelectedDate,
        updateAppliedPromoCodes,
        setSelectedDate,
        setGuests,
        setAppliedPromoCodes,
    };
};

