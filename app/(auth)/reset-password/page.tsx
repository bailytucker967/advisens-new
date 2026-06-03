"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

const schema = z
  .object({
    password: z.string().min(8, "At least 8 characters"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords don't match",
  });
type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
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
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });
      if (error) {
        setServerError(error.message);
        return;
      }
      router.push("/dashboard");
      router.refresh();
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
            Set a new password
          </h1>
          <p className="mt-2 text-sm text-mahogany-500">
            Pick something strong you&apos;ll remember.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-[12px] text-oxblood">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              {...register("confirm")}
            />
            {errors.confirm && (
              <p className="text-[12px] text-oxblood">{errors.confirm.message}</p>
            )}
          </div>

          {serverError && (
            <div className="rounded-md border border-oxblood/30 bg-oxblood/[0.08] px-3 py-2 text-[13px] text-oxblood">
              {serverError}
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Updating…" : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
