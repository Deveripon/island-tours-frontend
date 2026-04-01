import { createContext } from 'react';

// Create the Context with default values
export const VerificationContext = createContext({
    isVerified: false,
    setIsVerified: () => {},
    loading: false,
    refreshVerification: async () => {},
});

