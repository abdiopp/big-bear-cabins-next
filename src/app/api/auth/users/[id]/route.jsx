import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const DELETE = async (_req, context) => {
    try {
        const id = context.params.id;

        await prisma.user.delete({ where: { id: id } });

        return NextResponse.json({ message: 'User deleted', success: true }, { status: 200 });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ message: 'Error deleting user', error: error.message }, { status: 500 });
    }
};

