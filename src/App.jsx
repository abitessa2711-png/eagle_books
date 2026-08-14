import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { UserPlus } from 'lucide-react';
import { EagleHeader } from './components/EagleHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { KhatabookCustomerList } from './components/KhatabookCustomerList';
import { KhatabookCustomerLedger } from './components/KhatabookCustomerLedger';
import { HandwrittenNotebook } from './components/HandwrittenNotebook';
import { MobileQuickCalculator } from './components/MobileQuickCalculator';
import { DashboardSummary } from './components/DashboardSummary';
import { LoginScreen } from './components/LoginScreen';
import { TransactionDrawer } from './components/TransactionDrawer';
import { CustomerModal } from './components/CustomerModal';
import { RateManagerModal } from './components/RateManagerModal';
import { ReceiptModal } from './components/ReceiptModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { BackupModal } from './components/BackupModal';
import { QuickConverterModal } from './components/QuickConverterModal';

import { 
  loadStoredData, 
  saveCustomers, 
  saveTransactions, 
  saveRates, 
  saveLang,
  saveAuthUser,
  fetchCloudData,
  uploadLocalDataToCloud,
  syncCustomerToCloud,
  deleteCustomerFromCloud,
  syncTransactionToCloud,
  deleteTransactionFromCloud,
  syncRatesToCloud,
  subscribeToRealtime
} from './utils/storage';
import { computeCustomerTransactions } from './utils/calculations';
import { translations } from './utils/translations';

const DEFAULT_OWNER_USER = {
  phone: '8148003454',
  name: 'EagleBooks Admin',
  shopName: 'EAGLE SILVERS',
  role: 'OWNER',
  city: 'சிவகாசி'
};

