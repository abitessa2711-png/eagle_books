import React from 'react';
import { 
  Scale, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Banknote, 
  Users, 
  TrendingDown, 
  Award,
  Wallet
} from 'lucide-react';
import { translations } from '../utils/translations';
import { formatGrams, formatCurrency } from '../utils/calculations';

export function DashboardSummary({ 
  lang, 
  customers, 
  customerSummaries, 
  rates,
  allTransactions 
}) {
  const t = translations[lang] || translations.ta;

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

  const approxDueRupees = totalDueGrams * (Number(rates.ratePerGram) || 95);

  let todayNewGrams = 0;
  let todayOldGrams = 0;
  let todayCashAmount = 0;
  let todayCashGrams = 0;

  allTransactions.forEach((tx) => {
    if (tx.type === 'NEW_SALE') {
      todayNewGrams += Number(tx.weight) || 0;
    } else if (tx.type === 'OLD_SILVER') {
      todayOldGrams += Number(tx.weight) || 0;
    } else if (tx.type === 'CASH_PAYMENT') {
      todayCashAmount += Number(tx.cashAmount) || 0;
      todayCashGrams += Number(tx.convertedGrams) || 0;
    }
  });

  return (
    <div style={{ margin: '0 0.75rem 0.75rem 0.75rem' }}>
      <div className="grid-4" style={{ gap: '0.5rem' }}>
        
        {/* Card 1: Total Customer Silver Due (மொத்த நிலுவை கிராம்) */}
        <div 
          style={{
            padding: '0.65rem 0.75rem',
            background: '#ffffff',
            border: '1px solid #fecaca',
            borderLeft: '3.5px solid #ef4444',
            borderRadius: '10px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.66rem', color: '#b91c1c', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.01em' }}>
                {t.totalDueGrams}
              </span>
              <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#dc2626', marginTop: '0.15rem', lineHeight: '1.15' }}>
                {formatGrams(totalDueGrams)} <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>g</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#b45309', marginTop: '0.1rem', fontWeight: '700' }}>
                ≈ {formatCurrency(approxDueRupees)}
              </div>
            </div>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: '#fef2f2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <TrendingDown size={15} />
            </div>
          </div>
        </div>

        {/* Card 2: Total New Silver Given (வழங்கிய புதிய நகை) */}
        <div 
          style={{
            padding: '0.65rem 0.75rem',
            background: '#ffffff',
            border: '1px solid #fed7aa',
            borderLeft: '3.5px solid #f97316',
            borderRadius: '10px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.66rem', color: '#c2410c', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.01em' }}>
                {t.totalNewSilverGiven}
              </span>
              <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#ea580c', marginTop: '0.15rem', lineHeight: '1.15' }}>
                {formatGrams(todayNewGrams)} <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>g</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.1rem', fontWeight: '700' }}>
                மொத்த விற்பனை (Sales)
              </div>
            </div>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: '#fff7ed',
              color: '#f97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ArrowUpRight size={15} />
            </div>
          </div>
        </div>

        {/* Card 3: Total Old Silver Received (பெற்ற பழைய வெள்ளி) */}
        <div 
          style={{
            padding: '0.65rem 0.75rem',
            background: '#ffffff',
            border: '1px solid #a7f3d0',
            borderLeft: '3.5px solid #10b981',
            borderRadius: '10px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.66rem', color: '#047857', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.01em' }}>
                {t.totalOldSilverReceived}
              </span>
              <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#059669', marginTop: '0.15rem', lineHeight: '1.15' }}>
                {formatGrams(todayOldGrams)} <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>g</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#047857', marginTop: '0.1rem', fontWeight: '700' }}>
                வரவு பெற்ற பழைய நகை
              </div>
            </div>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: '#ecfdf5',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ArrowDownLeft size={15} />
            </div>
          </div>
        </div>

        {/* Card 4: Total Cash Received (பெற்ற ரொக்கப் பணம்) */}
        <div 
          style={{
            padding: '0.65rem 0.75rem',
            background: '#ffffff',
            border: '1px solid #bae6fd',
            borderLeft: '3.5px solid #0284c7',
            borderRadius: '10px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.66rem', color: '#0369a1', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.01em' }}>
                {t.totalCashReceived}
              </span>
              <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0284c7', marginTop: '0.15rem', lineHeight: '1.15' }}>
                {formatCurrency(todayCashAmount)}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#0369a1', marginTop: '0.1rem', fontWeight: '700' }}>
                ≈ {formatGrams(todayCashGrams)} g வெள்ளி
              </div>
            </div>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: '#f0f9ff',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Banknote size={15} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
