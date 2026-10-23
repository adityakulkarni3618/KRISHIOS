export interface SchemeData {
  id: string;
  portalNumber: string;
  shortName: string;
  fullName: {
    en: string;
    mr: string;
    hi: string;
  };
  category: {
    en: string;
    mr: string;
    hi: string;
  };
  sponsor: {
    en: string;
    mr: string;
    hi: string;
  };
  benefitBadge: {
    en: string;
    mr: string;
    hi: string;
  };
  tagline: {
    en: string;
    mr: string;
    hi: string;
  };
  bgImage: string;
  accentColor: string;
  officialPortalUrl: string;
  applicationPortalName: string;
  helplineNumber: string;
  lastVerifiedDate: string;
  quickStats: Array<{
    labelEn: string;
    labelMr: string;
    labelHi: string;
    value: string;
    icon: string;
  }>;
  overview: {
    en: string;
    mr: string;
    hi: string;
  };
  keyBenefits: {
    en: string[];
    mr: string[];
    hi: string[];
  };
  financialSubsidyDetails: {
    subsidyPct: string;
    maxAmount: string;
    disbursementMode: string;
    breakdown: Array<{
      slabEn: string;
      slabMr: string;
      subsidy: string;
      notesEn: string;
      notesMr: string;
    }>;
  };
  eligibilityCriteria: {
    checklist: Array<{
      id: string;
      titleEn: string;
      titleMr: string;
      titleHi: string;
      descriptionEn: string;
      descriptionMr: string;
      descriptionHi: string;
    }>;
    exclusions: {
      en: string[];
      mr: string[];
      hi: string[];
    };
  };
  requiredDocuments: Array<{
    nameEn: string;
    nameMr: string;
    nameHi: string;
    descriptionEn: string;
    descriptionMr: string;
    descriptionHi: string;
    authority: string;
    isMandatory: boolean;
  }>;
  applicationSteps: Array<{
    stepNumber: number;
    titleEn: string;
    titleMr: string;
    titleHi: string;
    descriptionEn: string;
    descriptionMr: string;
    descriptionHi: string;
  }>;
  maharashtraSpecifics: {
    en: string;
    mr: string;
    hi: string;
  };
  faqs: Array<{
    questionEn: string;
    questionMr: string;
    questionHi: string;
    answerEn: string;
    answerMr: string;
    answerHi: string;
  }>;
}

