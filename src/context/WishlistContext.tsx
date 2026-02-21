"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner"; // Assuming sonner is used for toasts based on package.json

interface WishlistContextType {
    wishlist: string[];
    wishlistItems: { propertyId: string; imageUrl: string | null }[];
    addToWishlist: (propertyId: string, imageUrl?: string) => Promise<void>;
    removeFromWishlist: (propertyId: string) => Promise<void>;
    toggleWishlist: (propertyId: string, imageUrl?: string) => Promise<void>;
    isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
    undefined
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [wishlistItems, setWishlistItems] = useState<{ propertyId: string; imageUrl: string | null }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch wishlist on mount or when session changes
    useEffect(() => {
        async function fetchWishlist() {
            if (status === "authenticated") {
                try {
                    const res = await fetch("/api/wishlist");
                    if (res.ok) {
                        const data = await res.json();
                        setWishlist(data.wishlist || []);
                        setWishlistItems(data.items || []);
                    }
                } catch (error) {
                    console.error("Failed to fetch wishlist", error);
                }
            } else if (status === "unauthenticated") {
                setWishlist([]); // Clear if user logs out
                setWishlistItems([]);
            }
            setIsLoading(false);
        }

        if (status !== "loading") {
            fetchWishlist();
        }
    }, [status]);

    const addToWishlist = async (propertyId: string, imageUrl?: string) => {
        // Optimistic update
        setWishlist((prev) => [...prev, propertyId]);
        setWishlistItems((prev) => [...prev, { propertyId, imageUrl: imageUrl || null }]);

        try {
            const res = await fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ propertyId, imageUrl }),
            });

            if (!res.ok) {
                throw new Error("Failed to add to wishlist");
            }
            toast.success("Added to wishlist");
        } catch (error) {
            console.error(error);
            // Revert optimistic update
            setWishlist((prev) => prev.filter((id) => id !== propertyId));
            setWishlistItems((prev) => prev.filter((item) => item.propertyId !== propertyId));
            toast.error("Failed to add to wishlist");
        }
    };

    const removeFromWishlist = async (propertyId: string) => {
        // Optimistic update
        const previousWishlist = [...wishlist];
        const previousItems = [...wishlistItems];
        setWishlist((prev) => prev.filter((id) => id !== propertyId));
        setWishlistItems((prev) => prev.filter((id) => id.propertyId !== propertyId));

        try {
            const res = await fetch(`/api/wishlist?propertyId=${propertyId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to remove from wishlist");
            }
            toast.success("Removed from wishlist");
        } catch (error) {
            console.error(error);
            // Revert optimistic update
            setWishlist(previousWishlist);
            setWishlistItems(previousItems);
            toast.error("Failed to remove from wishlist");
        }
    };

    const toggleWishlist = async (propertyId: string, imageUrl?: string) => {
        if (wishlist.includes(propertyId)) {
            await removeFromWishlist(propertyId);
        } else {
            await addToWishlist(propertyId, imageUrl);
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                wishlistItems,
                addToWishlist,
                removeFromWishlist,
                toggleWishlist,
                isLoading,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
