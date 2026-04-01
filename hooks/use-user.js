import { UserContext } from '@/context/user-context';
import { useContext } from 'react';

export const useUser = () => {
    const context = useContext(UserContext);

    return context;
};

