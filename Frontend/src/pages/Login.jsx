import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import AuthLayout from "../components/AuthLayout";
import { LockIcon, MailIcon } from "../components/Icons";
import InputField from "../components/InputField";
import { clearAuthError, login } from "../redux/actions";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, token } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [token, navigate]);

  function clearMessage() {
    if (error) dispatch(clearAuthError());
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      dispatch({ type: "auth/failure", payload: "Please enter your email and password." });
      return;
    }

    try {
      const data = await dispatch(login({ email, password }));
      if (rememberMe) localStorage.setItem("rememberMe", "true");
      if (data?.token) localStorage.setItem("token", data.token);
      navigate("/home");
    } catch {
      // The thunk stores the API error in Redux for rendering.
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to buy, sell, or rent verified properties."
      activePage="login"
    >
      <AlertMessage type="error" message={error} />

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

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
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
