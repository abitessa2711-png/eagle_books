import { initialCustomers, initialTransactions, initialSilverRates } from './demoData';

const CUSTOMERS_KEY = 'eagle_book_customers_v1';
const TRANSACTIONS_KEY = 'eagle_book_transactions_v1';
const RATES_KEY = 'eagle_book_rates_v1';
const LANG_KEY = 'eagle_book_lang_v1';
const AUTH_USER_KEY = 'eagle_book_auth_user_v1';

export function loadStoredData() {
  try {
    const rawCust = localStorage.getItem(CUSTOMERS_KEY);
    const rawTx = localStorage.getItem(TRANSACTIONS_KEY);
    const rawRates = localStorage.getItem(RATES_KEY);
    const rawLang = localStorage.getItem(LANG_KEY);
    const rawAuth = localStorage.getItem(AUTH_USER_KEY);

    return {
      customers: rawCust ? JSON.parse(rawCust) : initialCustomers,
      transactions: rawTx ? JSON.parse(rawTx) : initialTransactions,
      rates: rawRates ? JSON.parse(rawRates) : initialSilverRates,
      lang: rawLang || 'ta',
      authUser: rawAuth ? JSON.parse(rawAuth) : null
    };
  } catch (err) {
    console.error('Failed to load from localStorage, using fallback demo data:', err);
    return {
      customers: initialCustomers,
      transactions: initialTransactions,
      rates: initialSilverRates,
      lang: 'ta',
      authUser: null
    };
  }
}

export function saveCustomers(customers) {
  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  } catch (err) {
    console.error('Error saving customers:', err);
  }
}

export function saveTransactions(transactions) {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (err) {
    console.error('Error saving transactions:', err);
  }
}

export function saveRates(rates) {
  try {
    localStorage.setItem(RATES_KEY, JSON.stringify(rates));
  } catch (err) {
    console.error('Error saving rates:', err);
  }
}

export function saveLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (err) {
    console.error('Error saving lang:', err);
  }
}

export function saveAuthUser(user) {
  try {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  } catch (err) {
    console.error('Error saving auth user:', err);
  }
}

export function exportBackupJSON(customers, transactions, rates) {
  const data = {
    appName: 'Eagle Book',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    customers,
    transactions,
    rates
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Eagle_Book_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function resetToDemoData() {
  localStorage.removeItem(CUSTOMERS_KEY);
  localStorage.removeItem(TRANSACTIONS_KEY);
  localStorage.removeItem(RATES_KEY);
  return {
    customers: initialCustomers,
    transactions: initialTransactions,
    rates: initialSilverRates
  };
}
