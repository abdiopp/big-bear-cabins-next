"use client";

import { useState, useEffect } from "react";
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
import { getAllBlogs, deleteBlog, getAllBlogCategories } from "@/actions/blogs";

type Blog = {
    id: string;
    categoryId: string;
    slug: string;
    title: string;
    published: boolean;
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
    const [loading, setLoading] = useState(true);

    async function loadData() {
        setLoading(true);
        const [blogsData, categoriesData] = await Promise.all([
            getAllBlogs(),
            getAllBlogCategories(),
        ]);
        setBlogs(blogsData as Blog[]);
        setCategories(categoriesData as BlogCategory[]);
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

            <Card>
                <CardHeader>
                    <CardTitle>All Blog Posts</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                            <span className="ml-2 text-muted-foreground">Loading...</span>
                        </div>
                    ) : blogs.length === 0 ? (
                        <p className="text-muted-foreground">No blog posts yet. Create your first one!</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>URL</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {blogs.map((blog) => (
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
