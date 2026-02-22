import ExperiencesPageForm from "@/components/admin/ExperiencesPageForm";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Manage Experiences Page | Admin",
};

export default function ExperiencesPageAdmin() {
    return (
        <div className="container mx-auto py-6">
            <ExperiencesPageForm />
        </div>
    );
}
