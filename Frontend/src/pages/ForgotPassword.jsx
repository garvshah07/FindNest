import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import AuthLayout from "../components/AuthLayout";
import { LockIcon, MailIcon } from "../components/Icons";
import InputField from "../components/InputField";
import {
  requestPasswordReset,
  resetPassword as resetPasswordRequest,
  verifyPasswordResetOtp,
} from "../redux/actions";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const { error, loading, resetToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(45);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (step !== 2 || secondsLeft === 0) return undefined;
    const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, secondsLeft]);

  function showError(text) {
    setMessage({ type: "error", text });
  }

  async function requestCode(event) {
    event.preventDefault();
    if (!email.trim()) {
      showError("Please enter your email address.");
      return;
    }
    try {
      const data = await dispatch(requestPasswordReset(email.trim()));
      setStep(2);
      setMessage({ type: "success", text: data.message });
      setSecondsLeft(45);
    } catch {
      // The thunk stores the API error in Redux for rendering.
    }
  }

  async function verifyCode(event) {
    event.preventDefault();
    if (code.length !== 6) {
      showError("Please enter the complete 6-digit code.");
      return;
    }
    try {
      await dispatch(verifyPasswordResetOtp({ email, otp: code }));
      setStep(3);
      setMessage({ type: "success", text: "Code verified. Choose a new password." });
    } catch {
      // The thunk stores the API error in Redux for rendering.
    }
  }

  async function resetPassword(event) {
    event.preventDefault();
    if (newPassword.length < 8) {
      showError("Your new password must have at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showError("The passwords do not match.");
      return;
    }
    try {
      await dispatch(resetPasswordRequest({ resetToken, newPassword }));
      setStep(4);
      setMessage(null);
    } catch {
      // The thunk stores the API error in Redux for rendering.
    }
  }

  const titles = [
    "Forgot password?",
    "Check your email",
    "Choose a new password",
    "Password reset",
  ];

  const subtitles = [
    "Enter your email and we will send you a verification code.",
    `Enter the 6-digit code sent to ${email || "your email"}.`,
    "Choose a new password with at least 8 characters.",
    "Your password has been updated successfully.",
  ];

  return (
    <AuthLayout title={titles[step - 1]} subtitle={subtitles[step - 1]} activePage="login">
      {step < 4 && (
        <div className="steps">
          <span className={step >= 1 ? "current" : ""}>1. Email</span>
          <span className={step >= 2 ? "current" : ""}>2. Code</span>
          <span className={step >= 3 ? "current" : ""}>3. Password</span>
        </div>
      )}

      <AlertMessage type={message?.type || "error"} message={message?.text || error} />

      {step === 1 && (
        <form className="form" onSubmit={requestCode}>
          <InputField
            label="Email address"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            icon={<MailIcon />}
            required
          />
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send verification code"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form className="form" onSubmit={verifyCode}>
          <div className="field">
            <label htmlFor="code">6-digit verification code</label>
            <input
              className="otp-input"
              id="code"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              placeholder="000000"
              maxLength={6}
              required
            />
          </div>
          <p className="resend">
            {secondsLeft > 0
              ? `You can request another code in ${secondsLeft}s.`
              : "You can request another code now."}
          </p>
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Checking..." : "Verify code"}
          </button>
        </form>
      )}

      {step === 3 && (
        <form className="form" onSubmit={resetPassword}>
          <InputField
            label="New password"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="At least 8 characters"
            icon={<LockIcon />}
            required
          />
          <InputField
            label="Confirm new password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Type it again"
            icon={<LockIcon />}
            required
          />
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      )}

      {step === 4 && (
        <div className="form">
          <AlertMessage type="success" message="You can now sign in with your new password." />
          <button className="button" type="button" onClick={() => navigate("/login")}>
            Go to sign in
          </button>
        </div>
      )}

      <p className="form-footer">
        <Link className="text-link" to="/login">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
