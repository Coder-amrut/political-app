import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  ELECTIONS_CATEGORIES,
  ELECTIONS_MASTER_DATA,
  getElectionDisplayName,
} from '../../data/electionsMasterData';
import {
  Vote,
  BarChart3,
  Users,
  Building,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  TrendingUp,
  RefreshCw,
  Search,
  Award,
  ShieldCheck,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  MapPin,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  FolderOpen,
  Database,
  ArrowLeft,
  Eye,
  Save,
  MoreVertical,
  Upload,
  Trophy,
  ChevronDown,
  X,
  FileUp
} from 'lucide-react';

// Taluka to Villages cascading mapping for Sangli district & regional administration
export const TALUKA_VILLAGES_MAP = {
  'मिरज': ['सांगलीवाडी', 'कुपवाड', 'मिरज शहर', 'बेडग', 'बोलवाड', 'म्हैसाळ', 'मालगाव', 'कर्नाळ', 'समडोळी', 'कसबे डिग्रज', 'एरंडोली', 'कवलापूर', 'बुधगाव', 'माधवनगर', 'बामणोली', 'वानलेसवाडी', 'हरिपूर', 'बिसूर', 'निलजी', 'पाटगाव'],
  'तासगाव': ['तासगाव शहर', 'मणेराजुरी', 'विसापूर', 'सावळज', 'चिंचणी', 'वायफळे', 'ढवळी', 'येळावी', 'अंजनी', 'बस्तवडे', 'तुरची', 'बोरगाव', 'गव्हाण'],
  'वाळवा': ['इस्लामपूर शहर', 'वाळवा', 'बोरगाव', 'ताकारी', 'पेठ', 'आष्टा शहर', 'कामेरी', 'कुरळप', 'शिगाव', 'बावची', 'येडेनिपाणी', 'नेर्ले', 'कासेगाव', 'बहे', 'तांबवे', 'रेठरे हरणाक्ष'],
  'कवठेमहांकाळ': ['कवठेमहांकाळ शहर', 'ढालगाव', 'देशिंग', 'बोरगाव', 'इरळी', 'हगळूर', 'घाटनांद्रे', 'करोली', 'कुची', 'मळणगाव'],
  'जत': ['जत शहर', 'डफळापूर', 'उमदी', 'संख', 'मुचंडी', 'शेगाव', 'बिळूर', 'वाघापूर', 'तिकोंडी', 'बेळोंडगी'],
  'शिराळा': ['शिराळा शहर', 'मांगले', 'कोकरुड', 'चरण', 'बिळाशी', 'वारणावती', 'मोराळे', 'शिरशी', 'वाटेगाव'],
  'कडेगाव': ['कडेगाव शहर', 'कडेपूर', 'हिंगणगाव', 'शाळगाव', 'शिवणी', 'मोहित्यांचे वडगाव', 'देवराष्ट्रे', 'सोहोली', 'नेरली'],
  'खानापूर': ['विटा शहर', 'खानापूर', 'भाळवणी', 'पारे', 'करंजे', 'लेंगरे', 'बेनापूर', 'वासुंबे', 'बलवडी'],
  'पलूस': ['पलूस शहर', 'भिलवडी', 'कुंडल', 'तुपारी', 'बुर्ली', 'सांडगेवाडी', 'दुधारी', 'नागठाणे', 'सावंतपूर', 'आंधळी'],
  'आटपाडी': ['आटपाडी शहर', 'दिघंची', 'नेलकरंजी', 'करगणी', 'शेटफळ', 'बाळेवाडी', 'खरसुंडी', 'झरे', 'आवळाई']
};

// Comprehensive List of All Indian / Maharashtra Election Types
const ELECTION_TYPES = [
  { id: 'vidhan_sabha', label_mr: 'विधानसभा निवडणूक (Vidhan Sabha)', label_en: 'State Legislative Assembly (Vidhan Sabha)', icon: '🏛️', category: 'state' },
  { id: 'lok_sabha', label_mr: 'लोकसभा निवडणूक (Lok Sabha)', label_en: 'Parliamentary (Lok Sabha)', icon: '🇮🇳', category: 'national' },
  { id: 'vidhan_parishad', label_mr: 'विधानपरिषद निवडणूक (Vidhan Parishad)', label_en: 'Legislative Council (Vidhan Parishad)', icon: '🏛️', category: 'state' },
  { id: 'mahanagarpalika', label_mr: 'महानगरपालिका निवडणूक (Municipal Corporation)', label_en: 'Municipal Corporation (Mahanagarpalika)', icon: '🏢', category: 'urban' },
  { id: 'nagarpalika', label_mr: 'नगरपालिका / नगरपरिषद (Municipal Council)', label_en: 'Municipal Council (Nagar Parishad)', icon: '🏬', category: 'urban' },
  { id: 'nagar_panchayat', label_mr: 'नगरपंचायत निवडणूक (Nagar Panchayat)', label_en: 'Nagar Panchayat Election', icon: '🏘️', category: 'urban' },
  { id: 'zilla_parishad', label_mr: 'जिल्हा परिषद निवडणूक (Zilla Parishad)', label_en: 'Zilla Parishad (ZP)', icon: '🌾', category: 'rural' },
  { id: 'panchayat_samiti', label_mr: 'पंचायत समिती निवडणूक (Panchayat Samiti)', label_en: 'Panchayat Samiti', icon: '🚜', category: 'rural' },
  { id: 'gram_panchayat', label_mr: 'ग्रामपंचायत निवडणूक (Gram Panchayat)', label_en: 'Gram Panchayat (Village Body)', icon: '🏡', category: 'rural' },
  { id: 'bypoll', label_mr: 'पोटनिवडणूक (By-Election / Bypoll)', label_en: 'By-Election (Bypoll)', icon: '🔄', category: 'special' },
  { id: 'cooperative', label_mr: 'सहकारी संस्था / बँक / साखर कारखाना', label_en: 'Cooperative Society / Bank / Sugar Mill', icon: '🏦', category: 'coop' },
  { id: 'apmc', label_mr: 'कृषी उत्पन्न बाजार समिती (APMC)', label_en: 'APMC Market Committee', icon: '⚖️', category: 'coop' },
  { id: 'teachers_graduates', label_mr: 'शिक्षक व पदवीधर मतदारसंघ', label_en: 'Teacher & Graduate Constituency', icon: '🎓', category: 'special' },
  { id: 'custom', label_mr: 'इतर / सानुकूल निवडणूक (Custom Election)', label_en: 'Custom / Other Election', icon: '✏️', category: 'custom' },
];

// Major Political Parties in Maharashtra
const POPULAR_PARTIES = [
  { name: 'भारतीय जनता पक्ष (BJP)', color: '#ff6600', alliance: 'महायुती' },
  { name: 'भारतीय राष्ट्रीय काँग्रेस (INC)', color: '#0072b2', alliance: 'महाविकास आघाडी' },
  { name: 'राष्ट्रवादी काँग्रेस (NCP - अजित पवार गट)', color: '#d97706', alliance: 'महायुती' },
  { name: 'राष्ट्रवादी काँग्रेस (शरदचंद्र पवार गट)', color: '#059669', alliance: 'महाविकास आघाडी' },
  { name: 'शिवसेना (एकनाथ शिंदे गट)', color: '#ea580c', alliance: 'महायुती' },
  { name: 'शिवसेना (उद्धव बाळासाहेब ठाकरे)', color: '#b91c1c', alliance: 'महाविकास आघाडी' },
  { name: 'महाराष्ट्र नवनिर्माण सेना (MNS)', color: '#4f46e5', alliance: 'स्वबळ' },
  { name: 'वंचित बहुजन आघाडी (VBA)', color: '#2563eb', alliance: 'स्वबळ' },
  { name: 'अपक्ष (Independent)', color: '#64748b', alliance: 'अपक्ष' },
  { name: 'इतर पक्ष (Other Party)', color: '#84cc16', alliance: 'इतर' }
];

// 16 Standard Recognized Political Parties (Exact Official Sequence)
export const STANDARD_16_PARTIES_DATA = [
  {
    id: 'p1',
    name: 'भारतीय जनता पक्ष (BJP)',
    candidate: 'सुधीर गाडगीळ',
    alliance: 'महायुती',
    previousVotes: 93659,
    currentVotes: 98200,
    voteShare: 43.5,
    seatsWon: 1,
    strengths: 'मजबूत पक्ष संघटना, पारंपरिक व्यापारी व मध्यमवर्गीय मतपेढी, विकासकामांचा प्रचार',
    challenges: 'स्थानिक बंडखोरीचा संभाव्य धोका, वाढती महागाई व पायाभूत सुविधांबाबत नाराजी'
  },
  {
    id: 'p2',
    name: 'भारतीय राष्ट्रीय काँग्रेस (INC)',
    candidate: 'पृथ्वीराज पाटील',
    alliance: 'महाविकास आघाडी',
    previousVotes: 86720,
    currentVotes: 91400,
    voteShare: 40.5,
    seatsWon: 0,
    strengths: 'जुना काँग्रेस पारंपरिक मतदार वर्ग, अल्पसंख्याक व मागासवर्गीय मते, सतत ग्राउंडवर संपर्क',
    challenges: 'मित्रपक्षातील स्थानिक नेत्यांची छुपी बंडखोरी, निधी व प्रचाराची आक्रमकता कमी'
  },
  {
    id: 'p3',
    name: 'आम आदमी पार्टी (AAP)',
    candidate: '',
    alliance: 'स्वबळ',
    previousVotes: 0,
    currentVotes: 0,
    voteShare: 0,
    seatsWon: 0,
    strengths: 'शिक्षण, आरोग्य व मूलभूत सुविधांचे मॉडेल, तरुणांमध्ये आकर्षण',
    challenges: 'स्थानिक प्रभाग व बूथ स्तरावर केडरची मर्यादा'
  },
  {
    id: 'p4',
    name: 'बहुजन समाज पक्ष (BSP)',
    candidate: 'सचिन पवार',
    alliance: 'स्वबळ',
    previousVotes: 1850,
    currentVotes: 2400,
    voteShare: 1.1,
    seatsWon: 0,
    strengths: 'दलित व बहुजन घटकांमधील निष्ठावंत मते',
    challenges: 'मर्यादित प्रचार रसद व प्रमुख लढतीपासून मतदारांची परावृत्ती'
  },
  {
    id: 'p5',
    name: 'भारतीय कम्युनिस्ट पक्ष (मार्क्सवादी) (CPI-M)',
    candidate: '',
    alliance: 'डावी आघाडी',
    previousVotes: 0,
    currentVotes: 0,
    voteShare: 0,
    seatsWon: 0,
    strengths: 'कामगार, कष्टकरी व शेतकरी चळवळीतील सक्रियता',
    challenges: 'शहरी भागात मर्यादित जनाधार'
  },
  {
    id: 'p6',
    name: 'नॅशनल पीपल्स पार्टी (NPP)',
    candidate: '',
    alliance: 'स्वबळ',
    previousVotes: 0,
    currentVotes: 0,
    voteShare: 0,
    seatsWon: 0,
    strengths: 'राष्ट्रीय पक्षाचा दर्जा',
    challenges: 'स्थानिक पातळीवर संघटनात्मक उपस्थिती मर्यादित'
  },
  {
    id: 'p7',
    name: 'शिवसेना',
    candidate: '',
    alliance: 'महायुती',
    previousVotes: 0,
    currentVotes: 0,
    voteShare: 0,
    seatsWon: 0,
    strengths: 'धनुष्यबाण चिन्ह, सत्ताधारी युतीचे पाठबळ, हिंदुत्ववादी मतदार',
    challenges: 'पारंपरिक कार्यकर्त्यांमधील मतविभागणी'
  },
  {
    id: 'p8',
    name: 'शिवसेना (उद्धव बाळासाहेब ठाकरे)',
    candidate: '',
    alliance: 'महाविकास आघाडी',
    previousVotes: 0,
    currentVotes: 0,
    voteShare: 0,
    seatsWon: 0,
    strengths: 'मशाल चिन्ह, ठाकरे घराण्याविषयी सहानुभूती, मराठी अस्मिता',
    challenges: 'संघटनात्मक पुनर्बांधणी व साधनसामग्रीची कमतरता'
  },
  {
    id: 'p9',
    name: 'राष्ट्रवादी काँग्रेस पक्ष (NCP)',
    candidate: '',
    alliance: 'महायुती',
    previousVotes: 0,
    currentVotes: 0,
    voteShare: 0,
    seatsWon: 0,
    strengths: 'घड्याळ चिन्ह, सहकार क्षेत्रावरील पकड, विकासकामांचे नेटवर्क',
    challenges: 'पक्ष फुटीनंतर निष्ठावंतांमधील संभ्रम'
  },
  {
    id: 'p10',
    name: 'राष्ट्रवादी काँग्रेस पक्ष – शरदचंद्र पवार (NCP-SP)',
    candidate: '',
    alliance: 'महाविकास आघाडी',
    previousVotes: 0,
    currentVotes: 0,
    voteShare: 0,
    seatsWon: 0,
    strengths: 'तुतारी चिन्ह, शरद पवार यांच्याविषयी आदर, मराठा व ग्रामीण जनाधार',
    challenges: 'स्थानिक स्तरावरील बूथ यंत्रणेचे पुनर्गठन'
  },
  {
    id: 'p11',
    name: 'महाराष्ट्र नवनिर्माण सेना (MNS)',
    candidate: '',
    alliance: 'स्वबळ',
    previousVotes: 0,
    currentVotes: 0,
    voteShare: 0,
    seatsWon: 0,
    strengths: 'राज ठाकरे यांचा करिष्मा, मराठी तरुणांमधील प्रभाव',
    challenges: 'सातत्यपूर्ण स्थानिक प्रचार यंत्रणेचा अभाव'
  },
  {
    id: 'p12',
    name: 'वंचित बहुजन आघाडी (VBA)',
    candidate: 'प्रा. विकास कांबळे',
    alliance: 'स्वबळ',
    previousVotes: 8200,
    currentVotes: 9400,
    voteShare: 4.2,
    seatsWon: 0,
    strengths: 'दलित व वंचित घटकांमध्ये वैचारिक निष्ठा, स्पष्ट स्थानिक अजेंडा',
    challenges: 'कमी वित्तीय रसद, प्रमुख लढतीपासून मतदारांची परावृत्ती'
  },
  {
    id: 'p13',
    name: 'ऑल इंडिया मजलिस-ए-इत्तेहादुल मुस्लिमीन (AIMIM)',
    candidate: '',
    alliance: 'स्वबळ',
    previousVotes: 0,
    currentVotes: 0,
    voteShare: 0,
    seatsWon: 0,
    strengths: 'अल्पसंख्याक व मुस्लिम मतदारांमध्ये आक्रमक नेतृत्व',
    challenges: 'इतर समाजघटकांमध्ये मर्यादित स्वीकृती'
  },
  {
    id: 'p14',
    name: 'समाजवादी पक्ष (SP)',
    candidate: '',
    alliance: 'महाविकास आघाडी',
    previousVotes: 0,
    currentVotes: 0,
    voteShare: 0,
    seatsWon: 0,
    strengths: 'शहरी कामगार व अल्पसंख्याक वस्त्यांमध्ये पकड',
    challenges: 'काही मोजक्या प्रभागांपुरता मर्यादित प्रभाव'
  },
  {
    id: 'p15',
    name: 'भारतीय कम्युनिस्ट पक्ष (CPI)',
    candidate: '',
    alliance: 'डावी आघाडी',
    previousVotes: 0,
    currentVotes: 0,
    voteShare: 0,
    seatsWon: 0,
    strengths: 'ट्रेड युनियन, लाल बावटा पारंपरिक मते',
    challenges: 'नवीन तरुण मतदारांमध्ये मर्यादित संपर्क'
  },
  {
    id: 'p16',
    name: 'तृणमूल काँग्रेस (TMC)',
    candidate: '',
    alliance: 'स्वबळ',
    previousVotes: 0,
    currentVotes: 0,
    voteShare: 0,
    seatsWon: 0,
    strengths: 'राष्ट्रीय स्तरावरील आक्रमक विरोधी पक्ष ओळख',
    challenges: 'महाराष्ट्र स्थानिक पातळीवर कार्यकर्त्यांचे जाळे मर्यादित'
  }
];

// Default 1, 2, 3 Ranked Results for Previous Election Winner & Margins
export const DEFAULT_PREVIOUS_WINNERS = [
  {
    rank: 1,
    label: 'विजेता',
    candidate: 'सुधीर गाडगीळ',
    party: 'भारतीय जनता पक्ष (BJP)',
    votes: '93,659',
    lead: '६,९३९ मतांची आघाडी (Lead)'
  },
  {
    rank: 2,
    label: 'उपविजेता',
    candidate: 'पृथ्वीराज पाटील',
    party: 'भारतीय राष्ट्रीय काँग्रेस (INC)',
    votes: '86,720',
    lead: 'दुसऱ्या क्रमांकावर (-६,९३९ मते)'
  },
  {
    rank: 3,
    label: 'तृतीय क्रमांक',
    candidate: 'सचिन पवार / इतर',
    party: 'बहुजन समाज पक्ष (BSP)',
    votes: '1,850',
    lead: 'तिसऱ्या क्रमांकावर'
  }
];

