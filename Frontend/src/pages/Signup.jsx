import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import AuthLayout from "../components/AuthLayout";
import { LockIcon, MailIcon, UserIcon } from "../components/Icons";
import InputField from "../components/InputField";
import PasswordStrength from "../components/PasswordStrength";
import { clearAuthError, signup } from "../redux/actions";

export default function Signup() {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [message, setMessage] = useState(null);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setMessage(null);
    if (error) dispatch(clearAuthError());
  }

  function validateForm() {
    if (!form.firstname.trim() || !form.lastname.trim()) {
      return "Please enter your first and last name.";
    }
    if (!form.email.trim()) return "Please enter your email address.";
    if (form.password.length < 8) {
      return "Your password must have at least 8 characters.";
    }
    if (form.password !== form.confirmPassword) {
      return "The passwords do not match.";
    }
    if (!form.agreeTerms) return "Please accept the terms and privacy policy.";
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setMessage(null);

    try {
      await dispatch(signup({
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        password: form.password,
        role: "User",
      }));
      setMessage({ type: "success", text: "Account created. Redirecting to login..." });
      setTimeout(() => navigate("/login"), 1200);
    } catch {
      // The thunk stores the API error in Redux for rendering.
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Use one account to buy, sell, or rent properties."
      activePage="signup"
    >
      <AlertMessage type={message?.type} message={message?.text || error} />

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <InputField
            label="First name"
            name="firstname"
            value={form.firstname}
            onChange={updateField}
            placeholder="Jane"
            icon={<UserIcon />}
            required
          />
          <InputField
            label="Last name"
            name="lastname"
            value={form.lastname}
            onChange={updateField}
            placeholder="Doe"
            icon={<UserIcon />}
            required
          />
        </div>

        <InputField
          label="Email address"
          name="email"
          type="email"
          value={form.email}
          onChange={updateField}
          placeholder="jane@example.com"
          icon={<MailIcon />}
          required
        />

        <div className="form-row">
          <div>
            <InputField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
              placeholder="At least 8 characters"
              icon={<LockIcon />}
              required
            />
            <PasswordStrength password={form.password} />
          </div>
          <InputField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={updateField}
            placeholder="Type it again"
            icon={<LockIcon />}
            required
          />
        </div>

        <label className="checkbox-label">
          <input
            name="agreeTerms"
            type="checkbox"
            checked={form.agreeTerms}
            onChange={updateField}
          />
          I agree to the terms and privacy policy.
        </label>

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="form-footer">
        Already have an account?{" "}
        <Link className="text-link" to="/login">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
