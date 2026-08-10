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
 * Generate complete itemized WhatsApp Bill / Ledger Statement in Tamil / English
 */
export function generateWhatsAppMessage(customer, summary, currentRate, lang = 'ta') {
  const name = customer.name || 'வாடிக்கையாளர்';
  const phone = customer.phone || '-';
  const address = customer.address || '-';
  const gramsStr = formatGrams(Math.abs(summary.netBalanceGrams));
  const rupeeStr = formatCurrency(Math.abs(summary.approxRupeesDue));
  const rateStr = formatCurrency(currentRate);
  const dateStr = formatDate(new Date().toISOString());

  const txList = summary.transactions || [];

  if (lang === 'ta') {
    let msg = `✦ *Praise The Lord* ✦\n`;
    msg += `🦅 *EAGLE SILVERS WHOLESALE*\n`;
    msg += `📍 தெற்கு மாசி வீதி, மதுரை | 📞 +91 98421 54321\n`;
    msg += `================================\n`;
    msg += `🧾 *முழு கணக்கு ரசீது (Full Statement Bill)*\n`;
    msg += `👤 *பெயர்:* ${name}\n`;
    if (phone !== '-') msg += `📞 *எண்:* ${phone}\n`;
    if (address !== '-') msg += `📍 *ஊர்:* ${address}\n`;
    msg += `📅 *தேதி:* ${dateStr}\n`;
    msg += `💰 *அன்றைய வெள்ளி விலை:* ${rateStr}/g\n`;
    msg += `================================\n\n`;

    msg += `📋 *பரிவர்த்தனை விவரங்கள் (Item Details):*\n`;

    if (txList.length === 0) {
      msg += `(பரிவர்த்தனைகள் எதுவும் இல்லை)\n\n`;
    } else {
      txList.forEach((tx, idx) => {
        const itemDate = formatDate(tx.date);
        const itemTitle = tx.itemName || 'வெள்ளி பரிவர்த்தனை';
        
        msg += `${idx + 1}. *${itemTitle}* (${itemDate})\n`;

        if (tx.touchPercent && tx.touchPercent < 100 && tx.type === 'NEW_SALE') {
          msg += `   • எடை: ${formatGrams(tx.weight)}g @ ${tx.touchPercent}% Touch\n`;
        }

        if (tx.cashAmount) {
          msg += `   • ரொக்கம்: ${formatCurrency(tx.cashAmount)} ÷ ${formatCurrency(tx.ratePerGram || currentRate)}/g\n`;
        }

        if (tx.debitGrams > 0) {
          msg += `   ➕ *பற்று (+):* +${formatGrams(tx.debitGrams)} g\n`;
        }
        if (tx.creditGrams > 0) {
          msg += `   ➖ *வரவு (-):* -${formatGrams(tx.creditGrams)} g\n`;
        }
        msg += `   👉 *இருப்பு:* ${formatGrams(Math.abs(tx.balanceAfterGrams))} g\n\n`;
      });
    }

    msg += `================================\n`;
    msg += `📊 *கணக்கு சுருக்கம் (Summary):*\n`;
    msg += `• மொத்த பற்று (Total Out): ${formatGrams(summary.totalDebit)} g\n`;
    msg += `• மொத்த வரவு (Total In): ${formatGrams(summary.totalCredit)} g\n`;
    msg += `--------------------------------\n`;

    if (summary.status === 'DUE') {
      msg += `🔴 *இறுதி நிலுவை (Net Due):* *${gramsStr} g*\n`;
      msg += `💵 *மதிப்பிடப்பட்ட தொகை:* *${rupeeStr}*\n\n`;
      msg += `தயவுசெய்து உங்கள் வசதிக்கேற்ப பணமாகவோ அல்லது பழைய வெள்ளியாகவோ கணக்கை நேர் செய்யவும்.\n`;
    } else if (summary.status === 'ADVANCE') {
      msg += `🟢 *முன்வரவு இருப்பு (Advance):* *${gramsStr} g (${rupeeStr})*\n\n`;
    } else {
      msg += `⚪ *கணக்கு முழுமையாக முடிவடைந்தது (Nil Balance).* நன்றி!\n\n`;
    }

    msg += `================================\n`;
    msg += `✨ *நன்றி! மீண்டும் வருக! - EAGLE SILVERS*`;
    return msg;
  } else {
    let msg = `✦ *Praise The Lord* ✦\n`;
    msg += `🦅 *EAGLE SILVERS WHOLESALE*\n`;
    msg += `📍 South Masi Street, Madurai | 📞 +91 98421 54321\n`;
    msg += `================================\n`;
    msg += `🧾 *COMPLETE ACCOUNT BILL STATEMENT*\n`;
    msg += `👤 *Customer:* ${name}\n`;
    if (phone !== '-') msg += `📞 *Phone:* ${phone}\n`;
    if (address !== '-') msg += `📍 *City:* ${address}\n`;
    msg += `📅 *Date:* ${dateStr}\n`;
    msg += `💰 *Silver Rate:* ${rateStr}/g\n`;
    msg += `================================\n\n`;

    msg += `📋 *Transaction Breakdown:*\n`;

    if (txList.length === 0) {
      msg += `(No transactions recorded)\n\n`;
    } else {
      txList.forEach((tx, idx) => {
        const itemDate = formatDate(tx.date);
        const itemTitle = tx.itemName || 'Silver Item';
        
        msg += `${idx + 1}. *${itemTitle}* (${itemDate})\n`;

        if (tx.touchPercent && tx.touchPercent < 100 && tx.type === 'NEW_SALE') {
          msg += `   • Wt: ${formatGrams(tx.weight)}g @ ${tx.touchPercent}% Touch\n`;
        }

        if (tx.cashAmount) {
          msg += `   • Cash: ${formatCurrency(tx.cashAmount)} ÷ ${formatCurrency(tx.ratePerGram || currentRate)}/g\n`;
        }

        if (tx.debitGrams > 0) {
          msg += `   ➕ *Debit (+):* +${formatGrams(tx.debitGrams)} g\n`;
        }
        if (tx.creditGrams > 0) {
          msg += `   ➖ *Credit (-):* -${formatGrams(tx.creditGrams)} g\n`;
        }
        msg += `   👉 *Balance:* ${formatGrams(Math.abs(tx.balanceAfterGrams))} g\n\n`;
      });
    }

    msg += `================================\n`;
    msg += `📊 *Summary:*\n`;
    msg += `• Total Debit: ${formatGrams(summary.totalDebit)} g\n`;
    msg += `• Total Credit: ${formatGrams(summary.totalCredit)} g\n`;
    msg += `--------------------------------\n`;

    if (summary.status === 'DUE') {
      msg += `🔴 *Net Balance Due:* *${gramsStr} g*\n`;
      msg += `💵 *Approx Amount:* *${rupeeStr}*\n\n`;
      msg += `Kindly settle the balance at your earliest convenience.\n`;
    } else if (summary.status === 'ADVANCE') {
      msg += `🟢 *Advance Balance:* *${gramsStr} g (${rupeeStr})*\n\n`;
    } else {
      msg += `⚪ *Account Fully Settled (Nil Balance).* Thank you!\n\n`;
    }

    msg += `================================\n`;
    msg += `✨ *Thank you! EAGLE SILVERS WHOLESALE*`;
    return msg;
  }
}
