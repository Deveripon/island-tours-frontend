import { use } from 'react';
import AdminContext from '../context/admin-context';

export const useAdmin = () => {
    return use(AdminContext);
};

