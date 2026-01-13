import { Icon } from "@/components/icon.component";
import { StatusMessage } from "@/components/utils/status-message.component";

export const Loading = (props: { text?: string }) => {
  const { text } = props;

  return (
    <StatusMessage type="busy">
      <Icon name="loader-pinwheel" className="animate-spin" />
      <span>{text ?? "Laster"}…</span>
    </StatusMessage>
  );
};
