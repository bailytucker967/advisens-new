"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md border border-mahogany/15 bg-cream-50 px-3.5 py-2 text-sm text-mahogany placeholder:text-mahogany-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:border-gold/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[100px] w-full rounded-md border border-mahogany/15 bg-cream-50 px-3.5 py-3 text-sm text-mahogany placeholder:text-mahogany-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:border-gold/60 disabled:opacity-50 disabled:cursor-not-allowed resize-y transition-colors",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-[11px] font-medium text-mahogany-500 tracking-[0.12em] uppercase",
        className,
      )}
      {...props}
    />
  );
}
