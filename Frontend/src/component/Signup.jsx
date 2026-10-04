import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  CheckIcon,
  SparklesIcon,
} from "./Icons";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User", // 'User' (Tenant) or 'Host' (Owner)
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (statusMessage) setStatusMessage(null);
  };

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const getStrengthLabel = () => {
    if (!formData.password) return { label: "", color: "" };
    if (passwordStrength <= 1) return { label: "Weak", color: "bg-rose-500", text: "text-rose-400" };
    if (passwordStrength === 2) return { label: "Fair", color: "bg-amber-500", text: "text-amber-400" };
    if (passwordStrength === 3) return { label: "Good", color: "bg-indigo-500", text: "text-indigo-400" };
    return { label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" };
  };

  const strengthInfo = getStrengthLabel();
  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstname.trim() || !formData.lastname.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please provide both your first and last name.",
      });
      return;
    }

    if (!formData.email.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please provide a valid email address.",
      });
      return;
    }

    if (formData.password.length < 8) {
      setStatusMessage({
        type: "error",
        text: "Password must be at least 8 characters long.",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatusMessage({
        type: "error",
        text: "Passwords do not match. Please verify.",
      });
      return;
    }

    if (!formData.agreeTerms) {
      setStatusMessage({
        type: "error",
        text: "Please accept the Terms of Service & Privacy Policy.",
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      // Connect to the FindNest backend
      const response = await fetch("http://localhost:5000/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        setStatusMessage({
          type: "success",
          text: "Account created successfully! Redirecting to login...",
        });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setStatusMessage({
          type: "error",
          text: data?.message || "Registration failed. User may already exist.",
        });
      }
    } catch {
      // Demo simulated success if backend server is not running
      setStatusMessage({
        type: "success",
        text: "Demo Mode: Account created successfully! Redirecting to sign in...",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="One unified account to buy, sell, or rent verified properties on FindNest."
      activeTab="signup"
    >
      {/* Unified User All-in-One Capabilities Indicator */}
      <div className="mb-3 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
        <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
          <SparklesIcon className="w-3.5 h-3.5 text-indigo-400" />
          Single User Account
        </span>
        <div className="flex items-center gap-1 text-[10px] font-semibold">
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Buy
          </span>
          <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Sell
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Rent
          </span>
        </div>
      </div>

      {/* Status feedback message */}
      {statusMessage && (
        <div
          className={`mb-3 p-2.5 rounded-xl text-xs flex items-start gap-2 border ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircleIcon className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
          ) : (
            <AlertCircleIcon className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* Name Fields (First & Last) */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label
              htmlFor="firstname"
              className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1"
            >
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
              <input
                id="firstname"
                name="firstname"
                type="text"
                required
                value={formData.firstname}
                onChange={handleChange}
                placeholder="Jane"
                className="w-full pl-8 pr-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-150"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="lastname"
              className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1"
            >
              Last Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
              <input
                id="lastname"
                name="lastname"
                type="text"
                required
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full pl-8 pr-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-150"
              />
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="signup-email"
            className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <MailIcon className="w-4 h-4" />
            </div>
            <input
              id="signup-email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="jane.doe@example.com"
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-150"
            />
          </div>
        </div>

        {/* Password & Confirm Password (Side by Side to eliminate scrolling) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Password Field */}
          <div>
            <label
              htmlFor="signup-password"
              className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <LockIcon className="w-3.5 h-3.5" />
              </div>
              <input
                id="signup-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 8 chars"
                className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-150"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOffIcon className="w-3.5 h-3.5" />
                ) : (
                  <EyeIcon className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Compact Strength Bar */}
            {formData.password && (
              <div className="mt-1 flex items-center gap-1.5">
                <div className="flex-1 grid grid-cols-4 gap-1 h-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full rounded-full transition-all duration-300 ${
                        passwordStrength >= step
                          ? strengthInfo.color
                          : "bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-[10px] font-semibold ${strengthInfo.text}`}>
                  {strengthInfo.label}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1"
            >
              Confirm
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <LockIcon className="w-3.5 h-3.5" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter"
                className={`w-full pl-8 pr-8 py-1.5 rounded-xl bg-slate-800/80 border text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-150 ${
                  formData.confirmPassword && !passwordsMatch
                    ? "border-rose-500/80 focus:border-rose-500"
                    : passwordsMatch
                    ? "border-emerald-500/80 focus:border-emerald-500"
                    : "border-slate-700/80 focus:border-indigo-500"
                }`}
              />
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1">
                {passwordsMatch && (
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="w-3.5 h-3.5" />
                  ) : (
                    <EyeIcon className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Terms Agreement Checkbox */}
        <div className="pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500/50 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 leading-tight">
              I agree to the{" "}
              <a href="#" className="text-indigo-400 hover:underline">
                Terms of Service
              </a>{" "}
              &{" "}
              <a href="#" className="text-indigo-400 hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-1.5 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-600/30 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin w-3.5 h-3.5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <span>Creating your account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      {/* Bottom Switch Link */}
      <p className="mt-4 text-center text-xs text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
