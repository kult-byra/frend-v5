import type { VariantProps } from "class-variance-authority";
import { Button, type buttonVariants } from "@/components/ui/button";
import { LinkResolver } from "@/components/utils/link-resolver.component";
import type { LinksProps } from "@/server/queries/utils/links.query";
import { cn } from "@/utils/cn.util";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

type ButtonGroupProps = {
  buttons: LinksProps | undefined | null;
  className?: string;
  /** Fallback variant if individual buttons don't specify one */
  defaultVariant?: ButtonVariant;
};

export const ButtonGroup = (props: ButtonGroupProps) => {
  const { buttons, className, defaultVariant } = props;

  if (!buttons || buttons.length < 1) return null;

  return (
    <div className={cn(className, "flex items-center flex-wrap")}>
      {buttons.map((button) => {
        // Priority: per-button variant > defaultVariant prop > fallback to primary
        const perButtonVariant = "buttonVariant" in button ? button.buttonVariant : undefined;
        const buttonVariant = (perButtonVariant as ButtonVariant) ?? defaultVariant ?? "primary";

        return (
          <Button key={button._key} asChild variant={buttonVariant}>
            <LinkResolver {...button}>{button.title}</LinkResolver>
          </Button>
        );
      })}
    </div>
  );
};