export function App() {
  const initialData = useMemo(() => {
    try {
      return loadStoredData();
    } catch (e) {
      console.error('Error loading data:', e);
      return {
        customers: [],
        transactions: [],
        rates: { ratePerGram: 95, ratePerKg: 95000 },
        lang: 'ta',
        authUser: null
      };
    }
  }, []);

  const [authUser, setAuthUser] = useState(initialData.authUser || null);
  const [customers, setCustomers] = useState(initialData.customers || []);
  const [transactions, setTransactions] = useState(initialData.transactions || []);
  const [rates, setRates] = useState(initialData.rates || { ratePerGram: 95 });
  const [lang, setLang] = useState(initialData.lang || 'ta');
  const [cloudSynced, setCloudSynced] = useState(false);

  // Active Bottom Tab: 'customers' | 'notebook' | 'converter' | 'reports'
  const [activeTab, setActiveTab] = useState('customers');

  // Selected customer for Ledger detail view
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // Modals & Drawers
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('GIVE'); // 'GIVE' | 'GET'
  
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptCustomerId, setReceiptCustomerId] = useState(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppCustomerId, setWhatsAppCustomerId] = useState(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isConverterModalOpen, setIsConverterModalOpen] = useState(false);

  // 1. Initial & Continuous Cloud Sync
  const syncDataFromCloud = useCallback(async () => {
    try {
      const cloudRes = await fetchCloudData();
      if (cloudRes.hasCloudData) {
        if (cloudRes.customers && Array.isArray(cloudRes.customers)) {
          setCustomers(cloudRes.customers);
        }
        if (cloudRes.transactions && Array.isArray(cloudRes.transactions)) {
          setTransactions(cloudRes.transactions);
        }
        if (cloudRes.rates) {
          setRates(prev => ({ ...prev, ...cloudRes.rates }));
        }
        setCloudSynced(true);
      }
    } catch (err) {
      console.warn('Background cloud sync warning:', err);
    }
  }, []);

  const handleManualSync = async () => {
    setCloudSynced(false);
    await syncDataFromCloud();
    setTimeout(() => setCloudSynced(true), 500);
  };

  useEffect(() => {
    let isMounted = true;
    
    // Initial sync
    syncDataFromCloud();

    // Periodic sync every 15 seconds to ensure any device stays in sync
    const interval = setInterval(() => {
      if (isMounted) {
        syncDataFromCloud();
      }
    }, 15000);

    // Realtime listener for cross-device sync
    const unsubscribe = subscribeToRealtime({
      onCustomerEvent: () => {
        if (isMounted) syncDataFromCloud();
      },
      onTransactionEvent: () => {
        if (isMounted) syncDataFromCloud();
      },
      onRateEvent: (payload) => {
        if (payload.new && isMounted) {
          setRates(prev => ({
            ...prev,
            ratePerGram: Number(payload.new.rate_per_gram) || 95,
            ratePerKg: Number(payload.new.rate_per_kg) || 95000,
            lastUpdated: payload.new.last_updated
          }));
        }
      }
    });

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (unsubscribe) unsubscribe();
    };
  }, [syncDataFromCloud]);

  // Persistence to local storage (Offline Cache)
  useEffect(() => {
    saveCustomers(customers);
  }, [customers]);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveRates(rates);
  }, [rates]);

  useEffect(() => {
    saveLang(lang);
  }, [lang]);

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    const finalUser = user || DEFAULT_OWNER_USER;
    setAuthUser(finalUser);
    saveAuthUser(finalUser);
    syncDataFromCloud(); // Immediately fetch latest cloud data upon login!
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ea580c', '#059669', '#f59e0b']
      });
    } catch (e) {}
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm(lang === 'ta' ? 'நிச்சயமாக கணக்கிலிருந்து வெளியேற வேண்டுமா?' : 'Are you sure you want to log out?');
    if (confirmLogout) {
      setAuthUser(null);
      saveAuthUser(null);
      setSelectedCustomerId(null);
    }
  };

  // Compute all customer balances
  const customerSummaries = useMemo(() => {
    const map = {};
    const rate = Number(rates.ratePerGram) || 95;

    (customers || []).forEach((cust) => {
      const custTxs = (transactions || []).filter((tx) => tx.customerId === cust.id);
      map[cust.id] = computeCustomerTransactions(custTxs, rate);
    });

    return map;
  }, [customers, transactions, rates]);

  const activeCustomer = (customers || []).find((c) => c.id === selectedCustomerId) || (customers || [])[0] || null;
  const activeSummary = activeCustomer ? customerSummaries[activeCustomer.id] || { transactions: [], netBalanceGrams: 0 } : null;

  // Navigation Handlers
  const handleSelectCustomer = (id) => {
    setSelectedCustomerId(id);
    setActiveTab('customers');
  };

  const handleBackToList = () => {
    setSelectedCustomerId(null);
  };

  const handleOpenGiveDrawer = () => {
    setDrawerMode('GIVE');
    setIsDrawerOpen(true);
  };

  const handleOpenGetDrawer = () => {
    setDrawerMode('GET');
    setIsDrawerOpen(true);
  };

  const handleSaveTransaction = (newTx) => {
    setTransactions((prev) => [...prev, newTx]);
    syncTransactionToCloud(newTx);

    if (newTx.type === 'CASH_PAYMENT' || newTx.type === 'OLD_SILVER') {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.85 },
          colors: ['#ea580c', '#059669', '#f59e0b']
        });
      } catch (e) {}
    }
  };

  const handleSaveCustomer = (custData, openingBalanceGrams) => {
    const exists = customers.some((c) => c.id === custData.id);
    if (exists) {
      setCustomers(customers.map((c) => (c.id === custData.id ? custData : c)));
    } else {
      setCustomers([custData, ...customers]);
      setSelectedCustomerId(custData.id);

      if (openingBalanceGrams && openingBalanceGrams > 0) {
        const openingTx = {
          id: `tx-${Date.now()}`,
          customerId: custData.id,
          date: new Date().toISOString().slice(0, 10),
          type: 'OPENING_BALANCE',
          itemName: 'CB : தொடக்க இருப்பு (Carried Balance)',
          weight: Number(openingBalanceGrams),
          touchPercent: 100,
          notes: 'தொடக்க இருப்பு பதிவு'
        };
        setTransactions((prev) => [...prev, openingTx]);
        syncTransactionToCloud(openingTx);
      }
    }
    syncCustomerToCloud(custData);
  };

  const handleDeleteCustomer = (id) => {
    const customerToDelete = customers.find((c) => c.id === id);
    const custName = customerToDelete ? customerToDelete.name : '';
    const confirmMsg = lang === 'ta' 
      ? `"${custName}" இந்த வாடிக்கையாளர் மற்றும் அனைத்து பரிவர்த்தனைகளையும் நிச்சயமாக நீக்க வேண்டுமா?`
      : `Are you sure you want to delete "${custName}" and all their records?`;

    if (window.confirm(confirmMsg)) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      setTransactions((prev) => prev.filter((tx) => tx.customerId !== id));
      deleteCustomerFromCloud(id);
      if (selectedCustomerId === id) {
        setSelectedCustomerId(null);
      }
    }
  };

  const handleDeleteTransaction = (txId) => {
    const t = translations[lang] || translations.ta;
    if (window.confirm(t.confirmDelete)) {
      setTransactions(transactions.filter((tx) => tx.id !== txId));
      deleteTransactionFromCloud(txId);
    }
  };

  const handleSaveRates = (updatedRates) => {
    setRates(updatedRates);
    syncRatesToCloud(updatedRates);
  };

  const handleOpenReceipt = (custId) => {
    setReceiptCustomerId(custId || activeCustomer?.id);
    setIsReceiptModalOpen(true);
  };

  const handleOpenWhatsApp = (custId) => {
    setWhatsAppCustomerId(custId || activeCustomer?.id);
    setIsWhatsAppModalOpen(true);
  };

  const handleRestoreData = (newCust, newTx, newRates) => {
    setCustomers(newCust);
    setTransactions(newTx);
    setRates(newRates);
    uploadLocalDataToCloud(newCust, newTx, newRates);
    if (newCust.length > 0) {
      setSelectedCustomerId(newCust[0].id);
    }
  };

  // IF NOT AUTHENTICATED -> SHOW LOGIN SCREEN
  if (!authUser) {
    return (
      <LoginScreen
        lang={lang}
        setLang={setLang}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="app-container">
      
      {/* 1. Brand Header */}
      <EagleHeader
        lang={lang}
        setLang={setLang}
        rates={rates}
        currentUser={authUser}
        cloudSynced={cloudSynced}
        onLogout={handleLogout}
        onOpenRateModal={() => setIsRateModalOpen(true)}
        onManualSync={handleManualSync}
      />

      {/* 2. Main Content Screens */}
      <main className="app-scroll-main">
        
        {/* TAB 1: CUSTOMERS DIRECTORY OR SINGLE CUSTOMER LEDGER */}
        {activeTab === 'customers' && (
          selectedCustomerId ? (
            <KhatabookCustomerLedger
              lang={lang}
              customer={activeCustomer}
              allCustomers={customers}
              customerSummary={activeSummary}
              rates={rates}
              onBack={handleBackToList}
              onSelectCustomer={handleSelectCustomer}
              onOpenGiveModal={handleOpenGiveDrawer}
              onOpenGetModal={handleOpenGetDrawer}
              onOpenNotebookView={() => setActiveTab('notebook')}
              onOpenReceiptModal={handleOpenReceipt}
              onOpenWhatsAppModal={handleOpenWhatsApp}
              onDeleteTransaction={handleDeleteTransaction}
              onDeleteCustomer={handleDeleteCustomer}
            />
          ) : (
            <KhatabookCustomerList
              lang={lang}
              customers={customers}
              customerSummaries={customerSummaries}
              onSelectCustomer={handleSelectCustomer}
              onOpenNewCustomerModal={() => setIsCustomerModalOpen(true)}
              onDeleteCustomer={handleDeleteCustomer}
              onOpenWhatsAppModal={handleOpenWhatsApp}
              rates={rates}
            />
          )
        )}

        {/* TAB 2: AUTHENTIC JEWELLER NOTEBOOK (From Photo!) */}
        {activeTab === 'notebook' && (
          <HandwrittenNotebook
            lang={lang}
            customer={activeCustomer}
            customerSummary={activeSummary}
            rates={rates}
            onOpenTransactionModal={handleOpenGiveDrawer}
            onBack={() => setActiveTab('customers')}
            onOpenWhatsAppModal={handleOpenWhatsApp}
          />
        )}

        {/* TAB 3: QUICK CONVERTER */}
        {activeTab === 'converter' && (
          <MobileQuickCalculator
            lang={lang}
            rates={rates}
          />
        )}

        {/* TAB 4: REPORTS & SUMMARY */}
        {activeTab === 'reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0 80px 0' }}>
            <DashboardSummary
              lang={lang}
              customers={customers}
              customerSummaries={customerSummaries}
              rates={rates}
              allTransactions={transactions}
            />

            {/* Quick Actions */}
            <div style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                onClick={() => setIsRateModalOpen(true)}
                className="btn-mobile"
                style={{ background: '#fffbeb', color: '#92400e', border: '1.5px solid #fcd34d', padding: '0.85rem' }}
              >
                ⚡ {(translations[lang] || translations.ta).todayRate} ({(translations[lang] || translations.ta).updateRate})
              </button>

              <button
                onClick={() => setIsBackupModalOpen(true)}
                className="btn-mobile"
                style={{ background: '#f0f9ff', color: '#0369a1', border: '1.5px solid #7dd3fc', padding: '0.85rem' }}
              >
                💾 {(translations[lang] || translations.ta).backupRestore}
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Floating Action Button (FAB) for Customer List */}
      {activeTab === 'customers' && !selectedCustomerId && (
        <div className="fab-customer-container">
          <button
            onClick={() => setIsCustomerModalOpen(true)}
            className="fab-customer-btn"
            title={lang === 'ta' ? 'புதிய வாடிக்கையாளர் சேர்க்க' : 'Add New Customer'}
          >
            <UserPlus size={18} strokeWidth={2.5} />
            <span>{lang === 'ta' ? '+ புதிய வாடிக்கையாளர்' : '+ Add Customer'}</span>
          </button>
        </div>
      )}

      {/* 3. Bottom Navigation Bar */}
      <MobileBottomNav
        lang={lang}
        currentTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
        }}
      />

      {/* 4. Drawers & Modals */}
      <TransactionDrawer
        lang={lang}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        initialMode={drawerMode}
        customerId={activeCustomer?.id}
        rates={rates}
        onSaveTransaction={handleSaveTransaction}
      />

      <CustomerModal
        lang={lang}
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSaveCustomer={handleSaveCustomer}
      />

      <RateManagerModal
        lang={lang}
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        rates={rates}
        onSaveRates={handleSaveRates}
      />

      <ReceiptModal
        lang={lang}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        customer={customers.find((c) => c.id === receiptCustomerId) || activeCustomer}
        customerSummary={receiptCustomerId ? customerSummaries[receiptCustomerId] : activeSummary}
        rates={rates}
      />

      <WhatsAppModal
        lang={lang}
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        customer={customers.find((c) => c.id === whatsAppCustomerId) || activeCustomer}
        customerSummary={whatsAppCustomerId ? customerSummaries[whatsAppCustomerId] : activeSummary}
        rates={rates}
      />

      <BackupModal
        lang={lang}
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        customers={customers}
        transactions={transactions}
        rates={rates}
        onRestoreData={handleRestoreData}
      />

      <QuickConverterModal
        lang={lang}
        isOpen={isConverterModalOpen}
        onClose={() => setIsConverterModalOpen(false)}
        rates={rates}
      />

    </div>
  );
}

export default App;
