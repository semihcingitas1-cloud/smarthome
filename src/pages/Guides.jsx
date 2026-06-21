import React, { useState } from 'react';
import { BookOpen, Terminal, Cpu, Wifi, ChevronRight, Copy, CheckCircle2, Code, Lightbulb, Search, Download, Video, MessageCircle, Shield, AlertCircle, PlayCircle, ExternalLink, Github, Book, Rocket, Database, Cloud, Lock, Bluetooth, Activity, Sparkles, Star, Clock, Users, ChevronDown, Filter, ThumbsUp, Eye, ArrowRight } from 'lucide-react';

const GuideCard = ({ icon: Icon, title, duration, level, views, likes, children, featured = false }) => (

  <div className={`bg-slate-900 border rounded-3xl p-8 transition-all group relative overflow-hidden ${featured ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' : 'border-slate-800 hover:border-blue-500/30'}`}>

    {featured && ( <div className="absolute top-0 right-0 bg-gradient-to-br from-blue-500 to-purple-500 px-4 py-2 rounded-bl-2xl text-xs font-bold flex items-center gap-1">

      <Star size={12} fill="currentColor" />
      Öne Çıkan

    </div> )}
    
    <div className="flex items-center justify-between mb-6">

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${featured ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white' : 'bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20'}`}>
        <Icon size={24} />
      </div>

      <div className="flex gap-2">

        <span className="text-[10px] uppercase tracking-widest font-bold bg-slate-800 px-2 py-1 rounded-md text-slate-400 flex items-center gap-1"><Clock size={10} />{duration}</span>
        <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md ${level === 'Başlangıç' ? 'bg-green-500/20 text-green-400' : level === 'Orta' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{level}</span>

      </div>

    </div>

    <h3 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors">{title}</h3>
    <div className="text-slate-400 text-sm leading-relaxed space-y-4 mb-6">{children}</div>

    <div className="flex items-center gap-4 pt-4 border-t border-slate-800 text-xs text-slate-500">

      <div className="flex items-center gap-1">

        <Eye size={14} />
        {views}

      </div>

      <div className="flex items-center gap-1">

        <ThumbsUp size={14} />
        {likes}

      </div>

    </div>

    <button className="mt-4 w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors group/btn">

      Detaylı İncele
      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />

    </button>

  </div>
);

const CodeBlock = ({ code, language = 'cpp' }) => {

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {

    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (

    <div className="relative group/code">

      <div className="absolute top-3 right-3 flex gap-2 z-10">

        <span className="text-xs bg-slate-900 px-2 py-1 rounded-lg text-slate-400 border border-slate-700">{language}</span>

        <button onClick={copyToClipboard} className="p-2 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors border border-slate-700">
          {copied ? ( <CheckCircle2 size={14} className="text-green-500" /> ) : ( <Copy size={14} className="text-slate-400" /> )}
        </button>

      </div>

      <pre className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-[11px] font-mono overflow-x-auto">
        <code className="text-blue-300">{code}</code>
      </pre>

    </div>
  );
};

const VideoTutorial = ({ title, duration, thumbnail, views }) => (

  <div className="group cursor-pointer">

    <div className="relative rounded-2xl overflow-hidden mb-3">

      <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center"><PlayCircle size={48} className="text-white group-hover:scale-110 transition-transform" /></div>
      <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-bold">{duration}</div>

    </div>

    <h4 className="font-semibold text-sm group-hover:text-blue-400 transition-colors mb-1">{title}</h4>
    <p className="text-xs text-slate-500">{views} görüntüleme</p>

  </div>
);

const FAQItem = ({ question, answer }) => {

  const [isOpen, setIsOpen] = useState(false);

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors">

        <span className="font-semibold text-left">{question}</span>
        <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}/>

      </button>

      {isOpen && ( <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-4">
        {answer}
      </div> )}

    </div>
  );
};

const Guides = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [activeLevel, setActiveLevel] = useState('Tümü');

  const categories = [

    { name: 'Tümü', icon: BookOpen, count: 24 },
    { name: 'Kurulum', icon: Rocket, count: 8 },
    { name: 'Donanım', icon: Cpu, count: 6 },
    { name: 'Yazılım', icon: Code, count: 7 },
    { name: 'Güvenlik', icon: Shield, count: 3 },
  ];

  const levels = ['Tümü', 'Başlangıç', 'Orta', 'İleri'];

  const guides = [
    {
      icon: Wifi,
      title: "ESP32 WiFi Kurulumu",
      duration: "5 DK",
      level: "Başlangıç",
      views: "12.5K",
      likes: "340",
      featured: true,
      category: "Kurulum"
    },
    {
      icon: Cpu,
      title: "GPIO Pin Yapılandırması",
      duration: "10 DK",
      level: "Orta",
      views: "8.2K",
      likes: "215",
      category: "Donanım"
    },
    {
      icon: Terminal,
      title: "MQTT Broker Entegrasyonu",
      duration: "15 DK",
      level: "İleri",
      views: "6.7K",
      likes: "189",
      featured: true,
      category: "Yazılım"
    },
    {
      icon: Database,
      title: "Veri Saklama ve Yedekleme",
      duration: "12 DK",
      level: "Orta",
      views: "5.4K",
      likes: "156",
      category: "Yazılım"
    },
    {
      icon: Cloud,
      title: "Cloud Entegrasyon",
      duration: "20 DK",
      level: "İleri",
      views: "4.9K",
      likes: "142",
      category: "Yazılım"
    },
    {
      icon: Bluetooth,
      title: "BLE Sensör Bağlantısı",
      duration: "8 DK",
      level: "Orta",
      views: "7.1K",
      likes: "198",
      category: "Donanım"
    },
  ];

  const codeSnippets = {

    mqtt: `// Akıllı Ev MQTT Yapılandırması

    #include <WiFi.h>
    #include <PubSubClient.h>


    #define MQTT_SERVER "mqtt.homeserver.local"
    #define MQTT_PORT 1883
    #define MQTT_TOPIC "home/livingroom/light"
    #define DEVICE_ID "ESP32_S3_01"

    WiFiClient espClient;
    PubSubClient client(espClient);

    void setup() {

      Serial.begin(115200);
      setupWiFi();
      client.setServer(MQTT_SERVER, MQTT_PORT);
      client.setCallback(callback);
    }`,

    pinout: `// GPIO Pin Tanımlamaları
    #define DHT22_PIN 14      // Sıcaklık/Nem Sensörü
    #define RELAY_PIN 12      // Röle Kontrolü
    #define PIR_PIN 27        // Hareket Sensörü
    #define LED_PIN 2         // Dahili LED
    #define BUTTON_PIN 0      // Boot Butonu

    // Analog Pinler
    #define LDR_PIN 34        // Işık Sensörü (ADC)
    #define SOUND_PIN 35      // Ses Sensörü (ADC)`,

    wifi: `// WiFi Bağlantı Yapılandırması
    #include <WiFi.h>

    const char* ssid = "YourSSID";
    const char* password = "YourPassword";

    void setupWiFi() {

      WiFi.mode(WIFI_STA);
      WiFi.begin(ssid, password);
  
      while (WiFi.status() != WL_CONNECTED) {

      delay(500);
      Serial.print(".");
    }
  
    Serial.println("WiFi Bağlandı!");
    Serial.println(WiFi.localIP());
    }`
  };

  const videoTutorials = [

    { title: "ESP32 İlk Kurulum Rehberi", duration: "12:34", views: "45K" },
    { title: "MQTT ile Cihaz Kontrolü", duration: "18:22", views: "32K" },
    { title: "Sensör Entegrasyonu", duration: "15:47", views: "28K" },
    { title: "OTA Güncelleme Yapımı", duration: "10:15", views: "21K" },
  ];

  const faqs = [

    {
      question: "ESP32 ile kaç cihaz aynı anda kontrol edilebilir?",
      answer: "ESP32, GPIO pinleri ve çeşitli protokoller kullanılarak 30'dan fazla cihazı aynı anda kontrol edebilir. WiFi üzerinden MQTT ile sınırsız cihaz yönetilebilir."
    },
    {
      question: "OTA güncellemesi nasıl çalışır?",
      answer: "Over-The-Air (OTA) güncellemesi, cihazınızı WiFi üzerinden uzaktan güncelleyebilmenizi sağlar. Fiziksel erişim gerektirmez ve sistem çalışırken yapılabilir."
    },
    {
      question: "Güç kesintisinde sistem ne olur?",
      answer: "ESP32 flash belleğinde son ayarları saklar. Güç geldiğinde otomatik olarak son durumuna döner. Ayrıca UPS veya batarya yedekleme sistemi eklenebilir."
    },
    {
      question: "Hangi sensörler destekleniyor?",
      answer: "DHT22, BME280, PIR, ultrasonik, LDR, gaz sensörleri ve daha fazlası desteklenmektedir. I2C, SPI ve analog pinler üzerinden çoğu sensör entegre edilebilir."
    },
  ];

  const resources = [

    {
      icon: Github,
      title: "GitHub Deposu",
      description: "Açık kaynak kodları ve örnekler",
      link: "#",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Book,
      title: "API Dokümantasyonu",
      description: "Detaylı API referansları",
      link: "#",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Video,
      title: "Video Kütüphanesi",
      description: "50+ eğitim videosu",
      link: "#",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: MessageCircle,
      title: "Topluluk Forum",
      description: "Soru-cevap ve tartışmalar",
      link: "#",
      color: "from-green-500 to-emerald-500"
    },
  ];

  const stats = [

    { label: "Toplam Rehber", value: "124", icon: BookOpen },
    { label: "Video İçerik", value: "58", icon: Video },
    { label: "Aktif Kullanıcı", value: "12.5K", icon: Users },
    { label: "Ortalama Puan", value: "4.8", icon: Star },
  ];

  return (

    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">

      <section className="pt-32 pb-16 px-6 border-b relative overflow-hidden border-slate-200 dark:border-slate-900 bg-gradient-to-b from-blue-100/20 to-transparent dark:from-blue-900/10 dark:to-transparent">

        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl bg-blue-500/10 dark:bg-blue-500/5" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl bg-purple-500/10 dark:bg-purple-500/5" />

        <div className="max-w-7xl mx-auto relative z-10">

          <div className="flex items-center gap-3 font-bold mb-4 text-blue-600 dark:text-blue-400">
            <BookOpen size={20} />
            <span>Dokümantasyon & Rehberler</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Bilgi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Merkezi</span></h1>
          <p className="text-lg max-w-2xl mb-8 text-slate-600 dark:text-slate-400">ESP32 tabanlı akıllı ev sisteminizi kurmak, optimize etmek ve özelleştirmek için ihtiyacınız olan tüm teknik dökümanlar.</p>

          <div className="max-w-2xl relative">

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="Rehberlerde ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full border rounded-2xl pl-12 pr-4 py-4 focus:outline-none transition-colors bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500"/>

          </div>

        </div>

      </section>

      <section className="py-12 px-6 border-b border-slate-200 dark:border-slate-900">

        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">

          {stats.map((stat, i) => ( <div key={i} className="border rounded-2xl p-6 text-center transition-all bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500/30 dark:hover:border-blue-500/30">

            <stat.icon className="mx-auto mb-3 text-blue-600 dark:text-blue-400" size={24} />
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>

          </div> ))}

        </div>

      </section>

      <section className="py-8 px-6 border-b sticky top-10 backdrop-blur-md z-30 border-slate-200 dark:border-slate-900 bg-white/95 dark:bg-slate-950/95">

        <div className="max-w-7xl mx-auto">

          <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-2">

            <Filter size={18} className="text-slate-400 flex-shrink-0" />

            {categories.map((cat) => {

              const Icon = cat.icon;

              return (

                <button key={cat.name} onClick={() => setActiveCategory(cat.name)} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${activeCategory === cat.name ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>

                  <Icon size={16} />
                  {cat.name}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50">{cat.count}</span>

                </button>
              );
            })}

          </div>

          <div className="flex items-center gap-2">

            <span className="text-sm mr-2 text-slate-600 dark:text-slate-400">Seviye:</span>

            {levels.map((level) => ( <button key={level} onClick={() => setActiveLevel(level)} className={`px-3 py-1 rounded-lg text-sm transition-all ${activeLevel === level ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>
              {level}
            </button> ))}

          </div>

        </div>

      </section>

      <section className="py-16 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-3xl font-bold mb-2">Hızlı Başlangıç Rehberleri</h2>
              <p className="text-slate-600 dark:text-slate-400">En popüler ve önerilen rehberler</p>

            </div>

            <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
              Tümünü Gör <ArrowRight size={18} />
            </button>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {guides.slice(0, 6).map((guide, i) => ( <GuideCard key={i} icon={guide.icon} title={guide.title} duration={guide.duration} level={guide.level} views={guide.views} likes={guide.likes} featured={guide.featured}>

              <p>ESP32-S3 cihazınızı ilk kez ayağa kaldırırken izlemeniz gereken adımlar:</p>

              <ul className="space-y-2">

                <li className="flex items-start gap-2 text-xs">
                  <ChevronRight size={14} className="mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-500" />
                  Cihazı USB-C ile bilgisayarınıza bağlayın
                </li>

                <li className="flex items-start gap-2 text-xs">
                  <ChevronRight size={14} className="mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-500" />
                  Dashboard üzerinden firmware yükleme işlemini başlatın
                </li>

                <li className="flex items-start gap-2 text-xs">
                  <ChevronRight size={14} className="mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-500" />
                  WiFi yapılandırma portalından ağ bilgilerini girin
                </li>

              </ul>

            </GuideCard> ))}

          </div>

        </div>

      </section>

      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900/20">

        <div className="max-w-7xl mx-auto">

          <div className="flex items-center gap-3 mb-8">

            <Code className="text-blue-600 dark:text-blue-400" size={28} />

            <div>

              <h2 className="text-3xl font-bold">Kod Örnekleri</h2>
              <p className="text-slate-600 dark:text-slate-400">Projelerinizde kullanabileceğiniz hazır kod parçacıkları</p>

            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-8">

            <div>

              <h3 className="font-bold mb-4 flex items-center gap-2"><Terminal size={20} className="text-blue-600 dark:text-blue-400" />MQTT Kurulumu</h3>
              <CodeBlock code={codeSnippets.mqtt} language="cpp" />

            </div>

            <div>

              <h3 className="font-bold mb-4 flex items-center gap-2"><Cpu size={20} className="text-green-600 dark:text-green-400" />GPIO Pin Yapılandırması</h3>
              <CodeBlock code={codeSnippets.pinout} language="cpp" />

            </div>

            <div>

              <h3 className="font-bold mb-4 flex items-center gap-2"><Wifi size={20} className="text-purple-600 dark:text-purple-400" />WiFi Bağlantısı</h3>
              <CodeBlock code={codeSnippets.wifi} language="cpp" />

            </div>

            <div className="border rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-600/10 dark:to-purple-600/10 border-blue-200 dark:border-blue-500/20">

              <Github size={48} className="mb-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-bold mb-2">100+ Kod Örneği</h3>
              <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">GitHub deposunda daha fazla örnek ve proje bulabilirsiniz</p>

              <button className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-105 bg-slate-900 dark:bg-white text-white dark:text-slate-950">
                GitHub'da Görüntüle
                <ExternalLink size={16} />
              </button>

            </div>

          </div>

        </div>

      </section>

      <section className="py-16 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="flex items-center justify-between mb-8">

            <div className="flex items-center gap-3">

              <Video className="text-blue-600 dark:text-blue-400" size={28} />

              <div>

                <h2 className="text-3xl font-bold">Video Eğitimleri</h2>
                <p className="text-slate-600 dark:text-slate-400">Adım adım görsel rehberler</p>

              </div>

            </div>

            <button className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors bg-blue-600 hover:bg-blue-700 text-white">
              <PlayCircle size={18} />
              Tümünü İzle
            </button>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {videoTutorials.map((video, i) => ( <VideoTutorial key={i} {...video} /> ))}

          </div>

        </div>

      </section>

      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900/20">

        <div className="max-w-4xl mx-auto">

          <div className="border rounded-[3rem] p-8 md:p-16 space-y-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">

            <article className="space-y-6">

              <div className="flex items-center gap-4 text-sm font-bold text-blue-600 dark:text-blue-500">

                <span className="px-3 py-1 rounded-full uppercase flex items-center gap-2 bg-blue-100 dark:bg-blue-500/10"><Shield size={14} />Önemli Güvenlik</span>

              </div>

              <h2 className="text-3xl md:text-4xl font-bold">Uçtan Uca Şifreleme ve Güvenlik</h2>

              <p className="leading-relaxed text-slate-600 dark:text-slate-400">

                ESP32-S3 üzerinde çalışan yazılımımız, sunucu ile kurduğu tüm bağlantılarda{' '}
                <span className="font-semibold text-blue-600 dark:text-blue-400">AES-256</span> şifreleme katmanı kullanır.
                Bu, evinizdeki sensör verilerinin dış müdahalelere karşı tamamen korunduğu anlamına gelir.

              </p>

              <div className="border rounded-2xl p-6 space-y-4 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">

                <h3 className="font-bold flex items-center gap-2"><Lock className="text-green-600 dark:text-green-400" size={20} />Güvenlik Özellikleri</h3>

                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">

                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-green-600 dark:text-green-500" />
                    <span>256-bit AES şifreleme ile veri iletimi</span>
                  </li>

                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-green-600 dark:text-green-500" />
                    <span>TLS 1.3 protokolü ile güvenli bağlantı</span>
                  </li>

                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-green-600 dark:text-green-500" />
                    <span>İki faktörlü kimlik doğrulama desteği</span>
                  </li>

                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-green-600 dark:text-green-500" />
                    <span>Otomatik güvenlik güncellemeleri (OTA)</span>
                  </li>

                </ul>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">

                <div className="p-6 border rounded-3xl flex items-start gap-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-500/10 dark:to-orange-500/10 border-yellow-200 dark:border-yellow-500/20">

                  <div className="p-3 rounded-2xl bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500"><Lightbulb size={24} /></div>

                  <div>

                    <h4 className="font-bold mb-2 text-sm">Pro İpucu</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Daha stabil WiFi bağlantısı için ESP32 anteninin metal kutu dışında kaldığından emin olun. Sinyal gücünü artırmak için harici anten kullanabilirsiniz.</p>

                  </div>

                </div>

                <div className="p-6 border rounded-3xl flex items-start gap-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border-indigo-200 dark:border-indigo-500/20">

                  <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-500"><Sparkles size={24} /></div>

                  <div>

                    <h4 className="font-bold mb-2 text-sm">Yeni Özellik</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">OTA (Over-the-Air) güncellemeleri sayesinde cihazınızı sökmeden, WiFi üzerinden uzaktan güncelleyebilirsiniz.</p>

                  </div>

                </div>

                <div className="p-6 border rounded-3xl flex items-start gap-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border-green-200 dark:border-green-500/20">

                  <div className="p-3 rounded-2xl bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500"><Activity size={24} /></div>

                  <div>

                    <h4 className="font-bold mb-2 text-sm">Performans</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">ESP32-S3'ün çift çekirdekli işlemcisi sayesinde aynı anda birden fazla sensörü yönetebilir ve hızlı yanıt süreleri elde edebilirsiniz.</p>

                  </div>

                </div>

                <div className="p-6 border rounded-3xl flex items-start gap-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-500/10 dark:to-pink-500/10 border-red-200 dark:border-red-500/20">

                  <div className="p-3 rounded-2xl bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500"><AlertCircle size={24} /></div>

                  <div>

                    <h4 className="font-bold mb-2 text-sm">Uyarı</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Güç kaynaklarını doğru şekilde bağladığınızdan emin olun. Yanlış voltaj cihaza kalıcı hasar verebilir.</p>

                  </div>

                </div>

              </div>

              <div className="pt-6">

                <h3 className="font-bold mb-4 flex items-center gap-2"><Cpu className="text-purple-600 dark:text-purple-400" size={20} />Donanım Pin Şeması</h3>

                <div className="rounded-2xl border overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">

                  <div className="grid grid-cols-3 gap-px bg-slate-300 dark:bg-slate-800">

                    <div className="p-3 font-bold text-sm bg-slate-100 dark:bg-slate-900">Sensör/Cihaz</div>
                    <div className="p-3 font-bold text-sm bg-slate-100 dark:bg-slate-900">GPIO Pin</div>
                    <div className="p-3 font-bold text-sm bg-slate-100 dark:bg-slate-900">Özellik</div>

                    <div className="p-3 text-sm bg-white dark:bg-slate-950">DHT22 (Sıcaklık)</div>
                    <div className="p-3 font-mono text-sm bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400">GPIO 14</div>
                    <div className="p-3 text-xs bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400">Digital Input</div>

                    <div className="p-3 text-sm bg-white dark:bg-slate-950">Röle (Lamba)</div>
                    <div className="p-3 font-mono text-sm bg-white dark:bg-slate-950 text-green-600 dark:text-green-400">GPIO 12</div>
                    <div className="p-3 text-xs bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400">Digital Output</div>

                    <div className="p-3 text-sm bg-white dark:bg-slate-950">PIR (Hareket)</div>
                    <div className="p-3 font-mono text-sm bg-white dark:bg-slate-950 text-purple-600 dark:text-purple-400">GPIO 27</div>
                    <div className="p-3 text-xs bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400">Digital Input</div>

                    <div className="p-3 text-sm bg-white dark:bg-slate-950">LDR (Işık)</div>
                    <div className="p-3 font-mono text-sm bg-white dark:bg-slate-950 text-orange-600 dark:text-orange-400">GPIO 34</div>
                    <div className="p-3 text-xs bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400">Analog Input</div>

                  </div>

                </div>

                <p className="text-xs italic mt-3 text-slate-500 dark:text-slate-500">* ESP32-S3 DevKit v1 referans alınmıştır. Farklı modellerde pin numaraları değişebilir.</p>

              </div>

            </article>

          </div>

        </div>

      </section>

      <section className="py-16 px-6">

        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12">

            <h2 className="text-3xl font-bold mb-4">Sıkça Sorulan Sorular</h2>
            <p className="text-slate-600 dark:text-slate-400">En çok merak edilen konular</p>

          </div>

          <div className="space-y-4">

            {faqs.map((faq, i) => ( <FAQItem key={i} {...faq} /> ))}

          </div>

        </div>

      </section>

      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900/20">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-12">

            <h2 className="text-3xl font-bold mb-4">Ek Kaynaklar</h2>
            <p className="text-slate-600 dark:text-slate-400">Daha fazla bilgi ve destek için</p>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {resources.map((resource, i) => ( <a key={i} href={resource.link} className="group border rounded-3xl p-8 text-center transition-all hover:scale-105 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50">

              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform bg-gradient-to-br ${resource.color}`}>
                <resource.icon size={28} />
              </div>

              <h3 className="font-bold mb-2 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">{resource.title}</h3>
              <p className="text-sm mb-4 text-slate-600 dark:text-slate-400">{resource.description}</p>
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">Keşfet <ExternalLink size={14} /></div>

            </a> ))}

          </div>

        </div>

      </section>

      <section className="pt-20 pb-24 px-6">

        <div className="max-w-6xl mx-auto border rounded-3xl p-12 text-center relative overflow-hidden bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-600/20 dark:to-purple-600/20 border-blue-300 dark:border-blue-500/30">

          <div className="absolute inset-0 bg-grid-pattern opacity-5" />

          <div className="relative z-10">

            <MessageCircle className="mx-auto mb-6 text-blue-600 dark:text-blue-400" size={48} />
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Aradığınızı Bulamadınız mı?</h3>
            <p className="mb-8 max-w-2xl mx-auto text-slate-600 dark:text-slate-400">Topluluğumuz size yardımcı olmaya hazır. Sorularınızı forum'da sorun veya dokümantasyon ekibimizle iletişime geçin.</p>
        
            <div className="flex flex-wrap justify-center gap-4">

              <button className="px-8 py-4 rounded-2xl font-bold transition-all text-sm shadow-lg flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-blue-300/20 dark:shadow-blue-900/20">
                <MessageCircle size={18} />
                Topluluk Forumu
              </button>

              <button className="px-8 py-4 rounded-2xl font-bold transition-all text-sm flex items-center gap-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white">
                <Video size={18} />
                Video Eğitimleri
              </button>

              <button className="px-8 py-4 rounded-2xl font-bold transition-all text-sm flex items-center gap-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white">
                <Download size={18} />
                PDF İndir
              </button>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Guides;