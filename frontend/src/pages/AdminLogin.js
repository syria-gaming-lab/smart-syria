import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';
import axios from 'axios';
import { Lock, User, ArrowLeft, Home } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LOGO_URL = "/images/logos/smart-syria-logo.png";

export default function AdminLogin({ onLogin, onBackToForm, onBackToHome }) {
  const { t, isRTL, toggleLanguage, language } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error(t('required'));
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/admin/login`, { username, password });
      localStorage.setItem('admin_token', response.data.token);
      toast.success(response.data.message);
      onLogin();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="crt-overlay" />
      
      {/* Language Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleLanguage}
          className="pixel-btn text-xs py-2 px-4"
          data-testid="login-lang-toggle"
        >
          {t('langToggle')}
        </button>
      </div>
      
      <div className="pixel-card max-w-md w-full slide-in" data-testid="admin-login-card">
        <div className="text-center mb-8">
          <img 
            src={LOGO_URL} 
            alt="Syria Gaming Lab" 
            className="w-24 mx-auto mb-4 float"
          />
          <h1 className={`text-xl md:text-2xl text-[#FF3B3B] mb-2 ${isRTL ? 'font-handjet' : 'font-pixel'}`}>
            {t('adminLogin')}
          </h1>
          <p className="text-gray-400 text-sm">Syria Gaming Lab - Cohort 2</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block mb-2 ${isRTL ? 'font-arabic' : ''}`}>
              {t('username')}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                className="pixel-input pl-10 w-full"
                placeholder={t('username')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                data-testid="input-username"
              />
            </div>
          </div>
          
          <div>
            <label className={`block mb-2 ${isRTL ? 'font-arabic' : ''}`}>
              {t('password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                className="pixel-input pl-10 w-full"
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-password"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="pixel-btn w-full pulse-glow"
            data-testid="login-btn"
          >
            {isLoading ? '...' : t('login')}
          </button>
        </form>
        
        <div className="mt-6 pt-6 border-t-2 border-gray-800 flex flex-col gap-3">
          <button
            onClick={onBackToForm}
            className="text-gray-400 hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors"
            data-testid="back-to-form-login-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToForm')}
          </button>
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="text-blue-400 hover:text-blue-300 flex items-center justify-center gap-2 mx-auto transition-colors text-sm"
              data-testid="back-to-home-login-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === 'ar' ? 'العودة إلى الرئيسية' : 'Back to Smart Syria'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
