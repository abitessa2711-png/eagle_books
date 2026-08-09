import React from 'react';
import { 
  TrendingUp, 
  Calculator, 
  Languages, 
  Database,
  LogOut,
  Crown,
  User
} from 'lucide-react';
import { translations } from '../utils/translations';
import { formatCurrency } from '../utils/calculations';

export function EagleHeader({
  lang,
  setLang,
  rates,
  currentUser,
  onLogout,
  onOpenRateModal,
  onOpenConverterModal,
  onOpenBackupModal
}) {
  const t = translations[lang];
  const currentRate = Number(rates.ratePerGram) || 95;

  return (
    <header className="app-header">
      {/* Brand & Logo */}
      <div className="brand-wrapper">
        <img 
          src="/eagle-logo.svg" 
          alt="Eagle Books Logo" 
          className="brand-logo-img"
        />
        <div className="brand-titles">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <h1 className="brand-main-title">
              {lang === 'ta' ? 'ஈகிள் புக்ஸ்' : 'Eagle Books'}
            </h1>
            {currentUser && (
              <span style={{
                fontSize: '0.62rem',
                fontWeight: '900',
                background: currentUser.role === 'OWNER' ? '#fef3c7' : '#e0f2fe',
                color: currentUser.role === 'OWNER' ? '#b45309' : '#0369a1',
                padding: '0.1rem 0.35rem',
                borderRadius: '4px',
                border: currentUser.role === 'OWNER' ? '1px solid #fcd34d' : '1px solid #7dd3fc'
              }}>
                {currentUser.role === 'OWNER' ? '👑 Owner' : '💼 Staff'}
              </span>
            )}
          </div>
          <span className="brand-sub-title">
            {currentUser ? currentUser.name : (lang === 'ta' ? 'சில்வர் கட்டாபுக் & கணக்கு ஏடு' : 'Silver Khatabook & Ledger')}
          </span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="header-actions">
        
        {/* Live Silver Rate Pill */}
        <button
          onClick={onOpenRateModal}
          className="header-btn"
          style={{ background: '#ffffff', color: '#92400e', border: '1px solid #fcd34d' }}
          title={t.todayRate}
        >
          <TrendingUp size={14} color="#b45309" />
          <span>{formatCurrency(currentRate)}/g</span>
        </button>

        {/* Quick Calculator */}
        <button
          onClick={onOpenConverterModal}
          className="header-btn"
          title={t.quickCalculator}
        >
          <Calculator size={16} />
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
          className="header-btn"
          title="Switch Language"
        >
          {lang === 'ta' ? 'EN' : 'தமிழ்'}
        </button>

        {/* Backup (Only for Owner) */}
        {(!currentUser || currentUser.role === 'OWNER') && (
          <button
            onClick={onOpenBackupModal}
            className="header-btn"
            title={t.backupRestore}
          >
            <Database size={15} />
          </button>
        )}

        {/* Logout Button */}
        {currentUser && (
          <button
            onClick={onLogout}
            className="header-btn"
            style={{ background: 'rgba(239, 68, 68, 0.25)', border: '1px solid rgba(239, 68, 68, 0.5)' }}
            title={lang === 'ta' ? 'வெளியேறு (Logout)' : 'Logout'}
          >
            <LogOut size={15} />
          </button>
        )}

      </div>
    </header>
  );
}
