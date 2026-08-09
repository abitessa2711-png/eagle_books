import React from 'react';
import { 
  BookOpen, 
  Smartphone, 
  Calculator, 
  RefreshCw, 
  Download, 
  PlusCircle, 
  Sparkles, 
  Languages, 
  Printer, 
  TrendingUp,
  FileText
} from 'lucide-react';
import { translations } from '../utils/translations';
import { formatCurrency } from '../utils/calculations';

export function Header({
  lang,
  setLang,
  viewMode,
  setViewMode,
  rates,
  onOpenRateModal,
  onOpenCustomerModal,
  onOpenConverterModal,
  onOpenBackupModal,
  onOpenPrintAll
}) {
  const t = translations[lang];

  return (
    <header className="glass-card" style={{ margin: '1rem', padding: '1rem 1.5rem', borderRadius: '18px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0284c7, #0f172a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)',
            border: '1px solid rgba(56, 189, 248, 0.4)'
          }}>
            🦅
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: '800', letterSpacing: '-0.02em', margin: 0, color: '#f8fafc' }}>
                {t.appName}
              </h1>
              <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                PRO 2026
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, fontWeight: '500' }}>
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Live Silver Rate Ticker */}
        <div 
          onClick={onOpenRateModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            padding: '0.45rem 0.9rem',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}
          title={t.updateRate}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {t.todayRate} (1g)
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff' }}>
                {formatCurrency(rates.ratePerGram)}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                / 10g: {formatCurrency(rates.ratePer10Gram || rates.ratePerGram * 10)}
              </span>
            </div>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#38bdf8', textDecoration: 'underline', marginLeft: '0.25rem' }}>
            {t.updateRate}
          </span>
        </div>

        {/* View Mode Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(15, 23, 42, 0.85)',
          padding: '0.3rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            onClick={() => setViewMode('khatabook')}
            className="btn btn-sm"
            style={{
              background: viewMode === 'khatabook' ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'transparent',
              color: viewMode === 'khatabook' ? '#ffffff' : '#94a3b8',
              boxShadow: viewMode === 'khatabook' ? '0 2px 8px rgba(2, 132, 199, 0.4)' : 'none',
              padding: '0.4rem 0.8rem'
            }}
          >
            <Smartphone size={15} />
            <span>{t.viewKhatabook}</span>
          </button>

          <button
            onClick={() => setViewMode('notebook')}
            className="btn btn-sm"
            style={{
              background: viewMode === 'notebook' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
              color: viewMode === 'notebook' ? '#ffffff' : '#94a3b8',
              boxShadow: viewMode === 'notebook' ? '0 2px 8px rgba(245, 158, 11, 0.4)' : 'none',
              padding: '0.4rem 0.8rem'
            }}
          >
            <BookOpen size={15} />
            <span>{t.viewNotebook}</span>
          </button>
        </div>

        {/* Top Right Quick Actions & Language Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          
          {/* Quick Calculator */}
          <button
            onClick={onOpenConverterModal}
            className="btn btn-sm btn-outline"
            style={{ padding: '0.45rem 0.75rem' }}
            title={t.quickCalculator}
          >
            <Calculator size={16} color="#38bdf8" />
            <span style={{ fontSize: '0.8rem' }}>{t.quickCalculator}</span>
          </button>

          {/* New Customer Button */}
          <button
            onClick={onOpenCustomerModal}
            className="btn btn-sm btn-primary"
            style={{ padding: '0.45rem 0.85rem' }}
          >
            <PlusCircle size={16} />
            <span style={{ fontSize: '0.8rem' }}>{t.newCustomer}</span>
          </button>

          {/* Backup & Restore */}
          <button
            onClick={onOpenBackupModal}
            className="btn btn-sm btn-outline"
            style={{ padding: '0.45rem 0.65rem' }}
            title={t.backupRestore}
          >
            <Download size={16} />
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
            className="btn btn-sm btn-outline"
            style={{
              padding: '0.45rem 0.75rem',
              fontWeight: '700',
              borderColor: 'rgba(56, 189, 248, 0.3)'
            }}
            title="Switch Language / மொழி மாற்று"
          >
            <Languages size={15} color="#38bdf8" />
            <span style={{ fontSize: '0.8rem', color: '#38bdf8' }}>
              {lang === 'ta' ? 'English' : 'தமிழ்'}
            </span>
          </button>

        </div>

      </div>
    </header>
  );
}
