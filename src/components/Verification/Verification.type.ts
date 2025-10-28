export type ResultStatusType = "success" | "error" | "info" | "warning";

export type Props = {
  status: ResultStatusType;
  title: string;
  subtitle: string;
  onRetry?: () => void;
  onResend?: () => void;
};
