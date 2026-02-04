import React, { useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';
import axios from 'axios';
import { Gamepad2, Code, Palette, BookOpen, ChevronRight, ChevronLeft, Check, Sparkles, Instagram } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LOGO_URL = "/images/logos/Logo-1.png";
const MINISTRY_LOGO ="/images/logos/Ministry.png";
const SANAD_LOGO = "/images/logos/sanad.png";
const TOPTECH_LOGO = "/images/logos/Bloom-2.png";

// Syrian cities and rural areas
const syrianLocations = {
  en: [
    { value: '', label: 'Select your location...' },
    { value: 'damascus', label: 'Damascus (دمشق)' },
    { value: 'damascus_countryside', label: 'Damascus Countryside (ريف دمشق)' },
    { value: 'aleppo', label: 'Aleppo (حلب)' },
    { value: 'aleppo_countryside', label: 'Aleppo Countryside (ريف حلب)' },
    { value: 'homs', label: 'Homs (حمص)' },
    { value: 'homs_countryside', label: 'Homs Countryside (ريف حمص)' },
    { value: 'hama', label: 'Hama (حماة)' },
    { value: 'hama_countryside', label: 'Hama Countryside (ريف حماة)' },
    { value: 'latakia', label: 'Latakia (اللاذقية)' },
    { value: 'latakia_countryside', label: 'Latakia Countryside (ريف اللاذقية)' },
    { value: 'tartus', label: 'Tartus (طرطوس)' },
    { value: 'tartus_countryside', label: 'Tartus Countryside (ريف طرطوس)' },
    { value: 'idlib', label: 'Idlib (إدلب)' },
    { value: 'idlib_countryside', label: 'Idlib Countryside (ريف إدلب)' },
    { value: 'deir_ez_zor', label: 'Deir ez-Zor (دير الزور)' },
    { value: 'deir_ez_zor_countryside', label: 'Deir ez-Zor Countryside (ريف دير الزور)' },
    { value: 'raqqa', label: 'Raqqa (الرقة)' },
    { value: 'raqqa_countryside', label: 'Raqqa Countryside (ريف الرقة)' },
    { value: 'hasakah', label: 'Hasakah (الحسكة)' },
    { value: 'hasakah_countryside', label: 'Hasakah Countryside (ريف الحسكة)' },
    { value: 'daraa', label: "Daraa (درعا)" },
    { value: 'daraa_countryside', label: "Daraa Countryside (ريف درعا)" },
    { value: 'sweida', label: 'Sweida (السويداء)' },
    { value: 'sweida_countryside', label: 'Sweida Countryside (ريف السويداء)' },
    { value: 'quneitra', label: 'Quneitra (القنيطرة)' },
    { value: 'quneitra_countryside', label: 'Quneitra Countryside (ريف القنيطرة)' },
    { value: 'outside_syria', label: 'Outside Syria (خارج سوريا)' },
  ],
  ar: [
    { value: '', label: 'اختر موقعك...' },
    { value: 'damascus', label: 'دمشق' },
    { value: 'damascus_countryside', label: 'ريف دمشق' },
    { value: 'aleppo', label: 'حلب' },
    { value: 'aleppo_countryside', label: 'ريف حلب' },
    { value: 'homs', label: 'حمص' },
    { value: 'homs_countryside', label: 'ريف حمص' },
    { value: 'hama', label: 'حماة' },
    { value: 'hama_countryside', label: 'ريف حماة' },
    { value: 'latakia', label: 'اللاذقية' },
    { value: 'latakia_countryside', label: 'ريف اللاذقية' },
    { value: 'tartus', label: 'طرطوس' },
    { value: 'tartus_countryside', label: 'ريف طرطوس' },
    { value: 'idlib', label: 'إدلب' },
    { value: 'idlib_countryside', label: 'ريف إدلب' },
    { value: 'deir_ez_zor', label: 'دير الزور' },
    { value: 'deir_ez_zor_countryside', label: 'ريف دير الزور' },
    { value: 'raqqa', label: 'الرقة' },
    { value: 'raqqa_countryside', label: 'ريف الرقة' },
    { value: 'hasakah', label: 'الحسكة' },
    { value: 'hasakah_countryside', label: 'ريف الحسكة' },
    { value: 'daraa', label: 'درعا' },
    { value: 'daraa_countryside', label: 'ريف درعا' },
    { value: 'sweida', label: 'السويداء' },
    { value: 'sweida_countryside', label: 'ريف السويداء' },
    { value: 'quneitra', label: 'القنيطرة' },
    { value: 'quneitra_countryside', label: 'ريف القنيطرة' },
    { value: 'outside_syria', label: 'خارج سوريا' },
  ]
};

const mainFieldOptions = [
  { id: 'programming', icon: Code },
  { id: 'art', icon: Palette },
  { id: 'writing', icon: BookOpen },
  { id: 'player', icon: Gamepad2 },
  { id: 'other', icon: Sparkles },
];

const toolOptions = [
  'Unity', 'Unreal Engine', 'Godot', 'Blender', 
  'Photoshop/Illustrator', 'Interactive Writing Tools', 'Other'
];

const initialFormData = {
  full_name: '',
  age: '',
  residence: '',
  email: '',
  whatsapp: '',
  main_field: [],
  main_field_other: '',
  has_game_project: '',
  game_project_details: '',
  known_tools: [],
  known_tools_other: '',
  work_preference: '',
  time_commitment: '',
  internet_stability: '',
  has_game_idea: '',
  game_idea_details: '',
  join_reason: '',
  wants_elite_stage: '',
  final_notes: '',
};

// Particle effect component
const ParticleEffect = ({ x, y, color = '#FF3B3B', count = 12 }) => {
  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 360;
    const velocity = 50 + Math.random() * 100;
    const xOffset = Math.cos(angle * Math.PI / 180) * velocity;
    const yOffset = Math.sin(angle * Math.PI / 180) * velocity;
    
    return (
      <div
        key={i}
        className="particle"
        style={{
          left: x,
          top: y,
          backgroundColor: color,
          '--x': `${xOffset}px`,
          '--y': `${yOffset}px`,
        }}
      />
    );
  });
  
  return <div className="particle-container">{particles}</div>;
};

