'use client';
import { getUserById } from '@/app/_actions/userActions';
import { signOut, useSession } from 'next-auth/react';
import { useParams, usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import AdminContext from '../context/admin-context';

const MODES = {
    preview: 'preview',
    edit: 'edit',
    public: 'public',
};
const AdminProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [mode, setMode] = useState(MODES.preview); // preview,edit,public

    const { data: session } = useSession();
    const pathname = usePathname();
    const params = useParams();
    const fetchUserData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await getUserById(session?.user?.id);
            console.log(`res`, res);
            if (res?.success && res?.result) {
                setUser(res?.result);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch user data'); // Better error handling
        } finally {
            setLoading(false);
        }
    }, [session?.user?.id]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const isTripDetailsPage =
        pathname.includes('trips') && params.slug ? true : false;
    console.log(`isTripDetailsPage`, isTripDetailsPage);

    const isAdmin =
        session?.user?.id === user?.id &&
        (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN');

    console.log(`isAdmin`, isAdmin);

    const handleLogout = async () => {
        await signOut({
            redirect: true,
            callbackUrl: `/${params.lang}/auth/login`,
        });
    };

    return (
        <AdminContext
            value={{
                mode,
                setMode,
                MODES,
                isTripDetailsPage,
                isAdmin,
                user,
                handleLogout,
                lang: params.lang,
                loading,
                error,
            }}>
            {children}
        </AdminContext>
    );
};

export default AdminProvider;

