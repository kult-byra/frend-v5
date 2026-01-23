import { Container, type ContainerProps } from "@/components/layout/container.component";
import { cn } from "@/utils/cn.util";

type BlockContainerProps = ContainerProps & {
  bgColor?: string;
};

export const BlockContainer = (props: BlockContainerProps) => {
  const { as: Tag = "section", children, bgColor, className, ...rest } = props;

  if (bgColor) {
    return (
      <Tag className={cn(bgColor, "py-xl md:py-xl")}>
        <Container {...rest} className={className}>
          {children}
        </Container>
      </Tag>
    );
  }

  return (
    <Container as={Tag} {...rest} className={cn(className, "my-xl md:my-xl")}>
      {children}
    </Container>
  );
};
