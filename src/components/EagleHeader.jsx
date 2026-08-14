import React from 'react';
import { 
  TrendingUp, 
  LogOut
} from 'lucide-react';
import { translations } from '../utils/translations';

export function EagleHeader({
  lang,
  setLang,
  rates,
  currentUser,
  onLogout,
  onOpenRateModal
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

      {/* Header Actions - Clean, Elegant & Client Delivery Ready */}
      <div className="header-actions">
        
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
