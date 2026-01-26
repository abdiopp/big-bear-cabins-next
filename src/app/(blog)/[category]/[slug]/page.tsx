import { notFound } from "next/navigation";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { getBlogBySlug, getBlogCategoryBySlug } from "@/actions/blogs";

export default async function BlogPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
    const { category, slug } = await params;

    // Verify category exists
    const categoryData = await getBlogCategoryBySlug(category);
    if (!categoryData || !categoryData.published) {
        notFound();
    }

    const blog = await getBlogBySlug(slug);

    if (!blog || !blog.published || blog.categoryId !== categoryData.id) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Image Section */}
            <div className="w-full h-[60vh] relative overflow-hidden">
                <ImageWithFallback
                    src={blog.heroImage}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
                    <div className="max-w-7xl mx-auto px-6 pb-12 w-full">
                        <h1 className="text-white text-5xl mb-2">{blog.title}</h1>
                        {blog.subtitle && (
                            <p className="text-white/90">{blog.subtitle}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6 py-16 overflow-hidden">
                {/* Rich Text Content */}
                <div
                    className="prose prose-lg max-w-none w-full overflow-x-auto prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[#477023] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700 prose-img:max-w-full prose-pre:overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </div>
        </div>
    );
}
