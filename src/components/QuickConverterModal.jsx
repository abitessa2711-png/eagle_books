import React, { useState } from 'react';
import { X, Calculator, Scale, Banknote, Copy, Check } from 'lucide-react';
import { translations } from '../utils/translations';
import { convertCashToGrams, calculateNetSilver, formatGrams, formatCurrency } from '../utils/calculations';

export function QuickConverterModal({
  lang,
  isOpen,
  onClose,
  rates
}) {
  const t = translations[lang] || translations.ta;

  // Touch % Presets that jewellers commonly use
  const touchPresets = ['70', '75', '78', '80', '84', '90', '92.5', '100'];

  // Section 1: Cash to Grams Converter
  const [calcCash, setCalcCash] = useState('25000');
  const [calcRate, setCalcRate] = useState(String(rates?.ratePerGram || 95));
  const [calcTouch, setCalcTouch] = useState('80');
  const [useTouchAdjust, setUseTouchAdjust] = useState(true);

  // Section 2: Gross Weight to Pure Weight
  const [grossInput, setGrossInput] = useState('150');
  const [touchInput, setTouchInput] = useState('80');

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const resultGrams = convertCashToGrams(
    Number(calcCash) || 0,
    Number(calcRate) || 95,
    Number(calcTouch) || 100,
    useTouchAdjust
  );

  const resultPureGrams = calculateNetSilver(
    Number(grossInput) || 0,
    Number(touchInput) || 100,
    0
  );

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', background: '#ffffff', color: '#000000' }}>
        
        {/* Header (Vibrant Orange Jeweller Theme) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          background: 'linear-gradient(135deg, #090f24 0%, #1e293b 100%)',
          color: '#ffffff',
          borderRadius: '14px 14px 0 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: '#f97316',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calculator size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '900', margin: 0, color: '#ffffff' }}>
                {lang === 'ta' ? 'சில்வர் விரைவு கால்குலேட்டர்' : 'Silver Quick Math Converter'}
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#fcd34d', fontWeight: '700' }}>
                {lang === 'ta' ? 'ரொக்கம் ➔ கிராம் & டச் % நய எடை' : 'Cash to Grams & Custom Touch %'}
              </span>
            </div>
          </div>

          <button 
            onClick={onClose} 
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* =========================================================================
              SECTION 1: CASH TO GRAMS CONVERTER
              ========================================================================= */}
          <div style={{
            background: '#fffdf5',
            border: '1.5px solid #fde68a',
            borderRadius: '14px',
            padding: '1rem',
            boxShadow: '0 2px 10px rgba(245, 158, 11, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
              <Banknote size={18} color="#ea580c" />
              <span style={{ fontSize: '0.88rem', fontWeight: '900', color: '#9a3412', textTransform: 'uppercase' }}>
                1. {lang === 'ta' ? 'ரொக்கப் பணம் ➔ சில்வர் கிராம் மாற்றி' : 'Cash to Silver Grams'}
              </span>
            </div>

            {/* Inputs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.65rem' }}>
              <div>
                <label className="input-label" style={{ fontSize: '0.78rem' }}>
                  {lang === 'ta' ? 'செலுத்திய ரொக்கம் (₹)' : 'Cash (₹)'}
                </label>
                <input
                  type="number"
                  value={calcCash}
                  onChange={(e) => setCalcCash(e.target.value)}
                  className="input-field"
                  placeholder="25000"
                  style={{ fontSize: '1.1rem', fontWeight: '900', color: '#ea580c' }}
                />
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.78rem' }}>
                  {lang === 'ta' ? 'வெள்ளி விலை (₹/g)' : 'Rate (₹/g)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={calcRate}
                  onChange={(e) => setCalcRate(e.target.value)}
                  className="input-field"
                  placeholder="95"
                  style={{ fontSize: '1.1rem', fontWeight: '900' }}
                />
              </div>
            </div>

            {/* Dynamic Touch % Selector */}
            <div style={{ marginTop: '0.75rem', background: '#ffffff', border: '1px solid #fed7aa', borderRadius: '10px', padding: '0.65rem 0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={useTouchAdjust}
                    onChange={(e) => setUseTouchAdjust(e.target.checked)}
                    style={{ accentColor: '#ea580c' }}
                  />
                  <span>{lang === 'ta' ? 'டச் % கணக்கீடு:' : 'Apply Touch %:'}</span>
                </label>

                {useTouchAdjust && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <input
                      type="number"
                      step="0.1"
                      value={calcTouch}
                      onChange={(e) => setCalcTouch(e.target.value)}
                      style={{
                        width: '56px',
                        background: '#fff7ed',
                        border: '1.5px solid #f97316',
                        borderRadius: '6px',
                        padding: '0.15rem 0.3rem',
                        fontSize: '0.9rem',
                        fontWeight: '900',
                        textAlign: 'center',
                        color: '#ea580c'
                      }}
                    />
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b' }}>%</span>
                  </div>
                )}
              </div>

              {/* Quick Touch Pills: 70%, 75%, 78%, 80%, 84%, 90%, 92.5%, 100% */}
              {useTouchAdjust && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.2rem' }}>
                  {touchPresets.map((tVal) => (
                    <button
                      key={tVal}
                      type="button"
                      onClick={() => setCalcTouch(tVal)}
                      style={{
                        background: calcTouch === tVal ? '#ea580c' : '#f8fafc',
                        color: calcTouch === tVal ? '#ffffff' : '#1e293b',
                        border: calcTouch === tVal ? '1px solid #ea580c' : '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '0.2rem 0.45rem',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      {tVal}%
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Live Result Box */}
            <div style={{
              marginTop: '0.85rem',
              padding: '0.85rem',
              background: '#ffffff',
              border: '2px solid #ea580c',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#9a3412', fontWeight: '800' }}>
                  {useTouchAdjust 
                    ? `(₹${Number(calcCash || 0).toLocaleString()} ÷ ₹${calcRate}/g) × ${calcTouch}% =` 
                    : `₹${Number(calcCash || 0).toLocaleString()} ÷ ₹${calcRate}/g =`}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#dc2626', lineHeight: 1.1, marginTop: '0.2rem' }}>
                  -{formatGrams(resultGrams)} <span style={{ fontSize: '1rem' }}>g கழிவு</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(`${formatGrams(resultGrams)} g`)}
                style={{
                  background: copied ? '#059669' : '#090f24',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.4rem 0.65rem',
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* =========================================================================
              SECTION 2: GROSS WEIGHT × TOUCH % = PURE WEIGHT
              ========================================================================= */}
          <div style={{
            background: '#f0fdf4',
            border: '1.5px solid #bbf7d0',
            borderRadius: '14px',
            padding: '1rem',
            boxShadow: '0 2px 10px rgba(5, 150, 105, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
              <Scale size={18} color="#059669" />
              <span style={{ fontSize: '0.88rem', fontWeight: '900', color: '#166534', textTransform: 'uppercase' }}>
                2. {lang === 'ta' ? 'மொத்த எடை × டச் % = நய எடை (Pure Wt)' : 'Gross Weight to Net Pure Weight'}
              </span>
            </div>

            {/* Inputs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.65rem' }}>
              <div>
                <label className="input-label" style={{ fontSize: '0.78rem' }}>
                  {lang === 'ta' ? 'மொத்த எடை (Gross Weight g)' : 'Gross Wt (g)'}
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={grossInput}
                  onChange={(e) => setGrossInput(e.target.value)}
                  className="input-field"
                  placeholder="150"
                  style={{ fontSize: '1.1rem', fontWeight: '900' }}
                />
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.78rem' }}>
                  {lang === 'ta' ? 'டச் / மாற்று % (Touch %)' : 'Touch %'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={touchInput}
                  onChange={(e) => setTouchInput(e.target.value)}
                  className="input-field"
                  placeholder="80"
                  style={{ fontSize: '1.1rem', fontWeight: '900', color: '#059669' }}
                />
              </div>
            </div>

            {/* Quick Touch Pills for Pure Weight */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.65rem' }}>
              {touchPresets.map((tVal) => (
                <button
                  key={tVal}
                  type="button"
                  onClick={() => setTouchInput(tVal)}
                  style={{
                    background: touchInput === tVal ? '#059669' : '#ffffff',
                    color: touchInput === tVal ? '#ffffff' : '#1e293b',
                    border: touchInput === tVal ? '1px solid #059669' : '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '0.2rem 0.45rem',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {tVal}%
                </button>
              ))}
            </div>

            {/* Live Pure Result Box */}
            <div style={{
              marginTop: '0.85rem',
              padding: '0.85rem',
              background: '#ffffff',
              border: '2px solid #059669',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: '800' }}>
                  {grossInput || 0} g × {touchInput}% Touch =
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#059669', lineHeight: 1.1, marginTop: '0.2rem' }}>
                  {formatGrams(resultPureGrams)} <span style={{ fontSize: '1rem' }}>g நய எடை (Pure)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(`${formatGrams(resultPureGrams)} g`)}
                style={{
                  background: copied ? '#059669' : '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.4rem 0.65rem',
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
