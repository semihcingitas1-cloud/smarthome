import React, { useState, useEffect } from 'react';
import Sidebar from '../../layout/Sidebar';

import { Mic, BrainCircuit, MessageSquare, Settings2, Radio, Volume2, Sparkles, Play, Save, Database, Ear, Languages, Cpu, Bot, Activity, Zap, TrendingUp, AlertCircle, CheckCircle2, RefreshCw, Download, Upload, Bell, Clock, Gauge, Wifi, Server, Settings, Trash2, Eye, EyeOff, Volume1, VolumeX, Plus, X, ChevronRight, Info, BarChart3, Waves, Mic2, Speaker, Headphones, Share2, Copy, FileText, Filter, Search, Shield } from 'lucide-react';

const AIVoiceConfig = () => {

  const [aiPersonality, setAiPersonality] = useState('professional');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [autoLearning, setAutoLearning] = useState(true);
  const [wakeWordSensitivity, setWakeWordSensitivity] = useState(75);
  const [responseSpeed, setResponseSpeed] = useState(50);
  const [voiceVolume, setVoiceVolume] = useState(80);
  const [selectedVoice, setSelectedVoice] = useState('female1');
  const [selectedLanguage, setSelectedLanguage] = useState('tr');
  const [privacyMode, setPrivacyMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [commandHistory, setCommandHistory] = useState([
    {
      id: 1,
      user: "Kombiyi 23 derece yap.",
      ai: "Anlaşıldı, ısı 23 dereceye ayarlandı.",
      confidence: 0.98,
      time: "2 dakika önce",
      icon: <Volume2 />,
      status: 'success'
    },
    {
      id: 2,
      user: "Salonda bir film izleyeceğiz.",
      ai: "Sinema modu aktif edildi, ışıklar kısılıyor.",
      confidence: 0.94,
      time: "5 dakika önce",
      icon: <Sparkles />,
      status: 'success'
    },
    {
      id: 3,
      user: "Yarın saat kaçta alarm kurduk?",
      ai: "Yarın sabah 07:00'de alarmınız var.",
      confidence: 0.92,
      time: "12 dakika önce",
      icon: <Clock />,
      status: 'success'
    },
    {
      id: 4,
      user: "Mutfaktaki ışıkları söndür.",
      ai: "Üzgünüm, mutfak ışıkları sistemde bulunamadı.",
      confidence: 0.45,
      time: "20 dakika önce",
      icon: <AlertCircle />,
      status: 'error'
    },
  ]);

  const [systemStats, setSystemStats] = useState({

    latency: 124,
    uptime: 99.8,
    requestsToday: 342,
    averageConfidence: 94,
    wifiSignal: -42,
    cpuUsage: 34,
    memoryUsage: 67
  });

  const personalities = [
    {
      id: 'professional',
      name: 'Profesyonel',
      desc: 'Kısa, öz ve net yanıtlar.',
      icon: <Bot />,
      color: 'blue'
    },
    {
      id: 'friendly',
      name: 'Samimi',
      desc: 'Daha sıcak ve insansı bir dil.',
      icon: <MessageSquare />,
      color: 'green'
    },
    {
      id: 'humorous',
      name: 'Esprili',
      desc: 'Şakacı ve eğlenceli etkileşim.',
      icon: <Sparkles />,
      color: 'purple'
    }
  ];

  const voices = [

    { id: 'female1', name: 'Ayşe (Kadın)', lang: 'tr', accent: 'İstanbul' },
    { id: 'male1', name: 'Mehmet (Erkek)', lang: 'tr', accent: 'Ankara' },
    { id: 'female2', name: 'Emma (Female)', lang: 'en', accent: 'US' },
    { id: 'male2', name: 'David (Male)', lang: 'en', accent: 'UK' },
  ];

  const quickActions = [

    { label: 'Model Güncelle', icon: <Download />, action: () => console.log('Update model') },
    { label: 'Benchmark Test', icon: <Activity />, action: () => console.log('Run test') },
    { label: 'Log Dışa Aktar', icon: <Upload />, action: () => console.log('Export logs') },
    { label: 'Fabrika Ayarları', icon: <RefreshCw />, action: () => console.log('Reset') },
  ];

  const tabs = [

    { id: 'overview', label: 'Genel Bakış', icon: <BarChart3 /> },
    { id: 'voice', label: 'Ses Ayarları', icon: <Mic /> },
    { id: 'personality', label: 'Kişilik', icon: <Bot /> },
    { id: 'history', label: 'Geçmiş', icon: <Clock /> },
    { id: 'advanced', label: 'Gelişmiş', icon: <Settings /> },
  ];

  useEffect(() => {

    const interval = setInterval(() => {

      setSystemStats(prev => ({

        ...prev,
        latency: Math.floor(Math.random() * 50 + 100),
        cpuUsage: Math.floor(Math.random() * 20 + 30),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSave = () => {

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleTestVoice = () => {

    setIsListening(true);
    setTimeout(() => setIsListening(false), 3000);
  };

  const getPersonalityColor = (color) => {

    const colors = {

      blue: 'border-blue-500 bg-blue-500/5',
      green: 'border-green-500 bg-green-500/5',
      purple: 'border-purple-500 bg-purple-500/5'
    };

    return colors[color] || colors.blue;
  };

  return (

    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">

      <Sidebar />

      {showSuccessToast && ( <div className="fixed top-8 right-8 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in">

        <CheckCircle2 size={24} />

        <div>

          <p className="font-bold">Başarılı!</p>
          <p className="text-sm">Ayarlar kaydedildi.</p>

        </div>

      </div> )}

      <main className="flex-1 lg:ml-0 overflow-x-hidden">

        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen p-6 lg:p-12 transition-colors">
          
          <div className="max-w-7xl mx-auto mb-8">

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">

              <div className="space-y-3">

                <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full text-xs font-bold border border-purple-500/20">

                  <Sparkles size={14} />
                  DeepSeek-V3 Engine Aktif

                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">AI & Sesli Asistan</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Evinizin zekasını ve konuşma tarzını buradan kişiselleştirin.</p>

              </div>
              
              <div className="flex flex-wrap gap-3">

                <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all text-slate-900 dark:text-white">
                  <Database size={18} />
                  <span className="hidden sm:inline">Belleği Temizle</span>
                </button>

                <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all text-white">
                  <Save size={18} />
                  <span className="hidden sm:inline">Kaydet</span>
                </button>

              </div>

            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 overflow-x-auto">

              <div className="flex gap-2 min-w-max">

                {tabs.map((tab) => ( <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>

                  {tab.icon}
                  {tab.label}

                </button> ))}

              </div>

            </div>

          </div>

          <div className="max-w-7xl mx-auto">

            {activeTab === 'overview' && ( <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              <div className="lg:col-span-2 space-y-8">

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950/20 border border-blue-200 dark:border-slate-800 rounded-3xl p-8 relative overflow-hidden group">

                  <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-10 group-hover:opacity-20 transition-opacity">

                    <BrainCircuit size={120} className="text-blue-600 dark:text-white" />

                  </div>

                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">

                    <div className="relative">

                      <div className="w-32 h-32 bg-blue-600/20 rounded-full flex items-center justify-center border-4 border-blue-500/30">

                        <div className={`w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 ${isListening ? 'animate-pulse' : ''}`}>
                          <Mic size={40} className="text-white" />
                        </div>

                      </div>

                      {isListening && ( <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping" /> )}

                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4">

                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white italic tracking-wide">"Hey Evim, mutfak ışıklarını yak..."</h2>

                      <div className="flex flex-wrap justify-center md:justify-start gap-3">

                        <div className="bg-white dark:bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">

                          <p className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase">Gecikme</p>
                          <p className="text-sm font-mono text-green-600 dark:text-green-400">{systemStats.latency}ms</p>

                        </div>

                        <div className="bg-white dark:bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">

                          <p className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase">Model</p>
                          <p className="text-sm font-mono text-blue-600 dark:text-blue-400">DeepSeek-Chat</p>

                        </div>

                        <div className="bg-white dark:bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">

                          <p className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase">Donanım</p>
                          <p className="text-sm font-mono text-purple-600 dark:text-purple-400">ESP32-S3</p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                  {[
                    { label: 'Bugünkü İstekler', value: systemStats.requestsToday, icon: <Activity />, color: 'blue' },
                    { label: 'Ortalama Güven', value: `${systemStats.averageConfidence}%`, icon: <TrendingUp />, color: 'green' },
                    { label: 'Uptime', value: `${systemStats.uptime}%`, icon: <CheckCircle2 />, color: 'purple' },
                    { label: 'CPU Kullanımı', value: `${systemStats.cpuUsage}%`, icon: <Cpu />, color: 'orange' },
                  ].map((stat, i) => ( <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg transition-all">

                    <div className={`w-12 h-12 bg-${stat.color}-500/10 rounded-xl flex items-center justify-center mb-4`}>

                      <div className={`text-${stat.color}-600 dark:text-${stat.color}-400`}>{stat.icon}</div>
 
                    </div>
 
                    <div className="text-3xl font-bold mb-1 text-slate-900 dark:text-white">{stat.value}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-500">{stat.label}</div>
 
                  </div> ))}
 
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">

                  <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Hızlı İşlemler</h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    {quickActions.map((action, i) => ( <button key={i} onClick={action.action} className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all group">

                      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">{action.icon}</div>
                      <span className="text-xs font-semibold text-center text-slate-700 dark:text-slate-300">{action.label}</span>

                    </button> ))}

                  </div>

                </div>

              </div>

              <div className="space-y-8">

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">

                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white"><Activity className="text-blue-600 dark:text-blue-500" />Sistem Durumu</h3>

                  <div className="space-y-4">

                    <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-800">

                      <div className="flex items-center gap-3">

                        <Wifi size={18} className="text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">WiFi Bağlantısı</span>

                      </div>

                      <span className="text-xs font-mono text-green-600 dark:text-green-400">Aktif</span>

                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-800">

                      <div className="flex items-center gap-3">

                        <Server size={18} className="text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">API Bağlantısı</span>

                      </div>

                      <span className="text-xs font-mono text-green-600 dark:text-green-400">Online</span>

                    </div>

                    <div className="flex items-center justify-between py-3">

                      <div className="flex items-center gap-3">

                        <Mic size={18} className="text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Mikrofon</span>

                      </div>

                      <span className={`text-xs font-mono ${voiceEnabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{voiceEnabled ? 'Aktif' : 'Pasif'}</span>

                    </div>

                  </div>

                  <button onClick={handleTestVoice} className="w-full mt-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all flex items-center justify-center gap-2">

                    {isListening ? ( <>

                      <Waves size={18} className="animate-pulse" />
                      Dinleniyor...

                    </> ) : ( <>

                      <Play size={18} />
                      Sesi Test Et

                    </> )}

                  </button>

                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-600/10 dark:to-transparent border border-blue-200 dark:border-blue-500/10 rounded-3xl p-8">

                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white"><Cpu className="text-blue-600 dark:text-blue-500" />Donanım Bilgisi</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">Sinyal işleme (DSP) ESP32-S3 üzerinde yerel olarak yapılır, sadece anonim metin verisi buluta iletilir.</p>

                  <div className="space-y-4">

                    <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">

                      <span>WiFi Sinyal</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{systemStats.wifiSignal} dBm</span>

                    </div>

                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 w-[85%] rounded-full" />
                    </div>

                    <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 mt-4">

                      <span>Bellek Kullanımı</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">{systemStats.memoryUsage}%</span>

                    </div>

                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-[67%] rounded-full" />
                    </div>

                  </div>

                </div>

              </div>

            </div> )}

            {activeTab === 'voice' && ( <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              <div className="space-y-8">

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">

                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white"><Speaker className="text-blue-600 dark:text-blue-500" />Ses Çıkışı</h3>

                  <div className="space-y-4 mb-6">

                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ses Seçimi</label>

                    <div className="grid grid-cols-2 gap-3">

                      {voices.map((voice) => ( <button key={voice.id} onClick={() => setSelectedVoice(voice.id)} className={`p-4 rounded-2xl border-2 text-left transition-all ${selectedVoice === voice.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}>

                        <div className="flex items-center gap-2 mb-2">

                          <Headphones size={16} className="text-blue-600 dark:text-blue-400" />
                          <span className="font-semibold text-sm text-slate-900 dark:text-white">{voice.name}</span>

                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-500">{voice.accent}</p>

                      </button> ))}

                    </div>

                  </div>

                  <div className="space-y-4 mb-6">

                    <div className="flex justify-between">

                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ses Seviyesi</label>
                      <span className="text-sm font-mono text-blue-600 dark:text-blue-400">{voiceVolume}%</span>

                    </div>

                    <input type="range" min="0" max="100" value={voiceVolume} onChange={(e) => setVoiceVolume(e.target.value)} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"/>

                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500">

                      <span>Sessiz</span>
                      <span>Orta</span>
                      <span>Yüksek</span>

                    </div>

                  </div>

                  <div className="space-y-4">

                    <div className="flex justify-between">

                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Yanıt Hızı</label>
                      <span className="text-sm font-mono text-purple-600 dark:text-purple-400">{responseSpeed}%</span>

                    </div>

                    <input type="range" min="0" max="100" value={responseSpeed} onChange={(e) => setResponseSpeed(e.target.value)} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"/>

                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500">

                      <span>Yavaş</span>
                      <span>Normal</span>
                      <span>Hızlı</span>

                    </div>

                  </div>

                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">

                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white"><Languages className="text-blue-600 dark:text-blue-500" />Dil Ayarları</h3>

                  <div className="space-y-4">

                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Asistan Dili</label>

                    <div className="relative">

                      <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 appearance-none">

                        <option value="tr">Türkçe (TR)</option>
                        <option value="en">English (US)</option>
                        <option value="de">Deutsch (DE)</option>
                        <option value="fr">Français (FR)</option>
                        <option value="es">Español (ES)</option>

                      </select>

                      <Languages size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

                    </div>

                  </div>

                </div>

              </div>

              <div className="space-y-8">

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">

                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white"><Mic2 className="text-blue-600 dark:text-blue-500" />Ses Girişi</h3>

                  <div className="space-y-4 mb-6">

                    <div className="flex justify-between">

                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Uyandırma Kelimesi Hassasiyeti</label>
                      <span className="text-sm font-mono text-green-600 dark:text-green-400">{wakeWordSensitivity}%</span>

                    </div>

                    <input type="range" min="0" max="100" value={wakeWordSensitivity} onChange={(e) => setWakeWordSensitivity(e.target.value)} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-600"/>
                    <p className="text-xs text-slate-500 dark:text-slate-500">Yüksek hassasiyet: Daha kolay uyandırma, daha fazla yanlış tetikleme</p>

                  </div>

                  <div className="space-y-4">

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">

                      <div className="flex items-center gap-3">

                        <Ear size={18} className="text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sürekli Dinleme</span>

                      </div>

                      <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`w-14 h-7 rounded-full transition-colors relative ${voiceEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}>

                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${voiceEnabled ? 'right-1' : 'left-1'}`}/>

                      </button>

                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">

                      <div className="flex items-center gap-3">

                        <Shield size={18} className="text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Gizlilik Modu</span>

                      </div>

                      <button onClick={() => setPrivacyMode(!privacyMode)} className={`w-14 h-7 rounded-full transition-colors relative ${privacyMode ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${privacyMode ? 'right-1' : 'left-1'}`}/>
                      </button>

                    </div>

                  </div>

                </div>

                {privacyMode && ( <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-3xl p-6">

                  <div className="flex items-start gap-3">

                    <Info className="text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" size={20} />

                    <div>

                      <h4 className="font-bold text-purple-900 dark:text-purple-400 mb-2">Gizlilik Modu Aktif</h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">Bu modda ses kayıtları cihazda işlenir ve buluta gönderilmez. Sadece metin formatında komutlar iletilir.</p>

                    </div>

                  </div>

                </div> )}

              </div>

            </div> )}

            {activeTab === 'personality' && ( <div className="space-y-8">

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">

                <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Asistan Kişiliği</h3>
                  
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                  {personalities.map((p) => ( <button key={p.id} onClick={() => setAiPersonality(p.id)} className={`p-8 rounded-3xl border-2 text-left transition-all hover:scale-105 ${aiPersonality === p.id ? getPersonalityColor(p.color) : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}>

                    <div className={`w-16 h-16 bg-${p.color}-500/10 rounded-2xl flex items-center justify-center mb-4 text-${p.color}-600 dark:text-${p.color}-400`}>{p.icon}</div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{p.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{p.desc}</p>

                  </button> ))}

                </div>

                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">

                  <h4 className="font-bold mb-4 text-slate-900 dark:text-white">Örnek Yanıtlar</h4>

                  <div className="space-y-3">

                    <div className="flex gap-3">

                      <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0"><MessageSquare size={16} className="text-blue-600 dark:text-blue-400" /></div>

                      <div>

                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Siz: "Işıkları aç"</p>

                        <p className="text-sm text-slate-900 dark:text-white font-semibold">

                          {aiPersonality === 'professional' && 'Işıklar açılıyor.'}
                          {aiPersonality === 'friendly' && 'Tamam! Işıkları hemen açıyorum.'}
                          {aiPersonality === 'humorous' && 'Işıkları açtım! Artık karanlıkta değilsiniz 😄'}

                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">

                <div className="flex items-start justify-between mb-6">

                  <div>

                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Otomatik Öğrenme</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Asistan kullanım alışkanlıklarınızdan öğrenir ve zamanla daha kişisel yanıtlar verir.</p>

                  </div>

                  <button onClick={() => setAutoLearning(!autoLearning)} className={`w-14 h-7 rounded-full transition-colors relative ${autoLearning ? 'bg-green-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${autoLearning ? 'right-1' : 'left-1'}`}/>
                  </button>

                </div>

                {autoLearning && ( <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-4">

                  <div className="flex items-start gap-3">

                    <BrainCircuit className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1" size={20} />

                    <div>

                      <h4 className="font-bold text-green-900 dark:text-green-400 mb-1 text-sm">Öğrenme Aktif</h4>
                      <p className="text-xs text-green-700 dark:text-green-300">Son 30 günde 145 yeni kalıp öğrenildi ve yanıt kalitesi %23 iyileşti.</p>

                    </div>

                  </div>

                </div> )}

              </div>

            </div> )}

            {activeTab === 'history' && ( <div className="space-y-8">

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">

                <div className="flex flex-wrap gap-3">

                  <div className="relative flex-1 min-w-[200px]">

                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Komutlarda ara..." className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"/>

                  </div>

                  <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">

                    <Filter size={18} />
                    Filtrele

                  </button>

                </div>

              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">

                <div className="flex justify-between items-center mb-6">

                  <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white"><Clock className="text-blue-600 dark:text-blue-500" />Komut Geçmişi</h3>
                  <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">Tümünü Temizle</button>

                </div>

                <div className="space-y-4">

                  {commandHistory.map((log) => ( <div key={log.id} className={`flex gap-4 p-6 rounded-2xl border-2 transition-all hover:shadow-lg ${log.status === 'success' ? 'bg-green-50 dark:bg-green-500/5 border-green-200 dark:border-green-500/20' : 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20'}`}>

                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${log.status === 'success' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>

                      {log.icon}

                    </div>

                    <div className="flex-1 min-w-0">

                      <p className="text-sm text-slate-600 dark:text-slate-400 italic mb-2">"{log.user}"</p>
                      <p className="text-sm text-slate-900 dark:text-white font-semibold mb-3">{log.ai}</p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">

                        <span className="flex items-center gap-1"><Clock size={12} />{log.time}</span>
                        <span className={`font-mono ${log.confidence > 0.9 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>Güven: %{Math.round(log.confidence * 100)}</span>

                      </div>

                    </div>

                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                      <Share2 size={18} />
                    </button>

                  </div> ))}

                </div>

                <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                  Daha Fazla Yükle
                </button>

              </div>

            </div> )}

            {activeTab === 'advanced' && ( <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              <div className="space-y-8">

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">

                  <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Model Ayarları</h3>

                  <div className="space-y-6">

                    <div>

                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">Sıcaklık (Temperature)</label>
                      <input type="range" className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">Düşük: Daha tutarlı, Yüksek: Daha yaratıcı yanıtlar</p>

                    </div>

                    <div>

                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">Maksimum Token Sayısı</label>
                      <input type="number" defaultValue="2048" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"/>

                    </div>

                    <div>

                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">Top P (Nucleus Sampling)</label>
                      <input type="range" className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"/>

                    </div>

                  </div>

                </div>

                <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-3xl p-6">

                  <div className="flex items-start gap-3">

                    <AlertCircle className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" size={20} />

                    <div>

                      <h4 className="font-bold text-orange-900 dark:text-orange-400 mb-2">Dikkat!</h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300 leading-relaxed">Gelişmiş ayarları değiştirmek asistanın performansını etkileyebilir. Varsayılan değerleri kullanmanız önerilir.</p>

                    </div>

                  </div>

                </div>

              </div>

              <div className="space-y-8">

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">

                  <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Veri Yönetimi</h3>

                  <div className="space-y-4">
  
                    <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
  
                      <div className="flex items-center gap-3">
  
                        <Download className="text-blue-600 dark:text-blue-400" size={18} />
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">Verileri Dışa Aktar</span>
  
                      </div>
  
                      <ChevronRight size={18} className="text-slate-400" />
  
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
  
                      <div className="flex items-center gap-3">
  
                        <Upload className="text-green-600 dark:text-green-400" size={18} />
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">Yedek Yükle</span>
  
                      </div>
  
                      <ChevronRight size={18} className="text-slate-400" />
  
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">

                      <div className="flex items-center gap-3">

                        <Trash2 className="text-red-600 dark:text-red-400" size={18} />
                        <span className="text-sm font-semibold text-red-900 dark:text-red-400">Tüm Verileri Sil</span>

                      </div>

                      <ChevronRight size={18} className="text-red-400" />

                    </button>

                  </div>

                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">

                  <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Sistem Bilgisi</h3>
                    
                  <div className="space-y-3 text-sm">

                    <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">

                      <span className="text-slate-600 dark:text-slate-400">Model Versiyonu</span>
                      <span className="font-mono text-slate-900 dark:text-white">v3.2.1</span>

                    </div>

                    <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">

                      <span className="text-slate-600 dark:text-slate-400">Firmware</span>
                      <span className="font-mono text-slate-900 dark:text-white">ESP-IDF v5.1</span>

                    </div>

                    <div className="flex justify-between py-2">

                      <span className="text-slate-600 dark:text-slate-400">Son Güncelleme</span>
                      <span className="font-mono text-slate-900 dark:text-white">15.01.2025</span>

                    </div>

                  </div>

                </div>

              </div>

            </div> )}

          </div>

        </div>

      </main>

      <style jsx>{`

        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>

    </div>

  );
};

export default AIVoiceConfig;