// Confetti effect for success
const ConfettiEffect = () => {
  const colors = ['#FF3B3B', '#4ADE80', '#FACC15', '#60A5FA', '#F472B6', '#A78BFA'];
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 8 + Math.random() * 8,
  }));
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confetti.map((c) => (
        <div
          key={c.id}
          className="confetti"
          style={{
            left: c.left,
            top: -20,
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            animationDelay: `${c.delay}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  );
};

// Success Screen Component
const SuccessScreen = ({ onReset, t, isRTL }) => {
  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* CRT Overlay */}
      <div className="crt-overlay" />
      <ConfettiEffect />
      
      {/* Stars Background */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
      
      <div className="relative max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Logos Row - Same as main form */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <img 
            src={TOPTECH_LOGO} 
            alt="Top Tech Bloom" 
            className="w-16 md:w-24 object-contain float-purple"
            style={{ animationDelay: '0.3s' }}
          />
          <img 
            src={LOGO_URL} 
            alt="Syria Gaming Lab" 
            className="w-28 md:w-40 float-red"
          />
          <img 
            src={SANAD_LOGO} 
            alt="Sanad" 
            className="w-16 md:w-24 object-contain float-blue"
            style={{ animationDelay: '0.5s' }}
          />
        </div>

        {/* Success Content */}
        <div className="text-center">
          {/* Pixel Art Trophy */}
          <div className="mb-6 level-up-text">
            <div className="inline-block p-4 border-4 border-[#FACC15] bg-black">
              <svg width="80" height="80" viewBox="0 0 20 20" className="mx-auto">
                {/* Pixel art trophy cup */}
                {/* Top rim */}
                <rect x="4" y="0" width="12" height="2" fill="#FACC15"/>
                {/* Cup body */}
                <rect x="3" y="2" width="14" height="2" fill="#FACC15"/>
                {/* Handles */}
                <rect x="0" y="2" width="3" height="2" fill="#FACC15"/>
                <rect x="17" y="2" width="3" height="2" fill="#FACC15"/>
                <rect x="0" y="4" width="2" height="4" fill="#FACC15"/>
                <rect x="18" y="4" width="2" height="4" fill="#FACC15"/>
                <rect x="0" y="8" width="3" height="2" fill="#FACC15"/>
                <rect x="17" y="8" width="3" height="2" fill="#FACC15"/>
                {/* Cup inside */}
                <rect x="3" y="4" width="2" height="6" fill="#FACC15"/>
                <rect x="5" y="4" width="10" height="6" fill="#F59E0B"/>
                <rect x="15" y="4" width="2" height="6" fill="#FACC15"/>
                {/* Cup bottom */}
                <rect x="4" y="10" width="12" height="2" fill="#FACC15"/>
                <rect x="6" y="12" width="8" height="2" fill="#FACC15"/>
                {/* Stem */}
                <rect x="8" y="14" width="4" height="2" fill="#FACC15"/>
                {/* Base */}
                <rect x="5" y="16" width="10" height="2" fill="#FACC15"/>
                <rect x="4" y="18" width="12" height="2" fill="#F59E0B"/>
              </svg>
            </div>
          </div>
          
          {/* Success Title - Pixel Style */}
          <h1 className={`text-2xl md:text-4xl mb-4 victory-bounce ${isRTL ? 'font-arabic' : 'font-pixel'}`}
              style={{ 
                color: '#4ADE80',
                textShadow: '3px 3px 0px #000, 0 0 10px #4ADE80, 0 0 20px #4ADE80'
              }}>
            {isRTL ? 'مهمة مكتملة!' : 'QUEST COMPLETE!'}
          </h1>
          
          {/* Message Card */}
          <div className="pixel-card max-w-lg mx-auto mb-8">
            <p className={`text-xl md:text-2xl text-[#4ADE80] mb-4 ${isRTL ? 'font-arabic' : 'font-pixel'}`}
               style={{ fontSize: isRTL ? '1.5rem' : '0.875rem', lineHeight: '1.8' }}>
              {isRTL 
                ? 'تم إرسال طلبك بنجاح!'
                : 'APPLICATION SENT!'}
            </p>
            <p className={`text-gray-300 mb-6 ${isRTL ? 'font-arabic text-lg' : ''}`}>
              {isRTL 
                ? 'سنراجع طلبك ونتواصل معك قريبًا. استعد للمغامرة!'
                : 'We will review your application and contact you soon. Get ready for the adventure!'}
            </p>
            
            {/* Instagram Follow Button */}
            <a
              href="https://www.instagram.com/syria.gaming.lab/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-5 py-2 border-2 border-[#E1306C] bg-black/50 hover:bg-[#E1306C]/20 transition-all duration-300 group"
            >
              <Instagram className="w-5 h-5 text-[#E1306C] group-hover:scale-110 transition-transform" />
              <span className={`text-[#E1306C] ${isRTL ? 'font-arabic text-base' : 'font-pixel text-xs'}`}>
                {isRTL ? 'تابعنا على انستغرام' : 'FOLLOW US ON INSTAGRAM'}
              </span>
            </a>
          </div>
          
          {/* XP Badge */}
          <div className="mb-8">
            <div className="inline-block px-6 py-3 border-4 border-[#4ADE80] bg-black">
              <span className={`text-[#4ADE80] ${isRTL ? 'font-arabic text-xl' : 'font-pixel text-sm'}`}>
                {isRTL ? '+1000 نقطة خبرة' : '+1000 XP'}
              </span>
            </div>
          </div>
          
          {/* Button */}
          <button
            onClick={onReset}
            className="pixel-btn pixel-btn-secondary"
            data-testid="submit-another-btn"
          >
            {isRTL ? 'تقديم طلب آخر' : 'SUBMIT ANOTHER'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ApplicationForm() {
  const { t, isRTL, toggleLanguage, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [particles, setParticles] = useState([]);
  const [logosAnimating, setLogosAnimating] = useState(false);
  
  const totalSteps = 3;
  const locations = syrianLocations[language] || syrianLocations.en;
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };
  
  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const current = prev[field] || [];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(v => v !== value) };
      }
      return { ...prev, [field]: [...current, value] };
    });
  };
  
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0) {
      if (!formData.full_name.trim()) newErrors.full_name = t('required');
      if (!formData.age || formData.age < 10 || formData.age > 100) newErrors.age = t('required');
      if (!formData.residence) newErrors.residence = t('required');
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = t('invalidEmail');
      }
      if (!formData.whatsapp.trim()) newErrors.whatsapp = t('required');
    }
    
    if (step === 1) {
      if (formData.main_field.length === 0) newErrors.main_field = t('selectOne');
      if (!formData.has_game_project) newErrors.has_game_project = t('required');
      if (formData.known_tools.length === 0) newErrors.known_tools = t('selectOne');
      if (!formData.work_preference) newErrors.work_preference = t('required');
      if (!formData.time_commitment) newErrors.time_commitment = t('required');
      if (!formData.internet_stability) newErrors.internet_stability = t('required');
    }
    
    if (step === 2) {
      if (!formData.has_game_idea) newErrors.has_game_idea = t('required');
      if (!formData.join_reason.trim()) newErrors.join_reason = t('required');
      if (!formData.wants_elite_stage) newErrors.wants_elite_stage = t('required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const createParticles = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    const id = Date.now();
    setParticles(prev => [...prev, { id, x, y }]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 1000);
  }, []);
  
  const handleCohortClick = () => {
    setLogosAnimating(true);
    setTimeout(() => setLogosAnimating(false), 1500);
  };
  
  const handleNext = (e) => {
    if (validateStep(currentStep)) {
      createParticles(e);
      // Delay page change to show particle animation
      setTimeout(() => {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
      }, 400);
    }
  };
  
  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  
  const handleSubmit = async (e) => {
    if (!validateStep(currentStep)) return;
    
    createParticles(e);
    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        age: parseInt(formData.age),
      };
      
      await axios.post(`${API}/applications`, submitData);
      
      // Delay to show particles
      setTimeout(() => {
        setIsSubmitted(true);
      }, 500);
      
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to submit application';
      toast.error(message);
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
    setIsSubmitted(false);
    setErrors({});
    setIsSubmitting(false);
  };
  
  if (isSubmitted) {
    return <SuccessScreen onReset={resetForm} t={t} isRTL={isRTL} />;
  }
  
  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* CRT Overlay */}
      <div className="crt-overlay" />
      
      {/* Particles */}
      {particles.map(p => (
        <ParticleEffect key={p.id} x={p.x} y={p.y} />
      ))}
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 300}px`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
        
        {/* Floating Detailed Pixel Planets */}
        <div className="planet planet-purple" style={{ left: '2%', top: '50px' }}>
          <svg width="100" height="100" viewBox="0 0 32 32" style={{ opacity: 0.3 }}>
            {/* Detailed Purple Saturn-like planet */}
            <rect x="12" y="4" width="2" height="2" fill="#7C3AED"/>
            <rect x="14" y="4" width="4" height="2" fill="#8B5CF6"/>
            <rect x="18" y="4" width="2" height="2" fill="#7C3AED"/>
            <rect x="10" y="6" width="2" height="2" fill="#7C3AED"/>
            <rect x="12" y="6" width="8" height="2" fill="#A78BFA"/>
            <rect x="20" y="6" width="2" height="2" fill="#7C3AED"/>
            <rect x="8" y="8" width="2" height="2" fill="#7C3AED"/>
            <rect x="10" y="8" width="4" height="2" fill="#A78BFA"/>
            <rect x="14" y="8" width="4" height="2" fill="#C4B5FD"/>
            <rect x="18" y="8" width="4" height="2" fill="#A78BFA"/>
            <rect x="22" y="8" width="2" height="2" fill="#7C3AED"/>
            {/* Ring behind */}
            <rect x="2" y="10" width="4" height="2" fill="#C4B5FD"/>
            <rect x="6" y="10" width="2" height="2" fill="#8B5CF6"/>
            <rect x="8" y="10" width="16" height="2" fill="#A78BFA"/>
            <rect x="24" y="10" width="2" height="2" fill="#8B5CF6"/>
            <rect x="26" y="10" width="4" height="2" fill="#C4B5FD"/>
            {/* Middle */}
            <rect x="0" y="12" width="4" height="2" fill="#DDD6FE"/>
            <rect x="4" y="12" width="2" height="2" fill="#A78BFA"/>
            <rect x="6" y="12" width="2" height="2" fill="#7C3AED"/>
            <rect x="8" y="12" width="4" height="2" fill="#A78BFA"/>
            <rect x="12" y="12" width="4" height="2" fill="#C4B5FD"/>
            <rect x="16" y="12" width="4" height="2" fill="#A78BFA"/>
            <rect x="20" y="12" width="4" height="2" fill="#8B5CF6"/>
            <rect x="24" y="12" width="2" height="2" fill="#7C3AED"/>
            <rect x="26" y="12" width="2" height="2" fill="#A78BFA"/>
            <rect x="28" y="12" width="4" height="2" fill="#DDD6FE"/>
            {/* Ring front */}
            <rect x="2" y="14" width="4" height="2" fill="#C4B5FD"/>
            <rect x="6" y="14" width="2" height="2" fill="#8B5CF6"/>
            <rect x="8" y="14" width="16" height="2" fill="#A78BFA"/>
            <rect x="24" y="14" width="2" height="2" fill="#8B5CF6"/>
            <rect x="26" y="14" width="4" height="2" fill="#C4B5FD"/>
            {/* Bottom */}
            <rect x="8" y="16" width="2" height="2" fill="#7C3AED"/>
            <rect x="10" y="16" width="4" height="2" fill="#A78BFA"/>
            <rect x="14" y="16" width="4" height="2" fill="#8B5CF6"/>
            <rect x="18" y="16" width="4" height="2" fill="#A78BFA"/>
            <rect x="22" y="16" width="2" height="2" fill="#7C3AED"/>
            <rect x="10" y="18" width="2" height="2" fill="#7C3AED"/>
            <rect x="12" y="18" width="8" height="2" fill="#8B5CF6"/>
            <rect x="20" y="18" width="2" height="2" fill="#7C3AED"/>
            <rect x="12" y="20" width="2" height="2" fill="#7C3AED"/>
            <rect x="14" y="20" width="4" height="2" fill="#8B5CF6"/>
            <rect x="18" y="20" width="2" height="2" fill="#7C3AED"/>
          </svg>
        </div>
        
        <div className="planet planet-red" style={{ right: '8%', top: '40px' }}>
          <svg width="120" height="120" viewBox="0 0 24 24" style={{ opacity: 0.25 }}>
            {/* Detailed Red Mars planet - circular */}
            <rect x="9" y="2" width="6" height="2" fill="#DC2626"/>
            <rect x="6" y="4" width="12" height="2" fill="#EF4444"/>
            <rect x="4" y="6" width="16" height="2" fill="#F87171"/>
            <rect x="3" y="8" width="18" height="2" fill="#EF4444"/>
            <rect x="2" y="10" width="20" height="2" fill="#F87171"/>
            <rect x="2" y="12" width="20" height="2" fill="#EF4444"/>
            <rect x="3" y="14" width="18" height="2" fill="#EF4444"/>
            <rect x="4" y="16" width="16" height="2" fill="#F87171"/>
            <rect x="6" y="18" width="12" height="2" fill="#EF4444"/>
            <rect x="9" y="20" width="6" height="2" fill="#DC2626"/>
            {/* Craters */}
            <rect x="7" y="6" width="2" height="2" fill="#B91C1C"/>
            <rect x="14" y="8" width="3" height="2" fill="#B91C1C"/>
            <rect x="5" y="12" width="2" height="2" fill="#B91C1C"/>
            <rect x="12" y="14" width="2" height="2" fill="#991B1B"/>
            <rect x="8" y="16" width="2" height="2" fill="#B91C1C"/>
          </svg>
        </div>
        
        <div className="planet planet-blue" style={{ left: '8%', top: '220px' }}>
          <svg width="110" height="110" viewBox="0 0 24 24" style={{ opacity: 0.25 }}>
            {/* Detailed Blue Earth-like planet - circular */}
            <rect x="9" y="2" width="6" height="2" fill="#0284C7"/>
            <rect x="6" y="4" width="12" height="2" fill="#38BDF8"/>
            <rect x="4" y="6" width="4" height="2" fill="#38BDF8"/>
            <rect x="8" y="6" width="4" height="2" fill="#22C55E"/>
            <rect x="12" y="6" width="4" height="2" fill="#7DD3FC"/>
            <rect x="16" y="6" width="4" height="2" fill="#38BDF8"/>
            <rect x="3" y="8" width="4" height="2" fill="#38BDF8"/>
            <rect x="7" y="8" width="3" height="2" fill="#22C55E"/>
            <rect x="10" y="8" width="6" height="2" fill="#7DD3FC"/>
            <rect x="16" y="8" width="5" height="2" fill="#38BDF8"/>
            <rect x="2" y="10" width="4" height="2" fill="#7DD3FC"/>
            <rect x="6" y="10" width="4" height="2" fill="#38BDF8"/>
            <rect x="10" y="10" width="4" height="2" fill="#BAE6FD"/>
            <rect x="14" y="10" width="6" height="2" fill="#38BDF8"/>
            <rect x="20" y="10" width="2" height="2" fill="#0284C7"/>
            <rect x="2" y="12" width="3" height="2" fill="#38BDF8"/>
            <rect x="5" y="12" width="3" height="2" fill="#22C55E"/>
            <rect x="8" y="12" width="8" height="2" fill="#7DD3FC"/>
            <rect x="16" y="12" width="4" height="2" fill="#38BDF8"/>
            <rect x="20" y="12" width="2" height="2" fill="#0284C7"/>
            <rect x="3" y="14" width="4" height="2" fill="#38BDF8"/>
            <rect x="7" y="14" width="4" height="2" fill="#7DD3FC"/>
            <rect x="11" y="14" width="3" height="2" fill="#22C55E"/>
            <rect x="14" y="14" width="4" height="2" fill="#38BDF8"/>
            <rect x="18" y="14" width="3" height="2" fill="#0284C7"/>
            <rect x="4" y="16" width="4" height="2" fill="#38BDF8"/>
            <rect x="8" y="16" width="8" height="2" fill="#7DD3FC"/>
            <rect x="16" y="16" width="4" height="2" fill="#38BDF8"/>
            <rect x="6" y="18" width="12" height="2" fill="#38BDF8"/>
            <rect x="9" y="20" width="6" height="2" fill="#0284C7"/>
          </svg>
        </div>
        
        <div className="planet planet-green" style={{ left: '78%', top: '200px' }}>
          <svg width="80" height="80" viewBox="0 0 24 24" style={{ opacity: 0.25 }}>
            {/* Detailed Green alien planet - circular */}
            <rect x="9" y="2" width="6" height="2" fill="#15803D"/>
            <rect x="6" y="4" width="12" height="2" fill="#22C55E"/>
            <rect x="4" y="6" width="16" height="2" fill="#4ADE80"/>
            <rect x="3" y="8" width="18" height="2" fill="#86EFAC"/>
            <rect x="2" y="10" width="20" height="2" fill="#4ADE80"/>
            <rect x="2" y="12" width="20" height="2" fill="#86EFAC"/>
            <rect x="3" y="14" width="18" height="2" fill="#4ADE80"/>
            <rect x="4" y="16" width="16" height="2" fill="#22C55E"/>
            <rect x="6" y="18" width="12" height="2" fill="#22C55E"/>
            <rect x="9" y="20" width="6" height="2" fill="#15803D"/>
            {/* Ring */}
            <rect x="0" y="10" width="2" height="2" fill="#BBF7D0"/>
            <rect x="22" y="10" width="2" height="2" fill="#BBF7D0"/>
            <rect x="0" y="12" width="2" height="2" fill="#BBF7D0"/>
            <rect x="22" y="12" width="2" height="2" fill="#BBF7D0"/>
          </svg>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 py-8 md:py-12">
          {/* Top Bar: Ministry Logo (left) | Language Toggle (right) */}
          <div className="flex items-center justify-between mb-8">
            <img 
              src={MINISTRY_LOGO} 
              alt="Ministry" 
              className="h-12 md:h-16 object-contain"
              data-testid="ministry-logo"
            />
            <button
              onClick={toggleLanguage}
              className="pixel-btn text-[10px] md:text-xs py-1 px-2 md:py-2 md:px-4 flex items-center gap-1 md:gap-2"
              style={{ 
                fontFamily: isRTL ? "'Cairo', sans-serif" : "'Press Start 2P', cursive", 
                fontWeight: 700,
                backgroundColor: '#FF3B3B',
                position: 'relative',
                zIndex: 50
              }}
              data-testid="language-toggle-btn"
            >
              <span 
                className="text-lg md:text-2xl leading-none"
                style={{ 
                  textShadow: '0 0 3px #fff, 0 0 5px #fff, 2px 2px 0 #000',
                  filter: 'drop-shadow(0 0 2px white)'
                }}
              >
                {isRTL ? '🇬🇧' : '🇸🇦'}
              </span>
              <span className="text-[8px] md:text-xs">{isRTL ? 'English' : 'العربية'}</span>
            </button>
          </div>
          
          {/* Logos Row: Main Logo + Sanad Logo */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-6 mb-6">
              <img 
                src={TOPTECH_LOGO} 
                alt="Top Tech Bloom" 
                className={`w-16 md:w-24 object-contain cursor-pointer ${logosAnimating ? 'logo-bounce-purple' : 'float-purple'}`}
                style={!logosAnimating ? { animationDelay: '0.3s' } : {}}
                onClick={handleCohortClick}
                data-testid="toptech-logo"
              />
              <img 
                src={LOGO_URL} 
                alt="Syria Gaming Lab" 
                className={`w-28 md:w-40 cursor-pointer ${logosAnimating ? 'logo-bounce-red' : 'float-red'}`}
                onClick={handleCohortClick}
                data-testid="main-logo"
              />
              <img 
                src={SANAD_LOGO} 
                alt="Sanad" 
                className={`w-16 md:w-24 object-contain cursor-pointer ${logosAnimating ? 'logo-bounce-blue' : 'float-blue'}`}
                style={!logosAnimating ? { animationDelay: '0.5s' } : {}}
                onClick={handleCohortClick}
                data-testid="sanad-logo"
              />
            </div>
            
            {/* 3D Title */}
            <h1 
              className={`text-2xl md:text-4xl lg:text-5xl mb-4 cursor-pointer ${isRTL ? 'font-arabic title-3d-arabic' : 'font-pixel title-3d'}`}
              data-testid="main-title"
            >
              {t('title')}
            </h1>
            
            {/* Enhanced Cohort Badge */}
            <div className={`relative mb-4 inline-flex items-center gap-2`}>
              {/* Animated Pixel Arrow - Left side in LTR, Right side in RTL */}
              {!isRTL && (
                <div className="animate-point-finger pointer-events-none">
                  <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                    <polygon points="0,8 16,8 16,2 28,10 16,18 16,12 0,12" fill="white" transform="translate(-1,-1)"/>
                    <polygon points="0,8 16,8 16,2 28,10 16,18 16,12 0,12" fill="white" transform="translate(1,1)"/>
                    <polygon points="0,8 16,8 16,2 28,10 16,18 16,12 0,12" fill="white" transform="translate(-1,1)"/>
                    <polygon points="0,8 16,8 16,2 28,10 16,18 16,12 0,12" fill="white" transform="translate(1,-1)"/>
                    <polygon points="0,8 16,8 16,2 28,10 16,18 16,12 0,12" fill="#FACC15"/>
                  </svg>
                </div>
              )}
              <div 
                className={`cohort-badge cursor-pointer ${isRTL ? 'font-arabic text-lg' : ''}`}
                onClick={handleCohortClick}
                data-testid="cohort-badge"
              >
                {t('cohort')}
              </div>
              {/* Arrow on right side for RTL, pointing RIGHT towards badge (which is on left in RTL) */}
              {isRTL && (
                <div className="animate-point-finger-rtl pointer-events-none">
                  <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                    <polygon points="0,8 16,8 16,2 28,10 16,18 16,12 0,12" fill="white" transform="translate(-1,-1)"/>
                    <polygon points="0,8 16,8 16,2 28,10 16,18 16,12 0,12" fill="white" transform="translate(1,1)"/>
                    <polygon points="0,8 16,8 16,2 28,10 16,18 16,12 0,12" fill="white" transform="translate(-1,1)"/>
                    <polygon points="0,8 16,8 16,2 28,10 16,18 16,12 0,12" fill="white" transform="translate(1,-1)"/>
                    <polygon points="0,8 16,8 16,2 28,10 16,18 16,12 0,12" fill="#FACC15"/>
                  </svg>
                </div>
              )}
            </div>
            
            <p className={`text-lg md:text-xl text-gray-300 ${isRTL ? 'font-arabic' : ''}`}>
              {t('subtitle')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
            {t('step')} {currentStep + 1} {t('of')} {totalSteps}
          </span>
          <span className={`text-sm text-[#FF3B3B] ${isRTL ? 'font-arabic' : 'font-pixel'}`}>
            {Math.round(((currentStep + 1) / totalSteps) * 100)}%
          </span>
        </div>
        <div className="health-bar" data-testid="progress-bar">
          <div 
            className="health-bar-fill"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Form Content */}
      <div className="max-w-3xl mx-auto px-4 pb-12">
        <div className="pixel-card slide-in" key={currentStep}>
          {/* Step 0: Personal Info */}
          {currentStep === 0 && (
            <div data-testid="step-personal-info">
              <h2 className={`text-xl md:text-2xl text-[#FF3B3B] mb-2 ${isRTL ? 'font-arabic' : 'font-pixel'}`}>
                {t('section1Title')}
              </h2>
              <p className={`text-gray-400 mb-8 ${isRTL ? 'font-arabic' : ''}`}>
                {t('section1Subtitle')}
              </p>
              
              <div className="mb-8">
                <h3 className={`text-lg text-[#4ADE80] mb-4 ${isRTL ? 'font-arabic' : 'font-pixel'} text-sm`}>
                  {t('personalInfo')}
                </h3>
                
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className={`block mb-2 ${isRTL ? 'font-arabic text-lg' : ''}`}>
                      {t('fullName')} <span className="text-[#FF3B3B]">*</span>
                    </label>
                    <input
                      type="text"
                      className={`pixel-input ${errors.full_name ? 'border-red-500' : ''} ${isRTL ? 'font-arabic' : ''}`}
                      placeholder={t('fullNamePlaceholder')}
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      data-testid="input-full-name"
                    />
                    {errors.full_name && <span className="text-red-500 text-sm">{errors.full_name}</span>}
                  </div>
                  
                  {/* Age & Residence */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block mb-2 ${isRTL ? 'font-arabic text-lg' : ''}`}>
                        {t('age')} <span className="text-[#FF3B3B]">*</span>
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="100"
                        className={`pixel-input ${errors.age ? 'border-red-500' : ''}`}
                        placeholder={t('agePlaceholder')}
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        data-testid="input-age"
                      />
                      {errors.age && <span className="text-red-500 text-sm">{errors.age}</span>}
                    </div>
                    <div>
                      <label className={`block mb-2 ${isRTL ? 'font-arabic text-lg' : ''}`}>
                        {t('residence')} <span className="text-[#FF3B3B]">*</span>
                      </label>
                      <select
                        className={`pixel-select ${errors.residence ? 'border-red-500' : ''} ${isRTL ? 'font-arabic' : ''}`}
                        value={formData.residence}
                        onChange={(e) => handleInputChange('residence', e.target.value)}
                        data-testid="select-residence"
                      >
                        {locations.map((loc) => (
                          <option key={loc.value} value={loc.value}>
                            {loc.label}
                          </option>
                        ))}
                      </select>
                      {errors.residence && <span className="text-red-500 text-sm">{errors.residence}</span>}
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label className={`block mb-2 ${isRTL ? 'font-arabic text-lg' : ''}`}>
                      {t('email')} <span className="text-[#FF3B3B]">*</span>
                    </label>
                    <input
                      type="email"
                      className={`pixel-input ${errors.email ? 'border-red-500' : ''}`}
                      style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: '16px' }}
                      placeholder={t('emailPlaceholder')}
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      data-testid="input-email"
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                  </div>
                  
                  {/* WhatsApp */}
                  <div>
                    <label className={`block mb-2 ${isRTL ? 'font-arabic text-lg' : ''}`}>
                      {t('whatsapp')} <span className="text-[#FF3B3B]">*</span>
                    </label>
                    <input
                      type="tel"
                      className={`pixel-input ${errors.whatsapp ? 'border-red-500' : ''}`}
                      placeholder={t('whatsappPlaceholder')}
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      data-testid="input-whatsapp"
                    />
                    {errors.whatsapp && <span className="text-red-500 text-sm">{errors.whatsapp}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 1: Background & Skills */}
          {currentStep === 1 && (
            <div data-testid="step-background-skills">
              <h2 className={`text-xl md:text-2xl text-[#FF3B3B] mb-2 ${isRTL ? 'font-arabic' : 'font-pixel'}`}>
                {t('background')} & {t('techSkills')}
              </h2>
              <p className={`text-gray-400 mb-8 ${isRTL ? 'font-arabic' : ''}`}>
                {t('section1Subtitle')}
              </p>
              
              {/* Main Field */}
              <div className="mb-8">
                <h3 className={`text-lg text-[#4ADE80] mb-4 ${isRTL ? 'font-arabic' : 'font-pixel'} text-sm`}>
                  {t('background')}
                </h3>
                
                <label className={`block mb-3 ${isRTL ? 'font-arabic text-lg' : ''}`}>
                  {t('mainField')} <span className="text-[#FF3B3B]">*</span>
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {mainFieldOptions.map(({ id, icon: Icon }) => (
                    <label
                      key={id}
                      className={`flex items-center gap-3 p-3 border-2 cursor-pointer transition-colors ${
                        formData.main_field.includes(id)
                          ? 'border-[#FF3B3B] bg-[#FF3B3B]/10'
                          : 'border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="pixel-checkbox"
                        checked={formData.main_field.includes(id)}
                        onChange={() => handleCheckboxChange('main_field', id)}
                        data-testid={`checkbox-field-${id}`}
                      />
                      <Icon className="w-5 h-5 text-[#FACC15]" />
                      <span className={isRTL ? 'font-arabic text-lg' : ''}>{t(id)}</span>
                    </label>
                  ))}
                </div>
                
                {formData.main_field.includes('other') && (
                  <input
                    type="text"
                    className={`pixel-input mb-4 ${isRTL ? 'font-arabic' : ''}`}
                    placeholder={t('otherFieldPlaceholder')}
                    value={formData.main_field_other}
                    onChange={(e) => handleInputChange('main_field_other', e.target.value)}
                    data-testid="input-field-other"
                  />
                )}
                {errors.main_field && <span className="text-red-500 text-sm block mb-4">{errors.main_field}</span>}
                
                {/* Has Game Project */}
                <label className={`block mb-3 mt-6 ${isRTL ? 'font-arabic text-lg' : ''}`}>
                  {t('hasProject')} <span className="text-[#FF3B3B]">*</span>
                  <span className={`block text-sm text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>{t('hasProjectDesc')}</span>
                </label>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  {['yes', 'no', 'trying'].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        className="pixel-radio"
                        name="has_game_project"
                        checked={formData.has_game_project === option}
                        onChange={() => handleInputChange('has_game_project', option)}
                        data-testid={`radio-project-${option}`}
                      />
                      <span className={isRTL ? 'font-arabic text-lg' : ''}>{t(option)}</span>
                    </label>
                  ))}
                </div>
                {errors.has_game_project && <span className="text-red-500 text-sm block mb-4">{errors.has_game_project}</span>}
                
                {formData.has_game_project === 'yes' && (
                  <textarea
                    className={`pixel-textarea mb-4 ${isRTL ? 'font-arabic' : ''}`}
                    placeholder={t('projectDetailsPlaceholder')}
                    value={formData.game_project_details}
                    onChange={(e) => handleInputChange('game_project_details', e.target.value)}
                    data-testid="textarea-project-details"
                  />
                )}
              </div>
              
              {/* Technical Skills */}
              <div className="mb-8">
                <h3 className={`text-lg text-[#4ADE80] mb-4 ${isRTL ? 'font-arabic' : 'font-pixel'} text-sm`}>
                  {t('techSkills')}
                </h3>
                
                <label className={`block mb-2 ${isRTL ? 'font-arabic text-lg' : ''}`}>
                  {t('knownTools')} <span className="text-[#FF3B3B]">*</span>
                  <span className={`block text-sm text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>{t('knownToolsDesc')}</span>
                </label>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {toolOptions.map((tool) => (
                    <label
                      key={tool}
                      className={`flex items-center gap-2 p-2 border-2 cursor-pointer transition-colors ${
                        formData.known_tools.includes(tool)
                          ? 'border-[#FF3B3B] bg-[#FF3B3B]/10'
                          : 'border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="pixel-checkbox"
                        checked={formData.known_tools.includes(tool)}
                        onChange={() => handleCheckboxChange('known_tools', tool)}
                        data-testid={`checkbox-tool-${tool.toLowerCase().replace(/\//g, '-')}`}
                      />
                      <span className="text-sm">{tool}</span>
                    </label>
                  ))}
                </div>
                
                {formData.known_tools.includes('Other') && (
                  <input
                    type="text"
                    className={`pixel-input mb-4 ${isRTL ? 'font-arabic' : ''}`}
                    placeholder={t('otherToolPlaceholder')}
                    value={formData.known_tools_other}
                    onChange={(e) => handleInputChange('known_tools_other', e.target.value)}
                    data-testid="input-tool-other"
                  />
                )}
                {errors.known_tools && <span className="text-red-500 text-sm block mb-4">{errors.known_tools}</span>}
                
                {/* Work Preference */}
                <label className={`block mb-3 mt-6 ${isRTL ? 'font-arabic text-lg' : ''}`}>
                  {t('workPreference')} <span className="text-[#FF3B3B]">*</span>
                </label>
                <div className="space-y-2 mb-4">
                  {['solo', 'team', 'both'].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        className="pixel-radio"
                        name="work_preference"
                        checked={formData.work_preference === option}
                        onChange={() => handleInputChange('work_preference', option)}
                        data-testid={`radio-work-${option}`}
                      />
                      <span className={isRTL ? 'font-arabic text-lg' : ''}>{t(option)}</span>
                    </label>
                  ))}
                </div>
                {errors.work_preference && <span className="text-red-500 text-sm block mb-4">{errors.work_preference}</span>}
                
                {/* Time Commitment */}
                <label className={`block mb-3 mt-6 ${isRTL ? 'font-arabic text-lg' : ''}`}>
                  {t('timeCommitment')} <span className="text-[#FF3B3B]">*</span>
                  <span className={`block text-sm text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>{t('timeCommitmentDesc')}</span>
                </label>
                <div className="space-y-2 mb-4">
                  {['fullyCommitted', 'maybeCommitted', 'notCommitted'].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        className="pixel-radio"
                        name="time_commitment"
                        checked={formData.time_commitment === option}
                        onChange={() => handleInputChange('time_commitment', option)}
                        data-testid={`radio-time-${option}`}
                      />
                      <span className={isRTL ? 'font-arabic text-lg' : ''}>{t(option)}</span>
                    </label>
                  ))}
                </div>
                {errors.time_commitment && <span className="text-red-500 text-sm block mb-4">{errors.time_commitment}</span>}
                
                {/* Internet Stability */}
                <label className={`block mb-3 mt-6 ${isRTL ? 'font-arabic text-lg' : ''}`}>
                  {t('internetStability')} <span className="text-[#FF3B3B]">*</span>
                </label>
                <div className="space-y-2 mb-4">
                  {['stableYes', 'stableMostly', 'stableNo', 'differentMethod'].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        className="pixel-radio"
                        name="internet_stability"
                        checked={formData.internet_stability === option}
                        onChange={() => handleInputChange('internet_stability', option)}
                        data-testid={`radio-internet-${option}`}
                      />
                      <span className={isRTL ? 'font-arabic text-lg' : ''}>{t(option)}</span>
                    </label>
                  ))}
                </div>
                {errors.internet_stability && <span className="text-red-500 text-sm block">{errors.internet_stability}</span>}
              </div>
            </div>
          )}
          
          {/* Step 2: Idea & Motivation */}
          {currentStep === 2 && (
            <div data-testid="step-idea-motivation">
              <h2 className={`text-xl md:text-2xl text-[#FF3B3B] mb-2 ${isRTL ? 'font-arabic' : 'font-pixel'}`}>
                {t('section2Title')}
              </h2>
              <p className={`text-gray-400 mb-8 ${isRTL ? 'font-arabic' : ''}`}>
                {t('section2Subtitle')}
              </p>
              
              {/* Idea & Motivation */}
              <div className="mb-8">
                <h3 className={`text-lg text-[#4ADE80] mb-4 ${isRTL ? 'font-arabic' : 'font-pixel'} text-sm`}>
                  {t('ideaMotivation')}
                </h3>
                
                <label className={`block mb-3 ${isRTL ? 'font-arabic text-lg' : ''}`}>
                  {t('hasIdea')} <span className="text-[#FF3B3B]">*</span>
                </label>
                <div className="flex flex-wrap gap-4 mb-4">
                  {['ideaYes', 'ideaNo', 'ideaThinking'].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        className="pixel-radio"
                        name="has_game_idea"
                        checked={formData.has_game_idea === option}
                        onChange={() => handleInputChange('has_game_idea', option)}
                        data-testid={`radio-idea-${option}`}
                      />
                      <span className={isRTL ? 'font-arabic text-lg' : ''}>{t(option)}</span>
                    </label>
                  ))}
                </div>
                {errors.has_game_idea && <span className="text-red-500 text-sm block mb-4">{errors.has_game_idea}</span>}
                
                <label className={`block mb-2 text-sm text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
                  {t('ideaDetailsLabel')}
                </label>
                <textarea
                  className={`pixel-textarea mb-6 ${isRTL ? 'font-arabic' : ''}`}
                  placeholder={t('ideaDetailsPlaceholder')}
                  value={formData.game_idea_details}
                  onChange={(e) => handleInputChange('game_idea_details', e.target.value)}
                  data-testid="textarea-idea-details"
                />
                
                <label className={`block mb-2 ${isRTL ? 'font-arabic text-lg' : ''}`}>
                  {t('joinReason')} <span className="text-[#FF3B3B]">*</span>
                </label>
                <textarea
                  className={`pixel-textarea ${errors.join_reason ? 'border-red-500' : ''} ${isRTL ? 'font-arabic' : ''}`}
                  placeholder={t('joinReasonPlaceholder')}
                  value={formData.join_reason}
                  onChange={(e) => handleInputChange('join_reason', e.target.value)}
                  data-testid="textarea-join-reason"
                />
                {errors.join_reason && <span className="text-red-500 text-sm">{errors.join_reason}</span>}
              </div>
              
              {/* Elite Stage */}
              <div className="mb-8">
                <h3 className={`text-lg text-[#4ADE80] mb-4 ${isRTL ? 'font-arabic' : 'font-pixel'} text-sm`}>
                  {t('eliteStage')}
                </h3>
                
                <label className={`block mb-3 ${isRTL ? 'font-arabic text-lg' : ''}`}>
                  {t('wantsElite')} <span className="text-[#FF3B3B]">*</span>
                </label>
                <div className="space-y-2 mb-4">
                  {['eliteYes', 'eliteNo', 'eliteMaybe'].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        className="pixel-radio"
                        name="wants_elite_stage"
                        checked={formData.wants_elite_stage === option}
                        onChange={() => handleInputChange('wants_elite_stage', option)}
                        data-testid={`radio-elite-${option}`}
                      />
                      <span className={isRTL ? 'font-arabic text-lg' : ''}>{t(option)}</span>
                    </label>
                  ))}
                </div>
                {errors.wants_elite_stage && <span className="text-red-500 text-sm block mb-4">{errors.wants_elite_stage}</span>}
              </div>
              
              {/* Final Notes */}
              <div>
                <h3 className={`text-lg text-[#4ADE80] mb-4 ${isRTL ? 'font-arabic' : 'font-pixel'} text-sm`}>
                  {t('finalNotes')}
                </h3>
                <textarea
                  className={`pixel-textarea ${isRTL ? 'font-arabic' : ''}`}
                  placeholder={t('finalNotesPlaceholder')}
                  value={formData.final_notes}
                  onChange={(e) => handleInputChange('final_notes', e.target.value)}
                  data-testid="textarea-final-notes"
                />
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className={`flex justify-center mt-8 pt-6 border-t-2 border-gray-800 ${currentStep > 0 ? 'gap-4' : ''}`}>
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="pixel-btn pixel-btn-secondary flex items-center gap-2"
                data-testid="prev-btn"
              >
                {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                {t('prev')}
              </button>
            )}
            
            {currentStep < totalSteps - 1 ? (
              <button
                onClick={handleNext}
                className="pixel-btn flex items-center gap-2"
                data-testid="next-btn"
              >
                {t('next')}
                {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="pixel-btn pulse-glow flex items-center gap-2"
                data-testid="submit-btn"
              >
                {isSubmitting ? t('submitting') : t('submit')}
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
