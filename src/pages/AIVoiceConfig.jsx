import React, { useState } from 'react';
// Sidebar bileşenini içe aktarıyoruz
import Sidebar from '../layout/Sidebar';
import { Mic, BrainCircuit, MessageSquare, Settings2, Radio, Volume2, Sparkles, Play, Save, Database, Ear, Languages, Cpu, Bot } from 'lucide-react';

const AIVoiceConfig = () => {
  const [aiPersonality, setAiPersonality] = useState('professional');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  return (
    <div className="flex bg-slate-950 min-h-screen">
      {/* Yan Menü */}
      <Sidebar />

      {/* Ana İçerik Alanı */}
      <main className="flex-1 lg:ml-0 overflow-x-hidden">
        <div className="bg-slate-950 text-white min-h-screen p-6 lg:p-12 animate-in fade-in duration-700">
          
          {/* Header Kısmı */}
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/20">
                <Sparkles size={14} /> DeepSeek-V3 Engine Aktif
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">AI & Sesli Asistan</h1>
              <p className="text-slate-400">Evinizin zekasını ve konuşma tarzını buradan kişiselleştirin.</p>
            </div>
            
            <div className="flex gap-3">
              <button className="bg-slate-900 border border-slate-800 hover:border-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all">
                <Database size={18} /> Belleği Temizle
              </button>
              <button className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all">
                <Save size={18} /> Yapılandırmayı Kaydet
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Sol Kolon: Model Seçimi ve Durum */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Ana AI Durum Kartı */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BrainCircuit size={120} />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-32 h-32 bg-blue-600/20 rounded-full flex items-center justify-center border border-blue-500/30">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(37,99,235,0.4)]">
                      <Mic size={40} className="text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left space-y-4">
                    <h2 className="text-2xl font-bold text-white italic tracking-wide">"Hey Evim, mutfak ışıklarını yak..."</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800">
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Gecikme (Latency)</p>
                        <p className="text-sm font-mono text-green-400">124ms</p>
                      </div>
                      <div className="bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800">
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Model</p>
                        <p className="text-sm font-mono text-blue-400">DeepSeek-Chat</p>
                      </div>
                      <div className="bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800">
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Donanım</p>
                        <p className="text-sm font-mono text-purple-400">ESP32-S3</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Kişilik Ayarları */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Bot className="text-blue-500" /> Asistan Kişiliği
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'professional', name: 'Profesyonel', desc: 'Kısa, öz ve net yanıtlar.' },
                    { id: 'friendly', name: 'Samimi', desc: 'Daha sıcak ve insansı bir dil.' },
                    { id: 'humorous', name: 'Esprili', desc: 'Şakacı ve eğlenceli etkileşim.' }
                  ].map((p) => (
                    <button 
                      key={p.id}
                      onClick={() => setAiPersonality(p.id)}
                      className={`p-6 rounded-3xl border-2 text-left transition-all ${aiPersonality === p.id ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800 hover:border-slate-700'}`}
                    >
                      <h4 className="font-bold text-white mb-1">{p.name}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gelişmiş Komut Geçmişi (Log) */}
              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <MessageSquare className="text-blue-500" /> Son Komut Analizi
                  </h3>
                  <button className="text-xs font-bold text-blue-500 hover:underline">Tümünü Gör</button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { user: "Kombiyi 23 derece yap.", ai: "Anlaşıldı, ısı ayarlandı.", conf: "0.98", icon: <Volume2 /> },
                    { user: "Salonda bir film izleyeceğiz.", ai: "Sinema modu aktif, ışıklar kısılıyor.", conf: "0.94", icon: <Sparkles /> }
                  ].map((log, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-950/40 border border-slate-800/50">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400">
                        {log.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-400 italic">"{log.user}"</p>
                        <p className="text-sm text-white font-bold mt-1">{log.ai}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Güven Oranı</p>
                        <p className="text-xs text-green-400 font-mono">%{parseFloat(log.conf)*100}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sağ Kolon: Hızlı Ayarlar */}
            <div className="space-y-8">
              
              {/* Ses Ayarları Kartı */}
              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Settings2 className="text-blue-500" /> Ses Ayarları
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-800 rounded-lg text-slate-400"><Ear size={18} /></div>
                      <span className="text-sm font-medium">Sürekli Dinleme</span>
                    </div>
                    <button 
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${voiceEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${voiceEnabled ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Girdi Hassasiyeti</label>
                    <input type="range" className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Asistan Dili</label>
                    <div className="relative">
                      <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 appearance-none">
                        <option>Türkçe (TR)</option>
                        <option>English (US)</option>
                        <option>Deutsch (DE)</option>
                      </select>
                      <Languages size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Donanım Bilgisi Kartı */}
              <div className="bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/10 rounded-[2.5rem] p-8">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Cpu className="text-blue-500" /> Donanım Uç Birimi
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Sinyal işleme (DSP) ESP32-S3 üzerinde yerel olarak yapılır, sadece anonim metin verisi buluta iletilir.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Wi-Fi Sinyal</span>
                    <span className="text-blue-400 font-bold">-42 dBm</span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full">
                    <div className="h-full bg-blue-500 w-[85%] rounded-full"></div>
                  </div>
                </div>
                <button className="w-full mt-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2">
                  <Radio size={14} className="animate-pulse text-red-500" /> Canlı Ses Akışını Test Et
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIVoiceConfig;