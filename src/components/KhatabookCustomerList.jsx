import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ChevronRight, 
  Share2, 
  TrendingDown, 
  Users 
} from 'lucide-react';
import { translations } from '../utils/translations';
import { formatGrams, formatCurrency } from '../utils/calculations';

export function KhatabookCustomerList({
  lang,
  customers,
  customerSummaries,
  onSelectCustomer,
  onOpenNewCustomerModal,
  onOpenWhatsAppModal,
  rates
}) {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'DUE' | 'ADVANCE'

  const currentRate = Number(rates.ratePerGram) || 95;

  // Calculate Aggregates
  let totalDueGrams = 0;
  let totalAdvanceGrams = 0;

  Object.values(customerSummaries).forEach((summary) => {
    if (summary.netBalanceGrams > 0.001) {
      totalDueGrams += summary.netBalanceGrams;
    } else if (summary.netBalanceGrams < -0.001) {
      totalAdvanceGrams += Math.abs(summary.netBalanceGrams);
    }
  });

  const approxDueRupees = totalDueGrams * currentRate;
  const approxAdvanceRupees = totalAdvanceGrams * currentRate;

  // Filter customers
  const filteredCustomers = customers.filter((cust) => {
    const summary = customerSummaries[cust.id] || { netBalanceGrams: 0 };
    const term = searchTerm.toLowerCase().trim();

    const matchesSearch = 
      cust.name.toLowerCase().includes(term) ||
      (cust.phone && cust.phone.includes(term)) ||
      (cust.address && cust.address.toLowerCase().includes(term));

    if (!matchesSearch) return false;

    if (filterType === 'DUE') return summary.netBalanceGrams > 0.001;
    if (filterType === 'ADVANCE') return summary.netBalanceGrams < -0.001;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: '70px' }}>
      
      {/* 1. KHATABOOK HERO BALANCE CARD */}
      <div className="hero-balance-container">
        
        {/* You'll Get (நீங்கள் பெற வேண்டியது) */}
        <div className="hero-balance-col due">
          <span className="hero-balance-label" style={{ color: '#b91c1c' }}>
            {lang === 'ta' ? 'நீங்கள் பெற வேண்டியது' : "You'll Get (Due)"}
          </span>
          <div className="hero-balance-value" style={{ color: '#dc2626' }}>
            {formatCurrency(approxDueRupees)}
          </div>
          <span className="hero-balance-sub" style={{ color: '#b91c1c' }}>
            {formatGrams(totalDueGrams)} g
          </span>
        </div>

        {/* You'll Give (நீங்கள் தர வேண்டியது) */}
        <div className="hero-balance-col" style={{ paddingLeft: '0.45rem' }}>
          <span className="hero-balance-label" style={{ color: '#047857' }}>
            {lang === 'ta' ? 'நீங்கள் தர வேண்டியது' : "You'll Give (Advance)"}
          </span>
          <div className="hero-balance-value" style={{ color: '#059669' }}>
            {formatCurrency(approxAdvanceRupees)}
          </div>
          <span className="hero-balance-sub" style={{ color: '#047857' }}>
            {formatGrams(totalAdvanceGrams)} g
          </span>
        </div>

      </div>

      {/* 2. SEARCH BAR */}
      <div className="search-wrapper">
        <div style={{ position: 'relative' }}>
          <Search 
            size={16} 
            color="#64748b" 
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchCustomer}
            className="search-input-box"
          />
        </div>
      </div>

      {/* 3. FILTER TABS & NEW CUSTOMER BUTTON */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem 0.65rem 1rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={() => setFilterType('ALL')}
            className={`filter-tab-pill ${filterType === 'ALL' ? 'active' : ''}`}
          >
            {t.filterAll} ({customers.length})
          </button>
          <button
            onClick={() => setFilterType('DUE')}
            className={`filter-tab-pill ${filterType === 'DUE' ? 'active' : ''}`}
          >
            {t.filterDue}
          </button>
          <button
            onClick={() => setFilterType('ADVANCE')}
            className={`filter-tab-pill ${filterType === 'ADVANCE' ? 'active' : ''}`}
          >
            {t.filterAdvance}
          </button>
        </div>

        <button
          onClick={onOpenNewCustomerModal}
          style={{
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            padding: '0.35rem 0.75rem',
            fontSize: '0.78rem',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            boxShadow: '0 2px 8px rgba(234, 88, 12, 0.3)'
          }}
        >
          <UserPlus size={14} />
          <span>{lang === 'ta' ? '+ புதியவர்' : '+ Add'}</span>
        </button>
      </div>

      {/* 4. CUSTOMER LIST ROWS */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {filteredCustomers.length === 0 ? (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: '#64748b' }}>
            <Users size={36} color="#cbd5e1" style={{ margin: '0 auto 0.75rem auto' }} />
            <p style={{ fontSize: '0.92rem', fontWeight: '800', color: '#000000' }}>{t.noCustomers}</p>
          </div>
        ) : (
          filteredCustomers.map((cust) => {
            const summary = customerSummaries[cust.id] || { netBalanceGrams: 0 };
            const isDue = summary.netBalanceGrams > 0.001;
            const isAdvance = summary.netBalanceGrams < -0.001;
            const approxRupees = Math.abs(summary.netBalanceGrams) * currentRate;

            // Initial letter
            const initial = cust.name.trim().charAt(0);

            return (
              <div
                key={cust.id}
                className="customer-card-row"
                onClick={() => onSelectCustomer(cust.id)}
              >
                {/* Avatar Initial */}
                <div className="customer-avatar-box">
                  {initial}
                </div>

                {/* Customer Details */}
                <div className="customer-info-box">
                  <div className="customer-name-text">
                    {cust.name}
                  </div>
                  <div className="customer-sub-text">
                    {cust.phone ? `📞 ${cust.phone}` : ''} {cust.address ? `• 📍 ${cust.address.split(',')[0]}` : ''}
                  </div>
                </div>

                {/* Balance Grams & Rupees */}
                <div className="customer-balance-box">
                  <div
                    className="customer-balance-grams"
                    style={{ color: isDue ? '#dc2626' : isAdvance ? '#059669' : '#475569' }}
                  >
                    {isDue ? `🔴 ${formatGrams(summary.netBalanceGrams)} g` : isAdvance ? `🟢 ${formatGrams(Math.abs(summary.netBalanceGrams))} g` : '⚪ 0.000 g'}
                  </div>
                  <div className="customer-balance-rupees">
                    {isDue ? `+${formatCurrency(approxRupees)}` : isAdvance ? `-${formatCurrency(approxRupees)}` : 'முடிந்தது'}
                  </div>
                </div>

                <ChevronRight size={18} color="#cbd5e1" style={{ marginLeft: '0.45rem' }} />
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
