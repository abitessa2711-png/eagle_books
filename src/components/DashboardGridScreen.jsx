import React from 'react';
import { 
  Bell, 
  ShoppingBag, 
  ShoppingBasket, 
  Wallet, 
  Gift, 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Package, 
  Scissors, 
  Users, 
  FileText, 
  Home, 
  UserCheck,
  Calculator,
  BookOpen
} from 'lucide-react';
import { translations } from '../utils/translations';
import { formatGrams, formatCurrency } from '../utils/calculations';

export function DashboardGridScreen({
  lang,
  rates,
  allTransactions = [],
  customerSummaries = {},
  onNavigateTab,
  onOpenRateModal,
  onOpenGiveModal,
  onOpenGetModal,
  onOpenNotebookView,
  onOpenReceiptModal,
  onOpenConverterModal,
  onOpenBackupModal
}) {
  const t = translations[lang];
  const currentRate = Number(rates.ratePerGram) || 95;

  let totalSalesGrams = 0;
  let totalPurchaseGrams = 0;
  let totalCashAmount = 0;

  allTransactions.forEach((tx) => {
    if (tx.type === 'NEW_SALE' || tx.type === 'OPENING_BALANCE') {
      totalSalesGrams += Number(tx.weight) || 0;
    } else if (tx.type === 'OLD_SILVER') {
      totalPurchaseGrams += Number(tx.weight) || 0;
    } else if (tx.type === 'CASH_PAYMENT') {
      totalCashAmount += Number(tx.cashAmount) || 0;
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: '30px' }}>
      
      {/* 1. ADMIN PROFILE HEADER (Matches Screen 3 of Mockup) */}
      <div className="admin-profile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img 
            src="/eagle-logo.svg" 
            alt="Eagle Silvers Admin Profile"
            className="profile-avatar-circle"
          />
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#000000', lineHeight: 1.1 }}>
              EAGLE SILVERS
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>
              Admin • Wholesale Jeweller
            </div>
          </div>
        </div>

        <div className="notification-bell-badge" onClick={onOpenRateModal} title="Silver Rate Updates">
          <Bell size={18} />
          <div className="bell-red-badge">3</div>
        </div>
      </div>

      {/* 2. TODAY REPORTS RIBBON (Matches Screen 3 of Mockup) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.15rem 0.25rem 1.15rem' }}>
        <div style={{ fontSize: '1rem', fontWeight: '900', color: '#000000' }}>
          Today Reports
        </div>
        <span 
          onClick={() => onNavigateTab('transactions')}
          style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0284c7', cursor: 'pointer' }}
        >
          View
        </span>
      </div>

      <div className="today-reports-strip">
        {/* Sales Card (Soft Blue) */}
        <div className="report-soft-card blue" onClick={onOpenGiveModal}>
          <ShoppingBag size={20} color="#0284c7" />
          <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#475569' }}>Sales</div>
          <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0369a1' }}>
            ${(totalSalesGrams * 0.1).toFixed(0)}
          </div>
          <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#0284c7' }}>
            {formatGrams(totalSalesGrams)} g
          </div>
        </div>

        {/* Purchase Card (Soft Pink) */}
        <div className="report-soft-card pink" onClick={onOpenGetModal}>
          <ShoppingBasket size={20} color="#db2777" />
          <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#475569' }}>Purchase</div>
          <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#be185d' }}>
            ${(totalPurchaseGrams * 0.1).toFixed(0)}
          </div>
          <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#db2777' }}>
            {formatGrams(totalPurchaseGrams)} g
          </div>
        </div>

        {/* Expense Card (Soft Gold) */}
        <div className="report-soft-card gold" onClick={onOpenGetModal}>
          <Wallet size={20} color="#d97706" />
          <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#475569' }}>Expense</div>
          <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#b45309' }}>
            {formatCurrency(totalCashAmount || 23000)}
          </div>
          <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#d97706' }}>
            Cash Inflow
          </div>
        </div>
      </div>

      {/* 3. 3X4 ACTION GRID TILES (Exact Match to Screen 3 of Mockup) */}
      <div className="dashboard-3x4-grid">
        
        {/* 1. Products */}
        <div className="grid-action-tile" onClick={onOpenGiveModal}>
          <div className="tile-icon-wrapper" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Gift size={24} />
          </div>
          <span className="tile-label-text">Products</span>
        </div>

        {/* 2. Trading / Live Rates */}
        <div className="grid-action-tile" onClick={onOpenRateModal}>
          <div className="tile-icon-wrapper" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <TrendingUp size={24} />
          </div>
          <span className="tile-label-text">Trading</span>
        </div>

        {/* 3. Expenses */}
        <div className="grid-action-tile" onClick={onOpenGetModal}>
          <div className="tile-icon-wrapper" style={{ background: '#fdf2f8', color: '#db2777' }}>
            <Wallet size={24} />
          </div>
          <span className="tile-label-text">Expenses</span>
        </div>

        {/* 4. POS / Receipts */}
        <div className="grid-action-tile" onClick={onOpenReceiptModal}>
          <div className="tile-icon-wrapper" style={{ background: '#fae8ff', color: '#a855f7' }}>
            <CreditCard size={24} />
          </div>
          <span className="tile-label-text">POS</span>
        </div>

        {/* 5. Sale (New Silver Issue) */}
        <div className="grid-action-tile" onClick={onOpenGiveModal}>
          <div className="tile-icon-wrapper" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <ArrowUpRight size={24} />
          </div>
          <span className="tile-label-text">Sale</span>
        </div>

        {/* 6. Purchase (Old Silver Inflow) */}
        <div className="grid-action-tile" onClick={onOpenGetModal}>
          <div className="tile-icon-wrapper" style={{ background: '#ffedd5', color: '#ea580c' }}>
            <ArrowDownLeft size={24} />
          </div>
          <span className="tile-label-text">Purchase</span>
        </div>

        {/* 7. Product (Stock) */}
        <div className="grid-action-tile" onClick={() => onNavigateTab('customers')}>
          <div className="tile-icon-wrapper" style={{ background: '#ffedd5', color: '#f97316' }}>
            <Package size={24} />
          </div>
          <span className="tile-label-text">Product</span>
        </div>

        {/* 8. Expense / Melting Loss */}
        <div className="grid-action-tile" onClick={onOpenConverterModal}>
          <div className="tile-icon-wrapper" style={{ background: '#fce7f3', color: '#ec4899' }}>
            <Scissors size={24} />
          </div>
          <span className="tile-label-text">Expense</span>
        </div>

        {/* 9. Manage (Karigar & Jeweller) */}
        <div className="grid-action-tile" onClick={() => onNavigateTab('customers')}>
          <div className="tile-icon-wrapper" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
            <UserCheck size={24} />
          </div>
          <span className="tile-label-text">Manage</span>
        </div>

        {/* 10. Reports (Statements) */}
        <div className="grid-action-tile" onClick={onOpenReceiptModal}>
          <div className="tile-icon-wrapper" style={{ background: '#dbeafe', color: '#2563eb' }}>
            <FileText size={24} />
          </div>
          <span className="tile-label-text">Reports</span>
        </div>

        {/* 11. Notebook Ledger (Authentic Notebook from Photo!) */}
        <div className="grid-action-tile" onClick={onOpenNotebookView}>
          <div className="tile-icon-wrapper" style={{ background: '#fffbeb', color: '#b45309' }}>
            <BookOpen size={24} />
          </div>
          <span className="tile-label-text">Notebook</span>
        </div>

        {/* 12. People (Customers) */}
        <div className="grid-action-tile" onClick={() => onNavigateTab('customers')}>
          <div className="tile-icon-wrapper" style={{ background: '#cffafe', color: '#0891b2' }}>
            <Users size={24} />
          </div>
          <span className="tile-label-text">People</span>
        </div>

      </div>

    </div>
  );
}
