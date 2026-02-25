"use client";

import Image from "next/image";
import Link from "next/link";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

type Blog = {
    id: string;
    slug: string;
    title: string;
    subtitle?: string | null;
    heroImage: string;
    description?: string | null;
    excerpt?: string | null;
};

type CategoryData = {
    title: string;
    subtitle?: string | null;
    heroImage: string;
    description?: string | null;
};

/* ──────────────────────────────────────────────
   Sub-components
   ────────────────────────────────────────────── */

function BlogCardNew({
    blog,
    categorySlug,
}: {
    blog: Blog;
    categorySlug: string;
}) {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
            <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
                <Image
                    src={blog.heroImage}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            </div>
            <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800 mb-1 text-base line-clamp-2">
                    {blog.title}
                </h3>
                {blog.subtitle && (
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                        {blog.subtitle}
                    </p>
                )}
                {!blog.subtitle && blog.excerpt && (
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                        {blog.excerpt}
                    </p>
                )}
                <Link
                    href={`/${categorySlug}/${blog.slug}`}
                    className="inline-block w-full bg-[#4a7c3f] hover:bg-[#3d6834] text-white text-sm font-medium py-2.5 px-6 rounded-md transition-colors duration-200"
                >
                    Read More
                </Link>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────
   Main component
   ────────────────────────────────────────────── */

export function BlogCategoryNewDesign({
    categoryData,
    blogs,
    categorySlug,
}: {
    categoryData: CategoryData;
    blogs: Blog[];
    categorySlug: string;
}) {
    return (
        <div className="min-h-screen bg-white">
            {/* ───── Hero Section ───── */}
            <section className="relative h-[380px] sm:h-[440px] lg:h-[500px] overflow-hidden">
                <Image
                    src={categoryData.heroImage}
                    alt={categoryData.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/45" />

                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
                    <h1 className="text-white font-bold leading-tight max-w-3xl">
                        <span className="block text-[48px] sm:text-[60px] leading-[1.1]">
                            {categoryData.title}
                        </span>
                        {categoryData.subtitle && (
                            <span className="block font-medium text-[24px] sm:text-[35px] leading-[1.2] mt-2">
                                {categoryData.subtitle}
                            </span>
                        )}
                    </h1>
                </div>
            </section>

            {/* ───── Description ───── */}
            {categoryData.description && (
                <section className="py-8 sm:py-12 bg-gray-50">
                    <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl">
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-center">
                            {categoryData.description}
                        </p>
                    </div>
                </section>
            )}

            {/* ───── Blog Cards Grid ───── */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-10">
                        <span className="border-b-4 border-[#4a7c3f] pb-2">
                            Explore Our Posts
                        </span>
                    </h2>

                    {blogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {blogs.map((blog) => (
                                <BlogCardNew
                                    key={blog.id}
                                    blog={blog}
                                    categorySlug={categorySlug}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">
                            No posts in this category yet.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}