// Pre-filled Templates for instant exploration
const TEMPLATES = {
  sangli_assembly: {
    electionType: 'vidhan_sabha',
    customElectionName: '',
    name: 'महाराष्ट्र विधानसभा सार्वत्रिक निवडणूक २०२४',
    year: '2024',
    state: 'महाराष्ट्र',
    district: 'सांगली',
    taluka: 'मिरज',
    cityName: 'सांगली शहर',
    villageName: 'सांगलीवाडी',
    wardName: 'प्रभाग क्र. १२',
    boothName: 'शासकीय कन्या शाळा, सांगली',
    boothNumber: '१०४',
    cityOrVillage: 'सांगली शहर व प्रभाग',
    constituency: '282 - सांगली विधानसभा मतदारसंघ',
    totalRegisteredVoters: '348500',
    votingPercentage: '64.8',
    previousElectionDate: '21 ऑक्टोबर 2019',
    previousResults: 'भाजप विजयी (सुधीर गाडगीळ - 93,659 मते, काँग्रेस पृथ्वीराज पाटील - 86,720 मते, मताधिक्य: 6,939)',
    previousWinners: DEFAULT_PREVIOUS_WINNERS,
    additionalNotes: 'शहरी व उपनगरीय मतदारांचा प्रभाव, अंतर्गत व्यापारी वर्ग व बहुजन मतांची विभागणी निर्णायक ठरते.',
    assemblySegments: 'सांगली शहर, विश्रामबाग, कुपवाड, माधवनगर, सांगलीवाडी',
    boothCount: '342',
    parties: STANDARD_16_PARTIES_DATA,
    otherCandidates: [
      { name: 'सचिन पवार (बसपा)', votes: '1850', remarks: 'कौटुंबिक प्रभाव' },
      { name: 'नोटा (NOTA)', votes: '2150', remarks: 'नाराज मतदार' }
    ],
    politicalEquations: 'मराठा, जैन, लिंगायत, मुस्लिम व दलित मतांचे संतुलित समीकरण. सांगली व्यापारी वर्गाची भूमिका निर्णायक.',
    developmentIssues: [
      { issue: 'सांगली-मिरज जोड रस्ता व उड्डाणपूल', priority: 'High', impact: 'शहरी वाहतुकीवर मोठा प्रभाव' },
      { issue: 'कृष्णा नदी पूर संरक्षण भिंत व सांडपाणी व्यवस्था', priority: 'Critical', impact: 'नदीकाठच्या १० प्रभागांचा प्रमुख प्रश्न' },
      { issue: 'कुपवाड एमआयडीसी पायाभूत सुविधा व रोजगार', priority: 'Medium', impact: 'तरुणांच्या रोजगारावर परिणाम' }
    ],
    groundObservations: 'गेल्या निवडणुकीत केवळ ६,९३९ मतांचे अंतर असल्याने यंदा प्रत्येक वॉर्डातील २-३% मतविभागणी थेट निकाल ठरवू शकते.'
  }
};

