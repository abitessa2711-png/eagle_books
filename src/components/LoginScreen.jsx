import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Crown, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { translations } from '../utils/translations';

export function LoginScreen({ lang, setLang, onLoginSuccess }) {
  const t = translations[lang] || translations.ta;

  // Single Owner Authentication Credentials
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const cleanId = (loginId || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Check credentials: ID: eaglebooks.com, Password: eaglebooks@123
    if ((cleanId === 'eaglebooks.com' || cleanId === 'eaglebooks' || cleanId === 'admin@eaglebooks.com') && cleanPass === 'eaglebooks@123') {
      setLoading(true);

      const ownerUser = {
        id: 'eaglebooks.com',
        phone: '9842154321',
        name: 'செந்தில் குமார்',
        shopName: 'EAGLE SILVERS WHOLESALE',
        role: 'OWNER',
        city: 'மதுரை (Madurai)',
        loggedInAt: new Date().toISOString()
      };

      setTimeout(() => {
        onLoginSuccess(ownerUser);
      }, 200);
    } else {
      setErrorMsg(
        lang === 'ta'
          ? 'தவறான பயனர் ஐடி அல்லது கடவுச்சொல்! (ID: eaglebooks.com | Password: eaglebooks@123)'
          : 'Invalid Login ID or Password! (ID: eaglebooks.com | Password: eaglebooks@123)'
      );
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '480px',
      minHeight: '100dvh',
      background: 'linear-gradient(180deg, #090f24 0%, #0f172a 35%, #f8fafc 35%, #f8fafc 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      margin: '0 auto',
      boxShadow: '0 0 35px rgba(0, 0, 0, 0.12)',
      overflowY: 'auto'
    }}>
      
      {/* 1. Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.25rem',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#10b981', fontWeight: '800' }}>
          <ShieldCheck size={16} />
          <span>256-bit Encrypted</span>
        </div>

        <button
          onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            padding: '0.25rem 0.65rem',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: '800',
            cursor: 'pointer'
          }}
        >
          {lang === 'ta' ? 'EN' : 'தமிழ்'}
        </button>
      </div>

      {/* 2. Official Brand Header with Real Logo */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0.4rem 1.5rem 1.75rem 1.5rem',
        color: '#ffffff'
      }}>
        {/* Official Medallion Emblem Logo */}
        <div style={{
          width: '78px',
          height: '78px',
          borderRadius: '50%',
          border: '3px solid #f59e0b',
          background: '#090f24',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4), 0 0 15px rgba(245, 158, 11, 0.3)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.55rem'
        }}>
          <img 
            src="/eagle-logo.png" 
            alt="Eagle Silvers Whole Sale Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        <h1 style={{ fontSize: '1.45rem', fontWeight: '900', margin: 0, letterSpacing: '-0.01em', color: '#ffffff' }}>
          EAGLE BOOKS
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
          <Crown size={14} color="#fcd34d" />
          <span style={{ fontSize: '0.78rem', color: '#fcd34d', fontWeight: '800' }}>
            {lang === 'ta' ? 'உரிமையாளர் உள்நுழைவு (Owner Portal)' : 'Owner Portal Only'}
          </span>
        </div>
      </div>

      {/* 3. Login Card Container */}
      <div style={{
        margin: '0 1rem 1.5rem 1rem',
        background: '#ffffff',
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        border: '1.5px solid #e2e8f0'
      }}>
        
        <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#090f24', margin: 0 }}>
            {lang === 'ta' ? 'உரிமையாளர் உள்நுழைவு' : 'Owner Login'}
          </h2>
          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.25rem 0 0 0', fontWeight: '600' }}>
            {lang === 'ta' ? 'சில்வர் கட்டாபுக் கணக்குகளை அணுகவும்' : 'Enter your registered credentials to access the ledger'}
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div style={{
            background: '#fef2f2',
            border: '1.5px solid #fca5a5',
            borderRadius: '10px',
            padding: '0.65rem 0.85rem',
            color: '#b91c1c',
            fontSize: '0.78rem',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            marginBottom: '1rem'
          }}>
            <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* User ID Input */}
          <div>
            <label className="input-label" style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>
              {lang === 'ta' ? 'பயனர் ஐடி (User ID)' : 'Login ID'} *
            </label>
            <div style={{ position: 'relative' }}>
              <User 
                size={18} 
                color="#64748b" 
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} 
              />
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="eaglebooks.com"
                className="input-field"
                style={{ paddingLeft: '2.5rem', fontWeight: '800', fontSize: '0.95rem' }}
                required
                autoFocus
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="input-label" style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>
              {lang === 'ta' ? 'கடவுச்சொல் (Password)' : 'Password'} *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={18} 
                color="#64748b" 
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} 
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="eaglebooks@123"
                className="input-field"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', fontWeight: '800', fontSize: '0.95rem' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '0.2rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '0.85rem',
              fontSize: '1rem',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 6px 20px rgba(234, 88, 12, 0.4)',
              marginTop: '0.5rem',
              transition: 'all 0.15s ease'
            }}
          >
            <Crown size={18} />
            <span>{loading ? 'உள்நுழைகிறது...' : (lang === 'ta' ? 'உரிமையாளராக உள்நுழைக' : 'Login as Owner')}</span>
            <ArrowRight size={18} />
          </button>

        </form>

        {/* Security badge at bottom */}
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid #f1f5f9',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.35rem',
          color: '#64748b',
          fontSize: '0.72rem',
          fontWeight: '700'
        }}>
          <CheckCircle2 size={14} color="#059669" />
          <span>EAGLE SILVERS WHOLESALE • தனிப்பட்ட உரிமையாளர் பாதுகாப்பு</span>
        </div>

      </div>

    </div>
  );
}
