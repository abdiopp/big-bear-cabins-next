// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function DELETE(
//     req: Request,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         await prisma.contactMessage.delete({
//             where: {
//                 id: params.id,
//             },
//         });

//         return NextResponse.json({
//             success: true,
//             message: "Message deleted successfully",
//         });
//     } catch (error) {
//         return NextResponse.json(
//             { error: "Delete failed" },
//             { status: 500 }
//         );
//     }
// }

// export async function PATCH(
//     req: Request,
//     { params }: { params: { id: string } }
// ) {

//     try {

//         const message = await prisma.contactMessage.findUnique({
//             where: { id: params.id }
//         });

//         if (!message) {
//             return NextResponse.json({ error: "Not found" }, { status: 404 });
//         }

//         if (message.status === "read") {
//             return NextResponse.json(message);
//         }

//         const updated = await prisma.contactMessage.update({
//             where: { id: params.id },
//             data: { status: "read" }
//         });

//         return NextResponse.json(updated);

//     } catch {
//         return NextResponse.json({ error: "Failed" }, { status: 500 });
//     }

// }


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {

        await prisma.contactMessage.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: "Message deleted successfully",
        });

    } catch {

        return NextResponse.json(
            { error: "Delete failed" },
            { status: 500 }
        );

    }
}

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {

    const { id } = await context.params;

    try {

        const message = await prisma.contactMessage.findUnique({
            where: { id }
        });

        if (!message) {
            return NextResponse.json(
                { error: "Not found" },
                { status: 404 }
            );
        }

        if (message.status === "read") {
            return NextResponse.json(message);
        }

        const updated = await prisma.contactMessage.update({
            where: { id },
            data: { status: "read" }
        });

        return NextResponse.json(updated);

    } catch {

        return NextResponse.json(
            { error: "Failed" },
            { status: 500 }
        );

    }
}