import React, { useState } from 'react';
import { X, TrendingUp, Check, ShieldCheck, Scale, Sparkles, Sliders } from 'lucide-react';
import { translations } from '../utils/translations';
import { formatCurrency } from '../utils/calculations';

export function RateManagerModal({
  lang,
  isOpen,
  onClose,
  rates,
  onSaveRates
}) {
  const t = translations[lang] || translations.ta;

  const [ratePerGram, setRatePerGram] = useState(String(rates?.ratePerGram || 95));
  
  // 4 Customizable Touch % Levels
  const [touch1, setTouch1] = useState(String(rates?.customTouch1 || '78'));
  const [touch2, setTouch2] = useState(String(rates?.customTouch2 || '80'));
  const [touch3, setTouch3] = useState(String(rates?.customTouch3 || '84'));
  const [touch4, setTouch4] = useState(String(rates?.customTouch4 || '92.5'));

  const quickPresets = ['70', '75', '78', '80', '84', '90', '92.5', '100'];

  if (!isOpen) return null;

  const currentRate = Number(ratePerGram) || 95;
  const rate10g = currentRate * 10;
  const rate1kg = currentRate * 1000;

  const calcRate1 = (currentRate * (Number(touch1) || 78) / 100).toFixed(2);
  const calcRate2 = (currentRate * (Number(touch2) || 80) / 100).toFixed(2);
  const calcRate3 = (currentRate * (Number(touch3) || 84) / 100).toFixed(2);
  const calcRate4 = (currentRate * (Number(touch4) || 92.5) / 100).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...rates,
      ratePerGram: currentRate,
      ratePer10Gram: rate10g,
      ratePerKg: rate1kg,
      customTouch1: Number(touch1) || 78,
      customTouch2: Number(touch2) || 80,
      customTouch3: Number(touch3) || 84,
      customTouch4: Number(touch4) || 92.5,
      touch1Rate: Number(calcRate1),
      touch2Rate: Number(calcRate2),
      touch3Rate: Number(calcRate3),
      touch4Rate: Number(calcRate4),
      lastUpdated: new Date().toISOString()
    };
    onSaveRates(updated);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          background: 'linear-gradient(135deg, #090f24 0%, #1e293b 100%)',
          color: '#ffffff',
          borderRadius: '16px 16px 0 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#f97316',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '900', margin: 0, color: '#ffffff' }}>
                {lang === 'ta' ? 'இன்றைய வெள்ளி விலை நிர்ணயம்' : 'Daily Silver Rate Manager'}
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#fcd34d', fontWeight: '700' }}>
                {lang === 'ta' ? 'நய வெள்ளி & டச் % மாற்றங்கள்' : 'Fine Silver & Custom Touch Rates'}
              </span>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#ffffff', color: '#000000' }}>
          
          {/* Main Pure Rate Input */}
          <div style={{ background: '#fff7ed', border: '2px solid #f97316', borderRadius: '12px', padding: '0.85rem 1rem' }}>
            <label className="input-label" style={{ fontSize: '0.92rem', color: '#9a3412', fontWeight: '800' }}>
              {lang === 'ta' ? '1. நய வெள்ளி விலை (100% Fine Silver / Gram):' : 'Fine Silver Rate (1g - 100% Pure):'} *
            </label>
            <div style={{ position: 'relative', marginTop: '0.35rem' }}>
              <input
                type="number"
                step="0.1"
                min="1"
                value={ratePerGram}
                onChange={(e) => setRatePerGram(e.target.value)}
                className="input-field"
                style={{ fontSize: '1.4rem', fontWeight: '900', color: '#ea580c', paddingLeft: '2rem' }}
                required
                autoFocus
              />
              <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#ea580c', fontWeight: '900', fontSize: '1.2rem' }}>
                ₹
              </span>
              <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: '800', fontSize: '0.85rem' }}>
                / கிராம்
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.35rem', fontWeight: '600' }}>
              10 கிராம்: <strong>₹{(currentRate * 10).toLocaleString()}</strong> | 1 கிலோ பார்: <strong>{formatCurrency(rate1kg)}</strong>
            </div>
          </div>

          {/* 4 Customizable Touch Rates Card */}
          <div style={{
            background: '#f8fafc',
            border: '1.5px solid #cbd5e1',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sliders size={15} color="#ea580c" />
                <span>{lang === 'ta' ? 'தானியங்கி டச் % விலைகள் (Custom Touch Rates):' : 'Calculated Touch Rates (Adjustable):'}</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700' }}>
                {lang === 'ta' ? 'டச் % மாற்றிக்கொள்ளலாம்' : 'Edit Touch % directly'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              
              {/* Row 1 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 80px 1fr', gap: '0.5rem', alignItems: 'center', background: '#ffffff', padding: '0.5rem 0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: '800', fontSize: '0.85rem', color: '#b45309' }}>
                  ⭐ {lang === 'ta' ? 'கொலுசு மாற்று' : 'Kolusu Touch'}:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <input
                    type="number"
                    step="0.1"
                    value={touch1}
                    onChange={(e) => setTouch1(e.target.value)}
                    style={{ width: '54px', padding: '0.2rem 0.3rem', border: '1.5px solid #f59e0b', borderRadius: '6px', textAlign: 'center', fontWeight: '900', color: '#b45309', fontSize: '0.85rem' }}
                  />
                  <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>%</span>
                </div>
                <div style={{ textAlign: 'right', fontWeight: '900', color: '#047857', fontSize: '0.95rem' }}>
                  ₹{calcRate1} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/g</span>
                </div>
              </div>

              {/* Row 2 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 80px 1fr', gap: '0.5rem', alignItems: 'center', background: '#ffffff', padding: '0.5rem 0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: '800', fontSize: '0.85rem', color: '#0369a1' }}>
                  🔷 {lang === 'ta' ? 'உருப்படி / சங்கிலி' : 'Chain / Item'}:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <input
                    type="number"
                    step="0.1"
                    value={touch2}
                    onChange={(e) => setTouch2(e.target.value)}
                    style={{ width: '54px', padding: '0.2rem 0.3rem', border: '1.5px solid #0284c7', borderRadius: '6px', textAlign: 'center', fontWeight: '900', color: '#0369a1', fontSize: '0.85rem' }}
                  />
                  <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>%</span>
                </div>
                <div style={{ textAlign: 'right', fontWeight: '900', color: '#047857', fontSize: '0.95rem' }}>
                  ₹{calcRate2} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/g</span>
                </div>
              </div>

              {/* Row 3 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 80px 1fr', gap: '0.5rem', alignItems: 'center', background: '#ffffff', padding: '0.5rem 0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: '800', fontSize: '0.85rem', color: '#475569' }}>
                  🟢 {lang === 'ta' ? 'பழைய வெள்ளி / மாற்று' : 'Old Silver Touch'}:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <input
                    type="number"
                    step="0.1"
                    value={touch3}
                    onChange={(e) => setTouch3(e.target.value)}
                    style={{ width: '54px', padding: '0.2rem 0.3rem', border: '1.5px solid #64748b', borderRadius: '6px', textAlign: 'center', fontWeight: '900', color: '#334155', fontSize: '0.85rem' }}
                  />
                  <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>%</span>
                </div>
                <div style={{ textAlign: 'right', fontWeight: '900', color: '#047857', fontSize: '0.95rem' }}>
                  ₹{calcRate3} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/g</span>
                </div>
              </div>

              {/* Row 4 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 80px 1fr', gap: '0.5rem', alignItems: 'center', background: '#ffffff', padding: '0.5rem 0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: '800', fontSize: '0.85rem', color: '#7c3aed' }}>
                  💎 {lang === 'ta' ? 'ஸ்டெர்லிங் 925 / Custom' : 'Sterling 925 / Custom'}:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <input
                    type="number"
                    step="0.1"
                    value={touch4}
                    onChange={(e) => setTouch4(e.target.value)}
                    style={{ width: '54px', padding: '0.2rem 0.3rem', border: '1.5px solid #8b5cf6', borderRadius: '6px', textAlign: 'center', fontWeight: '900', color: '#7c3aed', fontSize: '0.85rem' }}
                  />
                  <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>%</span>
                </div>
                <div style={{ textAlign: 'right', fontWeight: '900', color: '#047857', fontSize: '0.95rem' }}>
                  ₹{calcRate4} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/g</span>
                </div>
              </div>

            </div>

            {/* Quick Touch Presets */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.75rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '800' }}>முன்செட்:</span>
              {quickPresets.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTouch1(p)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '0.15rem 0.4rem',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {p}%
                </button>
              ))}
            </div>

          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ border: '1.5px solid #cbd5e1', color: '#475569', fontWeight: '800' }}>
              {t.cancel}
            </button>
            <button type="submit" className="btn btn-gold" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', color: '#ffffff', fontWeight: '900', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
              <Check size={18} />
              <span>{lang === 'ta' ? 'விலையை சேமி (Update Rates)' : 'Save Rates'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
