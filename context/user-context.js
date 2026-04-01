import { createContext } from 'react';

// Create the Context with default values
export const UserContext = createContext({
    user: null,
    setUser: () => {},
    refreshUser: async () => {},
    loading: false,
});

