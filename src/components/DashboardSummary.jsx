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
  const t = translations[lang];

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
    <div style={{ margin: '0 1rem 1rem 1rem' }}>
      <div className="grid-4" style={{ gap: '0.75rem' }}>
        
        {/* Card 1: Total Customer Silver Due (மொத்த நிலுவை கிராம்) */}
        <div 
          style={{
            padding: '1rem',
            background: '#ffffff',
            border: '1px solid #fecaca',
            borderLeft: '4px solid #ef4444',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#b91c1c', fontWeight: '800', textTransform: 'uppercase' }}>
                {t.totalDueGrams}
              </span>
              <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#dc2626', marginTop: '0.2rem' }}>
                {formatGrams(totalDueGrams)} <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>g</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#b45309', marginTop: '0.15rem', fontWeight: '700' }}>
                ≈ {formatCurrency(approxDueRupees)}
              </div>
            </div>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#fef2f2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingDown size={18} />
            </div>
          </div>
        </div>

        {/* Card 2: Total New Silver Given (வழங்கிய புதிய நகை) */}
        <div 
          style={{
            padding: '1rem',
            background: '#ffffff',
            border: '1px solid #bae6fd',
            borderLeft: '4px solid #0284c7',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#0369a1', fontWeight: '800', textTransform: 'uppercase' }}>
                {t.todayNewGiven}
              </span>
              <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0284c7', marginTop: '0.2rem' }}>
                {formatGrams(todayNewGrams)} <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>g</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                {lang === 'ta' ? 'கொலுசு & நகைகள்' : 'Jewels issued'}
              </div>
            </div>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#f0f9ff',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ArrowUpRight size={18} />
            </div>
          </div>
        </div>

        {/* Card 3: Old Silver Inflow (பழைய வெள்ளி வரவு) */}
        <div 
          style={{
            padding: '1rem',
            background: '#ffffff',
            border: '1px solid #a7f3d0',
            borderLeft: '4px solid #10b981',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: '800', textTransform: 'uppercase' }}>
                {t.todayOldIn}
              </span>
              <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#059669', marginTop: '0.2rem' }}>
                {formatGrams(todayOldGrams)} <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>g</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                {lang === 'ta' ? 'பழைய மாற்று வரவு' : 'Old silver returns'}
              </div>
            </div>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#ecfdf5',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ArrowDownLeft size={18} />
            </div>
          </div>
        </div>

        {/* Card 4: Cash Payments Converted to Grams (ரொக்க வரவு -> கிராம் மாற்றம்) */}
        <div 
          style={{
            padding: '1rem',
            background: '#ffffff',
            border: '1px solid #fde68a',
            borderLeft: '4px solid #f59e0b',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: '800', textTransform: 'uppercase' }}>
                {t.todayCashInflow}
              </span>
              <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#d97706', marginTop: '0.2rem' }}>
                {formatCurrency(todayCashAmount)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.15rem', fontWeight: '700' }}>
                ↓ {formatGrams(todayCashGrams)} g {lang === 'ta' ? 'கழிவு' : 'Grams off'}
              </div>
            </div>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#fffbeb',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Banknote size={18} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
