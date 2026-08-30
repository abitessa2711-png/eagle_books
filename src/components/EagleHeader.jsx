import React from 'react';
import { 
  TrendingUp, 
  LogOut,
  Calculator,
  Database,
  Globe
} from 'lucide-react';
import { translations } from '../utils/translations';

export function EagleHeader({
  lang,
  setLang,
  silverRate,
  onLogout,
  onOpenRateModal,
  onOpenBackupModal,
  onOpenConverterModal
}) {
  const t = translations[lang] || translations.ta;
  const currentRate = Number(silverRate) || 95;

  return (
    <header className="app-header">
      {/* Brand & Logo */}
      <div className="brand-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <img 
          src="/eagle-logo.png" 
          alt="Eagle Logo" 
          className="brand-logo-img"
          style={{ width: '36px', height: '36px', objectFit: 'contain' }}
        />
        <div className="brand-titles">
          <div className="brand-main-title" style={{ fontSize: '1.05rem', fontWeight: '900', color: '#ffffff', lineHeight: '1.1' }}>
            {lang === 'ta' ? 'ஈகிள் புக்ஸ்' : 'Eagle Books'}
          </div>
          <div className="brand-sub-title" style={{ fontSize: '0.68rem', color: '#cbd5e1', fontWeight: '700' }}>
            {lang === 'ta' ? 'சில்வர் கணக்கு ஏடு' : 'Silver Khatabook'}
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        {/* Live Silver Rate Pill */}
        <button
          onClick={onOpenRateModal}
          className="silver-rate-pill"
          title={t.todayRate}
          style={{
            background: 'rgba(234, 88, 12, 0.25)',
            border: '1px solid rgba(249, 115, 22, 0.4)',
            color: '#ffedd5',
            padding: '0.3rem 0.55rem',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            cursor: 'pointer'
          }}
        >
          <TrendingUp size={13} color="#f97316" strokeWidth={3} />
          <span>₹{currentRate}/g</span>
        </button>

        {/* Live Calculator Shortcut */}
        <button
          onClick={onOpenConverterModal}
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            border: 'none',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer'
          }}
          title={lang === 'ta' ? 'கணிப்பான் (Calculator)' : 'Calculator'}
        >
          <Calculator size={15} />
        </button>

        {/* Backup & Restore Shortcut */}
        <button
          onClick={onOpenBackupModal}
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            border: 'none',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer'
          }}
          title={lang === 'ta' ? 'பேக்கப் (Backup)' : 'Backup & Restore'}
        >
          <Database size={15} />
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            border: 'none',
            borderRadius: '8px',
            padding: '0.3rem 0.5rem',
            fontSize: '0.72rem',
            fontWeight: '900',
            color: '#ffffff',
            cursor: 'pointer'
          }}
          title="Switch Language"
        >
          {lang === 'ta' ? 'EN' : 'தமிழ்'}
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fca5a5',
            cursor: 'pointer'
          }}
          title={lang === 'ta' ? 'வெளியேறு (Logout)' : 'Logout'}
        >
          <LogOut size={15} />
        </button>

      </div>
    </header>
  );
}
