"use client";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative border-t border-white/10 overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-block">
            <h2 className="inline-block rounded-full bg-white px-6 py-2 text-xl font-semibold tracking-tight text-slate-900 shadow-lg shadow-slate-200/50 md:text-2xl border border-slate-100 relative overflow-hidden group">
              <span className="relative z-10">What we do</span>
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </h2>
          </div>
          <p className="mt-4 text-sm text-slate-200 md:text-base">
            We provide structure and clarity for your decision-making process.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 transition-all duration-500 hover:shadow-xl hover:shadow-slate-300/40 hover:-translate-y-1 hover:border-slate-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 opacity-20 blur-xl"></div>
            </div>

            <div className="relative z-10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="text-lg">📄</span>
              </div>
              <div className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-md">
                1
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-slate-950">
                Submit your case
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-700">
                Complete a structured form describing your situation, goals, and concerns — anonymously.
              </p>
            </div>

            <div className="hidden md:block absolute -right-4 top-1/2 w-8 h-0.5 bg-linear-to-r from-slate-300 to-transparent opacity-40"></div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 transition-all duration-500 hover:shadow-xl hover:shadow-slate-300/40 hover:-translate-y-1 hover:border-slate-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-violet-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-violet-500 to-purple-500 opacity-20 blur-xl"></div>
            </div>

            <div className="relative z-10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-purple-500 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="text-lg">👁️</span>
              </div>
              <div className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-md">
                2
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-slate-950">
                Review advisor responses
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-700">
                Advisors share their proposed approach, methodology, and fee structure — without revealing their identity.
              </p>
            </div>

            <div className="hidden md:block absolute -right-4 top-1/2 w-8 h-0.5 bg-linear-to-r from-slate-300 to-transparent opacity-40"></div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 transition-all duration-500 hover:shadow-xl hover:shadow-slate-300/40 hover:-translate-y-1 hover:border-slate-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 opacity-20 blur-xl"></div>
            </div>

            <div className="relative z-10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="text-lg">🛡️</span>
              </div>
              <div className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-md">
                3
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-slate-950">
                Select what aligns
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-700">
                Choose the approach that best fits your goals and personality. Only then is the advisor&apos;s identity revealed — and you decide whether to proceed.
              </p>
              <div className="mt-3 rounded-lg bg-slate-50/80 border border-slate-200/50 p-2.5 transition-all duration-300 group-hover:bg-slate-100/50 group-hover:border-slate-300/50">
                <p className="text-xs leading-relaxed text-slate-500">
                  Alignment is based on approach, priorities, and fee philosophy — not results or performance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Process flow indicator */}
        <div className="mt-8 flex justify-center items-center gap-2 opacity-60">
          <div className="w-2 h-2 rounded-full bg-slate-400"></div>
          <div className="w-12 h-0.5 bg-slate-300"></div>
          <div className="w-2 h-2 rounded-full bg-slate-400"></div>
          <div className="w-12 h-0.5 bg-slate-300"></div>
          <div className="w-2 h-2 rounded-full bg-slate-400"></div>
        </div>
      </div>
    </section>
  );
}


