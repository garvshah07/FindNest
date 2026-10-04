import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "./Icons";

export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  rightElement,
  required = false,
  id,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name;
  const isPasswordField = type === "password";

  const resolvedType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={resolvedType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full py-2 text-xs sm:text-sm rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-150 ${
            icon ? "pl-9" : "pl-3"
          } ${isPasswordField || rightElement ? "pr-9" : "pr-3"}`}
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
          {rightElement}

          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOffIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
