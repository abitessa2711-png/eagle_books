import React, { useState } from 'react';
import { 
  Printer, 
  Share2, 
  ArrowLeft, 
  PlusCircle, 
  Sparkles, 
  Edit2, 
  CheckSquare, 
  HelpCircle,
  Calculator
} from 'lucide-react';
import { translations } from '../utils/translations';
import { formatGrams, formatCurrency, formatDate } from '../utils/calculations';

export function NotebookView({
  lang,
  customer,
  customerSummary,
  rates,
  onOpenTransactionModal,
  onBackToKhatabook,
  onOpenWhatsAppModal
}) {
  const t = translations[lang];
  const [fontMode, setFontMode] = useState('handwriting'); // 'handwriting' | 'clean'

  if (!customer) return null;

  const { transactions = [], netBalanceGrams = 0 } = customerSummary;
  const currentRate = Number(rates.ratePerGram) || 95;
  const approxRupees = Math.abs(netBalanceGrams) * currentRate;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }} className="no-print">
        <button
          onClick={onBackToKhatabook}
          className="btn btn-sm btn-outline"
        >
          <ArrowLeft size={16} />
          <span>{lang === 'ta' ? 'கட்டாபுக் கார்டு பார்வைக்கு திரும்ப' : 'Back to Khatabook View'}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Font Toggle */}
          <button
            onClick={() => setFontMode(fontMode === 'handwriting' ? 'clean' : 'handwriting')}
            className="btn btn-sm btn-outline"
            style={{ borderColor: '#f59e0b', color: '#fbbf24' }}
          >
            <Edit2 size={14} />
            <span>
              {fontMode === 'handwriting' 
                ? (lang === 'ta' ? 'டிஜிட்டல் எழுத்துரு' : 'Clean Digital Font') 
                : (lang === 'ta' ? 'நோட்புக் கையெழுத்து' : 'Handwriting Look')}
            </span>
          </button>

          {/* Add Entry */}
          <button
            onClick={() => onOpenTransactionModal('DIRECT_ADJUST')}
            className="btn btn-sm btn-primary"
          >
            <PlusCircle size={15} />
            <span>{lang === 'ta' ? 'புதிய வரவு/செலவு பதிவு' : 'Add Entry'}</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={() => onOpenWhatsAppModal(customer.id)}
            className="btn btn-sm btn-green"
          >
            <Share2 size={15} />
            <span>WhatsApp</span>
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="btn btn-sm btn-gold"
          >
            <Printer size={15} />
            <span>{t.printNotebook}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          THE TRADITIONAL JEWELLER LEDGER NOTEBOOK (கணக்கு நோட்டு ஏடு)
          Directly matches the real-world jeweller ledger photo!
          ========================================================================= */}
      <div 
        className={`notebook-container ${fontMode === 'handwriting' ? 'handwriting-font' : ''}`}
        style={{
          minHeight: '750px',
          background: '#fdfbf7',
          color: '#0f172a',
          position: 'relative'
        }}
      >
        {/* Left Spiral Holes */}
        <div className="notebook-spine no-print">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="notebook-hole" style={{ margin: '0.85rem 0' }}></div>
          ))}
        </div>

        {/* Notebook Header */}
        <div style={{
          borderBottom: '2px solid #cbd5e1',
          paddingBottom: '1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#b91c1c', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              ✦ {lang === 'ta' ? 'ஸ்ரீ லட்சுமி துணை - வெள்ளி நகை கணக்கு நோட்டு' : 'Eagle Book - Silver Jeweller Account Ledger'} ✦
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: '900', color: '#1e3a8a', marginTop: '0.2rem' }}>
              {customer.name}
            </div>
            <div style={{ fontSize: '0.95rem', color: '#475569', fontWeight: '600', marginTop: '0.15rem' }}>
              📍 {customer.address || 'நகை வியாபாரம்'} | 📞 {customer.phone || '-'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div className="stamp-box" style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              {t[customer.type] || customer.type || 'Karigar / Jeweller'}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {lang === 'ta' ? 'அறிக்கை தேதி:' : 'Date:'} {formatDate(new Date().toISOString())}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#b45309', fontWeight: '700' }}>
              {lang === 'ta' ? 'அன்றைய வெள்ளி ரேட்:' : 'Rate:'} {formatCurrency(rates.ratePerGram)}/g
            </div>
          </div>
        </div>

        {/* Two-Column Notebook Layout (Like the Photo) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
          gap: '2rem',
          position: 'relative'
        }}>
          
          {/* LEFT COLUMN: Running Step-by-Step Subtraction Ladder & Cash Conversions */}
          <div style={{ borderRight: '1.5px dashed #cbd5e1', paddingRight: '1.5rem' }}>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '1rem',
              borderBottom: '1.5px solid #1e3a8a',
              paddingBottom: '0.35rem'
            }}>
              <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e3a8a' }}>
                {lang === 'ta' ? 'பற்று-வரவு தொடர் கழிவு கணக்கு (Step-by-step Ladder)' : 'Step-by-Step Running Ledger'}
              </span>
              <span className="stamp-touch" style={{ fontSize: '0.78rem' }}>
                78% / 100% {lang === 'ta' ? 'மாற்று (P)' : 'Touch'}
              </span>
            </div>

            {/* Step-by-step ladder items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              
              {transactions.map((tx, idx) => {
                const isOpening = tx.type === 'OPENING_BALANCE';
                const isCash = tx.type === 'CASH_PAYMENT';
                const isOld = tx.type === 'OLD_SILVER';
                const isNew = tx.type === 'NEW_SALE';

                return (
                  <div 
                    key={tx.id || idx}
                    style={{
                      padding: '0.5rem 0.75rem',
                      background: isCash ? 'rgba(254, 243, 199, 0.4)' : 'transparent',
                      borderRadius: '8px',
                      borderLeft: isCash ? '3px solid #f59e0b' : isNew ? '3px solid #ef4444' : '3px solid #10b981'
                    }}
                  >
                    {/* Top line of calculation */}
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                      
                      {/* Left: Math Expression */}
                      <div>
                        {isOpening && (
                          <span style={{ fontWeight: '800', color: '#1e3a8a' }}>
                            CB : {formatGrams(tx.debitGrams)}
                          </span>
                        )}

                        {isOld && (
                          <span style={{ color: '#047857', fontWeight: '700' }}>
                            - {formatGrams(tx.creditGrams)} gm <span style={{ fontSize: '0.85rem' }}>({tx.itemName || 'பழைய வரவு'})</span>
                          </span>
                        )}

                        {isCash && (
                          <div style={{ color: '#b45309', fontWeight: '800' }}>
                            {formatDate(tx.date)} : {formatCurrency(tx.cashAmount)} 
                            {tx.ratePerGram && ` (${tx.ratePerGram})`} 
                            {tx.touchPercent ? ` × ${tx.touchPercent}%` : ''} 
                            {tx.isTouchAdjusted ? ` : = ${formatGrams(tx.creditGrams)} (P)` : ` = -${formatGrams(tx.creditGrams)}g`}
                          </div>
                        )}

                        {isNew && (
                          <span style={{ color: '#b91c1c', fontWeight: '800' }}>
                            + {formatGrams(tx.debitGrams)} gm <span style={{ fontSize: '0.85rem' }}>({tx.itemName || 'புதிய நகை'})</span>
                          </span>
                        )}

                        {tx.notes && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>
                            📝 {tx.notes}
                          </div>
                        )}
                      </div>

                      {/* Right: Running result */}
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: '800', color: '#1e3a8a', fontSize: '1.05rem' }}>
                          = {formatGrams(Math.abs(tx.balanceAfterGrams))}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: tx.balanceAfterGrams > 0 ? '#b91c1c' : '#047857', marginLeft: '0.3rem' }}>
                          {tx.balanceAfterGrams > 0 ? '(Dr)' : '(Cr)'}
                        </span>
                      </div>

                    </div>
                  </div>
                );
              })}

            </div>

            {/* Pure Touch (P) Highlight Box */}
            <div style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1rem',
              background: '#f8fafc',
              border: '1.5px solid #94a3b8',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '0.82rem', color: '#475569', fontWeight: '700' }}>
                📐 {lang === 'ta' ? 'நோட்புக் மாற்று கணக்கீடு (Touch Formula):' : 'Notebook Formula:'}
              </div>
              <div style={{ fontSize: '0.95rem', color: '#1e3a8a', fontWeight: '800', marginTop: '0.2rem' }}>
                {formatGrams(netBalanceGrams)} × 78% = {formatGrams(netBalanceGrams * 0.78)} (P நய எடை)
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Itemized Jewelry Lots & Deductions (கொலுசு, உதிரி உருப்படிகள்) */}
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '1rem',
              borderBottom: '1.5px solid #1e3a8a',
              paddingBottom: '0.35rem'
            }}>
              <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e3a8a' }}>
                {lang === 'ta' ? 'நகை உருப்படிகள் & பழைய கழிவு (Item Lots)' : 'Jewel Item Lots & Deductions'}
              </span>
            </div>

            {/* Individual Item Weights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.95rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #cbd5e1', paddingBottom: '0.25rem' }}>
                <span>✨ கொலுசு (Anklet Lot):</span>
                <span style={{ fontWeight: '800', color: '#1e3a8a' }}>267.160 g</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #cbd5e1', paddingBottom: '0.25rem' }}>
                <span>✨ உதிரி உருப்படிகள் (Loose Items Lot):</span>
                <span style={{ fontWeight: '800', color: '#1e3a8a' }}>179.120 g</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #cbd5e1', paddingBottom: '0.25rem' }}>
                <span>✨ கம்மல் & சங்கிலி (Earrings & Chain):</span>
                <span style={{ fontWeight: '800', color: '#1e3a8a' }}>111.650 g</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #cbd5e1', paddingBottom: '0.25rem' }}>
                <span>✨ 25/7 உதிரி (Lot 1):</span>
                <span style={{ fontWeight: '800', color: '#1e3a8a' }}>57.350 g</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1.5px solid #1e3a8a', paddingBottom: '0.25rem' }}>
                <span>✨ 25/7 உதிரி (Lot 2):</span>
                <span style={{ fontWeight: '800', color: '#1e3a8a' }}>50.360 g</span>
              </div>

              {/* Gross Subtotal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', color: '#1e3a8a', marginTop: '0.35rem' }}>
                <span>{lang === 'ta' ? 'மொத்த எடை (Gross Total):' : 'Gross Lot Total:'}</span>
                <span style={{ fontSize: '1.15rem' }}>665.640 g</span>
              </div>

              {/* Old Silver Offset */}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#047857', fontWeight: '800', marginTop: '0.25rem' }}>
                <span>- {lang === 'ta' ? 'பழைய வெள்ளி மாற்று கழிவு:' : 'Old Silver Offset:'}</span>
                <span>- 202.190 g</span>
              </div>

              <div style={{ borderTop: '1.5px solid #1e3a8a', margin: '0.35rem 0' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', color: '#1e3a8a' }}>
                <span>{lang === 'ta' ? 'நிகர எடை (Subtotal):' : 'Subtotal:'}</span>
                <span>463.450 g</span>
              </div>

              {/* RSP Cash Deductions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#b45309', fontSize: '0.88rem' }}>
                <span>- 16,000 RSP (23/6):</span>
                <span>- 87.430 g</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', color: '#1e3a8a' }}>
                <span>= இருப்பு:</span>
                <span>376.020 g</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#b45309', fontSize: '0.88rem' }}>
                <span>- 20,000 RSP (29/6):</span>
                <span>- 112.230 g</span>
              </div>

              {/* FINAL NET CLOSING BALANCE */}
              <div style={{
                marginTop: '1.5rem',
                padding: '1.25rem 1rem',
                background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                border: '2px solid #b91c1c',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(185, 28, 28, 0.15)'
              }}>
                <div style={{ fontSize: '0.85rem', color: '#991b1b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  🔴 {lang === 'ta' ? 'இறுதி நிலுவை எடை (Net Closing Balance)' : 'Final Net Balance Grams'}
                </div>

                <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#b91c1c', margin: '0.35rem 0' }}>
                  {formatGrams(Math.abs(netBalanceGrams))} <span style={{ fontSize: '1.2rem' }}>g</span>
                </div>

                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#b45309' }}>
                  ≈ {formatCurrency(approxRupees)}
                </div>

                <div style={{ fontSize: '0.78rem', color: '#7f1d1d', marginTop: '0.35rem' }}>
                  ({lang === 'ta' ? 'வாடிக்கையாளர் தர வேண்டியது' : 'Due from Customer'} @ ₹{rates.ratePerGram}/g)
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Notebook Footer & Signature */}
        <div style={{
          marginTop: '2.5rem',
          paddingTop: '1.25rem',
          borderTop: '1.5px solid #cbd5e1',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontSize: '0.85rem',
          color: '#64748b'
        }}>
          <div>
            <div>{lang === 'ta' ? 'ஈகிள் புக் டிஜிட்டல் கணக்கு நோட்டு' : 'Eagle Book Jeweller Digital Notebook'}</div>
            <div style={{ fontSize: '0.75rem' }}>E. & O.E. | சரிபார்க்கப்பட்ட கணக்கு</div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ borderBottom: '1px solid #94a3b8', width: '160px', height: '35px', marginBottom: '0.25rem' }}></div>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#1e3a8a' }}>
              {lang === 'ta' ? 'உரிமையாளர் கையொப்பம்' : 'Authorized Signature'}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
