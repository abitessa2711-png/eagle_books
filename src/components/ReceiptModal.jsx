import React, { useState } from 'react';
import { X, Printer, FileText, CheckCircle2, ShieldCheck, Share2 } from 'lucide-react';
import { translations } from '../utils/translations';
import { formatGrams, formatCurrency, formatDate } from '../utils/calculations';

export function ReceiptModal({
  lang,
  isOpen,
  onClose,
  customer,
  customerSummary,
  rates
}) {
  const t = translations[lang];
  const [printFormat, setPrintFormat] = useState('A4');

  if (!isOpen || !customer) return null;

  const { transactions = [], netBalanceGrams = 0 } = customerSummary;
  const currentRate = Number(rates.ratePerGram) || 95;
  const approxRupees = Math.abs(netBalanceGrams) * currentRate;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        
        {/* Modal Controls (No-Print) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1.5px solid #cbd5e1',
          background: '#ffffff'
        }} className="no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText size={20} color="#0284c7" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '900', margin: 0, color: '#070d1e' }}>
              {t.printBill} (EAGLE SILVERS INVOICE)
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={handlePrint} className="btn-mobile" style={{ background: '#ea580c', color: '#ffffff' }}>
              <Printer size={15} />
              <span>{lang === 'ta' ? 'அச்சிடு (Print)' : 'Print Now'}</span>
            </button>

            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* =========================================================================
            PRINTABLE RECEIPT CONTENT (Upright Calibri/Tamil Typography - Praise The Lord)
            ========================================================================= */}
        <div style={{ padding: '1.5rem', background: '#ffffff', color: '#000000', borderRadius: '0 0 16px 16px', fontFamily: "'Noto Sans Tamil', 'Calibri', 'Plus Jakarta Sans', sans-serif" }} id="printable-receipt">
          
          {/* Business Header with Official Eagle Silvers Wholesale Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2.5px solid #000000', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <img 
                src="/eagle-logo.svg" 
                alt="Eagle Silvers Wholesale Logo" 
                style={{ width: '64px', height: '64px', objectFit: 'contain' }}
              />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#0a2569' }}>
                  ✦ Praise The Lord ✦
                </div>
                <h1 style={{ fontSize: '1.65rem', fontWeight: '900', color: '#000000', margin: '0.1rem 0', fontStyle: 'normal' }}>
                  EAGLE SILVERS WHOLESALE
                </h1>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>
                  வெள்ளி கொலுசு, கம்மல், கிண்ணம், விளக்கு & ஆச்சாரி பட்டறை தயாரிப்புகள்
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                  தெற்கு மாசி வீதி, மதுரை, தமிழ்நாடு. | 📞 +91 98421 54321
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: '900', fontSize: '1rem', color: '#000000' }}>கணக்கு ரசீது</div>
              <div><strong>ரசீது எண்:</strong> EB-{Date.now().toString().slice(-6)}</div>
              <div><strong>தேதி:</strong> {formatDate(new Date().toISOString())}</div>
              <div><strong>வெள்ளி விலை:</strong> {formatCurrency(rates.ratePerGram)}/g</div>
            </div>

          </div>

          {/* Customer Info Box */}
          <div style={{ background: '#f8fafc', border: '1.5px solid #000000', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#64748b' }}>
                வாடிக்கையாளர் பெயர் (Customer):
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#000000' }}>
                {customer.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: '600' }}>
                📍 {customer.address || '-'} | 📞 {customer.phone || '-'}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{
                background: '#070d1e',
                color: '#ffffff',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: '800'
              }}>
                {t[customer.type] || 'Karigar / Wholesale'}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ background: '#070d1e', color: '#ffffff' }}>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'left' }}>#</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'left' }}>{t.date}</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'left' }}>{t.details}</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>{t.debitOut}</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>{t.creditIn}</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>{t.balanceGrams}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                  <td style={{ padding: '0.55rem 0.5rem', fontWeight: '700' }}>{i + 1}</td>
                  <td style={{ padding: '0.55rem 0.5rem', fontWeight: '600' }}>{formatDate(tx.date)}</td>
                  <td style={{ padding: '0.55rem 0.5rem' }}>
                    <strong style={{ color: '#000000' }}>{tx.itemName}</strong>
                    {tx.cashAmount ? (
                      <div style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: '700' }}>
                        ரொக்கம் {formatCurrency(tx.cashAmount)} ÷ {formatCurrency(tx.ratePerGram || currentRate)}/g = -{formatGrams(tx.creditGrams)}g
                      </div>
                    ) : null}
                  </td>
                  <td style={{ padding: '0.55rem 0.5rem', textAlign: 'right', fontWeight: '900', color: '#b91c1c' }}>
                    {tx.debitGrams > 0 ? `+${formatGrams(tx.debitGrams)} g` : '-'}
                  </td>
                  <td style={{ padding: '0.55rem 0.5rem', textAlign: 'right', fontWeight: '900', color: '#047857' }}>
                    {tx.creditGrams > 0 ? `-${formatGrams(tx.creditGrams)} g` : '-'}
                  </td>
                  <td style={{ padding: '0.55rem 0.5rem', textAlign: 'right', fontWeight: '900', color: '#000000' }}>
                    {formatGrams(Math.abs(tx.balanceAfterGrams))} g
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Balance Summary Box */}
          <div style={{
            background: '#ffffff',
            border: '2.5px solid #000000',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#000000', textTransform: 'uppercase', fontWeight: '900' }}>
                {lang === 'ta' ? 'இறுதி நிகர நிலுவை நிலை (Net Balance Due)' : 'Final Net Balance'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem', fontWeight: '600' }}>
                அன்றைய வெள்ளி சந்தை விலை ₹{currentRate}/g அடிப்படையில்
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#b91c1c' }}>
                {formatGrams(Math.abs(netBalanceGrams))} <span style={{ fontSize: '1.1rem' }}>g</span>
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#b45309' }}>
                ≈ {formatCurrency(approxRupees)}
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3.5rem', fontSize: '0.88rem', color: '#000000', fontWeight: '800' }}>
            <div>
              <div style={{ borderTop: '1.5px solid #000000', width: '160px', textAlign: 'center', paddingTop: '0.35rem' }}>
                வாடிக்கையாளர் கையொப்பம்
              </div>
            </div>
            <div>
              <div style={{ borderTop: '1.5px solid #000000', width: '180px', textAlign: 'center', paddingTop: '0.35rem' }}>
                EAGLE SILVERS (உரிமையாளர்)
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
