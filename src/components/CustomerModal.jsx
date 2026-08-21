import React, { useState } from 'react';
import { X, UserPlus, Check, Building2, Tag } from 'lucide-react';
import { translations } from '../utils/translations';

export function CustomerModal({
  lang,
  isOpen,
  onClose,
  onSaveCustomer,
  editingCustomer = null
}) {
  const t = translations[lang] || translations.ta;

  const [name, setName] = useState(editingCustomer ? editingCustomer.name : '');
  const [jewelleryShop, setJewelleryShop] = useState(editingCustomer ? (editingCustomer.jewelleryShop || '') : '');
  const [phone, setPhone] = useState(editingCustomer ? editingCustomer.phone : '');
  const [address, setAddress] = useState(editingCustomer ? editingCustomer.address : '');
  const [type, setType] = useState(editingCustomer ? (editingCustomer.type || 'typeJewelleryShop') : 'typeJewelleryShop');
  const [customType, setCustomType] = useState(editingCustomer ? (editingCustomer.customType || '') : '');
  const [notes, setNotes] = useState(editingCustomer ? editingCustomer.notes : '');
  const [openingBalance, setOpeningBalance] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const customerData = {
      id: editingCustomer ? editingCustomer.id : `cust-${Date.now()}`,
      name: name.trim(),
      jewelleryShop: jewelleryShop.trim(),
      phone: phone.trim(),
      address: address.trim(),
      type: type === 'typeCustom' ? (customType.trim() || 'Custom') : type,
      customType: type === 'typeCustom' ? customType.trim() : '',
      notes: notes.trim(),
      createdAt: editingCustomer ? editingCustomer.createdAt : new Date().toISOString()
    };

    onSaveCustomer(customerData, Number(openingBalance) || 0);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', borderRadius: '16px' }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          background: 'linear-gradient(135deg, #090f24 0%, #1e293b 100%)',
          borderRadius: '16px 16px 0 0',
          color: '#ffffff'
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
              <UserPlus size={18} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
              {editingCustomer 
                ? (lang === 'ta' ? 'வாடிக்கையாளர் / நகைக்கடை விவரங்களை திருத்துக' : 'Edit Customer / Jeweller') 
                : t.newCustomer}
            </h3>
          </div>

          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden', background: '#ffffff' }}>
          
          <div className="modal-body-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="grid-2">
            <div>
              <label className="input-label">{t.customerName} *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === 'ta' ? 'எ.கா: சரவணன் / ராஜா' : 'e.g. Saravanan / Raja'}
                className="input-field"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Building2 size={15} color="#ea580c" />
                <span>{t.jewelleryShop}</span>
              </label>
              <input
                type="text"
                value={jewelleryShop}
                onChange={(e) => setJewelleryShop(e.target.value)}
                placeholder={lang === 'ta' ? 'எ.கா: ஸ்ரீராம் ஜூவல்லர்ஸ்' : 'e.g. Sriram Jewellers'}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label className="input-label">{t.phone}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98421XXXXX"
                className="input-field"
              />
            </div>

            <div>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Tag size={15} color="#0284c7" />
                <span>{t.customerType}</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="input-field"
                style={{ fontWeight: '700' }}
              >
                <option value="typeJewelleryShop">{t.typeJewelleryShop}</option>
                <option value="typeRetail">{t.typeRetail}</option>
                <option value="typeWholesale">{t.typeWholesale}</option>
                <option value="typeKarigar">{t.typeKarigar}</option>
                <option value="typeGeneral">{t.typeGeneral}</option>
                <option value="typeCustom">{t.typeCustom}</option>
              </select>
            </div>
          </div>

          {/* Custom Category Input if Custom Selected */}
          {type === 'typeCustom' && (
            <div style={{ background: '#f0f9ff', padding: '0.85rem', borderRadius: '10px', border: '1.5px dashed #0284c7' }}>
              <label className="input-label" style={{ color: '#0369a1' }}>
                {lang === 'ta' ? '✨ விருப்பமான வகை பெயர் (Custom Type Name)' : 'Custom Category Name'}
              </label>
              <input
                type="text"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder={t.customTypePlaceholder}
                className="input-field"
                required
              />
            </div>
          )}

          <div>
            <label className="input-label">{t.address}</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={lang === 'ta' ? 'ஊர், முகவரி (எ.கா: சிவகாசி / மதுரை)' : 'City / Area (e.g. Sivakasi)'}
              className="input-field"
            />
          </div>

          {!editingCustomer && (
            <div>
              <label className="input-label">
                {lang === 'ta' ? 'தொடக்க நிலுவை இருப்பு (Opening Balance Grams - இருப்பின் மட்டும்)' : 'Opening Balance in Grams (Optional)'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  step="0.001"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  placeholder="0.000"
                  className="input-field"
                />
                <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '0.85rem', fontWeight: '800' }}>
                  g
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="input-label">{t.notes}</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={lang === 'ta' ? 'கூடுதல் குறிப்புகள், ஆதார் / ஜிஎஸ்டி எண்...' : 'Remarks, GST, etc.'}
              className="input-field"
              style={{ resize: 'vertical' }}
            />
          </div>

          </div>

          {/* Action Buttons Fixed Footer Bar */}
          <div style={{ padding: '0.75rem 1.5rem', borderTop: '1.5px solid #e2e8f0', background: '#ffffff', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexShrink: 0 }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              {t.cancel}
            </button>
            <button type="submit" className="btn btn-primary" style={{ background: '#ea580c', borderColor: '#ea580c', fontWeight: '900', minWidth: '120px' }}>
              <Check size={16} />
              <span>{t.save}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
