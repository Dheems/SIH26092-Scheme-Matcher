import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import EligibilityForm from './components/EligibilityForm';
import ResultsView from './components/ResultsView';
import SchemeExplorer from './components/SchemeExplorer';
import SchemeDetailModal from './components/SchemeDetailModal';
import SchemeSaathiChat from './components/SchemeSaathiChat';
import Toast from './components/Toast';
import { DEMO_PERSONAS } from './data/demoProfiles';
import { matchSchemes } from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'form', 'results', 'explorer'
  const [profile, setProfile] = useState(DEMO_PERSONAS[0].profile);
  const [matchResults, setMatchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSchemeItem, setSelectedSchemeItem] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Run Scheme Matching via existing working backend
  const handleFindSchemes = async () => {
    setIsLoading(true);
    try {
      const res = await matchSchemes(profile);
      setMatchResults(res);
      setCurrentView('results');
      addToast(`Found ${res.total_matched || res.all_matches?.length || 0} schemes matching your criteria!`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Error communicating with backend. Please make sure backend is running on port 8000.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Populate Demo Persona (Ravi Kumar / Sunita Devi)
  const handleLoadDemo = (personaId = 'ravi') => {
    const target = DEMO_PERSONAS.find(p => p.id === personaId) || DEMO_PERSONAS[0];
    setProfile({ ...target.profile });
    setCurrentView('form');
    addToast(`⚡ Populated details for ${target.profile.name} (${target.profile.social_category}, ${target.profile.business_type}). Click "Find My Schemes" to proceed.`, 'info');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col selection:bg-orange-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLoadDemo={handleLoadDemo}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onFindSchemes={() => setCurrentView('form')}
            onExplore={() => setCurrentView('explorer')}
            onLoadDemo={handleLoadDemo}
          />
        )}

        {currentView === 'form' && (
          <EligibilityForm
            formData={profile}
            setFormData={setProfile}
            onSubmit={handleFindSchemes}
            isLoading={isLoading}
            onLoadDemo={handleLoadDemo}
          />
        )}

        {currentView === 'results' && (
          <ResultsView
            results={matchResults}
            profile={profile}
            onBackToEdit={() => setCurrentView('form')}
            onOpenScheme={(item) => setSelectedSchemeItem(item)}
          />
        )}

        {currentView === 'explorer' && (
          <SchemeExplorer
            onOpenScheme={(item) => setSelectedSchemeItem(item)}
          />
        )}
      </main>

      {/* Scheme Detail Modal (Explainability & Official Redirection) */}
      {selectedSchemeItem && (
        <SchemeDetailModal
          matchItem={selectedSchemeItem}
          onClose={() => setSelectedSchemeItem(null)}
        />
      )}

      {/* SchemeSaathi Assistant */}
      <SchemeSaathiChat
        profile={profile}
        activeScheme={selectedSchemeItem}
        matchedSchemes={matchResults?.all_matches}
      />

      {/* Toast Notifications */}
      <Toast
        toasts={toasts}
        onDismiss={dismissToast}
      />

    </div>
  );
}
