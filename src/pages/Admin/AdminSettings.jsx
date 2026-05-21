import React, { useState } from 'react';
import {
  Save, Upload, Trash2, Plus, X, Eye, EyeOff,
  Home, Zap, Shield, Smartphone, CheckCircle,
  Image as ImageIcon, Edit2, AlignLeft, Star,
  Mail, Phone, MapPin, Facebook, Twitter, Instagram,
  Linkedin, Settings as SettingsIcon, RefreshCw, Link2
} from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Hero Section State
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

  // Features State
  const [features, setFeatures] = useState([
    {
      id: 1,
      icon: 'Shield',
      title: 'Tam Güvenlik',
      description: 'Gelişmiş şifreleme ve anlık bildirimlerle eviniz 7/24 koruma altında.',
      color: 'green'
    },
    {
      id: 2,
      icon: 'Layers',
      title: 'Modüler Yapı',
      description: 'Kendi sensörlerinizi ekleyin veya mevcut otomasyonları dakikalar içinde güncelleyin.',
      color: 'blue'
    },
    {
      id: 3,
      icon: 'Smartphone',
      title: 'Uzaktan Erişim',
      description: 'Dünyanın neresinde olursanız olun, mobil uygulama üzerinden kontrol sağlayın.',
      color: 'purple'
    }
  ]);

  // Testimonials State
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
    },
    {
      id: 3,
      name: 'Mehmet Demir',
      role: 'Mimar',
      comment: 'Müşterilerime akıllı ev sistemleri kurarken SmartHub\'ı öneriyorum.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=33'
    }
  ]);

  // Pricing State
  const [pricingPlans, setPricingPlans] = useState([
    {
      id: 1,
      name: 'Başlangıç',
      price: '0',
      period: 'Ücretsiz',
      features: ['5 Cihaza Kadar', 'Temel Otomasyon', 'Mobil Uygulama', 'E-posta Desteği'],
      popular: false
    },
    {
      id: 2,
      name: 'Pro',
      price: '299',
      period: '/ay',
      features: ['Sınırsız Cihaz', 'Gelişmiş Senaryolar', 'API Erişimi', '7/24 Öncelikli Destek'],
      popular: true
    },
    {
      id: 3,
      name: 'Kurumsal',
      price: 'Özel',
      period: 'Fiyat',
      features: ['Özel Sunucu', 'Beyaz Etiket', 'Teknik Müşteri Temsilcisi', 'SLA Garantisi'],
      popular: false
    }
  ]);

  // Contact & Footer State
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
    // API call simülasyonu
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    alert('Değişiklikler başarıyla kaydedildi!');
  };

  const tabs = [
    { id: 'hero', label: 'Ana Banner', icon: <Home size={18} /> },
    { id: 'features', label: 'Özellikler', icon: <Zap size={18} /> },
    { id: 'testimonials', label: 'Yorumlar', icon: <Star size={18} /> },
    { id: 'pricing', label: 'Fiyatlandırma', icon: <AlignLeft size={18} /> },
    { id: 'contact', label: 'İletişim', icon: <Mail size={18} /> }
  ];

  const addFeature = () => {
    setFeatures([...features, {
      id: Date.now(),
      icon: 'Zap',
      title: 'Yeni Özellik',
      description: 'Özellik açıklaması',
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
      role: 'Rol',
      comment: 'Yorum metni',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=1'
    }]);
  };

  const removeTestimonial = (id) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                <SettingsIcon size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Site Ayarları</h1>
                <p className="text-xs text-slate-400">Ana sayfa içeriklerini yönetin</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                {previewMode ? <EyeOff size={18} /> : <Eye size={18} />}
                <span className="text-sm">{previewMode ? 'Düzenleme' : 'Önizleme'}</span>
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span className="text-sm">Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span className="text-sm">Değişiklikleri Kaydet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        <div className="grid grid-cols-12 gap-6">
          
          {/* Sidebar Tabs */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-2 sticky top-24">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="col-span-12 lg:col-span-9">
            
            {/* Hero Section Settings */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Home size={20} className="text-blue-500" />
                    Ana Banner Ayarları
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Badge Metni</label>
                      <input
                        type="text"
                        value={heroData.badge}
                        onChange={(e) => setHeroData({...heroData, badge: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Ana Başlık</label>
                      <input
                        type="text"
                        value={heroData.title}
                        onChange={(e) => setHeroData({...heroData, title: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Vurgulu Metin</label>
                      <input
                        type="text"
                        value={heroData.highlightText}
                        onChange={(e) => setHeroData({...heroData, highlightText: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Açıklama</label>
                      <textarea
                        value={heroData.description}
                        onChange={(e) => setHeroData({...heroData, description: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Ana Buton Metni</label>
                        <input
                          type="text"
                          value={heroData.primaryButtonText}
                          onChange={(e) => setHeroData({...heroData, primaryButtonText: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">İkinci Buton Metni</label>
                        <input
                          type="text"
                          value={heroData.secondaryButtonText}
                          onChange={(e) => setHeroData({...heroData, secondaryButtonText: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Banner Görseli URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={heroData.image}
                          onChange={(e) => setHeroData({...heroData, image: e.target.value})}
                          className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors">
                          <Upload size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                  <h3 className="text-lg font-bold mb-4">İstatistikler</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {heroData.stats.map((stat, index) => (
                      <div key={index} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">Sayı</label>
                            <input
                              type="text"
                              value={stat.number}
                              onChange={(e) => {
                                const newStats = [...heroData.stats];
                                newStats[index].number = e.target.value;
                                setHeroData({...heroData, stats: newStats});
                              }}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">Etiket</label>
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => {
                                const newStats = [...heroData.stats];
                                newStats[index].label = e.target.value;
                                setHeroData({...heroData, stats: newStats});
                              }}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Features Settings */}
            {activeTab === 'features' && (
              <div className="space-y-6">
                
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Zap size={20} className="text-blue-500" />
                      Özellikler
                    </h2>
                    <button
                      onClick={addFeature}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Plus size={18} />
                      Özellik Ekle
                    </button>
                  </div>

                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <div key={feature.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-semibold">Özellik #{index + 1}</h3>
                          <button
                            onClick={() => removeFeature(feature.id)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Başlık</label>
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => {
                                const newFeatures = [...features];
                                newFeatures[index].title = e.target.value;
                                setFeatures(newFeatures);
                              }}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Renk</label>
                            <select
                              value={feature.color}
                              onChange={(e) => {
                                const newFeatures = [...features];
                                newFeatures[index].color = e.target.value;
                                setFeatures(newFeatures);
                              }}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm"
                            >
                              <option value="blue">Mavi</option>
                              <option value="green">Yeşil</option>
                              <option value="purple">Mor</option>
                              <option value="red">Kırmızı</option>
                              <option value="yellow">Sarı</option>
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Açıklama</label>
                            <textarea
                              value={feature.description}
                              onChange={(e) => {
                                const newFeatures = [...features];
                                newFeatures[index].description = e.target.value;
                                setFeatures(newFeatures);
                              }}
                              rows={2}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Testimonials Settings */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Star size={20} className="text-blue-500" />
                      Müşteri Yorumları
                    </h2>
                    <button
                      onClick={addTestimonial}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Plus size={18} />
                      Yorum Ekle
                    </button>
                  </div>

                  <div className="space-y-4">
                    {testimonials.map((testimonial, index) => (
                      <div key={testimonial.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-semibold">Yorum #{index + 1}</h3>
                          <button
                            onClick={() => removeTestimonial(testimonial.id)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">İsim</label>
                            <input
                              type="text"
                              value={testimonial.name}
                              onChange={(e) => {
                                const newTestimonials = [...testimonials];
                                newTestimonials[index].name = e.target.value;
                                setTestimonials(newTestimonials);
                              }}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Rol/Meslek</label>
                            <input
                              type="text"
                              value={testimonial.role}
                              onChange={(e) => {
                                const newTestimonials = [...testimonials];
                                newTestimonials[index].role = e.target.value;
                                setTestimonials(newTestimonials);
                              }}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Avatar URL</label>
                            <input
                              type="text"
                              value={testimonial.avatar}
                              onChange={(e) => {
                                const newTestimonials = [...testimonials];
                                newTestimonials[index].avatar = e.target.value;
                                setTestimonials(newTestimonials);
                              }}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Puan</label>
                            <select
                              value={testimonial.rating}
                              onChange={(e) => {
                                const newTestimonials = [...testimonials];
                                newTestimonials[index].rating = parseInt(e.target.value);
                                setTestimonials(newTestimonials);
                              }}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm"
                            >
                              <option value="5">5 Yıldız</option>
                              <option value="4">4 Yıldız</option>
                              <option value="3">3 Yıldız</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Yorum</label>
                          <textarea
                            value={testimonial.comment}
                            onChange={(e) => {
                              const newTestimonials = [...testimonials];
                              newTestimonials[index].comment = e.target.value;
                              setTestimonials(newTestimonials);
                            }}
                            rows={2}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Pricing Settings */}
            {activeTab === 'pricing' && (
              <div className="space-y-6">
                
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <AlignLeft size={20} className="text-blue-500" />
                    Fiyatlandırma Planları
                  </h2>

                  <div className="space-y-6">
                    {pricingPlans.map((plan, index) => (
                      <div key={plan.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">{plan.name} Paketi</h3>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={plan.popular}
                              onChange={(e) => {
                                const newPlans = [...pricingPlans];
                                newPlans[index].popular = e.target.checked;
                                setPricingPlans(newPlans);
                              }}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">Popüler</span>
                          </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Paket Adı</label>
                            <input
                              type="text"
                              value={plan.name}
                              onChange={(e) => {
                                const newPlans = [...pricingPlans];
                                newPlans[index].name = e.target.value;
                                setPricingPlans(newPlans);
                              }}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Fiyat</label>
                            <input
                              type="text"
                              value={plan.price}
                              onChange={(e) => {
                                const newPlans = [...pricingPlans];
                                newPlans[index].price = e.target.value;
                                setPricingPlans(newPlans);
                              }}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Periyod</label>
                            <input
                              type="text"
                              value={plan.period}
                              onChange={(e) => {
                                const newPlans = [...pricingPlans];
                                newPlans[index].period = e.target.value;
                                setPricingPlans(newPlans);
                              }}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Özellikler (Her satır bir özellik)</label>
                          <textarea
                            value={plan.features.join('\n')}
                            onChange={(e) => {
                              const newPlans = [...pricingPlans];
                              newPlans[index].features = e.target.value.split('\n');
                              setPricingPlans(newPlans);
                            }}
                            rows={4}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Contact Settings */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Mail size={20} className="text-blue-500" />
                    İletişim Bilgileri
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">E-posta</label>
                      <input
                        type="email"
                        value={contactData.email}
                        onChange={(e) => setContactData({...contactData, email: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Telefon</label>
                      <input
                        type="tel"
                        value={contactData.phone}
                        onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Adres</label>
                      <input
                        type="text"
                        value={contactData.address}
                        onChange={(e) => setContactData({...contactData, address: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                  <h3 className="text-lg font-bold mb-4">Sosyal Medya Linkleri</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Facebook className="text-blue-600" size={20} />
                      <input
                        type="url"
                        placeholder="Facebook URL"
                        value={contactData.socialLinks.facebook}
                        onChange={(e) => setContactData({
                          ...contactData,
                          socialLinks: {...contactData.socialLinks, facebook: e.target.value}
                        })}
                        className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <Twitter className="text-blue-400" size={20} />
                      <input
                        type="url"
                        placeholder="Twitter URL"
                        value={contactData.socialLinks.twitter}
                        onChange={(e) => setContactData({
                          ...contactData,
                          socialLinks: {...contactData.socialLinks, twitter: e.target.value}
                        })}
                        className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <Instagram className="text-pink-600" size={20} />
                      <input
                        type="url"
                        placeholder="Instagram URL"
                        value={contactData.socialLinks.instagram}
                        onChange={(e) => setContactData({
                          ...contactData,
                          socialLinks: {...contactData.socialLinks, instagram: e.target.value}
                        })}
                        className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <Linkedin className="text-blue-700" size={20} />
                      <input
                        type="url"
                        placeholder="LinkedIn URL"
                        value={contactData.socialLinks.linkedin}
                        onChange={(e) => setContactData({
                          ...contactData,
                          socialLinks: {...contactData.socialLinks, linkedin: e.target.value}
                        })}
                        className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminSettings;