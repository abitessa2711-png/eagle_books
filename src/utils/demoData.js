// Realistic Demo Data matching the handwritten jeweller notebook photo and Tamil jewelry business workflow

export const initialSilverRates = {
  ratePerGram: 95.00,       // ₹95 per gram of fine/market silver
  ratePer10Gram: 950.00,
  ratePerKg: 95000.00,
  touch78Rate: 74.10,       // 78% Kolusu Touch Rate
  touch65Rate: 61.75,       // 65% Touch Rate
  sterling925Rate: 87.88,   // 92.5% Sterling Silver
  lastUpdated: new Date().toISOString()
};

export const initialCustomers = [
  {
    id: 'cust-1',
    name: 'ஸ்ரீ முருகன் ஜூவல்லரி / செந்தில் குமார் (Senthil Kumar)',
    phone: '9842154321',
    address: 'தெற்கு மாசி வீதி, மதுரை (South Masi St, Madurai)',
    type: 'typeKarigar', // Karigar / Pattarai / Jeweller
    notes: 'நோட்புக் கணக்கு: கொலுசு மற்றும் பழைய வெள்ளி பட்டறை பரிவர்த்தனை',
    createdAt: '2026-05-20'
  },
  {
    id: 'cust-2',
    name: 'மீனாட்சி அம்மாள் (Meenakshi Ammal)',
    phone: '9789012345',
    address: 'அண்ணா நகர், மதுரை (Anna Nagar, Madurai)',
    type: 'typeRetail',
    notes: 'குடும்ப வாடிக்கையாளர் - கொலுசு & கம்மல் வாங்கிய கணக்கு',
    createdAt: '2026-06-01'
  },
  {
    id: 'cust-3',
    name: 'சரவணா சில்வர் ஒர்க்ஸ் / ரமேஷ் ஆச்சாரி (Ramesh Achari)',
    phone: '9443388776',
    address: 'நகைக்கடை பஜார், சேலம் (Jewel Bazaar, Salem)',
    type: 'typeKarigar',
    notes: 'வெள்ளி கிண்ணம், காமாட்சி விளக்கு & கட்டி வெள்ளி தயாரிப்பு',
    createdAt: '2026-06-15'
  },
  {
    id: 'cust-4',
    name: 'ராஜா ஸ்டோர்ஸ் / மாரியப்பன் (Mariappan)',
    phone: '9944112233',
    address: 'பெரிய கடை வீதி, திருச்சி (Big Bazaar, Trichy)',
    type: 'typeWholesale',
    notes: 'மொத்த வியாபாரி - அரைஞாண் கொடி & வெள்ளி தட்டுகள்',
    createdAt: '2026-07-01'
  }
];

