// Precision calculation engine for Silver & Gold Jewelry Ledger (Eagle Book)

/**
 * Format weight in grams with standard 3 decimal places (e.g., 128.730 g)
 */
export function formatGrams(val) {
  if (val === null || val === undefined || isNaN(val)) return '0.000';
  const num = Number(val);
  return num.toFixed(3);
}

/**
 * Format Indian Currency in Rupees (e.g. ₹23,000)
 */
export function formatCurrency(val) {
  if (val === null || val === undefined || isNaN(val)) return '₹0';
  const num = Math.round(Number(val));
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
}

/**
 * Format short date (e.g. 14/06/2026 or 25/07/2026)
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Convert Cash Paid to Silver Grams
 * 
 * Mode 'standard': Cash Amount ÷ Rate per gram (e.g. ₹23,000 ÷ ₹95/g = 242.105 g)
 * Mode 'touchAdjusted': (Cash Amount ÷ Rate) × (Touch % ÷ 100)
 *   (e.g., as in notebook: 25,000 ÷ 249 × 78% = 128.730 g)
 */
export function convertCashToGrams(amount, ratePerGram, touchPercent = 100, isTouchAdjusted = false) {
  const amt = Number(amount) || 0;
  const rate = Number(ratePerGram) || 1;
  const touch = Number(touchPercent) || 100;

  if (amt <= 0 || rate <= 0) return 0;

  if (isTouchAdjusted && touch > 0) {
    return (amt / rate) * (touch / 100);
  }

  return amt / rate;
}

/**
 * Calculate Pure Silver / Net Weight from Gross Weight and Touch / Wastage
 */
export function calculateNetSilver(grossWeight, touchPercent = 100, wastagePercent = 0) {
  const gross = Number(grossWeight) || 0;
  const touch = Number(touchPercent) || 100;
  const wastage = Number(wastagePercent) || 0;

  // Touch based pure weight
  if (touch > 0 && touch <= 100) {
    const pure = gross * (touch / 100);
    return pure;
  }

  // Wastage based net weight
  if (wastage > 0) {
    const net = gross * (1 - wastage / 100);
    return Math.max(0, net);
  }

  return gross;
}

/**
 * Compute the complete chronological running balance for a customer's transactions
 * 
 * Transaction Types:
 * 1. 'OPENING_BALANCE': Initial carried balance (CB) -> + grams (Customer owes)
 * 2. 'NEW_SALE': New item given (கொலுசு, etc.) -> + grams (Debit / பற்று)
 * 3. 'OLD_SILVER': Old silver received -> - grams (Credit / வரவு)
 * 4. 'CASH_PAYMENT': Cash paid converted to grams -> - grams (Credit / வரவு)
 * 5. 'DIRECT_ADJUST': Manual direct gram addition or subtraction
 */
