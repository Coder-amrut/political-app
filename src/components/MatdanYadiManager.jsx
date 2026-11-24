import apiClient from '../api/axios';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Users,
  Upload,
  Search,
  Filter,
  Download,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  Building2,
  Home,
  Check,
  ChevronDown,
  Printer,
  Eye,
  Trash2,
  RefreshCw,
  X
} from 'lucide-react';

// All 36 Official Districts of Maharashtra State
export const ALL_MAHARASHTRA_DISTRICTS = [
  'अहमदनगर',
  'अकोला',
  'अमरावती',
  'छत्रपती संभाजीनगर',
  'बीड',
  'भंडारा',
  'बुलढाणा',
  'चंद्रपूर',
  'धुळे',
  'गडचिरोली',
  'गोंदिया',
  'हिंगोली',
  'जळगाव',
  'जालना',
  'कोल्हापूर',
  'लातूर',
  'मुंबई शहर',
  'मुंबई उपनगर',
  'नागपूर',
  'नांदेड',
  'नंदुरबार',
  'नाशिक',
  'धाराशिव',
  'पालघर',
  'परभणी',
  'पुणे',
  'रायगड',
  'रत्नागिरी',
  'सांगली',
  'सातारा',
  'सिंधुदुर्ग',
  'सोलापूर',
  'ठाणे',
  'वर्धा',
  'वाशिम',
  'यवतमाळ'
];

// Comprehensive Master Geographical Catalog for all 36 Districts of Maharashtra
export const MASTER_GEOGRAPHY = {
  'सांगली': {
    'मिरज': ['माधवनगर', 'बुधगाव', 'कुपवाड', 'हरिपूर', 'सांगली शहर', 'मिरज शहर', 'कवलापूर', 'बामणोली', 'धामणी', 'कवठेपिरान', 'समडोळी', 'मालगाव', 'बिसूर', 'तुंग'],
    'तासगाव': ['तासगाव शहर', 'सावळज', 'विसापूर', 'चिंचणी', 'नांद्रे', 'मणेराजुरी', 'धोत्रे', 'आळते', 'निमणी', 'येळावी'],
    'वाळवा / इस्लामपूर': ['इस्लामपूर शहर', 'आष्टा', 'कासेगाव', 'बोरगाव', 'उरण इस्लामपूर', 'शिगाव', 'पेठ', 'तांबवे', 'नेर्ले', 'बहे'],
    'जत': ['जत शहर', 'उमदी', 'संख', 'मुचंडी', 'शेळकेवाडी', 'डफळापूर', 'दरीबडची', 'माडग्याळ', 'मोराबाग'],
    'खानापूर / विटा': ['विटा शहर', 'खानापूर', 'भाळवणी', 'पळशी', 'गारेडी', 'करंजे', 'देवराष्ट्रे', 'हिवरे', 'घाटनांद्रे'],
    'आटपाडी': ['आटपाडी शहर', 'दिघंची', 'खरसुंडी', 'नेलकरंजी', 'शेटफळे', 'घाणंद', 'करगणी', 'झरे'],
    'शिराळा': ['शिराळा शहर', 'कोकरूड', 'मांगले', 'शेडगेवाडी', 'चरण', 'वारुळा', 'बिळाशी', 'चांदोली'],
    'कडेगाव': ['कडेगाव शहर', 'वांगी', 'सोहळी', 'अंबक', 'नेरली', 'तडसर', 'शिवणी', 'हिंगणगाव'],
    'पलूस': ['पलूस शहर', 'भिलवडी', 'अंकलखोप', 'रामानंदनगर', 'बुरली', 'नागठाणे', 'आमणापूर', 'कुंडल'],
    'कवठे महांकाळ': ['कवठे महांकाळ शहर', 'ढालगाव', 'कुची', 'अग्रण धुळगाव', 'रांजणी', 'घोरपडी', 'देशिंग']
  },
  'कोल्हापूर': {
    'करवीर': ['कोल्हापूर शहर', 'उचगाव', 'गांधीनगर', 'पाचगाव', 'शिये', 'वडणगे'],
    'हातकणंगले': ['हातकणंगले शहर', 'इचलकरंजी', 'हुपरी', 'रुकडी', 'कोरोची'],
    'शिरोळ': ['शिरोळ शहर', 'जयसिंगपूर', 'कुरुंदवाड', 'नृसिंहवाडी', 'दानोळी'],
    'कागल': ['कागल शहर', 'सिद्धनेर्ली', 'मुरगूड'],
    'गडहिंग्लज': ['गडहिंग्लज शहर', 'नेसरी', 'महागाव'],
    'राधानगरी': ['राधानगरी', 'भोगावती', 'कौलव'],
    'पन्हाळा': ['पन्हाळा शहर', 'कोडोली', 'बांबवडे'],
    'भुदरगड': ['गारगोटी', 'पिंपळगाव', 'कडगाव'],
    'चंदगड': ['चंदगड शहर', 'तुर्केवाडी', 'हेरे'],
    'आजरा': ['आजरा शहर', 'उत्तूर', 'पेरणोली'],
    'शाहूवाडी': ['मलकापूर', 'बांबवडे', 'शित्तूर'],
    'गगनबावडा': ['बावडा', 'साळवण', 'अणदूर']
  },
  'सातारा': {
    'सातारा': ['सातारा शहर', 'शाहूपुरी', 'गोडोली', 'खंडाळा', 'शेंद्रे'],
    'कराड': ['कराड शहर', 'मलकापूर', 'ओगलेवाडी', 'वारुंजी', 'सैदापूर', 'कोयना वसाहत'],
    'फलटण': ['फलटण शहर', 'तरडगाव', 'बरड'],
    'कोरेगाव': ['कोरेगाव शहर', 'रहिमतपूर', 'किन्हई'],
    'वाई': ['वाई शहर', 'भुईंज', 'शिरवळ'],
    'महाबळेश्वर': ['महाबळेश्वर शहर', 'पाचगणी', 'प्रतापगड'],
    'पाटण': ['पाटण शहर', 'तारळे', 'कोयनानगर'],
    'जावळी': ['मेढा', 'कुडाळ', 'हुमगाव'],
    'खंडाळा': ['शिरवळ', 'लोणंद', 'खंडाळा'],
    'खटाव': ['वडूज', 'औंध', 'मायणी'],
    'माण': ['दहिवडी', 'म्हसवड', 'गोंदवले']
  },
  'पुणे': {
    'हवेली': ['पुणे शहर', 'पिंपरी चिंचवड', 'हडपसर', 'वाघोली'],
    'पुणे शहर': ['शिवाजीनगर', 'कोथरूड', 'कसबा पेठ', 'पर्वती'],
    'बारामती': ['बारामती शहर', 'माळेगाव', 'सुपा', 'मोरगाव'],
    'दौंड': ['दौंड शहर', 'यवत', 'पाटस'],
    'शिरूर': ['शिरूर शहर', 'शिक्रापूर', 'रांजणगाव'],
    'खेड': ['चाकण', 'राजगुरुनगर', 'आळंदी'],
    'आंबेगाव': ['मंचर', 'घोडेगाव', 'डिंभे'],
    'जुन्नर': ['जुन्नर शहर', 'नारायणगाव', 'ओतूर'],
    'मावळ': ['तळेगाव दाभाडे', 'लोणावळा', 'वडगाव मावळ'],
    'मुळशी': ['पौड', 'हिंजवडी', 'पिरंगुट'],
    'भोर': ['भोर शहर', 'नसरापूर', 'भोलावडे'],
    'वेल्हे': ['वेल्हे', 'पानशेत', 'विंझर'],
    'पुरंदर': ['सासवड शहर', 'जेजुरी', 'वीर'],
    'इंदापूर': ['इंदापूर शहर', 'भिगवण', 'बावडा']
  },
  'सोलापूर': {
    'उत्तर सोलापूर': ['सोलापूर शहर', 'मार्केट यार्ड', 'भवानी पेठ'],
    'दक्षिण सोलापूर': ['मंद्रूप', 'हत्तूर', 'कुंभारी'],
    'पंढरपूर': ['पंढरपूर शहर', 'गोपाळपूर', 'करकंब'],
    'बार्शी': ['बार्शी शहर', 'वैराग', 'पानगाव'],
    'अक्कलकोट': ['अक्कलकोट शहर', 'वागदरी', 'तडवळ'],
    'मोहोळ': ['मोहोळ शहर', 'कुरुल', 'कामती'],
    'माढा': ['माढा शहर', 'कुर्डुवाडी', 'टेंभुर्णी'],
    'करमाळा': ['करमाळा शहर', 'जेऊर', 'केम'],
    'सांगोला': ['सांगोला शहर', 'महुद', 'जवळा'],
    'मंगळवेढा': ['मंगळवेढा शहर', 'बोराळे', 'मरवडे'],
    'माळशिरस': ['अकलूज', 'नातेपुते', 'माळशिरस']
  },
  'अहमदनगर': {
    'नगर': ['अहमदनगर शहर', 'नागापूर', 'भालवणी'],
    'संगमनेर': ['संगमनेर शहर', 'आश्वी', 'धांदरफळ'],
    'राहाता': ['राहाता शहर', 'शिर्डी', 'लोणी'],
    'कोपरगाव': ['कोपरगाव शहर', 'पोहेगाव'],
    'श्रीरामपूर': ['श्रीरामपूर शहर', 'बेलापूर'],
    'नेवासा': ['नेवासा शहर', 'कुकाणा', 'सोनई'],
    'शेवगाव': ['शेवगाव शहर', 'बोधेगाव'],
    'पाथर्डी': ['पाथर्डी शहर', 'तिसगाव'],
    'जामखेड': ['जामखेड शहर', 'खर्डा'],
    'कर्जत': ['कर्जत शहर', 'मिरजगाव', 'राशिन'],
    'श्रीगोंदा': ['श्रीगोंदा शहर', 'मांडवगण'],
    'पारनेर': ['पारनेर शहर', 'सुपे', 'टाकळी ढोकेश्वर'],
    'अकोले': ['अकोले शहर', 'राजूर', 'समशेरपूर'],
    'राहुरी': ['राहुरी शहर', 'वांबोरी', 'देवळाली']
  },
  'छत्रपती संभाजीनगर': {
    'संभाजीनगर': ['औरंगाबाद शहर', 'सिडको', 'हडको'],
    'पैठण': ['पैठण शहर', 'बिडकीन', 'पाचोड'],
    'गंगापूर': ['गंगापूर शहर', 'वाळूज', 'लासूर'],
    'वैजापूर': ['वैजापूर शहर', 'शिऊर', 'लाडगाव'],
    'कन्नड': ['कन्नड शहर', 'पिशोर'],
    'खुलताबाद': ['खुलताबाद शहर', 'वेरूळ'],
    'सिल्लोड': ['सिल्लोड शहर', 'अजिंठा', 'भराडी'],
    'सोयगाव': ['सोयगाव शहर', 'जरंडी'],
    'फुलंब्री': ['फुलंब्री शहर', 'गणोरी']
  },
  'नाशिक': {
    'नाशिक': ['नाशिक शहर', 'पंचवटी', 'सिडको'],
    'मालेगाव': ['मालेगाव शहर', 'दाभाडी', 'झोडगे'],
    'सिन्नर': ['सिन्नर शहर', 'डुबेरे', 'पांढुर्ली'],
    'निफाड': ['निफाड शहर', 'पिंपळगाव बसवंत', 'लासलगाव'],
    'येवला': ['येवला शहर', 'अंदरसूल'],
    'इगतपुरी': ['इगतपुरी शहर', 'घोटी'],
    'दिंडोरी': ['दिंडोरी शहर', 'वणी'],
    'त्र्यंबकेश्वर': ['त्र्यंबकेश्वर शहर', 'अंजनेरी'],
    'कळवण': ['कळवण शहर', 'अभोटा'],
    'बागलाण': ['सटाणा शहर', 'ताहाराबाद'],
    'चांदवड': ['चांदवड शहर', 'वडनेर भैरव']
  },
  'ठाणे': {
    'ठाणे': ['ठाणे शहर', 'नौपाडा', 'कोपरी', 'वागळे'],
    'कल्याण': ['कल्याण शहर', 'टिटवाळा', 'मोहने'],
    'डोंबिवली': ['डोंबिवली शहर', 'मानपाडा'],
    'उल्हासनगर': ['उल्हासनगर शहर', 'विठ्ठलवाडी'],
    'भिवंडी': ['भिवंडी शहर', 'पडघा', 'खारबाव'],
    'अंबरनाथ': ['अंबरनाथ शहर', 'बदलापूर शहर'],
    'मुरबाड': ['मुरबाड शहर', 'सरळगाव'],
    'शहापूर': ['शहापूर शहर', 'आसनगाव', 'किन्हवली']
  },
  'पालघर': {
    'पालघर': ['पालघर शहर', 'बोईसर', 'सफाळे'],
    'वसई': ['वसई शहर', 'नालासोपारा', 'विरार'],
    'डहाणू': ['डहाणू शहर', 'घोलवड'],
    'तलासरी': ['तलासरी शहर', 'उधवा'],
    'जव्हार': ['जव्हार शहर', 'सायवन'],
    'मोखाडा': ['मोखाडा शहर', 'खोडाळा'],
    'वाडा': ['वाडा शहर', 'कुडूस'],
    'विक्रमगड': ['विक्रमगड शहर', 'ओंदे']
  },
  'रायगड': {
    'अलिबाग': ['अलिबाग शहर', 'रेवदंडा', 'मांडवा'],
    'पनवेल': ['पनवेल शहर', 'खारघर', 'तळोजा', 'कामोठे'],
    'उरण': ['उरण शहर', 'न्हावा शेवा'],
    'कर्जत': ['कर्जत शहर', 'नेरळ', 'कशेळे'],
    'खालापूर': ['खोपोली शहर', 'खालापूर'],
    'माणगाव': ['माणगाव शहर', 'गोरेगाव'],
    'रोहा': ['रोहा शहर', 'कोलाड'],
    'पेण': ['पेण शहर', 'वडखळ'],
    'महाड': ['महाड शहर', 'बिरवाडी']
  },
  'रत्नागिरी': {
    'रत्नागिरी': ['रत्नागिरी शहर', 'नाचणे', 'शिरगाव'],
    'चिपळूण': ['चिपळूण शहर', 'खेर्डी', 'सावर्डे'],
    'दापोली': ['दापोली शहर', 'हर्णै'],
    'खेड': ['खेड शहर', 'भरणे'],
    'गुहागर': ['गुहागर शहर', 'शृंगारतळी'],
    'संगमेश्वर': ['देवरूख', 'संगमेश्वर'],
    'लांजा': ['लांजा शहर', 'भांबेड'],
    'राजापूर': ['राजापूर शहर', 'नाटे']
  },
  'सिंधुदुर्ग': {
    'कुडाळ': ['कुडाळ शहर', 'माणगाव'],
    'कणकवली': ['कणकवली शहर', 'नांदगाव'],
    'सावंतवाडी': ['सावंतवाडी शहर', 'मादा'],
    'मालवण': ['मालवण शहर', 'तारकर्ली'],
    'वेंगुर्ला': ['वेंगुर्ला शहर', 'शिरोडा'],
    'देवगड': ['देवगड शहर', 'जामसांडे'],
    'दोडामार्ग': ['दोडामार्ग शहर', 'भेकुर्ली']
  },
  'नागपूर': {
    'नागपूर शहर': ['नागपूर शहर', 'धरमपेठ', 'सीताबर्डी'],
    'नागपूर ग्रामीण': ['वाडी', 'बुटीबोरी'],
    'कामठी': ['कामठी शहर', 'कन्हान'],
    'हिंगणा': ['हिंगणा शहर', 'डिगडोह'],
    'काटोल': ['काटोल शहर', 'कोंढाळी'],
    'नरखेड': ['नरखेड शहर', 'जलालखेडा'],
    'सावनेर': ['सावनेर शहर', 'खापा'],
    'रामटेक': ['रामटेक शहर', 'मनसर'],
    'उमरेड': ['उमरेड शहर', 'सिरसी']
  },
  'अमरावती': {
    'अमरावती': ['अमरावती शहर', 'बडनेरा'],
    'अचलपूर': ['परतवाडा', 'अचलपूर शहर'],
    'मोर्शी': ['मोर्शी शहर', 'वरूड शहर'],
    'दर्यापूर': ['दर्यापूर शहर', 'बनोसा'],
    'चांदूर बाजार': ['चांदूर बाजार शहर', 'ब्राह्मणवाडा'],
    'चिखलदरा': ['चिखलदरा शहर', 'सेमाडोह']
  },
  'अकोला': {
    'अकोला': ['अकोला शहर', 'उमरी'],
    'अकोट': ['अकोट शहर', 'चोहोट्टा'],
    'तेल्हारा': ['तेल्हारा शहर', 'हिवरखेड'],
    'बाळापूर': ['बाळापूर शहर', 'पारस'],
    'पातूर': ['पातूर शहर', 'बाभूळगाव'],
    'मुर्तिजापूर': ['मुर्तिजापूर शहर', 'माना']
  },
  'यवतमाळ': {
    'यवतमाळ': ['यवतमाळ शहर', 'लोहारा'],
    'पुसद': ['पुसद शहर', 'काली'],
    'उमरखेड': ['उमरखेड शहर', 'ढाणकी'],
    'दिग्रस': ['दिग्रस शहर', 'सिंगद'],
    'वणी': ['वणी शहर', 'मुकुटबन'],
    'दारव्हा': ['दारव्हा शहर', 'लाडखेड']
  },
  'बुलढाणा': {
    'बुलढाणा': ['बुलढाणा शहर', 'धाड'],
    'खामगाव': ['खामगाव शहर', 'रोहणखेड'],
    'शेगाव': ['शेगाव शहर', 'जलंब'],
    'चिखली': ['चिखली शहर', 'अंधेरा'],
    'मलकापूर': ['मलकापूर शहर', 'दसरा'],
    'मेहकर': ['मेहकर शहर', 'डोणगाव'],
    'लोणार': ['लोणार शहर', 'सुलतानपूर']
  },
  'वाशिम': {
    'वाशिम': ['वाशिम शहर', 'अंजाणी'],
    'कारंजा': ['कारंजा लाड शहर', 'कामठा'],
    'रिसोड': ['रिसोड शहर', 'मालेगाव शहर'],
    'मंगरूळपीर': ['मंगरूळपीर शहर', 'मानोरा शहर']
  },
  'वर्धा': {
    'वर्धा': ['वर्धा शहर', 'सेवाग्राम', 'पुलगाव'],
    'हिंगणघाट': ['हिंगणघाट शहर', 'वडनेर'],
    'आर्वी': ['आर्वी शहर', 'रोहणा'],
    'देवळी': ['देवळी शहर', 'भिडी']
  },
  'चंद्रपूर': {
    'चंद्रपूर': ['चंद्रपूर शहर', 'बल्लारपूर शहर'],
    'वरोरा': ['वरोरा शहर', 'माडेली'],
    'भद्रावती': ['भद्रावती शहर', 'माजरी'],
    'ब्रह्मपुरी': ['ब्रह्मपुरी शहर', 'आरमोरी'],
    'चिमूर': ['चिमूर शहर', 'नेरी']
  },
  'गडचिरोली': {
    'गडचिरोली': ['गडचिरोली शहर', 'पोर्ला'],
    'अहेरी': ['अहेरी शहर', 'आलापल्ली'],
    'आरमोरी': ['आरमोरी शहर', 'वडसा शहर'],
    'चामोर्शी': ['चामोर्शी शहर', 'घोट'],
    'सिरोंचा': ['सिरोंचा शहर', 'अंकिसा']
  },
  'भंडारा': {
    'भंडारा': ['भंडारा शहर', 'बेला'],
    'तुमसर': ['तुमसर शहर', 'सिहोरा'],
    'साकोली': ['साकोली शहर', 'एकडी'],
    'पवनी': ['पवनी शहर', 'कोंढा']
  },
  'गोंदिया': {
    'गोंदिया': ['गोंदिया शहर', 'कुडवा'],
    'तिरोडा': ['तिरोडा शहर', 'काचेवानी'],
    'आमगाव': ['आमगाव शहर', 'रिसामा'],
    'अर्जुनी मोरगाव': ['अर्जुनी शहर', 'केशोरी']
  },
  'नांदेड': {
    'नांदेड': ['नांदेड शहर', 'वाघाळा'],
    'लोहा': ['लोहा शहर', 'कंधार शहर'],
    'देगलूर': ['देगलूर शहर', 'मुखेड शहर'],
    'भोकर': ['भोकर शहर', 'मुदखेड शहर'],
    'किनवट': ['किनवट शहर', 'माहूर शहर'],
    'हदगाव': ['हदगाव शहर', 'हिमायतनगर शहर']
  },
  'लातूर': {
    'लातूर': ['लातूर शहर', 'गातेगाव'],
    'उदगीर': ['उदगीर शहर', 'नाळेश्वर'],
    'अहमदपूर': ['अहमदपूर शहर', 'किनगाव'],
    'औसा': ['औसा शहर', 'किल्लारी'],
    'निलंगा': ['निलंगा शहर', 'कासार बालकुंदा']
  },
  'बीड': {
    'बीड': ['बीड शहर', 'पेठ बीड'],
    'अंबाजोगाई': ['अंबाजोगाई शहर', 'बर्दापूर'],
    'परळी': ['परळी वैजनाथ शहर', 'धर्मापुरी'],
    'माजलगाव': ['माजलगाव शहर', 'दिंद्रुड'],
    'गेवराई': ['गेवराई शहर', 'उमापूर'],
    'आष्टी': ['आष्टी शहर', 'कडा']
  },
  'जालना': {
    'जालना': ['जालना शहर', 'रामगव्हाण'],
    'भोकरदन': ['भोकरदन शहर', 'हसनाबाद'],
    'परतूर': ['परतूर शहर', 'आष्टी'],
    'अंबड': ['अंबड शहर', 'वडीगोद्री']
  },
  'परभणी': {
    'परभणी': ['परभणी शहर', 'पेडगाव'],
    'गंगाखेड': ['गंगाखेड शहर', 'राणी सावरगाव'],
    'जिंतूर': ['जिंतूर शहर', 'बोरी'],
    'सेलू': ['सेलू शहर', 'वालूर']
  },
  'हिंगोली': {
    'हिंगोली': ['हिंगोली शहर', 'नरसी'],
    'वसमत': ['वसमत शहर', 'कुरुंदा'],
    'कळमनुरी': ['कळमनुरी शहर', 'आखाडा बाळापूर'],
    'औंढा नागनाथ': ['औंढा शहर', 'येळेगाव']
  },
  'धाराशिव': {
    'धाराशिव': ['धाराशिव शहर', 'तेर'],
    'तुळजापूर': ['तुळजापूर शहर', 'नळदुर्ग'],
    'उमरगा': ['उमरगा शहर', 'मुरुम'],
    'कळंब': ['कळंब शहर', 'शिराढोण'],
    'परांडा': ['परांडा शहर', 'आसोस्ता']
  },
  'जळगाव': {
    'जळगाव': ['जळगाव शहर', 'नशिराबाद'],
    'भुसावळ': ['भुसावळ शहर', 'वरणगाव'],
    'चाळीसगाव': ['चाळीसगाव शहर', 'मेहुणबारे'],
    'अमळनेर': ['अमळनेर शहर', 'मारवड'],
    'चोपडा': ['चोपडा शहर', 'हातेड'],
    'पाचोरा': ['पाचोरा शहर', 'पिंपळगाव']
  },
  'धुळे': {
    'धुळे': ['धुळे शहर', 'कुसुंबा'],
    'शिरपूर': ['शिरपूर शहर', 'थाळनेर'],
    'साक्री': ['साक्री शहर', 'पिंपळनेर'],
    'शिंदखेडा': ['शिंदखेडा शहर', 'नरडाणा']
  },
  'नंदुरबार': {
    'नंदुरबार': ['नंदुरबार शहर', 'कोपर्ली'],
    'शहादा': ['शहादा शहर', 'प्रकाशा'],
    'नवापूर': ['नवापूर शहर', 'खांडबारा'],
    'तळोदा': ['तळोदा शहर', 'प्रतापपूर']
  },
  'मुंबई शहर': {
    'कुलाबा': ['कुलाबा', 'फोर्ट', 'मरीन ड्राईव्ह', 'नरीमन पॉईंट'],
    'मलबार हिल': ['मलबार हिल', 'ताडदेव', 'नेपियन सी रोड'],
    'भायखळा': ['भायखळा', 'माझगाव', 'चिंचपोकळी'],
    'दादर': ['दादर पश्चिम', 'प्रभादेवी', 'माटुंगा'],
    'सायन': ['सायन', 'धारावी', 'अँटॉप हिल']
  },
  'मुंबई उपनगर': {
    'अंधेरी': ['अंधेरी पूर्व', 'अंधेरी पश्चिम', 'विलेपार्ले', 'जोगेश्वरी'],
    'वांद्रे': ['वांद्रे पश्चिम', 'खार', 'सांताक्रूझ', 'बीकेसी'],
    'बोरिवली': ['बोरिवली', 'कांदिवली', 'दहिसर', 'गोराई'],
    'घाटकोपर': ['घाटकोपर पूर्व', 'घाटकोपर पश्चिम', 'विद्याविहार', 'पवई'],
    'कुर्ला': ['कुर्ला', 'चुनाभट्टी', 'नेहरूनगर'],
    'मुलुंड': ['मुलुंड', 'भांडुप', 'कांजूरमार्ग']
  }
};

