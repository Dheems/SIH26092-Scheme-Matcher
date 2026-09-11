const API_BASE = '/api';

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function getSchemes(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.category && params.category !== 'All') query.set('category', params.category);
  if (params.business_type && params.business_type !== 'All') query.set('business_type', params.business_type);
  if (params.state && params.state !== 'All') query.set('state', params.state);
  if (params.max_funding) query.set('max_funding', params.max_funding);

  const res = await fetch(`${API_BASE}/schemes?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch schemes');
  return res.json();
}

export async function getSchemeById(id) {
  const res = await fetch(`${API_BASE}/schemes/${id}`);
  if (!res.ok) throw new Error('Scheme not found');
  return res.json();
}

export async function matchSchemes(profile, weights = null) {
  const res = await fetch(`${API_BASE}/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, weights })
  });
  if (!res.ok) throw new Error('Failed to compute scheme match');
  return res.json();
}

export async function saveProfile(profile) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile })
  });
  if (!res.ok) throw new Error('Failed to save profile');
  return res.json();
}

export async function getSavedSchemes(profileId = null) {
  const url = profileId ? `${API_BASE}/schemes/saved?profile_id=${profileId}` : `${API_BASE}/schemes/saved`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch saved schemes');
  return res.json();
}

export async function toggleSaveScheme(schemeId, profileId = null) {
  const url = profileId ? `${API_BASE}/schemes/${schemeId}/save?profile_id=${profileId}` : `${API_BASE}/schemes/${schemeId}/save`;
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to toggle save');
  return res.json();
}

export async function uploadDocument(formData) {
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Failed to upload document');
  return res.json();
}

export async function chatWithAssistant(query, profile = null, currentScheme = null, matchedSchemes = null) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, profile, current_scheme: currentScheme, matched_schemes: matchedSchemes })
  });
  if (!res.ok) throw new Error('Failed to reach SchemeSaathi');
  return res.json();
}
