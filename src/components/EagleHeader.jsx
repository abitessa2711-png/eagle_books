import React from 'react';
import { 
  TrendingUp, 
  LogOut,
  Cloud,
  RefreshCw
} from 'lucide-react';
import { translations } from '../utils/translations';

export function EagleHeader({
  lang,
  setLang,
  rates,
  currentUser,
  cloudSynced,
  onLogout,
  onOpenRateModal,
  onManualSync
}) {
  const t = translations[lang] || translations.ta;
  const currentRate = Number(rates?.ratePerGram) || 95;

  return (
    <header className="app-header">
      {/* Brand & Logo */}
      <div className="brand-wrapper">
        <img 
          src="/eagle-logo.png" 
          alt="Eagle Logo" 
          className="brand-logo-img"
        />
        <div className="brand-titles">
          <div className="brand-main-title">
            {lang === 'ta' ? 'ஈகிள் புக்ஸ்' : 'Eagle Books'}
          </div>
          <div className="brand-sub-title">
            {lang === 'ta' ? 'சில்வர் கணக்கு ஏடு' : 'Silver Khatabook'}
          </div>
        </div>
      </div>

      {/* Header Actions - Clean & Mobile Friendly */}
      <div className="header-actions">
        
        {/* Cloud Sync Button */}
        {onManualSync && (
          <button
            onClick={onManualSync}
            className="header-action-btn"
            style={{ color: cloudSynced ? '#16a34a' : '#f59e0b', background: '#f8fafc', padding: '0.35rem 0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            title={cloudSynced ? 'Cloud Synced (Tap to Refresh)' : 'Syncing with Cloud...'}
          >
            <RefreshCw size={13} className={cloudSynced ? '' : 'spin-anim'} />
          </button>
        )}

        {/* Live Silver Rate Pill */}
        <button
          onClick={onOpenRateModal}
          className="header-rate-pill"
          title={t.todayRate}
        >
          <TrendingUp size={13} color="#ea580c" strokeWidth={3} />
          <span>₹{currentRate}/g</span>
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
          className="header-action-btn lang-btn"
          title="Switch Language"
        >
          {lang === 'ta' ? 'EN' : 'தமிழ்'}
        </button>

        {/* Logout Button */}
        {currentUser && (
          <button
            onClick={onLogout}
            className="header-action-btn logout-btn"
            title={lang === 'ta' ? 'வெளியேறு (Logout)' : 'Logout'}
          >
            <LogOut size={15} />
          </button>
        )}

      </div>
    </header>
  );
}
