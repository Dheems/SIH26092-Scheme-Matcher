import React from 'react';
import { 
  ArrowRight, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Building,
  Users,
  Compass
} from 'lucide-react';

export default function LandingPage({ onFindSchemes, onExplore, onLoadDemo }) {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-gov-navy to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-400/30 text-orange-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            Simple Scheme Discovery Gateway
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Government schemes, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              matched to you.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Tell us about yourself and your business. SchemeSaathi helps you discover government schemes that may fit your eligibility and needs.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onFindSchemes}
              className="w-full sm:w-auto px-7 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-600/30 flex items-center justify-center gap-2 transition active:scale-95 text-sm sm:text-base"
            >
              <span>Find My Schemes</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onLoadDemo('ravi')}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-xl shadow hover:from-amber-400 hover:to-orange-400 flex items-center justify-center gap-2 transition text-sm sm:text-base active:scale-95"
            >
              <span>⚡ Try Demo (Ravi Kumar)</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            No login required • Free eligibility discovery • Direct links to official government portals
          </p>
        </div>
      </section>

      {/* 3-Step Process Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-orange-600">How It Works</h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-gov-navy mt-1">Simple 3-Step Discovery</h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            SchemeSaathi connects you directly with the right government support without the red tape.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm relative space-y-3">
            <div className="text-3xl font-black text-orange-500/30">01</div>
            <h4 className="text-base font-bold text-slate-900">Tell us about yourself</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Share simple details about your location, community category, business sector, and funding requirements.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm relative space-y-3">
            <div className="text-3xl font-black text-blue-500/30">02</div>
            <h4 className="text-base font-bold text-slate-900">Discover schemes that fit</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              SchemeSaathi checks your inputs against dozens of central and state programs, explaining exactly why you qualify.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm relative space-y-3">
            <div className="text-3xl font-black text-emerald-500/30">03</div>
            <h4 className="text-base font-bold text-slate-900">Apply through the official portal</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Review required documents and click straight through to the verified government portal to complete your application.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principle Callout */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-gov-navy to-slate-900 rounded-3xl p-8 text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold">
              We help you discover. The government delivers.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              SchemeSaathi is an independent discovery tool. We do not process loans or collect sensitive documents — we empower you with clear information to apply directly on official portals.
            </p>
          </div>
          <button
            onClick={onExplore}
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition whitespace-nowrap"
          >
            Explore Scheme Catalog
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-orange-500 text-white flex items-center justify-center font-bold text-[10px]">
            SS
          </div>
          <span className="font-semibold text-slate-700">SchemeSaathi</span>
        </div>
        <p className="text-center sm:text-right text-[11px]">
          SchemeSaathi helps you discover and understand schemes. Applications are completed on official government portals.
        </p>
      </footer>

    </div>
  );
}
