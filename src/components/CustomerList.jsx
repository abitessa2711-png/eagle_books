import React, { useState } from 'react';
import { 
  Search, 
  PlusCircle, 
  Phone, 
  MapPin, 
  UserCheck, 
  MessageSquare, 
  BookOpen, 
  Trash2,
  Filter,
  User,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { translations } from '../utils/translations';
import { formatGrams, formatCurrency } from '../utils/calculations';

export function CustomerList({
  lang,
  customers,
  customerSummaries,
  selectedCustomerId,
  onSelectCustomer,
  onOpenNewCustomerModal,
  onOpenWhatsAppModal,
  onDeleteCustomer,
  rates
}) {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'DUE' | 'ADVANCE' | 'SETTLED'

  const currentRate = Number(rates.ratePerGram) || 95;

  // Filter logic
  const filteredCustomers = customers.filter((cust) => {
    const summary = customerSummaries[cust.id] || { netBalanceGrams: 0, status: 'SETTLED' };
    
    // Text search
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      cust.name.toLowerCase().includes(term) ||
      (cust.phone && cust.phone.includes(term)) ||
      (cust.address && cust.address.toLowerCase().includes(term));

    if (!matchesSearch) return false;

    // Status filter
    if (filterTab === 'DUE') return summary.netBalanceGrams > 0.001;
    if (filterTab === 'ADVANCE') return summary.netBalanceGrams < -0.001;
    if (filterTab === 'SETTLED') return Math.abs(summary.netBalanceGrams) <= 0.001;

    return true;
  });

  return (
    <div className="glass-card" style={{ padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header & Add Customer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', gap: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
            {t.allCustomers}
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {customers.length} {lang === 'ta' ? 'பதிவுகள்' : 'Accounts'}
          </span>
        </div>

        <button 
          onClick={onOpenNewCustomerModal}
          className="btn btn-sm btn-primary"
          style={{ padding: '0.45rem 0.85rem' }}
        >
          <PlusCircle size={15} />
          <span>{t.newCustomer}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '0.85rem' }}>
        <Search 
          size={16} 
          color="#94a3b8" 
          style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} 
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t.searchCustomer}
          className="input-field"
          style={{ paddingLeft: '2.4rem', fontSize: '0.88rem' }}
        />
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
        <button
          onClick={() => setFilterTab('ALL')}
          className="btn btn-sm"
          style={{
            padding: '0.3rem 0.65rem',
            fontSize: '0.75rem',
            background: filterTab === 'ALL' ? '#0284c7' : 'rgba(255,255,255,0.05)',
            color: filterTab === 'ALL' ? '#ffffff' : '#94a3b8',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          {t.filterAll} ({customers.length})
        </button>

        <button
          onClick={() => setFilterTab('DUE')}
          className="btn btn-sm"
          style={{
            padding: '0.3rem 0.65rem',
            fontSize: '0.75rem',
            background: filterTab === 'DUE' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
            color: filterTab === 'DUE' ? '#f87171' : '#94a3b8',
            border: filterTab === 'DUE' ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)'
          }}
        >
          🔴 {lang === 'ta' ? 'நிலுவை' : 'Due'}
        </button>

        <button
          onClick={() => setFilterTab('ADVANCE')}
          className="btn btn-sm"
          style={{
            padding: '0.3rem 0.65rem',
            fontSize: '0.75rem',
            background: filterTab === 'ADVANCE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
            color: filterTab === 'ADVANCE' ? '#34d399' : '#94a3b8',
            border: filterTab === 'ADVANCE' ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.08)'
          }}
        >
          🟢 {lang === 'ta' ? 'முன்பணம்' : 'Advance'}
        </button>

        <button
          onClick={() => setFilterTab('SETTLED')}
          className="btn btn-sm"
          style={{
            padding: '0.3rem 0.65rem',
            fontSize: '0.75rem',
            background: filterTab === 'SETTLED' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
            color: filterTab === 'SETTLED' ? '#60a5fa' : '#94a3b8',
            border: filterTab === 'SETTLED' ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.08)'
          }}
        >
          ⚪ {lang === 'ta' ? 'முடிந்தது' : 'Settled'}
        </button>
      </div>

      {/* Customer List Items */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '580px' }}>
        {filteredCustomers.length === 0 ? (
          <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#64748b' }}>
            <User size={36} color="#475569" style={{ margin: '0 auto 0.75rem auto' }} />
            <p style={{ fontSize: '0.88rem' }}>{t.noCustomers}</p>
          </div>
        ) : (
          filteredCustomers.map((cust) => {
            const isSelected = cust.id === selectedCustomerId;
            const summary = customerSummaries[cust.id] || { netBalanceGrams: 0, status: 'SETTLED' };
            const isDue = summary.netBalanceGrams > 0.001;
            const isAdvance = summary.netBalanceGrams < -0.001;
            const approxRupees = Math.abs(summary.netBalanceGrams) * currentRate;

            return (
              <div
                key={cust.id}
                onClick={() => onSelectCustomer(cust.id)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '14px',
                  background: isSelected 
                    ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%)' 
                    : 'rgba(15, 23, 42, 0.6)',
                  border: isSelected 
                    ? '1.5px solid #38bdf8' 
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  position: 'relative'
                }}
              >
                {/* Top Row: Name and Balance Badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: isSelected ? '#ffffff' : '#f1f5f9' }}>
                      {cust.name}
                    </div>

                    {/* Customer Category Tag */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                        {t[cust.type] || cust.type || t.typeRetail}
                      </span>
                      {cust.address && (
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <MapPin size={11} />
                          {cust.address.split(',')[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Big Balance Grams & Status Indicator */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '800',
                      color: isDue ? '#f87171' : isAdvance ? '#34d399' : '#94a3b8'
                    }}>
                      {formatGrams(Math.abs(summary.netBalanceGrams))} <span style={{ fontSize: '0.75rem' }}>g</span>
                    </div>

                    <div style={{
                      fontSize: '0.68rem',
                      fontWeight: '700',
                      color: isDue ? '#fca5a5' : isAdvance ? '#6ee7b7' : '#64748b'
                    }}>
                      {isDue ? (lang === 'ta' ? '🔴 வர வேண்டியது' : 'Due') 
                        : isAdvance ? (lang === 'ta' ? '🟢 முன் பணம்' : 'Advance') 
                        : (lang === 'ta' ? '⚪ முடிந்தது' : 'Settled')}
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Phone, Approx Rupees, and Quick WhatsApp */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  marginTop: '0.3rem', 
                  paddingTop: '0.35rem', 
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {cust.phone && (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Phone size={11} color="#38bdf8" />
                        {cust.phone}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: '600' }}>
                      ≈ {formatCurrency(approxRupees)}
                    </span>

                    {/* WhatsApp Quick Trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenWhatsAppModal(cust.id);
                      }}
                      style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '6px',
                        padding: '0.2rem 0.35rem',
                        color: '#34d399',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title={t.whatsappShare}
                    >
                      <MessageSquare size={13} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
