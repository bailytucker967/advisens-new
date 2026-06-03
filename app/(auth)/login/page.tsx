import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Log in — TWI Report Generator" };

export default function LoginPage() {
  return (
    <div className="overflow-hidden rounded-md bg-cream-50 text-mahogany shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-black/5">
      <div className="h-1 w-full bg-gradient-to-r from-gold-600 via-gold to-gold-soft" />
      <div className="p-8 sm:p-10">
        <div className="mb-8">
          <h1 className="font-display text-[30px] font-light leading-tight tracking-tight text-mahogany">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-mahogany-500">
            Sign in to your TWI Report Generator account.
          </p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>

        <div className="mt-7 border-t border-mahogany/10 pt-6 text-center text-sm text-mahogany-500">
          New to TWI Report Generator?{" "}
          <Link
            href="/signup"
            className="font-medium text-gold-600 transition-colors hover:text-gold"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
