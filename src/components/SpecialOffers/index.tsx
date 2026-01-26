import { getCoupons } from "@/actions/cms";
import React from "react";
import { SpecialOffersClient } from "./SpecialOffersClient";

async function SpecialOffers() {
  const coupons = await getCoupons();

  if (!coupons) return null;

  return <SpecialOffersClient coupons={coupons as any} />;
}

export default SpecialOffers;
