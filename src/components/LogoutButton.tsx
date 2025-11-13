"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link";
  className?: string;
}

/**
 * Client-side Logout Button
 * Uses NextAuth's signOut function to properly log out users
 */
export function LogoutButton({ variant = "outline", className }: LogoutButtonProps) {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  };

  return (
    <Button variant={variant} onClick={handleLogout} className={className}>
      Logout
    </Button>
  );
}
