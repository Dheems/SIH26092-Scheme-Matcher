import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Filter, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  ExternalLink,
  Award
} from 'lucide-react';

export default function ResultsView({ 
  results, 
  profile, 
  onBackToEdit, 
  onOpenScheme 
}) {
  const [activeFilter, setActiveFilter] = useState('All');

  const allMatches = results?.all_matches || [];

  // Categorize / filter schemes
  const filteredMatches = useMemo(() => {
    let list = [...allMatches];

    if (activeFilter === 'Eligible') {
      list = list.filter(m => m.match_percentage >= 80);
    } else if (activeFilter === 'Potentially Eligible') {
      list = list.filter(m => m.match_percentage >= 60 && m.match_percentage < 80);
    } else if (activeFilter === 'Subsidy') {
      list = list.filter(m => 
        m.scheme.funding_type.toLowerCase().includes('subsidy') ||
        (m.scheme.subsidy_percentage && m.scheme.subsidy_percentage !== 'N/A')
      );
    } else if (activeFilter === 'Funding') {
      list = list.filter(m => 
        m.scheme.funding_type.toLowerCase().includes('loan') ||
        m.scheme.funding_type.toLowerCase().includes('credit') ||
        m.scheme.funding_type.toLowerCase().includes('grant')
      );
    } else if (activeFilter === 'Training') {
      list = list.filter(m => 
        m.scheme.description.toLowerCase().includes('training') ||
        m.scheme.description.toLowerCase().includes('skill') ||
        m.scheme.name.toLowerCase().includes('vishwakarma') ||
        m.scheme.name.toLowerCase().includes('acabc')
      );
    } else if (activeFilter === 'Business Support') {
      list = list.filter(m => 
        m.scheme.description.toLowerCase().includes('support') ||
        m.scheme.description.toLowerCase().includes('incubation') ||
        m.scheme.description.toLowerCase().includes('guarantee')
      );
    }

    // Always sort highest match first
    list.sort((a, b) => b.match_percentage - a.match_percentage);
    return list;
  }, [allMatches, activeFilter]);

  const filterTabs = [
    { id: 'All', label: 'All' },
    { id: 'Eligible', label: 'Eligible (≥80%)' },
    { id: 'Potentially Eligible', label: 'Potentially Eligible' },
    { id: 'Subsidy', label: 'Subsidy' },
    { id: 'Funding', label: 'Funding' },
    { id: 'Training', label: 'Training' },
    { id: 'Business Support', label: 'Business Support' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-gov-navy to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <button
            onClick={onBackToEdit}
            className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 font-medium hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Modify Your Details</span>
          </button>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {allMatches.length} schemes may be suitable for you
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            Based on your answers ({profile?.business_type} • {profile?.state} • {profile?.social_category} • ₹{profile?.funding_required ? profile.funding_required.toLocaleString('en-IN') : '0'} funding requirement).
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/15">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs text-slate-200 font-semibold">
            Highest matches shown first
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeFilter === tab.id
                ? 'bg-gov-navy text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Scheme Cards Grid */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Award className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No schemes found for this filter</h4>
            <p className="text-xs text-slate-500">Try selecting "All" to view the full matching list.</p>
            <button
              onClick={() => setActiveFilter('All')}
              className="px-4 py-2 bg-gov-navy text-white rounded-xl text-xs font-semibold"
            >
              Show All Schemes
            </button>
          </div>
        ) : (
          filteredMatches.map((item) => {
            const { scheme, match_percentage } = item;
            const isHighMatch = match_percentage >= 80;

            return (
              <div 
                key={scheme.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 transition shadow-sm hover:shadow-md ${
                  isHighMatch 
                    ? 'border-orange-300 ring-1 ring-orange-300/30' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left Overview */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                        match_percentage >= 80 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : match_percentage >= 65 
                          ? 'bg-amber-100 text-amber-900' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {match_percentage}% Match
                      </span>

                      <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded">
                        {scheme.code}
                      </span>

                      <span className="text-xs text-slate-500 truncate max-w-sm">
                        {scheme.ministry}
                      </span>
                    </div>

                    <h3 
                      onClick={() => onOpenScheme(item)}
                      className="text-lg font-bold text-gov-navy hover:text-orange-600 cursor-pointer transition leading-snug"
                    >
                      {scheme.name}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {scheme.description}
                    </p>

                    {/* Sector & Support tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-semibold border border-slate-200">
                        {profile?.business_type || "All Sectors"}
                      </span>
                      <span className="bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg font-semibold border border-blue-100">
                        {scheme.funding_type}
                      </span>
                      {scheme.max_funding > 0 && (
                        <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg font-bold border border-emerald-100">
                          Up to ₹{(scheme.max_funding / 100000).toFixed(0)} Lakhs
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Action Button */}
                  <div className="flex items-center lg:items-end justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <button
                      onClick={() => onOpenScheme(item)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-gov-navy hover:bg-gov-dark text-white rounded-xl text-xs font-bold transition shadow active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <span>View Scheme</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>

                {/* Eligibility Criteria Checklist Snippet */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>State criteria match</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Income criteria match</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Business category match</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Funding requirement fits</span>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
