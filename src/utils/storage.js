import { initialSilverRates } from './demoData';
import { supabase } from './supabaseClient';

const CUSTOMERS_KEY = 'eagle_book_customers_v1';
const TRANSACTIONS_KEY = 'eagle_book_transactions_v1';
const RATES_KEY = 'eagle_book_rates_v1';
const LANG_KEY = 'eagle_book_lang_v1';
const AUTH_USER_KEY = 'eagle_book_auth_user_v1';

const DEFAULT_OWNER_USER = {
  id: 'eaglebooks',
  phone: '8148003454',
  name: 'EagleBooks Admin',
  shopName: 'EAGLE SILVERS',
  role: 'OWNER',
  city: 'சிவகாசி (Sivakasi)'
};

export function loadStoredData() {
  try {
    const rawCust = localStorage.getItem(CUSTOMERS_KEY);
    const rawTx = localStorage.getItem(TRANSACTIONS_KEY);
    const rawRates = localStorage.getItem(RATES_KEY);
    const rawLang = localStorage.getItem(LANG_KEY);
    const rawAuth = localStorage.getItem(AUTH_USER_KEY);

    return {
      customers: rawCust ? JSON.parse(rawCust) : [],
      transactions: rawTx ? JSON.parse(rawTx) : [],
      rates: rawRates ? JSON.parse(rawRates) : initialSilverRates,
      lang: rawLang || 'ta',
      authUser: rawAuth ? JSON.parse(rawAuth) : DEFAULT_OWNER_USER
    };
  } catch (err) {
    console.error('Failed to load from localStorage:', err);
    return {
      customers: [],
      transactions: [],
      rates: initialSilverRates,
      lang: 'ta',
      authUser: DEFAULT_OWNER_USER
    };
  }
}

export function saveCustomers(customers) {
  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers || []));
  } catch (err) {
    console.error('Error saving customers to local storage:', err);
  }
}

export function saveTransactions(transactions) {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions || []));
  } catch (err) {
    console.error('Error saving transactions to local storage:', err);
  }
}

