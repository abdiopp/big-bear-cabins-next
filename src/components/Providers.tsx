"use client";

import { SessionProvider } from "next-auth/react";

import { Toaster } from "sonner";
import { WishlistProvider } from "@/context/WishlistContext";

/**
 * Client-side Providers Component
 * Wraps children with SessionProvider to enable authentication context
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <WishlistProvider>
        {children}
        <Toaster position="top-center" richColors />
      </WishlistProvider>
    </SessionProvider>
  );
}
