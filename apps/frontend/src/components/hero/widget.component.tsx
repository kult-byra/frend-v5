"use client";

import { resolvePath } from "@workspace/routing/src/resolve-path";
import { useState } from "react";
import { HubspotForm } from "@/components/hubspot/hubspot-form.component";
import { Icon } from "@/components/icon.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/parts/button-group.component";
import { Link } from "@/components/utils/link.component";
import type { WidgetData } from "@/server/queries/utils/hero.query";
import { cn } from "@/utils/cn.util";

type WidgetType = NonNullable<WidgetData["widgetType"]>;

const WIDGET_BG_COLORS: Record<WidgetType, string> = {
  default: "bg-container-overlay-secondary-1",
  form: "bg-container-overlay-secondary-1",
  event: "bg-container-overlay-secondary-3",
  newsletter: "bg-container-overlay-secondary-4",
};

type WidgetProps = {
  widget: WidgetData;
  className?: string;
};

export const Widget = ({ widget, className }: WidgetProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!widget.useWidget || !isVisible) return null;

  const widgetType = widget.widgetType ?? "default";
  const bgColor = WIDGET_BG_COLORS[widgetType];

  return (
    <div className={cn("flex w-[300px] flex-col gap-xs p-xs lg:w-[380px]", bgColor, className)}>
      <WidgetHeader title={getWidgetTitle(widget)} onClose={() => setIsVisible(false)} />
      <WidgetContent widget={widget} />
      <WidgetCTA widget={widget} />
    </div>
  );
};

type WidgetHeaderProps = {
  title: string | null;
  onClose: () => void;
};

const WidgetHeader = ({ title, onClose }: WidgetHeaderProps) => {
  return (
    <div className="flex w-full items-start justify-between">
      <div className="flex flex-1 items-center pt-3xs">
        {title && <h3 className="text-[20px] font-semibold leading-[1.3] text-primary">{title}</h3>}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="flex size-8 shrink-0 items-center justify-center cursor-pointer"
        aria-label="Lukk widget"
      >
        <Icon name="sm-close-thin" className="size-[14px] text-primary" />
      </button>
    </div>
  );
};

type WidgetContentProps = {
  widget: WidgetData;
};

const WidgetContent = ({ widget }: WidgetContentProps) => {
  const widgetType = widget.widgetType ?? "default";

  switch (widgetType) {
    case "default":
      return <DefaultWidgetContent content={widget.defaultContent} />;
    case "event":
      return <EventWidgetContent event={widget.eventReference} />;
    case "form":
      return <FormWidgetContent form={widget.formReference} />;
    case "newsletter":
      return <NewsletterWidgetContent form={widget.newsletterForm} />;
    default:
      return null;
  }
};

type DefaultWidgetContentProps = {
  content: WidgetData["defaultContent"];
};

const DefaultWidgetContent = ({ content }: DefaultWidgetContentProps) => {
  if (!content) return null;

  return (
    <div className="text-base leading-[145%] text-primary">
      <PortableText content={content} />
    </div>
  );
};

type EventWidgetContentProps = {
  event: WidgetData["eventReference"];
};

const EventWidgetContent = ({ event }: EventWidgetContentProps) => {
  if (!event) return null;

  const startTime = event.timeAndDate?.startTime;
  const formattedDate = startTime
    ? new Date(startTime).toLocaleDateString("nb-NO", {
        weekday: "long",
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col gap-2xs text-base leading-[145%]">
      {event.excerpt && (
        <div className="text-primary">
          <PortableText content={event.excerpt} />
        </div>
      )}
      {formattedDate && <p className="text-secondary">{formattedDate}</p>}
    </div>
  );
};

type FormWidgetContentProps = {
  form: WidgetData["formReference"];
};

const FormWidgetContent = ({ form }: FormWidgetContentProps) => {
  if (!form?.formId) return null;

  return <HubspotForm formId={form.formId} />;
};

type NewsletterWidgetContentProps = {
  form: WidgetData["newsletterForm"];
};

const NewsletterWidgetContent = ({ form }: NewsletterWidgetContentProps) => {
  if (!form?.formId) return null;

  return <HubspotForm formId={form.formId} />;
};

type WidgetCTAProps = {
  widget: WidgetData;
};

const WidgetCTA = ({ widget }: WidgetCTAProps) => {
  const widgetType = widget.widgetType ?? "default";

  switch (widgetType) {
    case "default":
      return <ButtonGroup buttons={widget.defaultLinks} className="gap-2xs" />;
    case "event":
      return <EventWidgetCTA event={widget.eventReference} />;
    case "form":
    case "newsletter":
      return null;
    default:
      return null;
  }
};

type EventWidgetCTAProps = {
  event: WidgetData["eventReference"];
};

const EventWidgetCTA = ({ event }: EventWidgetCTAProps) => {
  if (!event?.slug) return null;

  return (
    <Button asChild variant="primary" className="w-fit">
      <Link href={resolvePath("event", { slug: event.slug })}>Meld deg på</Link>
    </Button>
  );
};

const getWidgetTitle = (widget: WidgetData): string | null => {
  const widgetType = widget.widgetType ?? "default";

  switch (widgetType) {
    case "default":
      return widget.defaultTitle ?? null;
    case "event":
      return widget.eventReference?.title ?? null;
    case "form":
      return widget.formTitle ?? null;
    case "newsletter":
      return widget.newsletterForm?.title ?? null;
    default:
      return null;
  }
};
