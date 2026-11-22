import React, { useState, useEffect, useMemo, useRef } from 'react';
import apiClient from '../../api/axios';

// Tab configuration starting from Booth hierarchy
const HIERARCHY_TABS = [
  { id: 'booth_karyakarta', label_mr: '१. बूथ कार्यकर्ता', label_en: '1. Booth Karyakarta', icon: '👤', color: '#2563eb' },
  { id: 'booth_pramukh', label_mr: '२. बूथ प्रमुख', label_en: '2. Booth Pramukh', icon: '🎖️', color: '#16a34a' },
  { id: 'booth_area_pramukh', label_mr: '३. बूथ एरिया प्रमुख', label_en: '3. Booth Area Pramukh', icon: '📍', color: '#d97706' },
  { id: 'taluka_pramukh', label_mr: '४. तालुका प्रमुख', label_en: '4. Taluka Pramukh', icon: '🏛️', color: '#9333ea' },
  { id: 'jilha_pramukh', label_mr: '५. जिल्हा प्रमुख', label_en: '5. Jilha Pramukh', icon: '👑', color: '#dc2626' },
  { id: 'vibhag_pramukh', label_mr: '६. विभाग प्रमुख', label_en: '6. Vibhag Pramukh', icon: '⭐', color: '#0891b2' },
  { id: 'add_more', label_mr: '➕ अजून जोडा (सर्व निवडणुका)', label_en: '+ Add More (All Elections)', icon: '🗳️', color: '#4f46e5' },
];

