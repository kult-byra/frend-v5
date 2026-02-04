import { StatusMessage } from "@/components/utils/status-message.component";

export const Loading = (props: { text?: string }) => {
  const { text } = props;

  return (
    <StatusMessage type="busy">
      <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      <span>{text ?? "Laster"}…</span>
    </StatusMessage>
  );
};
