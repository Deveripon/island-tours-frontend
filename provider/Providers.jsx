"use client";

import { signOut, useSession, SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { UserProvider } from "./user-provider";
import { VerificationProvide } from "./verification-provider";

function SessionExpiryGuard() {
    const { data: session } = useSession();

    useEffect(() => {
        if (
            session?.error === "RefreshAccessTokenError" ||
            session?.error === "RefreshTokenExpired" ||
            session?.error === "RefreshTokenNotAvailable"
        ) {
            signOut({ callbackUrl: "/" });
        }
    }, [session?.error]);

    return null;
}

export function Providers({ children, session }) {
    return (
        <SessionProvider session={session}>
            <SessionExpiryGuard />
            <VerificationProvide>
                <UserProvider>{children}</UserProvider>
            </VerificationProvide>
        </SessionProvider>
    );
}

