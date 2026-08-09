import React from 'react';
import { 
  Users, 
  BookOpen, 
  Calculator, 
  BarChart3 
} from 'lucide-react';
import { translations } from '../utils/translations';

export function MobileBottomNav({ lang, currentTab, onSelectTab }) {
  const t = translations[lang];

  return (
    <nav className="bottom-tab-bar no-print">
      
      {/* Tab 1: Customers */}
      <button
        onClick={() => onSelectTab('customers')}
        className={`tab-nav-btn ${currentTab === 'customers' ? 'active' : ''}`}
      >
        <div className="tab-icon-wrap">
          <Users size={19} />
        </div>
        <span>{lang === 'ta' ? 'வாடிக்கையாளர்' : 'Customers'}</span>
      </button>

      {/* Tab 2: Notebook Ledger */}
      <button
        onClick={() => onSelectTab('notebook')}
        className={`tab-nav-btn ${currentTab === 'notebook' ? 'active' : ''}`}
      >
        <div className="tab-icon-wrap">
          <BookOpen size={19} />
        </div>
        <span>{lang === 'ta' ? 'நோட்புக் ஏடு' : 'Notebook'}</span>
      </button>

      {/* Tab 3: Quick Calculator */}
      <button
        onClick={() => onSelectTab('converter')}
        className={`tab-nav-btn ${currentTab === 'converter' ? 'active' : ''}`}
      >
        <div className="tab-icon-wrap">
          <Calculator size={19} />
        </div>
        <span>{lang === 'ta' ? 'கால்குலேட்டர்' : 'Calculator'}</span>
      </button>

      {/* Tab 4: Reports & Summary */}
      <button
        onClick={() => onSelectTab('reports')}
        className={`tab-nav-btn ${currentTab === 'reports' ? 'active' : ''}`}
      >
        <div className="tab-icon-wrap">
          <BarChart3 size={19} />
        </div>
        <span>{lang === 'ta' ? 'அறிக்கை' : 'Reports'}</span>
      </button>

    </nav>
  );
}
