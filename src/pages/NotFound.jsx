import React, { useState, useEffect } from 'react';
import { Home, AlertTriangle, ChevronLeft, WifiOff, Cpu, RefreshCcw, Search, ArrowRight, Zap, Terminal, Code, Server, Activity, Globe, FileQuestion, Compass, BookOpen, HelpCircle, Mail, TrendingUp, Sparkles } from 'lucide-react';

const NotFound = () => {

  const [glitchText, setGlitchText] = useState('404');
  const [searchQuery, setSearchQuery] = useState('');
  const [countdown, setCountdown] = useState(10);
  const [autoRedirect, setAutoRedirect] = useState(false);

  useEffect(() => {

    const glitchChars = ['4', '0', '4', '?', '!', '#', '@', '~'];
    let interval;

    if (Math.random() > 0.7) {
      interval = setInterval(() => {
        const randomText = Array(3)
          .fill(null)
          .map(() => glitchChars[Math.floor(Math.random() * glitchChars.length)])
          .join('');
        setGlitchText(randomText);

        setTimeout(() => setGlitchText('404'), 100);
      }, 3000);
    }

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {

    if (autoRedirect && countdown > 0) {

      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (autoRedirect && countdown === 0) {

      window.location.href = '/';
    }
  }, [autoRedirect, countdown]);

  const quickLinks = [

    { icon: Home, label: 'Ana Sayfa', path: '/', color: 'from-blue-500 to-cyan-500' },
    { icon: Terminal, label: 'Dashboard', path: '/dashboard', color: 'from-purple-500 to-pink-500' },
    { icon: BookOpen, label: 'Rehberler', path: '/guides', color: 'from-green-500 to-emerald-500' },
    { icon: HelpCircle, label: 'Destek', path: '/contact', color: 'from-orange-500 to-red-500' },
  ];

  const errorCodes = [

    { code: 'ERR_404', status: 'NOT_FOUND', color: 'text-red-400' },
    { code: 'ROUTE', status: 'DISCONNECTED', color: 'text-orange-400' },
    { code: 'ESP32', status: 'SCANNING', color: 'text-green-400' },
    { code: 'GATEWAY', status: 'ONLINE', color: 'text-blue-400' },
  ];

  const suggestedPages = [

    { icon: Activity, title: 'Canlı Kontrol Paneli', description: 'Cihazlarınızı izleyin', path: '/dashboard' },
    { icon: Zap, title: 'Otomasyon Kuralları', description: 'Akıllı senaryolar oluşturun', path: '/automations' },
    { icon: Server, title: 'Cihaz Yönetimi', description: 'Tüm cihazlarınız', path: '/devices' },
    { icon: Globe, title: 'API Dokümantasyonu', description: 'Geliştirici rehberi', path: '/api-docs' },
  ];

  const handleSearch = (e) => {

    e.preventDefault();

    if (searchQuery.trim()) {

      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden relative">

      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-red-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/5 rounded-full blur-[150px]" />
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px', }}/>

      <div className="max-w-6xl w-full relative z-10">

        <div className="text-center space-y-12 mb-12">

          <div className="relative inline-block">

            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl animate-ping opacity-20" />

            <div className="relative bg-slate-900 border border-slate-800 p-12 rounded-[3rem] shadow-2xl">

              <div className="relative">

                <Cpu size={100} className="text-slate-700 mx-auto" />
                <WifiOff size={40} className="text-red-500 absolute -top-4 -right-4 animate-bounce" />

                <div className="absolute inset-0 flex items-center justify-center">

                  <span className="text-5xl font-black text-red-500/80 glitch-text select-none">{glitchText}</span>

                </div>

              </div>

            </div>

          </div>

          <div className="space-y-6">

            <div className="inline-flex items-center gap-2 bg-red-500/10 backdrop-blur-sm text-red-400 px-4 py-2 rounded-full text-sm font-bold border border-red-500/20">

              <AlertTriangle size={16} />
              <span>Sayfa Bulunamadı</span>

            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
              BAĞLANTI{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                KOPTU!
              </span>
            </h1>

            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">Aradığınız sayfa sistem ağında bulunamadı. Belki taşındı, belki silindi, ya da ESP32'lerden biri olması gerektiği gibi çalışmıyor.</p>

          </div>

          <div className="max-w-xl mx-auto">

            <form onSubmit={handleSearch} className="relative">

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="Aradığınızı burada arayın..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-32 py-4 text-white focus:outline-none focus:border-blue-500 transition-colors"/>

              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2">
                Ara
                <ArrowRight size={16} />
              </button>

            </form>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

            <button onClick={() => window.history.back()} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-2xl border border-slate-800 transition-all active:scale-95 group">
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Geri Dön
            </button>

            <button onClick={() => (window.location.href = '/')} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-900/30 transition-all active:scale-95 group">
              <Home size={20} />
              Ana Sayfa
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button onClick={() => window.location.reload()} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-2xl border border-slate-800 transition-all active:scale-95 group">
              <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
              Yenile
            </button>

          </div>

          <div className="flex items-center justify-center gap-3">

            <label className="flex items-center gap-3 cursor-pointer group">

              <input type="checkbox" checked={autoRedirect} onChange={(e) => {setAutoRedirect(e.target.checked); setCountdown(10);}} className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"/>
              <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{autoRedirect ? `Ana sayfaya ${countdown} saniye içinde yönlendiriliyorsunuz...` : 'Otomatik yönlendirme'}</span>

            </label>

          </div>

          <div className="pt-8">

            <div className="inline-flex items-center gap-4 px-6 py-3 bg-slate-900/60 border border-slate-800/50 rounded-2xl backdrop-blur-sm">

              {errorCodes.map((error, i) => ( <div key={i} className="flex items-center gap-2">

                <span className={`flex h-2 w-2 rounded-full ${error.color.replace('text-', 'bg-')} animate-pulse`} />

                <code className="text-xs font-mono">

                  <span className="text-slate-500">{error.code}:</span>{' '}
                  <span className={error.color}>{error.status}</span>

                </code>

                {i < errorCodes.length - 1 && <span className="text-slate-700">|</span>}

              </div> ))}

            </div>

          </div>

        </div>

        <div className="mb-12">

          <div className="text-center mb-8">

            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2 text-blue-500"><Compass className="text-blue-400" size={24} />Hızlı Yönlendirme</h2>
            <p className="text-slate-400 text-sm">Popüler sayfalara kolayca ulaşın</p>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">

            {quickLinks.map((link, i) => ( <a key={i} href={link.path} className="group bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all hover:scale-105 text-center">

              <div className={`w-14 h-14 mx-auto mb-3 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}><link.icon size={24} className="text-white" /></div>
              <p className="font-semibold text-sm group-hover:text-blue-400 transition-colors">{link.label}</p>

            </a> ))}

          </div>

        </div>

        <div>

          <div className="text-center mb-8">

            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2 text-purple-500"><Sparkles className="text-purple-400" size={24} />Bunlara Göz Atın</h2>
            <p className="text-slate-400 text-sm">İlginizi çekebilecek sayfalar</p>

          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">

            {suggestedPages.map((page, i) => ( <a key={i} href={page.path} className="group bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all hover:scale-[1.02] flex items-start gap-4">

              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                <page.icon size={24} className="text-blue-400" />
              </div>

              <div className="flex-1">

                <h3 className="font-bold mb-1 group-hover:text-blue-400 transition-colors">{page.title}</h3>
                <p className="text-sm text-slate-400">{page.description}</p>

              </div>

              <ArrowRight size={20} className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
            </a> ))}

          </div>

        </div>

        <div className="mt-12 text-center">

          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl px-6 py-4">

            <Mail className="text-blue-400" size={20} />
            <span className="text-slate-300">Yardıma mı ihtiyacınız var?{' '}<a href="/contact" className="text-blue-400 font-semibold hover:underline">Bize ulaşın</a></span>

          </div>

        </div>

        <div className="mt-8 text-center">

          <details className="inline-block">

            <summary className="text-xs text-slate-600 hover:text-slate-500 cursor-pointer select-none">🥚 Gizli mesaj</summary>
            <p className="text-xs text-slate-500 mt-2 font-mono">
              // TODO: Bu sayfayı bulduğun için tebrikler! 🎉
              <br />
              // Belki bu bir bug değil, bir feature'dır? 🤔
            </p>

          </details>

        </div>

      </div>

      <style jsx>{`
        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }

        .glitch-text {
          animation: glitch 0.3s infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;