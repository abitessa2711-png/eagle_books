import React, { useRef } from 'react';
import { X, Download, Upload, Trash2, Database } from 'lucide-react';
import { translations } from '../utils/translations';
import { exportBackupJSON, clearAllRecords } from '../utils/storage';

export function BackupModal({
  lang,
  isOpen,
  onClose,
  customers,
  transactions,
  rates,
  onRestoreData
}) {
  const t = translations[lang] || translations.ta;
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

  const handleClearData = () => {
    const confirmMsg = lang === 'ta'
      ? 'அனைத்து வாடிக்கையாளர் மற்றும் பரிவர்த்தனை பதிவுகளையும் முழுமையாக அழிக்க வேண்டுமா? (புதிய தொடக்கத்திற்கு)'
      : 'Are you sure you want to clear all customer records to start completely fresh?';

    if (window.confirm(confirmMsg)) {
      const fresh = clearAllRecords();
      onRestoreData(fresh.customers, fresh.transactions, fresh.rates);
      alert(lang === 'ta' ? 'அனைத்து பதிவுகளும் அழிக்கப்பட்டு புதிய கணக்கு தயாராக உள்ளது!' : 'All records cleared. Ready for fresh entries!');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.1rem 1.35rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={17} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
              {t.backupRestore}
            </h3>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Card 1: Export */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontWeight: '700', color: '#f1f5f9', fontSize: '0.9rem' }}>{t.exportData}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                {lang === 'ta' ? 'அனைத்து கணக்கு பதிவுகளையும் JSON பேக்கப் கோப்பாக பதிவிறக்கவும்.' : 'Download complete database backup to phone/PC.'}
              </div>
            </div>

            <button onClick={handleExport} className="btn btn-sm btn-primary">
              <Download size={14} />
              <span>{lang === 'ta' ? 'பதிவிறக்கு' : 'Export'}</span>
            </button>
          </div>

          {/* Card 2: Import */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontWeight: '700', color: '#f1f5f9', fontSize: '0.9rem' }}>{t.importData}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                {lang === 'ta' ? 'முன்பு எடுத்த பேக்கப் கோப்பை மீட்டெடுக்கவும்.' : 'Restore previously saved backup file.'}
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
              <Upload size={14} />
              <span>{lang === 'ta' ? 'ஏற்று' : 'Import'}</span>
            </button>
          </div>

          {/* Card 3: Clear All Data */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            padding: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontWeight: '700', color: '#f87171', fontSize: '0.9rem' }}>
                {lang === 'ta' ? 'புதிய தொடக்கம் (அனைத்தையும் அழிக்க)' : 'Start Fresh (Clear Data)'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                {lang === 'ta' ? 'புதிய கடை கணக்குகளைத் துவங்க பழைய பதிவுகளை அழிக்கவும்.' : 'Clear all records to start with 0 customers.'}
              </div>
            </div>

            <button onClick={handleClearData} className="btn btn-sm btn-red">
              <Trash2 size={14} />
              <span>{lang === 'ta' ? 'அழி' : 'Clear'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
