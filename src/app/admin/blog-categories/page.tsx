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
import { getAllBlogCategories, deleteBlogCategory } from "@/actions/blogs";

type BlogCategory = {
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    heroImage: string;
    description: string | null;
    published: boolean;
    createdAt: Date;
};

export default function BlogCategoriesAdmin() {
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadCategories() {
        setLoading(true);
        const data = await getAllBlogCategories();
        setCategories(data as BlogCategory[]);
        setLoading(false);
    }

    useEffect(() => {
        loadCategories();
    }, []);

    async function handleDelete(id: string, title: string) {
        if (confirm(`Delete "${title}"? This will also delete all blogs in this category.`)) {
            await deleteBlogCategory(id);
            loadCategories();
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Blog Categories</h1>
                <Link href="/admin/blog-categories/new">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        New Category
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                            <span className="ml-2 text-muted-foreground">Loading...</span>
                        </div>
                    ) : categories.length === 0 ? (
                        <p className="text-muted-foreground">No categories yet. Create your first one!</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((cat) => (
                                    <TableRow key={cat.id}>
                                        <TableCell className="font-medium">{cat.title}</TableCell>
                                        <TableCell className="text-muted-foreground">/{cat.slug}</TableCell>
                                        <TableCell>
                                            {cat.published ? (
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
                                            <Link href={`/admin/blog-categories/${cat.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(cat.id, cat.title)}
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
