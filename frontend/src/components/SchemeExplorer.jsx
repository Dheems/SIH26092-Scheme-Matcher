import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Building2, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { getSchemes } from '../services/api';
import { INDIAN_STATES, BUSINESS_TYPES, SOCIAL_CATEGORIES } from '../data/demoProfiles';

export default function SchemeExplorer({ onOpenScheme }) {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [businessType, setBusinessType] = useState('All');
  const [state, setState] = useState('All');

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res = await getSchemes({
        search,
        category,
        business_type: businessType,
        state
      });
      setSchemes(res.schemes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [search, category, businessType, state]);

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setBusinessType('All');
    setState('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-gov-navy to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <span className="text-xs uppercase font-bold text-orange-400 tracking-wider">
          Scheme Repository
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
          Explore Government Schemes for Micro-Enterprises
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
          Search and filter across central and state support programs for entrepreneurs, artisans, and small businesses.
        </p>

        {/* Search Bar */}
        <div className="mt-6 relative max-w-xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by scheme name, ministry, or keyword (e.g. food processing, equipment, subsidy)..."
            className="w-full pl-12 pr-4 py-3 bg-white text-slate-900 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-md"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wide">
            <Filter className="w-4 h-4 text-orange-600" />
            <span>Filter Criteria</span>
          </div>
          {(search || category !== 'All' || businessType !== 'All' || state !== 'All') && (
            <button
              onClick={resetFilters}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Beneficiary Group</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
            >
              <option value="All">All Categories</option>
              {SOCIAL_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Industry / Sector</label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
            >
              <option value="All">All Sectors</option>
              {BUSINESS_TYPES.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">State Availability</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
            >
              {INDIAN_STATES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
          <span>Found {schemes.length} schemes</span>
          <span>Click any scheme to inspect details and official links</span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs text-slate-400">Loading schemes...</div>
        ) : schemes.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No schemes found</h4>
            <p className="text-xs text-slate-500">Try clearing your filters to explore all available schemes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 rounded">
                      {scheme.code}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                      {scheme.ministry}
                    </span>
                  </div>

                  <h3 className="font-bold text-gov-navy text-base leading-snug">
                    {scheme.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {scheme.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {scheme.funding_type}
                    </span>
                    {scheme.max_funding > 0 && (
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        Up to ₹{(scheme.max_funding / 100000).toFixed(0)} Lakhs
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-orange-700 font-semibold truncate max-w-[200px]">
                    {scheme.subsidy_percentage || "Government Support"}
                  </span>

                  <button
                    onClick={() => {
                      onOpenScheme({
                        scheme,
                        match_percentage: 85,
                        why_matched: [
                          "Scheme is operational across all Indian states.",
                          "Applicable for registered micro-units and entrepreneurs."
                        ],
                        missing_requirements: [
                          "Verify state-specific quota and branch lending availability."
                        ],
                        ai_recommendation: `Official program administered by ${scheme.ministry}.`,
                        actionable_steps: [
                          "Check official portal guidelines.",
                          "Obtain project quotations for loan sanction."
                        ]
                      });
                    }}
                    className="px-3.5 py-1.5 bg-gov-navy hover:bg-gov-dark text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm active:scale-95"
                  >
                    <span>View Scheme</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
