export default function PasswordStrength({ password }) {
  if (!password) return null;

  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  const labels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <div className="password-strength">
      <div className="strength-bars">
        {[1, 2, 3, 4].map((bar) => (
          <span className={`strength-bar ${strength >= bar ? "filled" : ""}`} key={bar} />
        ))}
      </div>
      <span>{labels[strength - 1] || "Weak"}</span>
    </div>
  );
}
