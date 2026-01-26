import { notFound } from "next/navigation";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { getBlogCategoryBySlug, getBlogsByCategorySlug } from "@/actions/blogs";
import BlogCard from "@/components/BlogCard";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;

    const categoryData = await getBlogCategoryBySlug(category);

    if (!categoryData || !categoryData.published) {
        notFound();
    }

    const blogs = await getBlogsByCategorySlug(category);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                <ImageWithFallback
                    src={categoryData.heroImage}
                    alt={categoryData.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4">
                        <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
                            {categoryData.title}
                        </h1>
                        {categoryData.subtitle && (
                            <p className="text-white/90 text-lg md:text-xl">
                                {categoryData.subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Description */}
                {categoryData.description && (
                    <div className="mb-12">
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {categoryData.description}
                        </p>
                    </div>
                )}

                {/* Blog Cards */}
                {blogs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {blogs.map((blog) => (
                            <BlogCard
                                key={blog.id}
                                blog={blog}
                                categorySlug={category}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No posts in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
