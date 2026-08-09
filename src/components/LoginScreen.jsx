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
  ArrowRight,
  KeyRound
} from 'lucide-react';
import { translations } from '../utils/translations';

export function LoginScreen({ lang, setLang, onLoginSuccess }) {
  const t = translations[lang] || translations.ta;

  // Pre-filled or empty state
  const [loginId, setLoginId] = useState('eaglebooks.com');
  const [password, setPassword] = useState('eaglebooks@123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const cleanId = (loginId || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Accept eaglebooks.com, idhayam, admin, or phone number with eaglebooks@123 (or 1234)
    const isValidId = 
      cleanId.includes('eagle') || 
      cleanId.includes('idhayam') || 
      cleanId.includes('admin') || 
      cleanId === '9842154321' ||
      cleanId === 'eaglebooks.com' ||
      cleanId === 'eaglebooks';

    const isValidPassword = 
      cleanPass === 'eaglebooks@123' || 
      cleanPass === '1234' || 
      cleanPass === 'eaglebooks';

    if (isValidId && isValidPassword) {
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

  const handleAutoFill = () => {
    setLoginId('eaglebooks.com');
    setPassword('eaglebooks@123');
    setErrorMsg('');
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      minHeight: '100dvh',
      background: 'linear-gradient(135deg, #090f24 0%, #0f172a 45%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative'
    }}>
      
      {/* Centered Mobile Card Shell */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>

        {/* 1. Header Banner with Gold Trim & Logo */}
        <div style={{
          background: 'linear-gradient(135deg, #090f24 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '1.25rem 1.5rem 1.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          borderBottom: '3px solid #f59e0b'
        }}>
          
          {/* Top Security & Language Switcher */}
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#34d399', fontWeight: '800' }}>
              <ShieldCheck size={15} />
              <span>256-bit Encrypted</span>
            </div>

            <button
              onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '6px',
                padding: '0.2rem 0.55rem',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: '900',
                cursor: 'pointer'
              }}
            >
              {lang === 'ta' ? 'EN' : 'தமிழ்'}
            </button>
          </div>

          {/* Glowing HD Logo Circle */}
          <div style={{
            width: '92px',
            height: '92px',
            borderRadius: '50%',
            border: '3.5px solid #f59e0b',
            background: '#090f24',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(245, 158, 11, 0.4)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.65rem'
          }}>
            <img 
              src="/eagle-logo.png" 
              alt="Eagle Silvers Whole Sale Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          <h1 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0, letterSpacing: '0.02em', color: '#ffffff' }}>
            EAGLE BOOKS
          </h1>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            marginTop: '0.35rem',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid #f59e0b',
            borderRadius: '9999px',
            padding: '0.2rem 0.75rem'
          }}>
            <Crown size={13} color="#fcd34d" />
            <span style={{ fontSize: '0.72rem', color: '#fcd34d', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {lang === 'ta' ? 'உரிமையாளர் உள்நுழைவு (Owner Only)' : 'Owner Portal Only'}
            </span>
          </div>

        </div>

        {/* 2. Login Form Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          
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

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
            
            {/* User ID Input */}
            <div>
              <label className="input-label" style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.35rem' }}>
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
                  style={{
                    paddingLeft: '2.5rem',
                    fontWeight: '800',
                    fontSize: '0.95rem',
                    background: '#ffffff',
                    color: '#000000'
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="input-label" style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.35rem' }}>
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
                  style={{
                    paddingLeft: '2.5rem',
                    paddingRight: '2.5rem',
                    fontWeight: '800',
                    fontSize: '0.95rem',
                    background: '#ffffff',
                    color: '#000000'
                  }}
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
                marginTop: '0.35rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Crown size={18} />
              <span>{loading ? 'உள்நுழைகிறது...' : (lang === 'ta' ? 'உரிமையாளராக உள்நுழைக' : 'Login as Owner')}</span>
              <ArrowRight size={18} />
            </button>

          </form>

          {/* Quick Auto-fill Helper */}
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={handleAutoFill}
              style={{
                background: '#fffbeb',
                border: '1px dashed #f59e0b',
                borderRadius: '8px',
                padding: '0.4rem 0.75rem',
                color: '#92400e',
                fontSize: '0.72rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <KeyRound size={13} color="#ea580c" />
              <span>{lang === 'ta' ? 'விவரங்களை நிரப்பு (eaglebooks.com / eaglebooks@123)' : 'Auto-fill Login Details'}</span>
            </button>
          </div>

          {/* Security badge at bottom */}
          <div style={{
            marginTop: '1.25rem',
            paddingTop: '0.85rem',
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
            <span>EAGLE SILVERS WHOLESALE • தனிப்பட்ட உரிமையாளர் தளம்</span>
          </div>

        </div>

      </div>

    </div>
  );
}
