import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
                <div className="p-4 text-xl font-bold">BBC Admin</div>
                <nav className="p-4 space-y-2">
                    <Link href="/admin" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Dashboard</Link>
                    <Link href="/admin/home-hero" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Home Hero</Link>
                    <Link href="/admin/coupons" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Coupons (Offers)</Link>
                    <Link href="/admin/blogs" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Blogs</Link>
                    <Link href="/admin/blog-categories" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Blog Categories</Link>
                </nav>
            </aside>
            <main className="flex-1 p-8 overflow-auto">
                <Suspense fallback={
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                }>
                    {children}
                </Suspense>
            </main>
        </div>
    );
}
