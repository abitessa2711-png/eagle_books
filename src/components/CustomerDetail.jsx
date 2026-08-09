import React from 'react';
import { 
  PlusCircle, 
  RefreshCw, 
  Banknote, 
  BookOpen, 
  Printer, 
  MessageSquare, 
  Trash2, 
  Phone, 
  MapPin, 
  Edit3, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileText, 
  Scale, 
  CheckCircle2,
  Calendar,
  Share2
} from 'lucide-react';
import { translations } from '../utils/translations';
import { formatGrams, formatCurrency, formatDate } from '../utils/calculations';

export function CustomerDetail({
  lang,
  customer,
  customerSummary,
  rates,
  onOpenTransactionModal,
  onOpenReceiptModal,
  onOpenWhatsAppModal,
  onDeleteTransaction,
  onDeleteCustomer,
  onToggleViewMode
}) {
  const t = translations[lang];

  if (!customer) {
    return (
      <div className="glass-card" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#64748b' }}>
        <BookOpen size={48} color="#475569" style={{ margin: '0 auto 1rem auto' }} />
        <h3>{t.selectCustomerPrompt}</h3>
      </div>
    );
  }

  const { transactions = [], netBalanceGrams = 0, status = 'SETTLED' } = customerSummary;
  const currentRate = Number(rates.ratePerGram) || 95;
  const approxRupees = Math.abs(netBalanceGrams) * currentRate;

  const isDue = netBalanceGrams > 0.001;
  const isAdvance = netBalanceGrams < -0.001;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Customer Header & Balance Banner */}
      <div 
        className="glass-card" 
        style={{
          padding: '1.5rem',
          background: isDue 
            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(19, 27, 46, 0.95) 100%)'
            : isAdvance 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(19, 27, 46, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(19, 27, 46, 0.95) 100%)',
          border: isDue 
            ? '1.5px solid rgba(239, 68, 68, 0.4)' 
            : isAdvance 
            ? '1.5px solid rgba(16, 185, 129, 0.4)' 
            : '1.5px solid rgba(59, 130, 246, 0.4)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          
          {/* Customer Bio */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                {customer.name}
              </h2>
              <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                {t[customer.type] || customer.type || t.typeRetail}
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem', marginTop: '0.5rem' }}>
              {customer.phone && (
                <a 
                  href={`tel:${customer.phone}`}
                  style={{ fontSize: '0.88rem', color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Phone size={14} />
                  {customer.phone}
                </a>
              )}

              {customer.address && (
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={14} />
                  {customer.address}
                </span>
              )}
            </div>

            {customer.notes && (
              <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.4rem', fontStyle: 'italic' }}>
                📌 {customer.notes}
              </p>
            )}
          </div>

          {/* Big Balance Box */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1rem 1.5rem',
            textAlign: 'right',
            minWidth: '220px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              letterSpacing: '0.04em',
              color: isDue ? '#fca5a5' : isAdvance ? '#6ee7b7' : '#93c5fd'
            }}>
              {isDue ? t.statusDue : isAdvance ? t.statusAdvance : t.statusSettled}
            </span>

            <div style={{
              fontSize: '2.1rem',
              fontWeight: '900',
              color: isDue ? '#f87171' : isAdvance ? '#34d399' : '#60a5fa',
              marginTop: '0.2rem',
              lineHeight: 1.1
            }}>
              {formatGrams(Math.abs(netBalanceGrams))} <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>g</span>
            </div>

            <div style={{ fontSize: '0.9rem', color: '#fbbf24', fontWeight: '700', marginTop: '0.35rem' }}>
              ≈ {formatCurrency(approxRupees)}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
              (@ {formatCurrency(currentRate)}/g)
            </div>
          </div>

        </div>

        {/* Action Toolbar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.6rem',
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          
          {/* Button 1: New Silver Issue (Debit) */}
          <button
            onClick={() => onOpenTransactionModal('NEW_SALE')}
            className="btn btn-red btn-sm"
          >
            <ArrowUpRight size={16} />
            <span>➕ {t.newSilverSale}</span>
          </button>

          {/* Button 2: Old Silver Return (Credit) */}
          <button
            onClick={() => onOpenTransactionModal('OLD_SILVER')}
            className="btn btn-green btn-sm"
          >
            <ArrowDownLeft size={16} />
            <span>🔄 {t.oldSilverIn}</span>
          </button>

          {/* Button 3: Cash to Gram Conversion (Credit) */}
          <button
            onClick={() => onOpenTransactionModal('CASH_PAYMENT')}
            className="btn btn-gold btn-sm"
          >
            <Banknote size={16} />
            <span>💵 {t.cashPayment}</span>
          </button>

          {/* Button 4: Direct Ledger Entry */}
          <button
            onClick={() => onOpenTransactionModal('DIRECT_ADJUST')}
            className="btn btn-outline btn-sm"
          >
            <PlusCircle size={15} />
            <span>📝 {t.directEntry}</span>
          </button>

          {/* Right utility buttons */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            
            {/* View Notebook Toggle */}
            <button
              onClick={onToggleViewMode}
              className="btn btn-sm btn-outline"
              style={{ borderColor: '#f59e0b', color: '#fbbf24' }}
              title={t.viewNotebook}
            >
              <BookOpen size={15} />
              <span>{lang === 'ta' ? 'நோட்புக் ஏடு' : 'Notebook'}</span>
            </button>

            {/* Print Bill */}
            <button
              onClick={() => onOpenReceiptModal(customer.id)}
              className="btn btn-sm btn-outline"
              title={t.printBill}
            >
              <Printer size={15} />
              <span>{lang === 'ta' ? 'ரசீது' : 'Bill'}</span>
            </button>

            {/* WhatsApp Share */}
            <button
              onClick={() => onOpenWhatsAppModal(customer.id)}
              className="btn btn-sm"
              style={{ background: '#10b981', color: '#ffffff' }}
              title={t.whatsappShare}
            >
              <MessageSquare size={15} />
              <span>WhatsApp</span>
            </button>

            {/* Delete Customer */}
            <button
              onClick={() => onDeleteCustomer(customer.id)}
              className="btn btn-sm btn-outline"
              style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              title={t.delete}
            >
              <Trash2 size={15} />
            </button>

          </div>

        </div>

      </div>

      {/* Transaction History - Khatabook Ledger Table */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
            {lang === 'ta' ? 'பரிவர்த்தனை விவரங்கள் (Khatabook Entries)' : 'Transaction Ledger'}
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {transactions.length} {lang === 'ta' ? 'பதிவுகள்' : 'entries'}
          </span>
        </div>

        {transactions.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
            <FileText size={36} color="#475569" style={{ margin: '0 auto 0.75rem auto' }} />
            <p>{t.noTransactions}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 0.6rem' }}>{t.date}</th>
                  <th style={{ padding: '0.75rem 0.6rem' }}>{t.details}</th>
                  <th style={{ padding: '0.75rem 0.6rem', textAlign: 'right', color: '#f87171' }}>
                    {t.debitOut}
                  </th>
                  <th style={{ padding: '0.75rem 0.6rem', textAlign: 'right', color: '#34d399' }}>
                    {t.creditIn}
                  </th>
                  <th style={{ padding: '0.75rem 0.6rem', textAlign: 'right', color: '#fbbf24' }}>
                    {t.cashRupees}
                  </th>
                  <th style={{ padding: '0.75rem 0.6rem', textAlign: 'right' }}>
                    {t.balanceGrams}
                  </th>
                  <th style={{ padding: '0.75rem 0.6rem', textAlign: 'center' }}>
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const isOpening = tx.type === 'OPENING_BALANCE';
                  const isNew = tx.type === 'NEW_SALE';
                  const isOld = tx.type === 'OLD_SILVER';
                  const isCash = tx.type === 'CASH_PAYMENT';

                  return (
                    <tr 
                      key={tx.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'background 0.15s'
                      }}
                    >
                      {/* Date */}
                      <td style={{ padding: '0.75rem 0.6rem', color: '#cbd5e1', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={13} color="#94a3b8" />
                          {formatDate(tx.date)}
                        </div>
                      </td>

                      {/* Details / Item name */}
                      <td style={{ padding: '0.75rem 0.6rem' }}>
                        <div style={{ fontWeight: '600', color: '#f1f5f9' }}>
                          {tx.itemName || tx.type}
                        </div>
                        {tx.notes && (
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                            {tx.notes}
                          </div>
                        )}
                        {isCash && (
                          <div style={{ fontSize: '0.72rem', color: '#fbbf24', marginTop: '0.15rem' }}>
                            💡 {formatCurrency(tx.cashAmount)} ÷ {formatCurrency(tx.ratePerGram || currentRate)}/g
                            {tx.isTouchAdjusted ? ` × ${tx.touchPercent}%` : ''} = {formatGrams(tx.creditGrams)}g
                          </div>
                        )}
                      </td>

                      {/* Debit (New Items / You Gave) */}
                      <td style={{ padding: '0.75rem 0.6rem', textAlign: 'right', fontWeight: '700', color: '#f87171' }}>
                        {tx.debitGrams > 0 ? `+${formatGrams(tx.debitGrams)} g` : '-'}
                      </td>

                      {/* Credit (Old Silver / Cash Converted) */}
                      <td style={{ padding: '0.75rem 0.6rem', textAlign: 'right', fontWeight: '700', color: '#34d399' }}>
                        {tx.creditGrams > 0 ? `-${formatGrams(tx.creditGrams)} g` : '-'}
                      </td>

                      {/* Cash Amount */}
                      <td style={{ padding: '0.75rem 0.6rem', textAlign: 'right', fontWeight: '600', color: '#fbbf24' }}>
                        {tx.cashAmount ? formatCurrency(tx.cashAmount) : '-'}
                      </td>

                      {/* Running Balance Grams */}
                      <td style={{ padding: '0.75rem 0.6rem', textAlign: 'right', fontWeight: '800' }}>
                        <span style={{
                          color: tx.balanceAfterGrams > 0.001 
                            ? '#f87171' 
                            : tx.balanceAfterGrams < -0.001 
                            ? '#34d399' 
                            : '#94a3b8'
                        }}>
                          {formatGrams(Math.abs(tx.balanceAfterGrams))} g
                        </span>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          {tx.balanceAfterGrams > 0.001 ? '(Dr)' : tx.balanceAfterGrams < -0.001 ? '(Cr)' : '(Nil)'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.75rem 0.6rem', textAlign: 'center' }}>
                        <button
                          onClick={() => onDeleteTransaction(tx.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#64748b',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            borderRadius: '4px',
                            transition: 'color 0.15s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                          title={t.delete}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
