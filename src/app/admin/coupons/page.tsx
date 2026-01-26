import { getCoupons } from "@/actions/cms";
import CouponsForm from "@/components/admin/CouponsForm";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
    const data = await getCoupons();

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-8">Edit Coupons & Offers</h1>
            <CouponsForm defaultValues={data as any} />
        </div>
    );
}
