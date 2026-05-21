import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, Smartphone, Cpu, ArrowRight, CheckCircle, Layers, MousePointerClick, Globe, Database, Code2, Wifi, Lock, Thermometer, Lightbulb, Camera, Bell,TrendingUp, Users, Award, Star, Play, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [

    { number: "50K+", label: "Aktif Kullanıcı", icon: <Users size={20} /> },
    { number: "99.9%", label: "Uptime Garantisi", icon: <Award size={20} /> },
    { number: "500K+", label: "Bağlı Cihaz", icon: <Wifi size={20} /> },
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

    { name: "ESP32-S3", desc: "Dual-Core Xtensa LX7", color: "from-blue-500 to-cyan-500" },
    { name: "MQTT 5.0", desc: "Real-time Messaging", color: "from-purple-500 to-pink-500" },
    { name: "Node.js", desc: "High Performance Backend", color: "from-green-500 to-emerald-500" },
    { name: "MongoDB", desc: "Scalable Database", color: "from-orange-500 to-red-500" }
  ];

  return (

    <div className="bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white overflow-hiddentransition-colors duration-300">
      
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-32 px-6 overflow-hidden">

        <div className="absolute inset-0 overflow-hidden">

          <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -top-48 -left-48" style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
          <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -bottom-48 -right-48" style={{ transform: `translateY(${scrollY * -0.1}px)` }} />

        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">

          <div className="flex-1 text-center lg:text-left space-y-6">

            <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer">
              <Zap size={16} className="animate-pulse" /> Geleceğin Teknolojisi Bugün Burada
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              Evinizi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient">Akıllı Bir Merkeze</span> Dönüştürün
            </h1>

            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0">
              ESP32-S3 mimarisi üzerine kurulu, düşük gecikmeli ve uçtan uca şifreli ev otomasyon sistemi ile kontrol tamamen sizde.
            </p>

            {/* Stats Mini */}
            <div className="flex items-center gap-6 text-sm justify-center lg:justify-start flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-slate-300">Kurulum 5 Dakika</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-slate-300">Kredi Kartı Gerektirmez</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-slate-300">14 Gün Para İade Garantisi</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">

              <Link 
                to="/auth" 
                className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/50 hover:shadow-blue-900/80 hover:scale-105"
              >
                Hemen Başlayın 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <button 
                onClick={() => setIsVideoModalOpen(true)}
                className="group w-full sm:w-auto bg-slate-800/50 hover:bg-slate-700/50 text-white px-8 py-4 rounded-2xl font-bold transition-all border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2"
              >
                <Play size={18} className="group-hover:scale-110 transition-transform" />
                Demoyu İzle
              </button>

            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 justify-center lg:justify-start pt-4">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <img 
                    key={i}
                    src={`https://i.pravatar.cc/40?img=${i}`}
                    alt={`User ${i}`}
                    className="w-8 h-8 rounded-full border-2 border-slate-950"
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <p className="text-slate-400 text-xs">50,000+ mutlu kullanıcı</p>
              </div>
            </div>

          </div>

          <div className="flex-1 relative">

            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

            <div className="relative bg-slate-900 border border-slate-800 p-2 rounded-[2.5rem] shadow-2xl hover:scale-105 transition-transform duration-500">

              <img 
                src="https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop" 
                alt="Smart Home Dashboard" 
                className="rounded-[2rem] w-full h-auto object-cover"
              />

              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 bg-slate-900 border border-blue-500/50 p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Zap className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Enerji Tasarrufu</p>
                    <p className="text-xl font-bold text-green-500">%42</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-slate-900 border border-green-500/50 p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="text-green-500" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Güvenlik Skoru</p>
                    <p className="text-xl font-bold text-green-500">100%</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="py-12 px-6 border-y border-slate-800/50 bg-slate-900/30">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center space-y-2 group cursor-pointer">
              <div className="flex justify-center text-blue-500 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                {stat.number}
              </p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 bg-slate-900/30">

        <div className="max-w-7xl mx-auto text-center mb-16">

          <div className="inline-flex items-center gap-2 bg-purple-600/10 text-purple-400 px-4 py-1.5 rounded-full text-sm font-bold border border-purple-500/20 mb-6"><Layers size={16} /> Özellikler</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Tek Panel, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Sınırsız Çözüm</span></h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Tüm cihazlarınızı tek bir merkezden yönetmeniz için tasarlandı.</p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              icon: <ShieldCheck size={32} className="text-green-500" />,
              title: "Tam Güvenlik",
              desc: "Gelişmiş şifreleme ve anlık bildirimlerle eviniz 7/24 koruma altında.",
              gradient: "from-green-500/10 to-transparent",
              border: "border-green-500/20 hover:border-green-500/50"
            },
            {
              icon: <Layers size={32} className="text-blue-500" />,
              title: "Modüler Yapı",
              desc: "Kendi sensörlerinizi ekleyin veya mevcut otomasyonları dakikalar içinde güncelleyin.",
              gradient: "from-blue-500/10 to-transparent",
              border: "border-blue-500/20 hover:border-blue-500/50"
            },
            {
              icon: <Smartphone size={32} className="text-purple-500" />,
              title: "Uzaktan Erişim",
              desc: "Dünyanın neresinde olursanız olun, mobil uygulama üzerinden kontrol sağlayın.",
              gradient: "from-purple-500/10 to-transparent",
              border: "border-purple-500/20 hover:border-purple-500/50"
            }
          ].map((feature, i) => ( <div key={i} className={`bg-gradient-to-br ${feature.gradient} backdrop-blur-sm border ${feature.border} p-8 rounded-3xl transition-all group hover:scale-105 cursor-pointer`}>

            <div className="mb-6 bg-slate-800/50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Detayları Gör <ArrowRight size={16} /></div>

          </div> ))}

        </div>

      </section>

      <section className="py-24 px-6">

        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">

            <h2 className="text-3xl md:text-4xl font-bold mb-4">Desteklenen Cihazlar</h2>
            <p className="text-slate-400">Hemen hemen her akıllı cihazı ekosistemimize entegre edebilirsiniz</p>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {devices.map((device, i) => ( <div key={i} className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-8 rounded-2xl text-center group cursor-pointer transition-all hover:scale-105">

              <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                {device.icon}
              </div>

              <h3 className="font-bold mb-2">{device.name}</h3>
              <p className="text-2xl font-bold text-blue-500">{device.count}</p>
              <p className="text-xs text-slate-500 mt-1">Aktif Cihaz</p>

            </div> ))}

          </div>

        </div>

      </section>

      <section className="py-24 px-6 border-y border-slate-900">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">

            <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-500/20 mb-6">
              <Code2 size={16} /> Teknoloji Yığını
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Güçlü Altyapı</h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {techStack.map((tech, i) => ( <div key={i} className="group cursor-pointer">

              <div className={`h-2 bg-gradient-to-r ${tech.color} rounded-full mb-4 group-hover:h-3 transition-all`}></div>
              <h3 className="font-bold text-xl mb-2">{tech.name}</h3>
              <p className="text-sm text-slate-500">{tech.desc}</p>

            </div> ))}

          </div>

        </div>

      </section>

      <section className="py-24 px-6 bg-slate-900/50">

        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">

            <h2 className="text-3xl md:text-4xl font-bold mb-4">Günlük Senaryolarınız</h2>
            <p className="text-slate-400">Eviniz sizin rutininize uyum sağlar</p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {useCases.map((useCase, i) => ( <div key={i} className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-6 rounded-2xl transition-all group cursor-pointer">

              <div className="flex items-center justify-between mb-4">

                <Bell className="text-purple-500 group-hover:animate-bounce" size={24} />
                <span className="text-sm font-mono bg-slate-800 px-3 py-1 rounded-lg">{useCase.time}</span>

              </div>

              <h3 className="font-bold text-lg mb-3">{useCase.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{useCase.desc}</p>

            </div> ))}

          </div>

        </div>

      </section>

      <section className="py-24 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">

            <div className="max-w-xl">

              <h2 className="text-4xl font-bold mb-4">Her Şey Tek Bir Panelin Altında</h2>
              <p className="text-slate-400">Karmaşıklığı ortadan kaldırıyoruz. Karmaşık donanım kodlarını sizin için kullanıcı dostu arayüzlere dönüştürüyoruz.</p>

            </div>

            <button className="text-blue-500 font-bold flex items-center gap-2 hover:gap-3 transition-all group">
              Tüm Özellikleri Keşfet 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="p-1 rounded-[2rem] bg-gradient-to-br from-green-800 to-transparent hover:from-green-700 transition-all">

              <div className="bg-slate-950 p-8 rounded-[1.9rem] h-full space-y-6">

                <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>

                <h3 className="text-xl font-bold">Gelişmiş Güvenlik</h3>

                <ul className="space-y-3 text-sm text-slate-500">

                  <li className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                    <CheckCircle size={14} className="text-green-500" /> Hareket algılama ve anlık bildirim
                  </li>
                  <li className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                    <CheckCircle size={14} className="text-green-500" /> Akıllı kilit sistemleri
                  </li>
                  <li className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                    <CheckCircle size={14} className="text-green-500" /> IP kamera entegrasyonu
                  </li>

                </ul>

              </div>

            </div>

            <div className="p-1 rounded-[2rem] bg-gradient-to-br from-blue-600/50 to-transparent hover:from-blue-500/50 transition-all">

              <div className="bg-slate-950 p-8 rounded-[1.9rem] h-full space-y-6 border border-blue-500/10">

                <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center"><Zap size={24} /></div>
                <h3 className="text-xl font-bold">Enerji Optimizasyonu</h3>

                <ul className="space-y-3 text-sm text-slate-500">

                  <li className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                    <CheckCircle size={14} className="text-blue-500" /> Gerçek zamanlı watt takibi
                  </li>
                  <li className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                    <CheckCircle size={14} className="text-blue-500" /> Otomatik ışık ve klima kontrolü
                  </li>
                  <li className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                    <CheckCircle size={14} className="text-blue-500" /> Aylık tasarruf raporları
                  </li>

                </ul>

              </div>

            </div>

            <div className="p-1 rounded-[2rem] bg-gradient-to-br from-purple-600/50 to-transparent hover:from-purple-500/50 transition-all">

              <div className="bg-slate-950 p-8 rounded-[1.9rem] h-full space-y-6">

                <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center"><Smartphone size={24} /></div>
                <h3 className="text-xl font-bold">Mobil Senaryolar</h3>

                <ul className="space-y-3 text-sm text-slate-500">

                  <li className="flex items-center gap-2 hover:text-slate-300 transition-colors"><CheckCircle size={14} className="text-purple-500" /> Eve gelmeden ısıtma başlatma</li>
                  <li className="flex items-center gap-2 hover:text-slate-300 transition-colors"><CheckCircle size={14} className="text-purple-500" /> Tek tıkla "Gece Modu"</li>
                  <li className="flex items-center gap-2 hover:text-slate-300 transition-colors"><CheckCircle size={14} className="text-purple-500" /> Sesli asistan uyumluluğu</li>

                </ul>

              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="py-24 px-6">

        <div className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/20 to-slate-900 border border-blue-500/10 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">

          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

          <div className="flex-1 space-y-6 relative z-10">

            <h2 className="text-3xl font-bold italic flex items-center gap-3"><Cpu className="text-blue-500" /> ESP32 Core™ Teknolojisi</h2>

            <p className="text-slate-300 leading-relaxed">
              Donanım tarafında ESP32-S3 ve Node.js backend mimarisi kullanarak en düşük enerji tüketimiyle en yüksek performansı hedefledik. 
            </p>

            <ul className="space-y-4">

              {['G33 Auto-Calibration Desteği', 'Gerçek Zamanlı MQTT Veri Akışı', 'Uç Cihazlarda Mesh Network'].map((item) => ( <li key={item} className="flex items-center gap-3 text-sm font-medium group cursor-pointer">

                <CheckCircle size={18} className="text-blue-500 group-hover:scale-110 transition-transform" /> 
                <span className="group-hover:text-blue-400 transition-colors">{item}</span>

              </li> ))}

            </ul>

            <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all group">

              Teknik Dokümantasyon
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />

            </button>

          </div>

          <div className="flex-1 grid grid-cols-2 gap-4 relative z-10">

            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-3xl text-center border border-slate-700 hover:border-blue-500/50 transition-all group cursor-pointer">

              <TrendingUp className="mx-auto mb-2 text-blue-500 group-hover:scale-110 transition-transform" size={24} />
              <p className="text-3xl font-bold text-blue-500 mb-1">12ms</p>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Tepki Süresi</p>

            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-3xl text-center border border-slate-700 hover:border-green-500/50 transition-all group cursor-pointer">

              <Award className="mx-auto mb-2 text-green-500 group-hover:scale-110 transition-transform" size={24} />
              <p className="text-3xl font-bold text-green-500 mb-1">%100</p>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Yerli Yazılım</p>

            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-3xl text-center col-span-2 border border-slate-700 hover:border-purple-500/50 transition-all group cursor-pointer">

              <Cpu className="mx-auto mb-2 text-purple-500 group-hover:scale-110 transition-transform" size={24} />
              <p className="text-3xl font-bold text-purple-500 mb-1">ESP32-S3</p>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Optimize İşlemci Gücü</p>

            </div>

          </div>

        </div>

      </section>

      <section className="py-24 px-6 bg-slate-900/30">

        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">

            <h2 className="text-3xl md:text-5xl font-bold mb-4">Size Uygun <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Planı Seçin</span></h2>
            <p className="text-slate-400 text-lg">Her ölçekte işletme için esnek fiyatlandırma</p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {pricingPlans.map((plan, i) => ( <div key={i} className={`relative bg-slate-900 border rounded-3xl p-8 transition-all hover:scale-105 ${plan.popular ? 'border-blue-500 shadow-2xl shadow-blue-500/20' : 'border-slate-800 hover:border-slate-700'}`}>

              {plan.popular && ( <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold">En Popüler</div> )}

              <div className="text-center mb-8">

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>

                <div className="flex items-baseline justify-center gap-1">

                  <span className="text-5xl font-bold">{plan.price === "Özel" ? "" : "₺"}{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>

                </div>

              </div>

              <ul className="space-y-4 mb-8">

                {plan.features.map((feature, idx) => ( <li key={idx} className="flex items-center gap-3 text-sm">

                  <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>

                </li> ))}

              </ul>

              <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>
                {plan.buttonText}
              </button>

            </div> ))}

          </div>

        </div>

      </section>

      <section className="py-24 px-6">

        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">

            <div className="inline-flex items-center gap-2 bg-yellow-600/10 text-yellow-400 px-4 py-1.5 rounded-full text-sm font-bold border border-yellow-500/20 mb-6">
              <Star size={16} fill="currentColor" /> Müşteri Yorumları
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Müşterilerimiz Ne Diyor?</h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {testimonials.map((testimonial, i) => ( <div key={i} className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-8 rounded-3xl transition-all group cursor-pointer">

              <div className="flex items-center gap-1 mb-4">

                {[...Array(testimonial.rating)].map((_, idx) => ( <Star key={idx} size={16} fill="currentColor" className="text-yellow-500" /> ))}

              </div>

              <p className="text-slate-300 mb-6 leading-relaxed italic">"{testimonial.comment}"</p>

              <div className="flex items-center gap-4">

                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full border-2 border-slate-700 group-hover:border-blue-500 transition-colors"/>

                <div>

                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>

                </div>

              </div>

            </div> ))}

          </div>

        </div>

      </section>

      <section className="py-24 px-6 bg-slate-900/30">

        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">

            <h2 className="text-3xl md:text-4xl font-bold mb-4">Sıkça Sorulan Sorular</h2>
            <p className="text-slate-400">Aklınıza takılan her şey</p>

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
            ].map((faq, i) => ( <div key={i} className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition-all cursor-pointer group" onClick={() => setActiveTab(activeTab === i ? -1 : i)}>

              <div className="flex items-center justify-between">

                <h3 className="font-bold text-lg group-hover:text-blue-400 transition-colors">{faq.q}</h3>
                <ArrowRight size={20} className={`transition-transform ${activeTab === i ? 'rotate-90' : ''}`}/>

              </div>

              {activeTab === i && ( <p className="text-slate-400 mt-4 leading-relaxed">{faq.a}</p> )}

            </div> ))}

          </div>

        </div>

      </section>

      <section className="py-20 text-center px-6 relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>

        <div className="max-w-2xl mx-auto space-y-8 relative z-10">

          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-bold border border-white/20 backdrop-blur-sm">
            <Zap size={16} /> Şimdi Başlamanın Tam Zamanı
          </div>

          <h2 className="text-3xl md:text-5xl font-bold">
            Evinizi Konuşturmaya <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Hazır Mısınız?</span>
          </h2>

          <p className="text-slate-300 text-lg">
            Hemen ücretsiz bir hesap oluşturun ve ilk cihazınızı bağlayın. Kredi kartı gerektirmez.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">

            <Link to="/auth" className="group inline-flex items-center gap-3 bg-white text-slate-950 px-10 py-4 rounded-2xl font-extrabold hover:scale-105 transition-all shadow-2xl">

              <MousePointerClick size={20} className="group-hover:scale-110 transition-transform" /> 
              Kuruluma Başla

            </Link>

            <button className="inline-flex items-center gap-3 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm text-white px-10 py-4 rounded-2xl font-bold transition-all border border-slate-700">
              Satış Ekibiyle Görüş
            </button>

          </div>

          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-slate-400">

            <div className="flex items-center gap-2">

              <CheckCircle size={16} className="text-green-500" />
              14 gün ücretsiz

            </div>

            <div className="flex items-center gap-2">

              <CheckCircle size={16} className="text-green-500" />
              Kredi kartı gerekmez

            </div>

            <div className="flex items-center gap-2">

              <CheckCircle size={16} className="text-green-500" />
              İstediğiniz zaman iptal

            </div>

          </div>

        </div>

      </section>

      {isVideoModalOpen && ( <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setIsVideoModalOpen(false)}>

        <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden" onClick={e => e.stopPropagation()}>

          <button onClick={() => setIsVideoModalOpen(false)} className="absolute top-4 right-4 z-10 bg-slate-800 hover:bg-slate-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all">
            <X size={20} />
          </button>

          <div className="aspect-video bg-slate-800 flex items-center justify-center">

            <Play size={64} className="text-slate-600" />
            <p className="absolute text-slate-400">Demo video buraya gelecek</p>

          </div>

        </div>

      </div> )}

    </div>
  );
};

export default Home;