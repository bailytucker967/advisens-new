import Link from "next/link";
import { SignupForm } from "./SignupForm";

export const metadata = { title: "Create account — TWI Report Generator" };

export default function SignupPage() {
  return (
    <div className="overflow-hidden rounded-md bg-cream-50 text-mahogany shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-black/5">
      <div className="h-1 w-full bg-gradient-to-r from-gold-600 via-gold to-gold-soft" />
      <div className="p-8 sm:p-10">
        <div className="mb-8">
          <h1 className="font-display text-[30px] font-light leading-tight tracking-tight text-mahogany">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-mahogany-500">
            Set up TWI Report Generator for your practice in minutes.
          </p>
        </div>

        <SignupForm />

        <div className="mt-7 border-t border-mahogany/10 pt-6 text-center text-sm text-mahogany-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-gold-600 transition-colors hover:text-gold"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
