"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/RichTextEditor";
import { Switch } from "@/components/ui/switch";
import ImagePicker from "@/components/admin/ImagePicker";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getAllBlogs, updateBlog, getAllBlogCategories } from "@/actions/blogs";

type BlogCategory = {
    id: string;
    slug: string;
    title: string;
};

type Blog = {
    id: string;
    categoryId: string;
    slug: string;
    title: string;
    subtitle: string | null;
    heroImage: string;
    content: string;
    published: boolean;
};

export default function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [form, setForm] = useState({
        categoryId: "",
        title: "",
        slug: "",
        subtitle: "",
        heroImage: "",
        content: "",
        published: false,
    });

    useEffect(() => {
        async function loadData() {
            const [blogsData, categoriesData] = await Promise.all([
                getAllBlogs(),
                getAllBlogCategories(),
            ]);
            setCategories(categoriesData as BlogCategory[]);
            const blog = (blogsData as Blog[]).find((b) => b.id === id);
            if (blog) {
                setForm({
                    categoryId: blog.categoryId,
                    title: blog.title,
                    slug: blog.slug,
                    subtitle: blog.subtitle || "",
                    heroImage: blog.heroImage,
                    content: blog.content,
                    published: blog.published,
                });
            }
            setInitialLoading(false);
        }
        loadData();
    }, [id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await updateBlog(id, {
                categoryId: form.categoryId,
                title: form.title,
                slug: form.slug,
                subtitle: form.subtitle || undefined,
                heroImage: form.heroImage,
                content: form.content,
                published: form.published,
            });
            router.push("/admin/blogs");
        } catch (error) {
            toast.error("Error updating blog post");
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
                <Link href="/admin/blogs" className="inline-flex items-center text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog Posts
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Blog Post</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                value={form.categoryId}
                                onValueChange={(value) => setForm({ ...form, categoryId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

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
                            <ImagePicker
                                value={form.heroImage}
                                onChange={(url) => setForm({ ...form, heroImage: url })}
                                label="Select Hero Image"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Content *</Label>
                            <RichTextEditor
                                value={form.content}
                                onChange={(value) => setForm({ ...form, content: value })}
                                placeholder="Write your blog content here..."
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
                            <Link href="/admin/blogs">
                                <Button type="button" variant="outline">Cancel</Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
