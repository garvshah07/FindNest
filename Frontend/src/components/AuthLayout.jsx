import { Link } from "react-router-dom";
import BrandShowcase from "./BrandShowcase";
import { LogoIcon } from "./Icons";

export default function AuthLayout({ title, subtitle, activePage, children }) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand-link" to="/login">
          <span className="brand-icon">
            <LogoIcon />
          </span>
          <span>
            FindNest
            <small className="brand-tag">Buy · Sell · Rent</small>
          </span>
        </Link>

        <nav className="top-navigation" aria-label="Account pages">
          <Link className={activePage === "login" ? "active" : ""} to="/login">
            Sign in
          </Link>
          <Link className={activePage === "signup" ? "active" : ""} to="/signup">
            Sign up
          </Link>
        </nav>
      </header>

      <main className="page-content">
        <div className="content-grid">
          <section className="form-card">
            <h1>{title}</h1>
            <p className="subtitle">{subtitle}</p>
            {children}
          </section>
          <BrandShowcase />
        </div>
      </main>

      <footer className="site-footer">
        © {new Date().getFullYear()} FindNest. All rights reserved.
      </footer>
    </div>
  );
}
