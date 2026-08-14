import React, { useState } from 'react';
import { 
  X, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Banknote, 
  PlusCircle, 
  Check, 
  Sparkles, 
  Calendar, 
  Calculator,
  Layers,
  Scale
} from 'lucide-react';
import { translations } from '../utils/translations';
import { convertCashToGrams, calculateNetSilver, formatGrams, formatCurrency } from '../utils/calculations';

export function TransactionModal({
  lang,
  isOpen,
  onClose,
  initialType = 'NEW_SALE',
  customerId,
  rates,
  onSaveTransaction
}) {
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState(initialType);

  // Form States
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [itemName, setItemName] = useState('கொலுசு (Anklet)');
  const [customItem, setCustomItem] = useState('');
  
  // Weights
  const [grossWeight, setGrossWeight] = useState('');
  const [touchPercent, setTouchPercent] = useState('100');
  const [wastagePercent, setWastagePercent] = useState('0');

  // Cash to Gram
  const [cashAmount, setCashAmount] = useState('');
  const [ratePerGram, setRatePerGram] = useState(String(rates.ratePerGram || 95));
  const [isTouchAdjusted, setIsTouchAdjusted] = useState(false);
  const [cashTouchPercent, setCashTouchPercent] = useState('78');

  // Direct Adjust
  const [directDirection, setDirectDirection] = useState('DEBIT'); // 'DEBIT' | 'CREDIT'
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  // Preset Jewel items matching Sivakasi Eagle Silvers Card
  const jewelPresets = [
    { key: 'வெள்ளி கொலுசு (Silver Anklet)', label: 'வெள்ளி கொலுசு', defaultTouch: 78 },
    { key: 'பாம்பே கொலுசு (Bombay Anklet)', label: 'பாம்பே கொலுசு', defaultTouch: 78 },
    { key: 'மெட்டி வகைகள் (Toe Rings)', label: 'மெட்டி வகைகள்', defaultTouch: 78 },
    { key: 'பாம்பே கொடி (Bombay Chain)', label: 'பாம்பே கொடி', defaultTouch: 80 },
    { key: 'முத்தூணாங்கொடி (Muthunaankodi)', label: 'முத்தூணாங்கொடி', defaultTouch: 80 },
    { key: 'தண்ட கொலுசு (Thanda Anklet)', label: 'தண்ட கொலுசு', defaultTouch: 78 },
    { key: 'வெள்ளி கட்டி / பார் (Bar Silver)', label: 'வெள்ளி கட்டி / பார்', defaultTouch: 100 },
    { key: 'CUSTOM', label: t.itemCustom, defaultTouch: 100 }
  ];

  const handleSelectPreset = (item) => {
    if (item.key === 'CUSTOM') {
      setItemName('');
    } else {
      setItemName(item.key);
      if (item.defaultTouch) {
        setTouchPercent(String(item.defaultTouch));
      }
    }
  };

  // Live Calculations
  const calculatedPureWeight = calculateNetSilver(
    Number(grossWeight) || 0,
    Number(touchPercent) || 100,
    Number(wastagePercent) || 0
  );

  const calculatedCashGrams = convertCashToGrams(
    Number(cashAmount) || 0,
    Number(ratePerGram) || 95,
    Number(cashTouchPercent) || 100,
    isTouchAdjusted
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalItemName = itemName === 'CUSTOM' || !itemName ? customItem || 'வெள்ளி நகை' : itemName;

    const newTx = {
      id: `tx-${Date.now()}`,
      customerId,
      date,
      type: activeTab,
      itemName: finalItemName,
      notes,
      createdAt: new Date().toISOString()
    };

    if (activeTab === 'NEW_SALE') {
      newTx.weight = Number(grossWeight) || 0;
      newTx.touchPercent = Number(touchPercent) || 100;
      newTx.wastagePercent = Number(wastagePercent) || 0;
      newTx.ratePerGram = Number(ratePerGram) || rates.ratePerGram;
      newTx.debitGrams = calculatedPureWeight;
    } else if (activeTab === 'OLD_SILVER') {
      newTx.weight = Number(grossWeight) || 0;
      newTx.touchPercent = Number(touchPercent) || 100;
      newTx.wastagePercent = Number(wastagePercent) || 0;
      newTx.creditGrams = calculatedPureWeight;
    } else if (activeTab === 'CASH_PAYMENT') {
      newTx.cashAmount = Number(cashAmount) || 0;
      newTx.ratePerGram = Number(ratePerGram) || rates.ratePerGram;
      newTx.touchPercent = Number(cashTouchPercent) || 100;
      newTx.isTouchAdjusted = isTouchAdjusted;
      newTx.convertedGrams = calculatedCashGrams;
    } else if (activeTab === 'DIRECT_ADJUST') {
      newTx.weight = Number(grossWeight) || 0;
      newTx.direction = directDirection;
    }

    onSaveTransaction(newTx);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '640px' }}
      >
        
        {/* Modal Header */}
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
              background: 'rgba(2, 132, 199, 0.2)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
                {t.addTransaction}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                {lang === 'ta' ? 'வெள்ளி, பழைய உறைவு மற்றும் ரொக்க மாற்றம்' : 'Silver sale, exchange return & cash-to-gram conversion'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '0.35rem',
          margin: '1rem 1.5rem 0.5rem 1.5rem',
          borderRadius: '12px',
          gap: '0.35rem'
        }}>
          
          <button
            type="button"
            onClick={() => setActiveTab('NEW_SALE')}
            style={{
              padding: '0.5rem 0.25rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'NEW_SALE' ? '#ef4444' : 'transparent',
              color: activeTab === 'NEW_SALE' ? '#ffffff' : '#94a3b8',
              fontWeight: '700',
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem'
            }}
          >
            <ArrowUpRight size={15} />
            <span>{lang === 'ta' ? 'புதிய நகை (+)' : 'New Silver (+)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('OLD_SILVER')}
            style={{
              padding: '0.5rem 0.25rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'OLD_SILVER' ? '#10b981' : 'transparent',
              color: activeTab === 'OLD_SILVER' ? '#ffffff' : '#94a3b8',
              fontWeight: '700',
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem'
            }}
          >
            <ArrowDownLeft size={15} />
            <span>{lang === 'ta' ? 'பழைய வரவு (-)' : 'Old Silver (-)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CASH_PAYMENT')}
            style={{
              padding: '0.5rem 0.25rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'CASH_PAYMENT' ? '#f59e0b' : 'transparent',
              color: activeTab === 'CASH_PAYMENT' ? '#ffffff' : '#94a3b8',
              fontWeight: '700',
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem'
            }}
          >
            <Banknote size={15} />
            <span>{lang === 'ta' ? 'ரொக்கம் -> கிராம்' : 'Cash to Gram'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DIRECT_ADJUST')}
            style={{
              padding: '0.5rem 0.25rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'DIRECT_ADJUST' ? '#0284c7' : 'transparent',
              color: activeTab === 'DIRECT_ADJUST' ? '#ffffff' : '#94a3b8',
              fontWeight: '700',
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem'
            }}
          >
            <Layers size={15} />
            <span>{lang === 'ta' ? 'நோட்புக் பதிவு' : 'Direct Note'}</span>
          </button>

        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1rem 1.5rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Date Picker */}
          <div>
            <label className="input-label">{t.date}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {/* =========================================================================
              TAB 1: NEW SILVER SALE (புதிய நகை விற்பனை / வழங்கல்)
              ========================================================================= */}
          {activeTab === 'NEW_SALE' && (
            <>
              {/* Jewel Presets */}
              <div>
                <label className="input-label">{t.itemName}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.6rem' }}>
                  {jewelPresets.map((preset) => (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        background: itemName === preset.key ? '#0284c7' : 'rgba(255,255,255,0.05)',
                        color: itemName === preset.key ? '#ffffff' : '#cbd5e1',
                        border: '1px solid rgba(255,255,255,0.08)',
                        cursor: 'pointer'
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {(!itemName || itemName === 'CUSTOM') && (
                  <input
                    type="text"
                    value={customItem}
                    onChange={(e) => setCustomItem(e.target.value)}
                    placeholder={lang === 'ta' ? 'எ.கா: வெள்ளி கிண்ணம் ஜோடி...' : 'e.g. Silver Bowl pair...'}
                    className="input-field"
                  />
                )}
              </div>

              {/* Weight and Touch */}
              <div className="grid-2">
                <div>
                  <label className="input-label">{t.grossWeight} *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      value={grossWeight}
                      onChange={(e) => setGrossWeight(e.target.value)}
                      placeholder="0.000"
                      className="input-field"
                      required
                      autoFocus
                    />
                    <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }}>
                      g
                    </span>
                  </div>
                </div>

                <div>
                  <label className="input-label">{t.touchPercent}</label>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="100"
                      value={touchPercent}
                      onChange={(e) => setTouchPercent(e.target.value)}
                      className="input-field"
                    />
                    <button
                      type="button"
                      onClick={() => setTouchPercent('78')}
                      className="btn btn-sm btn-outline"
                      style={{ fontSize: '0.72rem', padding: '0.3rem 0.5rem' }}
                    >
                      78% கொலுசு
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Pure Preview */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.85rem', color: '#fca5a5', fontWeight: '600' }}>
                  {lang === 'ta' ? '🔴 வாடிக்கையாளர் பற்று வைக்கப்படும் எடை:' : 'Customer Debit Weight:'}
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#f87171' }}>
                  +{formatGrams(calculatedPureWeight)} g
                </span>
              </div>
            </>
          )}

          {/* =========================================================================
              TAB 2: OLD SILVER INFLOW (பழைய வெள்ளி வரவு / கழிப்பு)
              ========================================================================= */}
          {activeTab === 'OLD_SILVER' && (
            <>
              <div>
                <label className="input-label">{t.details}</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder={lang === 'ta' ? 'எ.கா: பழைய கொலுசு வரவு, உருகிய வெள்ளி...' : 'e.g. Old anklet exchange, melted silver...'}
                  className="input-field"
                />
              </div>

              <div className="grid-2">
                <div>
                  <label className="input-label">{t.grossWeight} *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      value={grossWeight}
                      onChange={(e) => setGrossWeight(e.target.value)}
                      placeholder="0.000"
                      className="input-field"
                      required
                      autoFocus
                    />
                    <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }}>
                      g
                    </span>
                  </div>
                </div>

                <div>
                  <label className="input-label">{t.touchPercent}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="100"
                    value={touchPercent}
                    onChange={(e) => setTouchPercent(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Net Silver Credited Preview */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.85rem', color: '#6ee7b7', fontWeight: '600' }}>
                  {lang === 'ta' ? '🟢 வாடிக்கையாளருக்கு கழிக்கப்படும் பழைய எடை:' : 'Net Old Silver Credited:'}
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#34d399' }}>
                  -{formatGrams(calculatedPureWeight)} g
                </span>
              </div>
            </>
          )}

          {/* =========================================================================
              TAB 3: CASH PAYMENT -> AUTO GRAM CONVERSION (ரொக்க வரவு -> கிராம் மாற்றம்)
              ========================================================================= */}
          {activeTab === 'CASH_PAYMENT' && (
            <>
              {/* Cash Amount & Silver Rate */}
              <div className="grid-2">
                <div>
                  <label className="input-label">{t.cashAmount} *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      placeholder={lang === 'ta' ? 'எ.கா: 23000' : 'e.g. 23000'}
                      className="input-field"
                      required
                      autoFocus
                    />
                    <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#fbbf24', fontSize: '0.9rem', fontWeight: '700' }}>
                      ₹
                    </span>
                  </div>
                </div>

                <div>
                  <label className="input-label">{t.appliedRate}</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={ratePerGram}
                      onChange={(e) => setRatePerGram(e.target.value)}
                      className="input-field"
                      required
                    />
                    <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }}>
                      ₹/g
                    </span>
                  </div>
                </div>
              </div>

              {/* Touch Adjustment Toggle (Matching the notebook calculation!) */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '0.75rem 1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={isTouchAdjusted}
                      onChange={(e) => setIsTouchAdjusted(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#f59e0b' }}
                    />
                    <span>{lang === 'ta' ? 'நோட்புக் மாற்று முறை (Touch Adjusted RSP):' : 'Touch Adjusted RSP Formula:'}</span>
                  </label>

                  {isTouchAdjusted && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <input
                        type="number"
                        step="1"
                        value={cashTouchPercent}
                        onChange={(e) => setCashTouchPercent(e.target.value)}
                        style={{ width: '60px', padding: '0.2rem 0.4rem', borderRadius: '6px', border: '1px solid #f59e0b', background: '#0f172a', color: '#fbbf24', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '0.85rem', color: '#fbbf24' }}>%</span>
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                  {isTouchAdjusted 
                    ? 'சூத்திரம்: Pure Rate × Touch % = டச் ரேட் (எ.கா: ₹245 × 78% = ₹191.10/g) ➔ தொகை ÷ டச் ரேட் (₹10,000 ÷ 191.10 = 52.328g கழிவு)'
                    : 'சூத்திரம்: பணம் ÷ அன்றைய வெள்ளி விலை (எ.கா. ₹10,000 ÷ ₹95/g = 105.263 கிராம் கழிவு)'}
                </div>
              </div>

              {/* LIVE CONVERSION HERO BOX */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(19, 27, 46, 0.95) 100%)',
                border: '1.5px solid #f59e0b',
                padding: '1rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#fde68a', fontWeight: '700', textTransform: 'uppercase' }}>
                  ⚡ {lang === 'ta' ? 'தானியங்கி கிராம் கழிவு கணக்கீடு (Auto Grams Off)' : 'Grams Deducted from Customer Balance'}
                </div>

                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#fbbf24', margin: '0.25rem 0' }}>
                  -{formatGrams(calculatedCashGrams)} <span style={{ fontSize: '1.1rem' }}>g</span>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                  {formatCurrency(cashAmount || 0)} ÷ ₹{ratePerGram}/g {isTouchAdjusted ? `× ${cashTouchPercent}%` : ''} = {formatGrams(calculatedCashGrams)} கிராம் கழிவு!
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              TAB 4: DIRECT NOTEBOOK ENTRY (நேரடி பதிவு)
              ========================================================================= */}
          {activeTab === 'DIRECT_ADJUST' && (
            <>
              <div>
                <label className="input-label">{lang === 'ta' ? 'பதிவு வகை (Direction)' : 'Direction'}</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={() => setDirectDirection('DEBIT')}
                    className="btn btn-sm"
                    style={{
                      background: directDirection === 'DEBIT' ? '#ef4444' : 'rgba(255,255,255,0.05)',
                      color: directDirection === 'DEBIT' ? '#ffffff' : '#94a3b8',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    + பற்று / வழங்கியது (+g)
                  </button>

                  <button
                    type="button"
                    onClick={() => setDirectDirection('CREDIT')}
                    className="btn btn-sm"
                    style={{
                      background: directDirection === 'CREDIT' ? '#10b981' : 'rgba(255,255,255,0.05)',
                      color: directDirection === 'CREDIT' ? '#ffffff' : '#94a3b8',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    - வரவு / பெற்றது (-g)
                  </button>
                </div>
              </div>

              <div>
                <label className="input-label">{t.details}</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder={lang === 'ta' ? 'எ.கா: தொடக்க இருப்பு, கைமாற்று, உதிரி...' : 'e.g. Opening balance, manual offset...'}
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label">{lang === 'ta' ? 'எடை கிராம் (Grams)' : 'Weight in Grams'} *</label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={grossWeight}
                  onChange={(e) => setGrossWeight(e.target.value)}
                  placeholder="0.000"
                  className="input-field"
                  required
                  autoFocus
                />
              </div>
            </>
          )}

          {/* Notes / Voucher */}
          <div>
            <label className="input-label">{t.notes}</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={lang === 'ta' ? 'ரசீது எண், குறிப்புகள்...' : 'Receipt #, additional remarks...'}
              className="input-field"
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ minWidth: '130px' }}
            >
              <Check size={16} />
              <span>{t.save}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
