import { Icon } from "@/components/icon.component";
import { Img } from "@/components/utils/img.component";
import { Link } from "@/components/utils/link.component";
import type { ImageQueryProps } from "@/server/queries/utils/image.query";

type MenuDocumentTeaserProps = {
  image: ImageQueryProps | null;
  topTitle: string;
  title: string;
  description?: string | null;
  href: string;
  onClose: () => void;
};

export const MenuDocumentTeaser = ({
  image,
  topTitle,
  title,
  description,
  href,
  onClose,
}: MenuDocumentTeaserProps) => {
  return (
    <article className="group relative rounded-xs bg-container-overlay-tint p-xs">
      <div className="flex gap-xs">
        {/* Image - 80px width, 3:4 aspect ratio */}
        {image?.asset && (
          <div className="relative aspect-3/4 w-20 shrink-0 overflow-hidden rounded-xs">
            <Img {...image} sizes={{ md: "third" }} className="h-full w-full" cover />
          </div>
        )}

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="flex flex-col gap-2xs pr-sm">
            <span className="text-body-small text-text-primary">{topTitle}</span>
            <h3 className="line-clamp-3 text-body-title text-text-primary">
              <Link href={href} onClick={onClose} className="after:absolute after:inset-0">
                {title}
              </Link>
            </h3>
            {description && (
              <p className="line-clamp-2 text-body text-text-primary">{description}</p>
            )}
          </div>

          {/* Arrow button - bottom right */}
          <div className="flex justify-end">
            <div className="flex size-8 items-center justify-center rounded-full bg-white transition-colors group-hover:bg-orange">
              <Icon name="sm-arrow-right" className="size-[10px] text-text-primary" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
