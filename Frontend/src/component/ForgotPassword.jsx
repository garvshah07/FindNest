import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  RefreshCwIcon,
  CheckIcon,
} from "./Icons";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Current Step: 1 = Email, 2 = Enter OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [resendTimer, setResendTimer] = useState(45);

  const otpInputs = useRef([]);

  // Resend code countdown timer
  useEffect(() => {
    let timer;
    if (step === 2 && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  // Handle OTP digit change with auto-focus
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, 4).split("");
      const newOtp = [...otp];
      pasted.forEach((char, i) => {
        if (i < 4) newOtp[i] = char;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(pasted.length, 3);
      otpInputs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto advance
    if (value && index < 3) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  // Step 1: Submit email to request code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please enter your registered email address.",
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      setResendTimer(45);
      setStatusMessage({
        type: "success",
        text: `A 4-digit reset code has been dispatched to ${email}.`,
      });
    }, 800);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 4) {
      setStatusMessage({
        type: "error",
        text: "Please enter the complete 4-digit verification code.",
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
      setStatusMessage({
        type: "success",
        text: "Code verified! Please choose a new secure password.",
      });
    }, 800);
  };

  // Step 3: Set new password
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setStatusMessage({
        type: "error",
        text: "New password must be at least 8 characters long.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({
        type: "error",
        text: "Passwords do not match.",
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      setStep(4);
    }, 900);
  };

  const resendCode = () => {
    if (resendTimer > 0) return;
    setResendTimer(45);
    setStatusMessage({
      type: "success",
      text: `A fresh verification code was sent to ${email}.`,
    });
  };

  return (
    <AuthLayout
      title={
        step === 4
          ? "Password Reset"
          : step === 3
          ? "Set new password"
          : step === 2
          ? "Verify your identity"
          : "Forgot password?"
      }
      subtitle={
        step === 4
          ? "Your credentials have been successfully updated."
          : step === 3
          ? "Must be at least 8 characters with a mix of letters and numbers."
          : step === 2
          ? `Enter the 4-digit code sent to ${email || "your email"}.`
          : "Don't worry, it happens. Enter your registered email and we'll send you recovery instructions."
      }
      activeTab="forgot"
    >
      {/* Step Progress Tracker (Steps 1 to 3) */}
      {step < 4 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5">
            <span className={step >= 1 ? "text-indigo-400 font-semibold" : ""}>
              1. Email
            </span>
            <span className={step >= 2 ? "text-indigo-400 font-semibold" : ""}>
              2. Code
            </span>
            <span className={step >= 3 ? "text-indigo-400 font-semibold" : ""}>
              3. Password
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300 rounded-full"
              style={{
                width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
              }}
            />
          </div>
        </div>
      )}

      {/* Status Feedback Message */}
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

      {/* STEP 1: Enter Email */}
      {step === 1 && (
        <form onSubmit={handleRequestCode} className="space-y-3">
          <div>
            <label
              htmlFor="reset-email"
              className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1"
            >
              Registered Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MailIcon className="w-4 h-4" />
              </div>
              <input
                id="reset-email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (statusMessage) setStatusMessage(null);
                }}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-150"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-1.5 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-600/30 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <span>Sending Code...</span>
            ) : (
              <span>Send Verification Code</span>
            )}
          </button>
        </form>
      )}

      {/* STEP 2: Enter OTP Verification Code */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 text-center mb-2.5">
              Enter 4-Digit Code
            </label>
            <div className="flex justify-center gap-2.5">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-11 h-12 text-center text-lg font-bold rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          {/* Resend Timer & Action */}
          <div className="text-center text-xs text-slate-400">
            {resendTimer > 0 ? (
              <span>Resend code in {resendTimer}s</span>
            ) : (
              <button
                type="button"
                onClick={resendCode}
                className="text-indigo-400 hover:text-indigo-300 font-semibold underline inline-flex items-center gap-1 cursor-pointer"
              >
                <RefreshCwIcon className="w-3.5 h-3.5" />
                Resend code now
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-600/30 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? <span>Verifying...</span> : <span>Verify Code</span>}
          </button>
        </form>
      )}

      {/* STEP 3: Enter New Password */}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-3">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <LockIcon className="w-4 h-4" />
              </div>
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-150"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOffIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmResetPassword"
              className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <LockIcon className="w-4 h-4" />
              </div>
              <input
                id="confirmResetPassword"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className={`w-full pl-9 pr-9 py-2 rounded-xl bg-slate-800/80 border text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-150 ${
                  confirmPassword && confirmPassword !== newPassword
                    ? "border-rose-500 focus:border-rose-500"
                    : confirmPassword && confirmPassword === newPassword
                    ? "border-emerald-500 focus:border-emerald-500"
                    : "border-slate-700/80 focus:border-indigo-500"
                }`}
              />
              {confirmPassword && confirmPassword === newPassword && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <CheckIcon className="w-4 h-4 text-emerald-400" />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-1.5 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-600/30 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <span>Updating Password...</span>
            ) : (
              <span>Save & Update Password</span>
            )}
          </button>
        </form>
      )}

      {/* STEP 4: Success State */}
      {step === 4 && (
        <div className="text-center py-2 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
            <CheckIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Password Reset Successfully!
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Your account password has been updated. You can now log in.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-600/30 transition-all duration-150 cursor-pointer"
          >
            Proceed to Sign In
          </button>
        </div>
      )}

      {/* Back to Login Link */}
      <div className="mt-3.5 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </AuthLayout>
  );
}
