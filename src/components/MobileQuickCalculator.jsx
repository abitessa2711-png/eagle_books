import React, { useState } from 'react';
import { 
  Calculator, 
  Banknote, 
  Scale, 
  Sparkles, 
  Copy, 
  Check, 
  TrendingUp, 
  Delete, 
  RefreshCw,
  Percent,
  Plus,
  Minus
} from 'lucide-react';
import { translations } from '../utils/translations';
import { convertCashToGrams, calculateNetSilver, formatGrams, formatCurrency } from '../utils/calculations';

export function MobileQuickCalculator({ lang, rates }) {
  const t = translations[lang] || translations.ta;
  const [calcMode, setCalcMode] = useState('CASH_TO_GRAMS'); // 'CASH_TO_GRAMS' | 'GRAMS_TO_CASH' | 'PURITY'

  const [currentRate, setCurrentRate] = useState(Number(rates?.ratePerGram) || 95);
  
  // Active Input Value
  const [cashAmount, setCashAmount] = useState('25000');
  const [silverGrams, setSilverGrams] = useState('263.790');
  const [touchPercent, setTouchPercent] = useState('80');
  const [isTouchFormula, setIsTouchFormula] = useState(true);

  const [copied, setCopied] = useState(false);

  // Quick Presets
  const cashPresets = [5000, 10000, 15000, 16000, 20000, 25000, 50000];
  const touchPresets = [
    { label: '70%', val: '70' },
    { label: '75%', val: '75' },
    { label: '78% கொலுசு', val: '78' },
    { label: '80%', val: '80' },
    { label: '84% உருப்படி', val: '84' },
    { label: '90%', val: '90' },
    { label: '92.5%', val: '92.5' },
    { label: '100%', val: '100' }
  ];

  // Calculation Results
  const calculatedGramsOff = convertCashToGrams(
    Number(cashAmount) || 0,
    currentRate,
    Number(touchPercent) || 100,
    isTouchFormula
  );

  const calculatedRupees = (Number(silverGrams) || 0) * currentRate;

  const calculatedPureGrams = calculateNetSilver(
    Number(silverGrams) || 0,
    Number(touchPercent) || 100,
    0
  );

  // Keypad Handlers
  const handleKeypadPress = (val) => {
    if (calcMode === 'CASH_TO_GRAMS') {
      if (val === 'C') setCashAmount('0');
      else if (val === 'DEL') setCashAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
      else setCashAmount(prev => prev === '0' ? val : prev + val);
    } else {
      if (val === 'C') setSilverGrams('0');
      else if (val === 'DEL') setSilverGrams(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
      else setSilverGrams(prev => prev === '0' ? val : prev + val);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#f8fafc' }}>
      
      {/* 1. TOP MODE SWITCHER TABS (Vibrant Header) */}
      <div style={{
        background: 'linear-gradient(135deg, #090f24 0%, #1e293b 100%)',
        color: '#ffffff',
        padding: '0.85rem 1rem 0.65rem 1rem',
        borderBottom: '2px solid #f97316'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Calculator size={18} color="#f97316" />
            <span style={{ fontSize: '0.95rem', fontWeight: '900', color: '#ffffff' }}>
              {lang === 'ta' ? 'சில்வர் கால்குலேட்டர்' : 'Silver Calculator'}
            </span>
          </div>

          {/* Rate Adjuster */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#ffffff', padding: '0.2rem 0.45rem', borderRadius: '8px', border: '1px solid #fcd34d' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#78350f' }}>ரேட்:</span>
            <button 
              onClick={() => setCurrentRate(prev => Math.max(1, prev - 1))} 
              style={{ background: '#f1f5f9', border: 'none', borderRadius: '4px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: '900' }}
            >-</button>
            <span style={{ fontSize: '0.88rem', fontWeight: '900', color: '#000000' }}>₹{currentRate}</span>
            <button 
              onClick={() => setCurrentRate(prev => prev + 1)} 
              style={{ background: '#f1f5f9', border: 'none', borderRadius: '4px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: '900' }}
            >+</button>
          </div>
        </div>

        {/* 3 Mode Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.35rem', background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '10px' }}>
          <button
            onClick={() => setCalcMode('CASH_TO_GRAMS')}
            style={{
              background: calcMode === 'CASH_TO_GRAMS' ? '#f97316' : 'transparent',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 0.2rem',
              fontSize: '0.72rem',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            💵 {lang === 'ta' ? 'ரொக்கம் ➔ கிராம்' : 'Cash ➔ Grams'}
          </button>

          <button
            onClick={() => setCalcMode('GRAMS_TO_CASH')}
            style={{
              background: calcMode === 'GRAMS_TO_CASH' ? '#f97316' : 'transparent',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 0.2rem',
              fontSize: '0.72rem',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            ⚖️ {lang === 'ta' ? 'கிராம் ➔ பணம்' : 'Grams ➔ ₹'}
          </button>

          <button
            onClick={() => setCalcMode('PURITY')}
            style={{
              background: calcMode === 'PURITY' ? '#f97316' : 'transparent',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 0.2rem',
              fontSize: '0.72rem',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            🌟 {lang === 'ta' ? 'டச் % நய எடை' : 'Touch % Pure'}
          </button>
        </div>
      </div>

      {/* 2. MAIN CALCULATION DISPLAY & CARD */}
      <div style={{ flex: 1, padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        
        {/* HERO RESULT DISPLAY CARD */}
        <div style={{
          background: '#ffffff',
          border: '2px solid #ea580c',
          borderRadius: '16px',
          padding: '1rem',
          boxShadow: '0 4px 18px rgba(234, 88, 12, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {calcMode === 'CASH_TO_GRAMS' 
              ? (lang === 'ta' ? 'கழிக்கப்படும் வெள்ளி எடை (Deducted Silver)' : 'Silver Grams to Deduct')
              : calcMode === 'GRAMS_TO_CASH'
              ? (lang === 'ta' ? 'மதிப்பிடப்பட்ட ரொக்க தொகை (Cash Value)' : 'Estimated Cash Value')
              : (lang === 'ta' ? 'நய எடை (Pure Silver Weight)' : 'Net Pure Weight')}
          </span>

          {/* Large Result Number */}
          <div style={{
            fontSize: '2.4rem',
            fontWeight: '900',
            color: calcMode === 'CASH_TO_GRAMS' ? '#dc2626' : calcMode === 'GRAMS_TO_CASH' ? '#0284c7' : '#059669',
            margin: '0.2rem 0',
            lineHeight: 1.1
          }}>
            {calcMode === 'CASH_TO_GRAMS' && `-${formatGrams(calculatedGramsOff)} g`}
            {calcMode === 'GRAMS_TO_CASH' && `${formatCurrency(calculatedRupees)}`}
            {calcMode === 'PURITY' && `${formatGrams(calculatedPureGrams)} g`}
          </div>

          {/* Step Formula Breakdown */}
          <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#090f24', borderTop: '1px dashed #e2e8f0', paddingTop: '0.45rem', width: '100%' }}>
            {calcMode === 'CASH_TO_GRAMS' && (
              isTouchFormula 
                ? `(₹${Number(cashAmount).toLocaleString()} ÷ ₹${currentRate}/g) × ${touchPercent}% = -${formatGrams(calculatedGramsOff)} g`
                : `₹${Number(cashAmount).toLocaleString()} ÷ ₹${currentRate}/g = -${formatGrams(calculatedGramsOff)} g`
            )}
            {calcMode === 'GRAMS_TO_CASH' && (
              `${silverGrams} g × ₹${currentRate}/g = ${formatCurrency(calculatedRupees)}`
            )}
            {calcMode === 'PURITY' && (
              `${silverGrams} g × ${touchPercent}% Touch = ${formatGrams(calculatedPureGrams)} g Pure`
            )}
          </div>

          {/* Quick Copy Result Pill */}
          <button
            onClick={() => handleCopy(
              calcMode === 'CASH_TO_GRAMS' ? `${formatGrams(calculatedGramsOff)} g` :
              calcMode === 'GRAMS_TO_CASH' ? formatCurrency(calculatedRupees) :
              `${formatGrams(calculatedPureGrams)} g`
            )}
            style={{
              marginTop: '0.5rem',
              background: copied ? '#059669' : '#090f24',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.75rem',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer'
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'நகலெடுக்கப்பட்டது!' : 'விடையை நகலெடு (Copy)'}</span>
          </button>
        </div>

        {/* INPUT BOX & TOUCH % PRESETS */}
        <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '14px', padding: '0.75rem 0.9rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#1e293b' }}>
              {calcMode === 'CASH_TO_GRAMS' ? 'செலுத்திய ரொக்கம் (₹ Amount):' : 'வெள்ளி எடை (Silver Grams):'}
            </label>

            {/* Editable Touch % input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>டச் %:</span>
              <input
                type="number"
                step="0.1"
                value={touchPercent}
                onChange={(e) => setTouchPercent(e.target.value)}
                style={{
                  width: '54px',
                  background: '#fff7ed',
                  border: '1.5px solid #f97316',
                  borderRadius: '6px',
                  padding: '0.15rem 0.3rem',
                  fontSize: '0.85rem',
                  fontWeight: '900',
                  textAlign: 'center',
                  color: '#ea580c'
                }}
              />
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>%</span>
            </div>
          </div>

          {/* Active Input Value Display */}
          <div style={{
            background: '#f8fafc',
            border: '2px solid #94a3b8',
            borderRadius: '10px',
            padding: '0.6rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '1.45rem',
            fontWeight: '900',
            color: '#000000'
          }}>
            <span>{calcMode === 'CASH_TO_GRAMS' ? `₹ ${Number(cashAmount).toLocaleString()}` : `${silverGrams} g`}</span>
            <button 
              onClick={() => handleKeypadPress('DEL')}
              style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Delete size={20} />
            </button>
          </div>

          {/* Quick Cash Presets (for Cash to Grams) or Quick Touch Presets (70, 75, 78, 80, 84, 90, 92.5, 100) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.55rem' }}>
            {calcMode === 'CASH_TO_GRAMS' ? (
              cashPresets.map(amt => (
                <button
                  key={amt}
                  onClick={() => setCashAmount(String(amt))}
                  style={{
                    background: cashAmount === String(amt) ? '#f97316' : '#ffffff',
                    color: cashAmount === String(amt) ? '#ffffff' : '#0f172a',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '0.22rem 0.5rem',
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))
            ) : (
              touchPresets.map(t => (
                <button
                  key={t.val}
                  onClick={() => setTouchPercent(t.val)}
                  style={{
                    background: touchPercent === t.val ? '#059669' : '#ffffff',
                    color: touchPercent === t.val ? '#ffffff' : '#0f172a',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '0.22rem 0.45rem',
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {t.label}
                </button>
              ))
            )}
          </div>

          {/* Extra Row of Touch % Pills in Cash to Grams mode as well! */}
          {calcMode === 'CASH_TO_GRAMS' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.45rem', borderTop: '1px dashed #e2e8f0', paddingTop: '0.45rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', alignSelf: 'center' }}>டச் %:</span>
              {touchPresets.map(t => (
                <button
                  key={t.val}
                  onClick={() => setTouchPercent(t.val)}
                  style={{
                    background: touchPercent === t.val ? '#ea580c' : '#f8fafc',
                    color: touchPercent === t.val ? '#ffffff' : '#1e293b',
                    border: touchPercent === t.val ? '1px solid #ea580c' : '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '0.15rem 0.4rem',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {t.val}%
                </button>
              ))}
            </div>
          )}

        </div>

        {/* 3. MOBILE-FRIENDLY NUMPAD */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.45rem',
          marginTop: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'C'].map(key => (
            <button
              key={key}
              onClick={() => handleKeypadPress(key)}
              style={{
                background: key === 'C' ? '#fef2f2' : '#ffffff',
                color: key === 'C' ? '#dc2626' : '#000000',
                border: key === 'C' ? '1.5px solid #fca5a5' : '1.5px solid #cbd5e1',
                borderRadius: '12px',
                padding: '0.75rem',
                fontSize: '1.25rem',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.1s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {key}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
}
