import { SpecialOffersPage } from "@/components/SpecialOffersPage";
import { getCoupons } from "@/actions/cms";

export const dynamic = "force-dynamic";

export default async function SpecialOffers() {
  const data = await getCoupons();
  return <SpecialOffersPage offers={data?.offers || []} />;
}
