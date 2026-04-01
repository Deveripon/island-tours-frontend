'use client';
import { getUserById } from '@/app/_actions/userActions';
import { UserContext } from '@/context/user-context';

import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';

export const UserProvider = ({ children }) => {
    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const refreshUser = useCallback(async () => {
        if (!session?.user?.id) return;

        try {
            setLoading(true);
            const response = await getUserById(session.user.id);

            setUser(response?.user || null);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }, [session?.user?.id]);

    useEffect(() => {
        if (!session?.user?.id) return;
        refreshUser();
    }, [refreshUser, session?.user?.id]);

    return (
        <UserContext.Provider value={{ user, setUser, refreshUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

