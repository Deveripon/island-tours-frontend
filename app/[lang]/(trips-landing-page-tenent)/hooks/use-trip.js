import { TripContext } from '@/app/[lang]/(trips-landing-page-tenent)/context/trip-context';
import { use } from 'react';

export const useTrip = () => {
    return use(TripContext);
};

