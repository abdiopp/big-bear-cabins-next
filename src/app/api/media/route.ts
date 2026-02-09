import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const media = await prisma.media.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ media });
    } catch (error) {
        console.error("Failed to fetch media:", error);
        return NextResponse.json(
            { error: "Failed to fetch media" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { publicId, url, format, width, height, bytes, filename } = body;

        if (!publicId || !url) {
            return NextResponse.json(
                { error: "publicId and url are required" },
                { status: 400 }
            );
        }

        // Check if media with this publicId already exists
        const existing = await prisma.media.findUnique({
            where: { publicId },
        });

        if (existing) {
            return NextResponse.json({ media: existing });
        }

        const media = await prisma.media.create({
            data: {
                publicId,
                url,
                format: format || null,
                width: width || null,
                height: height || null,
                bytes: bytes || null,
                filename: filename || null,
            },
        });

        return NextResponse.json({ media }, { status: 201 });
    } catch (error) {
        console.error("Failed to save media:", error);
        return NextResponse.json(
            { error: "Failed to save media" },
            { status: 500 }
        );
    }
}
