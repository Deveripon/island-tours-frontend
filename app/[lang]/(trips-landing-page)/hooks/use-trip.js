import { TripContext } from '@/app/[lang]/(trips-landing-page)/context/trip-context';
import { use } from 'react';

export const useTrip = () => {
    return use(TripContext);
};

