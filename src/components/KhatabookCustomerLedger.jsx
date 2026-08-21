import React from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  MessageSquare, 
  BookOpen, 
  Printer, 
  Trash2, 
  Calendar, 
  FileText, 
  ArrowUpRight, 
  ArrowDownLeft,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={onBack}
            className="breadcrumb-back-btn"
            title="Back to Customer List"
          >
            <ArrowLeft size={14} />
            <span>{lang === 'ta' ? 'பட்டியல்' : 'Back'}</span>
          </button>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#fbbf24', fontWeight: '800', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {customer.name.split('/')[0]}
          </span>
        </div>

        {/* Previous / Next Customer Flip Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={() => prevCustomer && onSelectCustomer(prevCustomer.id)}
            disabled={!prevCustomer}
            style={{
              background: prevCustomer ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              padding: '0.2rem 0.45rem',
              color: prevCustomer ? '#ffffff' : '#475569',
              cursor: prevCustomer ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.72rem',
              fontWeight: '700'
            }}
            title={prevCustomer ? `Previous: ${prevCustomer.name}` : ''}
          >
            <ChevronLeft size={14} />
            <span>{lang === 'ta' ? 'முந்தைய' : 'Prev'}</span>
          </button>

          <button
            onClick={() => nextCustomer && onSelectCustomer(nextCustomer.id)}
            disabled={!nextCustomer}
            style={{
              background: nextCustomer ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              padding: '0.2rem 0.45rem',
              color: nextCustomer ? '#ffffff' : '#475569',
              cursor: nextCustomer ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.72rem',
              fontWeight: '700'
            }}
            title={nextCustomer ? `Next: ${nextCustomer.name}` : ''}
          >
            <span>{lang === 'ta' ? 'அடுத்த' : 'Next'}</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* 2. CUSTOMER PROFILE CARD */}
      <div className="customer-profile-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#000000', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span>{customer.name}</span>
              {customer.jewelleryShop && (
                <span style={{ fontSize: '0.82rem', color: '#ea580c', fontWeight: '800', background: '#fff7ed', padding: '0.15rem 0.5rem', borderRadius: '6px', border: '1px solid #ffedd5' }}>
                  🏬 {customer.jewelleryShop}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.2rem', fontWeight: '700' }}>
              📍 {customer.address || '-'} • 📞 {customer.phone || '-'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '900',
              color: isDue ? '#dc2626' : isAdvance ? '#059669' : '#000000'
            }}>
              {formatGrams(Math.abs(netBalanceGrams))} <span style={{ fontSize: '0.85rem' }}>g</span>
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#b45309' }}>
              ≈ {formatCurrency(approxRupees)}
            </div>
          </div>
        </div>

        {/* Action Quick Buttons */}
        <div className="customer-profile-actions">
          <button onClick={onOpenNotebookView} className="profile-action-pill" style={{ background: '#fffbeb', color: '#b45309', borderColor: '#fde68a' }}>
            <BookOpen size={14} />
            <span>{lang === 'ta' ? 'நோட்புக்' : 'Notebook'}</span>
          </button>

          <button onClick={() => onOpenReceiptModal(customer.id)} className="profile-action-pill">
            <Printer size={14} />
            <span>{lang === 'ta' ? 'ரசீது' : 'Bill'}</span>
          </button>

          <button onClick={() => onOpenWhatsAppModal(customer.id)} className="profile-action-pill" style={{ background: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}>
            <MessageSquare size={14} />
            <span>WhatsApp</span>
          </button>

          {customer.phone && (
            <a href={`tel:${customer.phone}`} className="profile-action-pill" style={{ background: '#f0f9ff', color: '#0369a1', borderColor: '#bae6fd' }}>
              <Phone size={14} />
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
            <UserX size={14} />
            <span>{lang === 'ta' ? 'நீக்கு' : 'Delete'}</span>
          </button>
        </div>
      </div>

      {/* 3. TRANSACTION HISTORY TIMELINE */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.45rem', padding: '0.5rem 0 1rem 0' }}>
        {transactions.length === 0 ? (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: '#475569' }}>
            <FileText size={36} color="#cbd5e1" style={{ margin: '0 auto 0.75rem auto' }} />
            <p style={{ fontSize: '0.9rem', fontWeight: '800', color: '#000000' }}>{t.noTransactions}</p>
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
                <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>
                    <Calendar size={13} />
                    <span>{formatDate(tx.date)}</span>
                    {tx.notes && <span style={{ color: '#94a3b8' }}>• {tx.notes}</span>}
                  </div>

                  <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#000000', marginTop: '0.15rem' }}>
                    {tx.itemName || tx.type}
                  </div>

                  {isCash && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#92400e',
                      background: '#fef3c7',
                      border: '1px solid #fde68a',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      marginTop: '0.25rem',
                      fontWeight: '800',
                      display: 'inline-block'
                    }}>
                      💵 {formatCurrency(tx.cashAmount)} @ ₹{tx.ratePerGram || currentRate}/g {tx.touchPercent && tx.touchPercent < 100 ? `(${tx.touchPercent}%)` : ''} = -{formatGrams(tx.creditGrams)}g
                    </div>
                  )}

                  {!isCash && tx.touchPercent && Number(tx.touchPercent) < 100 && Number(tx.weight) > 0 && (
                    <div style={{
                      fontSize: '0.74rem',
                      color: isNew ? '#991b1b' : '#047857',
                      background: isNew ? '#fef2f2' : '#ecfdf5',
                      border: isNew ? '1px solid #fca5a5' : '1px solid #6ee7b7',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      marginTop: '0.25rem',
                      fontWeight: '800',
                      display: 'inline-block'
                    }}>
                      ⭐ மொத்த எடை: {formatGrams(tx.weight)}g @ {tx.touchPercent}% டச் = <strong>{isNew ? '+' : '-'}{formatGrams(isNew ? tx.debitGrams : tx.creditGrams)}g நயம்</strong>
                    </div>
                  )}

                  <div style={{ fontSize: '0.72rem', color: '#000000', fontWeight: '800', marginTop: '0.25rem' }}>
                    {lang === 'ta' ? 'இருப்பு:' : 'Balance:'} {formatGrams(Math.abs(tx.balanceAfterGrams))} g
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <div style={{
                    fontSize: '1.15rem',
                    fontWeight: '900',
                    color: isNew ? '#dc2626' : '#059669'
                  }}>
                    {isNew ? `+${formatGrams(tx.debitGrams)} g` : `-${formatGrams(tx.creditGrams)} g`}
                  </div>

                  {tx.cashAmount && (
                    <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#b45309' }}>
                      {formatCurrency(tx.cashAmount)}
                    </div>
                  )}

                  <button
                    onClick={() => onDeleteTransaction(tx.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '0.2rem',
                      marginTop: '0.35rem'
                    }}
                    title={t.delete}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. BOTTOM ACTION BUTTONS (YOU GAVE / YOU GOT) */}
      <div className="sticky-bottom-actions no-print">
        <button
          onClick={onOpenGiveModal}
          className="btn-khatabook-gave"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowUpRight size={18} />
            <span>{lang === 'ta' ? 'நீங்கள் கொடுத்தது' : 'YOU GAVE'}</span>
          </div>
          <span style={{ fontSize: '0.72rem', opacity: 0.95, fontWeight: '700' }}>
            {lang === 'ta' ? '(புதிய நகை / கொலுசு +g)' : '(New Silver Issue +g)'}
          </span>
        </button>

        <button
          onClick={onOpenGetModal}
          className="btn-khatabook-got"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowDownLeft size={18} />
            <span>{lang === 'ta' ? 'நீங்கள் பெற்றது' : 'YOU GOT'}</span>
          </div>
          <span style={{ fontSize: '0.72rem', opacity: 0.95, fontWeight: '700' }}>
            {lang === 'ta' ? '(ரொக்கம் / பழையது -g)' : '(Cash / Old Silver -g)'}
          </span>
        </button>
      </div>

    </div>
  );
}
