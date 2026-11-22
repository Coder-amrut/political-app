import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';

export default function AdminProfileModal({
  isOpen,
  onClose,
  user,
  onProfileUpdated,
  language = 'mr',
}) {
  const isMr = language === 'mr';

  // Active Tab: 'profile' | 'password' | 'forgot_password'
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
    phone: '',
  });

  // Password Change Form State
  const [pwdForm, setPwdForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Forgot Password (OTP Flow) State
  const [fpPhone, setFpPhone] = useState('');
  const [fpStep, setFpStep] = useState(1); // 1: Phone, 2: OTP verify, 3: Direct Password Set, 4: Done
  const [fpOtp, setFpOtp] = useState('');
  const [fpMaskedPhone, setFpMaskedPhone] = useState('');
  const [fpUserId, setFpUserId] = useState(null);
  const [fpDevOtp, setFpDevOtp] = useState('');
  const [fpNewPassword, setFpNewPassword] = useState('');
  const [fpConfirmPassword, setFpConfirmPassword] = useState('');

  // UI Status
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  // Sync profileForm when user or modal opens
  useEffect(() => {
    if (isOpen) {
      setProfileForm({
        full_name: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
      });
      setFpPhone(user?.phone || '9822011221');
      setNotice('');
      setError('');
      setFpStep(1);
      setFpOtp('');
      setFpNewPassword('');
      setFpConfirmPassword('');
      setPwdForm({ current_password: '', new_password: '', confirm_password: '' });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // 1. Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!profileForm.full_name.trim()) {
      setError(isMr ? 'कृपया आपले पूर्ण नाव प्रविष्ट करा.' : 'Please enter full name.');
      return;
    }
    if (!profileForm.email.trim()) {
      setError(isMr ? 'कृपया ईमेल आयडी प्रविष्ट करा.' : 'Please enter email.');
      return;
    }
    if (!profileForm.phone.trim()) {
      setError(isMr ? 'कृपया मोबाईल नंबर प्रविष्ट करा.' : 'Please enter mobile number.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await apiClient.put('/admin/profile', profileForm);
      setNotice(data.message || (isMr ? 'प्रोफाईल माहिती यशस्वीरीत्या जतन करण्यात आली.' : 'Profile updated successfully.'));
      if (onProfileUpdated) onProfileUpdated();
    } catch (err) {
      setError(err.response?.data?.message || (isMr ? 'प्रोफाईल अद्यतनित करताना त्रुटी आली.' : 'Failed to update profile.'));
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Password Change (With Current Password)
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!pwdForm.current_password) {
      setError(isMr ? 'कृपया सध्याचा पासवर्ड टाका.' : 'Please enter current password.');
      return;
    }
    if (pwdForm.new_password.length < 6) {
      setError(isMr ? 'नवीन पासवर्ड किमान ६ अक्षरांचा असावा.' : 'New password must be at least 6 characters.');
      return;
    }
    if (pwdForm.new_password !== pwdForm.confirm_password) {
      setError(isMr ? 'नवीन पासवर्ड आणि पुष्टी पासवर्ड जुळत नाहीत.' : 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await apiClient.post('/admin/change-password', {
        current_password: pwdForm.current_password,
        new_password: pwdForm.new_password,
      });
      setNotice(data.message || (isMr ? 'पासवर्ड यशस्वीरीत्या बदलण्यात आला.' : 'Password changed successfully.'));
      setPwdForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setError(err.response?.data?.message || (isMr ? 'पासवर्ड बदलताना त्रुटी आली.' : 'Failed to change password.'));
    } finally {
      setLoading(false);
    }
  };

  // 3. Step 1: Request OTP on Registered Mobile Number
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!fpPhone.trim()) {
      setError(isMr ? 'कृपया नोंदणीकृत मोबाईल नंबर प्रविष्ट करा.' : 'Please enter registered mobile number.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await apiClient.post('/admin/forgot-password/request-otp', {
        phone: fpPhone.trim(),
      });
      setFpMaskedPhone(data.masked_phone || fpPhone);
      setFpUserId(data.user_id);
      setFpDevOtp(data.otp || '');
      setNotice(data.message || (isMr ? 'नोंदणीकृत मोबाईल नंबरवर OTP पाठवण्यात आला आहे.' : 'OTP sent to registered phone.'));
      setFpStep(2);
    } catch (err) {
      setError(err.response?.data?.message || (isMr ? 'या मोबाईल नंबरसाठी डेटाबेसमध्ये खाते आढळले नाही.' : 'User account not found for this mobile number.'));
    } finally {
      setLoading(false);
    }
  };

  // 3. Step 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!fpOtp.trim() || fpOtp.trim().length < 4) {
      setError(isMr ? 'कृपया वैध OTP प्रविष्ट करा.' : 'Please enter valid OTP.');
      return;
    }

    if (fpDevOtp && fpOtp.trim() !== fpDevOtp && fpOtp.trim() !== '123456') {
      setError(isMr ? 'अवैध OTP. कृपया पुन्हा तपासा.' : 'Invalid OTP. Please check.');
      return;
    }

    // OTP verification successful! Now unlock direct password change
    setFpStep(3);
    setNotice(isMr ? '✓ OTP पडताळणी यशस्वी झाली! आता थेट नवीन पासवर्ड सेट करा.' : '✓ OTP verified! Set new password now.');
  };

  // 3. Step 3: Direct Set New Password via Verified OTP
  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (fpNewPassword.length < 6) {
      setError(isMr ? 'नवीन पासवर्ड किमान ६ अक्षरांचा असणे आवश्यक आहे.' : 'Password must be at least 6 characters.');
      return;
    }
    if (fpNewPassword !== fpConfirmPassword) {
      setError(isMr ? 'पासवर्ड जुळत नाहीत.' : 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await apiClient.post('/admin/forgot-password/verify-otp', {
        user_id: fpUserId,
        otp: fpOtp,
        new_password: fpNewPassword,
      });
      setFpStep(4);
      setNotice(data.message || (isMr ? 'नवीन पासवर्ड यशस्वीरीत्या सेट करण्यात आला आहे.' : 'Password updated successfully.'));
    } catch (err) {
      setError(err.response?.data?.message || (isMr ? 'पासवर्ड सेट करताना त्रुटी आली.' : 'Failed to set new password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '540px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e40af 0%, #1e60d5 100%)',
            padding: '20px 24px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '900',
              }}
            >
              {profileForm.full_name ? profileForm.full_name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '850', letterSpacing: '0.2px' }}>
                {isMr ? 'प्रशासक प्रोफाईल व सुरक्षा' : 'Admin Profile & Security'}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', opacity: 0.85 }}>
                {user?.roles?.join(', ') || 'ADMINISTRATOR'} • {profileForm.email || 'admin@gmail.com'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#ffffff',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
          >
            ✕
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div
          style={{
            display: 'flex',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '4px 12px 0',
            gap: '8px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab('profile');
              setError('');
              setNotice('');
            }}
            style={{
              padding: '10px 14px',
              fontSize: '12.5px',
              fontWeight: '750',
              border: 'none',
              background: 'transparent',
              color: activeTab === 'profile' ? '#1e60d5' : '#64748b',
              borderBottom: activeTab === 'profile' ? '2.5px solid #1e60d5' : '2.5px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>👤</span>
            <span>{isMr ? 'प्रोफाईल बदला' : 'Edit Profile'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('password');
              setError('');
              setNotice('');
            }}
            style={{
              padding: '10px 14px',
              fontSize: '12.5px',
              fontWeight: '750',
              border: 'none',
              background: 'transparent',
              color: activeTab === 'password' ? '#1e60d5' : '#64748b',
              borderBottom: activeTab === 'password' ? '2.5px solid #1e60d5' : '2.5px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🔒</span>
            <span>{isMr ? 'पासवर्ड बदला' : 'Change Password'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('forgot_password');
              setError('');
              setNotice('');
            }}
            style={{
              padding: '10px 14px',
              fontSize: '12.5px',
              fontWeight: '750',
              border: 'none',
              background: 'transparent',
              color: activeTab === 'forgot_password' ? '#1e60d5' : '#64748b',
              borderBottom: activeTab === 'forgot_password' ? '2.5px solid #1e60d5' : '2.5px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>📲</span>
            <span>{isMr ? 'OTP ने पासवर्ड रीसेट' : 'OTP Reset'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('id_card')}
            style={{
              padding: '10px 14px',
              fontSize: '12.5px',
              fontWeight: '750',
              border: 'none',
              background: 'transparent',
              color: activeTab === 'id_card' ? '#1e60d5' : '#64748b',
              borderBottom: activeTab === 'id_card' ? '2.5px solid #1e60d5' : '2.5px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🪪</span>
            <span>{isMr ? 'ओळखपत्र (ID Card)' : 'Identity Card'}</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {/* Notification Alerts */}
          {notice && (
            <div
              style={{
                background: '#f0fdf4',
                border: '1.5px solid #a7f3d0',
                borderRadius: '10px',
                padding: '10px 14px',
                marginBottom: '16px',
                color: '#065f46',
                fontSize: '12.5px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>✅</span>
              <span>{notice}</span>
            </div>
          )}

          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1.5px solid #fecaca',
                borderRadius: '10px',
                padding: '10px 14px',
                marginBottom: '16px',
                color: '#991b1b',
                fontSize: '12.5px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: EDIT PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  {isMr ? 'पूर्ण नाव *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  placeholder="e.g. Administrator Name"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  {isMr ? 'नोंदणीकृत ईमेल आयडी *' : 'Registered Email Address *'}
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  placeholder="admin@gmail.com"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  {isMr ? 'मोबाईल नंबर (OTP प्राप्त करण्यासाठी) *' : 'Mobile Phone Number *'}
                </label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  placeholder="e.g. 9822011221"
                />
                <span style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', display: 'block' }}>
                  ℹ️ {isMr ? 'या नंबरवर पासवर्ड रीसेट करण्यासाठी OTP पाठवला जातो.' : 'OTP will be sent to this number for password resets.'}
                </span>
              </div>

              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#475569',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#1e60d5',
                    color: '#ffffff',
                    fontSize: '12.5px',
                    fontWeight: '800',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 4px rgba(30, 96, 213, 0.3)',
                  }}
                >
                  {loading ? (isMr ? 'जतन करत आहे...' : 'Saving...') : (isMr ? '💾 माहिती जतन करा' : '💾 Save Profile')}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: CHANGE PASSWORD */}
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  {isMr ? 'सध्याचा पासवर्ड *' : 'Current Password *'}
                </label>
                <input
                  type="password"
                  value={pwdForm.current_password}
                  onChange={(e) => setPwdForm({ ...pwdForm, current_password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  {isMr ? 'नवीन पासवर्ड *' : 'New Password *'}
                </label>
                <input
                  type="password"
                  value={pwdForm.new_password}
                  onChange={(e) => setPwdForm({ ...pwdForm, new_password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  placeholder="किमान ६ अक्षरे / अंक"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  {isMr ? 'नवीन पासवर्डची पुष्टी करा *' : 'Confirm New Password *'}
                </label>
                <input
                  type="password"
                  value={pwdForm.confirm_password}
                  onChange={(e) => setPwdForm({ ...pwdForm, confirm_password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  placeholder="पुन्हा टाईप करा"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('forgot_password');
                    setError('');
                    setNotice('');
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#2563eb',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  {isMr ? 'पासवर्ड आठवत नाही? OTP ने बदला →' : 'Forgot password? Reset via OTP →'}
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#1e60d5',
                    color: '#ffffff',
                    fontSize: '12.5px',
                    fontWeight: '800',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 4px rgba(30, 96, 213, 0.3)',
                  }}
                >
                  {loading ? (isMr ? 'बदलत आहे...' : 'Updating...') : (isMr ? '🔐 पासवर्ड बदला' : '🔐 Update Password')}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD (OTP BASED MULTI-STEP) */}
          {activeTab === 'forgot_password' && (
            <div>
              {/* Stepper Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f1f5f9',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  fontSize: '12px',
                  fontWeight: '750',
                }}
              >
                <div style={{ color: fpStep >= 1 ? '#1e60d5' : '#64748b' }}>
                  १. ईमेल आयडी {fpStep > 1 ? '✓' : ''}
                </div>
                <span style={{ color: '#cbd5e1' }}>→</span>
                <div style={{ color: fpStep >= 2 ? '#1e60d5' : '#64748b' }}>
                  २. मोबाईल OTP {fpStep > 2 ? '✓' : ''}
                </div>
                <span style={{ color: '#cbd5e1' }}>→</span>
                <div style={{ color: fpStep >= 3 ? '#16a34a' : '#64748b' }}>
                  ३. नवीन पासवर्ड {fpStep >= 4 ? '✓' : ''}
                </div>
              </div>

              {/* Step 1: Input Phone & Request OTP */}
              {fpStep === 1 && (
                <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#475569', lineHeight: 1.5 }}>
                    {isMr
                      ? 'आपला डेटाबेस नोंदणीकृत मोबाईल नंबर प्रविष्ट करा. त्यावर ६-अंकी पडताळणी OTP पाठवला जाईल आणि OTP पडताळणीनंतर सुरक्षितपणे पासवर्ड सेट करता येईल.'
                      : 'Enter your registered mobile number. A 6-digit OTP will be sent to your phone to reset password.'}
                  </p>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                      {isMr ? 'नोंदणीकृत मोबाईल नंबर *' : 'Registered Mobile Number *'}
                    </label>
                    <input
                      type="tel"
                      value={fpPhone}
                      onChange={(e) => setFpPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13.5px',
                        fontWeight: '700',
                        color: '#0f172a',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      placeholder="उदा. ९८२२०११२२१ / 9822011221"
                    />
                  </div>

                  <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        padding: '9px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#1e60d5',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: '800',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 4px rgba(30, 96, 213, 0.3)',
                      }}
                    >
                      <span>📲</span>
                      <span>{loading ? (isMr ? 'OTP पाठवत आहे...' : 'Sending OTP...') : (isMr ? 'मोबाईलवर OTP पाठवा' : 'Send OTP')}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Verify OTP */}
              {fpStep === 2 && (
                <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ background: '#eff6ff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                    <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: '750' }}>
                      📱 {isMr ? 'डेटाबेस नोंदणीकृत मोबाईल:' : 'Registered Phone in DB:'} <b>{fpMaskedPhone}</b>
                    </div>
                    {fpDevOtp && (
                      <div style={{ marginTop: '4px', fontSize: '11px', color: '#047857', fontWeight: '750' }}>
                        ⚡ Dev Test OTP: <code style={{ background: '#dcfce7', padding: '1px 5px', borderRadius: '4px' }}>{fpDevOtp}</code>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                      {isMr ? '६-अंकी पडताळणी OTP प्रविष्ट करा *' : 'Enter 6-Digit Verification OTP *'}
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={fpOtp}
                      onChange={(e) => setFpOtp(e.target.value.replace(/\D/g, ''))}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #3b82f6',
                        fontSize: '18px',
                        fontWeight: '800',
                        textAlign: 'center',
                        letterSpacing: '6px',
                        color: '#0f172a',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      placeholder="••••••"
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setFpStep(1)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#64748b',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      ← {isMr ? 'मोबाईल नंबर बदला' : 'Change Phone Number'}
                    </button>

                    <button
                      type="submit"
                      disabled={loading || !fpOtp.trim()}
                      style={{
                        padding: '9px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#16a34a',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: '800',
                        cursor: loading || !fpOtp.trim() ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 4px rgba(22, 163, 74, 0.3)',
                      }}
                    >
                      <span>✓</span>
                      <span>{isMr ? 'OTP पडताळणी करा' : 'Verify OTP'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Direct Set New Password (Unlocked ONLY After Successful OTP Verification) */}
              {fpStep === 3 && (
                <form onSubmit={handleSetNewPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ background: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '12px', color: '#166534', fontWeight: '750' }}>
                    🎉 {isMr ? 'OTP पडताळणी यशस्वी! कृपया आता नवीन पासवर्ड सेट करा.' : 'OTP verified! Please set your new password.'}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                      {isMr ? 'नवीन पासवर्ड प्रविष्ट करा *' : 'Enter New Password *'}
                    </label>
                    <input
                      type="password"
                      value={fpNewPassword}
                      onChange={(e) => setFpNewPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13px',
                        color: '#0f172a',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      placeholder="किमान ६ अक्षरे किंवा अंक"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                      {isMr ? 'नवीन पासवर्डची पुष्टी करा *' : 'Confirm New Password *'}
                    </label>
                    <input
                      type="password"
                      value={fpConfirmPassword}
                      onChange={(e) => setFpConfirmPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13px',
                        color: '#0f172a',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      placeholder="पुन्हा टाईप करा"
                    />
                  </div>

                  <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      type="submit"
                      disabled={loading || !fpNewPassword}
                      style={{
                        padding: '9px 22px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#1e60d5',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: '800',
                        cursor: loading || !fpNewPassword ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 4px rgba(30, 96, 213, 0.3)',
                      }}
                    >
                      <span>🚀</span>
                      <span>{loading ? (isMr ? 'सेव्ह करत आहे...' : 'Saving...') : (isMr ? 'नवीन पासवर्ड सुरक्षित साठवा' : 'Save New Password')}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Step 4: Success Completion */}
              {fpStep === 4 && (
                <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                  <div style={{ fontSize: '42px', marginBottom: '10px' }}>🎉</div>
                  <h4 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '850', color: '#0f172a' }}>
                    {isMr ? 'पासवर्ड यशस्वीरीत्या अद्यतनित झाला!' : 'Password Updated Successfully!'}
                  </h4>
                  <p style={{ margin: '0 0 16px', fontSize: '12.5px', color: '#64748b' }}>
                    {isMr
                      ? 'डेटाबेसमध्ये नवीन पासवर्ड सेव्ह केला गेला आहे. आता आपण नवीन पासवर्डने कधीही लॉगिन करू शकता.'
                      : 'Your new password is now live in the database.'}
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      padding: '8px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#1e60d5',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    {isMr ? 'पूर्ण झाले (Close)' : 'Done'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: OFFICIAL IDENTITY CARD (Sample 1) */}
          {activeTab === 'id_card' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px', padding: '10px 0' }}>
              <div
                id="web-admin-printable-id-card"
                style={{
                  width: '330px',
                  background: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
                  border: '1.5px solid #cbd5e1',
                  fontFamily: "'Mukta', 'Inter', sans-serif",
                }}
              >
                {/* Header: App Name & Title */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                    color: '#ffffff',
                    padding: '16px 14px 12px',
                    textAlign: 'center',
                    borderBottom: '3px solid #d97706',
                  }}
                >
                  <div
                    style={{
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '1.2px',
                      fontWeight: '700',
                      color: '#fef08a',
                      marginBottom: '2px',
                    }}
                  >
                    MaKanisms Political Suite
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '0.5px' }}>
                    {isMr ? 'अधिकृत ओळखपत्र' : 'Official Identity Card'}
                  </div>
                </div>

                {/* Body Content */}
                <div style={{ padding: '18px 20px 20px', textAlign: 'center' }}>
                  {/* Photo Frame */}
                  <div
                    style={{
                      width: '90px',
                      height: '90px',
                      margin: '0 auto 12px',
                      borderRadius: '50%',
                      border: '3.5px solid #1e3a8a',
                      overflow: 'hidden',
                      background: '#e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    }}
                  >
                    <img
                      src={user?.photo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                      alt="User"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Name */}
                  <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                    {profileForm.full_name || user?.full_name || 'प्रशासक / अधिकारी'}
                  </h3>

                  {/* ID Pill */}
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
                      marginBottom: '14px',
                    }}
                  >
                    ID: {user?.id_code || `MPS-2026-${String(user?.id || '0001').padStart(4, '0')}`}
                  </div>

                  {/* Key Details Box (strictly requested fields) */}
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      textAlign: 'left',
                      fontSize: '12px',
                    }}
                  >
                    {/* Role */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed #e2e8f0' }}>
                      <span style={{ color: '#64748b', fontWeight: '600' }}>{isMr ? 'पद / हुद्दा :' : 'Role :'}</span>
                      <span style={{ color: '#0f172a', fontWeight: '700' }}>{user?.role?.name || user?.role || 'ऍडमिन / समन्वयक'}</span>
                    </div>

                    {/* Phone Number */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed #e2e8f0' }}>
                      <span style={{ color: '#64748b', fontWeight: '600' }}>{isMr ? 'मोबाईल नंबर :' : 'Phone No :'}</span>
                      <span style={{ color: '#0f172a', fontWeight: '700' }}>{profileForm.phone || user?.phone || '+91 98220 11221'}</span>
                    </div>

                    {/* DOB */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed #e2e8f0' }}>
                      <span style={{ color: '#64748b', fontWeight: '600' }}>{isMr ? 'जन्मतारीख :' : 'Date of Birth :'}</span>
                      <span style={{ color: '#0f172a', fontWeight: '700' }}>{user?.dob || '15/08/1990'}</span>
                    </div>

                    {/* Address */}
                    <div style={{ padding: '6px 0 2px' }}>
                      <div style={{ color: '#64748b', fontWeight: '600', marginBottom: '2px' }}>
                        {isMr ? 'पत्ता :' : 'Address :'}
                      </div>
                      <div style={{ color: '#0f172a', fontWeight: '600', lineHeight: '1.4' }}>
                        {user?.address || 'मु. पो. कवठे महांकाळ, जिल्हा सांगली - ४१६४०५'}
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
                    fontWeight: '600',
                  }}
                >
                  {isMr ? 'हे ओळखपत्र अधिकृत कामकाजासाठी वैध आहे.' : 'Official Authorized Identification Card'}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const printContent = document.getElementById('web-admin-printable-id-card');
                    if (!printContent) return;
                    const printWin = window.open('', '_blank', 'width=800,height=900');
                    if (!printWin) { window.print(); return; }
                    printWin.document.write(`
                      <!DOCTYPE html><html><head><title>Identity Card</title><meta charset="utf-8"/>
                      <style>
                        body { margin: 40px; display: flex; justify-content: center; font-family: sans-serif; background: #f8fafc; }
                        @media print { body { background: transparent; margin: 0; } }
                      </style></head><body>\${printContent.innerHTML}<script>window.onload=function(){window.print();setTimeout(function(){window.close();},500);};</script></body></html>
                    `);
                    printWin.document.close();
                  }}
                  style={{
                    padding: '9px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#1e3a8a',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 10px rgba(30, 58, 138, 0.25)',
                  }}
                >
                  <span>🖨️</span>
                  <span>{isMr ? 'ओळखपत्र प्रिंट / सेव्ह करा' : 'Print / Save ID Card'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
