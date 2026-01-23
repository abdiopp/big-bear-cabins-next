import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/admin/home-hero">
                    <Card className="hover:shadow-lg transition cursor-pointer">
                        <CardHeader>
                            <CardTitle>Home Hero</CardTitle>
                        </CardHeader>
                        <CardContent>
                            Edit the main hero section of the home page.
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/coupons">
                    <Card className="hover:shadow-lg transition cursor-pointer">
                        <CardHeader>
                            <CardTitle>Coupons & Offers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            Manage special offers and coupons content.
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
