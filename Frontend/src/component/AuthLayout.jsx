import { Link } from "react-router-dom";
import { LogoIcon, SparklesIcon } from "./Icons";

export default function AuthLayout({
  children,
  title,
  subtitle,
  activeTab = "login", // 'login', 'signup', 'forgot'
}) {
  return (
    <div className="h-screen max-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* High-performance static ambient lighting */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 -z-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.22) 0%, transparent 40%),
            radial-gradient(circle at 90% 70%, rgba(139, 92, 246, 0.18) 0%, transparent 45%),
            radial-gradient(circle at 50% 95%, rgba(16, 185, 129, 0.12) 0%, transparent 35%)
          `,
        }}
      />

      {/* Top Navbar Header - Compact to fit 100vh */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between shrink-0">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 shadow-sm group-hover:scale-105 transition-transform duration-150">
            <LogoIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              FindNest
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Buy · Sell · Rent
            </span>
          </div>
        </Link>

        {/* Quick Nav switcher */}
        <div className="flex items-center gap-1 text-xs bg-slate-900/90 p-1 rounded-full border border-slate-800">
          <Link
            to="/login"
            className={`px-3 py-1 rounded-full font-medium transition-colors duration-150 ${
              activeTab === "login"
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/25"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className={`px-3 py-1 rounded-full font-medium transition-colors duration-150 ${
              activeTab === "signup"
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/25"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Main Content Area - Fill remaining space without scroll */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-1 min-h-0">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center max-h-full">
          
          {/* Form Container (Left Side / Center) */}
          <div className="w-full lg:col-span-6 xl:col-span-6 flex justify-center max-h-full">
            <div className="w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/80 relative my-auto overflow-y-auto max-h-[calc(100vh-100px)]">
              {/* Subtle top card highlight */}
              <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
              
              {/* Card Title & Subtitle */}
              <div className="mb-3">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-1 text-xs text-slate-400 leading-normal">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Form Content */}
              {children}
            </div>
          </div>

          {/* Right Brand Showcase (Desktop) */}
          <div className="hidden lg:block lg:col-span-6 xl:col-span-6 pl-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
              {/* Showcase Image with proportional height that fits default viewport */}
              <div className="relative h-[480px] max-h-[72vh] w-full overflow-hidden bg-slate-900">
                <img
                  src="/nest-showcase.jpg"
                  alt="FindNest Luxury Modern Property"
                  decoding="async"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                
                {/* Modern Dark Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Content overlay inside showcase image */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 pointer-events-none">
                
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/60 text-xs font-semibold text-indigo-300 shadow-md">
                    <SparklesIcon className="w-3.5 h-3.5 text-indigo-400" />
                    Verified Properties
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                    Buy · Sell · Rent
                  </div>
                </div>

                {/* Bottom Platform Overview */}
                <div className="space-y-3">
                  {/* Clean Platform Intro Card */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/60 shadow-xl space-y-1">
                    <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                      Find, list and lease properties seamlessly
                    </h2>
                    <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                      A modern real estate platform designed to buy, sell, or rent verified spaces from a single account.
                    </p>
                  </div>

                  {/* Highlights Bar */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-sm font-bold text-indigo-400">Buy</div>
                      <div className="text-[10px] text-slate-400">Verified Nests</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-sm font-bold text-purple-400">Sell</div>
                      <div className="text-[10px] text-slate-400">Direct Buyers</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-sm font-bold text-emerald-400">Rent</div>
                      <div className="text-[10px] text-slate-400">Zero Brokerage</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer - Compact centered copyright */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-1.5 text-center text-[11px] text-slate-500 border-t border-slate-900 shrink-0">
        © {new Date().getFullYear()} FindNest Inc. All rights reserved.
      </footer>
    </div>
  );
}
