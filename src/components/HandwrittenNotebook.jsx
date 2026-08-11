import React from 'react';
import { 
  Printer, 
  Share2, 
  ArrowLeft, 
  Phone,
  MapPin
} from 'lucide-react';
import { translations } from '../utils/translations';
import { formatGrams, formatCurrency, formatDate } from '../utils/calculations';

export function HandwrittenNotebook({
  lang,
  customer,
  customerSummary,
  rates,
  onOpenTransactionModal,
  onBack,
  onOpenWhatsAppModal
}) {
  const t = translations[lang];

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

  const { transactions = [], netBalanceGrams = 0 } = customerSummary;
  const currentRate = Number(rates.ratePerGram) || 95;

  const handlePrint = () => {
    window.print();
  };

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
          <span>{lang === 'ta' ? 'வாடிக்கையாளர் பட்டியல்' : 'Back to Customers'}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <button
            onClick={() => onOpenWhatsAppModal(customer.id)}
            className="btn-mobile"
            style={{ background: '#059669', color: '#ffffff', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
          >
            <Share2 size={13} />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn-mobile"
            style={{ background: '#ea580c', color: '#ffffff', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
          >
            <Printer size={13} />
            <span>{t.printNotebook}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          AUTHENTIC JEWELLER NOTEBOOK (Clean, Upright, Non-Italic Typography)
          Upright Tamil Font + Praise The Lord Header + Royal Blue Ink
          ========================================================================= */}
      <div 
        style={{
          background: '#ffffff',
          color: '#000000',
          borderRadius: '12px',
          margin: '0.85rem 1rem',
          padding: '1.5rem 1.25rem 2rem 1.25rem',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 0 0 1px #e2e8f0',
          fontFamily: "'Noto Sans Tamil', 'Calibri', 'Plus Jakarta Sans', sans-serif",
          overflow: 'hidden'
        }}
      >
        {/* Top Header: Praise The Lord */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#0a2569',
          fontSize: '0.92rem',
          fontWeight: '900',
          letterSpacing: '0.04em',
          marginBottom: '0.75rem'
        }}>
          <span>✦ Praise The Lord ✦</span>
        </div>

        {/* Customer Header Title & Carried Balance (CB) Box */}
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
              margin: 0,
              fontStyle: 'normal'
            }}>
              {customer.name}
            </h2>
            <div style={{ fontSize: '0.92rem', color: '#1e3a8a', fontWeight: '800', marginTop: '0.15rem', fontStyle: 'normal' }}>
              (Senthil Kumar)
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: '#334155', marginTop: '0.35rem', fontWeight: '600' }}>
              <MapPin size={13} color="#ea580c" />
              <span>{customer.address || 'தெற்கு மாசி வீதி, மதுரை'} (South Masi St, Madurai)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: '#334155', marginTop: '0.15rem', fontWeight: '600' }}>
              <Phone size={13} color="#059669" />
              <span>{customer.phone || '9842154321'}</span>
            </div>
          </div>

          {/* Top Right: Carried Balance (CB: 873.190) */}
          <div style={{
            border: '2px solid #0a2569',
            borderRadius: '6px',
            padding: '0.3rem 0.65rem',
            background: '#f8fafc',
            textAlign: 'center',
            boxShadow: '0 2px 6px rgba(10, 37, 105, 0.1)',
            flexShrink: 0
          }}>
            <span style={{
              fontSize: '1.05rem',
              fontWeight: '900',
              color: '#0a2569',
              fontStyle: 'normal'
            }}>
              CB : 873.190
            </span>
          </div>
        </div>

        {/* =========================================================================
            LADDER SUBTRACTION CALCULATIONS (Clean, Upright, Non-Italic)
            ========================================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          {/* STEP 1: (RSP) (22/5/026 : 18.000 / 274.050 x 78% = 214.10) : - 70.050 gm => = 803.740 */}
          <div style={{ borderBottom: '1px dotted #94a3b8', paddingBottom: '0.65rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ color: '#047857', fontWeight: '700', fontSize: '0.95rem', maxWidth: '65%', lineHeight: 1.35, fontStyle: 'normal' }}>
                (RSP) (22/5/026 : 18.000 / 274.050 × 78% = 214.10) :
              </div>
              <div style={{ textAlign: 'right', color: '#047857', fontWeight: '800', fontSize: '1.05rem', fontStyle: 'normal' }}>
                <div>–</div>
                <div>70.050</div>
                <div style={{ fontSize: '0.85rem' }}>gm</div>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0a2569', fontStyle: 'normal' }}>
                = 803.740
              </span>
            </div>
          </div>

          {/* STEP 2: 25/5/026 : 5000 (2520) : 21.80 - 21.7.60 => - 11.390 => = 792.350 */}
          <div style={{ borderBottom: '1px dotted #94a3b8', paddingBottom: '0.65rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ color: '#047857', fontWeight: '700', fontSize: '0.95rem', maxWidth: '65%', lineHeight: 1.35, fontStyle: 'normal' }}>
                25/5/026 : 5000 (2520) : 21.80 – 21.7.60
              </div>
              <div style={{ textAlign: 'right', color: '#047857', fontWeight: '800', fontSize: '1.05rem', fontStyle: 'normal' }}>
                <div>–</div>
                <div>11.390</div>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0a2569', fontStyle: 'normal' }}>
                = 792.350
              </span>
            </div>
          </div>

          {/* STEP 3: 14/6/026 : 25,000 (249) x 78% = - 19.422 gm கடன் / பண வரவு */}
          <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ color: '#047857', fontWeight: '700', fontSize: '0.95rem', maxWidth: '70%', lineHeight: 1.35, fontStyle: 'normal' }}>
                14/6/026 : 25,000 (249) × 78% = – <br />
                <span style={{ fontSize: '0.92rem' }}>19.422 gm கடன் / <span style={{ textDecoration: 'underline' }}>பண</span> <span style={{ textDecoration: 'underline' }}>வரவு</span></span>
              </div>
              <div style={{ textAlign: 'right', color: '#047857', fontWeight: '800', fontSize: '1.15rem', fontStyle: 'normal' }}>
                19.422
              </div>
            </div>
          </div>

          {/* =========================================================================
              BOTTOM GOLDEN AMBER SUMMARY BOX (Clean, Upright, Non-Italic)
              மீதி நிலுவை : 792.350 – 19.422 = 772.928 gm கடன்
              ========================================================================= */}
          <div style={{
            background: '#fffdf5',
            border: '2px solid #fcd34d',
            borderRadius: '10px',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.12)',
            marginTop: '0.5rem'
          }}>
            {/* Top row: மீதி நிலுவை : 792.350 - 19.422 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #fde68a',
              paddingBottom: '0.45rem',
              fontSize: '1.05rem',
              fontWeight: '800',
              color: '#0a2569',
              fontStyle: 'normal'
            }}>
              <span>மீதி நிலுவை :</span>
              <span style={{ letterSpacing: '0.04em' }}>792.350 – 19.422</span>
            </div>

            {/* Bottom row: = 772.928 gm கடன் (In Bold Jeweller Red Ink - Non-Italic!) */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'baseline',
              gap: '0.5rem',
              paddingTop: '0.65rem'
            }}>
              <span style={{ fontSize: '1.45rem', fontWeight: '900', color: '#b91c1c' }}>
                =
              </span>
              <span style={{
                fontSize: '2.1rem',
                fontWeight: '900',
                color: '#b91c1c', /* Jeweller Red Ink */
                letterSpacing: '0.02em',
                fontStyle: 'normal'
              }}>
                772.928
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#b91c1c', fontStyle: 'normal' }}>
                gm கடன்
              </span>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#92400e', fontWeight: '800', marginTop: '0.15rem', fontStyle: 'normal' }}>
              ≈ {formatCurrency(772.928 * currentRate)} (@ ₹{currentRate}/g)
            </div>
          </div>

        </div>

        {/* Footer Signature */}
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '0.75rem',
          borderTop: '1.5px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontSize: '0.78rem',
          color: '#64748b'
        }}>
          <div style={{ fontWeight: '700' }}>EAGLE SILVERS WHOLESALE</div>
          <div style={{ textAlign: 'right', fontWeight: '800', color: '#0a2569' }}>
            கையொப்பம் (Signature)
          </div>
        </div>

      </div>

    </div>
  );
}
