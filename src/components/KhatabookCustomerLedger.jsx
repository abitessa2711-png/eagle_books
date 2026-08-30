import React from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  MessageSquare, 
  BookOpen, 
  Printer, 
  Calendar, 
  FileText, 
  UserX
} from 'lucide-react';
import { translations } from '../utils/translations';
import { formatGrams, formatCurrency, formatDate } from '../utils/calculations';

export function KhatabookCustomerLedger({
  lang,
  customer,
  allCustomers = [],
  customerSummary,
  rates,
  onBack,
  onSelectCustomer,
  onOpenGiveModal,
  onOpenGetModal,
  onOpenNotebookView,
  onOpenReceiptModal,
  onOpenWhatsAppModal,
  onOpenPdfModal,
  onDeleteTransaction,
  onDeleteCustomer
}) {
  const t = translations[lang];

  if (!customer) return null;

  const { transactions = [], netBalanceGrams = 0 } = customerSummary;
  const currentRate = Number(rates.ratePerGram) || 95;
  const approxRupees = Math.abs(netBalanceGrams) * currentRate;

  const isDue = netBalanceGrams > 0.001;
  const isAdvance = netBalanceGrams < -0.001;

  // Previous & Next Customer Navigation
  const currentIndex = allCustomers.findIndex((c) => c.id === customer.id);
  const prevCustomer = currentIndex > 0 ? allCustomers[currentIndex - 1] : null;
  const nextCustomer = currentIndex < allCustomers.length - 1 ? allCustomers[currentIndex + 1] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
      
      {/* 1. TOP BREADCRUMB STRIP */}
      <div className="ledger-top-breadcrumb">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <button
            onClick={onBack}
            className="breadcrumb-back-btn"
            title="Back to Customer List"
          >
            <ArrowLeft size={13} />
            <span>{lang === 'ta' ? 'பட்டியல்' : 'Back'}</span>
          </button>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#fbbf24', fontWeight: '800', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
            {customer.name.split('/')[0]}
          </span>
        </div>

        {/* Previous / Next Customer Flip Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button
            onClick={() => prevCustomer && onSelectCustomer(prevCustomer.id)}
            disabled={!prevCustomer}
            style={{
              background: prevCustomer ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              border: 'none',
              borderRadius: '5px',
              padding: '0.15rem 0.35rem',
              color: prevCustomer ? '#ffffff' : '#475569',
              cursor: prevCustomer ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: '0.15rem',
              fontSize: '0.68rem',
              fontWeight: '700'
            }}
            title={prevCustomer ? `Previous: ${prevCustomer.name}` : ''}
          >
            <ChevronLeft size={13} />
            <span>{lang === 'ta' ? 'முந்தைய' : 'Prev'}</span>
          </button>

          <button
            onClick={() => nextCustomer && onSelectCustomer(nextCustomer.id)}
            disabled={!nextCustomer}
            style={{
              background: nextCustomer ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              border: 'none',
              borderRadius: '5px',
              padding: '0.15rem 0.35rem',
              color: nextCustomer ? '#ffffff' : '#475569',
              cursor: nextCustomer ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: '0.15rem',
              fontSize: '0.68rem',
              fontWeight: '700'
            }}
            title={nextCustomer ? `Next: ${nextCustomer.name}` : ''}
          >
            <span>{lang === 'ta' ? 'அடுத்த' : 'Next'}</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* 2. CUSTOMER PROFILE CARD (Compact & Neat) */}
      <div className="customer-profile-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#000000', display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
              <span>{customer.name}</span>
              {customer.jewelleryShop && (
                <span style={{ fontSize: '0.72rem', color: '#ea580c', fontWeight: '800', background: '#fff7ed', padding: '0.1rem 0.35rem', borderRadius: '4px', border: '1px solid #ffedd5' }}>
                  🏬 {customer.jewelleryShop}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '0.1rem', fontWeight: '700' }}>
              📍 {customer.address || '-'} • 📞 {customer.phone || '-'}
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{
              fontSize: '1.2rem',
              fontWeight: '900',
              color: isDue ? '#dc2626' : isAdvance ? '#059669' : '#000000',
              lineHeight: '1.1'
            }}>
              {formatGrams(Math.abs(netBalanceGrams))} <span style={{ fontSize: '0.75rem' }}>g</span>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#b45309', marginTop: '0.05rem' }}>
              ≈ {formatCurrency(approxRupees)}
            </div>
          </div>
        </div>

        {/* Action Quick Buttons */}
        <div className="customer-profile-actions">
          {onOpenPdfModal && (
            <button onClick={() => onOpenPdfModal(customer.id)} className="profile-action-pill" style={{ background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe', fontWeight: '900' }}>
              <FileText size={13} />
              <span>{lang === 'ta' ? 'PDF அறிக்கை' : 'PDF Report'}</span>
            </button>
          )}

          <button onClick={onOpenNotebookView} className="profile-action-pill" style={{ background: '#fffbeb', color: '#b45309', borderColor: '#fde68a' }}>
            <BookOpen size={13} />
            <span>{lang === 'ta' ? 'நோட்புக்' : 'Notebook'}</span>
          </button>

          <button onClick={() => onOpenReceiptModal(customer.id)} className="profile-action-pill">
            <Printer size={13} />
            <span>{lang === 'ta' ? 'ரசீது' : 'Bill'}</span>
          </button>

          <button onClick={() => onOpenWhatsAppModal(customer.id)} className="profile-action-pill" style={{ background: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}>
            <MessageSquare size={13} />
            <span>WhatsApp</span>
          </button>

          {customer.phone && (
            <a href={`tel:${customer.phone}`} className="profile-action-pill" style={{ background: '#f0f9ff', color: '#0369a1', borderColor: '#bae6fd' }}>
              <Phone size={13} />
              <span>Call</span>
            </a>
          )}

          {/* Delete Customer Button */}
          <button 
            onClick={() => onDeleteCustomer(customer.id)} 
            className="profile-action-pill" 
            style={{ background: '#fef2f2', color: '#dc2626', borderColor: '#fca5a5' }}
            title={lang === 'ta' ? 'வாடிக்கையாளரை நீக்கு' : 'Delete Customer'}
          >
            <UserX size={13} />
            <span>{lang === 'ta' ? 'நீக்கு' : 'Delete'}</span>
          </button>
        </div>
      </div>

      {/* 3. TRANSACTION HISTORY TIMELINE */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem', padding: '0.35rem 0 2rem 0', overflowY: 'auto' }}>
        {transactions.length === 0 ? (
          <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#475569' }}>
            <FileText size={32} color="#cbd5e1" style={{ margin: '0 auto 0.5rem auto' }} />
            <p style={{ fontSize: '0.85rem', fontWeight: '800', color: '#000000' }}>{t.noTransactions}</p>
          </div>
        ) : (
          transactions.map((tx) => {
            const isNew = tx.type === 'NEW_SALE' || tx.type === 'OPENING_BALANCE';
            const isCash = tx.type === 'CASH_PAYMENT';

            return (
              <div
                key={tx.id}
                className={`tx-item-card ${isNew ? 'gave' : isCash ? 'cash' : 'got'}`}
              >
                <div style={{ flex: 1, paddingRight: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>
                    <Calendar size={12} />
                    <span>{formatDate(tx.date)}</span>
                    {tx.notes && <span style={{ color: '#94a3b8' }}>• {tx.notes}</span>}
                  </div>

                  <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#000000', marginTop: '0.1rem' }}>
                    {tx.itemName || tx.type}
                  </div>

                  {/* Weight, Touch %, and Net Silver Breakdown Pill */}
                  <div style={{
                    marginTop: '0.2rem',
                    display: 'inline-flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: isNew ? '#fef2f2' : isCash ? '#fefce8' : '#ecfdf5',
                    border: isNew ? '1px solid #fecaca' : isCash ? '1px solid #fef08a' : '1px solid #a7f3d0',
                    padding: '0.2rem 0.45rem',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: '800'
                  }}>
                    {tx.weight && (
                      <span style={{ color: '#1e293b' }}>
                        எடை: <strong>{formatGrams(tx.weight)}g</strong>
                      </span>
                    )}
                    {tx.touchPercent && (
                      <span style={{ color: '#475569' }}>
                        @ {tx.touchPercent}% டச்
                      </span>
                    )}
                    {tx.debitGrams > 0 && (
                      <span style={{ color: '#dc2626', fontWeight: '900' }}>
                        = +{formatGrams(tx.debitGrams)}g நயம்
                      </span>
                    )}
                    {tx.creditGrams > 0 && (
                      <span style={{ color: '#059669', fontWeight: '900' }}>
                        = -{formatGrams(tx.creditGrams)}g நயம்
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '900',
                    color: isNew ? '#dc2626' : '#059669'
                  }}>
                    {isNew ? `+${formatGrams(tx.debitGrams)} g` : `-${formatGrams(tx.creditGrams)} g`}
                  </div>

                  <div style={{ fontSize: '0.68rem', color: '#475569', fontWeight: '700' }}>
                    இருப்பு: {formatGrams(Math.abs(tx.balanceAfterGrams))} g
                  </div>

                  <button
                    onClick={() => onDeleteTransaction(tx.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '0.15rem',
                      marginTop: '0.1rem'
                    }}
                    title={t.deleteTx}
                  >
                    <UserX size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. STICKY BOTTOM ACTION BUTTONS (GIVE / GET) */}
      <div className="sticky-bottom-actions">
        <button
          onClick={onOpenGiveModal}
          className="btn-khatabook-gave"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>{lang === 'ta' ? 'நீங்கள் கொடுத்தது' : 'YOU GAVE'}</span>
          </div>
          <span style={{ fontSize: '0.68rem', opacity: 0.9, fontWeight: '700' }}>
            ({lang === 'ta' ? 'புதிய நகை / கொலுசு +g' : 'New Sale / Item +g'})
          </span>
        </button>

        <button
          onClick={onOpenGetModal}
          className="btn-khatabook-got"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>{lang === 'ta' ? 'நீங்கள் பெற்றது' : 'YOU GOT'}</span>
          </div>
          <span style={{ fontSize: '0.68rem', opacity: 0.9, fontWeight: '700' }}>
            ({lang === 'ta' ? 'ரொக்கம் / பழையது -g' : 'Cash / Old Silver -g'})
          </span>
        </button>
      </div>

    </div>
  );
}
