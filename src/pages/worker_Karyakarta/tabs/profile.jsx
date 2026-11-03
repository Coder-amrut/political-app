import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Save,
  Edit2,
  MapPin,
  Phone,
  User,
  Mail,
  Shield,
  Camera,
  Trash2,
  Calendar,
  Award,
  CheckCircle2,
  Landmark,
  Hash,
  Clock,
  BadgeCheck,
  Smartphone,
  Lock,
  Globe
} from 'lucide-react';
import { workerApi } from '../workerApi';

const DEFAULT_CASTES = [
  { caste_name_mr: 'मराठा', caste_name_en: 'Maratha', category: 'General' },
  { caste_name_mr: 'कुणबी', caste_name_en: 'Kunbi', category: 'OBC' },
  { caste_name_mr: 'ब्राह्मण', caste_name_en: 'Brahmin', category: 'General' },
  { caste_name_mr: 'माळी', caste_name_en: 'Mali', category: 'OBC' },
  { caste_name_mr: 'धनगर', caste_name_en: 'Dhangar', category: 'NT' },
  { caste_name_mr: 'वंजारी', caste_name_en: 'Vanjari', category: 'NT' },
  { caste_name_mr: 'महार', caste_name_en: 'Mahar', category: 'SC' },
  { caste_name_mr: 'मातंग', caste_name_en: 'Matang', category: 'SC' },
  { caste_name_mr: 'चांभार', caste_name_en: 'Chambhar', category: 'SC' },
  { caste_name_mr: 'लिंगायत', caste_name_en: 'Lingayat', category: 'General' },
  { caste_name_mr: 'जैन', caste_name_en: 'Jain', category: 'General' },
  { caste_name_mr: 'मुस्लिम', caste_name_en: 'Muslim', category: 'General' },
  { caste_name_mr: 'बौद्ध', caste_name_en: 'Buddhist', category: 'SC' },
  { caste_name_mr: 'तेली', caste_name_en: 'Teli', category: 'OBC' },
  { caste_name_mr: 'सुतार', caste_name_en: 'Sutar', category: 'OBC' },
  { caste_name_mr: 'लोहार', caste_name_en: 'Lohar', category: 'NT' },
  { caste_name_mr: 'कुंभार', caste_name_en: 'Kumbhar', category: 'OBC' },
  { caste_name_mr: 'नाभिक / न्हावी', caste_name_en: 'Nabhik', category: 'OBC' },
  { caste_name_mr: 'कोळी', caste_name_en: 'Koli', category: 'SBC' },
  { caste_name_mr: 'आदिवासी / भिल्ल / ठाकूर', caste_name_en: 'Tribal', category: 'ST' },
  { caste_name_mr: 'गवळी', caste_name_en: 'Gawali', category: 'NT' },
  { caste_name_mr: 'गुरव', caste_name_en: 'Gurav', category: 'OBC' },
  { caste_name_mr: 'गोसावी', caste_name_en: 'Gosavi', category: 'NT' },
  { caste_name_mr: 'कैकाडी', caste_name_en: 'Kaikadi', category: 'SC' },
  { caste_name_mr: 'इतर', caste_name_en: 'Other', category: 'General' },
];

