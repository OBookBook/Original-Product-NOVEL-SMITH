import { CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { type AlertState } from "./types";

interface AlertMessageProps {
  alertState: AlertState;
}

export default function AlertMessage({ alertState }: AlertMessageProps) {
  if (!alertState.show) return;

  return (
    <Alert
      className={
        alertState.type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : ""
      }
      variant={alertState.type === "error" ? "destructive" : "default"}
    >
      {alertState.type === "success" ? (
        <CheckCircle className="h-4 w-4 text-emerald-600" />
      ) : (
        <XCircle className="h-4 w-4" />
      )}
      <AlertTitle>{alertState.title}</AlertTitle>
      <AlertDescription>{alertState.message}</AlertDescription>
    </Alert>
  );
}
