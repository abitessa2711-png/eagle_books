import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { loadStoredData, saveStoredData, fetchCloudData, uploadLocalDataToCloud, syncCustomerToCloud, deleteCustomerFromCloud, syncTransactionToCloud, deleteTransactionFromCloud, syncRatesToCloud, subscribeToRealtime } from './utils/storage';
import { computeCustomerTransactions } from './utils/calculations';
import { initialSilverRates, initialCustomers, initialTransactions } from './utils/demoData';

import { EagleHeader } from './components/EagleHeader';
import { RateManagerModal } from './components/RateManagerModal';
import { CustomerModal } from './components/CustomerModal';
import { TransactionDrawer } from './components/TransactionDrawer';
import { KhatabookCustomerLedger } from './components/KhatabookCustomerLedger';
import { HandwrittenNotebook } from './components/HandwrittenNotebook';
import { ReceiptModal } from './components/ReceiptModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { BackupModal } from './components/BackupModal';
import { QuickConverterModal } from './components/QuickConverterModal';
import { CustomerPdfModal } from './components/CustomerPdfModal';
import { LoginScreen } from './components/LoginScreen';

const DEFAULT_OWNER_USER = {
  id: 'owner',
  username: 'eaglebooks.com',
  name: 'EAGLE SILVERS (உரிமையாளர்)'
};

