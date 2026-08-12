"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getAllBlogs, deleteBlog, getAllBlogCategories, toggleShowOnHomePage } from "@/actions/blogs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type Blog = {
    id: string;
    categoryId: string;
    slug: string;
    title: string;
    published: boolean;
    isShowOnHomePage?: boolean;
    createdAt: Date;
};

type BlogCategory = {
    id: string;
    slug: string;
    title: string;
};

export default function BlogsAdmin() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    async function loadData() {
        setLoading(true);
        const [blogsData, categoriesData] = await Promise.all([
            getAllBlogs(),
            getAllBlogCategories(),
        ]);

        const fetchedBlogs = (blogsData as Blog[]) || [];
        const fetchedCategories = (categoriesData as BlogCategory[]) || [];

        setBlogs(fetchedBlogs);
        setCategories(fetchedCategories);

        // Pehli category ko default active set karna
        if (fetchedCategories.length > 0 && !activeCategoryId) {
            setActiveCategoryId(fetchedCategories[0].id);
        }

        setLoading(false);
    }

    useEffect(() => {
        loadData();
    }, []);

    async function handleDelete(id: string, title: string) {
        if (confirm(`Delete "${title}"?`)) {
            await deleteBlog(id);
            loadData();
        }
    }

    function getCategoryTitle(categoryId: string) {
        const cat = categories.find((c) => c.id === categoryId);
        return cat?.title || "Unknown";
    }

    function getCategorySlug(categoryId: string) {
        const cat = categories.find((c) => c.id === categoryId);
        return cat?.slug || "";
    }

    // Active Category ke mutabiq blogs filter karna
    const filteredBlogs = useMemo(() => {
        if (!activeCategoryId || activeCategoryId === "all") {
            return blogs;
        }
        return blogs.filter((blog) => blog.categoryId === activeCategoryId);
    }, [blogs, activeCategoryId]);

    async function handleHomeToggle(id: string, currentValue: boolean) {
        const newValue = !currentValue;
        // Optimistic state update
        setBlogs((prev) =>
            prev.map((b) => (b.id === id ? { ...b, isShowOnHomePage: newValue } : b))
        );

        const res = await toggleShowOnHomePage(id, newValue);
        if (!res.success) {
            toast.error("Failed to update status");
            loadData(); // Revert on failure
        } else {
            toast.success("Home page visibility updated");
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Blog Posts</h1>
                <Link href="/admin/blogs/new">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        New Blog Post
                    </Button>
                </Link>
            </div>

            {/* Category Filter Tabs */}
            {!loading && categories.length > 0 && (
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                    <Button
                        variant={activeCategoryId === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveCategoryId("all")}
                        className={activeCategoryId === "all" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                    >
                        All Categories
                    </Button>
                    {categories.map((cat) => {
                        const isActive = activeCategoryId === cat.id;
                        return (
                            <Button
                                key={cat.id}
                                variant={isActive ? "default" : "outline"}
                                size="sm"
                                onClick={() => setActiveCategoryId(cat.id)}
                                className={isActive ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                            >
                                {cat.title}
                            </Button>
                        );
                    })}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>
                        {activeCategoryId === "all" || !activeCategoryId
                            ? "All Blog Posts"
                            : `${getCategoryTitle(activeCategoryId)} Blogs`}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                            <span className="ml-2 text-muted-foreground">Loading...</span>
                        </div>
                    ) : filteredBlogs.length === 0 ? (
                        <p className="text-muted-foreground py-4">
                            No blog posts found for this category.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>URL</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Show on Home</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBlogs.map((blog) => (
                                    <TableRow key={blog.id}>
                                        <TableCell className="font-medium">{blog.title}</TableCell>
                                        <TableCell>{getCategoryTitle(blog.categoryId)}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            /{getCategorySlug(blog.categoryId)}/{blog.slug}
                                        </TableCell>
                                        <TableCell>
                                            {blog.published ? (
                                                <span className="inline-flex items-center text-green-600">
                                                    <Eye className="w-4 h-4 mr-1" /> Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center text-gray-500">
                                                    <EyeOff className="w-4 h-4 mr-1" /> Draft
                                                </span>
                                            )}
                                        </TableCell>
                                        {/* <-- ADD TOGGLE SWITCH CELL --> */}
                                        <TableCell>
                                            <Switch
                                                checked={!!blog.isShowOnHomePage}
                                                onCheckedChange={() => handleHomeToggle(blog.id, !!blog.isShowOnHomePage)}
                                                className="data-[state=checked]:bg-green-600 bg-gray-400 border"
                                            />
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Link href={`/admin/blogs/${blog.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(blog.id, blog.title)}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}