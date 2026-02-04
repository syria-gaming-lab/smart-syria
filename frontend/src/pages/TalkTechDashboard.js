import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { 
  LogOut, Download, Search, Eye, Trash2, X, 
  Users, Clock, CheckCircle, XCircle, ArrowLeft, Home 
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const TOPTECH_LOGO = "/images/logos/Bloom-2.png";
const TOPTECH_LOGO2 = "/images/logos/Bloom-4.png";
// Colors
const COLORS = {
  primary: '#342359',
  accent: '#fa91ba',
  text: '#1a1a1a',
  textSecondary: '#444444',
};

// Pixel Art Dinosaur Component
const PixelDino = ({ className = '' }) => (
  <div className={`pixel-dino ${className}`} style={{ imageRendering: 'pixelated' }}>
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <rect x="24" y="4" width="12" height="8" fill="#535353"/>
      <rect x="28" y="0" width="8" height="4" fill="#535353"/>
      <rect x="32" y="4" width="4" height="4" fill="white"/>
      <rect x="20" y="12" width="16" height="8" fill="#535353"/>
      <rect x="16" y="20" width="16" height="8" fill="#535353"/>
      <rect x="8" y="16" width="8" height="4" fill="#535353"/>
      <rect x="20" y="28" width="4" height="8" fill="#535353"/>
      <rect x="28" y="28" width="4" height="8" fill="#535353"/>
      <rect x="16" y="36" width="8" height="4" fill="#535353"/>
      <rect x="28" y="36" width="8" height="4" fill="#535353"/>
    </svg>
  </div>
);

// Translations
const translations = {
  en: {
    langToggle: '🇸🇦 العربية',
    title: 'TalkTech Bloom Dashboard',
    login: 'Admin Login',
    username: 'Username',
    password: 'Password',
    loginBtn: 'Login',
    logout: 'Logout',
    backToForm: 'Back to Form',
    backToHome: 'Back to Home',
    total: 'Total',
    pending: 'Pending',
    accepted: 'Accepted',
    rejected: 'Rejected',
    search: 'Search by name or email...',
    filter: 'Filter',
    all: 'All',
    export: 'Export CSV',
    noApplications: 'No applications found',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    category: 'Category',
    interests: 'Interests',
    goal: 'Goal',
    status: 'Status',
    date: 'Date',
    actions: 'Actions',
    view: 'View',
    delete: 'Delete',
    close: 'Close',
    confirmDelete: 'Are you sure you want to delete this application?',
    applicationDetails: 'Application Details',
    confirmed: 'Confirmed Attendance',
    yes: 'Yes',
    no: 'No',
    updateStatus: 'Update Status',
    categories: {
      student: 'University Student - IT/Tech',
      graduate: 'Graduate (not working)',
      working: 'Working in Tech',
      other: 'Other'
    },
    goals: {
      path: 'Choose Tech Path',
      market: 'Understand Job Market',
      networking: 'Networking',
      inspiration: 'Inspiration',
      other: 'Other'
    },
    interests_labels: {
      frontend: 'Frontend Development',
      backend: 'Backend Development',
      games: 'Video Game Programming',
      data: 'Data Analytics',
      ai: 'AI / ML',
      security: 'Cybersecurity',
      other: 'Other'
    }
  },
  ar: {
    langToggle: '🇬🇧 English',
    title: 'لوحة تحكم TalkTech Bloom',
    login: 'تسجيل دخول المسؤول',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    loginBtn: 'دخول',
    logout: 'خروج',
    backToForm: 'العودة للنموذج',
    backToHome: 'العودة للرئيسية',
    total: 'الإجمالي',
    pending: 'قيد الانتظار',
    accepted: 'مقبول',
    rejected: 'مرفوض',
    search: 'البحث بالاسم أو البريد...',
    filter: 'تصفية',
    all: 'الكل',
    export: 'تصدير CSV',
    noApplications: 'لا توجد طلبات',
    name: 'الاسم',
    email: 'البريد',
    phone: 'الهاتف',
    category: 'الفئة',
    interests: 'الاهتمامات',
    goal: 'الهدف',
    status: 'الحالة',
    date: 'التاريخ',
    actions: 'الإجراءات',
    view: 'عرض',
    delete: 'حذف',
    close: 'إغلاق',
    confirmDelete: 'هل أنت متأكد من حذف هذا الطلب؟',
    applicationDetails: 'تفاصيل الطلب',
    confirmed: 'تأكيد الحضور',
    yes: 'نعم',
    no: 'لا',
    updateStatus: 'تحديث الحالة',
    categories: {
      student: 'طالبة جامعية - تخصص تقني',
      graduate: 'خريجة (غير عاملة)',
      working: 'عاملة في المجال التقني',
      other: 'غير ذلك'
    },
    goals: {
      path: 'اختيار مسار تقني',
      market: 'فهم سوق العمل',
      networking: 'التشبيك مع خبيرات',
      inspiration: 'الإلهام والتحفيز',
      other: 'غير ذلك'
    },
    interests_labels: {
      frontend: 'Frontend Development',
      backend: 'Backend Development',
      games: 'Video Game Programming',
      data: 'Data Analytics',
      ai: 'AI / ML',
      security: 'Cybersecurity',
      other: 'غير ذلك'
    }
  }
};

// Login Component
function TalkTechLogin({ onLogin, language, toggleLanguage }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const t = translations[language];
  const isRTL = language === 'ar';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/talktech/admin/login`, {
        username,
        password
      });
      localStorage.setItem('talktech_admin_token', response.data.token);
      onLogin();
      toast.success(language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Login successful');
    } catch (error) {
      toast.error(language === 'ar' ? 'بيانات غير صحيحة' : 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <style>{`
        .pixel-input {
          font-family: 'Noto Sans Arabic', 'Noto Sans', sans-serif;
          background: white;
          border: 3px solid #535353;
          padding: 14px 16px;
          outline: none;
          color: #1a1a1a;
          font-size: 16px;
        }
        .pixel-input:focus {
          border-color: ${COLORS.primary};
        }
        .pixel-input::placeholder {
          color: #888;
        }
        .pixel-btn {
          font-family: 'BoldPixels', monospace;
          background: ${COLORS.primary};
          color: white;
          padding: 14px 24px;
          border: none;
          border-bottom: 4px solid #1a1a3e;
          cursor: pointer;
          font-size: 14px;
        }
        .pixel-btn:hover { background: #4a3479; }
        .pixel-btn:active { border-bottom-width: 0; margin-top: 4px; }
        @keyframes dino-run {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .dino-bounce {
          animation: dino-run 0.5s ease-in-out infinite;
        }
      `}</style>

      <div className="bg-white border-4 border-gray-700 p-8 w-full max-w-md" style={{ boxShadow: '8px 8px 0 #c4c4c4' }}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <img src={TOPTECH_LOGO2} alt="TalkTech" className="w-10 h-10" />
            <h1 className="font-boldpixels text-base" style={{ color: COLORS.primary }}>TalkTech</h1>
          </div>
          <button onClick={toggleLanguage} className="font-boldpixels text-sm border-2 border-gray-700 px-3 py-1" style={{ color: COLORS.primary }}>
            {t.langToggle}
          </button>
        </div>

        <h2 className="font-noto font-bold text-xl mb-6 text-center text-gray-800">{t.login}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-noto font-bold text-gray-800 text-sm block mb-2">{t.username}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pixel-input w-full"
              required
            />
          </div>
          <div>
            <label className="font-noto font-bold text-gray-800 text-sm block mb-2">{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pixel-input w-full"
              required
            />
          </div>
          <button type="submit" disabled={isLoading} className="pixel-btn w-full">
            {isLoading ? '...' : t.loginBtn}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t-2 border-gray-300 flex flex-col gap-2">
          <button onClick={() => navigate('/talk-tech-bloom')} className="text-gray-700 hover:text-gray-900 font-noto text-sm flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> {t.backToForm}
          </button>
          <button onClick={() => navigate('/')} className="hover:opacity-80 font-noto text-sm flex items-center justify-center gap-2" style={{ color: COLORS.primary }}>
            <Home className="w-4 h-4" /> {t.backToHome}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function TalkTechDashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [language, setLanguage] = useState('ar');
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const t = translations[language];
  const isRTL = language === 'ar';

  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'ar' : 'en');

  useEffect(() => {
    const token = localStorage.getItem('talktech_admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, statusFilter, searchTerm]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [appsRes, statsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/talktech/admin/applications`, {
          params: { status: statusFilter, search: searchTerm }
        }),
        axios.get(`${BACKEND_URL}/api/talktech/admin/stats`)
      ]);
      setApplications(appsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error(language === 'ar' ? 'خطأ في جلب البيانات' : 'Error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('talktech_admin_token');
    setIsAuthenticated(false);
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await axios.patch(`${BACKEND_URL}/api/talktech/admin/applications/${appId}`, { status: newStatus });
      toast.success(language === 'ar' ? 'تم التحديث' : 'Status updated');
      fetchData();
      if (selectedApp?.id === appId) {
        setSelectedApp(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      toast.error(language === 'ar' ? 'خطأ في التحديث' : 'Update failed');
    }
  };

  const handleDelete = async (appId) => {
    if (!window.confirm(t.confirmDelete)) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/talktech/admin/applications/${appId}`);
      toast.success(language === 'ar' ? 'تم الحذف' : 'Deleted successfully');
      fetchData();
      setSelectedApp(null);
    } catch (error) {
      toast.error(language === 'ar' ? 'خطأ في الحذف' : 'Delete failed');
    }
  };

  const handleExport = () => {
    window.open(`${BACKEND_URL}/api/talktech/admin/export?status=${statusFilter}`, '_blank');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      accepted: 'bg-green-500',
      rejected: 'bg-red-500'
    };
    return (
      <span className={`px-2 py-1 text-xs text-white font-bold ${colors[status] || 'bg-gray-500'}`}>
        {t[status] || status}
      </span>
    );
  };

  if (!isAuthenticated) {
    return <TalkTechLogin onLogin={() => setIsAuthenticated(true)} language={language} toggleLanguage={toggleLanguage} />;
  }

  return (
    <div className="min-h-screen bg-gray-100" dir={isRTL ? 'rtl' : 'ltr'}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700;800&family=Noto+Sans:wght@400;500;600;700;800&display=swap');
        
        .pixel-btn {
          font-family: 'BoldPixels', monospace;
          background: ${COLORS.primary};
          color: white;
          padding: 8px 16px;
          border: none;
          border-bottom: 3px solid #1a1a3e;
          cursor: pointer;
          font-size: 12px;
        }
        .pixel-btn:hover { background: #4a3479; }
        .pixel-btn-secondary {
          background: #535353;
          border-bottom-color: #333;
        }
        .pixel-btn-secondary:hover { background: #666; }
        .pixel-input {
          background: white;
          border: 2px solid #535353;
          padding: 10px 14px;
          outline: none;
          color: #1a1a1a;
          font-size: 14px;
        }
        .pixel-input:focus { border-color: ${COLORS.primary}; }
        .pixel-input::placeholder { color: #888; }
        
        @keyframes dino-run {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .dino-bounce {
          animation: dino-run 0.5s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b-4 border-gray-700 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={TOPTECH_LOGO2} alt="TalkTech" className="w-8 h-8" />
            <h1 className="font-boldpixels text-sm" style={{ color: COLORS.primary }}>{t.title}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={toggleLanguage} className="pixel-btn pixel-btn-secondary text-xs">
              {t.langToggle}
            </button>
            <button onClick={() => navigate('/')} className="pixel-btn pixel-btn-secondary text-xs flex items-center gap-1">
              <Home className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('/talk-tech-bloom')} className="pixel-btn pixel-btn-secondary text-xs flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> {t.backToForm}
            </button>
            <button onClick={handleLogout} className="pixel-btn text-xs flex items-center gap-1" style={{ background: '#dc2626' }}>
              <LogOut className="w-4 h-4" /> {t.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { key: 'total', icon: Users, color: COLORS.primary },
            { key: 'pending', icon: Clock, color: '#eab308' },
            { key: 'accepted', icon: CheckCircle, color: '#22c55e' },
            { key: 'rejected', icon: XCircle, color: '#ef4444' }
          ].map(({ key, icon: Icon, color }) => (
            <div key={key} className="bg-white border-3 border-gray-700 p-4" style={{ boxShadow: '4px 4px 0 #c4c4c4' }}>
              <div className="flex items-center gap-3">
                <Icon className="w-8 h-8" style={{ color }} />
                <div>
                  <p className="font-noto text-sm text-gray-700 font-medium">{t[key]}</p>
                  <p className="font-boldpixels text-2xl" style={{ color }}>{stats[key]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white border-3 border-gray-700 p-4 mb-6" style={{ boxShadow: '4px 4px 0 #c4c4c4' }}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Search className="w-5 h-5 text-gray-600" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.search}
                className="pixel-input flex-1 md:w-64 font-noto"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pixel-input font-noto"
              >
                <option value="all">{t.all}</option>
                <option value="pending">{t.pending}</option>
                <option value="accepted">{t.accepted}</option>
                <option value="rejected">{t.rejected}</option>
              </select>
              
              <button onClick={handleExport} className="pixel-btn flex items-center gap-1">
                <Download className="w-4 h-4" /> {t.export}
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border-3 border-gray-700 overflow-hidden" style={{ boxShadow: '4px 4px 0 #c4c4c4' }}>
          {isLoading ? (
            <div className="p-8 text-center font-noto text-gray-700">Loading...</div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center font-noto text-gray-600">{t.noApplications}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-200 border-b-2 border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-start font-noto font-bold text-sm text-gray-800">{t.name}</th>
                    <th className="px-4 py-3 text-start font-noto font-bold text-sm text-gray-800">{t.email}</th>
                    <th className="px-4 py-3 text-start font-noto font-bold text-sm text-gray-800">{t.category}</th>
                    <th className="px-4 py-3 text-start font-noto font-bold text-sm text-gray-800">{t.status}</th>
                    <th className="px-4 py-3 text-start font-noto font-bold text-sm text-gray-800">{t.date}</th>
                    <th className="px-4 py-3 text-start font-noto font-bold text-sm text-gray-800">{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, idx) => (
                    <tr key={app.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 font-noto text-sm text-gray-800 font-medium">{app.full_name}</td>
                      <td className="px-4 py-3 font-noto text-sm text-gray-700">{app.email}</td>
                      <td className="px-4 py-3 font-noto text-sm text-gray-700">{t.categories[app.category] || app.category}</td>
                      <td className="px-4 py-3">{getStatusBadge(app.status)}</td>
                      <td className="px-4 py-3 font-noto text-sm text-gray-700">{formatDate(app.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => setSelectedApp(app)} className="hover:opacity-70" style={{ color: COLORS.primary }}>
                            <Eye className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(app.id)} className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ boxShadow: '8px 8px 0 #535353' }}>
            <div className="sticky top-0 bg-white border-b-2 border-gray-400 p-4 flex items-center justify-between">
              <h2 className="font-boldpixels text-lg" style={{ color: COLORS.primary }}>{t.applicationDetails}</h2>
              <button onClick={() => setSelectedApp(null)} className="text-gray-600 hover:text-gray-800">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <DetailRow label={t.name} value={selectedApp.full_name} />
              <DetailRow label={t.email} value={selectedApp.email} />
              <DetailRow label={t.phone} value={selectedApp.phone} />
              <DetailRow label={t.category} value={t.categories[selectedApp.category] || selectedApp.category} />
              {selectedApp.category_other && <DetailRow label="" value={selectedApp.category_other} />}
              <DetailRow 
                label={t.interests} 
                value={selectedApp.tech_interests?.map(i => t.interests_labels[i] || i).join(', ')} 
              />
              {selectedApp.tech_interests_other && <DetailRow label="" value={selectedApp.tech_interests_other} />}
              <DetailRow label={t.goal} value={t.goals[selectedApp.goal] || selectedApp.goal} />
              {selectedApp.goal_other && <DetailRow label="" value={selectedApp.goal_other} />}
              <DetailRow label={t.confirmed} value={selectedApp.confirmed_attendance ? t.yes : t.no} />
              <DetailRow label={t.date} value={formatDate(selectedApp.created_at)} />
              
              <div className="pt-4 border-t-2 border-gray-300">
                <p className="font-noto font-bold text-gray-800 text-sm mb-3">{t.updateStatus}</p>
                <div className="flex gap-2">
                  {['pending', 'accepted', 'rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedApp.id, status)}
                      className={`px-4 py-2 text-sm font-noto font-bold border-2 ${
                        selectedApp.status === status 
                          ? 'bg-gray-800 text-white border-gray-800' 
                          : 'bg-white text-gray-800 border-gray-400 hover:border-gray-800'
                      }`}
                    >
                      {t[status]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1">
      {label && <span className="font-noto font-bold text-sm text-gray-600 sm:w-32">{label}:</span>}
      <span className="font-noto text-sm text-gray-800">{value}</span>
    </div>
  );
}
