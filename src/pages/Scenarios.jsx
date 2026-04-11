import React from 'react';
import { Play, Moon, Sun, ShieldAlert, Thermometer, Wind, Coffee, Home, Timer, Sparkles, ArrowRight } from 'lucide-react';

const ScenarioCard = ({ title, icon: Icon, color, condition, action, description }) => (
  <div className="group relative bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 hover:border-blue-500/50 transition-all duration-500 overflow-hidden">
    {/* Arka Plan Glow Efekti */}
    <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity ${color}`}></div>
    
    <div className="relative z-10">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${color.replace('bg-', 'text-').replace('blur-3xl', '')} bg-white/5 border border-white/10`}>
        <Icon size={28} />
      </div>

      <h3 className="text-2xl font-bold mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-6">{description}</p>

      <div className="space-y-3 border-t border-slate-800 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">EĞER: {condition}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <p className="text-xs font-mono text-slate-200 uppercase tracking-wider">EYLEM: {action}</p>
        </div>
      </div>

      <button className="mt-8 w-full py-3 bg-slate-800 group-hover:bg-blue-600 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
        Senaryoyu Aktif Et <Play size={14} fill="currentColor" />
      </button>
    </div>
  </div>
);

const Scenarios = () => {
  const scenarios = [
    {
      title: "Sinema Modu",
      icon: Moon,
      color: "bg-purple-600",
      description: "Tek tıkla oturma odasını kişisel bir sinemaya dönüştürün. Işıklar ve cihazlar senkronize çalışır.",
      condition: "TV Açıldığında",
      action: "Işıkları %10 yap ve Perdeleri Kapat"
    },
    {
      title: "Akıllı Tasarruf",
      icon: Sun,
      color: "bg-yellow-500",
      description: "Güneş ışığından maksimum faydalanarak gereksiz enerji tüketiminin önüne geçin.",
      condition: "Güneş Doğduğunda",
      action: "Tüm Dış Aydınlatmaları Kapat"
    },
    {
      title: "Hırsız Savar",
      icon: ShieldAlert,
      color: "bg-red-600",
      description: "Siz evde yokken beklenmedik bir hareket algılandığında evinizi korumaya alır.",
      condition: "Hareket Algılandığında (Dışarıda)",
      action: "Alarmı Çal ve Bildirim Gönder"
    },
    {
      title: "Konforlu Uyku",
      icon: Thermometer,
      color: "bg-blue-500",
      description: "Siz uyurken ortam sıcaklığını takip eder ve ideal seviyede tutar.",
      condition: "Sıcaklık > 26°C (Gece)",
      action: "Klimayı Uyku Modunda Çalıştır"
    },
    {
      title: "Günaydın Kahvesi",
      icon: Coffee,
      color: "bg-orange-600",
      description: "Siz yataktan kalkmadan güne hazır olun. Mutfak cihazlarınız sizinle uyanır.",
      condition: "Saat 07:30 Olduğunda",
      action: "Kahve Makinesini Başlat"
    },
    {
      title: "Eve Dönüş",
      icon: Home,
      color: "bg-indigo-500",
      description: "Siz eve yaklaşırken eviniz sizi en sıcak haliyle karşılamaya hazırlanır.",
      condition: "Konum < 500m (Eve Yaklaşınca)",
      action: "Kombi ve Giriş Işıklarını Aç"
    }
  ];

  return (
    <div className="bg-slate-950 text-white min-h-screen pb-20">
      {/* Üst Kısım */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-sm font-bold border border-indigo-500/20">
            <Sparkles size={16} /> Otomasyon Gücü
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Akıllı Senaryolar</h1>
          <p className="text-slate-400 text-lg">
            Cihazlarınızın birbiriyle konuşmasını sağlayın. Karmaşık işlemleri tek bir kurala bağlayarak hayatınızı kolaylaştırın.
          </p>
        </div>
      </section>

      {/* Kartlar Grid */}
      <section className="px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scenarios.map((s, idx) => (
            <ScenarioCard key={idx} {...s} />
          ))}
        </div>
      </section>

      {/* Özel Senaryo Oluşturma CTA */}
      <section className="mt-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-blue-900/20">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold italic">Hayal Gücünüzle Sınırlı</h2>
            <p className="text-blue-100 opacity-80 max-w-md">
              Mevcut senaryolar yetmedi mi? Sürükle-bırak editörümüz ile kendi özel otomasyon kurallarınızı saniyeler içinde oluşturun.
            </p>
          </div>
          <button className="whitespace-nowrap bg-white text-blue-700 px-10 py-5 rounded-2xl font-black hover:scale-105 transition-transform flex items-center gap-3">
            Kendi Senaryonu Yaz <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Alt Bilgi */}
      <section className="py-20 text-center">
        <div className="flex justify-center gap-12 text-slate-500">
          <div className="flex flex-col items-center gap-2">
            <Timer size={24} />
            <span className="text-[10px] uppercase font-bold tracking-widest">Düşük Gecikme</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-green-500">
            <Wind size={24} />
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Yüksek Verimlilik</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Scenarios;