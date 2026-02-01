"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Checkbox } from "@/components/ui/checkbox";

type FormData = {
  firstName: string;
  lastName: string;
  professionalEmail: string;
  password: string;
  confirmPassword: string;
  mobile: string;
  linkedInUrl: string;
  locationCountry: string;
  locationCity: string;
  primaryClientBase: string;
  firmName: string;
  firmWebsite: string;
  roleTitle: string;
  employmentType: string;
  firmType: string;
  firmLocation: string;
  firmOverview: string;
  isRegulated: string;
  regulatorName: string;
  licenseNumber: string;
  jurisdictions: string[];
  hasDisciplinaryActions: string;
  disciplinaryDetails: string;
  yearsOfExperience: string;
  areasOfAdvice: string[];
  typicalClientProfile: string;
  qualifications: string;
  acknowledgesNoCommissions: boolean;
  acknowledgesNoContact: boolean;
  acknowledgesHonestResponse: boolean;
  acknowledgesConfidentiality: boolean;
  acknowledgesSelective: boolean;
  whyJoinAdvisens: string;
  ethicalAdviceMeaning: string;
  supportingDocuments: string[];
};

const DEFAULT_FORM: FormData = {
  firstName: "",
  lastName: "",
  professionalEmail: "",
  password: "",
  confirmPassword: "",
  mobile: "",
  linkedInUrl: "",
  locationCountry: "",
  locationCity: "",
  primaryClientBase: "",
  firmName: "",
  firmWebsite: "",
  roleTitle: "",
  employmentType: "",
  firmType: "",
  firmLocation: "",
  firmOverview: "",
  isRegulated: "",
  regulatorName: "",
  licenseNumber: "",
  jurisdictions: [],
  hasDisciplinaryActions: "",
  disciplinaryDetails: "",
  yearsOfExperience: "",
  areasOfAdvice: [],
  typicalClientProfile: "",
  qualifications: "",
  acknowledgesNoCommissions: false,
  acknowledgesNoContact: false,
  acknowledgesHonestResponse: false,
  acknowledgesConfidentiality: false,
  acknowledgesSelective: false,
  whyJoinAdvisens: "",
  ethicalAdviceMeaning: "",
  supportingDocuments: [],
};

const AREAS_OF_ADVICE = [
  "Retirement planning",
  "Pensions",
  "Investments",
  "Protection / Insurance",
  "Estate planning",
  "Cross-border planning",
  "Tax planning",
  "Wealth management",
  "Financial planning",
];