export default function App() {
  // Load initial local state
  const initial = useMemo(() => loadStoredData(), []);

  const [customers, setCustomers] = useState(initial.customers && initial.customers.length > 0 ? initial.customers : initialCustomers);
  const [transactions, setTransactions] = useState(initial.transactions && initial.transactions.length > 0 ? initial.transactions : initialTransactions);
  const [rates, setRates] = useState(initial.rates || initialSilverRates);
  const [lang, setLang] = useState(initial.lang || 'ta');
  const [authUser, setAuthUser] = useState(initial.authUser || DEFAULT_OWNER_USER);
  const [cloudSynced, setCloudSynced] = useState(false);

  // Active View Tab: 'customers' | 'notebook'
  const [activeTab, setActiveTab] = useState('customers');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // Modals & Drawers
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('GIVE'); // 'GIVE' | 'GET'
  
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptCustomerId, setReceiptCustomerId] = useState(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppCustomerId, setWhatsAppCustomerId] = useState(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isConverterModalOpen, setIsConverterModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfCustomerId, setPdfCustomerId] = useState(null);

  // 1. 100% Automatic & Silent Cloud Sync with Bi-Directional Merge
  const syncDataFromCloud = useCallback(async () => {
    try {
      const cloudRes = await fetchCloudData();
      if (cloudRes.hasCloudData) {
        if (cloudRes.customers && cloudRes.customers.length > 0) {
          setCustomers((prevCustomers) => {
            const cloudCusts = cloudRes.customers;
            const cloudMap = new Map(cloudCusts.map(c => [c.id, c]));
            const unSyncedLocal = prevCustomers.filter(lc => !cloudMap.has(lc.id));
            if (unSyncedLocal.length > 0) {
              uploadLocalDataToCloud(unSyncedLocal, [], null);
            }
            return [...cloudCusts, ...unSyncedLocal];
          });
        }

        if (cloudRes.transactions && cloudRes.transactions.length > 0) {
          setTransactions((prevTx) => {
            const cloudTxs = cloudRes.transactions;
            const cloudTxMap = new Map(cloudTxs.map(t => [t.id, t]));
            const unSyncedLocalTx = prevTx.filter(lt => !cloudTxMap.has(lt.id));
            if (unSyncedLocalTx.length > 0) {
              uploadLocalDataToCloud([], unSyncedLocalTx, null);
            }
            return [...cloudTxs, ...unSyncedLocalTx];
          });
        }

        if (cloudRes.rates) {
          setRates(prev => ({ ...prev, ...cloudRes.rates }));
        }
        setCloudSynced(true);
      } else {
        if (customers.length > 0 || transactions.length > 0) {
          uploadLocalDataToCloud(customers, transactions, rates);
        }
      }
    } catch (err) {
      console.warn('Silent cloud sync warning:', err);
    }
  }, [customers, transactions, rates]);

  useEffect(() => {
    let isMounted = true;
    
    // Initial sync on mount
    syncDataFromCloud();

    // Fast periodic silent cloud sync every 3 seconds
    const interval = setInterval(() => {
      if (isMounted) {
        syncDataFromCloud();
      }
    }, 3000);

    // Auto-sync when user returns to app window
    const handleFocus = () => {
      if (isMounted) syncDataFromCloud();
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    // Realtime listener for instant cross-device updates
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
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
      if (unsubscribe) unsubscribe();
    };
  }, [syncDataFromCloud]);

  // Persistence to local storage (Offline Cache)
  useEffect(() => {
    saveStoredData({ customers });
  }, [customers]);

  useEffect(() => {
    saveStoredData({ transactions });
  }, [transactions]);

  useEffect(() => {
    saveStoredData({ rates });
  }, [rates]);

  useEffect(() => {
    saveStoredData({ lang });
  }, [lang]);

  const handleLoginSuccess = (user) => {
    const finalUser = user || DEFAULT_OWNER_USER;
    setAuthUser(finalUser);
    saveStoredData({ authUser: finalUser });
    if (customers && customers.length > 0) {
      uploadLocalDataToCloud(customers, transactions, rates).then(() => {
        syncDataFromCloud();
      });
    }
  };

  const handleLogout = () => {
    setAuthUser(null);
    saveStoredData({ authUser: null });
  };

  // Compute Running Balances for All Customers
  const customerSummaries = useMemo(() => {
    const map = {};
    const rate = Number(rates?.ratePerGram) || 95;

    (customers || []).forEach((cust) => {
      const custTxs = (transactions || []).filter((t) => t.customerId === cust.id);
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

  const handleDeleteTransaction = (txId) => {
    if (!txId) return;
    setTransactions((prev) => prev.filter((t) => t.id !== txId));
    deleteTransactionFromCloud(txId);
  };

  const handleDeleteCustomer = (customerId) => {
    if (!customerId) return;
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    setTransactions((prev) => prev.filter((t) => t.customerId !== customerId));
    deleteCustomerFromCloud(customerId);

    if (selectedCustomerId === customerId) {
      setSelectedCustomerId(null);
    }
  };

  const handleSaveSilverRates = (newRates) => {
    setRates(newRates);
    syncRatesToCloud(newRates);
  };

  const handleRestoreData = (newCustomers, newTransactions, newRates) => {
    if (newCustomers && Array.isArray(newCustomers)) {
      setCustomers(newCustomers);
    }
    if (newTransactions && Array.isArray(newTransactions)) {
      setTransactions(newTransactions);
    }
    if (newRates) {
      setRates(newRates);
    }
    uploadLocalDataToCloud(newCustomers, newTransactions, newRates);
  };

  // If not logged in, show Login Screen
  if (!authUser) {
    return <LoginScreen lang={lang} onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Eagle Silvers Header */}
      <EagleHeader
        lang={lang}
        setLang={setLang}
        silverRate={rates?.ratePerGram || 95}
        onOpenRateModal={() => setIsRateModalOpen(true)}
        onLogout={handleLogout}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenConverterModal={() => setIsConverterModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="app-main-content">
        {activeTab === 'customers' ? (
          <KhatabookCustomerLedger
            lang={lang}
            customers={customers}
            customerSummaries={customerSummaries}
            selectedCustomerId={selectedCustomerId}
            onSelectCustomer={handleSelectCustomer}
            onBackToList={handleBackToList}
            onOpenAddCustomer={() => setIsAddCustomerOpen(true)}
            onOpenGiveDrawer={handleOpenGiveDrawer}
            onOpenGetDrawer={handleOpenGetDrawer}
            onOpenReceiptModal={(cust) => {
              setReceiptCustomerId(cust.id);
              setIsReceiptModalOpen(true);
            }}
            onOpenWhatsAppModal={(cust) => {
              setWhatsAppCustomerId(cust.id);
              setIsWhatsAppModalOpen(true);
            }}
            onOpenPdfModal={(cust) => {
              setPdfCustomerId(cust.id);
              setIsPdfModalOpen(true);
            }}
            onDeleteTransaction={handleDeleteTransaction}
            onDeleteCustomer={handleDeleteCustomer}
            rates={rates}
          />
        ) : (
          <HandwrittenNotebook
            lang={lang}
            customers={customers}
            customerSummaries={customerSummaries}
            selectedCustomerId={selectedCustomerId}
            onSelectCustomer={handleSelectCustomer}
            onOpenGiveDrawer={handleOpenGiveDrawer}
            onOpenGetDrawer={handleOpenGetDrawer}
            onOpenPdfModal={(cust) => {
              setPdfCustomerId(cust.id);
              setIsPdfModalOpen(true);
            }}
            rates={rates}
          />
        )}
      </main>

      {/* Bottom Sticky Navigation Bar */}
      <nav className="app-bottom-nav">
        <button
          className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          <span className="nav-icon">📖</span>
          <span className="nav-label">{lang === 'ta' ? 'கதாபுத்தகம்' : 'Khatabook'}</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'notebook' ? 'active' : ''}`}
          onClick={() => setActiveTab('notebook')}
        >
          <span className="nav-icon">📝</span>
          <span className="nav-label">{lang === 'ta' ? 'கைப்பட நோட்டு' : 'Notebook View'}</span>
        </button>
      </nav>

      {/* Modals & Slide-Over Drawers */}
      <CustomerModal
        lang={lang}
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onSaveCustomer={handleSaveCustomer}
      />

      <TransactionDrawer
        lang={lang}
        isOpen={isDrawerOpen}
        mode={drawerMode}
        onClose={() => setIsDrawerOpen(false)}
        customer={activeCustomer}
        rates={rates}
        onSaveTransaction={handleSaveTransaction}
      />

      <RateManagerModal
        lang={lang}
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        rates={rates}
        onSave={handleSaveSilverRates}
      />

      <ReceiptModal
        lang={lang}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        customer={(customers || []).find((c) => c.id === receiptCustomerId)}
        customerSummary={receiptCustomerId ? customerSummaries[receiptCustomerId] : null}
        rates={rates}
      />

      <WhatsAppModal
        lang={lang}
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        customer={(customers || []).find((c) => c.id === whatsAppCustomerId)}
        customerSummary={whatsAppCustomerId ? customerSummaries[whatsAppCustomerId] : null}
        rates={rates}
      />

      <BackupModal
        lang={lang}
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        customers={customers}
        transactions={transactions}
        rates={rates}
        onRestore={handleRestoreData}
      />

      <QuickConverterModal
        lang={lang}
        isOpen={isConverterModalOpen}
        onClose={() => setIsConverterModalOpen(false)}
        rates={rates}
      />

      <CustomerPdfModal
        lang={lang}
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        customer={(customers || []).find((c) => c.id === pdfCustomerId)}
        customerSummary={pdfCustomerId ? customerSummaries[pdfCustomerId] : null}
        rates={rates}
      />
    </div>
  );
}
