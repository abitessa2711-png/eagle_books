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
  const t = translations[lang] || translations.ta;

  // Touch % Presets
  const touchPresets = ['70', '75', '78', '80', '84', '90', '92.5', '100'];

  // Sub-mode when in 'GET': 'CASH' | 'OLD_SILVER'
  const [getSubType, setGetSubType] = useState('CASH');

  // Form Fields
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [itemName, setItemName] = useState(initialMode === 'GIVE' ? 'கொலுசு (Anklet)' : 'ரொக்கப் பணம் (Cash)');
  const [customItem, setCustomItem] = useState('');
  
  // Weights
  const [grossWeight, setGrossWeight] = useState('');
  const [touchPercent, setTouchPercent] = useState('80');

  // Cash
  const [cashAmount, setCashAmount] = useState('');
  const [ratePerGram, setRatePerGram] = useState(String(rates?.ratePerGram || 95));
  const [isTouchAdjusted, setIsTouchAdjusted] = useState(true);
  const [cashTouchPercent, setCashTouchPercent] = useState('78');

  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  // Preset Jewel items matching Sivakasi Eagle Silvers Card
  const presets = [
    { key: 'வெள்ளி கொலுசு (Silver Anklet)', label: 'வெள்ளி கொலுசு', touch: 78 },
    { key: 'பாம்பே கொலுசு (Bombay Anklet)', label: 'பாம்பே கொலுசு', touch: 78 },
    { key: 'மெட்டி வகைகள் (Toe Rings)', label: 'மெட்டி வகைகள்', touch: 78 },
    { key: 'பாம்பே கொடி (Bombay Chain)', label: 'பாம்பே கொடி', touch: 80 },
    { key: 'முத்தூணாங்கொடி (Muthunaankodi)', label: 'முத்தூணாங்கொடி', touch: 80 },
    { key: 'தண்ட கொலுசு (Thanda Anklet)', label: 'தண்ட கொலுசு', touch: 78 },
    { key: 'வெள்ளி கட்டி / பார் (Bar Silver)', label: 'வெள்ளி கட்டி / பார்', touch: 100 },
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
      newTx.ratePerGram = Number(ratePerGram) || rates?.ratePerGram || 95;
      newTx.debitGrams = calculatedPureGrams;
      newTx.creditGrams = 0;
    } else {
      if (getSubType === 'CASH') {
        newTx.type = 'CASH_PAYMENT';
        newTx.cashAmount = Number(cashAmount) || 0;
        newTx.ratePerGram = Number(ratePerGram) || rates?.ratePerGram || 95;
        newTx.touchPercent = isTouchAdjusted ? Number(cashTouchPercent) : 100;
        newTx.creditGrams = calculatedCashGrams;
        newTx.debitGrams = 0;
      } else {
        newTx.type = 'OLD_SILVER';
        newTx.weight = Number(grossWeight) || 0;
        newTx.touchPercent = Number(touchPercent) || 100;
        newTx.ratePerGram = Number(ratePerGram) || rates?.ratePerGram || 95;
        newTx.creditGrams = calculatedPureGrams;
        newTx.debitGrams = 0;
      }
    }

    onSaveTransaction(newTx);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          borderRadius: '16px',
          background: '#ffffff',
          color: '#000000',
          border: initialMode === 'GIVE' ? '2.5px solid #dc2626' : '2.5px solid #059669',
          overflow: 'hidden'
        }}
      >
        
        {/* Header */}
        <div style={{
          background: initialMode === 'GIVE' 
            ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' 
            : 'linear-gradient(135deg, #059669 0%, #064e3b 100%)',
          color: '#ffffff',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {initialMode === 'GIVE' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0 }}>
                {initialMode === 'GIVE' ? (lang === 'ta' ? 'நீங்கள் கொடுத்தது (YOU GAVE)' : 'NEW SILVER ISSUE (YOU GAVE)') : (lang === 'ta' ? 'நீங்கள் பெற்றது (YOU GOT)' : 'PAYMENT / OLD SILVER (YOU GOT)')}
              </h3>
              <span style={{ fontSize: '0.72rem', opacity: 0.95, fontWeight: '700' }}>
                {initialMode === 'GIVE' ? '+ பற்று (New Silver Debited)' : '- வரவு (Cash or Old Silver Credited)'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Sub-type switcher when in 'GET' */}
        {initialMode === 'GET' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: '#f1f5f9',
            padding: '0.25rem',
            margin: '1rem 1.25rem 0 1.25rem',
            borderRadius: '10px',
            gap: '0.35rem',
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '1.25rem' }}>
          
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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.45rem' }}>
                  {presets.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      style={{
                        padding: '0.25rem 0.55rem',
                        borderRadius: '8px',
                        fontSize: '0.72rem',
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
                    placeholder={lang === 'ta' ? 'பொருளின் பெயர்...' : 'Item name...'}
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
                    style={{ fontWeight: '900', color: '#dc2626' }}
                  />
                </div>
              </div>

              {/* Quick Touch % Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', alignSelf: 'center' }}>விரைவு டச் %:</span>
                {touchPresets.map(tVal => (
                  <button
                    key={tVal}
                    type="button"
                    onClick={() => setTouchPercent(tVal)}
                    style={{
                      background: touchPercent === tVal ? '#dc2626' : '#f8fafc',
                      color: touchPercent === tVal ? '#ffffff' : '#1e293b',
                      border: touchPercent === tVal ? '1px solid #dc2626' : '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '0.15rem 0.4rem',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    {tVal}%
                  </button>
                ))}
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
                  {lang === 'ta' ? 'பற்று வைக்கப்படும் நய எடை:' : 'Net Debit Pure Weight:'}
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
                      placeholder="25000"
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

              {/* Dynamic Touch Adjusted Mode */}
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#0f172a', fontWeight: '800', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isTouchAdjusted}
                      onChange={(e) => setIsTouchAdjusted(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#059669' }}
                    />
                    <span>{lang === 'ta' ? 'டச் % மாற்று முறை' : 'Apply Touch % Formula'}</span>
                  </label>

                  {isTouchAdjusted && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <input
                        type="number"
                        step="0.1"
                        value={cashTouchPercent}
                        onChange={(e) => setCashTouchPercent(e.target.value)}
                        style={{
                          width: '54px',
                          background: '#ffffff',
                          border: '1.5px solid #059669',
                          borderRadius: '6px',
                          padding: '0.15rem 0.3rem',
                          fontSize: '0.85rem',
                          fontWeight: '900',
                          textAlign: 'center',
                          color: '#059669'
                        }}
                      />
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>%</span>
                    </div>
                  )}
                </div>

                {/* Quick Touch % Pills for Cash Payment */}
                {isTouchAdjusted && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.2rem' }}>
                    {touchPresets.map(tVal => (
                      <button
                        key={tVal}
                        type="button"
                        onClick={() => setCashTouchPercent(tVal)}
                        style={{
                          background: cashTouchPercent === tVal ? '#059669' : '#ffffff',
                          color: cashTouchPercent === tVal ? '#ffffff' : '#1e293b',
                          border: cashTouchPercent === tVal ? '1px solid #059669' : '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '0.15rem 0.4rem',
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

              {/* Auto Grams Deducted Banner */}
              <div style={{
                background: '#ecfdf5',
                border: '1.5px solid #6ee7b7',
                padding: '0.85rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.78rem', color: '#047857', fontWeight: '800', textTransform: 'uppercase' }}>
                  ⚡ {lang === 'ta' ? 'வாடிக்கையாளருக்கு கழிக்கப்படும் வெள்ளி' : 'Grams Deducted from Balance'}
                </div>

                <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#059669', margin: '0.15rem 0' }}>
                  -{formatGrams(calculatedCashGrams)} <span style={{ fontSize: '0.95rem' }}>g</span>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#334155', fontWeight: '700', lineHeight: 1.4 }}>
                  {isTouchAdjusted ? (
                    <div>
                      <div>டச் ரேட்: ₹{ratePerGram} × {cashTouchPercent}% = <strong>₹{(Number(ratePerGram) * (Number(cashTouchPercent) / 100)).toFixed(2)}/g</strong></div>
                      <div>{formatCurrency(cashAmount || 0)} ÷ ₹{(Number(ratePerGram) * (Number(cashTouchPercent) / 100)).toFixed(2)} = <strong>{formatGrams(calculatedCashGrams)} g கழிவு!</strong></div>
                    </div>
                  ) : (
                    <span>{formatCurrency(cashAmount || 0)} ÷ ₹{ratePerGram}/g = {formatGrams(calculatedCashGrams)} g கழிவு!</span>
                  )}
                </div>
              </div>
            </>
          )}

          {/* GET -> OLD SILVER RETURN */}
          {initialMode === 'GET' && getSubType === 'OLD_SILVER' && (
            <>
              <div>
                <label className="input-label">{lang === 'ta' ? 'பழைய வெள்ளி விவரம்' : 'Old Silver Item'}</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="பழைய கொலுசு / உருப்படி"
                  className="input-field"
                />
              </div>

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
                    style={{ fontWeight: '900', color: '#059669' }}
                  />
                </div>
              </div>

              {/* Quick Touch % Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', alignSelf: 'center' }}>டச் %:</span>
                {touchPresets.map(tVal => (
                  <button
                    key={tVal}
                    type="button"
                    onClick={() => setTouchPercent(tVal)}
                    style={{
                      background: touchPercent === tVal ? '#059669' : '#f8fafc',
                      color: touchPercent === tVal ? '#ffffff' : '#1e293b',
                      border: touchPercent === tVal ? '1px solid #059669' : '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '0.15rem 0.4rem',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    {tVal}%
                  </button>
                ))}
              </div>

              <div style={{
                background: '#f0fdf4',
                border: '1.5px solid #86efac',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.82rem', color: '#166534', fontWeight: '800' }}>
                  {lang === 'ta' ? 'வரவு வைக்கப்படும் நய எடை:' : 'Net Credit Pure Weight:'}
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#059669' }}>
                  -{formatGrams(calculatedPureGrams)} g
                </span>
              </div>
            </>
          )}

          {/* Notes */}
          <div>
            <label className="input-label">{t.notes} ({lang === 'ta' ? 'விருப்பப்பட்டால்' : 'Optional'})</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="குறிப்புகள்..."
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
              boxShadow: initialMode === 'GIVE' 
                ? '0 4px 15px rgba(220, 38, 38, 0.3)' 
                : '0 4px 15px rgba(5, 150, 105, 0.3)'
            }}
          >
            <Check size={18} />
            <span>{t.save}</span>
          </button>

        </form>

      </div>
    </div>
  );
}