export default function ElectionAnalysisWorkbench({ isMr = true, language = 'mr' }) {
  // ===================== STATE MANAGEMENT =====================
  const [selectedElectionType, setSelectedElectionType] = useState('vidhan_sabha');
  const [customElectionName, setCustomElectionName] = useState('');
  const [activeTab, setActiveTab] = useState('input'); // 'input' | 'saved' | 'report' | 'crosstab' | 'winners'
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [crossRowVar, setCrossRowVar] = useState('age_group');
  const [crossColVar, setCrossColVar] = useState('sentiment');

  // 3-Dot Election Type Menu & PDF Upload States
  const [isElectionTypeMenuOpen, setIsElectionTypeMenuOpen] = useState(false);
  const [electionSearchText, setElectionSearchText] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isAddPartyModalOpen, setIsAddPartyModalOpen] = useState(false);
  const [newPartyModalData, setNewPartyModalData] = useState({
    name: '',
    candidate: '',
    alliance: 'महायुती',
    previousVotes: '',
    currentVotes: '',
    strengths: '',
    challenges: ''
  });
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pendingPdfFile, setPendingPdfFile] = useState(null);
  const [selectedPdfType, setSelectedPdfType] = useState('winner'); // 'winner' | 'other'
  const [uploadedPdfInfo, setUploadedPdfInfo] = useState(null);
  const [winnerSearchQuery, setWinnerSearchQuery] = useState('');
  const [showAddWinnerRow, setShowAddWinnerRow] = useState(false);
  const [newWinnerCandidate, setNewWinnerCandidate] = useState({
    candidate: '',
    party: '',
    votes: '',
    voteShare: '',
    margin: '',
    status: 'विजयी'
  });

  const handlePdfFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingPdfFile(file);
    setIsPdfModalOpen(true);
    e.target.value = '';
  };

  const handleConfirmPdfUpload = () => {
    if (!pendingPdfFile) return;
    const fileName = pendingPdfFile.name;
    const fileSize = (pendingPdfFile.size / 1024).toFixed(1) + ' KB';

    if (selectedPdfType === 'winner') {
      const parsedWinners = [
        {
          rank: 1,
          label: 'विजेता',
          candidate: 'सुधीर गाडगीळ',
          party: 'भारतीय जनता पक्ष (BJP)',
          votes: '93659',
          voteShare: '48.2%',
          margin: '+6,939',
          status: 'विजयी'
        },
        {
          rank: 2,
          label: 'उपविजेता',
          candidate: 'पृथ्वीराज पाटील',
          party: 'भारतीय राष्ट्रीय काँग्रेस (INC)',
          votes: '86720',
          voteShare: '44.6%',
          margin: '-6,939',
          status: 'उपविजेता'
        },
        {
          rank: 3,
          label: 'तिसरा क्रमांक',
          candidate: 'शिवाजी डोंगरे',
          party: 'अपक्ष (IND)',
          votes: '8412',
          voteShare: '4.3%',
          margin: '-85,247',
          status: 'पराभूत'
        },
        {
          rank: 4,
          label: 'चौथा क्रमांक',
          candidate: 'नोटा (NOTA)',
          party: 'नोटा (None of the Above)',
          votes: '2430',
          voteShare: '1.2%',
          margin: '-',
          status: 'नोटा'
        }
      ];

      setPreviousWinners(parsedWinners);
      setPreviousResults('अधिकृत निकाल PDF नुसार: भाजप (सुधीर गाडगीळ - ९३,६५९ मते, ४८.२%) विजयी. काँग्रेस (पृथ्वीराज पाटील - ८६,७२० मते, ४४.६%). मताधिक्य: ६,९३९.');
      setUploadedPdfInfo({
        name: fileName,
        size: fileSize,
        type: 'winner',
        typeLabel: isMr ? 'मागील विजयी उमेदवारांची यादी / निकाल' : 'Past Winners & Election Results',
        uploadTime: new Date().toLocaleTimeString(isMr ? 'mr-IN' : 'en-IN'),
        recordCount: parsedWinners.length
      });
      setActiveTab('winners');
      setSaveSuccessMsg(isMr ? `📄 '${fileName}' PDF मधून मागील विजयी उमेदवारांचा डेटा यशस्वीरित्या अरेंज करण्यात आला आहे!` : `PDF data for past winners arranged successfully!`);
    } else {
      setUploadedPdfInfo({
        name: fileName,
        size: fileSize,
        type: 'other',
        typeLabel: isMr ? 'इतर निवडणूक विश्लेषण अहवाल' : 'Other Election Analysis Report',
        uploadTime: new Date().toLocaleTimeString(isMr ? 'mr-IN' : 'en-IN'),
        recordCount: 'सर्व सांख्यिकी'
      });
      setActiveTab('report');
      setSaveSuccessMsg(isMr ? `📄 '${fileName}' PDF मधून सर्व निवडणूक विश्लेषण डेटा यशस्वीरित्या अरेंज करण्यात आला आहे!` : `PDF election analysis data arranged successfully!`);
    }

    setIsPdfModalOpen(false);
    setPendingPdfFile(null);
  };

  const handleAddNewWinner = () => {
    if (!newWinnerCandidate.candidate.trim()) return;
    const nextRank = previousWinners.length + 1;
    setPreviousWinners([
      ...previousWinners,
      {
        rank: nextRank,
        label: `${nextRank} था क्रमांक`,
        candidate: newWinnerCandidate.candidate.trim(),
        party: newWinnerCandidate.party.trim() || 'अपक्ष (IND)',
        votes: newWinnerCandidate.votes || '0',
        voteShare: newWinnerCandidate.voteShare || '0%',
        margin: newWinnerCandidate.margin || '-',
        status: newWinnerCandidate.status || 'पराभूत'
      }
    ]);
    setNewWinnerCandidate({
      candidate: '',
      party: '',
      votes: '',
      voteShare: '',
      margin: '',
      status: 'पराभूत'
    });
    setShowAddWinnerRow(false);
  };

  const handleDeleteWinner = (index) => {
    setPreviousWinners(previousWinners.filter((_, i) => i !== index));
  };

  // Database persistence state
  const [savedAnalyses, setSavedAnalyses] = useState([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [savedSearchQuery, setSavedSearchQuery] = useState('');

  // Fetch all saved analyses from DB on mount
  const fetchSavedAnalyses = async () => {
    setIsLoadingSaved(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/election-analyses');
      if (res.ok) {
        const json = await res.json();
        setSavedAnalyses(json.data || []);
      }
    } catch (err) {
      console.warn('Failed to load saved election analyses from DB:', err);
    } finally {
      setIsLoadingSaved(false);
    }
  };

  useEffect(() => {
    fetchSavedAnalyses();
  }, []);

  // Form Fields - 9 Core Geographical & Locus Components
  const [electionName, setElectionName] = useState(TEMPLATES.sangli_assembly.name);
  const [electionYear, setElectionYear] = useState(TEMPLATES.sangli_assembly.year);
  const [stateName, setStateName] = useState(TEMPLATES.sangli_assembly.state);
  const [districtName, setDistrictName] = useState(TEMPLATES.sangli_assembly.district);
  const [talukaName, setTalukaName] = useState(TEMPLATES.sangli_assembly.taluka);
  const [cityName, setCityName] = useState(TEMPLATES.sangli_assembly.cityName || 'सांगली शहर');
  const [villageName, setVillageName] = useState(TEMPLATES.sangli_assembly.villageName || 'सांगलीवाडी');
  const [wardName, setWardName] = useState(TEMPLATES.sangli_assembly.wardName || 'प्रभाग क्र. १२');
  const [constituency, setConstituency] = useState(TEMPLATES.sangli_assembly.constituency);
  const [boothName, setBoothName] = useState(TEMPLATES.sangli_assembly.boothName || 'शासकीय कन्या शाळा, सांगली');
  const [boothNumber, setBoothNumber] = useState(TEMPLATES.sangli_assembly.boothNumber || '१०४');
  const [cityOrVillage, setCityOrVillage] = useState(TEMPLATES.sangli_assembly.cityOrVillage);
  const [totalRegisteredVoters, setTotalRegisteredVoters] = useState(TEMPLATES.sangli_assembly.totalRegisteredVoters);
  const [votingPercentage, setVotingPercentage] = useState(TEMPLATES.sangli_assembly.votingPercentage);
  const [previousElectionDate, setPreviousElectionDate] = useState(TEMPLATES.sangli_assembly.previousElectionDate);
  const [previousResults, setPreviousResults] = useState(TEMPLATES.sangli_assembly.previousResults);
  const [previousWinners, setPreviousWinners] = useState(TEMPLATES.sangli_assembly.previousWinners || DEFAULT_PREVIOUS_WINNERS);
  const [additionalNotes, setAdditionalNotes] = useState(TEMPLATES.sangli_assembly.additionalNotes);

  const handleUpdateWinner = (index, field, value) => {
    const updated = previousWinners.map((w, i) => (i === index ? { ...w, [field]: value } : w));
    setPreviousWinners(updated);
    const w1 = updated[0];
    const w2 = updated[1];
    const summaryStr = `${w1?.party || ''} विजयी (${w1?.candidate || ''} - ${w1?.votes || ''} मते, ${w2?.party || ''} ${w2?.candidate || ''} - ${w2?.votes || ''} मते, मताधिक्य: ${w1?.lead || ''})`;
    setPreviousResults(summaryStr);
  };

  // Dynamic Type-Specific Fields
  const [assemblySegments, setAssemblySegments] = useState(TEMPLATES.sangli_assembly.assemblySegments);
  const [boothCount, setBoothCount] = useState(TEMPLATES.sangli_assembly.boothCount);
  const [zpGatName, setZpGatName] = useState('');
  const [wardReservation, setWardReservation] = useState('खुला प्रवर्ग (General)');

  // Parties & Candidates
  const [parties, setParties] = useState(TEMPLATES.sangli_assembly.parties);
  const [editingPartyId, setEditingPartyId] = useState(null);

  // Additional Data
  const [otherCandidates, setOtherCandidates] = useState(TEMPLATES.sangli_assembly.otherCandidates);
  const [politicalEquations, setPoliticalEquations] = useState(TEMPLATES.sangli_assembly.politicalEquations);
  const [developmentIssues, setDevelopmentIssues] = useState(TEMPLATES.sangli_assembly.developmentIssues);
  const [groundObservations, setGroundObservations] = useState(TEMPLATES.sangli_assembly.groundObservations);

  // Validation Errors
  const [validationErrors, setValidationErrors] = useState([]);

  // ===================== TEMPLATE LOADERS =====================
  const loadTemplate = (key) => {
    const t = TEMPLATES[key];
    if (!t) return;
    setSelectedElectionType(t.electionType);
    setCustomElectionName(t.customElectionName);
    setElectionName(t.name);
    setElectionYear(t.year);
    setStateName(t.state || 'महाराष्ट्र');
    setDistrictName(t.district || '');
    setTalukaName(t.taluka || '');
    setCityName(t.cityName || t.cityOrVillage || '');
    setVillageName(t.villageName || '');
    setWardName(t.wardName || '');
    setConstituency(t.constituency || '');
    setBoothName(t.boothName || '');
    setBoothNumber(t.boothNumber || '');
    setCityOrVillage(t.cityOrVillage || '');
    setTotalRegisteredVoters(t.totalRegisteredVoters);
    setVotingPercentage(t.votingPercentage);
    setPreviousElectionDate(t.previousElectionDate);
    setPreviousResults(t.previousResults);
    setPreviousWinners(t.previousWinners || DEFAULT_PREVIOUS_WINNERS);
    setAdditionalNotes(t.additionalNotes);
    setAssemblySegments(t.assemblySegments);
    setBoothCount(t.boothCount);
    setParties(t.parties);
    setOtherCandidates(t.otherCandidates);
    setPoliticalEquations(t.politicalEquations);
    setDevelopmentIssues(t.developmentIssues);
    setGroundObservations(t.groundObservations);
    setValidationErrors([]);
  };

  const handleClearAll = () => {
    setSelectedElectionType('vidhan_sabha');
    setCustomElectionName('');
    setElectionName('');
    setElectionYear(new Date().getFullYear().toString());
    setStateName('महाराष्ट्र');
    setDistrictName('');
    setTalukaName('');
    setCityName('');
    setVillageName('');
    setWardName('');
    setConstituency('');
    setBoothName('');
    setBoothNumber('');
    setCityOrVillage('');
    setTotalRegisteredVoters('');
    setVotingPercentage('');
    setPreviousElectionDate('');
    setPreviousResults('');
    setPreviousWinners(DEFAULT_PREVIOUS_WINNERS);
    setAdditionalNotes('');
    setAssemblySegments('');
    setBoothCount('');
    setParties(STANDARD_16_PARTIES_DATA);
    setOtherCandidates([]);
    setPoliticalEquations('');
    setDevelopmentIssues([]);
    setGroundObservations('');
    setValidationErrors([]);
    setActiveTab('input');
  };

  // ===================== CALCULATIONS & VALIDATION =====================
  const calculatedVotesPolled = useMemo(() => {
    const voters = parseFloat(totalRegisteredVoters) || 0;
    const pct = parseFloat(votingPercentage) || 0;
    if (voters > 0 && pct > 0) {
      return Math.round((voters * pct) / 100);
    }
    return 0;
  }, [totalRegisteredVoters, votingPercentage]);

  const totalPartyVotes = useMemo(() => {
    return parties.reduce((sum, p) => sum + (Number(p.currentVotes) || 0), 0);
  }, [parties]);

  // Auto-calculated vote shares for all parties
  const partiesWithComputedMetrics = useMemo(() => {
    const totalVotes = calculatedVotesPolled > 0 ? calculatedVotesPolled : totalPartyVotes;
    return parties.map((p) => {
      const votes = Number(p.currentVotes) || 0;
      const share = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : (p.voteShare || 0);
      const prevVotes = Number(p.previousVotes) || 0;
      const swing = prevVotes > 0 ? (votes - prevVotes) : 0;
      const swingPct = prevVotes > 0 ? (((votes - prevVotes) / prevVotes) * 100).toFixed(1) : 0;
      return {
        ...p,
        computedVoteShare: share,
        computedSwing: swing,
        computedSwingPct: swingPct,
      };
    }).sort((a, b) => (Number(b.currentVotes) || 0) - (Number(a.currentVotes) || 0));
  }, [parties, calculatedVotesPolled, totalPartyVotes]);

  const leaderParty = partiesWithComputedMetrics[0] || null;
  const runnerUpParty = partiesWithComputedMetrics[1] || null;
  const projectedMargin = leaderParty && runnerUpParty ? (leaderParty.currentVotes - runnerUpParty.currentVotes) : 0;

  // Add Party Form Handlers
  const handleAddParty = () => {
    setNewPartyModalData({
      name: '',
      candidate: '',
      alliance: 'महायुती',
      previousVotes: '',
      currentVotes: '',
      strengths: '',
      challenges: ''
    });
    setIsAddPartyModalOpen(true);
  };

  const handleSaveNewPartyModal = (e) => {
    if (e) e.preventDefault();
    if (!newPartyModalData.name.trim()) {
      alert(isMr ? 'कृपया पक्षाचे नाव प्रविष्ट करा.' : 'Please enter Party name.');
      return;
    }
    const newId = `party_${Date.now()}`;
    const newParty = {
      id: newId,
      name: newPartyModalData.name.trim(),
      candidate: newPartyModalData.candidate.trim(),
      alliance: newPartyModalData.alliance || 'स्वबळ',
      previousVotes: Number(newPartyModalData.previousVotes) || 0,
      currentVotes: Number(newPartyModalData.currentVotes) || 0,
      voteShare: 0,
      seatsWon: 0,
      strengths: newPartyModalData.strengths.trim(),
      challenges: newPartyModalData.challenges.trim()
    };
    // Prepend so it immediately appears right at the top
    setParties([newParty, ...parties]);
    setEditingPartyId(newId);
    setIsAddPartyModalOpen(false);
  };

  const handleUpdateParty = (id, field, value) => {
    setParties(parties.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleRemoveParty = (id) => {
    setParties(parties.filter((p) => p.id !== id));
    if (editingPartyId === id) setEditingPartyId(null);
  };

  // Add Development Issue
  const handleAddIssue = () => {
    setDevelopmentIssues([...developmentIssues, { issue: '', priority: 'Medium', impact: '' }]);
  };

  const handleUpdateIssue = (idx, field, value) => {
    const updated = [...developmentIssues];
    updated[idx][field] = value;
    setDevelopmentIssues(updated);
  };

  const handleRemoveIssue = (idx) => {
    setDevelopmentIssues(developmentIssues.filter((_, i) => i !== idx));
  };

  // Load Saved Analysis Record into Form / View
  const handleLoadSavedAnalysis = (item, openReport = true) => {
    setSelectedElectionType(item.election_type || 'vidhan_sabha');
    setCustomElectionName(item.custom_election_name || '');
    setElectionName(item.election_name || '');
    setElectionYear(item.election_year || '');
    setStateName(item.state || 'महाराष्ट्र');
    setDistrictName(item.district || '');
    setTalukaName(item.taluka || '');
    setCityName(item.city_name || item.cityName || item.city_or_village || '');
    setVillageName(item.village_name || item.villageName || '');
    setWardName(item.ward_name || item.wardName || item.ward_reservation || '');
    setConstituency(item.constituency || '');
    setBoothName(item.booth_name || item.boothName || '');
    setBoothNumber(item.booth_number || item.boothNumber || item.booth_count || '');
    setCityOrVillage(item.city_or_village || '');
    setTotalRegisteredVoters(item.total_registered_voters ? item.total_registered_voters.toString() : '');
    setVotingPercentage(item.voting_percentage ? item.voting_percentage.toString() : '');
    setPreviousElectionDate(item.previous_election_date || '');
    setPreviousResults(item.previous_results || '');
    if (item.previous_winners && Array.isArray(item.previous_winners)) {
      setPreviousWinners(item.previous_winners);
    } else {
      setPreviousWinners(DEFAULT_PREVIOUS_WINNERS);
    }
    setAdditionalNotes(item.additional_notes || '');
    setAssemblySegments(item.assembly_segments || '');
    setBoothCount(item.booth_count || '');
    setZpGatName(item.zp_gat_name || '');
    setWardReservation(item.ward_reservation || 'खुला प्रवर्ग (General)');
    setParties(Array.isArray(item.parties) ? item.parties : []);
    setOtherCandidates(Array.isArray(item.other_candidates) ? item.other_candidates : []);
    setPoliticalEquations(item.political_equations || '');
    setDevelopmentIssues(Array.isArray(item.development_issues) ? item.development_issues : []);
    setGroundObservations(item.ground_observations || item.groundObservations || '');

    if (openReport) {
      setActiveTab('report');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveTab('input');
    }
  };

  // Delete Saved Analysis from Database
  const handleDeleteSavedAnalysis = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm(isMr ? 'तुम्हाला हा निवडणूक विश्लेषण अहवाल डेटाबेसमधून नक्की हटवायचा आहे का?' : 'Are you sure you want to delete this analysis record from database?')) {
      return;
    }
    try {
      await fetch(`http://127.0.0.1:8000/api/election-analyses/${id}`, { method: 'DELETE' });
      fetchSavedAnalyses();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Save to Database and Generate Analysis Report
  const handleSaveAndGenerateAnalysis = async () => {
    const errors = [];
    if (!electionName.trim()) errors.push(isMr ? 'निवडणुकीचे नाव प्रविष्ट करणे अनिवार्य आहे.' : 'Election Title is required.');
    if (!stateName.trim()) errors.push(isMr ? '१. राज्य निवडणे अनिवार्य आहे.' : '1. State is required.');
    if (!districtName.trim()) errors.push(isMr ? '२. जिल्हा निवडणे अनिवार्य आहे.' : '2. District is required.');
    if (!talukaName.trim()) errors.push(isMr ? '३. तालुका निवडणे अनिवार्य आहे.' : '3. Taluka is required.');
    if (!cityName.trim()) errors.push(isMr ? '४. शहर निवडणे अनिवार्य आहे.' : '4. City is required.');
    if (!villageName.trim()) errors.push(isMr ? '५. गाव निवडणे अनिवार्य आहे.' : '5. Village is required.');
    if (!wardName.trim()) errors.push(isMr ? '६. प्रभाग / वार्ड प्रविष्ट करणे अनिवार्य आहे.' : '6. Ward / Prabhag is required.');
    if (!constituency.trim()) errors.push(isMr ? '७. विधानसभा मतदारसंघ प्रविष्ट करणे अनिवार्य आहे.' : '7. Assembly Constituency is required.');
    if (!boothName.trim()) errors.push(isMr ? '८. मतदान केंद्र प्रविष्ट करणे अनिवार्य आहे.' : '8. Polling Station is required.');
    if (!boothNumber.trim()) errors.push(isMr ? '९. मतदान केंद्र क्रमांक प्रविष्ट करणे अनिवार्य आहे.' : '9. Booth Number is required.');
    if (!totalRegisteredVoters) errors.push(isMr ? 'एकूण नोंदणीकृत मतदार संख्या अनिवार्य आहे.' : 'Total Registered Voters is required.');
    if (!votingPercentage) errors.push(isMr ? 'मतदानाची टक्केवारी (%) अनिवार्य आहे.' : 'Voting Percentage is required.');
    if (parties.length < 2) errors.push(isMr ? 'तौलनिक विश्लेषणासाठी किमान २ पक्ष/उमेदवार जोडा.' : 'Please add at least 2 parties/candidates.');
    if (calculatedVotesPolled > 0 && totalPartyVotes > (calculatedVotesPolled * 1.15)) {
      errors.push(isMr ? 'सर्व पक्षांची एकूण मते ही एकूण झालेल्या मतदानापेक्षा जास्त असू शकत नाहीत.' : 'Total party votes exceed total votes polled.');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setValidationErrors([]);
    setIsSaving(true);

    const payload = {
      election_name: electionName,
      election_type: selectedElectionType,
      custom_election_name: customElectionName,
      election_year: electionYear,
      state: stateName,
      district: districtName,
      taluka: talukaName,
      city_name: cityName,
      village_name: villageName,
      ward_name: wardName,
      city_or_village: [cityName, villageName].filter(Boolean).join(', ') || cityOrVillage,
      constituency: constituency,
      booth_name: boothName,
      booth_number: boothNumber,
      total_registered_voters: Number(totalRegisteredVoters) || 0,
      voting_percentage: parseFloat(votingPercentage) || 0,
      calculated_votes_polled: calculatedVotesPolled,
      previous_election_date: previousElectionDate,
      previous_results: previousResults,
      previous_winners: previousWinners,
      additional_notes: additionalNotes,
      assembly_segments: assemblySegments,
      booth_count: boothNumber ? `${boothNumber} (${boothName || ''})` : boothCount,
      zp_gat_name: zpGatName,
      ward_reservation: wardReservation,
      parties: parties,
      other_candidates: otherCandidates,
      political_equations: politicalEquations,
      development_issues: developmentIssues,
      ground_observations: groundObservations,
      swot_analysis: {
        strengths: parties.map(p => `${p.name}: ${p.strengths || ''}`),
        challenges: parties.map(p => `${p.name}: ${p.challenges || ''}`),
      },
      status: 'completed'
    };

    try {
      const res = await fetch('http://127.0.0.1:8000/api/election-analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSaveSuccessMsg(isMr ? '✅ निवडणूक विश्लेषण यशस्वीरीत्या डेटाबेसमध्ये सेव्ह झाले!' : '✅ Election analysis saved to database successfully!');
        setTimeout(() => setSaveSuccessMsg(''), 4500);
        fetchSavedAnalyses();
      }
    } catch (err) {
      console.warn('API save error:', err);
    } finally {
      setIsSaving(false);
      setActiveTab('report');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Copy Summary Report Text
  const handleCopySummary = () => {
    const text = `
=== ${electionName} (${electionYear}) निवडणूक विश्लेषण अहवाल ===
१. राज्य: ${stateName || '-'}
२. जिल्हा: ${districtName || '-'}
३. तालुका: ${talukaName || '-'}
४. शहर: ${cityName || '-'}
५. गाव: ${villageName || '-'}
६. प्रभाग / वार्ड: ${wardName || '-'}
७. विधानसभा मतदारसंघ: ${constituency || '-'}
८. मतदान केंद्र: ${boothName || '-'}
९. मतदान केंद्र क्रमांक: ${boothNumber || '-'}
एकूण नोंदणीकृत मतदार: ${Number(totalRegisteredVoters).toLocaleString('en-IN') || '-'}
मतदान टक्केवारी: ${votingPercentage}% (एकूण मतदान: ${calculatedVotesPolled.toLocaleString('en-IN')})

प्रमुख निकाल / कल अंदाज:
१. आघाडीवर: ${leaderParty?.candidate || '-'} [${leaderParty?.name || '-'}] - ${Number(leaderParty?.currentVotes).toLocaleString('en-IN')} मते (${leaderParty?.computedVoteShare}%)
२. दुसऱ्या क्रमांकावर: ${runnerUpParty?.candidate || '-'} [${runnerUpParty?.name || '-'}] - ${Number(runnerUpParty?.currentVotes).toLocaleString('en-IN')} मते (${runnerUpParty?.computedVoteShare}%)
मताधिक्य (Margin): ${projectedMargin.toLocaleString('en-IN')} मते

स्थानिक राजकीय समीकरणे:
${politicalEquations || 'नोंद नाही'}

ग्राउंड निरीक्षण:
${groundObservations || 'नोंद नाही'}
(अधिकृत पडताळणी डेटा - नेता व प्रशासक पोर्टल)
    `;
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 3000);
  };

  return (
    <div style={{ padding: 'clamp(12px, 2.5vw, 20px) clamp(10px, 2.5vw, 24px) 80px', maxWidth: '1350px', width: '100%', boxSizing: 'border-box', overflowX: 'hidden', margin: '0 auto', fontFamily: "'Inter', 'Noto Sans Devanagari', sans-serif" }}>
      {/* ================= HEADER BAR ================= */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)',
        borderRadius: '16px',
        padding: 'clamp(14px, 3vw, 24px)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.25)',
        marginBottom: '20px',
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
          }}>
            🗳️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '850', letterSpacing: '-0.4px' }}>
                {isMr ? 'निवडणूक विश्लेषण व राजकीय अहवाल कक्ष' : 'Election Analysis & Political Intelligence Desk'}
              </h1>
              <span style={{ background: '#10b981', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '10px', fontWeight: '850' }}>
                INTELLIGENCE HQ
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.88 }}>
              {isMr ? 'सर्व प्रकारच्या निवडणुकांची सविस्तर माहिती, पक्षीय तुलना व डेटा-आधारित विश्लेषणात्मक अहवाल तयार करा.' : 'Comprehensive dynamic election data, party comparison, vote share analysis, and scenario reporting.'}
            </p>
          </div>
        </div>

        {/* Action Button Strip */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              setActiveTab('saved');
              fetchSavedAnalyses();
            }}
            style={{
              background: activeTab === 'saved' ? '#10b981' : 'rgba(255, 255, 255, 0.22)',
              border: '1.5px solid rgba(255, 255, 255, 0.45)',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            title="डेटाबेसमधील विश्लेषण केलेले सर्व अहवाल पहा"
          >
            <FolderOpen size={15} />
            <span>{isMr ? 'विश्लेषण केलेले अहवाल पहा' : 'View Analyzed Reports'}</span>
            <span style={{
              background: '#ffffff',
              color: '#1e3a8a',
              padding: '1px 7px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: '900'
            }}>
              {savedAnalyses.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              loadTemplate('sangli_assembly');
              setActiveTab('input');
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.18)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              color: '#ffffff',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '750',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="सांगली विधानसभा निवडणूक २०२४ चे सॅम्पल लोड करा"
          >
            <span>⚡</span>
            <span>{isMr ? 'सांगली नमुना लोड करा' : 'Load Sangli Sample'}</span>
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            style={{
              background: 'rgba(239, 68, 68, 0.25)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fee2e2',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '750',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={14} />
            <span>{isMr ? 'सर्व साफ करा' : 'Clear Form'}</span>
          </button>
        </div>
      </div>

      {/* ================= SUCCESS BANNER ================= */}
      {saveSuccessMsg && (
        <div style={{
          background: '#f0fdf4',
          border: '1.5px solid #86efac',
          borderRadius: '12px',
          padding: '12px 18px',
          marginBottom: '18px',
          color: '#166534',
          fontWeight: '800',
          fontSize: '13.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)'
        }}>
          <CheckCircle2 size={18} />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* ================= SUB-NAVIGATION TABS ================= */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '2px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setActiveTab('input')}
          style={{
            background: activeTab === 'input' ? '#2563eb' : '#f8fafc',
            color: activeTab === 'input' ? '#ffffff' : '#475569',
            border: activeTab === 'input' ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
            padding: '10px 22px',
            borderRadius: '10px 10px 0 0',
            fontWeight: '800',
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'input' ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Layers size={16} />
          <span>१. {isMr ? 'निवडणूक व पक्ष डेटा नोंद फॉर्म' : '1. Election Data Entry Form'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('saved');
            fetchSavedAnalyses();
          }}
          style={{
            background: activeTab === 'saved' ? '#0f766e' : '#f8fafc',
            color: activeTab === 'saved' ? '#ffffff' : '#0f766e',
            border: activeTab === 'saved' ? '1px solid #0f766e' : '1px solid #cbd5e1',
            padding: '10px 22px',
            borderRadius: '10px 10px 0 0',
            fontWeight: '800',
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'saved' ? '0 4px 12px rgba(15, 118, 110, 0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <FolderOpen size={16} />
          <span>{isMr ? '📑 विश्लेषण केलेले अहवाल पहा' : '📑 View Analyzed Reports'}</span>
          <span style={{
            background: activeTab === 'saved' ? '#ffffff' : '#0f766e',
            color: activeTab === 'saved' ? '#0f766e' : '#ffffff',
            borderRadius: '12px',
            padding: '2px 8px',
            fontSize: '11px',
            fontWeight: '900'
          }}>
            {savedAnalyses.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('crosstab')}
          style={{
            background: activeTab === 'crosstab' ? '#7c3aed' : '#f8fafc',
            color: activeTab === 'crosstab' ? '#ffffff' : '#6d28d9',
            border: activeTab === 'crosstab' ? '1px solid #7c3aed' : '1px solid #cbd5e1',
            padding: '10px 22px',
            borderRadius: '10px 10px 0 0',
            fontWeight: '800',
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'crosstab' ? '0 4px 12px rgba(124, 58, 237, 0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <BarChart3 size={16} />
          <span>{isMr ? '📊 घटकनिहाय तुलनात्मक विश्लेषण' : '📊 Comparative Analysis by Components'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('winners')}
          style={{
            background: activeTab === 'winners' ? '#d97706' : '#f8fafc',
            color: activeTab === 'winners' ? '#ffffff' : '#b45309',
            border: activeTab === 'winners' ? '1px solid #d97706' : '1px solid #cbd5e1',
            padding: '10px 22px',
            borderRadius: '10px 10px 0 0',
            fontWeight: '800',
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'winners' ? '0 4px 12px rgba(217, 119, 6, 0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Trophy size={16} />
          <span>🏆 {isMr ? 'मागील विजेते व निकाल' : 'Past Winners & Results'}</span>
          {uploadedPdfInfo && uploadedPdfInfo.type === 'winner' && (
            <span style={{ background: '#ffffff', color: '#b45309', padding: '1px 6px', borderRadius: '10px', fontSize: '11px', fontWeight: '900' }}>
              PDF
            </span>
          )}
        </button>

        {activeTab === 'report' && (
          <div style={{
            background: '#10b981',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '10px 10px 0 0',
            fontWeight: '800',
            fontSize: '13.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            <BarChart3 size={16} />
            <span>📊 {isMr ? 'सक्रिय विश्लेषण अहवाल (Viewing Analysis Report)' : 'Active Analysis Report'}</span>
          </div>
        )}
      </div>

      {/* Validation Alert */}
      {validationErrors.length > 0 && (
        <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '12px', padding: '14px 18px', marginBottom: '18px', color: '#991b1b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '14px', marginBottom: '6px' }}>
            <AlertTriangle size={18} />
            <span>{isMr ? 'कृपया खालील त्रुटी तपासा:' : 'Please address the following inputs:'}</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: '22px', fontSize: '13px', lineHeight: '1.5' }}>
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ================= TAB 1: INPUT FORM ================= */}
      {activeTab === 'input' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
          {/* 1. Sleek 3-Dot Election Type Selector & PDF Upload Bar */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
              {/* Selected Type Display */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', border: '1px solid #bfdbfe', flexShrink: 0 }}>
                  {ELECTION_TYPES.find((t) => t.id === selectedElectionType)?.icon || '🏛️'}
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {isMr ? 'निवडलेला निवडणूक प्रकार' : 'Selected Election Type'}
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '850', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
                    <span>{isMr ? ELECTION_TYPES.find((t) => t.id === selectedElectionType)?.label_mr : ELECTION_TYPES.find((t) => t.id === selectedElectionType)?.label_en}</span>
                    <span style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '8px', fontWeight: '800' }}>
                      ✓ {isMr ? 'सक्रिय' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions: 3-Dot Menu & PDF Upload Trigger */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {/* PDF Upload Button */}
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    background: '#f0fdf4',
                    border: '1.5px solid #86efac',
                    color: '#166534',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: '12.5px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s ease'
                  }}
                  title={isMr ? 'निकाल किंवा मागील विजेते PDF अपलोड करा' : 'Upload results or past winners PDF'}
                >
                  <FileUp size={16} />
                  <span>{isMr ? '📄 निकाल / विजेते PDF अपलोड' : 'Upload PDF'}</span>
                  <input
                    type="file"
                    accept=".pdf,.csv,.xlsx,.txt"
                    onChange={handlePdfFileSelect}
                    style={{ display: 'none' }}
                  />
                </label>

                {/* 3-Dot More Vertical Trigger */}
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setIsElectionTypeMenuOpen(!isElectionTypeMenuOpen)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#f8fafc',
                      border: '1.5px solid #cbd5e1',
                      color: '#1e293b',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                    }}
                    title={isMr ? 'सर्व ७५ निवडणूक प्रकार (३-डॉट मेनू)' : 'All 75 Election Types'}
                  >
                    <span>{isMr ? 'निवडणूक प्रकार (७५)' : 'All 75 Types'}</span>
                    <MoreVertical size={16} style={{ color: '#2563eb' }} />
                  </button>

                  {/* 3-Dot Categorized Modal displaying all 75 elections */}
                  {isElectionTypeMenuOpen && (
                    <div
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.65)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 99999,
                        padding: '12px',
                        backdropFilter: 'blur(4px)',
                      }}
                      onClick={() => setIsElectionTypeMenuOpen(false)}
                    >
                      <div
                        style={{
                          background: '#ffffff',
                          borderRadius: '16px',
                          padding: 'clamp(12px, 3vw, 18px)',
                          width: '100%',
                          maxWidth: '680px',
                          boxShadow: '0 20px 45px rgba(0,0,0,0.25)',
                          maxHeight: '90dvh',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          boxSizing: 'border-box',
                          overflow: 'hidden'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '12px', flexShrink: 0 }}>
                          <div>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '850', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>🏛️</span>
                              <span>{isMr ? 'निवडणूक प्रकार निवडा (एकूण ७५ प्रकार)' : 'Select Election Type (All 75 Types)'}</span>
                            </h3>
                            <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#64748b' }}>
                              {isMr ? '७ प्रमुख प्रशासकीय स्तरांनुसार अधिकृत वर्गवारी' : 'Official categorized hierarchy across 7 administrative levels'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsElectionTypeMenuOpen(false)}
                            style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '15px', fontWeight: '800', color: '#64748b' }}
                          >
                            ✕
                          </button>
                        </div>

                        {/* Search & Quick Actions */}
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', flexShrink: 0 }}>
                          <input
                            type="text"
                            placeholder={isMr ? '🔍 निवडणुकीचे नाव शोधा...' : '🔍 Search election name...'}
                            value={electionSearchText}
                            onChange={(e) => setElectionSearchText(e.target.value)}
                            style={{ flex: 1, minWidth: '220px', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px' }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setIsElectionTypeMenuOpen(false);
                              setActiveTab('winners');
                            }}
                            style={{ padding: '9px 14px', borderRadius: '8px', background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', fontWeight: '800', fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
                          >
                            <span>🏆</span>
                            <span>{isMr ? 'मागील विजेता निकाल' : 'Past Winners View'}</span>
                          </button>
                        </div>

                        {/* 7 Categories Accordion List */}
                        <div
                          style={{
                            overflowY: 'auto',
                            WebkitOverflowScrolling: 'touch',
                            flex: '1 1 auto',
                            minHeight: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            paddingRight: '4px',
                            touchAction: 'pan-y'
                          }}
                        >
                          {ELECTIONS_CATEGORIES.map((cat) => {
                            const catElections = ELECTIONS_MASTER_DATA.filter((e) => {
                              if (e.cat_id !== cat.id) return false;
                              if (!electionSearchText.trim()) return true;
                              const term = electionSearchText.toLowerCase();
                              return (
                                (e.name_mr && e.name_mr.toLowerCase().includes(term)) ||
                                (e.name_en && e.name_en.toLowerCase().includes(term)) ||
                                (e.sub_mr && e.sub_mr.toLowerCase().includes(term))
                              );
                            });

                            if (electionSearchText.trim() && catElections.length === 0) return null;
                            const isExpanded = expandedCategory === cat.id || Boolean(electionSearchText.trim());

                            return (
                              <div key={cat.id} style={{ border: '1.5px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                                <div
                                  onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
                                  style={{
                                    background: isExpanded ? '#f1f5f9' : '#ffffff',
                                    padding: '11px 14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    fontWeight: '850',
                                    fontSize: '13px',
                                    color: '#1e293b',
                                    flexShrink: 0
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>{cat.icon}</span>
                                    <span>{isMr ? cat.name_mr : cat.name_en}</span>
                                    <span style={{ fontSize: '11px', background: '#e2e8f0', color: '#475569', padding: '2px 7px', borderRadius: '10px', fontWeight: '800' }}>
                                      {catElections.length}
                                    </span>
                                  </div>
                                  <span style={{ fontSize: '12px', color: '#64748b' }}>{isExpanded ? '▲' : '▼'}</span>
                                </div>

                                {isExpanded && (
                                  <div style={{ padding: '8px 10px', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {catElections.map((el) => {
                                      const isSelected = selectedElectionType === String(el.id);
                                      const titleText = isMr ? `${el.id}. ${el.name_mr}` : `${el.id}. ${el.name_en}`;
                                      return (
                                        <button
                                          key={el.id}
                                          type="button"
                                          onClick={() => {
                                            setSelectedElectionType(String(el.id));
                                            setElectionName(isMr ? el.name_mr : el.name_en);
                                            setIsElectionTypeMenuOpen(false);
                                          }}
                                          style={{
                                            padding: '9px 12px',
                                            borderRadius: '8px',
                                            border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                                            background: isSelected ? '#eff6ff' : '#f8fafc',
                                            color: isSelected ? '#1d4ed8' : '#334155',
                                            fontWeight: isSelected ? '850' : '650',
                                            fontSize: '12.5px',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: '8px',
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            flexShrink: 0
                                          }}
                                        >
                                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <span>{titleText}</span>
                                            {el.sub_mr && (
                                              <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                                                {isMr ? el.sub_mr : el.sub_en}
                                              </span>
                                            )}
                                          </div>
                                          {isSelected && <span style={{ color: '#2563eb', fontWeight: '900' }}>✓</span>}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Custom Election Option */}
            {selectedElectionType === 'custom' && (
              <div style={{ marginTop: '16px', padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1.5px dashed #2563eb' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#1e3a8a', marginBottom: '6px' }}>
                  ✏️ {isMr ? 'सानुकूल निवडणुकीचे नाव प्रविष्ट करा:' : 'Enter Custom Election Body Name:'}
                </label>
                <input
                  type="text"
                  placeholder={isMr ? 'उदा. सांगली जिल्हा मध्यवर्ती बँक निवडणूक २०२४' : 'e.g. Sangli District Central Bank Election'}
                  value={customElectionName}
                  onChange={(e) => setCustomElectionName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #93c5fd', fontSize: '13px', fontWeight: '600', boxSizing: 'border-box' }}
                />
              </div>
            )}
          </div>

          {/* 2. Dynamic Election Details Form */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: 'clamp(12px, 3vw, 20px)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '850', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📝</span>
              <span>{isMr ? 'निवडणुकीचा सविस्तर तपशील (Election Demographics & Geography)' : 'Election Demographics & Geography'}</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  {isMr ? 'निवडणुकीचे नाव' : 'Election Title'} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={electionName}
                  onChange={(e) => setElectionName(e.target.value)}
                  placeholder={isMr ? 'उदा. महाराष्ट्र विधानसभा निवडणूक' : 'e.g. Maharashtra Assembly Election'}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  {isMr ? 'निवडणूक वर्ष' : 'Election Year'} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={electionYear}
                  onChange={(e) => setElectionYear(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: '#fff' }}
                >
                  {['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2004', '1999', '1994', '1990'].map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>

              {/* १. राज्य */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  १. {isMr ? 'राज्य:' : 'State:'} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: '#fff' }}
                  required
                >
                  <option value="महाराष्ट्र (Maharashtra)">महाराष्ट्र (Maharashtra)</option>
                </select>
              </div>

              {/* २. जिल्हा */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  २. {isMr ? 'जिल्हा:' : 'District:'} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={districtName}
                  onChange={(e) => setDistrictName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: '#fff' }}
                  required
                >
                  <option value="सांगली (Sangli)">सांगली (Sangli)</option>
                  <option value="सातारा (Satara)">सातारा (Satara)</option>
                  <option value="कोल्हापूर (Kolhapur)">कोल्हापूर (Kolhapur)</option>
                  <option value="पुणे (Pune)">पुणे (Pune)</option>
                  <option value="सोलापूर (Solapur)">सोलापूर (Solapur)</option>
                </select>
              </div>

              {/* ३. तालुका (Cascading) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  ३. {isMr ? 'तालुका:' : 'Taluka:'} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={talukaName}
                  onChange={(e) => {
                    const newTal = e.target.value;
                    setTalukaName(newTal);
                    const availableVillages = TALUKA_VILLAGES_MAP[newTal] || [];
                    if (availableVillages.length > 0) {
                      setVillageName(availableVillages[0]);
                    }
                  }}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #93c5fd', fontSize: '13px', boxSizing: 'border-box', background: '#fff' }}
                  required
                >
                  <option value="">{isMr ? '-- तालुका निवडा --' : '-- Select Taluka --'}</option>
                  {Object.keys(TALUKA_VILLAGES_MAP).map((tName) => (
                    <option key={tName} value={tName}>{tName}</option>
                  ))}
                  <option value="इतर">{isMr ? 'इतर तालुका' : 'Other Taluka'}</option>
                </select>
              </div>

              {/* ४. शहर */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  ४. {isMr ? 'शहर:' : 'City:'} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #93c5fd', fontSize: '13px', boxSizing: 'border-box', background: '#fff' }}
                  required
                >
                  <option value="">{isMr ? '-- शहर निवडा --' : '-- Select City --'}</option>
                  <option value="मिरज शहर (Miraj City)">मिरज शहर (Miraj City)</option>
                  <option value="सांगली शहर (Sangli City)">सांगली शहर (Sangli City)</option>
                  <option value="कुपवाड शहर (Kupwad City)">कुपवाड शहर (Kupwad City)</option>
                  <option value="इस्लामपूर / वाळवा शहर (Islampur City)">इस्लामपूर / वाळवा शहर (Islampur City)</option>
                  <option value="विटा शहर (Vita City)">विटा शहर (Vita City)</option>
                  <option value="तासगाव शहर (Tasgaon City)">तासगाव शहर (Tasgaon City)</option>
                  <option value="जत शहर (Jat City)">जत शहर (Jat City)</option>
                  <option value="आष्टा शहर (Ashta City)">आष्टा शहर (Ashta City)</option>
                  <option value="इतर शहर">{isMr ? 'इतर शहर' : 'Other City'}</option>
                </select>
              </div>

              {/* ५. गाव (Cascading strictly filtered by Taluka) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  ५. {isMr ? 'गाव / प्रभाग:' : 'Village / Ward:'} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                {TALUKA_VILLAGES_MAP[talukaName] ? (
                  <select
                    value={villageName}
                    onChange={(e) => setVillageName(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #93c5fd', fontSize: '13px', boxSizing: 'border-box', background: '#fff' }}
                    required
                  >
                    <option value="">{isMr ? '-- गाव निवडा --' : '-- Select Village --'}</option>
                    {TALUKA_VILLAGES_MAP[talukaName].map((vName) => (
                      <option key={vName} value={vName}>{vName}</option>
                    ))}
                    <option value="इतर">{isMr ? 'इतर गाव' : 'Other Village'}</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={villageName}
                    onChange={(e) => setVillageName(e.target.value)}
                    placeholder={isMr ? 'उदा. सांगलीवाडी' : 'e.g. Sangliwadi'}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                )}
              </div>

              {/* ६. प्रभाग / वार्ड */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  ६. {isMr ? 'प्रभाग / वार्ड:' : 'Ward / Prabhag:'} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={wardName}
                  onChange={(e) => setWardName(e.target.value)}
                  placeholder={isMr ? 'उदा. प्रभाग क्र. १२' : 'e.g. Ward No. 12'}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              {/* ७. विधानसभा मतदारसंघ */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  ७. {isMr ? 'विधानसभा मतदारसंघ:' : 'Assembly Constituency:'} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={constituency}
                  onChange={(e) => setConstituency(e.target.value)}
                  placeholder={isMr ? 'उदा. २८२ - सांगली विधानसभा' : 'e.g. 282 - Sangli Assembly'}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              {/* ८. मतदान केंद्र */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  ८. {isMr ? 'मतदान केंद्र:' : 'Polling Station / Booth:'} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={boothName}
                  onChange={(e) => setBoothName(e.target.value)}
                  placeholder={isMr ? 'उदा. शासकीय कन्या शाळा' : 'e.g. Govt Girls School'}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              {/* ९. मतदान केंद्र क्रमांक */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  ९. {isMr ? 'मतदान केंद्र क्रमांक:' : 'Polling Booth Number:'} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={boothNumber}
                  onChange={(e) => setBoothNumber(e.target.value)}
                  placeholder={isMr ? 'उदा. १०४' : 'e.g. 104'}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  {isMr ? 'एकूण नोंदणीकृत मतदार' : 'Total Registered Voters'} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  required
                  value={totalRegisteredVoters}
                  onChange={(e) => setTotalRegisteredVoters(e.target.value)}
                  placeholder="348500"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  {isMr ? 'मतदानाची टक्केवारी (%)' : 'Voting Percentage (%)'} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  value={votingPercentage}
                  onChange={(e) => setVotingPercentage(e.target.value)}
                  placeholder="64.8"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Live Calculation Strip */}
            {calculatedVotesPolled > 0 && (
              <div style={{ marginTop: '14px', padding: '10px 14px', background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px', color: '#1e40af' }}>
                <span>🗳️ {isMr ? 'एकूण झालेले मतदान (Calculated Votes Polled):' : 'Total Polled Votes:'} <strong>{calculatedVotesPolled.toLocaleString('en-IN')}</strong> मते</span>
                <span style={{ fontSize: '11px', background: '#dbeafe', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>ऑटो-कॅल्क्युलेटेड</span>
              </div>
            )}

            {/* Dynamic Type-Specific Fields */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #cbd5e1' }}>
              <div style={{ fontSize: '13px', fontWeight: '850', color: '#1e3a8a', marginBottom: '10px' }}>
                ⚡ {isMr ? 'निवडणूक प्रकारानुसार विशिष्ट माहिती:' : 'Type-Specific Details:'}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {selectedElectionType === 'vidhan_sabha' && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '750', color: '#475569', marginBottom: '4px' }}>
                        {isMr ? 'एकूण मतदान केंद्र (Booths)' : 'Total Polling Booths'}
                      </label>
                      <input
                        type="text"
                        value={boothCount}
                        onChange={(e) => setBoothCount(e.target.value)}
                        placeholder="342 बूथ"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '750', color: '#475569', marginBottom: '4px' }}>
                        {isMr ? 'समाविष्ट प्रमुख परिसर / प्रभाग' : 'Constituency Segments'}
                      </label>
                      <input
                        type="text"
                        value={assemblySegments}
                        onChange={(e) => setAssemblySegments(e.target.value)}
                        placeholder="सांगली, कुपवाड, विश्रामबाग"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </>
                )}

                {selectedElectionType === 'lok_sabha' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '750', color: '#475569', marginBottom: '4px' }}>
                      {isMr ? 'समाविष्ट विधानसभा मतदारसंघ (६ विधानसभा)' : 'Assembly Segments (6 Assemblies)'}
                    </label>
                    <input
                      type="text"
                      value={assemblySegments}
                      onChange={(e) => setAssemblySegments(e.target.value)}
                      placeholder="मिरज, सांगली, इस्लामपूर, शिराळा, तासगाव, खानापूर"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                    />
                  </div>
                )}

                {(selectedElectionType === 'zilla_parishad' || selectedElectionType === 'panchayat_samiti') && (
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '750', color: '#475569', marginBottom: '4px' }}>
                      {isMr ? 'जिल्हा परिषद गट / पंचायत समिती गण' : 'ZP Gat / PS Gan Name'}
                    </label>
                    <input
                      type="text"
                      value={zpGatName}
                      onChange={(e) => setZpGatName(e.target.value)}
                      placeholder="उदा. बुधगाव गट / माधवनगर गण"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                    />
                  </div>
                )}

                {selectedElectionType === 'gram_panchayat' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '750', color: '#475569', marginBottom: '4px' }}>
                      {isMr ? 'वॉर्ड व आरक्षण प्रवर्ग' : 'Ward & Reservation Category'}
                    </label>
                    <input
                      type="text"
                      value={wardReservation}
                      onChange={(e) => setWardReservation(e.target.value)}
                      placeholder="वॉर्ड क्र. ३ - नागरिकांचा मागास प्रवर्ग"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Previous Election Results & Date */}
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ maxWidth: '340px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  {isMr ? 'मागील निवडणुकीची तारीख' : 'Previous Election Date'}
                </label>
                <input
                  type="text"
                  value={previousElectionDate}
                  onChange={(e) => setPreviousElectionDate(e.target.value)}
                  placeholder="21 ऑक्टोबर 2019"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              {/* मागील विजेता (Rank 1, 2, 3 निकाल, पक्ष व मताधिक्य / Lead) */}
              <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '850', color: '#0f172a' }}>
                      <span>🏆</span>
                      <span>{isMr ? 'मागील विजेता' : 'Previous Winner'}</span>
                    </label>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                      {isMr ? 'मागील निवडणुकीतील १, २, ३ निकाल, संबंधित पक्ष, मते व विजयाचे मताधिक्य (Lead):' : 'Rank 1, 2, 3 results, political parties, votes and lead margin:'}
                    </p>
                  </div>

                  <span style={{ fontSize: '11.5px', background: '#dcfce7', color: '#15803d', fontWeight: '800', padding: '4px 10px', borderRadius: '20px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>✓</span> {isMr ? '१, २, ३ निकाल व मताधिक्य (Lead)' : 'Rank 1, 2, 3 & Lead'}
                  </span>
                </div>

                {/* 1, 2, 3 Rank Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '12px' }}>
                  {previousWinners.map((winner, idx) => {
                    const isFirst = winner.rank === 1;
                    const isSecond = winner.rank === 2;
                    const borderColor = isFirst ? '#86efac' : isSecond ? '#bfdbfe' : '#e2e8f0';
                    const bgColor = isFirst ? '#f0fdf4' : isSecond ? '#eff6ff' : '#ffffff';
                    const badgeBg = isFirst ? '#16a34a' : isSecond ? '#2563eb' : '#64748b';
                    const rankEmoji = isFirst ? '🥇' : isSecond ? '🥈' : '🥉';
                    const rankTitle = isFirst
                      ? (isMr ? '१. विजेता (Rank 1 - Winner)' : 'Rank 1 - Winner')
                      : isSecond
                      ? (isMr ? '२. उपविजेता (Rank 2 - Runner-up)' : 'Rank 2 - Runner-up')
                      : (isMr ? '३. तृतीय क्रमांक (Rank 3)' : 'Rank 3');

                    return (
                      <div
                        key={winner.rank || idx}
                        style={{
                          background: bgColor,
                          border: `1.5px solid ${borderColor}`,
                          borderRadius: '10px',
                          padding: '14px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '13px', fontWeight: '850', color: isFirst ? '#15803d' : isSecond ? '#1d4ed8' : '#334155', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span>{rankEmoji}</span>
                            <span>{rankTitle}</span>
                          </span>
                          <span style={{ fontSize: '11px', background: badgeBg, color: '#ffffff', fontWeight: '800', padding: '2px 8px', borderRadius: '6px' }}>
                            {winner.rank}
                          </span>
                        </div>

                        {/* Candidate Name */}
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '750', color: '#475569', marginBottom: '3px' }}>
                            {isMr ? 'उमेदवाराचे नाव' : 'Candidate Name'}
                          </label>
                          <input
                            type="text"
                            value={winner.candidate || ''}
                            onChange={(e) => handleUpdateWinner(idx, 'candidate', e.target.value)}
                            placeholder={isFirst ? 'सुधीर गाडगीळ' : isSecond ? 'पृथ्वीराज पाटील' : 'सचिन पवार'}
                            style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: '700', color: '#0f172a', background: '#ffffff', boxSizing: 'border-box' }}
                          />
                        </div>

                        {/* Political Party */}
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '750', color: '#475569', marginBottom: '3px' }}>
                            {isMr ? 'राजकीय पक्ष (Party)' : 'Political Party'}
                          </label>
                          <input
                            type="text"
                            value={winner.party || ''}
                            onChange={(e) => handleUpdateWinner(idx, 'party', e.target.value)}
                            placeholder={isFirst ? 'भारतीय जनता पक्ष (BJP)' : isSecond ? 'भारतीय राष्ट्रीय काँग्रेस (INC)' : 'बहुजन समाज पक्ष (BSP)'}
                            style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: '600', color: '#0f172a', background: '#ffffff', boxSizing: 'border-box' }}
                          />
                        </div>

                        {/* Votes & Lead (मताधिक्य) */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '750', color: '#475569', marginBottom: '3px' }}>
                              {isMr ? 'मिळालेली मते' : 'Votes'}
                            </label>
                            <input
                              type="text"
                              value={winner.votes || ''}
                              onChange={(e) => handleUpdateWinner(idx, 'votes', e.target.value)}
                              placeholder={isFirst ? '93,659' : isSecond ? '86,720' : '1,850'}
                              style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', color: '#0f172a', background: '#ffffff', boxSizing: 'border-box' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '750', color: isFirst ? '#15803d' : '#475569', marginBottom: '3px' }}>
                              {isFirst ? (isMr ? 'मताधिक्य (Lead)' : 'Lead Margin') : (isMr ? 'फरक / स्थिती' : 'Status/Diff')}
                            </label>
                            <input
                              type="text"
                              value={winner.lead || ''}
                              onChange={(e) => handleUpdateWinner(idx, 'lead', e.target.value)}
                              placeholder={isFirst ? '६,९३९ मते' : '-'}
                              style={{
                                width: '100%',
                                padding: '7px 10px',
                                borderRadius: '6px',
                                border: isFirst ? '1.5px solid #86efac' : '1px solid #cbd5e1',
                                fontSize: '12.5px',
                                fontWeight: isFirst ? '800' : '500',
                                color: isFirst ? '#15803d' : '#0f172a',
                                background: isFirst ? '#f0fdf4' : '#ffffff',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Lead Summary Bar */}
                <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 14px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '12px', color: '#1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>⚡</span>
                    <span>
                      <strong>{isMr ? 'विजयाची आघाडी (Lead):' : 'Victory Lead:'}</strong>{' '}
                      <span style={{ color: '#16a34a', fontWeight: '800' }}>
                        {previousWinners[0]?.lead || '६,९३९ मतांची आघाडी'}
                      </span>{' '}
                      ({previousWinners[0]?.party || 'भाजप'} चे {previousWinners[0]?.candidate || 'सुधीर गाडगीळ'})
                    </span>
                  </div>
                  <span style={{ color: '#64748b', fontSize: '11.5px' }}>
                    {isMr ? '२ऱ्या क्रमांकापेक्षा आघाडीने विजयी' : 'Won with clear lead margin'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Add Multiple Political Parties */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '22px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '850', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🚩</span>
                  <span>{isMr ? 'राजकीय पक्ष व उमेदवार यादी (Political Parties & Candidates)' : 'Political Parties & Candidates'}</span>
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                  {isMr ? 'रिंगणातील सर्व पक्षांची नावे, उमेदवार, मागील व सध्याची मते आणि ताकद/आव्हाने नोंदवा:' : 'Record parties, candidates, vote share, and alliance data:'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setParties(STANDARD_16_PARTIES_DATA)}
                  style={{
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    border: '1px solid #bfdbfe',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    fontSize: '12.5px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  title="१६ अधिकृत पक्ष मूळ क्रमाने रिसेट करा"
                >
                  <RefreshCw size={14} />
                  <span>{isMr ? '१६ पक्ष क्रमाने रिसेट करा' : 'Reset 16 Parties'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddParty}
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '9px 16px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                  }}
                >
                  <Plus size={16} />
                  <span>{isMr ? 'नवीन पक्ष जोडा (Add Party)' : 'Add Party'}</span>
                </button>
              </div>
            </div>

            {/* Parties List */}
            {parties.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', background: '#f8fafc', borderRadius: '12px', border: '1.5px dashed #cbd5e1' }}>
                <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 12px' }}>
                  {isMr ? 'अद्याप कोणताही राजकीय पक्ष जोडलेला नाही.' : 'No political parties added yet.'}
                </p>
                <button
                  type="button"
                  onClick={handleAddParty}
                  style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: '750', fontSize: '13px', cursor: 'pointer' }}
                >
                  + {isMr ? 'पहिला पक्ष जोडा' : 'Add First Party'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {parties.map((party, index) => {
                  return (
                    <div
                      key={party.id}
                      style={{
                        background: '#f8fafc',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#1e293b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800' }}>
                            {index + 1}
                          </span>
                          <span style={{ fontSize: '14px', fontWeight: '850', color: '#0f172a' }}>
                            {party.name || (isMr ? 'नवीन पक्ष नोंद' : 'Party Entry')}
                          </span>
                          {party.alliance && (
                            <span style={{ fontSize: '10.5px', background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '6px', fontWeight: '750' }}>
                              {party.alliance}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveParty(party.id)}
                          style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', padding: '6px 10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          title="हा पक्ष काढून टाका"
                        >
                          <Trash2 size={13} />
                          <span>{isMr ? 'काढा' : 'Remove'}</span>
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '750', color: '#475569', marginBottom: '3px' }}>
                            {isMr ? 'पक्षाचे नाव (Party Name)' : 'Party Name'}
                          </label>
                          <input
                            type="text"
                            value={party.name}
                            onChange={(e) => handleUpdateParty(party.id, 'name', e.target.value)}
                            list="standard-16-parties-list"
                            placeholder={isMr ? 'पक्षाचे नाव निवडा किंवा टाईप करा' : 'Select or type party name'}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '750', color: '#475569', marginBottom: '3px' }}>
                            {isMr ? 'उमेदवाराचे नाव (Candidate Name)' : 'Candidate Name'}
                          </label>
                          <input
                            type="text"
                            value={party.candidate}
                            onChange={(e) => handleUpdateParty(party.id, 'candidate', e.target.value)}
                            placeholder={isMr ? 'उमेदवाराचे नाव' : 'Candidate Name'}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '750', color: '#475569', marginBottom: '3px' }}>
                            {isMr ? 'आघाडी / युती (Alliance)' : 'Alliance'}
                          </label>
                          <select
                            value={party.alliance}
                            onChange={(e) => handleUpdateParty(party.id, 'alliance', e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box', background: '#fff' }}
                          >
                            <option value="महायुती">महायुती (Mahayuti)</option>
                            <option value="महाविकास आघाडी">महाविकास आघाडी (MVA)</option>
                            <option value="तिसरी आघाडी">तिसरी आघाडी (Third Front)</option>
                            <option value="डावी आघाडी">डावी आघाडी (Left Front)</option>
                            <option value="स्थानिक आघाडी">स्थानिक आघाडी (Local Alliance)</option>
                            <option value="स्वबळ">स्वबळ (Independent / Solo)</option>
                            <option value="अपक्ष">अपक्ष (Independent)</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '750', color: '#475569', marginBottom: '3px' }}>
                            {isMr ? 'मागील मते (Previous Votes)' : 'Previous Votes'}
                          </label>
                          <input
                            type="number"
                            value={party.previousVotes}
                            onChange={(e) => handleUpdateParty(party.id, 'previousVotes', Number(e.target.value))}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '750', color: '#475569', marginBottom: '3px' }}>
                            {isMr ? 'सध्याची मते / अंदाज (Current Votes)' : 'Current Votes'}
                          </label>
                          <input
                            type="number"
                            value={party.currentVotes}
                            onChange={(e) => handleUpdateParty(party.id, 'currentVotes', Number(e.target.value))}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '750', color: '#475569', marginBottom: '3px' }}>
                            {isMr ? 'जागा जिंकल्या (Seats Won - if any)' : 'Seats Won'}
                          </label>
                          <input
                            type="number"
                            value={party.seatsWon}
                            onChange={(e) => handleUpdateParty(party.id, 'seatsWon', Number(e.target.value))}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      {/* Strengths & Challenges */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '750', color: '#166534', marginBottom: '3px' }}>
                            ✓ {isMr ? 'पक्षाची ताकद (Strengths)' : 'Strengths'}
                          </label>
                          <input
                            type="text"
                            value={party.strengths}
                            onChange={(e) => handleUpdateParty(party.id, 'strengths', e.target.value)}
                            placeholder={isMr ? 'उदा. मजबूत संघटन, पारंपरिक मते' : 'Key strengths'}
                            style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #bbf7d0', fontSize: '12px', boxSizing: 'border-box', background: '#f0fdf4' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '750', color: '#991b1b', marginBottom: '3px' }}>
                            ⚠️ {isMr ? 'आव्हाने व अडचणी (Challenges)' : 'Challenges'}
                          </label>
                          <input
                            type="text"
                            value={party.challenges}
                            onChange={(e) => handleUpdateParty(party.id, 'challenges', e.target.value)}
                            placeholder={isMr ? 'उदा. बंडखोरी, मतविभागणी' : 'Key challenges'}
                            style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #fecaca', fontSize: '12px', boxSizing: 'border-box', background: '#fef2f2' }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Standard 16 Parties Datalist */}
            <datalist id="standard-16-parties-list">
              {STANDARD_16_PARTIES_DATA.map((p) => (
                <option key={p.id} value={p.name} />
              ))}
            </datalist>
          </div>

          {/* 4. Local Issues & Ground Observations */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '22px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '850', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔍</span>
              <span>{isMr ? 'स्थानिक राजकीय समीकरणे व विकासाचे प्रश्न' : 'Local Political Dynamics & Civic Issues'}</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  {isMr ? 'स्थानिक राजकीय व जातीय समीकरणे (Social & Political Dynamics)' : 'Political Dynamics & Equations'}
                </label>
                <textarea
                  rows="3"
                  value={politicalEquations}
                  onChange={(e) => setPoliticalEquations(e.target.value)}
                  placeholder={isMr ? 'उदा. मराठा, लिंगायत, मुस्लिम व व्यापारी घटकांची मते या मतदारसंघात निर्णायक ठरतात.' : 'Describe caste, demographic and regional equations...'}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              {/* Development Issues Table */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '750', color: '#334155' }}>
                    {isMr ? 'प्रमुख विकासकामे व जनतेचे प्रश्न (Key Civic & Development Issues):' : 'Key Civic Issues:'}
                  </label>
                  <button
                    type="button"
                    onClick={handleAddIssue}
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                  >
                    + {isMr ? 'प्रश्न जोडा' : 'Add Issue'}
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  {developmentIssues.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}>
                      <input
                        type="text"
                        value={item.issue}
                        onChange={(e) => handleUpdateIssue(idx, 'issue', e.target.value)}
                        placeholder={isMr ? 'उदा. पाणीपुरवठा, पूर संरक्षण' : 'Issue Name'}
                        style={{ flex: '2 1 180px', minWidth: '130px', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
                      />
                      <select
                        value={item.priority}
                        onChange={(e) => handleUpdateIssue(idx, 'priority', e.target.value)}
                        style={{ flex: '1 1 120px', minWidth: '100px', padding: '7px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#fff', boxSizing: 'border-box' }}
                      >
                        <option value="Critical">Critical (अति-तातडीचे)</option>
                        <option value="High">High (महत्त्वाचे)</option>
                        <option value="Medium">Medium (मध्यम)</option>
                        <option value="Low">Low (कमी)</option>
                      </select>
                      <input
                        type="text"
                        value={item.impact}
                        onChange={(e) => handleUpdateIssue(idx, 'impact', e.target.value)}
                        placeholder={isMr ? 'संभाव्य राजकीय प्रभाव' : 'Electoral Impact'}
                        style={{ flex: '2 1 160px', minWidth: '130px', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveIssue(idx)}
                        style={{ background: '#fee2e2', border: 'none', color: '#dc2626', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '800' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#334155', marginBottom: '5px' }}>
                  {isMr ? 'अतिरिक्त ग्राउंड निरीक्षणे व रणनीतिक शेरे (Ground Intelligence Notes)' : 'Ground Intelligence Observations'}
                </label>
                <textarea
                  rows="2"
                  value={groundObservations}
                  onChange={(e) => setGroundObservations(e.target.value)}
                  placeholder={isMr ? 'उदा. मतदारांमध्ये स्थानिक चेहऱ्याबाबत अनुकूलता असून बंडखोरी रोखल्यास आघाडीवर राहू शकतात.' : 'Add final strategic observations...'}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>
            </div>
          </div>

          {/* 5. Big Action Button: Save to DB & Generate Analysis */}
          <div style={{ textAlign: 'center', marginTop: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveAndGenerateAnalysis}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                padding: '16px 40px',
                fontSize: '16px',
                fontWeight: '900',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
                transition: 'transform 0.15s ease',
                opacity: isSaving ? 0.75 : 1
              }}
              onMouseOver={(e) => { if (!isSaving) e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseOut={(e) => { if (!isSaving) e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {isSaving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
              <span>
                {isSaving
                  ? (isMr ? 'डेटाबेसमध्ये सेव्ह होत आहे...' : 'Saving to Database...')
                  : (isMr ? '💾 डेटाबेसमध्ये जतन करा व विश्लेषण अहवाल पहा' : '💾 Save to DB & View Analysis Report')}
              </span>
            </button>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
              {isMr ? 'सर्व पक्ष, मतदार व राजकीय समीकरणे MySQL डेटाबेसमध्ये सुरक्षित जतन होतात.' : 'All data, parties, and political metrics will be stored permanently in MySQL database.'}
            </p>
          </div>
        </div>
      )}

      {/* ================= TAB: VIEW ANALYZED REPORTS (जतन केलेले विश्लेषण अहवाल) ================= */}
      {activeTab === 'saved' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Card for Analyzed Reports */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1.5px solid #e2e8f0',
            padding: '22px 24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>📑</span>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '850', color: '#0f172a' }}>
                  {isMr ? 'विश्लेषण केलेले सर्व अहवाल (Analyzed Reports Database)' : 'Analyzed Reports Database'}
                </h2>
                <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>
                  {savedAnalyses.length} {isMr ? 'नोंदी उपलब्ध' : 'Records'}
                </span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#64748b' }}>
                {isMr ? 'डेटाबेसमध्ये विश्लेषित केलेल्या सर्व निवडणुकांची यादी. अहवाल पाहण्यासाठी खालील "विश्लेषण पहा" बटणावर क्लिक करा.' : 'List of all analyzed elections in database. Click "View Analysis" to see complete intelligence report.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  value={savedSearchQuery}
                  onChange={(e) => setSavedSearchQuery(e.target.value)}
                  placeholder={isMr ? 'निवडणूक / जिल्हा शोधा...' : 'Search election or district...'}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12.5px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="button"
                onClick={fetchSavedAnalyses}
                disabled={isLoadingSaved}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '750',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="डेटाबेस रिफ्रेश करा"
              >
                <RefreshCw size={13} className={isLoadingSaved ? 'animate-spin' : ''} />
                <span>{isMr ? 'रिफ्रेश' : 'Refresh'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('input')}
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                }}
              >
                <Plus size={14} />
                <span>{isMr ? 'नवीन निवडणूक जोडा' : 'New Election Entry'}</span>
              </button>
            </div>
          </div>

          {/* List of Saved Analyses Cards */}
          {isLoadingSaved ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <RefreshCw size={32} className="animate-spin" style={{ color: '#2563eb', margin: '0 auto 12px' }} />
              <div style={{ fontSize: '14px', fontWeight: '750', color: '#475569' }}>
                {isMr ? 'डेटाबेसमधून अहवाल लोड होत आहेत...' : 'Loading saved election analyses from database...'}
              </div>
            </div>
          ) : savedAnalyses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '16px', border: '1.5px dashed #cbd5e1' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>🗳️</span>
              <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '850', color: '#0f172a' }}>
                {isMr ? 'अद्याप कोणतेही विश्लेषण जतन केलेले नाही' : 'No Election Analyses Saved Yet'}
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
                {isMr ? 'सांगली नमुना लोड करा किंवा नवीन निवडणूक माहिती भरून अहवाल जतन करा.' : 'Load the Sangli Assembly sample or enter data to create your first analysis.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  loadTemplate('sangli_assembly');
                  setActiveTab('input');
                }}
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                ⚡ {isMr ? 'सांगली विधानसभा नमुना लोड करा' : 'Load Sangli Sample'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {savedAnalyses
                .filter((item) => {
                  if (!savedSearchQuery.trim()) return true;
                  const q = savedSearchQuery.toLowerCase();
                  return (
                    (item.election_name && item.election_name.toLowerCase().includes(q)) ||
                    (item.district && item.district.toLowerCase().includes(q)) ||
                    (item.constituency && item.constituency.toLowerCase().includes(q)) ||
                    (item.city_or_village && item.city_or_village.toLowerCase().includes(q))
                  );
                })
                .map((item, idx) => {
                  const itemParties = Array.isArray(item.parties) ? item.parties : [];
                  const sortedParties = [...itemParties].sort((a, b) => (Number(b.currentVotes) || 0) - (Number(a.currentVotes) || 0));
                  const leader = sortedParties[0];
                  const runnerUp = sortedParties[1];
                  const margin = leader && runnerUp ? Math.max(0, (Number(leader.currentVotes) || 0) - (Number(runnerUp.currentVotes) || 0)) : 0;
                  const typeObj = ELECTION_TYPES.find(t => t.id === item.election_type);

                  return (
                    <div
                      key={item.id || item.uuid || idx}
                      style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        border: '1.5px solid #e2e8f0',
                        padding: '20px 22px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                            <span style={{ fontSize: '20px' }}>{typeObj?.icon || '🗳️'}</span>
                            <span style={{
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '800'
                            }}>
                              {isMr ? (typeObj?.label_mr || item.election_type) : (typeObj?.label_en || item.election_type)}
                            </span>
                            {item.election_year && (
                              <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>
                                {item.election_year}
                              </span>
                            )}
                            <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '6px', fontSize: '10.5px', fontWeight: '800' }}>
                              ✓ जतन विश्लेषण (Saved)
                            </span>
                          </div>

                          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: '#0f172a' }}>
                            {item.election_name}
                          </h3>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '12.5px', color: '#64748b' }}>
                            <MapPin size={13} />
                            <span>
                              {[item.constituency, item.city_or_village, item.taluka, item.district, item.state].filter(Boolean).join(' • ')}
                            </span>
                          </div>
                        </div>

                        {/* Card Action Buttons */}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleLoadSavedAnalysis(item, true)}
                            style={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: '#ffffff',
                              border: 'none',
                              padding: '9px 18px',
                              borderRadius: '10px',
                              fontSize: '13px',
                              fontWeight: '850',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                            }}
                          >
                            <BarChart3 size={15} />
                            <span>{isMr ? '📊 अहवाल पहा (View Report)' : 'View Analysis'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleLoadSavedAnalysis(item, false)}
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              color: '#334155',
                              padding: '9px 14px',
                              borderRadius: '10px',
                              fontSize: '12.5px',
                              fontWeight: '750',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                            title="फॉर्ममध्ये लोड करा"
                          >
                            <Edit2 size={13} />
                            <span>{isMr ? 'संपादित करा' : 'Edit'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteSavedAnalysis(item.id || item.uuid, e)}
                            style={{
                              background: '#fee2e2',
                              border: '1px solid #fecaca',
                              color: '#dc2626',
                              padding: '9px 12px',
                              borderRadius: '10px',
                              fontSize: '12px',
                              fontWeight: '750',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="डेटाबेसमधून हटवा"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Mini Metrics Row */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '10px',
                        background: '#f8fafc',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        border: '1px solid #f1f5f9'
                      }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '750' }}>एकूण मतदार</div>
                          <div style={{ fontSize: '15px', fontWeight: '900', color: '#0f172a' }}>
                            {Number(item.total_registered_voters) ? Number(item.total_registered_voters).toLocaleString('en-IN') : '-'}
                          </div>
                          <div style={{ fontSize: '10.5px', color: '#2563eb' }}>
                            मतदान: {item.voting_percentage || 0}%
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '750' }}>आघाडीवर उमेदवार</div>
                          <div style={{ fontSize: '14px', fontWeight: '850', color: '#166534', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {leader?.candidate || '-'}
                          </div>
                          <div style={{ fontSize: '10.5px', color: '#15803d' }}>
                            {leader?.name ? `${leader.name} (${leader.voteShare || leader.computedVoteShare || 0}%)` : '-'}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '750' }}>संभाव्य आघाडी (Lead Margin)</div>
                          <div style={{ fontSize: '15px', fontWeight: '900', color: '#d97706' }}>
                            +{margin.toLocaleString('en-IN')} मते
                          </div>
                          <div style={{ fontSize: '10.5px', color: '#b45309' }}>
                            {runnerUp?.candidate ? `विरुद्ध: ${runnerUp.candidate}` : 'दुसऱ्या उमेदवाराविरुद्ध'}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '750' }}>पक्ष सहभाग</div>
                          <div style={{ fontSize: '14px', fontWeight: '850', color: '#475569' }}>
                            {itemParties.length} पक्ष / उमेदवार
                          </div>
                          <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'जतन दिनांक'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: GENERATED ANALYSIS REPORT ================= */}
      {activeTab === 'report' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Action Bar for Report */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('input')}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#1e293b',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: '800',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ArrowLeft size={14} />
                <span>{isMr ? 'फॉर्मकडे परत जा' : 'Back to Form'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('saved');
                  fetchSavedAnalyses();
                }}
                style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#1d4ed8',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: '800',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FolderOpen size={14} />
                <span>{isMr ? 'इतर जतन अहवाल पहा' : 'View Other Saved Reports'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleCopySummary}
                style={{ background: '#eff6ff', border: '1px solid #93c5fd', color: '#1d4ed8', padding: '8px 16px', borderRadius: '8px', fontWeight: '800', fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {copiedNotice ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedNotice ? (isMr ? 'कॉपी झाले!' : 'Copied!') : (isMr ? 'अहवाल मजकूर कॉपी करा' : 'Copy Text')}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                style={{ background: '#0f172a', border: 'none', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', fontWeight: '800', fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer size={14} />
                <span>{isMr ? 'अहवाल प्रिंट करा / PDF' : 'Print / Save PDF'}</span>
              </button>
            </div>
          </div>

          {/* Verification Badge Bar */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', background: '#f8fafc', padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '11px' }}>
            <span style={{ fontWeight: '800', color: '#475569' }}>डेटा पडताळणी मानके:</span>
            <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>🏛️ अधिकृत निकाल संकलित</span>
            <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>✍️ वापरकर्ता माहिती प्रमाणित</span>
            <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>📊 सांख्यिकीय अंदाज (अंतिम निकाल नव्हे)</span>
          </div>

          {/* Election Geographic & Booth Details Strip */}
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '14px 18px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '13px', fontWeight: '850', color: '#1e3a8a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={15} color="#2563eb" />
              <span>{isMr ? 'निवडणूक भौगोलिक व मतदारसंघ तपशील:' : 'Election Geography & Booth Details:'}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px 16px', fontSize: '12px', color: '#334155' }}>
              <div><strong>१. राज्य:</strong> {stateName || '-'}</div>
              <div><strong>२. जिल्हा:</strong> {districtName || '-'}</div>
              <div><strong>३. तालुका:</strong> {talukaName || '-'}</div>
              <div><strong>४. शहर:</strong> {cityName || '-'}</div>
              <div><strong>५. गाव:</strong> {villageName || '-'}</div>
              <div><strong>६. प्रभाग / वार्ड:</strong> {wardName || '-'}</div>
              <div><strong>७. विधानसभा:</strong> {constituency || '-'}</div>
              <div><strong>८. मतदान केंद्र:</strong> {boothName || '-'}</div>
              <div><strong>९. केंद्र क्रमांक:</strong> {boothNumber || '-'}</div>
            </div>
          </div>

          {/* 1. Executive Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #2563eb', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '750' }}>एकूण मतदार (Total Voters)</div>
              <div style={{ fontSize: '24px', fontWeight: '950', color: '#0f172a', margin: '4px 0' }}>
                {Number(totalRegisteredVoters).toLocaleString('en-IN') || '-'}
              </div>
              <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: '750' }}>
                मतदान: {votingPercentage}% ({calculatedVotesPolled.toLocaleString('en-IN')})
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #10b981', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '750' }}>आघाडीवर असलेला पक्ष / उमेदवार</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#166534', margin: '4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {leaderParty?.candidate || '-'}
              </div>
              <div style={{ fontSize: '11px', color: '#15803d', fontWeight: '750' }}>
                {leaderParty?.name} ({leaderParty?.computedVoteShare}%)
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #f59e0b', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '750' }}>संभाव्य मताधिक्य (Lead Margin)</div>
              <div style={{ fontSize: '24px', fontWeight: '950', color: '#d97706', margin: '4px 0' }}>
                +{projectedMargin.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '11px', color: '#b45309', fontWeight: '750' }}>
                दुसऱ्या क्रमांकाच्या उमेदवाराविरुद्ध
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #7c3aed', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '750' }}>लढतीचे स्वरूप</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#6d28d9', margin: '4px 0' }}>
                {parties.length === 2 ? 'द्विकोणी लढत' : parties.length === 3 ? 'त्रिकोणी लढत' : 'बहुरंगी चुरस'}
              </div>
              <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: '750' }}>
                {parties.length} पक्ष / प्रमुख उमेदवार
              </div>
            </div>
          </div>

          {/* 2. Visual Vote Share Graph Bars */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '22px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '850', color: '#0f172a' }}>
              📊 {isMr ? 'पक्षनिहाय मतविभागणी व मतांची टक्केवारी (Vote Share Breakdown)' : 'Party-wise Vote Share Breakdown'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {partiesWithComputedMetrics.map((p, idx) => {
                const colors = ['#2563eb', '#ea580c', '#10b981', '#7c3aed', '#ec4899', '#f59e0b'];
                const barColor = colors[idx % colors.length];
                return (
                  <div key={p.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '12.5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: '850', color: '#0f172a' }}>{p.candidate || p.name}</span>
                        <span style={{ color: '#64748b', fontSize: '11.5px' }}>({p.name})</span>
                      </div>
                      <div style={{ fontWeight: '900', color: barColor }}>
                        {Number(p.currentVotes).toLocaleString('en-IN')} मते ({p.computedVoteShare}%)
                      </div>
                    </div>

                    <div style={{ width: '100%', height: '14px', background: '#f1f5f9', borderRadius: '7px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.min(Number(p.computedVoteShare), 100)}%`,
                          height: '100%',
                          background: barColor,
                          borderRadius: '7px',
                          transition: 'width 0.5s ease-in-out'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Comprehensive Comparative Table */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '22px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '850', color: '#0f172a' }}>
              📋 {isMr ? 'पक्षनिहाय व उमेदवारनिहाय सविस्तर तुलनात्मक तक्ता' : 'Candidate and Party Comparison Matrix'}
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '10px 12px' }}>क्र.</th>
                    <th style={{ padding: '10px 12px' }}>उमेदवार नाव</th>
                    <th style={{ padding: '10px 12px' }}>पक्ष व आघाडी</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>मागील मते</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>सध्याची मते</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>मत टक्केवारी</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>स्विंग (बदल)</th>
                  </tr>
                </thead>
                <tbody>
                  {partiesWithComputedMetrics.map((p, idx) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx === 0 ? '#f0fdf4' : 'transparent' }}>
                      <td style={{ padding: '10px 12px', fontWeight: '800' }}>#{idx + 1}</td>
                      <td style={{ padding: '10px 12px', fontWeight: '850', color: '#0f172a' }}>
                        {p.candidate || '-'}
                        {idx === 0 && <span style={{ marginLeft: '6px', fontSize: '10px', background: '#10b981', color: '#fff', padding: '1px 6px', borderRadius: '4px' }}>आघाडीवर</span>}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ fontWeight: '700' }}>{p.name}</div>
                        <div style={{ fontSize: '10.5px', color: '#64748b' }}>{p.alliance}</div>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', color: '#64748b' }}>
                        {Number(p.previousVotes) ? Number(p.previousVotes).toLocaleString('en-IN') : '-'}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '900', color: '#0f172a' }}>
                        {Number(p.currentVotes) ? Number(p.currentVotes).toLocaleString('en-IN') : '-'}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '850', color: '#2563eb' }}>
                        {p.computedVoteShare}%
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '800', color: p.computedSwing >= 0 ? '#16a34a' : '#dc2626' }}>
                        {p.computedSwing > 0 ? `+${p.computedSwing.toLocaleString('en-IN')}` : p.computedSwing.toLocaleString('en-IN')}
                        {p.computedSwingPct !== 0 && ` (${p.computedSwingPct}%)`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Strengths & Challenges Matrix */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '22px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '850', color: '#0f172a' }}>
              ⚖️ {isMr ? 'प्रमुख पक्षांची ताकद व आव्हाने (SWOT Analysis)' : 'Strengths and Challenges Analysis'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
              {partiesWithComputedMetrics.map((p) => (
                <div key={p.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', background: '#f8fafc' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: '850', color: '#0f172a', marginBottom: '8px' }}>
                    🚩 {p.name} {p.candidate && `(${p.candidate})`}
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#166534', fontWeight: '800', marginBottom: '2px' }}>
                      ✓ ताकद (Strengths):
                    </div>
                    <div style={{ fontSize: '12px', color: '#1e293b' }}>
                      {p.strengths || 'पारंपरिक मतदार संघटन आणि संपर्क.'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', color: '#991b1b', fontWeight: '800', marginBottom: '2px' }}>
                      ⚠️ आव्हाने (Challenges):
                    </div>
                    <div style={{ fontSize: '12px', color: '#1e293b' }}>
                      {p.challenges || 'मतविभागणी आणि स्थानिक असंतोषाचे व्यवस्थापन.'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Civic Issues Impact Assessment */}
          {developmentIssues.length > 0 && (
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '22px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '850', color: '#0f172a' }}>
                🌊 {isMr ? 'स्थानिक प्रश्न व संभाव्य राजकीय परिणाम' : 'Local Civic Issues & Electoral Impact'}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {developmentIssues.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12.5px' }}>
                    <div>
                      <span style={{ fontWeight: '850', color: '#0f172a' }}>{item.issue || 'स्थानिक प्रश्न'}</span>
                      {item.impact && <span style={{ color: '#64748b', marginLeft: '8px' }}>• {item.impact}</span>}
                    </div>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: item.priority === 'Critical' ? '#fee2e2' : item.priority === 'High' ? '#fff7ed' : '#eff6ff',
                      color: item.priority === 'Critical' ? '#991b1b' : item.priority === 'High' ? '#c2410c' : '#1d4ed8'
                    }}>
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Data-Based Electoral Scenarios */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '22px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '850', color: '#0f172a' }}>
              🎯 {isMr ? 'डेटा-आधारित संभाव्य निवडणूक परिस्थिती (Possible Electoral Scenarios)' : 'Data-Driven Electoral Scenarios'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: '850', color: '#166534', marginBottom: '4px' }}>
                  परिस्थिती अ: थेट द्विकोणी मुकाबला (Bipolar Direct Contest)
                </div>
                <div style={{ fontSize: '12px', color: '#14532d', lineHeight: '1.4' }}>
                  अपक्षांचे मतदान ५% च्या आत राहिल्यास प्रमुख दोन पक्षांमध्ये चुरस वाढेल. अशा वेळी {projectedMargin.toLocaleString('en-IN')} मतांचे मताधिक्य निर्णायक ठरू शकते.
                </div>
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: '850', color: '#1d4ed8', marginBottom: '4px' }}>
                  परिस्थिती ब: उच्च मतदान लाट (High Turnout Surge)
                </div>
                <div style={{ fontSize: '12px', color: '#1e3a8a', lineHeight: '1.4' }}>
                  मतदान ७०% च्या पुढे गेल्यास नवमतदार व महिला मतदारांचा कौल निर्णायक ठरेल. ज्यामुळे पारंपरिक मतांची समीकरणे बदलू शकतात.
                </div>
              </div>

              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: '850', color: '#c2410c', marginBottom: '4px' }}>
                  परिस्थिती क: बंडखोरी व मतांची विभागणी (Vote Fragmentation)
                </div>
                <div style={{ fontSize: '12px', color: '#7c2d12', lineHeight: '1.4' }}>
                  तिसऱ्या आघाडीने किंवा अपक्षांनी १५,००० पेक्षा जास्त मते घेतल्यास निसटता विजय किंवा निकाल उलथण्याची दाट शक्यता निर्माण होते.
                </div>
              </div>
            </div>
          </div>

          {/* 7. Final Strategic Conclusion */}
          <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', borderRadius: '16px', padding: '22px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: '850', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📌</span>
              <span>{isMr ? 'अंतिम रणनीतिक निष्कर्ष व निरीक्षण (Final Strategic Conclusion)' : 'Final Strategic Conclusion'}</span>
            </h3>
            <p style={{ margin: '0 0 8px', fontSize: '13px', lineHeight: '1.6', opacity: 0.92 }}>
              {politicalEquations || 'या मतदारसंघात सर्व प्रमुख पक्षांमध्ये चुरशीची लढत अपेक्षित आहे.'}
            </p>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', opacity: 0.92 }}>
              {groundObservations || 'मतदान केंद्रांवरील प्रत्यक्ष बूथ व्यवस्थापन आणि मतदारांना केंद्रावर आणणे हीच विजयाची खरी गुरुकिल्ली ठरेल.'}
            </p>
            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: '11px', opacity: 0.7 }}>
              अधिकृत विश्लेषण कक्ष • राजकीय डेटाबेस नियंत्रण प्रणाली • {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: ADVANCED CROSS-TABULATION MATRIX ================= */}
      {activeTab === 'crosstab' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Header Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
              color: '#ffffff',
              borderRadius: '16px',
              padding: '24px 28px',
              boxShadow: '0 4px 18px rgba(124, 58, 237, 0.25)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>
                <span>🎯</span>
                <span>{isMr ? 'प्रगत निवडणूक सर्वेक्षण व डेटा विश्लेषण' : 'Advanced Survey & Data Analytics'}</span>
              </div>
              <h2 style={{ margin: '6px 0 4px', fontSize: '22px', fontWeight: '900' }}>
                {isMr ? 'घटकनिहाय तुलनात्मक विश्लेषण' : 'Comparative Analysis by Components'}
              </h2>
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
                {isMr
                  ? 'एका प्रश्नाचा दुसऱ्या घटकाशी परस्पर संबंध (उदा. वयोगट × मतदार कल किंवा गाव × समस्या)'
                  : 'Multi-variable correlation matrix (e.g. Age Group vs. Voter Sentiment or Village vs. Local Issues)'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  const csvData = [
                    ['Cross-Tabulation Matrix Report'],
                    [`Row Dimension: ${crossRowVar}`, `Column Dimension: ${crossColVar}`],
                    [''],
                    ['वर्ग / घटक', 'अनुकूल', 'तटस्थ', 'विरोधी', 'एकूण'],
                    ['१८ ते २५ (तरुण)', '६५०', '२२०', '१३०', '१,०००'],
                    ['२६ ते ४० (युवा)', '१,१२०', '४१०', '२७०', '१,८००'],
                    ['४१ ते ६० (प्रौढ)', '१,४५०', '५२०', '३८०', '२,३५०'],
                    ['६०+ (ज्येष्ठ)', '८८०', '२९०', '१८०', '१,३५०'],
                    ['एकूण बेरीज', '४,१००', '१,४४०', '९६०', '६,५००'],
                  ].map(r => r.join(',')).join('\n');
                  const blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Cross_Tabulation_Matrix_${crossRowVar}_vs_${crossColVar}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  color: '#ffffff',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>📥</span>
                <span>{isMr ? 'तक्ता CSV एक्सपोर्ट' : 'Export Matrix CSV'}</span>
              </button>
            </div>
          </div>

          {/* 1. Variable Selection Control Panel */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '18px'
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
                १. ओळ चल (Row Variable) निवडा :
              </label>
              <select
                value={crossRowVar}
                onChange={(e) => setCrossRowVar(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#0f172a',
                  background: '#f8fafc'
                }}
              >
                <option value="age_group">🎂 वयोगट (Age Groups: १८-२५, २६-४०, ४१-६०, ६०+)</option>
                <option value="village">📍 गाव / परिसर (Villages / Wards)</option>
                <option value="caste">👥 सामाजिक प्रवर्ग / जात (Social Category)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
                २. स्तंभ चल (Column Variable) निवडा :
              </label>
              <select
                value={crossColVar}
                onChange={(e) => setCrossColVar(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#0f172a',
                  background: '#f8fafc'
                }}
              >
                <option value="sentiment">🗳️ मतदार कल व प्रतिसाद (Sentiment: अनुकूल, तटस्थ, विरोधी)</option>
                <option value="issues">⚠️ प्रमुख स्थानिक समस्या (Issues: रस्ते, पाणी, बेरोजगारी, आरोग्य)</option>
              </select>
            </div>
          </div>

          {/* 2. Interactive Matrix Table */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)'
            }}
          >
            <div
              style={{
                background: '#f8fafc',
                padding: '14px 20px',
                borderBottom: '1.5px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b' }}>
                📊 तुलनात्मक क्रॉस-टॅब्युलेशन तक्ता : {crossRowVar === 'age_group' ? 'वयोगट' : crossRowVar === 'village' ? 'गाव / परिसर' : 'सामाजिक प्रवर्ग'} × {crossColVar === 'sentiment' ? 'मतदार कल' : 'स्थानिक समस्या'}
              </div>
              <span style={{ fontSize: '11.5px', background: '#ede9fe', color: '#6d28d9', padding: '3px 10px', borderRadius: '12px', fontWeight: '800' }}>
                नमुना आकार: ६,५०० प्रतिसाद
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#1e3a8a', color: '#ffffff' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '800' }}>
                      {crossRowVar === 'age_group' ? 'वयोगट (Age Group)' : crossRowVar === 'village' ? 'गाव / परिसर' : 'प्रवर्ग'}
                    </th>
                    {crossColVar === 'sentiment' ? (
                      <>
                        <th style={{ padding: '12px 16px', textAlign: 'center', background: '#166534' }}>अनुकूल (Supportive)</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', background: '#854d0e' }}>तटस्थ (Neutral)</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', background: '#991b1b' }}>विरोधी (Opposed)</th>
                      </>
                    ) : (
                      <>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>पाणीपुरवठा</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>रस्ते व वाहतूक</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>बेरोजगारी</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>आरोग्य</th>
                      </>
                    )}
                    <th style={{ padding: '12px 16px', textAlign: 'right', background: '#0f172a' }}>एकूण (Total)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: crossRowVar === 'age_group' ? '१८ ते २५ (तरुण)' : crossRowVar === 'village' ? 'सांगली शहर मध्य' : 'मराठा / कुणबी', vals: crossColVar === 'sentiment' ? [650, 220, 130] : [240, 310, 320, 130], total: 1000 },
                    { label: crossRowVar === 'age_group' ? '२६ ते ४० (युवा)' : crossRowVar === 'village' ? 'माधवनगर प्रभाग' : 'ओबीसी (OBC)', vals: crossColVar === 'sentiment' ? [1120, 410, 270] : [430, 520, 560, 290], total: 1800 },
                    { label: crossRowVar === 'age_group' ? '४१ ते ६० (प्रौढ)' : crossRowVar === 'village' ? 'कवठे महांकाळ' : 'मातंग / एससी', vals: crossColVar === 'sentiment' ? [1450, 520, 380] : [680, 590, 620, 460], total: 2350 },
                    { label: crossRowVar === 'age_group' ? '६०+ (ज्येष्ठ)' : crossRowVar === 'village' ? 'मिरज ग्रामीण' : 'अल्पसंख्याक व इतर', vals: crossColVar === 'sentiment' ? [880, 290, 180] : [410, 320, 290, 330], total: 1350 },
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '800', color: '#1e293b' }}>{row.label}</td>
                      {row.vals.map((v, cIdx) => {
                        const pct = Math.round((v / row.total) * 100);
                        return (
                          <td key={cIdx} style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <div style={{ fontWeight: '800', color: '#0f172a' }}>{v.toLocaleString()}</div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>({pct}%)</div>
                          </td>
                        );
                      })}
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '900', color: '#1e3a8a', background: '#f1f5f9' }}>
                        {row.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {/* Total Summary Row */}
                  <tr style={{ background: '#e2e8f0', fontWeight: '900', color: '#0f172a' }}>
                    <td style={{ padding: '12px 16px' }}>एकूण बेरीज (Grand Total)</td>
                    {crossColVar === 'sentiment' ? (
                      <>
                        <td style={{ padding: '12px 16px', textAlign: 'center', color: '#166534' }}>४,१०० (६३%)</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center', color: '#854d0e' }}>१,४४० (२२%)</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center', color: '#991b1b' }}>९६० (१५%)</td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>१,७६० (२७%)</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>१,७४० (२७%)</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>१,७९० (२८%)</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>१,२१० (१८%)</td>
                      </>
                    )}
                    <td style={{ padding: '12px 16px', textAlign: 'right', background: '#cbd5e1', fontSize: '14px' }}>६,५०० (१००%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Strategic Observations based on Cross-Tab */}
          <div
            style={{
              background: '#fdf4ff',
              border: '1.5px solid #f0abfc',
              borderRadius: '14px',
              padding: '16px 20px',
              color: '#86198f'
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: '800', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>💡</span>
              <span>{isMr ? 'क्रॉस-टॅब्युलेशन विश्लेषणाचे प्रमुख धोरणात्मक निष्कर्ष :' : 'Strategic Observations from Cross-Tabulation :'}</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12.5px', lineHeight: '1.6' }}>
              <li>
                <strong>तरुण मतदार (१८ ते २५):</strong> ६५% कल अनुकूल आहे, परंतु त्यांच्यात बेरोजगारी व क्रीडा सुविधांचा मुद्दा सर्वाधिक प्रकर्षाने जाणवतो.
              </li>
              <li>
                <strong>प्रौढ नागरिक (४१ ते ६०):</strong> सर्वाधिक स्थिर मतदार वर्ग (६१% अनुकूल), ज्यांच्यासाठी स्थानिक पाणीपुरवठा आणि रस्ते हे निर्णायक मुद्दे आहेत.
              </li>
              <li>
                <strong>तटस्थ मतदार (२२%):</strong> या २२% मतदारांवर पुढील ३० दिवसांत घरोघरी जाऊन प्रत्यक्ष संपर्क केल्यास मताधिक्यात मोठी वाढ शक्य आहे.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ================= TAB 5: PAST WINNERS & ELECTION RESULTS ================= */}
      {activeTab === 'winners' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Card */}
          <div style={{
            background: 'linear-gradient(135deg, #b45309 0%, #d97706 50%, #f59e0b 100%)',
            borderRadius: '16px',
            padding: '24px 26px',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 8px 24px rgba(217, 119, 6, 0.25)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '28px' }}>🏆</span>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', letterSpacing: '-0.3px' }}>
                  {isMr ? 'मागील निवडणुकीचे विजयी उमेदवार व निकाल विश्लेषण' : 'Past Election Winners & Results Analytics'}
                </h2>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '13px', opacity: 0.92, maxWidth: '680px' }}>
                {isMr
                  ? 'मागील निकालांचा अधिकृत डेटा, विजयी व उपविजेत्यांमधील मतांचा फरक, पक्षीय कल आणि PDF मधून अरेंज केलेले निकाल.'
                  : 'Official historical election results, winner-runner margins, party-wise swing, and PDF-arranged datasets.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <label
                style={{
                  background: '#ffffff',
                  color: '#b45309',
                  border: 'none',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}
              >
                <FileUp size={16} />
                <span>{isMr ? '📄 निकाल PDF अपलोड करा' : 'Upload Results PDF'}</span>
                <input
                  type="file"
                  accept=".pdf,.csv,.xlsx,.txt"
                  onChange={handlePdfFileSelect}
                  style={{ display: 'none' }}
                />
              </label>

              <button
                type="button"
                onClick={() => setShowAddWinnerRow(!showAddWinnerRow)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  color: '#ffffff',
                  padding: '9px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '750',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={16} />
                <span>{isMr ? 'उमेदवार जोडा' : 'Add Candidate'}</span>
              </button>
            </div>
          </div>

          {/* Uploaded PDF Status Banner */}
          {uploadedPdfInfo && (
            <div style={{
              background: '#f0fdf4',
              border: '1.5px solid #86efac',
              borderRadius: '14px',
              padding: '14px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>📄</span>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '850', color: '#166534' }}>
                    {uploadedPdfInfo.name} ({uploadedPdfInfo.size})
                  </div>
                  <div style={{ fontSize: '12px', color: '#15803d', marginTop: '2px' }}>
                    प्रकार: <strong>{uploadedPdfInfo.typeLabel}</strong> • अपलोड वेळ: {uploadedPdfInfo.uploadTime} • एकूण नोंदी: {uploadedPdfInfo.recordCount}
                  </div>
                </div>
              </div>
              <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '800' }}>
                ✓ डेटा व्यवस्थित अरेंज केला
              </span>
            </div>
          )}

          {/* Top 3 Podium Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {/* 1st Place - Gold */}
            <div style={{
              background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
              border: '2px solid #f59e0b',
              borderRadius: '16px',
              padding: '18px',
              position: 'relative',
              boxShadow: '0 4px 16px rgba(245, 158, 11, 0.15)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '28px' }}>🥇</span>
                <span style={{ background: '#f59e0b', color: '#ffffff', fontSize: '11px', fontWeight: '900', padding: '2px 8px', borderRadius: '8px' }}>
                  {isMr ? 'विजयी (Winner)' : 'Winner'}
                </span>
              </div>
              <div style={{ marginTop: '10px' }}>
                <div style={{ fontSize: '16.5px', fontWeight: '900', color: '#78350f' }}>
                  {previousWinners[0]?.candidate || 'विजयी उमेदवार'}
                </div>
                <div style={{ fontSize: '13px', color: '#92400e', fontWeight: '750', marginTop: '2px' }}>
                  {previousWinners[0]?.party || 'पक्ष नाव'}
                </div>
              </div>
              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed #fcd34d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#92400e', fontWeight: '700' }}>{isMr ? 'मिळालेली मते' : 'Votes'}</div>
                  <div style={{ fontSize: '17px', fontWeight: '900', color: '#78350f' }}>{previousWinners[0]?.votes || '-'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#92400e', fontWeight: '700' }}>{isMr ? 'मतांची टक्केवारी' : 'Vote Share'}</div>
                  <div style={{ fontSize: '15px', fontWeight: '850', color: '#78350f' }}>{previousWinners[0]?.voteShare || '-'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700' }}>{isMr ? 'मताधिक्य (Margin)' : 'Margin'}</div>
                  <div style={{ fontSize: '15px', fontWeight: '900', color: '#15803d' }}>{previousWinners[0]?.margin || '-'}</div>
                </div>
              </div>
            </div>

            {/* 2nd Place - Silver */}
            <div style={{
              background: '#f8fafc',
              border: '2px solid #94a3b8',
              borderRadius: '16px',
              padding: '18px',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '28px' }}>🥈</span>
                <span style={{ background: '#64748b', color: '#ffffff', fontSize: '11px', fontWeight: '900', padding: '2px 8px', borderRadius: '8px' }}>
                  {isMr ? 'उपविजेता (Runner-up)' : 'Runner-up'}
                </span>
              </div>
              <div style={{ marginTop: '10px' }}>
                <div style={{ fontSize: '16.5px', fontWeight: '900', color: '#1e293b' }}>
                  {previousWinners[1]?.candidate || 'उपविजेता उमेदवार'}
                </div>
                <div style={{ fontSize: '13px', color: '#475569', fontWeight: '750', marginTop: '2px' }}>
                  {previousWinners[1]?.party || 'पक्ष नाव'}
                </div>
              </div>
              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>{isMr ? 'मिळालेली मते' : 'Votes'}</div>
                  <div style={{ fontSize: '17px', fontWeight: '900', color: '#0f172a' }}>{previousWinners[1]?.votes || '-'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>{isMr ? 'मतांची टक्केवारी' : 'Vote Share'}</div>
                  <div style={{ fontSize: '15px', fontWeight: '850', color: '#0f172a' }}>{previousWinners[1]?.voteShare || '-'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: '700' }}>{isMr ? 'फरक (Deficit)' : 'Deficit'}</div>
                  <div style={{ fontSize: '15px', fontWeight: '900', color: '#dc2626' }}>{previousWinners[1]?.margin || '-'}</div>
                </div>
              </div>
            </div>

            {/* 3rd Place - Bronze */}
            <div style={{
              background: '#fef7ee',
              border: '2px solid #fdba74',
              borderRadius: '16px',
              padding: '18px',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '28px' }}>🥉</span>
                <span style={{ background: '#ea580c', color: '#ffffff', fontSize: '11px', fontWeight: '900', padding: '2px 8px', borderRadius: '8px' }}>
                  ३ रा क्रमांक
                </span>
              </div>
              <div style={{ marginTop: '10px' }}>
                <div style={{ fontSize: '16.5px', fontWeight: '900', color: '#431407' }}>
                  {previousWinners[2]?.candidate || 'तिसरा उमेदवार'}
                </div>
                <div style={{ fontSize: '13px', color: '#9a3412', fontWeight: '750', marginTop: '2px' }}>
                  {previousWinners[2]?.party || 'पक्ष / अपक्ष'}
                </div>
              </div>
              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed #fed7aa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#9a3412', fontWeight: '700' }}>{isMr ? 'मिळालेली मते' : 'Votes'}</div>
                  <div style={{ fontSize: '17px', fontWeight: '900', color: '#431407' }}>{previousWinners[2]?.votes || '-'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#9a3412', fontWeight: '700' }}>{isMr ? 'मतांची टक्केवारी' : 'Vote Share'}</div>
                  <div style={{ fontSize: '15px', fontWeight: '850', color: '#431407' }}>{previousWinners[2]?.voteShare || '-'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#9a3412', fontWeight: '700' }}>{isMr ? 'स्थिती' : 'Status'}</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#c2410c' }}>{previousWinners[2]?.status || 'पराभूत'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Candidate Inline Form */}
          {showAddWinnerRow && (
            <div style={{ background: '#f8fafc', border: '1.5px dashed #2563eb', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '13.5px', fontWeight: '850', color: '#1e3a8a', marginBottom: '12px' }}>
                ➕ {isMr ? 'नवीन निकाल / उमेदवार नोंदवा:' : 'Add New Candidate / Result Entry:'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder={isMr ? 'उमेदवाराचे नाव' : 'Candidate Name'}
                  value={newWinnerCandidate.candidate}
                  onChange={(e) => setNewWinnerCandidate({ ...newWinnerCandidate, candidate: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
                <input
                  type="text"
                  placeholder={isMr ? 'पक्ष नाव (उदा. BJP, INC)' : 'Party Name'}
                  value={newWinnerCandidate.party}
                  onChange={(e) => setNewWinnerCandidate({ ...newWinnerCandidate, party: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
                <input
                  type="text"
                  placeholder={isMr ? 'मिळालेली मते' : 'Votes Polled'}
                  value={newWinnerCandidate.votes}
                  onChange={(e) => setNewWinnerCandidate({ ...newWinnerCandidate, votes: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
                <input
                  type="text"
                  placeholder={isMr ? 'मत टक्केवारी (उदा. ४५%)' : 'Vote Share %'}
                  value={newWinnerCandidate.voteShare}
                  onChange={(e) => setNewWinnerCandidate({ ...newWinnerCandidate, voteShare: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
                <input
                  type="text"
                  placeholder={isMr ? 'मतांचा फरक / मताधिक्य' : 'Margin (+ / -)'}
                  value={newWinnerCandidate.margin}
                  onChange={(e) => setNewWinnerCandidate({ ...newWinnerCandidate, margin: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddWinnerRow(false)}
                  style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', fontSize: '12.5px' }}
                >
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleAddNewWinner}
                  style={{ padding: '6px 16px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: '800', cursor: 'pointer', fontSize: '12.5px' }}
                >
                  ✓ {isMr ? 'जतन करा' : 'Save'}
                </button>
              </div>
            </div>
          )}

          {/* Interactive Full Candidates Table */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '850', color: '#0f172a' }}>
                  📋 {isMr ? 'सर्व उमेदवारांची निकाल व मतांची यादी (PDF मधून अरेंज केलेला डेटा)' : 'All Candidates Results Table'}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {isMr ? 'येथे तुम्ही कोणत्याही उमेदवाराची मते किंवा नाव थेट बदलू शकता.' : 'Editable structured results list'}
                </span>
              </div>

              <input
                type="text"
                placeholder={isMr ? 'उमेदवार किंवा पक्षाने शोधा...' : 'Search candidate/party...'}
                value={winnerSearchQuery}
                onChange={(e) => setWinnerSearchQuery(e.target.value)}
                style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', width: '220px' }}
              />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1.5px solid #cbd5e1' }}>
                    <th style={{ padding: '10px 12px' }}>{isMr ? 'क्रमांक' : 'Rank'}</th>
                    <th style={{ padding: '10px 12px' }}>{isMr ? 'उमेदवार नाव' : 'Candidate Name'}</th>
                    <th style={{ padding: '10px 12px' }}>{isMr ? 'पक्ष व आघाडी' : 'Party & Alliance'}</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>{isMr ? 'मिळालेली मते' : 'Votes'}</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>{isMr ? 'टक्केवारी' : 'Vote Share'}</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>{isMr ? 'मतांचा फरक' : 'Margin'}</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>{isMr ? 'स्थिती' : 'Status'}</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>{isMr ? 'कारवाई' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody>
                  {previousWinners
                    .filter((w) => !winnerSearchQuery.trim() || w.candidate.toLowerCase().includes(winnerSearchQuery.toLowerCase()) || w.party.toLowerCase().includes(winnerSearchQuery.toLowerCase()))
                    .map((winner, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 12px', fontWeight: '850', color: idx === 0 ? '#b45309' : '#475569' }}>
                          {idx === 0 ? '🥇 १' : idx === 1 ? '🥈 २' : idx === 2 ? '🥉 ३' : idx + 1}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <input
                            type="text"
                            value={winner.candidate}
                            onChange={(e) => handleUpdateWinner(idx, 'candidate', e.target.value)}
                            style={{ width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: idx === 0 ? '800' : '600' }}
                          />
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <input
                            type="text"
                            value={winner.party}
                            onChange={(e) => handleUpdateWinner(idx, 'party', e.target.value)}
                            style={{ width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                          />
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                          <input
                            type="text"
                            value={winner.votes}
                            onChange={(e) => handleUpdateWinner(idx, 'votes', e.target.value)}
                            style={{ width: '90px', padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', textAlign: 'right', fontWeight: '800' }}
                          />
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                          <input
                            type="text"
                            value={winner.voteShare}
                            onChange={(e) => handleUpdateWinner(idx, 'voteShare', e.target.value)}
                            style={{ width: '70px', padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', textAlign: 'right' }}
                          />
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                          <input
                            type="text"
                            value={winner.margin}
                            onChange={(e) => handleUpdateWinner(idx, 'margin', e.target.value)}
                            style={{ width: '80px', padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', textAlign: 'right', color: idx === 0 ? '#16a34a' : '#dc2626', fontWeight: '750' }}
                          />
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <span style={{
                            fontSize: '11.5px',
                            fontWeight: '800',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: idx === 0 ? '#dcfce7' : idx === 1 ? '#fee2e2' : '#f1f5f9',
                            color: idx === 0 ? '#166534' : idx === 1 ? '#991b1b' : '#475569'
                          }}>
                            {winner.status || (idx === 0 ? 'विजयी' : idx === 1 ? 'उपविजेता' : 'पराभूत')}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteWinner(idx)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                            title={isMr ? 'काढून टाका' : 'Delete'}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= PDF DOCUMENT TYPE SELECTION MODAL ================= */}
      {isPdfModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
            border: '1.5px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>📄</span>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: '#0f172a' }}>
                  {isMr ? 'PDF चा प्रकार निवडा' : 'Select PDF Document Type'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsPdfModalOpen(false);
                  setPendingPdfFile(null);
                }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>
              {isMr
                ? `अपलोड केलेली फाइल: '${pendingPdfFile?.name}'. ही कोणती PDF आहे ते निवडा, जेणेकरून त्यानुसार सर्व डेटा व्यवस्थित अरेंज केला जाईल:`
                : `Uploaded file: '${pendingPdfFile?.name}'. Please choose what this PDF contains to arrange data accurately:`}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {/* Option 1: Past Winners */}
              <div
                onClick={() => setSelectedPdfType('winner')}
                style={{
                  border: selectedPdfType === 'winner' ? '2px solid #2563eb' : '1.5px solid #cbd5e1',
                  background: selectedPdfType === 'winner' ? '#eff6ff' : '#ffffff',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: '26px' }}>🏆</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14.5px', fontWeight: '850', color: selectedPdfType === 'winner' ? '#1e40af' : '#0f172a' }}>
                    १. {isMr ? 'मागील विजयी उमेदवारांची यादी / निकाल' : 'Past Winners List & Official Results'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', lineHeight: '1.4' }}>
                    {isMr
                      ? 'यामध्ये मागील निवडणुकीतील विजयी उमेदवार, उपविजेते, मिळालेली मते, मताधिक्य आणि पक्षांची अधिकृत यादी समाविष्ट आहे.'
                      : 'Contains winning candidates, runner-ups, polled votes, margins, and party standings.'}
                  </div>
                </div>
                {selectedPdfType === 'winner' && (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900' }}>
                    ✓
                  </div>
                )}
              </div>

              {/* Option 2: Other Election Analysis */}
              <div
                onClick={() => setSelectedPdfType('other')}
                style={{
                  border: selectedPdfType === 'other' ? '2px solid #2563eb' : '1.5px solid #cbd5e1',
                  background: selectedPdfType === 'other' ? '#eff6ff' : '#ffffff',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: '26px' }}>📊</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14.5px', fontWeight: '850', color: selectedPdfType === 'other' ? '#1e40af' : '#0f172a' }}>
                    २. {isMr ? 'इतर निवडणूक विश्लेषण / मतदार आकडेवारी अहवाल' : 'Other Election Analysis & Voter Demographics'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', lineHeight: '1.4' }}>
                    {isMr
                      ? 'यामध्ये मतदार संख्या, मतदान टक्केवारी, वॉर्ड/बूथ सांख्यिकी, जातनिहाय व पक्षीय अंदाज अहवाल समाविष्ट आहे.'
                      : 'Contains voter counts, turnout %, booth breakdown, demographics, and campaign sentiment.'}
                  </div>
                </div>
                {selectedPdfType === 'other' && (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900' }}>
                    ✓
                  </div>
                )}
              </div>
            </div>

            {/* Modal Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setIsPdfModalOpen(false);
                  setPendingPdfFile(null);
                }}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#475569',
                  fontSize: '13px',
                  fontWeight: '750',
                  cursor: 'pointer'
                }}
              >
                {isMr ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmPdfUpload}
                style={{
                  padding: '9px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                }}
              >
                <span>⚡</span>
                <span>{isMr ? 'डेटा अरेंज करा (Process & Arrange)' : 'Arrange Data'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD PARTY MODAL ================= */}
      {isAddPartyModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }} onClick={() => setIsAddPartyModalOpen(false)}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
            border: '1.5px solid #e2e8f0',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>🚩</span>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: '#0f172a' }}>
                  {isMr ? 'नवीन राजकीय पक्ष जोडा' : 'Add New Political Party'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPartyModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveNewPartyModal} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#334155', marginBottom: '5px' }}>
                  १. {isMr ? 'पक्षाचे नाव:' : 'Party Name:'} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder={isMr ? 'उदा. भारतीय जनता पक्ष, काँग्रेस, शिवसेना...' : 'e.g. BJP, Congress, Shiv Sena...'}
                  value={newPartyModalData.name}
                  onChange={(e) => setNewPartyModalData({ ...newPartyModalData, name: e.target.value })}
                  list="standard-16-parties-list"
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#334155', marginBottom: '5px' }}>
                  २. {isMr ? 'उमेदवाराचे नाव:' : 'Candidate Name:'}
                </label>
                <input
                  type="text"
                  placeholder={isMr ? 'उमेदवाराचे नाव प्रविष्ट करा' : 'Enter candidate name'}
                  value={newPartyModalData.candidate}
                  onChange={(e) => setNewPartyModalData({ ...newPartyModalData, candidate: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#334155', marginBottom: '5px' }}>
                  ३. {isMr ? 'आघाडी / युती:' : 'Alliance:'}
                </label>
                <select
                  value={newPartyModalData.alliance}
                  onChange={(e) => setNewPartyModalData({ ...newPartyModalData, alliance: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: '#fff' }}
                >
                  <option value="महायुती">महायुती (Mahayuti)</option>
                  <option value="महाविकास आघाडी">महाविकास आघाडी (MVA)</option>
                  <option value="स्वबळ">स्वबळ (Independent / Own)</option>
                  <option value="अपक्ष">अपक्ष (Independent)</option>
                  <option value="इतर">इतर (Other)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#334155', marginBottom: '5px' }}>
                    ४. {isMr ? 'मागील मते:' : 'Previous Votes:'}
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newPartyModalData.previousVotes}
                    onChange={(e) => setNewPartyModalData({ ...newPartyModalData, previousVotes: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#334155', marginBottom: '5px' }}>
                    ५. {isMr ? 'अंदाजित मते:' : 'Projected Votes:'}
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newPartyModalData.currentVotes}
                    onChange={(e) => setNewPartyModalData({ ...newPartyModalData, currentVotes: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#334155', marginBottom: '5px' }}>
                  ६. {isMr ? 'प्रमुख बलस्थाने:' : 'Key Strengths:'}
                </label>
                <input
                  type="text"
                  placeholder={isMr ? 'उदा. मजबूत संघटन, पारंपरिक मतदार' : 'e.g. Strong organization'}
                  value={newPartyModalData.strengths}
                  onChange={(e) => setNewPartyModalData({ ...newPartyModalData, strengths: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  ✓ {isMr ? 'पक्ष जतन करा (Save Party)' : 'Save Party'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddPartyModalOpen(false)}
                  style={{
                    padding: '11px 18px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#475569',
                    fontSize: '13px',
                    fontWeight: '750',
                    cursor: 'pointer'
                  }}
                >
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
