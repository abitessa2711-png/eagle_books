import React, { useRef } from 'react';
import { 
  Printer, 
  Download, 
  X, 
  FileText, 
  Building2, 
  Phone, 
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-react';
import { formatGrams, formatCurrency, formatDate } from '../utils/calculations';
import { translations } from '../utils/translations';

export function CustomerPdfModal({
  lang,
  isOpen,
  onClose,
  customer,
  customerSummary,
  rates
}) {
  const t = translations[lang] || translations.ta;
  const printRef = useRef(null);

  if (!isOpen || !customer || !customerSummary) return null;

  const currentRate = Number(rates?.ratePerGram) || 95;
  const transactions = customerSummary.transactions || [];
  const netBalanceGrams = Number(customerSummary.netBalanceGrams) || 0;
  const totalDebitGrams = Number(customerSummary.totalDebitGrams) || 0;
  const totalCreditGrams = Number(customerSummary.totalCreditGrams) || 0;

  const todayStr = new Date().toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '780px',
          maxHeight: '92vh',
          borderRadius: '16px',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        
        {/* Top Action Bar (Screen Only - Hidden during print) */}
        <div className="no-print" style={{
          background: 'linear-gradient(135deg, #090f24 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          borderBottom: '2px solid #ea580c'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(234, 88, 12, 0.2)',
              color: '#f97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0, color: '#ffffff' }}>
                {lang === 'ta' ? 'வாடிக்கையாளர் PDF அறிக்கை' : 'Customer PDF Ledger Report'}
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: '700' }}>
                {customer.name} {customer.jewelleryShop ? `• ${customer.jewelleryShop}` : ''}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={handlePrintPdf}
              style={{
                background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
              }}
            >
              <Printer size={16} />
              <span>{lang === 'ta' ? 'PDF பதிவிறக்கம் / அச்சிடுக' : 'Download / Print PDF'}</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable PDF Document Shell */}
        <div 
          className="modal-body-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            background: '#f8fafc'
          }}
        >
          <div 
            id="printable-receipt"
            ref={printRef}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '1.75rem',
              border: '1.5px solid #cbd5e1',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: '#0f172a'
            }}
          >
            {/* 1. SHOP BRAND HEADER */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '3px double #ea580c',
              paddingBottom: '1rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <img 
                  src="/eagle-logo.png" 
                  alt="Eagle Silvers Logo" 
                  style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                />
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#090f24', margin: 0, letterSpacing: '0.02em' }}>
                    EAGLE SILVERS
                  </h1>
                  <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#ea580c', textTransform: 'uppercase' }}>
                    Wholesale & Retail Silver Merchants
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: '700', marginTop: '0.15rem' }}>
                    8 - வடக்கு ரத வீதி, டவுன் போலீஸ் ஸ்டேஷன் ரோடு, சிவகாசி.
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#0f172a' }}>
                  📞 81480 03454
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#0f172a' }}>
                  📞 73391 60876
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.35rem', fontWeight: '800' }}>
                  தேதி: {todayStr}
                </div>
              </div>
            </div>

            {/* 2. REPORT TITLE & CUSTOMER DETAILS BOX */}
            <div style={{
              background: '#fff7ed',
              border: '1.5px solid #ffedd5',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              marginBottom: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.85rem'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  வாடிக்கையாளர் கணக்கு அறிக்கை (CUSTOMER STATEMENT)
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#090f24', margin: '0.2rem 0 0 0' }}>
                  {customer.name}
                </h2>
                {customer.jewelleryShop && (
                  <div style={{ fontSize: '0.9rem', color: '#ea580c', fontWeight: '800', marginTop: '0.15rem' }}>
                    🏬 {customer.jewelleryShop}
                  </div>
                )}
              </div>

              <div style={{ fontSize: '0.82rem', color: '#334155', fontWeight: '700', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                {customer.phone && (
                  <div>📱 தொலைபேசி: <strong>{customer.phone}</strong></div>
                )}
                {customer.address && (
                  <div>📍 முகவரி: <strong>{customer.address}</strong></div>
                )}
                <div>⚡ வெள்ளி விலை: <strong>₹{currentRate}/g</strong></div>
              </div>
            </div>

            {/* 3. TRANSACTION TABLE */}
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.82rem',
              marginBottom: '1.25rem'
            }}>
              <thead>
                <tr style={{ background: '#090f24', color: '#ffffff' }}>
                  <th style={{ padding: '0.65rem 0.5rem', textAlign: 'center', border: '1px solid #1e293b', width: '40px' }}>#</th>
                  <th style={{ padding: '0.65rem 0.5rem', textAlign: 'left', border: '1px solid #1e293b', width: '90px' }}>தேதி</th>
                  <th style={{ padding: '0.65rem 0.5rem', textAlign: 'left', border: '1px solid #1e293b' }}>விவரம் / நகை பெயர்</th>
                  <th style={{ padding: '0.65rem 0.5rem', textAlign: 'right', border: '1px solid #1e293b', width: '75px' }}>எடை (g)</th>
                  <th style={{ padding: '0.65rem 0.5rem', textAlign: 'center', border: '1px solid #1e293b', width: '55px' }}>டச் %</th>
                  <th style={{ padding: '0.65rem 0.5rem', textAlign: 'right', border: '1px solid #1e293b', color: '#fca5a5', width: '85px' }}>+பற்று (g)</th>
                  <th style={{ padding: '0.65rem 0.5rem', textAlign: 'right', border: '1px solid #1e293b', color: '#6ee7b7', width: '85px' }}>-வரவு (g)</th>
                  <th style={{ padding: '0.65rem 0.5rem', textAlign: 'right', border: '1px solid #1e293b', width: '95px' }}>இருப்பு (g)</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
                      பதிவுகள் எதுவும் இல்லை.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx, idx) => {
                    const isNew = tx.type === 'NEW_SALE' || tx.type === 'OPENING_BALANCE';
                    const isCash = tx.type === 'CASH_PAYMENT';

                    return (
                      <tr 
                        key={tx.id || idx} 
                        style={{ 
                          background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                          borderBottom: '1px solid #e2e8f0'
                        }}
                      >
                        <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center', fontWeight: '700', color: '#64748b' }}>{idx + 1}</td>
                        <td style={{ padding: '0.6rem 0.5rem', fontWeight: '700', whiteSpace: 'nowrap' }}>{formatDate(tx.date)}</td>
                        <td style={{ padding: '0.6rem 0.5rem', fontWeight: '800' }}>
                          <div>{tx.itemName || tx.type}</div>
                          {isCash && tx.cashAmount && (
                            <div style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: '700' }}>
                              💵 {formatCurrency(tx.cashAmount)} @ ₹{tx.ratePerGram || currentRate}/g
                            </div>
                          )}
                          {tx.notes && <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{tx.notes}</div>}
                        </td>
                        <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', fontWeight: '700' }}>
                          {tx.weight ? `${formatGrams(tx.weight)}` : '-'}
                        </td>
                        <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center', fontWeight: '700' }}>
                          {tx.touchPercent ? `${tx.touchPercent}%` : '-'}
                        </td>
                        <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', fontWeight: '900', color: '#dc2626' }}>
                          {tx.debitGrams > 0 ? `+${formatGrams(tx.debitGrams)}` : '-'}
                        </td>
                        <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', fontWeight: '900', color: '#059669' }}>
                          {tx.creditGrams > 0 ? `-${formatGrams(tx.creditGrams)}` : '-'}
                        </td>
                        <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', fontWeight: '900', color: '#090f24' }}>
                          {formatGrams(Math.abs(tx.balanceAfterGrams))}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* 4. SUMMARY TOTALS & NET BALANCE BOX */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f1f5f9',
              border: '2px solid #090f24',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#dc2626', textTransform: 'uppercase' }}>மொத்த பற்று (+GIVE)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#dc2626' }}>+{formatGrams(totalDebitGrams)} g</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase' }}>மொத்த வரவு (-GET)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#059669' }}>-{formatGrams(totalCreditGrams)} g</div>
                </div>
              </div>

              <div style={{
                background: netBalanceGrams > 0.001 ? '#fef2f2' : '#ecfdf5',
                border: netBalanceGrams > 0.001 ? '2px solid #dc2626' : '2px solid #059669',
                borderRadius: '8px',
                padding: '0.65rem 1.25rem',
                textAlign: 'right'
              }}>
                <div style={{ fontSize: '0.74rem', fontWeight: '900', color: netBalanceGrams > 0.001 ? '#dc2626' : '#059669' }}>
                  {netBalanceGrams > 0.001 ? 'நிகர நிலுவை இருப்பு (Net Balance Due):' : 'முன்வைப்பு இருப்பு (Advance Balance):'}
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: netBalanceGrams > 0.001 ? '#dc2626' : '#059669' }}>
                  {formatGrams(Math.abs(netBalanceGrams))} g
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', marginTop: '0.1rem' }}>
                  மதிப்பு: சுமார் {formatCurrency(Math.abs(netBalanceGrams) * currentRate)}
                </div>
              </div>
            </div>

            {/* 5. FOOTER SIGNATURE & STAMP */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: '2.5rem',
              paddingTop: '1rem',
              borderTop: '1px dashed #cbd5e1',
              fontSize: '0.75rem',
              color: '#64748b'
            }}>
              <div>
                * கணக்கு அறிக்கையில் சந்தேகம் இருப்பின் உடனடியாகத் தொடர்பு கொள்ளவும்.<br/>
                EAGLE BOOKS • கணினி ரசீது (Computer Generated Statement)
              </div>

              <div style={{ textAlign: 'right', color: '#090f24', fontWeight: '900' }}>
                For EAGLE SILVERS<br/><br/><br/>
                ________________________<br/>
                (உரிமையாளர் ஒப்பம்)
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
