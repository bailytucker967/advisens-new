import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-espresso text-cream">
      {/* Faded warm wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #2a0f54 0%, #1b1233 50%, #150a30 100%)",
        }}
      />
      {/* Engraved contour lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent 0 38px, rgba(138,63,252,0.5) 38px 39px)",
        }}
      />
      {/* Paper grain */}
      <div className="paper-grain pointer-events-none absolute inset-0 opacity-50" />
      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 200px 60px rgba(10,7,5,0.7)" }}
      />

      <header className="relative z-10 px-4 pt-6 md:px-8">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-gold font-display text-[15px] font-semibold text-espresso">
              A
            </div>
            <span className="font-display text-[17px] font-medium tracking-tight text-cream">
              TWI Report Generator
            </span>
          </Link>
          <Link
            href="/"
            className="text-[13px] text-cream/60 transition-colors hover:text-cream"
          >
            ← Back to site
          </Link>
        </nav>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px]">{children}</div>
      </main>
    </div>
  );
}
