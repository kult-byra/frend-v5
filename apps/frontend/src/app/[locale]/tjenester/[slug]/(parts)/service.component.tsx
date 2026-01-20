import { toPlainText } from "next-sanity";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import type { ServiceQueryResult } from "@/sanity-types";

type Props = NonNullable<ServiceQueryResult>;

export const Service = (props: Props) => {
  const { title, subtitle, excerpt } = props;

  return (
    <Container className="py-12">
      <H1 className="mb-4">{title}</H1>
      {subtitle && (
        <p className="text-xl text-muted-foreground mb-4">{subtitle}</p>
      )}
      {excerpt && (
        <p className="text-muted-foreground mb-8">{toPlainText(excerpt)}</p>
      )}
    </Container>
  );
};
