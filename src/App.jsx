import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
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
  saveAuthUser
} from './utils/storage';
import { computeCustomerTransactions } from './utils/calculations';
import { translations } from './utils/translations';

export function App() {
  const initialData = useMemo(() => loadStoredData(), []);

  const [authUser, setAuthUser] = useState(initialData.authUser);
  const [customers, setCustomers] = useState(initialData.customers);
  const [transactions, setTransactions] = useState(initialData.transactions);
  const [rates, setRates] = useState(initialData.rates);
  const [lang, setLang] = useState(initialData.lang || 'ta');

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

  // Persistence
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
    setAuthUser(user);
    saveAuthUser(user);
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

    customers.forEach((cust) => {
      const custTxs = transactions.filter((tx) => tx.customerId === cust.id);
      map[cust.id] = computeCustomerTransactions(custTxs, rate);
    });

    return map;
  }, [customers, transactions, rates]);

  const activeCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0] || null;
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
      }
    }
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
      if (selectedCustomerId === id) {
        setSelectedCustomerId(null);
      }
    }
  };

  const handleDeleteTransaction = (txId) => {
    const t = translations[lang];
    if (window.confirm(t.confirmDelete)) {
      setTransactions(transactions.filter((tx) => tx.id !== txId));
    }
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
        onLogout={handleLogout}
        onOpenRateModal={() => setIsRateModalOpen(true)}
        onOpenConverterModal={() => setIsConverterModalOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
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
                ⚡ {translations[lang].todayRate} ({translations[lang].updateRate})
              </button>

              <button
                onClick={() => setIsBackupModalOpen(true)}
                className="btn-mobile"
                style={{ background: '#f0f9ff', color: '#0369a1', border: '1.5px solid #7dd3fc', padding: '0.85rem' }}
              >
                💾 {translations[lang].backupRestore}
              </button>
            </div>
          </div>
        )}

      </main>

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
        onSaveRates={(updated) => setRates(updated)}
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
