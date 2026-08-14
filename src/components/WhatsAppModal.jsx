import React, { useState } from 'react';
import { X, MessageSquare, Copy, Check, Send } from 'lucide-react';
import { translations } from '../utils/translations';
import { generateWhatsAppMessage } from '../utils/calculations';

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

  if (!isOpen || !customer) return null;

  const currentRate = Number(rates?.ratePerGram) || 95;
  const messageText = generateWhatsAppMessage(customer, customerSummary, currentRate, lang);

  const cleanPhone = customer.phone ? customer.phone.replace(/[^0-9]/g, '') : '';
  const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : (cleanPhone ? `91${cleanPhone}` : '');
  const whatsappUrl = formattedPhone 
    ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageText)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSend = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', borderRadius: '16px', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.1rem 1.35rem',
          borderBottom: '1px solid #e2e8f0',
          background: 'linear-gradient(135deg, #090f24 0%, #1e293b 100%)',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#16a34a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MessageSquare size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0, color: '#ffffff' }}>
                {lang === 'ta' ? 'வாட்ஸ்அப் கணக்கு அறிக்கை' : 'WhatsApp Statement Share'}
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#86efac', fontWeight: '700' }}>
                {customer.name} ({customer.phone || 'No Phone'})
              </span>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Message Preview Box */}
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', background: '#ffffff' }}>
          
          <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#475569' }}>
            {lang === 'ta' 
              ? 'வாடிக்கையாளருக்கு அனுப்பப்படும் தெளிவான செய்தி முன்னோட்டம்:' 
              : 'WhatsApp Statement Message Preview:'}
          </div>

          <div style={{
            background: '#f8fafc',
            border: '1.5px solid #cbd5e1',
            borderRadius: '10px',
            padding: '1rem',
            fontFamily: 'monospace, sans-serif',
            fontSize: '0.85rem',
            lineHeight: '1.5',
            color: '#0f172a',
            whiteSpace: 'pre-wrap',
            maxHeight: '340px',
            overflowY: 'auto'
          }}>
            {messageText}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.35rem' }}>
            <button
              type="button"
              onClick={handleCopy}
              className="btn btn-outline"
              style={{ border: '1.5px solid #cbd5e1', color: '#334155', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              {copied ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
              <span>{copied ? (lang === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (lang === 'ta' ? 'நகலெடு (Copy)' : 'Copy Text')}</span>
            </button>

            <button
              type="button"
              onClick={handleSend}
              className="btn btn-green"
              style={{ background: '#16a34a', color: '#ffffff', fontWeight: '900', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
            >
              <Send size={16} />
              <span>{lang === 'ta' ? 'வாட்ஸ்அப்பில் அனுப்புக' : 'Send to WhatsApp'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
