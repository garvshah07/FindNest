import { CheckCircleIcon, AlertCircleIcon } from "./Icons";

export default function AlertMessage({ type = "error", message }) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`mb-3 p-2.5 rounded-xl text-xs flex items-start gap-2 border transition-all ${
        isSuccess
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
          : "bg-rose-500/10 border-rose-500/30 text-rose-300"
      }`}
    >
      {isSuccess ? (
        <CheckCircleIcon className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
      ) : (
        <AlertCircleIcon className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
      )}
      <span className="leading-snug">{message}</span>
    </div>
  );
}
