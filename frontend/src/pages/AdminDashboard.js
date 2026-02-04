import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';
import axios from 'axios';
import { 
  LogOut, Download, Search, Eye, Trash2, X, 
  Users, Clock, CheckCircle, XCircle, ArrowLeft, Home 
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LOGO_URL = "/images/logos/smart-syria-logo.png";

export default function AdminDashboard({ onLogout, onBackToForm, onBackToHome }) {
  const { t, isRTL, toggleLanguage, language } = useLanguage();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      const [appsRes, statsRes] = await Promise.all([
        axios.get(`${API}/admin/applications`, { params: { status: statusFilter } }),
        axios.get(`${API}/admin/stats`)
      ]);
      setApplications(appsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await axios.patch(`${API}/admin/applications/${appId}`, { status: newStatus });
      toast.success('Status updated');
      fetchData();
      if (selectedApp?.id === appId) {
        setSelectedApp(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (appId) => {
    if (!window.confirm(t('confirmDelete'))) return;
    
    try {
      await axios.delete(`${API}/admin/applications/${appId}`);
      toast.success('Application deleted');
      fetchData();
      if (selectedApp?.id === appId) {
        setShowModal(false);
        setSelectedApp(null);
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleExport = () => {
    const url = `${API}/admin/export${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`;
    window.open(url, '_blank');
  };

  const filteredApps = applications.filter(app => 
    app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const classes = {
      pending: 'pixel-badge-pending',
      accepted: 'pixel-badge-accepted',
      rejected: 'pixel-badge-rejected'
    };
    return `pixel-badge ${classes[status] || classes.pending}`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(language === 'ar' ? 'ar-SY' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fieldLabels = {
    programming: language === 'ar' ? 'البرمجة' : 'Programming',
    art: language === 'ar' ? 'التصميم' : 'Art/Design',
    writing: language === 'ar' ? 'الكتابة' : 'Writing',
    player: language === 'ar' ? 'لاعب' : 'Gamer',
    other: language === 'ar' ? 'أخرى' : 'Other'
  };

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="crt-overlay" />
      
      {/* Header */}
      <header className="border-b-2 border-gray-800 bg-black/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={LOGO_URL} alt="Logo" className="w-10 h-10" />
            <h1 className={`text-lg md:text-xl text-[#FF3B3B] ${isRTL ? 'font-handjet' : 'font-pixel'}`}>
              {t('dashboard')}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="pixel-btn text-xs py-2 px-3"
              data-testid="admin-lang-toggle"
            >
              {t('langToggle')}
            </button>
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="pixel-btn pixel-btn-secondary text-xs py-2 px-3 flex items-center gap-1"
                data-testid="back-to-home-btn"
              >
                <Home className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onBackToForm}
              className="pixel-btn pixel-btn-secondary text-xs py-2 px-3 flex items-center gap-1"
              data-testid="back-to-form-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('backToForm')}
            </button>
            <button
              onClick={onLogout}
              className="pixel-btn text-xs py-2 px-3 flex items-center gap-1 bg-red-600"
              data-testid="logout-btn"
            >
              <LogOut className="w-4 h-4" />
              {t('logout')}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="pixel-card flex items-center gap-4" data-testid="stat-total">
            <Users className="w-8 h-8 text-[#FACC15]" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-sm text-gray-400">{t('total')}</p>
            </div>
          </div>
          <div className="pixel-card flex items-center gap-4" data-testid="stat-pending">
            <Clock className="w-8 h-8 text-[#FACC15]" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
              <p className="text-sm text-gray-400">{t('pending')}</p>
            </div>
          </div>
          <div className="pixel-card flex items-center gap-4" data-testid="stat-accepted">
            <CheckCircle className="w-8 h-8 text-[#4ADE80]" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.accepted}</p>
              <p className="text-sm text-gray-400">{t('accepted')}</p>
            </div>
          </div>
          <div className="pixel-card flex items-center gap-4" data-testid="stat-rejected">
            <XCircle className="w-8 h-8 text-[#EF4444]" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.rejected}</p>
              <p className="text-sm text-gray-400">{t('rejected')}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              className="pixel-input pl-10 w-full"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="search-input"
            />
          </div>
          
          <select
            className="pixel-input w-full md:w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            data-testid="status-filter"
          >
            <option value="all">{t('all')}</option>
            <option value="pending">{t('pending')}</option>
            <option value="accepted">{t('accepted')}</option>
            <option value="rejected">{t('rejected')}</option>
          </select>
          
          <button
            onClick={handleExport}
            className="pixel-btn pixel-btn-secondary flex items-center justify-center gap-2"
            data-testid="export-btn"
          >
            <Download className="w-4 h-4" />
            {t('export')}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-[#FF3B3B] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>{t('noApplications')}</p>
            </div>
          ) : (
            <table className="pixel-table" data-testid="applications-table">
              <thead>
                <tr>
                  <th>{t('fullName')}</th>
                  <th>{t('email')}</th>
                  <th>{language === 'ar' ? 'المجال' : 'Field'}</th>
                  <th>{language === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th>{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr key={app.id} data-testid={`app-row-${app.id}`}>
                    <td className="font-medium">{app.full_name}</td>
                    <td className="text-gray-400">{app.email}</td>
                    <td>
                      {app.main_field.map(f => fieldLabels[f] || f).join(', ')}
                    </td>
                    <td>
                      <span className={getStatusBadge(app.status)}>
                        {t(app.status)}
                      </span>
                    </td>
                    <td className="text-sm text-gray-400">
                      {formatDate(app.created_at)}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setSelectedApp(app); setShowModal(true); }}
                          className="p-2 hover:bg-gray-800 transition-colors"
                          data-testid={`view-btn-${app.id}`}
                        >
                          <Eye className="w-4 h-4 text-[#4ADE80]" />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-2 hover:bg-gray-800 transition-colors"
                          data-testid={`delete-btn-${app.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-[#EF4444]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="pixel-card max-w-2xl w-full max-h-[90vh] overflow-y-auto slide-in" data-testid="detail-modal">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl text-[#FF3B3B] ${isRTL ? 'font-handjet' : 'font-pixel'}`}>
                {selectedApp.full_name}
              </h2>
              <button
                onClick={() => { setShowModal(false); setSelectedApp(null); }}
                className="p-2 hover:bg-gray-800 transition-colors"
                data-testid="close-modal-btn"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Status Update */}
            <div className="mb-6 p-4 border-2 border-gray-700">
              <label className="block mb-2 text-sm text-gray-400">{t('updateStatus')}</label>
              <div className="flex gap-2">
                {['pending', 'accepted', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(selectedApp.id, status)}
                    className={`pixel-btn text-xs py-2 px-4 ${
                      selectedApp.status === status 
                        ? status === 'accepted' ? 'bg-[#4ADE80] text-black' 
                          : status === 'rejected' ? 'bg-[#EF4444]' 
                          : 'bg-[#FACC15] text-black'
                        : 'pixel-btn-secondary'
                    }`}
                    data-testid={`status-btn-${status}`}
                  >
                    {t(status)}
                  </button>
                ))}
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-4">
              <DetailRow label={t('email')} value={selectedApp.email} />
              <DetailRow label={t('age')} value={selectedApp.age} />
              <DetailRow label={t('residence')} value={selectedApp.residence} />
              <DetailRow label={t('whatsapp')} value={selectedApp.whatsapp} />
              <DetailRow 
                label={t('mainField')} 
                value={selectedApp.main_field.map(f => fieldLabels[f] || f).join(', ')} 
              />
              {selectedApp.main_field_other && (
                <DetailRow label={language === 'ar' ? 'مجال آخر' : 'Other Field'} value={selectedApp.main_field_other} />
              )}
              <DetailRow label={t('hasProject')} value={selectedApp.has_game_project} />
              {selectedApp.game_project_details && (
                <DetailRow label={language === 'ar' ? 'تفاصيل المشروع' : 'Project Details'} value={selectedApp.game_project_details} />
              )}
              <DetailRow 
                label={t('knownTools')} 
                value={selectedApp.known_tools.join(', ')} 
              />
              {selectedApp.known_tools_other && (
                <DetailRow label={language === 'ar' ? 'أدوات أخرى' : 'Other Tools'} value={selectedApp.known_tools_other} />
              )}
              <DetailRow label={t('workPreference')} value={selectedApp.work_preference} />
              <DetailRow label={t('timeCommitment')} value={selectedApp.time_commitment} />
              <DetailRow label={t('internetStability')} value={selectedApp.internet_stability} />
              <DetailRow label={t('hasIdea')} value={selectedApp.has_game_idea} />
              {selectedApp.game_idea_details && (
                <DetailRow label={language === 'ar' ? 'تفاصيل الفكرة' : 'Idea Details'} value={selectedApp.game_idea_details} />
              )}
              <DetailRow label={t('joinReason')} value={selectedApp.join_reason} isLong />
              <DetailRow label={t('wantsElite')} value={selectedApp.wants_elite_stage} />
              {selectedApp.final_notes && (
                <DetailRow label={t('finalNotes')} value={selectedApp.final_notes} isLong />
              )}
            </div>

            <div className="mt-6 pt-4 border-t-2 border-gray-700">
              <button
                onClick={() => { setShowModal(false); setSelectedApp(null); }}
                className="pixel-btn w-full"
                data-testid="close-detail-btn"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, isLong }) {
  return (
    <div className={`${isLong ? '' : 'flex items-start gap-4'} border-b border-gray-800 pb-3`}>
      <span className="text-sm text-gray-400 block mb-1">{label}:</span>
      <span className={`${isLong ? 'block' : ''} text-white`}>{value || '-'}</span>
    </div>
  );
}
