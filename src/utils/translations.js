// Comprehensive Bilingual Dictionary for Eagle Books (ஈகிள் புக்ஸ்)

export const translations = {
  ta: {
    // App Branding & Header
    appName: 'ஈகிள் புக்ஸ்',
    appSubname: 'Eagle Books - டிஜி கோல்ட் சில்வர் கட்டாபுக்',
    tagline: 'ஸ்மார்ட் சில்வர் கட்டாபுக் & பாரம்பரிய கணக்கு நோட்டு',
    todayRate: 'இன்றைய வெள்ளி விலை',
    perGram: 'ரூ./கிராம்',
    per10Gram: 'ரூ./10 கிராம்',
    perKg: 'ரூ./கிலோ',
    updateRate: 'விலை மாற்று',
    searchCustomer: 'வாடிக்கையாளர் பெயர் / போன் எண் தேடுக...',
    newCustomer: 'புதிய வாடிக்கையாளர்',
    allCustomers: 'அனைத்து வாடிக்கையாளர்கள்',
    backupRestore: 'காப்புப்பிரதி (Backup)',
    exportData: 'ஏற்றுமதி (JSON)',
    importData: 'இறக்குமதி (Import)',
    resetDemo: 'மாதிரி தரவு (Demo Data)',
    quickCalculator: 'விரைவு கால்குலேட்டர்',
    
    // View Switcher
    viewKhatabook: 'கட்டாபுக் கார்டு பார்வை',
    viewNotebook: 'பாரம்பரிய நோட்புக் ஏடு',
    viewSummary: 'மொத்த வரவு-செலவு சுருக்கம்',
    
    // Dashboard Stats
    totalDueGrams: 'வாடிக்கையாளர் மொத்த நிலுவை',
    totalDueRupees: 'மதிப்பிடப்பட்ட நிலுவை தொகை',
    todayNewGiven: 'இன்றைய புதிய நகை வழங்கல்',
    todayOldIn: 'இன்றைய பழைய வெள்ளி வரவு',
    todayCashInflow: 'இன்றைய ரொக்க வரவு (பணம்)',
    todayCashInGrams: 'பணத்திற்கான கிராம் கழிவு',
    activeCustomersCount: 'மொத்த வாடிக்கையாளர்கள்',
    
    // Customer Details & Badges
    customerName: 'வாடிக்கையாளர் பெயர்',
    jewelleryShop: 'நகைக்கடை / நிறுவனம் (Jewellery Shop Name)',
    phone: 'தொலைபேசி எண்',
    address: 'ஊர் / முகவரி',
    customerType: 'வாடிக்கையாளர் வகை',
    typeRetail: '🛒 சில்லறை வாடிக்கையாளர்',
    typeJewelleryShop: '🏬 நகைக்கடை / ஜூவல்லரி ஷாப்',
    typeWholesale: '📦 மொத்த வியாபாரி',
    typeKarigar: '🔨 பட்டறை / ஆச்சாரி (Karigar)',
    typeGeneral: '👤 வழக்கமான வாடிக்கையாளர்',
    typeCustom: '✨ பிற / விருப்பமான வகை (Custom Type...)',
    customTypePlaceholder: 'எ.கா: கடா கடை / ஏஜென்ட் / பத்தர்',
    
    statusDue: 'நீங்கள் பெற வேண்டியது (You will get)',
    statusAdvance: 'நீங்கள் தர வேண்டியது (You will give)',
    statusSettled: 'கணக்கு முடிந்தது (Settled)',
    
    // Transaction Types & Forms
    addTransaction: 'புதிய பதிவு சேர்க்க',
    newSilverSale: 'புதிய நகை வழங்கல் (New Silver Out)',
    oldSilverIn: 'பழைய வெள்ளி வரவு (Old Silver In)',
    cashPayment: 'ரொக்க வரவு -> கிராம் மாற்றம் (Cash In)',
    directEntry: 'நோட்புக் நேரடி பதிவு (Notebook Entry)',
    
    itemName: 'பொருளின் பெயர்',
    itemSelectPlaceholder: 'பொருளைத் தேர்வு செய்க...',
    grossWeight: 'மொத்த எடை (Gross Wt)',
    touchPercent: 'மாற்று / டச் % (Touch %)',
    pureWeight: 'நய எடை (Pure Wt)',
    wastagePercent: 'கழிவு / உறைவு % (Wastage)',
    netWeight: 'நிகர வரவு எடை (Net Wt)',
    
    // Cash to Gram specific
    cashAmount: 'செலுத்திய ரொக்கம் (₹)',
    appliedRate: 'பயன்படுத்திய வெள்ளி விலை (₹/g)',
    convertedGrams: 'கழிக்கப்படும் கிராம் (Grams Credited)',
    cashFormulaNote: 'கணக்கீட்டு சூத்திரம்: செலுத்திய தொகை ÷ அன்றைய வெள்ளி விலை = கழிக்கப்படும் கிராம்',
    touchAdjustedFormula: 'டச் சரிசெய்யப்பட்ட சூத்திரம்: (தொகை ÷ ரேட்) × டச் %',
    
    // Common Table & Notebook Headers
    date: 'தேதி',
    details: 'விவரம் / நகை வகை',
    debitOut: 'பற்று / வழங்கியது (Dr - New g)',
    creditIn: 'வரவு / பெற்றது (Cr - Old/Cash g)',
    cashRupees: 'ரொக்கம் (₹)',
    balanceGrams: 'மீதி நிலுவை கிராம் (Bal g)',
    balanceRupees: 'மதிப்பு (₹ Approx)',
    actions: 'செயல்கள்',
    notes: 'குறிப்பு / ரசீது எண்',
    
    // Jewelry Common Items
    itemKolusu: 'கொலுசு (Anklet)',
    itemKammal: 'கம்மல் (Earrings)',
    itemChain: 'சங்கிலி / செயின் (Chain)',
    itemKinnam: 'கிண்ணம் (Bowl)',
    itemArainan: 'அரைஞாண் கொடி (Waistband)',
    itemMetti: 'மெட்டி (Toe Ring)',
    itemVilakku: 'காமாட்சி விளக்கு (Lamp)',
    itemPattaraiBar: 'வெள்ளி கட்டி / பார் (Bar Silver)',
    itemSilverCoin: 'வெள்ளி நாணயம் (Coin)',
    itemPlate: 'வெள்ளி தட்டு (Plate)',
    itemCustom: 'பிற பொருள் (Custom Item)',
    
    // Receipt & Print
    printBill: 'ரசீது அச்சிடு (Print Bill)',
    printNotebook: 'நோட்புக் அச்சு (Print Ledger)',
    thermalSlip: '80mm தெர்மல் ரசீது',
    whatsappShare: 'வாட்ஸ்அப் அறிக்கை (WhatsApp)',
    shareText: 'வாட்ஸ்அப் செய்தி நகலெடு',
    close: 'மூடுக',
    save: 'சேமிக்க',
    cancel: 'ரத்து',
    delete: 'நீக்கு',
    edit: 'திருத்து',
    confirmDelete: 'நிச்சயமாக இந்த பதிவை நீக்க வேண்டுமா?',
    confirmDeleteCustomer: 'இந்த வாடிக்கையாளர் மற்றும் அனைத்து பதிவுகளையும் நீக்க வேண்டுமா?',
    
    // Filter Tabs
    filterAll: 'அனைத்தும்',
    filterDue: '🔴 நிலுவை உள்ளவை',
    filterAdvance: '🟢 முன் பணம் உள்ளவை',
    filterSettled: '⚪ முடிந்த கணக்குகள்',
    
    // Empty States
    noCustomers: 'வாடிக்கையாளர்கள் இல்லை. புதிய வாடிக்கையாளரை சேர்க்கவும்.',
    noTransactions: 'இன்னும் பரிவர்த்தனைகள் எதுவும் இல்லை.',
    selectCustomerPrompt: 'பரிவர்த்தனைகளை பார்க்க ஒரு வாடிக்கையாளரை தேர்வு செய்யவும்.',
  },
  
  en: {
    // App Branding & Header
    appName: 'Eagle Books',
    appSubname: 'Eagle Books - DigiGold Silver Khatabook & Ledger',
    tagline: 'Smart Silver Khatabook & Traditional Jeweller Ledger',
    todayRate: "Today's Silver Rate",
    perGram: '₹/gram',
    per10Gram: '₹/10g',
    perKg: '₹/kg',
    updateRate: 'Update Rate',
    searchCustomer: 'Search Customer name / Phone...',
    newCustomer: 'New Customer',
    allCustomers: 'All Customers',
    backupRestore: 'Backup & Restore',
    exportData: 'Export JSON',
    importData: 'Import Data',
    resetDemo: 'Reset Demo Data',
    quickCalculator: 'Quick Converter',
    
    // View Switcher
    viewKhatabook: 'Khatabook View',
    viewNotebook: 'Jeweller Notebook View',
    viewSummary: 'Ledger Summary',
    
    // Dashboard Stats
    totalDueGrams: 'Total Customer Due Grams',
    totalDueRupees: 'Estimated Due Amount',
    todayNewGiven: "Today's New Silver Sale",
    todayOldIn: "Today's Old Silver Inflow",
    todayCashInflow: "Today's Cash Inflow",
    todayCashInGrams: 'Cash Converted Grams',
    activeCustomersCount: 'Active Customers',
    
    // Customer Details & Badges
    customerName: 'Customer Name',
    jewelleryShop: 'Jewellery Shop / Business Name',
    phone: 'Phone Number',
    address: 'City / Address',
    customerType: 'Customer Category',
    typeRetail: '🛒 Retail Customer',
    typeJewelleryShop: '🏬 Jewellery Shop',
    typeWholesale: '📦 Wholesaler',
    typeKarigar: '🔨 Karigar / Goldsmith',
    typeGeneral: '👤 Regular Customer',
    typeCustom: '✨ Custom Category...',
    customTypePlaceholder: 'e.g. Agent / Dealer / Workshop',
    
    statusDue: 'You Will Get (Due)',
    statusAdvance: 'You Will Give (Advance)',
    statusSettled: 'Settled (Nil)',
    
    // Transaction Types & Forms
    addTransaction: 'Add Transaction',
    newSilverSale: 'New Silver Issue (Dr)',
    oldSilverIn: 'Old Silver Inflow (Cr)',
    cashPayment: 'Cash Inflow -> Grams (Cr)',
    directEntry: 'Direct Ledger Entry',
    
    itemName: 'Item Name',
    itemSelectPlaceholder: 'Select Jewel Item...',
    grossWeight: 'Gross Weight (g)',
    touchPercent: 'Touch / Purity %',
    pureWeight: 'Pure Weight (g)',
    wastagePercent: 'Melting / Dust Loss %',
    netWeight: 'Net Credited Grams',
    
    // Cash to Gram specific
    cashAmount: 'Cash Received (₹)',
    appliedRate: 'Applied Silver Rate (₹/g)',
    convertedGrams: 'Grams Deducted (Cr)',
    cashFormulaNote: 'Calculation: Cash Paid ÷ Silver Rate = Converted Grams Credited',
    touchAdjustedFormula: 'Touch Formula: (Amount ÷ Rate) × Touch %',
    
    // Common Table & Notebook Headers
    date: 'Date',
    details: 'Description / Jewels',
    debitOut: 'Debit / New Silver (g)',
    creditIn: 'Credit / Received (g)',
    cashRupees: 'Cash (₹)',
    balanceGrams: 'Running Balance (g)',
    balanceRupees: 'Est. Rupees (₹)',
    actions: 'Actions',
    notes: 'Notes / Voucher #',
    
    // Jewelry Common Items
    itemKolusu: 'Kolusu (Anklet)',
    itemKammal: 'Kammal (Earrings)',
    itemChain: 'Chain / Necklace',
    itemKinnam: 'Bowl / Kinnam',
    itemArainan: 'Waistband (Arainan)',
    itemMetti: 'Toe Rings (Metti)',
    itemVilakku: 'Kamakshi Lamp (Vilakku)',
    itemPattaraiBar: 'Bar / Casting Silver',
    itemSilverCoin: 'Silver Coin',
    itemPlate: 'Silver Plate / Thattu',
    itemCustom: 'Other Item',
    
    // Receipt & Print
    printBill: 'Print Bill / Invoice',
    printNotebook: 'Print Notebook Page',
    thermalSlip: '80mm POS Slip',
    whatsappShare: 'WhatsApp Statement',
    shareText: 'Copy WhatsApp Message',
    close: 'Close',
    save: 'Save Record',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    confirmDelete: 'Are you sure you want to delete this entry?',
    confirmDeleteCustomer: 'Are you sure you want to delete this customer and all their records?',
    
    // Filter Tabs
    filterAll: 'All',
    filterDue: '🔴 Pending Due',
    filterAdvance: '🟢 Advance Credit',
    filterSettled: '⚪ Settled',
    
    // Empty States
    noCustomers: 'No customers found. Click New Customer to add one.',
    noTransactions: 'No transactions recorded yet.',
    selectCustomerPrompt: 'Please select a customer from the left to view their ledger.',
  }
};
