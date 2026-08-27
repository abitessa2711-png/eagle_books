import React, { useState } from 'react';
import { 
  TrendingUp, 
  LogOut,
  RefreshCw,
  CloudCheck
} from 'lucide-react';
import { translations } from '../utils/translations';

export function EagleHeader({
  lang,
  setLang,
  rates,
  currentUser,
  onLogout,
  onOpenRateModal,
  onManualSync
}) {
  const t = translations[lang] || translations.ta;
  const currentRate = Number(rates?.ratePerGram) || 95;
  const [syncing, setSyncing] = useState(false);

  const handleSyncClick = async () => {
    if (syncing) return;
    setSyncing(true);
    if (onManualSync) {
      await onManualSync();
    }
    setTimeout(() => {
      setSyncing(false);
    }, 600);
  };

  return (
    <header className="app-header">
      {/* Brand & Logo */}
      <div className="brand-wrapper">
        <img 
          src="/eagle-logo.png" 
          alt="Eagle Logo" 
          className="brand-logo-img"
        />
        <div className="brand-titles">
          <div className="brand-main-title">
            {lang === 'ta' ? 'ஈகிள் புக்ஸ்' : 'Eagle Books'}
          </div>
          <div className="brand-sub-title">
            {lang === 'ta' ? 'சில்வர் கணக்கு ஏடு' : 'Silver Khatabook'}
          </div>
        </div>
      </div>

      {/* Header Actions - Clean, Elegant & Client Delivery Ready */}
      <div className="header-actions">
        
        {/* Manual Cloud Sync Button */}
        {onManualSync && (
          <button
            onClick={handleSyncClick}
            className="header-action-btn"
            style={{
              background: '#f0fdf4',
              color: '#15803d',
              border: '1.5px solid #86efac',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: '800',
              padding: '0.35rem 0.65rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            title={lang === 'ta' ? 'போன் மற்றும் லேப்டாப் டேட்டாவை புதுப்பி (Sync All Data)' : 'Sync Cloud Data'}
          >
            <RefreshCw size={14} className={syncing ? 'spin-icon' : ''} />
            <span style={{ fontSize: '0.74rem' }}>
              {syncing ? (lang === 'ta' ? 'புதுப்பிக்கிறது...' : 'Syncing...') : (lang === 'ta' ? 'சிங்க்' : 'Sync')}
            </span>
          </button>
        )}

        {/* Live Silver Rate Pill */}
        <button
          onClick={onOpenRateModal}
          className="header-rate-pill"
          title={t.todayRate}
        >
          <TrendingUp size={13} color="#ea580c" strokeWidth={3} />
          <span>₹{currentRate}/g</span>
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
          className="header-action-btn lang-btn"
          title="Switch Language"
        >
          {lang === 'ta' ? 'EN' : 'தமிழ்'}
        </button>

        {/* Logout Button */}
        {currentUser && (
          <button
            onClick={onLogout}
            className="header-action-btn logout-btn"
            title={lang === 'ta' ? 'வெளியேறு (Logout)' : 'Logout'}
          >
            <LogOut size={15} />
          </button>
        )}

      </div>
    </header>
  );
}
