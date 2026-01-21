import type { HeroQueryProps } from "@/server/queries/utils/hero.query";
import { MediaAndFormHero } from "./media-and-form-hero.component";

export const Hero = (props: HeroQueryProps) => {
  const { heroType, mediaAndFormHero } = props;

  switch (heroType) {
    case "mediaAndFormHero":
      return mediaAndFormHero ? (
        <MediaAndFormHero {...mediaAndFormHero} />
      ) : (
        <div>Media and form hero content not found</div>
      );
    default:
      return <div>Hero type not found</div>;
  }
};
