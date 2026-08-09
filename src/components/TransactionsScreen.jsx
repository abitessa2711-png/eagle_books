import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Menu, 
  MoreVertical, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  FileText, 
  Calendar,
  Share2
} from 'lucide-react';
import { translations } from '../utils/translations';
import { formatGrams, formatCurrency, formatDate } from '../utils/calculations';

export function TransactionsScreen({
  lang,
  customer,
  customerSummary,
  allTransactions = [],
  rates,
  onBack,
  onOpenReceiptModal,
  onOpenGiveModal,
  onOpenGetModal,
  onOpenWhatsAppModal
}) {
  const t = translations[lang];
  const currentRate = Number(rates.ratePerGram) || 95;

  const transactions = customer ? (customerSummary?.transactions || []) : allTransactions;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: '20px' }}>
      
      {/* 1. VIBRANT ORANGE HEADER (Matches Screen 2 of Mockup) */}
      <div className="vibrant-orange-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button 
            onClick={onBack}
            className="header-icon-btn"
            title="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="header-title-text">
            <span>{lang === 'ta' ? 'Payments & Transactio...' : 'Payments & Transactio...'}</span>
          </div>
        </div>

        <button 
          onClick={onBack}
          className="header-icon-btn"
          title="Menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* 2. PAYMENT METHODS BOX (Matches Screen 2 of Mockup) */}
      <div className="payment-methods-box">
        <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#000000' }}>
          Payment Methods
        </div>

        <div className="accepted-methods-border-frame">
          <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#047857', textAlign: 'center', marginBottom: '0.65rem' }}>
            Accepted Payment Methods
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            {/* Cash */}
            <div className="payment-method-tile" onClick={onOpenGetModal}>
              <div style={{ color: '#059669', fontSize: '1.25rem', fontWeight: '900' }}>
                💵
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0f172a' }}>Cash</span>
            </div>

            {/* Card / Bank */}
            <div className="payment-method-tile" onClick={onOpenGetModal}>
              <div style={{ color: '#0284c7', fontSize: '1.25rem', fontWeight: '900' }}>
                💳
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0f172a' }}>Card</span>
            </div>

            {/* Online UPI */}
            <div className="payment-method-tile" onClick={onOpenGetModal}>
              <div style={{ color: '#7c3aed', fontSize: '1.25rem', fontWeight: '900' }}>
                📱
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0f172a' }}>Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RECENT TRANSACTIONS HEADER */}
      <div style={{ padding: '0 1.15rem', marginTop: '0.35rem', marginBottom: '0.45rem' }}>
        <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#000000' }}>
          Recent Transactions
        </div>
      </div>

      {/* 4. RECENT TRANSACTIONS ROWS (Matches Screen 2 of Mockup) */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {transactions.length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b' }}>
            <p>{t.noTransactions}</p>
          </div>
        ) : (
          transactions.map((tx, idx) => {
            const isSale = tx.type === 'NEW_SALE' || tx.type === 'OPENING_BALANCE';
            const isRefund = tx.type === 'OLD_SILVER';
            const isCash = tx.type === 'CASH_PAYMENT';

            const badgeLabel = isSale ? 'Sale' : isRefund ? 'Refund' : 'Payment';
            const badgeColor = isSale ? '#059669' : isRefund ? '#dc2626' : '#d97706';
            const displayAmount = isSale 
              ? `+$${(tx.debitGrams * 0.1).toFixed(2)} (${formatGrams(tx.debitGrams)}g)` 
              : isRefund 
              ? `-$${(tx.creditGrams * 0.1).toFixed(2)} (-${formatGrams(tx.creditGrams)}g)` 
              : `${formatCurrency(tx.cashAmount)} (-${formatGrams(tx.creditGrams)}g)`;

            return (
              <div key={tx.id || idx} className="recent-transaction-row">
                <div>
                  <div style={{
                    fontSize: '0.95rem',
                    fontWeight: '900',
                    color: badgeColor,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    <span>{badgeLabel}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#334155', fontWeight: '700', marginTop: '0.1rem' }}>
                    {tx.itemName || (isSale ? 'Product A' : 'Service Fee')}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '0.95rem',
                      fontWeight: '900',
                      color: isSale ? '#0284c7' : isRefund ? '#dc2626' : '#059669'
                    }}>
                      {displayAmount}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>
                      {formatDate(tx.date)}
                    </div>
                  </div>

                  <button 
                    style={{ background: 'transparent', border: 'none', color: '#f59e0b', cursor: 'pointer', padding: '0.2rem' }}
                    title="Options"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. BIG ORANGE STATEMENT BUTTON (Matches Screen 2 of Mockup) */}
      <button 
        onClick={() => onOpenReceiptModal(customer?.id)}
        className="orange-statement-btn"
      >
        <span>View Account Statement</span>
      </button>

    </div>
  );
}
