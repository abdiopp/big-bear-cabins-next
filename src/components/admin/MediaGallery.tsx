"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, ImageIcon, Loader2 } from "lucide-react";

interface MediaItem {
    id: string;
    publicId: string;
    url: string;
    format: string | null;
    width: number | null;
    height: number | null;
    filename: string | null;
    createdAt: string;
}

interface MediaGalleryProps {
    onSelect: (url: string) => void;
}

export default function MediaGallery({ onSelect }: MediaGalleryProps) {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        try {
            const res = await fetch("/api/media");
            const data = await res.json();
            setMedia(data.media || []);
        } catch (e) {
            console.error("Failed to fetch media:", e);
        } finally {
            setLoading(false);
        }
    };

    const filteredMedia = media.filter((item) =>
        item.filename?.toLowerCase().includes(search.toLowerCase()) ||
        item.publicId.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (media.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No images uploaded yet</p>
                <p className="text-sm text-muted-foreground">
                    Upload images to see them here
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search images..."
                    className="pl-9"
                />
            </div>

            <ScrollArea className="h-[300px]">
                <div className="grid grid-cols-3 gap-3 p-1">
                    {filteredMedia.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onSelect(item.url)}
                            className="relative aspect-square bg-muted rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors focus:outline-none focus:border-primary cursor-pointer"
                        >
                            <img
                                src={item.url}
                                alt={item.filename || item.publicId}
                                className="w-full h-full object-cover"
                            />
                            {item.filename && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                                    <p className="text-xs text-white truncate">
                                        {item.filename}
                                    </p>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {filteredMedia.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8">
                        <p className="text-muted-foreground">No images match your search</p>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
