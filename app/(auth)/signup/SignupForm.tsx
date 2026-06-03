"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  firmName: z.string().min(2, "Enter your firm name"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password too long"),
});
type FormData = z.infer<typeof schema>;

export function SignupForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormData) {
    setServerError(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { full_name: values.fullName, firm_name: values.firmName },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });
      if (error) {
        setServerError(error.message);
        return;
      }
      // If email confirmation is enabled, session will be null and user must verify.
      if (data.session) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setSuccess(true);
      }
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  if (success) {
    return (
      <div className="rounded-md border border-gold/30 bg-gold-soft/30 px-4 py-4 text-sm text-mahogany">
        <p className="mb-1 font-semibold">Check your inbox</p>
        <p className="text-mahogany-500">
          We sent you a confirmation link. Click it to activate your account,
          then sign in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            autoComplete="name"
            placeholder="Jane Smith"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-[12px] text-oxblood">{errors.fullName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="firmName">Firm</Label>
          <Input
            id="firmName"
            placeholder="Acme Wealth"
            {...register("firmName")}
          />
          {errors.firmName && (
            <p className="text-[12px] text-oxblood">{errors.firmName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Work email</Label>
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

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-[12px] text-oxblood">{errors.password.message}</p>
        )}
        <p className="text-[11px] text-mahogany-400">At least 8 characters.</p>
      </div>

      {serverError && (
        <div className="rounded-md border border-oxblood/30 bg-oxblood/[0.08] px-3 py-2 text-[13px] text-oxblood">
          {serverError}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-[11px] text-mahogany-400 text-center leading-relaxed">
        By creating an account you agree to our terms of service and privacy
        policy.
      </p>
    </form>
  );
}
