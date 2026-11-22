import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../../api/axios';

export default function UserManagementHub({ isMr = true, onNavigateToCreate }) {
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({
    total: 0,
    app_users: 0,
    app_admin: 0,
    website_admin: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [selectedSystem, setSelectedSystem] = useState('all'); // all, app_worker, app_admin, web_admin, pending
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [roleModalUser, setRoleModalUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [roleUpdating, setRoleUpdating] = useState(false);

  const [passwordModalUser, setPasswordModalUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await apiClient.get('/admin/users');
      if (data && data.data) {
        setUsers(data.data);
        if (data.counts) {
          setCounts(data.counts);
        }
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      // Fallback: try /admin/users-list
      try {
        const fallbackRes = await apiClient.get('/admin/users-list');
        const fallbackUsers = fallbackRes.data?.data || [];
        setUsers(fallbackUsers);
        // Compute counts
        const appU = fallbackUsers.filter((u) => (u.roles || []).some((r) => (r.name || r) === 'WORKER')).length;
        const appA = fallbackUsers.filter((u) => (u.roles || []).some((r) => (r.name || r) === 'OFFICER')).length;
        const webA = fallbackUsers.filter((u) => (u.roles || []).some((r) => (r.name || r) === 'ADMIN')).length;
        setCounts({
          total: fallbackUsers.length,
          app_users: appU,
          app_admin: appA,
          website_admin: webA,
          pending: fallbackUsers.filter((u) => u.status === 'PENDING').length,
        });
      } catch (fbErr) {
        setError(err.response?.data?.message || err.message || 'वापरकर्ते लोड करताना त्रुटी आली.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const userRoles = (u.roles || []).map((r) => (typeof r === 'string' ? r : r.name));

      // System filter
      if (selectedSystem === 'app_worker' && !userRoles.includes('WORKER')) return false;
      if (selectedSystem === 'app_admin' && !userRoles.includes('OFFICER')) return false;
      if (selectedSystem === 'web_admin' && !userRoles.includes('ADMIN')) return false;
      if (selectedSystem === 'pending' && u.status !== 'PENDING') return false;

      // Status filter
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const nameMatch = (u.full_name || '').toLowerCase().includes(q);
        const phoneMatch = (u.phone || '').toLowerCase().includes(q);
        const emailMatch = (u.email || '').toLowerCase().includes(q);
        const roleMatch = userRoles.some((r) => r.toLowerCase().includes(q));
        if (!nameMatch && !phoneMatch && !emailMatch && !roleMatch) return false;
      }

      return true;
    });
  }, [users, selectedSystem, statusFilter, searchTerm]);

  // Action: Toggle Status
  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setStatusUpdatingId(user.id);
    setError('');
    setSuccessMsg('');
    try {
      await apiClient.put(`/admin/users/${user.id}/status`, { status: nextStatus });
      setSuccessMsg(
        isMr
          ? `वापरकर्ता ${user.full_name} ची स्थिती '${nextStatus === 'ACTIVE' ? 'सक्रिय' : 'निलंबित'}' करण्यात आली.`
          : `User ${user.full_name} status updated to ${nextStatus}.`
      );
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'स्थिती बदलताना अडचण आली.');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Action: Open Role Modal
  const openRoleModal = (user) => {
    setRoleModalUser(user);
    const existingRoles = (user.roles || []).map((r) => (typeof r === 'string' ? r : r.name));
    setSelectedRoles(existingRoles.length > 0 ? existingRoles : ['WORKER']);
  };

  // Action: Save Role
  const handleSaveRoles = async () => {
    if (!roleModalUser) return;
    if (selectedRoles.length === 0) {
      alert(isMr ? 'किमान एक भूमिका निवडणे आवश्यक आहे.' : 'Please select at least one role.');
      return;
    }
    setRoleUpdating(true);
    setError('');
    setSuccessMsg('');
    try {
      await apiClient.put(`/admin/users/${roleModalUser.id}/role`, { roles: selectedRoles });
      setSuccessMsg(
        isMr
          ? `वापरकर्ता ${roleModalUser.full_name} ची भूमिका यशस्वीरीत्या बदलण्यात आली.`
          : `Roles updated for ${roleModalUser.full_name}.`
      );
      setRoleModalUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'भूमिका बदलताना अडचण आली.');
    } finally {
      setRoleUpdating(false);
    }
  };

  // Action: Save New Password
  const handleResetPassword = async () => {
    if (!passwordModalUser) return;
    if (!newPassword || newPassword.length < 6) {
      alert(isMr ? 'पासवर्ड किमान ६ अक्षरांचा असावा.' : 'Password must be at least 6 characters.');
      return;
    }
    setPasswordUpdating(true);
    setError('');
    setSuccessMsg('');
    try {
      await apiClient.post(`/admin/users/${passwordModalUser.id}/reset-password`, { password: newPassword });
      setSuccessMsg(
        isMr
          ? `वापरकर्ता ${passwordModalUser.full_name} चा पासवर्ड यशस्वीरीत्या बदलण्यात आला.`
          : `Password reset successfully for ${passwordModalUser.full_name}.`
      );
      setPasswordModalUser(null);
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'पासवर्ड बदलताना अडचण आली.');
    } finally {
      setPasswordUpdating(false);
    }
  };

  // Action: Delete User
  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    setDeleting(true);
    setError('');
    setSuccessMsg('');
    try {
      await apiClient.delete(`/admin/users/${deleteConfirmUser.id}`);
      setSuccessMsg(
        isMr
          ? `वापरकर्ता ${deleteConfirmUser.full_name} यशस्वीरीत्या हटवण्यात आला.`
          : `User ${deleteConfirmUser.full_name} deleted.`
      );
      setDeleteConfirmUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'वापरकर्ता हटवताना अडचण आली.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%', boxSizing: 'border-box' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1d4ed8 100%)',
          borderRadius: '16px',
          padding: '24px 28px',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '24px' }}>👥</span>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', letterSpacing: '-0.3px' }}>
              {isMr ? 'User (वापरकर्ते वर्गीकरण व व्यवस्थापन)' : 'User Management Hub'}
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#dbeafe', maxWidth: '750px', lineHeight: 1.5 }}>
            {isMr
              ? 'मोबाईल ॲप वापरकर्ते (Field Workers), ॲप ॲडमिन (Officers) आणि वेबसाइट ॲडमिन यांचे केंद्रीय वर्गीकरण, उपस्थिती व थेट ॲक्शन्स.'
              : 'Unified directory and role management for Mobile App Workers, App Officers, and Web Admins.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchUsers}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
            }}
          >
            🔄 {isMr ? 'रिफ्रेश करा' : 'Refresh'}
          </button>
          {onNavigateToCreate && (
            <button
              onClick={onNavigateToCreate}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                background: '#ffffff',
                color: '#1e3a8a',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
              }}
            >
              ➕ {isMr ? 'नवीन वापरकर्ता जोडा' : 'Add New User'}
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            fontSize: '13.5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        </div>
      )}

      {successMsg && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
            fontSize: '13.5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>✅ {successMsg}</span>
          <button onClick={() => setSuccessMsg('')} style={{ background: 'none', border: 'none', color: '#166534', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        </div>
      )}

      {/* 4 Categorized Metric Cards (Requested by User) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
        {/* Card 1: App Users */}
        <div
          onClick={() => setSelectedSystem('app_worker')}
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '20px',
            border: selectedSystem === 'app_worker' ? '2.5px solid #2563eb' : '1px solid #e2e8f0',
            boxShadow: selectedSystem === 'app_worker' ? '0 8px 20px -4px rgba(37, 99, 235, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#2563eb' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e40af', textTransform: 'uppercase' }}>
              📱 {isMr ? 'ॲप वापरकर्ते' : 'App Users'}
            </span>
            <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '12px' }}>
              Field Workers
            </span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '10px 0 4px 0' }}>
            {counts.app_users}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {isMr ? 'मोबाईल ॲप कार्यकर्ते व मतदार संपर्क प्रतिनिधी' : 'Mobile app field karyakartas'}
          </div>
        </div>

        {/* Card 2: App Admin */}
        <div
          onClick={() => setSelectedSystem('app_admin')}
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '20px',
            border: selectedSystem === 'app_admin' ? '2.5px solid #7c3aed' : '1px solid #e2e8f0',
            boxShadow: selectedSystem === 'app_admin' ? '0 8px 20px -4px rgba(124, 58, 237, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#7c3aed' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#5b21b6', textTransform: 'uppercase' }}>
              🛡️ {isMr ? 'ॲप ॲडमिन' : 'App Admin'}
            </span>
            <span style={{ background: '#f5f3ff', color: '#6d28d9', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '12px' }}>
              Officers / Leads
            </span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '10px 0 4px 0' }}>
            {counts.app_admin}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {isMr ? 'कक्ष व तालुका प्रभारी अधिकारी' : 'Field officers & zonal in-charges'}
          </div>
        </div>

        {/* Card 3: Website Admin */}
        <div
          onClick={() => setSelectedSystem('web_admin')}
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '20px',
            border: selectedSystem === 'web_admin' ? '2.5px solid #059669' : '1px solid #e2e8f0',
            boxShadow: selectedSystem === 'web_admin' ? '0 8px 20px -4px rgba(5, 150, 105, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#059669' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#065f46', textTransform: 'uppercase' }}>
              🌐 {isMr ? 'वेबसाइट ॲडमिन' : 'Website Admin'}
            </span>
            <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '12px' }}>
              Command HQ
            </span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '10px 0 4px 0' }}>
            {counts.website_admin}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {isMr ? 'वेब पोर्टल पूर्ण नियंत्रण व प्रशासक' : 'Web dashboard super administrators'}
          </div>
        </div>

        {/* Card 4: Total Users */}
        <div
          onClick={() => setSelectedSystem('all')}
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '20px',
            border: selectedSystem === 'all' ? '2.5px solid #ea580c' : '1px solid #e2e8f0',
            boxShadow: selectedSystem === 'all' ? '0 8px 20px -4px rgba(234, 88, 12, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#ea580c' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#9a3412', textTransform: 'uppercase' }}>
              👥 {isMr ? 'एकूण वापरकर्ते' : 'Total Users'}
            </span>
            {counts.pending > 0 && (
              <span style={{ background: '#fff7ed', color: '#c2410c', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '12px' }}>
                {counts.pending} {isMr ? 'प्रलंबित' : 'Pending'}
              </span>
            )}
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '10px 0 4px 0' }}>
            {counts.total}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {isMr ? 'सिस्टीममधील सर्व नोंदणीकृत खाती' : 'All accounts in political system'}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '16px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
          {[
            { key: 'all', label_mr: `सर्व वापरकर्ते (${counts.total})`, label_en: `All Users (${counts.total})` },
            { key: 'app_worker', label_mr: `📱 ॲप वापरकर्ते (${counts.app_users})`, label_en: `App Workers (${counts.app_users})` },
            { key: 'app_admin', label_mr: `🛡️ ॲप ॲडमिन (${counts.app_admin})`, label_en: `App Admin (${counts.app_admin})` },
            { key: 'web_admin', label_mr: `🌐 वेबसाइट ॲडमिन (${counts.website_admin})`, label_en: `Web Admin (${counts.website_admin})` },
            ...(counts.pending > 0
              ? [{ key: 'pending', label_mr: `⏳ मंजुरी प्रलंबित (${counts.pending})`, label_en: `Pending (${counts.pending})` }]
              : []),
          ].map((tab) => {
            const active = selectedSystem === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedSystem(tab.key)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: active ? '1px solid #2563eb' : '1px solid #e2e8f0',
                  background: active ? '#eff6ff' : '#ffffff',
                  color: active ? '#1d4ed8' : '#475569',
                  fontSize: '13px',
                  fontWeight: active ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isMr ? tab.label_mr : tab.label_en}
              </button>
            );
          })}
        </div>

        {/* Search & Status Filter Row */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '10px', flex: '1 1 320px', maxWidth: '520px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder={isMr ? 'नाव, मोबाईल, ईमेल किंवा भूमिकेद्वारे शोधा...' : 'Search by name, phone, email or role...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
              {isMr ? 'स्थिती:' : 'Status:'}
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                color: '#334155',
                background: '#ffffff',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">{isMr ? 'सर्व स्थिती (All)' : 'All Status'}</option>
              <option value="ACTIVE">{isMr ? 'सक्रिय (ACTIVE)' : 'Active'}</option>
              <option value="SUSPENDED">{isMr ? 'निलंबित (SUSPENDED)' : 'Suspended'}</option>
              <option value="PENDING">{isMr ? 'प्रलंबित (PENDING)' : 'Pending'}</option>
            </select>

            <span style={{ fontSize: '12.5px', color: '#64748b', marginLeft: '8px' }}>
              {isMr ? `एकूण निकाल: ${filteredUsers.length}` : `Results: ${filteredUsers.length}`}
            </span>
          </div>
        </div>
      </div>

      {/* Users Management Table */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '14px 18px', fontSize: '12.5px', fontWeight: '700', color: '#475569' }}>
                  {isMr ? 'वापरकर्ता (User)' : 'User'}
                </th>
                <th style={{ padding: '14px 16px', fontSize: '12.5px', fontWeight: '700', color: '#475569' }}>
                  {isMr ? 'मोबाईल व संपर्क' : 'Contact'}
                </th>
                <th style={{ padding: '14px 16px', fontSize: '12.5px', fontWeight: '700', color: '#475569' }}>
                  {isMr ? 'प्रणाली व भूमिका (System & Role)' : 'System & Role'}
                </th>
                <th style={{ padding: '14px 16px', fontSize: '12.5px', fontWeight: '700', color: '#475569' }}>
                  {isMr ? 'स्थिती (Status)' : 'Status'}
                </th>
                <th style={{ padding: '14px 18px', fontSize: '12.5px', fontWeight: '700', color: '#475569', textAlign: 'right' }}>
                  {isMr ? 'कृती / ॲक्शन्स (Actions)' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ display: 'inline-block', fontSize: '24px', marginBottom: '8px' }}>⏳</div>
                    <div>{isMr ? 'वापरकर्ते लोड होत आहेत...' : 'Loading users...'}</div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔍</div>
                    <div style={{ fontWeight: '600', color: '#334155' }}>
                      {isMr ? 'कोणतेही वापरकर्ते सापडले नाहीत.' : 'No users found matching filters.'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => {
                  const roles = (user.roles || []).map((r) => (typeof r === 'string' ? r : r.name));
                  const isWorker = roles.includes('WORKER');
                  const isOfficer = roles.includes('OFFICER');
                  const isAdmin = roles.includes('ADMIN');

                  const statusColor =
                    user.status === 'ACTIVE'
                      ? { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' }
                      : user.status === 'PENDING'
                      ? { bg: '#fffbeb', text: '#92400e', border: '#fde68a' }
                      : { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' };

                  return (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      {/* User Info */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              background: isAdmin ? '#ecfdf5' : isOfficer ? '#f5f3ff' : '#eff6ff',
                              color: isAdmin ? '#059669' : isOfficer ? '#7c3aed' : '#2563eb',
                              border: `2px solid ${isAdmin ? '#a7f3d0' : isOfficer ? '#ddd6fe' : '#bfdbfe'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '700',
                              fontSize: '14px',
                              flexShrink: 0,
                            }}
                          >
                            {(user.full_name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>
                              {user.full_name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                              {user.email || (isMr ? 'ईमेल नोंदवलेला नाही' : 'No email')}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                            {user.phone || '—'}
                          </span>
                          {user.phone && (
                            <a
                              href={`https://wa.me/91${user.phone.replace(/[^0-9]/g, '').slice(-10)}`}
                              target="_blank"
                              rel="noreferrer"
                              title={isMr ? 'व्हॉट्सॲप मेसेज पाठवा' : 'Send WhatsApp Message'}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: '#dcfce7',
                                color: '#16a34a',
                                textDecoration: 'none',
                                fontSize: '12px',
                                fontWeight: 'bold',
                              }}
                            >
                              💬
                            </a>
                          )}
                        </div>
                      </td>

                      {/* System & Roles */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                          {isWorker && (
                            <span
                              style={{
                                background: '#eff6ff',
                                color: '#1d4ed8',
                                border: '1px solid #bfdbfe',
                                fontSize: '11px',
                                fontWeight: '700',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              📱 {isMr ? 'ॲप कार्यकर्ता' : 'Worker'}
                            </span>
                          )}
                          {isOfficer && (
                            <span
                              style={{
                                background: '#f5f3ff',
                                color: '#6d28d9',
                                border: '1px solid #ddd6fe',
                                fontSize: '11px',
                                fontWeight: '700',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              🛡️ {isMr ? 'ॲप ॲडमिन (Officer)' : 'Officer'}
                            </span>
                          )}
                          {isAdmin && (
                            <span
                              style={{
                                background: '#ecfdf5',
                                color: '#047857',
                                border: '1px solid #a7f3d0',
                                fontSize: '11px',
                                fontWeight: '700',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              🌐 {isMr ? 'वेबसाइट ॲडमिन' : 'Web Admin'}
                            </span>
                          )}
                          {roles.length === 0 && (
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                              {isMr ? 'भूमिका नाही' : 'No Role'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            background: statusColor.bg,
                            color: statusColor.text,
                            border: `1px solid ${statusColor.border}`,
                            fontSize: '11.5px',
                            fontWeight: '700',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            display: 'inline-block',
                          }}
                        >
                          {user.status === 'ACTIVE'
                            ? isMr ? '● सक्रिय' : 'Active'
                            : user.status === 'PENDING'
                            ? isMr ? '⏳ प्रलंबित' : 'Pending'
                            : isMr ? '✖ निलंबित' : 'Suspended'}
                        </span>
                      </td>

                      {/* Action Buttons (Requested by user) */}
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                          {/* Toggle Status */}
                          <button
                            onClick={() => handleToggleStatus(user)}
                            disabled={statusUpdatingId === user.id}
                            title={
                              user.status === 'ACTIVE'
                                ? isMr ? 'खाते निलंबित करा' : 'Suspend account'
                                : isMr ? 'खाते सक्रिय करा' : 'Activate account'
                            }
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              background: '#ffffff',
                              color: user.status === 'ACTIVE' ? '#dc2626' : '#16a34a',
                              fontSize: '11.5px',
                              fontWeight: '600',
                              cursor: statusUpdatingId === user.id ? 'not-allowed' : 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            {statusUpdatingId === user.id
                              ? '⏳'
                              : user.status === 'ACTIVE'
                              ? '⚡ ' + (isMr ? 'निलंबित करा' : 'Suspend')
                              : '✓ ' + (isMr ? 'सक्रिय करा' : 'Activate')}
                          </button>

                          {/* Change Role Button */}
                          <button
                            onClick={() => openRoleModal(user)}
                            title={isMr ? 'भूमिका बदला' : 'Change Role'}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              background: '#ffffff',
                              color: '#2563eb',
                              fontSize: '11.5px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            🔄 {isMr ? 'भूमिका' : 'Role'}
                          </button>

                          {/* Reset Password Button */}
                          <button
                            onClick={() => {
                              setPasswordModalUser(user);
                              setNewPassword('');
                            }}
                            title={isMr ? 'पासवर्ड रिसेट करा' : 'Reset Password'}
                            style={{
                              padding: '5px 9px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              background: '#ffffff',
                              color: '#7c3aed',
                              fontSize: '11.5px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                            }}
                          >
                            🔑
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteConfirmUser(user)}
                            title={isMr ? 'खाते हटवा' : 'Delete Account'}
                            style={{
                              padding: '5px 9px',
                              borderRadius: '6px',
                              border: '1px solid #fee2e2',
                              background: '#fff5f5',
                              color: '#ef4444',
                              fontSize: '11.5px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Change Modal */}
      {roleModalUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                🔄 {isMr ? 'भूमिका व प्रणाली बदला' : 'Change User Roles'}
              </h3>
              <button
                onClick={() => setRoleModalUser(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
              {isMr
                ? `वापरकर्ता: ${roleModalUser.full_name} (${roleModalUser.phone})`
                : `User: ${roleModalUser.full_name} (${roleModalUser.phone})`}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {[
                {
                  key: 'WORKER',
                  label: isMr ? '📱 ॲप कार्यकर्ता (Field Worker)' : '📱 Field Worker (Mobile App)',
                  desc: isMr ? 'मोबाईल ॲपमध्ये बूथ व नागरिक सर्वेक्षणाची कामे करण्यासाठी' : 'Field work, surveys & booth outreach',
                },
                {
                  key: 'OFFICER',
                  label: isMr ? '🛡️ ॲप ॲडमिन (Field Officer)' : '🛡️ Field Officer (App Lead)',
                  desc: isMr ? 'तालुका, प्रभाग व कार्यकर्त्यांचे नियंत्रण करण्यासाठी' : 'Zone, ward & karyakarta management',
                },
                {
                  key: 'ADMIN',
                  label: isMr ? '🌐 वेबसाइट ॲडमिन (System Super Admin)' : '🌐 System Super Admin (Web Command)',
                  desc: isMr ? 'वेब पोर्टलवरील सर्व डेटा व सेटिंग्सचे संपूर्ण अधिकार' : 'Full access to web portal & master data',
                },
              ].map((role) => {
                const checked = selectedRoles.includes(role.key);
                return (
                  <label
                    key={role.key}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: checked ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      background: checked ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRoles([...selectedRoles, role.key]);
                        } else {
                          setSelectedRoles(selectedRoles.filter((r) => r !== role.key));
                        }
                      }}
                      style={{ marginTop: '3px', cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: '700', color: checked ? '#1d4ed8' : '#1e293b' }}>
                        {role.label}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        {role.desc}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setRoleModalUser(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {isMr ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                onClick={handleSaveRoles}
                disabled={roleUpdating}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: roleUpdating ? 'not-allowed' : 'pointer',
                }}
              >
                {roleUpdating ? '...' : isMr ? 'भूमिका जतन करा' : 'Save Roles'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {passwordModalUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                🔑 {isMr ? 'पासवर्ड रिसेट करा' : 'Reset User Password'}
              </h3>
              <button
                onClick={() => setPasswordModalUser(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
              {isMr
                ? `वापरकर्ता: ${passwordModalUser.full_name} साठी नवीन पासवर्ड निश्चित करा:`
                : `Set a new temporary password for ${passwordModalUser.full_name}:`}
            </p>

            <input
              type="text"
              placeholder={isMr ? 'नवीन पासवर्ड टाका (उदा. Pass@123)' : 'New password (min 6 chars)'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13.5px',
                marginBottom: '18px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setPasswordModalUser(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {isMr ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                onClick={handleResetPassword}
                disabled={passwordUpdating}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#7c3aed',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: passwordUpdating ? 'not-allowed' : 'pointer',
                }}
              >
                {passwordUpdating ? '...' : isMr ? 'पासवर्ड बदला' : 'Reset Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', fontSize: '17px', fontWeight: '800', color: '#991b1b' }}>
              ⚠️ {isMr ? 'वापरकर्ता हटवायचा आहे का?' : 'Delete User?'}
            </h3>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              {isMr
                ? `तुम्ही '${deleteConfirmUser.full_name}' यांचे खाते कायमस्वरूपी हटवणार आहात. यानंतर हा वापरकर्ता ॲप किंवा वेबसाइटमध्ये लॉग इन करू शकणार नाही.`
                : `Are you sure you want to permanently delete '${deleteConfirmUser.full_name}'? They will lose access to both mobile app and web.`}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setDeleteConfirmUser(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {isMr ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleting}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#dc2626',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                }}
              >
                {deleting ? '...' : isMr ? 'होय, हटवा' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
