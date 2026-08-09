import React from 'react';
import { 
  TrendingUp, 
  Languages, 
  Plus, 
  Calculator, 
  Share2, 
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { translations } from '../utils/translations';
import { formatCurrency } from '../utils/calculations';

export function MobileNavbar({
  lang,
  setLang,
  rates,
  onOpenRateModal,
  onOpenCustomerModal,
  onOpenConverterModal,
  isWideDesktop,
  onToggleWideDesktop
}) {
  const t = translations[lang];

  return (
    <header className="mobile-header">
      {/* Official Business Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        
        {/* Official Eagle Silvers Wholesale Medallion Logo */}
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          boxShadow: '0 3px 12px rgba(0, 0, 0, 0.4), 0 0 0 1.5px #f59e0b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#070d1e',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          <img 
            src="/eagle-logo.svg" 
            alt="Eagle Silvers Wholesale Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <h1 style={{ fontSize: '1.05rem', fontWeight: '900', margin: 0, color: '#ffffff', letterSpacing: '-0.01em' }}>
              EAGLE SILVERS
            </h1>
            <span style={{
              fontSize: '0.62rem',
              fontWeight: '900',
              color: '#070d1e',
              background: 'linear-gradient(135deg, #fef08a, #f59e0b)',
              padding: '0.1rem 0.35rem',
              borderRadius: '4px',
              letterSpacing: '0.04em'
            }}>
              WHOLESALE
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: '#93c5fd', margin: 0, fontWeight: '600' }}>
            {lang === 'ta' ? 'ஈகிள் புக்ஸ் • வெள்ளி நகை கணக்கு' : 'Eagle Books • Silver Jewelry Ledger'}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
        
        {/* Live Silver Rate Pill */}
        <button
          onClick={onOpenRateModal}
          style={{
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            border: '1.5px solid #f59e0b',
            padding: '0.3rem 0.6rem',
            borderRadius: '8px',
            color: '#78350f',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: '900',
            boxShadow: '0 2px 6px rgba(245, 158, 11, 0.2)'
          }}
          title={t.todayRate}
        >
          <TrendingUp size={14} color="#b45309" />
          <span>{formatCurrency(rates.ratePerGram)}/g</span>
        </button>

        {/* Quick Calculator */}
        <button
          onClick={onOpenConverterModal}
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '0.4rem',
            borderRadius: '8px',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={t.quickCalculator}
        >
          <Calculator size={16} />
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
          style={{
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            padding: '0.3rem 0.55rem',
            borderRadius: '8px',
            color: '#070d1e',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: '900'
          }}
          title="Switch Language / மொழி மாற்று"
        >
          {lang === 'ta' ? 'EN' : 'தமிழ்'}
        </button>

        {/* Wide/Mobile Screen Toggle */}
        <button
          onClick={onToggleWideDesktop}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '0.2rem',
            display: 'none'
          }}
          className="desktop-only-toggle"
          title="Toggle Screen Mode"
        >
          {isWideDesktop ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

      </div>
    </header>
  );
}
