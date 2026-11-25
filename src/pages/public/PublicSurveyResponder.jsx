import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001/api';

const SANGLI_TALUKAS = [
  'मिरज (Miraj)',
  'तासगाव (Tasgaon)',
  'जत (Jat)',
  'वाळवा / इस्लामपूर (Walwa / Islampur)',
  'शिराळा (Shirala)',
  'खानापूर / विटा (Khanapur / Vita)',
  'आटपाडी (Atpadi)',
  'कवठेमहांकाळ (Kavathe Mahankal)',
  'कडेगाव (Kadegaon)',
  'पलूस (Palus)'
];

const DEFAULT_QUESTIONS = [
  {
    id: 'q_voter_count',
    title_mr: 'आपल्या कुटुंबातील एकूण १८ वर्षांवरील मतदारांची संख्या किती आहे?',
    title_en: 'How many voting members (18+) are in your household?',
    type: 'NUMBER',
    required: true,
    options: []
  },
  {
    id: 'q_voter_id',
    title_mr: 'कुटुंबातील सर्व मतदारांकडे मतदार ओळखपत्र (EPIC) उपलब्ध आहे का?',
    title_en: 'Do all adult family members possess a Voter ID card?',
    type: 'RADIO',
    required: true,
    options: ['होय, सर्वांकडे आहे', 'काहींचे नाही', 'कोणाकडेच नाही']
  },
  {
    id: 'q_civic_issue',
    title_mr: 'आपल्या परिसरातील सर्वात महत्त्वाची नागरी समस्या कोणती आहे?',
    title_en: 'What is the most pressing civic issue in your locality?',
    type: 'CHECKBOX',
    required: true,
    options: [
      'पिण्याचे पाणी / पाणीटंचाई',
      'रस्ते व खड्डे',
      'सांडपाणी व गटार व्यवस्था',
      'कचरा व स्वच्छता',
      'वारंवार वीजपुरवठा खंडित',
      'आरोग्य व दवाखाना सुविधा',
      'बेरोजगारी व रोजगार प्रश्न'
    ]
  },
  {
    id: 'q_welfare_schemes',
    title_mr: 'शासकीय कल्याणकारी योजनांचा लाभ आपल्या कुटुंबाला मिळाला आहे का?',
    title_en: 'Has your family received benefits from government welfare schemes?',
    type: 'RADIO',
    required: true,
    options: [
      'होय, लाडकी बहीण योजना',
      'होय, पीएम किसान / नमो शेतकरी',
      'होय, आयुष्यमान भारत / महात्मा फुले जनआरोग्य',
      'होय, मोफत रेशन धान्य',
      'नाही, कोणत्याही योजनेचा लाभ नाही'
    ]
  },
  {
    id: 'q_expectation',
    title_mr: 'आपल्या लोकप्रतिनिधी किंवा शासनाकडून आपली मुख्य अपेक्षा काय आहे?',
    title_en: 'What is your primary expectation from your representative / administration?',
    type: 'TEXT',
    required: false,
    options: []
  }
];

