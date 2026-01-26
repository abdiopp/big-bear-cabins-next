"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { getAllBlogCategories, updateBlogCategory } from "@/actions/blogs";

type BlogCategory = {
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    heroImage: string;
    description: string | null;
    published: boolean;
};

export default function EditBlogCategory({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [form, setForm] = useState({
        title: "",
        slug: "",
        subtitle: "",
        heroImage: "",
        description: "",
        published: false,
    });

    useEffect(() => {
        async function loadCategory() {
            const categories = await getAllBlogCategories();
            const cat = categories.find((c) => c.id === id);
            if (cat) {
                setForm({
                    title: cat.title,
                    slug: cat.slug,
                    subtitle: cat.subtitle || "",
                    heroImage: cat.heroImage,
                    description: cat.description || "",
                    published: cat.published,
                });
            }
            setInitialLoading(false);
        }
        loadCategory();
    }, [id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await updateBlogCategory(id, {
                title: form.title,
                slug: form.slug,
                subtitle: form.subtitle || undefined,
                heroImage: form.heroImage,
                description: form.description || undefined,
                published: form.published,
            });
            router.push("/admin/blog-categories");
        } catch (error) {
            alert("Error updating category");
            console.error(error);
        }
        setLoading(false);
    }

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                <span className="ml-3 text-muted-foreground">Loading...</span>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <Link href="/admin/blog-categories" className="inline-flex items-center text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Categories
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">URL Slug *</Label>
                                <Input
                                    id="slug"
                                    value={form.slug}
                                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">URL: /{form.slug}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subtitle">Subtitle</Label>
                            <Input
                                id="subtitle"
                                value={form.subtitle}
                                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="heroImage">Hero Image URL *</Label>
                            <Input
                                id="heroImage"
                                value={form.heroImage}
                                onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                rows={4}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
                            <Switch
                                id="published"
                                checked={form.published}
                                onCheckedChange={(checked) => setForm({ ...form, published: checked })}
                                className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                            />
                            <div>
                                <Label htmlFor="published" className="font-medium cursor-pointer">
                                    {form.published ? "Published" : "Draft"}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    {form.published ? "Visible to visitors" : "Only visible in admin"}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                            <Link href="/admin/blog-categories">
                                <Button type="button" variant="outline">Cancel</Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
