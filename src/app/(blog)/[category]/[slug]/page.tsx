import { notFound } from "next/navigation";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { getBlogBySlug, getBlogCategoryBySlug } from "@/actions/blogs";
import sanitizeHtml from "sanitize-html";
import { Calendar, Clock, Share2, Facebook, Twitter, Link2, Tag } from "lucide-react";
import Link from "next/link";

// Explicit type for Blog including all new fields
type BlogPost = {
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
    createdAt: Date;
    updatedAt: Date;
};

function calculateReadingTime(html: string): number {
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const wordCount = text ? text.split(" ").length : 0;
    return Math.max(1, Math.ceil(wordCount / 200));
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(date));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ category: string; slug: string }>;
}) {
    const { category, slug } = await params;
    const categoryData = await getBlogCategoryBySlug(category);
    const blog = await getBlogBySlug(slug) as unknown as BlogPost | null;

    if (!blog || !categoryData) return { title: "Blog Post" };

    return {
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.excerpt || blog.subtitle || undefined,
        openGraph: {
            title: blog.metaTitle || blog.title,
            description: blog.metaDescription || blog.excerpt || undefined,
            images: blog.ogImage ? [{ url: blog.ogImage }] : blog.heroImage ? [{ url: blog.heroImage }] : [],
        },
    };
}

export default async function BlogPage({
    params,
}: {
    params: Promise<{ category: string; slug: string }>;
}) {
    const { category, slug } = await params;

    const categoryData = await getBlogCategoryBySlug(category);
    if (!categoryData || !categoryData.published) notFound();

    const blog = await getBlogBySlug(slug) as unknown as BlogPost | null;
    if (!blog || !blog.published || blog.categoryId !== categoryData.id) notFound();

    // Server-side sanitization with sanitize-html — pure Node.js, no jsdom required
    const safeContent = sanitizeHtml(blog.content, {
        allowedTags: [
            "p", "br", "b", "strong", "i", "em", "u", "s", "strike",
            "h1", "h2", "h3", "h4", "h5", "h6",
            "ul", "ol", "li",
            "blockquote", "pre", "code",
            "a", "img",
            "figure", "figcaption",
            "table", "thead", "tbody", "tr", "th", "td",
            "hr", "span", "div",
        ],
        allowedAttributes: {
            a: ["href", "title", "target", "rel"],
            img: ["src", "alt", "title", "width", "height"],
            "*": ["class", "style"],
        },
        selfClosing: ["img", "br", "hr"],
        allowedSchemes: ["http", "https", "mailto"],
    });

    const readingTime = calculateReadingTime(blog.content);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bigbearcabins.com";
    const postUrl = `${siteUrl}/${category}/${slug}`;

    // JSON-LD structured data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: blog.title,
        description: blog.metaDescription || blog.excerpt || blog.subtitle || "",
        image: blog.heroImage,
        datePublished: blog.createdAt,
        dateModified: blog.updatedAt,
        author: {
            "@type": "Organization",
            name: "Big Bear Cabins",
            url: siteUrl,
        },
        publisher: {
            "@type": "Organization",
            name: "Big Bear Cabins",
            url: siteUrl,
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": postUrl,
        },
    };

    return (
        <>
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="min-h-screen bg-white">
                {/* Hero */}
                <div className="w-full h-[55vh] md:h-[65vh] relative overflow-hidden">
                    <ImageWithFallback
                        src={blog.heroImage}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end">
                        <div className="max-w-4xl mx-auto px-6 pb-12 w-full">
                            {/* Breadcrumb */}
                            <nav className="flex items-center gap-2 text-white/70 text-sm mb-4">
                                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                                <span>/</span>
                                <Link href={`/${category}`} className="hover:text-white transition-colors capitalize">
                                    {categoryData.title}
                                </Link>
                                <span>/</span>
                                <span className="text-white/90 truncate max-w-[200px]">{blog.title}</span>
                            </nav>

                            <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight mb-3">
                                {blog.title}
                            </h1>
                            {blog.subtitle && (
                                <p className="text-white/85 text-lg md:text-xl mb-4 max-w-2xl">{blog.subtitle}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(blog.createdAt)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    {readingTime} min read
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Article Body */}
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 gap-12">
                        {/* Main Content */}
                        <article>
                            {/* Tags */}
                            {blog.tags && blog.tags.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 mb-8">
                                    <Tag className="w-4 h-4 text-gray-400" />
                                    {blog.tags.map((tag: string) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full border border-green-200"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Rich Text Content */}
                            <div
                                className="blog-content"
                                dangerouslySetInnerHTML={{ __html: safeContent }}
                            />

                            {/* Share Buttons */}
                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Share2 className="w-4 h-4" />
                                        Share this post
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <a
                                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(blog.title)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800 transition-colors"
                                        >
                                            <Twitter className="w-4 h-4" />
                                            X / Twitter
                                        </a>
                                        <a
                                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
                                        >
                                            <Facebook className="w-4 h-4" />
                                            Facebook
                                        </a>
                                        <button
                                            onClick={undefined}
                                            className="copy-link-btn flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors"
                                            data-url={postUrl}
                                        >
                                            <Link2 className="w-4 h-4" />
                                            Copy Link
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>

            {/* Client-side copy link script */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        document.addEventListener('click', function(e) {
                            var btn = e.target.closest('.copy-link-btn');
                            if (!btn) return;
                            var url = btn.getAttribute('data-url');
                            if (navigator.clipboard) {
                                navigator.clipboard.writeText(url).then(function() {
                                    btn.textContent = '✓ Copied!';
                                    setTimeout(function() {
                                        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> Copy Link';
                                    }, 2000);
                                });
                            }
                        });
                    `,
                }}
            />
        </>
    );
}
