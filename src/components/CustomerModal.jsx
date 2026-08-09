import React, { useState } from 'react';
import { X, UserPlus, Check, User, Phone, MapPin, Tag } from 'lucide-react';
import { translations } from '../utils/translations';

export function CustomerModal({
  lang,
  isOpen,
  onClose,
  onSaveCustomer,
  editingCustomer = null
}) {
  const t = translations[lang];

  const [name, setName] = useState(editingCustomer ? editingCustomer.name : '');
  const [phone, setPhone] = useState(editingCustomer ? editingCustomer.phone : '');
  const [address, setAddress] = useState(editingCustomer ? editingCustomer.address : '');
  const [type, setType] = useState(editingCustomer ? editingCustomer.type : 'typeRetail');
  const [notes, setNotes] = useState(editingCustomer ? editingCustomer.notes : '');
  const [openingBalance, setOpeningBalance] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const customerData = {
      id: editingCustomer ? editingCustomer.id : `cust-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      type,
      notes: notes.trim(),
      createdAt: editingCustomer ? editingCustomer.createdAt : new Date().toISOString()
    };

    onSaveCustomer(customerData, Number(openingBalance) || 0);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
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
              background: 'rgba(2, 132, 199, 0.2)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserPlus size={18} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
              {editingCustomer 
                ? (lang === 'ta' ? 'வாடிக்கையாளர் விவரங்களை திருத்துக' : 'Edit Customer') 
                : t.newCustomer}
            </h3>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <label className="input-label">{t.customerName} *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === 'ta' ? 'எ.கா: செந்தில் குமார் / ஸ்ரீ முருகன் ஜூவல்லரி' : 'e.g. Senthil Kumar'}
              className="input-field"
              required
              autoFocus
            />
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
              <label className="input-label">{t.customerType}</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="input-field"
              >
                <option value="typeRetail">{t.typeRetail}</option>
                <option value="typeKarigar">{t.typeKarigar}</option>
                <option value="typeWholesale">{t.typeWholesale}</option>
                <option value="typeGeneral">{t.typeGeneral}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="input-label">{t.address}</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={lang === 'ta' ? 'ஊர், கடை முகவரி (எ.கா: தெற்கு மாசி வீதி, மதுரை)' : 'City / Area'}
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
                <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }}>
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

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              {t.cancel}
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>{t.save}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
