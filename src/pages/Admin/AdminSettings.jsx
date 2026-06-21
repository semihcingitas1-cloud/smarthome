import React, { useEffect, useState } from 'react';

import AdminSidebar from '../../layout/AdminSidebar';

import { Save, Upload, Trash2, Plus, Eye, EyeOff, Home, Zap, AlignLeft, Star, Mail, Facebook, Twitter, Instagram, Linkedin, Settings as SettingsIcon, RefreshCw, CheckCircle, Folder, FolderPlus, PlusCircle, CornerDownRight, FolderTree } from 'lucide-react';

const AdminSettings = () => {

  const [activeTab, setActiveTab] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [categoryInput, setCategoryInput] = useState({ name: '', parent: '' });

  useEffect(() => {

    window.scrollTo(0, 0);
  }, []);

  const addCategory = () => {

    if (!categoryInput.name.trim()) return;
    const updatedCategories = [...(formData.categories || []), categoryInput];
    handleChange('categories', updatedCategories);
    setCategoryInput({ name: '', parent: '' });
  };

  const removeCategory = (indexToId) => {

    const filtered = formData.categories.filter((_, index) => index !== indexToId);
    handleChange('categories', filtered);
  };

  const handleChange = (key, value) => {

    setFormData((prevData) => ({...prevData, [key]: value }));
  };

  const [formData, setFormData] = useState({

    name: "",
    sku: "",
    description: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    features: [],
    specifications: [],
    categories: [],
    tags: []
  });

  const [heroData, setHeroData] = useState({

    badge: 'Geleceğin Teknolojisi Bugün Burada',
    title: 'Evinizi Akıllı Bir Merkeze Dönüştürün',
    highlightText: 'Akıllı Bir Merkeze',
    description: 'ESP32-S3 mimarisi üzerine kurulu, düşük gecikmeli ve uçtan uca şifreli ev otomasyon sistemi ile kontrol tamamen sizde.',
    primaryButtonText: 'Hemen Başlayın',
    secondaryButtonText: 'Demoyu İzle',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070',
    stats: [
      { number: '50K+', label: 'Aktif Kullanıcı' },
      { number: '99.9%', label: 'Uptime Garantisi' },
      { number: '500K+', label: 'Bağlı Cihaz' },
      { number: '4.9/5', label: 'Müşteri Memnuniyeti' }
    ]
  });

  const [features, setFeatures] = useState([
    {
      id: 1,
      icon: 'Shield',
      title: 'Tam Güvenlik',
      description: 'Gelişmiş şifreleme ve anlık bildirimlerle eviniz 7/24 koruma altında.',
      color: 'blue'
    },
    {
      id: 2,
      icon: 'Layers',
      title: 'Modüler Yapı',
      description: 'Kendi sensörlerinizi ekleyin veya mevcut otomasyonları dakikalar içinde güncelleyin.',
      color: 'purple'
    },
    {
      id: 3,
      icon: 'Smartphone',
      title: 'Uzaktan Erişim',
      description: 'Dünyanın neresinde olursanız olun, mobil uygulama üzerinden kontrol sağlayın.',
      color: 'emerald'
    }
  ]);

  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      role: 'Yazılım Geliştirici',
      comment: 'ESP32 entegrasyonu harika çalışıyor. Kendi sensörlerimi eklemek çok kolaydı.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    {
      id: 2,
      name: 'Elif Kaya',
      role: 'Ev Hanımı',
      comment: 'Enerji faturalarım %40 düştü. Mobil uygulama çok kullanışlı.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=45'
    }
  ]);

  const [contactData, setContactData] = useState({

    email: 'destek@smarthub.com',
    phone: '+90 (212) 123 45 67',
    address: 'İstanbul, Türkiye',
    socialLinks: {
      facebook: '#',
      twitter: '#',
      instagram: '#',
      linkedin: '#'
    }
  });

  const handleSave = async () => {

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsSaving(false);
    alert('Değişiklikler başarıyla sisteme kaydedildi!');
  };

  const tabs = [

    { id: 'hero', label: 'Ana Banner', icon: <Home size={18} /> },
    { id: 'features', label: 'Özellikler', icon: <Zap size={18} /> },
    { id: 'testimonials', label: 'Yorumlar', icon: <Star size={18} /> },
    { id: 'categories', label: 'Kategoriler', icon: <AlignLeft size={18} /> },
    { id: 'contact', label: 'İletişim', icon: <Mail size={18} /> }
  ];

  const addFeature = () => {

    setFeatures([...features, {

      id: Date.now(),
      icon: 'Zap',
      title: 'Yeni Özellik',
      description: 'Özellik açıklaması girin.',
      color: 'blue'
    }]);
  };

  const removeFeature = (id) => {

    setFeatures(features.filter(f => f.id !== id));
  };

  const addTestimonial = () => {

    setTestimonials([...testimonials, {

      id: Date.now(),
      name: 'Yeni Kullanıcı',
      role: 'Kullanıcı Rolü',
      comment: 'Mükemmel bir sistem, çok memnun kaldım.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=1'
    }]);
  };

  return (

    <div className="flex min-h-screen dark:bg-slate-950 dark:text-slate-100">

      <AdminSidebar />

      <div className="flex-1 min-h-screen flex flex-col overflow-x-hidden">
        
        <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50">

          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 self-start sm:self-center">

              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/10">
                <SettingsIcon size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">Site İçerik Yönetimi</h1>
                <p className="text-xs text-slate-400">Ön yüz entegrasyon ayarlarını kişiselleştirin</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button 
                onClick={() => setPreviewMode(!previewMode)} 
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border text-sm font-semibold ${
                  previewMode 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
              >
                {previewMode ? <EyeOff size={16} /> : <Eye size={16} />}
                <span>{previewMode ? 'Düzenleme Modu' : 'Canlı Önizleme'}</span>
              </button>

              <button 
                onClick={handleSave} 
                disabled={isSaving} 
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/10 disabled:opacity-50 text-sm"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Değişiklikleri Yayınla</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* İçerik Gövdesi */}
        <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1">
          {previewMode ? (
            /* GERÇEK ZAMANLI CANLI ÖNİZLEME (PREVIEW MODE) */
            <div className="space-y-16 animate-fade-in bg-slate-900/30 border border-slate-800/60 rounded-3xl p-4 md:p-8">
              
              {/* Hero Önizleme */}
              <div className="text-center max-w-3xl mx-auto pt-8">
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-semibold uppercase tracking-wider">{heroData.badge}</span>
                <h1 className="text-3xl md:text-5xl font-extrabold mt-4 tracking-tight leading-tight">
                  {heroData.title.replace(heroData.highlightText, '')}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{heroData.highlightText}</span>
                </h1>
                <p className="text-slate-400 mt-4 text-base leading-relaxed">{heroData.description}</p>
                <div className="mt-6 flex justify-center gap-3">
                  <button className="px-5 py-2.5 bg-blue-600 font-bold rounded-xl text-sm text-white">{heroData.primaryButtonText}</button>
                  <button className="px-5 py-2.5 bg-slate-800 border border-slate-700 font-bold rounded-xl text-sm text-slate-300">{heroData.secondaryButtonText}</button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                  {heroData.stats.map((st, i) => (
                    <div key={i}>
                      <div className="text-2xl font-black text-indigo-400">{st.number}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{st.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Özellikler Önizleme */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {features.map((ft) => (
                  <div key={ft.id} className="p-6 bg-slate-900 rounded-2xl border border-slate-800/80">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400"><Zap size={20} /></div>
                    <h4 className="font-bold text-lg mb-1">{ft.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{ft.description}</p>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            /* PANEL EDİTÖRÜ MODU */
            <div className="grid grid-cols-12 gap-6">
              
              {/* Sol Sekme Menüsü */}
              <div className="col-span-12 lg:col-span-3">
                <div className="bg-slate-900 rounded-2xl border border-slate-800/80 p-2 sticky top-28">
                  {tabs.map((tab) => (
                    <button 
                      key={tab.id} 
                      onClick={() => setActiveTab(tab.id)} 
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 ${
                        activeTab === tab.id 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-md' 
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sağ Form Alanları */}
              <div className="col-span-12 lg:col-span-9 space-y-6">
                
                {/* 1. HERO BANNER AYARLARI */}
                {activeTab === 'hero' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
                      <h2 className="text-md font-bold flex items-center gap-2 border-b border-slate-800 pb-3">
                        <Home size={18} className="text-blue-500" /> Ana Banner Metin Yapılandırması
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5">Badge (Rozet) Metni</label>
                          <input type="text" value={heroData.badge} onChange={(e) => setHeroData({...heroData, badge: e.target.value})} className="w-full px-4 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-sm focus:border-blue-500 outline-none"/>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5">Vurgulu Metin Grubu</label>
                          <input type="text" value={heroData.highlightText} onChange={(e) => setHeroData({...heroData, highlightText: e.target.value})} className="w-full px-4 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-sm focus:border-blue-500 outline-none"/>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5">Ana Başlık (H1)</label>
                        <input type="text" value={heroData.title} onChange={(e) => setHeroData({...heroData, title: e.target.value})} className="w-full px-4 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-sm focus:border-blue-500 outline-none"/>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5">Spot Açıklama Paragrafı</label>
                        <textarea value={heroData.description} onChange={(e) => setHeroData({...heroData, description: e.target.value})} rows={3} className="w-full px-4 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-sm focus:border-blue-500 outline-none resize-none"/>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5">Aksiyon Butonu (Primary)</label>
                          <input type="text" value={heroData.primaryButtonText} onChange={(e) => setHeroData({...heroData, primaryButtonText: e.target.value})} className="w-full px-4 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-sm focus:border-blue-500 outline-none"/>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5">İkincil Buton (Secondary)</label>
                          <input type="text" value={heroData.secondaryButtonText} onChange={(e) => setHeroData({...heroData, secondaryButtonText: e.target.value})} className="w-full px-4 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-sm focus:border-blue-500 outline-none"/>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                      <h3 className="text-sm font-bold text-slate-300 mb-4 tracking-wide">Sayaç & İstatistik Ayarları</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {heroData.stats.map((stat, index) => (
                          <div key={index} className="bg-slate-800/30 p-3.5 rounded-xl border border-slate-800 flex gap-3">
                            <div className="flex-1">
                              <label className="block text-[11px] text-slate-500 mb-1">Metrik/Veri</label>
                              <input type="text" value={stat.number} onChange={(e) => {
                                const newStats = [...heroData.stats];
                                newStats[index].number = e.target.value;
                                setHeroData({...heroData, stats: newStats});
                              }} className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700/70 rounded-lg text-sm font-bold text-indigo-400"/>
                            </div>
                            <div className="flex-[2]">
                              <label className="block text-[11px] text-slate-500 mb-1">Açıklama Etiketi</label>
                              <input type="text" value={stat.label} onChange={(e) => {
                                const newStats = [...heroData.stats];
                                newStats[index].label = e.target.value;
                                setHeroData({...heroData, stats: newStats});
                              }} className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700/70 rounded-lg text-sm text-slate-300"/>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'categories' && ( <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">

                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg dark:shadow-none space-y-4">

                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">

                      <div>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><FolderTree size={20} className="text-blue-500" /> Mevcut Kategoriler</h2>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Sistemde kayıtlı ana ve alt kategoriler</p>

                      </div>

                      <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-semibold border border-blue-100 dark:border-transparent">{formData?.categories?.length ?? 0} Kategori</span>

                    </div>

                    <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">

                      {formData?.categories && formData.categories.length > 0 ? ( formData.categories.map((cat, index) => ( <div key={cat._id || index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800/60 rounded-xl hover:border-blue-400 dark:hover:border-blue-500/50 transition-all group">

                        <div className="flex items-center gap-3">

                          <div className="p-2 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg"><Folder size={18} /></div>

                          <div>

                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{cat.name}</h4>
                            {cat.parent && ( <p className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1 mt-0.5"><CornerDownRight size={12} /> Üst Kategori: {cat.parent}</p> )}

                          </div>

                        </div>

                        <button onClick={() => removeCategory(index)} className="p-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg opacity-80 hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all" title="Kategoriyi Sil"><Trash2 size={16} /></button>

                      </div> )) ) : ( <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-xl">

                        <FolderPlus className="mx-auto text-gray-300 dark:text-slate-700 mb-2" size={40} />
                        <p className="text-sm text-gray-500 dark:text-slate-400">Henüz hiçbir kategori eklenmemiş.</p>

                      </div> )}

                    </div>

                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg dark:shadow-none h-fit space-y-5">

                    <div>

                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><PlusCircle size={18} className="text-green-500" /> Yeni Kategori Ekle</h3>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Ürün için hiyerarşik kategori oluşturun</p>

                    </div>

                    <div className="space-y-4">

                      <div className="space-y-1.5">

                        <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Kategori Adı</label>
                        <input type="text" placeholder="Örn: Akıllı Aydınlatma" value={categoryInput?.name || ""} onChange={(e) => setCategoryInput({ ...categoryInput, name: e.target.value })} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 transition-colors"/>

                      </div>

                      <div className="space-y-1.5">

                        <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Üst Kategori (Opsiyonel)</label>

                        <select value={categoryInput?.parent || ""} onChange={(e) => setCategoryInput({ ...categoryInput, parent: e.target.value })} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer">

                          <option value="">-- Ana Kategori Olarak Belirle --</option>
                          {formData?.categories?.filter(c => !c.parent).map((c, i) => ( <option key={i} value={c.name}>{c.name}</option> ))}

                        </select>

                      </div>

                      <button type="button" onClick={addCategory} disabled={!categoryInput?.name?.trim()} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-slate-800 dark:disabled:to-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all transform active:scale-95 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2">
                        <Plus size={16} /> Kategori Listesine Ekle
                      </button>

                    </div>

                  </div>

                </div> )}

              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default AdminSettings;