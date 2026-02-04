import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Sparkles, Calendar, Clock, MapPin, Smartphone, Mail, CheckSquare } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const TOPTECH_LOGO = "/images/logos/Bloom-2.png";
const TOPTECH_LOGO2 = "/images/logos/Bloom-4.png";
// Colors from Talk Tech logo
const COLORS = {
  primary: '#312459',
  accent: '#fa91ba',
  ground: '#535353',
  text: '#1a1a1a',
  textSecondary: '#444444',
  white: '#ffffff',
};

// Translations
const translations = {
  en: {
    langToggle: '🇸🇦 العربية',
    title: 'TalkTech Bloom',
    subtitle: 'Registration Form',
    aboutEvent: 'About the Event',
    eventDescription: 'An interactive event aimed at empowering young women and helping them discover different tech paths, and building conscious and thoughtful steps towards the job market.',
    eventIncludes: 'The event includes:',
    eventInclude1: 'Introduction session about TalkTech Bloom initiative and its vision',
    eventInclude2: 'Inspirational session with a leading woman in technology and business',
    eventInclude3: 'Interactive café with specialized corners in various tech fields, with experts for direct guidance and open discussion',
    eventDate: 'Thursday 12/2/2026',
    eventTime: '3:00 – 6:00 PM',
    eventLocation: 'Sanad Youth Center – Al-Afif – opposite the French Embassy',
    eventTarget: 'This event is dedicated to young women interested in technology, whether students, graduates, or at the beginning of their career journey, who want a deeper understanding of tech fields and their realistic opportunities.',
    
    section1Title: 'Basic Information',
    section1Subtitle: '(Required for communication and organization)',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    phone: 'Phone Number (WhatsApp)',
    phonePlaceholder: 'Enter your WhatsApp number',
    phoneNote: 'You will be contacted via WhatsApp to confirm your attendance and send event details.',
    email: 'Email',
    emailPlaceholder: 'Enter your email',
    
    section2Title: 'Your Category',
    category_student: 'University student – IT/Tech major',
    category_graduate: 'Graduate (not currently working)',
    category_working: 'Working in the tech field',
    category_other: 'Other',
    categoryOtherPlaceholder: 'Please specify',
    
    section3Title: 'Your Tech Interests',
    section3Subtitle: 'What tech fields have you heard about or are interested in attending their corners at the event?',
    interest_frontend: 'Frontend Development',
    interest_backend: 'Backend Development',
    interest_games: 'Video Game Programming',
    interest_data: 'Data Analytics',
    interest_ai: 'Artificial Intelligence (AI) / ML',
    interest_security: 'Cybersecurity',
    interest_other: 'Other',
    interestOtherPlaceholder: 'Mention it',
    
    section4Title: 'Your Goal from Attending',
    section4Subtitle: 'What do you most hope to gain from this event?',
    goal_path: 'Choosing a suitable tech path for me',
    goal_market: 'Understanding the job market and its opportunities',
    goal_networking: 'Networking and meeting experts',
    goal_inspiration: 'Inspiration and motivation',
    goal_other: 'Other',
    goalOtherPlaceholder: 'Optional',
    
    section5Title: 'Attendance Confirmation',
    confirmText: 'By confirming your registration, you confirm your definite attendance at this event.',
    confirmWarning: 'In case of non-attendance without prior apology, your participation in any future events will be cancelled.',
    confirmQuestion: 'Do you agree?',
    confirmLabel: 'Yes, I agree and confirm my attendance',
    
    submit: 'Submit Registration',
    submitting: 'Submitting...',
    next: 'Next',
    previous: 'Previous',
    
    successTitle: 'REGISTRATION COMPLETE!',
    successSubtitle: 'You did it!',
    successMessage: 'Thank you for your time, trust, and participation with us',
    successSubMessage: 'Your presence in this form means you are part of a bigger step to create an aware, capable, and connected tech women\'s community.',
    whatsappTitle: 'Join our WhatsApp Channel:',
    whatsappLink: 'https://whatsapp.com/channel/0029VbBIBbl8fewmI5Vnkg2g',
    instagramTitle: 'Follow us on Instagram:',
    instagramHandle: '@bloom_talktech',
    instagramLink: 'https://www.instagram.com/bloom_talktech/',
    finalMessage: 'Because we grow with you... and advance with every girl who chooses to be part of this community.',
    welcomeMessage: 'Welcome to TalkTech Bloom!',
    backToHome: 'Back to Home',
  },
  ar: {
    langToggle: '🇬🇧 English',
    title: 'TalkTech Bloom',
    subtitle: 'نموذج التسجيل',
    aboutEvent: 'عن الفعالية',
    eventDescription: 'فعالية تفاعلية تهدف إلى تعريف الشباب والشابات بالمسارات التقنية الحديثة وربطها بسوق العمل.',
    eventIncludes: 'مخطط سير الفعالية:',
    eventInclude1: '• الافتتاح والتعريف بمبادرة TalkTech Bloom',
    eventInclude2: '• محاضرة: المسار بين البزنس والمعلوماتية – سارة قطف (Planalyze)',
    eventInclude3: '• محاضرة: مدخل إلى الذكاء الاصطناعي – محمد شرف (SharafAI)',
    eventInclude4: '• محاضرة: مسار الـ Gaming – محمد فليون وطارق عمار (Levantix)',
    eventInclude5: '• فقرة ختامية: التشبيك وبناء المسار المهني – هلا نقاوة (Step Up)',
    cornersTitle: 'فقرة الكورنرز (Corners):',
    corner1: '• SharafAI Corner – الذكاء الاصطناعي',
    corner2: '• Machine Learning Corner – فريق ذكاء',
    corner3: '• Data Analysis Corner – Planalyze',
    corner4: '• Gaming Corner – Levantix',
    corner5: '• Networking Corner – Step Up',
    corner6: '• TalkTech Bloom Corner – المسارات القادمة والأنشطة المستقبلية',
    eventDate: 'الخميس 12 / 2 / 2026',
    eventTime: '3:00 – 6:00 مساءً',
    eventLocation: 'مركز سند الشباب – العفيف – مقابل السفارة الفرنسية',
    eventTarget: 'هذه الفعالية مخصصة للشابات المهتمات بالتقنية، سواء كنّ طالبات، خريجات، أو في بداية رحلتهن المهنية، والراغبات بفهم أعمق للمجالات التقنية وفرصها الواقعية.',
    
    section1Title: 'المعلومات الأساسية',
    section1Subtitle: '(ضرورية للتواصل والتنظيم)',
    fullName: 'الاسم الكامل',
    fullNamePlaceholder: 'أدخلي اسمك الكامل',
    phone: 'رقم الهاتف (واتساب)',
    phonePlaceholder: 'أدخلي رقم الواتساب',
    phoneNote: 'سيتم التواصل معك عبر الواتساب لتأكيد حضورك وإرسال تفاصيل الفعالية.',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'أدخلي بريدك الإلكتروني',
    
    section2Title: 'الفئة التي تنتمين إليها',
    category_student: 'طالبة جامعية – تخصص معلوماتية / تقنية',
    category_graduate: 'خريجة (غير عاملة حالياً)',
    category_working: 'عاملة في المجال التقني',
    category_other: 'غير ذلك',
    categoryOtherPlaceholder: 'يرجى التوضيح',
    
    section3Title: 'اهتماماتك التقنية',
    section3Subtitle: 'ما المجالات التقنية التي سمعتِ عنها أو تهتمين بحضور زواياها في الفعالية؟',
    interest_frontend: 'Frontend Development',
    interest_backend: 'Backend Development',
    interest_games: 'Video Game Programming',
    interest_data: 'تحليل البيانات / Data Analytics',
    interest_ai: 'الذكاء الاصطناعي (AI) / ML',
    interest_security: 'الأمن السيبراني',
    interest_other: 'غير ذلك',
    interestOtherPlaceholder: 'اذكريه',
    
    section4Title: 'هدفك من حضور الفعالية',
    section4Subtitle: 'ما أكثر شيء تتمنين الخروج به من هذه الفعالية؟',
    goal_path: 'اختيار مسار تقني مناسب لي',
    goal_market: 'فهم سوق العمل وفرصه',
    goal_networking: 'التشبيك والتعرّف على خبيرات',
    goal_inspiration: 'الإلهام والتحفيز',
    goal_other: 'غير ذلك',
    goalOtherPlaceholder: 'اختياري',
    
    section5Title: 'تأكيد الحضور',
    confirmText: 'بتأكيدك على التسجيل، فإنك تثبتين حضورك لهذه الفعالية بشكل مؤكد.',
    confirmWarning: 'في حال عدم الحضور دون اعتذار مسبق، سيتم إلغاء مشاركتك في أي فعاليات قادمة.',
    confirmQuestion: 'هل أنتِ موافقة؟',
    confirmLabel: 'نعم، أوافق وأؤكد حضوري',
    
    submit: 'إرسال التسجيل',
    submitting: 'جاري الإرسال...',
    next: 'التالي',
    previous: 'السابق',
    
    successTitle: 'تم التسجيل بنجاح!',
    successSubtitle: 'أحسنتِ!',
    successMessage: 'شكراً لوقتك وثقتك ومشاركتك معنا',
    successSubMessage: 'وجودك في هذا الاستبيان يعني أنك جزء من خطوة أكبر لصناعة مجتمع نسائي تقني واعٍ، قادر، ومتواصل.',
    whatsappTitle: 'انضمي إلى قناة الواتساب:',
    whatsappLink: 'https://whatsapp.com/channel/0029VbBIBbl8fewmI5Vnkg2g',
    instagramTitle: 'تابعينا على إنستغرام:',
    instagramHandle: '@bloom_talktech',
    instagramLink: 'https://www.instagram.com/bloom_talktech/',
    finalMessage: 'لأننا نكبر بكِ… ونتقدّم بكل فتاة تختار أن تكون جزءاً من هذا المجتمع.',
    welcomeMessage: 'نورتِ TalkTech Bloom، وشرف إلنا وجودك معنا',
    backToHome: 'العودة للرئيسية',
  }
};