export function computeCustomerTransactions(transactions = [], currentSilverRate = 95) {
  // Sort chronologically
  const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

  let runningBalanceGrams = 0;

  const calculatedList = sorted.map((t) => {
    let debitGrams = 0;  // Customer receives item (Owes more +)
    let creditGrams = 0; // Customer gives silver or cash (Owes less -)
    let effectiveGrams = 0;

    if (t.type === 'OPENING_BALANCE') {
      debitGrams = Number(t.weight) || 0;
      effectiveGrams = debitGrams;
      runningBalanceGrams += effectiveGrams;
    } else if (t.type === 'NEW_SALE') {
      // New jewelry sold/given to customer
      const pure = calculateNetSilver(t.weight, t.touchPercent || 100, t.wastagePercent || 0);
      debitGrams = pure;
      effectiveGrams = debitGrams;
      runningBalanceGrams += effectiveGrams;
    } else if (t.type === 'OLD_SILVER') {
      // Old jewelry returned by customer
      const net = calculateNetSilver(t.weight, t.touchPercent || 100, t.wastagePercent || 0);
      creditGrams = net;
      effectiveGrams = -creditGrams;
      runningBalanceGrams += effectiveGrams;
    } else if (t.type === 'CASH_PAYMENT') {
      // Cash payment converted to grams
      const grams = t.convertedGrams !== undefined && t.convertedGrams !== null && t.convertedGrams !== ''
        ? Number(t.convertedGrams)
        : convertCashToGrams(t.cashAmount, t.ratePerGram || currentSilverRate, t.touchPercent || 100, t.isTouchAdjusted);
      creditGrams = grams;
      effectiveGrams = -creditGrams;
      runningBalanceGrams += effectiveGrams;
    } else if (t.type === 'DIRECT_ADJUST') {
      if (t.direction === 'DEBIT') {
        debitGrams = Number(t.weight) || 0;
        effectiveGrams = debitGrams;
        runningBalanceGrams += effectiveGrams;
      } else {
        creditGrams = Number(t.weight) || 0;
        effectiveGrams = -creditGrams;
        runningBalanceGrams += effectiveGrams;
      }
    }

    return {
      ...t,
      debitGrams,
      creditGrams,
      effectiveGrams,
      balanceAfterGrams: runningBalanceGrams,
      balanceAfterRupees: runningBalanceGrams * (Number(t.ratePerGram) || currentSilverRate)
    };
  });

  const totalDebit = calculatedList.reduce((acc, cur) => acc + cur.debitGrams, 0);
  const totalCredit = calculatedList.reduce((acc, cur) => acc + cur.creditGrams, 0);
  const netBalanceGrams = runningBalanceGrams;
  const approxRupeesDue = netBalanceGrams * currentSilverRate;

  let status = 'SETTLED'; // 0
  if (netBalanceGrams > 0.001) {
    status = 'DUE'; // Customer owes us (Red)
  } else if (netBalanceGrams < -0.001) {
    status = 'ADVANCE'; // We owe customer / advance (Green)
  }

  return {
    transactions: calculatedList,
    totalDebit,
    totalCredit,
    netBalanceGrams,
    approxRupeesDue,
    status
  };
}

/**
 * Generate standard WhatsApp text message in Tamil / English
 */
export function generateWhatsAppMessage(customer, summary, currentRate, lang = 'ta') {
  const name = customer.name || 'வணக்கம்';
  const gramsStr = formatGrams(Math.abs(summary.netBalanceGrams));
  const rupeeStr = formatCurrency(Math.abs(summary.approxRupeesDue));
  const rateStr = formatCurrency(currentRate);

  if (lang === 'ta') {
    let msg = `வணக்கம் ${name},\n\n`;
    msg += `*Eagle Book - வெள்ளி நகை கணக்கு நிலுவை அறிக்கை*\n`;
    msg += `----------------------------------------\n`;
    if (summary.status === 'DUE') {
      msg += `🔴 *உங்கள் நிலுவை இருப்பு:* ${gramsStr} கிராம்\n`;
      msg += `💵 *மதிப்பிடப்பட்ட தொகை:* ${rupeeStr} (அன்றைய வெள்ளி விலை ${rateStr}/g படி)\n\n`;
      msg += `தயவுசெய்து உங்கள் வசதிக்கேற்ப பணமாகவோ அல்லது பழைய வெள்ளியாகவோ கணக்கை நேர் செய்யவும்.\n`;
    } else if (summary.status === 'ADVANCE') {
      msg += `🟢 *உங்களுடைய முன்வரவு இருப்பு:* ${gramsStr} கிராம் (${rupeeStr})\n\n`;
    } else {
      msg += `⚪ *உங்கள் கணக்கு முழுமையாக முடிவடைந்தது (நிலுவை இல்லை).* நன்றி!\n\n`;
    }
    msg += `----------------------------------------\n`;
    msg += `ஈகிள் புக் (Eagle Book) மூலம் உருவாக்கப்பட்டது.`;
    return msg;
  } else {
    let msg = `Hello ${name},\n\n`;
    msg += `*Eagle Book - Silver Jewelry Account Statement*\n`;
    msg += `----------------------------------------\n`;
    if (summary.status === 'DUE') {
      msg += `🔴 *Current Balance Due:* ${gramsStr} grams\n`;
      msg += `💵 *Estimated Value:* ${rupeeStr} (@ ${rateStr}/g)\n\n`;
      msg += `Kindly settle the balance at your convenience via cash or old silver.\n`;
    } else if (summary.status === 'ADVANCE') {
      msg += `🟢 *Advance Balance with us:* ${gramsStr} grams (${rupeeStr})\n\n`;
    } else {
      msg += `⚪ *Your account is fully settled.* Thank you!\n\n`;
    }
    msg += `----------------------------------------\n`;
    msg += `Generated via Eagle Book Ledger.`;
    return msg;
  }
}
