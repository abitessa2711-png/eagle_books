import React from 'react';
import { 
  TrendingUp, 
  Calculator, 
  Languages, 
  Plus, 
  Database,
  Share2
} from 'lucide-react';
import { translations } from '../utils/translations';
import { formatCurrency } from '../utils/calculations';

export function EagleHeader({
  lang,
  setLang,
  rates,
  onOpenRateModal,
  onOpenCustomerModal,
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
          <h1 className="brand-main-title">
            {lang === 'ta' ? 'ஈகிள் புக்ஸ்' : 'Eagle Books'}
          </h1>
          <span className="brand-sub-title">
            {lang === 'ta' ? 'சில்வர் கட்டாபுக் & கணக்கு ஏடு' : 'Silver Khatabook & Jeweller Ledger'}
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

        {/* Backup */}
        <button
          onClick={onOpenBackupModal}
          className="header-btn"
          title={t.backupRestore}
        >
          <Database size={15} />
        </button>

      </div>
    </header>
  );
}
