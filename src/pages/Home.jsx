import React from 'react';
import { ShieldCheck, Zap, Smartphone, Cpu, ArrowRight, CheckCircle, Layers, MousePointerClick , Globe, Database, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {

  return (

    <div className="bg-slate-950 text-white overflow-hidden">
      
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-32 px-6">

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">

          <div className="flex-1 text-center lg:text-left space-y-6">

            <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-500/20">
              <Zap size={16} /> Geleceğin Teknolojisi Bugün Burada
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Evinizi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Akıllı Bir Merkeze</span> Dönüştürün</h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0">ESP32-S3 mimarisi üzerine kurulu, düşük gecikmeli ve uçtan uca şifreli ev otomasyon sistemi ile kontrol tamamen sizde.</p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">

              <Link to="/auth" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20">
                Hemen Başlayın <ArrowRight size={18} />
              </Link>
              <button className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-bold transition-all">Demoyu İzle</button>

            </div>

          </div>

          <div className="flex-1 relative">

            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-3xl opacity-20"></div>

            <div className="relative bg-slate-900 border border-slate-800 p-2 rounded-[2.5rem] shadow-2xl">

              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop" alt="Smart Home Dashboard" className="rounded-[2rem] w-full h-auto object-cover"/>

            </div>

          </div>

        </div>

      </section>

      <section className="py-24 px-6 bg-slate-900/30">

        <div className="max-w-7xl mx-auto text-center mb-16">

          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tek Panel, Sınırsız Çözüm</h2>
          <p className="text-slate-400">Tüm cihazlarınızı tek bir merkezden yönetmeniz için tasarlandı.</p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              icon: <ShieldCheck size={32} className="text-green-500" />,
              title: "Tam Güvenlik",
              desc: "Gelişmiş şifreleme ve anlık bildirimlerle eviniz 7/24 koruma altında."
            },
            {
              icon: <Layers size={32} className="text-blue-500" />,
              title: "Modüler Yapı",
              desc: "Kendi sensörlerinizi ekleyin veya mevcut otomasyonları dakikalar içinde güncelleyin."
            },
            {
              icon: <Smartphone size={32} className="text-purple-500" />,
              title: "Uzaktan Erişim",
              desc: "Dünyanın neresinde olursanız olun, mobil uygulama üzerinden kontrol sağlayın."
            }
          ].map((feature, i) => ( <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-blue-500/50 transition-all group">

            <div className="mb-6 bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>

            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>

          </div> ))}

        </div>

      </section>

      <section className="py-24 px-6 border-y border-slate-900">

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">

          {[

            { icon: <Cpu />, title: "ESP32 Entegrasyonu", desc: "Donanım katmanında düşük güç tüketimi." },
            { icon: <Globe />, title: "MQTT Protocol", desc: "Global ölçekte anlık veri senkronizasyonu." },
            { icon: <Database />, title: "Veri Analizi", desc: "Geçmişe dönük enerji ve sensör logları." },
            { icon: <Code2 />, title: "Açık API", desc: "Kendi otomasyon senaryolarını yazma özgürlüğü." }

          ].map((step, i) => ( <div key={i} className="space-y-4">
            <div className="text-blue-500">{step.icon}</div>
            <h3 className="font-bold text-lg">{step.title}</h3>
            <p className="text-sm text-slate-500">{step.desc}</p>
          </div> ))}

        </div>

      </section>

      <section className="py-24 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">

            <div className="max-w-xl">

              <h2 className="text-4xl font-bold mb-4">Her Şey Tek Bir Panelin Altında</h2>
              <p className="text-slate-400">Karmaşıklığı ortadan kaldırıyoruz. Karmaşık donanım kodlarını sizin için kullanıcı dostu arayüzlere dönüştürüyoruz.</p>

            </div>

            <button className="text-blue-500 font-bold flex items-center gap-2 hover:gap-3 transition-all">Tüm Özellikleri Keşfet <ArrowRight size={20} /></button>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="p-1 rounded-[2rem] bg-gradient-to-br from-green-800 to-transparent">

              <div className="bg-slate-950 p-8 rounded-[1.9rem] h-full space-y-6">

                <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>

                <h3 className="text-xl font-bold">Gelişmiş Güvenlik</h3>

                <ul className="space-y-3 text-sm text-slate-500">

                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Hareket algılama ve anlık bildirim</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Akıllı kilit sistemleri</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> IP kamera entegrasyonu</li>

                </ul>

              </div>

            </div>

            <div className="p-1 rounded-[2rem] bg-gradient-to-br from-blue-600/50 to-transparent">

              <div className="bg-slate-950 p-8 rounded-[1.9rem] h-full space-y-6 border border-blue-500/10">

                <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                  <Zap size={24} />
                </div>

                <h3 className="text-xl font-bold">Enerji Optimizasyonu</h3>

                <ul className="space-y-3 text-sm text-slate-500">

                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500" /> Gerçek zamanlı watt takibi</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500" /> Otomatik ışık ve klima kontrolü</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500" /> Aylık tasarruf raporları</li>

                </ul>

              </div>

            </div>

            <div className="p-1 rounded-[2rem] bg-gradient-to-br from-purple-600/50 to-transparent">

              <div className="bg-slate-950 p-8 rounded-[1.9rem] h-full space-y-6">

                <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center">
                  <Smartphone size={24} />
                </div>

                <h3 className="text-xl font-bold">Mobil Senaryolar</h3>

                <ul className="space-y-3 text-sm text-slate-500">

                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-purple-500" /> Eve gelmeden ısıtma başlatma</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-purple-500" /> Tek tıkla "Gece Modu"</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-purple-500" /> Sesli asistan uyumluluğu</li>

                </ul>

              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="py-24 px-6">

        <div className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/20 to-slate-900 border border-blue-500/10 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12">

          <div className="flex-1 space-y-6">

            <h2 className="text-3xl font-bold italic flex items-center gap-3"><Cpu className="text-blue-500" /> ESP32 Core™ Teknolojisi</h2>
            <p className="text-slate-300 leading-relaxed">Donanım tarafında ESP32-S3 ve Node.js backend mimarisi kullanarak en düşük enerji tüketimiyle en yüksek performansı hedefledik. </p>

            <ul className="space-y-4">

              {['G33 Auto-Calibration Desteği', 'Gerçek Zamanlı MQTT Veri Akışı', 'Uç Cihazlarda Mesh Network'].map((item) => ( <li key={item} className="flex items-center gap-3 text-sm font-medium">

                <CheckCircle size={18} className="text-blue-500" /> {item}

              </li> ))}

            </ul>

          </div>

          <div className="flex-1 grid grid-cols-2 gap-4">

            <div className="bg-slate-800/50 p-6 rounded-3xl text-center">

              <p className="text-3xl font-bold text-blue-500 mb-1">12ms</p>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Tepki Süresi</p>

            </div>

            <div className="bg-slate-800/50 p-6 rounded-3xl text-center">

              <p className="text-3xl font-bold text-green-500 mb-1">%100</p>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Yerli Yazılım</p>

            </div>

            <div className="bg-slate-800/50 p-6 rounded-3xl text-center col-span-2">

              <p className="text-3xl font-bold text-purple-500 mb-1">ESP32-S3</p>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Optimize İşlemci Gücü</p>

            </div>

          </div>

        </div>

      </section>

      <section className="py-20 text-center px-6">

        <div className="max-w-2xl mx-auto space-y-8">

          <h2 className="text-3xl md:text-5xl font-bold">Evinizi Konuşturmaya Hazır Mısınız?</h2>
          <p className="text-slate-400">Hemen ücretsiz bir hesap oluşturun ve ilk cihazınızı bağlayın.</p>
          <button className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl font-extrabold hover:bg-blue-500 hover:text-white transition-all"><MousePointerClick size={20} /> Kuruluma Başla</button>

        </div>

      </section>

    </div>
  );
};

export default Home;