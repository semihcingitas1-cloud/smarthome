import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { getMyAutomations, createAutomation, updateAutomation, deleteAutomation, triggerAutomation, toggleAutomationLocally, clearAutomationError } from '../../redux/automationSlice';

import Sidebar from '../../layout/Sidebar';

import { Plus, Play, Clock, Zap, Trash2, ChevronRight, AlertCircle, ToggleRight, ToggleLeft, Bell, ArrowRight, MoreVertical, Settings2, Calendar, Activity, X, Search, Filter, Smartphone, Lightbulb, Thermometer, Droplet, Lock, Download, Upload, Copy, Edit3, Power, CheckCircle2, TrendingUp, Shield, Moon, Sun, Home, Wind } from 'lucide-react';

const Automation = () => {

  const dispatch = useDispatch();

  const { automations, loading, error, actionLoading } = useSelector((state) => state.automation);

  const [activeTab, setActiveTab] = useState('active');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({ 

    name: "", 
    description: "", 
    type: "Safety", 
    triggerType: "device", 
    triggerDevice: "", 
    triggerCondition: "", 
    actionDevice: "", 
    actionCommand: "", 
    enabled: true, 
    notifications: true 
  });

  useEffect(() => {

    dispatch(getMyAutomations());
  }, [dispatch]);

  useEffect(() => {

    if (error) {

      toast.error(error);
      dispatch(clearAutomationError());
    }
  }, [error, dispatch]);

  const deviceOptions = [

    { id: 'gas-sensor', name: 'Mutfak Gaz Sensörü', type: 'sensor', icon: <Wind size={16} /> },
    { id: 'water-sensor', name: 'Banyo Su Sensörü', type: 'sensor', icon: <Droplet size={16} /> },
    { id: 'door-lock', name: 'Akıllı Kapı Kilidi', type: 'sensor', icon: <Lock size={16} /> },
    { id: 'lights-living', name: 'Salon Işıkları', type: 'actuator', icon: <Lightbulb size={16} /> },
    { id: 'lights-all', name: 'Tüm Aydınlatmalar', type: 'actuator', icon: <Lightbulb size={16} /> },
    { id: 'valve-main', name: 'Ana Vana Rölesi', type: 'actuator', icon: <Power size={16} /> },
    { id: 'climate', name: 'Klima Sistemi', type: 'actuator', icon: <Thermometer size={16} /> },
  ];

  const conditionTemplates = [
    { label: 'Eşik Değer Üstü', value: '> {value}', type: 'sensor' },
    { label: 'Eşik Değer Altı', value: '< {value}', type: 'sensor' },
    { label: 'Eşittir', value: '== {value}', type: 'sensor' },
    { label: 'Algılandı', value: 'Detected', type: 'sensor' },
    { label: 'Açıldı', value: 'Opened', type: 'sensor' },
    { label: 'Kapatıldı', value: 'Closed', type: 'sensor' },
  ];

  const actionCommands = [
    { label: 'Aç', value: 'ON' },
    { label: 'Kapat', value: 'OFF' },
    { label: 'Bildirim Gönder', value: 'SEND_ALERT' },
    { label: 'Değer Ayarla', value: 'SET_{value}' },
  ];

  const filteredAutomations = automations.filter(auto => {
    const matchesSearch = auto.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (auto.description && auto.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || auto.type === filterType;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && auto.isActive) || 
                      (activeTab === 'history' && !auto.isActive);
    return matchesSearch && matchesType && matchesTab;
  });

  const handleDuplicate = async (automation) => {
    try {
      const duplicateData = {
        name: `${automation.name} (Kopya)`,
        description: automation.description,
        type: automation.type,
        trigger: automation.trigger,
        action: automation.action,
        isActive: false,
        notifications: automation.notifications
      };
      
      await dispatch(createAutomation(duplicateData)).unwrap();
      toast.success('Otomasyon kopyalandı!');
    } catch (err) {
      toast.error('Kopyalama başarısız!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu otomasyonu silmek istediğinize emin misiniz?')) {
      try {
        await dispatch(deleteAutomation(id)).unwrap();
        toast.success('Otomasyon silindi!');
        if (isDetailsModalOpen && selectedAutomation?._id === id) {
          setIsDetailsModalOpen(false);
        }
      } catch (err) {
        toast.error('Silme başarısız!');
      }
    }
  };

  const handleToggle = async (automation) => {
    try {
      // Optimistik update
      dispatch(toggleAutomationLocally(automation._id));
      
      await dispatch(updateAutomation({
        id: automation._id,
        automationData: { isActive: !automation.isActive }
      })).unwrap();
      
      toast.success(automation.isActive ? 'Otomasyon devre dışı bırakıldı' : 'Otomasyon etkinleştirildi');
    } catch (err) {
      // Hata durumunda geri al
      dispatch(toggleAutomationLocally(automation._id));
      toast.error('İşlem başarısız!');
    }
  };

  const handleTriggerManually = async (id) => {
    try {
      await dispatch(triggerAutomation(id)).unwrap();
      toast.success('Otomasyon manuel olarak tetiklendi!');
    } catch (err) {
      toast.error('Tetikleme başarısız!');
    }
  };

  const openDetails = (automation) => {
    setSelectedAutomation(automation);
    setIsDetailsModalOpen(true);
  };

  const handleCreateAutomation = async () => {
    if (!form.name || !form.triggerDevice || !form.triggerCondition || !form.actionDevice || !form.actionCommand) {
      toast.error('Lütfen tüm zorunlu alanları doldurun!');
      return;
    }

    try {
      const automationData = {
        name: form.name,
        description: form.description,
        type: form.type,
        trigger: {
          type: form.triggerType,
          device: form.triggerDevice,
          condition: form.triggerCondition
        },
        action: {
          device: form.actionDevice,
          command: form.actionCommand
        },
        isActive: form.enabled,
        notifications: form.notifications
      };

      await dispatch(createAutomation(automationData)).unwrap();
      
      toast.success('Otomasyon başarıyla oluşturuldu!');
      setIsCreateModalOpen(false);
      setStep(1);
      setForm({
        name: "",
        description: "",
        type: "Safety",
        triggerType: "device",
        triggerDevice: "",
        triggerCondition: "",
        actionDevice: "",
        actionCommand: "",
        enabled: true,
        notifications: true
      });
    } catch (err) {
      toast.error('Otomasyon oluşturulamadı!');
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      Safety: 'bg-red-500/10 text-red-400 border-red-500/20',
      Schedule: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      Event: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    };
    return colors[type] || colors.Safety;
  };

  const getTypeIcon = (type) => {
    const icons = {
      Safety: <Shield size={20} />,
      Schedule: <Clock size={20} />,
      Event: <Zap size={20} />,
    };
    return icons[type] || icons.Safety;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Hiç çalışmadı';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatLastRun = (dateString) => {
    if (!dateString) return 'Hiç çalışmadı';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // saniye cinsinden

    if (diff < 60) return 'Az önce';
    if (diff < 3600) return `${Math.floor(diff / 60)} dakika önce`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
    if (diff < 172800) return 'Dün';
    return formatDate(dateString);
  };

  return (
    <div className="flex bg-slate-950 min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:ml-0 overflow-x-hidden">
        <div className="p-6 space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Otomasyonlar</h2>
              <p className="text-slate-400">Cihazların birbiriyle nasıl konuşacağını buradan yönetin.</p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button 
                onClick={() => setIsCreateModalOpen(true)} 
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all font-bold"
                disabled={actionLoading}
              >
                <Plus size={20} /> Yeni Otomasyon
              </button>
            </div>
          </div>

          {/* İSTATİSTİKLER */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { 
                label: "Aktif Senaryo", 
                value: automations.filter(a => a.isActive).length, 
                icon: <Zap className="text-yellow-400" />, 
                color: "bg-yellow-500/10", 
                trend: `+${automations.filter(a => a.isActive).length}` 
              },
              { 
                label: "Toplam Otomasyon", 
                value: automations.length, 
                icon: <Activity className="text-blue-400" />, 
                color: "bg-blue-500/10", 
                trend: `${automations.length}` 
              },
              { 
                label: "Kritik Güvenlik", 
                value: automations.filter(a => a.type === 'Safety').length, 
                icon: <Shield className="text-red-400" />, 
                color: "bg-red-500/10", 
                trend: `${automations.filter(a => a.type === 'Safety').length}` 
              },
              { 
                label: "Zamanlı Görev", 
                value: automations.filter(a => a.type === 'Schedule').length, 
                icon: <Clock className="text-green-400" />, 
                color: "bg-green-500/10", 
                trend: `${automations.filter(a => a.type === 'Schedule').length}` 
              }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center justify-between hover:bg-slate-900/70 transition-all group">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
                  <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                    <TrendingUp size={12} /> {stat.trend}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}>{stat.icon}</div>
              </div>
            ))}
          </div>

          {/* FİLTRELER VE ARAMA */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-2 p-1 bg-slate-900/50 w-fit rounded-2xl border border-slate-800">
              {['active', 'all', 'history'].map((t) => (
                <button 
                  key={t} 
                  onClick={() => setActiveTab(t)} 
                  className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === t ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {t === 'active' ? 'Çalışanlar' : t === 'all' ? 'Tümü' : 'Geçmiş'}
                </button>
              ))}
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Otomasyon ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">Tüm Tipler</option>
                <option value="Safety">Güvenlik</option>
                <option value="Schedule">Zamanlama</option>
                <option value="Event">Olay</option>
              </select>
            </div>
          </div>

          {/* YÜKLEME DURUMU */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* OTOMASYON LİSTESİ */}
          {!loading && (
            <div className="grid grid-cols-1 gap-4">
              {filteredAutomations.map((rule) => (
                <div 
                  key={rule._id} 
                  className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800/40 hover:border-slate-700 transition-all cursor-pointer"
                  onClick={() => openDetails(rule)}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    
                    {/* SOL BÖLÜM */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`p-3 rounded-2xl ${getTypeColor(rule.type)} border`}>
                        {getTypeIcon(rule.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors truncate">{rule.name}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getTypeColor(rule.type)}`}>
                            {rule.type}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-1">{rule.description || 'Açıklama yok'}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {formatDate(rule.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity size={12} /> {rule.triggerCount || 0} kez çalıştı
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AKIŞ BÖLÜMÜ */}
                    <div className="flex items-center gap-3 bg-slate-950/50 px-5 py-3 rounded-2xl border border-slate-800/50 flex-[1.5] overflow-x-auto">
                      <div className="text-center min-w-[100px]">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">EĞER</p>
                        <p className="text-xs text-white font-medium truncate">{rule.trigger?.device || 'Cihaz'}</p>
                      </div>
                      <ArrowRight size={16} className="text-slate-700 flex-shrink-0" />
                      <div className="text-center min-w-[80px]">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">DURUM</p>
                        <p className="text-xs text-blue-400 font-bold truncate">{rule.trigger?.condition || 'Koşul'}</p>
                      </div>
                      <ChevronRight size={20} className="text-slate-800 mx-1 flex-shrink-0" />
                      <div className="text-center min-w-[100px]">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">AKSİYON</p>
                        <p className="text-xs text-green-400 font-bold truncate">{rule.action?.device || 'Cihaz'}</p>
                        <p className="text-[10px] text-slate-600">{rule.action?.command || 'Komut'}</p>
                      </div>
                    </div>

                    {/* SAĞ BÖLÜM */}
                    <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                      <div className="text-right hidden xl:block">
                        <p className="text-[10px] text-slate-500 font-bold uppercase">SON ÇALIŞMA</p>
                        <p className="text-xs text-slate-300">{formatLastRun(rule.lastTriggeredAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggle(rule);
                          }}
                          disabled={actionLoading}
                          className={`p-2 transition-all rounded-xl hover:bg-slate-800 ${rule.isActive ? 'text-blue-500' : 'text-slate-600'}`}
                        >
                          {rule.isActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicate(rule);
                          }}
                          disabled={actionLoading}
                          className="p-2.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                        >
                          <Copy size={18} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(rule._id);
                          }}
                          disabled={actionLoading}
                          className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* BOŞ DURUM */}
          {!loading && filteredAutomations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
              <div className="p-6 bg-slate-800/50 rounded-full text-slate-600">
                <Zap size={40} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {searchQuery || filterType !== 'all' ? 'Sonuç Bulunamadı' : 'Henüz Otomasyon Yok'}
                </h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-2">
                  {searchQuery || filterType !== 'all' 
                    ? 'Arama kriterlerinize uygun otomasyon bulunamadı.' 
                    : 'Evini akıllı hale getirmek için cihazların arasında kurallar oluşturmaya başla.'}
                </p>
              </div>
            </div>
          )}

          {/* OLUŞTURMA MODALI */}
          {isCreateModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={() => setIsCreateModalOpen(false)}
              />
              <div className="relative bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-8 space-y-6 max-h-[90vh] overflow-y-auto">
                
                {/* BAŞLIK */}
                <div className="flex justify-between items-center sticky top-0 bg-slate-900 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Yeni Otomasyon</h3>
                    <p className="text-sm text-slate-400 mt-1">Adım {step}/4</p>
                  </div>
                  <button 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* İLERLEME ÇUBUĞU */}
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((s) => (
                    <div 
                      key={s} 
                      className={`h-2 flex-1 rounded-full transition-all ${s <= step ? 'bg-blue-500' : 'bg-slate-800'}`}
                    />
                  ))}
                </div>

                {/* ADIM 1 - TEMEL BİLGİLER */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2">Otomasyon Adı *</label>
                      <input
                        placeholder="örn: Sabah Rutini"
                        className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2">Açıklama</label>
                      <textarea
                        placeholder="Bu otomasyon ne yapar?"
                        rows={3}
                        className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2">Kategori *</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Safety', 'Schedule', 'Event'].map((type) => (
                          <button
                            key={type}
                            onClick={() => setForm({ ...form, type })}
                            className={`p-4 rounded-xl border-2 transition-all text-center ${
                              form.type === type 
                                ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                                : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div className="mb-2">{getTypeIcon(type)}</div>
                            <div className="text-sm font-bold">{type === 'Safety' ? 'Güvenlik' : type === 'Schedule' ? 'Zamanlama' : 'Olay'}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ADIM 2 - TETİKLEYİCİ */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                      <p className="text-sm text-blue-400 font-bold">🔔 Tetikleyici Ayarı</p>
                      <p className="text-xs text-slate-400 mt-1">Bu otomasyon ne zaman çalışacak?</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2">Tetikleyici Tipi</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 'device', label: 'Cihaz Durumu', icon: <Smartphone size={16} /> },
                          { value: 'time', label: 'Zaman', icon: <Clock size={16} /> }
                        ].map((t) => (
                          <button
                            key={t.value}
                            onClick={() => setForm({ ...form, triggerType: t.value })}
                            className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                              form.triggerType === t.value
                                ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            {t.icon}
                            <span className="font-bold text-sm">{t.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {form.triggerType === 'device' && (
                      <>
                        <div>
                          <label className="block text-sm font-bold text-slate-300 mb-2">Cihaz Seç *</label>
                          <select
                            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={form.triggerDevice}
                            onChange={(e) => setForm({ ...form, triggerDevice: e.target.value })}
                          >
                            <option value="">Cihaz seçin...</option>
                            {deviceOptions.filter(d => d.type === 'sensor').map((device) => (
                              <option key={device.id} value={device.id}>{device.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-300 mb-2">Koşul *</label>
                          <input
                            placeholder="örn: > 400, Detected, Opened"
                            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={form.triggerCondition}
                            onChange={(e) => setForm({ ...form, triggerCondition: e.target.value })}
                          />
                          <div className="mt-2 flex flex-wrap gap-2">
                            {conditionTemplates.map((template, i) => (
                              <button
                                key={i}
                                onClick={() => setForm({ ...form, triggerCondition: template.value })}
                                className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
                              >
                                {template.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {form.triggerType === 'time' && (
                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">Zaman *</label>
                        <input
                          type="time"
                          className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          value={form.triggerCondition}
                          onChange={(e) => setForm({ ...form, triggerCondition: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* ADIM 3 - AKSİYON */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                      <p className="text-sm text-green-400 font-bold">⚡ Aksiyon Ayarı</p>
                      <p className="text-xs text-slate-400 mt-1">Tetiklendiğinde ne yapılacak?</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2">Hedef Cihaz *</label>
                      <select
                        className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        value={form.actionDevice}
                        onChange={(e) => setForm({ ...form, actionDevice: e.target.value })}
                      >
                        <option value="">Cihaz seçin...</option>
                        {deviceOptions.filter(d => d.type === 'actuator').map((device) => (
                          <option key={device.id} value={device.id}>{device.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2">Komut *</label>
                      <input
                        placeholder="örn: ON, OFF, SET_22"
                        className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        value={form.actionCommand}
                        onChange={(e) => setForm({ ...form, actionCommand: e.target.value })}
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        {actionCommands.map((cmd, i) => (
                          <button
                            key={i}
                            onClick={() => setForm({ ...form, actionCommand: cmd.value })}
                            className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
                          >
                            {cmd.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.notifications}
                          onChange={(e) => setForm({ ...form, notifications: e.target.checked })}
                          className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500/50"
                        />
                        <span className="text-sm text-slate-300 font-medium">Bildirim gönder</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.enabled}
                          onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                          className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500/50"
                        />
                        <span className="text-sm text-slate-300 font-medium">Oluşturduğumda aktif et</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* ADIM 4 - ÖZET */}
                {step === 4 && (
                  <div className="space-y-5">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                      <p className="text-sm text-blue-400 font-bold">✅ Kontrol Et</p>
                      <p className="text-xs text-slate-400 mt-1">Otomasyon doğru görünüyor mu?</p>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-2">Temel Bilgiler</p>
                        <p className="text-white font-bold text-lg">{form.name}</p>
                        {form.description && <p className="text-sm text-slate-400 mt-1">{form.description}</p>}
                        <div className="flex gap-2 mt-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getTypeColor(form.type)}`}>
                            {form.type}
                          </span>
                          {form.enabled && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                              Aktif
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-2">EĞER</p>
                        <p className="text-white">
                          <span className="font-bold">{deviceOptions.find(d => d.id === form.triggerDevice)?.name || form.triggerDevice}</span>
                          {' → '}
                          <span className="text-blue-400 font-bold">{form.triggerCondition}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-center">
                        <ChevronRight size={24} className="text-slate-700" />
                      </div>

                      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-2">O ZAMAN</p>
                        <p className="text-white">
                          <span className="font-bold">{deviceOptions.find(d => d.id === form.actionDevice)?.name || form.actionDevice}</span>
                          {' → '}
                          <span className="text-green-400 font-bold">{form.actionCommand}</span>
                        </p>
                      </div>

                      {form.notifications && (
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Bell size={16} />
                          <span>Bildirimler aktif</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t border-slate-800">
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-bold"
                      disabled={actionLoading}
                    >
                      Geri
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (step < 4) {
                        setStep(step + 1);
                      } else {
                        handleCreateAutomation();
                      }
                    }}
                    disabled={actionLoading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-bold ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? 'İşleniyor...' : step === 4 ? "Kaydet ve Aktif Et" : "Devam"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DETAY MODALI */}
          {isDetailsModalOpen && selectedAutomation && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsDetailsModalOpen(false)}/>

              <div className="relative bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-8 space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-2xl ${getTypeColor(selectedAutomation.type)} border`}>
                      {getTypeIcon(selectedAutomation.type)}
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedAutomation.name}</h3>
                      <p className="text-slate-400 mt-1">{selectedAutomation.description || 'Açıklama yok'}</p>

                      <div className="flex items-center gap-3 mt-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getTypeColor(selectedAutomation.type)}`}>
                          {selectedAutomation.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedAutomation.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-slate-700 text-slate-400'}`}>
                          {selectedAutomation.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => setIsDetailsModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Çalışma Sayısı</p>
                    <p className="text-2xl font-bold text-white">{selectedAutomation.triggerCount || 0}</p>
                  </div>

                  <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Son Çalışma</p>
                    <p className="text-sm font-bold text-white">{formatLastRun(selectedAutomation.lastTriggeredAt)}</p>
                  </div>

                  <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Oluşturulma</p>
                    <p className="text-sm font-bold text-white">{formatDate(selectedAutomation.createdAt)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-bold text-slate-400 uppercase">Akış Detayı</p>

                  <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-xl">
                    <p className="text-xs text-blue-400 font-bold uppercase mb-2">EĞER (Tetikleyici)</p>
                    <p className="text-white font-bold text-lg">{selectedAutomation.trigger?.device || 'Cihaz'}</p>
                    <p className="text-blue-400 font-mono mt-2">{selectedAutomation.trigger?.condition || 'Koşul'}</p>
                  </div>

                  <div className="flex justify-center">
                    <div className="p-3 bg-slate-800 rounded-full"><ChevronRight size={20} className="text-slate-400" /></div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/20 p-5 rounded-xl">
                    <p className="text-xs text-green-400 font-bold uppercase mb-2">O ZAMAN (Aksiyon)</p>
                    <p className="text-white font-bold text-lg">{selectedAutomation.action?.device || 'Cihaz'}</p>
                    <p className="text-green-400 font-mono mt-2">{selectedAutomation.action?.command || 'Komut'}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-800">
                  <button 
                    onClick={() => handleTriggerManually(selectedAutomation._id)}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-xl transition-all font-bold disabled:opacity-50"
                  >
                    <Play size={18} /> Manuel Tetikle
                  </button>
                  <button 
                    onClick={() => handleDuplicate(selectedAutomation)}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-xl transition-all font-bold disabled:opacity-50"
                  >
                    <Copy size={18} /> Kopyala
                  </button>
                  <button 
                    onClick={() => handleDelete(selectedAutomation._id)}
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 px-4 py-3 rounded-xl transition-all font-bold border border-red-500/20 disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Automation;