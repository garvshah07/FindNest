import { useState } from "react";
import { Link } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import AuthLayout from "../components/AuthLayout";
import { LockIcon, MailIcon } from "../components/Icons";
import InputField from "../components/InputField";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function clearMessage() {
    if (message) setMessage(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage({ type: "error", text: "Please enter your email and password." });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setMessage({
          type: "error",
          text: data?.message || "The email or password is incorrect.",
        });
        return;
      }

      if (data?.token) localStorage.setItem("token", data.token);
      if (rememberMe) localStorage.setItem("rememberMe", "true");
      setMessage({ type: "success", text: data?.message || "Welcome back!" });
    } catch {
      setMessage({
        type: "error",
        text: "Cannot connect to FindNest. Please start the backend and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to buy, sell, or rent verified properties."
      activePage="login"
    >
      <AlertMessage type={message?.type} message={message?.text} />

      <form className="form" onSubmit={handleSubmit}>
        <InputField
          label="Email address"
          name="email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            clearMessage();
          }}
          placeholder="you@example.com"
          icon={<MailIcon />}
          required
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            clearMessage();
          }}
          placeholder="Enter your password"
          icon={<LockIcon />}
          required
        />

        <Link className="text-link forgot-link" to="/forgot-password">
          Forgot password?
        </Link>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
          />
          Remember this device
        </label>

        <button className="button" type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="form-footer">
        Do not have an account?{" "}
        <Link className="text-link" to="/signup">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
