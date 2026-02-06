import type { HeroData } from "@/server/queries/utils/hero.query";
import { ArticleHero } from "./article-hero.component";
import { MediaHero } from "./media-hero.component";
import { StickyHero } from "./sticky-hero.component";

type HeroProps = {
  hero: HeroData | null;
};

export const Hero = ({ hero }: HeroProps) => {
  if (!hero) return null;

  switch (hero.heroType) {
    case "mediaHero":
      return hero.mediaHero ? <MediaHero {...hero.mediaHero} /> : null;
    case "articleHero":
      return hero.articleHero ? <ArticleHero {...hero.articleHero} /> : null;
    case "stickyHero":
      return hero.stickyHero ? <StickyHero {...hero.stickyHero} /> : null;
    default:
      return null;
  }
};
