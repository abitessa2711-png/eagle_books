import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Menu, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Phone, 
  MapPin, 
  UserPlus, 
  TrendingUp 
} from 'lucide-react';
import { translations } from '../utils/translations';
import { formatGrams, formatCurrency } from '../utils/calculations';

export function CustomerManagementScreen({
  lang,
  customers,
  customerSummaries,
  onSelectCustomer,
  onOpenNewCustomerModal,
  onDeleteCustomer,
  onOpenRateModal,
  onOpenGridScreen,
  rates
}) {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const currentRate = Number(rates.ratePerGram) || 95;

  const filteredCustomers = customers.filter((cust) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      cust.name.toLowerCase().includes(term) ||
      (cust.phone && cust.phone.includes(term)) ||
      (cust.address && cust.address.toLowerCase().includes(term))
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      
      {/* 1. VIBRANT ORANGE HEADER (Matches Screen 1 of Mockup) */}
      <div className="vibrant-orange-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button 
            onClick={onOpenGridScreen}
            className="header-icon-btn"
            title="Dashboard Grid Menu"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="header-title-text">
            <span>{lang === 'ta' ? 'Customer Manage...' : 'Customer Manage...'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            onClick={onOpenGridScreen}
            className="header-icon-btn"
            title="Menu"
          >
            <Menu size={20} />
          </button>
          <button 
            onClick={onOpenNewCustomerModal}
            className="header-icon-btn"
            style={{ background: 'rgba(255, 255, 255, 0.25)', borderRadius: '50%', width: '32px', height: '32px' }}
            title={t.newCustomer}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Live Rate Quick Bar */}
      <div className="rate-strip">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <TrendingUp size={14} color="#b45309" />
          <span>{lang === 'ta' ? 'இன்றைய வெள்ளி விலை:' : "Today's Silver Rate:"} <strong>{formatCurrency(currentRate)}/g</strong></span>
        </div>
        <span 
          onClick={onOpenRateModal}
          style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: '800' }}
        >
          {t.updateRate}
        </span>
      </div>

      {/* Search Input */}
      <div className="mobile-search-container">
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
            className="mobile-search-input"
          />
        </div>
      </div>

      {/* Customer Management Cards List (Exact match to Mockup Screen 1) */}
      <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '10px' }}>
        {filteredCustomers.length === 0 ? (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: '#475569' }}>
            <p style={{ fontSize: '0.95rem', fontWeight: '800' }}>{t.noCustomers}</p>
          </div>
        ) : (
          filteredCustomers.map((cust, idx) => {
            const summary = customerSummaries[cust.id] || { netBalanceGrams: 0 };
            const approxRupees = Math.abs(summary.netBalanceGrams) * currentRate;

            // Avatars
            const avatarUrl = idx === 0 
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
              : idx === 1
              ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
              : idx === 2
              ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
              : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80';

            return (
              <div 
                key={cust.id} 
                className="customer-management-card"
                onClick={() => onSelectCustomer(cust.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Header: Photo Avatar, Name, Phone, Email/Area */}
                <div className="customer-card-header">
                  <img 
                    src={avatarUrl} 
                    alt={cust.name}
                    className="customer-photo-avatar"
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '1rem', fontWeight: '900', color: '#000000' }}>
                      {cust.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.1rem' }}>
                      Phone: {cust.phone || '555-1234'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Place: {cust.address ? cust.address.split(',')[0] : 'Madurai'}
                    </div>
                  </div>
                </div>

                {/* Meta Row: Segment: Regular / Karigar & Loyalty / Touch % */}
                <div className="customer-meta-row">
                  <span className="segment-tag-gold">
                    Segment: {cust.type === 'typeKarigar' ? 'Karigar' : cust.type === 'typeWholesale' ? 'Wholesale' : 'Regular'}
                  </span>
                  <span className="loyalty-tag-green">
                    Touch: 78% / P (Points: {Math.round(Math.abs(summary.netBalanceGrams))})
                  </span>
                </div>

                {/* Balance Row & Action Icons (Amber Pencil & Red Trash) */}
                <div className="customer-balance-row">
                  <div className="balance-text-blue">
                    Balance: {formatGrams(Math.abs(summary.netBalanceGrams))} g ({formatCurrency(approxRupees)})
                  </div>

                  <div className="card-action-icons" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => onSelectCustomer(cust.id)}
                      className="edit-btn-amber"
                      title={t.edit}
                    >
                      <Edit2 size={16} color="#f59e0b" />
                    </button>
                    <button 
                      onClick={() => onDeleteCustomer(cust.id)}
                      className="delete-btn-red"
                      title={t.delete}
                    >
                      <Trash2 size={16} color="#ef4444" />
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
