import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ShieldCheck, Zap, Smartphone, Cpu, ArrowRight, CheckCircle, Layers, MousePointerClick, Code2, Wifi, Lock, Thermometer, Lightbulb, Camera, Bell,TrendingUp, Users, Award, Star, Play, X } from 'lucide-react';

const Home = () => {

  const navigate = useNavigate();

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [phoneScreen, setPhoneScreen] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {

    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {

    if (!isPlaying) return;
    const t = setInterval(() => setPhoneScreen(s => (s + 1) % 3), 2500);
    return () => clearInterval(t);
  }, [isPlaying]);

  const stats = [

    { number: "50K+", label: "Aktif Kullanıcı", icon: <Users size={20} /> },
    { number: "99.9%", label: "Uptime Garantisi", icon: <Award size={20} /> },
    { number: "50K+", label: "Bağlı Cihaz", icon: <Wifi size={20} /> },
    { number: "4.9/5", label: "Müşteri Memnuniyeti", icon: <Star size={20} /> }
  ];

  const devices = [

    { name: "Akıllı Aydınlatma", icon: <Lightbulb />, count: "150K+" },
    { name: "Güvenlik Kameraları", icon: <Camera />, count: "80K+" },
    { name: "Akıllı Kilitler", icon: <Lock />, count: "45K+" },
    { name: "Termostatlar", icon: <Thermometer />, count: "60K+" }
  ];

  const useCases = [
    {
      title: "Sabah Senaryosu",
      desc: "Alarm çaldığında perdeler açılır, kahve makinesi başlar, ışıklar yavaşça açılır.",
      time: "07:00"
    },
    {
      title: "Evden Ayrılma",
      desc: "Tüm ışıklar kapanır, klima düşer, güvenlik modu aktif olur.",
      time: "08:30"
    },
    {
      title: "Eve Dönüş",
      desc: "Kapıya yaklaşınca ışıklar açılır, ısıtma istediğiniz sıcaklığa gelir.",
      time: "18:00"
    },
    {
      title: "Gece Modu",
      desc: "Tüm dış ışıklar söner, alarm sistemi aktif olur, gece lambaları yanar.",
      time: "23:00"
    }
  ];

  const testimonials = [
    {
      name: "Ahmet Yılmaz",
      role: "Yazılım Geliştirici",
      comment: "ESP32 entegrasyonu harika çalışıyor. Kendi sensörlerimi eklemek çok kolaydı. API dokümantasyonu mükemmel.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?img=12"
    },
    {
      name: "Elif Kaya",
      role: "Ev Hanımı",
      comment: "Enerji faturalarım %40 düştü. Mobil uygulama çok kullanışlı, her şeyi kolayca kontrol edebiliyorum.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?img=45"
    },
    {
      name: "Mehmet Demir",
      role: "Mimar",
      comment: "Müşterilerime akıllı ev sistemleri kurarken SmartHub'ı öneriyorum. Kurulumu profesyonel ve destek ekibi harika.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?img=33"
    }
  ];

  const pricingPlans = [
    {
      name: "Başlangıç",
      price: "0",
      period: "Ücretsiz",
      features: [
        "5 Cihaza Kadar",
        "Temel Otomasyon",
        "Mobil Uygulama",
        "E-posta Desteği"
      ],
      buttonText: "Hemen Başla",
      popular: false
    },
    {
      name: "Pro",
      price: "299",
      period: "/ay",
      features: [
        "Sınırsız Cihaz",
        "Gelişmiş Senaryolar",
        "API Erişimi",
        "7/24 Öncelikli Destek",
        "Enerji Analizi",
        "Ses Asistanı Entegrasyonu"
      ],
      buttonText: "Pro'ya Geç",
      popular: true
    },
    {
      name: "Kurumsal",
      price: "Özel",
      period: "Fiyat",
      features: [
        "Özel Sunucu",
        "Beyaz Etiket",
        "Özel Entegrasyonlar",
        "Teknik Müşteri Temsilcisi",
        "SLA Garantisi",
        "Eğitim & Danışmanlık"
      ],
      buttonText: "İletişime Geç",
      popular: false
    }
  ];

  const techStack = [

    { name: "ESP32-ECO-V3", desc: "Dual-Core Xtensa LX7", color: "from-blue-500 to-cyan-500" },
    { name: "MQTT 5.0", desc: "Real-time Messaging", color: "from-purple-500 to-pink-500" },
    { name: "Node.js", desc: "High Performance Backend", color: "from-green-500 to-emerald-500" },
    { name: "MongoDB", desc: "Scalable Database", color: "from-orange-500 to-red-500" }
  ];

  const phoneScreens = [

    { id: 0, label: 'Ana Ekran' },
    { id: 1, label: 'Cihazlar' },
    { id: 2, label: 'Otomasyon' },
  ];

  const handlePlanSelect = (plan) => {

    if(plan.buttonText === 'Hemen Başla') navigate('/auth');
    if(plan.buttonText === "Pro'ya Geç") navigate('/pricing');
    if(plan.buttonText === 'İletişime Geç') navigate('/contact');
  };

  return (

    <div className="bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white overflow-hiddentransition-colors duration-300">
      
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-32 px-6 overflow-hidden">

        <div className="absolute inset-0 overflow-hidden">

          <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -top-48 -left-48" style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
          <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -bottom-48 -right-48" style={{ transform: `translateY(${scrollY * -0.1}px)` }} />

        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">

          <div className="flex-1 text-center lg:text-left space-y-6">

            <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer"><Zap size={16} className="animate-pulse" /> Geleceğin Teknolojisi Bugün Burada</div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-slate-900 dark:text-white">
              Evinizi{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient">Akıllı Bir Merkeze</span>{' '}
              Dönüştürün
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0">ESP32-S3 mimarisi üzerine kurulu, düşük gecikmeli ve uçtan uca şifreli ev otomasyon sistemi ile kontrol tamamen sizde.</p>

            <div className="flex items-center gap-6 text-sm justify-center lg:justify-start flex-wrap">

              <div className="flex items-center gap-2">

                <CheckCircle size={16} className="text-green-500" />
                <span className="text-slate-600 dark:text-slate-300">Kurulum 5 Dakika</span>

              </div>

              <div className="flex items-center gap-2">

                <CheckCircle size={16} className="text-green-500" />
                <span className="text-slate-600 dark:text-slate-300">Kredi Kartı Gerektirmez</span>

              </div>

              <div className="flex items-center gap-2">

                <CheckCircle size={16} className="text-green-500" />
                <span className="text-slate-600 dark:text-slate-300">14 Gün Para İade Garantisi</span>

              </div>

            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">

              <Link to="/auth" className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/50 hover:shadow-blue-900/80 hover:scale-105">
                Hemen Başlayın
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <a href={`${process.env.PUBLIC_URL}/smarthome.apk`} download="smarthome.apk" className="group w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-900/40 hover:shadow-blue-900/70 hover:scale-[1.02] active:scale-95">
                <span>Uygulamayı İndir (APK)</span>
                <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform duration-300" />
              </a>

              <button onClick={() => setIsVideoModalOpen(true)} className="group w-full sm:w-auto bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700/50 text-slate-800 dark:text-white px-8 py-4 rounded-2xl font-bold transition-all border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 flex items-center justify-center gap-2">
                <Play size={18} className="group-hover:scale-110 transition-transform" />
                Demoyu İzle
              </button>

            </div>

            <div className="flex items-center gap-4 justify-center lg:justify-start pt-4">

              <div className="flex -space-x-2">{[1, 2, 3, 4, 5].map(i => ( <img key={i} src={`https://i.pravatar.cc/40?img=${i}`} alt={`User ${i}`} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-950" /> ))}</div>

              <div className="text-sm">

                <div className="flex items-center gap-1 text-yellow-500">{[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}</div>
                <p className="text-slate-400 text-xs">50,000+ mutlu kullanıcı</p>

              </div>

            </div>

          </div>

          <div className="flex-1 relative flex items-center justify-center">

            {!isVideoModalOpen && ( <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-3xl opacity-20 animate-pulse" /> )}

            <div className={`relative transition ${isVideoModalOpen && 'rotate-90 scale-150 -translate-x-1/2'}`} style={{ width: '280px' }}>

              <div className="relative rounded-[52px] p-[3px]" style={{ background: 'linear-gradient(145deg, #d4d0cb, #a8a49e, #c8c4be, #8a8680)' }}>

                <div className="rounded-[50px] p-[2px] bg-gradient-to-b from-[#b0aca6] to-[#787470]">

                  <div className="bg-[#0f0f0f] rounded-[48px] overflow-hidden relative z-0" style={{ height: '580px' }}>

                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-black rounded-full z-20 flex items-center justify-center gap-2">

                      <div className="w-2 h-2 rounded-full bg-[#1a1a1a] border border-[#2a2a2a]" />
                      <div className="w-6 h-2 rounded-full bg-[#1a1a1a] border border-[#2a2a2a]" />

                    </div>

                    <div className="absolute inset-0 bg-slate-900 overflow-hidden">

                      {!isVideoModalOpen && (<div className="flex items-center justify-between pl-8 pr-4 pt-6 pb-8">

                        <span className="text-white text-xs font-semibold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                        <div className="flex items-center gap-1">

                          <svg width="16" height="12" viewBox="0 0 16 12" fill="white">

                            <rect x="13.5" y="1" width="2.5" height="10" rx="1" opacity="0.2"/>
                            <rect x="0" y="3" width="3" height="9" rx="1" opacity="0.4"/>
                            <rect x="4.5" y="2" width="3" height="10" rx="1" opacity="0.6"/>
                            <rect x="9" y="0" width="3" height="12" rx="1"/>

                          </svg>

                          <svg width="16" height="12" viewBox="0 0 16 12" fill="white">

                            <path d="M8 2C5.5 2 3.2 3 1.5 4.7L0 3.2C2.1 1.2 4.9 0 8 0s5.9 1.2 8 3.2L14.5 4.7C12.8 3 10.5 2 8 2zm0 4c-1.4 0-2.7.5-3.7 1.4L3 6.1C4.3 4.8 6.1 4 8 4s3.7.8 5 2.1L11.7 7.4C10.7 6.5 9.4 6 8 6zm0 4c-.8 0-1.5.3-2 .8L8 13l2-2.2c-.5-.5-1.2-.8-2-.8z" opacity="0.9"/>

                          </svg>

                          <div className="flex items-center gap-0.5">

                            <div className="w-6 h-3 rounded-md border border-white/60 flex items-center p-[1px]">
                              <div className="w-4 h-full bg-green-400 rounded-md" />
                            </div>

                          </div>

                        </div>

                      </div>)}

                      {isVideoModalOpen ? ( <div className="relative inset-0 bg-slate-900 rounded-3xl overflow-hidden border border-red-800 -rotate-90" onClick={e => e.stopPropagation()}>

                        <button onClick={() => setIsVideoModalOpen(false)} className="absolute top-4 left-4 z-10 bg-slate-800 hover:bg-slate-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all">
                          <X size={20} />
                        </button>

                        <div className="bg-slate-800 flex items-center justify-center">
                          <iframe src='https://www.youtube.com/embed/pRTeSIznQ1E' title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" className="" />
                        </div>

                      </div> ) : ( <>

                        <div className="px-5 pt-2 pb-3 flex items-center justify-between">

                          <div>
                            <p className="text-slate-400 text-xs">Merhaba,</p>
                            <p className="text-white text-base font-bold">Semih Bey 👋</p>
                          </div>

                          <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">S</div>
                            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900" />
                          </div>

                        </div>

                        <div className="mx-4 mb-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-4">

                          <div className="flex items-center justify-between mb-3">
                            <p className="text-blue-100 text-xs font-medium">Ev Durumu</p>
                            <span className="bg-green-400/20 text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full">● Aktif</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center">

                            <div>
                              <p className="text-white text-lg font-black">12</p>
                              <p className="text-blue-200 text-[10px]">Cihaz</p>
                            </div>

                            <div>
                              <p className="text-white text-lg font-black">%32</p>
                              <p className="text-blue-200 text-[10px]">Tasarruf</p>
                            </div>

                            <div>
                              <p className="text-white text-lg font-black">22°</p>
                              <p className="text-blue-200 text-[10px]">İç Isı</p>
                            </div>

                          </div>

                        </div>

                        <div className="px-5 mb-3 flex items-center justify-between">

                          <p className="text-white text-sm font-bold">Hızlı Kontrol</p>
                          <p className="text-blue-400 text-xs">Tümü</p>

                        </div>

                        <div className="px-4 grid grid-cols-2 gap-3 mb-4">

                          <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-3">

                            <div className="flex items-center justify-between mb-2">

                              <div className="w-8 h-8 bg-blue-500/30 rounded-xl flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                              </div>

                              <div className="w-8 h-4 bg-blue-500 rounded-full relative">
                                <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                              </div>

                            </div>

                            <p className="text-white text-xs font-semibold">Salon Işık</p>
                            <p className="text-blue-300 text-[10px]">%75 Parlaklık</p>

                          </div>

                          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3">

                            <div className="flex items-center justify-between mb-2">

                              <div className="w-8 h-8 bg-slate-700 rounded-xl flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>
                              </div>

                              <div className="w-8 h-4 bg-slate-600 rounded-full relative">
                                <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-slate-400 rounded-full" />
                              </div>

                            </div>

                            <p className="text-slate-300 text-xs font-semibold">Klima</p>
                            <p className="text-slate-500 text-[10px]">Kapalı</p>

                          </div>

                          <div className="bg-orange-500/20 border border-orange-500/30 rounded-2xl p-3">

                            <div className="flex items-center justify-between mb-2">

                              <div className="w-8 h-8 bg-orange-500/30 rounded-xl flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2"><path d="M18.364 5.636a9 9 0 1 1-12.728 0"/><path d="M12 3v9"/></svg>
                              </div>

                              <div className="w-8 h-4 bg-orange-500 rounded-full relative">
                                <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                              </div>

                            </div>

                            <p className="text-white text-xs font-semibold">Kombi</p>
                            <p className="text-orange-300 text-[10px]">Çalışıyor</p>

                          </div>

                          <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-3">

                            <div className="flex items-center justify-between mb-2">

                              <div className="w-8 h-8 bg-green-500/30 rounded-xl flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                              </div>

                              <div className="w-8 h-4 bg-green-500 rounded-full relative">
                                <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                              </div>

                            </div>

                            <p className="text-white text-xs font-semibold">Güvenlik</p>
                            <p className="text-green-300 text-[10px]">Aktif</p>

                          </div>

                        </div>

                        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-6 py-3 flex items-center justify-around">

                          <div className="flex flex-col items-center gap-1">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#3b82f6" stroke="none"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                            <span className="text-blue-400 text-[9px] font-bold">Anasayfa</span>
                          </div>

                          <div className="flex flex-col items-center gap-1 opacity-40">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                            <span className="text-slate-400 text-[9px]">Cihazlar</span>
                          </div>

                          <div className="flex flex-col items-center gap-1 opacity-40">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                            <span className="text-slate-400 text-[9px]">Otomasyon</span>
                          </div>

                          <div className="flex flex-col items-center gap-1 opacity-40">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                            <span className="text-slate-400 text-[9px]">Profil</span>
                          </div>

                        </div>

                      </>)}

                    </div>

                  </div>

                </div>

              </div>

              {!isVideoModalOpen && ( <div className="absolute -right-[5px] top-28 w-[4px] h-14 bg-gradient-to-b from-[#c8c4be] to-[#8a8680] rounded-r-sm" /> )}
              {!isVideoModalOpen && ( <div className="absolute -left-[5px] top-24 w-[4px] h-8 bg-gradient-to-b from-[#c8c4be] to-[#8a8680] rounded-l-sm" /> )}
              {!isVideoModalOpen && ( <div className="absolute -left-[5px] top-36 w-[4px] h-8 bg-gradient-to-b from-[#c8c4be] to-[#8a8680] rounded-l-sm" /> )}
              {!isVideoModalOpen && ( <div className="absolute -left-[5px] top-48 w-[4px] h-8 bg-gradient-to-b from-[#c8c4be] to-[#8a8680] rounded-l-sm" /> )}

              {!isVideoModalOpen && ( <div className="z-10 absolute -bottom-8 -left-10 bg-white dark:bg-slate-900 border border-blue-500/50 p-3 rounded-2xl shadow-xl">

                <div className="flex items-center gap-2">

                  <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  </div>

                  <div>

                    <p className="text-[10px] text-slate-400">Enerji Tasarrufu</p>
                    <p className="text-base font-bold text-green-500">%32</p>

                  </div>

                </div>

              </div>)}

            </div>

          </div>

        </div>

      </section>

      <section className="py-12 px-6 border-y border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 transition-colors duration-300">

        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">

          {stats.map((stat, i) => ( <div key={i} className="text-center space-y-2 group cursor-pointer">

            <div className="flex justify-center text-blue-600 dark:text-blue-500 group-hover:scale-110 transition-transform duration-200">{stat.icon}</div>
            <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">{stat.number}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>

          </div> ))}

        </div>

      </section>

      <section className="py-24 px-6 bg-slate-50/50 dark:bg-slate-900/30 text-slate-900 dark:text-white transition-colors duration-300">

        <div className="max-w-7xl mx-auto text-center mb-16">

          <div className="inline-flex items-center gap-2 bg-purple-500/10 dark:bg-purple-600/10 text-purple-600 dark:text-purple-400 px-4 py-1.5 rounded-full text-sm font-bold border border-purple-500/10 dark:border-purple-500/20 mb-6"><Layers size={16} /> Özellikler</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">Tek Panel, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">Sınırsız Çözüm</span></h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">Tüm cihazlarınızı tek bir merkezden yönetmeniz için tasarlandı.</p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">

          {[
            {
              icon: <ShieldCheck size={32} className="text-green-600 dark:text-green-500" />,
              title: "Tam Güvenlik",
              desc: "Gelişmiş şifreleme ve anlık bildirimlerle eviniz 7/24 koruma altında.",
              gradient: "from-green-500/5 dark:from-green-500/10 to-transparent",
              border: "border-green-500/20 hover:border-green-500/50 dark:border-green-500/20 dark:hover:border-green-500/50"
            },
            {
              icon: <Layers size={32} className="text-blue-600 dark:text-blue-500" />,
              title: "Modüler Yapı",
              desc: "Kendi sensörlerinizi ekleyin veya mevcut otomasyonları dakikalar içinde güncelleyin.",
              gradient: "from-blue-500/5 dark:from-blue-500/10 to-transparent",
              border: "border-blue-500/20 hover:border-blue-500/50 dark:border-blue-500/20 dark:hover:border-blue-500/50"
            },
            {
              icon: <Smartphone size={32} className="text-purple-600 dark:text-purple-500" />,
              title: "Uzaktan Erişim",
              desc: "Dünyanın neresinde olursanız olun, mobil uygulama üzerinden kontrol sağlayın.",
              gradient: "from-purple-500/5 dark:from-purple-500/10 to-transparent",
              border: "border-purple-500/20 hover:border-purple-500/50 dark:border-purple-500/20 dark:hover:border-purple-500/50"
            }
          ].map((feature, i) => ( <div key={i} className={`bg-white/60 dark:bg-transparent bg-gradient-to-br ${feature.gradient} backdrop-blur-sm border ${feature.border} p-8 rounded-3xl transition-all group hover:scale-105 cursor-pointer shadow-sm dark:shadow-none duration-300`}>

            <div className="mb-6 bg-slate-200/50 dark:bg-slate-800/50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-200">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>

            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">

              <span>Detayları Gör</span> 
              <ArrowRight size={16} className="text-slate-700 dark:text-white" />

            </div>

          </div> ))}

        </div>

      </section>

      <section className="py-24 px-6 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">

            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Desteklenen Cihazlar</h2>
            <p className="text-slate-600 dark:text-slate-400">Hemen hemen her akıllı cihazı ekosistemimize entegre edebilirsiniz</p>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {devices.map((device, i) => ( <div key={i} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 p-8 rounded-2xl text-center group cursor-pointer transition-all hover:scale-105 duration-300 shadow-sm dark:shadow-none">

              <div className="w-16 h-16 mx-auto mb-4 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-500 group-hover:bg-blue-500 dark:group-hover:bg-blue-500 group-hover:text-white dark:group-hover:text-white transition-all duration-200">{device.icon}</div>
              <h3 className="font-bold mb-2 text-slate-900 dark:text-white">{device.name}</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-500">{device.count}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase font-semibold tracking-wider">Aktif Cihaz</p>

            </div> ))}

          </div>

        </div>

      </section>

      <section className="py-24 px-6 border-y border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">

            <div className="inline-flex items-center gap-2 bg-blue-500/10 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-500/10 dark:border-blue-500/20 mb-6"><Code2 size={16} /> Teknoloji Yığını</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Güçlü Altyapı</h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {techStack.map((tech, i) => ( <div key={i} className="group cursor-pointer p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors duration-200">

              <div className={`h-2 bg-gradient-to-r ${tech.color} rounded-full mb-4 group-hover:h-3 transition-all duration-200`} />
              <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">{tech.name}</h3>          
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{tech.desc}</p>

            </div> ))}

          </div>

        </div>

      </section>

      <section className="py-24 px-6 bg-slate-50/50 dark:bg-slate-900/50 transition-colors duration-300">

        <div className="max-w-7xl mx-auto">
    
          <div className="text-center mb-16">

            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Günlük Senaryolarınız</h2>
            <p className="text-slate-600 dark:text-slate-400">Eviniz sizin rutininize uyum sağlar</p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {useCases.map((useCase, i) => ( <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 dark:hover:border-purple-500/50 p-6 rounded-2xl transition-all group cursor-pointer">

              <div className="flex items-center justify-between mb-4">

                <Bell className="text-purple-600 dark:text-purple-500 group-hover:animate-bounce" size={24} />
                <span className="text-sm font-mono bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1 rounded-lg">{useCase.time}</span>

              </div>

              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">{useCase.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{useCase.desc}</p>

            </div> ))}

          </div>

        </div>

      </section>

      <section className="py-24 px-6 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">

            <div className="max-w-xl">

              <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Her Şey Tek Bir Panelin Altında</h2>
              <p className="text-slate-600 dark:text-slate-400">Karmaşıklığı ortadan kaldırıyoruz. Karmaşık donanım kodlarını sizin için kullanıcı dostu arayüzlere dönüştürüyoruz.</p>

            </div>

            <button className="text-blue-600 dark:text-blue-500 font-bold flex items-center gap-2 hover:gap-3 transition-all group">Tüm Özellikleri Keşfet <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></button>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="p-1 rounded-[2rem] bg-gradient-to-br from-green-200 to-transparent dark:from-green-800 dark:to-transparent hover:from-green-300 dark:hover:from-green-700 transition-all">

              <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[1.9rem] h-full space-y-6">

                <div className="w-12 h-12 bg-green-500/10 text-green-600 dark:text-green-500 rounded-xl flex items-center justify-center"><ShieldCheck size={24} /></div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Gelişmiş Güvenlik</h3>

                <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">

                  <li className="flex items-center gap-2 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"><CheckCircle size={14} className="text-green-600 dark:text-green-500 shrink-0" /><span>Hareket algılama ve anlık bildirim</span></li>
                  <li className="flex items-center gap-2 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"><CheckCircle size={14} className="text-green-600 dark:text-green-500 shrink-0" /><span>Akıllı kilit sistemleri</span></li>
                  <li className="flex items-center gap-2 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"><CheckCircle size={14} className="text-green-600 dark:text-green-500 shrink-0" /><span>IP kamera entegrasyonu</span></li>

                </ul>

              </div>

            </div>

            <div className="p-1 rounded-[2rem] bg-gradient-to-br from-blue-200 to-transparent dark:from-blue-600/50 dark:to-transparent hover:from-blue-300 dark:hover:from-blue-500/50 transition-all">

              <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[1.9rem] h-full space-y-6 border border-blue-500/5 dark:border-blue-500/10">

                <div className="w-12 h-12 bg-blue-500/10 text-blue-600 dark:text-blue-500 rounded-xl flex items-center justify-center"><Zap size={24} /></div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Enerji Optimizasyonu</h3>

                <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">

                  <li className="flex items-center gap-2 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"><CheckCircle size={14} className="text-blue-600 dark:text-blue-500 shrink-0" /><span>Gerçek zamanlı watt takibi</span></li>
                  <li className="flex items-center gap-2 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"><CheckCircle size={14} className="text-blue-600 dark:text-blue-500 shrink-0" /><span>Otomatik ışık ve klima kontrolü</span></li>
                  <li className="flex items-center gap-2 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"><CheckCircle size={14} className="text-blue-600 dark:text-blue-500 shrink-0" /><span>Aylık tasarruf raporları</span></li>

                </ul>

              </div>

            </div>

            <div className="p-1 rounded-[2rem] bg-gradient-to-br from-purple-200 to-transparent dark:from-purple-600/50 dark:to-transparent hover:from-purple-300 dark:hover:from-purple-500/50 transition-all">

              <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[1.9rem] h-full space-y-6">

                <div className="w-12 h-12 bg-purple-500/10 text-purple-600 dark:text-purple-500 rounded-xl flex items-center justify-center"><Smartphone size={24} /></div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Mobil Senaryolar</h3>

                <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">

                  <li className="flex items-center gap-2 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"><CheckCircle size={14} className="text-purple-600 dark:text-purple-500 shrink-0" /><span>Eve gelmeden ısıtma başlatma</span></li>
                  <li className="flex items-center gap-2 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"><CheckCircle size={14} className="text-purple-600 dark:text-purple-500 shrink-0" /><span>Tek tıkla "Gece Modu"</span></li>
                  <li className="flex items-center gap-2 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"><CheckCircle size={14} className="text-purple-600 dark:text-purple-500 shrink-0" /><span>Sesli asistan uyumluluğu</span></li>

                </ul>

              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="py-24 px-6 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

        <div className="max-w-7xl mx-auto bg-gradient-to-br from-blue-500/5 to-slate-100 dark:from-blue-900/20 dark:to-slate-900 border border-blue-500/10 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
    
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl" />

          <div className="flex-1 space-y-6 relative z-10">

            <h2 className="text-3xl font-bold italic flex items-center gap-3 text-slate-900 dark:text-white"><Cpu className="text-blue-600 dark:text-blue-500" /> ESP32 Core™ Teknolojisi</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">Donanım tarafında ESP32-S3 ve Node.js backend mimarisi kullanarak en düşük enerji tüketimiyle en yüksek performansı hedefledik. </p>

            <ul className="space-y-4">

              {['G33 Auto-Calibration Desteği', 'Gerçek Zamanlı MQTT Veri Akışı', 'Uç Cihazlarda Mesh Network'].map((item) => ( <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300 group cursor-pointer">

                <CheckCircle size={18} className="text-blue-600 dark:text-blue-500 group-hover:scale-110 transition-transform shrink-0" /> 
                <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item}</span>

              </li> ))}

            </ul>

            <button className="mt-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all group shadow-md shadow-blue-500/10">
              Teknik Dokümantasyon
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

          </div>

          <div className="flex-1 grid grid-cols-2 gap-4 relative z-10 w-full">
      
            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-3xl text-center border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all group cursor-pointer shadow-sm dark:shadow-none">

              <TrendingUp className="mx-auto mb-2 text-blue-600 dark:text-blue-500 group-hover:scale-110 transition-transform" size={24} />
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-500 mb-1">12ms</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-tighter">Tepki Süresi</p>

            </div>

            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-3xl text-center border border-slate-200 dark:border-slate-700 hover:border-green-500/50 dark:hover:border-green-500/50 transition-all group cursor-pointer shadow-sm dark:shadow-none">

              <Award className="mx-auto mb-2 text-green-600 dark:text-green-500 group-hover:scale-110 transition-transform" size={24} />
              <p className="text-3xl font-bold text-green-600 dark:text-green-500 mb-1">%100</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-tighter">Yerli Yazılım</p>

            </div>

            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-3xl text-center col-span-2 border border-slate-200 dark:border-slate-700 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all group cursor-pointer shadow-sm dark:shadow-none">

              <Cpu className="mx-auto mb-2 text-purple-600 dark:text-purple-500 group-hover:scale-110 transition-transform" size={24} />
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-500 mb-1">ESP32-S3</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-tighter">Optimize İşlemci Gücü</p>

            </div>

          </div>

        </div>

      </section>

      <section className="py-24 px-6 bg-slate-50/50 dark:bg-slate-900/30 text-slate-900 dark:text-white transition-colors duration-300">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">

            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">Size Uygun <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">Planı Seçin</span></h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Her ölçekte işletme için esnek fiyatlandırma</p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {pricingPlans.map((plan, i) => ( <div key={i} className={`flex flex-col justify-between relative p-8 rounded-3xl transition-all hover:scale-105 duration-300 ${plan.popular ? 'bg-white dark:bg-slate-900 border-2 border-blue-500 shadow-xl shadow-blue-500/10 dark:shadow-2xl dark:shadow-blue-500/20' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}>

              {plan.popular && ( <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">En Popüler</div> )}

              <div className="text-center mb-8">

                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{plan.name}</h3>

                <div className="flex items-baseline justify-center gap-1">

                  <span className="text-5xl font-bold text-slate-900 dark:text-white">{plan.price === "Özel" ? "" : "₺"}{plan.price}</span>
                  <span className="text-slate-500 dark:text-slate-400">{plan.period}</span>

                </div>

              </div>

              <ul className="h-full space-y-4 mb-8">

                {plan.features.map((feature, idx) => ( <li key={idx} className="flex items-center gap-3 text-sm">

                  <CheckCircle size={16} className="text-green-600 dark:text-green-500 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300">{feature}</span>

                </li> ))}

              </ul>

              <button onClick={() => handlePlanSelect(plan)} className={`w-full py-4 rounded-xl font-bold transition-all duration-200 ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white'}`}>{plan.buttonText}</button>

            </div> ))}

          </div>

        </div>

      </section>

      <section className="py-24 px-6 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">

            <div className="inline-flex items-center gap-2 bg-yellow-500/10 dark:bg-yellow-600/10 text-yellow-600 dark:text-yellow-400 px-4 py-1.5 rounded-full text-sm font-bold border border-yellow-500/20 mb-6"><Star size={16} fill="currentColor" /> Müşteri Yorumları</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Müşterilerimiz Ne Diyor?</h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {testimonials.map((testimonial, i) => ( <div key={i} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 p-8 rounded-3xl transition-all group cursor-pointer shadow-sm dark:shadow-none">

              <div className="flex items-center gap-1 mb-4">

                {[...Array(testimonial.rating)].map((_, idx) => ( <Star key={idx} size={16} fill="currentColor" className="text-yellow-500" /> ))}

              </div>

              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed italic">"{testimonial.comment}"</p>

              <div className="flex items-center gap-4">

                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-300 dark:border-slate-700 group-hover:border-blue-500 dark:group-hover:border-blue-500 transition-colors"/>

                <div>

                  <p className="font-bold text-slate-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>

                </div>

              </div>

            </div> ))}

          </div>

        </div>

      </section>

      <section className="py-24 px-6 bg-slate-50/50 dark:bg-slate-900/30 text-slate-900 dark:text-white transition-colors duration-300">

        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-16">

            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Sıkça Sorulan Sorular</h2>
            <p className="text-slate-600 dark:text-slate-400">Aklınıza takılan her şey</p>

          </div>

          <div className="space-y-4">

            {[
              {
                q: "SmartHub kurulumu ne kadar sürer?",
                a: "Ortalama bir ev için kurulum 2-3 saat sürmektedir. Uzman ekibimiz tüm cihazlarınızı kurar ve test eder."
              },
              {
                q: "Mevcut cihazlarımı kullanabilir miyim?",
                a: "Evet! SmartHub 500'den fazla marka ve modelle uyumludur. Çoğu Wi-Fi özellikli cihaz entegre edilebilir."
              },
              {
                q: "İnternet bağlantısı olmadan çalışır mı?",
                a: "Evet, yerel ağ üzerinden temel fonksiyonlar çalışmaya devam eder. Bulut özellikleri internet gerektirir."
              },
              {
                q: "Güvenlik nasıl sağlanıyor?",
                a: "Uçtan uca AES-256 şifreleme, iki faktörlü kimlik doğrulama ve düzenli güvenlik güncellemeleri ile korunuyorsunuz."
              }
            ].map((faq, i) => ( <div key={i} className={`border p-6 rounded-2xl transition-all cursor-pointer group ${activeTab === i ? 'bg-slate-100/80 dark:bg-slate-900 border-blue-500/50 dark:border-blue-500/50 shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500/30 dark:hover:border-blue-500/30'}`} onClick={() => setActiveTab(activeTab === i ? -1 : i)}>

              <div className="flex items-center justify-between gap-4">

                <h3 className={`font-bold text-lg transition-colors duration-200 ${activeTab === i ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>{faq.q}</h3>
                <ArrowRight size={20} className={`transition-transform duration-300 shrink-0 ${activeTab === i ? 'rotate-90 text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-500'}`}/>

              </div>

              {activeTab === i && ( <p className="text-slate-600 dark:text-slate-400 mt-4 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/60 pt-4 animate-fadeIn">{faq.a}</p> )}

            </div> ))}

          </div>

        </div>

      </section>

      <section className="py-20 text-center px-6 relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-pink-600/20" />

        <div className="max-w-2xl mx-auto space-y-8 relative z-10">

          <div className="inline-flex items-center gap-2 bg-slate-900/5 dark:bg-white/10 text-slate-800 dark:text-white px-4 py-1.5 rounded-full text-sm font-bold border border-slate-900/10 dark:border-white/20 backdrop-blur-sm shadow-sm dark:shadow-none">
            <Zap size={16} className="text-purple-600 dark:text-yellow-400" /> Şimdi Başlamanın Tam Zamanı
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">Evinizi Konuşturmaya <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">Hazır Mısınız?</span></h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg">Hemen ücretsiz bir hesap oluşturun ve ilk cihazınızı bağlayın. Kredi kartı gerektirmez.</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">

            <Link to="/auth" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 dark:bg-white text-white dark:text-slate-950 px-10 py-4 rounded-2xl font-extrabold hover:scale-105 transition-all shadow-xl shadow-slate-900/20 dark:shadow-2xl dark:shadow-white/10">

              <MousePointerClick size={20} className="group-hover:scale-110 transition-transform" /> 
              Kuruluma Başla

            </Link>

            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/80 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 backdrop-blur-sm text-slate-800 dark:text-white px-10 py-4 rounded-2xl font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none">
              Satış Ekibiyle Görüş
            </button>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 pt-8 text-sm text-slate-500 dark:text-slate-400 space-y-2 sm:space-y-0">

            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600 dark:text-green-500 shrink-0" />
              <span>14 gün ücretsiz</span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600 dark:text-green-500 shrink-0" />
              <span>Kredi kartı gerekmez</span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600 dark:text-green-500 shrink-0" />
              <span>İstediğiniz zaman iptal</span>
            </div>

          </div>

        </div>

      </section>

      {/**isVideoModalOpen && ( <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setIsVideoModalOpen(false)}>

        <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden" onClick={e => e.stopPropagation()}>

          <button onClick={() => setIsVideoModalOpen(false)} className="absolute top-4 right-4 z-10 bg-slate-800 hover:bg-slate-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all">
            <X size={20} />
          </button>

          <div className="aspect-video bg-slate-800 flex items-center justify-center">

            <iframe src='https://www.youtube.com/embed/pRTeSIznQ1E' title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" className="w-full h-full"></iframe>

          </div>

        </div>

      </div> )**/}

    </div>
  );
};

export default Home;