export default function AdvisorApplicationPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArray = (key: "areasOfAdvice" | "jurisdictions", value: string) => {
    setForm((prev) => {
      const arr = prev[key];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, [key]: next } as FormData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Password and confirm password must match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);

    try {
      let documentUrls = form.supportingDocuments || [];

      if (selectedFiles.length > 0) {
        const uploadFormData = new FormData();
        selectedFiles.forEach((f) => uploadFormData.append("files", f));
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });
        if (!uploadRes.ok) {
          const uploadData = await uploadRes.json();
          throw new Error(uploadData.error || "File upload failed");
        }
        const { urls } = await uploadRes.json();
        documentUrls = [...documentUrls, ...urls];
      }

      const response = await fetch("/api/advisor/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          password: form.password,
          supportingDocuments: documentUrls,
          isRegulated: form.isRegulated === "yes",
          hasDisciplinaryActions: form.hasDisciplinaryActions === "yes",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/");
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col text-slate-50">
        <div
          className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/web%20background.jpeg')" }}
        />
        <div className="fixed inset-0 -z-20 bg-gradient-to-b from-black/40 via-black/30 to-black/20" />

        <Header onNavClick={handleNavClick} onSubmitCase={() => {}} />

        <main className="relative z-10 flex-1 px-4 pb-16 pt-8 md:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl p-8 text-white shadow-2xl md:p-12">
              <div className="text-center space-y-6">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/30">
                  <svg className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl font-semibold text-white">
                  Application Received
                </h1>
                <p className="text-slate-300 leading-relaxed">
                  Thanks, your application has been received. Our team will review your details
                  and contact you by email if we would like to proceed.
                </p>
                <p className="text-sm text-slate-400">
                  For urgent enquiries, email{" "}
                  <a href="mailto:advisors@advisens.com" className="text-emerald-400 hover:text-emerald-300 transition-colors underline">
                    advisors@advisens.com
                  </a>
                </p>
                <Link
                  href="/"
                  className="inline-block rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/20 hover:border-white/30"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-slate-50">
      <div
        className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/web%20background.jpeg')" }}
      />
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-black/40 via-black/30 to-black/20" />

      <Header onNavClick={handleNavClick} onSubmitCase={() => {}} />

      <main className="relative z-10 flex-1 px-4 pb-16 pt-8 md:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Header Section */}
          <div className="mb-8">
            <Link href="/" className="text-slate-200 hover:text-white text-sm transition-colors inline-block mb-4">
              ← Back to home
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Advisor eligibility and onboarding
            </h1>
            <p className="mt-2 text-sm text-slate-200 leading-relaxed">
              Advisens is selective by design. We accept a limited number of experienced, reputable
              advisors who meet strict standards and follow platform rules.
            </p>
          </div>

          {/* Requirements Card */}
          <div className="mb-8 rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl md:p-8">
            <p className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide">Requirements:</p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="font-semibold flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>Reputable firm or independently reputable practice</span>
              </li>
              <li className="font-semibold flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>Recognised qualifications</span>
              </li>
              <li className="font-semibold flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>Minimum 5 years of experience in the industry</span>
              </li>
            </ul>
          </div>

          {/* Process Info Card */}
          <div className="mb-8 rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl md:p-8">
            <h2 className="text-lg font-semibold mb-4 text-slate-900">How selection works</h2>
            <ol className="space-y-2 text-sm text-slate-700 list-decimal list-inside">
              <li>Submit an application</li>
              <li>We review firm, credentials, and regulatory standing</li>
              <li>If approved, we explain the cost & invite you to onboarding and provide platform access</li>
            </ol>
            <p className="mt-4 text-sm text-slate-700 pt-4 border-t border-slate-200">
              <strong className="text-slate-900">Note on capacity:</strong> We do not aim for unlimited advisors. We keep the advisor
              bench intentionally small to maintain quality.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/40 bg-red-50 p-4 text-red-800 shadow-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section A: Advisor Details */}
            <div className="rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-slate-900 flex items-center gap-2">
                <span className="h-px w-8 bg-emerald-500"></span>
                A) Advisor Details
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setField("firstName", e.target.value)}
                    placeholder="Enter your first name"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => setField("lastName", e.target.value)}
                    placeholder="Enter your last name"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Professional email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.professionalEmail}
                    onChange={(e) => setField("professionalEmail", e.target.value)}
                    placeholder="advisor@firm.com"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={form.password ?? ""}
                    onChange={(e) => setField("password", e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                  />
                  <p className="text-xs text-slate-500">At least 6 characters. You will use this to log in after approval.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Confirm password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={form.confirmPassword ?? ""}
                    onChange={(e) => setField("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Mobile/WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.mobile}
                    onChange={(e) => setField("mobile", e.target.value)}
                    placeholder="+971 XX XXX XXXX"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">LinkedIn profile URL</label>
                  <input
                    type="url"
                    value={form.linkedInUrl}
                    onChange={(e) => setField("linkedInUrl", e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Primary client base <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.primaryClientBase}
                    onChange={(e) => setField("primaryClientBase", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                  >
                    <option value="">Please select</option>
                    <option value="GCC">GCC</option>
                    <option value="UAE">UAE</option>
                    <option value="KSA">KSA</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Global">Global</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Location - Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.locationCountry}
                    onChange={(e) => setField("locationCountry", e.target.value)}
                    placeholder="e.g., UAE"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Location - City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.locationCity}
                    onChange={(e) => setField("locationCity", e.target.value)}
                    placeholder="e.g., Dubai"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section B: Firm Details */}
            <div className="rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-slate-900 flex items-center gap-2">
                <span className="h-px w-8 bg-gradient-to-r from-emerald-400 to-transparent"></span>
                B) Firm Details
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Firm name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.firmName ?? ""}
                    onChange={(e) => setField("firmName", e.target.value)}
                    placeholder="Enter firm name"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">Firm website URL</label>
                  <input
                    type="url"
                    value={form.firmWebsite ?? ""}
                    onChange={(e) => setField("firmWebsite", e.target.value)}
                    placeholder="https://firm.com"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Your role/title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., IFA, Wealth Manager, Partner, Director"
                    value={form.roleTitle ?? ""}
                    onChange={(e) => setField("roleTitle", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Employment type <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.employmentType ?? ""}
                    onChange={(e) => setField("employmentType", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-white"
                  >
                    <option value="">Please select</option>
                    <option value="Employee">Employee</option>
                    <option value="Partner">Partner</option>
                    <option value="Owner">Owner</option>
                    <option value="Consultant">Consultant</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Firm type <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.firmType ?? ""}
                    onChange={(e) => setField("firmType", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-white"
                  >
                    <option value="">Please select</option>
                    <option value="Regulated advisory firm">Regulated advisory firm</option>
                    <option value="Bank">Bank</option>
                    <option value="Multi-family office">Multi-family office</option>
                    <option value="Independent practice">Independent practice</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Firm location (Country) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.firmLocation ?? ""}
                    onChange={(e) => setField("firmLocation", e.target.value)}
                    placeholder="e.g., UAE"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-900">Brief firm overview</label>
                  <textarea
                    rows={4}
                    value={form.firmOverview ?? ""}
                    onChange={(e) => setField("firmOverview", e.target.value)}
                    placeholder="Describe your firm..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section C: Regulation & Standing */}
            <div className="rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-slate-900 flex items-center gap-2">
                <span className="h-px w-8 bg-gradient-to-r from-emerald-400 to-transparent"></span>
                C) Regulation & Standing
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Are you regulated? <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.isRegulated ?? ""}
                    onChange={(e) => setField("isRegulated", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-white"
                  >
                    <option value="">Please select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {form.isRegulated === "yes" && (
                  <div className="space-y-6 pl-4 border-l-2 border-emerald-400/30">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">
                        Regulator name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={form.isRegulated === "yes"}
                        value={form.regulatorName ?? ""}
                        onChange={(e) => setField("regulatorName", e.target.value)}
                        placeholder="e.g., FCA, DFSA, etc."
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">
                        License/registration number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={form.isRegulated === "yes"}
                        value={form.licenseNumber ?? ""}
                        onChange={(e) => setField("licenseNumber", e.target.value)}
                        placeholder="Enter license number"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">
                        Jurisdiction(s) authorised to advise in <span className="text-red-500">*</span>
                      </label>
                      <div className="grid gap-3 md:grid-cols-2">
                        {["UAE", "UK", "US", "EU", "Singapore", "Hong Kong", "Other"].map((jur) => (
                          <label key={jur} className="flex items-center gap-3 text-sm text-slate-800 cursor-pointer hover:text-slate-900">
                            <Checkbox
                              checked={form.jurisdictions.includes(jur)}
                              onChange={() => toggleArray("jurisdictions", jur)}
                            />
                            <span>{jur}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Any disciplinary actions / upheld complaints in the last 5 years?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.hasDisciplinaryActions ?? ""}
                    onChange={(e) => setField("hasDisciplinaryActions", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-white"
                  >
                    <option value="">Please select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {form.hasDisciplinaryActions === "yes" && (
                  <div className="space-y-2 pl-4 border-l-2 border-red-400/30">
                    <label className="text-sm font-semibold text-slate-900">Details</label>
                    <textarea
                      rows={4}
                      required={form.hasDisciplinaryActions === "yes"}
                      value={form.disciplinaryDetails ?? ""}
                      onChange={(e) => setField("disciplinaryDetails", e.target.value)}
                      placeholder="Please provide details..."
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white resize-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section D: Experience & Focus */}
            <div className="rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-slate-900 flex items-center gap-2">
                <span className="h-px w-8 bg-gradient-to-r from-emerald-400 to-transparent"></span>
                D) Experience & Focus
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Years of experience in financial advice <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.yearsOfExperience ?? ""}
                    onChange={(e) => setField("yearsOfExperience", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-white"
                  >
                    <option value="">Please select</option>
                    <option value="0-2">0–2</option>
                    <option value="3-5">3–5</option>
                    <option value="6-10">6–10</option>
                    <option value="10+">10+</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Areas of advice offered <span className="text-red-500">*</span>
                  </label>
                  <div className="grid gap-3 md:grid-cols-2">
                    {AREAS_OF_ADVICE.map((area) => (
                      <label key={area} className="flex items-center gap-3 text-sm text-slate-800 cursor-pointer hover:text-slate-900">
                        <Checkbox
                          checked={form.areasOfAdvice.includes(area)}
                          onChange={() => toggleArray("areasOfAdvice", area)}
                        />
                        <span>{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">Typical client profile</label>
                  <textarea
                    rows={3}
                    placeholder="e.g., expats, HNW/UHNW, etc."
                    value={form.typicalClientProfile ?? ""}
                    onChange={(e) => setField("typicalClientProfile", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section E: Qualifications */}
            <div className="rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-slate-900 flex items-center gap-2">
                <span className="h-px w-8 bg-gradient-to-r from-emerald-400 to-transparent"></span>
                E) Qualifications
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    List your key qualifications/designations <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.qualifications ?? ""}
                    onChange={(e) => setField("qualifications", e.target.value)}
                    placeholder="e.g., CII, CISI, CFA, etc."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Upload supporting documents (optional but recommended)
                  </label>
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                      className="text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-100 file:text-emerald-800 file:cursor-pointer hover:file:bg-emerald-200"
                    />
                    {selectedFiles.length > 0 && (
                      <p className="text-xs text-slate-600 mt-2">
                        {selectedFiles.length} file(s) selected: {selectedFiles.map((f) => f.name).join(", ")}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-2">
                      Certifications (PDF/JPG), License proof (PDF/JPG). Max 5MB per file.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section F: Platform Rules */}
            <div className="rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-slate-900 flex items-center gap-2">
                <span className="h-px w-8 bg-gradient-to-r from-emerald-400 to-transparent"></span>
                F) Platform Rules Acknowledgement
              </h2>
              <div className="space-y-4">
                {[
                  {
                    key: "acknowledgesNoCommissions",
                    text: "I understand Advisens does not pay commissions or referral fees.",
                  },
                  {
                    key: "acknowledgesNoContact",
                    text: "I agree I cannot contact users unless they explicitly consent inside the platform.",
                  },
                  {
                    key: "acknowledgesHonestResponse",
                    text: "I agree to respond to cases honestly, clearly, and without product pushing.",
                  },
                  {
                    key: "acknowledgesConfidentiality",
                    text: "I agree to confidentiality and respectful conduct standards.",
                  },
                  {
                    key: "acknowledgesSelective",
                    text: "I understand acceptance is selective and subject to review.",
                  },
                ].map((item) => (
                  <label key={item.key} className="flex items-start gap-3 text-sm text-slate-800 cursor-pointer hover:text-slate-900">
                    <Checkbox
                      required
                      checked={form[item.key as keyof FormData] as boolean}
                      onChange={(e) => setField(item.key as keyof FormData, e.target.checked)}
                      className="mt-0.5"
                    />
                    <span>{item.text}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section G: Short Answers */}
            <div className="rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-slate-900 flex items-center gap-2">
                <span className="h-px w-8 bg-gradient-to-r from-emerald-400 to-transparent"></span>
                G) Short Answers
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Why do you want to join Advisens? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.whyJoinAdvisens ?? ""}
                    onChange={(e) => setField("whyJoinAdvisens", e.target.value)}
                    placeholder="Tell us why you're interested in joining..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    What does "ethical advice" mean to you? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.ethicalAdviceMeaning ?? ""}
                    onChange={(e) => setField("ethicalAdviceMeaning", e.target.value)}
                    placeholder="Share your thoughts on ethical advice..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Final Note & Submit */}
            <div className="rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl md:p-8">
              <p className="text-sm text-slate-700 mb-6 leading-relaxed">
                Advisens is selective by design and not every advisor will match our roadmap. That
                said, all regulated professionals are welcome to submit an application. If your
                profile meets our standards, we will contact you to arrange next steps.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full border border-slate-300 bg-slate-900 px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit application"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
