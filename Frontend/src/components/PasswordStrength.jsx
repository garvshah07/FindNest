export default function PasswordStrength({ password }) {
  if (!password) return null;

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const getStrengthData = () => {
    if (score <= 1) {
      return { label: "Weak", color: "bg-rose-500", text: "text-rose-400" };
    }
    if (score === 2) {
      return { label: "Fair", color: "bg-amber-500", text: "text-amber-400" };
    }
    if (score === 3) {
      return { label: "Good", color: "bg-indigo-500", text: "text-indigo-400" };
    }
    return { label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" };
  };

  const { label, color, text } = getStrengthData();

  return (
    <div className="mt-1 flex items-center gap-1.5">
      <div className="flex-1 grid grid-cols-4 gap-1 h-1">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full rounded-full transition-all duration-300 ${
              score >= step ? color : "bg-slate-700"
            }`}
          />
        ))}
      </div>

      <span className={`text-[10px] font-semibold ${text}`}>
        {label}
      </span>
    </div>
  );
}
