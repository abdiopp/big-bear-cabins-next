"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const SLUG_REGEX = /^[a-z0-9-]+$/;

function validateSlug(slug: string): string | null {
    if (!slug) return "Slug is required.";
    if (!SLUG_REGEX.test(slug))
        return "Slug can only contain lowercase letters, numbers, and hyphens.";
    return null;
}

// ============== BLOG CATEGORIES ==============

export async function getBlogCategories() {
    return await prisma.blogCategory.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
    });
}

export async function getAllBlogCategories() {
    return await prisma.blogCategory.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function getBlogCategoryBySlug(slug: string) {
    return await prisma.blogCategory.findUnique({
        where: { slug },
    });
}

export async function createBlogCategory(data: {
    slug: string;
    title: string;
    subtitle?: string;
    heroImage: string;
    description?: string;
    published?: boolean;
}) {
    const category = await prisma.blogCategory.create({ data });
    revalidatePath("/admin/blog-categories");
    return category;
}

export async function updateBlogCategory(
    id: string,
    data: {
        slug?: string;
        title?: string;
        subtitle?: string;
        heroImage?: string;
        description?: string;
        published?: boolean;
    }
) {
    const category = await prisma.blogCategory.update({
        where: { id },
        data,
    });
    revalidatePath("/admin/blog-categories");
    revalidatePath(`/${category.slug}`);
    return category;
}

export async function deleteBlogCategory(id: string) {
    // Also delete all blogs in this category
    const category = await prisma.blogCategory.findUnique({ where: { id } });
    if (category) {
        await prisma.blog.deleteMany({ where: { categoryId: id } });
        await prisma.blogCategory.delete({ where: { id } });
        revalidatePath("/admin/blog-categories");
        revalidatePath(`/${category.slug}`);
    }
    return { success: true };
}

// ============== BLOGS ==============

export async function getBlogs(categoryId?: string) {
    return await prisma.blog.findMany({
        where: {
            published: true,
            ...(categoryId ? { categoryId } : {}),
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function getBlogsByCategorySlug(categorySlug: string) {
    const category = await prisma.blogCategory.findUnique({
        where: { slug: categorySlug },
    });
    if (!category) return [];
    return await prisma.blog.findMany({
        where: { categoryId: category.id, published: true },
        orderBy: { createdAt: "desc" },
    });
}

export async function getAllBlogs() {
    return await prisma.blog.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function getBlogBySlug(slug: string) {
    return await prisma.blog.findUnique({
        where: { slug },
    });
}

export async function createBlog(data: {
    categoryId: string;
    slug: string;
    title: string;
    subtitle?: string;
    heroImage: string;
    content: string;
    excerpt?: string;
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    tags?: string[];
    published?: boolean;
}): Promise<{ success: true; data: Awaited<ReturnType<typeof prisma.blog.create>> } | { success: false; error: string }> {
    // Slug validation
    const slugError = validateSlug(data.slug);
    if (slugError) return { success: false, error: slugError };

    // Duplicate slug check
    const existing = await prisma.blog.findUnique({ where: { slug: data.slug } });
    if (existing) return { success: false, error: "A blog post with this slug already exists." };

    const blog = await prisma.blog.create({ data });
    revalidatePath("/admin/blogs");
    return { success: true, data: blog };
}

export async function updateBlog(
    id: string,
    data: {
        categoryId?: string;
        slug?: string;
        title?: string;
        subtitle?: string;
        heroImage?: string;
        content?: string;
        excerpt?: string;
        metaTitle?: string;
        metaDescription?: string;
        ogImage?: string;
        tags?: string[];
        published?: boolean;
    }
): Promise<{ success: true; data: Awaited<ReturnType<typeof prisma.blog.update>> } | { success: false; error: string }> {
    if (data.slug) {
        const slugError = validateSlug(data.slug);
        if (slugError) return { success: false, error: slugError };

        // Duplicate slug check (excluding current blog)
        const existing = await prisma.blog.findFirst({
            where: { slug: data.slug, NOT: { id } },
        });
        if (existing) return { success: false, error: "A blog post with this slug already exists." };
    }

    const blog = await prisma.blog.update({
        where: { id },
        data,
    });
    revalidatePath("/admin/blogs");
    return { success: true, data: blog };
}

export async function deleteBlog(id: string) {
    await prisma.blog.delete({ where: { id } });
    revalidatePath("/admin/blogs");
    return { success: true };
}
