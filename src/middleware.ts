import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Next.js Middleware for Route Protection
 *
 * This middleware:
 * 1. Protects routes from unauthorized access
 * 2. Redirects logged-in users away from login/register pages
 * 3. Uses NextAuth to check if the user is authenticated
 */

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // Define public auth routes (login/register)
  const isAuthPage = path === "/login" || path === "/register";

  // Define protected routes
  const isProtectedRoute = path.startsWith("/dashboard") || path.startsWith("/profile") || path.startsWith("/settings");

  // Redirect logged-in users away from login/register pages
  if (isAuthPage && token) {
    console.log(`🔄 Redirecting authenticated user ${token.email} from ${path} to /dashboard`);
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !token) {
    console.log(`🔒 Redirecting unauthenticated user from ${path} to /login`);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Log protected route access
  if (token && isProtectedRoute) {
    console.log(`✅ Authenticated access to ${path} by ${token.email}`);
  }

  // Allow access
  return NextResponse.next();
}

/**
 * Matcher Configuration
 *
 * Specify which routes should be checked by this middleware.
 * Includes both protected routes and auth pages (login/register).
 */
export const config = {
  matcher: [
    // Auth pages (redirect if logged in)
    "/login",
    "/register",

    // Protected routes (require authentication)
    "/dashboard/:path*",
    "/profile",
    "/profile/:path*",
    "/settings/:path*",

    // Add more protected routes as needed
    // "/bookings/:path*",
    // "/reservations/:path*",
  ],
};