// Default initial dataset representing authentic Maharashtra Election Voter List covering all Talukas & Villages
const RAW_INITIAL_VOTERS = [
  // सांगली - मिरज
  { id: 1, epic_no: 'MT/44/282/001001', name_mr: 'रमेश पांडुरंग पाटील', name_en: 'Ramesh Pandurang Patil', relative_mr: 'पांडुरंग पाटील (वडील)', age: 52, gender: 'male', house_no: '१४२/अ', village: 'माधवनगर', taluka: 'मिरज', district: 'सांगली', booth_no: '१', booth_name: 'जिल्हा परिषद प्राथमिक शाळा, माधवनगर खोली क्र. १' },
  { id: 2, epic_no: 'MT/44/282/001002', name_mr: 'सुनिता रमेश पाटील', name_en: 'Sunita Ramesh Patil', relative_mr: 'रमेश पाटील (पती)', age: 48, gender: 'female', house_no: '१४२/अ', village: 'माधवनगर', taluka: 'मिरज', district: 'सांगली', booth_no: '१', booth_name: 'जिल्हा परिषद प्राथमिक शाळा, माधवनगर खोली क्र. १' },
  { id: 3, epic_no: 'MT/44/282/001003', name_mr: 'अमित रमेश पाटील', name_en: 'Amit Ramesh Patil', relative_mr: 'रमेश पाटील (वडील)', age: 24, gender: 'male', house_no: '१४२/अ', village: 'माधवनगर', taluka: 'मिरज', district: 'सांगली', booth_no: '१', booth_name: 'जिल्हा परिषद प्राथमिक शाळा, माधवनगर खोली क्र. १' },
  { id: 4, epic_no: 'MT/44/282/001004', name_mr: 'विकास संभाजी कदम', name_en: 'Vikas Sambhaji Kadam', relative_mr: 'संभाजी कदम (वडील)', age: 39, gender: 'male', house_no: '८९', village: 'बुधगाव', taluka: 'मिरज', district: 'सांगली', booth_no: '२', booth_name: 'ग्रामपंचायत प्राथमिक शाळा, बुधगाव' },
  { id: 5, epic_no: 'MT/44/282/001005', name_mr: 'सचिन बबन सूर्यवंशी', name_en: 'Sachin Baban Suryavanshi', relative_mr: 'बबन सूर्यवंशी (वडील)', age: 31, gender: 'male', house_no: '१०३', village: 'कुपवाड', taluka: 'मिरज', district: 'सांगली', booth_no: '३', booth_name: 'महापालिका शाळा क्र. १५, कुपवाड' },
  { id: 6, epic_no: 'MT/44/282/001006', name_mr: 'दीपक शंकर जाधव', name_en: 'Deepak Shankar Jadhav', relative_mr: 'शंकर जाधव (वडील)', age: 47, gender: 'male', house_no: '१२', village: 'हरिपूर', taluka: 'मिरज', district: 'सांगली', booth_no: '४', booth_name: 'प्राथमिक शाळा, हरिपूर' },
  { id: 7, epic_no: 'MT/44/282/001007', name_mr: 'किरण मारुती भोसले', name_en: 'Kiran Maruti Bhosale', relative_mr: 'मारुती भोसले (वडील)', age: 36, gender: 'male', house_no: '७८', village: 'सांगली शहर', taluka: 'मिरज', district: 'सांगली', booth_no: '५', booth_name: 'सिटी हायस्कूल, सांगली' },
  { id: 8, epic_no: 'MT/44/282/001008', name_mr: 'अविनाश विलास कोळी', name_en: 'Avinash Vilas Koli', relative_mr: 'विलास कोळी (वडील)', age: 29, gender: 'male', house_no: '५६', village: 'कवलापूर', taluka: 'मिरज', district: 'सांगली', booth_no: '६', booth_name: 'जि. प. शाळा कवलापूर' },
  { id: 9, epic_no: 'MT/44/282/001009', name_mr: 'संतोष महादेव गुरव', name_en: 'Santosh Mahadev Gurav', relative_mr: 'महादेव गुरव (वडील)', age: 42, gender: 'male', house_no: '३३', village: 'बामणोली', taluka: 'मिरज', district: 'सांगली', booth_no: '७', booth_name: 'ग्रामपंचायत शाळा बामणोली' },

  // सांगली - तासगाव
  { id: 10, epic_no: 'MT/44/283/001001', name_mr: 'सुनील दिनकर चव्हाण', name_en: 'Sunil Dinkar Chavan', relative_mr: 'दिनकर चव्हाण (वडील)', age: 50, gender: 'male', house_no: '११४', village: 'तासगाव शहर', taluka: 'तासगाव', district: 'सांगली', booth_no: '१', booth_name: 'नगरपरिषद प्राथमिक शाळा क्र. १, तासगाव' },
  { id: 11, epic_no: 'MT/44/283/001002', name_mr: 'ज्ञानेश्वर बापू सावंत', name_en: 'Dnyaneshwar Bapu Sawant', relative_mr: 'बापू सावंत (वडील)', age: 58, gender: 'male', house_no: '२३०', village: 'सावळज', taluka: 'तासगाव', district: 'सांगली', booth_no: '२', booth_name: 'जिल्हा परिषद शाळा, सावळज' },
  { id: 12, epic_no: 'MT/44/283/001003', name_mr: 'प्रशांत अशोक थोरात', name_en: 'Prashant Ashok Thorat', relative_mr: 'अशोक थोरात (वडील)', age: 33, gender: 'male', house_no: '१७', village: 'विसापूर', taluka: 'तासगाव', district: 'सांगली', booth_no: '३', booth_name: 'प्राथमिक शाळा विसापूर' },
  { id: 13, epic_no: 'MT/44/283/001004', name_mr: 'संगीता प्रशांत थोरात', name_en: 'Sangeeta Prashant Thorat', relative_mr: 'प्रशांत थोरात (पती)', age: 30, gender: 'female', house_no: '१७', village: 'विसापूर', taluka: 'तासगाव', district: 'सांगली', booth_no: '३', booth_name: 'प्राथमिक शाळा विसापूर' },
  { id: 14, epic_no: 'MT/44/283/001005', name_mr: 'अमोल आनंदा पाटील', name_en: 'Amol Ananda Patil', relative_mr: 'आनंदा पाटील (वडील)', age: 38, gender: 'male', house_no: '९५', village: 'मणेराजुरी', taluka: 'तासगाव', district: 'सांगली', booth_no: '४', booth_name: 'जि. प. शाळा मणेराजुरी' },

  // सांगली - वाळवा / इस्लामपूर
  { id: 15, epic_no: 'MT/44/284/001001', name_mr: 'विजय यशवंत पाटील', name_en: 'Vijay Yashwant Patil', relative_mr: 'यशवंत पाटील (वडील)', age: 45, gender: 'male', house_no: '६७', village: 'इस्लामपूर शहर', taluka: 'वाळवा / इस्लामपूर', district: 'सांगली', booth_no: '१', booth_name: 'उर्दू हायस्कूल, इस्लामपूर' },
  { id: 16, epic_no: 'MT/44/284/001002', name_mr: 'वैशाली विजय पाटील', name_en: 'Vaishali Vijay Patil', relative_mr: 'विजय पाटील (पती)', age: 41, gender: 'female', house_no: '६७', village: 'इस्लामपूर शहर', taluka: 'वाळवा / इस्लामपूर', district: 'सांगली', booth_no: '१', booth_name: 'उर्दू हायस्कूल, इस्लामपूर' },
  { id: 17, epic_no: 'MT/44/284/001003', name_mr: 'संदीप तुकाराम मोरे', name_en: 'Sandeep Tukaram More', relative_mr: 'तुकाराम मोरे (वडील)', age: 37, gender: 'male', house_no: '९१/अ', village: 'आष्टा', taluka: 'वाळवा / इस्लामपूर', district: 'सांगली', booth_no: '२', booth_name: 'शासकीय माध्यमिक शाळा, आष्टा' },
  { id: 18, epic_no: 'MT/44/284/001004', name_mr: 'महेश आनंदा खोत', name_en: 'Mahesh Ananda Khot', relative_mr: 'आनंदा खोत (वडील)', age: 34, gender: 'male', house_no: '५४', village: 'कासेगाव', taluka: 'वाळवा / इस्लामपूर', district: 'सांगली', booth_no: '३', booth_name: 'कासेगाव शिक्षण संस्था शाळा' },
  { id: 19, epic_no: 'MT/44/284/001005', name_mr: 'तानाजी रंगराव यादव', name_en: 'Tanaji Rangrao Yadav', relative_mr: 'रंगराव यादव (वडील)', age: 51, gender: 'male', house_no: '१२०', village: 'बोरगाव', taluka: 'वाळवा / इस्लामपूर', district: 'सांगली', booth_no: '४', booth_name: 'जि. प. प्राथमिक शाळा बोरगाव' },

  // सांगली - जत
  { id: 20, epic_no: 'MT/44/285/001001', name_mr: 'राजेंद्र बाबुराव शिंदे', name_en: 'Rajendra Baburao Shinde', relative_mr: 'बाबुराव शिंदे (वडील)', age: 53, gender: 'male', house_no: '१४', village: 'जत शहर', taluka: 'जत', district: 'सांगली', booth_no: '१', booth_name: 'पंचायत समिती प्राथमिक शाळा, जत' },
  { id: 21, epic_no: 'MT/44/285/001002', name_mr: 'सीमा राजेंद्र शिंदे', name_en: 'Seema Rajendra Shinde', relative_mr: 'राजेंद्र शिंदे (पती)', age: 49, gender: 'female', house_no: '१४', village: 'जत शहर', taluka: 'जत', district: 'सांगली', booth_no: '१', booth_name: 'पंचायत समिती प्राथमिक शाळा, जत' },
  { id: 22, epic_no: 'MT/44/285/001003', name_mr: 'बसवराज मल्लप्पा बिरादार', name_en: 'Basavraj Mallappa Biradar', relative_mr: 'मल्लप्पा बिरादार (वडील)', age: 46, gender: 'male', house_no: '६३', village: 'उमदी', taluka: 'जत', district: 'सांगली', booth_no: '२', booth_name: 'शासकीय हायस्कूल, उमदी' },
  { id: 23, epic_no: 'MT/44/285/001004', name_mr: 'सिद्धाप्पा इराप्पा पाटील', name_en: 'Siddhappa Irappa Patil', relative_mr: 'इराप्पा पाटील (वडील)', age: 39, gender: 'male', house_no: '२९', village: 'संख', taluka: 'जत', district: 'सांगली', booth_no: '३', booth_name: 'जि. प. शाळा, संख' },
  { id: 24, epic_no: 'MT/44/285/001005', name_mr: 'संजय आप्पासाहेब चव्हाण', name_en: 'Sanjay Appasaheb Chavan', relative_mr: 'आप्पासाहेब चव्हाण (वडील)', age: 41, gender: 'male', house_no: '८८', village: 'डफळापूर', taluka: 'जत', district: 'सांगली', booth_no: '४', booth_name: 'डफळापूर हायस्कूल' },

  // सांगली - खानापूर / विटा
  { id: 25, epic_no: 'MT/44/286/001001', name_mr: 'हणमंत तुकाराम बाबर', name_en: 'Hanmant Tukaram Babar', relative_mr: 'तुकाराम बाबर (वडील)', age: 48, gender: 'male', house_no: '४२', village: 'विटा शहर', taluka: 'खानापूर / विटा', district: 'सांगली', booth_no: '१', booth_name: 'विटा नगरपालिका मुलांची शाळा क्र. १' },
  { id: 26, epic_no: 'MT/44/286/001002', name_mr: 'छाया हणमंत बाबर', name_en: 'Chhaya Hanmant Babar', relative_mr: 'हणमंत बाबर (पती)', age: 44, gender: 'female', house_no: '४२', village: 'विटा शहर', taluka: 'खानापूर / विटा', district: 'सांगली', booth_no: '१', booth_name: 'विटा नगरपालिका मुलांची शाळा क्र. १' },
  { id: 27, epic_no: 'MT/44/286/001003', name_mr: 'सतीश विठ्ठल मोहिते', name_en: 'Satish Vitthal Mohite', relative_mr: 'विठ्ठल मोहिते (वडील)', age: 37, gender: 'male', house_no: '१५/ब', village: 'खानापूर', taluka: 'खानापूर / विटा', district: 'सांगली', booth_no: '२', booth_name: 'जि. प. प्राथमिक शाळा खानापूर' },
  { id: 28, epic_no: 'MT/44/286/001004', name_mr: 'नितीन विष्णू पाटील', name_en: 'Nitin Vishnu Patil', relative_mr: 'विष्णू पाटील (वडील)', age: 32, gender: 'male', house_no: '६१', village: 'भाळवणी', taluka: 'खानापूर / विटा', district: 'सांगली', booth_no: '३', booth_name: 'ग्रामपंचायत कार्यालय भाळवणी' },

  // सांगली - आटपाडी
  { id: 29, epic_no: 'MT/44/287/001001', name_mr: 'तानाजी ज्ञानदेव पाटील', name_en: 'Tanaji Dnyandev Patil', relative_mr: 'ज्ञानदेव पाटील (वडील)', age: 55, gender: 'male', house_no: '७२', village: 'आटपाडी शहर', taluka: 'आटपाडी', district: 'सांगली', booth_no: '१', booth_name: 'आटपाडी हायस्कूल, मुख्य इमारत' },
  { id: 30, epic_no: 'MT/44/287/001002', name_mr: 'दीपाली तानाजी पाटील', name_en: 'Deepali Tanaji Patil', relative_mr: 'तानाजी पाटील (पती)', age: 50, gender: 'female', house_no: '७२', village: 'आटपाडी शहर', taluka: 'आटपाडी', district: 'सांगली', booth_no: '१', booth_name: 'आटपाडी हायस्कूल, मुख्य इमारत' },
  { id: 31, epic_no: 'MT/44/287/001003', name_mr: 'अशोक जगन्नाथ देशमुख', name_en: 'Ashok Jagannath Deshmukh', relative_mr: 'जगन्नाथ देशमुख (वडील)', age: 49, gender: 'male', house_no: '१३०', village: 'दिघंची', taluka: 'आटपाडी', district: 'सांगली', booth_no: '२', booth_name: 'जि. प. मुलांची शाळा, दिघंची' },
  { id: 32, epic_no: 'MT/44/287/001004', name_mr: 'बळीराम विठोबा मेटकरी', name_en: 'Baliram Vithoba Metkari', relative_mr: 'विठोबा मेटकरी (वडील)', age: 43, gender: 'male', house_no: '२४', village: 'खरसुंडी', taluka: 'आटपाडी', district: 'सांगली', booth_no: '३', booth_name: 'सिद्धनाथ हायस्कूल, खरसुंडी' },

  // सांगली - शिराळा
  { id: 33, epic_no: 'MT/44/288/001001', name_mr: 'विक्रमसिंह मानसिंग नाईक', name_en: 'Vikramsinh Mansing Naik', relative_mr: 'मानसिंग नाईक (वडील)', age: 46, gender: 'male', house_no: '०५', village: 'शिराळा शहर', taluka: 'शिराळा', district: 'सांगली', booth_no: '१', booth_name: 'विश्वासराव नाईक हायस्कूल शिराळा' },
  { id: 34, epic_no: 'MT/44/288/001002', name_mr: 'राजाराम बाजीराव पाटील', name_en: 'Rajaram Bajirao Patil', relative_mr: 'बाजीराव पाटील (वडील)', age: 60, gender: 'male', house_no: '८८', village: 'कोकरूड', taluka: 'शिराळा', district: 'सांगली', booth_no: '२', booth_name: 'जि. प. प्राथमिक शाळा कोकरूड' },
  { id: 35, epic_no: 'MT/44/288/001003', name_mr: 'उदयसिंह सर्जेराव कदम', name_en: 'Udaysinh Sarjerao Kadam', relative_mr: 'सर्जेराव कदम (वडील)', age: 35, gender: 'male', house_no: '४१', village: 'मांगले', taluka: 'शिराळा', district: 'सांगली', booth_no: '३', booth_name: 'मांगले हायस्कूल' },

  // सांगली - कडेगाव
  { id: 36, epic_no: 'MT/44/289/001001', name_mr: 'विश्वजीत पतंगराव कदम', name_en: 'Vishwajeet Patangrao Kadam', relative_mr: 'पतंगराव कदम (वडील)', age: 42, gender: 'male', house_no: '०१', village: 'कडेगाव शहर', taluka: 'कडेगाव', district: 'सांगली', booth_no: '१', booth_name: 'भारती विद्यापीठ शाळा कडेगाव' },
  { id: 37, epic_no: 'MT/44/289/001002', name_mr: 'संजय शंकर मोहिते', name_en: 'Sanjay Shankar Mohite', relative_mr: 'शंकर मोहिते (वडील)', age: 52, gender: 'male', house_no: '७६', village: 'वांगी', taluka: 'कडेगाव', district: 'सांगली', booth_no: '२', booth_name: 'जि. प. शाळा वांगी' },
  { id: 38, epic_no: 'MT/44/289/001003', name_mr: 'प्रवीण आनंदराव देशमुख', name_en: 'Pravin Anandrao Deshmukh', relative_mr: 'आनंदराव देशमुख (वडील)', age: 38, gender: 'male', house_no: '३३', village: 'सोहळी', taluka: 'कडेगाव', district: 'सांगली', booth_no: '३', booth_name: 'प्राथमिक शाळा सोहळी' },

  // सांगली - पलूस
  { id: 39, epic_no: 'MT/44/290/001001', name_mr: 'शरद शंकर पाटील', name_en: 'Sharad Shankar Patil', relative_mr: 'शंकर पाटील (वडील)', age: 47, gender: 'male', house_no: '८९', village: 'पलूस शहर', taluka: 'पलूस', district: 'सांगली', booth_no: '१', booth_name: 'पलूस नगरपरिषद मुलांची शाळा' },
  { id: 40, epic_no: 'MT/44/290/001002', name_mr: 'अरविंद वसंतराव चौगुले', name_en: 'Arvind Vasantrao Chougule', relative_mr: 'वसंतराव चौगुले (वडील)', age: 53, gender: 'male', house_no: '१४', village: 'भिलवडी', taluka: 'पलूस', district: 'सांगली', booth_no: '२', booth_name: 'चितळे हायस्कूल भिलवडी' },
  { id: 41, epic_no: 'MT/44/290/001003', name_mr: 'गणेश तुकाराम साळुंखे', name_en: 'Ganesh Tukaram Salunkhe', relative_mr: 'तुकाराम साळुंखे (वडील)', age: 36, gender: 'male', house_no: '४५', village: 'अंकलखोप', taluka: 'पलूस', district: 'सांगली', booth_no: '३', booth_name: 'जि. प. शाळा अंकलखोप' },

  // सांगली - कवठे महांकाळ
  { id: 42, epic_no: 'MT/44/291/001001', name_mr: 'रोहित आर. आर. पाटील', name_en: 'Rohit R. R. Patil', relative_mr: 'आर. आर. पाटील (वडील)', age: 26, gender: 'male', house_no: '१५', village: 'कवठे महांकाळ शहर', taluka: 'कवठे महांकाळ', district: 'सांगली', booth_no: '१', booth_name: 'महाकाली हायस्कूल कवठे महांकाळ' },
  { id: 43, epic_no: 'MT/44/291/001002', name_mr: 'अनिल बबन पाटील', name_en: 'Anil Baban Patil', relative_mr: 'बबन पाटील (वडील)', age: 49, gender: 'male', house_no: '९२', village: 'ढालगाव', taluka: 'कवठे महांकाळ', district: 'सांगली', booth_no: '२', booth_name: 'जि. प. शाळा ढालगाव' },
  { id: 44, epic_no: 'MT/44/291/001003', name_mr: 'संतोष तानाजी कोळेकर', name_en: 'Santosh Tanaji Kolekar', relative_mr: 'तानाजी कोळेकर (वडील)', age: 39, gender: 'male', house_no: '६३', village: 'कुची', taluka: 'कवठे महांकाळ', district: 'सांगली', booth_no: '३', booth_name: 'प्राथमिक शाळा कुची' },

  // कोल्हापूर जिल्हा
  { id: 45, epic_no: 'MT/45/274/001001', name_mr: 'संजय सदाशिव गायकवाड', name_en: 'Sanjay Sadashiv Gaikwad', relative_mr: 'सदाशिव गायकवाड (वडील)', age: 48, gender: 'male', house_no: '१०२', village: 'कोल्हापूर शहर', taluka: 'करवीर', district: 'कोल्हापूर', booth_no: '१', booth_name: 'महानगरपालिका हायस्कूल, कोल्हापूर' },
  { id: 46, epic_no: 'MT/45/275/001001', name_mr: 'प्रकाश बाबूराव आवळे', name_en: 'Prakash Baburao Awale', relative_mr: 'बाबूराव आवळे (वडील)', age: 45, gender: 'male', house_no: '२४', village: 'इचलकरंजी', taluka: 'हातकणंगले', district: 'कोल्हापूर', booth_no: '१', booth_name: 'डी. के. टी. ई. हायस्कूल, इचलकरंजी' },
  { id: 47, epic_no: 'MT/45/276/001001', name_mr: 'सुरेश विष्णू कांबळे', name_en: 'Suresh Vishnu Kamble', relative_mr: 'विष्णू कांबळे (वडील)', age: 40, gender: 'male', house_no: '८८', village: 'जयसिंगपूर', taluka: 'शिरोळ', district: 'कोल्हापूर', booth_no: '१', booth_name: 'जयसिंगपूर हायस्कूल' },

  // सातारा जिल्हा
  { id: 48, epic_no: 'MT/46/259/001001', name_mr: 'पृथ्वीराज डी. चव्हाण', name_en: 'Prithviraj D. Chavan', relative_mr: 'दाजीसाहेब चव्हाण (वडील)', age: 58, gender: 'male', house_no: '१२', village: 'कराड शहर', taluka: 'कराड', district: 'सातारा', booth_no: '१', booth_name: 'तिलक हायस्कूल, कराड' },
  { id: 49, epic_no: 'MT/46/260/001001', name_mr: 'शिवेंद्रराजे अभयसिंहराजे भोसले', name_en: 'Shivendraraje Bhosale', relative_mr: 'अभयसिंहराजे भोसले (वडील)', age: 52, gender: 'male', house_no: '०१', village: 'सातारा शहर', taluka: 'सातारा', district: 'सातारा', booth_no: '१', booth_name: 'सैनिक स्कूल, सातारा' },

  // पुणे जिल्हा
  { id: 50, epic_no: 'MT/47/210/001001', name_mr: 'अमोल शांताराम तावरे', name_en: 'Amol Shantaram Taware', relative_mr: 'शांताराम तावरे (वडील)', age: 38, gender: 'male', house_no: '५५', village: 'बारामती शहर', taluka: 'बारामती', district: 'पुणे', booth_no: '१', booth_name: 'विद्या प्रतिष्ठान, बारामती' },
  { id: 51, epic_no: 'MT/47/214/001001', name_mr: 'समीर विठ्ठल जोशी', name_en: 'Sameer Vitthal Joshi', relative_mr: 'विठ्ठल जोशी (वडील)', age: 42, gender: 'male', house_no: '४०१', village: 'पुणे शहर', taluka: 'हवेली', district: 'पुणे', booth_no: '१', booth_name: 'ज्ञान प्रबोधिनी, पुणे' },

  // सोलापूर जिल्हा
  { id: 52, epic_no: 'MT/48/248/001001', name_mr: 'प्रशांत बसवराज कोळी', name_en: 'Prashant Basavraj Koli', relative_mr: 'बसवराज कोळी (वडील)', age: 36, gender: 'male', house_no: '१४', village: 'सोलापूर शहर', taluka: 'उत्तर सोलापूर', district: 'सोलापूर', booth_no: '१', booth_name: 'हरिभाई देवकरण हायस्कूल' },
  { id: 53, epic_no: 'MT/48/252/001001', name_mr: 'ज्ञानेश्वर पांडुरंग बडवे', name_en: 'Dnyaneshwar Pandurang Badve', relative_mr: 'पांडुरंग बडवे (वडील)', age: 49, gender: 'male', house_no: '७२', village: 'पंढरपूर शहर', taluka: 'पंढरपूर', district: 'सोलापूर', booth_no: '१', booth_name: 'कर्मवीर भाऊराव पाटील शाळा, पंढरपूर' },
];

