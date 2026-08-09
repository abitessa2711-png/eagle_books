import React, { useState } from 'react';
import { 
  Calculator, 
  Banknote, 
  Scale, 
  Sparkles, 
  ArrowRightLeft, 
  RefreshCw, 
  Copy, 
  Check,
  TrendingUp,
  Percent
} from 'lucide-react';
import { translations } from '../utils/translations';
import { convertCashToGrams, calculateNetSilver, formatGrams, formatCurrency } from '../utils/calculations';

export function MobileQuickCalculator({ lang, rates }) {
  const t = translations[lang];
  const [calcTab, setCalcTab] = useState('CASH_TO_GRAMS'); // 'CASH_TO_GRAMS' | 'GRAMS_TO_CASH' | 'PURITY'

  const [silverRate, setSilverRate] = useState(String(rates.ratePerGram || 95));

  // Calculator 1: Cash to Grams
  const [cashInput, setCashInput] = useState('25000');
  const [useTouchAdjust, setUseTouchAdjust] = useState(true);
  const [cashTouch, setCashTouch] = useState('78');

  // Calculator 2: Grams to Cash
  const [gramsInput, setGramsInput] = useState('263.790');

  // Calculator 3: Purity
  const [grossInput, setGrossInput] = useState('663.620');
  const [touchInput, setTouchInput] = useState('78');

  const [copied, setCopied] = useState(false);

  const numRate = Number(silverRate) || 95;

  // Results
  const cashConvertedGrams = convertCashToGrams(
    Number(cashInput) || 0,
    numRate,
    Number(cashTouch) || 100,
    useTouchAdjust
  );

  const gramsToCashRupees = (Number(gramsInput) || 0) * numRate;

  const calculatedPureWeight = calculateNetSilver(
    Number(grossInput) || 0,
    Number(touchInput) || 100,
    0
  );

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cashPresets = [5000, 10000, 15000, 16000, 20000, 25000, 50000];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: '90px' }}>
      
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #090f24 0%, #1e293b 100%)',
        color: '#ffffff',
        padding: '1.15rem 1rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
              <Calculator size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '900', margin: 0 }}>
                {lang === 'ta' ? 'சில்வர் கால்குலேட்டர்' : 'Jeweller Silver Calculator'}
              </h2>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>
                {lang === 'ta' ? 'ரொக்கம் ➔ கிராம் & மாற்று கணக்கீடுகள்' : 'Cash to Grams & Purity arithmetic'}
              </p>
            </div>
          </div>

          {/* Silver Rate Box */}
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: '#fcd34d', fontWeight: '800' }}>
              {t.todayRate}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.1rem' }}>
              <input
                type="number"
                step="0.1"
                value={silverRate}
                onChange={(e) => setSilverRate(e.target.value)}
                style={{
                  width: '68px',
                  background: '#ffffff',
                  color: '#000000',
                  border: '1.5px solid #f59e0b',
                  borderRadius: '6px',
                  padding: '0.2rem 0.35rem',
                  fontSize: '0.92rem',
                  fontWeight: '900',
                  textAlign: 'center'
                }}
              />
              <span style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: '700' }}>₹/g</span>
            </div>
          </div>
        </div>

        {/* 3 Calculator Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0.35rem',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '0.25rem',
          borderRadius: '10px',
          marginTop: '1rem'
        }}>
          <button
            onClick={() => setCalcTab('CASH_TO_GRAMS')}
            style={{
              background: calcTab === 'CASH_TO_GRAMS' ? '#f97316' : 'transparent',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 0.2rem',
              fontSize: '0.75rem',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            💵 {lang === 'ta' ? 'ரொக்கம் ➔ கிராம்' : 'Cash ➔ Grams'}
          </button>

          <button
            onClick={() => setCalcTab('GRAMS_TO_CASH')}
            style={{
              background: calcTab === 'GRAMS_TO_CASH' ? '#f97316' : 'transparent',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 0.2rem',
              fontSize: '0.75rem',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            ⚖️ {lang === 'ta' ? 'கிராம் ➔ பணம்' : 'Grams ➔ ₹'}
          </button>

          <button
            onClick={() => setCalcTab('PURITY')}
            style={{
              background: calcTab === 'PURITY' ? '#f97316' : 'transparent',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 0.2rem',
              fontSize: '0.75rem',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            🌟 {lang === 'ta' ? 'டச் % நய எடை' : 'Purity %'}
          </button>
        </div>
      </div>

      {/* =========================================================================
          CALCULATOR 1: CASH TO SILVER GRAMS CONVERTER
          ========================================================================= */}
      {calcTab === 'CASH_TO_GRAMS' && (
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          {/* Quick Cash Presets */}
          <div>
            <label className="input-label" style={{ fontSize: '0.78rem' }}>
              {lang === 'ta' ? 'விரைவு ரொக்கத் தொகை (Quick Presets):' : 'Quick Amount Presets:'}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {cashPresets.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setCashInput(String(amt))}
                  style={{
                    background: cashInput === String(amt) ? '#ea580c' : '#ffffff',
                    color: cashInput === String(amt) ? '#ffffff' : '#0f172a',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Cash Amount Input */}
          <div>
            <label className="input-label">{t.cashAmount} *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                value={cashInput}
                onChange={(e) => setCashInput(e.target.value)}
                placeholder="25000"
                className="input-field"
                style={{ fontSize: '1.35rem', fontWeight: '900', color: '#ea580c', paddingLeft: '1rem' }}
                autoFocus
              />
              <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', fontWeight: '900', color: '#ea580c' }}>
                ₹
              </span>
            </div>
          </div>

          {/* Touch Mode Checkbox */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>
              <input
                type="checkbox"
                checked={useTouchAdjust}
                onChange={(e) => setUseTouchAdjust(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#ea580c' }}
              />
              <span>{lang === 'ta' ? 'நோட்புக் மாற்று முறை (78% Touch)' : 'Touch-Adjusted (78% Touch)'}</span>
            </label>

            {useTouchAdjust && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <input
                  type="number"
                  value={cashTouch}
                  onChange={(e) => setCashTouch(e.target.value)}
                  style={{
                    width: '54px',
                    background: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '0.2rem 0.35rem',
                    fontSize: '0.88rem',
                    fontWeight: '900',
                    textAlign: 'center'
                  }}
                />
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#64748b' }}>%</span>
              </div>
            )}
          </div>

          {/* Big Result Card */}
          <div style={{
            background: '#fffdf5',
            border: '2px solid #fcd34d',
            borderRadius: '16px',
            padding: '1.25rem',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.15)'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              ⚡ {lang === 'ta' ? 'வாடிக்கையாளருக்கு கழிக்கப்படும் வெள்ளி' : 'Silver Grams to Deduct from Balance'}
            </div>

            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#b91c1c', margin: '0.35rem 0' }}>
              -{formatGrams(cashConvertedGrams)} <span style={{ fontSize: '1.25rem' }}>g</span>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#0a2569', fontWeight: '800', borderTop: '1px dashed #fde68a', paddingTop: '0.55rem' }}>
              {useTouchAdjust ? (
                <span>({formatCurrency(cashInput || 0)} ÷ ₹{numRate}/g) × {cashTouch}% = -{formatGrams(cashConvertedGrams)} g</span>
              ) : (
                <span>{formatCurrency(cashInput || 0)} ÷ ₹{numRate}/g = -{formatGrams(cashConvertedGrams)} g</span>
              )}
            </div>

            <button
              onClick={() => handleCopy(`${formatGrams(cashConvertedGrams)} g`)}
              className="btn-mobile"
              style={{
                background: copied ? '#059669' : '#090f24',
                color: '#ffffff',
                padding: '0.45rem 1rem',
                fontSize: '0.78rem',
                marginTop: '0.75rem',
                width: '100%'
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? (lang === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (lang === 'ta' ? 'எடையை நகலெடு (Copy Grams)' : 'Copy Grams')}</span>
            </button>
          </div>

        </div>
      )}

      {/* =========================================================================
          CALCULATOR 2: GRAMS TO CASH RUPEES
          ========================================================================= */}
      {calcTab === 'GRAMS_TO_CASH' && (
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          <div>
            <label className="input-label">{t.grossWeight} *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                step="0.001"
                value={gramsInput}
                onChange={(e) => setGramsInput(e.target.value)}
                placeholder="263.790"
                className="input-field"
                style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0284c7', paddingLeft: '1rem' }}
                autoFocus
              />
              <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', fontWeight: '900', color: '#64748b' }}>
                g
              </span>
            </div>
          </div>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #7dd3fc',
            borderRadius: '16px',
            padding: '1.25rem',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(2, 132, 199, 0.15)'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#0369a1', textTransform: 'uppercase' }}>
              💰 {lang === 'ta' ? 'மதிப்பிடப்பட்ட வெள்ளி ரொக்க மதிப்பு' : 'Estimated Silver Cash Value'}
            </div>

            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0284c7', margin: '0.35rem 0' }}>
              {formatCurrency(gramsToCashRupees)}
            </div>

            <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: '800', borderTop: '1px dashed #bae6fd', paddingTop: '0.55rem' }}>
              {gramsInput} g × ₹{numRate}/g = {formatCurrency(gramsToCashRupees)}
            </div>

            <button
              onClick={() => handleCopy(formatCurrency(gramsToCashRupees))}
              className="btn-mobile"
              style={{
                background: copied ? '#059669' : '#0284c7',
                color: '#ffffff',
                padding: '0.45rem 1rem',
                fontSize: '0.78rem',
                marginTop: '0.75rem',
                width: '100%'
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : (lang === 'ta' ? 'தொகையை நகலெடு (Copy ₹)' : 'Copy Value')}</span>
            </button>
          </div>

        </div>
      )}

      {/* =========================================================================
          CALCULATOR 3: PURITY / TOUCH CALCULATOR
          ========================================================================= */}
      {calcTab === 'PURITY' && (
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="input-label">{t.grossWeight} *</label>
              <input
                type="number"
                step="0.001"
                value={grossInput}
                onChange={(e) => setGrossInput(e.target.value)}
                placeholder="663.620"
                className="input-field"
                style={{ fontSize: '1.15rem', fontWeight: '900' }}
                autoFocus
              />
            </div>

            <div>
              <label className="input-label">{t.touchPercent}</label>
              <input
                type="number"
                step="0.1"
                value={touchInput}
                onChange={(e) => setTouchInput(e.target.value)}
                placeholder="78"
                className="input-field"
                style={{ fontSize: '1.15rem', fontWeight: '900' }}
              />
            </div>
          </div>

          <div style={{
            background: '#ecfdf5',
            border: '2px solid #6ee7b7',
            borderRadius: '16px',
            padding: '1.25rem',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(5, 150, 105, 0.15)'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#047857', textTransform: 'uppercase' }}>
              ✨ {lang === 'ta' ? 'நய எடை (Pure Silver Weight)' : 'Net Pure Weight'}
            </div>

            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#059669', margin: '0.35rem 0' }}>
              {formatGrams(calculatedPureWeight)} <span style={{ fontSize: '1.25rem' }}>g</span>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#064e3b', fontWeight: '800', borderTop: '1px dashed #a7f3d0', paddingTop: '0.55rem' }}>
              {grossInput} g × {touchInput}% = {formatGrams(calculatedPureWeight)} g (P நய எடை)
            </div>

            <button
              onClick={() => handleCopy(`${formatGrams(calculatedPureWeight)} g`)}
              className="btn-mobile"
              style={{
                background: copied ? '#059669' : '#059669',
                color: '#ffffff',
                padding: '0.45rem 1rem',
                fontSize: '0.78rem',
                marginTop: '0.75rem',
                width: '100%'
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : (lang === 'ta' ? 'நய எடையை நகலெடு' : 'Copy Pure Weight')}</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
