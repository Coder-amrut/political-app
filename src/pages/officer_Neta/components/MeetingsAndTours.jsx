import React, { useState, useEffect } from 'react';
import { netaApi } from '../api/netaApi';

export default function MeetingsAndTours({ lang = 'mr' }) {
  const isMr = lang === 'mr';

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, scheduled, completed
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newMeetingForm, setNewMeetingForm] = useState({
    title_mr: '',
    title_en: '',
    date: new Date().toISOString().split('T')[0],
    time: 'सकाळी १०:०० ते १२:००',
    venue_mr: '',
    venue_en: '',
    type_mr: 'नागरिक संवाद दौरा',
    type_en: 'Public Townhall Tour',
    expected_attendees: '२५०+ नागरिक',
    incharge: '',
    agenda_mr: '',
    agenda_en: '',
    is_online: false,
    meeting_link: '',
    meeting_platform: 'Google Meet',
  });

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const res = await netaApi.getMeetings();
      if (res.success) {
        setMeetings(res.data);
      }
    } catch (err) {
      console.error('Failed to load meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const extractMeetingUrl = (m) => {
    if (m.meeting_link && m.meeting_link.startsWith('http')) return m.meeting_link;
    const text = (m.venue_mr || '') + ' ' + (m.venue_en || '') + ' ' + (m.agenda_mr || '');
    const match = text.match(/https?:\/\/[^\s"'<>]+/);
    return match ? match[0] : null;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(isMr ? 'मीटिंग लिंक कॉपी झाली!' : 'Meeting link copied!');
  };

  const filteredMeetings = meetings.filter((m) => {
    if (activeTab === 'scheduled') return m.status === 'scheduled';
    if (activeTab === 'completed') return m.status === 'completed';
    return true;
  });

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const finalVenueMr = newMeetingForm.is_online
        ? `ऑनलाइन (${newMeetingForm.meeting_platform}): ${newMeetingForm.meeting_link || 'लिंक लवकरच दिली जाईल'}`
        : (newMeetingForm.venue_mr || 'सांगली मतदारसंघ');

      const payload = {
        ...newMeetingForm,
        venue_mr: finalVenueMr,
        venue_en: newMeetingForm.is_online ? `Online (${newMeetingForm.meeting_platform}): ${newMeetingForm.meeting_link}` : (newMeetingForm.venue_en || finalVenueMr),
        title_en: newMeetingForm.title_en || newMeetingForm.title_mr,
        agenda_en: newMeetingForm.agenda_en || newMeetingForm.agenda_mr,
      };
      const res = await netaApi.createMeeting(payload);
      if (res.success) {
        setShowAddModal(false);
        setNewMeetingForm({
          title_mr: '',
          title_en: '',
          date: new Date().toISOString().split('T')[0],
          time: 'सकाळी १०:०० ते १२:००',
          venue_mr: '',
          venue_en: '',
          type_mr: 'नागरिक संवाद दौरा',
          type_en: 'Public Townhall Tour',
          expected_attendees: '२५०+ नागरिक',
          incharge: '',
          agenda_mr: '',
          agenda_en: '',
          is_online: false,
          meeting_link: '',
          meeting_platform: 'Google Meet',
        });
        await fetchMeetings();
      }
    } catch (err) {
      console.error('Failed to create meeting:', err);
      alert(err?.message || 'दौरा सेव्ह करताना त्रुटी आली.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const next = currentStatus === 'scheduled' ? 'completed' : 'scheduled';
    try {
      const res = await netaApi.updateMeetingStatus(id, next);
      if (res.success) {
        setMeetings((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: next } : m))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Add Button */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '22px 24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
            📅 {isMr ? 'बैठका व मतदारसंघ दौरे' : 'Meetings & Constituency Tours'}
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
            {isMr
              ? 'नेत्यांचे सर्व विधानसभा दौरे, कोपरा सभा व बैठक वेळापत्रक'
              : 'Directly synced with backend database for scheduled and completed visits.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="btn-3d-blue"
        >
          <span style={{ fontSize: '15px', fontWeight: '900' }}>＋</span> {isMr ? 'नवीन बैठक / दौरा जोडा' : 'Add New Tour / Meeting'}
        </button>
      </div>

      {/* Filter Tabs - 3 Buttons: 'सर्व कार्यकर्ते', 'आगामी व नियोजित', 'पूर्ण झालेल्या' */}
      <div
        className="meetings-filter-container"
        style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <style>{`
          .meeting-filter-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 10px 18px;
            border-radius: 10px;
            font-size: 13.5px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
            flex: 1 1 auto;
            min-width: 140px;
          }
          .meeting-filter-btn.active {
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
            color: #ffffff;
            border: 1px solid #1d4ed8;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.28);
            transform: translateY(-1px);
          }
          .meeting-filter-btn.inactive {
            background: #ffffff;
            color: #475569;
            border: 1.5px solid #cbd5e1;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          }
          .meeting-filter-btn.inactive:hover {
            background: #f8fafc;
            border-color: #94a3b8;
            color: #1e293b;
          }
          .meeting-filter-badge {
            padding: 2px 8px;
            border-radius: 999px;
            font-size: 11.5px;
            font-weight: 800;
          }
          .meeting-filter-btn.active .meeting-filter-badge {
            background: rgba(255, 255, 255, 0.22);
            color: #ffffff;
          }
          .meeting-filter-btn.inactive .meeting-filter-badge {
            background: #f1f5f9;
            color: #64748b;
          }
          @media (max-width: 640px) {
            .meeting-filter-btn {
              flex: 1 1 100%;
              padding: 11px 16px;
              font-size: 13px;
              justify-content: space-between;
            }
          }
        `}</style>

        {[
          {
            key: 'all',
            icon: '👥',
            label_mr: 'सर्व कार्यकर्ते',
            label_en: 'All Workers',
            count: meetings.length,
          },
          {
            key: 'scheduled',
            icon: '⏳',
            label_mr: 'आगामी व नियोजित',
            label_en: 'Upcoming',
            count: meetings.filter((m) => m.status === 'scheduled').length,
          },
          {
            key: 'completed',
            icon: '✅',
            label_mr: 'पूर्ण झालेल्या',
            label_en: 'Completed',
            count: meetings.filter((m) => m.status === 'completed').length,
          },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`meeting-filter-btn ${isActive ? 'active' : 'inactive'}`}
            >
              <span style={{ fontSize: '15px' }}>{tab.icon}</span>
              <span>{isMr ? tab.label_mr : tab.label_en}</span>
              <span className="meeting-filter-badge">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Meetings List Cards */}
      {loading ? (
        <div style={{ padding: '36px', textAlign: 'center', background: '#ffffff', borderRadius: '12px', color: '#1e3a8a', fontWeight: '700' }}>
          ⏳ {isMr ? 'डेटाबेसमधून दौरे व बैठका लोड होत आहेत...' : 'Loading tours from database...'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {filteredMeetings.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', background: '#ffffff', borderRadius: '12px', color: '#94a3b8', gridColumn: '1 / -1' }}>
              {isMr ? 'कोणतेही कार्यक्रम उपलब्ध नाहीत.' : 'No meetings found.'}
            </div>
          ) : (
            filteredMeetings.map((meet) => {
              const meetingUrl = extractMeetingUrl(meet);
              const isOnlineMeet = meet.is_online || (meet.venue_mr && (meet.venue_mr.includes('ऑनलाइन') || meet.venue_mr.includes('Online') || meet.venue_mr.includes('meet.google') || meet.venue_mr.includes('zoom.us') || meet.venue_mr.includes('teams.')));

              return (
                <div
                  key={meet.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '14px',
                    border: meet.status === 'scheduled' ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                    padding: '20px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                  }}
                >
                  <div>
                    {/* Header Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span
                          style={{
                            background: meet.status === 'scheduled' ? '#dbeafe' : '#f1f5f9',
                            color: meet.status === 'scheduled' ? '#1d4ed8' : '#64748b',
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {isMr ? meet.type_mr : (meet.type_en || meet.type_mr)}
                        </span>
                        {isOnlineMeet && (
                          <span
                            style={{
                              background: '#dcfce7',
                              color: '#15803d',
                              border: '1px solid #86efac',
                              fontSize: '11px',
                              fontWeight: '800',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            🌐 {isMr ? 'ऑनलाइन बैठक' : 'Online Meet'}
                          </span>
                        )}
                      </div>

                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '20px',
                          background: meet.status === 'scheduled' ? '#fef3c7' : '#dcfce7',
                          color: meet.status === 'scheduled' ? '#b45309' : '#15803d',
                        }}
                      >
                        {meet.status === 'scheduled' ? (isMr ? '● नियोजित' : '● Scheduled') : (isMr ? '✓ संपन्न' : '✓ Completed')}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '800', color: '#0f172a', lineHeight: 1.4 }}>
                      {isMr ? meet.title_mr : (meet.title_en || meet.title_mr)}
                    </h3>

                    {/* Info details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#475569' }}>
                      <div>
                        📅 <strong>{isMr ? 'दिनांक व वेळ:' : 'Date & Time:'}</strong> {meet.date} ({meet.time})
                      </div>
                      <div>
                        {isOnlineMeet ? '🌐' : '🏛️'} <strong>{isMr ? (isOnlineMeet ? 'ऑनलाइन प्लॅटफॉर्म / ठिकाण:' : 'ठिकाण:') : 'Venue:'}</strong> {isMr ? meet.venue_mr : (meet.venue_en || meet.venue_mr)}
                      </div>
                      <div>
                        👥 <strong>{isMr ? 'अपेक्षित उपस्थिती:' : 'Expected Crowd:'}</strong> {meet.expected_attendees}
                      </div>
                      {meet.incharge && (
                        <div>
                          👤 <strong>{isMr ? 'समन्वयक:' : 'In-charge:'}</strong> {meet.incharge}
                        </div>
                      )}
                    </div>

                    {/* Online Meeting Join Banner */}
                    {meetingUrl && (
                      <div
                        style={{
                          marginTop: '12px',
                          padding: '10px 12px',
                          background: '#eff6ff',
                          borderRadius: '8px',
                          border: '1px solid #bfdbfe',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#1e40af', fontWeight: '700' }}>
                          <span>📹 {isMr ? 'व्हिडिओ कॉल लिंक:' : 'Video Link:'}</span>
                          <a
                            href={meetingUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#2563eb', textDecoration: 'underline', maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          >
                            {meetingUrl}
                          </a>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <a
                            href={meetingUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              background: '#2563eb',
                              color: '#ffffff',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              textDecoration: 'none',
                              fontSize: '11px',
                              fontWeight: '800',
                            }}
                          >
                            🚀 {isMr ? 'जॉइन व्हा' : 'Join'}
                          </a>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(meetingUrl)}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              color: '#475569',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '700',
                              cursor: 'pointer',
                            }}
                          >
                            📋
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Agenda Box */}
                    {meet.agenda_mr && (
                      <div
                        style={{
                          marginTop: '14px',
                          padding: '10px 12px',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          borderLeft: '3px solid #3b82f6',
                          fontSize: '12px',
                          color: '#334155',
                          whiteSpace: 'pre-line',
                        }}
                      >
                        <strong>{isMr ? 'अजेंडा व प्रमुख मुद्दे:' : 'Agenda:'}</strong>
                        <div style={{ marginTop: '4px' }}>{isMr ? meet.agenda_mr : (meet.agenda_en || meet.agenda_mr)}</div>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div
                    style={{
                      marginTop: '18px',
                      paddingTop: '12px',
                      borderTop: '1px solid #f1f5f9',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <button
                      onClick={() => handleToggleStatus(meet.id, meet.status)}
                      style={{
                        background: meet.status === 'scheduled' ? '#16a34a' : '#f1f5f9',
                        color: meet.status === 'scheduled' ? '#ffffff' : '#475569',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      {meet.status === 'scheduled'
                        ? isMr
                          ? '✓ संपन्न झाले'
                          : 'Mark Completed'
                        : isMr
                          ? 'पुन्हा नियोजित करा'
                          : 'Reopen'}
                    </button>

                    {/* WhatsApp Share Button */}
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `*${isMr ? meet.title_mr : (meet.title_en || meet.title_mr)}*\n📅 ${meet.date} (${meet.time})\n🏛️ ${isMr ? meet.venue_mr : (meet.venue_en || meet.venue_mr)
                        }\n👥 उपस्थिती: ${meet.expected_attendees}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: '#25d366',
                        color: '#ffffff',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '12px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      💬 {isMr ? 'शेअर करा' : 'Share'}
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Add New Meeting Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '24px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                📅 {isMr ? 'नवीन बैठक किंवा दौरा नोंदवा (DB Save)' : 'Schedule New Tour or Meeting'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMeeting} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Meeting Mode Selector (In-Person vs Online) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                  {isMr ? 'बैठक / दौऱ्याचे स्वरूप निवडा *' : 'Select Meeting Format *'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setNewMeetingForm({ ...newMeetingForm, is_online: false })}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: !newMeetingForm.is_online ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: !newMeetingForm.is_online ? '#eff6ff' : '#ffffff',
                      color: !newMeetingForm.is_online ? '#1d4ed8' : '#64748b',
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>🏛️</span>
                    <span>{isMr ? 'प्रत्यक्ष दौरा / सभा' : 'In-Person Tour'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMeetingForm({ ...newMeetingForm, is_online: true })}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: newMeetingForm.is_online ? '2px solid #16a34a' : '1px solid #cbd5e1',
                      background: newMeetingForm.is_online ? '#dcfce7' : '#ffffff',
                      color: newMeetingForm.is_online ? '#15803d' : '#64748b',
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>🌐</span>
                    <span>{isMr ? 'ऑनलाइन व्हिडिओ बैठक' : 'Online Video Meet'}</span>
                  </button>
                </div>
              </div>

              {/* Online Meeting Link & Platform Inputs */}
              {newMeetingForm.is_online && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#166534', marginBottom: '4px' }}>
                        {isMr ? 'प्लॅटफॉर्म' : 'Platform'}
                      </label>
                      <select
                        value={newMeetingForm.meeting_platform}
                        onChange={(e) => setNewMeetingForm({ ...newMeetingForm, meeting_platform: e.target.value })}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #86efac', fontSize: '12px', background: '#ffffff' }}
                      >
                        <option value="Google Meet">Google Meet</option>
                        <option value="Zoom">Zoom</option>
                        <option value="MS Teams">MS Teams</option>
                        <option value="JioMeet">JioMeet</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#166534', marginBottom: '4px' }}>
                        {isMr ? 'ऑनलाइन व्हिडिओ मीटिंग लिंक *' : 'Video Meeting URL *'}
                      </label>
                      <input
                        type="url"
                        required={newMeetingForm.is_online}
                        placeholder="उदा. https://meet.google.com/abc-defg-hij"
                        value={newMeetingForm.meeting_link}
                        onChange={(e) => setNewMeetingForm({ ...newMeetingForm, meeting_link: e.target.value })}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '1px solid #86efac', fontSize: '12px', background: '#ffffff' }}
                      />
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#15803d' }}>
                    💡 {isMr ? 'कार्यकर्ते आणि नागरिकांना थेट या लिंकवरून एका क्लिकवर व्हिडिओ बैठकीत सामील होता येईल.' : 'Members can join this meeting with a single click.'}
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  {isMr ? 'कार्यक्रमाचे नाव / विषय *' : 'Event / Meeting Title *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isMr ? 'उदा. विश्रामबाग व्यापारी व नागरिक संवाद दौरा' : 'e.g. Traders Townhall'}
                  value={newMeetingForm.title_mr}
                  onChange={(e) => setNewMeetingForm({ ...newMeetingForm, title_mr: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    {isMr ? 'प्रकार' : 'Category'}
                  </label>
                  <select
                    value={newMeetingForm.type_mr}
                    onChange={(e) => setNewMeetingForm({ ...newMeetingForm, type_mr: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="नागरिक संवाद दौरा">{isMr ? 'नागरिक संवाद दौरा' : 'Citizen Outreach Tour'}</option>
                    <option value="पक्ष संघटना बैठक">{isMr ? 'पक्ष संघटना बैठक' : 'Party Organization Meeting'}</option>
                    <option value="महिला मेळावा">{isMr ? 'महिला मेळावा' : 'Women Gathering'}</option>
                    <option value="शेतकरी संवाद">{isMr ? 'शेतकरी संवाद' : 'Farmers Outreach'}</option>
                    <option value="युवा मेळावा">{isMr ? 'युवा मेळावा' : 'Youth Conference'}</option>
                    <option value="जनता दरबार">{isMr ? 'जनता दरबार' : 'Public Grievance Hearing'}</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    {isMr ? 'दिनांक *' : 'Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={newMeetingForm.date}
                    onChange={(e) => setNewMeetingForm({ ...newMeetingForm, date: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    {isMr ? 'वेळ' : 'Time'}
                  </label>
                  <input
                    type="text"
                    value={newMeetingForm.time}
                    onChange={(e) => setNewMeetingForm({ ...newMeetingForm, time: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    {isMr ? 'अपेक्षित उपस्थिती' : 'Expected Crowd'}
                  </label>
                  <input
                    type="text"
                    value={newMeetingForm.expected_attendees}
                    onChange={(e) => setNewMeetingForm({ ...newMeetingForm, expected_attendees: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  {isMr ? (newMeetingForm.is_online ? 'स्थान / टीप (पर्यायी)' : 'ठिकाण *') : (newMeetingForm.is_online ? 'Location / Note (Optional)' : 'Venue *')}
                </label>
                <input
                  type="text"
                  required={!newMeetingForm.is_online}
                  placeholder={newMeetingForm.is_online ? (isMr ? 'उदा. ऑनलाइन झूम / गूगल मीट' : 'Online Call') : (isMr ? 'उदा. छत्रपती शिवाजी हॉल, सांगली' : 'Venue address')}
                  value={newMeetingForm.venue_mr}
                  onChange={(e) => setNewMeetingForm({ ...newMeetingForm, venue_mr: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  {isMr ? 'स्थानिक प्रमुख समन्वयक व संपर्क' : 'Local In-charge & Contact'}
                </label>
                <input
                  type="text"
                  placeholder={isMr ? 'उदा. सचिन पाटील (९८२२०१४५२१)' : 'Name & Phone'}
                  value={newMeetingForm.incharge}
                  onChange={(e) => setNewMeetingForm({ ...newMeetingForm, incharge: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  {isMr ? 'अजेंडा व प्रमुख मुद्दे' : 'Agenda & Discussion Points'}
                </label>
                <textarea
                  rows={3}
                  placeholder={isMr ? '१. रस्त्यांची समस्या\n२. लाडकी बहीण आढावा...' : 'Agenda notes...'}
                  value={newMeetingForm.agenda_mr}
                  onChange={(e) => setNewMeetingForm({ ...newMeetingForm, agenda_mr: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: '600', cursor: 'pointer' }}
                >
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#1e3a8a', color: '#ffffff', fontWeight: '700', cursor: submitting ? 'wait' : 'pointer' }}
                >
                  {submitting ? (isMr ? 'जतन होत आहे...' : 'Saving...') : (isMr ? 'दौरा जतन करा' : 'Save Meeting')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