// Win Animation Component
const WinAnimation = ({ onComplete, language = 'ar' }) => {
  const [showContent, setShowContent] = useState(false);
  const isRTL = language === 'ar';
  const fontClass = isRTL ? 'font-tajawal' : 'font-noto';
  const titleFontClass = isRTL ? 'font-tajawal font-black' : 'font-boldpixels';
  
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: '#1a1a2e' }}>
      <style>{`
        @keyframes pixel-pop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pixel-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pixel-glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.5); }
        }
        @keyframes pixel-fall {
          0% { transform: translateY(-100vh); opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes pixel-flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .pixel-pop { animation: pixel-pop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
        .pixel-bounce { animation: pixel-bounce 1.5s ease-in-out infinite; }
        .pixel-glow { animation: pixel-glow 2s ease-in-out infinite; }
        .pixel-particle { animation: pixel-fall 2s linear forwards; }
        .pixel-flash { animation: pixel-flash 0.8s ease-in-out infinite; }
      `}</style>
      
      {/* Pixel Particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="pixel-particle absolute"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${8 + Math.random() * 8}px`,
            height: `${8 + Math.random() * 8}px`,
            backgroundColor: i % 3 === 0 ? '#312459' : i % 3 === 1 ? '#fa91ba' : '#ffffff',
            animationDelay: `${Math.random() * 1.5}s`,
            top: '-20px',
            boxShadow: '0 0 8px rgba(250, 145, 186, 0.5)'
          }}
        />
      ))}
      
      {showContent && (
        <div className="text-center pixel-pop">
          {/* Pixel Checkmark Box */}
          <div className="inline-block mb-8 pixel-bounce">
            <div className="relative" style={{ 
              width: '120px', 
              height: '120px',
              backgroundColor: '#312459',
              border: '6px solid #fa91ba',
              boxShadow: '0 0 0 4px #312459, 0 8px 0 #1a1a2e, 0 0 30px rgba(250, 145, 186, 0.4)'
            }}>
              {/* Pixel Checkmark */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="70" height="70" viewBox="0 0 70 70" className="pixel-glow">
                  <path d="M10 35 L25 50 L60 15" 
                    stroke="#fa91ba" 
                    strokeWidth="10" 
                    fill="none" 
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    style={{ filter: 'drop-shadow(0 0 8px #fa91ba)' }}
                  />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Pixel Stars */}
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2].map((i) => (
              <div key={i} 
                className="pixel-flash" 
                style={{ 
                  width: '24px', 
                  height: '24px',
                  backgroundColor: '#ffd700',
                  border: '3px solid #ffaa00',
                  boxShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
                  animationDelay: `${i * 0.2}s`,
                  clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                }}
              />
            ))}
          </div>
          
          {/* Text */}
          <h1 className={`${titleFontClass} text-5xl mb-3 pixel-flash`} style={{ 
            color: '#fa91ba',
            textShadow: '4px 4px 0 #312459, 0 0 20px rgba(250, 145, 186, 0.5)'
          }}>
            {language === 'ar' ? 'نجاح!' : 'SUCCESS!'}
          </h1>
          <p className={`${fontClass} text-2xl font-bold`} style={{ 
            color: '#ffffff',
            textShadow: '2px 2px 0 #312459'
          }}>
            {language === 'ar' ? 'تم التسجيل بنجاح' : 'Registration Complete'}
          </p>
          
          {/* XP Badge */}
          <div className="mt-6 inline-block px-6 py-3" style={{
            backgroundColor: '#312459',
            border: '4px solid #fa91ba',
            boxShadow: '0 4px 0 #1a1a2e'
          }}>
            <span className={`${titleFontClass} text-xl`} style={{ color: '#ffd700' }}>+1000 XP</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function TalkTechForm() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('ar');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    category: '',
    category_other: '',
    tech_interests: [],
    tech_interests_other: '',
    goal: '',
    goal_other: '',
    confirmed_attendance: false,
  });

  const t = translations[language];
  const isRTL = language === 'ar';
  const fontClass = isRTL ? 'font-tajawal' : 'font-noto';
  const titleFontClass = isRTL ? 'font-tajawal font-black' : 'font-boldpixels';

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(v => v !== value)
    }));
  };

  const validateStep = (step) => {
    let errorMsg = '';
    const newFieldErrors = {};
    
    switch(step) {
      case 1:
        if (!formData.full_name.trim()) {
          errorMsg = language === 'ar' ? 'الرجاء إدخال الاسم الكامل' : 'Please enter your full name';
          newFieldErrors.full_name = true;
        } else if (!formData.phone.trim()) {
          errorMsg = language === 'ar' ? 'الرجاء إدخال رقم الهاتف' : 'Please enter your phone number';
          newFieldErrors.phone = true;
        } else if (!/^[+]?[\d\s-()]{8,}$/.test(formData.phone.trim())) {
          errorMsg = language === 'ar' ? 'رقم الهاتف غير صحيح' : 'Invalid phone number';
          newFieldErrors.phone = true;
        } else if (!formData.email.trim()) {
          errorMsg = language === 'ar' ? 'الرجاء إدخال البريد الإلكتروني' : 'Please enter your email';
          newFieldErrors.email = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          errorMsg = language === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email format';
          newFieldErrors.email = true;
        }
        break;
      case 2:
        if (!formData.category) {
          errorMsg = language === 'ar' ? 'الرجاء اختيار الفئة' : 'Please select your category';
        } else if (formData.category === 'other' && !formData.category_other.trim()) {
          errorMsg = language === 'ar' ? 'الرجاء تحديد الفئة الأخرى' : 'Please specify other category';
        }
        break;
      case 3:
        if (formData.tech_interests.length === 0) {
          errorMsg = language === 'ar' ? 'الرجاء اختيار اهتمام واحد على الأقل' : 'Please select at least one interest';
        }
        break;
      case 4:
        if (!formData.goal) {
          errorMsg = language === 'ar' ? 'الرجاء اختيار هدفك من الحضور' : 'Please select your goal';
        } else if (formData.goal === 'other' && !formData.goal_other.trim()) {
          errorMsg = language === 'ar' ? 'الرجاء تحديد الهدف الآخر' : 'Please specify other goal';
        }
        break;
      case 5:
        if (!formData.confirmed_attendance) {
          errorMsg = language === 'ar' ? 'يرجى تأكيد الحضور' : 'Please confirm your attendance';
        }
        break;
      default:
        return { isValid: true, errorMsg: '' };
    }
    
    setFieldErrors(newFieldErrors);
    return { isValid: !errorMsg, errorMsg };
  };

  const nextStep = () => {
    const validation = validateStep(currentStep);
    if (validation.isValid) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(prev => Math.min(prev + 1, 5));
        setIsTransitioning(false);
      }, 300);
    } else {
      toast.error(validation.errorMsg);
    }
  };

  const prevStep = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(prev => Math.max(prev - 1, 1));
      setIsTransitioning(false);
    }, 300);
  };

  const handleSubmit = async () => {
    const validation = validateStep(5);
    if (!validation.isValid) {
      toast.error(validation.errorMsg);
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${BACKEND_URL}/api/talktech/applications`, formData);
      // Show win animation first
      setShowWinAnimation(true);
      setTimeout(() => {
        setShowWinAnimation(false);
        setIsSuccess(true);
      }, 3000);
    } catch (error) {
      // Fix: Extract error message properly
      let errorMsg = language === 'ar' ? 'حدث خطأ' : 'An error occurred';
      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          errorMsg = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          errorMsg = error.response.data.detail.map(e => e.msg || e).join(', ');
        }
      }
      toast.error(errorMsg);
      setIsSubmitting(false);
    }
  };

  // Win Animation Screen
  if (showWinAnimation) {
    return <WinAnimation language={language} />;
  }

  // Success Screen
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-100 relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .float-animation { animation: float 3s ease-in-out infinite; }
        `}</style>
        
        {/* Header */}
        <header className="bg-white border-b-4 border-gray-700 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={TOPTECH_LOGO2} alt="TalkTech Bloom" className="w-10 h-10 object-contain" />
              <h1 className="font-sans font-extrabold text-xl" style={{ color: COLORS.primary }}>TalkTech Bloom Event</h1>
            </div>
            <button
              onClick={toggleLanguage}
              className={`px-4 py-2 ${fontClass} font-bold text-sm border-2 hover:bg-gray-50`}
              style={{ 
                borderColor: COLORS.primary, 
                color: COLORS.primary,
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.15)'
              }}
            >
              {t.langToggle}
            </button>
          </div>
        </header>
        
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
          <div className="bg-white border-4 border-gray-700 p-8 max-w-lg w-full text-center" style={{ boxShadow: '8px 8px 0 #535353' }}>
            {/* Pixel Checkmark */}
            <div className="inline-block mb-6 float-animation">
              <div className="relative" style={{ 
                width: '100px', 
                height: '100px',
                backgroundColor: COLORS.primary,
                border: '5px solid ' + COLORS.accent,
                boxShadow: '0 0 0 3px ' + COLORS.primary + ', 0 6px 0 #535353, 0 0 20px rgba(250, 145, 186, 0.3)'
              }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="60" height="60" viewBox="0 0 70 70">
                    <path d="M10 35 L25 50 L60 15" 
                      stroke={COLORS.accent} 
                      strokeWidth="10" 
                      fill="none" 
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      style={{ filter: 'drop-shadow(0 0 8px ' + COLORS.accent + ')' }}
                    />
                  </svg>
                </div>
              </div>
            </div>
            
            <h1 className={`${titleFontClass} text-xl md:text-2xl mb-2`} style={{ color: COLORS.primary }}>
              {t.successTitle}
            </h1>
            <p className={`${titleFontClass} text-lg mb-4`} style={{ color: COLORS.accent }}>
              {t.successSubtitle}
            </p>
            
            <p className={`${fontClass} text-lg text-gray-800 mb-4`}>{t.successMessage}</p>
            <p className={`${fontClass} text-gray-600 text-sm mb-6`}>{t.successSubMessage}</p>
            
            {/* Social Media - Combined */}
            <div className="bg-gray-100 border-2 border-gray-400 p-6 mb-6">
              <div className="grid grid-cols-2 gap-6">
                {/* WhatsApp */}
                <div className="text-center">
                  <p className={`${fontClass} font-bold text-gray-800 text-sm mb-3`}>{t.whatsappTitle}</p>
                  <a 
                    href={t.whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block transition-transform hover:scale-110"
                  >
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <rect width="48" height="48" rx="8" fill="#25D366"/>
                      <path d="M24 12C17.4 12 12 17.4 12 24C12 26.1 12.6 28.1 13.6 29.8L12.2 34.8L17.4 33.5C19 34.4 20.9 35 24 35C30.6 35 36 29.6 36 23C36 16.4 30.6 12 24 12ZM29.5 27.5C29.2 28.3 27.9 29 27.2 29.1C26.7 29.1 26.1 29.3 23.9 28.4C21.2 27.3 19.5 24.5 19.3 24.3C19.2 24.1 18.2 22.8 18.2 21.4C18.2 20 18.9 19.3 19.2 19C19.5 18.7 19.8 18.6 20.1 18.6C20.2 18.6 20.4 18.6 20.5 18.6C20.8 18.6 21 18.6 21.2 19.1C21.5 19.7 22.1 21.1 22.2 21.2C22.3 21.3 22.3 21.5 22.2 21.7C22.1 21.9 22.1 22 21.9 22.2C21.8 22.4 21.6 22.6 21.5 22.7C21.3 22.9 21.1 23.1 21.3 23.4C21.5 23.7 22.1 24.7 23 25.5C24.1 26.5 25.1 26.8 25.4 27C25.7 27.1 25.9 27.1 26.1 26.9C26.3 26.7 26.8 26.1 27 25.8C27.2 25.5 27.5 25.6 27.7 25.7C28 25.8 29.4 26.5 29.7 26.6C30 26.8 30.2 26.9 30.3 27C30.3 27.2 30.3 27.8 29.5 27.5Z" fill="white"/>
                    </svg>
                  </a>
                </div>
                
                {/* Instagram */}
                <div className="text-center">
                  <p className={`${fontClass} font-bold text-gray-800 text-sm mb-3`}>{t.instagramTitle}</p>
                  <a 
                    href={t.instagramLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block transition-transform hover:scale-110"
                  >
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <rect width="48" height="48" rx="8" fill="url(#instagram-gradient)"/>
                      <defs>
                        <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" style={{ stopColor: '#FD5949' }}/>
                          <stop offset="50%" style={{ stopColor: '#D6249F' }}/>
                          <stop offset="100%" style={{ stopColor: '#285AEB' }}/>
                        </linearGradient>
                      </defs>
                      <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="2" fill="none"/>
                      <circle cx="31" cy="17" r="1.5" fill="white"/>
                      <rect x="14" y="14" width="20" height="20" rx="5" stroke="white" strokeWidth="2" fill="none"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <p className={`${fontClass} text-gray-700 text-sm mb-4`}>{t.finalMessage}</p>
            <p className={`${titleFontClass} font-bold text-lg`} style={{ color: COLORS.primary }}>{t.welcomeMessage}</p>
            
            <button
              onClick={() => navigate('/')}
              className={`mt-6 px-6 py-3 text-white ${titleFontClass} hover:bg-gray-600 transition-colors border-b-4 active:border-b-0 active:mt-7`}
              style={{ 
                backgroundColor: COLORS.primary,
                borderBottomColor: '#1a1a3e'
              }}
            >
              {t.backToHome}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700;800&family=Noto+Sans:wght@400;500;600;700;800&display=swap');
        
        @keyframes slide-out {
          0% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(${isRTL ? '50px' : '-50px'}); }
        }
        @keyframes slide-in {
          0% { opacity: 0; transform: translateX(${isRTL ? '-50px' : '50px'}); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .slide-out { animation: slide-out 0.3s ease-out forwards; }
        .slide-in { animation: slide-in 0.3s ease-out forwards; }
        
        .pixel-input {
          font-family: 'Noto Sans Arabic', 'Noto Sans', sans-serif;
          background: white;
          border: 3px solid #535353;
          padding: 14px 16px;
          outline: none;
          transition: all 0.2s;
          color: #1a1a1a;
          font-size: 16px;
        }
        .pixel-input:focus {
          border-color: ${COLORS.primary};
          box-shadow: 4px 4px 0 ${COLORS.accent};
        }
        .pixel-input::placeholder {
          color: #888;
        }
        
        .pixel-radio, .pixel-checkbox {
          appearance: none;
          width: 22px;
          height: 22px;
          border: 3px solid #535353;
          background: white;
          cursor: pointer;
          flex-shrink: 0;
        }
        .pixel-radio:checked, .pixel-checkbox:checked {
          background: ${COLORS.primary};
          border-color: ${COLORS.primary};
        }
        
        .pixel-btn {
          font-family: 'BoldPixels', 'Noto Sans Arabic', sans-serif;
          background: ${COLORS.primary};
          color: white;
          padding: 14px 28px;
          border: none;
          border-bottom: 4px solid #1a1a3e;
          cursor: pointer;
          transition: all 0.1s;
          font-size: 14px;
        }
        .pixel-btn:hover {
          background: #4a3479;
        }
        .pixel-btn:active {
          border-bottom-width: 0;
          margin-top: 4px;
        }
        .pixel-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .pixel-btn-secondary {
          background: #535353;
          border-bottom-color: #333;
        }
        .pixel-btn-secondary:hover {
          background: #666;
        }
        
        .section-box {
          background: white;
          border: 4px solid #535353;
          box-shadow: 8px 8px 0 #c4c4c4;
        }
        
        .step-indicator {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #535353;
          font-weight: bold;
          font-size: 16px;
          background: white;
          color: #535353;
        }
        .step-indicator.active {
          background: ${COLORS.primary};
          color: white;
          border-color: ${COLORS.primary};
        }
        .step-indicator.completed {
          background: ${COLORS.accent};
          color: white;
          border-color: ${COLORS.accent};
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-gray-700 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={TOPTECH_LOGO2} alt="TalkTech Bloom" className="w-10 h-10 object-contain" />
            <h1 className="font-sans font-extrabold text-lg md:text-xl" style={{ color: COLORS.primary }}>
              TalkTech Bloom Event
            </h1>
          </div>
          
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 font-noto font-bold text-sm border-2 hover:bg-gray-50"
            style={{ 
              borderColor: COLORS.primary, 
              color: COLORS.primary,
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.15)'
            }}
          >
            {t.langToggle}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 relative z-10">
        {/* Step Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((step) => (
            <React.Fragment key={step}>
              <div className={`step-indicator font-boldpixels ${
                currentStep === step ? 'active' : currentStep > step ? 'completed' : ''
              }`}>
                {currentStep > step ? '✓' : step}
              </div>
              {step < 5 && (
                <div className={`w-6 sm:w-10 h-1 ${currentStep > step ? 'bg-pink-400' : 'bg-gray-300'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Content with transition */}
        <div className={isTransitioning ? 'slide-out' : 'slide-in'}>
          {/* Event Info (Step 1 only) */}
          {currentStep === 1 && (
            <div className="section-box p-6 mb-6">
              <h2 className={`${titleFontClass} text-xl mb-4 flex items-center gap-2`} style={{ color: COLORS.primary }}>
                <Sparkles size={20} style={{ color: COLORS.primary }} />
                {t.aboutEvent}
              </h2>
              <p className={`${fontClass} text-gray-800 mb-4 text-base leading-relaxed`}>{t.eventDescription}</p>
              
              <p className={`${fontClass} font-bold text-gray-800 text-base mb-3`}>{t.eventIncludes}</p>
              <div className={`${fontClass} text-base text-gray-700 mb-4 space-y-1`}>
                <p>{t.eventInclude1}</p>
                <p>{t.eventInclude2}</p>
                <p>{t.eventInclude3}</p>
                <p>{t.eventInclude4}</p>
                <p>{t.eventInclude5}</p>
              </div>
              
              <p className={`${fontClass} font-bold text-gray-800 text-base mb-3 mt-5`}>{t.cornersTitle}</p>
              <div className={`${fontClass} text-base text-gray-700 mb-4 space-y-1`}>
                <p>{t.corner1}</p>
                <p>{t.corner2}</p>
                <p>{t.corner3}</p>
                <p>{t.corner4}</p>
                <p>{t.corner5}</p>
                <p>{t.corner6}</p>
              </div>
              
              <div className={`bg-purple-50 p-4 border-2 border-purple-300 ${fontClass} text-gray-800 mt-5`}>
                <p className="font-bold flex items-center gap-2"><Calendar size={18} style={{ color: COLORS.primary }} /> {t.eventDate}</p>
                <p className="font-bold flex items-center gap-2"><Clock size={18} style={{ color: COLORS.primary }} /> {t.eventTime}</p>
                <p className="font-bold flex items-center gap-2"><MapPin size={18} style={{ color: COLORS.primary }} /> {t.eventLocation}</p>
              </div>
              
              <p className={`${fontClass} text-sm text-gray-600 mt-4`}>{t.eventTarget}</p>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="section-box p-6">
              <h3 className={`${titleFontClass} text-lg mb-2 flex items-center gap-2`} style={{ color: COLORS.primary }}>
                <span className="inline-flex items-center justify-center w-7 h-7 text-white font-boldpixels text-xs border-2 border-gray-700" style={{ backgroundColor: COLORS.primary }}>1</span>
                {t.section1Title}
              </h3>
              <p className={`${fontClass} text-gray-600 text-sm mb-4`}>{t.section1Subtitle}</p>
              
              <div className="space-y-5">
                <div>
                  <label className={`${fontClass} font-bold text-gray-800 block mb-2`}>{t.fullName} *</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => {
                      handleInputChange('full_name', e.target.value);
                      if (fieldErrors.full_name) {
                        setFieldErrors(prev => ({ ...prev, full_name: false }));
                      }
                    }}
                    placeholder={t.fullNamePlaceholder}
                    className="pixel-input w-full"
                    style={fieldErrors.full_name ? { borderColor: '#ef4444', borderWidth: '3px' } : {}}
                  />
                </div>
                
                <div>
                  <label className={`${fontClass} font-bold text-gray-800 block mb-2 flex items-center gap-2`}>
                    <Smartphone size={18} style={{ color: COLORS.primary }} />
                    {t.phone} *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      handleInputChange('phone', e.target.value);
                      if (fieldErrors.phone) {
                        setFieldErrors(prev => ({ ...prev, phone: false }));
                      }
                    }}
                    placeholder={t.phonePlaceholder}
                    className="pixel-input w-full"
                    style={fieldErrors.phone ? { borderColor: '#ef4444', borderWidth: '3px' } : {}}
                    dir="ltr"
                  />
                  <p className={`${fontClass} text-sm text-gray-600 mt-2`}>{t.phoneNote}</p>
                </div>
                
                <div>
                  <label className={`${fontClass} font-bold text-gray-800 block mb-2 flex items-center gap-2`}>
                    <Mail size={18} style={{ color: COLORS.primary }} />
                    {t.email} *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      handleInputChange('email', e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors(prev => ({ ...prev, email: false }));
                      }
                    }}
                    placeholder={t.emailPlaceholder}
                    className="pixel-input w-full"
                    style={fieldErrors.email ? { borderColor: '#ef4444', borderWidth: '3px' } : {}}
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Category */}
          {currentStep === 2 && (
            <div className="section-box p-6">
              <h3 className={`${titleFontClass} text-lg mb-4 flex items-center gap-2`} style={{ color: COLORS.primary }}>
                <span className="inline-flex items-center justify-center w-7 h-7 text-white font-boldpixels text-xs border-2 border-gray-700" style={{ backgroundColor: COLORS.primary }}>2</span>
                {t.section2Title}
              </h3>
              
              <div className="space-y-3">
                {['student', 'graduate', 'working', 'other'].map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 border-2 border-transparent hover:border-gray-200">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={formData.category === cat}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="pixel-radio"
                    />
                    <span className={`${fontClass} text-gray-800`}>{t[`category_${cat}`]}</span>
                  </label>
                ))}
                
                {formData.category === 'other' && (
                  <input
                    type="text"
                    value={formData.category_other}
                    onChange={(e) => handleInputChange('category_other', e.target.value)}
                    placeholder={t.categoryOtherPlaceholder}
                    className="pixel-input w-full mt-2"
                  />
                )}
              </div>
            </div>
          )}

          {/* Step 3: Tech Interests */}
          {currentStep === 3 && (
            <div className="section-box p-6">
              <h3 className={`${titleFontClass} text-lg mb-2 flex items-center gap-2`} style={{ color: COLORS.primary }}>
                <span className="inline-flex items-center justify-center w-7 h-7 text-white font-boldpixels text-xs border-2 border-gray-700" style={{ backgroundColor: COLORS.primary }}>3</span>
                {t.section3Title}
              </h3>
              <p className={`${fontClass} text-gray-600 text-sm mb-4`}>{t.section3Subtitle}</p>
              
              <div className="space-y-3">
                {['frontend', 'backend', 'games', 'data', 'ai', 'security', 'other'].map((interest) => (
                  <label key={interest} className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 border-2 border-transparent hover:border-gray-200">
                    <input
                      type="checkbox"
                      checked={formData.tech_interests.includes(interest)}
                      onChange={(e) => handleCheckboxChange('tech_interests', interest, e.target.checked)}
                      className="pixel-checkbox"
                    />
                    <span className={`${fontClass} text-gray-800`}>{t[`interest_${interest}`]}</span>
                  </label>
                ))}
                
                {formData.tech_interests.includes('other') && (
                  <input
                    type="text"
                    value={formData.tech_interests_other}
                    onChange={(e) => handleInputChange('tech_interests_other', e.target.value)}
                    placeholder={t.interestOtherPlaceholder}
                    className="pixel-input w-full mt-2"
                  />
                )}
              </div>
            </div>
          )}

          {/* Step 4: Goal */}
          {currentStep === 4 && (
            <div className="section-box p-6">
              <h3 className={`${titleFontClass} text-lg mb-2 flex items-center gap-2`} style={{ color: COLORS.primary }}>
                <span className="inline-flex items-center justify-center w-7 h-7 text-white font-boldpixels text-xs border-2 border-gray-700" style={{ backgroundColor: COLORS.primary }}>4</span>
                {t.section4Title}
              </h3>
              <p className={`${fontClass} text-gray-600 text-sm mb-4`}>{t.section4Subtitle}</p>
              
              <div className="space-y-3">
                {['path', 'market', 'networking', 'inspiration', 'other'].map((goal) => (
                  <label key={goal} className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 border-2 border-transparent hover:border-gray-200">
                    <input
                      type="radio"
                      name="goal"
                      value={goal}
                      checked={formData.goal === goal}
                      onChange={(e) => handleInputChange('goal', e.target.value)}
                      className="pixel-radio"
                    />
                    <span className={`${fontClass} text-gray-800`}>{t[`goal_${goal}`]}</span>
                  </label>
                ))}
                
                {formData.goal === 'other' && (
                  <input
                    type="text"
                    value={formData.goal_other}
                    onChange={(e) => handleInputChange('goal_other', e.target.value)}
                    placeholder={t.goalOtherPlaceholder}
                    className="pixel-input w-full mt-2"
                  />
                )}
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && (
            <div className="section-box p-6">
              <h3 className={`${titleFontClass} text-lg mb-4 flex items-center gap-2`} style={{ color: COLORS.primary }}>
                <span className="inline-flex items-center justify-center w-7 h-7 text-white font-boldpixels text-xs border-2 border-gray-700" style={{ backgroundColor: COLORS.primary }}>5</span>
                {t.section5Title}
              </h3>
              
              <div className="bg-yellow-50 border-2 border-yellow-500 p-4 mb-4">
                <p className={`${fontClass} text-gray-800 text-base mb-2 flex items-center gap-2`}>
                  <CheckSquare size={20} style={{ color: COLORS.primary }} />
                  {t.confirmText}
                </p>
                <p className={`${fontClass} text-red-600 text-sm font-bold`}>{t.confirmWarning}</p>
              </div>
              
              <p className={`${fontClass} font-bold text-gray-800 text-base mb-3`}>{t.confirmQuestion}</p>
              
              <label className="flex items-center gap-3 cursor-pointer p-4 border-3 border-gray-400 hover:border-purple-500 bg-white">
                <input
                  type="checkbox"
                  checked={formData.confirmed_attendance}
                  onChange={(e) => handleInputChange('confirmed_attendance', e.target.checked)}
                  className="pixel-checkbox"
                />
                <span className={`${fontClass} text-gray-800 text-base font-bold`}>{t.confirmLabel}</span>
              </label>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className={`flex mt-6 gap-4 ${currentStep === 1 ? 'justify-center' : 'justify-between'}`}>
          {currentStep > 1 ? (
            <button onClick={prevStep} className="pixel-btn pixel-btn-secondary" disabled={isTransitioning}>
              {t.previous}
            </button>
          ) : (
            <>
              {/* <button onClick={() => navigate('/')} className="pixel-btn pixel-btn-secondary">
                {t.backToHome}
              </button> */}
            </>
          )}
          
          {currentStep < 5 ? (
            <button onClick={nextStep} className="pixel-btn" disabled={isTransitioning}>
              {t.next}
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !formData.confirmed_attendance}
              className="pixel-btn"
              style={{ background: formData.confirmed_attendance ? COLORS.accent : '#999' }}
            >
              {isSubmitting ? t.submitting : t.submit}
            </button>
          )}
        </div>
      </main>
      
      {/* Ground line at bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gray-600" />
    </div>
  );
}
