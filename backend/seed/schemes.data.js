const schemes = [

  // ─── 1. PM-KISAN — All India, All Genders ────────────────────────────────────
  {
    schemeCode: 'PMKISAN',
    name: {
      en: 'PM Kisan Samman Nidhi (PM-KISAN)',
      hi: 'प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान)',
      mr: 'प्रधानमंत्री किसान सन्मान निधी',
      ta: 'பிரதமர் கிசான் சம்மான் நிதி',
      kn: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ',
      pa: 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਕਿਸਾਨ ਸਨਮਾਨ ਨਿਧੀ'
    },
    description: {
      en: 'A central government scheme providing income support of ₹6,000 per year to small and marginal farmer families across India in three equal installments directly to bank accounts.',
      hi: 'छोटे और सीमांत किसान परिवारों को प्रति वर्ष ₹6,000 की आय सहायता।',
      mr: 'छोटे शेतकरी कुटुंबांना दरवर्षी ₹6,000 उत्पन्न सहाय्य।',
      ta: 'சிறு விவசாய குடும்பங்களுக்கு ஆண்டுக்கு ₹6,000 வருமான ஆதரவு।',
      kn: 'ಸಣ್ಣ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ವರ್ಷಕ್ಕೆ ₹6,000 ಆದಾಯ ಬೆಂಬಲ.',
      pa: 'ਛੋਟੇ ਕਿਸਾਨ ਪਰਿਵਾਰਾਂ ਨੂੰ ਸਾਲਾਨਾ ₹6,000 ਆਮਦਨ ਸਹਾਇਤਾ।'
    },
    benefits: {
      en: '₹6,000/year in 3 installments of ₹2,000 each directly to bank account.',
      hi: '₹2,000 की 3 किस्तों में ₹6,000/वर्ष बैंक खाते में।',
      mr: '₹2,000 च्या 3 हप्त्यांमध्ये ₹6,000/वर्ष बँक खात्यात।',
      ta: '₹2,000 வீதம் 3 தவணைகளில் ₹6,000/ஆண்டு வங்கி கணக்கில்.',
      kn: '₹2,000 ರ 3 ಕಂತುಗಳಲ್ಲಿ ₹6,000/ವರ್ಷ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ.',
      pa: '₹2,000 ਦੀਆਂ 3 ਕਿਸ਼ਤਾਂ ਵਿੱਚ ₹6,000/ਸਾਲ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ।'
    },
    category: 'farmer',
    eligibility: {
      minAge: 18, maxAge: 120, maxIncome: null,
      allowedStates: ['All'], categories: ['All'],
      allowedGenders: ['All'], occupations: ['farmer'], minEducation: 'none'
    },
    requiredDocuments: ['Aadhaar Card', 'Land ownership documents (Khasra/Khatauni)', 'Bank passbook linked with Aadhaar', 'Mobile number linked to Aadhaar'],
    officialLink: 'https://pmkisan.gov.in', applicationLink: 'https://pmkisan.gov.in/RegistrationForm.aspx',
    ministry: 'Ministry of Agriculture & Farmers Welfare', launchYear: 2019
  },

  // ─── 2. Ayushman Bharat — All India, All Genders ──────────────────────────────
  {
    schemeCode: 'PMJAY',
    name: { en: 'Ayushman Bharat PM-JAY', hi: 'आयुष्मान भारत PM-JAY', mr: 'आयुष्मान भारत PM-JAY', ta: 'ஆயுஷ்மான் பாரத் PM-JAY', kn: 'ಆಯುಷ್ಮಾನ್ ಭಾರತ PM-JAY', pa: 'ਆਯੁਸ਼ਮਾਨ ਭਾਰਤ PM-JAY' },
    description: {
      en: 'World\'s largest government health insurance scheme providing ₹5 lakh per family per year for secondary and tertiary hospitalization at empanelled hospitals.',
      hi: 'प्रति परिवार प्रति वर्ष ₹5 लाख का स्वास्थ्य बीमा।',
      mr: 'प्रति कुटुंब प्रति वर्ष ₹5 लाख आरोग्य विमा।',
      ta: 'குடும்பத்திற்கு ஆண்டுக்கு ₹5 லட்சம் சுகாதார காப்பீடு.',
      kn: 'ಕುಟುಂಬಕ್ಕೆ ವರ್ಷಕ್ಕೆ ₹5 ಲಕ್ಷ ಆರೋಗ್ಯ ವಿಮೆ.',
      pa: 'ਪਰਿਵਾਰ ਨੂੰ ਸਾਲ ਵਿੱਚ ₹5 ਲੱਖ ਸਿਹਤ ਬੀਮਾ।'
    },
    benefits: { en: '₹5 lakh cashless health insurance per family per year at 25,000+ hospitals.', hi: 'प्रति परिवार ₹5 लाख कैशलेस बीमा।', mr: 'प्रति कुटुंब ₹5 लाख कॅशलेस बीमा।', ta: 'குடும்பத்திற்கு ₹5 லட்சம் கேஷ்லெஸ் காப்பீடு.', kn: 'ಕುಟುಂಬಕ್ಕೆ ₹5 ಲಕ್ಷ ಕ್ಯಾಷ್‌ಲೆಸ್ ವಿಮೆ.', pa: 'ਪਰਿਵਾਰ ਨੂੰ ₹5 ਲੱਖ ਕੈਸ਼ਲੈੱਸ ਬੀਮਾ।' },
    category: 'healthcare',
    eligibility: { minAge: 0, maxAge: 120, maxIncome: 200000, allowedStates: ['All'], categories: ['All'], allowedGenders: ['All'], occupations: ['All'], minEducation: 'none' },
    requiredDocuments: ['Aadhaar Card', 'Ration Card / BPL Card', 'Income Certificate', 'Caste Certificate (if applicable)'],
    officialLink: 'https://pmjay.gov.in', ministry: 'Ministry of Health & Family Welfare', launchYear: 2018
  },

  // ─── 3. Sukanya Samriddhi — All India, Female Only ────────────────────────────
  {
    schemeCode: 'SSY',
    name: { en: 'Sukanya Samriddhi Yojana', hi: 'सुकन्या समृद्धि योजना', mr: 'सुकन्या समृद्धी योजना', ta: 'சுகன்யா சம்ருத்தி யோஜனா', kn: 'ಸುಕನ್ಯಾ ಸಮೃದ್ಧಿ ಯೋಜನೆ', pa: 'ਸੁਕੰਨਿਆ ਸਮ੍ਰਿੱਧੀ ਯੋਜਨਾ' },
    description: {
      en: 'A government savings scheme for girl children to ensure their education and marriage expenses. Parents or guardians can open an account for a girl child below 10 years of age.',
      hi: 'बालिकाओं की शिक्षा और विवाह के लिए सरकारी बचत योजना।',
      mr: 'मुलींच्या शिक्षण आणि विवाहासाठी सरकारी बचत योजना।',
      ta: 'பெண் குழந்தைகளின் கல்வி மற்றும் திருமணத்திற்கான அரசு சேமிப்பு திட்டம்.',
      kn: 'ಹೆಣ್ಣು ಮಕ್ಕಳ ಶಿಕ್ಷಣ ಮತ್ತು ವಿವಾಹಕ್ಕಾಗಿ ಸರ್ಕಾರಿ ಉಳಿತಾಯ ಯೋಜನೆ.',
      pa: 'ਕੁੜੀਆਂ ਦੀ ਸਿੱਖਿਆ ਅਤੇ ਵਿਆਹ ਲਈ ਸਰਕਾਰੀ ਬੱਚਤ ਯੋਜਨਾ।'
    },
    benefits: { en: '8.2% annual interest rate (tax-free). Minimum deposit ₹250/year. Maximum ₹1.5 lakh/year. Matures when girl turns 21.', hi: '8.2% वार्षिक ब्याज (कर-मुक्त)। न्यूनतम ₹250/वर्ष।', mr: '8.2% वार्षिक व्याज (करमुक्त)। किमान ₹250/वर्ष।', ta: '8.2% வருடாந்திர வட்டி (வரி-இல்லாத). குறைந்தபட்சம் ₹250/ஆண்டு.', kn: '8.2% ವಾರ್ಷಿಕ ಬಡ್ಡಿ (ತೆರಿಗೆ-ಮುಕ್ತ). ಕನಿಷ್ಠ ₹250/ವರ್ಷ.', pa: '8.2% ਸਾਲਾਨਾ ਵਿਆਜ (ਟੈਕਸ-ਮੁਕਤ). ਘੱਟੋ-ਘੱਟ ₹250/ਸਾਲ।' },
    category: 'women_child',
    eligibility: { minAge: 0, maxAge: 10, maxIncome: null, allowedStates: ['All'], categories: ['All'], allowedGenders: ['female'], occupations: ['All'], minEducation: 'none' },
    requiredDocuments: ['Birth Certificate of girl child', 'Parent/Guardian Aadhaar', 'Parent/Guardian PAN Card', 'Address Proof'],
    officialLink: 'https://www.nsiindia.gov.in', ministry: 'Ministry of Finance', launchYear: 2015
  },

  // ─── 4. Pradhan Mantri Awas Yojana — All India, All Genders ──────────────────
  {
    schemeCode: 'PMAY',
    name: { en: 'Pradhan Mantri Awas Yojana (PMAY)', hi: 'प्रधानमंत्री आवास योजना', mr: 'प्रधानमंत्री आवास योजना', ta: 'பிரதமர் ஆவாஸ் யோஜனா', kn: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಆವಾಸ್ ಯೋಜನೆ', pa: 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਆਵਾਸ ਯੋਜਨਾ' },
    description: { en: 'Housing for All mission aiming to provide affordable housing to the urban and rural poor by 2024. Provides interest subsidy on home loans for economically weaker sections.', hi: 'शहरी और ग्रामीण गरीबों को किफायती आवास प्रदान करने की योजना।', mr: 'शहरी आणि ग्रामीण गरिबांना परवडणारे घर देण्याची योजना.', ta: 'நகர்ப்புற மற்றும் கிராமப்புற ஏழைகளுக்கு மலிவு விலை வீட்டுவசதி திட்டம்.', kn: 'ನಗರ ಮತ್ತು ಗ್ರಾಮೀಣ ಬಡವರಿಗೆ ಕೈಗೆಟುಕುವ ವಸತಿ ಯೋಜನೆ.', pa: 'ਸ਼ਹਿਰੀ ਅਤੇ ਪੇਂਡੂ ਗਰੀਬਾਂ ਨੂੰ ਕਿਫਾਇਤੀ ਘਰ ਦੇਣ ਦੀ ਯੋਜਨਾ।' },
    benefits: { en: 'Interest subsidy of 3–6.5% on home loans. EWS category gets up to ₹2.67 lakh subsidy. Preference to women applicants.', hi: 'गृह ऋण पर 3–6.5% ब्याज सब्सिडी।', mr: 'गृहकर्जावर 3–6.5% व्याज सब्सिडी.', ta: 'வீட்டுக் கடனில் 3–6.5% வட்டி மானியம்.', kn: 'ಗೃಹ ಸಾಲದ ಮೇಲೆ 3–6.5% ಬಡ್ಡಿ ಸಬ್ಸಿಡಿ.', pa: 'ਘਰ ਦੇ ਕਰਜ਼ੇ ਤੇ 3–6.5% ਵਿਆਜ ਸਬਸਿਡੀ।' },
    category: 'housing',
    eligibility: { minAge: 18, maxAge: 70, maxIncome: 1800000, allowedStates: ['All'], categories: ['All'], allowedGenders: ['All'], occupations: ['All'], minEducation: 'none' },
    requiredDocuments: ['Aadhaar Card', 'Income Certificate', 'Bank Account Details', 'Land/Property Documents', 'Caste Certificate (if applicable)'],
    officialLink: 'https://pmaymis.gov.in', ministry: 'Ministry of Housing & Urban Affairs', launchYear: 2015
  },

  // ─── 5. MUDRA Loan — All India, All Genders ───────────────────────────────────
  {
    schemeCode: 'PMMY',
    name: { en: 'Pradhan Mantri MUDRA Yojana (PMMY)', hi: 'प्रधानमंत्री मुद्रा योजना', mr: 'प्रधानमंत्री मुद्रा योजना', ta: 'பிரதமர் முத்ரா யோஜனா', kn: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಮುದ್ರಾ ಯೋಜನೆ', pa: 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਮੁਦਰਾ ਯੋਜਨਾ' },
    description: { en: 'Provides loans up to ₹10 lakh to non-corporate, non-farm small and micro enterprises without collateral. Three loan types: Shishu (up to ₹50k), Kishore (₹50k–5L), Tarun (₹5L–10L).', hi: 'छोटे व्यवसायों को ₹10 लाख तक बिना गारंटी ऋण।', mr: 'छोट्या व्यवसायांना ₹10 लाखांपर्यंत बिना गॅरंटी कर्ज.', ta: 'சிறு தொழில்களுக்கு ₹10 லட்சம் வரை கடன்.', kn: 'ಸಣ್ಣ ವ್ಯವಹಾರಗಳಿಗೆ ₹10 ಲಕ್ಷದವರೆಗೆ ಸಾಲ.', pa: 'ਛੋਟੇ ਕਾਰੋਬਾਰਾਂ ਨੂੰ ₹10 ਲੱਖ ਤੱਕ ਕਰਜ਼ਾ।' },
    benefits: { en: 'Collateral-free business loans up to ₹10 lakh. Low interest rates. Fast processing. Women entrepreneurs get priority.', hi: 'बिना जमानत ₹10 लाख तक व्यवसाय ऋण।', mr: 'बिना तारण ₹10 लाखांपर्यंत व्यवसाय कर्ज.', ta: 'உறுதி இல்லாமல் ₹10 லட்சம் வரை வணிக கடன்.', kn: 'ಮೇಲಾಧಾರ ಇಲ್ಲದೆ ₹10 ಲಕ್ಷದವರೆಗೆ ವ್ಯವಹಾರ ಸಾಲ.', pa: 'ਗਾਰੰਟੀ ਤੋਂ ਬਿਨਾਂ ₹10 ਲੱਖ ਤੱਕ ਕਾਰੋਬਾਰ ਕਰਜ਼ਾ।' },
    category: 'banking',
    eligibility: { minAge: 18, maxAge: 65, maxIncome: null, allowedStates: ['All'], categories: ['All'], allowedGenders: ['All'], occupations: ['self-employed','business','farmer','other'], minEducation: 'none' },
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Business Registration Proof', 'Bank Statement (6 months)', 'Passport Photo'],
    officialLink: 'https://www.mudra.org.in', ministry: 'Ministry of Finance', launchYear: 2015
  },

  // ─── 6. MGNREGS — All India, All Genders ─────────────────────────────────────
  {
    schemeCode: 'MGNREGS',
    name: { en: 'Mahatma Gandhi NREGS (MGNREGS)', hi: 'महात्मा गांधी NREGS', mr: 'महात्मा गांधी NREGS', ta: 'மகாத்மா காந்தி NREGS', kn: 'ಮಹಾತ್ಮ ಗಾಂಧಿ NREGS', pa: 'ਮਹਾਤਮਾ ਗਾਂਧੀ NREGS' },
    description: { en: 'Guarantees 100 days of wage employment per financial year to every rural household whose adult members volunteer to do unskilled manual work.', hi: 'ग्रामीण परिवारों को 100 दिन के मजदूरी रोजगार की गारंटी।', mr: 'ग्रामीण कुटुंबांना 100 दिवसांच्या रोजगाराची हमी.', ta: 'கிராமப்புற குடும்பங்களுக்கு 100 நாள் வேலை உத்தரவாதம்.', kn: 'ಗ್ರಾಮೀಣ ಕುಟುಂಬಗಳಿಗೆ 100 ದಿನಗಳ ಉದ್ಯೋಗ ಖಾತ್ರಿ.', pa: 'ਪੇਂਡੂ ਪਰਿਵਾਰਾਂ ਨੂੰ 100 ਦਿਨ ਰੋਜ਼ਗਾਰ ਦੀ ਗਾਰੰਟੀ।' },
    benefits: { en: '100 days guaranteed employment per year. Daily wages ₹200–350 (state-wise). Payment directly to bank account within 15 days.', hi: 'सालाना 100 दिन रोजगार। ₹200–350 प्रतिदिन मजदूरी।', mr: 'वार्षिक 100 दिवस रोजगार. ₹200–350 प्रतिदिन वेतन.', ta: 'ஆண்டுக்கு 100 நாள் வேலை. ₹200–350 நாளாந்த கூலி.', kn: 'ವಾರ್ಷಿಕ 100 ದಿನ ಉದ್ಯೋಗ. ₹200–350 ದಿನಕ್ಕೆ ವೇತನ.', pa: 'ਸਾਲ ਵਿੱਚ 100 ਦਿਨ ਰੋਜ਼ਗਾਰ। ₹200–350 ਪ੍ਰਤੀਦਿਨ ਉਜਰਤ।' },
    category: 'employment',
    eligibility: { minAge: 18, maxAge: 120, maxIncome: 200000, allowedStates: ['All'], categories: ['All'], allowedGenders: ['All'], occupations: ['farmer','unemployed','homemaker','other'], minEducation: 'none' },
    requiredDocuments: ['Job Card (issued by Gram Panchayat)', 'Aadhaar Card', 'Bank Passbook'],
    officialLink: 'https://nrega.nic.in', ministry: 'Ministry of Rural Development', launchYear: 2005
  },

  // ─── 7. Beti Bachao Beti Padhao — All India, Female Only ─────────────────────
  {
    schemeCode: 'BBBP',
    name: { en: 'Beti Bachao Beti Padhao (BBBP)', hi: 'बेटी बचाओ बेटी पढ़ाओ', mr: 'बेटी बचाओ बेटी पढाओ', ta: 'பேட்டி பச்சாவோ பேட்டி படாவோ', kn: 'ಬೇಟಿ ಬಚಾವೋ ಬೇಟಿ ಪಡಾವೋ', pa: 'ਬੇਟੀ ਬਚਾਓ ਬੇਟੀ ਪੜ੍ਹਾਓ' },
    description: { en: 'A scheme to address declining Child Sex Ratio and promote girls education. Provides financial incentives and scholarships for girl children from birth to graduation.', hi: 'बालिका जन्म से स्नातक तक वित्तीय प्रोत्साहन और छात्रवृत्ति।', mr: 'मुलींच्या शिक्षणासाठी जन्मापासून पदवीपर्यंत आर्थिक प्रोत्साहन.', ta: 'பெண் குழந்தைகளுக்கு பிறப்பிலிருந்து பட்டப்படிப்பு வரை நிதி ஊக்கத்தொகை.', kn: 'ಹೆಣ್ಣು ಮಕ್ಕಳಿಗೆ ಜನನದಿಂದ ಪದವಿಯವರೆಗೆ ಆರ್ಥಿಕ ಪ್ರೋತ್ಸಾಹ.', pa: 'ਕੁੜੀਆਂ ਲਈ ਜਨਮ ਤੋਂ ਗ੍ਰੈਜੂਏਸ਼ਨ ਤੱਕ ਵਿੱਤੀ ਸਹਾਇਤਾ।' },
    benefits: { en: 'Financial assistance for girl\'s education. Scholarships at key education milestones. Free education up to Class 12. Awareness programs.', hi: 'लड़कियों की शिक्षा के लिए वित्तीय सहायता और छात्रवृत्ति।', mr: 'मुलींच्या शिक्षणासाठी आर्थिक मदत आणि शिष्यवृत्ती.', ta: 'பெண்களின் கல்விக்கு நிதி உதவி மற்றும் கல்வி உதவித்தொகை.', kn: 'ಹೆಣ್ಣು ಮಕ್ಕಳ ಶಿಕ್ಷಣಕ್ಕೆ ಆರ್ಥಿಕ ಸಹಾಯ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿ ವೇತನ.', pa: 'ਕੁੜੀਆਂ ਦੀ ਸਿੱਖਿਆ ਲਈ ਵਿੱਤੀ ਮਦਦ ਅਤੇ ਵਜ਼ੀਫ਼ੇ।' },
    category: 'women_child',
    eligibility: { minAge: 0, maxAge: 21, maxIncome: 500000, allowedStates: ['All'], categories: ['All'], allowedGenders: ['female'], occupations: ['All'], minEducation: 'none' },
    requiredDocuments: ['Birth Certificate', 'Aadhaar of parent/guardian', 'School enrollment proof', 'Bank Account (parent/guardian)'],
    officialLink: 'https://wcd.nic.in/bbbp-schemes', ministry: 'Ministry of Women & Child Development', launchYear: 2015
  },

  // ─── 8. PM Scholarship — All India, All Genders ───────────────────────────────
  {
    schemeCode: 'PMSS',
    name: { en: 'PM Scholarship Scheme for Defence & Police Personnel Wards', hi: 'पीएम छात्रवृत्ति योजना', mr: 'पीएम शिष्यवृत्ती योजना', ta: 'பிரதமர் கல்வி உதவித்தொகை திட்டம்', kn: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ವಿದ್ಯಾರ್ಥಿ ವೇತನ ಯೋಜನೆ', pa: 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਵਜ਼ੀਫ਼ਾ ਯੋਜਨਾ' },
    description: { en: 'Scholarship for wards and widows of ex-servicemen and ex-coastguard personnel to pursue professional degree courses. Boys get ₹2,500/month and girls get ₹3,000/month.', hi: 'पूर्व सैनिकों के आश्रितों को व्यावसायिक डिग्री के लिए छात्रवृत्ति।', mr: 'माजी सैनिकांच्या आश्रितांना व्यावसायिक पदवीसाठी शिष्यवृत्ती.', ta: 'முன்னாள் இராணுவத்தினரின் குழந்தைகளுக்கு தொழில் பட்டப்படிப்பு உதவித்தொகை.', kn: 'ಮಾಜಿ ಸೈನಿಕರ ಮಕ್ಕಳಿಗೆ ವೃತ್ತಿ ಪದವಿ ವಿದ್ಯಾರ್ಥಿ ವೇತನ.', pa: 'ਸਾਬਕਾ ਫੌਜੀਆਂ ਦੇ ਬੱਚਿਆਂ ਲਈ ਪੇਸ਼ੇਵਰ ਡਿਗਰੀ ਵਜ਼ੀਫ਼ਾ।' },
    benefits: { en: '₹2,500/month for boys, ₹3,000/month for girls. For duration of professional degree (1–5 years).', hi: 'लड़कों को ₹2,500/माह, लड़कियों को ₹3,000/माह।', mr: 'मुलांना ₹2,500/महिना, मुलींना ₹3,000/महिना.', ta: 'ஆண்களுக்கு ₹2,500/மாதம், பெண்களுக்கு ₹3,000/மாதம்.', kn: 'ಹುಡುಗರಿಗೆ ₹2,500/ತಿಂಗಳು, ಹುಡುಗಿಯರಿಗೆ ₹3,000/ತಿಂಗಳು.', pa: 'ਮੁੰਡਿਆਂ ਨੂੰ ₹2,500/ਮਹੀਨਾ, ਕੁੜੀਆਂ ਨੂੰ ₹3,000/ਮਹੀਨਾ।' },
    category: 'education',
    eligibility: { minAge: 17, maxAge: 25, maxIncome: null, allowedStates: ['All'], categories: ['All'], allowedGenders: ['All'], occupations: ['student'], minEducation: 'higher_secondary' },
    requiredDocuments: ['ESM Certificate', 'Aadhaar Card', 'Mark Sheet of Class 12', 'Admission Letter', 'Bank Account details'],
    officialLink: 'https://ksb.gov.in', ministry: 'Ministry of Defence', launchYear: 2006
  },

  // ─── 9. Indira Gandhi Old Age Pension — All India, All Genders ────────────────
  {
    schemeCode: 'IGNOAPS',
    name: { en: 'Indira Gandhi National Old Age Pension Scheme (IGNOAPS)', hi: 'इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन योजना', mr: 'इंदिरा गांधी राष्ट्रीय वृद्धापकाळ पेन्शन योजना', ta: 'இந்திரா காந்தி தேசிய முதியோர் ஓய்வூதிய திட்டம்', kn: 'ಇಂದಿರಾ ಗಾಂಧಿ ರಾಷ್ಟ್ರೀಯ ವೃದ್ಧಾಪ್ಯ ಪಿಂಚಣಿ ಯೋಜನೆ', pa: 'ਇੰਦਰਾ ਗਾਂਧੀ ਰਾਸ਼ਟਰੀ ਬੁਢਾਪਾ ਪੈਨਸ਼ਨ ਯੋਜਨਾ' },
    description: { en: 'Monthly pension for BPL senior citizens aged 60 and above. Provides financial security to elderly persons from Below Poverty Line households.', hi: '60 वर्ष से अधिक आयु के BPL वरिष्ठ नागरिकों को मासिक पेंशन।', mr: '60 वर्षांवरील BPL वरिष्ठ नागरिकांना मासिक पेन्शन.', ta: '60 வயதுக்கு மேற்பட்ட BPL மூத்த குடிமக்களுக்கு மாதாந்திர ஓய்வூதியம்.', kn: '60 ವರ್ಷ ಮೇಲ್ಪಟ್ಟ BPL ವಯೋವೃದ್ಧ ನಾಗರಿಕರಿಗೆ ಮಾಸಿಕ ಪಿಂಚಣಿ.', pa: '60 ਸਾਲ ਤੋਂ ਵੱਧ BPL ਬਜ਼ੁਰਗ ਨਾਗਰਿਕਾਂ ਨੂੰ ਮਾਸਿਕ ਪੈਨਸ਼ਨ।' },
    benefits: { en: '₹200/month for ages 60–79. ₹500/month for ages 80 and above. States may add additional amount.', hi: '60–79 आयु: ₹200/माह। 80+ आयु: ₹500/माह।', mr: '60–79 वय: ₹200/महिना. 80+ वय: ₹500/महिना.', ta: '60–79 வயது: ₹200/மாதம். 80+ வயது: ₹500/மாதம்.', kn: '60–79 ವರ್ಷ: ₹200/ತಿಂಗಳು. 80+ ವರ್ಷ: ₹500/ತಿಂಗಳು.', pa: '60–79 ਉਮਰ: ₹200/ਮਹੀਨਾ. 80+ ਉਮਰ: ₹500/ਮਹੀਨਾ।' },
    category: 'senior_citizen',
    eligibility: { minAge: 60, maxAge: 120, maxIncome: 100000, allowedStates: ['All'], categories: ['All'], allowedGenders: ['All'], occupations: ['retired','unemployed','other'], minEducation: 'none' },
    requiredDocuments: ['Age Proof (Birth Certificate / Aadhaar)', 'BPL Ration Card', 'Bank Passbook', 'Residence Proof', 'Passport Size Photo'],
    officialLink: 'https://nsap.nic.in', ministry: 'Ministry of Rural Development', launchYear: 1995
  },

  // ─── 10. Maharashtra Mahatma Jyotiba Phule Jan Arogya — State-specific ────────
  {
    schemeCode: 'MJPJAY',
    name: { en: 'Mahatma Jyotiba Phule Jan Arogya Yojana (Maharashtra)', hi: 'महात्मा ज्योतिबा फुले जन आरोग्य योजना (महाराष्ट्र)', mr: 'महात्मा जोतिबा फुले जन आरोग्य योजना', ta: 'மகாத்மா ஜோதிபா புலே ஜன் ஆரோக்ய யோஜனா', kn: 'ಮಹಾತ್ಮ ಜ್ಯೋತಿಬಾ ಫುಲೇ ಜನ ಆರೋಗ್ಯ ಯೋಜನೆ', pa: 'ਮਹਾਤਮਾ ਜੋਤੀਬਾ ਫੂਲੇ ਜਨ ਆਰੋਗਯ ਯੋਜਨਾ' },
    description: { en: 'Maharashtra state health insurance scheme providing ₹5 lakh coverage per year to BPL and low-income families for specialized treatments at empanelled hospitals in Maharashtra.', hi: 'महाराष्ट्र BPL परिवारों के लिए ₹5 लाख तक स्वास्थ्य बीमा।', mr: 'महाराष्ट्रातील BPL कुटुंबांसाठी ₹5 लाखांपर्यंत आरोग्य विमा योजना.', ta: 'மகாராஷ்டிரா BPL குடும்பங்களுக்கு ₹5 லட்சம் சுகாதார காப்பீடு.', kn: 'ಮಹಾರಾಷ್ಟ್ರ BPL ಕುಟುಂಬಗಳಿಗೆ ₹5 ಲಕ್ಷ ಆರೋಗ್ಯ ವಿಮೆ.', pa: 'ਮਹਾਰਾਸ਼ਟਰਾ BPL ਪਰਿਵਾਰਾਂ ਲਈ ₹5 ਲੱਖ ਸਿਹਤ ਬੀਮਾ।' },
    benefits: { en: '₹5 lakh cashless treatment per year. 1,000+ surgical procedures covered. 500+ empanelled hospitals in Maharashtra.', hi: 'सालाना ₹5 लाख कैशलेस उपचार। 1,000+ सर्जिकल प्रक्रियाएं।', mr: 'वार्षिक ₹5 लाख कॅशलेस उपचार. 1,000+ शस्त्रक्रिया.', ta: 'ஆண்டுக்கு ₹5 லட்சம் கேஷ்லெஸ் சிகிச்சை. 1,000+ அறுவை சிகிச்சைகள்.', kn: 'ವಾರ್ಷಿಕ ₹5 ಲಕ್ಷ ಕ್ಯಾಷ್‌ಲೆಸ್ ಚಿಕಿತ್ಸೆ. 1,000+ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಗಳು.', pa: 'ਸਾਲਾਨਾ ₹5 ਲੱਖ ਕੈਸ਼ਲੈੱਸ ਇਲਾਜ। 1,000+ ਸਰਜਰੀਆਂ।' },
    category: 'healthcare',
    eligibility: { minAge: 0, maxAge: 120, maxIncome: 100000, allowedStates: ['Maharashtra'], categories: ['All'], allowedGenders: ['All'], occupations: ['All'], minEducation: 'none' },
    requiredDocuments: ['Yellow/Orange/White Ration Card', 'Aadhaar Card', 'Income Certificate', 'Residence Proof (Maharashtra)'],
    officialLink: 'https://www.jeevandayee.gov.in', ministry: 'Maharashtra State Government', launchYear: 2012
  },

  // ─── 11. Tamil Nadu Chief Minister's Health Insurance — State-specific ─────────
  {
    schemeCode: 'CMCHIS',
    name: { en: 'Chief Minister\'s Comprehensive Health Insurance (Tamil Nadu)', hi: 'मुख्यमंत्री व्यापक स्वास्थ्य बीमा योजना (तमिलनाडु)', mr: 'मुख्यमंत्री सर्वसमावेशक आरोग्य विमा (तामिळनाडू)', ta: 'முதலமைச்சர் விரிவான சுகாதார காப்பீட்டு திட்டம் (தமிழ்நாடு)', kn: 'ಮುಖ್ಯಮಂತ್ರಿ ಸಮಗ್ರ ಆರೋಗ್ಯ ವಿಮೆ (ತಮಿಳುನಾಡು)', pa: 'ਮੁੱਖ ਮੰਤਰੀ ਵਿਆਪਕ ਸਿਹਤ ਬੀਮਾ (ਤਾਮਿਲਨਾਡੂ)' },
    description: { en: 'Tamil Nadu state health scheme offering up to ₹5 lakh coverage for all residents with annual income below ₹72,000. Covers 1,000+ procedures across empanelled hospitals.', hi: 'तमिलनाडु में वार्षिक ₹72,000 से कम आय वाले परिवारों के लिए ₹5 लाख तक कवरेज।', mr: 'तामिळनाडूत वार्षिक ₹72,000 पेक्षा कमी उत्पन्न असलेल्या कुटुंबांना ₹5 लाखांपर्यंत कव्हरेज.', ta: 'தமிழ்நாட்டில் ₹72,000க்கும் குறைவான வருடாந்திர வருமானம் உள்ள குடும்பங்களுக்கு ₹5 லட்சம் வரை காப்பீடு.', kn: 'ತಮಿಳುನಾಡಿನಲ್ಲಿ ₹72,000 ಕ್ಕಿಂತ ಕಡಿಮೆ ವಾರ್ಷಿಕ ಆದಾಯ ಹೊಂದಿರುವ ಕುಟುಂಬಗಳಿಗೆ ₹5 ಲಕ್ಷದವರೆಗೆ ವಿಮೆ.', pa: 'ਤਾਮਿਲਨਾਡੂ ਵਿੱਚ ₹72,000 ਤੋਂ ਘੱਟ ਸਾਲਾਨਾ ਆਮਦਨ ਵਾਲੇ ਪਰਿਵਾਰਾਂ ਲਈ ₹5 ਲੱਖ ਤੱਕ ਕਵਰੇਜ।' },
    benefits: { en: 'Up to ₹5 lakh free treatment. 1,016+ procedures covered. Valid at government and private hospitals in Tamil Nadu.', hi: '₹5 लाख तक मुफ्त उपचार। 1,016+ प्रक्रियाएं।', mr: '₹5 लाखांपर्यंत मोफत उपचार. 1,016+ प्रक्रिया.', ta: '₹5 லட்சம் வரை இலவச சிகிச்சை. 1,016+ நடைமுறைகள்.', kn: '₹5 ಲಕ್ಷದವರೆಗೆ ಉಚಿತ ಚಿಕಿತ್ಸೆ. 1,016+ ಕಾರ್ಯವಿಧಾನಗಳು.', pa: '₹5 ਲੱਖ ਤੱਕ ਮੁਫ਼ਤ ਇਲਾਜ। 1,016+ ਪ੍ਰਕਿਰਿਆਵਾਂ।' },
    category: 'healthcare',
    eligibility: { minAge: 0, maxAge: 120, maxIncome: 72000, allowedStates: ['Tamil Nadu'], categories: ['All'], allowedGenders: ['All'], occupations: ['All'], minEducation: 'none' },
    requiredDocuments: ['Ration Card', 'Aadhaar Card', 'Income Certificate', 'Residence Proof (Tamil Nadu)'],
    officialLink: 'https://www.cmchistn.com', ministry: 'Tamil Nadu State Government', launchYear: 2009
  },

  // ─── 12. Kanyashree — West Bengal, Female Only ───────────────────────────────
  {
    schemeCode: 'K2WB',
    name: { en: 'Kanyashree Prakalpa (West Bengal)', hi: 'कन्याश्री प्रकल्प (पश्चिम बंगाल)', mr: 'कन्याश्री प्रकल्प (पश्चिम बंगाल)', ta: 'கன்யாஸ்ரீ பிரகல்பா (மேற்கு வங்காளம்)', kn: 'ಕನ್ಯಾಶ್ರೀ ಪ್ರಕಲ್ಪ (ಪಶ್ಚಿಮ ಬಂಗಾಲ)', pa: 'ਕੰਨਿਆਸ਼੍ਰੀ ਪ੍ਰਕਲਪ (ਪੱਛਮੀ ਬੰਗਾਲ)' },
    description: { en: 'West Bengal government scheme to empower girl children through conditional cash transfers. Provides annual scholarship and one-time grant to prevent child marriage and promote girls education.', hi: 'पश्चिम बंगाल में बालिकाओं के सशक्तिकरण और बाल विवाह रोकने के लिए नकद अंतरण योजना।', mr: 'पश्चिम बंगालमध्ये मुलींचे सशक्तीकरण आणि बालविवाह रोखण्यासाठी रोख हस्तांतरण योजना.', ta: 'மேற்கு வங்காளத்தில் பெண்களை மேம்படுத்தவும் குழந்தை திருமணத்தை தடுக்கவும் நிதி திட்டம்.', kn: 'ಪಶ್ಚಿಮ ಬಂಗಾಲದಲ್ಲಿ ಹೆಣ್ಣು ಮಕ್ಕಳ ಸಶಕ್ತೀಕರಣ ಮತ್ತು ಬಾಲ್ಯ ವಿವಾಹ ತಡೆಗಾಗಿ ನಗದು ವರ್ಗಾವಣೆ.', pa: 'ਪੱਛਮੀ ਬੰਗਾਲ ਵਿੱਚ ਕੁੜੀਆਂ ਦੇ ਸਸ਼ਕਤੀਕਰਨ ਅਤੇ ਬਾਲ ਵਿਆਹ ਰੋਕਣ ਲਈ ਨਕਦ ਸਹਾਇਤਾ ਯੋਜਨਾ।' },
    benefits: { en: '₹1,000/year scholarship (Class 8–12). ₹25,000 one-time grant on turning 18. Conditional on staying in school and unmarried.', hi: '₹1,000/वर्ष छात्रवृत्ति। 18 वर्ष पर ₹25,000 एकमुश्त।', mr: '₹1,000/वर्ष शिष्यवृत्ती. 18 वर्षी ₹25,000 एकरकमी.', ta: '₹1,000/ஆண்டு உதவித்தொகை. 18 வயதில் ₹25,000 ஒரு முறை மானியம்.', kn: '₹1,000/ವರ್ಷ ವಿದ್ಯಾರ್ಥಿ ವೇತನ. 18 ವರ್ಷಕ್ಕೆ ₹25,000 ಏಕ ಬಾರಿ.', pa: '₹1,000/ਸਾਲ ਵਜ਼ੀਫ਼ਾ. 18 ਸਾਲ ਤੇ ₹25,000 ਇੱਕਮੁਸ਼ਤ।' },
    category: 'women_child',
    eligibility: { minAge: 13, maxAge: 18, maxIncome: 120000, allowedStates: ['West Bengal'], categories: ['All'], allowedGenders: ['female'], occupations: ['student'], minEducation: 'secondary' },
    requiredDocuments: ['Aadhaar Card', 'School enrollment certificate', 'Age proof', 'Bank account (in girl\'s name)', 'Income certificate (family)'],
    officialLink: 'https://wbkanyashree.gov.in', ministry: 'West Bengal State Government', launchYear: 2013
  },

  // ─── 13. Rajiv Gandhi Kisan Nyay Yojana — Chhattisgarh, Farmers ───────────────
  {
    schemeCode: 'RGKNY',
    name: { en: 'Rajiv Gandhi Kisan Nyay Yojana (Chhattisgarh)', hi: 'राजीव गांधी किसान न्याय योजना (छत्तीसगढ़)', mr: 'राजीव गांधी किसान न्याय योजना (छत्तीसगढ)', ta: 'ராஜீவ் காந்தி கிசான் நியாய் யோஜனா (சத்தீஸ்கர்)', kn: 'ರಾಜೀವ್ ಗಾಂಧಿ ಕಿಸಾನ್ ನ್ಯಾಯ ಯೋಜನೆ (ಛತ್ತೀಸ್‌ಗಢ)', pa: 'ਰਾਜੀਵ ਗਾਂਧੀ ਕਿਸਾਨ ਨਿਆਂ ਯੋਜਨਾ (ਛੱਤੀਸਗੜ੍ਹ)' },
    description: { en: 'Chhattisgarh government scheme providing direct income support to paddy, maize, sugarcane and other crop farmers. Gives ₹9,000–13,000 per acre as input subsidy.', hi: 'छत्तीसगढ़ में धान, मक्का, गन्ना उत्पादक किसानों को प्रति एकड़ ₹9,000–13,000 सहायता।', mr: 'छत्तीसगडमध्ये धान, मका, उसाचे उत्पादक शेतकऱ्यांना प्रति एकर ₹9,000–13,000 मदत.', ta: 'சத்தீஸ்கரில் நெல், மக்காச்சோளம், கரும்பு விவசாயிகளுக்கு ஏக்கருக்கு ₹9,000–13,000 உதவி.', kn: 'ಛತ್ತೀಸ್‌ಗಢದಲ್ಲಿ ಭತ್ತ, ಮೆಕ್ಕೆಜೋಳ, ಕಬ್ಬು ಬೆಳೆಗಾರರಿಗೆ ಎಕರೆಗೆ ₹9,000–13,000 ಸಹಾಯ.', pa: 'ਛੱਤੀਸਗੜ੍ਹ ਵਿੱਚ ਧਾਨ, ਮੱਕੀ, ਗੰਨੇ ਦੇ ਕਿਸਾਨਾਂ ਨੂੰ ਪ੍ਰਤੀ ਏਕੜ ₹9,000–13,000 ਮਦਦ।' },
    benefits: { en: '₹9,000–13,000 per acre input subsidy directly to bank account. Covers paddy, maize, sugarcane, oilseeds and other crops.', hi: 'प्रति एकड़ ₹9,000–13,000 बैंक में सीधे।', mr: 'प्रति एकर ₹9,000–13,000 थेट बँक खात्यात.', ta: 'ஏக்கருக்கு ₹9,000–13,000 வங்கி கணக்கில் நேரடியாக.', kn: 'ಎಕರೆಗೆ ₹9,000–13,000 ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೇರವಾಗಿ.', pa: 'ਪ੍ਰਤੀ ਏਕੜ ₹9,000–13,000 ਸਿੱਧੇ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ।' },
    category: 'farmer',
    eligibility: { minAge: 18, maxAge: 80, maxIncome: null, allowedStates: ['Chhattisgarh'], categories: ['All'], allowedGenders: ['All'], occupations: ['farmer'], minEducation: 'none' },
    requiredDocuments: ['Aadhaar Card', 'Land Records (Khasra/Khatauni)', 'Bank Passbook', 'Chhattisgarh Domicile Certificate', 'Crop Sowing Certificate (Girdawari)'],
    officialLink: 'https://rgkny.cg.nic.in', ministry: 'Chhattisgarh State Government', launchYear: 2020
  },

  // ─── 14. Vanitha Samman — Karnataka, Female Only ──────────────────────────────
  {
    schemeCode: 'GRIHAJYOTIKA',
    name: { en: 'Gruha Jyothi Scheme (Karnataka)', hi: 'गृह ज्योति योजना (कर्नाटक)', mr: 'गृह ज्योती योजना (कर्नाटक)', ta: 'க்ருஹ ஜோதி திட்டம் (கர்நாடகா)', kn: 'ಗೃಹ ಜ್ಯೋತಿ ಯೋಜನೆ (ಕರ್ನಾಟಕ)', pa: 'ਗ੍ਰਿਹ ਜੋਤੀ ਯੋਜਨਾ (ਕਰਨਾਟਕ)' },
    description: { en: 'Karnataka government scheme providing 200 units of free electricity per month to domestic consumers. Provides relief to households using up to 200 units monthly.', hi: 'कर्नाटक में घरेलू उपभोक्ताओं को 200 यूनिट मुफ्त बिजली।', mr: 'कर्नाटकात घरगुती ग्राहकांना दरमहा 200 युनिट मोफत वीज.', ta: 'கர்நாடகாவில் வீட்டு நுகர்வோருக்கு மாதம் 200 யூனிட் இலவச மின்சாரம்.', kn: 'ಕರ್ನಾಟಕದಲ್ಲಿ ಗೃಹ ಬಳಕೆದಾರರಿಗೆ ತಿಂಗಳಿಗೆ 200 ಯೂನಿಟ್ ಉಚಿತ ವಿದ್ಯುತ್.', pa: 'ਕਰਨਾਟਕ ਵਿੱਚ ਘਰੇਲੂ ਖਪਤਕਾਰਾਂ ਨੂੰ ਮਹੀਨੇ ਵਿੱਚ 200 ਯੂਨਿਟ ਮੁਫ਼ਤ ਬਿਜਲੀ।' },
    benefits: { en: '200 units of electricity free per month. Zero electricity bill for eligible households. Applicable to domestic connections only.', hi: 'प्रति माह 200 यूनिट मुफ्त। योग्य परिवारों को शून्य बिल।', mr: 'दरमहा 200 युनिट मोफत. पात्र कुटुंबांना शून्य बिल.', ta: 'மாதம் 200 யூனிட் இலவசம். தகுதியான குடும்பங்களுக்கு சூன்ய மசோதா.', kn: 'ತಿಂಗಳಿಗೆ 200 ಯೂನಿಟ್ ಉಚಿತ. ಅರ್ಹ ಕುಟುಂಬಗಳಿಗೆ ಶೂನ್ಯ ಬಿಲ್.', pa: 'ਮਹੀਨੇ ਵਿੱਚ 200 ਯੂਨਿਟ ਮੁਫ਼ਤ। ਯੋਗ ਪਰਿਵਾਰਾਂ ਨੂੰ ਜ਼ੀਰੋ ਬਿੱਲ।' },
    category: 'other',
    eligibility: { minAge: 18, maxAge: 120, maxIncome: 500000, allowedStates: ['Karnataka'], categories: ['All'], allowedGenders: ['All'], occupations: ['All'], minEducation: 'none' },
    requiredDocuments: ['Electricity Consumer Number', 'Aadhaar Card', 'Proof of ownership/tenancy', 'Karnataka Domicile'],
    officialLink: 'https://gruha.karnataka.gov.in', ministry: 'Karnataka State Government', launchYear: 2023
  },

  // ─── 15. Ladli Laxmi — Madhya Pradesh, Female Only ───────────────────────────
  {
    schemeCode: 'LADLIMP',
    name: { en: 'Ladli Laxmi Yojana (Madhya Pradesh)', hi: 'लाड़ली लक्ष्मी योजना (मध्य प्रदेश)', mr: 'लाडली लक्ष्मी योजना (मध्य प्रदेश)', ta: 'லாட்லி லக்ஷ்மி யோஜனா (மத்திய பிரதேஷ்)', kn: 'ಲಾಡ್ಲಿ ಲಕ್ಷ್ಮಿ ಯೋಜನೆ (ಮಧ್ಯ ಪ್ರದೇಶ)', pa: 'ਲਾਡਲੀ ਲਕਸ਼ਮੀ ਯੋਜਨਾ (ਮੱਧ ਪ੍ਰਦੇਸ਼)' },
    description: { en: 'Madhya Pradesh scheme for girl children providing financial assistance at various life stages from birth to marriage. Aims to reduce female foeticide and promote girl education.', hi: 'मध्य प्रदेश में बालिकाओं को जन्म से विवाह तक वित्तीय सहायता।', mr: 'मध्य प्रदेशात मुलींना जन्मापासून विवाहापर्यंत आर्थिक सहाय्य.', ta: 'மத்திய பிரதேஷில் பெண் குழந்தைகளுக்கு பிறப்பிலிருந்து திருமணம் வரை நிதி உதவி.', kn: 'ಮಧ್ಯ ಪ್ರದೇಶದಲ್ಲಿ ಹೆಣ್ಣು ಮಕ್ಕಳಿಗೆ ಜನನದಿಂದ ವಿವಾಹದವರೆಗೆ ಆರ್ಥಿಕ ಸಹಾಯ.', pa: 'ਮੱਧ ਪ੍ਰਦੇਸ਼ ਵਿੱਚ ਕੁੜੀਆਂ ਨੂੰ ਜਨਮ ਤੋਂ ਵਿਆਹ ਤੱਕ ਵਿੱਤੀ ਸਹਾਇਤਾ।' },
    benefits: { en: 'Total ₹1,43,000 in installments over girl\'s life. ₹30,000 on Class 6 admission. ₹1 lakh scholarship on Class 12. ₹2 lakh on marriage after 21.', hi: 'जीवन के विभिन्न चरणों में कुल ₹1,43,000। कक्षा 12 पर ₹1 लाख।', mr: 'आयुष्यात एकूण ₹1,43,000. इयत्ता 12 वी वर ₹1 लाख शिष्यवृत्ती.', ta: 'வாழ்க்கையில் மொத்தம் ₹1,43,000. 12ஆம் வகுப்பில் ₹1 லட்சம் உதவித்தொகை.', kn: 'ಜೀವನದಲ್ಲಿ ಒಟ್ಟು ₹1,43,000. 12ನೇ ತರಗತಿಯಲ್ಲಿ ₹1 ಲಕ್ಷ ವಿದ್ಯಾರ್ಥಿ ವೇತನ.', pa: 'ਜ਼ਿੰਦਗੀ ਵਿੱਚ ਕੁੱਲ ₹1,43,000. 12ਵੀਂ ਵਿੱਚ ₹1 ਲੱਖ ਵਜ਼ੀਫ਼ਾ।' },
    category: 'women_child',
    eligibility: { minAge: 0, maxAge: 21, maxIncome: null, allowedStates: ['Madhya Pradesh'], categories: ['All'], allowedGenders: ['female'], occupations: ['All'], minEducation: 'none' },
    requiredDocuments: ['Birth Certificate', 'Aadhaar of parents', 'Madhya Pradesh Domicile', 'Bank Account (girl\'s name)', 'BPL/Income Certificate (if applicable)'],
    officialLink: 'https://ladlilaxmi.mp.gov.in', ministry: 'Madhya Pradesh State Government', launchYear: 2007
  }
];

module.exports = schemes;
