import React, { useRef, useState } from 'react';
import { 
  Printer, 
  Download, 
  X, 
  FileText
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
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !customer || !customerSummary) return null;

  const currentRate = Number(rates?.ratePerGram) || 95;
  const transactions = customerSummary.transactions || [];
  const netBalanceGrams = Number(customerSummary.netBalanceGrams) || 0;

  // Calculate robust totals for Debit (+GIVE) and Credit (-GET)
  const calculatedTotalDebit = transactions.reduce((acc, tx) => acc + (Number(tx.debitGrams) || 0), 0);
  const calculatedTotalCredit = transactions.reduce((acc, tx) => acc + (Number(tx.creditGrams) || 0), 0);

  const totalDebitGrams = Number(
    customerSummary.totalDebit !== undefined 
      ? customerSummary.totalDebit 
      : (customerSummary.totalDebitGrams !== undefined ? customerSummary.totalDebitGrams : calculatedTotalDebit)
  );

  const totalCreditGrams = Number(
    customerSummary.totalCredit !== undefined 
      ? customerSummary.totalCredit 
      : (customerSummary.totalCreditGrams !== undefined ? customerSummary.totalCreditGrams : calculatedTotalCredit)
  );

  const todayStr = new Date().toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const loadHtml2Pdf = () => {
    return new Promise((resolve, reject) => {
      if (window.html2pdf) {
        resolve(window.html2pdf);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => resolve(window.html2pdf);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      const html2pdfLib = await loadHtml2Pdf();
      const element = document.getElementById('printable-receipt');
      const cleanName = (customer.name || 'Customer').replace(/[^a-zA-Z0-9_\-]/g, '_');

      const opt = {
        margin:       [6, 6, 6, 6],
        filename:     `${cleanName}_EagleBooks_Ledger.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdfLib().set(opt).from(element).save();
    } catch (err) {
      console.warn('HTML2PDF error, using native print fallback:', err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ padding: '0.5rem' }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '94vh',
          borderRadius: '16px',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
        }}
      >
        
        {/* Top Action Bar (Screen Only - Hidden during print) */}
        <div className="no-print" style={{
          background: 'linear-gradient(135deg, #090f24 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          borderBottom: '2px solid #ea580c',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(234, 88, 12, 0.2)',
              color: '#f97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: '900', margin: 0, color: '#ffffff' }}>
                {lang === 'ta' ? 'வாடிக்கையாளர் PDF அறிக்கை' : 'Customer PDF Ledger Report'}
              </h3>
              <span style={{ fontSize: '0.7rem', color: '#cbd5e1', fontWeight: '700' }}>
                {customer.name} {customer.jewelleryShop ? `• ${customer.jewelleryShop}` : ''}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}>
            {/* Direct 1-Click PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.4rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: '800',
                cursor: downloading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
              }}
            >
              <Download size={14} />
              <span>{downloading ? (lang === 'ta' ? 'பதிவிறங்குகிறது...' : 'Downloading...') : (lang === 'ta' ? 'PDF டவுன்லோட்' : 'Download PDF')}</span>
            </button>

            {/* Print Fallback Button */}
            <button
              onClick={handlePrintPdf}
              style={{
                background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.4rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
              }}
            >
              <Printer size={14} />
              <span>{lang === 'ta' ? 'பிரிண்ட்' : 'Print'}</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable PDF Document Shell */}
        <div 
          className="modal-body-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0.75rem',
            background: '#f8fafc'
          }}
        >
          <div 
            id="printable-receipt"
            ref={printRef}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '1.25rem',
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
              paddingBottom: '0.85rem',
              marginBottom: '1rem',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img 
                  src="/eagle-logo.png" 
                  alt="Eagle Silvers Logo" 
                  style={{ width: '54px', height: '54px', objectFit: 'contain' }}
                />
                <div>
                  <h1 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#090f24', margin: 0, letterSpacing: '0.02em' }}>
                    EAGLE SILVERS
                  </h1>
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#ea580c', textTransform: 'uppercase' }}>
                    Wholesale & Retail Silver Merchants
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: '700', marginTop: '0.15rem', lineHeight: '1.2' }}>
                    8 - வடக்கு ரத வீதி, டவுன் போலீஸ் ஸ்டேஷன் ரோடு, சிவகாசி.
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right', marginLeft: 'auto' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '900', color: '#0f172a' }}>
                  📞 81480 03454
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: '900', color: '#0f172a' }}>
                  📞 73391 60876
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem', fontWeight: '800' }}>
                  தேதி: {todayStr}
                </div>
              </div>
            </div>

            {/* 2. REPORT TITLE & CUSTOMER DETAILS BOX */}
            <div style={{
              background: '#fff7ed',
              border: '1.5px solid #ffedd5',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: '900', color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  வாடிக்கையாளர் கணக்கு அறிக்கை (CUSTOMER STATEMENT)
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#090f24', margin: '0.15rem 0 0 0' }}>
                  {customer.name}
                </h2>
                {customer.jewelleryShop && (
                  <div style={{ fontSize: '0.85rem', color: '#ea580c', fontWeight: '800', marginTop: '0.1rem' }}>
                    🏬 {customer.jewelleryShop}
                  </div>
                )}
              </div>

              <div style={{ fontSize: '0.78rem', color: '#334155', fontWeight: '700', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
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
            <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.78rem',
                minWidth: '580px'
              }}>
                <thead>
                  <tr style={{ background: '#090f24', color: '#ffffff' }}>
                    <th style={{ padding: '0.55rem 0.4rem', textAlign: 'center', border: '1px solid #1e293b', width: '35px' }}>#</th>
                    <th style={{ padding: '0.55rem 0.4rem', textAlign: 'left', border: '1px solid #1e293b', width: '85px' }}>தேதி</th>
                    <th style={{ padding: '0.55rem 0.4rem', textAlign: 'left', border: '1px solid #1e293b' }}>விவரம் / நகை பெயர்</th>
                    <th style={{ padding: '0.55rem 0.4rem', textAlign: 'right', border: '1px solid #1e293b', width: '70px' }}>எடை (g)</th>
                    <th style={{ padding: '0.55rem 0.4rem', textAlign: 'center', border: '1px solid #1e293b', width: '50px' }}>டச் %</th>
                    <th style={{ padding: '0.55rem 0.4rem', textAlign: 'right', border: '1px solid #1e293b', color: '#fca5a5', width: '80px' }}>+பற்று (g)</th>
                    <th style={{ padding: '0.55rem 0.4rem', textAlign: 'right', border: '1px solid #1e293b', color: '#6ee7b7', width: '80px' }}>-வரவு (g)</th>
                    <th style={{ padding: '0.55rem 0.4rem', textAlign: 'right', border: '1px solid #1e293b', width: '90px' }}>இருப்பு (g)</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ padding: '1.25rem', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
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
                          <td style={{ padding: '0.5rem 0.4rem', textAlign: 'center', fontWeight: '700', color: '#64748b' }}>{idx + 1}</td>
                          <td style={{ padding: '0.5rem 0.4rem', fontWeight: '700', whiteSpace: 'nowrap' }}>{formatDate(tx.date)}</td>
                          <td style={{ padding: '0.5rem 0.4rem', fontWeight: '800' }}>
                            <div>{tx.itemName || tx.type}</div>
                            {isCash && tx.cashAmount && (
                              <div style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: '700' }}>
                                💵 {formatCurrency(tx.cashAmount)} @ ₹{tx.ratePerGram || currentRate}/g
                              </div>
                            )}
                            {tx.notes && <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{tx.notes}</div>}
                          </td>
                          <td style={{ padding: '0.5rem 0.4rem', textAlign: 'right', fontWeight: '700' }}>
                            {tx.weight ? `${formatGrams(tx.weight)}` : '-'}
                          </td>
                          <td style={{ padding: '0.5rem 0.4rem', textAlign: 'center', fontWeight: '700' }}>
                            {tx.touchPercent ? `${tx.touchPercent}%` : '-'}
                          </td>
                          <td style={{ padding: '0.5rem 0.4rem', textAlign: 'right', fontWeight: '900', color: '#dc2626' }}>
                            {tx.debitGrams > 0 ? `+${formatGrams(tx.debitGrams)}` : '-'}
                          </td>
                          <td style={{ padding: '0.5rem 0.4rem', textAlign: 'right', fontWeight: '900', color: '#059669' }}>
                            {tx.creditGrams > 0 ? `-${formatGrams(tx.creditGrams)}` : '-'}
                          </td>
                          <td style={{ padding: '0.5rem 0.4rem', textAlign: 'right', fontWeight: '900', color: '#090f24' }}>
                            {formatGrams(Math.abs(tx.balanceAfterGrams))}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* 4. SUMMARY TOTALS & NET BALANCE BOX */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f1f5f9',
              border: '2px solid #090f24',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              gap: '0.85rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#dc2626', textTransform: 'uppercase' }}>மொத்த பற்று (+GIVE)</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#dc2626' }}>+{formatGrams(totalDebitGrams)} g</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase' }}>மொத்த வரவு (-GET)</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#059669' }}>-{formatGrams(totalCreditGrams)} g</div>
                </div>
              </div>

              <div style={{
                background: netBalanceGrams > 0.001 ? '#fef2f2' : '#ecfdf5',
                border: netBalanceGrams > 0.001 ? '2px solid #dc2626' : '2px solid #059669',
                borderRadius: '8px',
                padding: '0.55rem 1rem',
                textAlign: 'right',
                marginLeft: 'auto'
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: '900', color: netBalanceGrams > 0.001 ? '#dc2626' : '#059669' }}>
                  {netBalanceGrams > 0.001 ? 'நிகர நிலுவை இருப்பு (Net Balance Due):' : 'முன்வைப்பு இருப்பு (Advance Balance):'}
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: '900', color: netBalanceGrams > 0.001 ? '#dc2626' : '#059669' }}>
                  {formatGrams(Math.abs(netBalanceGrams))} g
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#475569', marginTop: '0.1rem' }}>
                  மதிப்பு: சுமார் {formatCurrency(Math.abs(netBalanceGrams) * currentRate)}
                </div>
              </div>
            </div>

            {/* 5. FOOTER SIGNATURE & STAMP */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: '2rem',
              paddingTop: '0.85rem',
              borderTop: '1px dashed #cbd5e1',
              fontSize: '0.72rem',
              color: '#64748b',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                * கணக்கு அறிக்கையில் சந்தேகம் இருப்பின் உடனடியாகத் தொடர்பு கொள்ளவும்.<br/>
                EAGLE BOOKS • கணினி ரசீது (Computer Generated Statement)
              </div>

              <div style={{ textAlign: 'right', color: '#090f24', fontWeight: '900', marginLeft: 'auto' }}>
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
