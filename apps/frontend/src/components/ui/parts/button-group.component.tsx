import { Button } from "@/components/ui/button";
import { LinkResolver } from "@/components/utils/link-resolver.component";
import type { LinksProps } from "@/server/queries/utils/links.query";
import { cn } from "@/utils/cn.util";

type ButtonGroupProps = {
  buttons: LinksProps | undefined | null;
  className?: string;
};

export const ButtonGroup = (props: ButtonGroupProps) => {
  const { buttons, className } = props;

  if (!buttons || buttons.length < 1) return null;

  return (
    <div className={cn(className, "flex items-center flex-wrap")}>
      {buttons.map((button, index) => {
        const isLast = index === buttons.length - 1;

        return (
          <Button key={button._key} asChild variant={isLast ? "ghost" : "default"}>
            <LinkResolver {...button}>{button.title}</LinkResolver>
          </Button>
        );
      })}
    </div>
  );
};
