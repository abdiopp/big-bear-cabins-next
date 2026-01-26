"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Heart } from "lucide-react";

type Blog = {
    id: string;
    slug: string;
    title: string;
    heroImage: string;
};

export default function BlogCard({ blog, categorySlug }: { blog: Blog; categorySlug: string }) {
    const [saved, setSaved] = useState(false);

    return (
        <Link href={`/${categorySlug}/${blog.slug}`}>
            <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                        src={blog.heroImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Heart Icon */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSaved(!saved);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                        aria-label={saved ? "Remove from saved" : "Save for later"}
                    >
                        <Heart
                            className={`h-5 w-5 transition-colors ${saved
                                    ? "fill-red-500 text-red-500"
                                    : "text-gray-700 hover:text-red-500"
                                }`}
                        />
                    </button>
                </div>
                <div className="p-4">
                    <h3 className="text-gray-900 group-hover:text-primary transition-colors">
                        {blog.title}
                    </h3>
                </div>
            </div>
        </Link>
    );
}
