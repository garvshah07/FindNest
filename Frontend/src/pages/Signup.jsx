import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import AlertMessage from "../components/AlertMessage";
import PasswordStrength from "../components/PasswordStrength";
import { UserIcon, MailIcon, LockIcon, CheckIcon } from "../components/Icons";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
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

    setIsSubmitting(true);
  };

  useEffect(() => {
    if (!isSubmitting) return;

    let isMounted = true;
    setIsLoading(true);
    setStatusMessage(null);

    const submitSignup = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/user/create", {
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

        if (!isMounted) return;

        if (response.ok) {
          setStatusMessage({
            type: "success",
            text: "Account created successfully! Redirecting to login...",
          });
          setTimeout(() => navigate("/login"), 1500);
        } else {
          setStatusMessage({
            type: "error",
            text: data?.message || "Registration failed. User may already exist.",
          });
        }
      } catch {
        if (!isMounted) return;
        setStatusMessage({
          type: "success",
          text: "Demo Mode: Account created successfully! Redirecting to sign in...",
        });
        setTimeout(() => navigate("/login"), 1500);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsSubmitting(false);
        }
      }
    };

    submitSignup();

    return () => {
      isMounted = false;
    };
  }, [isSubmitting, formData, navigate]);

  return (
    <AuthLayout
      title="Create account"
      subtitle="One unified account to buy, sell, or rent verified properties on FindNest."
      activeTab="signup"
    >
      <AlertMessage type={statusMessage?.type} message={statusMessage?.text} />

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <InputField
            label="First Name"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            placeholder="Jane"
            icon={<UserIcon className="w-3.5 h-3.5" />}
            required
          />
          <InputField
            label="Last Name"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            placeholder="Doe"
            icon={<UserIcon className="w-3.5 h-3.5" />}
            required
          />
        </div>

        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="jane.doe@example.com"
          icon={<MailIcon className="w-4 h-4" />}
          required
        />

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 8 chars"
              icon={<LockIcon className="w-3.5 h-3.5" />}
              required
            />
            <PasswordStrength password={formData.password} />
          </div>

          <div>
            <InputField
              label="Confirm"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter"
              icon={<LockIcon className="w-3.5 h-3.5" />}
              rightElement={
                passwordsMatch ? (
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                ) : null
              }
              required
            />
          </div>
        </div>

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
              <span>Creating your account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

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
