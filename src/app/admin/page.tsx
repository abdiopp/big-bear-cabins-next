import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/admin/reservations">
                    <Card className="hover:shadow-lg transition cursor-pointer gap-3">
                        <CardHeader>
                            <CardTitle className="font-bold text-lg">Reservations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            View recent bookings and marketing surveys.
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/home-hero">
                    <Card className="hover:shadow-lg transition cursor-pointer gap-3">
                        <CardHeader>
                            <CardTitle className="font-bold text-lg">Home Hero</CardTitle>
                        </CardHeader>
                        <CardContent>
                            Edit the main hero section of the home page.
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/coupons">
                    <Card className="hover:shadow-lg transition cursor-pointer gap-3">
                        <CardHeader>
                            <CardTitle className="font-bold text-lg">Coupons & Offers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            Manage special offers and coupons content.
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/blog-categories">
                    <Card className="hover:shadow-lg transition cursor-pointer gap-3">
                        <CardHeader>
                            <CardTitle className="font-bold text-lg">Blog Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            Manage blog category pages (e.g., Activities).
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/blogs">
                    <Card className="hover:shadow-lg transition cursor-pointer gap-3">
                        <CardHeader>
                            <CardTitle className="font-bold text-lg">Blog Posts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            Create and manage blog posts.
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/experiences-page">
                    <Card className="hover:shadow-lg transition cursor-pointer gap-3">
                        <CardHeader>
                            <CardTitle className="font-bold text-lg">Experiences Page</CardTitle>
                        </CardHeader>
                        <CardContent>
                            Manage hero, experience cards, and form responses.
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
