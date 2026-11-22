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
  Smartphone,
  Lock,
  Globe,
  ChevronDown,
  Check
} from 'lucide-react';
import { workerApi } from '../workerApi';
import UserIdCardModal from '../../../components/UserIdCardModal';

const CATEGORY_OPTIONS = [
  { value: 'OPEN', label: 'OPEN / General (खुला)' },
  { value: 'OBC', label: 'OBC (इतर मागासवर्ग)' },
  { value: 'SC', label: 'SC (अनुसूचित जाती)' },
  { value: 'ST', label: 'ST (अनुसूचित जमाती)' },
  { value: 'VJNT', label: 'VJ / NT (विमुक्त व भटक्या जमाती)' },
  { value: 'SBC', label: 'SBC (विशेष मागास प्रवर्ग)' },
  { value: 'EWS', label: 'EWS (आर्थिकदृष्ट्या दुर्बल)' },
];

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
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [castesList, setCastesList] = useState(DEFAULT_CASTES);
  const [isCustomCaste, setIsCustomCaste] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
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

  const applyCaste = (casteName) => {
    if (handleProfileChange) {
      handleProfileChange({ target: { name: 'caste', value: casteName } });
      const matched = castesList.find(
        (c) =>
          (c.caste_name_mr && c.caste_name_mr.toLowerCase() === String(casteName).trim().toLowerCase()) ||
          (c.caste_name_en && c.caste_name_en.toLowerCase() === String(casteName).trim().toLowerCase()) ||
          (c.caste_name && c.caste_name.toLowerCase() === String(casteName).trim().toLowerCase())
      );
      if (matched?.category) {
        handleProfileChange({ target: { name: 'category', value: matched.category } });
      }
    }
  };

  const handleCasteType = (e) => {
    applyCaste(e.target.value);
  };

  const hasAssignedTerritory = Boolean(
    profileData.assignedWard ||
    profileData.primaryBooths ||
    profileData.responsibility ||
    profileData.assembly ||
    profileData.lokSabha
  );

  const isProfileIncomplete = !profileData.dob || !profileData.address || !profileData.caste || !profilePhoto;

  const displayName = profileData.fullName || user?.full_name || user?.name || (isMr ? 'अधिकारी' : 'Officer');
  const displayRole = profileData.responsibility || (hasAssignedTerritory ? (profileData.role || 'कार्यकर्ता / पदाधिकारी') : (isMr ? 'अद्याप काम नियुक्त नाही (Pending)' : 'No Work Assigned Yet'));
  const displayWard = profileData.assignedWard || (isMr ? 'अद्याप नियुक्त नाही' : 'Not Assigned');
  const displayBooths = profileData.primaryBooths || (isMr ? 'अद्याप नियुक्त नाही' : 'Not Assigned');
  const displayEpic = profileData.epic || '-';

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
          <button
            type="button"
            className="karyakarta-btn"
            onClick={() => setShowIdCardModal(true)}
            style={{
              minHeight: '42px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 10px rgba(30, 58, 138, 0.25)'
            }}
          >
            <span>🪪</span>
            <span>{isMr ? 'ओळखपत्र तयार करा' : 'Create ID Card'}</span>
          </button>

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
              <span>{isMr ? 'Edit Profile (प्रोफाइल संपादित करा)' : 'Edit Profile'}</span>
            </button>
          )}
        </div>
      </div>

      {/* PROFILE INCOMPLETE SUGGESTION BANNER */}
      {isProfileIncomplete && !isEditingProfile && (
        <div
          className="profile-completion-banner"
          style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            border: '1.5px solid #f59e0b',
            borderRadius: '14px',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.12)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#f59e0b',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                flexShrink: 0
              }}
            >
              📢
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{isMr ? 'आपली प्रोफाइल अद्याप अपूर्ण आहे!' : 'Your Profile is Incomplete!'}</span>
                <span style={{ fontSize: '11px', background: '#dc2626', color: '#ffffff', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                  {isMr ? 'माहिती भरा' : 'Action Required'}
                </span>
              </div>
              <div style={{ fontSize: '12.5px', color: '#78350f', marginTop: '3px', lineHeight: 1.4 }}>
                {isMr
                  ? 'आपले अधिकृत डिजिटल ओळखपत्र (ID Card) सक्रिय करण्यासाठी कृपया आपली जन्म तारीख, जात, पत्ता व फोटो त्वरित पूर्ण करा.'
                  : 'Please complete your personal details (Date of Birth, Caste, Address & Photo) to generate your official identity card.'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsEditingProfile(true)}
            style={{
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(180, 83, 9, 0.3)'
            }}
          >
            <Edit2 size={16} />
            <span>{isMr ? 'प्रोफाइल पूर्ण करा (Complete Profile)' : 'Complete Profile'}</span>
          </button>
        </div>
      )}

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

              <div style={{ fontSize: '13.5px', color: hasAssignedTerritory ? '#fed7aa' : '#cbd5e1', fontWeight: '750', marginTop: '4px' }}>
                🚩 {displayRole}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12.5px', color: '#cbd5e1', marginTop: '6px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={14} color="#f97316" /> {profileData.address || (isMr ? 'पत्ता नोंद बाकी' : 'Address pending')}
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
                background: hasAssignedTerritory ? '#10b981' : '#f59e0b',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: hasAssignedTerritory ? '0 2px 8px rgba(16, 185, 129, 0.35)' : '0 2px 8px rgba(245, 158, 11, 0.35)',
              }}
            >
              <CheckCircle2 size={15} />
              <span>{hasAssignedTerritory ? (isMr ? 'अधिकृत व सक्रिय अधिकारी' : 'Verified Active Officer') : (isMr ? 'सक्रिय • कार्यवाटप प्रलंबित' : 'Active • Allocation Pending')}</span>
            </span>
            <div style={{ fontSize: '11.5px', color: '#cbd5e1' }}>
              {isMr ? 'नोंदणी तारीख:' : 'Joined:'} <strong>{profileData.joinDate || (user?.created_at ? new Date(user.created_at).toLocaleDateString() : (isMr ? 'नवीन नोंदणी' : 'New User'))}</strong>
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
            background: '#fffdf5',
            padding: '16px 24px',
            borderTop: '1.5px solid #fde68a',
            borderBottom: '1.5px solid #fde68a',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '14px',
            fontSize: '12.5px',
          }}
        >
          <div>
            <span style={{ color: '#78350f', fontSize: '11px', fontWeight: '700', display: 'block' }}>
              🏛️ {isMr ? 'विधानसभा मतदारसंघ' : 'Assembly Constituency'}
            </span>
            <span style={{ fontWeight: '800', color: profileData.assembly ? '#0f172a' : '#d97706' }}>
              {profileData.assembly || (isMr ? 'अद्याप नियुक्त नाही (Pending)' : 'Not Assigned')}
            </span>
          </div>
          <div>
            <span style={{ color: '#78350f', fontSize: '11px', fontWeight: '700', display: 'block' }}>
              🌐 {isMr ? 'लोकसभा मतदारसंघ' : 'Lok Sabha Constituency'}
            </span>
            <span style={{ fontWeight: '800', color: profileData.lokSabha ? '#0f172a' : '#d97706' }}>
              {profileData.lokSabha || (isMr ? 'अद्याप नियुक्त नाही (Pending)' : 'Not Assigned')}
            </span>
          </div>
          <div>
            <span style={{ color: '#78350f', fontSize: '11px', fontWeight: '700', display: 'block' }}>
              📍 {isMr ? 'नियुक्त प्रभाग' : 'Assigned Ward'}
            </span>
            <span style={{ fontWeight: '800', color: profileData.assignedWard ? '#0f172a' : '#d97706' }}>
              {displayWard}
            </span>
          </div>
          <div>
            <span style={{ color: '#78350f', fontSize: '11px', fontWeight: '700', display: 'block' }}>
              🗳️ {isMr ? 'प्राथमिक बूथ' : 'Primary Booths'}
            </span>
            <span style={{ fontWeight: '800', color: profileData.primaryBooths ? '#0f172a' : '#d97706' }}>
              {displayBooths}
            </span>
          </div>
          <div>
            <span style={{ color: '#78350f', fontSize: '11px', fontWeight: '700', display: 'block' }}>
              🪪 {isMr ? 'मतदार ओळखपत्र क्र.' : 'Voter ID (EPIC)'}
            </span>
            <span style={{ fontWeight: '800', color: '#0f172a', fontFamily: 'monospace' }}>
              {displayEpic}
            </span>
          </div>
        </div>
      </div>

      {/* 4. PERFORMANCE & ACTIVITY METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderTop: '3px solid #3b82f6', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.05)' }}>
          <div style={{ fontSize: '12px', color: '#78350f', fontWeight: '750' }}>{isMr ? 'एकूण नियुक्त मतदार' : 'Assigned Voters'}</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>{dashboardStats.totalAssigned?.toLocaleString() || 0}</div>
          <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: '600', marginTop: '4px' }}>{dashboardStats.contactRate || 0}% {isMr ? 'संपर्क पूर्ण' : 'Done'}</div>
        </div>

        <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderTop: '3px solid #10b981', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.05)' }}>
          <div style={{ fontSize: '12px', color: '#78350f', fontWeight: '750' }}>{isMr ? 'थेट संपर्क साधलेले' : 'Contacted Voters'}</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>{dashboardStats.contacted?.toLocaleString() || 0}</div>
          <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600', marginTop: '4px' }}>{isMr ? 'थेट घराघरात संवाद' : 'Direct Visits'}</div>
        </div>

        <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderTop: '3px solid #8b5cf6', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.05)' }}>
          <div style={{ fontSize: '12px', color: '#78350f', fontWeight: '750' }}>{isMr ? 'पूर्ण केलेले सर्व्हे' : 'Surveys Completed'}</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>{dashboardStats.surveysCompleted?.toLocaleString() || 0}</div>
          <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: '600', marginTop: '4px' }}>{isMr ? 'कुटुंब सर्वेक्षण नोंद' : 'Household Records'}</div>
        </div>

        <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderTop: '3px solid #f97316', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.05)' }}>
          <div style={{ fontSize: '12px', color: '#78350f', fontWeight: '750' }}>{isMr ? 'हजेरी व कर्तृत्व दर्जा' : 'Attendance Score'}</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>
            {dashboardStats.attendanceScore != null ? `${dashboardStats.attendanceScore}%` : '०%'}
          </div>
          <div style={{ fontSize: '11px', color: '#ea580c', fontWeight: '600', marginTop: '4px' }}>
            {dashboardStats.attendanceNote || (isMr ? 'हजेरी नोंद आधारित' : 'Based on attendance records')}
          </div>
        </div>
      </div>

      {/* 5. TWO-COLUMN DETAILED PROFILE FORM & CASTE MANAGEMENT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* COLUMN 1: Personal & Caste/Category Information */}
        <div
          className="karyakarta-card"
          style={{
            background: '#fffbeb',
            border: '1.5px solid #fde68a',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.07)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div className="karyakarta-card-header" style={{ borderBottom: '1px solid #fde68a', paddingBottom: '12px' }}>
            <span className="karyakarta-card-title">
              <User size={18} color="#d97706" />
              <span>{isMr ? 'वैयक्तिक, जात व प्रवर्ग माहिती' : 'Personal, Caste & Category Information'}</span>
            </span>
            <span style={{ fontSize: '11px', background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
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

            {/* CASTE (जात) FIELD — CLEAN & CONSISTENT LIKE NAME */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '750', color: '#334155', display: 'block', marginBottom: '4px' }}>
                {isMr ? 'वापरकर्त्याची जात (Caste) *' : 'User Caste *'}
              </label>
              {isEditingProfile ? (
                <>
                  <input
                    type="text"
                    name="caste"
                    list="castes-datalist"
                    className="karyakarta-input"
                    value={profileData.caste || ''}
                    onChange={handleCasteType}
                    placeholder={isMr ? 'जात टाईप करा किंवा निवडा (उदा. मराठा, कुणबी, माळी, चांभार...)' : 'Type or select caste'}
                    autoComplete="off"
                  />
                  <datalist id="castes-datalist">
                    {castesList.map((c, idx) => (
                      <option key={idx} value={c.caste_name_mr || c.caste_name}>
                        {c.category ? `(${c.category})` : ''}
                      </option>
                    ))}
                  </datalist>
                </>
              ) : (
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', padding: '6px 0' }}>
                  {profileData.caste || (isMr ? 'नोंद बाकी (Pending)' : 'Not set')}
                </div>
              )}
            </div>

            {/* Sub-caste and Caste Category */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {isMr ? 'उपजात (Sub-caste)' : 'Sub-Caste'}
                </label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="subCaste"
                    className="karyakarta-input"
                    style={{ width: '100%', boxSizing: 'border-box', minHeight: '42px', fontSize: '13.5px', padding: '8px 12px' }}
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
                  <div style={{ position: 'relative', width: '100%' }}>
                    <button
                      type="button"
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className="karyakarta-input"
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        minHeight: '42px',
                        fontSize: '13.5px',
                        fontWeight: '700',
                        color: '#0f172a',
                        background: '#ffffff',
                        border: isCategoryOpen ? '1.5px solid #ea580c' : '1.5px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        boxShadow: 'none'
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {CATEGORY_OPTIONS.find(o => o.value === (profileData.category || 'OPEN'))?.label || profileData.category}
                      </span>
                      <ChevronDown
                        size={16}
                        color="#64748b"
                        style={{
                          transform: isCategoryOpen ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s ease',
                          flexShrink: 0,
                          marginLeft: '6px'
                        }}
                      />
                    </button>

                    {isCategoryOpen && (
                      <>
                        <div
                          style={{ position: 'fixed', inset: 0, zIndex: 90 }}
                          onClick={() => setIsCategoryOpen(false)}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 4px)',
                            left: 0,
                            width: '100%',
                            boxSizing: 'border-box',
                            background: '#ffffff',
                            border: '1.5px solid #ea580c',
                            borderRadius: '10px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                            zIndex: 100,
                            overflow: 'hidden',
                            maxHeight: '260px',
                            overflowY: 'auto'
                          }}
                        >
                          {CATEGORY_OPTIONS.map((opt) => {
                            const isSelected = (profileData.category || 'OPEN') === opt.value;
                            return (
                              <div
                                key={opt.value}
                                onClick={() => {
                                  handleProfileChange({ target: { name: 'category', value: opt.value } });
                                  setIsCategoryOpen(false);
                                }}
                                style={{
                                  padding: '10px 14px',
                                  fontSize: '13px',
                                  fontWeight: isSelected ? '800' : '600',
                                  color: isSelected ? '#ffffff' : '#1e293b',
                                  background: isSelected ? '#ea580c' : '#ffffff',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  borderBottom: '1px solid #f1f5f9',
                                  transition: 'background 0.15s ease'
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSelected) e.currentTarget.style.background = '#fff7ed';
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSelected) e.currentTarget.style.background = '#ffffff';
                                }}
                              >
                                <span>{opt.label}</span>
                                {isSelected && <Check size={16} color="#ffffff" />}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', fontWeight: '750', color: '#0f172a', padding: '6px 0' }}>
                    {profileData.category || (isMr ? 'नोंद बाकी (Pending)' : 'Not set')}
                  </div>
                )}
              </div>
            </div>

            {/* DOB & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
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
                    {profileData.dob ? new Date(profileData.dob).toLocaleDateString() : (isMr ? 'नोंद बाकी (Pending)' : 'Not set')}
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {t('phoneNumber')} *
                </label>
                {isEditingProfile ? (
                  <div>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        name="phone"
                        className="karyakarta-input"
                        value={profileData.phone || user?.phone || ''}
                        disabled
                        readOnly
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          background: '#f8fafc',
                          color: '#475569',
                          cursor: 'not-allowed',
                          border: '1.5px solid #e2e8f0',
                          paddingRight: '36px',
                          fontWeight: '750',
                          borderRadius: '8px',
                          minHeight: '42px'
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '13px',
                          color: '#64748b'
                        }}
                        title={isMr ? 'नोंदणीकृत व सत्यापित मोबाईल (बदल करता येणार नाही)' : 'Registered & verified mobile'}
                      >
                        🔒
                      </span>
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Lock size={10} color="#64748b" />
                      <span>{isMr ? 'सत्यापित मोबाईल नंबर बदलता येत नाही.' : 'Verified phone cannot be changed.'}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', color: '#0f172a', padding: '6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="#16a34a" />
                    <span style={{ fontWeight: '700' }}>{profileData.phone || user?.phone || '-'}</span>
                    <span style={{ fontSize: '10.5px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '1px 6px', borderRadius: '6px', fontWeight: '700' }}>
                      {isMr ? 'सत्यापित' : 'Verified'}
                    </span>
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
                <div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      name="email"
                      className="karyakarta-input"
                      value={profileData.email || user?.email || ''}
                      disabled
                      readOnly
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        background: '#f8fafc',
                        color: '#475569',
                        cursor: 'not-allowed',
                        border: '1.5px solid #e2e8f0',
                        paddingRight: '36px',
                        fontWeight: '750',
                        borderRadius: '8px',
                        minHeight: '42px'
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '13px',
                        color: '#64748b'
                      }}
                      title={isMr ? 'नोंदणीकृत खाते ईमेल (बदल करता येणार नाही)' : 'Registered account email'}
                    >
                      🔒
                    </span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Lock size={10} color="#64748b" />
                    <span>{isMr ? 'नोंदणीकृत ईमेल आयडी बदलता येत नाही.' : 'Registered email cannot be changed.'}</span>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '13px', color: '#0f172a', padding: '6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} color="#2563eb" />
                  <span>{profileData.email || user?.email || '-'}</span>
                  <span style={{ fontSize: '10.5px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '1px 6px', borderRadius: '6px', fontWeight: '700' }}>
                    {isMr ? 'नोंदणीकृत' : 'Registered'}
                  </span>
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
                  {profileData.address || (isMr ? 'पत्ता नोंद बाकी (Pending)' : 'Address not set')}
                </div>
              )}
            </div>

            {/* Aadhar & PAN */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
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
                    {profileData.aadharNumber ? ('•••• •••• ' + String(profileData.aadharNumber).slice(-4)) : '-'}
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
                    {profileData.panNumber ? ('•••••••' + String(profileData.panNumber).slice(-3)) : '-'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Political Territory & Official Booth Assignment (ADMIN ONLY ALLOCATION) */}
        <div
          className="karyakarta-card"
          style={{
            background: '#fffbeb',
            border: '1.5px solid #fde68a',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.07)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div className="karyakarta-card-header" style={{ borderBottom: '1px solid #fde68a', paddingBottom: '12px' }}>
            <span className="karyakarta-card-title">
              <Shield size={18} color="#d97706" />
              <span>{isMr ? 'राजकीय व निवडणूक कार्यक्षेत्र तपशील' : 'Political & Booth Assignment'}</span>
            </span>
            <span style={{ fontSize: '11px', background: hasAssignedTerritory ? '#fff7ed' : '#fffbeb', color: hasAssignedTerritory ? '#ea580c' : '#b45309', padding: '3px 10px', borderRadius: '10px', fontWeight: '800', border: hasAssignedTerritory ? '1px solid #fed7aa' : '1px solid #fde68a' }}>
              {hasAssignedTerritory ? (isMr ? '🔒 ॲडमिन मान्यताप्राप्त' : '🔒 Admin Assigned') : (isMr ? '⏳ कार्यवाटप प्रलंबित' : '⏳ Pending Allocation')}
            </span>
          </div>

          {!hasAssignedTerritory ? (
            <div
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: '1.5px dashed #f59e0b',
                borderRadius: '14px',
                padding: '28px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                margin: '8px 0'
              }}
            >
              <div style={{ fontSize: '38px', lineHeight: 1 }}>📋⏳</div>
              <div style={{ fontSize: '15.5px', fontWeight: '800', color: '#92400e' }}>
                {isMr
                  ? 'अद्याप कोणतेही राजकीय कार्यक्षेत्र किंवा काम नियुक्त (Assign) केलेले नाही.'
                  : 'No political territory or duties assigned yet.'}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#b45309' }}>
                {isMr
                  ? '🔒 हा तपशील केवळ मुख्य ॲडमिनिस्ट्रेटर (Admin) कडून नियुक्त केला जातो.'
                  : '🔒 This territory is allocated strictly by the Administrator.'}
              </div>
              <div style={{ fontSize: '12px', color: '#78350f', maxWidth: '440px', lineHeight: 1.5, background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                {isMr
                  ? 'निवडणूक ॲडमिनद्वारे प्रभाग, बूथ, मतदारसंघ व जबाबदारी वाटप केल्यानंतर हा तपशील येथे आपोआप दिसेल. वापरकर्ता स्वतः यामध्ये बदल करू शकत नाही.'
                  : 'Once the election administrator assigns your ward, booths, and role in the database, it will appear here automatically. Users cannot modify this section.'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Notice that this is strictly Admin-managed */}
              <div style={{ fontSize: '11.5px', color: '#92400e', background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={13} color="#ea580c" />
                <span>{isMr ? 'हा तपशील अधिकृत ॲडमिनिस्ट्रेटरद्वारे सत्यापित व नियुक्त केलेला आहे.' : 'This territory is verified and officially assigned by Administrator.'}</span>
              </div>

              {/* Assembly & Lok Sabha */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#78350f', display: 'block', marginBottom: '2px' }}>
                    {isMr ? 'विधानसभा' : 'Assembly'}
                  </label>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', padding: '4px 0' }}>
                    🏛️ {profileData.assembly || (isMr ? 'नियुक्त नाही' : 'Not assigned')}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#78350f', display: 'block', marginBottom: '2px' }}>
                    {isMr ? 'लोकसभा' : 'Lok Sabha'}
                  </label>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', padding: '4px 0' }}>
                    🌐 {profileData.lokSabha || (isMr ? 'नियुक्त नाही' : 'Not assigned')}
                  </div>
                </div>
              </div>

              {/* Assigned Ward */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#78350f', display: 'block', marginBottom: '2px' }}>
                  {t('assignedWard')}
                </label>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', padding: '4px 0' }}>
                  📍 {displayWard}
                </div>
              </div>

              {/* Primary Booths */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#78350f', display: 'block', marginBottom: '2px' }}>
                  {t('primaryBooths')}
                </label>
                <div style={{ fontSize: '13.5px', fontWeight: '750', color: '#0f172a', padding: '4px 0' }}>
                  🗳️ {displayBooths}
                </div>
              </div>

              {/* EPIC & Join Date */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#78350f', display: 'block', marginBottom: '2px' }}>
                    {t('epic')}
                  </label>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', fontFamily: 'monospace', padding: '4px 0' }}>
                    🪪 {displayEpic}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#78350f', display: 'block', marginBottom: '2px' }}>
                    {t('joinDate')}
                  </label>
                  <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '700', padding: '4px 0' }}>
                    📅 {profileData.joinDate ? new Date(profileData.joinDate).toLocaleDateString() : (isMr ? 'उपलब्ध नाही' : 'Not available')}
                  </div>
                </div>
              </div>

              {/* Responsibility Description */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#78350f', display: 'block', marginBottom: '2px' }}>
                  {isMr ? 'अधिकारी जबाबदारी / पदभार' : 'Responsibility'}
                </label>
                <div style={{ fontSize: '13.5px', color: '#ea580c', padding: '4px 0', fontWeight: '800' }}>
                  🎯 {displayRole}
                </div>
              </div>

              {/* State & District */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#78350f', display: 'block', marginBottom: '2px' }}>
                    {isMr ? 'जिल्हा' : 'District'}
                  </label>
                  <div style={{ fontSize: '13px', fontWeight: '750', color: '#0f172a', padding: '4px 0' }}>
                    {profileData.district || 'सांगली (Sangli)'}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#78350f', display: 'block', marginBottom: '2px' }}>
                    {isMr ? 'राज्य' : 'State'}
                  </label>
                  <div style={{ fontSize: '13px', fontWeight: '750', color: '#0f172a', padding: '6px 0' }}>
                    {profileData.state || 'महाराष्ट्र (Maharashtra)'}
                  </div>
                </div>
              </div>
            </div>
          )}

            {/* Security Action Bar (Responsive Button) */}
            <div
              style={{
                borderTop: '1px solid #fde68a',
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

      {/* Official Identity Card Modal */}
      <UserIdCardModal
        isOpen={showIdCardModal}
        onClose={() => setShowIdCardModal(false)}
        user={{
          name: displayName,
          id_code: profileData.employeeCode || user?.id_code,
          phone: profileData.phone || user?.phone,
          dob: profileData.dob || user?.dob,
          address: profileData.address || user?.address,
          photo_url: profilePhoto,
          role: displayRole,
        }}
        isMr={isMr}
      />
    </div>
  );
}
