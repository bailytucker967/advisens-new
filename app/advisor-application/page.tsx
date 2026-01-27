"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type FormData = {
  firstName: string;
  lastName: string;
  professionalEmail: string;
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
};

const DEFAULT_FORM: FormData = {
  firstName: "",
  lastName: "",
  professionalEmail: "",
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
    setLoading(true);

    try {
      const response = await fetch("/api/advisor/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
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
          <div className="mb-8 rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent backdrop-blur-xl p-6 shadow-xl">
            <p className="font-semibold text-amber-200 mb-4 text-sm uppercase tracking-wide">Requirements:</p>
            <ul className="space-y-2 text-sm text-amber-50">
              <li className="font-semibold flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>Reputable firm or independently reputable practice</span>
              </li>
              <li className="font-semibold flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>Recognised qualifications</span>
              </li>
              <li className="font-semibold flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>Minimum 5 years of experience in the industry</span>
              </li>
            </ul>
          </div>

          {/* Process Info Card */}
          <div className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-white">How selection works</h2>
            <ol className="space-y-2 text-sm text-slate-200 list-decimal list-inside">
              <li>Submit an application</li>
              <li>We review firm, credentials, and regulatory standing</li>
              <li>If approved, we explain the cost & invite you to onboarding and provide platform access</li>
            </ol>
            <p className="mt-4 text-sm text-slate-300 pt-4 border-t border-white/10">
              <strong className="text-white">Note on capacity:</strong> We do not aim for unlimited advisors. We keep the advisor
              bench intentionally small to maintain quality.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/40 bg-gradient-to-br from-red-500/10 to-transparent backdrop-blur-xl p-4 text-red-200 shadow-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section A: Advisor Details */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6 shadow-xl md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                <span className="h-px w-8 bg-gradient-to-r from-emerald-400 to-transparent"></span>
                A) Advisor Details
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    First name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setField("firstName", e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Last name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => setField("lastName", e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Professional email <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="email"
                    required
                    value={form.professionalEmail}
                    onChange={(e) => setField("professionalEmail", e.target.value)}
                    placeholder="advisor@firm.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Mobile/WhatsApp <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="tel"
                    required
                    value={form.mobile}
                    onChange={(e) => setField("mobile", e.target.value)}
                    placeholder="+971 XX XXX XXXX"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">LinkedIn profile URL</label>
                  <Input
                    type="url"
                    value={form.linkedInUrl}
                    onChange={(e) => setField("linkedInUrl", e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Primary client base <span className="text-red-400">*</span>
                  </label>
                  <Select
                    required
                    value={form.primaryClientBase}
                    onChange={(e) => setField("primaryClientBase", e.target.value)}
                  >
                    <option value="">Please select</option>
                    <option value="GCC">GCC</option>
                    <option value="UAE">UAE</option>
                    <option value="KSA">KSA</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Global">Global</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Location - Country <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    value={form.locationCountry}
                    onChange={(e) => setField("locationCountry", e.target.value)}
                    placeholder="e.g., UAE"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Location - City <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    value={form.locationCity}
                    onChange={(e) => setField("locationCity", e.target.value)}
                    placeholder="e.g., Dubai"
                  />
                </div>
              </div>
            </div>

            {/* Section B: Firm Details */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6 shadow-xl md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                <span className="h-px w-8 bg-gradient-to-r from-emerald-400 to-transparent"></span>
                B) Firm Details
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Firm name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    value={form.firmName}
                    onChange={(e) => setField("firmName", e.target.value)}
                    placeholder="Enter firm name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">Firm website URL</label>
                  <Input
                    type="url"
                    value={form.firmWebsite}
                    onChange={(e) => setField("firmWebsite", e.target.value)}
                    placeholder="https://firm.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Your role/title <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g., IFA, Wealth Manager, Partner, Director"
                    value={form.roleTitle}
                    onChange={(e) => setField("roleTitle", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Employment type <span className="text-red-400">*</span>
                  </label>
                  <Select
                    required
                    value={form.employmentType}
                    onChange={(e) => setField("employmentType", e.target.value)}
                  >
                    <option value="">Please select</option>
                    <option value="Employee">Employee</option>
                    <option value="Partner">Partner</option>
                    <option value="Owner">Owner</option>
                    <option value="Consultant">Consultant</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Firm type <span className="text-red-400">*</span>
                  </label>
                  <Select
                    required
                    value={form.firmType}
                    onChange={(e) => setField("firmType", e.target.value)}
                  >
                    <option value="">Please select</option>
                    <option value="Regulated advisory firm">Regulated advisory firm</option>
                    <option value="Bank">Bank</option>
                    <option value="Multi-family office">Multi-family office</option>
                    <option value="Independent practice">Independent practice</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Firm location (Country) <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    value={form.firmLocation}
                    onChange={(e) => setField("firmLocation", e.target.value)}
                    placeholder="e.g., UAE"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-slate-200">Brief firm overview</label>
                  <Textarea
                    rows={4}
                    value={form.firmOverview}
                    onChange={(e) => setField("firmOverview", e.target.value)}
                    placeholder="Describe your firm..."
                  />
                </div>
              </div>
            </div>

            {/* Section C: Regulation & Standing */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6 shadow-xl md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                <span className="h-px w-8 bg-gradient-to-r from-emerald-400 to-transparent"></span>
                C) Regulation & Standing
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Are you regulated? <span className="text-red-400">*</span>
                  </label>
                  <Select
                    required
                    value={form.isRegulated}
                    onChange={(e) => setField("isRegulated", e.target.value)}
                  >
                    <option value="">Please select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Select>
                </div>

                {form.isRegulated === "yes" && (
                  <div className="space-y-6 pl-4 border-l-2 border-emerald-400/30">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-200">
                        Regulator name <span className="text-red-400">*</span>
                      </label>
                      <Input
                        type="text"
                        required={form.isRegulated === "yes"}
                        value={form.regulatorName}
                        onChange={(e) => setField("regulatorName", e.target.value)}
                        placeholder="e.g., FCA, DFSA, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-200">
                        License/registration number <span className="text-red-400">*</span>
                      </label>
                      <Input
                        type="text"
                        required={form.isRegulated === "yes"}
                        value={form.licenseNumber}
                        onChange={(e) => setField("licenseNumber", e.target.value)}
                        placeholder="Enter license number"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-200">
                        Jurisdiction(s) authorised to advise in <span className="text-red-400">*</span>
                      </label>
                      <div className="grid gap-3 md:grid-cols-2">
                        {["UAE", "UK", "US", "EU", "Singapore", "Hong Kong", "Other"].map((jur) => (
                          <label key={jur} className="flex items-center gap-3 text-sm text-slate-200 cursor-pointer group">
                            <Checkbox
                              checked={form.jurisdictions.includes(jur)}
                              onChange={() => toggleArray("jurisdictions", jur)}
                            />
                            <span className="group-hover:text-white transition-colors">{jur}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Any disciplinary actions / upheld complaints in the last 5 years?{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <Select
                    required
                    value={form.hasDisciplinaryActions}
                    onChange={(e) => setField("hasDisciplinaryActions", e.target.value)}
                  >
                    <option value="">Please select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Select>
                </div>

                {form.hasDisciplinaryActions === "yes" && (
                  <div className="space-y-2 pl-4 border-l-2 border-red-400/30">
                    <label className="text-sm font-medium text-slate-200">Details</label>
                    <Textarea
                      rows={4}
                      required={form.hasDisciplinaryActions === "yes"}
                      value={form.disciplinaryDetails}
                      onChange={(e) => setField("disciplinaryDetails", e.target.value)}
                      placeholder="Please provide details..."
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section D: Experience & Focus */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6 shadow-xl md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                <span className="h-px w-8 bg-gradient-to-r from-emerald-400 to-transparent"></span>
                D) Experience & Focus
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Years of experience in financial advice <span className="text-red-400">*</span>
                  </label>
                  <Select
                    required
                    value={form.yearsOfExperience}
                    onChange={(e) => setField("yearsOfExperience", e.target.value)}
                  >
                    <option value="">Please select</option>
                    <option value="0-2">0–2</option>
                    <option value="3-5">3–5</option>
                    <option value="6-10">6–10</option>
                    <option value="10+">10+</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Areas of advice offered <span className="text-red-400">*</span>
                  </label>
                  <div className="grid gap-3 md:grid-cols-2">
                    {AREAS_OF_ADVICE.map((area) => (
                      <label key={area} className="flex items-center gap-3 text-sm text-slate-200 cursor-pointer group">
                        <Checkbox
                          checked={form.areasOfAdvice.includes(area)}
                          onChange={() => toggleArray("areasOfAdvice", area)}
                        />
                        <span className="group-hover:text-white transition-colors">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">Typical client profile</label>
                  <Textarea
                    rows={3}
                    placeholder="e.g., expats, HNW/UHNW, etc."
                    value={form.typicalClientProfile}
                    onChange={(e) => setField("typicalClientProfile", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section E: Qualifications */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6 shadow-xl md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                <span className="h-px w-8 bg-gradient-to-r from-emerald-400 to-transparent"></span>
                E) Qualifications
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    List your key qualifications/designations <span className="text-red-400">*</span>
                  </label>
                  <Textarea
                    rows={4}
                    required
                    value={form.qualifications}
                    onChange={(e) => setField("qualifications", e.target.value)}
                    placeholder="e.g., CII, CISI, CFA, etc."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Upload supporting documents (optional but recommended)
                  </label>
                  <div className="rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm p-4">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/20 file:text-emerald-300 file:cursor-pointer hover:file:bg-emerald-500/30 transition-colors"
                    />
                    <p className="text-xs text-slate-400 mt-2">
                      Certifications (PDF/JPG), License proof (PDF/JPG)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section F: Platform Rules */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6 shadow-xl md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
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
                  <label key={item.key} className="flex items-start gap-3 text-sm text-slate-200 cursor-pointer group">
                    <Checkbox
                      required
                      checked={form[item.key as keyof FormData] as boolean}
                      onChange={(e) => setField(item.key as keyof FormData, e.target.checked)}
                      className="mt-0.5"
                    />
                    <span className="group-hover:text-white transition-colors">{item.text}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section G: Short Answers */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6 shadow-xl md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                <span className="h-px w-8 bg-gradient-to-r from-emerald-400 to-transparent"></span>
                G) Short Answers
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Why do you want to join Advisens? <span className="text-red-400">*</span>
                  </label>
                  <Textarea
                    rows={4}
                    required
                    value={form.whyJoinAdvisens}
                    onChange={(e) => setField("whyJoinAdvisens", e.target.value)}
                    placeholder="Tell us why you're interested in joining..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    What does "ethical advice" mean to you? <span className="text-red-400">*</span>
                  </label>
                  <Textarea
                    rows={4}
                    required
                    value={form.ethicalAdviceMeaning}
                    onChange={(e) => setField("ethicalAdviceMeaning", e.target.value)}
                    placeholder="Share your thoughts on ethical advice..."
                  />
                </div>
              </div>
            </div>

            {/* Final Note & Submit */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6 shadow-xl md:p-8">
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Advisens is selective by design and not every advisor will match our roadmap. That
                said, all regulated professionals are welcome to submit an application. If your
                profile meets our standards, we will contact you to arrange next steps.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full border border-white/20 bg-gradient-to-r from-emerald-500/20 via-emerald-400/20 to-emerald-500/20 backdrop-blur-sm px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all hover:border-emerald-400/40 hover:from-emerald-500/30 hover:via-emerald-400/30 hover:to-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {loading ? "Submitting..." : "Submit application for review"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
