import { SpecialOfferDetailPage } from "@/components/SpecialOfferDetailPage";
import { getCoupons } from "@/actions/cms";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SpecialOfferDetail({ params }: { params: Promise<{ offerId: string }> }) {
  const resolvedParams = await params;

  const data = await getCoupons();

  const offer = data?.offers?.find((o: any) => o.slug === resolvedParams.offerId);

  if (!offer) {
    notFound();
  }

  return <SpecialOfferDetailPage offer={offer} />;
}
