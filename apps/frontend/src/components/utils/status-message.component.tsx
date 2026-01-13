import type { ComponentProps } from "react";
import { cn } from "@/utils/cn.util";

type StatusType = "status" | "alert" | "progress" | "busy";

type BaseStatusProps = {
  /**
   * The type of status message, which determines the ARIA role and behavior
   * @default "status"
   */
  type?: StatusType;
  /**
   * Whether to use polite or assertive live region
   * @default "polite"
   */
  assertive?: boolean;
};

const getAriaAttributes = (type: StatusType = "status", assertive = false) => {
  switch (type) {
    case "alert":
      return {
        role: "alert",
        "aria-live": assertive ? "assertive" : "polite",
      } as const;
    case "progress":
      return {
        role: "status",
        "aria-live": "polite",
        "aria-atomic": "false",
      } as const;
    case "busy":
      return {
        role: "status",
        "aria-live": "polite",
        "aria-busy": "true",
      } as const;
    default:
      return {
        role: "status",
        "aria-live": "polite",
      } as const;
  }
};

export type StatusWrapperProps = Omit<
  ComponentProps<"div">,
  "role" | "aria-live" | "aria-atomic" | "aria-busy"
> &
  BaseStatusProps;

export const StatusWrapper = ({
  type = "status",
  assertive = false,
  children,
  ...props
}: StatusWrapperProps) => {
  return (
    <div {...getAriaAttributes(type, assertive)} {...props}>
      {children}
    </div>
  );
};

StatusWrapper.displayName = "StatusWrapper";

export type StatusMessageProps = Omit<
  StatusWrapperProps,
  "role" | "aria-live" | "aria-atomic" | "aria-busy"
>;

export const StatusMessage = ({
  type = "status",
  assertive = false,
  className,
  children,
  ...props
}: StatusMessageProps) => {
  return (
    <StatusWrapper
      type={type}
      assertive={assertive}
      className={cn(
        "flex items-center justify-center p-3 text-sm text-center",
        type === "alert" && "bg-red-50 text-red-900",
        className,
      )}
      {...props}
    >
      {children}
    </StatusWrapper>
  );
};

StatusMessage.displayName = "StatusMessage";

// Additional components for semantic HTML elements
export type StatusParagraphProps = Omit<
  ComponentProps<"p">,
  "role" | "aria-live" | "aria-atomic" | "aria-busy"
> &
  BaseStatusProps;

export const StatusParagraph = ({
  type = "status",
  assertive = false,
  children,
  ...props
}: StatusParagraphProps) => {
  return (
    <p {...getAriaAttributes(type, assertive)} {...props}>
      {children}
    </p>
  );
};

StatusParagraph.displayName = "StatusParagraph";

export type StatusSpanProps = Omit<
  ComponentProps<"span">,
  "role" | "aria-live" | "aria-atomic" | "aria-busy"
> &
  BaseStatusProps;

export const StatusSpan = ({
  type = "status",
  assertive = false,
  children,
  ...props
}: StatusSpanProps) => {
  return (
    <span {...getAriaAttributes(type, assertive)} {...props}>
      {children}
    </span>
  );
};

StatusSpan.displayName = "StatusSpan";
