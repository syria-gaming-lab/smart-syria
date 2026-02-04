import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LOGO_URL = "/images/logos/Logo-1.png";
const SANAD_LOGO_LANDING = "/images/logos/Sanad-3.png";
const TOPTECH_LOGO = "/images/logos/Bloom-2.png";
const SYMOCAIT_LOGO = "/images/logos/symocait.png";
const MICROBOTS_LOGO = "/images/logos/Micro-2.png";

// Colors
const MAIN_BLUE = '#0E065A'; // rgb(14, 6, 90)
const TAGLINE_TEAL = 'rgb(0, 200, 199)';
const TALK_TECH_PURPLE = '#342359';
const GAMING_LAB_BLACK = '#1a1a1a';
const MICROBOTS_BLUE = '#173966';
const TALK_TECH_LINE = '#fa91ba'; // Pink underline
const GAMING_LAB_LINE = '#ff2640'; // Red underline
const MICROBOTS_LINE = '#ef5726'; // Orange underline

// External links
const SANAD_LINK = 'https://sanadyouth.org/';
const SYMOCAIT_LINK = 'https://moct.gov.sy/';

// Translations
const translations = {
  en: {
    title: 'Smart Syria',
    tagline: 'When thought, experience and support come together',
    langBtn: 'العربية',
    loading: 'LOADING'
  },
  ar: {
    title: 'سوريا الذكية',
    tagline: 'عندما يجتمع الفكر والخبرة والدعم',
    langBtn: 'English',
    loading: 'جاري التحميل'
  }
};

