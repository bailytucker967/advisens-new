"use client";

export default function BeforeYouBegin() {
  return (
    <section id="before-you-begin" className="relative border-t border-white/10 overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
        <div className="grid items-center gap-8 md:grid-cols-[1.35fr,1fr]">
          {/* Left Card - Main Content */}
          <div className="group relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-7 shadow-lg shadow-black/20 md:p-8 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-black/30 hover:border-white/30">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(16 185 129) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }}></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-12"></div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300 transition-all duration-300 group-hover:text-emerald-200">
                  Before you begin
                </p>
              </div>
              
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-white md:text-2xl transition-colors duration-300 group-hover:text-white">
                Your decision. Your pace.
              </h3>

              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-200 md:text-base">
                <li className="flex gap-3 group/item transition-all duration-300 hover:translate-x-1">
                  <div className="relative mt-1.5">
                    <div className="absolute inset-0 bg-linear-to-br from-emerald-500 to-teal-500 rounded-full blur-sm opacity-0 group-hover/item:opacity-60 transition-opacity duration-300"></div>
                    <div className="relative h-1.5 w-1.5 rounded-full bg-linear-to-br from-emerald-500 to-teal-500 shadow-sm transition-all duration-300 group-hover/item:scale-150"></div>
                  </div>
                  <span className="transition-colors duration-300 group-hover/item:text-white">
                    No obligation to proceed with any advisor.
                  </span>
                </li>
                
                <li className="flex gap-3 group/item transition-all duration-300 hover:translate-x-1">
                  <div className="relative mt-1.5">
                    <div className="absolute inset-0 bg-linear-to-br from-emerald-500 to-teal-500 rounded-full blur-sm opacity-0 group-hover/item:opacity-60 transition-opacity duration-300"></div>
                    <div className="relative h-1.5 w-1.5 rounded-full bg-linear-to-br from-emerald-500 to-teal-500 shadow-sm transition-all duration-300 group-hover/item:scale-150"></div>
                  </div>
                  <span className="transition-colors duration-300 group-hover/item:text-white">
                    Advisors cannot contact you without your explicit consent.
                  </span>
                </li>
                
                <li className="flex gap-3 group/item transition-all duration-300 hover:translate-x-1">
                  <div className="relative mt-1.5">
                    <div className="absolute inset-0 bg-linear-to-br from-emerald-500 to-teal-500 rounded-full blur-sm opacity-0 group-hover/item:opacity-60 transition-opacity duration-300"></div>
                    <div className="relative h-1.5 w-1.5 rounded-full bg-linear-to-br from-emerald-500 to-teal-500 shadow-sm transition-all duration-300 group-hover/item:scale-150"></div>
                  </div>
                  <span className="transition-colors duration-300 group-hover/item:text-white">
                    You can stop at any point in the process.
                  </span>
                </li>
              </ul>
            </div>

            <div className="absolute bottom-0 right-0 w-32 h-32 bg-linear-to-tl from-emerald-500/5 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>

          {/* Right Card - Highlight Box */}
          <div className="group relative rounded-3xl border-2 border-dashed border-emerald-300/60 bg-white/10 backdrop-blur-md p-6 shadow-md md:p-7 overflow-hidden transition-all duration-500 hover:border-emerald-400/80 hover:shadow-lg hover:scale-[1.02]">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-emerald-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-teal-400/15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-emerald-600 to-teal-600 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-white transition-colors duration-300 group-hover:text-white">
                  You&apos;re in control.
                </p>
              </div>
              
              <p className="mt-3 text-sm leading-relaxed text-slate-200 transition-colors duration-300 group-hover:text-white">
                Compare approaches first. Only reveal your identity if and when you choose to proceed.
              </p>

              <div className="mt-5 grid gap-3">
                <div className="group/badge relative rounded-2xl bg-white/10 backdrop-blur-sm border border-emerald-300/30 p-4 text-xs text-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white/15 hover:border-emerald-300/50 hover:-translate-y-0.5">
                  <div className="absolute inset-0 bg-linear-to-r from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
                    <span className="font-medium">No outreach unless you consent.</span>
                  </div>
                </div>
                
                <div className="group/badge relative rounded-2xl bg-white/10 backdrop-blur-sm border border-emerald-300/30 p-4 text-xs text-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white/15 hover:border-emerald-300/50 hover:-translate-y-0.5">
                  <div className="absolute inset-0 bg-linear-to-r from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
                    <span className="font-medium">No obligation — stop anytime.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}


