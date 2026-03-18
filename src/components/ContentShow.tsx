import { ReactNode } from "react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

interface ContentShowProps {
    title: string;
    description: ReactNode;
    image?: string;
}

export default function ContentShow({
    title,
    description,
    image,
}: ContentShowProps) {
    return (
        <main className="min-h-screen bg-white">

            {/* Hero */}
            <section className="relative h-[400px] md:h-[500px] w-full">
                <ImageWithFallback
                    src={
                        image ||
                        "https://res.cloudinary.com/dtqdflngh/image/upload/v1770838073/lyn5ilsj28ma6zzouw2f.jpg"
                    }
                    alt={title}
                    className="w-full h-full object-cover object-center"
                />

                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute inset-0 flex items-center justify-center px-2">
                    <h1 className="text-white text-4xl md:text-6xl font-bold text-center">
                        {title}
                    </h1>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-5xl mx-auto px-4 py-12">
                {description}
            </section>

        </main>
    );
}