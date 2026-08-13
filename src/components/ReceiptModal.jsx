import React, { useState } from 'react';
import { X, Printer, FileText, Share2, MessageSquare } from 'lucide-react';
import { translations } from '../utils/translations';
import { formatGrams, formatCurrency, formatDate, generateWhatsAppMessage } from '../utils/calculations';

export function ReceiptModal({
  lang,
  isOpen,
  onClose,
  customer,
  customerSummary,
  rates
}) {
  const t = translations[lang] || translations.ta;

  if (!isOpen || !customer) return null;

  const { transactions = [], netBalanceGrams = 0, totalDebit = 0, totalCredit = 0 } = customerSummary || {};
  const currentRate = Number(rates?.ratePerGram) || 95;
  const approxRupees = Math.abs(netBalanceGrams) * currentRate;

  const handlePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.error('Print trigger error:', err);
    }
  };

  const handleWhatsAppShare = () => {
    const msg = generateWhatsAppMessage(customer, customerSummary, currentRate, lang);
    const cleanPhone = customer.phone ? customer.phone.replace(/[^0-9]/g, '') : '';
    const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : (cleanPhone ? `91${cleanPhone}` : '');
    const whatsappUrl = formattedPhone 
      ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        
        {/* Modal Controls (No-Print) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.1rem 1.35rem',
          borderBottom: '1.5px solid #cbd5e1',
          background: '#ffffff'
        }} className="no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText size={20} color="#ea580c" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0, color: '#070d1e' }}>
              {lang === 'ta' ? 'கணக்கு ரசீது (EAGLE SILVERS INVOICE)' : 'Invoice Receipt (EAGLE SILVERS)'}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={handleWhatsAppShare} 
              className="btn-mobile" 
              style={{ background: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.45rem 0.75rem', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
            >
              <MessageSquare size={15} />
              <span>{lang === 'ta' ? 'வாட்ஸ்அப்' : 'WhatsApp'}</span>
            </button>

            <button 
              onClick={handlePrint} 
              className="btn-mobile" 
              style={{ background: '#ea580c', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.45rem 0.75rem', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
            >
              <Printer size={15} />
              <span>{lang === 'ta' ? 'அச்சிடு (Print)' : 'Print'}</span>
            </button>

            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', padding: '0.3rem' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* =========================================================================
            PRINTABLE RECEIPT CONTENT (Matching Visiting Card & Authentic Invoice)
            ========================================================================= */}
        <div style={{ padding: '1.5rem', background: '#ffffff', color: '#000000', borderRadius: '0 0 16px 16px', fontFamily: "'Noto Sans Tamil', 'Plus Jakarta Sans', sans-serif" }} id="printable-receipt" className="printable-receipt-area">
          
          {/* Business Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2.5px solid #000000', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <img 
                src="/eagle-logo.png" 
                alt="Eagle Silvers Logo" 
                style={{ width: '60px', height: '60px', objectFit: 'contain' }}
              />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#0a2569', letterSpacing: '0.05em' }}>
                  ✦ Praise The Lord ✦
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#000000', margin: '0.1rem 0' }}>
                  EAGLE SILVERS
                </h1>
                <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#b45309' }}>
                  Wholesale & Retail Shop
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginTop: '0.15rem' }}>
                  வெள்ளி கொலுசு, பாம்பே கொலுசு, மெட்டி, பாம்பே கொடி, முத்தூணாங்கொடி, தண்ட கொலுசு
                </div>
                <div style={{ fontSize: '0.74rem', color: '#475569', fontWeight: '600' }}>
                  📍 8 - வடக்கு ரத வீதி, டவுன் போலீஸ் ஸ்டேஷன் ரோடு, சிவகாசி. | 📞 81480 03454, 73391 60876
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.82rem' }}>
              <div style={{ fontWeight: '900', fontSize: '0.95rem', color: '#000000', textTransform: 'uppercase' }}>
                {lang === 'ta' ? 'கணக்கு ரசீது' : 'STATEMENT INVOICE'}
              </div>
              <div style={{ marginTop: '0.2rem' }}><strong>ரசீது எண்:</strong> EB-{Date.now().toString().slice(-6)}</div>
              <div><strong>தேதி:</strong> {formatDate(new Date().toISOString())}</div>
              <div><strong>வெள்ளி விலை:</strong> {formatCurrency(currentRate)}/g</div>
            </div>

          </div>

          {/* Customer Info Box */}
          <div style={{ background: '#f8fafc', border: '1.5px solid #000000', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#64748b' }}>
                வாடிக்கையாளர் பெயர் (Customer Name):
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#000000', marginTop: '0.1rem' }}>
                {customer.name}
              </div>
              {customer.address && (
                <div style={{ fontSize: '0.82rem', color: '#334155', fontWeight: '600', marginTop: '0.15rem' }}>
                  📍 {customer.address}
                </div>
              )}
            </div>

            {customer.phone && (
              <div style={{ textAlign: 'right', fontSize: '0.88rem', fontWeight: '700', color: '#000000' }}>
                📞 {customer.phone}
              </div>
            )}
          </div>

          {/* Itemized Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: '#090f24', color: '#ffffff', textAlign: 'left' }}>
                <th style={{ padding: '0.55rem 0.65rem', border: '1px solid #000000' }}>வ.எண்</th>
                <th style={{ padding: '0.55rem 0.65rem', border: '1px solid #000000' }}>தேதி</th>
                <th style={{ padding: '0.55rem 0.65rem', border: '1px solid #000000' }}>விவரம்</th>
                <th style={{ padding: '0.55rem 0.65rem', border: '1px solid #000000', textAlign: 'right' }}>பற்று (+) g</th>
                <th style={{ padding: '0.55rem 0.65rem', border: '1px solid #000000', textAlign: 'right' }}>வரவு (-) g</th>
                <th style={{ padding: '0.55rem 0.65rem', border: '1px solid #000000', textAlign: 'right' }}>இருப்பு g</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '1.5rem', textAlign: 'center', border: '1px solid #cbd5e1', color: '#64748b' }}>
                    பரிவர்த்தனைகள் எதுவும் பதிவு செய்யப்படவில்லை
                  </td>
                </tr>
              ) : (
                transactions.map((tx, idx) => (
                  <tr key={tx.id || idx} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={{ padding: '0.45rem 0.65rem', border: '1px solid #cbd5e1', textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ padding: '0.45rem 0.65rem', border: '1px solid #cbd5e1', whiteSpace: 'nowrap' }}>{formatDate(tx.date)}</td>
                    <td style={{ padding: '0.45rem 0.65rem', border: '1px solid #cbd5e1' }}>
                      <div style={{ fontWeight: '700' }}>{tx.itemName || '-'}</div>
                      {tx.cashAmount ? (
                        <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '800' }}>
                          ரொக்கம்: {formatCurrency(tx.cashAmount)} @ ₹{tx.ratePerGram || currentRate}/g {tx.touchPercent && tx.touchPercent < 100 ? `(${tx.touchPercent}% Touch)` : ''}
                        </div>
                      ) : null}
                    </td>
                    <td style={{ padding: '0.45rem 0.65rem', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: '800', color: tx.debitGrams > 0 ? '#dc2626' : '#94a3b8' }}>
                      {tx.debitGrams > 0 ? `+${formatGrams(tx.debitGrams)}` : '-'}
                    </td>
                    <td style={{ padding: '0.45rem 0.65rem', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: '800', color: tx.creditGrams > 0 ? '#059669' : '#94a3b8' }}>
                      {tx.creditGrams > 0 ? `-${formatGrams(tx.creditGrams)}` : '-'}
                    </td>
                    <td style={{ padding: '0.45rem 0.65rem', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: '900' }}>
                      {formatGrams(Math.abs(tx.balanceAfterGrams))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Grand Balance Box */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', border: '2px solid #000000', borderRadius: '8px', padding: '0.85rem 1rem', background: '#f8fafc' }}>
            <div style={{ fontSize: '0.82rem', lineHeight: '1.6' }}>
              <div><strong>மொத்த பற்று (Total Out):</strong> {formatGrams(totalDebit)} g</div>
              <div><strong>மொத்த வரவு (Total In):</strong> {formatGrams(totalCredit)} g</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                * கணக்கீடுகள் அனைத்தும் சிவகாசி சில்வர் சந்தை விதிகளின்படி துல்லியமாக பதிவு செய்யப்பட்டுள்ளன.
              </div>
            </div>

            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '800', color: netBalanceGrams > 0.001 ? '#dc2626' : '#059669' }}>
                {netBalanceGrams > 0.001 ? 'மீதி தர வேண்டியது (Due):' : 'முன்வைப்பு (Advance):'}
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: '900', color: netBalanceGrams > 0.001 ? '#dc2626' : '#059669' }}>
                {formatGrams(Math.abs(netBalanceGrams))} g
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#334155' }}>
                ≈ {formatCurrency(approxRupees)}
              </div>
            </div>
          </div>

          {/* Signature Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px dashed #94a3b8', fontSize: '0.8rem' }}>
            <div>வாடிக்கையாளர் கையொப்பம்</div>
            <div style={{ textAlign: 'right', fontWeight: '800' }}>
              EAGLE SILVERS நிர்வாகத்திற்காக
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
