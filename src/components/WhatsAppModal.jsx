import React, { useState } from 'react';
import { X, MessageSquare, Copy, Check, Send, Sparkles } from 'lucide-react';
import { translations } from '../utils/translations';
import { generateWhatsAppMessage, formatGrams, formatCurrency } from '../utils/calculations';

export function WhatsAppModal({
  lang,
  isOpen,
  onClose,
  customer,
  customerSummary,
  rates
}) {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);

  if (!isOpen || !customer) return null;

  const currentRate = Number(rates.ratePerGram) || 95;
  const messageText = generateWhatsAppMessage(customer, customerSummary, currentRate, lang);

  const cleanPhone = customer.phone ? customer.phone.replace(/[^0-9]/g, '') : '';
  const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageText)}`;

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
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        
        {/* Header */}
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
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MessageSquare size={18} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
              {t.whatsappShare}
            </h3>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Message Preview Box */}
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            {lang === 'ta' 
              ? 'வாடிக்கையாளருக்கு அனுப்பப்படும் வாட்ஸ்அப் செய்தி முன்னோட்டம்:' 
              : 'WhatsApp Statement Message Preview:'}
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '1.25rem',
            fontFamily: 'inherit',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            color: '#f1f5f9',
            whiteSpace: 'pre-wrap'
          }}>
            {messageText}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={handleCopy}
              className="btn btn-outline"
            >
              {copied ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
              <span>{copied ? (lang === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : t.shareText}</span>
            </button>

            {customer.phone && (
              <button
                type="button"
                onClick={handleSend}
                className="btn btn-green"
              >
                <Send size={16} />
                <span>{lang === 'ta' ? 'வாட்ஸ்அப்பில் அனுப்புக' : 'Send to WhatsApp'}</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