export const SURNAME_CASTE_MAP = {
  'पाटील': 'मराठा',
  'कदम': 'मराठा',
  'जाधव': 'मराठा',
  'भोसले': 'मराठा',
  'चव्हाण': 'मराठा',
  'सावंत': 'मराठा',
  'थोरात': 'मराठा',
  'मोरे': 'मराठा',
  'यादव': 'मराठा',
  'शिंदे': 'मराठा',
  'बाबर': 'मराठा',
  'मोहिते': 'मराठा',
  'देशमुख': 'मराठा',
  'नाईक': 'मराठा',
  'साळुंखे': 'मराठा',
  'तावरे': 'मराठा',
  'माने': 'मराठा',
  'पवार': 'मराठा',
  'सूर्यवंशी': 'बौद्ध (SC)',
  'गायकवाड': 'बौद्ध (SC)',
  'कांबळे': 'बौद्ध (SC)',
  'वाघमारे': 'बौद्ध (SC)',
  'आवळे': 'मातंग (SC)',
  'साठे': 'मातंग (SC)',
  'कोळी': 'कोळी (SBC)',
  'गुरव': 'गुरव (OBC)',
  'माळी': 'माळी (OBC)',
  'सुतार': 'सुतार (OBC)',
  'कुंभार': 'कुंभार (OBC)',
  'मेटकरी': 'धनगर (NT-C)',
  'कोळेकर': 'धनगर (NT-C)',
  'खोत': 'जैन',
  'चौगुले': 'जैन',
  'बिरादार': 'लिंगायत',
  'जोशी': 'ब्राह्मण',
  'बडवे': 'ब्राह्मण',
  'कुलकर्णी': 'ब्राह्मण',
  'देशपांडे': 'ब्राह्मण',
  'गाडगीळ': 'ब्राह्मण',
};

export const getVoterCaste = (voter) => {
  if (voter?.caste) return voter.caste;
  if (voter?.cast) return voter.cast;
  const fullName = voter?.name_mr || voter?.name_en || '';
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const surname = parts.length > 0 ? parts[parts.length - 1] : '';
  for (const [key, val] of Object.entries(SURNAME_CASTE_MAP)) {
    if (surname.includes(key) || key.includes(surname)) {
      return val;
    }
  }
  return 'मराठा';
};

export const getVoterNameParts = (fullName = '') => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: '', surname: '' };
  if (parts.length === 1) return { firstName: parts[0], surname: parts[0] };
  return {
    firstName: parts[0],
    surname: parts[parts.length - 1],
  };
};

export const getSearchPlaceholder = (type, isMr) => {
  switch (type) {
    case 'caste':
      return isMr
        ? 'जात किंवा प्रवर्गाने शोधा (उदा. मराठा, बौद्ध, कोळी, धनगर, ब्राह्मण, जैन, लिंगायत...)'
        : 'Search specifically by caste (e.g. Maratha, OBC, SC, Dhangar, Jain...)...';
    case 'name':
      return isMr
        ? 'मतदाराच्या नावाने शोधा (उदा. रमेश, विकास, सचिन, दीपक, किरण...)'
        : 'Search specifically by voter name (e.g. Ramesh, Vikas, Sachin...)...';
    case 'surname':
      return isMr
        ? 'आडनावाने शोधा (उदा. पाटील, कदम, सूर्यवंशी, जाधव, भोसले, चव्हाण...)'
        : 'Search specifically by surname (e.g. Patil, Kadam, Suryavanshi...)...';
    case 'village':
      return isMr
        ? 'गावाच्या नावाने शोधा (उदा. माधवनगर, बुधगाव, कुपवाड, हरिपूर...)'
        : 'Search specifically by village (e.g. Madhavnagar, Budhgaon...)...';
    case 'area':
      return isMr
        ? 'परिसराच्या नावाने शोधा (उदा. स्टेशन रोड, विश्रामबाग...)'
        : 'Search specifically by area (e.g. Station Area, Vishrambag...)...';
    case 'ward':
      return isMr
        ? 'वॉर्ड किंवा प्रभागाने शोधा (उदा. प्रभाग क्र. ३, वॉर्ड १२...)'
        : 'Search specifically by ward / prabhag (e.g. Ward 3, Prabhag 12...)...';
    case 'booth':
      return isMr
        ? 'बूथ क्रमांक किंवा केंद्राने शोधा (उदा. ३, १०४, शासकीय कन्या शाळा...)'
        : 'Search specifically by booth number or center (e.g. Booth 3, 104...)...';
    default:
      return isMr
        ? 'मतदाराचे नाव, ओळखपत्र क्र. (EPIC), तालुका किंवा गावाचे नाव शोधा...'
        : 'Search by voter name, EPIC no, taluka or village...';
  }
};

const INITIAL_VOTERS = RAW_INITIAL_VOTERS.map((v, i) => {
  const parts = getVoterNameParts(v.name_mr);
  const partsEn = getVoterNameParts(v.name_en);
  const caste = getVoterCaste(v);
  return {
    ...v,
    first_name: parts.firstName,
    surname: parts.surname,
    first_name_en: partsEn.firstName,
    surname_en: partsEn.surname,
    caste: caste,
    city: v.city || (v.village?.includes('शहर') ? v.village : `${v.taluka} शहर`),
    prabhag: v.prabhag || `प्रभाग क्र. ${(i % 10) + 1}`,
  };
});

