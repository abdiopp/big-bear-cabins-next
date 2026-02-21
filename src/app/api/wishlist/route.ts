import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

// Fetch user's wishlist
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const wishlist = await prisma.wishlist.findMany({
            where: { userId: session.user.id },
            select: { propertyId: true, imageUrl: true },
        });

        // @ts-ignore
        const propertyIds = wishlist.map((item) => item.propertyId);

        return NextResponse.json({ wishlist: propertyIds, items: wishlist }, { status: 200 });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return NextResponse.json(
            { error: "Failed to fetch wishlist" },
            { status: 500 }
        );
    }
}

// Add a property to user's wishlist
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { propertyId, imageUrl } = body;

        if (!propertyId) {
            return NextResponse.json(
                { error: "Property ID is required" },
                { status: 400 }
            );
        }

        // Use upsert or try-catch for unique constraint
        try {
            // @ts-ignore
            const added = await prisma.wishlist.create({
                data: {
                    userId: session.user.id,
                    propertyId: String(propertyId),
                    imageUrl: imageUrl || null,
                },
            });
            return NextResponse.json({ success: true, item: added }, { status: 201 });
        } catch (dbError: any) {
            // Prisma error code for unique constraint violation
            if (dbError.code === "P2002") {
                return NextResponse.json(
                    { error: "Property is already in wishlist" },
                    { status: 409 }
                );
            }
            throw dbError;
        }
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        return NextResponse.json(
            { error: "Failed to add to wishlist" },
            { status: 500 }
        );
    }
}

// Remove a property from user's wishlist
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Extract propertyId from URL or body. Using search params as standard for DELETE.
        const url = new URL(req.url);
        const propertyId = url.searchParams.get("propertyId");

        if (!propertyId) {
            return NextResponse.json(
                { error: "Property ID is required in search params" },
                { status: 400 }
            );
        }

        // @ts-ignore
        await prisma.wishlist.deleteMany({
            where: {
                userId: session.user.id,
                propertyId: String(propertyId),
            },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        return NextResponse.json(
            { error: "Failed to remove from wishlist" },
            { status: 500 }
        );
    }
}
