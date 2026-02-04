import type { HeroData } from "@/server/queries/utils/hero.query";
import { ArticleHero } from "./article-hero.component";
import { MediaHero } from "./media-hero.component";
import { TextHero } from "./text-hero.component";

type HeroProps = {
  hero: HeroData | null;
};

export const Hero = ({ hero }: HeroProps) => {
  if (!hero) return null;

  switch (hero.heroType) {
    case "textHero":
      return hero.textHero ? <TextHero {...hero.textHero} /> : null;
    case "mediaHero":
      return hero.mediaHero ? <MediaHero {...hero.mediaHero} /> : null;
    case "articleHero":
      return hero.articleHero ? <ArticleHero {...hero.articleHero} /> : null;
    default:
      return null;
  }
};
