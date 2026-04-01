'use client';

import { getUserById } from '@/app/_actions/userActions';
import { VerificationContext } from '@/context/verification-context';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export const VerificationProvide = ({ children }) => {
    const { data: session } = useSession();
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!session?.user?.id) return;
        refreshVerification();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user?.id]);

    const refreshVerification = async () => {
        if (!session?.user?.id) return;
        try {
            setLoading(true);
            const response = await getUserById(session.user.id);
            setIsVerified(response?.user?.isVerified);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <VerificationContext.Provider
            value={{ isVerified, setIsVerified, refreshVerification, loading }}>
            {children}
        </VerificationContext.Provider>
    );
};