export const initialTransactions = [
  // -------------------------------------------------------------------------
  // CUSTOMER 1 (Senthil Kumar): Exact transaction ladder from the Notebook Photo!
  // -------------------------------------------------------------------------
  {
    id: 'tx-101',
    customerId: 'cust-1',
    date: '2026-05-20',
    type: 'OPENING_BALANCE',
    itemName: 'CB : தொடக்க இருப்பு (Carried Balance)',
    weight: 873.190,
    touchPercent: 100,
    notes: 'நோட்புக் தொடக்க இருப்பு (CB : 873.190g)'
  },
  {
    id: 'tx-102',
    customerId: 'cust-1',
    date: '2026-05-22',
    type: 'OLD_SILVER',
    itemName: 'பழைய வெள்ளி கழிப்பு (Old Return)',
    weight: 70.050,
    touchPercent: 100,
    notes: '- 70.050 gm கழிவு (இருப்பு = 803.740g)'
  },
  {
    id: 'tx-103',
    customerId: 'cust-1',
    date: '2026-05-25',
    type: 'OLD_SILVER',
    itemName: 'பழைய உதிரி வரவு (Return)',
    weight: 11.390,
    touchPercent: 100,
    notes: '- 11.390 gm கழிவு (இருப்பு = 792.350g)'
  },
  {
    id: 'tx-104',
    customerId: 'cust-1',
    date: '2026-06-14',
    type: 'CASH_PAYMENT',
    itemName: 'ரொக்க வரவு -> கிராம் மாற்றம் (Cash to Grams)',
    cashAmount: 25000,
    ratePerGram: 249.00,
    touchPercent: 78,
    isTouchAdjusted: true,
    convertedGrams: 128.730, // 25,000 / 249 x 78% = 128.730g as written in notebook!
    notes: '14/6/026 : 25,000 (249) x 78% : (194.20) = 128.730g கழிவு'
  },
  {
    id: 'tx-105',
    customerId: 'cust-1',
    date: '2026-06-23',
    type: 'CASH_PAYMENT',
    itemName: 'ரொக்க வரவு RSP (Cash Payment RSP)',
    cashAmount: 16000,
    ratePerGram: 234.50,
    touchPercent: 78,
    isTouchAdjusted: true,
    convertedGrams: 87.430, // 16,000 RSP: 234.50 x 78% = 183 = 87.430(P)
    notes: '16.000 RSP (23/6/026 : 234.50 x 78% = 183) = 87.430(P)'
  },
  {
    id: 'tx-106',
    customerId: 'cust-1',
    date: '2026-06-29',
    type: 'CASH_PAYMENT',
    itemName: 'ரொக்க வரவு RSP (Cash Payment RSP)',
    cashAmount: 20000,
    ratePerGram: 228.50,
    touchPercent: 78,
    isTouchAdjusted: true,
    convertedGrams: 112.230, // 20,000 RSP: 228.50 x 78% = 178.20 = 112.230(P)
    notes: '20.000 RSP (29/6/026 : 228.50 x 78% = 178.20) = 112.230(P)'
  },
  {
    id: 'tx-107',
    customerId: 'cust-1',
    date: '2026-07-25',
    type: 'NEW_SALE',
    itemName: 'புதிய கொலுசு & உதிரி நகைகள் (Kolusu & Item Lot)',
    weight: 267.160,
    touchPercent: 100,
    notes: 'கொலுசு: 267.160g + உதிரி உருப்படிகள் (179.120g) வழங்கியது'
  },
  {
    id: 'tx-108',
    customerId: 'cust-1',
    date: '2026-07-25',
    type: 'OLD_SILVER',
    itemName: 'பழைய வெள்ளி மாற்று வரவு (Old Silver Credit)',
    weight: 202.190,
    touchPercent: 100,
    notes: '- 202.190 கழிவு (157.70 x 78% (0.5P) = 202.190 மாற்று)'
  },

  // -------------------------------------------------------------------------
  // CUSTOMER 2 (Meenakshi Ammal)
  // -------------------------------------------------------------------------
  {
    id: 'tx-201',
    customerId: 'cust-2',
    date: '2026-06-01',
    type: 'NEW_SALE',
    itemName: 'புதிய கொலுசு (Anklet - 78% Touch)',
    weight: 150.000,
    touchPercent: 100,
    ratePerGram: 95.00,
    notes: 'புதிய கொலுசு ஜோடி - 150.000g'
  },
  {
    id: 'tx-202',
    customerId: 'cust-2',
    date: '2026-06-01',
    type: 'OLD_SILVER',
    itemName: 'பழைய கொலுசு வரவு (Old Anklet Exchange)',
    weight: 40.000,
    touchPercent: 95,
    notes: 'பழைய தேய்ந்த கொலுசு 40g (5% உறைவு போக நயம் 38.000g)'
  },
  {
    id: 'tx-203',
    customerId: 'cust-2',
    date: '2026-06-05',
    type: 'CASH_PAYMENT',
    itemName: 'ரொக்கப் பணம் செலுத்தியது (Cash Paid)',
    cashAmount: 5000,
    ratePerGram: 95.00,
    touchPercent: 100,
    isTouchAdjusted: false,
    convertedGrams: 52.632, // ₹5,000 / 95 = 52.632g
    notes: 'ரொக்கம் ₹5,000 (அன்றைய ரேட் ₹95/g படி 52.632 கிராம் கழிவு)'
  },

  // -------------------------------------------------------------------------
  // CUSTOMER 3 (Ramesh Achari - Karigar)
  // -------------------------------------------------------------------------
  {
    id: 'tx-301',
    customerId: 'cust-3',
    date: '2026-06-15',
    type: 'NEW_SALE',
    itemName: 'வெள்ளி கிண்ணம் & காமாட்சி விளக்கு (Bowls & Lamp)',
    weight: 770.000,
    touchPercent: 100,
    notes: 'கிண்ணம் 450g + விளக்கு 320g = 770.000g'
  },
  {
    id: 'tx-302',
    customerId: 'cust-3',
    date: '2026-06-16',
    type: 'OLD_SILVER',
    itemName: 'உருகிய வெள்ளி கட்டி வரவு (Melted Bar Silver)',
    weight: 600.000,
    touchPercent: 100,
    notes: 'பழைய உருகிய பார் வெள்ளி வரவு 600.000g'
  },
  {
    id: 'tx-303',
    customerId: 'cust-3',
    date: '2026-06-20',
    type: 'CASH_PAYMENT',
    itemName: 'வங்கி பரிவர்த்தனை (GPay / Cash Inflow)',
    cashAmount: 15000,
    ratePerGram: 95.00,
    touchPercent: 100,
    isTouchAdjusted: false,
    convertedGrams: 157.895, // 15000 / 95 = 157.895g
    notes: 'கூகிள் பே மூலம் ₹15,000 செலுத்தியது (157.895g கழிவு)'
  },

  // -------------------------------------------------------------------------
  // CUSTOMER 4 (Mariappan - Wholesaler)
  // -------------------------------------------------------------------------
  {
    id: 'tx-401',
    customerId: 'cust-4',
    date: '2026-07-01',
    type: 'NEW_SALE',
    itemName: 'அரைஞாண் கொடி & வெள்ளி தட்டுகள் (Waistband & Plates)',
    weight: 600.000,
    touchPercent: 100,
    notes: 'அரைஞாண் கொடி 250g + தட்டுகள் 350g = 600.000g'
  },
  {
    id: 'tx-402',
    customerId: 'cust-4',
    date: '2026-07-05',
    type: 'CASH_PAYMENT',
    itemName: 'ரொக்க முன்பணம் (Advance Cash Paid)',
    cashAmount: 45000,
    ratePerGram: 95.00,
    touchPercent: 100,
    isTouchAdjusted: false,
    convertedGrams: 473.684, // 45000 / 95 = 473.684g
    notes: 'ரொக்கம் ₹45,000 (@ ₹95/g = 473.684g கழிவு)'
  }
];