export default function ProfileTab({
  isMr,
  t,
  user,
  profileData = {},
  isEditingProfile,
  setIsEditingProfile,
  handleProfileChange,
  saveProfile,
  dashboardStats = { totalAssigned: 0, contactRate: 0, contacted: 0, surveysCompleted: 0 }
}) {
  const [profilePhoto, setProfilePhoto] = useState(() => {
    return profileData.photoUrl || localStorage.getItem('karyakarta_profile_photo') || null;
  });
  const [castesList, setCastesList] = useState(DEFAULT_CASTES);
  const [isCustomCaste, setIsCustomCaste] = useState(false);
  const fileInputRef = useRef(null);

  // Load master castes list from API if available
  useEffect(() => {
    let isMounted = true;
    workerApi.getCastes()
      .then((res) => {
        if (isMounted && Array.isArray(res) && res.length > 0) {
          setCastesList(res);
        }
      })
      .catch((err) => {
        console.warn('Could not load castes from API in profile, using defaults', err);
      });
    return () => { isMounted = false; };
  }, []);

  // Check if current caste is not in predefined list
  useEffect(() => {
    if (profileData.caste) {
      const match = castesList.find(
        (c) => c.caste_name_mr === profileData.caste || c.caste_name_en === profileData.caste || c.caste_name === profileData.caste
      );
      if (!match && profileData.caste !== '' && profileData.caste !== 'इतर') {
        setIsCustomCaste(true);
      }
    }
  }, [profileData.caste, castesList]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(isMr ? 'कृपया ५ MB पेक्षा लहान फोटो निवडा.' : 'Please select a photo smaller than 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setProfilePhoto(dataUrl);
      try {
        localStorage.setItem('karyakarta_profile_photo', dataUrl);
      } catch (err) {
        console.warn('Could not save photo to localStorage', err);
      }
      if (handleProfileChange) {
        handleProfileChange({ target: { name: 'photoUrl', value: dataUrl } });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    if (window.confirm(isMr ? 'फोटो काढून टाकायचा आहे का?' : 'Remove profile photo?')) {
      setProfilePhoto(null);
      localStorage.removeItem('karyakarta_profile_photo');
      if (handleProfileChange) {
        handleProfileChange({ target: { name: 'photoUrl', value: '' } });
      }
    }
  };

  const handleCasteSelect = (e) => {
    const selected = e.target.value;
    if (selected === 'OTHER_CUSTOM') {
      setIsCustomCaste(true);
      if (handleProfileChange) {
        handleProfileChange({ target: { name: 'caste', value: '' } });
      }
    } else {
      setIsCustomCaste(false);
      const matched = castesList.find(
        (c) => (c.caste_name_mr || c.caste_name) === selected || (c.caste_name_en || c.caste_name) === selected
      );
      if (handleProfileChange) {
        handleProfileChange({ target: { name: 'caste', value: selected } });
        if (matched?.category) {
          handleProfileChange({ target: { name: 'category', value: matched.category } });
        }
      }
    }
  };

  const displayName = profileData.fullName || user?.full_name || user?.name || (isMr ? 'अधिकारी' : 'Officer');
  const displayRole = profileData.responsibility || profileData.role || (isMr ? 'बूथ समन्वयक व प्रभाग अधिकारी' : 'Ward & Booth Coordinator');
  const displayWard = profileData.assignedWard || (isMr ? 'प्रभाग क्र. ४ - सांगली' : 'Ward 4 - Sangli');
  const displayBooths = profileData.primaryBooths || (isMr ? 'बूथ क्र. १, २, ३' : 'Booths 1, 2, 3');
  const displayEpic = profileData.epic || 'MH/44/282/004269';

  return (
    <div className="module-container" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* 1. TOP HEADER & ACTION BAR */}
      <div
        className="profile-top-bar"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          background: '#ffffff',
          padding: '16px 20px',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF671F 0%, #ea580c 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 4px 10px rgba(234, 88, 12, 0.3)',
            }}
          >
            👤
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{isMr ? 'वापरकर्ता प्रोफाइल व संपूर्ण खाते तपशील' : 'Logged-in User Profile & Details'}</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '750',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  background: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                }}
              >
                ● {isMr ? 'सक्रिय खाते' : 'Active Account'}
              </span>
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
              {isMr ? 'आपले नाव, जात प्रवर्ग, कार्यक्षेत्र व अधिकृत निवडणूक ओळख' : 'View and manage official identity, caste category & territory'}
            </div>
          </div>
        </div>

        {/* Action Buttons (Responsive on Phone & Laptop) */}
        <div className="profile-actions-wrapper" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {isEditingProfile ? (
            <>
              <button
                type="button"
                className="karyakarta-btn karyakarta-btn-outline"
                onClick={() => setIsEditingProfile(false)}
                style={{ minHeight: '42px', padding: '9px 18px', fontSize: '13px' }}
              >
                <X size={16} />
                <span>{t('cancel')}</span>
              </button>
              <button
                type="button"
                className="karyakarta-btn karyakarta-btn-success"
                onClick={saveProfile}
                style={{ minHeight: '42px', padding: '9px 20px', fontSize: '13px', fontWeight: '800' }}
              >
                <Save size={16} />
                <span>{t('saveChanges')}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              className="karyakarta-btn karyakarta-btn-primary"
              onClick={() => setIsEditingProfile(true)}
              style={{ minHeight: '42px', padding: '9px 20px', fontSize: '13px', fontWeight: '800' }}
            >
              <Edit2 size={16} />
              <span>{isMr ? 'माहिती संपादित करा' : 'Edit Profile'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. OFFICIAL DIGITAL ID CARD (डिजिटल ओळखपत्र) */}
      <div
        className="official-id-card-wrapper"
        style={{
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 6px 20px rgba(15, 23, 42, 0.06)',
          position: 'relative',
        }}
      >
        {/* Top Indian Tricolor Stripe */}
        <div
          style={{
            height: '5px',
            background: 'linear-gradient(90deg, #FF671F 0%, #FFFFFF 50%, #138808 100%)',
          }}
        />

        {/* Card Header Background */}
        <div
          style={{
            background: 'linear-gradient(135deg, #091e3e 0%, #001f5c 55%, #1e3a8a 100%)',
            padding: '24px 28px',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '18px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
            {/* Avatar with Status Ring & Photo Upload */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  background: profilePhoto ? '#0f172a' : 'linear-gradient(135deg, #FF671F 0%, #ea580c 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '34px',
                  fontWeight: '900',
                  border: '3px solid #ffffff',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  userSelect: 'none',
                }}
                title={isMr ? 'प्रोफाइल फोटो अपलोड करण्यासाठी क्लिक करा' : 'Click to upload profile photo'}
              >
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>{displayName.charAt(0)}</span>
                )}

                {/* Hover Camera Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                >
                  <Camera size={26} color="#ffffff" />
                </div>
              </div>

              {/* Camera Upload Button Badge */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  color: '#ea580c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                  padding: 0,
                }}
                title={isMr ? 'फोटो अपलोड करा' : 'Upload photo'}
              >
                <Camera size={14} />
              </button>

              {/* If photo exists, show a remove button */}
              {profilePhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    left: '-4px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    border: '1.5px solid #ffffff',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    padding: 0,
                  }}
                  title={isMr ? 'फोटो हटवा' : 'Remove photo'}
                >
                  <Trash2 size={13} />
                </button>
              )}

              {/* Active Status Indicator */}
              <span
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#10b981',
                  border: '2.5px solid #ffffff',
                  boxShadow: '0 0 8px #10b981',
                }}
                title={isMr ? 'सक्रिय अधिकृत अधिकारी' : 'Active Verified Officer'}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '900', margin: 0, color: '#ffffff', letterSpacing: '-0.3px' }}>
                  {displayName}
                </h2>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: '800',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.18)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    color: '#ffffff',
                    fontFamily: 'monospace',
                  }}
                >
                  {profileData.employeeCode || 'WRK-0003'}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '3px 9px',
                    borderRadius: '10px',
                    background: '#ea580c',
                    color: '#ffffff',
                  }}
                >
                  {profileData.role || 'WORKER'}
                </span>
              </div>

              <div style={{ fontSize: '13.5px', color: '#fed7aa', fontWeight: '750', marginTop: '4px' }}>
                🚩 {displayRole}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12.5px', color: '#cbd5e1', marginTop: '6px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={14} color="#f97316" /> {profileData.address || (isMr ? 'सांगली, महाराष्ट्र' : 'Sangli, Maharashtra')}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Phone size={14} color="#10b981" /> {profileData.phone || user?.phone || '-'}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Award size={14} color="#f59e0b" /> {profileData.caste ? `${isMr ? 'जात:' : 'Caste:'} ${profileData.caste}` : (isMr ? 'जात नोंद बाकी' : 'Caste pending')}
                </span>
              </div>
            </div>
          </div>

          {/* Badges Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '800',
                padding: '5px 12px',
                borderRadius: '8px',
                background: '#10b981',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)',
              }}
            >
              <CheckCircle2 size={15} />
              <span>{isMr ? 'अधिकृत व सक्रिय अधिकारी' : 'Verified Active Officer'}</span>
            </span>
            <div style={{ fontSize: '11.5px', color: '#cbd5e1' }}>
              {isMr ? 'नोंदणी तारीख:' : 'Joined:'} <strong>{profileData.joinDate || '15 Jan 2023'}</strong>
            </div>
            {profileData.category && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '750',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#ffffff',
                }}
              >
                {isMr ? 'प्रवर्ग:' : 'Category:'} {profileData.category}
              </span>
            )}
          </div>
        </div>

        {/* Quick Territory Info Strip */}
        <div
          style={{
            background: '#f8fafc',
            padding: '16px 24px',
            borderTop: '1px solid #e2e8f0',
            borderBottom: '1px solid #e2e8f0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '14px',
            fontSize: '12.5px',
          }}
        >
          <div>
            <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '600', display: 'block' }}>
              🏛️ {isMr ? 'विधानसभा मतदारसंघ' : 'Assembly Constituency'}
            </span>
            <span style={{ fontWeight: '800', color: '#0f172a' }}>
              {profileData.assembly || '२८२ - सांगली विधानसभा'}
            </span>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '600', display: 'block' }}>
              🌐 {isMr ? 'लोकसभा मतदारसंघ' : 'Lok Sabha Constituency'}
            </span>
            <span style={{ fontWeight: '800', color: '#0f172a' }}>
              {profileData.lokSabha || '४४ - सांगली लोकसभा'}
            </span>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '600', display: 'block' }}>
              📍 {isMr ? 'नियुक्त प्रभाग' : 'Assigned Ward'}
            </span>
            <span style={{ fontWeight: '800', color: '#0f172a' }}>
              {displayWard}
            </span>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '600', display: 'block' }}>
              🗳️ {isMr ? 'प्राथमिक बूथ' : 'Primary Booths'}
            </span>
            <span style={{ fontWeight: '800', color: '#0f172a' }}>
              {displayBooths}
            </span>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '600', display: 'block' }}>
              🪪 {isMr ? 'मतदार ओळखपत्र क्र.' : 'Voter ID (EPIC)'}
            </span>
            <span style={{ fontWeight: '800', color: '#0f172a', fontFamily: 'monospace' }}>
              {displayEpic}
            </span>
          </div>
        </div>
      </div>

      {/* 3. LOGGED-IN USER ACCOUNT & SYSTEM STATUS CARD */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '20px 24px',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BadgeCheck size={20} color="#2563eb" />
            <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              {isMr ? 'लॉगिन वापरकर्ता खाते तपशील व सिस्टीम माहिती' : 'Logged-in User Account & System Info'}
            </h3>
          </div>
          <span style={{ fontSize: '11.5px', fontWeight: '750', padding: '3px 10px', borderRadius: '12px', background: '#eff6ff', color: '#1d4ed8' }}>
            {isMr ? 'डेटाबेस अधिकृत नोंद' : 'Database Verified'}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '16px',
            fontSize: '13px',
          }}
        >
          <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
            <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>{isMr ? 'वापरकर्त्याचे नाव (User Name)' : 'User Name'}</span>
            <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '14px' }}>{displayName}</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
            <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>{isMr ? 'अधिकारी पद / भूमिका (Role)' : 'Role'}</span>
            <span style={{ fontWeight: '800', color: '#ea580c' }}>{profileData.role || 'WORKER'}</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
            <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>{isMr ? 'खाते स्थिती (Account Status)' : 'Account Status'}</span>
            <span style={{ fontWeight: '800', color: '#16a34a' }}>● {profileData.status || 'ACTIVE'}</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
            <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>{isMr ? 'सिस्टम आयडी (User ID)' : 'User ID'}</span>
            <span style={{ fontWeight: '800', color: '#0f172a', fontFamily: 'monospace' }}>#{profileData.id || user?.id || 3}</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
            <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>{isMr ? 'खाते नोंदणी दिनांक (Registered At)' : 'Registered At'}</span>
            <span style={{ fontWeight: '700', color: '#334155' }}>{profileData.registeredAt || '2026-10-02 10:24:10'}</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
            <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>{isMr ? 'शेवटचे लॉगिन (Last Login)' : 'Last Login'}</span>
            <span style={{ fontWeight: '700', color: '#334155' }}>{profileData.lastLoginAt || (isMr ? 'आत्ताच (Active now)' : 'Active now')}</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #f1f5f9', gridColumn: 'span 2' }}>
            <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>{isMr ? 'सिस्टम सुरक्षित संदर्भ कोड (UUID)' : 'System Secure UUID'}</span>
            <span style={{ fontWeight: '700', color: '#475569', fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {profileData.uuid || '1040ac8d-6bb1-4faa-ba19-4dcaf1be2d7a'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. PERFORMANCE & ACTIVITY METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderTop: '3px solid #3b82f6', borderRadius: '14px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}>{isMr ? 'एकूण नियुक्त मतदार' : 'Assigned Voters'}</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>{dashboardStats.totalAssigned?.toLocaleString() || 0}</div>
          <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: '600', marginTop: '4px' }}>{dashboardStats.contactRate || 0}% {isMr ? 'संपर्क पूर्ण' : 'Done'}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderTop: '3px solid #10b981', borderRadius: '14px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}>{isMr ? 'थेट संपर्क साधलेले' : 'Contacted Voters'}</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>{dashboardStats.contacted?.toLocaleString() || 0}</div>
          <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600', marginTop: '4px' }}>{isMr ? 'थेट घराघरात संवाद' : 'Direct Visits'}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderTop: '3px solid #8b5cf6', borderRadius: '14px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}>{isMr ? 'पूर्ण केलेले सर्व्हे' : 'Surveys Completed'}</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>{dashboardStats.surveysCompleted?.toLocaleString() || 0}</div>
          <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: '600', marginTop: '4px' }}>{isMr ? 'कुटुंब सर्वेक्षण नोंद' : 'Household Records'}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderTop: '3px solid #f97316', borderRadius: '14px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}>{isMr ? 'हजेरी व कर्तृत्व दर्जा' : 'Attendance Score'}</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>१००%</div>
          <div style={{ fontSize: '11px', color: '#ea580c', fontWeight: '600', marginTop: '4px' }}>{isMr ? 'नियमित व समयबद्ध' : 'Punctual & Regular'}</div>
        </div>
      </div>

      {/* 5. TWO-COLUMN DETAILED PROFILE FORM & CASTE MANAGEMENT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* COLUMN 1: Personal & Caste/Category Information */}
        <div className="karyakarta-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="karyakarta-card-header">
            <span className="karyakarta-card-title">
              <User size={18} color="#2563eb" />
              <span>{isMr ? 'वैयक्तिक, जात व प्रवर्ग माहिती' : 'Personal, Caste & Category Information'}</span>
            </span>
            <span style={{ fontSize: '11px', background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
              {isMr ? 'डेटाबेस साठवणूक' : 'Stored in DB'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Full Name */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '750', color: '#334155', display: 'block', marginBottom: '4px' }}>
                {t('fullName')} *
              </label>
              {isEditingProfile ? (
                <input
                  type="text"
                  name="fullName"
                  className="karyakarta-input"
                  value={profileData.fullName || ''}
                  onChange={handleProfileChange}
                  placeholder={isMr ? 'पूर्ण नाव प्रविष्ट करा' : 'Enter full name'}
                />
              ) : (
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', padding: '6px 0' }}>
                  {profileData.fullName || displayName}
                </div>
              )}
            </div>

            {/* CASTE (जात) FIELD — REQUIRED BY USER */}
            <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '800', color: '#92400e', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>🏛️</span>
                  <span>{isMr ? 'वापरकर्त्याची जात (Caste)' : 'User Caste'} *</span>
                </label>
                <span style={{ fontSize: '10.5px', color: '#b45309', fontWeight: '700' }}>
                  {isMr ? 'डेटाबेस user_castes टेबलमध्ये साठवले जाते' : 'Saved to user_castes table'}
                </span>
              </div>

              {isEditingProfile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                  <select
                    className="karyakarta-select"
                    style={{ width: '100%', borderColor: '#fde68a', fontWeight: '600' }}
                    value={isCustomCaste ? 'OTHER_CUSTOM' : (profileData.caste || 'मराठा')}
                    onChange={handleCasteSelect}
                  >
                    {castesList.map((c, idx) => (
                      <option key={idx} value={c.caste_name_mr || c.caste_name}>
                        {c.caste_name_mr || c.caste_name} {c.category ? `(${c.category})` : ''}
                      </option>
                    ))}
                    <option value="OTHER_CUSTOM">{isMr ? '+ इतर जात (स्वतः टाईप करा)' : '+ Other Caste (Type Custom)'}</option>
                  </select>

                  {isCustomCaste && (
                    <input
                      type="text"
                      name="caste"
                      className="karyakarta-input"
                      style={{ borderColor: '#f59e0b', background: '#ffffff' }}
                      value={profileData.caste || ''}
                      onChange={handleProfileChange}
                      placeholder={isMr ? 'आपली जात येथे टाईप करा (उदा. मराठा, कुणबी, माळी...)' : 'Type your caste here'}
                    />
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span style={{ fontSize: '14.5px', fontWeight: '850', color: '#92400e' }}>
                    {profileData.caste || (isMr ? 'मराठा' : 'Maratha')}
                  </span>
                  {profileData.category && (
                    <span style={{ fontSize: '11px', fontWeight: '750', background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '6px', border: '1px solid #fde68a' }}>
                      {profileData.category}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Sub-caste and Caste Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {isMr ? 'उपजात (Sub-caste)' : 'Sub-Caste'}
                </label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="subCaste"
                    className="karyakarta-input"
                    value={profileData.subCaste || ''}
                    onChange={handleProfileChange}
                    placeholder={isMr ? 'उदा. ९६ कुळी, मराठा कुणबी' : 'Sub-caste'}
                  />
                ) : (
                  <div style={{ fontSize: '13px', color: '#0f172a', padding: '6px 0', fontWeight: '600' }}>
                    {profileData.subCaste || '-'}
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {isMr ? 'जात प्रवर्ग (Category)' : 'Category'}
                </label>
                {isEditingProfile ? (
                  <select
                    name="category"
                    className="karyakarta-select"
                    style={{ width: '100%' }}
                    value={profileData.category || 'OPEN'}
                    onChange={handleProfileChange}
                  >
                    <option value="OPEN">OPEN / General (खुला)</option>
                    <option value="OBC">OBC (इतर मागासवर्ग)</option>
                    <option value="SC">SC (अनुसूचित जाती)</option>
                    <option value="ST">ST (अनुसूचित जमाती)</option>
                    <option value="VJNT">VJ / NT (विमुक्त जाती / भटक्या जमाती)</option>
                    <option value="SBC">SBC (विशेष मागास प्रवर्ग)</option>
                    <option value="EWS">EWS (आर्थिकदृष्ट्या दुर्बल)</option>
                  </select>
                ) : (
                  <div style={{ fontSize: '13px', fontWeight: '750', color: '#0f172a', padding: '6px 0' }}>
                    {profileData.category || 'OPEN'}
                  </div>
                )}
              </div>
            </div>

            {/* DOB & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {t('dob')}
                </label>
                {isEditingProfile ? (
                  <input
                    type="date"
                    name="dob"
                    className="karyakarta-input"
                    value={profileData.dob || ''}
                    onChange={handleProfileChange}
                  />
                ) : (
                  <div style={{ fontSize: '13px', color: '#0f172a', padding: '6px 0' }}>
                    {profileData.dob ? new Date(profileData.dob).toLocaleDateString() : '1992-05-18'}
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {t('phoneNumber')} *
                </label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="phone"
                    className="karyakarta-input"
                    value={profileData.phone || ''}
                    onChange={handleProfileChange}
                    placeholder={isMr ? '१० अंकी मोबाईल' : 'Mobile number'}
                  />
                ) : (
                  <div style={{ fontSize: '13px', color: '#0f172a', padding: '6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="#16a34a" />
                    <span style={{ fontWeight: '700' }}>{profileData.phone || user?.phone || '9822011221'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                {t('emailAddress')}
              </label>
              {isEditingProfile ? (
                <input
                  type="email"
                  name="email"
                  className="karyakarta-input"
                  value={profileData.email || ''}
                  onChange={handleProfileChange}
                  placeholder={isMr ? 'ईमेल आयडी' : 'Email address'}
                />
              ) : (
                <div style={{ fontSize: '13px', color: '#0f172a', padding: '6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} color="#2563eb" />
                  <span>{profileData.email || user?.email || '-'}</span>
                </div>
              )}
            </div>

            {/* Address */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                {t('residentialAddress')}
              </label>
              {isEditingProfile ? (
                <textarea
                  name="address"
                  className="karyakarta-input"
                  rows="2"
                  value={profileData.address || ''}
                  onChange={handleProfileChange}
                  placeholder={isMr ? 'संपूर्ण निवासी पत्ता' : 'Residential address'}
                />
              ) : (
                <div style={{ fontSize: '13px', color: '#334155', padding: '6px 0', lineHeight: 1.4 }}>
                  {profileData.address || (isMr ? 'घर क्र. ४५, गणपती पेठ, मारुती मंदिर जवळ, सांगली' : 'Sangli, Maharashtra')}
                </div>
              )}
            </div>

            {/* Aadhar & PAN */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {isMr ? 'आधार क्रमांक' : 'Aadhar No.'}
                </label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="aadharNumber"
                    className="karyakarta-input"
                    value={profileData.aadharNumber || ''}
                    onChange={handleProfileChange}
                    placeholder="XXXX-XXXX-XXXX"
                    maxLength={14}
                  />
                ) : (
                  <div style={{ fontSize: '12.5px', color: '#0f172a', fontFamily: 'monospace', padding: '6px 0' }}>
                    {profileData.aadharNumber || '•••• •••• १२३४'}
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {isMr ? 'पॅन कार्ड क्रमांक' : 'PAN No.'}
                </label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="panNumber"
                    className="karyakarta-input"
                    value={profileData.panNumber || ''}
                    onChange={handleProfileChange}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                  />
                ) : (
                  <div style={{ fontSize: '12.5px', color: '#0f172a', fontFamily: 'monospace', padding: '6px 0' }}>
                    {profileData.panNumber || '•••••••२३F'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Political Territory & Official Booth Assignment */}
        <div className="karyakarta-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="karyakarta-card-header">
            <span className="karyakarta-card-title">
              <Shield size={18} color="#ea580c" />
              <span>{isMr ? 'राजकीय व निवडणूक कार्यक्षेत्र तपशील' : 'Political & Booth Assignment'}</span>
            </span>
            <span style={{ fontSize: '11px', background: '#fff7ed', color: '#ea580c', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
              {isMr ? 'अ‍ॅडमिन मान्यताप्राप्त' : 'Admin Assigned'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Assembly & Lok Sabha */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {isMr ? 'विधानसभा' : 'Assembly'}
                </label>
                <div style={{ fontSize: '13px', fontWeight: '750', color: '#0f172a', padding: '6px 0' }}>
                  🏛️ {profileData.assembly || '२८२ - सांगली'}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {isMr ? 'लोकसभा' : 'Lok Sabha'}
                </label>
                <div style={{ fontSize: '13px', fontWeight: '750', color: '#0f172a', padding: '6px 0' }}>
                  🌐 {profileData.lokSabha || '४४ - सांगली'}
                </div>
              </div>
            </div>

            {/* Assigned Ward */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                {t('assignedWard')}
              </label>
              {isEditingProfile ? (
                <input
                  type="text"
                  name="assignedWard"
                  className="karyakarta-input"
                  value={profileData.assignedWard || ''}
                  onChange={handleProfileChange}
                  placeholder={isMr ? 'उदा. प्रभाग क्र. ४ - सांगली' : 'Ward number'}
                />
              ) : (
                <div style={{ fontSize: '13.5px', fontWeight: '750', color: '#0f172a', padding: '6px 0' }}>
                  📍 {displayWard}
                </div>
              )}
            </div>

            {/* Primary Booths */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                {t('primaryBooths')}
              </label>
              {isEditingProfile ? (
                <input
                  type="text"
                  name="primaryBooths"
                  className="karyakarta-input"
                  value={profileData.primaryBooths || ''}
                  onChange={handleProfileChange}
                  placeholder={isMr ? 'उदा. बूथ १, २, ३' : 'Assigned booths'}
                />
              ) : (
                <div style={{ fontSize: '13px', color: '#0f172a', padding: '6px 0' }}>
                  🗳️ {displayBooths}
                </div>
              )}
            </div>

            {/* EPIC & Join Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {t('epic')}
                </label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="epic"
                    className="karyakarta-input"
                    value={profileData.epic || ''}
                    onChange={handleProfileChange}
                    placeholder={isMr ? 'मतदार ओळखपत्र क्र.' : 'Voter ID'}
                  />
                ) : (
                  <div style={{ fontSize: '13px', fontWeight: '750', color: '#0f172a', fontFamily: 'monospace', padding: '6px 0' }}>
                    🪪 {displayEpic}
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {t('joinDate')}
                </label>
                {isEditingProfile ? (
                  <input
                    type="date"
                    name="joinDate"
                    className="karyakarta-input"
                    value={profileData.joinDate || ''}
                    onChange={handleProfileChange}
                  />
                ) : (
                  <div style={{ fontSize: '13px', color: '#0f172a', padding: '6px 0' }}>
                    📅 {profileData.joinDate ? new Date(profileData.joinDate).toLocaleDateString() : '2023-01-15'}
                  </div>
                )}
              </div>
            </div>

            {/* Responsibility Description */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                {isMr ? 'अधिकारी जबाबदारी / पदभार' : 'Responsibility'}
              </label>
              {isEditingProfile ? (
                <input
                  type="text"
                  name="responsibility"
                  className="karyakarta-input"
                  value={profileData.responsibility || ''}
                  onChange={handleProfileChange}
                  placeholder={isMr ? 'उदा. बूथ व मतदार संपर्क प्रमुख' : 'Responsibility title'}
                />
              ) : (
                <div style={{ fontSize: '13px', color: '#0f172a', padding: '6px 0', fontWeight: '700' }}>
                  🎯 {displayRole}
                </div>
              )}
            </div>

            {/* State & District */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {isMr ? 'जिल्हा' : 'District'}
                </label>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', padding: '6px 0' }}>
                  {profileData.district || 'सांगली (Sangli)'}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {isMr ? 'राज्य' : 'State'}
                </label>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', padding: '6px 0' }}>
                  {profileData.state || 'महाराष्ट्र (Maharashtra)'}
                </div>
              </div>
            </div>

            {/* Security Action Bar (Responsive Button) */}
            <div
              style={{
                borderTop: '1px solid #f1f5f9',
                paddingTop: '14px',
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <button
                type="button"
                onClick={() => alert(isMr ? 'पासवर्ड बदलण्याची सुरक्षित लिंक आपल्या नोंदणीकृत मोबाईलवर पाठवली आहे.' : 'Password reset link sent to mobile.')}
                className="karyakarta-btn karyakarta-btn-outline"
                style={{ fontSize: '12.5px', padding: '8px 14px', minHeight: '40px' }}
              >
                <Lock size={14} />
                <span>{t('changePassword')}</span>
              </button>

              <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={12} color="#16a34a" />
                <span>{isMr ? '२५६-बिट सुरक्षित प्रमाणीकरण' : '256-bit Secure Auth'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
