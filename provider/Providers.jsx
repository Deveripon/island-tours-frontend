"use client";

import { SessionProvider } from "next-auth/react";
import { UserProvider } from "./user-provider";
import { VerificationProvide } from "./verification-provider";

export function Providers({ children, session }) {
    return (
        <SessionProvider session={session}>
            <VerificationProvide>
                <UserProvider>{children}</UserProvider>
            </VerificationProvide>
        </SessionProvider>
    );
}

