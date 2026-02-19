"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, Hash, Clock, FileText, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    excerpt: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    ogImage: string | null;
    tags: string[];
    published: boolean;
};

const SLUG_REGEX = /^[a-z0-9-]+$/;

function sanitizeSlug(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}

function calculateReadingTime(html: string): number {
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const wordCount = text ? text.split(" ").length : 0;
    return Math.max(1, Math.ceil(wordCount / 200));
}

function countWords(html: string): number {
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return text ? text.split(" ").filter(Boolean).length : 0;
}

export default function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [slugError, setSlugError] = useState<string>("");
    const [form, setForm] = useState({
        categoryId: "",
        title: "",
        slug: "",
        subtitle: "",
        heroImage: "",
        content: "",
        excerpt: "",
        metaTitle: "",
        metaDescription: "",
        ogImage: "",
        tags: "",
        published: false,
    });

    useEffect(() => {
        async function loadData() {
            const [blogsData, categoriesData] = await Promise.all([
                getAllBlogs(),
                getAllBlogCategories(),
            ]);
            setCategories(categoriesData as BlogCategory[]);
            const blog = (blogsData as unknown as Blog[]).find((b) => b.id === id);
            if (blog) {
                setForm({
                    categoryId: blog.categoryId,
                    title: blog.title,
                    slug: blog.slug,
                    subtitle: blog.subtitle || "",
                    heroImage: blog.heroImage,
                    content: blog.content,
                    excerpt: blog.excerpt || "",
                    metaTitle: blog.metaTitle || "",
                    metaDescription: blog.metaDescription || "",
                    ogImage: blog.ogImage || "",
                    tags: blog.tags?.join(", ") || "",
                    published: blog.published,
                });
            }
            setInitialLoading(false);
        }
        loadData();
    }, [id]);

    const validateSlug = useCallback((slug: string) => {
        if (!slug) {
            setSlugError("Slug is required.");
            return false;
        }
        if (!SLUG_REGEX.test(slug)) {
            setSlugError("Only lowercase letters, numbers, and hyphens allowed.");
            return false;
        }
        setSlugError("");
        return true;
    }, []);

    function handleSlugChange(value: string) {
        const sanitized = sanitizeSlug(value);
        validateSlug(sanitized);
        setForm((f) => ({ ...f, slug: sanitized }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validateSlug(form.slug)) {
            toast.error("Please fix the slug before saving.");
            return;
        }
        setLoading(true);
        try {
            const result = await updateBlog(id, {
                categoryId: form.categoryId,
                title: form.title,
                slug: form.slug,
                subtitle: form.subtitle || undefined,
                heroImage: form.heroImage,
                content: form.content,
                excerpt: form.excerpt || undefined,
                metaTitle: form.metaTitle || undefined,
                metaDescription: form.metaDescription || undefined,
                ogImage: form.ogImage || undefined,
                tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
                published: form.published,
            });
            if (!result.success) {
                toast.error(result.error);
                return;
            }
            toast.success("Blog post saved!");
            router.push("/admin/blogs");
        } catch {
            toast.error("Error updating blog post");
        } finally {
            setLoading(false);
        }
    }

    const wordCount = countWords(form.content);
    const readingTime = calculateReadingTime(form.content);

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                <span className="ml-3 text-muted-foreground">Loading post...</span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/blogs" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Blog Posts
                </Link>
                <div className="h-4 w-px bg-border" />
                <h1 className="text-xl font-bold text-gray-900">Edit Blog Post</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ── LEFT COLUMN: Content ── */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title + Slug */}
                        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-semibold">Title *</Label>
                                <Input
                                    id="title"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                    className="text-lg h-11"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="slug" className="text-sm font-semibold flex items-center gap-1">
                                    <Hash className="w-3.5 h-3.5" />
                                    URL Slug *
                                </Label>
                                <Input
                                    id="slug"
                                    value={form.slug}
                                    onChange={(e) => handleSlugChange(e.target.value)}
                                    required
                                    className={slugError ? "border-red-400 focus-visible:ring-red-400" : ""}
                                />
                                {slugError ? (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {slugError}
                                    </p>
                                ) : form.slug ? (
                                    <p className="text-xs text-muted-foreground font-mono">
                                        URL preview: <span className="text-green-700">/{"{category}"}/{form.slug}</span>
                                    </p>
                                ) : null}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subtitle" className="text-sm font-semibold">Subtitle</Label>
                                <Input
                                    id="subtitle"
                                    value={form.subtitle}
                                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Rich Text Editor */}
                        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-2">
                            <div className="flex items-center justify-between mb-1">
                                <Label className="text-sm font-semibold">Content *</Label>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <FileText className="w-3 h-3" />
                                        {wordCount} words
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {readingTime} min read
                                    </span>
                                </div>
                            </div>
                            <RichTextEditor
                                value={form.content}
                                onChange={(value) => setForm({ ...form, content: value })}
                                placeholder="Write your blog content here..."
                                minHeight="450px"
                            />
                        </div>

                        {/* Feature Image */}
                        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-2">
                            <Label className="text-sm font-semibold">Feature Image *</Label>
                            <ImagePicker
                                value={form.heroImage}
                                onChange={(url) => setForm({ ...form, heroImage: url })}
                                label="Select Feature Image"
                            />
                        </div>

                        {/* Excerpt */}
                        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-2">
                            <Label htmlFor="excerpt" className="text-sm font-semibold">Excerpt</Label>
                            <p className="text-xs text-muted-foreground">A short summary shown in blog listings.</p>
                            <Textarea
                                id="excerpt"
                                value={form.excerpt}
                                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                rows={3}
                                placeholder="Brief summary of this post..."
                            />
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN: Settings ── */}
                    <div className="space-y-5">
                        {/* Publish */}
                        <div className="bg-white border rounded-xl p-5 shadow-sm">
                            <h3 className="text-sm font-semibold mb-4">Publish</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">
                                        {form.published ? (
                                            <span className="flex items-center gap-1.5 text-green-700">
                                                <Eye className="w-4 h-4" />
                                                Published
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-gray-500">
                                                <EyeOff className="w-4 h-4" />
                                                Draft
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {form.published ? "Visible to all visitors" : "Only visible in admin"}
                                    </p>
                                </div>
                                <Switch
                                    id="published"
                                    checked={form.published}
                                    onCheckedChange={(checked) => setForm({ ...form, published: checked })}
                                    className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                                />
                            </div>
                            <div className="mt-4 pt-4 border-t flex flex-col gap-2">
                                <Button
                                    type="submit"
                                    disabled={loading || !!slugError}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                                <Link href="/admin/blogs" className="w-full">
                                    <Button type="button" variant="outline" className="w-full">Cancel</Button>
                                </Link>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-3">
                            <h3 className="text-sm font-semibold">Category *</h3>
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

                        {/* Tags */}
                        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-2">
                            <h3 className="text-sm font-semibold">Tags</h3>
                            <p className="text-xs text-muted-foreground">Comma-separated (e.g., hiking, outdoors, tips)</p>
                            <Input
                                placeholder="hiking, outdoors, big bear"
                                value={form.tags}
                                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                            />
                            {form.tags && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                    {form.tags.split(",").map((t, i) => t.trim() && (
                                        <span key={i} className="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                            {t.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* SEO */}
                        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
                            <h3 className="text-sm font-semibold">SEO</h3>
                            <div className="space-y-2">
                                <Label htmlFor="metaTitle" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Meta Title</Label>
                                <Input
                                    id="metaTitle"
                                    placeholder="SEO page title..."
                                    value={form.metaTitle}
                                    onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground text-right">{form.metaTitle.length}/60</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="metaDescription" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Meta Description</Label>
                                <Textarea
                                    id="metaDescription"
                                    placeholder="Brief description for search engines..."
                                    value={form.metaDescription}
                                    onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                                    rows={3}
                                />
                                <p className="text-xs text-muted-foreground text-right">{form.metaDescription.length}/160</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">OpenGraph Image</Label>
                                <ImagePicker
                                    value={form.ogImage}
                                    onChange={(url) => setForm({ ...form, ogImage: url })}
                                    label="Select OG Image"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
