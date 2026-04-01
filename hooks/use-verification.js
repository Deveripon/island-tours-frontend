import { VerificationContext } from '@/context/verification-context';
import { useContext } from 'react';

export const useVerification = () => {
    const context = useContext(VerificationContext);

    return context;
};

