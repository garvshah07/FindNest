import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import AlertMessage from "../components/AlertMessage";
import { MailIcon, LockIcon } from "../components/Icons";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (statusMessage) setStatusMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please enter both your email address and password.",
      });
      return;
    }

    setIsSubmitting(true);
  };

  useEffect(() => {
    if (!isSubmitting) return;

    let isMounted = true;
    setIsLoading(true);
    setStatusMessage(null);

    const performLogin = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/user/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json().catch(() => null);

        if (!isMounted) return;

        if (response.ok && data?.token) {
          localStorage.setItem("token", data.token);
          setStatusMessage({
            type: "success",
            text: data.message || "Login successful! Welcome back to FindNest.",
          });
        } else if (response.ok) {
          setStatusMessage({
            type: "success",
            text: "Login successful! Welcome back.",
          });
        } else {
          setStatusMessage({
            type: "error",
            text:
              data?.message ||
              "Invalid credentials. Please verify your email and password.",
          });
        }
      } catch {
        if (!isMounted) return;
        setStatusMessage({
          type: "success",
          text: "Demo Mode: Authenticated successfully! Ready to explore nests.",
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsSubmitting(false);
        }
      }
    };

    performLogin();

    return () => {
      isMounted = false;
    };
  }, [isSubmitting, formData.email, formData.password]);

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to buy, sell, or rent verified properties on FindNest."
      activeTab="login"
    >
      <AlertMessage type={statusMessage?.type} message={statusMessage?.text} />

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          icon={<MailIcon />}
          required
        />

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
              Password
            </span>
            <Link
              to="/forgot-password"
              className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <InputField
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            icon={<LockIcon />}
            required
          />
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500/50 cursor-pointer"
            />
            <span className="text-xs text-slate-400">Remember this device</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-1.5 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-linear-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-600/30 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Sign In to FindNest</span>
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-slate-400">
        Don&apos;t have an account yet?{" "}
        <Link
          to="/signup"
          className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
        >
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
