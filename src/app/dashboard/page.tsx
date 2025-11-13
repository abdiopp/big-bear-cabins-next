import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "@/components/LogoutButton";
import Link from "next/link";

/**
 * Protected Dashboard Page
 * This page is protected by middleware and requires authentication
 */
export default async function DashboardPage() {
  // Get the session (will always exist due to middleware protection)
  const session = await getServerSession(authOptions);

  // Fallback redirect (middleware should handle this, but good practice)
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {session.user.name}!</p>
          </div>
          <LogoutButton variant="outline" />
        </div>

        {/* User Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Name:</span>
              <span>{session.user.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Email:</span>
              <span>{session.user.email}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Role:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {session.user.role}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">User ID:</span>
              <span className="text-sm text-muted-foreground">{session.user.id}</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/profile">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Profile</CardTitle>
                <CardDescription>View and edit your profile</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/settings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
                <CardDescription>Manage your preferences</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Protected Content Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Protected Content</CardTitle>
            <CardDescription>This content is only visible to authenticated users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is a protected dashboard that requires authentication. The middleware automatically redirects
              unauthenticated users to the login page.
            </p>
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ You are successfully authenticated and can access this protected content!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
