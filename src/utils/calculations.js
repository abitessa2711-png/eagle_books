// Precision calculation engine for Silver & Gold Jewelry Ledger (Eagle Books)

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
 * Convert Cash Paid to Silver Grams based on Jeweler's Standard Purity Formula:
 * 
 * Step 1: Effective Rate per gram = Pure Silver Rate × (Touch % / 100)
 *         (e.g., 245 × 78% = ₹191.10/g)
 * Step 2: Converted Grams = Cash Amount ÷ Effective Rate
 *         (e.g., ₹10,000 ÷ 191.10 = 52.328 g)
 */
export function convertCashToGrams(amount, ratePerGram, touchPercent = 100, isTouchAdjusted = true) {
  const amt = Number(amount) || 0;
  const pureRate = Number(ratePerGram) || 1;
  const touch = Number(touchPercent) || 100;

  if (amt <= 0 || pureRate <= 0) return 0;

  const shouldAdjustTouch = isTouchAdjusted !== false && touch > 0 && touch <= 100;

  if (shouldAdjustTouch) {
    const effectiveRate = pureRate * (touch / 100);
    if (effectiveRate <= 0) return 0;
    return amt / effectiveRate;
  }

  return amt / pureRate;
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
 */
export function computeCustomerTransactions(transactions = [], currentSilverRate = 95) {
  // Sort chronologically
  const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

  let runningBalanceGrams = 0;

  const calculatedList = sorted.map((t) => {
    let debitGrams = 0;  // Customer receives item (Owes more +)
    let creditGrams = 0; // Customer gives silver or cash (Owes less -)

    const rawWeight = Number(t.weight) || 0;
    const touch = Number(t.touchPercent) || 100;

    switch (t.type) {
      case 'OPENING_BALANCE':
        debitGrams = rawWeight;
        break;

      case 'NEW_SALE':
        // New silver given to customer (+ Debit)
        if (t.debitGrams !== undefined && t.debitGrams !== null && Number(t.debitGrams) > 0) {
          debitGrams = Number(t.debitGrams);
        } else {
          debitGrams = calculateNetSilver(rawWeight, touch, t.wastagePercent || 0);
        }
        break;

      case 'OLD_SILVER':
        // Old silver received from customer (- Credit)
        if (t.creditGrams !== undefined && t.creditGrams !== null && Number(t.creditGrams) > 0) {
          creditGrams = Number(t.creditGrams);
        } else {
          creditGrams = calculateNetSilver(rawWeight, touch, t.wastagePercent || 0);
        }
        break;

      case 'CASH_PAYMENT':
        // Cash payment converted to grams (- Credit)
        if (t.cashAmount && (t.ratePerGram || currentSilverRate)) {
          creditGrams = convertCashToGrams(
            t.cashAmount,
            t.ratePerGram || currentSilverRate,
            t.touchPercent || 100,
            t.isTouchAdjusted !== false
          );
        } else if (t.creditGrams !== undefined && t.creditGrams !== null && Number(t.creditGrams) > 0) {
          creditGrams = Number(t.creditGrams);
        } else if (t.convertedGrams && Number(t.convertedGrams) > 0) {
          creditGrams = Number(t.convertedGrams);
        }
        break;

      case 'DIRECT_ADJUST':
        if (t.direction === 'GIVE') {
          debitGrams = rawWeight;
        } else {
          creditGrams = rawWeight;
        }
        break;

      default:
        debitGrams = rawWeight;
    }

    runningBalanceGrams = runningBalanceGrams + debitGrams - creditGrams;

    return {
      ...t,
      debitGrams,
      creditGrams,
      balanceAfterGrams: runningBalanceGrams,
      balanceAfterRupees: runningBalanceGrams * (Number(t.ratePerGram) || currentSilverRate)
    };
  });

  const totalDebit = calculatedList.reduce((acc, curr) => acc + curr.debitGrams, 0);
  const totalCredit = calculatedList.reduce((acc, curr) => acc + curr.creditGrams, 0);

  return {
    transactions: calculatedList,
    totalDebit,
    totalCredit,
    netBalanceGrams: runningBalanceGrams,
    netBalanceRupees: runningBalanceGrams * currentSilverRate,
    isDue: runningBalanceGrams > 0.001,
    isAdvance: runningBalanceGrams < -0.001,
    isSettled: Math.abs(runningBalanceGrams) <= 0.001
  };
}

/**
 * Generate Full Itemized WhatsApp Statement Message
 */
export function generateWhatsAppMessage(customer, summary, currentRate = 95, lang = 'ta') {
  if (!customer || !summary) return '';

  const name = customer.name || 'வாடிக்கையாளர்';
  const phone = customer.phone || '-';
  const address = customer.address || '-';

  const netGrams = formatGrams(Math.abs(summary.netBalanceGrams));
  const netRupees = formatCurrency(Math.abs(summary.netBalanceRupees));
  const rateStr = formatCurrency(currentRate);
  const dateStr = formatDate(new Date().toISOString());

  const txList = summary.transactions || [];

  let msg = `*EAGLE SILVERS (ஈகிள் சில்வர்ஸ் - சிவகாசி)*\n`;
  msg += `8 - வடக்கு ரத வீதி, டவுன் போலீஸ் ஸ்டேஷன் ரோடு, சிவகாசி.\n`;
  msg += `தொடர்புக்கு: 81480 03454, 73391 60876\n`;
  msg += `--------------------------------------------------\n`;
  msg += `*முழு கணக்கு அறிக்கை (Account Statement)*\n`;
  msg += `வாடிக்கையாளர்: ${name}\n`;
  if (phone !== '-') msg += `தொலைபேசி: ${phone}\n`;
  if (address !== '-') msg += `முகவரி: ${address}\n`;
  msg += `தேதி: ${dateStr}\n`;
  msg += `இன்றைய வெள்ளி விலை: ${rateStr}/g\n`;
  msg += `--------------------------------------------------\n\n`;

  msg += `*பரிவர்த்தனை விவரங்கள் (Item Details):*\n\n`;

  if (txList.length === 0) {
    msg += `(பரிவர்த்தனைகள் எதுவும் இல்லை)\n\n`;
  } else {
    txList.forEach((tx, idx) => {
      const itemDate = formatDate(tx.date);
      const itemTitle = tx.itemName || 'வெள்ளி பரிவர்த்தனை';
      
      msg += `${idx + 1}. *${itemTitle}* [${itemDate}]\n`;

      if (tx.touchPercent && tx.touchPercent < 100 && (tx.type === 'NEW_SALE' || tx.type === 'OLD_SILVER')) {
        msg += `   - மொத்த எடை: ${formatGrams(tx.weight)}g @ ${tx.touchPercent}% டச்\n`;
      }

      if (tx.cashAmount) {
        const appliedRate = tx.ratePerGram || currentRate;
        const touch = tx.touchPercent || 100;
        const effRate = appliedRate * (touch / 100);
        msg += `   - ரொக்கம்: ${formatCurrency(tx.cashAmount)} (ரேட்: ₹${appliedRate} @ ${touch}% = ₹${effRate.toFixed(2)}/g)\n`;
      }

      if (tx.debitGrams > 0) {
        msg += `   - பற்று (+): +${formatGrams(tx.debitGrams)} g நயம்\n`;
      }
      if (tx.creditGrams > 0) {
        msg += `   - வரவு (-): -${formatGrams(tx.creditGrams)} g நயம்\n`;
      }
      msg += `   - இருப்பு: ${formatGrams(Math.abs(tx.balanceAfterGrams))} g\n\n`;
    });
  }

  msg += `--------------------------------------------------\n`;
  msg += `*கணக்கு சுருக்கம் (Summary):*\n`;
  msg += `* மொத்த பற்று (Total Out): ${formatGrams(summary.totalDebit)} g\n`;
  msg += `* மொத்த வரவு (Total In): ${formatGrams(summary.totalCredit)} g\n`;
  msg += `--------------------------------------------------\n`;

  if (summary.isDue) {
    msg += `*நீங்கள் தர வேண்டிய மீதி இருப்பு (Net Due):*\n`;
    msg += `* *${netGrams} கிராம் நய வெள்ளி*\n`;
    msg += `* (தோராய மதிப்பு: சுமார் ${netRupees})\n`;
  } else if (summary.isAdvance) {
    msg += `*உங்களிடம் உள்ள முன்வைப்பு இருப்பு (Advance):*\n`;
    msg += `* *${netGrams} கிராம் நய வெள்ளி*\n`;
    msg += `* (தோராய மதிப்பு: சுமார் ${netRupees})\n`;
  } else {
    msg += `*கணக்கு முழுமையாக பூர்த்தியடைந்தது (Settled)*\n`;
  }

  msg += `--------------------------------------------------\n`;
  msg += `நன்றி! மீண்டும் வருக!\n`;
  msg += `- EAGLE SILVERS, சிவகாசி.\n`;

  return msg;
}
