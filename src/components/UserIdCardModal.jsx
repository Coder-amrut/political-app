import React, { useState, useRef } from 'react';
import { X, Printer, Download, Edit3, Check, User, Phone, Calendar, MapPin, Hash, Shield } from 'lucide-react';

export default function UserIdCardModal({ isOpen, onClose, user = {}, isMr = true }) {
  if (!isOpen) return null;

  // Extract initial user data
  const initialName = user?.full_name || user?.name || (isMr ? 'राहुल संभाजी पाटील' : 'Rahul Sambhaji Patil');
  const initialId = user?.member_id || user?.user_id || user?.id_code || `MPS-2026-${String(user?.id || '4892').padStart(4, '0')}`;
  const initialPhone = user?.phone || user?.mobile || '+91 98765 43210';
  const initialDob = user?.dob || user?.birth_date || '15/08/1992';
  const initialAddress = user?.address || (isMr ? 'घर नं. ४५, शिवाजी चौक, कवठे महांकाळ, सांगली - ४१६४०५' : 'House No. 45, Shivaji Chowk, Kavathe Mahankal, Sangli - 416405');
  const initialPhoto = user?.photo_url || user?.photo || localStorage.getItem('karyakarta_profile_photo') || null;
  const initialRole = user?.role || user?.responsibility || (isMr ? 'कार्यकर्ता / पदाधिकारी' : 'Cadre / Incharge');

  // Local state for editable details
  const [name, setName] = useState(initialName);
  const [memberId, setMemberId] = useState(initialId);
  const [phone, setPhone] = useState(initialPhone);
  const [dob, setDob] = useState(initialDob);
  const [address, setAddress] = useState(initialAddress);
  const [photo, setPhoto] = useState(initialPhoto);
  const [role, setRole] = useState(initialRole);
  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert(isMr ? 'कृपया ५ MB पेक्षा लहान फोटो निवडा.' : 'Please choose an image under 5 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('printable-official-id-card');
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Identity Card - ${name}</title>
          <meta charset="utf-8" />
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700;800&family=Inter:wght@400;600;700&display=swap');
            body {
              margin: 0;
              padding: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #f1f5f9;
              font-family: 'Mukta', 'Inter', sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .card-wrapper {
              width: 340px;
              background: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 10px 25px rgba(0,0,0,0.12);
              border: 1px solid #cbd5e1;
            }
            .header-banner {
              background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
              color: #ffffff;
              padding: 16px 14px 12px;
              text-align: center;
              border-bottom: 3px solid #d97706;
            }
            .app-title {
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 1.2px;
              font-weight: 700;
              color: #fef08a;
              margin-bottom: 2px;
            }
            .sub-title {
              font-size: 16px;
              font-weight: 800;
              letter-spacing: 0.5px;
            }
            .body-content {
              padding: 18px 20px 20px;
              text-align: center;
            }
            .photo-frame {
              width: 95px;
              height: 95px;
              margin: 0 auto 12px;
              border-radius: 50%;
              border: 3.5px solid #1e3a8a;
              overflow: hidden;
              background: #e2e8f0;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .photo-frame img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .user-name {
              font-size: 18px;
              font-weight: 800;
              color: #0f172a;
              margin: 0 0 4px;
            }
            .id-pill {
              display: inline-block;
              background: #eff6ff;
              color: #1e40af;
              font-size: 11.5px;
              font-weight: 700;
              padding: 3px 12px;
              border-radius: 12px;
              border: 1px solid #bfdbfe;
              margin-bottom: 14px;
            }
            .details-box {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 10px;
              padding: 10px 14px;
              text-align: left;
              font-size: 12px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 4px 0;
              border-bottom: 1px dashed #e2e8f0;
            }
            .detail-row:last-child {
              border-bottom: none;
              flex-direction: column;
              gap: 2px;
            }
            .label {
              color: #64748b;
              font-weight: 600;
            }
            .value {
              color: #0f172a;
              font-weight: 700;
              text-align: right;
            }
            .address-value {
              color: #0f172a;
              font-weight: 600;
              line-height: 1.35;
              text-align: left;
              margin-top: 2px;
            }
            .footer-strip {
              background: #0f172a;
              color: #94a3b8;
              font-size: 9.5px;
              padding: 7px;
              text-align: center;
              font-weight: 600;
            }
            @media print {
              body { background: transparent; padding: 0; }
              .card-wrapper { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(5px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
        fontFamily: "'Mukta', 'Inter', sans-serif"
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#1e3a8a',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Shield size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                {isMr ? 'अधिकृत डिजिटल ओळखपत्र' : 'Official Identity Card'}
              </h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                {isMr ? 'नमुना १ - क्लासिक ऑफिशियल कार्ड' : 'Sample 1 - Classic Official Card'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              padding: '6px',
              borderRadius: '8px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          
          {/* Card Wrapper (Printable Container) */}
          <div
            id="printable-official-id-card"
            style={{
              width: '340px',
              background: '#ffffff',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
              border: '1.5px solid #cbd5e1'
            }}
          >
            {/* Header: App Name & Title */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                color: '#ffffff',
                padding: '14px 14px 12px',
                textAlign: 'center',
                borderBottom: '3px solid #d97706'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                <img
                  src="/logo.png"
                  alt="App Logo"
                  style={{
                    width: '32px',
                    height: '32px',
                    objectFit: 'contain',
                    background: '#ffffff',
                    borderRadius: '8px',
                    padding: '2px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
                    display: 'inline-block'
                  }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div
                  style={{
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '1.2px',
                    fontWeight: '700',
                    color: '#fef08a'
                  }}
                >
                  MaKanisms Political Suite
                </div>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '0.5px' }}>
                {isMr ? 'अधिकृत ओळखपत्र' : 'Official Identity Card'}
              </div>
            </div>

            {/* Body Content */}
            <div style={{ padding: '18px 20px 20px', textAlign: 'center' }}>
              {/* Photo */}
              <div
                style={{
                  position: 'relative',
                  width: '95px',
                  height: '95px',
                  margin: '0 auto 12px',
                  borderRadius: '50%',
                  border: '3.5px solid #1e3a8a',
                  overflow: 'hidden',
                  background: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              >
                {photo ? (
                  <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={48} color="#94a3b8" />
                )}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      insetInline: 0,
                      background: 'rgba(0,0,0,0.65)',
                      color: '#fff',
                      border: 'none',
                      fontSize: '10px',
                      padding: '3px 0',
                      cursor: 'pointer'
                    }}
                  >
                    {isMr ? 'बदला' : 'Change'}
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />

              {/* User Name */}
              <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                {name}
              </h3>

              {/* ID Number Pill */}
              <div
                style={{
                  display: 'inline-block',
                  background: '#eff6ff',
                  color: '#1e40af',
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '3px 12px',
                  borderRadius: '12px',
                  border: '1px solid #bfdbfe',
                  marginBottom: '14px'
                }}
              >
                ID: {memberId}
              </div>

              {/* Key Details Box (strictly requested fields) */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  textAlign: 'left',
                  fontSize: '12px'
                }}
              >
                {/* Role / पद */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed #e2e8f0' }}>
                  <span style={{ color: '#64748b', fontWeight: '600' }}>{isMr ? 'पद / हुद्दा :' : 'Role :'}</span>
                  <span style={{ color: '#0f172a', fontWeight: '700' }}>{role}</span>
                </div>

                {/* Phone Number */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed #e2e8f0' }}>
                  <span style={{ color: '#64748b', fontWeight: '600' }}>{isMr ? 'मोबाईल नंबर :' : 'Phone No :'}</span>
                  <span style={{ color: '#0f172a', fontWeight: '700' }}>{phone}</span>
                </div>

                {/* DOB */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed #e2e8f0' }}>
                  <span style={{ color: '#64748b', fontWeight: '600' }}>{isMr ? 'जन्मतारीख :' : 'Date of Birth :'}</span>
                  <span style={{ color: '#0f172a', fontWeight: '700' }}>{dob}</span>
                </div>

                {/* Address */}
                <div style={{ padding: '6px 0 2px' }}>
                  <div style={{ color: '#64748b', fontWeight: '600', marginBottom: '2px' }}>
                    {isMr ? 'पत्ता :' : 'Address :'}
                  </div>
                  <div style={{ color: '#0f172a', fontWeight: '600', lineHeight: '1.4' }}>
                    {address}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Strip */}
            <div
              style={{
                background: '#0f172a',
                color: '#94a3b8',
                fontSize: '9.5px',
                padding: '7px',
                textAlign: 'center',
                fontWeight: '600'
              }}
            >
              {isMr ? 'हे ओळखपत्र अधिकृत कामकाजासाठी वैध आहे.' : 'Official Authorized Identification Card'}
            </div>
          </div>

          {/* Quick Edit Section (if user wants to customize) */}
          {isEditing && (
            <div
              style={{
                width: '100%',
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#1e3a8a' }}>
                ✏️ {isMr ? 'कार्डवरील माहिती संपादित करा' : 'Edit Details for ID Card'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>{isMr ? 'पूर्ण नाव' : 'Name'}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>{isMr ? 'युझर ID' : 'User ID'}</label>
                  <input
                    type="text"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>{isMr ? 'मोबाईल' : 'Phone'}</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>{isMr ? 'जन्मतारीख' : 'DOB'}</label>
                  <input
                    type="text"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>{isMr ? 'पत्ता' : 'Address'}</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', resize: 'vertical' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Edit3 size={14} />
            <span>{isEditing ? (isMr ? 'संपादन पूर्ण' : 'Done') : (isMr ? 'माहिती बदला' : 'Edit')}</span>
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#64748b',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {isMr ? 'बंद करा' : 'Close'}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                background: '#1e3a8a',
                color: '#ffffff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 10px rgba(30, 58, 138, 0.25)'
              }}
            >
              <Printer size={15} />
              <span>{isMr ? 'प्रिंट / सेव्ह कार्ड' : 'Print / Save ID'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