// Pixel Art Loading Screen Component
const PixelLoadingScreen = ({ color, cardColor, orgName, language, loadingType }) => {
  const [frame, setFrame] = useState(0);
  const t = translations[language];
  const isRTL = language === 'ar';
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % 8);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Syria Gaming Lab - Dark Gaming Style
  if (loadingType === 'gaming') {
    return (
      <div 
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
        style={{ backgroundColor: '#0a0a0a' }}
      >
        <style>{`
          @keyframes pixel-glitch {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(-2px, 2px); }
            50% { transform: translate(2px, -2px); }
            75% { transform: translate(-2px, -2px); }
          }
          @keyframes neon-pulse {
            0%, 100% { 
              box-shadow: 0 0 10px ${GAMING_LAB_LINE}, 0 0 20px ${GAMING_LAB_LINE}, 0 0 30px ${GAMING_LAB_LINE};
              filter: brightness(1);
            }
            50% { 
              box-shadow: 0 0 20px ${GAMING_LAB_LINE}, 0 0 40px ${GAMING_LAB_LINE}, 0 0 60px ${GAMING_LAB_LINE};
              filter: brightness(1.3);
            }
          }
          @keyframes pixel-bounce-game {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .pixel-glitch { animation: pixel-glitch 0.3s infinite; }
          .neon-pulse { animation: neon-pulse 1.5s ease-in-out infinite; }
        `}</style>
        
        <div className="flex flex-col items-center">
          {/* Pixel Art Title */}
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl mb-8 text-center px-4"
            style={{ 
              color: GAMING_LAB_LINE, 
              textShadow: `4px 4px 0 #000, 0 0 20px ${GAMING_LAB_LINE}`,
              letterSpacing: '2px',
              fontFamily: "'Press Start 2P', 'BoldPixels', monospace",
              fontWeight: 'normal'
            }}
          >
            {orgName}
          </h2>
          
          {/* Pixel Health Bar Style Progress */}
          <div className="mb-6">
            <div 
              className="relative neon-pulse"
              style={{
                width: '260px',
                height: '32px',
                backgroundColor: '#000',
                border: `4px solid ${GAMING_LAB_LINE}`,
                padding: '2px',
                boxShadow: `8px 8px 0 rgba(0,0,0,0.5)`
              }}
            >
              <div className="flex h-full gap-1">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      backgroundColor: i <= frame ? GAMING_LAB_LINE : '#1a1a1a',
                      border: `1px solid ${i <= frame ? '#000' : '#2a2a2a'}`,
                      boxShadow: i <= frame ? `inset 0 0 10px ${GAMING_LAB_LINE}` : 'none',
                      transition: 'all 0.1s'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Pixel Loading Text with Dots */}
          <div className="flex items-center gap-3">
            <span 
              className="text-xl"
              style={{ 
                color: GAMING_LAB_LINE,
                textShadow: `2px 2px 0 #000, 0 0 10px ${GAMING_LAB_LINE}`,
                fontFamily: "'Press Start 2P', 'BoldPixels', monospace",
                fontWeight: 'normal'
              }}
            >
              {t.loading}
            </span>
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: (frame + i) % 3 === 0 ? GAMING_LAB_LINE : '#1a1a1a',
                    border: `2px solid ${GAMING_LAB_LINE}`,
                    boxShadow: (frame + i) % 3 === 0 ? `0 0 10px ${GAMING_LAB_LINE}` : 'none',
                    transition: 'all 0.15s',
                    animation: (frame + i) % 3 === 0 ? 'pixel-bounce-game 0.5s ease-in-out' : 'none'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Talk Tech Bloom - 8-bit Pixel Style with Brand Colors
  if (loadingType === 'talktech') {
    return (
      <div 
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
        style={{ 
          backgroundColor: '#fef5f8'
        }}
      >
        <style>{`
          @keyframes pixel-bounce-soft {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes pixel-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(0.95); }
          }
          @keyframes pixel-star-twinkle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          .pixel-bounce-soft { animation: pixel-bounce-soft 1.5s ease-in-out infinite; }
          .pixel-pulse { animation: pixel-pulse 1s ease-in-out infinite; }
        `}</style>
        
        <div className="flex flex-col items-center">
          <h2 
            className={`text-2xl sm:text-3xl md:text-4xl mb-8 text-center px-4 pixel-bounce-soft ${isRTL ? 'font-tajawal font-black' : 'font-boldpixels'}`}
            style={{ 
              color: TALK_TECH_PURPLE,
              textShadow: `2px 2px 0 ${TALK_TECH_LINE}`
            }}
          >
            {orgName}
          </h2>
          
          {/* Pixel Stars - Brand Colors Only */}
          <div className="relative mb-6">
            <div className="absolute -top-16 -left-16">
              <div 
                style={{ 
                  width: '20px', 
                  height: '20px',
                  backgroundColor: TALK_TECH_LINE,
                  clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                  animation: 'pixel-star-twinkle 1s ease-in-out infinite',
                  animationDelay: '0s'
                }}
              />
            </div>
            <div className="absolute -top-16 -right-16">
              <div 
                style={{ 
                  width: '20px', 
                  height: '20px',
                  backgroundColor: TALK_TECH_LINE,
                  clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                  animation: 'pixel-star-twinkle 1s ease-in-out infinite',
                  animationDelay: '0.3s'
                }}
              />
            </div>
            
            {/* 8-bit Pixel Progress Bar */}
            <div 
              className="relative"
              style={{
                width: '240px',
                height: '24px',
                backgroundColor: TALK_TECH_PURPLE,
                border: `4px solid ${TALK_TECH_LINE}`,
                padding: '2px',
                boxShadow: '8px 8px 0 rgba(0,0,0,0.1)'
              }}
            >
              <div className="flex h-full gap-0.5">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div
                    key={i}
                    className="flex-1"
                    style={{
                      backgroundColor: i <= frame ? TALK_TECH_LINE : '#ffffff',
                      transition: 'all 0.15s'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span 
              className={`text-lg font-bold ${isRTL ? 'font-tajawal' : 'font-boldpixels'}`}
              style={{ color: TALK_TECH_PURPLE }}
            >
              {t.loading}
            </span>
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{ 
                    width: '12px',
                    height: '12px',
                    backgroundColor: (frame + i) % 3 === 0 ? TALK_TECH_LINE : TALK_TECH_PURPLE,
                    border: `2px solid ${TALK_TECH_LINE}`,
                    transition: 'all 0.15s'
                  }}
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Micro-bots - Robotic Style
  if (loadingType === 'robotic') {
    return (
      <div 
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
        style={{ backgroundColor: '#0f1d2e' }}
      >
        <style>{`
          @keyframes robot-scan {
            0%, 100% { transform: translateY(-50%) scaleY(0); opacity: 0; }
            50% { transform: translateY(-50%) scaleY(1); opacity: 0.3; }
          }
          @keyframes robot-blink {
            0%, 90% { opacity: 1; }
            95% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes circuit-flow {
            0% { opacity: 0.3; }
            50% { opacity: 1; }
            100% { opacity: 0.3; }
          }
          @keyframes gear-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .robot-blink { animation: robot-blink 3s ease-in-out infinite; }
          .circuit-flow { animation: circuit-flow 1.5s ease-in-out infinite; }
        `}</style>
        
        <div className="flex flex-col items-center">
          <h2 
            className="font-boldpixels text-2xl sm:text-3xl md:text-4xl mb-8 text-center px-4 robot-blink"
            style={{ 
              color: MICROBOTS_LINE,
              textShadow: `0 0 10px ${MICROBOTS_LINE}`,
              fontFamily: 'monospace'
            }}
          >
            {orgName}
          </h2>
          
          {/* Robotic Circuit Progress */}
          <div className="relative mb-8">
            {/* Corner brackets */}
            <div className="absolute -top-3 -left-3 text-2xl" style={{ color: MICROBOTS_LINE }}>┌</div>
            <div className="absolute -top-3 -right-3 text-2xl" style={{ color: MICROBOTS_LINE }}>┐</div>
            <div className="absolute -bottom-3 -left-3 text-2xl" style={{ color: MICROBOTS_LINE }}>└</div>
            <div className="absolute -bottom-3 -right-3 text-2xl" style={{ color: MICROBOTS_LINE }}>┘</div>
            
            <div 
              className="relative"
              style={{
                width: '280px',
                height: '40px',
                backgroundColor: '#1a2938',
                border: `2px solid ${MICROBOTS_LINE}`,
                padding: '4px',
              }}
            >
              {/* Circuit board pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-8 h-full">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="border-r border-blue-400" style={{ borderColor: MICROBOTS_LINE }} />
                  ))}
                </div>
              </div>
              
              {/* Progress segments */}
              <div className="flex h-full gap-1">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div
                    key={i}
                    className="flex-1 relative circuit-flow"
                    style={{
                      backgroundColor: i <= frame ? MICROBOTS_LINE : 'transparent',
                      border: `1px solid ${MICROBOTS_LINE}`,
                      boxShadow: i <= frame ? `0 0 10px ${MICROBOTS_LINE}, inset 0 0 10px ${MICROBOTS_LINE}` : 'none',
                      animationDelay: `${i * 0.1}s`
                    }}
                  >
                    {i <= frame && (
                      <div className="absolute inset-0 flex items-center justify-center text-xs" style={{ color: '#0f1d2e' }}>
                        {i % 2 === 0 ? '█' : '▓'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span 
              className="font-mono text-lg font-bold tracking-wider"
              style={{ color: MICROBOTS_LINE }}
            >
              [{t.loading}]
            </span>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: (frame % 4) === i ? MICROBOTS_LINE : '#2a3a4a',
                    border: `1px solid ${MICROBOTS_LINE}`,
                    boxShadow: (frame % 4) === i ? `0 0 8px ${MICROBOTS_LINE}` : 'none'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback (shouldn't reach here)
  return null;
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [clickedCard, setClickedCard] = useState(null);
  const [language, setLanguage] = useState('ar');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingColor, setLoadingColor] = useState(MAIN_BLUE);
  const [loadingCardColor, setLoadingCardColor] = useState(MAIN_BLUE);
  const [loadingOrgName, setLoadingOrgName] = useState('');
  const [loadingType, setLoadingType] = useState('gaming');

  const t = translations[language];
  const isRTL = language === 'ar';

  const handleCardClick = (route, cardType, underlineColor, cardColor, orgName, loadingStyle) => {
    setClickedCard(cardType);
    setLoadingColor(underlineColor);
    setLoadingCardColor(cardColor);
    setLoadingOrgName(orgName);
    setLoadingType(loadingStyle);
    
    // After portal animation (600ms), show loading screen
    setTimeout(() => {
      setIsLoading(true);
      
      // Minimum 3 second loading, then navigate
      setTimeout(() => {
        navigate(route);
      }, 3000);
    }, 600);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  // Show loading screen
  if (isLoading) {
    return <PixelLoadingScreen color={loadingColor} cardColor={loadingCardColor} orgName={loadingOrgName} language={language} loadingType={loadingType} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-x-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* CSS for animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&family=Noto+Sans:wght@400;500;600;700&display=swap');
        
        /* Card shadows - no animation, just clean shadow */
        .card-shadow-pink {
          box-shadow: 0 10px 40px rgba(250, 145, 186, 0.7), 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .card-shadow-pink:hover {
          box-shadow: 0 15px 50px rgba(250, 145, 186, 0.5), 0 8px 25px rgba(0, 0, 0, 0.15);
          transform: scale(1.05);
        }
        
        .card-shadow-red {
          box-shadow: 0 10px 40px rgba(255, 38, 64, 0.47), 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .card-shadow-red:hover {
          box-shadow: 0 15px 50px rgba(255, 38, 64, 0.5), 0 8px 25px rgba(0, 0, 0, 0.15);
          transform: scale(1.05);
        }
        
        .card-shadow-orange {
          box-shadow: 0 10px 40px rgba(239, 87, 38, 0.35), 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .card-shadow-orange:hover {
          box-shadow: 0 15px 50px rgba(239, 87, 38, 0.5), 0 8px 25px rgba(0, 0, 0, 0.15);
          transform: scale(1.05);
        }
        
        /* Portal click animation */
        @keyframes portal-enter-pink {
          0% {
            transform: scale(1);
            box-shadow: 0 15px 50px rgba(250, 145, 186, 0.5);
          }
          30% {
            transform: scale(1.15);
            box-shadow: 0 0 80px rgba(250, 145, 186, 0.9), 0 0 150px rgba(250, 145, 186, 0.7);
          }
          100% {
            transform: scale(0);
            opacity: 0;
            box-shadow: 0 0 200px rgba(250, 145, 186, 1);
          }
        }
        
        @keyframes portal-enter-red {
          0% {
            transform: scale(1);
            box-shadow: 0 15px 50px rgba(255, 38, 64, 0.5);
          }
          30% {
            transform: scale(1.15);
            box-shadow: 0 0 80px rgba(255, 38, 64, 0.9), 0 0 150px rgba(255, 38, 64, 0.7);
          }
          100% {
            transform: scale(0);
            opacity: 0;
            box-shadow: 0 0 200px rgba(255, 38, 64, 1);
          }
        }
        
        @keyframes portal-enter-orange {
          0% {
            transform: scale(1);
            box-shadow: 0 15px 50px rgba(239, 87, 38, 0.5);
          }
          30% {
            transform: scale(1.15);
            box-shadow: 0 0 80px rgba(239, 87, 38, 0.9), 0 0 150px rgba(239, 87, 38, 0.7);
          }
          100% {
            transform: scale(0);
            opacity: 0;
            box-shadow: 0 0 200px rgba(239, 87, 38, 1);
          }
        }
        
        .portal-click-pink {
          animation: portal-enter-pink 0.6s ease-in forwards !important;
        }
        
        .portal-click-red {
          animation: portal-enter-red 0.6s ease-in forwards !important;
        }
        
        .portal-click-orange {
          animation: portal-enter-orange 0.6s ease-in forwards !important;
        }
        
        .lang-btn {
          transition: all 0.3s ease;
        }
        
        .lang-btn:hover {
          box-shadow: 0 4px 15px rgba(0, 200, 199, 0.4);
        }
        
        .lang-btn-wrapper {
          position: fixed;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
        }
        
        .lang-btn-wrapper .lang-btn:hover {
          transform: scale(1.05);
        }
        
        /* Mobile responsive fixes */
        @media (max-width: 768px) {
          .portal-cards-container {
            gap: 1.5rem !important;
          }
          .portal-card {
            padding: 1.25rem !important;
          }
          .portal-card img {
            width: 5rem !important;
            height: 5rem !important;
          }
          .header-logos {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            padding-top: 0.75rem !important;
          }
          .sanad-logo {
            width: 5.5rem !important;
            height: 4rem !important;
          }
          .symocait-logo {
            width: 6.5rem !important;
            height: 5rem !important;
          }
          .main-title {
            font-size: 2rem !important;
          }
          .tagline-container {
            padding-left: 1.5rem !important;
            padding-right: 1.5rem !important;
            padding-top: 0.75rem !important;
            padding-bottom: 0.75rem !important;
          }
          .tagline-text {
            font-size: 0.95rem !important;
          }
          h2 {
            font-size: 1.5rem !important;
          }
          .lang-btn-center {
            padding: 0.5rem 1.5rem !important;
            font-size: 0.875rem !important;
          }
        }
      `}</style>

      {/* Header with corner logos - aligned on same line */}
      <header className="header-logos absolute top-0 left-0 right-0 flex justify-between items-center px-4 sm:px-8 md:px-20 lg:px-32 py-3 md:py-6">
        {/* Sanad Logo - Top Left with link */}
        <a 
          href={SANAD_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-105 transition-transform duration-300 flex items-center"
        >
          <img 
            src={SANAD_LOGO_LANDING} 
            alt="Sanad Youth" 
            className="sanad-logo w-20 sm:w-24 md:w-28 lg:w-32 h-14 sm:h-18 md:h-20 lg:h-24 object-contain"
          />
        </a>
        
        {/* Symocait Logo - Top Right with link - slightly bigger */}
        <a 
          href={SYMOCAIT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-105 transition-transform duration-300 flex items-center"
        >
          <img 
            src={SYMOCAIT_LOGO} 
            alt="Symocait" 
            className="symocait-logo w-24 sm:w-28 md:w-32 lg:w-36 h-16 sm:h-20 md:h-24 lg:h-28 object-contain"
          />
        </a>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:py-12">
        {/* Title Section */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h1 
            className={`main-title text-2xl sm:text-3xl md:text-5xl lg:text-6xl mb-3 sm:mb-4 ${isRTL ? 'font-tajawal font-black' : 'font-noto font-extrabold'}`}
            style={{ 
              color: MAIN_BLUE,
              lineHeight: isRTL ? '1.4' : 'normal'
            }}
          >
            {t.title}
          </h1>
          {/* Tagline with pill-shaped container */}
          <div 
            className="tagline-container inline-block px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full"
            style={{ backgroundColor: MAIN_BLUE }}
          >
            <p 
              className="tagline-text font-noto text-xs sm:text-sm md:text-base lg:text-lg font-medium"
              style={{ color: TAGLINE_TEAL }}
            >
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Initiatives Section Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 
            className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl ${isRTL ? 'font-tajawal font-bold' : 'font-noto font-bold'}`}
            style={{ color: MAIN_BLUE }}
          >
            {isRTL ? 'كافة المبادرات والفعاليات' : 'All Initiatives and Events'}
          </h2>
        </div>

        {/* Portal Cards */}
        <div className="portal-cards-container flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-10 lg:gap-16 flex-wrap">
          {/* Top-Tech Portal - Purple card with pink shadow */}
          <button
            onClick={() => handleCardClick('/talk-tech-bloom', 'pink', TALK_TECH_LINE, TALK_TECH_PURPLE, 'Talk Tech Bloom', 'talktech')}
            className={`portal-card group relative rounded-2xl transition-all duration-300 p-5 sm:p-6 md:p-8 lg:p-10 cursor-pointer order-2 md:order-none
              ${clickedCard === 'pink' ? 'portal-click-pink' : 'card-shadow-pink'}`}
            style={{ backgroundColor: TALK_TECH_PURPLE }}
            disabled={clickedCard !== null}
          >
            <img 
              src={TOPTECH_LOGO} 
              alt="Top-Tech Bloom" 
              className="w-20 sm:w-24 md:w-32 lg:w-36 h-20 sm:h-24 md:h-32 lg:h-36 object-contain relative z-10"
            />
            {/* Pink underline */}
            <div 
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-1 sm:h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
              style={{ 
                backgroundColor: TALK_TECH_LINE,
                boxShadow: `0 0 10px ${TALK_TECH_LINE}, 0 0 20px ${TALK_TECH_LINE}`
              }}
            />
          </button>

          {/* Syria Gaming Lab Portal - Black card with red shadow */}
          <button
            onClick={() => handleCardClick('/syria-gaming-lab', 'red', GAMING_LAB_LINE, GAMING_LAB_BLACK, 'Syria Gaming Lab', 'gaming')}
            className={`portal-card group relative rounded-2xl transition-all duration-300 p-5 sm:p-6 md:p-8 lg:p-10 cursor-pointer order-1 md:order-none
              ${clickedCard === 'red' ? 'portal-click-red' : 'card-shadow-red'}`}
            style={{ backgroundColor: GAMING_LAB_BLACK }}
            disabled={clickedCard !== null}
          >
            <img 
              src={LOGO_URL} 
              alt="Syria Gaming Lab" 
              className="w-20 sm:w-24 md:w-32 lg:w-36 h-20 sm:h-24 md:h-32 lg:h-36 object-contain relative z-10"
            />
            {/* Red underline */}
            <div 
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-1 sm:h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
              style={{ 
                backgroundColor: GAMING_LAB_LINE,
                boxShadow: `0 0 10px ${GAMING_LAB_LINE}, 0 0 20px ${GAMING_LAB_LINE}`
              }}
            />
          </button>

          {/* Micro-bots Portal - Blue card with orange shadow */}
          <button
            onClick={() => handleCardClick('/micro-bots', 'orange', MICROBOTS_LINE, MICROBOTS_BLUE, 'Micro-bots', 'robotic')}
            className={`portal-card group relative rounded-2xl transition-all duration-300 p-5 sm:p-6 md:p-8 lg:p-10 cursor-pointer order-3 md:order-none
              ${clickedCard === 'orange' ? 'portal-click-orange' : 'card-shadow-orange'}`}
            style={{ backgroundColor: MICROBOTS_BLUE }}
            disabled={clickedCard !== null}
          >
            <img 
              src={MICROBOTS_LOGO} 
              alt="Micro-bots" 
              className="w-20 sm:w-24 md:w-32 lg:w-36 h-20 sm:h-24 md:h-32 lg:h-36 object-contain relative z-10"
            />
            {/* Orange underline */}
            <div 
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-1 sm:h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
              style={{ 
                backgroundColor: MICROBOTS_LINE,
                boxShadow: `0 0 10px ${MICROBOTS_LINE}, 0 0 20px ${MICROBOTS_LINE}`
              }}
            />
          </button>
        </div>

        {/* Coming Soon Text */}
        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <p 
            className={`text-base sm:text-lg md:text-xl ${isRTL ? 'font-tajawal' : 'font-noto'} font-medium`}
            style={{ color: MAIN_BLUE, opacity: 0.7 }}
          >
            {isRTL ? 'المزيد من المبادرات والمنظمات قريباً' : 'More initiatives and organizations coming soon'}
          </p>
        </div>
      </main>

      {/* Language Toggle Button - Bottom Center */}
      <div className="lang-btn-wrapper">
        <button
          onClick={toggleLanguage}
          className="lang-btn lang-btn-center px-6 sm:px-8 py-2 sm:py-3 rounded-2xl text-white font-noto font-semibold text-sm sm:text-lg"
          style={{ backgroundColor: TAGLINE_TEAL }}
        >
          {t.langBtn}
        </button>
      </div>
    </div>
  );
}
