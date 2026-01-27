"use client";              

import React from "react";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Principles from "./components/Principles";
import BeforeYouBegin from "./components/BeforeYouBegin";
import ReadyToBegin from "./components/ReadyToBegin";
import Footer from "./components/Footer";

export default function Home() {
  const router = useRouter();
  
  const handleSubmitCase = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    router.push("/submit");
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col">
      {/* Global background (same for whole home screen) */}
      <div
        className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/web%20background.jpeg')" }}
          />
          {/* Darken/soften overlay for readability */}
      <div className="fixed inset-0 -z-20 bg-linear-to-b from-black/35 via-black/20 to-black/10" />

      {/* Hero + content */}
      <main id="home" className="relative flex-1">
        <Header onNavClick={handleNavClick} onSubmitCase={handleSubmitCase} />
        <Hero onSubmitCase={handleSubmitCase} />
        <HowItWorks />
        <Principles />
        <BeforeYouBegin />
        <ReadyToBegin onSubmitCase={handleSubmitCase} />
      </main>

      <Footer />
    </div>
  );
}
