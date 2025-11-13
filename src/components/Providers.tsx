"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Client-side Providers Component
 * Wraps children with SessionProvider to enable authentication context
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