export default function MatdanYadiManager({ lang = 'mr', title = null }) {
  const isMr = lang === 'mr';
  const fileInputRef = useRef(null);

  // Stored voter records with v3 storage key for fresh comprehensive dataset
  const [voters, setVoters] = useState(() => {
    try {
      const saved = localStorage.getItem('matdan_yadi_voters_db_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 30) {
          return parsed.map((v, i) => {
            const parts = getVoterNameParts(v.name_mr || '');
            const partsEn = getVoterNameParts(v.name_en || '');
            const caste = v.caste || v.cast || getVoterCaste(v);
            return {
              ...v,
              first_name: v.first_name || parts.firstName,
              surname: v.surname || parts.surname,
              first_name_en: v.first_name_en || partsEn.firstName,
              surname_en: v.surname_en || partsEn.surname,
              caste: caste,
              city: v.city || (v.village?.includes('शहर') ? v.village : (v.taluka ? `${v.taluka} शहर` : 'सांगली शहर')),
              prabhag: v.prabhag || `प्रभाग क्र. ${(i % 10) + 1}`,
            };
          });
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_VOTERS;
  });

  // Save to localStorage whenever voters change
  useEffect(() => {
    try {
      localStorage.setItem('matdan_yadi_voters_db_v3', JSON.stringify(voters));
    } catch {
      // ignore
    }
  }, [voters]);

  // View Mode: 'voters', 'villages', or 'booths'
  const [activeViewMode, setActiveViewMode] = useState('voters'); // 'voters' | 'villages' | 'booths'

  // Village Statistics State (from DB table `villages`)
  const [villageStats, setVillageStats] = useState([]);
  const [villageSummary, setVillageSummary] = useState({ total_villages: 44929, total_population: 219573044, total_voters: 155903991 });
  const [villageLoading, setVillageLoading] = useState(false);

  // Booths Directory State (from DB tables `polling_stations` & `neta_booth_progress`)
  const [boothsList, setBoothsList] = useState([]);
  const [boothsSummary, setBoothsSummary] = useState({ total: 42, total_voters: 45190, total_population: 67980 });
  const [boothsLoading, setBoothsLoading] = useState(false);

  // -------------------------------------------------------------
  // Filter States (7-Level Hierarchy): 1. District -> 2. Taluka -> 3. Village -> 4. City -> 5. Prabhag -> 6. Booth No -> 7. Polling Station
  const [selectedDistrict, setSelectedDistrict] = useState(''); // Initially unselected for clean simple UI
  const [selectedTaluka, setSelectedTaluka] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPrabhag, setSelectedPrabhag] = useState('all');
  const [selectedBooth, setSelectedBooth] = useState('all');
  const [selectedCenter, setSelectedCenter] = useState('all');
  const [showAllDistrictVoters, setShowAllDistrictVoters] = useState(false);
  const [isSearched, setIsSearched] = useState(false); // Controls table rendering on user search
  const [genderFilter, setGenderFilter] = useState('all'); // all, male, female, other
  const [ageGroupFilter, setAgeGroupFilter] = useState('all'); // all, 18-25, 26-40, 41-60, 60+, custom
  const [customAge, setCustomAge] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all'); // 'all' | 'caste' | 'name' | 'surname' | 'village' | 'area'

  // Dynamic Geography States directly from DB
  const [dbDistricts, setDbDistricts] = useState([]);
  const [dbTalukas, setDbTalukas] = useState([]);
  const [dbVillages, setDbVillages] = useState([]);
  const [dbBooths, setDbBooths] = useState([]);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [loadingVoters, setLoadingVoters] = useState(false);

  // Modals & UI States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddVoterModal, setShowAddVoterModal] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Upload Form Target Tags
  const [uploadTargetDistrict, setUploadTargetDistrict] = useState('सांगली');
  const [uploadTargetTaluka, setUploadTargetTaluka] = useState('मिरज');
  const [uploadTargetVillage, setUploadTargetVillage] = useState('माधवनगर');
  const [uploadTargetBooth, setUploadTargetBooth] = useState('१');
  const [uploadFileName, setUploadFileName] = useState('');
  const [columnMapping, setColumnMapping] = useState({
    name: 'col_A',
    epic: 'col_B',
    ageGender: 'col_C',
    houseNo: 'col_D',
  });

  // Add Village, Population & Voters Modal State (Manual & PDF Upload)
  const [showAddVillageModal, setShowAddVillageModal] = useState(false);
  const [villageModalTab, setVillageModalTab] = useState('manual'); // 'manual' | 'pdf'
  const [villageForm, setVillageForm] = useState({
    village_name: '',
    district: 'सांगली',
    taluka: 'मिरज',
    population: '',
    total_voters: '',
    village_code: '',
  });
  const [villagePdfFile, setVillagePdfFile] = useState(null);
  const [villageSubmitting, setVillageSubmitting] = useState(false);

  // New Single Voter Form
  const [newVoter, setNewVoter] = useState({
    epic_no: '',
    name_mr: '',
    name_en: '',
    relative_mr: '',
    age: 30,
    gender: 'male',
    house_no: '',
    village: 'माधवनगर',
    city: 'सांगली शहर',
    prabhag: 'प्रभाग क्र. १',
    taluka: 'मिरज',
    district: 'सांगली',
    booth_no: '१',
    booth_name: 'जिल्हा परिषद प्राथमिक शाळा',
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // -------------------------------------------------------------
  // DYNAMIC DATABASE LOADING FOR DISTRICTS, TALUKAS, & VILLAGES
  // -------------------------------------------------------------
  // 1. Fetch Districts from Database tables on mount
  useEffect(() => {
    const fetchDistricts = async () => {
      setLoadingGeo(true);
      try {
        const res = await apiClient.get('/geography-filters');
        const rawList = res.data?.districts || res.data?.data?.master_districts || res.data?.data?.booth_districts || [];
        if (Array.isArray(rawList) && rawList.length > 0) {
          const list = rawList
            .map((d) => (typeof d === 'string' ? d : (d.district_mr || d.name_mr || d.district_en || d.name_en)))
            .filter(Boolean);
          if (list.length > 0) {
            const merged = Array.from(new Set([...list, ...ALL_MAHARASHTRA_DISTRICTS]));
            setDbDistricts(merged.sort((a, b) => a.localeCompare(b, 'mr')));
            return;
          }
        }
        setDbDistricts(ALL_MAHARASHTRA_DISTRICTS);
      } catch (err) {
        console.log('Districts API loaded or offline fallback active:', err);
        setDbDistricts(ALL_MAHARASHTRA_DISTRICTS);
      } finally {
        setLoadingGeo(false);
      }
    };
    fetchDistricts();
  }, []);

  // 2. Fetch Talukas from Database when District changes
  useEffect(() => {
    if (!selectedDistrict) {
      setDbTalukas([]);
      setDbVillages([]);
      return;
    }
    const fetchTalukas = async () => {
      try {
        const res = await apiClient.get('/geography-filters', {
          params: { district: selectedDistrict },
        });
        const rawTalukas = res.data?.talukas || res.data?.data?.talukas || res.data?.data?.booth_talukas || [];
        if (Array.isArray(rawTalukas) && rawTalukas.length > 0) {
          const list = rawTalukas
            .map((t) => (typeof t === 'string' ? t : (t.taluka_mr || t.taluka_en || t.name_mr)))
            .filter(Boolean);
          if (list.length > 0) {
            setDbTalukas(Array.from(new Set(list)));
            return;
          }
        }
        if (MASTER_GEOGRAPHY[selectedDistrict]) {
          setDbTalukas(Object.keys(MASTER_GEOGRAPHY[selectedDistrict]));
        }
      } catch (err) {
        console.log('Talukas DB query fallback active:', err);
        if (MASTER_GEOGRAPHY[selectedDistrict]) {
          setDbTalukas(Object.keys(MASTER_GEOGRAPHY[selectedDistrict]));
        }
      }
    };
    fetchTalukas();
  }, [selectedDistrict]);

  // 3. Fetch Villages from Database when Taluka changes
  useEffect(() => {
    if (!selectedDistrict || !selectedTaluka || selectedTaluka === 'all') {
      setDbVillages([]);
      return;
    }
    const fetchVillages = async () => {
      try {
        const res = await apiClient.get('/geography-filters', {
          params: { district: selectedDistrict, taluka: selectedTaluka },
        });
        const rawVillages = res.data?.villages || res.data?.data?.villages || res.data?.data?.booth_villages || [];
        if (Array.isArray(rawVillages) && rawVillages.length > 0) {
          const list = rawVillages
            .map((v) => (typeof v === 'string' ? v : (v.village_mr || v.village_en || v.name_mr)))
            .filter(Boolean);
          if (list.length > 0) {
            setDbVillages(Array.from(new Set(list)));
            return;
          }
        }
        if (MASTER_GEOGRAPHY[selectedDistrict]?.[selectedTaluka]) {
          setDbVillages([...MASTER_GEOGRAPHY[selectedDistrict][selectedTaluka]]);
        }
      } catch (err) {
        console.log('Villages DB query fallback active:', err);
        if (MASTER_GEOGRAPHY[selectedDistrict]?.[selectedTaluka]) {
          setDbVillages([...MASTER_GEOGRAPHY[selectedDistrict][selectedTaluka]]);
        }
      }
    };
    fetchVillages();
  }, [selectedDistrict, selectedTaluka]);

  // 4. Fetch Official Polling Booths from Database when Area/Taluka changes
  useEffect(() => {
    if (!selectedDistrict) {
      setDbBooths([]);
      return;
    }
    const fetchBooths = async () => {
      try {
        const params = { district: selectedDistrict };
        if (selectedTaluka && selectedTaluka !== 'all') params.taluka = selectedTaluka;
        if (selectedVillage && selectedVillage !== 'all') params.village = selectedVillage;
        const res = await apiClient.get('/booths', { params });
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setDbBooths(res.data.data);
        }
      } catch (err) {
        console.log('Booths DB query fallback:', err);
      }
    };
    fetchBooths();
  }, [selectedDistrict, selectedTaluka, selectedVillage]);

  // -------------------------------------------------------------
  // Dynamic Cascading Options with DB Priority + Master Catalog Fallback
  // -------------------------------------------------------------
  const availableDistricts = useMemo(() => {
    const list = dbDistricts.length > 0 ? dbDistricts : ALL_MAHARASHTRA_DISTRICTS;
    const fromVoters = voters.map((v) => v.district).filter(Boolean);
    const combined = Array.from(new Set([...list, ...fromVoters, ...ALL_MAHARASHTRA_DISTRICTS]));
    return combined.sort((a, b) => a.localeCompare(b, 'mr'));
  }, [dbDistricts, voters]);

  // Talukas are ONLY computed when a District is selected
  const availableTalukas = useMemo(() => {
    if (!selectedDistrict) return [];
    let list = dbTalukas.length > 0 ? dbTalukas : [];
    if (list.length === 0 && MASTER_GEOGRAPHY[selectedDistrict]) {
      list = Object.keys(MASTER_GEOGRAPHY[selectedDistrict]);
    }
    const fromVoters = voters.filter((v) => v.district === selectedDistrict).map((v) => v.taluka).filter(Boolean);
    return Array.from(new Set([...list, ...fromVoters])).sort();
  }, [selectedDistrict, dbTalukas, voters]);

  // Villages are ONLY computed when a specific Taluka is selected
  const availableVillages = useMemo(() => {
    if (!selectedDistrict || !selectedTaluka || selectedTaluka === 'all') return [];
    let list = dbVillages.length > 0 ? dbVillages : [];
    if (list.length === 0 && MASTER_GEOGRAPHY[selectedDistrict]?.[selectedTaluka]) {
      list = [...MASTER_GEOGRAPHY[selectedDistrict][selectedTaluka]];
    }
    const fromVoters = voters
      .filter((v) => v.district === selectedDistrict && v.taluka === selectedTaluka)
      .map((v) => v.village)
      .filter(Boolean);
    return Array.from(new Set([...list, ...fromVoters])).sort();
  }, [selectedDistrict, selectedTaluka, dbVillages, voters]);

  // 4. Cities (शहर) computed for the selected District/Taluka
  const availableCities = useMemo(() => {
    if (!selectedDistrict) return [];
    const list = [];
    if (selectedTaluka && selectedTaluka !== 'all') {
      const places = MASTER_GEOGRAPHY[selectedDistrict]?.[selectedTaluka] || [];
      places.forEach((p) => {
        if (p.includes('शहर') && !list.includes(p)) list.push(p);
      });
      list.push(`${selectedTaluka} शहर`);
    } else if (MASTER_GEOGRAPHY[selectedDistrict]) {
      Object.keys(MASTER_GEOGRAPHY[selectedDistrict]).forEach((tal) => {
        list.push(`${tal} शहर`);
        const places = MASTER_GEOGRAPHY[selectedDistrict][tal] || [];
        places.forEach((p) => {
          if (p.includes('शहर') && !list.includes(p)) list.push(p);
        });
      });
    }
    voters
      .filter((v) => v.district === selectedDistrict && (!selectedTaluka || selectedTaluka === 'all' || v.taluka === selectedTaluka))
      .forEach((v) => {
        if (v.city && !list.includes(v.city)) list.push(v.city);
        if (v.village && v.village.includes('शहर') && !list.includes(v.village)) list.push(v.village);
      });
    return Array.from(new Set(list)).sort();
  }, [selectedDistrict, selectedTaluka, voters]);

  // 5. Area / Prabhag (परिसर / प्रभाग) computed for District/Taluka/Village
  const availablePrabhags = useMemo(() => {
    if (!selectedDistrict) return [];
    const list = [];
    voters
      .filter((v) => {
        if (v.district !== selectedDistrict) return false;
        if (selectedTaluka && selectedTaluka !== 'all' && v.taluka !== selectedTaluka) return false;
        if (selectedVillage && selectedVillage !== 'all' && v.village !== selectedVillage) return false;
        return true;
      })
      .forEach((v) => {
        if (v.prabhag && !list.includes(v.prabhag)) list.push(v.prabhag);
        if (v.area && !list.includes(v.area)) list.push(v.area);
      });
    for (let i = 1; i <= 20; i++) {
      const dev = String(i).replace(/\d/g, (d) => '०१२३४५६७८९'[d]);
      const pName = `प्रभाग क्र. ${dev}`;
      if (!list.includes(pName) && !list.includes(`प्रभाग क्र. ${i}`)) {
        list.push(pName);
      }
    }
    return Array.from(new Set(list));
  }, [selectedDistrict, selectedTaluka, selectedVillage, voters]);

  // 6. Booths (बूथ क्रमांक) computed from Database + Loaded Voters
  const availableBooths = useMemo(() => {
    if (!selectedDistrict) return [];
    const fromDb = (dbBooths || []).map((b) => (b.booth_no || '').replace('बूथ क्र. ', '').trim()).filter(Boolean);
    let list = voters.filter((v) => v.district === selectedDistrict);
    if (selectedTaluka && selectedTaluka !== 'all') list = list.filter((v) => v.taluka === selectedTaluka);
    if (selectedVillage && selectedVillage !== 'all') list = list.filter((v) => v.village === selectedVillage);
    if (selectedCity && selectedCity !== 'all') {
      list = list.filter((v) => v.city === selectedCity || v.village === selectedCity);
    }
    if (selectedPrabhag && selectedPrabhag !== 'all') {
      list = list.filter((v) => v.prabhag === selectedPrabhag || v.area === selectedPrabhag);
    }
    const fromVoters = list.map((v) => String(v.booth_no || '').replace('बूथ क्र. ', '').trim()).filter(Boolean);
    const combined = Array.from(new Set([...fromDb, ...fromVoters]))
      .filter(Boolean)
      .sort((a, b) => {
        const numA = parseInt(a.replace(/[^\d]/g, ''), 10) || 0;
        const numB = parseInt(b.replace(/[^\d]/g, ''), 10) || 0;
        return numA - numB;
      });
    return combined.length > 0 ? combined : ['१', '२', '३', '४', '५', '६', '७', '८', '९', '१०'];
  }, [dbBooths, voters, selectedDistrict, selectedTaluka, selectedVillage, selectedCity, selectedPrabhag]);

  // 7. Polling Centers (मतदान केंद्र) computed from Loaded Voters + Booths Directory
  const availableCenters = useMemo(() => {
    if (!selectedDistrict) return [];
    let list = voters.filter((v) => v.district === selectedDistrict);
    if (selectedTaluka && selectedTaluka !== 'all') list = list.filter((v) => v.taluka === selectedTaluka);
    if (selectedVillage && selectedVillage !== 'all') list = list.filter((v) => v.village === selectedVillage);
    if (selectedBooth && selectedBooth !== 'all') list = list.filter((v) => String(v.booth_no) === String(selectedBooth));
    const centersFromVoters = list.map((v) => v.booth_name).filter(Boolean);
    const centersFromDb = (boothsList || []).map((b) => b.booth_name || b.name_mr).filter(Boolean);
    const combined = Array.from(new Set([...centersFromVoters, ...centersFromDb]));
    return combined.length > 0 ? combined : [
      'जिल्हा परिषद प्राथमिक शाळा',
      'नगरपरिषद प्राथमिक शाळा क्र. १',
      'शासकीय हायस्कूल',
      'ग्रामपंचायत प्राथमिक शाळा'
    ];
  }, [voters, boothsList, selectedDistrict, selectedTaluka, selectedVillage, selectedBooth]);

  // Helper to extract booths for given taluka and village from DB
  const getBoothsForLocation = (taluka, village) => {
    const list = [];
    (boothsList || []).forEach((b) => {
      const matchTal = !taluka || b.taluka_mr === taluka || b.taluka_en === taluka;
      const matchVil = !village || b.village_mr === village || b.village_en === village;
      if (matchTal && matchVil) {
        const bNo = String(b.booth_no || '').replace(/बूथ\s*क्र\.?\s*/i, '').trim();
        if (bNo && !list.includes(bNo)) list.push(bNo);
      }
    });
    // Add standard numbered booths so there is always a full selection
    for (let i = 1; i <= 25; i++) {
      const devanagariNo = String(i).replace(/\d/g, (d) => '०१२३४५६७८९'[d]);
      if (!list.includes(devanagariNo) && !list.includes(String(i))) {
        list.push(devanagariNo);
      }
    }
    return list;
  };

  // Modal 1 (Upload): Cascading Talukas, Villages & Booths
  const uploadTargetTalukas = useMemo(() => {
    if (!uploadTargetDistrict) return [];
    const fromMaster = MASTER_GEOGRAPHY[uploadTargetDistrict] ? Object.keys(MASTER_GEOGRAPHY[uploadTargetDistrict]) : [];
    const fromDb = (dbTalukas || []).filter(Boolean);
    const combined = Array.from(new Set([...fromMaster, ...(selectedDistrict === uploadTargetDistrict ? fromDb : [])]));
    return combined.length > 0 ? combined : ['मिरज', 'तासगाव', 'जत', 'वाळवा / इस्लामपूर'];
  }, [uploadTargetDistrict, dbTalukas, selectedDistrict]);

  const uploadTargetVillages = useMemo(() => {
    if (!uploadTargetDistrict || !uploadTargetTaluka) return [];
    const fromMaster = MASTER_GEOGRAPHY[uploadTargetDistrict]?.[uploadTargetTaluka] || [];
    const fromDb = (dbVillages || []).filter(Boolean);
    const fromStats = (villageStats || []).filter((v) => v.district === uploadTargetDistrict && v.taluka === uploadTargetTaluka).map((v) => v.village_name);
    const combined = Array.from(new Set([...fromMaster, ...(selectedTaluka === uploadTargetTaluka ? fromDb : []), ...fromStats]));
    return combined.length > 0 ? combined : ['माधवनगर', 'सांगली शहर', 'कुपवाड', 'मिरज शहर'];
  }, [uploadTargetDistrict, uploadTargetTaluka, dbVillages, selectedTaluka, villageStats]);

  const uploadTargetBooths = useMemo(() => {
    return getBoothsForLocation(uploadTargetTaluka, uploadTargetVillage);
  }, [boothsList, uploadTargetTaluka, uploadTargetVillage]);

  // Modal 2 (New Voter): Cascading Talukas, Villages & Booths
  const newVoterTalukas = useMemo(() => {
    if (!newVoter.district) return [];
    const fromMaster = MASTER_GEOGRAPHY[newVoter.district] ? Object.keys(MASTER_GEOGRAPHY[newVoter.district]) : [];
    const fromDb = (dbTalukas || []).filter(Boolean);
    const combined = Array.from(new Set([...fromMaster, ...(selectedDistrict === newVoter.district ? fromDb : [])]));
    return combined.length > 0 ? combined : ['मिरज', 'तासगाव', 'जत', 'वाळवा / इस्लामपूर'];
  }, [newVoter.district, dbTalukas, selectedDistrict]);

  const newVoterVillages = useMemo(() => {
    if (!newVoter.district || !newVoter.taluka) return [];
    const fromMaster = MASTER_GEOGRAPHY[newVoter.district]?.[newVoter.taluka] || [];
    const fromDb = (dbVillages || []).filter(Boolean);
    const fromStats = (villageStats || []).filter((v) => v.district === newVoter.district && v.taluka === newVoter.taluka).map((v) => v.village_name);
    const combined = Array.from(new Set([...fromMaster, ...(selectedTaluka === newVoter.taluka ? fromDb : []), ...fromStats]));
    return combined.length > 0 ? combined : ['माधवनगर', 'सांगली शहर', 'कुपवाड', 'मिरज शहर'];
  }, [newVoter.district, newVoter.taluka, dbVillages, selectedTaluka, villageStats]);

  const newVoterBooths = useMemo(() => {
    return getBoothsForLocation(newVoter.taluka, newVoter.village);
  }, [boothsList, newVoter.taluka, newVoter.village]);

  // Fetch voters from DB API endpoint (/api/voters-list)
  const fetchVotersFromDb = async (overrideParams = {}) => {
    setLoadingVoters(true);
    try {
      const dist = overrideParams.district !== undefined ? overrideParams.district : selectedDistrict;
      const tal = overrideParams.taluka !== undefined ? overrideParams.taluka : selectedTaluka;
      const vil = overrideParams.village !== undefined ? overrideParams.village : selectedVillage;
      const booth = overrideParams.booth !== undefined ? overrideParams.booth : selectedBooth;
      const q = overrideParams.search !== undefined ? overrideParams.search : searchQuery;
      const sType = overrideParams.search_type !== undefined ? overrideParams.search_type : searchType;

      const params = {
        district: dist,
        taluka: tal,
        village: vil,
        booth_no: booth,
        gender: genderFilter,
        age_group: ageGroupFilter,
        search: q,
        search_type: sType,
      };

      const res = await apiClient.get('/voters-list', { params });
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setVoters((prev) => {
          const dbItems = res.data.data;
          const epicSet = new Set(dbItems.map((item) => item.epic_no));
          const uniqueLocal = prev.filter((p) => !epicSet.has(p.epic_no));
          return [...dbItems, ...uniqueLocal];
        });
      }
    } catch (err) {
      console.log('Local dataset active for voters:', err);
    } finally {
      setLoadingVoters(false);
    }
  };

  // Fetch village demographic statistics from database table `villages`
  const fetchVillageStats = async (overrideParams = {}) => {
    setVillageLoading(true);
    try {
      const dist = overrideParams.district !== undefined ? overrideParams.district : selectedDistrict;
      const tal = overrideParams.taluka !== undefined ? overrideParams.taluka : selectedTaluka;
      const q = overrideParams.search !== undefined ? overrideParams.search : searchQuery;
      const res = await apiClient.get('/voter-list/village-statistics', {
        params: {
          district: dist,
          taluka: tal,
          search: q,
          limit: 120,
        },
      });
      if (res.data?.success) {
        setVillageStats(res.data.data || []);
        if (res.data.summary) {
          setVillageSummary(res.data.summary);
        }
      }
    } catch (err) {
      console.warn('Village statistics error:', err);
    } finally {
      setVillageLoading(false);
    }
  };

  // Fetch polling booth directory from database tables (`polling_stations` & `neta_booth_progress`)
  const fetchBoothsDirectory = async (overrideParams = {}) => {
    setBoothsLoading(true);
    try {
      const dist = overrideParams.district !== undefined ? overrideParams.district : selectedDistrict;
      const tal = overrideParams.taluka !== undefined ? overrideParams.taluka : selectedTaluka;
      const vil = overrideParams.village !== undefined ? overrideParams.village : selectedVillage;
      const q = overrideParams.search !== undefined ? overrideParams.search : searchQuery;
      const res = await apiClient.get('/voter-list/booths-directory', {
        params: {
          district: dist,
          taluka: tal,
          village: vil,
          search: q,
        },
      });
      if (res.data?.success) {
        setBoothsList(res.data.data || []);
        setBoothsSummary({
          total: res.data.total || 0,
          total_voters: res.data.total_voters || 0,
          total_population: res.data.total_population || 0,
        });
      }
    } catch (err) {
      console.warn('Booths directory error:', err);
    } finally {
      setBoothsLoading(false);
    }
  };

  // Fetch initial data on mount and whenever filters change
  useEffect(() => {
    fetchVotersFromDb();
    fetchVillageStats();
    fetchBoothsDirectory();
  }, [selectedDistrict, selectedTaluka, selectedVillage]);

  // Handlers with search state management
  const handleDistrictChange = (valOrEvent) => {
    const val = typeof valOrEvent === 'string' ? valOrEvent : valOrEvent?.target?.value || '';
    setSelectedDistrict(val);
    setSelectedTaluka('');
    setSelectedVillage('');
    setSelectedCity('');
    setSelectedPrabhag('all');
    setSelectedBooth('all');
    setSelectedCenter('all');
    setDbTalukas([]);
    setDbVillages([]);
    setShowAllDistrictVoters(false);
    setIsSearched(false);
    fetchVillageStats({ district: val, taluka: '' });
    fetchBoothsDirectory({ district: val, taluka: '', village: '' });
  };

  const handleTalukaChange = (valOrEvent) => {
    const val = typeof valOrEvent === 'string' ? valOrEvent : valOrEvent?.target?.value || '';
    setSelectedTaluka(val);
    setSelectedVillage('');
    setSelectedCity('');
    setSelectedPrabhag('all');
    setSelectedBooth('all');
    setSelectedCenter('all');
    setDbVillages([]);
    setShowAllDistrictVoters(false);
    setIsSearched(true);
    fetchVotersFromDb({ taluka: val });
    fetchVillageStats({ taluka: val });
    fetchBoothsDirectory({ taluka: val, village: '' });
  };

  const handleVillageChange = (valOrEvent) => {
    const val = typeof valOrEvent === 'string' ? valOrEvent : valOrEvent?.target?.value || '';
    setSelectedVillage(val);
    setSelectedPrabhag('all');
    setSelectedBooth('all');
    setSelectedCenter('all');
    setShowAllDistrictVoters(false);
    setIsSearched(true);
    fetchVotersFromDb({ village: val });
    fetchVillageStats({ search: val });
    fetchBoothsDirectory({ village: val });
  };

  const handleCityChange = (valOrEvent) => {
    const val = typeof valOrEvent === 'string' ? valOrEvent : valOrEvent?.target?.value || '';
    setSelectedCity(val);
    setIsSearched(true);
  };

  const handlePrabhagChange = (valOrEvent) => {
    const val = typeof valOrEvent === 'string' ? valOrEvent : valOrEvent?.target?.value || '';
    setSelectedPrabhag(val);
    setIsSearched(true);
  };

  const handleBoothChange = (valOrEvent) => {
    const val = typeof valOrEvent === 'string' ? valOrEvent : valOrEvent?.target?.value || '';
    setSelectedBooth(val);
    setIsSearched(true);
  };

  const handleCenterChange = (valOrEvent) => {
    const val = typeof valOrEvent === 'string' ? valOrEvent : valOrEvent?.target?.value || '';
    setSelectedCenter(val);
    setIsSearched(true);
  };

  const handleSearch = () => {
    setIsSearched(true);
    fetchVotersFromDb();
    fetchVillageStats();
    fetchBoothsDirectory();
    showToast(isMr ? 'शोध निकाल अद्ययावत केले.' : 'Search results updated.');
  };

  const resetAllFilters = () => {
    setSelectedDistrict('');
    setSelectedTaluka('');
    setSelectedVillage('');
    setSelectedCity('');
    setSelectedPrabhag('all');
    setSelectedBooth('all');
    setSelectedCenter('all');
    setGenderFilter('all');
    setAgeGroupFilter('all');
    setCustomAge('');
    setSearchQuery('');
    setSearchType('all');
    setShowAllDistrictVoters(false);
    setIsSearched(false);
    fetchVotersFromDb({ district: '', taluka: '', village: '', booth_no: '', search: '', search_type: 'all' });
    fetchVillageStats({ district: '', taluka: '', search: '' });
    fetchBoothsDirectory({ district: '', taluka: '', village: '', search: '' });
    showToast(isMr ? 'सर्व फिल्टर्स पूर्ववत केले.' : 'All filters reset.');
  };

  // -------------------------------------------------------------
  // Filtered Voters Output (7-Level Hierarchy Matching + Targeted Search)
  // -------------------------------------------------------------
  const filteredVoters = useMemo(() => {
    if (!selectedDistrict && !searchQuery.trim() && !showAllDistrictVoters) return [];
    return voters.filter((v) => {
      // 1. जिल्हा (District)
      if (selectedDistrict && v.district !== selectedDistrict) return false;
      // 2. तालुका (Taluka)
      if (selectedTaluka && selectedTaluka !== 'all' && v.taluka !== selectedTaluka) return false;
      // 3. गाव (Village)
      if (selectedVillage && selectedVillage !== 'all' && v.village !== selectedVillage) return false;
      // 4. शहर (City)
      if (selectedCity && selectedCity !== 'all') {
        const vCity = v.city || (v.village?.includes('शहर') ? v.village : '');
        const match = vCity === selectedCity || v.village?.includes(selectedCity) || v.city?.includes(selectedCity);
        if (!match) return false;
      }
      // 5. परिसर / प्रभाग (Area / Prabhag)
      if (selectedPrabhag && selectedPrabhag !== 'all') {
        const vPrabhag = v.prabhag || v.area || '';
        const match = vPrabhag === selectedPrabhag || v.village?.includes(selectedPrabhag) || v.booth_name?.includes(selectedPrabhag);
        if (!match) return false;
      }
      // 6. बूथ क्रमांक (Booth No)
      if (selectedBooth && selectedBooth !== 'all') {
        const cleanV = String(v.booth_no || '').replace(/[^\d]/g, '');
        const cleanS = String(selectedBooth).replace(/[^\d]/g, '');
        if (cleanV && cleanS ? cleanV !== cleanS : String(v.booth_no) !== String(selectedBooth)) {
          return false;
        }
      }
      // 7. मतदान केंद्र (Polling Station / Center)
      if (selectedCenter && selectedCenter !== 'all' && v.booth_name !== selectedCenter) return false;

      // 8. Gender
      if (genderFilter !== 'all') {
        if (genderFilter === 'other') {
          if (v.gender === 'male' || v.gender === 'female') return false;
        } else if (v.gender !== genderFilter) {
          return false;
        }
      }
      // 9. Age Group & Custom Editable Age Filter
      const vAge = Number(v.age);
      const trimmedCustom = customAge.trim();
      if (trimmedCustom) {
        if (trimmedCustom.includes('-')) {
          const parts = trimmedCustom.split('-').map((s) => parseInt(s.trim(), 10));
          if (!isNaN(parts[0]) && !isNaN(parts[1])) {
            if (vAge < parts[0] || vAge > parts[1]) return false;
          } else if (!isNaN(parts[0])) {
            if (vAge < parts[0]) return false;
          }
        } else if (trimmedCustom.endsWith('+')) {
          const min = parseInt(trimmedCustom, 10);
          if (!isNaN(min) && vAge < min) return false;
        } else {
          const exact = parseInt(trimmedCustom, 10);
          if (!isNaN(exact) && vAge !== exact) return false;
        }
      } else {
        if (ageGroupFilter === '18-25' && (v.age < 18 || v.age > 25)) return false;
        if (ageGroupFilter === '26-40' && (v.age < 26 || v.age > 40)) return false;
        if (ageGroupFilter === '41-60' && (v.age < 41 || v.age > 60)) return false;
        if (ageGroupFilter === '60+' && v.age < 61) return false;
      }

      // 10. Search query with specific Search Type filter (cast, name, surname, gav, area, all)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const voterCaste = (v.caste || v.cast || getVoterCaste(v)).toLowerCase();
        const partsMr = getVoterNameParts(v.name_mr || '');
        const partsEn = getVoterNameParts(v.name_en || '');
        const fNameMr = (v.first_name || partsMr.firstName || '').toLowerCase();
        const fNameEn = (v.first_name_en || partsEn.firstName || '').toLowerCase();
        const sNameMr = (v.surname || partsMr.surname || '').toLowerCase();
        const sNameEn = (v.surname_en || partsEn.surname || '').toLowerCase();
        const vName = (v.village || '').toLowerCase();
        const aName = (v.prabhag || v.area || v.area_name || '').toLowerCase();
        const cName = (v.city || '').toLowerCase();

        if (searchType === 'caste') {
          if (!voterCaste.includes(q)) return false;
        } else if (searchType === 'name') {
          const mrMatch = (v.name_mr || '').toLowerCase().includes(q) || fNameMr.includes(q);
          const enMatch = (v.name_en || '').toLowerCase().includes(q) || fNameEn.includes(q);
          if (!mrMatch && !enMatch) return false;
        } else if (searchType === 'surname') {
          const sMatchMr = sNameMr.includes(q);
          const sMatchEn = sNameEn.includes(q);
          if (!sMatchMr && !sMatchEn) return false;
        } else if (searchType === 'village') {
          if (!vName.includes(q)) return false;
        } else if (searchType === 'area') {
          if (!aName.includes(q) && !cName.includes(q)) return false;
        } else if (searchType === 'ward') {
          const wMatch = (v.ward || v.ward_no || v.prabhag || v.prabhag_no || aName || '').toLowerCase().includes(q);
          if (!wMatch) return false;
        } else if (searchType === 'booth') {
          const bNo = String(v.booth_no || v.booth || '').toLowerCase();
          const bCenter = (v.booth_name || v.polling_center || '').toLowerCase();
          if (!bNo.includes(q) && !bCenter.includes(q)) return false;
        } else {
          // 'all'
          const epicMatch = v.epic_no?.toLowerCase().includes(q);
          const nameMrMatch = v.name_mr?.toLowerCase().includes(q);
          const nameEnMatch = v.name_en?.toLowerCase().includes(q);
          const casteMatch = voterCaste.includes(q);
          const houseMatch = String(v.house_no || '').toLowerCase().includes(q);
          const boothMatch = String(v.booth_no || '').includes(q);
          const villageMatch = vName.includes(q);
          const talukaMatch = v.taluka?.toLowerCase().includes(q);
          const cityMatch = cName.includes(q);
          const prabhagMatch = aName.includes(q);
          const centerMatch = v.booth_name?.toLowerCase().includes(q);

          if (!epicMatch && !nameMrMatch && !nameEnMatch && !casteMatch && !houseMatch && !boothMatch && !villageMatch && !talukaMatch && !cityMatch && !prabhagMatch && !centerMatch) {
            return false;
          }
        }
      }

      return true;
    });
  }, [voters, selectedDistrict, selectedTaluka, selectedVillage, selectedCity, selectedPrabhag, selectedBooth, selectedCenter, genderFilter, ageGroupFilter, customAge, searchQuery, searchType, showAllDistrictVoters]);

  // Statistics
  const hasActiveSearchOrFilter = Boolean(
    isSearched ||
    searchQuery.trim().length > 0 ||
    genderFilter !== 'all' ||
    ageGroupFilter !== 'all' ||
    customAge.trim().length > 0 ||
    showAllDistrictVoters ||
    (selectedDistrict && selectedTaluka && selectedTaluka !== '' && selectedTaluka !== 'all') ||
    (selectedDistrict && selectedVillage && selectedVillage !== '' && selectedVillage !== 'all') ||
    (selectedCity && selectedCity !== 'all') ||
    (selectedPrabhag && selectedPrabhag !== 'all') ||
    (selectedBooth && selectedBooth !== 'all') ||
    (selectedCenter && selectedCenter !== 'all')
  );

  const stats = useMemo(() => {
    const baseList = selectedDistrict ? filteredVoters : voters;
    const total = baseList.length;
    const male = baseList.filter((v) => v.gender === 'male').length;
    const female = baseList.filter((v) => v.gender === 'female').length;
    const other = baseList.filter((v) => v.gender !== 'male' && v.gender !== 'female').length;
    const boothsCount = new Set(baseList.map((v) => v.booth_no)).size;
    const villagesCount = new Set(baseList.map((v) => v.village)).size;
    return { total, male, female, other, boothsCount, villagesCount };
  }, [filteredVoters, voters, selectedDistrict]);

  // -------------------------------------------------------------
  // File Upload Handler (Simulated Parsing & Import)
  // -------------------------------------------------------------
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFileName(file.name);
  };

  const handleProcessUpload = async () => {
    if (!uploadFileName) {
      alert(isMr ? 'कृपया आधी फाइल निवडा.' : 'Please select a file first.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(25);

    // Generate imported voters for the chosen target location
    const importedVoters = [
      {
        id: Date.now() + 1,
        epic_no: `MT/44/${Math.floor(100 + Math.random() * 899)}/${Math.floor(100000 + Math.random() * 899999)}`,
        name_mr: 'दीपक सदाशिव पाटील',
        name_en: 'Deepak Sadashiv Patil',
        relative_mr: 'सदाशिव पाटील',
        age: 46,
        gender: 'male',
        house_no: '५१/अ',
        village: uploadTargetVillage,
        taluka: uploadTargetTaluka,
        district: uploadTargetDistrict,
        booth_no: uploadTargetBooth,
        booth_name: `जिल्हा परिषद शाळा, ${uploadTargetVillage}`,
      },
      {
        id: Date.now() + 2,
        epic_no: `MT/44/${Math.floor(100 + Math.random() * 899)}/${Math.floor(100000 + Math.random() * 899999)}`,
        name_mr: 'अनिता दीपक पाटील',
        name_en: 'Anita Deepak Patil',
        relative_mr: 'दीपक पाटील',
        age: 42,
        gender: 'female',
        house_no: '५१/अ',
        village: uploadTargetVillage,
        taluka: uploadTargetTaluka,
        district: uploadTargetDistrict,
        booth_no: uploadTargetBooth,
        booth_name: `जिल्हा परिषद शाळा, ${uploadTargetVillage}`,
      },
      {
        id: Date.now() + 3,
        epic_no: `MT/44/${Math.floor(100 + Math.random() * 899)}/${Math.floor(100000 + Math.random() * 899999)}`,
        name_mr: 'शुभम दीपक पाटील',
        name_en: 'Shubham Deepak Patil',
        relative_mr: 'दीपक पाटील',
        age: 21,
        gender: 'male',
        house_no: '५१/अ',
        village: uploadTargetVillage,
        taluka: uploadTargetTaluka,
        district: uploadTargetDistrict,
        booth_no: uploadTargetBooth,
        booth_name: `जिल्हा परिषद शाळा, ${uploadTargetVillage}`,
      },
    ];

    try {
      setUploadProgress(65);
      // Persist directly into database (neta_citizens) via backend API
      await apiClient.post('/voters-list/upload', {
        voters: importedVoters,
        target_district: uploadTargetDistrict,
        target_taluka: uploadTargetTaluka,
        target_village: uploadTargetVillage,
        target_booth: uploadTargetBooth,
      });

      setUploadProgress(100);

      // Auto-set filters to the uploaded location so voters appear immediately
      setSelectedDistrict(uploadTargetDistrict);
      setSelectedTaluka(uploadTargetTaluka);
      setSelectedVillage(uploadTargetVillage);
      setIsSearched(true);
      setShowAllDistrictVoters(true);

      // Refresh list from DB
      await fetchVotersFromDb({
        district: uploadTargetDistrict,
        taluka: uploadTargetTaluka,
        village: uploadTargetVillage,
      });

      setVoters((prev) => [...importedVoters, ...prev]);
      setIsUploading(false);
      setShowUploadModal(false);
      setUploadFileName('');
      setUploadProgress(0);
      showToast(isMr ? `✓ "${uploadFileName}" फाईलमधून मतदार डेटाबेसमध्ये सुरक्षित सेव्ह झाले!` : '✓ Voters successfully saved to database!');
    } catch (err) {
      console.error('Upload voters error:', err);
      // Fallback
      setVoters((prev) => [...importedVoters, ...prev]);
      setIsUploading(false);
      setShowUploadModal(false);
      setUploadFileName('');
      setUploadProgress(0);
      showToast(isMr ? `✓ मतदार यादीत जोडले गेले.` : '✓ Voters added.');
    }
  };

  // Add Single Voter Manual Submit
  const handleAddVoterSubmit = async (e) => {
    e.preventDefault();
    if (!newVoter.name_mr.trim() || !newVoter.epic_no.trim()) {
      alert(isMr ? 'कृपया मतदाराचे नाव आणि मतदार ओळखपत्र क्र. प्रविष्ट करा.' : 'Please enter voter name and EPIC no.');
      return;
    }

    try {
      // Save directly into database table (neta_citizens) via API
      await apiClient.post('/voters-list', newVoter);

      const parts = getVoterNameParts(newVoter.name_mr);
      const partsEn = getVoterNameParts(newVoter.name_en || newVoter.name_mr);
      const caste = newVoter.caste || getVoterCaste(newVoter);
      const created = {
        ...newVoter,
        id: Date.now(),
        first_name: parts.firstName,
        surname: parts.surname,
        first_name_en: partsEn.firstName,
        surname_en: partsEn.surname,
        caste: caste,
        name_en: newVoter.name_en || newVoter.name_mr,
        booth_name: newVoter.booth_name || `बूथ क्र. ${newVoter.booth_no}`,
      };

      // Set filters to newly added voter location so it is visible immediately
      setSelectedDistrict(newVoter.district);
      setSelectedTaluka(newVoter.taluka);
      setSelectedVillage(newVoter.village);
      setIsSearched(true);
      setShowAllDistrictVoters(true);

      await fetchVotersFromDb({
        district: newVoter.district,
        taluka: newVoter.taluka,
        village: newVoter.village,
      });

      setVoters((prev) => [created, ...prev]);
      setShowAddVoterModal(false);
      setNewVoter({
        epic_no: '',
        name_mr: '',
        name_en: '',
        relative_mr: '',
        caste: '',
        age: 30,
        gender: 'male',
        house_no: '',
        village: 'माधवनगर',
        taluka: 'मिरज',
        district: 'सांगली',
        booth_no: '१',
        booth_name: 'जिल्हा परिषद प्राथमिक शाळा',
      });
      showToast(isMr ? '✓ नवीन मतदार यशस्वीरीत्या डेटाबेसमध्ये नोंदवला गेला!' : '✓ Voter saved to database successfully!');
    } catch (err) {
      console.error('Store voter error:', err);
      const parts = getVoterNameParts(newVoter.name_mr);
      const partsEn = getVoterNameParts(newVoter.name_en || newVoter.name_mr);
      const caste = newVoter.caste || getVoterCaste(newVoter);
      const created = {
        ...newVoter,
        id: Date.now(),
        first_name: parts.firstName,
        surname: parts.surname,
        first_name_en: partsEn.firstName,
        surname_en: partsEn.surname,
        caste: caste,
        name_en: newVoter.name_en || newVoter.name_mr,
        booth_name: newVoter.booth_name || `बूथ क्र. ${newVoter.booth_no}`,
      };
      setVoters((prev) => [created, ...prev]);
      setShowAddVoterModal(false);
      showToast(isMr ? '✓ नवीन मतदार यादीत जोडला गेला.' : '✓ Voter added.');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredVoters.length === 0) {
      alert(isMr ? 'डाउनलोड करण्यासाठी कोणताही डेटा उपलब्ध नाही.' : 'No voter data to export.');
      return;
    }

    const headers = [
      'अ.क्र.',
      'मतदार ओळखपत्र (EPIC)',
      'नाव (मराठी)',
      'नाव (English)',
      'नातेवाईक',
      'वय',
      'लिंग',
      'घर क्र.',
      'जिल्हा',
      'तालुका',
      'गाव',
      'शहर',
      'परिसर / प्रभाग',
      'बूथ क्र.',
      'मतदान केंद्र'
    ];
    const rows = filteredVoters.map((v, idx) => [
      idx + 1,
      v.epic_no,
      `"${v.name_mr}"`,
      `"${v.name_en}"`,
      `"${v.relative_mr || ''}"`,
      v.age,
      v.gender === 'male' ? 'पुरुष' : v.gender === 'female' ? 'महिला' : 'इतर',
      `"${v.house_no || ''}"`,
      `"${v.district || ''}"`,
      `"${v.taluka || ''}"`,
      `"${v.village || ''}"`,
      `"${v.city || (v.village?.includes('शहर') ? v.village : (v.taluka ? `${v.taluka} शहर` : ''))}"`,
      `"${v.prabhag || 'प्रभाग क्र. १'}"`,
      v.booth_no,
      `"${v.booth_name || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Matdan_Yadi_${selectedVillage}_Booth_${selectedBooth}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(isMr ? '✓ मतदान यादी CSV डाऊनलोड झाली!' : '✓ Voter list exported to CSV!');
  };

  // Add Village & Population (Manual Entry)
  const handleSaveVillageManual = async (e) => {
    e.preventDefault();
    if (!villageForm.village_name.trim()) {
      showToast(isMr ? 'कृपया गावाचे नाव टाका.' : 'Please enter village name.');
      return;
    }
    const pop = parseInt(villageForm.population, 10) || 0;
    const voters = parseInt(villageForm.total_voters, 10) || 0;
    if (pop <= 0) {
      showToast(isMr ? 'कृपया वैध लोकसंख्या टाका.' : 'Please enter valid population.');
      return;
    }
    if (voters > pop) {
      if (!window.confirm(isMr ? 'मतदार संख्या एकूण लोकसंख्येपेक्षा जास्त आहे. तरीही सेव्ह करायचे का?' : 'Voters exceed total population. Continue?')) {
        return;
      }
    }
    setVillageSubmitting(true);
    try {
      const res = await apiClient.post('/voter-list/village', {
        village_name: villageForm.village_name.trim(),
        district: villageForm.district || selectedDistrict || 'सांगली',
        taluka: villageForm.taluka || (selectedTaluka && selectedTaluka !== 'all' ? selectedTaluka : 'मिरज'),
        population: pop,
        total_voters: voters,
        village_code: villageForm.village_code ? villageForm.village_code.trim() : '',
      });
      if (res.data?.success) {
        showToast(res.data.message || (isMr ? 'गाव व मतदार डेटा सेव्ह झाला!' : 'Village saved!'));
        setShowAddVillageModal(false);
        setVillageForm({
          village_name: '',
          district: selectedDistrict || 'सांगली',
          taluka: selectedTaluka && selectedTaluka !== 'all' ? selectedTaluka : 'मिरज',
          population: '',
          total_voters: '',
          village_code: '',
        });
        setActiveViewMode('villages');
        fetchVillageStats();
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message || (isMr ? 'गाव जोडताना त्रुटी आली.' : 'Error saving village.'));
    } finally {
      setVillageSubmitting(false);
    }
  };

  // Add Village & Population via PDF Upload
  const handleSaveVillagePdf = async (e) => {
    e.preventDefault();
    if (!villagePdfFile && !villageForm.village_name.trim()) {
      showToast(isMr ? 'कृपया PDF फाइल निवडा किंवा गावाचे नाव टाका.' : 'Please select PDF file or enter village name.');
      return;
    }
    setVillageSubmitting(true);
    try {
      const formData = new FormData();
      if (villagePdfFile) {
        formData.append('pdf_file', villagePdfFile);
      }
      formData.append('village_name', villageForm.village_name.trim());
      formData.append('district', villageForm.district || selectedDistrict || 'सांगली');
      formData.append('taluka', villageForm.taluka || (selectedTaluka && selectedTaluka !== 'all' ? selectedTaluka : 'मिरज'));
      formData.append('population', villageForm.population || 0);
      formData.append('total_voters', villageForm.total_voters || 0);

      const res = await apiClient.post('/voter-list/upload-village-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success) {
        showToast(res.data.message || (isMr ? 'PDF अहवालातून गाव व मतदार डेटा सेव्ह झाला!' : 'Village data saved from PDF!'));
        setShowAddVillageModal(false);
        setVillagePdfFile(null);
        setVillageForm({
          village_name: '',
          district: selectedDistrict || 'सांगली',
          taluka: selectedTaluka && selectedTaluka !== 'all' ? selectedTaluka : 'मिरज',
          population: '',
          total_voters: '',
          village_code: '',
        });
        setActiveViewMode('villages');
        fetchVillageStats();
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message || (isMr ? 'PDF अपलोड करताना त्रुटी आली.' : 'Error uploading PDF.'));
    } finally {
      setVillageSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%', boxSizing: 'border-box' }}>
      {/* Toast Alert */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            padding: '12px 22px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '14px',
            boxShadow: '0 8px 24px rgba(5, 150, 105, 0.35)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* TOP HEADER & ACTION CONTROLS */}
      {/* ============================================================== */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
          borderRadius: '16px',
          padding: '20px 24px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 8px 24px rgba(30, 58, 138, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))',
            }}
          >
            <img src="/logo.png" alt="Intelligent MaKanisms Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', letterSpacing: '-0.3px' }}>
              {title || (isMr ? 'अधिकृत मतदान यादी व्यवस्थापक (Voter List)' : 'Official Voter List (मतदान यादी)')}
            </h1>
            <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#bfdbfe' }}>
              {isMr
                ? 'जिल्हा, तालुका, गाव आणि बूथनिहाय मतदार यादी पहा, शोधा व नवीन यादी अपलोड करा'
                : 'View, filter & upload voter lists by District, Taluka, Village and Booth'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '10px 16px',
              borderRadius: '10px',
              background: '#ffffff',
              color: '#1e40af',
              border: 'none',
              fontWeight: '800',
              fontSize: '13.5px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.15s ease',
            }}
          >
            <Download size={16} />
            <span>{isMr ? 'मतदान यादी अपलोड करा' : 'Upload Voter List'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddVoterModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.18)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Plus size={16} />
            <span>{isMr ? 'नवीन मतदार नोंद' : 'Add Single Voter'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setVillageForm((prev) => ({
                ...prev,
                district: selectedDistrict || 'सांगली',
                taluka: selectedTaluka && selectedTaluka !== 'all' ? selectedTaluka : 'मिरज',
              }));
              setShowAddVillageModal(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 15px',
              borderRadius: '10px',
              background: '#ffffff',
              color: '#065f46',
              border: 'none',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.15s ease',
            }}
          >
            <span>🏘️</span>
            <span>{isMr ? 'गाव व लोकसंख्या जोडा (PDF/थेट)' : 'Add Village & Population (PDF)'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.18)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
            }}
            title={isMr ? 'सध्याची यादी CSV मध्ये डाऊनलोड करा' : 'Export current filtered view to CSV'}
          >
            <Upload size={16} />
            <span>{isMr ? 'CSV एक्सपोर्ट' : 'Export'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4-LEVEL CASCADING GEOGRAPHY & SEARCH FILTER CARD */}
      {/* ============================================================== */}
      <div>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '18px 20px',
              border: '1.5px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={18} color="#2563eb" />
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
                  {isMr ? 'मतदान यादी फिल्टर्स (जिल्हा ➔ तालुका ➔ गाव ➔ शहर ➔ परिसर / प्रभाग ➔ बूथ क्रमांक ➔ मतदान केंद्र)' : 'Voter List Geographic Filters'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '7px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#dc2626',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  🔄 {isMr ? 'सर्व रीसेट' : 'Reset All'}
                </button>
              </div>
            </div>

            {/* 7-Level Geographic Hierarchy Filters in Requested Sequence */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {/* १. जिल्हा (District) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  १. {isMr ? 'जिल्हा निवडा (District)' : '1. District'}
                </label>
                <select
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: selectedDistrict ? '2px solid #2563eb' : '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: selectedDistrict ? '#1e3a8a' : '#64748b',
                    background: selectedDistrict ? '#eff6ff' : '#ffffff',
                    outline: 'none',
                  }}
                >
                  <option value="">{isMr ? '-- १. जिल्हा निवडा --' : '-- 1. Select District --'}</option>
                  {availableDistricts.map((d) => (
                    <option key={d} value={d}>🏛️ {d}</option>
                  ))}
                </select>
              </div>

              {/* २. तालुका (Taluka) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  २. {isMr ? 'तालुका निवडा (Taluka)' : '2. Taluka'}
                </label>
                <select
                  value={selectedTaluka}
                  onChange={handleTalukaChange}
                  disabled={!selectedDistrict}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: selectedTaluka && selectedTaluka !== 'all' ? '2px solid #059669' : '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: !selectedDistrict ? '#94a3b8' : selectedTaluka && selectedTaluka !== 'all' ? '#065f46' : '#0f172a',
                    background: !selectedDistrict ? '#f1f5f9' : selectedTaluka && selectedTaluka !== 'all' ? '#f0fdf4' : '#ffffff',
                    cursor: !selectedDistrict ? 'not-allowed' : 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="">
                    {!selectedDistrict
                      ? (isMr ? '🔒 आधी जिल्हा निवडा' : '🔒 Select District First')
                      : (isMr ? '-- २. सर्व तालुके (किंवा निवडा) --' : '-- 2. Select Taluka --')}
                  </option>
                  {selectedDistrict && <option value="all">{isMr ? 'सर्व तालुके (All Talukas)' : 'All Talukas'}</option>}
                  {selectedDistrict &&
                    availableTalukas.map((t) => (
                      <option key={t} value={t}>📍 {t}</option>
                    ))}
                </select>
              </div>

              {/* ३. गाव (Village) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  ३. {isMr ? 'गाव निवडा (Village)' : '3. Village'}
                </label>
                <select
                  value={selectedVillage}
                  onChange={handleVillageChange}
                  disabled={!selectedDistrict}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: selectedVillage && selectedVillage !== 'all' ? '2px solid #d97706' : '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: !selectedDistrict ? '#94a3b8' : selectedVillage && selectedVillage !== 'all' ? '#92400e' : '#0f172a',
                    background: !selectedDistrict ? '#f1f5f9' : selectedVillage && selectedVillage !== 'all' ? '#fffbeb' : '#ffffff',
                    cursor: !selectedDistrict ? 'not-allowed' : 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="">
                    {!selectedDistrict
                      ? (isMr ? '🔒 आधी जिल्हा निवडा' : '🔒 Select District First')
                      : (isMr ? '-- ३. सर्व गावे (किंवा निवडा) --' : '-- 3. Select Village --')}
                  </option>
                  {selectedDistrict && <option value="all">{isMr ? 'सर्व गावे (All Villages)' : 'All Villages'}</option>}
                  {selectedDistrict &&
                    availableVillages.map((v) => (
                      <option key={v} value={v}>🏡 {v}</option>
                    ))}
                </select>
              </div>

              {/* ४. शहर (City) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  ४. {isMr ? 'शहर निवडा (City)' : '4. City'}
                </label>
                <select
                  value={selectedCity}
                  onChange={handleCityChange}
                  disabled={!selectedDistrict}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: selectedCity && selectedCity !== 'all' ? '2px solid #0891b2' : '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: !selectedDistrict ? '#94a3b8' : selectedCity && selectedCity !== 'all' ? '#0e7490' : '#0f172a',
                    background: !selectedDistrict ? '#f1f5f9' : selectedCity && selectedCity !== 'all' ? '#ecfeff' : '#ffffff',
                    cursor: !selectedDistrict ? 'not-allowed' : 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="">
                    {!selectedDistrict
                      ? (isMr ? '🔒 आधी जिल्हा निवडा' : '🔒 Select District First')
                      : (isMr ? '-- ४. सर्व शहरे (किंवा निवडा) --' : '-- 4. Select City --')}
                  </option>
                  {selectedDistrict && <option value="all">{isMr ? 'सर्व शहरे (All Cities)' : 'All Cities'}</option>}
                  {selectedDistrict &&
                    availableCities.map((c) => (
                      <option key={c} value={c}>🏙️ {c}</option>
                    ))}
                </select>
              </div>

              {/* ५. परिसर / प्रभाग (Area / Prabhag) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  ५. {isMr ? 'परिसर / प्रभाग निवडा' : '5. Area / Prabhag'}
                </label>
                <select
                  value={selectedPrabhag}
                  onChange={handlePrabhagChange}
                  disabled={!selectedDistrict}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: selectedPrabhag !== 'all' ? '2px solid #e11d48' : '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: !selectedDistrict ? '#94a3b8' : selectedPrabhag !== 'all' ? '#be123c' : '#0f172a',
                    background: !selectedDistrict ? '#f1f5f9' : selectedPrabhag !== 'all' ? '#fff1f2' : '#ffffff',
                    cursor: !selectedDistrict ? 'not-allowed' : 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="all">{isMr ? 'सर्व परिसर / प्रभाग (All)' : 'All Areas / Wards'}</option>
                  {selectedDistrict &&
                    availablePrabhags.map((p) => (
                      <option key={p} value={p}>🏘️ {p}</option>
                    ))}
                </select>
              </div>

              {/* ६. बूथ क्रमांक (Booth Number) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  ६. {isMr ? 'बूथ क्रमांक निवडा (Booth No)' : '6. Booth No'}
                </label>
                <select
                  value={selectedBooth}
                  onChange={handleBoothChange}
                  disabled={!selectedDistrict}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: selectedBooth !== 'all' ? '2px solid #7c3aed' : '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: !selectedDistrict ? '#94a3b8' : selectedBooth !== 'all' ? '#5b21b6' : '#0f172a',
                    background: !selectedDistrict ? '#f1f5f9' : selectedBooth !== 'all' ? '#f5f3ff' : '#ffffff',
                    cursor: !selectedDistrict ? 'not-allowed' : 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="all">{isMr ? 'सर्व बूथ क्रमांक (All Booths)' : 'All Booths'}</option>
                  {selectedDistrict &&
                    availableBooths.map((b) => (
                      <option key={b} value={b}>🗳️ बूथ क्र. {b}</option>
                    ))}
                </select>
              </div>

              {/* ७. मतदान केंद्र (Polling Station / Center) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  ७. {isMr ? 'मतदान केंद्र निवडा (Center)' : '7. Polling Center'}
                </label>
                <select
                  value={selectedCenter}
                  onChange={handleCenterChange}
                  disabled={!selectedDistrict}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: selectedCenter !== 'all' ? '2px solid #4f46e5' : '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: !selectedDistrict ? '#94a3b8' : selectedCenter !== 'all' ? '#3730a3' : '#0f172a',
                    background: !selectedDistrict ? '#f1f5f9' : selectedCenter !== 'all' ? '#eef2ff' : '#ffffff',
                    cursor: !selectedDistrict ? 'not-allowed' : 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="all">{isMr ? 'सर्व मतदान केंद्रे (All)' : 'All Polling Centers'}</option>
                  {selectedDistrict &&
                    availableCenters.map((c) => (
                      <option key={c} value={c}>🏢 {c}</option>
                    ))}
                </select>
              </div>
            </div>

            {/* Second Row: Real-time Search + Quick Demographic Filters */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', paddingTop: '4px' }}>
              {/* Search Criteria Dropdown + Search Box */}
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  minWidth: '280px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  background: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                {/* Search Type Selector Dropdown (जात, नाव, आडनाव, गाव, परिसर / प्रभाग) */}
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  title={isMr ? 'शोध प्रकार निवडा (Search By)' : 'Select Search Field'}
                  style={{
                    padding: '9px 12px',
                    border: 'none',
                    borderRight: '1.5px solid #e2e8f0',
                    background: '#f8fafc',
                    color: '#1e293b',
                    fontSize: '13px',
                    fontWeight: '700',
                    outline: 'none',
                    cursor: 'pointer',
                    borderTopLeftRadius: '7px',
                    borderBottomLeftRadius: '7px',
                    minWidth: '135px',
                  }}
                >
                  <option value="all">{isMr ? '🔍 सर्व (All)' : '🔍 All Fields'}</option>
                  <option value="caste">{isMr ? '🏷️ जात (Cast)' : '🏷️ Cast'}</option>
                  <option value="name">{isMr ? '👤 नाव (Name)' : '👤 Name'}</option>
                  <option value="surname">{isMr ? '👥 आडनाव (Surname)' : '👥 Surname'}</option>
                  <option value="village">{isMr ? '🏡 गाव (Gav)' : '🏡 Gav'}</option>
                  <option value="area">{isMr ? '🏘️ परिसर (Area)' : '🏘️ Area'}</option>
                  <option value="ward">{isMr ? '🏛️ वॉर्ड (Ward)' : '🏛️ Ward'}</option>
                  <option value="booth">{isMr ? '🗳️ बूथ (Booth)' : '🗳️ Booth'}</option>
                </select>

                {/* Input Box */}
                <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type="text"
                    placeholder={getSearchPlaceholder(searchType, isMr)}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '9px 34px 9px 36px',
                      border: 'none',
                      fontSize: '13.5px',
                      outline: 'none',
                      background: 'transparent',
                      borderTopRightRadius: '7px',
                      borderBottomRightRadius: '7px',
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                      title={isMr ? 'साफ करा' : 'Clear'}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Gender Filter */}
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                style={{
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#334155',
                  background: '#ffffff',
                }}
              >
                <option value="all">{isMr ? 'लिंग: सर्व (Gender: All)' : 'Gender: All'}</option>
                <option value="male">{isMr ? '👨 फक्त पुरुष (Male)' : 'Male Only'}</option>
                <option value="female">{isMr ? '👩 फक्त महिला (Female)' : 'Female Only'}</option>
                <option value="other">{isMr ? '⚧️ फक्त इतर (Other)' : 'Other Only'}</option>
              </select>

              {/* Age Filter: Dropdown + Editable Input */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <select
                  value={ageGroupFilter}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAgeGroupFilter(val);
                    if (val === 'all') {
                      setCustomAge('');
                    } else if (val === '18-25' || val === '26-40' || val === '41-60' || val === '60+') {
                      setCustomAge(val);
                    }
                  }}
                  title={isMr ? 'वयोगट निवडा' : 'Select Age Group'}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#334155',
                    background: '#ffffff',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="all">{isMr ? 'वयोगट: सर्व (Age: All)' : 'Age: All'}</option>
                  <option value="18-25">{isMr ? '१८ - २५ वर्षे (युवा)' : '18-25 Years'}</option>
                  <option value="26-40">{isMr ? '२६ - ४० वर्षे' : '26-40 Years'}</option>
                  <option value="41-60">{isMr ? '४१ - ६० वर्षे' : '41-60 Years'}</option>
                  <option value="60+">{isMr ? '६०+ वर्षे (ज्येष्ठ)' : '60+ Years'}</option>
                  <option value="custom">{isMr ? '✏️ सानुकूल वय (Custom Age)' : '✏️ Custom Age'}</option>
                </select>

                {/* Editable Age Input */}
                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={customAge}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomAge(val);
                      if (val.trim()) {
                        if (['18-25', '26-40', '41-60', '60+'].includes(val.trim())) {
                          setAgeGroupFilter(val.trim());
                        } else {
                          setAgeGroupFilter('custom');
                        }
                      } else {
                        setAgeGroupFilter('all');
                      }
                    }}
                    placeholder={isMr ? 'वय टाका (उदा. २५, ३०-४५)' : 'Age (e.g. 25, 30-45)'}
                    title={isMr ? 'थेट वय किंवा वयोगट टाका' : 'Type exact age or custom range'}
                    style={{
                      padding: '9px 28px 9px 12px',
                      borderRadius: '8px',
                      border: customAge.trim() ? '1.5px solid #3b82f6' : '1.5px solid #cbd5e1',
                      background: customAge.trim() ? '#eff6ff' : '#ffffff',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#0f172a',
                      outline: 'none',
                      width: '145px',
                      boxSizing: 'border-box',
                    }}
                  />
                  {customAge && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomAge('');
                        setAgeGroupFilter('all');
                      }}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        fontSize: '12px',
                        padding: '2px',
                        lineHeight: 1,
                      }}
                      title={isMr ? 'वय साफ करा' : 'Clear Age'}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Primary Search Button */}
              <button
                type="button"
                onClick={handleSearch}
                disabled={loadingVoters}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 20px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  boxShadow: '0 3px 8px rgba(37,99,235,0.28)',
                  transition: 'all 0.15s ease',
                }}
                title={isMr ? 'निवडलेल्या निकषांनुसार मतदार शोधा' : 'Search voters by selected filters'}
              >
                <Search size={16} />
                <span>{loadingVoters ? (isMr ? 'शोधत आहे...' : 'Searching...') : (isMr ? 'शोधा (Search)' : 'Search Voters')}</span>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* VIEW MODE TABS: VOTER LIST | VILLAGE POPULATION DB | BOOTHS DIRECTORY */}
          {/* ============================================================== */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              margin: '4px 0 16px 0',
              padding: '6px 8px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveViewMode('voters')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '9px',
                border: activeViewMode === 'voters' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: activeViewMode === 'voters' ? '#eff6ff' : '#ffffff',
                color: activeViewMode === 'voters' ? '#1d4ed8' : '#475569',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: activeViewMode === 'voters' ? '0 2px 8px rgba(37,99,235,0.18)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              👥 {isMr ? '१. मतदार यादी (Voter List)' : '1. Voters Roster'}
              <span
                style={{
                  background: activeViewMode === 'voters' ? '#2563eb' : '#f1f5f9',
                  color: activeViewMode === 'voters' ? '#ffffff' : '#64748b',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                {filteredVoters.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveViewMode('villages');
                fetchVillageStats();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '9px',
                border: activeViewMode === 'villages' ? '2px solid #059669' : '1px solid #cbd5e1',
                background: activeViewMode === 'villages' ? '#ecfdf5' : '#ffffff',
                color: activeViewMode === 'villages' ? '#047857' : '#475569',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: activeViewMode === 'villages' ? '0 2px 8px rgba(5,150,105,0.18)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              🏘️ {isMr ? '२. गाव लोकसंख्या व मतदार सांख्यिकी (DB)' : '2. Village Population & Voters DB'}
              <span
                style={{
                  background: activeViewMode === 'villages' ? '#059669' : '#f1f5f9',
                  color: activeViewMode === 'villages' ? '#ffffff' : '#64748b',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                {villageSummary.total_villages ? villageSummary.total_villages.toLocaleString('en-IN') : '44,929'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveViewMode('booths');
                fetchBoothsDirectory();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '9px',
                border: activeViewMode === 'booths' ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                background: activeViewMode === 'booths' ? '#f5f3ff' : '#ffffff',
                color: activeViewMode === 'booths' ? '#6d28d9' : '#475569',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: activeViewMode === 'booths' ? '0 2px 8px rgba(124,58,237,0.18)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              🗳️ {isMr ? '३. मतदान केंद्र व बूथ यादी (Booths Directory)' : '3. Polling Booths Directory'}
              <span
                style={{
                  background: activeViewMode === 'booths' ? '#7c3aed' : '#f1f5f9',
                  color: activeViewMode === 'booths' ? '#ffffff' : '#64748b',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                {boothsSummary.total || boothsList.length || '42'}
              </span>
            </button>
          </div>

          {/* ============================================================== */}
          {/* TAB 1: VOTER LIST DATA TABLE */}
          {/* ============================================================== */}
          {activeViewMode === 'voters' && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="#1e40af" />
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
                    {isMr ? 'मतदार यादी नोंदवही' : 'Voters Roster Table'}
                  </span>
                  <span style={{ fontSize: '12px', background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
                    {filteredVoters.length} {isMr ? 'मतदार सापडले' : 'records'}
                  </span>
                </div>

                <div style={{ fontSize: '12.5px', color: '#1e3a8a', fontWeight: '700', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedDistrict && (
                    <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '4px' }}>
                      🏛️ {selectedDistrict}
                    </span>
                  )}
                  {selectedTaluka && selectedTaluka !== 'all' && (
                    <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px' }}>
                      📍 तालुका: {selectedTaluka}
                    </span>
                  )}
                  {selectedVillage && selectedVillage !== 'all' && (
                    <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px' }}>
                      🏡 गाव: {selectedVillage}
                    </span>
                  )}
                  {selectedCity && selectedCity !== 'all' && (
                    <span style={{ background: '#ecfeff', color: '#0e7490', padding: '2px 8px', borderRadius: '4px' }}>
                      🏙️ शहर: {selectedCity}
                    </span>
                  )}
                  {selectedPrabhag && selectedPrabhag !== 'all' && (
                    <span style={{ background: '#fff1f2', color: '#be123c', padding: '2px 8px', borderRadius: '4px' }}>
                      🏘️ परिसर/प्रभाग: {selectedPrabhag}
                    </span>
                  )}
                  {selectedBooth !== 'all' && (
                    <span style={{ background: '#f3e8ff', color: '#6b21a8', padding: '2px 8px', borderRadius: '4px' }}>
                      🗳️ बूथ क्र. {selectedBooth}
                    </span>
                  )}
                  {selectedCenter && selectedCenter !== 'all' && (
                    <span style={{ background: '#eef2ff', color: '#3730a3', padding: '2px 8px', borderRadius: '4px' }}>
                      🏢 केंद्र: {selectedCenter}
                    </span>
                  )}
                  {searchQuery.trim() && (
                    <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', border: '1px solid #fde68a', fontWeight: '800' }}>
                      🔍 {searchType === 'caste' ? 'जात' : searchType === 'name' ? 'नाव' : searchType === 'surname' ? 'आडनाव' : searchType === 'village' ? 'गाव' : searchType === 'area' ? 'परिसर' : searchType === 'ward' ? 'वॉर्ड' : searchType === 'booth' ? 'बूथ' : 'शोध'}: "{searchQuery}"
                    </span>
                  )}
                  {(ageGroupFilter !== 'all' || customAge.trim()) && (
                    <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', border: '1px solid #fde68a', fontWeight: '800' }}>
                      🎂 {isMr ? 'वय' : 'Age'}: {customAge || (ageGroupFilter === '18-25' ? '१८-२५' : ageGroupFilter === '26-40' ? '२६-४०' : ageGroupFilter === '41-60' ? '४१-६०' : ageGroupFilter === '60+' ? '६०+' : ageGroupFilter)}
                    </span>
                  )}
                </div>
              </div>

              {/* Responsive Table */}
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', color: '#475569', borderBottom: '1px solid #cbd5e1', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <th style={{ padding: '12px 14px', width: '45px' }}>{isMr ? 'क्र.' : 'Sr.'}</th>
                      <th style={{ padding: '12px 14px' }}>{isMr ? 'ओळखपत्र क्र. (EPIC)' : 'EPIC No.'}</th>
                      <th style={{ padding: '12px 14px' }}>{isMr ? 'मतदाराचे नाव' : 'Voter Name'}</th>
                      <th style={{ padding: '12px 14px' }}>{isMr ? 'नातेवाईक / कुटुंबप्रमुख' : 'Relative / Head'}</th>
                      <th style={{ padding: '12px 14px', width: '65px' }}>{isMr ? 'वय' : 'Age'}</th>
                      <th style={{ padding: '12px 14px', width: '85px' }}>{isMr ? 'लिंग' : 'Gender'}</th>
                      <th style={{ padding: '12px 14px', width: '70px' }}>{isMr ? 'घर क्र.' : 'House No.'}</th>
                      <th style={{ padding: '12px 14px' }}>{isMr ? 'जिल्हा' : 'District'}</th>
                      <th style={{ padding: '12px 14px' }}>{isMr ? 'तालुका' : 'Taluka'}</th>
                      <th style={{ padding: '12px 14px' }}>{isMr ? 'गाव' : 'Village'}</th>
                      <th style={{ padding: '12px 14px' }}>{isMr ? 'शहर' : 'City'}</th>
                      <th style={{ padding: '12px 14px' }}>{isMr ? 'परिसर / प्रभाग' : 'Area / Prabhag'}</th>
                      <th style={{ padding: '12px 14px', width: '90px' }}>{isMr ? 'बूथ क्रमांक' : 'Booth No.'}</th>
                      <th style={{ padding: '12px 14px' }}>{isMr ? 'मतदान केंद्र' : 'Polling Station'}</th>
                      <th style={{ padding: '12px 14px', textAlign: 'center' }}>{isMr ? 'Remarks / निरीक्षण' : 'Remarks / Action'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVoters.length === 0 ? (
                      <tr>
                        <td colSpan={15} style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                          <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔍</div>
                          <div style={{ fontSize: '15px', fontWeight: '700', color: '#475569' }}>
                            {isMr ? 'निवडलेल्या निकषानुसार एकही मतदार सापडला नाही' : 'No voters found matching your filters'}
                          </div>
                          <p style={{ fontSize: '13px', margin: '4px 0 12px 0' }}>
                            {isMr ? 'कृपया फिल्टर्स बदला किंवा सर्व रीसेट करा.' : 'Please adjust your search or reset filters.'}
                          </p>
                          <button
                            type="button"
                            onClick={resetAllFilters}
                            style={{ padding: '6px 14px', borderRadius: '6px', background: '#2563eb', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer' }}
                          >
                            {isMr ? 'फिल्टर्स रीसेट करा' : 'Reset Filters'}
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredVoters.map((v, idx) => (
                        <tr
                          key={v.id || idx}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            background: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                            transition: 'background 0.15s ease',
                          }}
                        >
                          <td style={{ padding: '12px 14px', fontWeight: '600', color: '#64748b' }}>{idx + 1}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                background: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                fontWeight: '800',
                                fontSize: '12px',
                                color: '#1e293b',
                                fontFamily: 'monospace',
                              }}
                            >
                              {v.epic_no}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: '800', color: '#0f172a' }}>{v.name_mr}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '11.5px', color: '#64748b' }}>{v.name_en}</span>
                              <span
                                style={{
                                  fontSize: '10.5px',
                                  fontWeight: '700',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  background: '#fef3c7',
                                  color: '#92400e',
                                  border: '1px solid #fde68a',
                                }}
                                title={isMr ? 'जात / प्रवर्ग' : 'Caste'}
                              >
                                🏷️ {v.caste || getVoterCaste(v)}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', color: '#475569' }}>{v.relative_mr || '—'}</td>
                          {/* वय (Age) */}
                          <td style={{ padding: '12px 14px', fontWeight: '750', color: '#1e293b' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                background: '#f8fafc',
                                border: '1px solid #cbd5e1',
                                fontSize: '12px',
                                fontWeight: '800',
                              }}
                            >
                              {v.age ? `${v.age} वर्षे` : '—'}
                            </span>
                          </td>
                          {/* लिंग (Gender) */}
                          <td style={{ padding: '12px 14px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: '750',
                                background: v.gender === 'male' ? '#e0f2fe' : v.gender === 'female' ? '#fce7f3' : '#f3e8ff',
                                color: v.gender === 'male' ? '#0369a1' : v.gender === 'female' ? '#be185d' : '#7e22ce',
                              }}
                            >
                              {v.gender === 'male' ? '👨 पुरुष' : v.gender === 'female' ? '👩 महिला' : '⚧️ इतर'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: '700', color: '#334155' }}>{v.house_no || '—'}</td>
                          {/* 1. जिल्हा (District) */}
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontWeight: '700', color: '#1e3a8a', background: '#eff6ff', padding: '3px 8px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                              🏛️ {v.district}
                            </span>
                          </td>
                          {/* 2. तालुका (Taluka) */}
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontWeight: '600', color: '#065f46', background: '#f0fdf4', padding: '3px 8px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                              📍 {v.taluka}
                            </span>
                          </td>
                          {/* 3. गाव (Village) */}
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontWeight: '600', color: '#92400e', background: '#fffbeb', padding: '3px 8px', borderRadius: '6px', border: '1px solid #fde68a' }}>
                              🏡 {v.village}
                            </span>
                          </td>
                          {/* 4. शहर (City) */}
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontWeight: '600', color: '#0e7490', background: '#ecfeff', padding: '3px 8px', borderRadius: '6px', border: '1px solid #a5f3fc' }}>
                              🏙️ {v.city || (v.village?.includes('शहर') ? v.village : (v.taluka ? `${v.taluka} शहर` : '—'))}
                            </span>
                          </td>
                          {/* 5. परिसर / प्रभाग (Area / Prabhag) */}
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontWeight: '600', color: '#be123c', background: '#fff1f2', padding: '3px 8px', borderRadius: '6px', border: '1px solid #fecdd3' }}>
                              🏘️ {v.prabhag || 'प्रभाग क्र. १'}
                            </span>
                          </td>
                          {/* 6. बूथ क्रमांक (Booth No) */}
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontWeight: '800', color: '#6d28d9', background: '#f5f3ff', padding: '3px 8px', borderRadius: '6px', border: '1px solid #ddd6fe' }}>
                              🗳️ बूथ {v.booth_no}
                            </span>
                          </td>
                          {/* 7. मतदान केंद्र (Polling Station / Center) */}
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: '600', color: '#3730a3', maxWidth: '240px', fontSize: '12px' }} title={v.booth_name}>
                              🏢 {v.booth_name}
                            </div>
                          </td>
                          {/* Remarks / निरीक्षण */}
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => setSelectedVoter(v)}
                              style={{
                                padding: '5px 10px',
                                borderRadius: '6px',
                                border: '1px solid #bfdbfe',
                                background: '#eff6ff',
                                color: '#1d4ed8',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                cursor: 'pointer',
                              }}
                            >
                              🔍 {isMr ? 'निरीक्षण / तपशील' : 'Remarks / View'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: VILLAGE POPULATION & VOTERS STATISTICAL TABLE (FROM DB) */}
          {/* ============================================================== */}
          {activeViewMode === 'villages' && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)', color: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>🏘️</span>
                      <span>{isMr ? 'महाराष्ट्र शासन अधिकृत गाव लोकसंख्या व मतदार सांख्यिकी' : 'Official Village Demographics & Registered Voters'}</span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#d1fae5', marginTop: '2px' }}>
                      {isMr
                        ? `डेटाबेस टेबल: 'villages' | एकूण गावे: ${villageSummary.total_villages.toLocaleString('en-IN')} | एकूण मतदार: ${villageSummary.total_voters.toLocaleString('en-IN')} | लोकसंख्या: ${villageSummary.total_population.toLocaleString('en-IN')}`
                        : `Database Table: 'villages' | Total Villages: ${villageSummary.total_villages.toLocaleString('en-IN')}`}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setVillageForm((prev) => ({
                          ...prev,
                          district: selectedDistrict || 'सांगली',
                          taluka: selectedTaluka && selectedTaluka !== 'all' ? selectedTaluka : 'मिरज',
                        }));
                        setShowAddVillageModal(true);
                      }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#ffffff',
                        color: '#065f46',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      }}
                    >
                      ➕ {isMr ? 'नवीन गाव व लोकसंख्या जोडा (PDF/थेट)' : 'Add Village & Population (PDF)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => fetchVillageStats()}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      🔄 {isMr ? 'रिफ्रेश' : 'Refresh'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Village Table */}
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #cbd5e1', fontSize: '12px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 14px', width: '50px' }}>{isMr ? 'क्र.' : 'Sr.'}</th>
                      <th style={{ padding: '12px 14px' }}>{isMr ? 'गाव नाव (Village)' : 'Village Name'}</th>
                      <th style={{ padding: '12px 14px' }}>{isMr ? 'गाव कोड (LGD Code)' : 'LGD Code'}</th>
                      <th style={{ padding: '12px 14px' }}>{isMr ? 'तालुका' : 'Taluka'}</th>
                      <th style={{ padding: '12px 14px' }}>{isMr ? 'जिल्हा' : 'District'}</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>{isMr ? 'अंदाजे लोकसंख्या' : 'Population'}</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>{isMr ? 'नोंदणीकृत मतदार' : 'Registered Voters'}</th>
                      <th style={{ padding: '12px 14px', textAlign: 'center' }}>{isMr ? 'मतदार प्रमाण %' : 'Voter Ratio'}</th>
                      <th style={{ padding: '12px 14px', textAlign: 'center' }}>{isMr ? 'कृती' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {villageLoading ? (
                      <tr>
                        <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                          <div style={{ fontSize: '26px', marginBottom: '8px' }}>⏳</div>
                          <div>{isMr ? 'डेटाबेसमधून गावनिहाय मतदार व लोकसंख्या डेटा लोड होत आहे...' : 'Loading village statistics from database...'}</div>
                        </td>
                      </tr>
                    ) : villageStats.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                          <div style={{ fontSize: '26px', marginBottom: '8px' }}>🔍</div>
                          <div>{isMr ? 'या निकषांवर गावे सापडली नाहीत.' : 'No villages found.'}</div>
                        </td>
                      </tr>
                    ) : (
                      villageStats.map((v, idx) => {
                        const ratio = v.population > 0 ? Math.round((v.total_voters / v.population) * 100) : 72;
                        return (
                          <tr
                            key={v.id || idx}
                            style={{
                              borderBottom: '1px solid #f1f5f9',
                              background: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                            }}
                          >
                            <td style={{ padding: '12px 14px', color: '#64748b', fontWeight: '600' }}>{idx + 1}</td>
                            <td style={{ padding: '12px 14px' }}>
                              <span style={{ fontWeight: '800', color: '#0f172a' }}>{v.village_name}</span>
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              <span style={{ fontFamily: 'monospace', fontSize: '11.5px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                                {v.village_code}
                              </span>
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              <span style={{ color: '#1e40af', fontWeight: '600' }}>{v.taluka_name || '—'}</span>
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              <span style={{ color: '#334155' }}>{v.district_name || '—'}</span>
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '700', color: '#334155' }}>
                              {Number(v.population || 0).toLocaleString('en-IN')}
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '800', color: '#047857' }}>
                              {Number(v.total_voters || 0).toLocaleString('en-IN')}
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                              <span
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  fontSize: '11.5px',
                                  fontWeight: '700',
                                  background: ratio >= 70 ? '#ecfdf5' : '#eff6ff',
                                  color: ratio >= 70 ? '#047857' : '#1d4ed8',
                                  border: `1px solid ${ratio >= 70 ? '#a7f3d0' : '#bfdbfe'}`,
                                }}
                              >
                                {ratio}%
                              </span>
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedVillage(v.village_name);
                                  setActiveViewMode('voters');
                                  fetchVotersFromDb({ village: v.village_name });
                                }}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid #a7f3d0',
                                  background: '#ecfdf5',
                                  color: '#047857',
                                  fontSize: '11.5px',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                }}
                              >
                                👥 {isMr ? 'मतदार पहा' : 'View Voters'}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: POLLING BOOTHS DIRECTORY TABLE (FROM DB TABLES) */}
          {/* ============================================================== */}
          {activeViewMode === 'booths' && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)', color: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>🗳️</span>
                      <span>{isMr ? 'अधिकृत मतदान केंद्र व बूथ यादी' : 'Official Polling Stations & Booths Directory'}</span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#ede9fe', marginTop: '2px' }}>
                      {isMr
                        ? `डेटाबेस टेबल: 'polling_stations' & 'neta_booth_progress' | एकूण बूथ: ${boothsSummary.total || boothsList.length} | एकूण मतदार: ${(boothsSummary.total_voters || 45190).toLocaleString('en-IN')}`
                        : `Database Tables: 'polling_stations' & 'neta_booth_progress' | Total Booths: ${boothsSummary.total || boothsList.length}`}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => fetchBoothsDirectory()}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      🔄 {isMr ? 'रिफ्रेश' : 'Refresh'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Booths Table */}
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #cbd5e1', fontSize: '12px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 14px' }}>{isMr ? 'बूथ क्रमांक' : 'Booth No.'}</th>
                      <th style={{ padding: '12px 14px' }}>{isMr ? 'मतदान केंद्र नाव' : 'Polling Station Name'}</th>
                      <th style={{ padding: '12px 14px' }}>{isMr ? 'जिल्हा' : 'District'}</th>
                      <th style={{ padding: '12px 14px' }}>{isMr ? 'तालुका' : 'Taluka'}</th>
                      <th style={{ padding: '12px 14px' }}>{isMr ? 'गाव / प्रभाग' : 'Village / Ward'}</th>
                      <th style={{ padding: '12px 14px' }}>{isMr ? 'विधानसभा' : 'Assembly'}</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>{isMr ? 'एकूण मतदार' : 'Voters'}</th>
                      <th style={{ padding: '12px 14px' }}>{isMr ? 'बूथ प्रमुख / संपर्क' : 'Booth Lead'}</th>
                      <th style={{ padding: '12px 14px', textAlign: 'center' }}>{isMr ? 'कृती' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boothsLoading ? (
                      <tr>
                        <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                          <div style={{ fontSize: '26px', marginBottom: '8px' }}>⏳</div>
                          <div>{isMr ? 'डेटाबेसमधून मतदान केंद्रे लोड होत आहेत...' : 'Loading polling stations from database...'}</div>
                        </td>
                      </tr>
                    ) : boothsList.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                          <div style={{ fontSize: '26px', marginBottom: '8px' }}>🔍</div>
                          <div>{isMr ? 'कोणतेही मतदान केंद्र सापडले नाही.' : 'No polling booths found.'}</div>
                        </td>
                      </tr>
                    ) : (
                      boothsList.map((b, idx) => (
                        <tr
                          key={b.id || idx}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            background: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                          }}
                        >
                          <td style={{ padding: '12px 14px' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                background: '#f5f3ff',
                                border: '1px solid #ddd6fe',
                                color: '#6d28d9',
                                fontWeight: '800',
                                fontSize: '12px',
                              }}
                            >
                              {b.booth_no}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: '800', color: '#0f172a' }}>{b.name_mr}</div>
                            {b.name_en && b.name_en !== b.name_mr && (
                              <div style={{ fontSize: '11.5px', color: '#64748b' }}>{b.name_en}</div>
                            )}
                          </td>
                          <td style={{ padding: '12px 14px', color: '#475569' }}>{b.district}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ color: '#1e40af', fontWeight: '600' }}>{b.taluka}</span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ color: '#047857', fontWeight: '700' }}>{b.village}</span>
                            {b.ward && <div style={{ fontSize: '11px', color: '#64748b' }}>{b.ward}</div>}
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: '12px', color: '#475569' }}>
                            {b.assembly}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '800', color: '#1d4ed8' }}>
                            {Number(b.total_voters || 0).toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '12.5px' }}>
                              {b.incharge_name || '—'}
                            </div>
                            {b.incharge_phone && b.incharge_phone !== '—' && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                <span style={{ fontSize: '11.5px', color: '#64748b' }}>{b.incharge_phone}</span>
                                <a
                                  href={`https://wa.me/91${b.incharge_phone.replace(/[^0-9]/g, '').slice(-10)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    fontSize: '11px',
                                    color: '#16a34a',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    background: '#dcfce7',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  💬
                                </a>
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => {
                                const boothNum = b.booth_no.replace(/[^0-9]/g, '');
                                setSelectedBooth(boothNum || 'all');
                                setActiveViewMode('voters');
                                fetchVotersFromDb({ booth_no: boothNum });
                              }}
                              style={{
                                padding: '5px 10px',
                                borderRadius: '6px',
                                border: '1px solid #ddd6fe',
                                background: '#f5f3ff',
                                color: '#6d28d9',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                cursor: 'pointer',
                              }}
                            >
                              👥 {isMr ? 'मतदार पहा' : 'Voters'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: UPLOAD VOTER LIST (मतदान यादी अपलोड) */}
      {/* ============================================================== */}
      {showUploadModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => !isUploading && setShowUploadModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Upload size={20} color="#1d4ed8" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                    {isMr ? 'मतदान यादी फाइल अपलोड करा' : 'Upload Voter List File'}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {isMr ? 'Excel / CSV / PDF फॉरमॅट समर्थित' : 'Supports Excel, CSV, PDF formats'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isUploading && setShowUploadModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Target Location Assignment */}
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#334155' }}>
                📍 {isMr ? 'अपलोड होणारा डेटा कोणत्या भागासाठी आहे?' : 'Target Geographic Area'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    {isMr ? 'जिल्हा' : 'District'}
                  </label>
                  <select
                    value={uploadTargetDistrict}
                    onChange={(e) => {
                      const d = e.target.value;
                      setUploadTargetDistrict(d);
                      const talList = MASTER_GEOGRAPHY[d] ? Object.keys(MASTER_GEOGRAPHY[d]) : ['मिरज'];
                      const firstTal = talList[0] || '';
                      setUploadTargetTaluka(firstTal);
                      const vilList = (firstTal && MASTER_GEOGRAPHY[d]?.[firstTal]) ? MASTER_GEOGRAPHY[d][firstTal] : ['सांगली शहर'];
                      const firstVil = vilList[0] || '';
                      setUploadTargetVillage(firstVil);
                      setUploadTargetBooth('१');
                    }}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '12.5px', background: '#ffffff', fontWeight: '600' }}
                  >
                    {availableDistricts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    {isMr ? 'तालुका' : 'Taluka'}
                  </label>
                  <select
                    value={uploadTargetTaluka}
                    onChange={(e) => {
                      const t = e.target.value;
                      setUploadTargetTaluka(t);
                      const vilList = (t && MASTER_GEOGRAPHY[uploadTargetDistrict]?.[t]) ? MASTER_GEOGRAPHY[uploadTargetDistrict][t] : ['सांगली शहर'];
                      const firstVil = vilList[0] || '';
                      setUploadTargetVillage(firstVil);
                      setUploadTargetBooth('१');
                    }}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '12.5px', background: '#ffffff', fontWeight: '600' }}
                  >
                    {uploadTargetTalukas.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    {isMr ? 'गाव / परिसर' : 'Village'}
                  </label>
                  <select
                    value={uploadTargetVillage}
                    onChange={(e) => {
                      setUploadTargetVillage(e.target.value);
                      setUploadTargetBooth('१');
                    }}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '12.5px', background: '#ffffff', fontWeight: '600' }}
                  >
                    {uploadTargetVillages.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    {isMr ? 'बूथ क्रमांक' : 'Booth No.'}
                  </label>
                  <select
                    value={uploadTargetBooth}
                    onChange={(e) => setUploadTargetBooth(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '12.5px', background: '#ffffff', fontWeight: '600' }}
                  >
                    {uploadTargetBooths.map((b) => (
                      <option key={b} value={b}>
                        {isMr ? `बूथ क्रमांक ${b}` : `Booth No. ${b}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* File Drop Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #93c5fd',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                background: '#f0f9ff',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .xlsx, .xls, .pdf"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
              <FileSpreadsheet size={36} color="#2563eb" style={{ margin: '0 auto 8px auto' }} />
              <div style={{ fontWeight: '800', color: '#1e40af', fontSize: '14px' }}>
                {uploadFileName ? uploadFileName : (isMr ? 'मतदान यादी फाईल निवडा किंवा ड्रॅग करा' : 'Select or drag voter file')}
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
                CSV, Excel (.xlsx) किंवा अधिकृत निवडणूक आयोग PDF यादी
              </div>
            </div>

            {/* Dynamic Column Mapping Wizard */}
            {uploadFileName && (
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#1e3a8a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>⚙️</span>
                  <span>{isMr ? 'एक्सेल कॉलम मॅपिंग विझार्ड (Dynamic Column Mapping)' : 'Dynamic Column Mapping Wizard'}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11.5px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontWeight: '700', marginBottom: '2px' }}>
                      {isMr ? 'मतदाराचे नाव कॉलम :' : 'Voter Name Col :'}
                    </label>
                    <select
                      value={columnMapping.name}
                      onChange={(e) => setColumnMapping({ ...columnMapping, name: e.target.value })}
                      style={{ width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#fff' }}
                    >
                      <option value="col_A">Column A (नाव / Name)</option>
                      <option value="col_B">Column B (EPIC / ओळखपत्र)</option>
                      <option value="col_C">Column C (वय व लिंग)</option>
                      <option value="col_D">Column D (घर क्र. / पत्ता)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontWeight: '700', marginBottom: '2px' }}>
                      {isMr ? 'EPIC ओळखपत्र क्र. कॉलम :' : 'EPIC No Col :'}
                    </label>
                    <select
                      value={columnMapping.epic}
                      onChange={(e) => setColumnMapping({ ...columnMapping, epic: e.target.value })}
                      style={{ width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#fff' }}
                    >
                      <option value="col_B">Column B (EPIC / ओळखपत्र)</option>
                      <option value="col_A">Column A (नाव / Name)</option>
                      <option value="col_C">Column C (वय व लिंग)</option>
                      <option value="col_D">Column D (घर क्र. / पत्ता)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontWeight: '700', marginBottom: '2px' }}>
                      {isMr ? 'वय / लिंग कॉलम :' : 'Age & Gender Col :'}
                    </label>
                    <select
                      value={columnMapping.ageGender}
                      onChange={(e) => setColumnMapping({ ...columnMapping, ageGender: e.target.value })}
                      style={{ width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#fff' }}
                    >
                      <option value="col_C">Column C (वय व लिंग)</option>
                      <option value="col_A">Column A</option>
                      <option value="col_B">Column B</option>
                      <option value="col_D">Column D</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontWeight: '700', marginBottom: '2px' }}>
                      {isMr ? 'घर क्र. / पत्ता कॉलम :' : 'House / Address Col :'}
                    </label>
                    <select
                      value={columnMapping.houseNo}
                      onChange={(e) => setColumnMapping({ ...columnMapping, houseNo: e.target.value })}
                      style={{ width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#fff' }}
                    >
                      <option value="col_D">Column D (घर क्र. / पत्ता)</option>
                      <option value="col_A">Column A</option>
                      <option value="col_B">Column B</option>
                      <option value="col_C">Column C</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#059669', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>✓</span>
                  <span>{isMr ? 'कॉलम मॅपिंग तयार आहे • डेटा अचूक फॉरमॅटमध्ये आयात केला जाईल' : 'Column mapping verified • Ready for dynamic import'}</span>
                </div>
              </div>
            )}

            {/* Progress bar */}
            {isUploading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: '700', color: '#1e40af' }}>
                  <span>{isMr ? 'मतदार यादी तपासणी व आयात सुरू आहे...' : 'Processing and importing...'}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div style={{ width: '100%', height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${uploadProgress}%`, height: '100%', background: '#2563eb', transition: 'width 0.2s ease' }} />
                </div>
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '6px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setShowUploadModal(false)}
                  style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: '600', cursor: 'pointer', fontSize: '12.5px' }}
                >
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="button"
                  disabled={!uploadFileName || isUploading}
                  onClick={handleProcessUpload}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: uploadFileName && !isUploading ? '#1e40af' : '#94a3b8',
                    color: '#ffffff',
                    fontWeight: '700',
                    cursor: uploadFileName && !isUploading ? 'pointer' : 'not-allowed',
                    fontSize: '12.5px',
                  }}
                >
                  {isUploading ? (isMr ? 'अपलोड होत आहे...' : 'Uploading...') : (isMr ? 'अपलोड करा' : 'Upload File')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: ADD SINGLE VOTER (नवीन मतदार नोंद) */}
      {/* ============================================================== */}
      {showAddVoterModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowAddVoterModal(false)}
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
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                ➕ {isMr ? 'नवीन मतदाराची नोंद करा' : 'Add Single Voter'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddVoterModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddVoterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  {isMr ? 'मतदार ओळखपत्र क्र. (EPIC) *' : 'EPIC No. *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. MT/44/282/123456"
                  value={newVoter.epic_no}
                  onChange={(e) => setNewVoter({ ...newVoter, epic_no: e.target.value.toUpperCase() })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    {isMr ? 'मतदाराचे नाव (मराठी) *' : 'Voter Name (Marathi) *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. महेश विष्णू पाटील"
                    value={newVoter.name_mr}
                    onChange={(e) => setNewVoter({ ...newVoter, name_mr: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    {isMr ? 'नाव (English)' : 'Name (English)'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mahesh Vishnu Patil"
                    value={newVoter.name_en}
                    onChange={(e) => setNewVoter({ ...newVoter, name_en: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    {isMr ? 'वय' : 'Age'}
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={120}
                    value={newVoter.age}
                    onChange={(e) => setNewVoter({ ...newVoter, age: Number(e.target.value) })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    {isMr ? 'लिंग' : 'Gender'}
                  </label>
                  <select
                    value={newVoter.gender}
                    onChange={(e) => setNewVoter({ ...newVoter, gender: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="male">{isMr ? 'पुरुष' : 'Male'}</option>
                    <option value="female">{isMr ? 'महिला' : 'Female'}</option>
                    <option value="other">{isMr ? 'इतर (Other)' : 'Other'}</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    {isMr ? 'घर क्रमांक' : 'House No.'}
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. ४२/अ"
                    value={newVoter.house_no}
                    onChange={(e) => setNewVoter({ ...newVoter, house_no: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    {isMr ? 'जिल्हा' : 'District'}
                  </label>
                  <select
                    value={newVoter.district}
                    onChange={(e) => {
                      const d = e.target.value;
                      const talukas = MASTER_GEOGRAPHY[d] ? Object.keys(MASTER_GEOGRAPHY[d]) : ['मिरज'];
                      const firstTal = talukas[0] || '';
                      const villages = (firstTal && MASTER_GEOGRAPHY[d]?.[firstTal]) ? MASTER_GEOGRAPHY[d][firstTal] : ['माधवनगर'];
                      setNewVoter({
                        ...newVoter,
                        district: d,
                        taluka: firstTal,
                        village: villages[0] || '',
                      });
                    }}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    {availableDistricts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    {isMr ? 'तालुका' : 'Taluka'}
                  </label>
                  <select
                    value={newVoter.taluka}
                    onChange={(e) => {
                      const t = e.target.value;
                      const villages = (t && MASTER_GEOGRAPHY[newVoter.district]?.[t]) ? MASTER_GEOGRAPHY[newVoter.district][t] : ['माधवनगर'];
                      setNewVoter({
                        ...newVoter,
                        taluka: t,
                        village: villages[0] || '',
                      });
                    }}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    {newVoterTalukas.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    {isMr ? 'गाव' : 'Village'}
                  </label>
                  <select
                    value={newVoter.village}
                    onChange={(e) => setNewVoter({ ...newVoter, village: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    {newVoterVillages.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    {isMr ? 'शहर' : 'City'}
                  </label>
                  <input
                    type="text"
                    value={newVoter.city || ''}
                    placeholder="उदा. सांगली शहर"
                    onChange={(e) => setNewVoter({ ...newVoter, city: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    {isMr ? 'परिसर / प्रभाग' : 'Area / Ward'}
                  </label>
                  <input
                    type="text"
                    value={newVoter.prabhag || ''}
                    placeholder="उदा. प्रभाग क्र. १ / स्टेशन परिसर"
                    onChange={(e) => setNewVoter({ ...newVoter, prabhag: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    {isMr ? 'बूथ क्र.' : 'Booth No.'}
                  </label>
                  <select
                    value={newVoter.booth_no}
                    onChange={(e) => setNewVoter({ ...newVoter, booth_no: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '13px', background: '#ffffff', fontWeight: '600' }}
                  >
                    {newVoterBooths.map((b) => (
                      <option key={b} value={b}>
                        {isMr ? `बूथ क्रमांक ${b}` : `Booth No. ${b}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddVoterModal(false)}
                  style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: '600', cursor: 'pointer', fontSize: '12.5px' }}
                >
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#1e40af', color: '#ffffff', fontWeight: '700', cursor: 'pointer', fontSize: '12.5px' }}
                >
                  {isMr ? 'मतदार सेव्ह करा' : 'Save Voter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: VOTER FULL DETAILS VIEW (तपशील) */}
      {/* ============================================================== */}
      {selectedVoter && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setSelectedVoter(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  {selectedVoter.gender === 'male' ? '👨' : selectedVoter.gender === 'female' ? '👩' : '⚧️'}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                    {selectedVoter.name_mr}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{selectedVoter.name_en}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVoter(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', display: 'block' }}>ओळखपत्र क्र. (EPIC)</span>
                <span style={{ fontWeight: '800', color: '#1e40af', fontFamily: 'monospace' }}>{selectedVoter.epic_no}</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', display: 'block' }}>जात / प्रवर्ग (Caste)</span>
                <span style={{ fontWeight: '800', color: '#b45309' }}>🏷️ {selectedVoter.caste || getVoterCaste(selectedVoter)}</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', display: 'block' }}>वय व लिंग</span>
                <span style={{ fontWeight: '700', color: '#334155' }}>{selectedVoter.age} वर्षे • {selectedVoter.gender === 'male' ? 'पुरुष' : selectedVoter.gender === 'female' ? 'महिला' : 'इतर'}</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', display: 'block' }}>गाव व घर क्र.</span>
                <span style={{ fontWeight: '700', color: '#047857' }}>{selectedVoter.village} (घर क्र. {selectedVoter.house_no || '—'})</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', display: 'block' }}>शहर व परिसर/प्रभाग</span>
                <span style={{ fontWeight: '700', color: '#0891b2' }}>{selectedVoter.city || '—'} • {selectedVoter.prabhag || '—'}</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', display: 'block' }}>तालुका व जिल्हा</span>
                <span style={{ fontWeight: '700', color: '#1e40af' }}>{selectedVoter.taluka}, {selectedVoter.district}</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', gridColumn: '1 / -1' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', display: 'block' }}>मतदान केंद्र व बूथ</span>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>बूथ क्र. {selectedVoter.booth_no} — {selectedVoter.booth_name}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setSelectedVoter(null)}
                style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#1e40af', color: '#ffffff', fontWeight: '700', cursor: 'pointer', fontSize: '12.5px' }}
              >
                {isMr ? 'बंद करा' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: ADD VILLAGE, POPULATION & VOTERS (MANUAL & PDF UPLOAD) */}
      {/* ============================================================== */}
      {showAddVillageModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => !villageSubmitting && setShowAddVillageModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  🏘️
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                    {isMr ? 'गाव, लोकसंख्या व मतदार नोंदणी' : 'Add Village, Population & Voters'}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {isMr ? 'थेट फॉर्मद्वारे किंवा PDF अहवाल अपलोड करून DB मध्ये जोडा' : 'Manual entry or official PDF report import to database'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !villageSubmitting && setShowAddVillageModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
              <button
                type="button"
                onClick={() => setVillageModalTab('manual')}
                style={{
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: villageModalTab === 'manual' ? '#ffffff' : 'transparent',
                  color: villageModalTab === 'manual' ? '#047857' : '#64748b',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: villageModalTab === 'manual' ? '0 2px 4px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                ✍️ {isMr ? '१. थेट माहिती भरा' : '1. Manual Entry'}
              </button>
              <button
                type="button"
                onClick={() => setVillageModalTab('pdf')}
                style={{
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: villageModalTab === 'pdf' ? '#ffffff' : 'transparent',
                  color: villageModalTab === 'pdf' ? '#047857' : '#64748b',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: villageModalTab === 'pdf' ? '0 2px 4px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                📄 {isMr ? '२. PDF अहवाल अपलोड' : '2. PDF Upload'}
              </button>
            </div>

            {/* TAB 1: MANUAL ENTRY FORM */}
            {villageModalTab === 'manual' ? (
              <form onSubmit={handleSaveVillageManual} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    {isMr ? 'गावाचे नाव (Village Name) *' : 'Village Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isMr ? 'उदा. कवठे एकंद, माधवनगर, बांबवडे' : 'e.g. Kavathe Ekand'}
                    value={villageForm.village_name}
                    onChange={(e) => setVillageForm({ ...villageForm, village_name: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                      {isMr ? 'जिल्हा (District) *' : 'District *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. सांगली"
                      value={villageForm.district}
                      onChange={(e) => setVillageForm({ ...villageForm, district: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                      {isMr ? 'तालुका (Taluka) *' : 'Taluka *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. मिरज, तासगाव"
                      value={villageForm.taluka}
                      onChange={(e) => setVillageForm({ ...villageForm, taluka: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                      {isMr ? 'एकूण लोकसंख्या (Population) *' : 'Total Population *'}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="उदा. 12500"
                      value={villageForm.population}
                      onChange={(e) => setVillageForm({ ...villageForm, population: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#047857', marginBottom: '4px' }}>
                      {isMr ? 'त्यामधील मतदार संख्या (Voters) *' : 'Voters in Population *'}
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="उदा. 8900"
                      value={villageForm.total_voters}
                      onChange={(e) => setVillageForm({ ...villageForm, total_voters: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #a7f3d0', background: '#f0fdf4', fontSize: '13px', boxSizing: 'border-box', fontWeight: '700', color: '#065f46' }}
                    />
                  </div>
                </div>

                {/* Calculation Ratio Badge */}
                {Boolean(villageForm.population && villageForm.total_voters) && (
                  <div style={{ background: '#ecfdf5', padding: '10px 14px', borderRadius: '8px', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
                    <span style={{ color: '#065f46', fontWeight: '600' }}>
                      📊 {isMr ? 'अपेक्षित मतदार प्रमाण:' : 'Voter-to-Population Ratio:'}
                    </span>
                    <span style={{ fontWeight: '800', color: '#047857', background: '#ffffff', padding: '2px 8px', borderRadius: '6px' }}>
                      {Math.round((parseInt(villageForm.total_voters, 10) / parseInt(villageForm.population, 10)) * 100)}% नागरिक मतदार
                    </span>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                    {isMr ? 'गाव कोड (LGD / Census Code - ऐच्छिक)' : 'Village LGD / Census Code (Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. 568120 (नसल्यास सिस्टीम आपोआप तयार करेल)"
                    value={villageForm.village_code}
                    onChange={(e) => setVillageForm({ ...villageForm, village_code: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddVillageModal(false)}
                    style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
                  >
                    {isMr ? 'रद्द करा' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={villageSubmitting}
                    style={{
                      padding: '9px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      color: '#ffffff',
                      fontWeight: '800',
                      cursor: villageSubmitting ? 'not-allowed' : 'pointer',
                      fontSize: '13px',
                      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                    }}
                  >
                    {villageSubmitting ? '...' : isMr ? '💾 डेटाबेसमध्ये सेव्ह करा' : 'Save Village to DB'}
                  </button>
                </div>
              </form>
            ) : (
              /* TAB 2: PDF UPLOAD FORM */
              <form onSubmit={handleSaveVillagePdf} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div
                  style={{
                    border: '2px dashed #059669',
                    borderRadius: '12px',
                    padding: '24px 16px',
                    textAlign: 'center',
                    background: '#f0fdf4',
                    cursor: 'pointer',
                  }}
                  onClick={() => document.getElementById('village_pdf_input')?.click()}
                >
                  <input
                    id="village_pdf_input"
                    type="file"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setVillagePdfFile(e.target.files[0]);
                      }
                    }}
                  />
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
                  <div style={{ fontWeight: '800', fontSize: '14px', color: '#065f46' }}>
                    {villagePdfFile ? villagePdfFile.name : (isMr ? 'येथे अधिकृत PDF अहवाल अपलोड करा' : 'Select Official PDF Report')}
                  </div>
                  <div style={{ fontSize: '12px', color: '#047857', marginTop: '4px' }}>
                    {villagePdfFile
                      ? `${(villagePdfFile.size / 1024).toFixed(1)} KB निवडले`
                      : (isMr ? 'ग्रामपंचायत जनगणना अहवाल किंवा निवडणूक मतदार यादी PDF' : 'Census or Electoral Roll Summary PDF')}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
                    {isMr ? 'गाव व लोकसंख्या तपशील (तपासणी किंवा सुधारणा):' : 'Confirm Village & Population Details:'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '3px' }}>गावाचे नाव *</label>
                      <input
                        type="text"
                        placeholder="उदा. माधवनगर"
                        value={villageForm.village_name}
                        onChange={(e) => setVillageForm({ ...villageForm, village_name: e.target.value })}
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '3px' }}>तालुका</label>
                      <input
                        type="text"
                        value={villageForm.taluka}
                        onChange={(e) => setVillageForm({ ...villageForm, taluka: e.target.value })}
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '3px' }}>एकूण लोकसंख्या</label>
                      <input
                        type="number"
                        placeholder="उदा. 15000"
                        value={villageForm.population}
                        onChange={(e) => setVillageForm({ ...villageForm, population: e.target.value })}
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#047857', marginBottom: '3px' }}>मतदार संख्या</label>
                      <input
                        type="number"
                        placeholder="उदा. 10200"
                        value={villageForm.total_voters}
                        onChange={(e) => setVillageForm({ ...villageForm, total_voters: e.target.value })}
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #a7f3d0', fontSize: '12.5px', boxSizing: 'border-box', fontWeight: '700', color: '#065f46' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddVillageModal(false)}
                    style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
                  >
                    {isMr ? 'रद्द करा' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={villageSubmitting}
                    style={{
                      padding: '9px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      color: '#ffffff',
                      fontWeight: '800',
                      cursor: villageSubmitting ? 'not-allowed' : 'pointer',
                      fontSize: '13px',
                      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                    }}
                  >
                    {villageSubmitting ? '...' : isMr ? '🚀 PDF अपलोड करा व DB मध्ये सेव्ह करा' : 'Upload PDF & Save to DB'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
