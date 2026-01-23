"use client";

interface ReadyToBeginProps {
  onSubmitCase: () => void;
}

export default function ReadyToBegin({ onSubmitCase }: ReadyToBeginProps) {
  return (
    <section className="relative border-t border-white/10 overflow-hidden">
      <div className="relative mx-auto max-w-5xl px-4 py-14 md:px-6 md:py-18">
        <div className="group relative overflow-hidden rounded-3xl border-2 border-white/20 bg-white/10 backdrop-blur-md px-6 py-12 text-center shadow-xl shadow-black/20 transition-all duration-700 hover:shadow-2xl hover:shadow-black/30 hover:border-white/30 md:px-12 md:py-16">
          
          <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-teal-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="absolute inset-0 bg-radial-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 70%)'
          }}></div>

          <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.03] transition-opacity duration-500" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(16 185 129) 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }}></div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-linear-to-r from-transparent via-emerald-500 to-transparent rounded-full transition-all duration-700 group-hover:w-48"></div>

          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-white/10 backdrop-blur-sm px-4 py-1.5 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:border-emerald-300/50">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Ready when you are
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-3xl font-bold tracking-tight text-white md:text-4xl transition-all duration-300 group-hover:text-white">
                Ready to begin?
              </h4>
              <p className="mx-auto max-w-2xl text-base text-slate-200 leading-relaxed md:text-lg transition-colors duration-300 group-hover:text-white">
                Submit your case and review how different advisors would approach your situation — completely anonymously until you decide otherwise.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 pt-2">
              <button 
                onClick={onSubmitCase}
                className="group/btn relative inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-10 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/50 hover:-translate-y-1 hover:scale-105 active:scale-100 cursor-pointer"
              >
                <div className="absolute inset-0 rounded-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                
                <span className="relative">Submit a Case</span>
                
                <svg className="relative h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 transition-colors duration-300 hover:text-white">
                  <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span>100% Anonymous</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-slate-400"></div>
                <div className="flex items-center gap-1.5 transition-colors duration-300 hover:text-white">
                  <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>No Obligation</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-slate-400"></div>
                <div className="flex items-center gap-1.5 transition-colors duration-300 hover:text-white">
                  <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                  <span>Verified Advisors</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-linear-to-r from-transparent via-emerald-500 to-transparent rounded-full transition-all duration-700 group-hover:w-48"></div>

          <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-emerald-300/40 rounded-tr-3xl transition-all duration-500 group-hover:border-emerald-300/60 group-hover:w-24 group-hover:h-24"></div>
          <div className="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-emerald-300/40 rounded-bl-3xl transition-all duration-500 group-hover:border-emerald-300/60 group-hover:w-24 group-hover:h-24"></div>
        </div>
      </div>
    </section>
  );
}