export const SCHEMES_DATA: SchemeData[] = [
  {
    id: "pm-kisan",
    portalNumber: "01",
    shortName: "PM-KISAN",
    fullName: {
      en: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      mr: "पंतप्रधान किसान सन्मान निधी (पीएम-किसान)",
      hi: "प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान)",
    },
    category: {
      en: "Direct Income Support",
      mr: "थेट उत्पन्न साहाय्य",
      hi: "प्रत्यक्ष आय सहायता",
    },
    sponsor: {
      en: "Central Government (100% Funded)",
      mr: "केंद्र सरकार (१००% अनुदानित)",
      hi: "केंद्र सरकार (शत-प्रतिशत वित्तपोषित)",
    },
    benefitBadge: {
      en: "₹6,000 / Year DBT",
      mr: "₹६,००० / वर्ष थेट जमा",
      hi: "₹६,००० / वर्ष प्रत्यक्ष लाभ",
    },
    tagline: {
      en: "Assured direct liquidity transferred straight to cultivator bank accounts every 4 months.",
      mr: "दर चार महिन्यांनी शेतकऱ्यांच्या बँक खात्यात थेट हमी आर्थिक साहाय्य जमा.",
      hi: "हर चार महीने में कृषक परिवारों के बैंक खातों में बिना किसी बिचौलिए के सीधे नकद अंतरण।",
    },
    bgImage: "/hero.jpg",
    accentColor: "#10b981",
    officialPortalUrl: "https://pmkisan.gov.in/",
    applicationPortalName: "PM-KISAN Central DBT Portal",
    helplineNumber: "155261 / 1800-115-526",
    lastVerifiedDate: "2026-10-20",
    quickStats: [
      { labelEn: "Annual Grant", labelMr: "वार्षिक निधी", labelHi: "वार्षिक अनुदान", value: "₹6,000", icon: "💰" },
      { labelEn: "Installments", labelMr: "हप्ते", labelHi: "किश्तें", value: "3 x ₹2,000", icon: "📅" },
      { labelEn: "Payment Mode", labelMr: "जमा पद्धत", labelHi: "भुगतान विधि", value: "Aadhaar DBT", icon: "⚡" },
      { labelEn: "Beneficiaries", labelMr: "लाभार्थी", labelHi: "लाभार्थी", value: "11+ Crore", icon: "👥" },
    ],
    overview: {
      en: "PM-KISAN is a flagship Central Sector scheme with 100% funding from Government of India. It aims to supplement the financial needs of landholding farmers in procuring various inputs to ensure proper crop health and appropriate yields, commensurate with the anticipated farm income.",
      mr: "पंतप्रधान किसान सन्मान निधी ही केंद्र पुरस्कृत योजना असून १००% निधी केंद्र सरकारकडून मिळतो. शेतीची मशागत, बियाणे, खते खरेदी यांसारख्या प्राथमिक गरजांसाठी शेतकरी कुटुंबांना आर्थिक संबल देणे हा या योजनेचा मुख्य उद्देश आहे.",
      hi: "पीएम-किसान भारत सरकार की शत-प्रतिशत वित्तपोषित महत्वाकांक्षी योजना है। इसका मुख्य उद्देश्य भूमिधारक किसान परिवारों को कृषि आदानों (खाद, बीज आदि) की खरीद में आर्थिक संबल प्रदान करना है।",
    },
    keyBenefits: {
      en: [
        "₹6,000 per year transferred in 3 equal tranches of ₹2,000 directly via NPCI Aadhaar Bridge.",
        "Zero middleman intervention — credited directly into beneficiary bank account.",
        "Combined in Maharashtra with Namo Shetkari Mahasanman Nidhi for additional ₹6,000 (total ₹12,000/year).",
        "No restriction on how funds are spent by cultivator families.",
      ],
      mr: [
        "दरवर्षी ₹६,००० निधी तीन समान हप्त्यांमध्ये थेट बँक खात्यात जमा होतो.",
        "मध्यस्थ विरहित पारदर्शक थेट बँक हस्तांतरण (DBT).",
        "महाराष्ट्रात नमो शेतकरी महासन्मान निधीद्वारे अतिरिक्त ₹६,००० मिळून एकूण ₹१२,००० वार्षिक लाभ.",
        "खते, बी-बियाणे व कौटुंबिक गरजा भागवण्यासाठी आर्थिक मदत.",
      ],
      hi: [
        "प्रति वर्ष ₹६,००० की राशि ३ समान किश्तों में सीधे आधार लिंक बैंक खाते में स्थानांतरित।",
        "मध्यस्थों की कोई भूमिका नहीं — पारदर्शी एवं तीव्र भुगतान प्रणाली।",
        "महाराष्ट्र के किसानों को नमो शेतकरी योजना से अतिरिक्त ₹६,००० सहित कुल ₹१२,००० प्रति वर्ष।",
        "कृषि आदानों की समय पर खरीद के लिए तत्काल कार्यशील पूंजी।",
      ],
    },
    financialSubsidyDetails: {
      subsidyPct: "100% Grant",
      maxAmount: "₹6,000 / Year",
      disbursementMode: "Aadhaar-based Direct Benefit Transfer (DBT)",
      breakdown: [
        { slabEn: "Period 1 (April - July)", slabMr: "हप्ता १ (एप्रिल ते जुलै)", subsidy: "₹2,000", notesEn: "Kharif pre-sowing preparation", notesMr: "खरीप पूर्वमशागत व बियाणे खरेदी" },
        { slabEn: "Period 2 (August - November)", slabMr: "हप्ता २ (ऑगस्ट ते नोव्हेंबर)", subsidy: "₹2,000", notesEn: "Mid-season weeding & fertilizer top dressing", notesMr: "तणनियंत्रण व खत व्यवस्थापन" },
        { slabEn: "Period 3 (December - March)", slabMr: "हप्ता ३ (डिसेंबर ते मार्च)", subsidy: "₹2,000", notesEn: "Rabi season inputs & irrigation electricity", notesMr: "रब्बी हंगाम बियाणे व सिंचन" },
      ],
    },
    eligibilityCriteria: {
      checklist: [
        {
          id: "pmk-1",
          titleEn: "Cultivable Land Ownership",
          titleMr: "शेतीजमिनीची मालकी",
          titleHi: "कृषि भूमि का स्वामित्व",
          descriptionEn: "Farmer must possess cultivable agricultural land registered in their name on official state land records (7/12 & 8-A).",
          descriptionMr: "शेतकऱ्याच्या स्वतःच्या नावावर अधिकृत ७/१२ व ८-अ उतारा असणे आवश्यक आहे.",
          descriptionHi: "किसान के नाम पर सरकारी राजस्व अभिलेखों में कृषि भूमि दर्ज होनी चाहिए।",
        },
        {
          id: "pmk-2",
          titleEn: "Aadhaar e-KYC Verification",
          titleMr: "आधार ई-केवायसी पूर्ण असणे",
          titleHi: "आधार ई-केवाईसी पूर्णता",
          descriptionEn: "Mandatory biometric or OTP-based e-KYC must be completed on the official PM-KISAN portal.",
          descriptionMr: "पीएम-किसान पोर्टलवर ओटीपी किंवा बायोमेट्रिकद्वारे ई-केवायसी पूर्ण असणे बंधनकारक आहे.",
          descriptionHi: "पोर्टल पर ओटीपी अथवा बायोमेट्रिक के जरिए ई-केवाईसी पूर्ण होना अनिवार्य है।",
        },
        {
          id: "pmk-3",
          titleEn: "Aadhaar-Seeded Active Bank Account",
          titleMr: "आधार लिंक बँक खाते",
          titleHi: "आधार से जुड़ा सक्रिय बैंक खाता",
          descriptionEn: "Bank account must be NPCI mapped for receiving DBT transactions without blockages.",
          descriptionMr: "बँक खाते आधारशी संलग्न आणि डीबीटी (NPCI) सक्षम असणे आवश्यक आहे.",
          descriptionHi: "बैंक खाता एनपीसीआई मैपर में आधार के साथ प्रत्यक्ष लाभ अंतरण हेतु लिंक होना चाहिए।",
        },
      ],
      exclusions: {
        en: [
          "Institutional landholders and companies.",
          "Former and present holders of constitutional posts, ministers, MPs, MLAs, and municipal mayors.",
          "Serving or retired officers and employees of state/central government and public sector undertakings.",
          "All persons who paid income tax in the last assessment year.",
          "Professionals like doctors, engineers, lawyers, and chartered accountants.",
        ],
        mr: [
          "संस्थात्मक जमीनधारक व कंपन्या.",
          "घटनात्मक पदे भूषवणारे, मंत्री, खासदार, आमदार व महापौर.",
          "केंद्र व राज्य सरकारचे विद्यमान किंवा निवृत्त वर्ग १, २ व ३ अधिकारी.",
          "गेल्या वर्षात आयकर भरलेले सर्व व्यक्ती.",
          "डॉक्टर, वकील, अभियंता व सनदी लेखापाल (सीए) यांसारखे व्यावसायिक.",
        ],
        hi: [
          "संस्थागत भूमि धारक एवं कॉर्पोरेट कंपनियां।",
          "संवैधानिक पदों के वर्तमान या पूर्व धारक, मंत्री, सांसद एवं विधायक।",
          "केंद्र/राज्य सरकार के सेवारत या सेवानिवृत्त अधिकारी व कर्मचारी।",
          "गत मूल्यांकन वर्ष में आयकर का भुगतान करने वाले सभी व्यक्ति।",
          "डॉक्टर, इंजीनियर, वकील एवं चार्टर्ड एकाउंटेंट जैसे पेशेवर।",
        ],
      },
    },
    requiredDocuments: [
      {
        nameEn: "7/12 & 8-A Land Extract",
        nameMr: "७/१२ आणि ८-अ उतारा",
        nameHi: "खसरा / खतौनी भू-अभिलेख",
        descriptionEn: "Digital computerized copy issued by Mahabhulekh demonstrating clear land title.",
        descriptionMr: "महाभूलेखवरून डिजिटल स्वाक्षरी असलेला जमिनीचा ७/१२ व ८-अ उतारा.",
        descriptionHi: "राजस्व विभाग द्वारा जारी कम्प्यूटरीकृत भूमि दस्तावेज।",
        authority: "Maharashtra Revenue Dept / Talathi",
        isMandatory: true,
      },
      {
        nameEn: "Aadhaar Card",
        nameMr: "आधार कार्ड",
        nameHi: "आधार कार्ड",
        descriptionEn: "Aadhaar UID card linked with an active mobile number for authentication.",
        descriptionMr: "मोबाईल नंबरशी लिंक असलेले अधिकृत आधार कार्ड.",
        descriptionHi: "मोबाइल नंबर से लिंक मान्य आधार कार्ड।",
        authority: "UIDAI",
        isMandatory: true,
      },
      {
        nameEn: "Bank Passbook with IFSC",
        nameMr: "बँक पासबुक (IFSC कोडसह)",
        nameHi: "बैंक पासबुक एवं आईएफएससी कोड",
        descriptionEn: "First page showing farmer name, account number, and NPCI status.",
        descriptionMr: "नाव, खाते क्रमांक व आयएफएससी कोड स्पष्ट दिसणारे पासबुक पान.",
        descriptionHi: "खाताधारक का नाम और बैंक शाखा का विवरण दर्शाने वाली पासबुक।",
        authority: "Nationalized / Cooperative / Gramin Bank",
        isMandatory: true,
      },
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        titleEn: "Visit PM-KISAN Portal",
        titleMr: "पीएम-किसान पोर्टल उघडा",
        titleHi: "पीएम-किसान पोर्टल पर जाएं",
        descriptionEn: "Navigate to pmkisan.gov.in and click on 'New Farmer Registration' under Farmers Corner.",
        descriptionMr: "pmkisan.gov.in पोर्टलवर जाऊन 'New Farmer Registration' पर्यायावर क्लिक करा.",
        descriptionHi: "pmkisan.gov.in पर जाएं और 'न्यू फार्मर रजिस्ट्रेशन' विकल्प चुनें।",
      },
      {
        stepNumber: 2,
        titleEn: "Enter Aadhaar & Mobile",
        titleMr: "आधार व मोबाईल नंबर प्रविष्ट करा",
        titleHi: "आधार एवं मोबाइल नंबर दर्ज करें",
        descriptionEn: "Select Rural/Urban Farmer, enter Aadhaar number, state, mobile number, and submit OTP.",
        descriptionMr: "ग्रामीण शेतकरी निवडून आधार क्रमांक आणि मोबाईलवर आलेला ओटीपी प्रविष्ट करा.",
        descriptionHi: "ग्रामीण/शहरी किसान का चयन कर आधार नंबर और प्राप्त ओटीपी भरें।",
      },
      {
        stepNumber: 3,
        titleEn: "Add Land Details (Khata & Survey)",
        titleMr: "जमिनीचा तपशील व गट नंबर भरा",
        titleHi: "भूमि खाता एवं खसरा संख्या दर्ज करें",
        descriptionEn: "Input District, Sub-District, Village, Survey / Khasra number, and land holding area in hectares.",
        descriptionMr: "जिल्हा, तालुका, गाव, सर्व्हे/गट नंबर आणि जमिनीचे क्षेत्रफळ अचूक भरा.",
        descriptionHi: "जिला, तहसील, गांव, खसरा संख्या एवं भूमि का रकबा दर्ज करें।",
      },
      {
        stepNumber: 4,
        titleEn: "Talathi & Nodal Verification",
        titleMr: "तलाठी व कृषी सहाय्यक पडताळणी",
        titleHi: "पटवारी एवं नोडल अधिकारी सत्यापन",
        descriptionEn: "Local revenue authorities verify land ownership records and sanction the application.",
        descriptionMr: "स्थानिक तलाठी आणि कृषी अधिकारी जमिनीच्या नोंदी तपासून अर्जास मान्यता देतात.",
        descriptionHi: "स्थानीय राजस्व अधिकारी भूमि रिकॉर्ड का सत्यापन कर आवेदन स्वीकृत करते हैं।",
      },
      {
        stepNumber: 5,
        titleEn: "Direct DBT Crediting",
        titleMr: "थेट खात्यात अनुदान जमा",
        titleHi: "सीधे खाते में अनुदान अंतरण",
        descriptionEn: "Fund installments are credited every 4 months directly to the bank account.",
        descriptionMr: "दर चार महिन्यांनी ₹२,००० चा हप्ता थेट आधार लिंक खात्यात जमा होतो.",
        descriptionHi: "प्रत्येक चार माह में ₹२,००० की किश्त सीधे बैंक खाते में जमा होती है।",
      },
    ],
    maharashtraSpecifics: {
      en: "Maharashtra farmers enrolled in PM-KISAN automatically receive the State Namo Shetkari Mahasanman Nidhi top-up of ₹6,000/year, making total benefits ₹12,000 annually.",
      mr: "महाराष्ट्रातील पीएम-किसान लाभार्थी शेतकऱ्यांना राज्य शासनाच्या 'नमो शेतकरी महासन्मान निधी' अंतर्गत अतिरिक्त ₹६,००० मिळतात. त्यामुळे शेतकऱ्यांना दरवर्षी एकूण ₹१२,००० लाभ मिळतो.",
      hi: "महाराष्ट्र के पीएम-किसान पंजीकृत किसानों को राज्य सरकार की 'नमो शेतकरी महासम्मान निधि' से अतिरिक्त ₹६,००० का लाभ मिलता है, जिससे कुल वार्षिक सहायता ₹१२,००० हो जाती है।",
    },
    faqs: [
      {
        questionEn: "How do I check my installment status?",
        questionMr: "माझ्या हप्त्याची स्थिती कशी तपासावी?",
        questionHi: "अपनी किश्त की स्थिति कैसे जांचें?",
        answerEn: "Go to pmkisan.gov.in -> 'Know Your Status' and enter your registration number or Aadhaar number to view payment history and e-KYC status.",
        answerMr: "pmkisan.gov.in वरील 'Know Your Status' वर क्लिक करून नोंदणी क्रमांक किंवा आधार टाकून हप्त्याची माहिती पहा.",
        answerHi: "पीएम-किसान पोर्टल पर 'नो योर स्टेटस' में जाकर पंजीकरण अथवा आधार संख्या दर्ज कर स्थिति देख सकते हैं।",
      },
      {
        questionEn: "What if my e-KYC is pending?",
        questionMr: "माझे ई-केवायसी अपूर्ण असल्यास काय करावे?",
        questionHi: "ई-केवाईसी लंबित होने पर क्या करें?",
        answerEn: "You can complete OTP-based e-KYC free of charge on the PM-KISAN portal or visit your nearest CSC Center for biometric authentication.",
        answerMr: "पोर्टलवर मोफत ओटीपी ई-केवायसी करा किंवा जवळच्या सीएससी (आपले सरकार) केंद्रावर जाऊन बायोमेट्रिक प्रमाणीकरण करा.",
        answerHi: "पोर्टल पर निशुल्क ओटीपी से ई-केवाईसी करें अथवा नजदीकी सीएससी केंद्र पर बायोमेट्रिक से पूर्ण करें।",
      },
    ],
  },
  {
    id: "pmfby",
    portalNumber: "02",
    shortName: "PMFBY",
    fullName: {
      en: "Pradhan Mantri Fasal Bima Yojana (1 Rupee Crop Insurance)",
      mr: "पंतप्रधान पीक विमा योजना (१ रुपयात सर्वसमावेशक पीक विमा)",
      hi: "प्रधानमंत्री फसल बीमा योजना (पीएमएफबीवाई)",
    },
    category: {
      en: "Crop Risk & Calamity Insurance",
      mr: "पीक जोखीम व आपत्ती विमा",
      hi: "फसल जोखिम एवं प्राकृतिक आपदा बीमा",
    },
    sponsor: {
      en: "Central & Maharashtra State Government Joint",
      mr: "केंद्र व महाराष्ट्र शासन संयुक्त उपक्रम",
      hi: "केंद्र एवं राज्य सरकार का संयुक्त उपक्रम",
    },
    benefitBadge: {
      en: "Coverage at Just ₹1 Token",
      mr: "केवळ ₹१ टोकनमध्ये पूर्ण विमा",
      hi: "मात्र ₹१ टोकन पर संपूर्ण सुरक्षा",
    },
    tagline: {
      en: "Total yield loss, localized weather calamity, and post-harvest protection for a nominal ₹1.",
      mr: "नैसर्गिक आपत्ती, अवकाळी पाऊस, दुष्काळ व किडीपासून पिकांना केवळ १ रुपयात १००% विमा संरक्षण.",
      hi: "बाढ़, ओलावृष्टि, सूखा और कीट प्रकोप से होने वाले फसल नुकसान पर अभूतपूर्व व्यापक आर्थिक सुरक्षा।",
    },
    bgImage: "/drone_field.jpg",
    accentColor: "#06b6d4",
    officialPortalUrl: "https://pmfby.gov.in/",
    applicationPortalName: "National Crop Insurance Portal & Aaple Sarkar DBT",
    helplineNumber: "14447 (Kisan Call Center / PMFBY Toll-Free)",
    lastVerifiedDate: "2026-10-20",
    quickStats: [
      { labelEn: "Farmer Premium", labelMr: "शेतकरी हप्ता", labelHi: "किसान प्रीमियम", value: "₹1 Token", icon: "🪙" },
      { labelEn: "Max Coverage", labelMr: "कमाल संरक्षण", labelHi: "अधिकतम सुरक्षा", value: "100% Sum Insured", icon: "🛡️" },
      { labelEn: "Claim Window", labelMr: "दावा कालावधी", labelHi: "दावा समयसीमा", value: "72 Hours", icon: "⏱️" },
      { labelEn: "Assessed By", labelMr: "पडताळणी", labelHi: "मूल्यांकन", value: "CCE & Satellite", icon: "🛰️" },
    ],
    overview: {
      en: "PMFBY provides comprehensive insurance coverage against crop damage from non-preventable natural risks from pre-sowing to post-harvest. In Maharashtra, under the revolutionary scheme, the entire farmer premium share is borne by the State Government — farmers pay only ₹1 token.",
      mr: "पंतप्रधान पीक विमा योजनेअंतर्गत नैसर्गिक आपत्ती, दुष्काळ, अतिवृष्टी, कीड व रोगांमुळे होणाऱ्या नुकसानापासून संरक्षण मिळते. महाराष्ट्र शासनाने क्रांतीकारी निर्णय घेत शेतकऱ्यांचा विमा हप्ता स्वतः भरून शेतकऱ्यांना केवळ ₹१ मध्ये विमा उपलब्ध करून दिला आहे.",
      hi: "पीएमएफबीवाई प्राकृतिक आपदाओं से होने वाले फसल नुकसान के खिलाफ संपूर्ण सुरक्षा कवच प्रदान करती है। महाराष्ट्र में किसानों के हिस्से का प्रीमियम राज्य सरकार वहन करती है और किसान को मात्र ₹१ टोकन देना होता है।",
    },
    keyBenefits: {
      en: [
        "Farmer pays only ₹1 per application; remaining premium subsidized by Central and State Governments.",
        "Prevented Sowing/Planting: Up to 25% sum insured if adverse weather prevents sowing.",
        "Mid-season Adversity: Immediate relief on flood, prolonged dry spells, or severe pest attacks.",
        "Post-harvest Losses: Coverage up to 14 days for harvested crops lying in the field to dry against unseasonal rain.",
        "Localized Calamities: Hailstorm, landslide, inundation, cloudburst claims processed within 72h intimation.",
      ],
      mr: [
        "शेतकऱ्याला प्रति अर्ज केवळ ₹१ भरावा लागतो; उर्वरित संपूर्ण प्रीमियम शासन भरते.",
        "पेरणी न झाल्यास २५% पर्यंत विमा भरपाई.",
        "हंगामातील नैसर्गिक आपत्तीत तातडीची २५% अग्रिम भरपाई.",
        "कापणीनंतर शेतात सुकवण्यासाठी ठेवलेल्या पिकाचे अवकाळी पावसाने नुकसान झाल्यास १४ दिवसांपर्यंत संरक्षण.",
        "गारपीट, पूर किंवा ढगफुटी झाल्यास ७२ तासांत ऑनलाइन माहिती दिल्यास वैयक्तिक पंचनामा व भरपाई.",
      ],
      hi: [
        "किसान को मात्र ₹१ टोकन प्रीमियम देना होता है, बाकी पूरा हिस्सा सरकार देती है।",
        "प्रतिकूल मौसम के कारण बुवाई न होने पर बीमा राशि का २५% तक मुआवजा।",
        "मध्य-सत्र प्राकृतिक आपदा आने पर तत्काल अग्रिम राहत राशि।",
        "कटाई के बाद खेत में सूखने रखी फसल के १४ दिनों तक चक्रवात व बेमौसम बारिश से नुकसान पर सुरक्षा।",
        "ओलावृष्टि एवं जलभराव की स्थिति में ७२ घंटे के भीतर सूचना देने पर त्वरित पंचनामा।",
      ],
    },
    financialSubsidyDetails: {
      subsidyPct: "99.9% Gov Subsidized",
      maxAmount: "Crop Scale of Finance (₹40k - ₹1.2L / Ha)",
      disbursementMode: "Direct Bank Transfer post Crop Cutting Experiment / Survey",
      breakdown: [
        { slabEn: "Farmer Contribution", slabMr: "शेतकरी हिस्सा", subsidy: "₹1 Token", notesEn: "Fixed token fee across notified crops in Maharashtra", notesMr: "सर्व अधिसूचित पिकांसाठी निश्चित टोकन शुल्क" },
        { slabEn: "Government Subsidy", slabMr: "शासकीय अनुदान", subsidy: "98% - 99%", notesEn: "Equally shared by State and Union Ministries", notesMr: "केंद्र व राज्य शासनाकडून भरणा" },
        { slabEn: "Claim Settlement", slabMr: "दावा मंजुरी", subsidy: "Up to 100%", notesEn: "Transferred via Aadhaar bridge directly to farmer account", notesMr: "थेट बँक खात्यात जमा" },
      ],
    },
    eligibilityCriteria: {
      checklist: [
        {
          id: "pmf-1",
          titleEn: "Cultivation of Notified Crop",
          titleMr: "अधिसूचित पिकाची लागवड",
          titleHi: "अधिसूचित फसल की खेती",
          descriptionEn: "Farmer must be cultivating an officially notified crop in a notified taluka/revenue circle.",
          descriptionMr: "महसूल मंडळासाठी घोषित अधिसूचित पिकाची लागवड केलेली असावी.",
          descriptionHi: "अधिसूचित राजस्व क्षेत्र में अधिसूचित फसल की वास्तविक बुवाई होनी चाहिए।",
        },
        {
          id: "pmf-2",
          titleEn: "e-Pik Pahani Crop Sowing Record",
          titleMr: "ई-पीक पाहणी नोंदणी",
          titleHi: "ई-पीक पाहनी (फसल गिरदावरी)",
          descriptionEn: "Current season crop entry must be recorded in the state government e-Pik Pahani mobile app.",
          descriptionMr: "महाराष्ट्र शासनाच्या ई-पीक पाहणी मोबाईल ॲपवर चालू हंगामातील पिकाची नोंद असणे आवश्यक.",
          descriptionHi: "चालू सीजन की फसल की डिजिटल प्रविष्टि ई-पीक पाहनी में दर्ज होनी चाहिए।",
        },
      ],
      exclusions: {
        en: [
          "Non-notified crops or cultivation outside designated notified insurance blocks.",
          "Losses due to war, nuclear risks, malicious damage, or preventable farmer negligence.",
        ],
        mr: [
          "अधिसूचित नसलेली पिके किंवा गैर-अधिसूचित क्षेत्रातील लागवड.",
          "शेतकऱ्याचा निष्काळजीपणा किंवा चोरीमुळे झालेले नुकसान.",
        ],
        hi: [
          "गैर-अधिसूचित फसलें या गैर-अधिसूचित क्षेत्र।",
          "लापरवाही अथवा चोरी से हुआ नुकसान।",
        ],
      },
    },
    requiredDocuments: [
      {
        nameEn: "7/12 & 8-A Extract",
        nameMr: "७/१२ आणि ८-अ उतारा",
        nameHi: "७/१२ एवं ८-अ खसरा खतौनी",
        descriptionEn: "Recent digital extract reflecting ownership or tenant declaration.",
        descriptionMr: "डिजिटल स्वाक्षरीचा अद्ययावत ७/१२ उतारा.",
        descriptionHi: "अद्यतन डिजिटल भूमि स्वामित्व दस्तावेज।",
        authority: "Revenue Dept",
        isMandatory: true,
      },
      {
        nameEn: "e-Pik Pahani Sowing Receipt",
        nameMr: "ई-पीक पाहणी पावती",
        nameHi: "ई-पीक पाहनी बुवाई प्रमाण",
        descriptionEn: "Mobile app crop self-attested declaration screenshot or receipt.",
        descriptionMr: "ई-पीक पाहणी ॲपमधील पीक नोंदणीची पावती.",
        descriptionHi: "मोबाइल ऐप से प्राप्त बुवाई पावती।",
        authority: "Govt of Maharashtra",
        isMandatory: true,
      },
      {
        nameEn: "Bank Passbook with Aadhaar Link",
        nameMr: "आधार लिंक बँक पासबुक",
        nameHi: "बैंक पासबुक प्रति",
        descriptionEn: "Clear bank passbook copy for instant claim disbursal.",
        descriptionMr: "बँक खात्याचे तपशील.",
        descriptionHi: "सक्रिय बैंक खाता विवरण।",
        authority: "Bank",
        isMandatory: true,
      },
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        titleEn: "Complete e-Pik Pahani",
        titleMr: "ई-पीक पाहणी नोंदवा",
        titleHi: "ई-पीक पाहनी पूर्ण करें",
        descriptionEn: "Enter crop details and upload geo-tagged photo in the e-Pik Pahani app during sowing.",
        descriptionMr: "पेरणीनंतर ई-पीक पाहणी ॲपवर पिकाची अचूक नोंद करून फोटो अपलोड करा.",
        descriptionHi: "बुवाई के उपरांत ई-पीक पाहनी ऐप में फोटो सहित फसल का विवरण दर्ज करें।",
      },
      {
        stepNumber: 2,
        titleEn: "Apply on MahaDBT / PMFBY",
        titleMr: "महाडीबीटी किंवा पीएमएफबीवाय वर अर्ज करा",
        titleHi: "महाडीबीटी अथवा पीएमएफबीवाय पर आवेदन",
        descriptionEn: "Log in with Aadhaar, select district, circle, crop, and land survey number.",
        descriptionMr: "आधारने लॉगिन करून जिल्हा, महसूल मंडळ, पीक व गट नंबर निवडा.",
        descriptionHi: "आधार लॉगिन के उपरांत जिला, ब्लॉक, फसल एवं खसरा नंबर चुनें।",
      },
      {
        stepNumber: 3,
        titleEn: "Pay ₹1 Online Token",
        titleMr: "केवळ ₹१ टोकन भरा",
        titleHi: "मात्र ₹१ टोकन भुगतान करें",
        descriptionEn: "Complete payment of ₹1 token fee via UPI or net banking.",
        descriptionMr: "युपीआय किंवा नेट बँकिंगद्वारे ₹१ टोकन शुल्क भरा.",
        descriptionHi: "यूपीआई से मात्र ₹१ का प्रतीकात्मक शुल्क जमा करें।",
      },
      {
        stepNumber: 4,
        titleEn: "Intimate Damage within 72h (if Calamity occurs)",
        titleMr: "आपत्ती आल्यास ७२ तासांत पूर्वसूचना द्या",
        titleHi: "आपदा के ७२ घंटे में सूचना दें",
        descriptionEn: "In case of localized storm, flood, or hail, use the Crop Insurance App or call 14447 within 72 hours.",
        descriptionMr: "गारपीट किंवा पूर आल्यास 'Crop Insurance App' वरून ७२ तासांत नुकसानीचा फोटो अपलोड करा.",
        descriptionHi: "प्राकृतिक आपदा की स्थिति में ७२ घंटे के अंदर 'क्रॉप इंश्योरेंस ऐप' से सूचना दर्ज कराएं।",
      },
      {
        stepNumber: 5,
        titleEn: "Automated Claim Settlement",
        titleMr: "थेट खात्यात विमा भरपाई",
        titleHi: "सीधे खाते में क्षतिपूर्ति",
        descriptionEn: "Insurance company deposits approved claims directly via DBT.",
        descriptionMr: "पंचनाम्यानंतर विम्याची रक्कम थेट शेतकर्‍याच्या खात्यात जमा केली जाते.",
        descriptionHi: "सत्यापन उपरांत मुआवजा राशि सीधे बैंक खाते में प्रेषित होती है।",
      },
    ],
    maharashtraSpecifics: {
      en: "Under Maharashtra Government Resolution (GR), farmers pay only ₹1 token fee per crop application, with the State Treasury absorbing the entire remaining premium liability.",
      mr: "महाराष्ट्र शासनाच्या ऐतिहासिक शासन निर्णयानुसार शेतकऱ्यांना प्रति पीक केवळ ₹१ टोकन शुल्क भरावे लागते; उर्वरित संपूर्ण विमा हप्ता राज्य शासन तिजोरीतून भरते.",
      hi: "महाराष्ट्र शासन के ऐतिहासिक निर्णय अनुसार किसानों को प्रति फसल केवल ₹१ टोकन शुल्क देना होता है, शेष समस्त प्रीमियम राज्य सरकार अदा करती है।",
    },
    faqs: [
      {
        questionEn: "How many hours do I have to report localized calamity damage?",
        questionMr: "स्थानिक नैसर्गिक आपत्तीची माहिती किती तासांत द्यावी लागते?",
        questionHi: "आपदा की सूचना कितने समय में देनी होती है?",
        answerEn: "Exactly 72 hours from the occurrence of hail, inundation, or cloudburst using the Crop Insurance App or toll-free number 14447.",
        answerMr: "गारपीट, अतिवृष्टी किंवा पूर आल्यापासून बरोबर ७२ तासांच्या आत ॲपवर किंवा १४४४७ क्रमांकावर तक्रार नोंदवणे बंधनकारक आहे.",
        answerHi: "ओलावृष्टि या जलभराव के ७२ घंटे के भीतर क्रॉप इंश्योरेंस ऐप या टोल फ्री १४४४७ पर सूचना देना अनिवार्य है।",
      },
    ],
  },
  {
    id: "pm-kusum",
    portalNumber: "03",
    shortName: "PM-KUSUM",
    fullName: {
      en: "PM-KUSUM Solar Agriculture Pump Scheme",
      mr: "पीएम-कुसुम सौर कृषी पंप योजना",
      hi: "प्रधानमंत्री कुसुम सौर कृषि पंप योजना",
    },
    category: {
      en: "Solar Energy & Irrigation",
      mr: "सौर ऊर्जा व शाश्वत सिंचन",
      hi: "सौर ऊर्जा एवं सिंचाई",
    },
    sponsor: {
      en: "MNRE Central & Mahavitaran (MSEDCL)",
      mr: "केंद्रीय ऊर्जा मंत्रालय व महावितरण (MSEDCL)",
      hi: "नवीन एवं नवीकरणीय ऊर्जा मंत्रालय व महावितरण",
    },
    benefitBadge: {
      en: "Up to 90% Subsidy",
      mr: "९०% पर्यंत थेट शासकीय अनुदान",
      hi: "९०% तक भारी सब्सिडी",
    },
    tagline: {
      en: "Daytime uninterrupted irrigation with subsidized off-grid & grid-tied solar pumps.",
      mr: "दिवसा हक्काची वीज आणि शाश्वत शेती सिंचनासाठी ९०% अनुदानावर सौर पंप.",
      hi: "दिन के समय निर्बाध सिंचाई और बिजली बिल से पूर्ण मुक्ति हेतु ९०% सरकारी अनुदान पर सोलर पंप।",
    },
    bgImage: "/pm_kusum_solar.jpg",
    accentColor: "#f59e0b",
    officialPortalUrl: "https://pmkusum.mnre.gov.in/",
    applicationPortalName: "Mahavitaran MahaKUSUM Portal",
    helplineNumber: "1800-102-3435 / 1912",
    lastVerifiedDate: "2026-10-20",
    quickStats: [
      { labelEn: "Subsidy Share", labelMr: "शासकीय अनुदान", labelHi: "सब्सिडी हिस्सा", value: "90% - 95%", icon: "☀️" },
      { labelEn: "Farmer Share", labelMr: "शेतकरी हिस्सा", labelHi: "किसान हिस्सा", value: "Only 10% (5% SC/ST)", icon: "🏷️" },
      { labelEn: "Pump Sizes", labelMr: "पंप क्षमता", labelHi: "पंप क्षमता", value: "3 HP, 5 HP, 7.5 HP", icon: "⚙️" },
      { labelEn: "Warranty", labelMr: "हमी / वॉरंटी", labelHi: "वारंटी", value: "5 Years Free AMC", icon: "🔧" },
    ],
    overview: {
      en: "PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan) promotes solar powered agriculture pumps. Farmers get reliable day-time irrigation without recurring electric bills or grid outages, preserving groundwater and boosting cropping intensity.",
      mr: "पीएम-कुसुम योजनेद्वारे शेतकऱ्यांना शेतात सिंचनासाठी सौर कृषी पंप उभारण्यासाठी ९०% ते ९५% पर्यंत अनुदान दिले जाते. यामुळे रात्रीच्या वेळी शेतात जाण्याची भीती नाहीशी होऊन दिवसा हक्काचे सिंचन मिळते.",
      hi: "पीएम-कुसुम योजना के तहत किसानों को दिन में पर्याप्त सिंचाई सुविधा उपलब्ध कराने हेतु सोलर पंप की स्थापना पर भारी अनुदान दिया जाता है, जिससे बिजली बिलों से हमेशा के लिए मुक्ति मिलती है।",
    },
    keyBenefits: {
      en: [
        "Up to 90% capital subsidy (30% Central + 60% State Government subsidy).",
        "SC/ST farmers pay only 5% of pump cost; general category farmers pay only 10%.",
        "Choice of 3 HP (up to 2.5 acres), 5 HP (up to 5 acres), and 7.5 HP (> 5 acres) AC/DC pumps.",
        "5-year comprehensive warranty with remote solar IoT telemetry and anti-theft tracking.",
        "Eliminates dependency on night electricity schedules and high diesel costs.",
      ],
      mr: [
        "९०% ते ९५% पर्यंत शासकीय अनुदान (३०% केंद्र + ६०% राज्य शासन).",
        "अनुसूचित जाती/जमाती प्रवर्गातील शेतकऱ्यांना केवळ ५% तर सर्वसाधारण शेतकऱ्यांना १०% खर्च.",
        "३ एचपी, ५ एचपी आणि ७.५ एचपी क्षमतेचे उत्कृष्ट दर्जाचे डीसी/एसी सोलर पंप.",
        "५ वर्षांसाठी विनामूल्य देखभाल व दुरुस्ती (AMC) आणि ऑनलाइन रिमोट मॉनिटरिंग.",
        "रात्रीच्या वीज पुरवठ्यावर अवलंबून राहण्याची गरज संपते व दिवसा सुरक्षित सिंचन शक्य.",
      ],
      hi: [
        "९०% तक पूंजीगत अनुदान (३०% केंद्र सरकार + ६०% राज्य सरकार)।",
        "एससी/एसटी वर्ग के किसानों के लिए मात्र ५% एवं सामान्य किसानों के लिए १०% अंशदान।",
        "३ एचपी, ५ एचपी एवं ७.५ एचपी के अत्याधुनिक सबमर्सिबल सोलर पंप उपलब्ध।",
        "५ वर्ष की निशुल्क वारंटी, रख-रखाव एवं रिमोट टेलीमेट्री निगरानी सुविधा।",
        "डीजल पंपों के भारी खर्च और रात की बिजली के झंझट से हमेशा के लिए मुक्ति।",
      ],
    },
    financialSubsidyDetails: {
      subsidyPct: "Up to 90%",
      maxAmount: "Up to ₹2,50,000 subsidy per pump",
      disbursementMode: "Direct Vendor Installation on Farmer Share Payment",
      breakdown: [
        { slabEn: "3 HP DC Solar Pump", slabMr: "३ एचपी डीसी सोलर पंप", subsidy: "90% Subsidy", notesEn: "Farmer pays ~₹16,500 - ₹19,000 depending on category", notesMr: "शेतकरी हिस्सा केवळ ₹१६,५०० ते १९,०००" },
        { slabEn: "5 HP DC Solar Pump", slabMr: "५ एचपी डीसी सोलर पंप", subsidy: "90% Subsidy", notesEn: "Farmer pays ~₹25,000 - ₹28,000", notesMr: "शेतकरी हिस्सा केवळ ₹२५,००० ते २८,०००" },
        { slabEn: "7.5 HP Solar Pump", slabMr: "७.५ एचपी सोलर पंप", subsidy: "90% Subsidy", notesEn: "Farmer pays ~₹36,000 - ₹40,000", notesMr: "शेतकरी हिस्सा केवळ ₹३६,००० ते ४०,०००" },
      ],
    },
    eligibilityCriteria: {
      checklist: [
        {
          id: "kusum-1",
          titleEn: "Water Source Availability",
          titleMr: "पाण्याचा खात्रीशीर स्रोत",
          titleHi: "पानी का पक्का स्रोत",
          descriptionEn: "Farmer must possess a functional well, borewell, farm pond, or river water source on their land.",
          descriptionMr: "शेतकऱ्याकडे शेतात विहीर, कूपनलिका (बोअरवेल), शेततळे किंवा कालवा/नदी पाणी स्रोत असणे आवश्यक.",
          descriptionHi: "खेत में कुआं, बोरवेल, खेत तालाब अथवा नहर/नदी का स्थायी जल स्रोत होना चाहिए।",
        },
        {
          id: "kusum-2",
          titleEn: "No Conventional Electric Agri Connection",
          titleMr: "पारंपारिक कृषी वीज जोडणी नसणे",
          titleHi: "पारंपरिक कृषि बिजली कनेक्शन न होना",
          descriptionEn: "Priority is given to off-grid un-electrified farm plots or long-pending MSEDCL demand note applicants.",
          descriptionMr: "ज्या शेतात महावितरणचे पारंपारिक वीज कनेक्शन नाही अशा शेतकऱ्यांना प्राधान्य.",
          descriptionHi: "ऐसे कृषि क्षेत्रों को प्राथमिकता जहाँ पारंपरिक ग्रिड बिजली कनेक्शन उपलब्ध नहीं है।",
        },
      ],
      exclusions: {
        en: [
          "Farmers who have already availed solar pump subsidy under previous state schemes (like Atal Saur Krushi Pump Yojana).",
          "Dry plots with zero perennial water source.",
        ],
        mr: [
          "यापूर्वी अटल सौर कृषी पंप किंवा इतर शासकीय योजनेतून सौर पंप घेतलेले शेतकरी.",
          "पाण्याचा कोणताही स्रोत उपलब्ध नसलेली कोरडवाहू शेती.",
        ],
        hi: [
          "पूर्व में किसी भी सरकारी योजना के तहत सोलर पंप का लाभ ले चुके किसान।",
          "बिना किसी जल स्रोत वाली शुष्क भूमि।",
        ],
      },
    },
    requiredDocuments: [
      {
        nameEn: "7/12 & 8-A Land Extract with Water Source Entry",
        nameMr: "७/१२ उतारा (पाण्याच्या स्रोताच्या नोंदीसह)",
        nameHi: "७/१२ एवं ८-अ भू-अभिलेख (जल स्रोत अंकन)",
        descriptionEn: "Must reflect well / borewell water source in the 'Itar Hakka' or land extract.",
        descriptionMr: "विहीर किंवा बोअरवेलची नोंद असलेला अद्ययावत ७/१२ उतारा.",
        descriptionHi: "कुएं या बोरवेल की प्रविष्टि दर्शाने वाला ७/१२ रिकॉर्ड।",
        authority: "Revenue Dept / Talathi",
        isMandatory: true,
      },
      {
        nameEn: "Aadhaar Card & Photo",
        nameMr: "आधार कार्ड व पासपोर्ट फोटो",
        nameHi: "आधार कार्ड एवं पासपोर्ट फोटो",
        descriptionEn: "Beneficiary identification and biometric matching.",
        descriptionMr: "शेतकऱ्याचे आधार कार्ड.",
        descriptionHi: "पहचान एवं पते का प्रमाण।",
        authority: "UIDAI",
        isMandatory: true,
      },
      {
        nameEn: "Caste Certificate (for SC / ST Beneficiaries)",
        nameMr: "जात प्रमाणपत्र (SC/ST सवलतीसाठी)",
        nameHi: "जाति प्रमाण पत्र (एससी/एसटी वर्ग हेतु)",
        descriptionEn: "Required to claim enhanced 95% subsidy benefit.",
        descriptionMr: "९५% सवलतीसाठी सक्षम अधिकाऱ्याने दिलेले जात प्रमाणपत्र.",
        descriptionHi: "९५% विशेष अनुदान प्राप्त करने हेतु आवश्यक।",
        authority: "Sub-Divisional Officer (SDO)",
        isMandatory: false,
      },
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        titleEn: "Register on Mahavitaran MahaKUSUM Portal",
        titleMr: "महावितरण महाकुसुम पोर्टलवर नोंदणी करा",
        titleHi: "महावितरण पोर्टल पर ऑनलाइन पंजीयन",
        descriptionEn: "Visit mahadiscom.in/solar-mskvy or kusum.mahadiscom.in and register with your mobile number.",
        descriptionMr: "महावितरणच्या सौर कृषी पंप पोर्टलवर जाऊन मोबाईल नंबरने नोंदणी करा.",
        descriptionHi: "महावितरण कुसुम पोर्टल पर मोबाइल नंबर से नया खाता बनाएं।",
      },
      {
        stepNumber: 2,
        titleEn: "Submit Land & Water Source Details",
        titleMr: "जमीन व पाणी स्रोताची माहिती भरा",
        titleHi: "भूमि एवं जल स्रोत विवरण भरें",
        descriptionEn: "Upload 7/12 extract and enter pump HP requirement based on land acreage.",
        descriptionMr: "७/१२ उतारा अपलोड करून जमिनीच्या क्षेत्रफळानुसार पंपाचा अश्वशक्ती (HP) प्रकार निवडा.",
        descriptionHi: "७/१२ दस्तावेज अपलोड करें और भूमि के आकार अनुसार उपयुक्त पंप क्षमता चुनें।",
      },
      {
        stepNumber: 3,
        titleEn: "Field Survey by MSEDCL Inspector",
        titleMr: "महावितरण अधिकाऱ्यांची प्रत्यक्ष पाहणी",
        titleHi: "महावितरण द्वारा स्थलीय सत्यापन",
        descriptionEn: "Technical officer inspects water source yield and GPS coordinates of installation spot.",
        descriptionMr: "महावितरणचे अभियंता शेतात येऊन पाण्याचा स्रोत व जागेचे अक्षांश-रेखांश नोंदवून पडताळणी करतात.",
        descriptionHi: "इंजीनियर द्वारा खेत पर पानी की उपलब्धता एवं सोलर पैनल लगाने की जगह का भौतिक निरीक्षण।",
      },
      {
        stepNumber: 4,
        titleEn: "Pay Farmer Share Token",
        titleMr: "शेतकरी हिस्सा भरा",
        titleHi: "किसान अंशदान ऑनलाइन जमा करें",
        descriptionEn: "Upon demand notice issuance, pay 10% (or 5%) farmer contribution online.",
        descriptionMr: "मंजुरीचे डिमांड नोट आल्यावर १०% शेतकरी हिस्सा ऑनलाइन भरा.",
        descriptionHi: "स्वीकृति उपरांत ऑनलाइन माध्यम से मात्र १०% किसान अंशदान का भुगतान करें।",
      },
      {
        stepNumber: 5,
        titleEn: "Turnkey Installation & Commissioning",
        titleMr: "सोलर पंप उभारणी व लोकार्पण",
        titleHi: "सोलर पंप स्थापना एवं जल प्रवाह",
        descriptionEn: "Empaneled agency delivers solar panels, mounting frame, and pump; commissions water discharge within 30 days.",
        descriptionMr: "मान्यताप्राप्त एजन्सी शेतात सोलर पॅनेल व पंप बसवून पाणी चालू करून देते.",
        descriptionHi: "एजेंसी द्वारा ३० दिनों के भीतर सोलर पैनल, मोटर पंप की स्थापना कर चालू किया जाता है।",
      },
    ],
    maharashtraSpecifics: {
      en: "Maharashtra targets over 500,000 solar agricultural pumps under the Magel Tyala Saur Krishi Pump / Mukhyamantri Saur Krushi Vahini Yojana with direct fast-track sanctions.",
      mr: "महाराष्ट्रात 'मागेल त्याला सौर कृषी पंप योजना' अंतर्गत ५ लाखांहून अधिक शेतकऱ्यांना मिशन मोडवर प्राधान्याने सौर पंप दिले जात आहेत.",
      hi: "महाराष्ट्र में 'मागेल त्याला सौर कृषि पंप' मिशन के तहत रिकॉर्ड समय में ५ लाख से अधिक किसानों को सौर पंप वितरित किए जा रहे हैं।",
    },
    faqs: [
      {
        questionEn: "What happens if a solar panel gets damaged or stolen?",
        questionMr: "सोलर पॅनेल चोरीला गेले किंवा खराब झाले तर काय?",
        questionHi: "सोलर पैनल चोरी या खराब होने पर क्या होगा?",
        answerEn: "All PM-KUSUM installations come with full 5-year insurance coverage and GPS anti-theft telemetry for fast replacement.",
        answerMr: "सर्व सौर पंपांना ५ वर्षांचे सर्वसमावेशक विमा संरक्षण असते. चोरी किंवा नैसर्गिक नुकसान झाल्यास विमा कंपनीकडून मोफत पुनर्स्थापना केली जाते.",
        answerHi: "सभी सोलर पंपों पर ५ वर्ष का व्यापक बीमा होता है, जिससे चोरी या नुकसान पर निशुल्क प्रतिस्थापन मिलता है।",
      },
    ],
  },
  {
    id: "pocra",
    portalNumber: "04",
    shortName: "MahaPoCRA",
    fullName: {
      en: "Nanaji Deshmukh Krishi Sanjivani Yojana (PoCRA)",
      mr: "नानाजी देशमुख कृषी संजीवनी प्रकल्प (पोकरा)",
      hi: "नानाजी देशमुख कृषि संजीवनी परियोजना (पोकरा)",
    },
    category: {
      en: "Climate Resilient Agriculture",
      mr: "हवामान अनुकूल कृषी प्रकल्प",
      hi: "जलवायु अनुकूल कृषि",
    },
    sponsor: {
      en: "Government of Maharashtra & World Bank",
      mr: "महाराष्ट्र शासन व जागतिक बँक",
      hi: "महाराष्ट्र शासन एवं विश्व बैंक",
    },
    benefitBadge: {
      en: "50% to 75% Direct Subsidy",
      mr: "५०% ते ७५% थेट बँक अनुदान",
      hi: "५०% से ७५% तक का भारी अनुदान",
    },
    tagline: {
      en: "Drip irrigation, shade nets, farm ponds, and horticulture for drought-prone Maharashtra villages.",
      mr: "विदर्भ व मराठवाड्यातील ५,१४२ गावांमध्ये ठिबक सिंचन, शेडनेट, शेततळे व फळबागांसाठी भरघोस अनुदान.",
      hi: "सूखाग्रस्त गांवों में सूक्ष्म सिंचाई, शेडनेट हाउस, पॉलीहाउस एवं बागवानी हेतु विश्व बैंक समर्थित अनुदान।",
    },
    bgImage: "/smart_greenhouse.png",
    accentColor: "#84cc16",
    officialPortalUrl: "https://mahapocra.gov.in/",
    applicationPortalName: "MahaPoCRA Direct Benefit Transfer Portal",
    helplineNumber: "022-22163351 / 1800-233-4000",
    lastVerifiedDate: "2026-10-20",
    quickStats: [
      { labelEn: "Target Villages", labelMr: "समाविष्ट गावे", labelHi: "परियोजना गांव", value: "5,142 Villages", icon: "🏡" },
      { labelEn: "Micro-Irrigation Subsidy", labelMr: "ठिबक अनुदान", labelHi: "ड्रिप सब्सिडी", value: "75% (Small Farmers)", icon: "💧" },
      { labelEn: "Shade Net Grant", labelMr: "शेडनेट गृह", labelHi: "शेडनेट हाउस", value: "Up to ₹3.8 Lakh", icon: "🌱" },
      { labelEn: "Project Funding", labelMr: "एकूण निधी", labelHi: "कुल बजट", value: "₹4,000 Crore", icon: "🏛️" },
    ],
    overview: {
      en: "PoCRA is an ambitious initiative by the Government of Maharashtra and World Bank aimed at enhancing climate resilience in agricultural production across 5,142 drought-affected villages across Vidarbha, Marathwada, and parts of Nashik division.",
      mr: "नानाजी देशमुख कृषी संजीवनी प्रकल्प (पोकरा) हा महाराष्ट्र शासन आणि जागतिक बँकेचा संयुक्त प्रकल्प असून विदर्भ व मराठवाड्यातील दुष्काळप्रवण ५,१४२ गावांमध्ये हवामान बदलाशी जुळवून घेणाऱ्या शेती पद्धतींसाठी थेट आर्थिक साहाय्य पुरवतो.",
      hi: "पोकरा महाराष्ट्र सरकार और विश्व बैंक की महत्वाकांक्षी संयुक्त परियोजना है, जिसका उद्देश्य विदर्भ और मराठवाड़ा के ५,१४२ सूखाग्रस्त गांवों में किसानों की आय को मौसम की मार से सुरक्षित करना है।",
    },
    keyBenefits: {
      en: [
        "75% direct bank subsidy on drip and sprinkler irrigation systems for small and marginal farmers.",
        "50% to 75% subsidy on shade net houses, polyhouses, and plastic mulching for protected cultivation.",
        "100% geo-tagged transparent approval process through the dedicated MahaPoCRA mobile app.",
        "Special preference and higher funding allocations for women farmers and SC/ST smallholders.",
        "Full support for community farm ponds, horticulture orchards (mango, pomegranate, sweet orange, custard apple).",
      ],
      mr: [
        "अल्प व अत्यल्प भूधारक शेतकऱ्यांना ठिबक व तुषार सिंचनासाठी तब्बल ७५% थेट अनुदान.",
        "शेडनेट गृह, पॉलीहाउस आणि प्लास्टिक मल्चिंगसाठी ५०% ते ७५% पर्यंत भरघोस आर्थिक मदत.",
        "महापोकरा ॲपद्वारे १००% जिओ-टॅगिंगसह पारदर्शक आणि गतिमान पूर्वसंमती व अनुदान मंजुरी.",
        "महिला शेतकरी आणि मागासवर्गीय शेतकऱ्यांना विशेष प्राधान्य.",
        "शेततळे, फळबाग लागवड (डाळिंब, संत्रा, मोसंबी, सीताफळ) व सेंद्रिय निविष्ठांसाठी व्यापक साहाय्य.",
      ],
      hi: [
        "छोटे एवं सीमांत किसानों के लिए ड्रिप एवं स्प्रिंकलर सूक्ष्म सिंचाई पर ७५% प्रत्यक्ष अनुदान।",
        "शेडनेट हाउस एवं पॉलीहाउस निर्माण पर ५०% से ७५% तक का भारी आर्थिक संबल।",
        "महापोकरा मोबाइल ऐप द्वारा पारदर्शी एवं पूर्णतः डिजिटल जिओ-टैग अनुमोदन प्रक्रिया।",
        "महिला कृषकों एवं अनुसूचित जाति/जनजाति के किसानों को प्राथमिकता व अतिरिक्त लाभ।",
        "सामुदायिक खेत तालाब और उच्च मूल्य वाली बागवानी फसलों के लिए व्यापक सहायता।",
      ],
    },
    financialSubsidyDetails: {
      subsidyPct: "50% to 75%",
      maxAmount: "Up to ₹4,00,000 for Protected Cultivation",
      disbursementMode: "Direct Benefit Transfer (DBT) post Geo-tagged Inspection",
      breakdown: [
        { slabEn: "Drip Irrigation (Small Farmer <= 2 Ha)", slabMr: "ठिबक सिंचन (अल्पभूधारक <= २ हेक्टर)", subsidy: "75% Cost", notesEn: "Credited directly into bank account", notesMr: "थेट बँक खात्यात डीबीटी जमा" },
        { slabEn: "Shade Net House (10 to 20 Guntha)", slabMr: "शेडनेट गृह (१० ते २० गुंठे)", subsidy: "50% of Govt Norm", notesEn: "Approx ₹3.2L - ₹4.0L grant", notesMr: "सुमारे ₹३.२ लाख ते ₹४ लाखांचे अनुदान" },
        { slabEn: "Orchard Fruit Plantation", slabMr: "फळबाग लागवड अनुदान", subsidy: "100% in 3 Years", notesEn: "Spread over 3-year survival milestones", notesMr: "३ वर्षांत झाडे जगवण्याच्या निकषानुसार" },
      ],
    },
    eligibilityCriteria: {
      checklist: [
        {
          id: "pocra-1",
          titleEn: "Resident of 5,142 PoCRA Notified Villages",
          titleMr: "पोकरा अंतर्गत ५,१४२ गावातील रहिवासी",
          titleHi: "परियोजना के ५,१४२ अधिसूचित गांवों का निवासी",
          descriptionEn: "Farmer must own agricultural land within one of the designated 5,142 project villages in 16 districts.",
          descriptionMr: "शेतकऱ्याची शेतजमीन पोकरा प्रकल्पासाठी निवडलेल्या १६ जिल्ह्यांमधील ५,१४२ गावांपैकी एका गावात असावी.",
          descriptionHi: "किसान की कृषि भूमि विदर्भ, मराठवाड़ा के १६ चयनित जिलों के परियोजना गांवों में होनी चाहिए।",
        },
        {
          id: "pocra-2",
          titleEn: "Small & Marginal Farmer Preference",
          titleMr: "अल्प व अत्यल्प भूधारक",
          titleHi: "छोटे एवं सीमांत किसान",
          descriptionEn: "Landholding up to 2 hectares (5 acres) receives peak 75% subsidy assistance.",
          descriptionMr: "२ हेक्टरपर्यंत शेती असणाऱ्या शेतकऱ्यांना सर्वाधिक ७५% अनुदान मिळते.",
          descriptionHi: "२ हेक्टेयर तक की जोत वाले किसानों को अधिकतम ७५% सहायता का प्रावधान।",
        },
      ],
      exclusions: {
        en: ["Farmers located outside the designated 5,142 project villages."],
        mr: ["पोकरा प्रकल्पाच्या अधिसूचित यादीत नसलेली गावे."],
        hi: ["परियोजना के बाहर के गैर-अधिसूचित गांव।"],
      },
    },
    requiredDocuments: [
      {
        nameEn: "7/12 & 8-A Extract",
        nameMr: "७/१२ आणि ८-अ उतारा",
        nameHi: "७/१२ एवं ८-अ खसरा खतौनी",
        descriptionEn: "Must reflect land within a PoCRA notified village.",
        descriptionMr: "पोकरा गावातील शेतजमिनीचा अधिकृत ७/१२.",
        descriptionHi: "परियोजना गांव में स्थित भूमि का प्रमाण।",
        authority: "Revenue Dept",
        isMandatory: true,
      },
      {
        nameEn: "Aadhaar Card & Bank Passbook",
        nameMr: "आधार कार्ड व बँक पासबुक",
        nameHi: "आधार कार्ड एवं बैंक पासबुक",
        descriptionEn: "Mandatory for Aadhaar-linked DBT payouts.",
        descriptionMr: "थेट डीबीटीसाठी आधार व बँक खाते.",
        descriptionHi: "प्रत्यक्ष लाभ अंतरण हेतु बैंक विवरण।",
        authority: "UIDAI / Bank",
        isMandatory: true,
      },
      {
        nameEn: "Quotation / Estimate from Registered Dealer",
        nameMr: "मान्यताप्राप्त विक्रेत्याचे दरपत्रक (Quotation)",
        nameHi: "अधिकृत विक्रेता कोटेशन",
        descriptionEn: "Pro-forma invoice for drip equipment or shade net materials.",
        descriptionMr: "ठिबक किंवा शेडनेट साहित्याचे अधिकृत कोटेशन.",
        descriptionHi: "उपकरणों का अधिकृत जीएसटी कोटेशन।",
        authority: "Registered Vendor",
        isMandatory: true,
      },
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        titleEn: "Download MahaPoCRA App or Visit Portal",
        titleMr: "महापोकरा ॲप डाउनलोड करा",
        titleHi: "महापोकरा ऐप अथवा पोर्टल पर जाएं",
        descriptionEn: "Register using Aadhaar on mahapocra.gov.in or the Android mobile app.",
        descriptionMr: "mahapocra.gov.in वर किंवा महापोकरा ॲपवर आधार क्रमांकाने नोंदणी करा.",
        descriptionHi: "महापोकरा पोर्टल या मोबाइल ऐप पर आधार से पंजीकरण करें।",
      },
      {
        stepNumber: 2,
        titleEn: "Select Desired Component",
        titleMr: "घटक निवडा (ठिबक, शेडनेट, शेततळे)",
        titleHi: "योजना घटक का चयन करें (ड्रिप, शेडनेट आदि)",
        descriptionEn: "Choose component (e.g. Micro Irrigation, Shade Net) and upload pro-forma quotation.",
        descriptionMr: "तुम्हाला हवा असलेला घटक निवडून विक्रेत्याचे कोटेशन अपलोड करा.",
        descriptionHi: "वांछित घटक चुनकर जीएसटी कोटेशन अपलोड करें।",
      },
      {
        stepNumber: 3,
        titleEn: "Gram Sanjivani Samiti Approval",
        titleMr: "ग्राम कृषी संजीवनी समिती मंजुरी",
        titleHi: "ग्राम कृषि संजीवनी समिति अनुमोदन",
        descriptionEn: "Village level committee verifies local credentials and grants prior administrative approval.",
        descriptionMr: "गाव पातळीवरील समिती अर्जाची शहानिशा करून 'पूर्वसंमती' (Prior Sanction) पत्र देते.",
        descriptionHi: "ग्राम स्तर पर आवेदन की जांच उपरांत पूर्व-सहमति पत्र जारी किया जाता है।",
      },
      {
        stepNumber: 4,
        titleEn: "Purchase & Geo-tagged Inspection",
        titleMr: "खरेदी करा व मोका तपासणी (Geo-tag)",
        titleHi: "सामग्री खरीद एवं जिओ-टैग सत्यापन",
        descriptionEn: "Farmer installs equipment and Krishi Sahayak captures geo-tagged photos in app.",
        descriptionMr: "साहित्य बसवल्यानंतर कृषी सहाय्यक शेतात येऊन ॲपद्वारे जिओ-टॅग फोटो काढतात.",
        descriptionHi: "उपकरण स्थापना के बाद कृषि सहायक द्वारा खेत पर जिओ-टैग फोटो ली जाती है।",
      },
      {
        stepNumber: 5,
        titleEn: "Direct DBT Subsidy Crediting",
        titleMr: "थेट खात्यात अनुदान जमा",
        titleHi: "सीधे खाते में अनुदान भुगतान",
        descriptionEn: "Sanctioned subsidy amount is transferred directly to farmer's bank account within 15 days.",
        descriptionMr: "तपासणीनंतर १५ दिवसांच्या आत अनुदानाची रक्कम थेट बँक खात्यात जमा होते.",
        descriptionHi: "सत्यापन के १५ दिनों के भीतर अनुदान राशि सीधे बैंक खाते में जमा होती है।",
      },
    ],
    maharashtraSpecifics: {
      en: "Operates exclusively in 16 districts of Maharashtra (Vidarbha, Marathwada, and parts of Jalgaon/Nashik) across designated World Bank project clusters.",
      mr: "हा प्रकल्प महाराष्ट्रातील १६ जिल्ह्यांमध्ये (विदर्भ, मराठवाडा आणि जळगाव/नाशिकचा भाग) विशेष वेगाने राबवला जात आहे.",
      hi: "यह परियोजना विशेष रूप से महाराष्ट्र के विदर्भ और मराठवाड़ा के सूखा प्रभावित १६ जिलों में संचालित है।",
    },
    faqs: [
      {
        questionEn: "Can I buy drip irrigation before receiving the prior approval letter?",
        questionMr: "पूर्वसंमती पत्र मिळण्यापूर्वी मी ठिबक खरेदी करू शकतो का?",
        questionHi: "क्या पूर्व-सहमति मिलने से पहले सामग्री खरीदी जा सकती है?",
        answerEn: "No. You MUST wait for the digital Prior Sanction (पूर्वसंमती) letter in the app before purchasing materials, otherwise subsidy is rejected.",
        answerMr: "नाही! महापोकरा ॲपमध्ये अधिकृत 'पूर्वसंमती पत्र' मिळाल्याशिवाय खरेदी करू नका; अन्यथा अनुदान नाकारले जाते.",
        answerHi: "कदापि नहीं! पोर्टल पर पूर्व-सहमति पत्र जारी होने के बाद ही खरीद करें, अन्यथा अनुदान देय नहीं होगा।",
      },
    ],
  },
  {
    id: "magel-tyala-shet-tale",
    portalNumber: "05",
    shortName: "Farm Ponds",
    fullName: {
      en: "Magel Tyala Shet Tale (Farm Ponds on Demand)",
      mr: "मागेल त्याला शेततळे योजना",
      hi: "मागेल त्याला शेततळे (मांग पर खेत तालाब योजना)",
    },
    category: {
      en: "Water Harvesting & Drought Protection",
      mr: "जलसंधारण व संरक्षित सिंचन",
      hi: "जल संचयन एवं सूखा सुरक्षा",
    },
    sponsor: {
      en: "Government of Maharashtra (State Scheme)",
      mr: "महाराष्ट्र शासन (राज्य योजना)",
      hi: "महाराष्ट्र शासन (राज्य योजना)",
    },
    benefitBadge: {
      en: "Up to ₹75,000 Subsidy",
      mr: "₹७५,००० पर्यंत थेट अनुदान",
      hi: "₹७५,००० तक का सरकारी अनुदान",
    },
    tagline: {
      en: "Guaranteed farm pond excavation and plastic lining subsidy to drought-proof your harvest.",
      mr: "पावसाचा खंड पडल्यास पिकांना जीवनदान देण्यासाठी शेतात हक्काचे शेततळे खोदण्यासाठी शासकीय अनुदान.",
      hi: "वर्षा की कमी में फसलों को जीवनदान देने हेतु प्लास्टिक-अस्तर युक्त खेत तालाब निर्माण पर सीधा अनुदान।",
    },
    bgImage: "/dribbble_field1.jpg",
    accentColor: "#38bdf8",
    officialPortalUrl: "https://mahadbt.maharashtra.gov.in/",
    applicationPortalName: "MahaDBT Farmer Schemes Portal",
    helplineNumber: "022-49150800 (MahaDBT Helpline)",
    lastVerifiedDate: "2026-10-20",
    quickStats: [
      { labelEn: "Max Subsidy", labelMr: "कमाल अनुदान", labelHi: "अधिकतम अनुदान", value: "₹75,000", icon: "💧" },
      { labelEn: "Min Land Required", labelMr: "किमान जमीन", labelHi: "न्यूनतम भूमि", value: "0.60 Hectare", icon: "📐" },
      { labelEn: "Plastic Lining", labelMr: "प्लॅस्टिक अस्तरीकरण", labelHi: "प्लास्टिक अस्तर", value: "₹1,00,000 Support", icon: "🛡️" },
      { labelEn: "Sanction Mode", labelMr: "मंजुरी", labelHi: "स्वीकृति", value: "Online MahaDBT", icon: "💻" },
    ],
    overview: {
      en: "Magel Tyala Shet Tale is a landmark Maharashtra State Government scheme ensuring that any eligible farmer who requests a farm pond receives administrative approval and financial subsidy. Rainwater stored in the pond provides critical protective irrigation during dry spells.",
      mr: "'मागेल त्याला शेततळे' ही महाराष्ट्र शासनाची अत्यंत लोकप्रिय योजना असून, मागणी करणाऱ्या प्रत्येक पात्र शेतकऱ्याला शेततळे खोदण्यासाठी ₹५०,००० ते ₹७५,००० पर्यंत अनुदान दिले जाते. साठवलेले पाणी पावसाचा खंड पडल्यास पिकांना वाचवण्यासाठी अत्यंत उपयुक्त ठरते.",
      hi: "मागेल त्याला शेततळे महाराष्ट्र सरकार की महत्वाकांक्षी योजना है, जिसके अंतर्गत मांग करने वाले प्रत्येक पात्र किसान को खेत में तालाब निर्माण हेतु ₹७५,००० तक की वित्तीय सहायता प्रदान की जाती है।",
    },
    keyBenefits: {
      en: [
        "Financial subsidy of up to ₹50,000 - ₹75,000 for standard 30m x 30m x 3m farm pond excavation.",
        "Additional subsidy of up to ₹1,00,000 available for 500-micron plastic film lining to prevent seepage.",
        "Guarantees 2 to 3 protective irrigations during critical crop moisture stress periods.",
        "Ideal for supporting micro-irrigation systems like drips and sprinklers in orchards.",
      ],
      mr: [
        "३० x ३० x ३ मीटर आकाराच्या शेततळे खोदकामासाठी ₹५०,००० ते ₹७५,००० पर्यंत अनुदान.",
        "पाणी पाझरून वाया जाऊ नये म्हणून ५०० मायक्रॉन प्लॅस्टिक अस्तरीकरणासाठी अतिरिक्त ₹१,००,००० पर्यंत स्वतंत्र अनुदान.",
        "पावसाच्या लहरीपणात सोयाबीन, कापूस, फळबागांना ऐनवेळी जीवदान देणारी हक्काची सोय.",
        "ठिबक व तुषार सिंचनासाठी हक्काचा पाण्याचा साठा.",
      ],
      hi: [
        "३० x ३० x ३ मीटर आकार के खेत तालाब की खुदाई के लिए ₹५०,००० से ₹७५,००० का अनुदान।",
        "पानी का रिसाव रोकने के लिए प्लास्टिक लाइनिंग हेतु ₹१,००,००० तक की अतिरिक्त सब्सिडी।",
        "सूखे के समय फसलों को २ से ३ बार जीवनरक्षक सिंचाई देने की अचूक व्यवस्था।",
        "बागवानी एवं ड्रिप सिंचाई प्रणालियों के लिए विश्वसनीय जल बैंक।",
      ],
    },
    financialSubsidyDetails: {
      subsidyPct: "Fixed Grant by Pond Size",
      maxAmount: "₹75,000 for Excavation + ₹1,00,000 for Plastic Lining",
      disbursementMode: "DBT directly into bank after GPS measurement",
      breakdown: [
        { slabEn: "30m x 30m x 3m Pond", slabMr: "३० मी x ३० मी x ३ मी शेततळे", subsidy: "₹50,000 - ₹75,000", notesEn: "Depending on ground rock hardness", notesMr: "जमिनीतील माती/खडक प्रकारानुसार" },
        { slabEn: "Plastic Film Lining (500 Micron)", slabMr: "प्लॅस्टिक अस्तरीकरण (५०० मायक्रॉन)", subsidy: "Up to ₹1,00,000", notesEn: "75% subsidy on certified film", notesMr: "प्रमाणित फिल्मवर ७५% पर्यंत अनुदान" },
      ],
    },
    eligibilityCriteria: {
      checklist: [
        {
          id: "pond-1",
          titleEn: "Minimum 0.60 Hectare Cultivable Land",
          titleMr: "किमान ०.६० हेक्टर (१.५ एकर) शेतजमीन",
          titleHi: "न्यूनतम ०.६० हेक्टेयर भूमि",
          descriptionEn: "Farmer must own at least 0.60 hectares of agricultural land in their name.",
          descriptionMr: "स्वतःच्या नावावर किमान ०.६० हेक्टर (१.५ एकर) शेती असणे आवश्यक.",
          descriptionHi: "किसान के नाम पर कम से कम ०.६० हेक्टेयर जमीन होनी चाहिए।",
        },
        {
          id: "pond-2",
          titleEn: "Site Feasibility for Water Inflow",
          titleMr: "पाणी साठवणुकीसाठी योग्य भौगोलिक जागा",
          titleHi: "जल संग्रहण हेतु उपयुक्त ढलान व स्थल",
          descriptionEn: "Selected site must have natural catchment slope to capture surface runoff water.",
          descriptionMr: "पावसाचे वाहून येणारे पाणी शेततळ्यात जमा होण्यासाठी नैसर्गिक उतार असावा.",
          descriptionHi: "वर्षा के अपवाह जल को एकत्रित करने के लिए प्राकृतिक ढलान होनी चाहिए।",
        },
      ],
      exclusions: {
        en: [
          "Farmers who have already constructed a farm pond with government subsidy on the same plot.",
          "Locations classified as steep slope soil erosion zones.",
        ],
        mr: [
          "त्याच गट नंबरवर यापूर्वी शासकीय अनुदानातून शेततळे बांधलेले शेतकरी.",
          "अत्यंत तीव्र उतारावरील धूप होणारी क्षेत्रे.",
        ],
        hi: [
          "उसी खसरा नंबर पर पूर्व में सरकारी अनुदान से तालाब बना चुके किसान।",
        ],
      },
    },
    requiredDocuments: [
      {
        nameEn: "7/12 & 8-A Extract",
        nameMr: "७/१२ आणि ८-अ उतारा",
        nameHi: "७/१२ एवं ८-अ खसरा खतौनी",
        descriptionEn: "Digital land extract demonstrating required acreage.",
        descriptionMr: "जमिनीचा अद्ययावत ७/१२ उतारा.",
        descriptionHi: "भूमि रिकॉर्ड दस्तावेज।",
        authority: "Revenue Dept",
        isMandatory: true,
      },
      {
        nameEn: "Self-Declaration on Land Use",
        nameMr: "स्वयंघोषणा पत्र (हमीपत्र)",
        nameHi: "स्व-घोषणा शपथ पत्र",
        descriptionEn: "Affirmation that farm pond will be used solely for agricultural irrigation.",
        descriptionMr: "शेततळ्यातील पाण्याचा वापर केवळ शेती सिंचनासाठी करण्याचे हमीपत्र.",
        descriptionHi: "कृषि प्रयोजनार्थ तालाब उपयोग का स्व-प्रमाणित घोषणा पत्र।",
        authority: "Self",
        isMandatory: true,
      },
      {
        nameEn: "Aadhaar Card & Bank Details",
        nameMr: "आधार कार्ड व बँक पासबुक",
        nameHi: "आधार कार्ड एवं बैंक पासबुक",
        descriptionEn: "For direct subsidy deposit.",
        descriptionMr: "थेट बँक अनुदानासाठी आवश्यक.",
        descriptionHi: "प्रत्यक्ष लाभ अंतरण हेतु।",
        authority: "UIDAI / Bank",
        isMandatory: true,
      },
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        titleEn: "Apply on MahaDBT Portal",
        titleMr: "महाडीबीटी पोर्टलवर अर्ज करा",
        titleHi: "महाडीबीटी पोर्टल पर आवेदन करें",
        descriptionEn: "Log in to mahadbt.maharashtra.gov.in, choose 'Farmer Schemes' -> 'Irrigation Components' -> 'Farm Pond'.",
        descriptionMr: "महाडीबीटी पोर्टलवर शेतकरी योजनांमध्ये सिंचन घटकांतर्गत 'शेततळे' निवडून अर्ज करा.",
        descriptionHi: "महाडीबीटी पोर्टल पर 'किसान योजना' -> 'सिंचाई घटक' -> 'खेत तालाब' का चयन करें।",
      },
      {
        stepNumber: 2,
        titleEn: "Receive Prior Administrative Sanction (पूर्वसंमती)",
        titleMr: "ऑनलाइन पूर्वसंमती पत्र मिळवा",
        titleHi: "ऑनलाइन पूर्व-सहमति पत्र प्राप्त करें",
        descriptionEn: "Agricultural Officer approves the application and issues digital Prior Sanction letter.",
        descriptionMr: "तालुका कृषी अधिकारी कागदपत्रे तपासून डिजिटल पूर्वसंमती पत्र देतात.",
        descriptionHi: "कृषि अधिकारी द्वारा दस्तावेजों की जांच उपरांत पूर्व-सहमति जारी की जाती है।",
      },
      {
        stepNumber: 3,
        titleEn: "Excavate Pond as per Prescribed Dimensions",
        titleMr: "विहित मापाप्रमाणे शेततळे खोदा",
        titleHi: "निर्धारित माप अनुसार तालाब की खुदाई करें",
        descriptionEn: "Complete pond digging within 75 days of receiving approval letter.",
        descriptionMr: "पूर्वसंमती पत्र मिळाल्यानंतर ७५ दिवसांच्या आत जेसीबी/पोकलेनद्वारे खोदकाम पूर्ण करा.",
        descriptionHi: "स्वीकृति मिलने के ७५ दिनों के भीतर तालाब की खुदाई का कार्य पूरा करें।",
      },
      {
        stepNumber: 4,
        titleEn: "Field Measurement & Geo-tagging",
        titleMr: "कृषी सहाय्यकांकडून मोजणी व जिओ-टॅगिंग",
        titleHi: "कृषि सहायक द्वारा भौतिक माप एवं जिओ-टैगिंग",
        descriptionEn: "Krishi Sahayak verifies length, width, depth with digital GPS instruments.",
        descriptionMr: "कृषी सहाय्यक शेतात येऊन लांबी, रुंदी, खोली मोजून मोबाईल ॲपवर जिओ-टॅग फोटो काढतात.",
        descriptionHi: "कृषि सहायक द्वारा तालाब की लंबाई, चौड़ाई और गहराई की भौतिक जांच की जाती है।",
      },
      {
        stepNumber: 5,
        titleEn: "Subsidy Credited to Bank Account",
        titleMr: "थेट खात्यात अनुदान जमा",
        titleHi: "सीधे बैंक खाते में अनुदान",
        descriptionEn: "Subsidy amount is approved and credited directly via DBT within 21 days.",
        descriptionMr: "मोजणी अहवाल सादर झाल्यावर २१ दिवसांच्या आत अनुदान थेट बँक खात्यात जमा होते.",
        descriptionHi: "रिपोर्ट अनुमोदन के २१ दिनों के भीतर अनुदान राशि बैंक खाते में प्रेषित होती है।",
      },
    ],
    maharashtraSpecifics: {
      en: "State Government gives 100% priority under drought relief packages. Farmers in Vidarbha, Marathwada, and Solapur/Sangli drought belts can obtain speedy processing within 30 days.",
      mr: "महाराष्ट्रात दुष्काळग्रस्त भागासाठी या योजनेला सर्वोच्च प्राधान्य असून विदर्भ, मराठवाडा, सोलापूर, सांगली पट्ट्यातील अर्ज ३० दिवसांत निकाली काढले जातात.",
      hi: "सूखा प्रभावित क्षेत्रों में इस योजना को सर्वोच्च प्राथमिकता दी जाती है और ३० दिनों में स्वीकृति प्रदान की जाती है।",
    },
    faqs: [
      {
        questionEn: "Can I use pond water for drinking or only agriculture?",
        questionMr: "शेततळ्याचे पाणी पिण्यासाठी वापरता येते का?",
        questionHi: "क्या तालाब का पानी पीने के लिए इस्तेमाल किया जा सकता है?",
        answerEn: "Primary use must be for protective crop irrigation. Filtered domestic use is permitted, but industrial extraction is strictly prohibited.",
        answerMr: "प्राथमिक वापर शेती पिकांच्या संरक्षित सिंचनासाठीच असावा; व्यावसायिक वापरास सक्त मनाई आहे.",
        answerHi: "प्राथमिक उपयोग फसलों की जीवनरक्षक सिंचाई के लिए ही होना चाहिए।",
      },
    ],
  },
  {
    id: "soil-health-card",
    portalNumber: "06",
    shortName: "Soil Health Card",
    fullName: {
      en: "Soil Health Card Scheme (SHC)",
      mr: "मृदा आरोग्य पत्रिका योजना",
      hi: "मृदा स्वास्थ्य कार्ड योजना",
    },
    category: {
      en: "Soil Science & Fertilizer Optimization",
      mr: "माती परीक्षण व खत बचत",
      hi: "मृदा परीक्षण एवं उर्वरक संतुलन",
    },
    sponsor: {
      en: "Ministry of Agriculture & Farmers Welfare (GoI)",
      mr: "केंद्रीय कृषी मंत्रालय व महाराष्ट्र शासन",
      hi: "कृषि एवं किसान कल्याण मंत्रालय",
    },
    benefitBadge: {
      en: "100% Free Soil Testing",
      mr: "१००% मोफत माती परीक्षण व सल्ला",
      hi: "शत-प्रतिशत निशुल्क मृदा जांच",
    },
    tagline: {
      en: "Comprehensive 12-parameter lab test with customized crop-specific fertilizer recommendations.",
      mr: "मातीतील १२ पोषण द्रव्यांचे अचूक प्रयोगशाळा परीक्षण आणि गरजेनुसार खतांचा समतोल वापर.",
      hi: "१२ पोषक तत्वों की वैज्ञानिक जांच रिपोर्ट और फसल-वार उर्वरक बचत की सटीक सरकारी सलाह।",
    },
    bgImage: "/soil_lab_card.jpg",
    accentColor: "#a855f7",
    officialPortalUrl: "https://soilhealth.dac.gov.in/",
    applicationPortalName: "National Soil Health Card Portal",
    helplineNumber: "1800-180-1551 (Kisan Call Center)",
    lastVerifiedDate: "2026-10-20",
    quickStats: [
      { labelEn: "Testing Fee", labelMr: "परीक्षण शुल्क", labelHi: "जांच शुल्क", value: "100% Free", icon: "🆓" },
      { labelEn: "Parameters Tested", labelMr: "तपासलेले घटक", labelHi: "जांच घटक", value: "12 Parameters", icon: "🧪" },
      { labelEn: "Validity Period", labelMr: "वैधता कालावधी", labelHi: "वैधता अवधि", value: "3 Years", icon: "📋" },
      { labelEn: "Fertilizer Savings", labelMr: "खत बचत", labelHi: "खाद बचत", value: "Up to 25%", icon: "📉" },
    ],
    overview: {
      en: "The Soil Health Card Scheme provides every cultivator in India with a comprehensive scientific report on the nutrient status of their farm soil across 12 crucial parameters, accompanied by personalized dosage advice for major crops to cut input waste and restore soil vitality.",
      mr: "मृदा आरोग्य पत्रिका योजनेद्वारे शेतकऱ्यांच्या शेतातील मातीचे १२ प्रमुख घटकांवर (पीएच, सेंद्रिय कर्ब, नत्र, स्फुरद, पालाश, गंधक, सूक्ष्मद्रव्ये) मोफत वैज्ञानिक परीक्षण केले जाते. अनावश्यक रासायनिक खतांचा खर्च कमी करून जमिनीचा पोत सुधारणे हा याचा मुख्य उद्देश आहे.",
      hi: "मृदा स्वास्थ्य कार्ड योजना देश के प्रत्येक किसान को उसके खेत की मिट्टी की उर्वरता का वैज्ञानिक ब्योरा उपलब्ध कराती है। इसमें १२ प्रमुख पोषक तत्वों की जांच कर संतुलित खाद उपयोग की सलाह दी जाती है।",
    },
    keyBenefits: {
      en: [
        "Complete laboratory testing across 12 parameters: pH, Electrical Conductivity (EC), Organic Carbon (OC), Nitrogen (N), Phosphorus (P), Potassium (K), Sulphur (S), Zinc (Zn), Iron (Fe), Copper (Cu), Manganese (Mn), and Boron (B).",
        "Reduces wasteful over-fertilization costs by 20% to 25% while boosting crop yield.",
        "Prevents soil degradation and salinity buildup caused by excessive urea usage.",
        "Delivered with precise dosage guidance for chemical fertilizers as well as organic manures (FYM/vermicompost).",
      ],
      mr: [
        "मातीतील १२ घटकांचे परिपूर्ण प्रयोगशाळा परीक्षण: सामू (pH), क्षारता (EC), सेंद्रिय कर्ब (OC), नत्र (N), स्फुरद (P), पालाश (K), गंधक (S), जस्त (Zn), लोह (Fe), तांबे (Cu), मँगेनीज (Mn) व बोरॉन (B).",
        "अनावश्यक रासायनिक खतांचा अतिवापर थांबवून एकरी खत खर्चात २०% ते २५% पर्यंत थेट बचत.",
        "युरियाच्या अतिवापरामुळे नापीक होणाऱ्या जमिनीचे रक्षण आणि सेंद्रिय कर्ब वाढवण्यासाठी शास्त्रीय मार्गदर्शन.",
        "पिकांच्या वाढीच्या प्रत्येक टप्प्यानुसार रासायनिक व सेंद्रिय खतांचे प्रमाण अचूक समजते.",
      ],
      hi: [
        "१२ प्रमुख मानकों की निशुल्क वैज्ञानिक जांच: पीएच, विद्युत चालकता, जैविक कार्बन, नाइट्रोजन, फास्फोरस, पोटाश, सल्फर, जिंक, आयरन, कॉपर, मैंगनीज एवं बोरॉन।",
        "संतुलित खाद उपयोग से प्रति एकड़ खेती की लागत में २०% से २५% की सीधी बचत।",
        "यूरिया के अंधाधुंध उपयोग से मिट्टी की घटती उर्वरा शक्ति की रोकथाम।",
        "रासायनिक खाद के साथ-साथ देशी गोबर खाद व जैविक खादों के उपयोग की स्पष्ट मात्रा।",
      ],
    },
    financialSubsidyDetails: {
      subsidyPct: "100% Free Public Service",
      maxAmount: "Zero Cost to Farmer (Govt bears ~₹300 test cost)",
      disbursementMode: "Physical Card + Digital PDF on National Portal",
      breakdown: [
        { slabEn: "Soil Sampling & Lab Analysis", slabMr: "नमुना संकलन व प्रयोगशाळा तपासणी", subsidy: "100% Free", notesEn: "Conducted by District Agri Soil Testing Labs", notesMr: "जिल्हा माती परीक्षण प्रयोगशाळेमार्फत मोफत" },
        { slabEn: "Card Issuance & Advisory", slabMr: "पत्रिका वितरण व मार्गदर्शन", subsidy: "100% Free", notesEn: "Renewed every 3 years", notesMr: "दर ३ वर्षांनी अद्ययावत कार्ड दिले जाते" },
      ],
    },
    eligibilityCriteria: {
      checklist: [
        {
          id: "shc-1",
          titleEn: "All Landholder Farmers",
          titleMr: "सर्व शेतकरी खातेदार",
          titleHi: "सभी भूमिधारक किसान",
          descriptionEn: "Every operational cultivator holding farm land is eligible for free soil testing in their district.",
          descriptionMr: "शेती असणारा कोणताही शेतकरी आपल्या शेतातील मातीचे मोफत परीक्षण करून घेऊ शकतो.",
          descriptionHi: "कृषि भूमि का कोई भी किसान अपने जिले में निशुल्क मिट्टी जांच करा सकता है।",
        },
      ],
      exclusions: {
        en: ["Non-agricultural commercial or residential plots."],
        mr: ["बिगरशेती, व्यावसायिक किंवा रहिवासी भूखंड."],
        hi: ["गैर-कृषि व्यावसायिक अथवा आवासीय भूमि।"],
      },
    },
    requiredDocuments: [
      {
        nameEn: "Representative Soil Sample (500g)",
        nameMr: "शेतातील प्रातिनिधिक मातीचा नमुना (५०० ग्रॅम)",
        nameHi: "मिट्टी का नमूना (५०० ग्राम)",
        descriptionEn: "Collected in a V-shape 15-20cm deep from 8-10 spots across the plot, mixed, and dried in shade.",
        descriptionMr: "शेतातून 'V' आकाराचे १५-२० सेंमी खड्डे करून ८-१० ठिकाणांहून गोळा केलेली व सावलीत वाळवलेली माती.",
        descriptionHi: "खेत से 'वी' आकार में १५-२० सेमी गहराई से एकत्रित ५०० ग्राम मिट्टी का स्वच्छ नमूना।",
        authority: "Collected by Farmer / Krishi Sahayak",
        isMandatory: true,
      },
      {
        nameEn: "7/12 Extract Copy or Farm Details",
        nameMr: "७/१२ उतारा किंवा गट नंबर माहिती",
        nameHi: "७/१२ खसरा खतौनी प्रति",
        descriptionEn: "Needed to record survey number, previous crops grown, and irrigation status on the sample tag.",
        descriptionMr: "नमुन्यावर शेताचा गट नंबर, आधी घेतलेले पीक व सिंचन प्रकार नोंदवण्यासाठी.",
        descriptionHi: "खसरा नंबर और पूर्व में ली गई फसल की जानकारी दर्ज करने हेतु।",
        authority: "Farmer Record",
        isMandatory: true,
      },
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        titleEn: "Collect Soil Sample in 'V' Shape",
        titleMr: "शेतातून 'V' आकारात मातीचा नमुना घ्या",
        titleHi: "खेत से वैज्ञानिक तरीके से नमूना लें",
        descriptionEn: "Dig 15cm deep V-shaped holes across 8-10 points, take 1-inch slice from sides, mix thoroughly.",
        descriptionMr: "शेतात ८-१० ठिकाणी १५ सेंमी खोल 'V' आकाराचे खड्डे करून कडेची माती काढा आणि एकत्र करून सावलीत वाळवा.",
        descriptionHi: "खेत में ८-१० स्थानों पर 'वी' आकार के गड्ढे बनाकर किनारों से मिट्टी खुरचें और अच्छी तरह मिलाएं।",
      },
      {
        stepNumber: 2,
        titleEn: "Label with Crop & Survey Details",
        titleMr: "नमुन्याला शेताचे लेबल लावा",
        titleHi: "नमूने पर किसान व खेत का लेबल लगाएं",
        descriptionEn: "Pack 500g sample in clean cloth bag with farmer name, village, survey number, and intended crop.",
        descriptionMr: "स्वच्छ पिशवीत ५०० ग्रॅम माती भरून त्यावर नाव, गाव, गट नंबर आणि पुढील पिकाचे नाव लिहा.",
        descriptionHi: "साफ थैली में ५०० ग्राम मिट्टी रखकर किसान का नाम, खसरा नंबर और आगामी फसल का नाम लिखें।",
      },
      {
        stepNumber: 3,
        titleEn: "Submit to Taluka Soil Lab or Krishi Kendra",
        titleMr: "तालुका माती परीक्षण प्रयोगशाळा किंवा कृषी केंद्रात जमा करा",
        titleHi: "मिट्टी जांच प्रयोगशाला अथवा केवीके में जमा करें",
        descriptionEn: "Hand over sample to your nearest Krishi Vigyan Kendra (KVK) or government soil testing laboratory.",
        descriptionMr: "नजीकच्या शासकीय माती परीक्षण प्रयोगशाळा, कृषी विज्ञान केंद्र (KVK) किंवा तालुका कृषी अधिकाऱ्यांकडे जमा करा.",
        descriptionHi: "निकटतम कृषि विज्ञान केंद्र (KVK) या सरकारी मृदा परीक्षण लैब में नमूना जमा करें।",
      },
      {
        stepNumber: 4,
        titleEn: "Laboratory Testing (12 Parameters)",
        titleMr: "प्रयोगशाळेत १२ घटकांची तपासणी",
        titleHi: "लैब में १२ पोषक तत्वों का परीक्षण",
        descriptionEn: "Scientists analyze macronutrients, micronutrients, pH, and organic carbon with spectrophotometers.",
        descriptionMr: "प्रयोगशाळेत तज्ज्ञांद्वारे एनपीके, सूक्ष्मद्रव्ये आणि सेंद्रिय कर्बाची तपासणी केली जाते.",
        descriptionHi: "वैज्ञानिक उपकरणों से एनपीके, जिंक, सल्फर और जैविक कार्बन की सटीक जांच होती है।",
      },
      {
        stepNumber: 5,
        titleEn: "Download Soil Health Card & Advisory",
        titleMr: "मृदा आरोग्य पत्रिका व खत शिफारस डाउनलोड करा",
        titleHi: "मृदा स्वास्थ्य कार्ड एवं खाद सलाह प्राप्त करें",
        descriptionEn: "Access digital report on soilhealth.dac.gov.in and receive physical card through Gram Sevak.",
        descriptionMr: "soilhealth.dac.gov.in वरून थेट पत्रिका डाउनलोड करा आणि त्यानुसार खतांचा समतोल वापर करा.",
        descriptionHi: "पोर्टल से अपना डिजिटल कार्ड डाउनलोड करें और अनुशंसित मात्रा में ही खाद का प्रयोग करें।",
      },
    ],
    maharashtraSpecifics: {
      en: "Maharashtra operates over 180 soil testing laboratories across district headquarters and KVKs, providing computerized fertilizer prescription cards in Marathi.",
      mr: "महाराष्ट्रात सर्व जिल्हा मुख्यालये, कृषी विद्यापीठे आणि केव्हीके मिळून १८० हून अधिक अत्याधुनिक प्रयोगशाळा कार्यरत असून मराठीत खत शिफारस पत्र दिले जाते.",
      hi: "महाराष्ट्र में १८० से अधिक अत्याधुनिक प्रयोगशालाएं सक्रिय हैं जहाँ किसानों को मराठी भाषा में भी कार्ड उपलब्ध कराया जाता है।",
    },
    faqs: [
      {
        questionEn: "How often should I test my farm soil?",
        questionMr: "मातीचे परीक्षण किती दिवसांनी करावे?",
        questionHi: "मिट्टी की जांच कितने समय में करानी चाहिए?",
        answerEn: "Once every 3 years, preferably during summer months (April - May) before the onset of the Kharif monsoon season.",
        answerMr: "दर ३ वर्षांनी एकदा, विशेषतः उन्हाळ्यात (एप्रिल-मे महिन्यात) खरीप हंगाम सुरू होण्यापूर्वी माती परीक्षण करणे सर्वोत्तम असते.",
        answerHi: "हर ३ वर्ष में कम से कम एक बार, विशेषकर खरीफ बुवाई से पूर्व गर्मियों में जांच कराना सर्वश्रेष्ठ रहता है।",
      },
    ],
  },
  {
    id: "kisan-credit-card",
    portalNumber: "07",
    shortName: "Kisan Credit Card (KCC)",
    fullName: {
      en: "Kisan Credit Card (KCC Concessional Crop Loan)",
      mr: "किसान क्रेडिट कार्ड (केसीसी सवलतीचे पीक कर्ज)",
      hi: "किसान क्रेडिट कार्ड (रियायती फसली ऋण योजना)",
    },
    category: {
      en: "Concessional Agricultural Credit",
      mr: "सवलतीचे कृषी कर्ज व पतपुरवठा",
      hi: "रियायती कृषि ऋण एवं साख सुविधा",
    },
    sponsor: {
      en: "Reserve Bank of India, NABARD & Ministry of Finance",
      mr: "आरबीआय, नाबार्ड व केंद्रीय वित्त मंत्रालय",
      hi: "आरबीआई, नाबार्ड एवं वित्त मंत्रालय",
    },
    benefitBadge: {
      en: "Effective 4% Concessional Interest",
      mr: "केवळ ४% सवलतीचा व्याजदर",
      hi: "मात्र ४% प्रभावी ब्याज दर",
    },
    tagline: {
      en: "Revolving crop loan credit line up to ₹3,00,000 without collateral up to ₹1,60,000.",
      mr: "वेळेवर परतफेड केल्यास केवळ ४% व्याजाने ₹३ लाखांपर्यंत सुलभ फिरते पीक कर्ज.",
      hi: "समय पर अदायगी पर मात्र ४% रियायती ब्याज दर पर ₹३ लाख तक की आसान फसली ऋण सुविधा।",
    },
    bgImage: "/farmer_orchard.png",
    accentColor: "#ec4899",
    officialPortalUrl: "https://www.myscheme.gov.in/schemes/kcc",
    applicationPortalName: "Local Bank Branch & JanSamarth National Portal",
    helplineNumber: "1800-180-1111 / 155261",
    lastVerifiedDate: "2026-10-20",
    quickStats: [
      { labelEn: "Effective Rate", labelMr: "सवलतीचा दर", labelHi: "प्रभावी ब्याज दर", value: "4% (with Subvention)", icon: "🏷️" },
      { labelEn: "Limit up to", labelMr: "कमाल मर्यादा", labelHi: "ऋण सीमा", value: "₹3,00,000", icon: "💳" },
      { labelEn: "No Collateral up to", labelMr: "तारण विरहित मर्यादा", labelHi: "बिना बंधक ऋण", value: "₹1,60,000", icon: "🔓" },
      { labelEn: "Card Validity", labelMr: "कार्ड मुदत", labelHi: "कार्ड वैधता", value: "5 Years", icon: "📆" },
    ],
    overview: {
      en: "The Kisan Credit Card (KCC) scheme meets the short-term working capital needs of farmers for crop cultivation, post-harvest expenses, farm asset maintenance, and allied agricultural activities. Under the Interest Subvention Scheme (ISS), punctual farmers receive credit at an unbeatable effective interest rate of just 4% per annum.",
      mr: "किसान क्रेडिट कार्ड (केसीसी) द्वारे शेतकऱ्यांना बियाणे, खते, कीटकनाशके व मजुरीसाठी लागणारे खेळते भांडवल सुलभ व्याजदरावर उपलब्ध होते. वेळेवर परतफेड करणाऱ्या शेतकऱ्यांना ३% व्याज सवलत (Subvention) मिळून निव्वळ ४% दराने कर्ज मिळते.",
      hi: "किसान क्रेडिट कार्ड योजना किसानों को खेती की अल्पकालिक आवश्यकताओं (खाद, बीज, कीटनाशक, डीजल व मजदूरी) की पूर्ति हेतु सुलभ ऋण उपलब्ध कराती है। समय पर ऋण चुकाने वाले किसानों को केवल ४% वार्षिक ब्याज लगता है।",
    },
    keyBenefits: {
      en: [
        "Normal interest of 7% reduced to effective 4% per annum for prompt repayment within 1 year (3% Prompt Repayment Incentive).",
        "Collateral-free credit limit enhanced up to ₹1.60 lakh for small and marginal cultivators.",
        "Revolving cash credit line valid for 5 years with simple annual renewal.",
        "ATM-enabled RuPay Kisan Card for convenient instant cash withdrawals anytime.",
        "Extended to dairy, poultry, fisheries, and allied livestock farmers up to ₹2 lakh limit.",
      ],
      mr: [
        "एका वर्षात वेळेवर कर्ज फेडल्यास ३% प्रोत्साहनपर व्याज सवलत मिळून निव्वळ ४% व्याजदर लागू.",
        "₹१,६०,००० पर्यंतच्या पीक कर्जासाठी कोणतेही तारण किंवा जमीन गहाण ठेवण्याची गरज नाही.",
        "५ वर्षांसाठी फिरती पत मर्यादा (Revolving Credit), दरवर्षी सोपी नूतनीकरण प्रक्रिया.",
        "रुपये किसान डेबिट कार्डद्वारे कोणत्याही एटीएममधून २४ तास थेट रोख रक्कम काढण्याची सोय.",
        "दुग्धव्यवसाय, कुक्कुटपालन आणि मत्स्यपालन करणाऱ्या पशुपालक शेतकऱ्यांनाही ₹२ लाखांपर्यंत लाभ.",
      ],
      hi: [
        "एक वर्ष में समय पर ऋण चुकाने पर ३% अतिरिक्त ब्याज छूट सहित प्रभावी ब्याज दर मात्र ४%।",
        "₹१,६०,००० तक के फसली ऋण पर किसी भी प्रकार के बंधक या गारंटी की आवश्यकता नहीं।",
        "५ वर्ष के लिए स्वीकृत साख सीमा, आसान वार्षिक नवीनीकरण की सुविधा।",
        "रुपे किसान डेबिट कार्ड द्वारा किसी भी एटीएम से तत्काल नकद निकासी।",
        "डेयरी, मुर्गी पालन, बकरी पालन एवं मत्स्य पालकों के लिए भी ₹२ लाख तक के ऋण का प्रावधान।",
      ],
    },
    financialSubsidyDetails: {
      subsidyPct: "3% Interest Subvention (Net 4% Rate)",
      maxAmount: "₹3,00,000 under Interest Subvention Scheme",
      disbursementMode: "RuPay Debit Card / Bank Cash Credit Account",
      breakdown: [
        { slabEn: "Base Agri Loan Rate", slabMr: "मूळ कृषी कर्ज व्याजदर", subsidy: "7% p.a.", notesEn: "Subsidized from commercial 9-11% rates", notesMr: "शासकीय सवलतीचा दर" },
        { slabEn: "Prompt Repayment Incentive", slabMr: "वेळेवर परतफेड प्रोत्साहन सवलत", subsidy: "-3% rebate", notesEn: "Credit credited to account upon timely repayment", notesMr: "वेळेवर भरणा केल्यास खात्यात जमा" },
        { slabEn: "Effective Farmer Cost", slabMr: "शेतकऱ्याला पडणारा निव्वळ दर", subsidy: "4% Net p.a.", notesEn: "Lowest official institutional credit rate in India", notesMr: "भारतातील सर्वात स्वस्त अधिकृत कर्ज" },
      ],
    },
    eligibilityCriteria: {
      checklist: [
        {
          id: "kcc-1",
          titleEn: "All Owner Cultivators & Tenant Farmers",
          titleMr: "जमीन मालक शेतकरी व कुळ/बटाईदार शेतकरी",
          titleHi: "भूमि स्वामी एवं पट्टेदार/बटाईदार किसान",
          descriptionEn: "Owner cultivators, tenant farmers, oral lessees, and sharecroppers are fully eligible.",
          descriptionMr: "स्वतःची शेती असणारे, कुळ शेतकरी आणि बटाईने शेती करणारे सर्व शेतकरी पात्र आहेत.",
          descriptionHi: "स्वयं की भूमि पर खेती करने वाले, बटाईदार एवं पट्टेदार किसान पूर्णतः पात्र हैं।",
        },
        {
          id: "kcc-2",
          titleEn: "Clean Credit Record",
          titleMr: "कर्ज थकबाकी नसणे",
          titleHi: "साख इतिहास निष्कलंक होना",
          descriptionEn: "Farmer must not be a willful defaulter on earlier agricultural credit.",
          descriptionMr: "मागील पीक कर्जाची जाणीवपूर्वक थकबाकी नसलेला शेतकरी असावा.",
          descriptionHi: "पूर्व कृषि ऋणों में चूककर्ता (डिफॉल्टर) न हो।",
        },
      ],
      exclusions: {
        en: ["Willful loan defaulters with non-cleared NPA accounts."],
        mr: ["थकबाकीदार असणारे कर्जदार."],
        hi: ["विलफुल डिफॉल्टर घोषित व्यक्ति।"],
      },
    },
    requiredDocuments: [
      {
        nameEn: "7/12 & 8-A Extract / Land Record",
        nameMr: "७/१२ आणि ८-अ उतारा",
        nameHi: "७/१२ एवं ८-अ खसरा खतौनी",
        descriptionEn: "Reflecting operational land size for fixing Scale of Finance loan limit.",
        descriptionMr: "पिकाच्या मशागत क्षेत्रानुसार पीक कर्ज मर्यादा ठरवण्यासाठी ७/१२.",
        descriptionHi: "फसल अनुसार साख सीमा निर्धारण हेतु भूमि दस्तावेज।",
        authority: "Revenue Dept",
        isMandatory: true,
      },
      {
        nameEn: "Aadhaar Card & PAN Card",
        nameMr: "आधार कार्ड व पॅन कार्ड",
        nameHi: "आधार कार्ड एवं पैन कार्ड",
        descriptionEn: "Mandatory KYC documents for bank account operations.",
        descriptionMr: "बँक केवायसीसाठी आवश्यक.",
        descriptionHi: "बैंक केवाईसी हेतु अनिवार्य पहचान पत्र।",
        authority: "UIDAI / IT Dept",
        isMandatory: true,
      },
      {
        nameEn: "Cropping Pattern Declaration",
        nameMr: "पीक पेरणीचे स्वयंघोषणा पत्र",
        nameHi: "फसल बुवाई घोषणा पत्र",
        descriptionEn: "Proposed crops (e.g. Cotton, Soybean, Sugarcane) for the coming season.",
        descriptionMr: "हंगामात घेणार असलेल्या पिकांचे विवरण.",
        descriptionHi: "आगामी सीजन में बोई जाने वाली फसलों का ब्योरा।",
        authority: "Self",
        isMandatory: true,
      },
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        titleEn: "Approach Local Bank Branch or CSC",
        titleMr: "नजीकच्या बँक शाखेत किंवा सीएससी केंद्रात जा",
        titleHi: "निकटतम बैंक शाखा अथवा सीएससी पर जाएं",
        descriptionEn: "Visit your local District Central Cooperative Bank (DCCB), Gramin Bank, or Public Sector Bank branch.",
        descriptionMr: "जिल्हा मध्यवर्ती बँक (DCCB), ग्रामीण बँक किंवा राष्ट्रीयीकृत बँकेच्या शाखेत जा.",
        descriptionHi: "जिला सहकारी बैंक, ग्रामीण बैंक अथवा राष्ट्रीयकृत बैंक शाखा में संपर्क करें।",
      },
      {
        stepNumber: 2,
        titleEn: "Fill One-Page KCC Application Form",
        titleMr: "एक पानी सोपा केसीसी अर्ज भरा",
        titleHi: "एक पन्ने का आसान केसीसी फॉर्म भरें",
        descriptionEn: "Fill in acreage, village name, crops planned, and attach 7/12 copy.",
        descriptionMr: "जमिनीचे क्षेत्र, गट नंबर व पिकांची माहिती लिहून ७/१२ जोडा.",
        descriptionHi: "भूमि का रकबा, फसल का नाम भरकर दस्तावेज संलग्न करें।",
      },
      {
        stepNumber: 3,
        titleEn: "Scale of Finance Assessment",
        titleMr: "जिल्हा वित्त दरानुसार कर्ज मर्यादा निश्चिती",
        titleHi: "स्केल ऑफ फाइनेंस अनुसार ऋण सीमा तय होना",
        descriptionEn: "Bank calculates maximum permissible limit based on district Scale of Finance (e.g. ₹60,000/ha for Soybean).",
        descriptionMr: "बँक जिल्ह्याच्या दरपत्रकानुसार पिकांच्या क्षेत्रफळावर कर्ज मर्यादा मंजूर करते.",
        descriptionHi: "बैंक द्वारा जिले के आधिकारिक स्केल अनुसार प्रति हेक्टेयर ऋण राशि तय की जाती है।",
      },
      {
        stepNumber: 4,
        titleEn: "Issue of RuPay Kisan Card",
        titleMr: "रुपये किसान डेबिट कार्ड वितरण",
        titleHi: "रुपे किसान एटीएम कार्ड जारी होना",
        descriptionEn: "Bank issues RuPay debit card linked directly to your sanctioned cash credit account.",
        descriptionMr: "बँकेकडून थेट एटीएममध्ये चालणारे रुपे किसान कार्ड दिले जाते.",
        descriptionHi: "बैंक द्वारा एटीएम से निकासी हेतु विशेष रुपे किसान कार्ड दिया जाता है।",
      },
      {
        stepNumber: 5,
        titleEn: "Draw Funds as Needed & Repay on Harvest",
        titleMr: "गरजेनुसार पैसे काढा व कापणीनंतर भरा",
        titleHi: "आवश्यकता अनुसार निकासी करें और फसल बिक्री पर चुकाएं",
        descriptionEn: "Withdraw money whenever purchasing seeds/fertilizer, and repay after mandi harvest sale to maintain 4% interest rate.",
        descriptionMr: "खते बियाणे खरेदीसाठी पैसे काढा आणि शेतमाल विकल्यावर वर्षभरात भरून ४% सवलतीचा फायदा घ्या.",
        descriptionHi: "जरूरत पड़ने पर खाद-बीज के लिए पैसे निकालें और फसल बिकने पर साल के भीतर चुकाकर ४% दर का लाभ लें।",
      },
    ],
    maharashtraSpecifics: {
      en: "Under Maharashtra State Government's Dr. Punjabrao Deshmukh Interest Concession Scheme, farmers repaying crop loans up to ₹3 lakh on time receive an additional 3% state interest subsidy, effectively making crop loans 0% interest for smallholders!",
      mr: "महाराष्ट्रात 'डॉ. पंजाबराव देशमुख व्याज सवलत योजना' अंतर्गत वेळेवर पीक कर्ज फेडणाऱ्या शेतकऱ्यांना राज्य शासनाकडून ३% अतिरिक्त सवलत मिळून ₹३ लाखांपर्यंतचे पीक कर्ज अक्षरशः ०% (शून्य टक्के) व्याजदराने उपलब्ध होते!",
      hi: "महाराष्ट्र में 'डॉ. पंजाबराव देशमुख ब्याज प्रोत्साहन योजना' के तहत समय पर ₹३ लाख तक का फसली ऋण चुकाने पर अतिरिक्त ३% राज्य छूट मिलती है, जिससे ऋण वास्तव में ०% (शून्य प्रतिशत) ब्याज पर उपलब्ध हो जाता है!",
    },
    faqs: [
      {
        questionEn: "Can I get KCC if I don't own land but farm on lease?",
        questionMr: "माझ्या नावावर जमीन नसून बटाईने शेती करत असल्यास केसीसी मिळते का?",
        questionHi: "क्या पट्टेदार किसान को केसीसी ऋण मिल सकता है?",
        answerEn: "Yes! Tenant farmers and sharecroppers can form a Joint Liability Group (JLG) or Self-Help Group (SHG) to access KCC credit up to ₹50,000 per member without collateral.",
        answerMr: "होय! बटाईदार शेतकरी संयुक्त दायित्व गट (JLG) स्थापन करून विनातारण केसीसी पीक कर्ज मिळवू शकतात.",
        answerHi: "हाँ! बटाईदार किसान 'संयुक्त देयता समूह' (JLG) बनाकर बिना किसी बंधक के केसीसी ऋण प्राप्त कर सकते हैं।",
      },
    ],
  },
  {
    id: "smam-mechanization",
    portalNumber: "08",
    shortName: "Agri Mechanization",
    fullName: {
      en: "Sub-Mission on Agricultural Mechanization (SMAM)",
      mr: "कृषी यांत्रिकीकरण उप-अभियान (ट्रॅक्टर व अवजारे अनुदान)",
      hi: "कृषि यंत्रीकरण उप-मिशन (ट्रैक्टर एवं कृषि यंत्र अनुदान)",
    },
    category: {
      en: "Farm Machinery & Technology",
      mr: "शेती अवजारे व आधुनिक यंत्रसामग्री",
      hi: "कृषि यंत्र एवं आधुनिक तकनीक",
    },
    sponsor: {
      en: "Ministry of Agriculture & MahaDBT",
      mr: "केंद्रीय कृषी मंत्रालय व महाराष्ट्र कृषी विभाग",
      hi: "केंद्रीय कृषि मंत्रालय एवं महाराष्ट्र कृषि विभाग",
    },
    benefitBadge: {
      en: "40% to 50% Machinery Grant",
      mr: "४०% ते ५०% थेट ट्रॅक्टर/अवजार अनुदान",
      hi: "४०% से ५०% तक का भारी यंत्र अनुदान",
    },
    tagline: {
      en: "Subsidies for tractors, rotavators, power tillers, drone sprayers, and combine harvesters.",
      mr: "ट्रॅक्टर, रोटाव्हेटर, पॉवर टिलर, पेरणी यंत्रे आणि ड्रोन फवारणी संचासाठी भरघोस शासकीय अनुदान.",
      hi: "ट्रैक्टर, रोटावेटर, पावर टिलर, रीपर और आधुनिक स्प्रे ड्रोन की खरीद पर ५०% तक का सीधा अनुदान।",
    },
    bgImage: "/tractor_hero.png",
    accentColor: "#eab308",
    officialPortalUrl: "https://agrimachinery.nic.in/",
    applicationPortalName: "MahaDBT Krushi Yantrikikaran Portal",
    helplineNumber: "1800-180-1551 / 022-49150800",
    lastVerifiedDate: "2026-10-20",
    quickStats: [
      { labelEn: "Subsidy on Tractors", labelMr: "ट्रॅक्टर अनुदान", labelHi: "ट्रैक्टर सब्सिडी", value: "Up to ₹1,25,000", icon: "🚜" },
      { labelEn: "Implements Subsidy", labelMr: "अवजारे अनुदान", labelHi: "यंत्र अनुदान", value: "Up to 50%", icon: "⚙️" },
      { labelEn: "Drone Subsidy", labelMr: "ड्रोन अनुदान", labelHi: "ड्रोन अनुदान", value: "Up to ₹5,00,000", icon: "🛸" },
      { labelEn: "Selection Mode", labelMr: "निवड पद्धत", labelHi: "चयन प्रक्रिया", value: "MahaDBT Lottery", icon: "🎯" },
    ],
    overview: {
      en: "The Sub-Mission on Agricultural Mechanization (SMAM) helps small and marginal farmers procure modern farm machinery like tractors, power tillers, rotavators, multi-crop seed drills, combine harvesters, and agricultural spraying drones, reducing severe labor shortages and boosting farm productivity.",
      mr: "कृषी यांत्रिकीकरण उप-अभियानांतर्गत शेतकऱ्यांना आधुनिक शेती अवजारे, ट्रॅक्टर, रोटाव्हेटर, पेरणी यंत्रे, कापणी यंत्रे आणि ड्रोन फवारणी संच खरेदी करण्यासाठी ४०% ते ५०% पर्यंत अनुदान दिले जाते. यामुळे मजुरांची टंचाई दूर होऊन वेळेची व पैशाची मोठी बचत होते.",
      hi: "कृषि यंत्रीकरण उप-मिशन छोटे और सीमांत किसानों को ट्रैक्टर, रोटावेटर, कल्टीवेटर, बुवाई मशीन और आधुनिक स्प्रे ड्रोन की खरीद पर ४०% से ५०% तक का सीधा अनुदान प्रदान करता है।",
    },
    keyBenefits: {
      en: [
        "Subsidy of ₹1,00,000 to ₹1,25,000 on new tractors (for women and SC/ST farmers up to 50%).",
        "40% to 50% subsidy on rotary tillers (rotavator), disc harrows, laser land levelers, and power sprayers.",
        "Custom Hiring Center (CHC) setup grant of up to 40% (up to ₹10 Lakhs) for farmer producer groups and rural youth.",
        "Kisan Drone subsidy: up to 50% (max ₹5,00,000) for agriculture graduates and farmer organizations.",
        "Transparent computerized lottery selection on the MahaDBT portal ensures fair access.",
      ],
      mr: [
        "नवीन ट्रॅक्टर खरेदीसाठी ₹१,००,००० ते ₹१,२५,००० पर्यंत थेट शासकीय अनुदान (महिला व मागासवर्गीय शेतकऱ्यांना ५०%).",
        "रोटाव्हेटर, नांगर, पेरणी यंत्र, पॉवर वीडर व फवारणी पंपांवर ४०% ते ५०% पर्यंत अनुदान.",
        "शेतकरी गट व ग्रामीण तरुणांना भाडेतत्त्वावरील अवजार बँक (Custom Hiring Center) उभारण्यासाठी ₹१० लाखांपर्यंत ४०% अनुदान.",
        "शेतीसाठी ड्रोन खरेदीवर ५०% (जास्तीत जास्त ₹५ लाख) पर्यंतचे विशेष अनुदान.",
        "महाडीबीटी संगणकीय सोडत (Lottery) पद्धतीने पारदर्शक लाभार्थी निवड.",
      ],
      hi: [
        "नया ट्रैक्टर खरीदने पर ₹१,००,००० से ₹१,२५,००० तक का अनुदान (महिला व आरक्षित वर्गों को ५०% तक)।",
        "रोटावेटर, रीपर, कल्टीवेटर एवं थ्रेशर पर ४०% से ५०% तक की भारी छूट।",
        "कस्टम हायरिंग सेंटर (यंत्र बैंक) स्थापना हेतु कृषक उत्पादक समूहों को ₹१० लाख तक का अनुदान।",
        "किसान ड्रोन खरीद पर ५०% (अधिकतम ₹५,००,०००) तक की विशेष वित्तीय सहायता।",
        "महाडीबीटी पोर्टल पर कम्प्यूटरीकृत लॉटरी द्वारा पारदर्शी लाभार्थी चयन।",
      ],
    },
    financialSubsidyDetails: {
      subsidyPct: "40% to 50%",
      maxAmount: "₹1.25L (Tractor) / ₹10L (Custom Hiring Center)",
      disbursementMode: "DBT directly to farmer account post invoice verification",
      breakdown: [
        { slabEn: "Tractor (20-40 PTO HP)", slabMr: "ट्रॅक्टर (२० ते ४० पीटीओ एचपी)", subsidy: "₹1,00,000 - ₹1,25,000", notesEn: "40% for general; 50% for SC/ST/women", notesMr: "सर्वसाधारण ४०%, महिला/मागासवर्गीय ५०%" },
        { slabEn: "Rotavator (Rotary Tiller)", slabMr: "रोटाव्हेटर (रोटरी टिलर)", subsidy: "₹34,000 - ₹44,000", notesEn: "Based on working width and tractor HP rating", notesMr: "आकारमानानुसार थेट अनुदान" },
        { slabEn: "Power Tiller (8+ HP)", slabMr: "पॉवर टिलर (८+ एचपी)", subsidy: "₹65,000 - ₹85,000", notesEn: "Ideal for small horticultural farms", notesMr: "फळबागा व भाजीपाल्यासाठी उपयुक्त" },
      ],
    },
    eligibilityCriteria: {
      checklist: [
        {
          id: "smam-1",
          titleEn: "Cultivable Land Record (7/12 & 8-A)",
          titleMr: "स्वतःच्या नावावर शेतजमीन (७/१२)",
          titleHi: "स्वयं के नाम पर कृषि भूमि",
          descriptionEn: "Farmer must possess land in Maharashtra. For tractor subsidy, farmer must not have availed tractor subsidy in previous 10 years.",
          descriptionMr: "शेतकऱ्याच्या नावावर शेती असणे आवश्यक. गेल्या १० वर्षांत ट्रॅक्टर अनुदानाचा लाभ घेतलेला नसावा.",
          descriptionHi: "किसान के नाम पर भूमि हो तथा विगत १० वर्षों में ट्रैक्टर अनुदान न लिया हो।",
        },
        {
          id: "smam-2",
          titleEn: "Valid Driving License (for Tractor applicants)",
          titleMr: "चालक परवाना (ट्रॅक्टरसाठी)",
          titleHi: "वैध ड्राइविंग लाइसेंस (ट्रैक्टर हेतु)",
          descriptionEn: "Valid tractor / motor vehicle driving license or family member declaration.",
          descriptionMr: "ट्रॅक्टर चालवण्याचा परवाना किंवा कुटुंबातील सदस्याचा परवाना.",
          descriptionHi: "ट्रैक्टर चलाने का मान्य ड्राइविंग लाइसेंस।",
        },
      ],
      exclusions: {
        en: [
          "Farmers who have availed subsidy for the same implement within the last 5-10 years.",
          "Purchases made before receiving the official MahaDBT Prior Sanction letter.",
        ],
        mr: [
          "गेल्या ५ ते १० वर्षांत त्याच अवजाराचा शासकीय लाभ घेतलेले शेतकरी.",
          "महाडीबीटीचे पूर्वसंमती पत्र येण्यापूर्वी परस्पर केलेली खरेदी.",
        ],
        hi: [
          "विगत ५-१० वर्षों में उसी यंत्र पर अनुदान ले चुके किसान।",
          "पूर्व-सहमति पत्र मिलने से पूर्व की गई खरीद।",
        ],
      },
    },
    requiredDocuments: [
      {
        nameEn: "7/12 & 8-A Extract",
        nameMr: "७/१२ आणि ८-अ उतारा",
        nameHi: "७/१२ एवं ८-अ खसरा खतौनी",
        descriptionEn: "Land ownership record.",
        descriptionMr: "जमिनीचा अद्ययावत ७/१२ उतारा.",
        descriptionHi: "भूमि स्वामित्व रिकॉर्ड।",
        authority: "Revenue Dept",
        isMandatory: true,
      },
      {
        nameEn: "Aadhaar Card & Bank Passbook",
        nameMr: "आधार कार्ड व बँक पासबुक",
        nameHi: "आधार कार्ड एवं बैंक पासबुक",
        descriptionEn: "For DBT payout verification.",
        descriptionMr: "थेट बँक अनुदानासाठी.",
        descriptionHi: "डीबीटी सत्यापन हेतु।",
        authority: "UIDAI / Bank",
        isMandatory: true,
      },
      {
        nameEn: "GST Invoice & Machine Serial Number",
        nameMr: "अधिकृत जीएसटी बिल व चेसिस नंबर",
        nameHi: "जीएसटी बिल एवं मशीन चेसिस नंबर",
        descriptionEn: "Tax invoice from authorized manufacturer dealer.",
        descriptionMr: "अधिकृत विक्रेत्याकडून घेतलेले पक्के जीएसटी बिल.",
        descriptionHi: "अधिकृत डीलर का टैक्स इनवॉइस।",
        authority: "Authorized Dealer",
        isMandatory: true,
      },
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        titleEn: "Submit Application on MahaDBT Portal",
        titleMr: "महाडीबीटी पोर्टलवर ऑनलाइन अर्ज भरा",
        titleHi: "महाडीबीटी पोर्टल पर ऑनलाइन आवेदन",
        descriptionEn: "Go to mahadbt.maharashtra.gov.in -> 'Agriculture Mechanization' and choose your machinery/implement.",
        descriptionMr: "महाडीबीटी पोर्टलवर कृषी यांत्रिकीकरण घटकांतर्गत हवे असलेले अवजार निवडा.",
        descriptionHi: "महाडीबीटी पर कृषि यंत्रीकरण घटक में अपनी पसंद का यंत्र चुनें।",
      },
      {
        stepNumber: 2,
        titleEn: "Computerized Lottery Selection",
        titleMr: "संगणकीय सोडत (लॉटरी) निवड",
        titleHi: "कम्प्यूटरीकृत लॉटरी चयन",
        descriptionEn: "System conducts lottery and notifies selected farmers via SMS.",
        descriptionMr: "पोर्टलद्वारे पारदर्शक लॉटरी काढली जाते व निवड झाल्यास मोबाईलवर एसएमएस येतो.",
        descriptionHi: "कम्प्यूटर द्वारा लॉटरी निकाली जाती है और चयनित किसानों को एसएमएस भेजा जाता है।",
      },
      {
        stepNumber: 3,
        titleEn: "Upload Quotation & Receive Prior Sanction",
        titleMr: "कोटेशन अपलोड करा व पूर्वसंमती पत्र मिळवा",
        titleHi: "कोटेशन अपलोड करें और पूर्व-सहमति पाएं",
        descriptionEn: "Upload dealer pro-forma invoice; Agricultural Officer issues digital Prior Sanction letter.",
        descriptionMr: "विक्रेत्याचे कोटेशन अपलोड केल्यावर कृषी अधिकारी डिजिटल 'पूर्वसंमती पत्र' देतात.",
        descriptionHi: "डीलर कोटेशन अपलोड करने पर कृषि अधिकारी डिजिटल पूर्व-सहमति पत्र जारी करते हैं।",
      },
      {
        stepNumber: 4,
        titleEn: "Purchase Machine & Physical Verification",
        titleMr: "अवजार खरेदी करा व प्रत्यक्ष पडताळणी",
        titleHi: "यंत्र खरीदें और भौतिक जांच कराएं",
        descriptionEn: "Buy machine from approved dealer, upload GST bill; Krishi Sahayak verifies serial number on spot.",
        descriptionMr: "साहित्य खरेदी करून बिल अपलोड करा; कृषी सहाय्यक शेतात येऊन चेसिस व सिरिअल नंबर तपासतात.",
        descriptionHi: "यंत्र खरीदकर बिल अपलोड करें; अधिकारी मौके पर चेसिस नंबर की जांच करते हैं।",
      },
      {
        stepNumber: 5,
        titleEn: "Direct Subsidy Deposit to Bank Account",
        titleMr: "थेट बँक खात्यात अनुदान जमा",
        titleHi: "सीधे बैंक खाते में अनुदान",
        descriptionEn: "Subsidy amount is sanctioned and transferred directly via DBT to your Aadhaar-linked account.",
        descriptionMr: "पडताळणीनंतर अनुदानाची रक्कम थेट बँक खात्यात जमा होते.",
        descriptionHi: "सत्यापन के उपरांत अनुदान राशि सीधे बैंक खाते में क्रेडिट होती है।",
      },
    ],
    maharashtraSpecifics: {
      en: "Maharashtra processes all machinery applications through the centralized MahaDBT single-window lottery, conducting weekly lotteries during peak seasonal windows.",
      mr: "महाराष्ट्रात सर्व अवजारांचे वाटप 'महाडीबीटी' च्या एकाच छताखाली दर आठवड्याला पारदर्शक संगणकीय सोडत काढून केले जाते.",
      hi: "महाराष्ट्र में सभी कृषि यंत्रों का आवंटन महाडीबीटी पोर्टल की साप्ताहिक लॉटरी प्रणाली से पारदर्शी रूप से किया जाता है।",
    },
    faqs: [
      {
        questionEn: "Can I buy the machine from any local dealer of my choice?",
        questionMr: "मी माझ्या आवडीच्या कोणत्याही स्थानिक विक्रेत्याकडून अवजार खरेदी करू शकतो का?",
        questionHi: "क्या मैं अपनी पसंद के किसी भी डीलर से यंत्र खरीद सकता हूँ?",
        answerEn: "Yes, provided the machine is tested by an authorized central testing institute (like CFMTTI Budni) and the dealer issues a valid GST invoice.",
        answerMr: "होय, मात्र ते अवजार केंद्र सरकारच्या मान्यताप्राप्त प्रयोगशाळेत (उदा. बुदनी) प्रमाणित असावे आणि विक्रेत्याकडे अधिकृत जीएसटी बिल असावे.",
        answerHi: "हाँ, बशर्ते यंत्र सरकारी मान्यताप्राप्त टेस्टिंग लैब से प्रमाणित हो और डीलर मान्य जीएसटी बिल दे।",
      },
    ],
  },
];

export function getSchemeById(id: string): SchemeData | undefined {
  return SCHEMES_DATA.find((s) => s.id === id);
}

export function getAllSchemes(): SchemeData[] {
  return SCHEMES_DATA;
}
