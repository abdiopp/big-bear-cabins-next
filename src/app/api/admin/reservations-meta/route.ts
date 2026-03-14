import { NextRequest, NextResponse } from "next/server";
import { getReservations } from "@/lib/streamline";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const email = searchParams.get('email');

        const params: any = {};
        if (email) params.email = email;

        // Fetch from Streamline
        const data = await getReservations(params);
        let reservations = data?.data?.reservations || [];

        // If returned as single object (Streamline can do this if only 1 result)
        if (!Array.isArray(reservations)) {
            reservations = [reservations];
        }

        // Fetch meta data from Prisma
        const confIds = reservations.map((r: any) => r.confirmation_id.toString());
        
        let metaMap: Record<string, string | null> = {};
        if (confIds.length > 0) {
            const metas = await prisma.reservationMeta.findMany({
                where: {
                    confirmationId: { in: confIds }
                }
            });
            metaMap = metas.reduce((acc, meta) => {
                acc[meta.confirmationId] = meta.heardAboutUs;
                return acc;
            }, {} as Record<string, string | null>);
        }

        // Merge the two
        const merged = reservations.map((res: any) => ({
            ...res,
            heardAboutUs: metaMap[res.confirmation_id.toString()] || null
        }));

        return NextResponse.json({ data: merged });

    } catch (error: any) {
        console.error('Error fetching admin reservations:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch admin reservations' },
            { status: 500 }
        );
    }
}
