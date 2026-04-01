"use client";

import { SessionProvider } from "next-auth/react";
import { UserProvider } from "./user-provider";
import { VerificationProvide } from "./verification-provider";

export function Providers({ children }) {
    return (
        <SessionProvider>
            <VerificationProvide>
                <UserProvider>{children}</UserProvider>
            </VerificationProvide>
        </SessionProvider>
    );
}