export default function PublicSurveyResponder() {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const [isMr, setIsMr] = useState(true);

  // Survey Meta
  const [formData, setFormData] = useState({
    title_mr: 'नागरी जनमत व विकास पाहणी सर्व्हे',
    title_en: 'Civic Sentiment & Development Survey',
    project_name: 'महाराष्ट्र लोककल्याण व विकास मोहीम',
    geographic_scope: 'ASSEMBLY',
    questions: DEFAULT_QUESTIONS
  });

  // Respondent Details
  const [respondentName, setRespondentName] = useState('');
  const [respondentMobile, setRespondentMobile] = useState('');
  const [taluka, setTaluka] = useState('मिरज (Miraj)');
  const [villageCity, setVillageCity] = useState('');
  const [ward, setWard] = useState('');
  const [address, setAddress] = useState('');

  // Responses
  const [answers, setAnswers] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchSurveyDetails();
  }, [uuid]);

  const fetchSurveyDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/public-survey/${uuid}`);
      if (res.data?.success && res.data?.data) {
        const d = res.data.data;
        const qList = (d.custom_questions && d.custom_questions.length > 0)
          ? d.custom_questions
          : (d.default_fields && d.default_fields.length > 0 ? d.default_fields : DEFAULT_QUESTIONS);

        setFormData({
          title_mr: d.form_title_mr || d.form_title || 'नागरी जनमत व विकास पाहणी सर्व्हे',
          title_en: d.form_title || 'Civic Sentiment & Development Survey',
          project_name: d.project_name || 'सार्वजनिक मोहीम',
          geographic_scope: d.geographic_scope || 'ASSEMBLY',
          questions: qList
        });
      }
    } catch (err) {
      console.warn('Backend public survey not reachable or mock; using fallback template:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRadioChange = (qId, option) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleCheckboxChange = (qId, option) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[qId]) ? [...prev[qId]] : [];
      if (current.includes(option)) {
        return { ...prev, [qId]: current.filter((x) => x !== option) };
      } else {
        return { ...prev, [qId]: [...current, option] };
      }
    });
  };

  const handleTextChange = (qId, val) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!respondentMobile.trim() || respondentMobile.trim().length < 10) {
      setErrorMsg(isMr ? 'कृपया वैध १० अंकी मोबाईल नंबर टाका.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    // Validate required questions
    for (const q of formData.questions) {
      if (q.required) {
        const ans = answers[q.id];
        if (!ans || (Array.isArray(ans) && ans.length === 0)) {
          setErrorMsg(isMr ? `कृपया "${q.title_mr || q.title_en}" या प्रश्नाचे उत्तर द्या.` : `Please answer "${q.title_en || q.title_mr}".`);
          return;
        }
      }
    }

    setSubmitting(true);
    const payload = {
      form_uuid: uuid,
      respondent_name: respondentName.trim(),
      respondent_mobile: respondentMobile.trim(),
      respondent_address: address.trim(),
      taluka,
      village: villageCity.trim(),
      city: villageCity.trim(),
      ward: ward.trim(),
      answers,
      submitted_at: new Date().toISOString()
    };

    try {
      const res = await axios.post(`${API_BASE}/public-survey/${uuid}/submit`, payload);
      setSubmissionId(res.data?.submission_id || `SRV-${Date.now().toString().slice(-6)}`);
      setSubmitted(true);
    } catch (err) {
      console.warn('API error, persisting response locally:', err);
      // Fallback local persistence so respondent never loses submission
      try {
        const stored = JSON.parse(localStorage.getItem('public_survey_submissions') || '[]');
        stored.push({ ...payload, id: `LOCAL-${Date.now()}` });
        localStorage.setItem('public_survey_submissions', JSON.stringify(stored));
      } catch (e) {}
      setSubmissionId(`SRV-${Date.now().toString().slice(-6)}`);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShareToWhatsApp = () => {
    const pageUrl = window.location.href;
    const shareText = isMr
      ? `📋 *${formData.title_mr}*\nमी हा सर्व्हे नुकताच भरला आहे. आपणही खालील अधिकृत लिंकवर क्लिक करून आपले मत व अभिप्राय नक्की नोंदवा:\n\n👉 ${pageUrl}\n\nधन्यवाद! 🙏`
      : `📋 *${formData.title_en}*\nI have completed this survey. Please submit your thoughts as well:\n\n👉 ${pageUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', flexDirection: 'column', gap: '12px', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>सर्व्हे फॉर्म लोड होत आहे...</span>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px 24px', maxWidth: '520px', width: '100%', boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.25)', textAlign: 'center', border: '2px solid #86efac' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 16px', boxShadow: '0 10px 20px rgba(22, 163, 74, 0.2)' }}>
            ✓
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#14532d', margin: '0 0 8px' }}>
            {isMr ? 'आपला सर्व्हे यशस्वीरित्या नोंदवला गेला आहे!' : 'Survey Submitted Successfully!'}
          </h2>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5', margin: '0 0 16px' }}>
            {isMr
              ? 'आपला बहुमूल्य अभिप्राय आणि माहिती आमच्याकडे सुरक्षितपणे जमा झाली आहे. लोककल्याणकारी नियोजन व विकासकामांसाठी आपल्या मताची मोलाची मदत होईल.'
              : 'Thank you for your valuable feedback. Your input has been saved and will assist in community development.'}
          </p>

          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px dashed #cbd5e1', display: 'inline-block', marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>पावती / सर्व्हे संदर्भ क्र: </span>
            <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>{submissionId}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              onClick={handleShareToWhatsApp}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                border: 'none',
                background: '#25D366',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)'
              }}
            >
              <span>📲</span>
              <span>{isMr ? 'इतरांना व्हॉट्सॲपवर पाठवा' : 'Share Form on WhatsApp'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setAnswers({});
                setRespondentName('');
                setRespondentMobile('');
              }}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '12px',
                border: '1.5px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                fontWeight: '700',
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              {isMr ? 'दुसऱ्या व्यक्तीचा सर्व्हे भरा' : 'Submit Another Response'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '16px 12px 40px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Top Header Card */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', borderRadius: '20px', padding: '24px 20px', color: '#ffffff', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.25)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '800', background: 'rgba(255, 255, 255, 0.2)', padding: '4px 10px', borderRadius: '20px', backdropFilter: 'blur(4px)' }}>
              🗳️ {formData.project_name}
            </span>
            <button
              type="button"
              onClick={() => setIsMr(!isMr)}
              style={{ background: 'rgba(255, 255, 255, 0.25)', border: 'none', color: '#ffffff', borderRadius: '8px', padding: '4px 10px', fontSize: '11.5px', fontWeight: '800', cursor: 'pointer' }}
            >
              {isMr ? 'English' : 'मराठी'}
            </button>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: '900', margin: '0 0 6px', lineHeight: '1.3' }}>
            {isMr ? formData.title_mr : formData.title_en}
          </h1>
          <p style={{ fontSize: '12.5px', color: '#bfdbfe', margin: 0 }}>
            {isMr ? 'आपल्या परिसराच्या विकासासाठी व समस्या निवारणासाठी आपले मत नोंदवा.' : 'Share your voice for neighborhood progress and public welfare.'}
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div style={{ background: '#fee2e2', border: '1.5px solid #ef4444', borderRadius: '12px', padding: '12px 16px', color: '#b91c1c', fontSize: '13px', fontWeight: '700' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Section 1: Respondent Basic Identity */}
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '18px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '850', color: '#0f172a', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>👤</span>
              <span>{isMr ? '१. आपली वैयक्तिक व पत्ता माहिती' : '1. Personal & Location Details'}</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '750', color: '#334155', marginBottom: '4px' }}>
                  {isMr ? 'आपले संपूर्ण नाव (Full Name)' : 'Full Name'}
                </label>
                <input
                  type="text"
                  placeholder={isMr ? 'उदा. राहुल सुरेश पाटील' : 'e.g. Rahul Patil'}
                  value={respondentName}
                  onChange={(e) => setRespondentName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '750', color: '#334155', marginBottom: '4px' }}>
                  {isMr ? 'मोबाईल / व्हॉट्सॲप नंबर *' : 'Mobile / WhatsApp Number *'}
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder={isMr ? '१० अंकी मोबाईल नंबर' : '10-digit number'}
                  value={respondentMobile}
                  onChange={(e) => setRespondentMobile(e.target.value.replace(/\D/g, ''))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '750', color: '#334155', marginBottom: '4px' }}>
                  {isMr ? 'तालुका (Taluka) *' : 'Taluka *'}
                </label>
                <select
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: '#ffffff' }}
                >
                  {SANGLI_TALUKAS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '750', color: '#334155', marginBottom: '4px' }}>
                  {isMr ? 'गाव किंवा शहर (Village / City) *' : 'Village / City *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isMr ? 'उदा. माधवनगर / सांगली' : 'e.g. Madhavnagar / Sangli'}
                  value={villageCity}
                  onChange={(e) => setVillageCity(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '750', color: '#334155', marginBottom: '4px' }}>
                  {isMr ? 'प्रभाग / वॉर्ड क्र. (Ward / Prabhag)' : 'Ward / Prabhag No.'}
                </label>
                <input
                  type="text"
                  placeholder={isMr ? 'उदा. प्रभाग क्र. ४' : 'e.g. Ward 4'}
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '750', color: '#334155', marginBottom: '4px' }}>
                  {isMr ? 'घर क्र. / गल्ली / परिसर' : 'House No. / Street'}
                </label>
                <input
                  type="text"
                  placeholder={isMr ? 'उदा. शिवाजी चौक परिसर' : 'Street address'}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Questions */}
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '18px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '850', color: '#0f172a', margin: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📝</span>
              <span>{isMr ? '२. पाहणी व अभिप्राय प्रश्न' : '2. Survey Questions'}</span>
            </h3>

            {formData.questions.map((q, idx) => {
              const qTitle = isMr ? (q.title_mr || q.title_en) : (q.title_en || q.title_mr);
              const qType = (q.type || 'RADIO').toUpperCase();

              return (
                <div key={q.id || idx} style={{ borderBottom: idx < formData.questions.length - 1 ? '1px solid #f1f5f9' : 'none', paddingBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '800', color: '#1e293b', marginBottom: '8px', lineHeight: '1.4' }}>
                    {idx + 1}. {qTitle} {q.required && <span style={{ color: '#ef4444' }}>*</span>}
                  </label>

                  {/* RADIO TYPE */}
                  {qType === 'RADIO' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {(q.options || []).map((opt, oIdx) => (
                        <label
                          key={oIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '9px 12px',
                            borderRadius: '10px',
                            border: answers[q.id] === opt ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                            background: answers[q.id] === opt ? '#eff6ff' : '#f8fafc',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: answers[q.id] === opt ? '750' : '550',
                            color: answers[q.id] === opt ? '#1d4ed8' : '#334155'
                          }}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            checked={answers[q.id] === opt}
                            onChange={() => handleRadioChange(q.id, opt)}
                            style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* CHECKBOX TYPE */}
                  {qType === 'CHECKBOX' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {(q.options || []).map((opt, oIdx) => {
                        const checked = Array.isArray(answers[q.id]) && answers[q.id].includes(opt);
                        return (
                          <label
                            key={oIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '9px 12px',
                              borderRadius: '10px',
                              border: checked ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                              background: checked ? '#eff6ff' : '#f8fafc',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: checked ? '750' : '550',
                              color: checked ? '#1d4ed8' : '#334155'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleCheckboxChange(q.id, opt)}
                              style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* DROPDOWN TYPE */}
                  {qType === 'DROPDOWN' && (
                    <select
                      value={answers[q.id] || ''}
                      onChange={(e) => handleTextChange(q.id, e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', background: '#ffffff', boxSizing: 'border-box' }}
                    >
                      <option value="">{isMr ? '-- पर्याय निवडा --' : '-- Select Option --'}</option>
                      {(q.options || []).map((opt, oIdx) => (
                        <option key={oIdx} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}

                  {/* NUMBER TYPE */}
                  {qType === 'NUMBER' && (
                    <input
                      type="number"
                      min={0}
                      value={answers[q.id] || ''}
                      onChange={(e) => handleTextChange(q.id, e.target.value)}
                      placeholder={isMr ? 'संख्या टाका...' : 'Enter number...'}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  )}

                  {/* TEXT TYPE */}
                  {(qType === 'TEXT' || qType === 'TEXTAREA') && (
                    <textarea
                      rows={2}
                      value={answers[q.id] || ''}
                      onChange={(e) => handleTextChange(q.id, e.target.value)}
                      placeholder={isMr ? 'आपला अभिप्राय येथे लिहा...' : 'Type your answer here...'}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical' }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              fontSize: '15.5px',
              fontWeight: '850',
              cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {submitting ? (
              <span>⏳ {isMr ? 'सबमिट होत आहे...' : 'Submitting...'}</span>
            ) : (
              <>
                <span>🗳️</span>
                <span>{isMr ? 'सर्व्हे फॉर्म सबमिट करा' : 'Submit Survey Form'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
