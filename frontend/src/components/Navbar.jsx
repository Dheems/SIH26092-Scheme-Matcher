import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Menu, 
  X, 
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { DEMO_PERSONAS } from '../data/demoProfiles';

export default function Navbar({ 
  currentView, 
  setCurrentView, 
  onLoadDemo
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const handleSelectDemo = (personaId) => {
    onLoadDemo(personaId);
    setDemoDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-gov-navy text-white shadow-md">
      {/* Subtle tricolor indicator strip */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Product Title */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setCurrentView('landing')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-inner font-black text-lg">
              SS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  Scheme<span className="text-orange-400">Saathi</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-300 hidden sm:block">
                Discover government schemes for your business
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                currentView === 'landing' 
                  ? 'bg-white/15 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('form')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                currentView === 'form' || currentView === 'results'
                  ? 'bg-orange-600 text-white font-bold shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-300" />
              Find My Schemes
            </button>
            <button
              onClick={() => setCurrentView('explorer')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                currentView === 'explorer' 
                  ? 'bg-white/15 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Explore Schemes
            </button>
          </nav>

          {/* Try Demo Action Button */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition active:scale-95"
              >
                <span>⚡ Try Demo</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Sample Entrepreneur Profiles
                    </span>
                  </div>
                  {DEMO_PERSONAS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectDemo(p.id)}
                      className="w-full text-left px-3 py-2.5 hover:bg-orange-50 transition border-b border-slate-50 last:border-none group"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-gov-navy group-hover:text-orange-700">
                          {p.profile.name}
                        </span>
                        <span className="text-[10px] bg-orange-100 text-orange-800 font-semibold px-1.5 py-0.5 rounded">
                          {p.profile.social_category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {p.profile.business_type} • ₹{p.profile.funding_required.toLocaleString('en-IN')} funding
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleSelectDemo('ravi')}
              className="bg-orange-500 text-slate-950 px-2.5 py-1.5 rounded-lg text-xs font-bold"
            >
              ⚡ Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gov-dark border-t border-slate-800 px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => { setCurrentView('landing'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/10"
          >
            Home
          </button>
          <button
            onClick={() => { setCurrentView('form'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-orange-300 hover:bg-white/10 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Find My Schemes
          </button>
          <button
            onClick={() => { setCurrentView('explorer'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/10 flex items-center gap-2"
          >
            <Search className="w-4 h-4" /> Explore Schemes
          </button>
        </div>
      )}
    </header>
  );
}
