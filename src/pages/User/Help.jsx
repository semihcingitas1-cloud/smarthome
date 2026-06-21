import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Search, BookOpen, Zap, Wifi, Shield, Smartphone, Settings, ChevronRight, ArrowRight, CheckCircle, MessageCircle, Mail, Phone, Clock, Star, Cpu, Layers, Play, ChevronDown, Home, Lock, Thermometer, Bell, HelpCircle, FileText, Video, Users, Award, TrendingUp, AlertCircle, LifeBuoy, ExternalLink, X } from 'lucide-react';

const Help = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {

    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    {
      icon: <Zap size={28} className="text-blue-600 dark:text-blue-500" />,
      title: 'Başlarken',
      desc: 'Hesap oluşturma, ilk cihaz bağlantısı ve temel kurulum.',
      count: 12,
      gradient: 'from-blue-500/5 dark:from-blue-500/10 to-transparent',
      border: 'border-blue-500/20 hover:border-blue-500/50',
      iconBg: 'bg-blue-500/10',
      articles: [
        { title: 'SmartHub hesabı nasıl oluşturulur?', time: '2 dk' },
        { title: 'İlk cihazınızı nasıl bağlarsınız?', time: '5 dk' },
        { title: 'Mobil uygulamayı nasıl kurarsınız?', time: '3 dk' },
        { title: 'Dashboard\'a genel bakış', time: '4 dk' },
      ]
    },
    {
      icon: <Wifi size={28} className="text-purple-600 dark:text-purple-500" />,
      title: 'Cihaz Yönetimi',
      desc: 'Cihaz ekleme, kaldırma ve yapılandırma işlemleri.',
      count: 18,
      gradient: 'from-purple-500/5 dark:from-purple-500/10 to-transparent',
      border: 'border-purple-500/20 hover:border-purple-500/50',
      iconBg: 'bg-purple-500/10',
      articles: [
        { title: 'Yeni bir Wi-Fi cihazı nasıl eklenir?', time: '4 dk' },
        { title: 'ESP32 sensörü nasıl yapılandırılır?', time: '8 dk' },
        { title: 'Cihaz grupları nasıl oluşturulur?', time: '3 dk' },
        { title: 'Çevrimdışı cihaz sorunlarını giderme', time: '6 dk' },
      ]
    },
    {
      icon: <Shield size={28} className="text-green-600 dark:text-green-500" />,
      title: 'Güvenlik',
      desc: 'Şifreleme, iki faktörlü kimlik doğrulama ve erişim kontrolleri.',
      count: 9,
      gradient: 'from-green-500/5 dark:from-green-500/10 to-transparent',
      border: 'border-green-500/20 hover:border-green-500/50',
      iconBg: 'bg-green-500/10',
      articles: [
        { title: 'İki faktörlü doğrulama nasıl etkinleştirilir?', time: '3 dk' },
        { title: 'AES-256 şifrelemesi nasıl çalışır?', time: '5 dk' },
        { title: 'Güvenli erişim PIN\'i ayarlama', time: '2 dk' },
        { title: 'Hesap güvenliği kontrol listesi', time: '4 dk' },
      ]
    },
    {
      icon: <Zap size={28} className="text-orange-600 dark:text-orange-500" />,
      title: 'Otomasyon',
      desc: 'Senaryolar, zamanlayıcılar ve akıllı tetikleyiciler.',
      count: 15,
      gradient: 'from-orange-500/5 dark:from-orange-500/10 to-transparent',
      border: 'border-orange-500/20 hover:border-orange-500/50',
      iconBg: 'bg-orange-500/10',
      articles: [
        { title: 'İlk otomasyon senaryosu nasıl oluşturulur?', time: '6 dk' },
        { title: 'Zamanlayıcı tabanlı kurallar', time: '4 dk' },
        { title: 'Konum bazlı tetikleyiciler (Geofencing)', time: '7 dk' },
        { title: 'Senaryo şablonları kütüphanesi', time: '3 dk' },
      ]
    },
    {
      icon: <TrendingUp size={28} className="text-cyan-600 dark:text-cyan-500" />,
      title: 'Enerji & Raporlar',
      desc: 'Tüketim takibi, analiz ve tasarruf önerileri.',
      count: 7,
      gradient: 'from-cyan-500/5 dark:from-cyan-500/10 to-transparent',
      border: 'border-cyan-500/20 hover:border-cyan-500/50',
      iconBg: 'bg-cyan-500/10',
      articles: [
        { title: 'Enerji tüketim raporunu okuma', time: '4 dk' },
        { title: 'Cihaz bazlı güç analizi', time: '5 dk' },
        { title: 'Aylık tasarruf hedefi belirleme', time: '3 dk' },
        { title: 'Raporları dışa aktarma (CSV/PDF)', time: '2 dk' },
      ]
    },
    {
      icon: <Settings size={28} className="text-slate-600 dark:text-slate-400" />,
      title: 'Hesap & Fatura',
      desc: 'Plan yönetimi, faturalama ve hesap ayarları.',
      count: 11,
      gradient: 'from-slate-500/5 dark:from-slate-500/10 to-transparent',
      border: 'border-slate-500/20 hover:border-slate-500/40',
      iconBg: 'bg-slate-500/10',
      articles: [
        { title: 'Plan nasıl yükseltilir?', time: '2 dk' },
        { title: 'Fatura bilgilerini güncelleme', time: '3 dk' },
        { title: 'Aboneliği iptal etme', time: '2 dk' },
        { title: 'Hesap verilerini dışa aktarma', time: '4 dk' },
      ]
    },
  ];

  const popularArticles = [

    { title: 'ESP32 cihazı Wi-Fi\'ye bağlanamıyor', category: 'Cihaz Yönetimi', time: '6 dk', icon: <Wifi size={16} />, color: 'text-purple-500' },
    { title: 'Mobil uygulama bildirim almıyor', category: 'Sorun Giderme', time: '4 dk', icon: <Bell size={16} />, color: 'text-orange-500' },
    { title: 'Otomasyon senaryosu çalışmıyor', category: 'Otomasyon', time: '7 dk', icon: <Zap size={16} />, color: 'text-blue-500' },
    { title: 'Termostat sıcaklığı güncellenmiyor', category: 'Cihaz Yönetimi', time: '5 dk', icon: <Thermometer size={16} />, color: 'text-red-500' },
    { title: 'Pro plana nasıl geçilir?', category: 'Hesap & Fatura', time: '2 dk', icon: <Award size={16} />, color: 'text-yellow-500' },
    { title: 'Akıllı kilit pil uyarısı alıyorum', category: 'Güvenlik', time: '3 dk', icon: <Lock size={16} />, color: 'text-green-500' },
  ];

  const supportChannels = [
    {
      icon: <MessageCircle size={32} className="text-blue-600 dark:text-blue-500" />,
      title: 'Canlı Sohbet',
      desc: 'Destek ekibimizle gerçek zamanlı konuşun.',
      badge: 'Çevrimiçi',
      badgeColor: 'bg-green-500/20 text-green-600 dark:text-green-400',
      action: 'Sohbeti Başlat',
      gradient: 'from-blue-500/5 dark:from-blue-500/10 to-transparent',
      border: 'border-blue-500/20 hover:border-blue-500/50',
    },
    {
      icon: <Mail size={32} className="text-purple-600 dark:text-purple-500" />,
      title: 'E-posta Desteği',
      desc: 'Detaylı sorularınız için bize yazın.',
      badge: '< 24 saat',
      badgeColor: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
      action: 'E-posta Gönder',
      gradient: 'from-purple-500/5 dark:from-purple-500/10 to-transparent',
      border: 'border-purple-500/20 hover:border-purple-500/50',
    },
    {
      icon: <Phone size={32} className="text-green-600 dark:text-green-500" />,
      title: 'Telefon Desteği',
      desc: 'Pro ve Kurumsal kullanıcılar için öncelikli hat.',
      badge: 'Pro & Kurumsal',
      badgeColor: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
      action: 'Numarayı Gör',
      gradient: 'from-green-500/5 dark:from-green-500/10 to-transparent',
      border: 'border-green-500/20 hover:border-green-500/50',
    },
  ];

  const filteredCategories = categories.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.desc.toLowerCase().includes(searchQuery.toLowerCase()) || c.articles.some(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())) );

  return (

    <div className="bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">

      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 px-6 overflow-hidden">

        <div className="absolute inset-0 overflow-hidden">

          <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -top-48 -left-48" style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
          <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -bottom-48 -right-48" style={{ transform: `translateY(${scrollY * -0.1}px)` }} />

        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">

          <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer">
            <LifeBuoy size={16} className="animate-pulse" /> Yardım Merkezi
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-slate-900 dark:text-white">
            Size Nasıl{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Yardımcı Olabiliriz?</span>
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">Kurulumdan otomasyona, güvenlikten faturaya — tüm sorularınızın cevabı burada.</p>

          <div className="relative max-w-2xl mx-auto">

            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input type="text" placeholder="Soru veya konu ara... (örn: &quot;cihaz bağlantısı&quot;)" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 rounded-2xl pl-14 pr-6 py-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all shadow-sm dark:shadow-none text-base"/>
            {searchQuery && ( <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"><X size={18} /></button> )}

          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">

            <span className="text-slate-500 dark:text-slate-400 font-medium">Sık arananlar:</span>
            {['ESP32 kurulumu', 'Şifre sıfırlama', 'Otomasyon', 'Fatura'].map(tag => ( <button key={tag} onClick={() => setSearchQuery(tag)} className="bg-slate-100 dark:bg-slate-800 hover:bg-blue-500/10 dark:hover:bg-blue-500/10 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 hover:border-blue-500/30 dark:hover:border-blue-500/30 px-3 py-1.5 rounded-lg transition-all">{tag}</button> ))}

          </div>

        </div>

      </section>

      <section className="py-10 px-6 border-y border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 transition-colors duration-300">

        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">

          {[
            { number: '72', label: 'Yardım Makalesi', icon: <FileText size={20} /> },
            { number: '4.9/5', label: 'Destek Puanı', icon: <Star size={20} /> },
            { number: '< 2 dk', label: 'Canlı Yanıt Süresi', icon: <Clock size={20} /> },
            { number: '7/24', label: 'Destek Saatleri', icon: <Award size={20} /> },
          ].map((stat, i) => ( <div key={i} className="text-center space-y-2 group cursor-pointer">

            <div className="flex justify-center text-blue-600 dark:text-blue-500 group-hover:scale-110 transition-transform duration-200">{stat.icon}</div>
            <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">{stat.number}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>

          </div> ))}

        </div>

      </section>

      <section className="py-24 px-6 bg-white dark:bg-slate-950 transition-colors duration-300">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">

            <div className="inline-flex items-center gap-2 bg-purple-500/10 dark:bg-purple-600/10 text-purple-600 dark:text-purple-400 px-4 py-1.5 rounded-full text-sm font-bold border border-purple-500/10 dark:border-purple-500/20 mb-6"><Layers size={16} /> Kategoriler</div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">Konuya Göre{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">Yardım Bulun</span></h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">İlgilendiğiniz konuyu seçin ve ilgili makalelere hızlıca ulaşın.</p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {(searchQuery ? filteredCategories : categories).map((cat, i) => ( <div key={i} className={`bg-white/60 dark:bg-transparent bg-gradient-to-br ${cat.gradient} backdrop-blur-sm border ${cat.border} dark:border-opacity-100 p-8 rounded-3xl transition-all group cursor-pointer shadow-sm dark:shadow-none duration-300 hover:scale-[1.02]`} onClick={() => setActiveCategory(activeCategory === i ? null : i)}>

              <div className="flex items-start justify-between mb-6">

                <div className={`${cat.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-200`}>{cat.icon}</div>
                <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full">{cat.count} makale</span>

              </div>

              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{cat.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">{cat.desc}</p>

              {activeCategory === i && ( <ul className="space-y-3 border-t border-slate-200/60 dark:border-slate-800/60 pt-5 mt-2 animate-fadeIn">

                {cat.articles.map((article, idx) => ( <li key={idx} className="flex items-center justify-between gap-2 group/item cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" onClick={e => { e.stopPropagation(); setActiveArticle(`${i}-${idx}`); }}>

                  <span className="text-sm text-slate-600 dark:text-slate-300 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 flex-1">{article.title}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-1"><Clock size={10} /> {article.time}</span>

                </li> ))}

              </ul> )}

              <div className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200 ${activeCategory === i ? 'text-blue-600 dark:text-blue-400 mt-4' : 'text-slate-700 dark:text-white opacity-0 group-hover:opacity-100 mt-2'}`}>

                <span>{activeCategory === i ? 'Gizle' : 'Makaleleri Gör'}</span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${activeCategory === i ? 'rotate-180' : ''}`} />

              </div>

            </div> ))}

          </div>

          {searchQuery && filteredCategories.length === 0 && ( <div className="text-center py-16 space-y-4">

            <AlertCircle size={48} className="mx-auto text-slate-300 dark:text-slate-700" />
            <p className="text-slate-500 dark:text-slate-400 text-lg">"<span className="text-slate-700 dark:text-slate-200 font-semibold">{searchQuery}</span>" için sonuç bulunamadı.</p>
            <button onClick={() => setSearchQuery('')} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Aramayı temizle</button>

          </div> )}

        </div>

      </section>

      <section className="py-24 px-6 bg-slate-50/50 dark:bg-slate-900/30 transition-colors duration-300">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">

            <div className="max-w-xl">

              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Popüler Makaleler</h2>
              <p className="text-slate-600 dark:text-slate-400">Kullanıcıların en çok başvurduğu yardım içerikleri.</p>

            </div>

            <button className="text-blue-600 dark:text-blue-500 font-bold flex items-center gap-2 hover:gap-3 transition-all group">
              Tüm Makaleler <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {popularArticles.map((article, i) => ( <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 p-6 rounded-2xl transition-all group cursor-pointer shadow-sm dark:shadow-none hover:scale-[1.02] duration-300">

              <div className="flex items-center gap-3 mb-4">

                <div className={`w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${article.color}`}>{article.icon}</div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{article.category}</span>

              </div>

              <h3 className="font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">{article.title}</h3>

              <div className="flex items-center justify-between">

                <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5"><Clock size={12} /> {article.time} okuma</span>
                <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />

              </div>

            </div> ))}

          </div>

        </div>

      </section>

      <section className="py-24 px-6 bg-white dark:bg-slate-950 transition-colors duration-300">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">

            <div className="inline-flex items-center gap-2 bg-blue-500/10 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-500/10 dark:border-blue-500/20 mb-6"><Video size={16} /> Video Rehberler</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Görsel Adım Adım</h2>
            <p className="text-slate-600 dark:text-slate-400">Metin okumak istemiyorsanız, video rehberlerimizi izleyin.</p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {[
              { title: 'İlk Cihaz Kurulumu', duration: '4:32', thumb: 'from-blue-600 to-indigo-700', icon: <Wifi size={32} className="text-white/80" /> },
              { title: 'Otomasyon Senaryosu Oluşturma', duration: '6:15', thumb: 'from-purple-600 to-pink-600', icon: <Zap size={32} className="text-white/80" /> },
              { title: 'Güvenlik Ayarları', duration: '5:48', thumb: 'from-green-600 to-emerald-600', icon: <Shield size={32} className="text-white/80" /> },
            ].map((video, i) => ( <div key={i} className="group cursor-pointer rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all shadow-sm dark:shadow-none hover:scale-[1.02] duration-300">

              <div className={`bg-gradient-to-br ${video.thumb} h-44 flex items-center justify-center relative`}>

                {video.icon}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-200"><Play size={22} fill="white" className="text-white ml-1" /></div>
                </div>

                <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-lg">{video.duration}</span>

              </div>

              <div className="bg-white dark:bg-slate-900 p-5">

                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{video.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5"><Play size={10} /> Video Rehber</p>

              </div>

            </div> ))}

          </div>

        </div>

      </section>

      <section className="py-24 px-6 bg-slate-50/50 dark:bg-slate-900/30 transition-colors duration-300">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">

            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">Hâlâ Yardıma mı{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">İhtiyacınız Var?</span></h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">Cevabı bulamadıysanız destek ekibimiz her zaman burada.</p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {supportChannels.map((channel, i) => ( <div key={i} className={`bg-white/60 dark:bg-transparent bg-gradient-to-br ${channel.gradient} backdrop-blur-sm border ${channel.border} dark:border-opacity-100 p-8 rounded-3xl transition-all group cursor-pointer shadow-sm dark:shadow-none duration-300 hover:scale-105`}>

              <div className="bg-slate-200/50 dark:bg-slate-800/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-200">{channel.icon}</div>

              <div className="flex items-center gap-2 mb-3">

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{channel.title}</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${channel.badgeColor}`}>{channel.badge}</span>

              </div>

              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">{channel.desc}</p>

              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white group-hover:gap-3 transition-all duration-200">

                <span>{channel.action}</span>
                <ArrowRight size={16} className="text-slate-700 dark:text-white" />

              </div>

            </div> ))}

          </div>

        </div>

      </section>

      <section className="py-24 px-6 bg-white dark:bg-slate-950 transition-colors duration-300">

        <div className="max-w-7xl mx-auto bg-gradient-to-br from-blue-500/5 to-slate-100 dark:from-blue-900/20 dark:to-slate-900 border border-blue-500/10 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">

          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl" />

          <div className="flex-1 space-y-6 relative z-10">

            <h2 className="text-3xl font-bold italic flex items-center gap-3 text-slate-900 dark:text-white"><Cpu className="text-blue-600 dark:text-blue-500" /> Geliştirici & Teknik Kaynaklar</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">ESP32 entegrasyonu, MQTT yapılandırması veya API kullanımı hakkında ayrıntılı teknik belgeler için dokümantasyon merkezimizi ziyaret edin.</p>

            <ul className="space-y-4">

              {['REST API Referans Dokümantasyonu', 'ESP32-S3 Pinout ve Şema Rehberi', 'MQTT Topic Yapısı ve Örnekler'].map(item => ( <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300 group cursor-pointer">

                <CheckCircle size={18} className="text-blue-600 dark:text-blue-500 group-hover:scale-110 transition-transform shrink-0" />
                <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item}</span>
                <ExternalLink size={12} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />

              </li> ))}

            </ul>

            <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all group shadow-md shadow-blue-500/10">
              Dokümantasyona Git
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

          </div>

          <div className="flex-1 grid grid-cols-2 gap-4 relative z-10 w-full">

            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-3xl text-center border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all group cursor-pointer shadow-sm dark:shadow-none">

              <FileText className="mx-auto mb-2 text-blue-600 dark:text-blue-500 group-hover:scale-110 transition-transform" size={24} />
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-500 mb-1">72</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-tighter">Makale</p>

            </div>

            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-3xl text-center border border-slate-200 dark:border-slate-700 hover:border-green-500/50 dark:hover:border-green-500/50 transition-all group cursor-pointer shadow-sm dark:shadow-none">

              <Video className="mx-auto mb-2 text-green-600 dark:text-green-500 group-hover:scale-110 transition-transform" size={24} />
              <p className="text-3xl font-bold text-green-600 dark:text-green-500 mb-1">24</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-tighter">Video Rehber</p>

            </div>

            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-3xl text-center col-span-2 border border-slate-200 dark:border-slate-700 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all group cursor-pointer shadow-sm dark:shadow-none">

              <Cpu className="mx-auto mb-2 text-purple-600 dark:text-purple-500 group-hover:scale-110 transition-transform" size={24} />
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-500 mb-1">GitHub</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-tighter">Açık Kaynak Kütüphaneler</p>

            </div>

          </div>

        </div>

      </section>

      <section className="py-20 text-center px-6 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-pink-600/20" />

        <div className="max-w-2xl mx-auto space-y-8 relative z-10">

          <div className="inline-flex items-center gap-2 bg-slate-900/5 dark:bg-white/10 text-slate-800 dark:text-white px-4 py-1.5 rounded-full text-sm font-bold border border-slate-900/10 dark:border-white/20 backdrop-blur-sm"><HelpCircle size={16} className="text-purple-600 dark:text-yellow-400" /> Cevabınızı Bulamadınız mı?</div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">Doğrudan Bize{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">Ulaşın</span></h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg">Ortalama 2 dakika içinde yanıt alın. Uzmanlarımız sorununuzu çözmek için hazır.</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">

            <Link to="/contact" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 dark:bg-white text-white dark:text-slate-950 px-10 py-4 rounded-2xl font-extrabold hover:scale-105 transition-all shadow-xl shadow-slate-900/20 dark:shadow-2xl dark:shadow-white/10">
              <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
              Destek Talebi Aç
            </Link>

            <Link to="/auth" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/80 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 backdrop-blur-sm text-slate-800 dark:text-white px-10 py-4 rounded-2xl font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none">
              Hesabıma Giriş Yap
            </Link>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 pt-8 text-sm text-slate-500 dark:text-slate-400">

            <div className="flex items-center gap-2">

              <CheckCircle size={16} className="text-green-600 dark:text-green-500 shrink-0" />
              <span>Ücretsiz destek</span>

            </div>

            <div className="flex items-center gap-2">

              <CheckCircle size={16} className="text-green-600 dark:text-green-500 shrink-0" />
              <span>Türkçe uzman ekip</span>

            </div>

            <div className="flex items-center gap-2">

              <CheckCircle size={16} className="text-green-600 dark:text-green-500 shrink-0" />
              <span>7/24 aktif</span>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Help;