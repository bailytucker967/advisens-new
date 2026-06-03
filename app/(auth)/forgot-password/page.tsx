"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

const schema = z.object({ email: z.string().email("Enter a valid email") });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormData) {
    setServerError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setServerError(error.message);
        return;
      }
      setSent(true);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  return (
    <div className="overflow-hidden rounded-md bg-cream-50 text-mahogany shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-black/5">
      <div className="h-1 w-full bg-gradient-to-r from-gold-600 via-gold to-gold-soft" />
      <div className="p-8 sm:p-10">
        <div className="mb-8">
          <h1 className="font-display text-[30px] font-light leading-tight tracking-tight text-mahogany">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-mahogany-500">
            We&apos;ll email you a link to set a new password.
          </p>
        </div>

        {sent ? (
          <div className="rounded-md border border-gold/30 bg-gold-soft/30 px-4 py-4 text-sm text-mahogany">
            <p className="mb-1 font-semibold">Check your inbox</p>
            <p className="text-mahogany-500">
              If an account exists for that email, you&apos;ll receive a reset
              link shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@firm.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-[12px] text-oxblood">{errors.email.message}</p>
              )}
            </div>

            {serverError && (
              <div className="rounded-md border border-oxblood/30 bg-oxblood/[0.08] px-3 py-2 text-[13px] text-oxblood">
                {serverError}
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        )}

        <div className="mt-7 border-t border-mahogany/10 pt-6 text-center text-sm text-mahogany-500">
          Remembered it?{" "}
          <Link
            href="/login"
            className="font-medium text-gold-600 transition-colors hover:text-gold"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
