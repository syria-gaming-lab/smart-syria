import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const MICROBOTS_LOGO = "/images/logos/Micro-2.png";
const MICROBOTS_LOGO2 = "/images/logos/Micro-1.png";

export default function MicroBotsForm() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#173966] hover:text-[#ef5726] transition-colors font-noto"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Smart Syria</span>
        </button>
        
        <img 
          src={MICROBOTS_LOGO2} 
          alt="Micro-bots" 
          className="w-12 md:w-16 object-contain"
        />
      </header>

      {/* Main Content - Placeholder */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="text-center">
          <img 
            src={MICROBOTS_LOGO2} 
            alt="Micro-bots" 
            className="w-32 md:w-40 mx-auto mb-8 opacity-30"
          />
          <h1 className="text-2xl md:text-4xl font-bold text-[#173966] mb-4 font-noto">
            Micro Bots Team
          </h1>
          <p className="text-[#ef5726] text-lg font-noto">
            Coming soon...
          </p>
        </div>
      </main>
    </div>
  );
}
