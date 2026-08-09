import React, { useRef } from 'react';
import { X, Download, Upload, RotateCcw, ShieldCheck, Database } from 'lucide-react';
import { translations } from '../utils/translations';
import { exportBackupJSON, resetToDemoData } from '../utils/storage';

export function BackupModal({
  lang,
  isOpen,
  onClose,
  customers,
  transactions,
  rates,
  onRestoreData
}) {
  const t = translations[lang];
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleExport = () => {
    exportBackupJSON(customers, transactions, rates);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (parsed.customers && parsed.transactions) {
          onRestoreData(parsed.customers, parsed.transactions, parsed.rates || rates);
          alert(lang === 'ta' ? 'தரவு வெற்றிகரமாக மீட்டமைக்கப்பட்டது!' : 'Data restored successfully!');
          onClose();
        } else {
          alert(lang === 'ta' ? 'செல்லுபடியாகாத காப்புப்பிரதி கோப்பு!' : 'Invalid backup JSON file!');
        }
      } catch (err) {
        alert(lang === 'ta' ? 'கோப்பை படிப்பதில் பிழை ஏற்பட்டது!' : 'Error reading JSON file!');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemo = () => {
    if (window.confirm(lang === 'ta' ? 'மாதிரி தரவுகளை மீண்டும் ஏற்ற வேண்டுமா?' : 'Reset to sample demo data?')) {
      const demo = resetToDemoData();
      onRestoreData(demo.customers, demo.transactions, demo.rates);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.2)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={18} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
              {t.backupRestore}
            </h3>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Card 1: Export */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontWeight: '700', color: '#f1f5f9' }}>{t.exportData}</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                {lang === 'ta' ? 'அனைத்து வாடிக்கையாளர் மற்றும் கணக்கு பதிவுகளை JSON கோப்பாக பதிவிறக்கவும்.' : 'Download complete database to your computer.'}
              </div>
            </div>

            <button onClick={handleExport} className="btn btn-sm btn-primary">
              <Download size={15} />
              <span>{lang === 'ta' ? 'பதிவிறக்கு' : 'Export'}</span>
            </button>
          </div>

          {/* Card 2: Import */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontWeight: '700', color: '#f1f5f9' }}>{t.importData}</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                {lang === 'ta' ? 'முன்பு சேமித்த காப்புப்பிரதி கோப்பை மீட்டெடுக்கவும்.' : 'Restore previously exported database file.'}
              </div>
            </div>

            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <button onClick={() => fileInputRef.current.click()} className="btn btn-sm btn-outline">
              <Upload size={15} />
              <span>{lang === 'ta' ? 'கோப்பை ஏற்று' : 'Import'}</span>
            </button>
          </div>

          {/* Card 3: Reset Demo */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontWeight: '700', color: '#f87171' }}>{t.resetDemo}</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                {lang === 'ta' ? 'நோட்புக் புகைப்படத்தில் உள்ள மாதிரி கணக்குகளை மீண்டும் ஏற்று.' : 'Reload realistic demo accounts matching the notebook.'}
              </div>
            </div>

            <button onClick={handleResetDemo} className="btn btn-sm btn-red">
              <RotateCcw size={15} />
              <span>{lang === 'ta' ? 'மீட்டமை' : 'Reset'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