export function saveRates(rates) {
  try {
    localStorage.setItem(RATES_KEY, JSON.stringify(rates));
  } catch (err) {
    console.error('Error saving rates to local storage:', err);
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

// ============================================================================
// SUPABASE CLOUD SYNC METHODS
// ============================================================================

/**
 * Fetch all data from Supabase cloud database
 */
export async function fetchCloudData() {
  try {
    const [custRes, txRes, ratesRes] = await Promise.all([
      supabase.from('customers').select('*').order('created_at', { ascending: true }),
      supabase.from('transactions').select('*').order('date', { ascending: true }),
      supabase.from('silver_rates').select('*').eq('id', 'current_rate').single()
    ]);

    const result = {
      hasCloudData: false,
      customers: null,
      transactions: null,
      rates: null
    };

    if (custRes.data && Array.isArray(custRes.data) && custRes.data.length > 0) {
      result.customers = custRes.data.map(c => ({
        id: c.id,
        name: c.name,
        jewelleryShop: c.jewellery_shop || c.jewelleryShop || '',
        phone: c.phone || '',
        address: c.address || '',
        type: c.type || 'typeJewelleryShop',
        customType: c.custom_type || c.customType || '',
        notes: c.notes || '',
        createdAt: c.created_at
      }));
      result.hasCloudData = true;
    }

    if (txRes.data && Array.isArray(txRes.data) && txRes.data.length > 0) {
      result.transactions = txRes.data.map(t => ({
        id: t.id,
        customerId: t.customer_id,
        date: t.date,
        type: t.type,
        itemName: t.item_name,
        weight: Number(t.weight) || 0,
        touchPercent: Number(t.touch_percent) || 100,
        wastagePercent: Number(t.wastage_percent) || 0,
        cashAmount: t.cash_amount ? Number(t.cash_amount) : null,
        ratePerGram: t.rate_per_gram ? Number(t.rate_per_gram) : null,
        convertedGrams: t.converted_grams ? Number(t.converted_grams) : null,
        isTouchAdjusted: Boolean(t.is_touch_adjusted),
        direction: t.direction,
        notes: t.notes
      }));
      result.hasCloudData = true;
    }

    if (ratesRes.data) {
      result.rates = {
        ratePerGram: Number(ratesRes.data.rate_per_gram) || 95,
        ratePerKg: Number(ratesRes.data.rate_per_kg) || 95000,
        lastUpdated: ratesRes.data.last_updated
      };
    }

    return result;
  } catch (err) {
    console.warn('Supabase cloud fetch failed (using local storage):', err);
    return { hasCloudData: false, error: err };
  }
}

/**
 * Upload local data to cloud
 */
export async function uploadLocalDataToCloud(customers, transactions, rates) {
  try {
    if (customers && customers.length > 0) {
      const dbCust = customers.map(c => ({
        id: c.id,
        name: c.name,
        jewellery_shop: c.jewelleryShop || '',
        phone: c.phone || '',
        address: c.address || '',
        type: c.type || 'typeJewelleryShop',
        custom_type: c.customType || '',
        notes: c.notes || ''
      }));
      await supabase.from('customers').upsert(dbCust, { onConflict: 'id' });
    }

    if (transactions && transactions.length > 0) {
      const dbTx = transactions.map(t => ({
        id: t.id,
        customer_id: t.customerId,
        date: t.date,
        type: t.type,
        item_name: t.itemName,
        weight: t.weight || 0,
        touch_percent: t.touchPercent || 100,
        wastage_percent: t.wastagePercent || 0,
        cash_amount: t.cashAmount,
        rate_per_gram: t.ratePerGram,
        converted_grams: t.convertedGrams,
        is_touch_adjusted: t.isTouchAdjusted || false,
        direction: t.direction,
        notes: t.notes
      }));
      await supabase.from('transactions').upsert(dbTx, { onConflict: 'id' });
    }

    if (rates) {
      await supabase.from('silver_rates').upsert({
        id: 'current_rate',
        rate_per_gram: Number(rates.ratePerGram) || 95,
        rate_per_kg: (Number(rates.ratePerGram) || 95) * 1000,
        last_updated: new Date().toISOString()
      }, { onConflict: 'id' });
    }

    return { success: true };
  } catch (err) {
    console.error('Error uploading local data to cloud:', err);
    return { success: false, error: err };
  }
}

/**
 * Sync single customer to Supabase
 */
export async function syncCustomerToCloud(customer) {
  try {
    const payload = {
      id: customer.id,
      name: customer.name,
      jewellery_shop: customer.jewelleryShop || '',
      phone: customer.phone || '',
      address: customer.address || '',
      type: customer.type || 'typeJewelleryShop',
      custom_type: customer.customType || '',
      notes: customer.notes || '',
      updated_at: new Date().toISOString()
    };
    await supabase.from('customers').upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.warn('Error syncing customer to cloud:', err);
  }
}

/**
 * Delete customer from Supabase
 */
export async function deleteCustomerFromCloud(customerId) {
  try {
    await supabase.from('customers').delete().eq('id', customerId);
  } catch (err) {
    console.warn('Error deleting customer from cloud:', err);
  }
}

/**
 * Sync single transaction to Supabase
 */
export async function syncTransactionToCloud(tx) {
  try {
    const payload = {
      id: tx.id,
      customer_id: tx.customerId,
      date: tx.date,
      type: tx.type,
      item_name: tx.itemName,
      weight: Number(tx.weight) || 0,
      touch_percent: Number(tx.touchPercent) || 100,
      wastage_percent: Number(tx.wastagePercent) || 0,
      cash_amount: tx.cashAmount ? Number(tx.cashAmount) : null,
      rate_per_gram: tx.ratePerGram ? Number(tx.ratePerGram) : null,
      converted_grams: tx.convertedGrams ? Number(tx.convertedGrams) : null,
      is_touch_adjusted: Boolean(tx.isTouchAdjusted),
      direction: tx.direction || null,
      notes: tx.notes || null
    };
    await supabase.from('transactions').upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.warn('Error syncing transaction to cloud:', err);
  }
}

/**
 * Delete transaction from Supabase
 */
export async function deleteTransactionFromCloud(txId) {
  try {
    await supabase.from('transactions').delete().eq('id', txId);
  } catch (err) {
    console.warn('Error deleting transaction from cloud:', err);
  }
}

/**
 * Sync silver rates to Supabase
 */
export async function syncRatesToCloud(rates) {
  try {
    const payload = {
      id: 'current_rate',
      rate_per_gram: Number(rates.ratePerGram) || 95,
      rate_per_kg: (Number(rates.ratePerGram) || 95) * 1000,
      last_updated: new Date().toISOString()
    };
    await supabase.from('silver_rates').upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.warn('Error syncing rates to cloud:', err);
  }
}

/**
 * Subscribe to realtime PostgreSQL changes
 */
export function subscribeToRealtime({ onCustomerEvent, onTransactionEvent, onRateEvent }) {
  const channel = supabase.channel('eagle-books-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'customers' },
      (payload) => {
        if (onCustomerEvent) onCustomerEvent(payload);
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'transactions' },
      (payload) => {
        if (onTransactionEvent) onTransactionEvent(payload);
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'silver_rates' },
      (payload) => {
        if (onRateEvent) onRateEvent(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function exportBackupJSON(customers, transactions, rates) {
  const data = {
    appName: 'Eagle Books',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    customers: customers || [],
    transactions: transactions || [],
    rates
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Eagle_Books_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function clearAllRecords() {
  localStorage.removeItem(CUSTOMERS_KEY);
  localStorage.removeItem(TRANSACTIONS_KEY);
  return {
    customers: [],
    transactions: [],
    rates: initialSilverRates
  };
}
