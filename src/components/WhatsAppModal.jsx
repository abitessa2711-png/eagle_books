import React, { useState, useRef } from 'react';
import { 
  X, 
  MessageSquare, 
  Copy, 
  Check, 
  Send, 
  Image, 
  Download, 
  FileText,
  Loader2 
} from 'lucide-react';
import { translations } from '../utils/translations';
import { formatGrams, formatCurrency, formatDate, generateWhatsAppMessage } from '../utils/calculations';
import { downloadFileUniversal } from '../utils/fileDownloader';

export function WhatsAppModal({
  lang,
  isOpen,
  onClose,
  customer,
  customerSummary,
  rates
}) {
  const t = translations[lang] || translations.ta;
  const [copied, setCopied] = useState(false);
  const [sharingImage, setSharingImage] = useState(false);
  const [downloadingImage, setDownloadingImage] = useState(false);
  const billCanvasRef = useRef(null);

  if (!isOpen || !customer || !customerSummary) return null;

  const currentRate = Number(rates?.ratePerGram) || 95;
  const transactions = customerSummary.transactions || [];
  const netBalanceGrams = Number(customerSummary.netBalanceGrams) || 0;
  
  const calculatedTotalDebit = transactions.reduce((acc, tx) => acc + (Number(tx.debitGrams) || 0), 0);
  const calculatedTotalCredit = transactions.reduce((acc, tx) => acc + (Number(tx.creditGrams) || 0), 0);
  
  const totalDebitGrams = Number(customerSummary.totalDebit ?? customerSummary.totalDebitGrams ?? calculatedTotalDebit);
  const totalCreditGrams = Number(customerSummary.totalCredit ?? customerSummary.totalCreditGrams ?? calculatedTotalCredit);

  const messageText = generateWhatsAppMessage(customer, customerSummary, currentRate, lang);
  const cleanPhone = customer.phone ? customer.phone.replace(/[^0-9]/g, '') : '';
  const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : (cleanPhone ? `91${cleanPhone}` : '');

  const todayStr = new Date().toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const loadHtml2Canvas = () => {
    return new Promise((resolve, reject) => {
      if (window.html2canvas) {
        resolve(window.html2canvas);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = () => resolve(window.html2canvas);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const handleSendBillImage = async () => {
    try {
      setSharingImage(true);
      const html2canvasLib = await loadHtml2Canvas();
      const billElement = document.getElementById('whatsapp-bill-canvas');
      if (!billElement) return;

      const canvas = await html2canvasLib(billElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const cleanName = (customer.name || 'Customer').replace(/[^a-zA-Z0-9_\-]/g, '_');
        const filename = `${cleanName}_EagleSilvers_Bill.png`;
        const file = new File([blob], filename, { type: 'image/png' });

        // 1. Try Native Web Share API with image file (Works on Mobile Web + Android App)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: `Eagle Silvers Bill - ${customer.name}`,
              text: `வணக்கம் ${customer.name}, ஈகிள் சில்வர்ஸ் வெள்ளி கணக்கு பில் இணைக்கப்பட்டுள்ளது.`
            });
            return;
          } catch (shareErr) {
            console.warn('Native share cancelled or unsupported:', shareErr);
          }
        }

        // 2. Universal File Saver + open WhatsApp
        await downloadFileUniversal(blob, filename, 'image/png');

        const greeting = `வணக்கம் ${customer.name}, ஈகிள் சில்வர்ஸ் வெள்ளி கணக்கு பில் படம் பதிவிறக்கப்பட்டது.`;
        const whatsappUrl = formattedPhone 
          ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(greeting)}`
          : `https://api.whatsapp.com/send?text=${encodeURIComponent(greeting)}`;
          
        window.open(whatsappUrl, '_blank');
      }, 'image/png');

    } catch (err) {
      console.error('Error sharing bill image:', err);
    } finally {
      setSharingImage(false);
    }
  };

  const handleDownloadBillImage = async () => {
    try {
      setDownloadingImage(true);
      const html2canvasLib = await loadHtml2Canvas();
      const billElement = document.getElementById('whatsapp-bill-canvas');
      if (!billElement) return;

      const canvas = await html2canvasLib(billElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const cleanName = (customer.name || 'Customer').replace(/[^a-zA-Z0-9_\-]/g, '_');
        const filename = `${cleanName}_EagleSilvers_Bill.png`;
        await downloadFileUniversal(blob, filename, 'image/png');
      }, 'image/png');

    } catch (err) {
      console.error('Error downloading bill image:', err);
    } finally {
      setDownloadingImage(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ padding: '0.5rem' }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '680px', 
          maxHeight: '94vh',
          borderRadius: '16px', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff'
        }}
      >
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.15rem',
          borderBottom: '1px solid #e2e8f0',
          background: 'linear-gradient(135deg, #090f24 0%, #1e293b 100%)',
          color: '#ffffff',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: '#16a34a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MessageSquare size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '900', margin: 0, color: '#ffffff' }}>
                {lang === 'ta' ? 'வாட்ஸ்அப் பில் பகிர்வு (Bill Image Share)' : 'WhatsApp Bill Image Share'}
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#86efac', fontWeight: '700' }}>
                {customer.name} ({customer.phone || 'No Phone'})
              </span>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body Container */}
        <div className="modal-body-scroll" style={{ padding: '1rem', flex: 1, overflowY: 'auto', background: '#f8fafc' }}>
          
          <div style={{ fontSize: '0.8rem', fontWeight: '900', color: '#16a34a', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Image size={16} />
            <span>{lang === 'ta' ? 'வாடிக்கையாளருக்கு அனுப்பப்படும் அதிகாரப்பூர்வ பில் படம்:' : 'Official Bill Image Preview for WhatsApp:'}</span>
          </div>

          {/* VISUAL BILL RECEIPT IMAGE CONTAINER (FOR HTML2CANVAS CONVERSION) */}
          <div 
            id="whatsapp-bill-canvas"
            ref={billCanvasRef}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1.5px solid #cbd5e1',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: '#0f172a',
              marginBottom: '1rem'
            }}
          >
            {/* 1. BRAND HEADER */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '3px double #ea580c',
              paddingBottom: '0.75rem',
              marginBottom: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <img 
                  src="/eagle-logo.png" 
                  alt="Eagle Silvers Logo" 
                  style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                />
                <div>
                  <h1 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#090f24', margin: 0 }}>
                    EAGLE SILVERS
                  </h1>
                  <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#ea580c', textTransform: 'uppercase' }}>
                    Wholesale & Retail Silver Merchants
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#475569', fontWeight: '700' }}>
                    8 - வடக்கு ரத வீதி, டவுன் போலீஸ் ஸ்டேஷன் ரோடு, சிவகாசி.
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: '900', color: '#0f172a' }}>
                  📞 81480 03454
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.2rem', fontWeight: '800' }}>
                  தேதி: {todayStr}
                </div>
              </div>
            </div>

            {/* 2. CUSTOMER INFO BOX */}
            <div style={{
              background: '#fff7ed',
              border: '1px solid #ffedd5',
              borderRadius: '8px',
              padding: '0.65rem 0.85rem',
              marginBottom: '0.85rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div>
                <div style={{ fontSize: '0.62rem', fontWeight: '900', color: '#c2410c', textTransform: 'uppercase' }}>
                  வாடிக்கையாளர் பில் அறிக்கை (RECEIPT BILL)
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#090f24', margin: '0.1rem 0 0 0' }}>
                  {customer.name}
                </h2>
                {customer.jewelleryShop && (
                  <div style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: '800' }}>
                    🏬 {customer.jewelleryShop}
                  </div>
                )}
              </div>

              <div style={{ fontSize: '0.72rem', color: '#334155', fontWeight: '700', textAlign: 'right' }}>
                {customer.phone && <div>📱 {customer.phone}</div>}
                <div>வெள்ளி விலை: <strong>₹{currentRate}/g</strong></div>
              </div>
            </div>

            {/* 3. TRANSACTION TABLE */}
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.75rem',
              marginBottom: '0.85rem'
            }}>
              <thead>
                <tr style={{ background: '#090f24', color: '#ffffff' }}>
                  <th style={{ padding: '0.45rem 0.35rem', textAlign: 'center', border: '1px solid #1e293b', width: '30px' }}>#</th>
                  <th style={{ padding: '0.45rem 0.35rem', textAlign: 'left', border: '1px solid #1e293b', width: '75px' }}>தேதி</th>
                  <th style={{ padding: '0.45rem 0.35rem', textAlign: 'left', border: '1px solid #1e293b' }}>பொருள் / நகை</th>
                  <th style={{ padding: '0.45rem 0.35rem', textAlign: 'right', border: '1px solid #1e293b', width: '60px' }}>எடை(g)</th>
                  <th style={{ padding: '0.45rem 0.35rem', textAlign: 'center', border: '1px solid #1e293b', width: '45px' }}>டச் %</th>
                  <th style={{ padding: '0.45rem 0.35rem', textAlign: 'right', border: '1px solid #1e293b', color: '#fca5a5', width: '75px' }}>+பற்று(g)</th>
                  <th style={{ padding: '0.45rem 0.35rem', textAlign: 'right', border: '1px solid #1e293b', color: '#6ee7b7', width: '75px' }}>-வரவு(g)</th>
                  <th style={{ padding: '0.45rem 0.35rem', textAlign: 'right', border: '1px solid #1e293b', width: '80px' }}>இருப்பு(g)</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, idx) => (
                  <tr key={tx.id || idx} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.4rem 0.3rem', textAlign: 'center', fontWeight: '700', color: '#64748b' }}>{idx + 1}</td>
                    <td style={{ padding: '0.4rem 0.3rem', fontWeight: '700', whiteSpace: 'nowrap' }}>{formatDate(tx.date)}</td>
                    <td style={{ padding: '0.4rem 0.3rem', fontWeight: '800' }}>{tx.itemName || tx.type}</td>
                    <td style={{ padding: '0.4rem 0.3rem', textAlign: 'right', fontWeight: '700' }}>{tx.weight ? formatGrams(tx.weight) : '-'}</td>
                    <td style={{ padding: '0.4rem 0.3rem', textAlign: 'center', fontWeight: '700' }}>{tx.touchPercent ? `${tx.touchPercent}%` : '-'}</td>
                    <td style={{ padding: '0.4rem 0.3rem', textAlign: 'right', fontWeight: '900', color: '#dc2626' }}>{tx.debitGrams > 0 ? `+${formatGrams(tx.debitGrams)}` : '-'}</td>
                    <td style={{ padding: '0.4rem 0.3rem', textAlign: 'right', fontWeight: '900', color: '#059669' }}>{tx.creditGrams > 0 ? `-${formatGrams(tx.creditGrams)}` : '-'}</td>
                    <td style={{ padding: '0.4rem 0.3rem', textAlign: 'right', fontWeight: '900', color: '#090f24' }}>{formatGrams(Math.abs(tx.balanceAfterGrams))}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 4. TOTALS & NET BALANCE */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f1f5f9',
              border: '1.5px solid #090f24',
              borderRadius: '8px',
              padding: '0.65rem 0.85rem',
              gap: '0.65rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.62rem', fontWeight: '800', color: '#dc2626' }}>மொத்த பற்று (+GIVE)</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#dc2626' }}>+{formatGrams(totalDebitGrams)} g</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.62rem', fontWeight: '800', color: '#059669' }}>மொத்த வரவு (-GET)</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#059669' }}>-{formatGrams(totalCreditGrams)} g</div>
                </div>
              </div>

              <div style={{
                background: netBalanceGrams > 0.001 ? '#fef2f2' : '#ecfdf5',
                border: netBalanceGrams > 0.001 ? '1.5px solid #dc2626' : '1.5px solid #059669',
                borderRadius: '6px',
                padding: '0.45rem 0.85rem',
                textAlign: 'right'
              }}>
                <div style={{ fontSize: '0.65rem', fontWeight: '900', color: netBalanceGrams > 0.001 ? '#dc2626' : '#059669' }}>
                  {netBalanceGrams > 0.001 ? 'நிகர நிலுவை இருப்பு:' : 'முன்வைப்பு இருப்பு:'}
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: '900', color: netBalanceGrams > 0.001 ? '#dc2626' : '#059669' }}>
                  {formatGrams(Math.abs(netBalanceGrams))} g
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#475569' }}>
                  சுமார் {formatCurrency(Math.abs(netBalanceGrams) * currentRate)}
                </div>
              </div>
            </div>

            {/* 5. FOOTER SIGNATURE */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: '1.25rem',
              paddingTop: '0.5rem',
              borderTop: '1px dashed #cbd5e1',
              fontSize: '0.65rem',
              color: '#64748b'
            }}>
              <div>EAGLE BOOKS • கணினி ரசீது பில்</div>
              <div style={{ textAlign: 'right', color: '#090f24', fontWeight: '900' }}>
                For EAGLE SILVERS<br/><br/>
                ____________________<br/>
                (உரிமையாளர் ஒப்பம்)
              </div>
            </div>

          </div>

          {/* ACTION BUTTON BAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            
            {/* Primary Button: Send Bill Image via WhatsApp */}
            <button
              type="button"
              onClick={handleSendBillImage}
              disabled={sharingImage}
              style={{
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.75rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: '900',
                cursor: sharingImage ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                width: '100%'
              }}
            >
              <Send size={18} />
              <span>{sharingImage ? (lang === 'ta' ? 'பில் படம் உருவாக்கப்படுகிறது...' : 'Generating Bill Image...') : (lang === 'ta' ? '📲 WhatsApp-ல் பில் படம் அனுப்பவும்' : 'Send Bill Image to WhatsApp')}</span>
            </button>

            {/* Secondary Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleDownloadBillImage}
                disabled={downloadingImage}
                className="btn btn-outline"
                style={{
                  flex: 1,
                  background: '#ffffff',
                  border: '1.5px solid #059669',
                  color: '#059669',
                  fontWeight: '800',
                  padding: '0.6rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                <Download size={15} />
                <span>{downloadingImage ? 'பதிவிறங்குகிறது...' : (lang === 'ta' ? '📸 பில் படம் பதிவிறக்கு' : 'Download Bill Photo')}</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="btn btn-outline"
                style={{
                  flex: 1,
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  color: '#334155',
                  fontWeight: '800',
                  padding: '0.6rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {copied ? <Check size={15} color="#16a34a" /> : <Copy size={15} />}
                <span>{copied ? (lang === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (lang === 'ta' ? 'உரை செய்தி நகலெடு' : 'Copy Text')}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
