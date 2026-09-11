import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  User, 
  Briefcase, 
  IndianRupee,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  INDIAN_STATES, 
  BUSINESS_TYPES, 
  SOCIAL_CATEGORIES, 
  FUNDING_PURPOSES,
  DEMO_PERSONAS 
} from '../data/demoProfiles';

export default function EligibilityForm({ 
  formData, 
  setFormData, 
  onSubmit, 
  isLoading = false,
  onLoadDemo
}) {
  const [error, setError] = useState(null);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!formData.state || formData.state === 'All') {
      setError("Please select your state.");
      return;
    }
    if (!formData.social_category) {
      setError("Please select your social category.");
      return;
    }
    if (!formData.business_type) {
      setError("Please select your business type / sector.");
      return;
    }
    if (!formData.funding_required || formData.funding_required <= 0) {
      setError("Please specify the funding amount required.");
      return;
    }

    setError(null);
    onSubmit();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-orange-600 tracking-wider">
            Quick Eligibility Check
          </span>
          <h2 className="text-2xl font-bold text-gov-navy mt-1">
            Check Your Scheme Eligibility
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tell us a little about yourself and your business, and we'll find schemes that may fit you.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onLoadDemo('ravi')}
          className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 whitespace-nowrap"
        >
          <span>⚡ Fill Demo (Ravi Kumar)</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
        
        {/* SECTION 1: PERSONAL DETAILS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="e.g. Ravi Kumar"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-gov-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Age (Years) *
              </label>
              <input
                type="number"
                value={formData.age || ''}
                onChange={(e) => handleFieldChange('age', parseInt(e.target.value) || '')}
                placeholder="e.g. 32"
                min="18"
                max="100"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-gov-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Gender *
              </label>
              <select
                value={formData.gender || 'Male'}
                onChange={(e) => handleFieldChange('gender', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-gov-navy focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female (Eligible for Women-specific grants & subventions)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                State / UT *
              </label>
              <select
                value={formData.state || 'Maharashtra'}
                onChange={(e) => handleFieldChange('state', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-gov-navy focus:outline-none"
              >
                {INDIAN_STATES.filter(s => s !== "All").map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                District *
              </label>
              <input
                type="text"
                value={formData.district || ''}
                onChange={(e) => handleFieldChange('district', e.target.value)}
                placeholder="e.g. Nashik"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-gov-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Social Category *
              </label>
              <select
                value={formData.social_category || 'OBC'}
                onChange={(e) => handleFieldChange('social_category', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-gov-navy focus:outline-none"
              >
                {SOCIAL_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Annual Household Income (₹) *
              </label>
              <input
                type="number"
                value={formData.annual_income !== undefined ? formData.annual_income : ''}
                onChange={(e) => handleFieldChange('annual_income', parseFloat(e.target.value) || 0)}
                placeholder="e.g. 320000"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-gov-navy focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Certain subsidized micro-credit schemes require annual family income below specified limits (e.g. ₹3,00,000 to ₹8,00,000).
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: BUSINESS DETAILS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Business Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Business / Enterprise Name
              </label>
              <input
                type="text"
                value={formData.business_name || ''}
                onChange={(e) => handleFieldChange('business_name', e.target.value)}
                placeholder="e.g. Kisan Agro Foods"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-gov-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Business Type / Sector *
              </label>
              <select
                value={formData.business_type || 'Food Processing'}
                onChange={(e) => handleFieldChange('business_type', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-gov-navy focus:outline-none"
              >
                {BUSINESS_TYPES.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                New / Existing Business *
              </label>
              <select
                value={formData.is_new_business ? 'new' : 'existing'}
                onChange={(e) => {
                  const isNew = e.target.value === 'new';
                  handleFieldChange('is_new_business', isNew);
                  if (isNew) handleFieldChange('business_age', 0);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-gov-navy focus:outline-none"
              >
                <option value="existing">Existing Operating Business</option>
                <option value="new">New / Greenfield Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Business Age (Years in Operation)
              </label>
              <input
                type="number"
                value={formData.business_age !== undefined ? formData.business_age : ''}
                onChange={(e) => handleFieldChange('business_age', parseInt(e.target.value) || 0)}
                placeholder="e.g. 2"
                min="0"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-gov-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Number of Employees
              </label>
              <input
                type="number"
                value={formData.employees !== undefined ? formData.employees : 4}
                onChange={(e) => handleFieldChange('employees', parseInt(e.target.value) || 0)}
                placeholder="e.g. 4"
                min="0"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-gov-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Annual Turnover (₹)
              </label>
              <input
                type="number"
                value={formData.annual_turnover !== undefined ? formData.annual_turnover : ''}
                onChange={(e) => handleFieldChange('annual_turnover', parseFloat(e.target.value) || 0)}
                placeholder="e.g. 650000"
                min="0"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-gov-navy focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: FINANCIAL REQUIREMENTS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Financial Requirements
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Funding Required (₹) *
              </label>
              <input
                type="number"
                value={formData.funding_required !== undefined ? formData.funding_required : ''}
                onChange={(e) => handleFieldChange('funding_required', parseFloat(e.target.value) || 0)}
                placeholder="e.g. 500000"
                min="5000"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-gov-navy focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                e.g. ₹50,000 (Mudra Shishu), ₹5,00,000 (Kishore), ₹10L+ (PMEGP / Stand-Up India)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Purpose of Funding *
              </label>
              <select
                value={formData.funding_purpose || 'Equipment Purchase'}
                onChange={(e) => handleFieldChange('funding_purpose', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-gov-navy focus:outline-none"
              >
                {FUNDING_PURPOSES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Form Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            No registration or file upload required. Check schemes instantly.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-400 text-white font-bold rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 text-sm"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Checking Matching Schemes...</span>
              </>
            ) : (
              <>
                <span>Find My Schemes</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
