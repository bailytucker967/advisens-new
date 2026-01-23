"use client";

export default function Principles() {
  return (
    <section id="principles" className="relative border-t border-white/10 overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
        <div className="group relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-7 shadow-lg shadow-black/20 md:p-9 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-black/30 hover:border-white/30">
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-red-500/10 via-amber-500/10 to-orange-500/10 blur-2xl"></div>
          </div>

          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-linear-to-r from-red-500 to-amber-500"></div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 transition-colors duration-300 group-hover:text-slate-200">
                Guardrails
              </p>
            </div>
            
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl transition-colors duration-300 group-hover:text-white">
              What we don&apos;t do
            </h2>

            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-slate-200 md:text-base">
              <li className="flex gap-3 group/item transition-all duration-300 hover:translate-x-1">
                <div className="relative mt-1.5">
                  <div className="absolute inset-0 bg-linear-to-br from-red-500 to-amber-500 rounded-full blur-sm opacity-0 group-hover/item:opacity-60 transition-opacity duration-300"></div>
                  <div className="relative h-1.5 w-1.5 rounded-full bg-linear-to-br from-red-500 to-amber-500 shadow-sm transition-all duration-300 group-hover/item:scale-150"></div>
                </div>
                <span className="transition-colors duration-300 group-hover/item:text-white">
                  We do not receive commissions or referral fees.
                </span>
              </li>
              
              <li className="flex gap-3 group/item transition-all duration-300 hover:translate-x-1">
                <div className="relative mt-1.5">
                  <div className="absolute inset-0 bg-linear-to-br from-red-500 to-amber-500 rounded-full blur-sm opacity-0 group-hover/item:opacity-60 transition-opacity duration-300"></div>
                  <div className="relative h-1.5 w-1.5 rounded-full bg-linear-to-br from-red-500 to-amber-500 shadow-sm transition-all duration-300 group-hover/item:scale-150"></div>
                </div>
                <span className="transition-colors duration-300 group-hover/item:text-white">
                  Advisors cannot contact you without your explicit consent.
                </span>
              </li>
              
              <li className="flex gap-3 group/item transition-all duration-300 hover:translate-x-1">
                <div className="relative mt-1.5">
                  <div className="absolute inset-0 bg-linear-to-br from-red-500 to-amber-500 rounded-full blur-sm opacity-0 group-hover/item:opacity-60 transition-opacity duration-300"></div>
                  <div className="relative h-1.5 w-1.5 rounded-full bg-linear-to-br from-red-500 to-amber-500 shadow-sm transition-all duration-300 group-hover/item:scale-150"></div>
                </div>
                <span className="transition-colors duration-300 group-hover/item:text-white">
                  We do not rank, endorse, or refer you to specific advisors.
                </span>
              </li>
              
              <li className="flex gap-3 group/item transition-all duration-300 hover:translate-x-1">
                <div className="relative mt-1.5">
                  <div className="absolute inset-0 bg-linear-to-br from-red-500 to-amber-500 rounded-full blur-sm opacity-0 group-hover/item:opacity-60 transition-opacity duration-300"></div>
                  <div className="relative h-1.5 w-1.5 rounded-full bg-linear-to-br from-red-500 to-amber-500 shadow-sm transition-all duration-300 group-hover/item:scale-150"></div>
                </div>
                <span className="transition-colors duration-300 group-hover/item:text-white">
                  We do not provide financial advice or recommend products.
                </span>
              </li>
            </ul>

            <div className="relative mt-6 border-t border-white/20 pt-4 transition-all duration-300 group-hover:border-white/30">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-md bg-linear-to-br from-slate-700 to-slate-900 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <p className="text-xs text-slate-300 md:text-sm transition-colors duration-300 group-hover:text-slate-200">
                  Advisors participate under defined eligibility and behavioural standards.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-red-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>
      </div>
    </section>
  );
}


