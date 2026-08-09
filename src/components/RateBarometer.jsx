import React from 'react';
import { Sparkles, Edit3, ShieldCheck, Flame, Scale } from 'lucide-react';
import { translations } from '../utils/translations';
import { formatCurrency } from '../utils/calculations';

export function RateBarometer({ lang, rates, onOpenRateModal }) {
  const t = translations[lang];

  const rate1g = Number(rates.ratePerGram) || 95;
  const rate78 = (rate1g * 0.78).toFixed(2);
  const rate65 = (rate1g * 0.65).toFixed(2);
  const rate925 = (rate1g * 0.925).toFixed(2);

  return (
    <div style={{ margin: '0 1rem 1.25rem 1rem' }}>
      <div 
        className="glass-card" 
        style={{
          background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.85rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.2rem' }}>⚡</span>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {lang === 'ta' ? 'அன்றைய வெள்ளி சந்தை விலை நிலவரம்:' : "Today's Live Silver Rates:"}
          </span>
        </div>

        {/* Rate Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.65rem' }}>
          
          {/* 1g Fine Silver */}
          <div style={{
            background: 'rgba(2, 132, 199, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '8px',
            padding: '0.3rem 0.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <ShieldCheck size={14} color="#38bdf8" />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>100% {lang === 'ta' ? 'நயம்' : 'Fine'}:</span>
            <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#38bdf8' }}>
              {formatCurrency(rate1g)}/g
            </span>
          </div>

          {/* 78% Kolusu Touch */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '8px',
            padding: '0.3rem 0.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <Scale size={14} color="#fbbf24" />
            <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: '700' }}>
              78% {lang === 'ta' ? 'கொலுசு மாற்று' : 'Touch'}:
            </span>
            <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#ffffff' }}>
              {formatCurrency(rate78)}/g
            </span>
          </div>

          {/* 65% Touch */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '0.3rem 0.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#34d399' }}>65% {lang === 'ta' ? 'மாற்று' : 'Touch'}:</span>
            <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#34d399' }}>
              {formatCurrency(rate65)}/g
            </span>
          </div>

          {/* 92.5% Sterling */}
          <div style={{
            background: 'rgba(148, 163, 184, 0.12)',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            borderRadius: '8px',
            padding: '0.3rem 0.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>92.5% Sterling:</span>
            <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#ffffff' }}>
              {formatCurrency(rate925)}/g
            </span>
          </div>

          {/* Edit Rate trigger */}
          <button 
            onClick={onOpenRateModal}
            className="btn btn-sm btn-outline"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}
          >
            <Edit3 size={12} />
            <span>{lang === 'ta' ? 'விலை மாற்று' : 'Edit'}</span>
          </button>

        </div>

      </div>
    </div>
  );
}
