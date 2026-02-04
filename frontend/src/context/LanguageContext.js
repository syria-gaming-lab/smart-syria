import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Header
    title: "Syria Gaming Lab",
    cohort: "Cohort 2",
    subtitle: "Game Development Training Application",
    langToggle: "🇸🇦 العربية",
    
    // Progress
    step: "Step",
    of: "of",
    
    // Section 1
    section1Title: "Basic Info & Readiness",
    section1Subtitle: "Let's get to know you!",
    
    // Personal Info
    personalInfo: "Personal Information",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    age: "Age",
    agePlaceholder: "Your age",
    residence: "Place of Residence",
    residencePlaceholder: "City / Town",
    email: "Email (Primary)",
    emailPlaceholder: "your@email.com",
    whatsapp: "WhatsApp Number",
    whatsappPlaceholder: "+963 xxx xxx xxxx",
    
    // Background
    background: "Background & Interests",
    mainField: "What is your main field?",
    programming: "Programming or Game Development",
    art: "Drawing or Visual Design",
    writing: "Story Writing or Dialogue",
    player: "Gamer wanting to learn development",
    other: "Other (specify)",
    otherFieldPlaceholder: "Tell us what it is",
    
    hasProject: "Have you worked on a game project before?",
    hasProjectDesc: "(Even if simple or personal)",
    yes: "Yes",
    no: "No",
    trying: "Currently trying",
    projectDetailsPlaceholder: "Tell us about your project or share a link...",
    
    // Technical Skills
    techSkills: "Technical Skills",
    knownTools: "Do you have experience with any of these tools?",
    knownToolsDesc: "(You can select multiple)",
    otherToolPlaceholder: "What other tools?",
    
    workPreference: "Do you prefer working:",
    solo: "Solo on my own idea",
    team: "In a team on a group project",
    both: "Either is fine",
    
    timeCommitment: "Can you dedicate 5-8 hours weekly for one month?",
    timeCommitmentDesc: "(Average 2 hours daily)",
    fullyCommitted: "Yes, fully committed",
    maybeCommitted: "With difficulty, depends on circumstances",
    notCommitted: "No, less than that",
    
    internetStability: "Do you have stable internet for Discord participation?",
    stableYes: "Yes",
    stableMostly: "Mostly",
    stableNo: "No, unstable connection",
    differentMethod: "I prefer a different method than Discord",
    
    // Section 2
    section2Title: "Idea, Passion & Elite Stage",
    section2Subtitle: "Tell us about your vision!",
    
    // Idea & Motivation
    ideaMotivation: "Idea & Motivation",
    hasIdea: "Do you have an initial game idea you'd like to develop?",
    ideaYes: "Yes",
    ideaNo: "No",
    ideaThinking: "Still thinking about it",
    ideaDetailsLabel: "(Optional) Share a brief description, name, or game type:",
    ideaDetailsPlaceholder: "Your game idea...",
    
    joinReason: "Why do you want to join our program?",
    joinReasonPlaceholder: "Tell us your motivation...",
    
    // Elite Stage
    eliteStage: "Elite Stage - Future Qualification",
    wantsElite: "If qualified after training, would you like to move to the second phase and work on a real MVP in a workspace?",
    eliteYes: "Yes",
    eliteNo: "No",
    eliteMaybe: "Maybe, depending on circumstances",
    
    finalNotes: "Final Notes",
    finalNotesPlaceholder: "Any questions or things you'd like to clarify before joining? Anything you'd like to add to the project?",
    
    // Navigation
    next: "Next",
    prev: "Previous",
    submit: "Submit Application",
    submitting: "Submitting...",
    
    // Success
    successTitle: "Application Submitted!",
    successMessage: "Thank you for applying to Syria Gaming Lab Cohort 2. We will review your application and contact you soon.",
    submitAnother: "Submit Another",
    
    // Validation
    required: "This field is required",
    invalidEmail: "Please enter a valid email",
    selectOne: "Please select at least one option",
    
    // Admin
    adminLogin: "Admin Login",
    username: "Username",
    password: "Password",
    login: "Login",
    logout: "Logout",
    dashboard: "Dashboard",
    applications: "Applications",
    export: "Export CSV",
    search: "Search...",
    filterStatus: "Filter by status",
    all: "All",
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
    actions: "Actions",
    view: "View",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete this application?",
    noApplications: "No applications found",
    total: "Total",
    backToForm: "Back to Form",
    updateStatus: "Update Status",
    close: "Close",
  },
  ar: {
    // Header
    title: "مختبر سوريا للألعاب",
    cohort: "الدفعة 2",
    subtitle: "طلب التدريب على تطوير الألعاب",
    langToggle: "🇬🇧 English",
    
    // Progress
    step: "الخطوة",
    of: "من",
    
    // Section 1
    section1Title: "المعلومات الأساسية والجاهزية",
    section1Subtitle: "دعنا نتعرف عليك!",
    
    // Personal Info
    personalInfo: "المعلومات الشخصية",
    fullName: "الاسم الكامل",
    fullNamePlaceholder: "أدخل اسمك الكامل",
    age: "العمر",
    agePlaceholder: "عمرك",
    residence: "مكان الإقامة",
    residencePlaceholder: "المدينة / البلدة",
    email: "البريد الإلكتروني (الأساسي)",
    emailPlaceholder: "your@email.com",
    whatsapp: "رقم الواتساب",
    whatsappPlaceholder: "+963 xxx xxx xxxx",
    
    // Background
    background: "الخلفية والاهتمامات",
    mainField: "ما هو مجالك الرئيسي؟",
    programming: "البرمجة أو تطوير الألعاب",
    art: "الرسم أو التصميم البصري",
    writing: "كتابة القصص أو الحوارات",
    player: "لاعب يريد تعلم التطوير",
    other: "أخرى (حدد)",
    otherFieldPlaceholder: "أخبرنا ما هو",
    
    hasProject: "هل سبق أن عملت على مشروع لعبة؟",
    hasProjectDesc: "(حتى لو بسيط أو شخصي)",
    yes: "نعم",
    no: "لا",
    trying: "أجرب حاليًا",
    projectDetailsPlaceholder: "أخبرنا عن مشروعك أو شارك رابطًا...",
    
    // Technical Skills
    techSkills: "التقنيات والمهارات",
    knownTools: "هل لديك معرفة سابقة بأي من هذه الأدوات؟",
    knownToolsDesc: "(يمكنك اختيار أكثر من أداة)",
    otherToolPlaceholder: "ما هي الأدوات الأخرى؟",
    
    workPreference: "هل تفضل العمل:",
    solo: "بشكل فردي على فكرتك الخاصة",
    team: "ضمن فريق على مشروع جماعي",
    both: "لا مانع من الاثنين",
    
    timeCommitment: "هل يمكنك تخصيص 5-8 ساعات أسبوعيًا لمدة شهر واحد؟",
    timeCommitmentDesc: "(بمعدل ساعتين يوميًا)",
    fullyCommitted: "نعم، ملتزم بالكامل",
    maybeCommitted: "بصعوبة، حسب الظروف",
    notCommitted: "لا، أقل من ذلك",
    
    internetStability: "هل لديك اتصال إنترنت مستقر للمشاركة على Discord؟",
    stableYes: "نعم",
    stableMostly: "تقريبًا",
    stableNo: "لا، ليس لدي إنترنت مستقر",
    differentMethod: "أفضل وسيلة مختلفة عن Discord",
    
    // Section 2
    section2Title: "الفكرة والشغف والمرحلة المتقدمة",
    section2Subtitle: "أخبرنا عن رؤيتك!",
    
    // Idea & Motivation
    ideaMotivation: "الفكرة والدافع",
    hasIdea: "هل لديك فكرة مبدئية للعبة ترغب في تطويرها؟",
    ideaYes: "نعم",
    ideaNo: "لا",
    ideaThinking: "ما زلت أفكر حاليًا",
    ideaDetailsLabel: "(اختياري) شارك لمحة بسيطة أو اسمها أو نوع اللعبة:",
    ideaDetailsPlaceholder: "فكرة لعبتك...",
    
    joinReason: "لماذا ترغب في الانضمام إلى برنامجنا؟",
    joinReasonPlaceholder: "أخبرنا عن دافعك...",
    
    // Elite Stage
    eliteStage: "مرحلة النخبة - التأهيل المستقبلي",
    wantsElite: "في حالة تأهلك بعد التدريب، هل ترغب لاحقًا بالانتقال إلى المرحلة الثانية والعمل على MVP حقيقي ضمن مساحة عمل؟",
    eliteYes: "نعم",
    eliteNo: "لا",
    eliteMaybe: "ربما، حسب الظروف",
    
    finalNotes: "ملاحظات أخيرة",
    finalNotesPlaceholder: "هل لديك أسئلة أو أمور تحب توضيحها قبل الانضمام؟ هل هناك شيء تحب أن تضيفه للمشروع؟",
    
    // Navigation
    next: "التالي",
    prev: "السابق",
    submit: "إرسال الطلب",
    submitting: "جاري الإرسال...",
    
    // Success
    successTitle: "تم إرسال الطلب!",
    successMessage: "شكرًا لتقديمك على مختبر سوريا للألعاب - الدفعة 2. سنراجع طلبك ونتواصل معك قريبًا.",
    submitAnother: "تقديم طلب آخر",
    
    // Validation
    required: "هذا الحقل مطلوب",
    invalidEmail: "يرجى إدخال بريد إلكتروني صحيح",
    selectOne: "يرجى اختيار خيار واحد على الأقل",
    
    // Admin
    adminLogin: "تسجيل دخول المشرف",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    login: "دخول",
    logout: "خروج",
    dashboard: "لوحة التحكم",
    applications: "الطلبات",
    export: "تصدير CSV",
    search: "بحث...",
    filterStatus: "تصفية حسب الحالة",
    all: "الكل",
    pending: "قيد الانتظار",
    accepted: "مقبول",
    rejected: "مرفوض",
    actions: "الإجراءات",
    view: "عرض",
    delete: "حذف",
    confirmDelete: "هل أنت متأكد من حذف هذا الطلب؟",
    noApplications: "لا توجد طلبات",
    total: "المجموع",
    backToForm: "العودة للنموذج",
    updateStatus: "تحديث الحالة",
    close: "إغلاق",
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };
  
  const t = (key) => {
    return translations[language][key] || key;
  };
  
  const isRTL = language === 'ar';
  
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
