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
  Minus,
  ArrowRight,
  Zap
} from 'lucide-react';
import { translations } from '../utils/translations';
import { convertCashToGrams, calculateNetSilver, formatGrams, formatCurrency } from '../utils/calculations';

export function MobileQuickCalculator({ lang, rates }) {
  const t = translations[lang] || translations.ta;
  const [calcMode, setCalcMode] = useState('PURITY'); // 'PURITY' | 'GRAMS_TO_CASH' | 'CASH_TO_GRAMS'

  const [currentRate, setCurrentRate] = useState(Number(rates?.ratePerGram) || 95);
  
  // Active Input Values
  const [silverGrams, setSilverGrams] = useState('100');
  const [touchPercent, setTouchPercent] = useState('80');
  const [cashAmount, setCashAmount] = useState('10000');
  const [isTouchFormula, setIsTouchFormula] = useState(true);

  const [copied, setCopied] = useState(false);

  // Quick Presets
  const cashPresets = [5000, 10000, 15000, 20000, 25000, 50000];
  const gramPresets = [10, 50, 100, 200, 250, 500, 1000];
  const touchPresets = [
    { label: '70%', val: '70' },
    { label: '75%', val: '75' },
    { label: '78% கொலுசு', val: '78' },
    { label: '80%', val: '80' },
    { label: '84% உருப்படி', val: '84' },
    { label: '90%', val: '90' },
    { label: '92.5% ஸ்டெர்லிங்', val: '92.5' },
    { label: '100% நயம்', val: '100' }
  ];

  // 1. Purity Calculation: Gross Wt x Touch % = Pure Wt
  const calculatedPureGrams = calculateNetSilver(
    Number(silverGrams) || 0,
    Number(touchPercent) || 100,
    0
  );
  const pureRupeeValue = calculatedPureGrams * currentRate;

  // 2. Grams to Rupees: Grams x Rate = Rupees
  const calculatedRupees = (Number(silverGrams) || 0) * currentRate;

  // 3. Cash to Grams: Cash ÷ Effective Touch Rate = Deducted Grams
  const calculatedGramsOff = convertCashToGrams(
    Number(cashAmount) || 0,
    currentRate,
    Number(touchPercent) || 100,
    isTouchFormula
  );

  // Switch Mode Handler with Seamless Auto-Passing
  const handleSwitchMode = (newMode) => {
    if (newMode === 'GRAMS_TO_CASH') {
      if (calcMode === 'PURITY') {
        // Auto-pass the calculated pure grams to Grams to Rupees!
        setSilverGrams(formatGrams(calculatedPureGrams));
      } else if (calcMode === 'CASH_TO_GRAMS') {
        // Auto-pass the calculated grams from cash to Grams to Rupees!
        setSilverGrams(formatGrams(calculatedGramsOff));
      }
    } else if (newMode === 'PURITY' && calcMode === 'CASH_TO_GRAMS') {
      setSilverGrams(formatGrams(calculatedGramsOff));
    }
    setCalcMode(newMode);
  };

  // Direct action button: Transfer Pure result to Grams to Rupees
  const handleTransferPureToCash = () => {
    setSilverGrams(formatGrams(calculatedPureGrams));
    setCalcMode('GRAMS_TO_CASH');
  };

  // Direct action button: Transfer Cash to Grams result to Grams to Rupees
  const handleTransferCashGramsToCash = () => {
    setSilverGrams(formatGrams(calculatedGramsOff));
    setCalcMode('GRAMS_TO_CASH');
  };

  // Keypad Handlers
  const handleKeypadPress = (val) => {
    if (calcMode === 'CASH_TO_GRAMS') {
      if (val === 'C') setCashAmount('0');
      else if (val === 'DEL') setCashAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
      else setCashAmount(prev => prev === '0' && val !== '.' ? val : prev + val);
    } else {
      if (val === 'C') setSilverGrams('0');
      else if (val === 'DEL') setSilverGrams(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
      else setSilverGrams(prev => prev === '0' && val !== '.' ? val : prev + val);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#f8fafc', overflow: 'hidden' }}>
      
      {/* 1. TOP HEADER & DIRECT RATE TYPING INPUT */}
      <div style={{
        background: 'linear-gradient(135deg, #090f24 0%, #1e293b 100%)',
        color: '#ffffff',
        padding: '0.45rem 0.75rem 0.45rem 0.75rem',
        borderBottom: '2px solid #f97316',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calculator size={16} color="#f97316" />
            <span style={{ fontSize: '0.85rem', fontWeight: '900', color: '#ffffff' }}>
              {lang === 'ta' ? 'சில்வர் கால்குலேட்டர்' : 'Silver Calculator'}
            </span>
          </div>

          {/* Direct Typeable Silver Rate Field */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: '#ffffff',
            padding: '0.15rem 0.45rem',
            borderRadius: '6px',
            border: '1.5px solid #f59e0b'
          }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#b45309' }}>
              {lang === 'ta' ? 'ரேட் ₹:' : 'Rate ₹:'}
            </span>
            <input
              type="number"
              step="0.1"
              min="1"
              inputMode="decimal"
              value={currentRate}
              onChange={(e) => setCurrentRate(Math.max(1, Number(e.target.value) || 0))}
              style={{
                width: '55px',
                border: 'none',
                background: 'transparent',
                fontSize: '0.9rem',
                fontWeight: '900',
                color: '#000000',
                outline: 'none',
                textAlign: 'center'
              }}
              title="Type Silver Rate Directly"
            />
            <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '700' }}>/g</span>
          </div>
        </div>

        {/* 3 Mode Navigation Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.25rem', background: 'rgba(255,255,255,0.1)', padding: '0.15rem', borderRadius: '8px' }}>
          
          <button
            onClick={() => handleSwitchMode('PURITY')}
            style={{
              background: calcMode === 'PURITY' ? '#f97316' : 'transparent',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.35rem 0.15rem',
              fontSize: '0.68rem',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            🌟 {lang === 'ta' ? 'டச் % நய எடை' : 'Touch % Pure'}
          </button>

          <button
            onClick={() => handleSwitchMode('GRAMS_TO_CASH')}
            style={{
              background: calcMode === 'GRAMS_TO_CASH' ? '#f97316' : 'transparent',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.35rem 0.15rem',
              fontSize: '0.68rem',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            ⚖️ {lang === 'ta' ? 'கிராம் ➔ பணம்' : 'Grams ➔ ₹'}
          </button>

          <button
            onClick={() => handleSwitchMode('CASH_TO_GRAMS')}
            style={{
              background: calcMode === 'CASH_TO_GRAMS' ? '#f97316' : 'transparent',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.35rem 0.15rem',
              fontSize: '0.68rem',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            💵 {lang === 'ta' ? 'ரொக்கம் ➔ கிராம்' : 'Cash ➔ Grams'}
          </button>

        </div>
      </div>

      {/* 2. COMPACT FIT CALCULATOR BODY */}
      <div style={{ flex: 1, padding: '0.45rem 0.65rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', justifyContent: 'space-between' }}>
        
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #ea580c',
          borderRadius: '12px',
          padding: '0.45rem 0.65rem',
          boxShadow: '0 2px 10px rgba(234, 88, 12, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            {calcMode === 'PURITY' 
              ? (lang === 'ta' ? 'நய எடை (Pure Silver Weight)' : 'Net Pure Silver Weight')
              : calcMode === 'GRAMS_TO_CASH'
              ? (lang === 'ta' ? 'மதிப்பிடப்பட்ட ரொக்க தொகை (Rupee Value)' : 'Estimated Cash Value')
              : (lang === 'ta' ? 'கழிக்கப்படும் வெள்ளி எடை (Deducted Grams)' : 'Silver Grams Deducted')}
          </span>

          {/* Large Result Number */}
          <div style={{
            fontSize: '1.65rem',
            fontWeight: '900',
            color: calcMode === 'PURITY' ? '#059669' : calcMode === 'GRAMS_TO_CASH' ? '#0284c7' : '#dc2626',
            margin: '0.05rem 0',
            lineHeight: 1.1
          }}>
            {calcMode === 'PURITY' && `${formatGrams(calculatedPureGrams)} g`}
            {calcMode === 'GRAMS_TO_CASH' && `${formatCurrency(calculatedRupees)}`}
            {calcMode === 'CASH_TO_GRAMS' && `-${formatGrams(calculatedGramsOff)} g`}
          </div>

          {/* Step Formula & Instant Rupee Estimation */}
          <div style={{ fontSize: '0.74rem', fontWeight: '800', color: '#090f24', borderTop: '1px dashed #e2e8f0', paddingTop: '0.25rem', width: '100%', lineHeight: 1.3 }}>
            {calcMode === 'PURITY' && (
              <div>
                <div>{silverGrams} g × {touchPercent}% டச் = <strong>{formatGrams(calculatedPureGrams)} g நயம்</strong></div>
                <div style={{ color: '#0284c7', marginTop: '0.1rem', fontSize: '0.76rem' }}>
                  💰 மதிப்பு (@ ₹{currentRate}/g): <strong>{formatCurrency(pureRupeeValue)}</strong>
                </div>
              </div>
            )}
            {calcMode === 'GRAMS_TO_CASH' && (
              <div>{silverGrams} g × ₹{currentRate}/g = <strong>{formatCurrency(calculatedRupees)}</strong></div>
            )}
            {calcMode === 'CASH_TO_GRAMS' && (
              isTouchFormula 
                ? `டச் ரேட்: ₹${currentRate} × ${touchPercent}% = ₹${(currentRate * (Number(touchPercent) / 100)).toFixed(2)}/g ➔ -${formatGrams(calculatedGramsOff)} g`
                : `₹${Number(cashAmount).toLocaleString()} ÷ ₹${currentRate}/g = -${formatGrams(calculatedGramsOff)} g`
            )}
          </div>

          {/* Actions: Transfer to Grams->₹ or Copy */}
          <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.35rem' }}>
            {calcMode === 'PURITY' && (
              <button
                onClick={handleTransferPureToCash}
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.68rem',
                  fontWeight: '900',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                <Zap size={12} />
                <span>{lang === 'ta' ? `👉 பணமாக (${formatCurrency(pureRupeeValue)})` : 'To Rupees'}</span>
              </button>
            )}

            {calcMode === 'CASH_TO_GRAMS' && (
              <button
                onClick={handleTransferCashGramsToCash}
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.68rem',
                  fontWeight: '900',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                <Zap size={12} />
                <span>{lang === 'ta' ? `👉 பணமாக (${formatGrams(calculatedGramsOff)}g)` : 'To Rupees'}</span>
              </button>
            )}

            <button
              onClick={() => handleCopy(
                calcMode === 'PURITY' ? `${formatGrams(calculatedPureGrams)} g (${formatCurrency(pureRupeeValue)})` :
                calcMode === 'GRAMS_TO_CASH' ? formatCurrency(calculatedRupees) :
                `${formatGrams(calculatedGramsOff)} g`
              )}
              style={{
                background: copied ? '#059669' : '#090f24',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.25rem 0.65rem',
                fontSize: '0.68rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer'
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? 'நகலானது!' : 'நகலெடு'}</span>
            </button>
          </div>

        </div>

        {/* 3. INPUT BOX & TOUCH % PRESETS */}
        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0.45rem 0.65rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#1e293b' }}>
              {calcMode === 'CASH_TO_GRAMS' ? 'செலுத்திய ரொக்கம் (₹ Amount):' : 'மொத்த எடை (Gross Grams):'}
            </label>

            {/* Editable Touch % input (Visible in Purity & Cash to Grams) */}
            {calcMode !== 'GRAMS_TO_CASH' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b' }}>டச் %:</span>
                <input
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  value={touchPercent}
                  onChange={(e) => setTouchPercent(e.target.value)}
                  style={{
                    width: '48px',
                    background: '#fff7ed',
                    border: '1.5px solid #f97316',
                    borderRadius: '5px',
                    padding: '0.1rem 0.25rem',
                    fontSize: '0.8rem',
                    fontWeight: '900',
                    textAlign: 'center',
                    color: '#ea580c'
                  }}
                />
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b' }}>%</span>
              </div>
            )}
          </div>

          {/* Active Input Value Display */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #f97316',
            borderRadius: '8px',
            padding: '0.25rem 0.65rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.4rem'
          }}>
            <input
              type="number"
              step="any"
              inputMode="decimal"
              value={calcMode === 'CASH_TO_GRAMS' ? cashAmount : silverGrams}
              onChange={(e) => {
                const val = e.target.value;
                if (calcMode === 'CASH_TO_GRAMS') setCashAmount(val);
                else setSilverGrams(val);
              }}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                fontSize: '1.25rem',
                fontWeight: '900',
                color: '#0f172a',
                outline: 'none'
              }}
            />
            <span style={{ fontSize: '0.9rem', fontWeight: '900', color: '#ea580c', flexShrink: 0 }}>
              {calcMode === 'CASH_TO_GRAMS' ? '₹' : 'g'}
            </span>
            <button 
              type="button"
              onClick={() => handleKeypadPress('DEL')}
              style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}
            >
              <Delete size={18} />
            </button>
          </div>

          {/* Quick Presets Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.35rem' }}>
            {calcMode === 'CASH_TO_GRAMS' ? (
              cashPresets.map(amt => (
                <button
                  key={amt}
                  onClick={() => setCashAmount(String(amt))}
                  style={{
                    background: cashAmount === String(amt) ? '#f97316' : '#ffffff',
                    color: cashAmount === String(amt) ? '#ffffff' : '#0f172a',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '0.15rem 0.4rem',
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))
            ) : calcMode === 'GRAMS_TO_CASH' ? (
              gramPresets.map(g => (
                <button
                  key={g}
                  onClick={() => setSilverGrams(String(g))}
                  style={{
                    background: Number(silverGrams) === g ? '#0284c7' : '#ffffff',
                    color: Number(silverGrams) === g ? '#ffffff' : '#0f172a',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '0.15rem 0.4rem',
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {g} g
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
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '0.15rem 0.35rem',
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {t.label}
                </button>
              ))
            )}
          </div>

          {/* Extra Row of Touch % Pills in Cash to Grams mode */}
          {calcMode === 'CASH_TO_GRAMS' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.3rem', borderTop: '1px dashed #e2e8f0', paddingTop: '0.3rem' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#64748b', alignSelf: 'center' }}>டச் %:</span>
              {touchPresets.map(t => (
                <button
                  key={t.val}
                  onClick={() => setTouchPercent(t.val)}
                  style={{
                    background: touchPercent === t.val ? '#ea580c' : '#f8fafc',
                    color: touchPercent === t.val ? '#ffffff' : '#1e293b',
                    border: touchPercent === t.val ? '1px solid #ea580c' : '1px solid #cbd5e1',
                    borderRadius: '5px',
                    padding: '0.12rem 0.35rem',
                    fontSize: '0.68rem',
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

        {/* 4. MOBILE-FRIENDLY NUMPAD */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.25rem',
          paddingBottom: '0.2rem'
        }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'C'].map(key => (
            <button
              key={key}
              onClick={() => handleKeypadPress(key)}
              style={{
                background: key === 'C' ? '#fef2f2' : '#ffffff',
                color: key === 'C' ? '#dc2626' : '#000000',
                border: key === 'C' ? '1px solid #fca5a5' : '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.45rem',
                fontSize: '1.05rem',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
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
