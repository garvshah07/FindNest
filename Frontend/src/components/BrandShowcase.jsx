import { SparklesIcon } from "./Icons";

export default function BrandShowcase() {
  return (
    <div className="hidden lg:block lg:col-span-6 xl:col-span-6 pl-4">
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
        <div className="relative h-[480px] max-h-[72vh] w-full overflow-hidden bg-slate-900">
          <img
            src="/nest-showcase.jpg"
            alt="FindNest Luxury Modern Property"
            decoding="async"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 pointer-events-none">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/60 text-xs font-semibold text-indigo-300 shadow-md">
              <SparklesIcon className="w-3.5 h-3.5 text-indigo-400" />
              Verified Properties
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              Buy · Sell · Rent
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/60 shadow-xl space-y-1">
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                Find, list, and lease properties seamlessly
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                A modern real estate platform designed to buy, sell, or rent verified spaces from a single account.
              </p>
            </div>

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
  );
}
