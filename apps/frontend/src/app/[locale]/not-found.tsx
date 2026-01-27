import { H1 } from "@/components/layout/heading.component";

const NotFound = () => {
  return (
    <section className="bg-container-primary py-xl">
      <div className="mx-auto max-w-[1920px] px-(--margin)">
        <div className="grid gap-(--gutter) lg:grid-cols-2">
          {/* Empty cell on desktop */}
          <div className="hidden lg:block" />

          {/* Content */}
          <div className="flex max-w-[720px] flex-col gap-sm pr-md">
            <div className="flex flex-col gap-xs">
              <p className="text-base text-text-secondary">Error 404</p>
              <H1 balance={false}>Beklager, vi kan ikke finne siden du leter etter!</H1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
