/**
 * Example: How to protect pages and use authentication
 *
 * This file contains examples of common authentication patterns
 * Copy and adapt these examples for your use cases
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { NextResponse } from "next/server";
import { Button } from "@/components/ui/button";

// ==========================================
// 1. SERVER COMPONENT - Protected Page
// ==========================================
export async function ProtectedServerPage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Protected Server Component</h1>
      <p>Welcome, {session.user.name}!</p>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
    </div>
  );
}

// ==========================================
// 2. SERVER COMPONENT - Role-Based Protection
// ==========================================
export async function AdminOnlyPage() {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session) {
    redirect("/login");
  }

  // Check if user has admin role
  if (session.user.role !== "admin") {
    redirect("/unauthorized"); // or show error message
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin {session.user.name}!</p>
    </div>
  );
}

// ==========================================
// 3. CLIENT COMPONENT - Protected Page
// ==========================================
export function ProtectedClientPage() {
  "use client";
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div>
      <h1>Protected Client Component</h1>
      <p>Welcome, {session.user.name}!</p>
    </div>
  );
}

// ==========================================
// 4. API ROUTE - Protected Endpoint
// ==========================================
export async function ProtectedAPIRoute(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // API logic here - user is authenticated
  return NextResponse.json({
    message: "Success",
    user: session.user,
  });
}

// ==========================================
// 5. API ROUTE - Role-Based Protection
// ==========================================
export async function AdminOnlyAPIRoute(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
  }

  // Admin-only API logic here
  return NextResponse.json({
    message: "Admin action performed",
  });
}

// ==========================================
// 6. LOGOUT BUTTON COMPONENT
// ==========================================
export function LogoutButton() {
  "use client";

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  return (
    <Button onClick={handleLogout} variant="outline">
      Logout
    </Button>
  );
}

// ==========================================
// 7. USER PROFILE COMPONENT
// ==========================================
export function UserProfile() {
  "use client";
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <img src={session.user.image || "/default-avatar.png"} alt="Profile" className="w-10 h-10 rounded-full" />
      <div>
        <p className="font-medium">{session.user.name}</p>
        <p className="text-sm text-gray-500">{session.user.email}</p>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{session.user.role}</span>
      </div>
    </div>
  );
}

// ==========================================
// 8. MIDDLEWARE - Protect Multiple Routes
// ==========================================
// Create this in: middleware.ts (root of project)
/*
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    console.log("Authenticated user:", req.nextauth.token)
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/profile/:path*",
  ],
}
*/

// ==========================================
// 9. CUSTOM HOOK - useAuth
// ==========================================
export function useAuth() {
  "use client";
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === "loading",
    isAdmin: session?.user?.role === "admin",
  };
}

// Usage:
// const { user, isAuthenticated, isLoading, isAdmin } = useAuth()

// ==========================================
// 10. SERVER ACTION - With Authentication
// ==========================================
export async function serverActionExample(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Perform action with authenticated user
  const userId = session.user.id;

  // Your logic here...

  return { success: true };
}
