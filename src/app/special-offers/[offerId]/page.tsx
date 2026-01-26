import { SpecialOfferDetailPage } from "@/components/SpecialOfferDetailPage";
import { getCoupons } from "@/actions/cms";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SpecialOfferDetail({ params }: { params: Promise<{ offerId: string }> }) {
  const resolvedParams = await params;
  console.log("Detail Page - Params:", resolvedParams);

  const data = await getCoupons();
  // Log all available slugs to compare
  console.log("Detail Page - Available Slugs:", data?.offers?.map((o: any) => o.slug));

  const offer = data?.offers?.find((o: any) => o.slug === resolvedParams.offerId);
  console.log("Detail Page - Found Offer:", offer ? "Yes" : "No", "for slug:", resolvedParams.offerId);

  if (!offer) {
    notFound();
  }

  return <SpecialOfferDetailPage offer={offer} />;
}
