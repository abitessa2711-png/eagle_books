import React, { useState } from 'react';
import { X, TrendingUp, Check, ShieldCheck, Scale, Sparkles } from 'lucide-react';
import { translations } from '../utils/translations';
import { formatCurrency } from '../utils/calculations';

export function RateManagerModal({
  lang,
  isOpen,
  onClose,
  rates,
  onSaveRates
}) {
  const t = translations[lang];

  const [ratePerGram, setRatePerGram] = useState(String(rates.ratePerGram || 95));

  if (!isOpen) return null;

  const currentRate = Number(ratePerGram) || 95;
  const rate10g = currentRate * 10;
  const rate1kg = currentRate * 1000;
  const rate78 = (currentRate * 0.78).toFixed(2);
  const rate65 = (currentRate * 0.65).toFixed(2);
  const rate925 = (currentRate * 0.925).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...rates,
      ratePerGram: currentRate,
      ratePer10Gram: rate10g,
      ratePerKg: rate1kg,
      touch78Rate: Number(rate78),
      touch65Rate: Number(rate65),
      sterling925Rate: Number(rate925),
      lastUpdated: new Date().toISOString()
    };
    onSaveRates(updated);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.2)',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={18} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
              {t.todayRate} (Silver Rate Barometer)
            </h3>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <label className="input-label" style={{ fontSize: '0.95rem' }}>
              {lang === 'ta' ? 'இன்றைய நய வெள்ளி விலை (1 கிராம் - 100% Fine Pure):' : 'Fine Silver Rate (1g - 100% Pure):'} *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                step="0.1"
                min="1"
                value={ratePerGram}
                onChange={(e) => setRatePerGram(e.target.value)}
                className="input-field"
                style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fbbf24' }}
                required
                autoFocus
              />
              <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: '600' }}>
                ₹ / கிராம்
              </span>
            </div>
          </div>

          {/* Touch Rates Breakdown Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              {lang === 'ta' ? 'தானியங்கி மாற்று விலைகள் (Calculated Rates):' : 'Calculated Touch Rates:'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.35rem' }}>
                <span style={{ color: '#fbbf24', fontWeight: '700' }}>⭐ 78% கொலுசு மாற்று (Kolusu Touch):</span>
                <span style={{ fontWeight: '800', color: '#ffffff' }}>₹{rate78} / g</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.35rem' }}>
                <span style={{ color: '#34d399' }}>🟢 65% பழைய மாற்று (65% Touch):</span>
                <span style={{ fontWeight: '800', color: '#ffffff' }}>₹{rate65} / g</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.35rem' }}>
                <span style={{ color: '#cbd5e1' }}>⚪ 92.5% ஸ்டெர்லிங் (Sterling 925):</span>
                <span style={{ fontWeight: '800', color: '#ffffff' }}>₹{rate925} / g</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.2rem' }}>
                <span style={{ color: '#38bdf8', fontWeight: '700' }}>📦 1 கிலோ வெள்ளி கட்டி (1 kg Bar):</span>
                <span style={{ fontWeight: '900', color: '#38bdf8' }}>{formatCurrency(rate1kg)}</span>
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              {t.cancel}
            </button>
            <button type="submit" className="btn btn-gold">
              <Check size={16} />
              <span>{lang === 'ta' ? 'விலையை புதுப்பிக்க' : 'Update Rate'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
