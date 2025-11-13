import { createClient } from "@/prismicio";
import React from "react";
import { HeroClient } from "./HeroClient";

async function Hero() {
  const client = createClient();
  // fetch hero data from prismic
  const hero = await client.getSingle("home_hero").catch((e) => {
    console.error("Error fetching hero data:", e);
    return null;
  });
  return <>{hero?.data && <HeroClient data={hero.data} />}</>;
}

export default Hero;
