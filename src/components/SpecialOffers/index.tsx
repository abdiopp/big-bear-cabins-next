import React from "react";
import { SpecialOffersClient } from "./SpecialOffersClient";
import { createClient } from "@/prismicio";

async function SpecialOffers() {
  const client = createClient();
  // fetch coupons data from prismic
  const coupons = await client.getSingle("coupons").catch((e) => {
    console.error("Error fetching coupons data:", e);
    return null;
  });

  return (
    <>
      123
      <SpecialOffersClient coupons={coupons} />
    </>
  );
}

export default SpecialOffers;
