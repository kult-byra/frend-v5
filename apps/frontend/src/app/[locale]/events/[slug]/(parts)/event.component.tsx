import { Container } from "@/components/layout/container.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import type { EventQueryResult } from "@/sanity-types";
import { cn } from "@/utils/cn.util";
import { EventHero } from "./event-hero.component";
import { EventInfoBox } from "./event-info-box.component";

type Props = NonNullable<EventQueryResult>;

export function Event(props: Props) {
  const { layout, color, hero, timeAndDate, location, price, description, content, signupForm } =
    props;

  const isSubmersive = layout === "submersive";
  const bgColor =
    isSubmersive && color === "yellow"
      ? "bg-container-overlay-secondary-3"
      : "bg-container-primary";

  return (
    <div className={bgColor}>
      {/* Hero */}
      <EventHero
        layout={layout}
        hero={hero}
        timeAndDate={timeAndDate}
        location={location}
        price={price}
        description={description}
      />

      {/* Main content */}
      <section className={cn("bg-container-primary", isSubmersive && bgColor)}>
        <Container className="pb-xl">
          {/* Mobile: Stacked */}
          <div className="flex flex-col gap-xl lg:hidden">
            {content && (
              <PortableText
                content={content}
                className="text-body text-text-primary"
                options={{ topHLevel: 2 }}
              />
            )}
            <EventInfoBox signupForm={signupForm} className="w-full" />
          </div>

          {/* Desktop: Sidebar overlays content, doesn't affect layout */}
          <div className="relative hidden lg:block">
            {/* Sidebar - absolutely positioned, overlays left side */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 w-[420px]">
              <div className="pointer-events-auto sticky top-xl">
                <EventInfoBox signupForm={signupForm} className="w-full" />
              </div>
            </div>

            {/* Content - full width, text right-aligned, blocks can span full width */}
            {content && (
              <PortableText
                content={content}
                className="text-body text-text-primary"
                options={{ topHLevel: 2, layoutMode: "pageBuilder" }}
              />
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