export default function ElectionPrabhariManager({ isMr = true, lang = 'mr' }) {
  const [activeTab, setActiveTab] = useState('booth_karyakarta');
  const [prabharis, setPrabharis] = useState([]);
  const [elections, setElections] = useState([]);
  const [boothsList, setBoothsList] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // 3-Dot Corner Dropdown State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // User Autocomplete Combobox State
  const [userSearchText, setUserSearchText] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [selectedAppUser, setSelectedAppUser] = useState(null);
  const [userValidationError, setUserValidationError] = useState('');
  const userComboboxRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp_number: '',
    role_type: 'booth_karyakarta',
    election_id: 1,
    election_name: '२८२ - सांगली विधानसभा निवडणूक २०२६',
    district: 'सांगली',
    taluka: 'मिरज',
    village: '',
    booth_no: '१',
    booth_name: '',
    area_name: '',
    assigned_voters_target: 500,
    status: 'active',
    responsibilities: '',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Close 3-Dot menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
      if (userComboboxRef.current && !userComboboxRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. Fetch Prabharis from DB
  const fetchPrabharis = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeTab !== 'add_more' && activeTab !== 'all') {
        params.role_type = activeTab;
      }
      if (searchQuery) params.search = searchQuery;

      const res = await apiClient.get('/election-prabharis', { params });
      if (res.data?.success) {
        setPrabharis(res.data.data || []);
        if (res.data.counts) setCounts(res.data.counts);
      }
    } catch (err) {
      console.error('Failed to load election prabharis:', err);
      showToast(isMr ? 'डेटा लोड करताना एरर आली.' : 'Failed to load prabharis.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Elections List from DB
  const fetchElections = async () => {
    try {
      const res = await apiClient.get('/elections-list');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setElections(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load elections:', err);
    }
  };

  // 3. Fetch Polling Booths from DB
  const fetchBooths = async () => {
    try {
      const res = await apiClient.get('/booths');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setBoothsList(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load booths:', err);
    }
  };

  // 4. Fetch Registered App Users from DB
  const fetchRegisteredUsers = async () => {
    try {
      const res = await apiClient.get('/app-registered-users');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setRegisteredUsers(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load registered app users:', err);
    }
  };

  useEffect(() => {
    fetchElections();
    fetchBooths();
    fetchRegisteredUsers();
  }, []);

  useEffect(() => {
    fetchPrabharis();
  }, [activeTab]);

  // Filtered App Users for Dropdown Type-to-Search
  const filteredUsersList = useMemo(() => {
    if (!userSearchText.trim()) return registeredUsers;
    const q = userSearchText.toLowerCase();
    return registeredUsers.filter(
      (u) =>
        u.full_name?.toLowerCase().includes(q) ||
        u.phone?.includes(q) ||
        u.ward?.toLowerCase().includes(q) ||
        u.area?.toLowerCase().includes(q)
    );
  }, [registeredUsers, userSearchText]);

  // When a Registered User is selected from Combobox
  const handleSelectUser = (u) => {
    setSelectedAppUser(u);
    setUserSearchText(u.full_name);
    setUserValidationError('');
    setIsUserDropdownOpen(false);

    // Auto-fill all user info into the form as requested
    setFormData((prev) => ({
      ...prev,
      name: u.full_name,
      phone: u.phone || prev.phone,
      whatsapp_number: u.phone || prev.whatsapp_number,
      village: u.ward || prev.village || 'माधवनगर',
      area_name: u.area || u.ward || prev.area_name || '',
      booth_no: u.booth ? u.booth.replace(/[^\d]/g, '').slice(0, 2) || '१' : prev.booth_no,
    }));
  };

  // Handle Form Submission (Create / Update)
  const handleSavePrabhari = async (e) => {
    e.preventDefault();

    // STRICT CHECK: User must be registered on the app!
    const isRegistered = registeredUsers.some(
      (u) => u.full_name.trim().toLowerCase() === formData.name.trim().toLowerCase()
    );

    if (!isRegistered && !selectedAppUser && !editItem) {
      setUserValidationError(
        isMr
          ? '⚠️ हा युझर ॲपवर नोंदणीकृत नाही! केवळ ॲपवर नोंदणीकृत कार्यकर्त्याचीच निवड करता येईल.'
          : '⚠️ This user is not registered on the app! Only registered users can be appointed.'
      );
      showToast(isMr ? 'केवळ ॲप नोंदणीकृत युझरच निवडा!' : 'Only registered users can be appointed!');
      return;
    }

    if (!formData.name || !formData.phone) {
      showToast(isMr ? 'कृपया नाव आणि फोन नंबर टाका.' : 'Please enter name and phone.');
      return;
    }

    try {
      if (editItem) {
        await apiClient.put(`/election-prabharis/${editItem.id}`, formData);
        showToast(isMr ? 'प्रभारी माहिती अद्ययावत केली!' : 'Prabhari updated successfully!');
      } else {
        await apiClient.post('/election-prabharis', formData);
        showToast(isMr ? 'नवीन प्रभारी यशस्वीरीत्या नियुक्त केले!' : 'New Prabhari appointed!');
      }
      setShowAddModal(false);
      setEditItem(null);
      setSelectedAppUser(null);
      setUserSearchText('');
      fetchPrabharis();
    } catch (err) {
      console.error('Save failed:', err);
      showToast(isMr ? 'जतन करताना त्रुटी आली.' : 'Failed to save Prabhari.');
    }
  };

  // Handle Delete
  const handleDelete = async (id, name) => {
    if (!window.confirm(isMr ? `'${name}' यांची नोंद काढून टाकायची आहे का?` : `Delete record for '${name}'?`)) return;
    try {
      await apiClient.delete(`/election-prabharis/${id}`);
      showToast(isMr ? 'प्रभारी नोंद काढून टाकली.' : 'Prabhari record removed.');
      fetchPrabharis();
    } catch (err) {
      console.error('Delete failed:', err);
      showToast(isMr ? 'काढून टाकताना एरर आली.' : 'Failed to delete.');
    }
  };

  // Open Edit Modal
  const handleEdit = (item) => {
    setEditItem(item);
    setUserSearchText(item.name);
    setUserValidationError('');
    setFormData({
      name: item.name,
      phone: item.phone,
      whatsapp_number: item.whatsapp_number || item.phone,
      role_type: item.role_type,
      election_id: item.election_id || 1,
      election_name: item.election_name || '२८२ - सांगली विधानसभा निवडणूक २०२६',
      district: item.district || 'सांगली',
      taluka: item.taluka || '',
      village: item.village || '',
      booth_no: item.booth_no || '१',
      booth_name: item.booth_name || '',
      area_name: item.area_name || '',
      assigned_voters_target: item.assigned_voters_target || 500,
      status: item.status || 'active',
      responsibilities: item.responsibilities || '',
    });
    setShowAddModal(true);
  };

  // Open New Modal
  const handleOpenNewModal = (presetRole = null, presetElection = null) => {
    setEditItem(null);
    setSelectedAppUser(null);
    setUserSearchText('');
    setUserValidationError('');
    setFormData({
      name: '',
      phone: '',
      whatsapp_number: '',
      role_type: presetRole || (activeTab === 'add_more' ? 'booth_karyakarta' : activeTab),
      election_id: presetElection?.id || (elections[0]?.id || 1),
      election_name: presetElection?.name || (elections[0]?.name || '२८२ - सांगली विधानसभा निवडणूक २०२६'),
      district: 'सांगली',
      taluka: 'मिरज',
      village: 'माधवनगर',
      booth_no: '१',
      booth_name: boothsList[0]?.booth_name_mr || 'जिल्हा परिषद प्राथमिक शाळा, खोली क्र. १',
      area_name: '',
      assigned_voters_target: 500,
      status: 'active',
      responsibilities: '',
    });
    setShowAddModal(true);
  };

  // Filtered List for Display based on single search bar
  const displayedPrabharis = useMemo(() => {
    let list = prabharis;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.phone?.includes(q) ||
          p.village?.toLowerCase().includes(q) ||
          p.taluka?.toLowerCase().includes(q) ||
          p.district?.toLowerCase().includes(q) ||
          p.area_name?.toLowerCase().includes(q) ||
          p.booth_no?.includes(q)
      );
    }
    return list;
  }, [prabharis, searchQuery]);

  const activeTabConfig = HIERARCHY_TABS.find((t) => t.id === activeTab) || HIERARCHY_TABS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '40px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 10000,
            background: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '700',
            fontSize: '13.5px',
            border: '1px solid #3b82f6',
          }}
        >
          <span>ℹ️</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Clean Top Header with Corner 3-Dot Hierarchy Switcher */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '16px 22px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              boxShadow: '0 4px 12px rgba(30, 64, 175, 0.25)',
              flexShrink: 0,
            }}
          >
            🏛️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.3px' }}>
                {isMr ? 'निवडणूक प्रभारी' : 'Election Prabhari'}
              </h1>
              {/* Active Hierarchy Role Indicator Pill */}
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '800',
                  background: `${activeTabConfig.color}15`,
                  color: activeTabConfig.color,
                  border: `1px solid ${activeTabConfig.color}40`,
                  padding: '3px 10px',
                  borderRadius: '14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <span>{activeTabConfig.icon}</span>
                <span>{isMr ? activeTabConfig.label_mr : activeTabConfig.label_en}</span>
                {counts[activeTab] !== undefined && (
                  <span style={{ background: activeTabConfig.color, color: '#fff', padding: '1px 6px', borderRadius: '10px', fontSize: '10.5px' }}>
                    {counts[activeTab]}
                  </span>
                )}
              </span>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>
              {isMr
                ? 'बूथ ते विभाग स्तरावरील कार्यकर्त्यांची रचना व जबाबदारी व्यवस्थापन.'
                : 'Booth-to-Division organizational hierarchy and election assignments.'}
            </p>
          </div>
        </div>

        {/* Action Controls & Corner 3-Dot (⋮) Menu as requested in Screenshot 2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Appoint New Prabhari Button */}
          <button
            type="button"
            onClick={() => handleOpenNewModal()}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '9px 16px',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 3px 10px rgba(16, 185, 129, 0.3)',
            }}
          >
            <span>➕</span>
            <span>{isMr ? 'नवीन प्रभारी नियुक्त करा' : 'Appoint Prabhari'}</span>
          </button>

          {/* Corner 3-Dot (⋮) Hierarchy Switcher Menu */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen((prev) => !prev);
              }}
              title={isMr ? 'पद स्तर निवडा (3-Dot Menu)' : 'Choose Hierarchy Level'}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                border: isMenuOpen ? '2px solid #2563eb' : '1.5px solid #cbd5e1',
                background: isMenuOpen ? '#eff6ff' : '#ffffff',
                color: isMenuOpen ? '#2563eb' : '#1e293b',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: '900',
                lineHeight: 1,
                boxShadow: isMenuOpen ? '0 0 0 3px rgba(37,99,235,0.2)' : '0 1px 3px rgba(0,0,0,0.06)',
                transition: 'all 0.15s ease',
              }}
            >
              ⋮
            </button>

            {/* Mobile Touch Backdrop to safely close on tap outside */}
            {isMenuOpen && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 9998,
                  background: 'transparent',
                }}
              />
            )}

            {/* 3-Dot Dropdown Popover */}
            {isMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  width: '270px',
                  maxWidth: 'calc(100vw - 32px)',
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 14px 35px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.08)',
                  padding: '8px',
                  zIndex: 9999,
                  animation: 'fadeIn 0.15s ease-out',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ padding: '6px 10px 8px 10px', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f1f5f9' }}>
                  {isMr ? 'प्रभारी स्तर निवडा' : 'Select Prabhari Level'}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                  {HIERARCHY_TABS.map((tab) => {
                    const isSelected = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMenuOpen(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: isSelected ? `1.5px solid ${tab.color}` : '1px solid transparent',
                          background: isSelected ? `${tab.color}12` : 'transparent',
                          color: isSelected ? tab.color : '#334155',
                          fontSize: '13px',
                          fontWeight: isSelected ? '800' : '600',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseOver={(e) => {
                          if (!isSelected) e.currentTarget.style.background = '#f8fafc';
                        }}
                        onMouseOut={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '15px' }}>{tab.icon}</span>
                          <span>{isMr ? tab.label_mr : tab.label_en}</span>
                        </div>
                        {tab.id !== 'add_more' && counts[tab.id] !== undefined && (
                          <span
                            style={{
                              background: isSelected ? tab.color : '#e2e8f0',
                              color: isSelected ? '#ffffff' : '#475569',
                              fontSize: '11px',
                              padding: '1px 7px',
                              borderRadius: '10px',
                              fontWeight: '800',
                            }}
                          >
                            {counts[tab.id]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clean Single Modern Search Bar (Replacing Screenshot 3 as requested) */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '10px 16px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '17px', color: '#64748b' }}>🔍</span>
        <input
          type="text"
          placeholder={isMr ? 'नाव, फोन नंबर, गाव, तालुका किंवा बूथ क्रमांकाने शोधा...' : 'Search by name, phone, village, taluka, or booth number...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            color: '#0f172a',
            background: 'transparent',
          }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              color: '#64748b',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title={isMr ? 'साफ करा' : 'Clear'}
          >
            ✕
          </button>
        )}
        <div
          style={{
            fontSize: '12px',
            fontWeight: '800',
            background: '#f1f5f9',
            color: '#475569',
            padding: '4px 10px',
            borderRadius: '12px',
            whiteSpace: 'nowrap',
          }}
        >
          {isMr ? 'एकूण निकाल:' : 'Results:'} {displayedPrabharis.length}
        </div>
      </div>

      {/* TAB: Add More (All Elections in DB) */}
      {activeTab === 'add_more' ? (
        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '22px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                🗳️ {isMr ? 'डेटाबेसमधील सर्व निवडणुका' : 'All Elections in Database'}
              </h2>
              <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                {isMr
                  ? 'येथून तुम्ही विशिष्ट निवडणुकीसाठी नवीन प्रभारी स्तर किंवा थेट प्रभारी नेमू शकता.'
                  : 'Select an election to appoint dedicated campaign prabharis.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenNewModal()}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '9px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>➕</span>
              <span>{isMr ? 'या निवडणुकीसाठी प्रभारी जोडा' : 'Add Prabhari for Election'}</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {elections.map((ele) => (
              <div
                key={ele.id}
                style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '18px',
                  border: '1.5px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: ele.status === 'ACTIVE' || ele.status === 'LIVE' ? '#dcfce7' : '#f1f5f9',
                        color: ele.status === 'ACTIVE' || ele.status === 'LIVE' ? '#166534' : '#475569',
                      }}
                    >
                      ● {ele.status || 'ACTIVE'}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                      ID: #{ele.id}
                    </span>
                  </div>

                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                    {ele.name}
                  </h3>
                  <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '6px' }}>
                    प्रकार: <span style={{ fontWeight: '700', color: '#334155' }}>{ele.type || 'विधानसभा'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#2563eb' }}>
                    👥 {ele.prabhari_count || 0} {isMr ? 'प्रभारी नियुक्त' : 'Prabharis'}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenNewModal(null, ele)}
                    style={{
                      background: '#1e40af',
                      color: '#ffffff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    + {isMr ? 'प्रभारी जोडा' : 'Assign'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Members Data Table */
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>#</th>
                  <th style={{ padding: '12px 16px' }}>{isMr ? 'प्रभारी नाव व पद' : 'Name & Role'}</th>
                  <th style={{ padding: '12px 16px' }}>{isMr ? 'जिल्हा / तालुका' : 'District / Taluka'}</th>
                  <th style={{ padding: '12px 16px' }}>{isMr ? 'नियुक्त बूथ / कार्यक्षेत्र' : 'Assigned Booth / Area'}</th>
                  <th style={{ padding: '12px 16px' }}>{isMr ? 'संपर्क (कॉल / व्हॉट्सॲप)' : 'Contact'}</th>
                  <th style={{ padding: '12px 16px' }}>{isMr ? 'लक्षित मतदार' : 'Voters Target'}</th>
                  <th style={{ padding: '12px 16px' }}>{isMr ? 'स्थिती' : 'Status'}</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>{isMr ? 'कृती' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      ⏳ {isMr ? 'डेटाबेसवरून माहिती लोड होत आहे...' : 'Loading prabharis from database...'}
                    </td>
                  </tr>
                ) : displayedPrabharis.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      ℹ️ {isMr ? 'कोणतेही प्रभारी सापडले नाहीत.' : 'No prabharis found.'}
                    </td>
                  </tr>
                ) : (
                  displayedPrabharis.map((item, idx) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseOut={(e) => (e.currentTarget.style.background = '#ffffff')}
                    >
                      <td style={{ padding: '14px 16px', color: '#94a3b8', fontWeight: '700' }}>{idx + 1}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '14px' }}>{item.name}</div>
                        <span
                          style={{
                            display: 'inline-block',
                            marginTop: '2px',
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            fontWeight: '700',
                          }}
                        >
                          {item.role_title_mr || item.role_title_en}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: '700', color: '#334155' }}>📍 {item.district}</div>
                        <div style={{ fontSize: '11.5px', color: '#64748b' }}>{item.taluka || '—'}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {item.booth_no && item.booth_no !== 'सर्व' ? (
                          <div style={{ display: 'inline-block', background: '#f5f3ff', color: '#6d28d9', padding: '2px 8px', borderRadius: '6px', fontWeight: '800', fontSize: '11.5px' }}>
                            🗳️ बूथ क्र. {item.booth_no}
                          </div>
                        ) : (
                          <div style={{ display: 'inline-block', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontWeight: '800', fontSize: '11.5px' }}>
                            🏛️ संपूर्ण क्षेत्र
                          </div>
                        )}
                        <div style={{ fontSize: '12px', color: '#334155', fontWeight: '600', marginTop: '3px', maxWidth: '240px' }}>
                          {item.booth_name || item.area_name || item.village || '—'}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <a
                            href={`tel:${item.phone}`}
                            style={{
                              background: '#f1f5f9',
                              color: '#0f172a',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              textDecoration: 'none',
                              fontWeight: '700',
                              fontSize: '12px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            📞 {item.phone}
                          </a>
                          {item.whatsapp_number && (
                            <a
                              href={`https://wa.me/91${item.whatsapp_number.replace(/[^\d]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                background: '#dcfce7',
                                color: '#15803d',
                                padding: '5px 8px',
                                borderRadius: '6px',
                                textDecoration: 'none',
                                fontWeight: '800',
                                fontSize: '12px',
                              }}
                              title="WhatsApp"
                            >
                              💬
                            </a>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: '800', color: '#0f172a' }}>{item.assigned_voters_target || 500} मतदार</div>
                        <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>
                          {item.covered_voters || 0} संपर्कित ({Math.round(((item.covered_voters || 0) / (item.assigned_voters_target || 500)) * 100)}%)
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '800',
                            background: item.status === 'active' ? '#dcfce7' : item.status === 'training' ? '#fef3c7' : '#fee2e2',
                            color: item.status === 'active' ? '#166534' : item.status === 'training' ? '#92400e' : '#991b1b',
                          }}
                        >
                          ● {item.status === 'active' ? (isMr ? 'सक्रिय' : 'Active') : item.status === 'training' ? (isMr ? 'प्रशिक्षणार्थी' : 'Training') : (isMr ? 'रजेवर' : 'Inactive')}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              padding: '5px 9px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '700',
                            }}
                            title={isMr ? 'माहिती बदला' : 'Edit'}
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.name)}
                            style={{
                              background: '#fef2f2',
                              border: '1px solid #fecaca',
                              color: '#dc2626',
                              padding: '5px 9px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '700',
                            }}
                            title={isMr ? 'काढून टाका' : 'Delete'}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Appoint / Edit Prabhari with Full Name Combobox Dropdown & Autofill */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              padding: '24px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                  {editItem ? (isMr ? '✏️ प्रभारी माहिती अद्ययावत करा' : 'Edit Prabhari Details') : (isMr ? '➕ नवीन प्रभारी नियुक्ती नोंद' : 'Appoint New Prabhari')}
                </h2>
                <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700' }}>
                  ✓ {isMr ? 'केवळ ॲपवर नोंदणीकृत असलेले कार्यकर्ते निवडता येतील' : 'Only registered app users can be selected'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePrabhari} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Row 1: Role Type & Election */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px', color: '#334155' }}>
                    {isMr ? 'प्रभारी पद स्तर (Hierarchy Role)' : 'Hierarchy Role'} *
                  </label>
                  <select
                    value={formData.role_type}
                    onChange={(e) => setFormData({ ...formData, role_type: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px' }}
                    required
                  >
                    <option value="booth_karyakarta">१. बूथ कार्यकर्ता (Booth Karyakarta)</option>
                    <option value="booth_pramukh">२. बूथ प्रमुख (Booth Pramukh)</option>
                    <option value="booth_area_pramukh">३. बूथ एरिया प्रमुख (Booth Area Pramukh)</option>
                    <option value="taluka_pramukh">४. तालुका प्रमुख (Taluka Pramukh)</option>
                    <option value="jilha_pramukh">५. जिल्हा प्रमुख (Jilha Pramukh)</option>
                    <option value="vibhag_pramukh">६. विभाग प्रमुख (Vibhag Pramukh)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px', color: '#334155' }}>
                    {isMr ? 'निवडणूक (Election)' : 'Election'} *
                  </label>
                  <select
                    value={formData.election_id}
                    onChange={(e) => {
                      const sel = elections.find((x) => x.id === Number(e.target.value));
                      setFormData({ ...formData, election_id: e.target.value, election_name: sel?.name || formData.election_name });
                    }}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px' }}
                    required
                  >
                    {elections.map((el) => (
                      <option key={el.id} value={el.id}>{el.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: SEARCHABLE FULL NAME DROPDOWN (Combobox) + Phone with Autofill */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* Full Name with Type-to-Search Dropdown */}
                <div ref={userComboboxRef} style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px', color: '#334155' }}>
                    {isMr ? 'पूर्ण नाव (ॲप नोंदणीकृत युझर निवडा)' : 'Full Name (Select App User)'} *
                  </label>

                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      placeholder={isMr ? 'नाव टाईप करा किंवा निवडा...' : 'Type name or select from list...'}
                      value={userSearchText}
                      onChange={(e) => {
                        setUserSearchText(e.target.value);
                        setFormData({ ...formData, name: e.target.value });
                        setIsUserDropdownOpen(true);
                        setUserValidationError('');
                      }}
                      onFocus={() => setIsUserDropdownOpen(true)}
                      style={{
                        width: '100%',
                        padding: '9px 30px 9px 12px',
                        borderRadius: '8px',
                        border: userValidationError ? '1.5px solid #ef4444' : selectedAppUser ? '1.5px solid #10b981' : '1.5px solid #cbd5e1',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        background: '#ffffff',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        fontSize: '11px',
                        padding: 0,
                      }}
                    >
                      ▼
                    </button>
                  </div>

                  {/* Registered Users Autocomplete Dropdown List */}
                  {isUserDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        maxHeight: '220px',
                        overflowY: 'auto',
                        background: '#ffffff',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '10px',
                        boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
                        zIndex: 10001,
                        marginTop: '4px',
                      }}
                    >
                      <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: '800', color: '#64748b', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        {isMr ? '📱 ॲपवर नोंदणीकृत सर्व कार्यकर्ते:' : 'Registered App Users:'} ({filteredUsersList.length})
                      </div>

                      {filteredUsersList.length === 0 ? (
                        <div style={{ padding: '12px', fontSize: '12px', color: '#ef4444', textAlign: 'center', fontWeight: '700' }}>
                          ⚠️ {isMr ? 'हा युझर ॲपवर सापडला नाही. केवळ ॲप युझर्सच नेमले जाऊ शकतात.' : 'User not found in registered app users.'}
                        </div>
                      ) : (
                        filteredUsersList.map((u) => (
                          <div
                            key={u.id}
                            onClick={() => handleSelectUser(u)}
                            style={{
                              padding: '9px 12px',
                              borderBottom: '1px solid #f1f5f9',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'background 0.15s ease',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.background = '#eff6ff')}
                            onMouseOut={(e) => (e.currentTarget.style.background = '#ffffff')}
                          >
                            <div>
                              <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '13px' }}>
                                {u.full_name}
                              </div>
                              <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                                📞 {u.phone} {u.ward ? `• ${u.ward}` : ''}
                              </div>
                            </div>
                            <span style={{ fontSize: '10.5px', fontWeight: '800', background: '#dcfce7', color: '#166534', padding: '2px 7px', borderRadius: '10px' }}>
                              ✓ App
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Validation Error Banner */}
                  {userValidationError && (
                    <div style={{ fontSize: '11.5px', color: '#ef4444', fontWeight: '700', marginTop: '4px' }}>
                      {userValidationError}
                    </div>
                  )}

                  {selectedAppUser && !userValidationError && (
                    <div style={{ fontSize: '11px', color: '#15803d', fontWeight: '700', marginTop: '3px' }}>
                      ✓ ॲप युझर पडताळणी यशस्वी ({selectedAppUser.phone})
                    </div>
                  )}
                </div>

                {/* Phone Number (Autofilled automatically from user selection) */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px', color: '#334155' }}>
                    {isMr ? 'मोबाईल नंबर (आपोआप भरला जाईल)' : 'Phone Number (Auto-filled)'} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="9822000000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value, whatsapp_number: formData.whatsapp_number || e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: selectedAppUser ? '#f0fdf4' : '#ffffff' }}
                  />
                </div>
              </div>

              {/* Row 3: District, Taluka, Village (Auto-filled or editable) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px', color: '#334155' }}>
                    {isMr ? 'जिल्हा' : 'District'} *
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px', color: '#334155' }}>
                    {isMr ? 'तालुका' : 'Taluka'}
                  </label>
                  <input
                    type="text"
                    placeholder="मिरज / सांगली"
                    value={formData.taluka}
                    onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px', color: '#334155' }}>
                    {isMr ? 'गाव / प्रभाग' : 'Village / Ward'}
                  </label>
                  <input
                    type="text"
                    placeholder="माधवनगर / प्रभाग ४"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Row 4: Official Booth Selection (Loaded from DB) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px', color: '#334155' }}>
                    {isMr ? 'बूथ क्रमांक' : 'Booth No.'}
                  </label>
                  <select
                    value={formData.booth_no}
                    onChange={(e) => {
                      const matched = boothsList.find((b) => b.booth_no?.includes(e.target.value));
                      setFormData({
                        ...formData,
                        booth_no: e.target.value,
                        booth_name: matched?.booth_name_mr || formData.booth_name,
                      });
                    }}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="सर्व">{isMr ? 'सर्व बूथ (All Booths)' : 'All Booths'}</option>
                    {boothsList.map((b) => {
                      const num = b.booth_no?.replace(/[^\d]/g, '') || b.id;
                      return (
                        <option key={b.id} value={num}>
                          बूथ क्र. {num} ({b.village_mr || b.taluka_mr})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px', color: '#334155' }}>
                    {isMr ? 'मतदान केंद्र नाव / परिसर' : 'Polling Station / Area'}
                  </label>
                  <input
                    type="text"
                    placeholder={isMr ? 'उदा. जिल्हा परिषद प्राथमिक शाळा' : 'e.g. ZP Primary School'}
                    value={formData.booth_name}
                    onChange={(e) => setFormData({ ...formData, booth_name: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Row 5: Target Voters & Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px', color: '#334155' }}>
                    {isMr ? 'लक्षित मतदार संख्या' : 'Target Voters Target'}
                  </label>
                  <input
                    type="number"
                    value={formData.assigned_voters_target}
                    onChange={(e) => setFormData({ ...formData, assigned_voters_target: Number(e.target.value) })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px', color: '#334155' }}>
                    {isMr ? 'कार्य स्थिती' : 'Status'}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="active">{isMr ? 'सक्रिय (Active)' : 'Active'}</option>
                    <option value="training">{isMr ? 'प्रशिक्षणार्थी (Training)' : 'Training'}</option>
                    <option value="inactive">{isMr ? 'रजेवर / निष्क्रिय (Inactive)' : 'Inactive'}</option>
                  </select>
                </div>
              </div>

              {/* Row 6: Responsibilities */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px', color: '#334155' }}>
                  {isMr ? 'विशेष जबाबदारी व कार्यसूचना (Responsibilities)' : 'Responsibilities'}
                </label>
                <textarea
                  rows="3"
                  placeholder={isMr ? 'उदा. घरोघरी मतदार स्लिप वाटप, व्हीलचेअर व्यवस्था व संपर्क...' : 'Enter specific responsibilities...'}
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    padding: '9px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    color: '#475569',
                  }}
                >
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#2563eb',
                    border: 'none',
                    padding: '9px 20px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                  }}
                >
                  ✓ {editItem ? (isMr ? 'अद्ययावत करा' : 'Update') : (isMr ? 'जतन करा (Save to DB)' : 'Save to DB')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
