import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

// Admin: list form responses
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "20", 10);

        const where = status ? { status } : {};

        const [responses, total] = await Promise.all([
            prisma.experienceFormResponse.findMany({
                where,
                orderBy: { submittedAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.experienceFormResponse.count({ where }),
        ]);

        return NextResponse.json({
            responses,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Failed to fetch responses:", error);
        return NextResponse.json(
            { error: "Failed to fetch responses" },
            { status: 500 }
        );
    }
}

// Admin: update response status
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        if (!data.id || !data.status) {
            return NextResponse.json(
                { error: "ID and status are required" },
                { status: 400 }
            );
        }

        const validStatuses = ["new", "reviewed", "contacted"];
        if (!validStatuses.includes(data.status)) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
            );
        }

        const updated = await prisma.experienceFormResponse.update({
            where: { id: data.id },
            data: { status: data.status },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Failed to update response:", error);
        return NextResponse.json(
            { error: "Failed to update response" },
            { status: 500 }
        );
    }
}
