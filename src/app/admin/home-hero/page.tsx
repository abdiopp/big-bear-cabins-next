import { getHomeHero } from "@/actions/cms";
import HomeHeroForm from "@/components/admin/HomeHeroForm";

export const dynamic = "force-dynamic";

export default async function AdminHomeHeroPage() {
    const data = await getHomeHero();

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-8">Edit Home Hero</h1>
            <HomeHeroForm defaultValues={data as any} />
        </div>
    );
}
