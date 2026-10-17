import { AlertCircleIcon, CheckCircleIcon } from "./Icons";

export default function AlertMessage({ type = "error", message }) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div className={`alert ${isSuccess ? "success" : "error"}`} role="alert">
      {isSuccess ? <CheckCircleIcon /> : <AlertCircleIcon />}
      <span>{message}</span>
    </div>
  );
}
