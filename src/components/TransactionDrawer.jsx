import React, { useState } from 'react';
import { 
  X, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Banknote, 
  Check, 
  Scale, 
  Calendar
} from 'lucide-react';
import { translations } from '../utils/translations';
import { convertCashToGrams, calculateNetSilver, formatGrams, formatCurrency } from '../utils/calculations';

export function TransactionDrawer({
  lang,
  isOpen,
  onClose,
  initialMode = 'GIVE', // 'GIVE' (Red - New Silver) | 'GET' (Green - Cash/Old Silver)
  customerId,
  rates,
  onSaveTransaction
}) {
  const t = translations[lang];

  // Sub-mode when in 'GET': 'CASH' | 'OLD_SILVER'
  const [getSubType, setGetSubType] = useState('CASH');

  // Form Fields
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [itemName, setItemName] = useState(initialMode === 'GIVE' ? 'கொலுசு (Anklet)' : 'ரொக்கப் பணம் (Cash)');
  const [customItem, setCustomItem] = useState('');
  
  // Weights
  const [grossWeight, setGrossWeight] = useState('');
  const [touchPercent, setTouchPercent] = useState(initialMode === 'GIVE' ? '78' : '100');

  // Cash
  const [cashAmount, setCashAmount] = useState('');
  const [ratePerGram, setRatePerGram] = useState(String(rates.ratePerGram || 95));
  const [isTouchAdjusted, setIsTouchAdjusted] = useState(false);
  const [cashTouchPercent, setCashTouchPercent] = useState('78');

  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  // Preset Jewel items
  const presets = [
    { key: 'கொலுசு (Anklet)', label: t.itemKolusu, touch: 78 },
    { key: 'கம்மல் (Earrings)', label: t.itemKammal, touch: 100 },
    { key: 'சங்கிலி / செயின் (Chain)', label: t.itemChain, touch: 100 },
    { key: 'கிண்ணம் (Bowl)', label: t.itemKinnam, touch: 100 },
    { key: 'அரைஞாண் கொடி (Waistband)', label: t.itemArainan, touch: 100 },
    { key: 'மெட்டி (Toe Ring)', label: t.itemMetti, touch: 78 },
    { key: 'காமாட்சி விளக்கு (Lamp)', label: t.itemVilakku, touch: 100 },
    { key: 'CUSTOM', label: t.itemCustom, touch: 100 }
  ];

  const handleSelectPreset = (p) => {
    if (p.key === 'CUSTOM') {
      setItemName('');
    } else {
      setItemName(p.key);
      setTouchPercent(String(p.touch));
    }
  };

  // Live Pure/Converted Calculations
  const calculatedPureGrams = calculateNetSilver(
    Number(grossWeight) || 0,
    Number(touchPercent) || 100,
    0
  );

  const calculatedCashGrams = convertCashToGrams(
    Number(cashAmount) || 0,
    Number(ratePerGram) || 95,
    Number(cashTouchPercent) || 100,
    isTouchAdjusted
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalItem = itemName === 'CUSTOM' || !itemName ? customItem || 'வெள்ளி நகை' : itemName;

    let newTx = {
      id: `tx-${Date.now()}`,
      customerId,
      date,
      itemName: finalItem,
      notes,
      createdAt: new Date().toISOString()
    };

    if (initialMode === 'GIVE') {
      newTx.type = 'NEW_SALE';
      newTx.weight = Number(grossWeight) || 0;
      newTx.touchPercent = Number(touchPercent) || 100;
      newTx.ratePerGram = Number(ratePerGram) || rates.ratePerGram;
    } else {
      if (getSubType === 'CASH') {
        newTx.type = 'CASH_PAYMENT';
        newTx.cashAmount = Number(cashAmount) || 0;
        newTx.ratePerGram = Number(ratePerGram) || rates.ratePerGram;
        newTx.touchPercent = Number(cashTouchPercent) || 100;
        newTx.isTouchAdjusted = isTouchAdjusted;
        newTx.convertedGrams = calculatedCashGrams;
        newTx.itemName = `ரொக்கம் ${formatCurrency(cashAmount)}`;
      } else {
        newTx.type = 'OLD_SILVER';
        newTx.weight = Number(grossWeight) || 0;
        newTx.touchPercent = Number(touchPercent) || 100;
        newTx.itemName = finalItem || 'பழைய வெள்ளி வரவு';
      }
    }

    onSaveTransaction(newTx);
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(9, 15, 36, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }} 
      onClick={onClose}
    >
      <div 
        style={{
          background: '#ffffff',
          color: '#000000',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '92vh',
          borderRadius: '20px',
          padding: '1.25rem 1.4rem',
          overflowY: 'auto',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
          border: '1.5px solid #cbd5e1'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1.5px solid #e2e8f0',
          paddingBottom: '0.75rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: initialMode === 'GIVE' ? '#fef2f2' : '#ecfdf5',
              color: initialMode === 'GIVE' ? '#dc2626' : '#059669',
              border: initialMode === 'GIVE' ? '1.5px solid #fca5a5' : '1.5px solid #6ee7b7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {initialMode === 'GIVE' ? <ArrowUpRight size={22} /> : <ArrowDownLeft size={22} />}
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0, color: '#000000' }}>
                {initialMode === 'GIVE' 
                  ? (lang === 'ta' ? '🔴 நீங்கள் கொடுத்தது (புதிய நகை)' : 'You Gave (New Silver)') 
                  : (lang === 'ta' ? '🟢 நீங்கள் பெற்றது (வரவு)' : 'You Got (Payment / Return)')}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, fontWeight: '700' }}>
                {initialMode === 'GIVE' 
                  ? (lang === 'ta' ? 'வாடிக்கையாளர் பற்று வைக்கப்படும் எடை (+g)' : 'Debited to customer balance (+g)')
                  : (lang === 'ta' ? 'வாடிக்கையாளருக்கு கழிக்கப்படும் வரவு (-g)' : 'Credited to customer balance (-g)')}
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.2rem' }}>
            <X size={22} />
          </button>
        </div>

        {/* If Mode is 'GET', toggle between Cash and Old Silver */}
        {initialMode === 'GET' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: '#f1f5f9',
            padding: '0.25rem',
            borderRadius: '10px',
            gap: '0.35rem',
            marginBottom: '1rem',
            border: '1px solid #cbd5e1'
          }}>
            <button
              type="button"
              onClick={() => setGetSubType('CASH')}
              style={{
                background: getSubType === 'CASH' ? '#059669' : 'transparent',
                color: getSubType === 'CASH' ? '#ffffff' : '#475569',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem',
                fontSize: '0.82rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
            >
              <Banknote size={16} />
              <span>{lang === 'ta' ? 'ரொக்கப் பணம் (Cash)' : 'Cash Payment'}</span>
            </button>

            <button
              type="button"
              onClick={() => setGetSubType('OLD_SILVER')}
              style={{
                background: getSubType === 'OLD_SILVER' ? '#0284c7' : 'transparent',
                color: getSubType === 'OLD_SILVER' ? '#ffffff' : '#475569',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem',
                fontSize: '0.82rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
            >
              <Scale size={16} />
              <span>{lang === 'ta' ? 'பழைய வெள்ளி' : 'Old Silver'}</span>
            </button>
          </div>
        )}

        {/* Drawer Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          {/* Date */}
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

          {/* GIVE: NEW SILVER ISSUE */}
          {initialMode === 'GIVE' && (
            <>
              {/* Presets */}
              <div>
                <label className="input-label">{t.itemName}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.45rem' }}>
                  {presets.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      style={{
                        padding: '0.3rem 0.6rem',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        background: itemName === p.key ? '#dc2626' : '#f1f5f9',
                        color: itemName === p.key ? '#ffffff' : '#1e293b',
                        border: itemName === p.key ? '1px solid #b91c1c' : '1px solid #cbd5e1',
                        cursor: 'pointer'
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {(!itemName || itemName === 'CUSTOM') && (
                  <input
                    type="text"
                    value={customItem}
                    onChange={(e) => setCustomItem(e.target.value)}
                    placeholder={lang === 'ta' ? 'பொருளின் பெயர் (எ.கா. கொலுசு ஜோடி...)' : 'Item name...'}
                    className="input-field"
                  />
                )}
              </div>

              {/* Gross Weight & Touch % */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
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
                      style={{ fontSize: '1.15rem', fontWeight: '900' }}
                      required
                      autoFocus
                    />
                    <span style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: '800' }}>
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

              {/* Pure Silver Preview */}
              <div style={{
                background: '#fef2f2',
                border: '1.5px solid #fca5a5',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.82rem', color: '#991b1b', fontWeight: '800' }}>
                  {lang === 'ta' ? 'வாடிக்கையாளர் பற்று வைக்கப்படும் எடை:' : 'Net Debit Pure Weight:'}
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#dc2626' }}>
                  +{formatGrams(calculatedPureGrams)} g
                </span>
              </div>
            </>
          )}

          {/* GET -> CASH PAYMENT CONVERTED TO SILVER GRAMS */}
          {initialMode === 'GET' && getSubType === 'CASH' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="input-label">{t.cashAmount} *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      placeholder="23000"
                      className="input-field"
                      style={{ fontSize: '1.2rem', fontWeight: '900', color: '#047857' }}
                      required
                      autoFocus
                    />
                    <span style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#047857', fontWeight: '900' }}>
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
                      value={ratePerGram}
                      onChange={(e) => setRatePerGram(e.target.value)}
                      className="input-field"
                      required
                    />
                    <span style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '0.75rem', fontWeight: '700' }}>
                      ₹/g
                    </span>
                  </div>
                </div>
              </div>

              {/* Touch Adjusted Mode checkbox */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.82rem',
                color: '#334155',
                fontWeight: '700',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={isTouchAdjusted}
                  onChange={(e) => setIsTouchAdjusted(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#059669' }}
                />
                <span>{lang === 'ta' ? 'நோட்புக் மாற்று முறை ((பணம் ÷ ரேட்) × 78%)' : 'Touch Adjusted RSP Formula'}</span>
              </label>

              {/* Auto Grams Deducted Banner */}
              <div style={{
                background: '#ecfdf5',
                border: '1.5px solid #6ee7b7',
                padding: '0.85rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.78rem', color: '#047857', fontWeight: '800', textTransform: 'uppercase' }}>
                  ⚡ {lang === 'ta' ? 'தானியங்கி கிராம் கழிவு (Auto Grams Off)' : 'Grams Deducted from Customer Balance'}
                </div>

                <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#059669', margin: '0.15rem 0' }}>
                  -{formatGrams(calculatedCashGrams)} <span style={{ fontSize: '0.95rem' }}>g</span>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '700' }}>
                  {formatCurrency(cashAmount || 0)} ÷ ₹{ratePerGram}/g = {formatGrams(calculatedCashGrams)} கிராம் கழிவு!
                </div>
              </div>
            </>
          )}

          {/* GET -> OLD SILVER RETURN */}
          {initialMode === 'GET' && getSubType === 'OLD_SILVER' && (
            <>
              <div>
                <label className="input-label">{t.details}</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder={lang === 'ta' ? 'பழைய கொலுசு, உருகிய வெள்ளி கட்டி...' : 'Old jewelry item...'}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="input-label">{t.grossWeight} *</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={grossWeight}
                    onChange={(e) => setGrossWeight(e.target.value)}
                    placeholder="0.000"
                    className="input-field"
                    style={{ fontSize: '1.15rem', fontWeight: '900' }}
                    required
                    autoFocus
                  />
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

              <div style={{
                background: '#ecfdf5',
                border: '1.5px solid #6ee7b7',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.82rem', color: '#047857', fontWeight: '800' }}>
                  {lang === 'ta' ? 'வாடிக்கையாளருக்கு கழிக்கப்படும் பழைய எடை:' : 'Net Old Silver Credited:'}
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#059669' }}>
                  -{formatGrams(calculatedPureGrams)} g
                </span>
              </div>
            </>
          )}

          {/* Notes */}
          <div>
            <label className="input-label">{t.notes}</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={lang === 'ta' ? 'ரசீது எண், குறிப்பு...' : 'Remarks, voucher #...'}
              className="input-field"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-mobile"
            style={{
              background: initialMode === 'GIVE' 
                ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' 
                : 'linear-gradient(135deg, #059669 0%, #064e3b 100%)',
              color: '#ffffff',
              padding: '0.85rem',
              fontSize: '1rem',
              borderRadius: '12px',
              marginTop: '0.5rem',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
            }}
          >
            <Check size={18} />
            <span>{lang === 'ta' ? 'பதிவை சேமிக்க (Save Entry)' : 'Save Transaction'}</span>
          </button>

        </form>

      </div>
    </div>
  );
}
