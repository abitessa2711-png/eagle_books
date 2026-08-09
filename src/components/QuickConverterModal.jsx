import React, { useState } from 'react';
import { X, Calculator, ArrowRightLeft, Sparkles, Scale, Banknote } from 'lucide-react';
import { translations } from '../utils/translations';
import { convertCashToGrams, calculateNetSilver, formatGrams, formatCurrency } from '../utils/calculations';

export function QuickConverterModal({
  lang,
  isOpen,
  onClose,
  rates
}) {
  const t = translations[lang];

  // Quick inputs
  const [calcCash, setCalcCash] = useState('23000');
  const [calcRate, setCalcRate] = useState(String(rates.ratePerGram || 95));
  const [calcTouch, setCalcTouch] = useState('78');
  const [isTouchMode, setIsTouchMode] = useState(false);

  // Pure converter
  const [grossInput, setGrossInput] = useState('150');
  const [touchInput, setTouchInput] = useState('78');

  if (!isOpen) return null;

  const resultGrams = convertCashToGrams(
    Number(calcCash) || 0,
    Number(calcRate) || 95,
    Number(calcTouch) || 100,
    isTouchMode
  );

  const resultPureGrams = calculateNetSilver(
    Number(grossInput) || 0,
    Number(touchInput) || 100,
    0
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        
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
              background: 'rgba(56, 189, 248, 0.2)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calculator size={18} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
              {t.quickCalculator} (Silver Math Wizard)
            </h3>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Section 1: Cash to Grams Converter */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '14px',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <Banknote size={16} color="#fbbf24" />
              <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase' }}>
                1. {lang === 'ta' ? 'ரொக்கப் பணம் -> சில்வர் கிராம் மாற்றி' : 'Cash Amount to Silver Grams'}
              </span>
            </div>

            <div className="grid-3" style={{ gap: '0.6rem' }}>
              <div>
                <label className="input-label">{t.cashAmount}</label>
                <input
                  type="number"
                  value={calcCash}
                  onChange={(e) => setCalcCash(e.target.value)}
                  className="input-field"
                  placeholder="23000"
                />
              </div>

              <div>
                <label className="input-label">{t.appliedRate}</label>
                <input
                  type="number"
                  value={calcRate}
                  onChange={(e) => setCalcRate(e.target.value)}
                  className="input-field"
                  placeholder="95"
                />
              </div>

              <div>
                <label className="input-label">{lang === 'ta' ? 'டச் முறை' : 'Formula'}</label>
                <button
                  type="button"
                  onClick={() => setIsTouchMode(!isTouchMode)}
                  className="btn btn-sm"
                  style={{
                    width: '100%',
                    height: '42px',
                    background: isTouchMode ? '#f59e0b' : 'rgba(255,255,255,0.05)',
                    color: isTouchMode ? '#ffffff' : '#94a3b8',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '0.75rem'
                  }}
                >
                  {isTouchMode ? '78% RSP முறை' : 'நேரடி ÷ முறை'}
                </button>
              </div>
            </div>

            {/* Result */}
            <div style={{
              marginTop: '1rem',
              padding: '0.85rem',
              background: 'rgba(245, 158, 11, 0.15)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.82rem', color: '#fde68a' }}>
                {formatCurrency(calcCash || 0)} ÷ ₹{calcRate}/g =
              </span>
              <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fbbf24' }}>
                {formatGrams(resultGrams)} g {lang === 'ta' ? 'கழிவு' : 'Grams'}
              </span>
            </div>
          </div>

          {/* Section 2: Gross Weight × Touch % = Pure Silver */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '14px',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <Scale size={16} color="#38bdf8" />
              <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase' }}>
                2. {lang === 'ta' ? 'மொத்த எடை × மாற்று % = நய எடை (Pure Wt)' : 'Gross Weight to Pure Weight'}
              </span>
            </div>

            <div className="grid-2" style={{ gap: '0.6rem' }}>
              <div>
                <label className="input-label">{t.grossWeight}</label>
                <input
                  type="number"
                  value={grossInput}
                  onChange={(e) => setGrossInput(e.target.value)}
                  className="input-field"
                  placeholder="150"
                />
              </div>

              <div>
                <label className="input-label">{t.touchPercent}</label>
                <input
                  type="number"
                  value={touchInput}
                  onChange={(e) => setTouchInput(e.target.value)}
                  className="input-field"
                  placeholder="78"
                />
              </div>
            </div>

            {/* Result */}
            <div style={{
              marginTop: '1rem',
              padding: '0.85rem',
              background: 'rgba(56, 189, 248, 0.15)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.82rem', color: '#bae6fd' }}>
                {grossInput} g × {touchInput}% =
              </span>
              <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#38bdf8' }}>
                {formatGrams(resultPureGrams)} g {lang === 'ta' ? 'நயம் (P)' : 'Pure'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
