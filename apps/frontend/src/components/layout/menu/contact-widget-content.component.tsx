import { HubspotForm } from "@/components/hubspot/hubspot-form.component";
import { Img } from "@/components/utils/img.component";
import { Link } from "@/components/utils/link.component";
import { cn } from "@/utils/cn.util";
import { getLinkHref } from "./link-href.util";
import type { LinkGroupProps } from "./menu.types";

type ContactWidgetContentProps = {
  linkGroup: LinkGroupProps;
  onLinkClick?: () => void;
  /** Variant affects form container styling */
  variant?: "desktop" | "mobile";
};

export const ContactWidgetContent = ({
  linkGroup,
  onLinkClick,
  variant = "desktop",
}: ContactWidgetContentProps) => {
  const { linkGroups, contactForm, image } = linkGroup;

  return (
    <div className="flex flex-col gap-md">
      {/* Link groups and image row */}
      {(linkGroups?.length || image) && (
        <div className="flex gap-sm">
          {/* Link groups column */}
          {linkGroups && linkGroups.length > 0 && (
            <div className="flex flex-1 flex-col gap-md">
              {linkGroups.map((group) => (
                <div key={group._key} className="flex flex-col gap-2xs">
                  <h3 className="text-headline-3 text-text-primary">{group.title}</h3>
                  {group.links && group.links.length > 0 && (
                    <ul className="flex flex-col gap-2xs">
                      {group.links.map((link) => {
                        const href = getLinkHref(link);
                        if (!href) return null;
                        return (
                          <li key={link._key}>
                            <Link
                              href={href}
                              onClick={onLinkClick}
                              className="w-fit border-b border-stroke-soft text-body text-text-primary transition-colors hover:text-button-primary-hover"
                            >
                              {link.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Image */}
          {image?.asset && (
            <div className="aspect-[3/4] h-[186px] shrink-0 overflow-hidden rounded-3xs">
              <Img {...image} sizes={{ md: "third" }} className="h-full w-full" cover />
            </div>
          )}
        </div>
      )}

      {/* Contact form section */}
      {contactForm?.formId && (
        <div className={cn(variant === "mobile" && "rounded-3xs bg-container-primary p-xs")}>
          <HubspotForm formId={contactForm.formId} />
        </div>
      )}
    </div>
  );
};
