import React from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  ArrowRight,
  FileText,
  ListOrdered,
  Building,
  ShieldCheck,
  Gift,
  Users
} from 'lucide-react';

export default function SchemeDetailModal({ 
  matchItem, 
  onClose 
}) {
  if (!matchItem) return null;

  const { scheme, match_percentage } = matchItem;

  // Fallback official portal if not specified
  const officialUrl = scheme.official_reference && scheme.official_reference.startsWith('http')
    ? scheme.official_reference
    : 'https://www.myscheme.gov.in/';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 my-6 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gov-navy to-slate-900 text-white p-6 border-b border-slate-800 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-400/30">
              {scheme.code}
            </span>
            <span className="text-xs text-slate-300 truncate max-w-md">
              {scheme.ministry}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {scheme.name}
          </h3>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Support Type</span>
              <span className="font-semibold text-white">{scheme.funding_type}</span>
            </div>
            {scheme.max_funding > 0 && (
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Max Funding</span>
                <span className="font-semibold text-emerald-400">
                  ₹{(scheme.max_funding / 100000).toFixed(0)} Lakhs
                </span>
              </div>
            )}
            {scheme.subsidy_percentage && scheme.subsidy_percentage !== 'N/A' && (
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Subsidy / Concession</span>
                <span className="font-semibold text-amber-300">{scheme.subsidy_percentage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          
          {/* Match Score Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">Estimated Suitability</span>
              <h4 className="text-base font-bold text-slate-900">
                {match_percentage}% Match Score
              </h4>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-black ${
              match_percentage >= 80 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-amber-100 text-amber-900'
            }`}>
              {match_percentage >= 80 ? 'Highly Suitable' : 'Potentially Eligible'}
            </span>
          </div>

          {/* Short Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Short Description
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {scheme.description}
            </p>
          </div>

          {/* WHY YOU MAY QUALIFY & IMPORTANT TO VERIFY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Why You May Qualify */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Why You May Qualify</span>
              </div>
              <p className="text-[11px] text-emerald-900 italic">
                Based on the information you provided, you appear to meet the listed criteria:
              </p>
              <ul className="space-y-1.5 text-xs text-emerald-950">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Your state matches scheme coverage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Your category matches designated beneficiaries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Your income falls within the required range</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Your business type and sector are supported</span>
                </li>
              </ul>
            </div>

            {/* Important to Verify */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Important to Verify</span>
              </div>
              <ul className="space-y-2 text-xs text-amber-950">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">⚠</span>
                  <span>Final eligibility is determined by the official implementing bank or ministry authority.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">⚠</span>
                  <span>Check the latest scheme guidelines and active intake windows on the official portal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">⚠</span>
                  <span>{scheme.verification_disclaimer || "Ensure all requisite business identity documents are valid before applying."}</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Benefits & Support Provided */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-orange-600" />
              Benefits & Support Provided
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-slate-700">
              <p>
                <strong>Financial Assistance:</strong> {scheme.funding_type} ranging from ₹{scheme.min_funding ? scheme.min_funding.toLocaleString('en-IN') : '0'} up to ₹{scheme.max_funding ? scheme.max_funding.toLocaleString('en-IN') : 'N/A'}.
              </p>
              {scheme.subsidy_percentage && (
                <p>
                  <strong>Subsidy / Concession:</strong> {scheme.subsidy_percentage}.
                </p>
              )}
              <p>
                <strong>Target Sectors:</strong> {scheme.business_types ? scheme.business_types.join(', ') : 'All enterprises'}.
              </p>
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              Who Can Apply & Criteria
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {scheme.eligibility_criteria && scheme.eligibility_criteria.map((c, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Documents Typically Required (Reference Checklist) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-500" />
              Documents Typically Required (Prepare For Official Portal)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {scheme.required_documents && scheme.required_documents.map((doc, idx) => (
                <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0" />
                  <span className="text-slate-800 font-medium">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Application Steps on Official Portal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
              <ListOrdered className="w-4 h-4 text-slate-500" />
              How Application Works on the Official Portal
            </h4>
            <div className="space-y-2 text-xs">
              {scheme.application_steps && scheme.application_steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-700 leading-snug">{step}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Prominent Official Website Redirection Footer */}
        <div className="bg-slate-50 p-5 sm:p-6 border-t border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl border border-slate-300 hover:bg-slate-100 transition"
            >
              Close
            </button>

            <a
              href={officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              <span>Visit Official Website →</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            SchemeSaathi helps you discover and understand schemes. Applications are completed on the official government portal.
          </p>
        </div>

      </div>
    </div>
  );
}
