import React, { useState } from 'react';
import { BookOpen, Terminal, Cpu, Wifi, Zap, ChevronRight, Copy, CheckCircle2, Code, Lightbulb } from 'lucide-react';

const GuideCard = ({ icon: Icon, title, duration, level, children }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-blue-500/30 transition-all group">
    <div className="flex items-center justify-between mb-6">
      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
        <Icon size={24} />
      </div>
      <div className="flex gap-2">
        <span className="text-[10px] uppercase tracking-widest font-bold bg-slate-800 px-2 py-1 rounded-md text-slate-400">{duration}</span>
        <span className="text-[10px] uppercase tracking-widest font-bold bg-blue-500/20 px-2 py-1 rounded-md text-blue-400">{level}</span>
      </div>
    </div>
    <h3 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors">{title}</h3>
    <div className="text-slate-400 text-sm leading-relaxed space-y-4">
      {children}
    </div>
  </div>
);

const Guides = () => {
  const [copied, setCopied] = useState(false);
  const codeSnippet = `// Akıllı Ev MQTT Yapılandırması
#define MQTT_TOPIC "home/livingroom/light"
#define DEVICE_ID "ESP32_S3_01"`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen pb-20">
      {/* Header */}
      <section className="pt-32 pb-16 px-6 border-b border-slate-900 bg-gradient-to-b from-blue-900/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 text-blue-400 font-bold mb-4">
            <BookOpen size={20} /> <span>Dökümantasyon</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Bilgi <span className="text-slate-500">Merkezi</span></h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            ESP32 tabanlı akıllı ev sisteminizi kurmak, optimize etmek ve özelleştirmek için ihtiyacınız olan tüm teknik dökümanlar.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Rehber Kartı 1 */}
          <GuideCard icon={Wifi} title="Hızlı Kurulum" duration="5 DK" level="Başlangıç">
            <p>ESP32-S3 cihazınızı ilk kez ayağa kaldırırken izlemeniz gereken adımlar:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-xs"><ChevronRight size={14} className="mt-0.5 text-blue-500" /> Cihazı USB-C ile bağlayın.</li>
              <li className="flex items-start gap-2 text-xs"><ChevronRight size={14} className="mt-0.5 text-blue-500" /> Dashboard üzerinden 'Flaşla' butonuna basın.</li>
              <li className="flex items-start gap-2 text-xs"><ChevronRight size={14} className="mt-0.5 text-blue-500" /> Wi-Fi bilgilerini portal üzerinden tanımlayın.</li>
            </ul>
          </GuideCard>

          {/* Rehber Kartı 2 */}
          <GuideCard icon={Cpu} title="Donanım Pinout" duration="10 DK" level="Orta">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-[11px] font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-2 mb-2">
                <span>SENSOR</span><span>PIN</span>
              </div>
              <div className="flex justify-between text-blue-400">
                <span>DHT22 (Sıcaklık)</span><span>GPIO 14</span>
              </div>
              <div className="flex justify-between text-green-400">
                <span>Röle (Lamba)</span><span>GPIO 12</span>
              </div>
              <div className="flex justify-between text-purple-400">
                <span>PIR (Hareket)</span><span>GPIO 27</span>
              </div>
            </div>
            <p className="text-xs italic mt-2 text-slate-500">* ESP32-S3 DevKit v1 temel alınmıştır.</p>
          </GuideCard>

          {/* Rehber Kartı 3 */}
          <GuideCard icon={Terminal} title="MQTT Entegrasyonu" duration="15 DK" level="İleri">
            <p>Kendi yazılımınızı sisteme dahil etmek için MQTT broker bilgilerini yapılandırın.</p>
            <div className="relative group/code">
              <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-[11px] font-mono overflow-x-auto overflow-hidden">
                <code>{codeSnippet}</code>
              </pre>
              <button 
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            </div>
          </GuideCard>

        </div>
      </section>

      {/* Detaylı Makale Bölümü */}
      <section className="py-16 px-6 bg-slate-900/20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-16 space-y-12">
            
            <article className="space-y-6">
              <div className="flex items-center gap-4 text-sm font-bold text-blue-500">
                <span className="bg-blue-500/10 px-3 py-1 rounded-full uppercase">Önemli Senaryo</span>
              </div>
              <h2 className="text-3xl font-bold">Güvenlik ve Uçtan Uca Şifreleme</h2>
              <p className="text-slate-400 leading-relaxed">
                ESP32-S3 üzerinde çalışan yazılımımız, sunucu ile kurduğu tüm bağlantılarda <b>AES-256</b> şifreleme katmanı kullanır. 
                Bu, evinizdeki sensör verilerinin dış müdahalelere karşı tamamen korunduğu anlamına gelir.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 flex items-start gap-4">
                  <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-2xl"><Lightbulb size={24}/></div>
                  <div>
                    <h4 className="font-bold mb-1 italic text-sm">İpucu</h4>
                    <p className="text-xs text-slate-500">Daha stabil bağlantı için ESP32 anteninin metal kutu dışında kaldığından emin olun.</p>
                  </div>
                </div>
                <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 flex items-start gap-4">
                  <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl"><Code size={24}/></div>
                  <div>
                    <h4 className="font-bold mb-1 italic text-sm">Update</h4>
                    <p className="text-xs text-slate-500">OTA (Over-the-Air) güncellemeleri sayesinde cihazınızı sökmeden güncelleyebilirsiniz.</p>
                  </div>
                </div>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* Alt Destek Kısmı */}
      <section className="pt-20 text-center px-6">
        <h3 className="text-xl font-bold mb-8">Aradığınızı bulamadınız mı?</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold transition-all text-sm">Video Eğitimleri İzle</button>
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold transition-all text-sm shadow-lg shadow-blue-900/20">Topluluk Forumuna Sor</button>
        </div>
      </section>
    </div>
  );
};

export default Guides;