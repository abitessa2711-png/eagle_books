import React, { useState } from 'react';
import { 
  Lock, 
  Phone, 
  Store, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  Languages,
  Crown,
  Briefcase
} from 'lucide-react';
import { translations } from '../utils/translations';

export function LoginScreen({ lang, setLang, onLoginSuccess }) {
  const t = translations[lang];
  const [authMode, setAuthMode] = useState('LOGIN'); // 'LOGIN' | 'REGISTER'

  // Login Form
  const [phone, setPhone] = useState('9842154321');
  const [pin, setPin] = useState('1234');
  const [role, setRole] = useState('OWNER'); // 'OWNER' | 'STAFF'

  // Register Form
  const [shopName, setShopName] = useState('EAGLE SILVERS WHOLESALE');
  const [ownerName, setOwnerName] = useState('செந்தில் குமார்');
  const [regPhone, setRegPhone] = useState('');
  const [regPin, setRegPin] = useState('');
  const [city, setCity] = useState('மதுரை (Madurai)');

  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (phone.length < 10) {
      setErrorMessage(lang === 'ta' ? 'சரியான 10 இலக்க மொபைல் எண் உள்ளிடவும்.' : 'Please enter a valid 10-digit phone number.');
      return;
    }

    if (pin.length < 4) {
      setErrorMessage(lang === 'ta' ? '4 இலக்க பாதுகாப்பு பின்னை உள்ளிடவும்.' : 'Please enter your 4-digit security PIN.');
      return;
    }

    // Authenticate
    const user = {
      phone,
      name: role === 'OWNER' ? 'செந்தில் குமார் (உரிமையாளர்)' : 'கார்த்திக் (பணியாளர்)',
      shopName: 'EAGLE SILVERS WHOLESALE',
      role: role, // 'OWNER' | 'STAFF'
      city: 'மதுரை',
      loggedInAt: new Date().toISOString()
    };

    onLoginSuccess(user);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!shopName || !ownerName) {
      setErrorMessage(lang === 'ta' ? 'அனைத்து விவரங்களையும் பூர்த்தி செய்யவும்.' : 'Please fill in all details.');
      return;
    }

    if (regPhone.length < 10) {
      setErrorMessage(lang === 'ta' ? 'சரியான 10 இலக்க மொபைல் எண் உள்ளிடவும்.' : 'Please enter a valid 10-digit phone number.');
      return;
    }

    if (regPin.length < 4) {
      setErrorMessage(lang === 'ta' ? 'குறைந்தது 4 இலக்க PIN அமைக்கவும்.' : 'Please set a 4-digit PIN.');
      return;
    }

    const newUser = {
      phone: regPhone,
      name: `${ownerName} (உரிமையாளர்)`,
      shopName,
      role: 'OWNER',
      city,
      loggedInAt: new Date().toISOString()
    };

    onLoginSuccess(newUser);
  };

  // Quick 1-Tap Demo Logins
  const handleQuickLogin = (demoRole) => {
    if (demoRole === 'OWNER') {
      onLoginSuccess({
        phone: '9842154321',
        name: 'செந்தில் குமார்',
        shopName: 'EAGLE SILVERS WHOLESALE',
        role: 'OWNER',
        city: 'மதுரை',
        loggedInAt: new Date().toISOString()
      });
    } else {
      onLoginSuccess({
        phone: '9443123456',
        name: 'கார்த்திக் (பணியாளர்)',
        shopName: 'EAGLE SILVERS WHOLESALE',
        role: 'STAFF',
        city: 'மதுரை',
        loggedInAt: new Date().toISOString()
      });
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '480px',
      minHeight: '100dvh',
      background: 'linear-gradient(180deg, #090f24 0%, #0f172a 40%, #ffffff 40%, #ffffff 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      margin: '0 auto',
      boxShadow: '0 0 35px rgba(0, 0, 0, 0.1)',
      overflowY: 'auto'
    }}>
      
      {/* Top Bar with Language Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.25rem',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#94a3b8' }}>
          <ShieldCheck size={16} color="#10b981" />
          <span>256-bit SSL Secure</span>
        </div>

        <button
          onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            padding: '0.25rem 0.6rem',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: '800',
            cursor: 'pointer'
          }}
        >
          {lang === 'ta' ? 'EN' : 'தமிழ்'}
        </button>
      </div>

      {/* Brand & Logo Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0.5rem 1.5rem 1.75rem 1.5rem',
        color: '#ffffff'
      }}>
        <div style={{
          width: '78px',
          height: '78px',
          borderRadius: '50%',
          border: '3px solid #f59e0b',
          background: '#090f24',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.65rem'
        }}>
          <img 
            src="/eagle-logo.svg" 
            alt="Eagle Silvers Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        <h1 style={{ fontSize: '1.45rem', fontWeight: '900', margin: 0, letterSpacing: '-0.01em', color: '#ffffff' }}>
          EAGLE BOOKS
        </h1>
        <p style={{ fontSize: '0.78rem', color: '#fcd34d', margin: '0.15rem 0 0 0', fontWeight: '700' }}>
          {lang === 'ta' ? 'ஈகிள் புக்ஸ் • சில்வர் கட்டாபுக் & லெட்ஜர்' : 'Eagle Books • Silver Khatabook & Ledger'}
        </p>
      </div>

      {/* Main Form White Card */}
      <div style={{
        flex: 1,
        background: '#ffffff',
        borderRadius: '24px 24px 0 0',
        padding: '1.5rem 1.25rem 2rem 1.25rem',
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Toggle Mode: Login vs Register */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: '#f1f5f9',
          padding: '0.25rem',
          borderRadius: '12px',
          gap: '0.35rem',
          marginBottom: '1.25rem',
          border: '1px solid #e2e8f0'
        }}>
          <button
            onClick={() => setAuthMode('LOGIN')}
            style={{
              background: authMode === 'LOGIN' ? '#ea580c' : 'transparent',
              color: authMode === 'LOGIN' ? '#ffffff' : '#475569',
              border: 'none',
              borderRadius: '10px',
              padding: '0.55rem',
              fontSize: '0.85rem',
              fontWeight: '900',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {lang === 'ta' ? 'உள்நுழைக (Login)' : 'Sign In'}
          </button>

          <button
            onClick={() => setAuthMode('REGISTER')}
            style={{
              background: authMode === 'REGISTER' ? '#ea580c' : 'transparent',
              color: authMode === 'REGISTER' ? '#ffffff' : '#475569',
              border: 'none',
              borderRadius: '10px',
              padding: '0.55rem',
              fontSize: '0.85rem',
              fontWeight: '900',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {lang === 'ta' ? 'புதிய கடை பதிவு' : 'Register Shop'}
          </button>
        </div>

        {/* Error Message Box */}
        {errorMessage && (
          <div style={{
            background: '#fef2f2',
            border: '1.5px solid #fca5a5',
            color: '#b91c1c',
            borderRadius: '10px',
            padding: '0.65rem 0.85rem',
            fontSize: '0.82rem',
            fontWeight: '700',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem'
          }}>
            <AlertCircle size={16} color="#dc2626" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* =========================================================================
            1. SIGN IN FORM
            ========================================================================= */}
        {authMode === 'LOGIN' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Role Switcher */}
            <div>
              <label className="input-label" style={{ fontSize: '0.78rem' }}>
                {lang === 'ta' ? 'உள்நுழையும் பதவி (Login Role):' : 'Select Role:'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('OWNER')}
                  style={{
                    background: role === 'OWNER' ? '#fffbeb' : '#f8fafc',
                    border: role === 'OWNER' ? '2px solid #f59e0b' : '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '0.55rem 0.5rem',
                    color: role === 'OWNER' ? '#b45309' : '#475569',
                    fontWeight: '900',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Crown size={15} color={role === 'OWNER' ? '#d97706' : '#64748b'} />
                  <span>{lang === 'ta' ? 'உரிமையாளர் (Owner)' : 'Owner / Admin'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('STAFF')}
                  style={{
                    background: role === 'STAFF' ? '#f0f9ff' : '#f8fafc',
                    border: role === 'STAFF' ? '2px solid #0284c7' : '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '0.55rem 0.5rem',
                    color: role === 'STAFF' ? '#0369a1' : '#475569',
                    fontWeight: '900',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Briefcase size={15} color={role === 'STAFF' ? '#0284c7' : '#64748b'} />
                  <span>{lang === 'ta' ? 'பணியாளர் (Staff)' : 'Billing Staff'}</span>
                </button>
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="input-label">
                {lang === 'ta' ? 'மொபைல் எண் (Mobile Number)' : 'Phone Number'}
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9842154321"
                  className="input-field"
                  style={{ paddingLeft: '2.5rem', fontSize: '1rem', fontWeight: '800' }}
                  required
                />
              </div>
            </div>

            {/* 4-Digit PIN */}
            <div>
              <label className="input-label">
                {lang === 'ta' ? '4-இலக்க பாதுகாப்பு பின் (Security PIN)' : '4-Digit PIN'}
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  className="input-field"
                  style={{ paddingLeft: '2.5rem', fontSize: '1.25rem', letterSpacing: '0.2em', fontWeight: '900' }}
                  required
                />
              </div>
            </div>

            {/* Submit Sign In Button */}
            <button
              type="submit"
              className="btn-mobile"
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                color: '#ffffff',
                padding: '0.85rem',
                fontSize: '1rem',
                borderRadius: '12px',
                marginTop: '0.5rem',
                boxShadow: '0 4px 15px rgba(234, 88, 12, 0.35)'
              }}
            >
              <span>{lang === 'ta' ? 'கணக்கிற்குள் நுழைய (Sign In)' : 'Sign In to Ledger'}</span>
              <ArrowRight size={18} />
            </button>

          </form>
        )}

        {/* =========================================================================
            2. REGISTER NEW SHOP FORM
            ========================================================================= */}
        {authMode === 'REGISTER' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            
            <div>
              <label className="input-label">{lang === 'ta' ? 'கடையின் பெயர் (Shop / Firm Name)' : 'Shop Name'}</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="EAGLE SILVERS WHOLESALE"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="input-label">{lang === 'ta' ? 'உரிமையாளர் பெயர் (Owner Name)' : 'Owner Name'}</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="செந்தில் குமார்"
                className="input-field"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.65rem' }}>
              <div>
                <label className="input-label">{lang === 'ta' ? 'மொபைல் எண்' : 'Phone'}</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="9842154321"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="input-label">{lang === 'ta' ? 'பாதுகாப்பு PIN' : '4-Digit PIN'}</label>
                <input
                  type="password"
                  maxLength={6}
                  value={regPin}
                  onChange={(e) => setRegPin(e.target.value)}
                  placeholder="1234"
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="input-label">{lang === 'ta' ? 'ஊர் / நகரம் (City / Town)' : 'City'}</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="மதுரை (Madurai)"
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-mobile"
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#ffffff',
                padding: '0.85rem',
                fontSize: '1rem',
                borderRadius: '12px',
                marginTop: '0.35rem',
                boxShadow: '0 4px 15px rgba(5, 150, 105, 0.35)'
              }}
            >
              <span>{lang === 'ta' ? 'புதிய கணக்கை உருவாக்க (Register)' : 'Create Account'}</span>
              <CheckCircle2 size={18} />
            </button>

          </form>
        )}

        {/* 1-Tap Quick Demo Login Strip */}
        <div style={{ marginTop: '1.5rem', borderTop: '1px dashed #e2e8f0', paddingTop: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textAlign: 'center', marginBottom: '0.65rem' }}>
            ⚡ {lang === 'ta' ? 'விரைவு மாதிரி உள்நுழைவு (1-Tap Demo Login):' : '1-Tap Quick Demo Login:'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('OWNER')}
              style={{
                background: '#fffbeb',
                border: '1.5px solid #fcd34d',
                borderRadius: '10px',
                padding: '0.45rem 0.5rem',
                color: '#b45309',
                fontSize: '0.75rem',
                fontWeight: '900',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              👑 {lang === 'ta' ? 'உரிமையாளர் (Owner)' : 'Owner Demo'}
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('STAFF')}
              style={{
                background: '#f0f9ff',
                border: '1.5px solid #bae6fd',
                borderRadius: '10px',
                padding: '0.45rem 0.5rem',
                color: '#0369a1',
                fontSize: '0.75rem',
                fontWeight: '900',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              💼 {lang === 'ta' ? 'பணியாளர் (Staff)' : 'Staff Demo'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
