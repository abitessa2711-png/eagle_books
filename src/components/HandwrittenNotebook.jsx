import React from 'react';
import { 
  Printer, 
  Share2, 
  ArrowLeft, 
  Phone,
  MapPin,
  MessageSquare
} from 'lucide-react';
import { translations } from '../utils/translations';
import { formatGrams, formatCurrency, formatDate, generateWhatsAppMessage } from '../utils/calculations';

export function HandwrittenNotebook({
  lang,
  customer,
  customerSummary,
  rates,
  onOpenTransactionModal,
  onBack,
  onOpenWhatsAppModal
}) {
  const t = translations[lang] || translations.ta;

  if (!customer) {
    return (
      <div style={{ 
        padding: '4rem 1.5rem', 
        textAlign: 'center', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#fff7ed',
          border: '2px dashed #f97316',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ea580c'
        }}>
          <Phone size={26} />
        </div>
        <p style={{ fontWeight: '800', fontSize: '1rem', color: '#1e293b', margin: 0 }}>
          {lang === 'ta' ? 'வாடிக்கையாளரைத் தேர்வு செய்யவும்' : 'Select a Customer'}
        </p>
        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
          {lang === 'ta' ? 'நோட்புக் கணக்கு ஏட்டைப் பார்க்க வாடிக்கையாளர் பட்டியலிலிருந்து ஒருவரைத் தேர்வு செய்யவும்' : 'Please select a customer from the list to view their ledger notebook'}
        </p>
        <button onClick={onBack} className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '0.55rem 1.2rem', fontSize: '0.82rem' }}>
          <span>{lang === 'ta' ? 'வாடிக்கையாளர் பட்டியல்' : 'Go to Customers List'}</span>
        </button>
      </div>
    );
  }

  const { transactions = [], netBalanceGrams = 0 } = customerSummary || {};
  const currentRate = Number(rates?.ratePerGram) || 95;

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.error(e);
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

  // Find opening balance if any
  const openingTx = transactions.find(t => t.type === 'OPENING_BALANCE');
  const regularTxs = transactions.filter(t => t.type !== 'OPENING_BALANCE');
  const initialCB = openingTx ? Number(openingTx.weight) || 0 : (transactions[0]?.debitGrams || 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: '85px' }}>
      
      {/* 1. TOP ACTION RIBBON (No-Print) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 1rem',
        background: '#ffffff',
        borderBottom: '1.5px solid #cbd5e1',
        gap: '0.5rem'
      }} className="no-print">
        <button
          onClick={onBack}
          className="btn-mobile"
          style={{ background: '#090f24', color: '#ffffff', padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
        >
          <ArrowLeft size={15} />
          <span>{lang === 'ta' ? 'பட்டியல்' : 'Back'}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <button
            onClick={handleWhatsAppShare}
            className="btn-mobile"
            style={{ background: '#16a34a', color: '#ffffff', padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
            title="Share on WhatsApp"
          >
            <MessageSquare size={14} />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn-mobile"
            style={{ background: '#ea580c', color: '#ffffff', padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
            title="Print Notebook"
          >
            <Printer size={14} />
            <span>{lang === 'ta' ? 'அச்சிடு' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* 2. REALISTIC JEWELLER NOTEBOOK PAGE */}
      <div style={{
        margin: '0.85rem 1rem',
        background: '#fbfbf7', /* Natural Pale Ivory Paper */
        border: '2px solid #090f24',
        borderRadius: '10px',
        padding: '1.25rem',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        fontFamily: "'Noto Sans Tamil', 'Calibri', 'Plus Jakarta Sans', sans-serif"
      }} id="printable-notebook" className="printable-notebook-area">
        
        {/* Notebook Top Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2.5px solid #0a2569',
          paddingBottom: '0.65rem',
          marginBottom: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img 
              src="/eagle-logo.png" 
              alt="Eagle Logo" 
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                objectFit: 'contain',
                border: '1.5px solid #0a2569',
                background: '#ffffff'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.96rem', fontWeight: '900', color: '#0a2569', letterSpacing: '0.02em' }}>
                EAGLE SILVERS (சிவகாசி)
              </span>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700' }}>
                வெள்ளி கணக்கு ஏடு | 📞 81480 03454
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.76rem', color: '#0a2569', fontWeight: '800' }}>
            <div>வெள்ளி: ₹{currentRate}/g</div>
            <div>{formatDate(new Date().toISOString())}</div>
          </div>
        </div>

        {/* Customer Header Title & CB Box */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '2px solid #0a2569',
          paddingBottom: '0.75rem',
          marginBottom: '1rem',
          gap: '0.5rem'
        }}>
          <div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '900',
              color: '#0a2569', /* Royal Blue Ink */
              lineHeight: 1.2,
              margin: 0
            }}>
              {customer.name}
            </h2>

            {customer.address && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: '#334155', marginTop: '0.25rem', fontWeight: '600' }}>
                <MapPin size={13} color="#ea580c" />
                <span>{customer.address}</span>
              </div>
            )}

            {customer.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: '#334155', marginTop: '0.15rem', fontWeight: '600' }}>
                <Phone size={13} color="#059669" />
                <span>{customer.phone}</span>
              </div>
            )}
          </div>

          {/* Top Right: Carried Balance (CB) */}
          <div style={{
            border: '2px solid #0a2569',
            borderRadius: '6px',
            padding: '0.3rem 0.65rem',
            background: '#f8fafc',
            textAlign: 'center',
            boxShadow: '0 2px 6px rgba(10, 37, 105, 0.1)',
            flexShrink: 0
          }}>
            <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#64748b' }}>தொடக்க இருப்பு</div>
            <span style={{
              fontSize: '1.05rem',
              fontWeight: '900',
              color: '#0a2569'
            }}>
              CB : {formatGrams(initialCB)}
            </span>
          </div>
        </div>

        {/* =========================================================================
            LADDER SUBTRACTION CALCULATIONS (Dynamic running ledger from actual entries)
            ========================================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          {regularTxs.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b', fontStyle: 'italic', fontSize: '0.88rem' }}>
              பரிவர்த்தனைகள் எதுவும் பதிவு செய்யப்படவில்லை.
            </div>
          ) : (
            regularTxs.map((tx, idx) => {
              const isCredit = tx.creditGrams > 0;
              const isDebit = tx.debitGrams > 0;
              const txDate = formatDate(tx.date);
              const txTitle = tx.itemName || (isCredit ? 'வரவு' : 'பற்று');

              return (
                <div key={tx.id || idx} style={{ borderBottom: '1px dotted #94a3b8', paddingBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ color: isCredit ? '#047857' : '#b91c1c', fontWeight: '700', fontSize: '0.92rem', maxWidth: '70%', lineHeight: 1.35 }}>
                      <div>
                        {txDate} : {txTitle}
                      </div>
                      {tx.cashAmount ? (
                        <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: '800', marginTop: '0.1rem' }}>
                          ரொக்கம்: {formatCurrency(tx.cashAmount)} @ ₹{tx.ratePerGram || currentRate}/g {tx.touchPercent && tx.touchPercent < 100 ? `(${tx.touchPercent}% Touch)` : ''}
                        </div>
                      ) : (
                        tx.touchPercent && Number(tx.touchPercent) < 100 && Number(tx.weight) > 0 ? (
                          <div style={{ fontSize: '0.76rem', color: isCredit ? '#047857' : '#b91c1c', fontWeight: '800', marginTop: '0.1rem' }}>
                            எடை: {formatGrams(tx.weight)}g @ {tx.touchPercent}% டச் = {formatGrams(isCredit ? tx.creditGrams : tx.debitGrams)}g நயம்
                          </div>
                        ) : null
                      )}
                      {tx.notes && (
                        <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.1rem' }}>
                          {tx.notes}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ textAlign: 'right', color: isCredit ? '#047857' : '#b91c1c', fontWeight: '800', fontSize: '1.05rem' }}>
                      <div>{isCredit ? '–' : '+'}</div>
                      <div>{formatGrams(isCredit ? tx.creditGrams : tx.debitGrams)}</div>
                      <div style={{ fontSize: '0.78rem' }}>gm</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0a2569' }}>
                      = {formatGrams(Math.abs(tx.balanceAfterGrams))}
                    </span>
                  </div>
                </div>
              );
            })
          )}

          {/* FINAL GRAND BALANCE / DUE (கடைசி நிகர இருப்பு) */}
          <div style={{
            borderTop: '2.5px solid #0a2569',
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#0a2569' }}>
                {netBalanceGrams > 0.001 ? 'மீதி நிலுவை (Due Balance):' : 'முன்வைப்பு (Advance):'}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: '700' }}>
                மதிப்பு: சுமார் {formatCurrency(Math.abs(netBalanceGrams) * currentRate)}
              </div>
            </div>

            <div style={{
              fontSize: '1.45rem',
              fontWeight: '900',
              color: netBalanceGrams > 0.001 ? '#dc2626' : '#059669',
              border: '2px solid #0a2569',
              borderRadius: '6px',
              padding: '0.25rem 0.75rem',
              background: '#ffffff'
            }}>
              {formatGrams(Math.abs(netBalanceGrams))} g
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
