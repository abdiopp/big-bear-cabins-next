import { getHomeHero } from "@/actions/cms";
import React from "react";
import { HeroClient } from "./HeroClient";

async function Hero() {
  const hero = await getHomeHero();

  if (!hero) return null;

  return <HeroClient data={hero as any} />;
}

export default Hero;
