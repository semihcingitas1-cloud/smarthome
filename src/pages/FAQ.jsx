import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, Cpu, ShieldCheck, Zap, MessageCircle, Search, BookOpen, Video, Mail, Phone, ExternalLink, ChevronRight, CheckCircle2, AlertCircle, Clock, Users, Star, TrendingUp, FileText, Headphones, Send, ArrowRight, Sparkles, Shield, Code, Database, Wifi, Lock, Globe, Download, Play, X } from 'lucide-react';

const FAQItem = ({ question, answer, isPopular }) => {

  const [isOpen, setIsOpen] = useState(false);

  return (

    <div className="border-b border-gray-200 dark:border-slate-800 last:border-0 transition-all group">

      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-6 flex items-start justify-between text-left focus:outline-none">

        <div className="flex-1 pr-4">

          <div className="flex items-center gap-2 mb-1">

            <span className={`text-lg font-semibold transition-colors ${isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white'}`}>{question}</span>

            {isPopular && ( <span className="bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">

              <TrendingUp size={10} />
              Popüler

            </span> )}

          </div>

        </div>

        <div className={`flex-shrink-0 ml-4 transition-all duration-300 ${isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300'}`}>
          {isOpen ? <Minus size={22} /> : <Plus size={22} />}
        </div>

      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>

        <p className="text-gray-600 dark:text-slate-400 leading-relaxed pl-1">{answer}</p>

      </div>

    </div>
  );
};

const CategoryTab = ({ icon: Icon, label, isActive, onClick, count }) => (

  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 shadow-md dark:shadow-none'}`}>

    <Icon size={18} />
    <span className="font-medium">{label}</span>
    {count && ( <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-300'}`}>{count}</span> )}

  </button>
);

const FAQ = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  const categories = [

    { name: 'Tümü', icon: HelpCircle, count: 15 },
    { name: 'Başlangıç', icon: Zap, count: 5 },
    { name: 'Donanım', icon: Cpu, count: 4 },
    { name: 'Güvenlik', icon: Shield, count: 3 },
    { name: 'API', icon: Code, count: 3 },
  ];

  const faqs = [

    {
      category: 'Başlangıç',
      question: "Sistemi kullanmak için teknik bilgiye ihtiyacım var mı?",
      answer: "Hayır. Arayüzümüz, teknik detaylarla uğraşmadan cihazlarınızı yönetebilmeniz için tasarlandı. ESP32 tabanlı cihazınızı ağınıza bağladıktan sonra panel üzerinden otomatik olarak tanınacaktır. Kurulum sihirbazımız size adım adım rehberlik eder.",
      isPopular: true
    },
    {
      category: 'Donanım',
      question: "Hangi donanımları destekliyor?",
      answer: "Öncelikle ESP32-S3 ve ESP32-C6 serisi işlemcileri destekliyoruz. Standart röle modülleri, DHT11/22 sıcaklık sensörleri, MQ serisi gaz sensörleri, PIR hareket sensörleri ve RGB LED şeritleri ile tam uyumlu çalışmaktadır. Detaylı donanım listesi için dokümantasyonumuza göz atabilirsiniz.",
      isPopular: true
    },
    {
      category: 'Güvenlik',
      question: "Verilerim ne kadar güvende?",
      answer: "Verileriniz uçtan uca AES-256 şifreleme ile korunur. MQTT protokolü üzerinden yapılan tüm iletişimler TLS/SSL sertifikalarıyla zırhlandırılmıştır. Ayrıca iki faktörlü kimlik doğrulama (2FA) desteği sunuyoruz. Hiçbir veri üçüncü taraflarla paylaşılmaz.",
      isPopular: true
    },
    {
      category: 'Başlangıç',
      question: "İnternet kesildiğinde sistem çalışmaya devam eder mi?",
      answer: "Evet. Yerel ağ (LAN) üzerinden kontrol özelliğimiz sayesinde internetiniz olmasa bile ev içindeki Wi-Fi ağınız üzerinden cihazlarınıza komut gönderebilirsiniz. Kritik otomasyon kuralları cihaz üzerinde çalışmaya devam eder.",
      isPopular: false
    },
    {
      category: 'API',
      question: "Açık API desteği nasıl çalışıyor?",
      answer: "Geliştirici panelinden alacağınız API anahtarı ile kendi Python, Node.js scriptlerinizi veya mobil uygulamalarınızı sisteme entegre edebilir, RESTful API ve WebSocket üzerinden veri çekebilirsiniz. Webhook desteği de mevcuttur.",
      isPopular: false
    },
    {
      category: 'Donanım',
      question: "Kaç cihaz bağlayabilirim?",
      answer: "Standart plan ile 50 cihaza kadar bağlantı yapabilirsiniz. Pro plan ile bu limit 200'e, Enterprise plan ile sınırsız cihaz bağlantısı yapabilirsiniz. Her cihaz için ayrı izleme ve kontrol imkanı sunuyoruz.",
      isPopular: false
    },
    {
      category: 'Güvenlik',
      question: "İki faktörlü kimlik doğrulama nasıl aktif edilir?",
      answer: "Hesap ayarlarından 'Güvenlik' bölümüne giderek Google Authenticator veya SMS ile 2FA'yı aktif edebilirsiniz. Yedek kodlarınızı mutlaka güvenli bir yere kaydedin.",
      isPopular: false
    },
    {
      category: 'Başlangıç',
      question: "Mobil uygulama var mı?",
      answer: "Evet! iOS ve Android için native uygulamalarımız mevcut. App Store ve Google Play'den 'Smart Home Controller' arayarak indirebilirsiniz. Aynı hesap ile web ve mobil senkronize çalışır.",
      isPopular: true
    },
    {
      category: 'API',
      question: "Webhook ile nasıl bildirim alabilirim?",
      answer: "Otomasyon panelinden webhook URL'nizi tanımlayarak belirli olaylarda (sensör tetikleme, cihaz durumu değişimi vb.) kendi sunucunuza POST isteği göndertebilirsiniz. JSON formatında detaylı veri iletilir.",
      isPopular: false
    },
    {
      category: 'Donanım',
      question: "Enerji tüketimi takibi yapabiliyor muyum?",
      answer: "Evet. PZEM-004T gibi enerji monitörü sensörlerini entegre ederek gerçek zamanlı enerji tüketimi, voltaj ve akım değerlerini izleyebilir, detaylı raporlar alabilirsiniz.",
      isPopular: false
    },
    {
      category: 'Güvenlik',
      question: "Veri yedekleme nasıl yapılır?",
      answer: "Sistem ayarları ve otomasyon kurallarınız otomatik olarak cloud'a yedeklenir. İsterseniz manuel olarak JSON formatında export alıp yerel olarak saklayabilirsiniz. Yedekler şifreli olarak saklanır.",
      isPopular: false
    },
    {
      category: 'Başlangıç',
      question: "Sesli asistan desteği var mı?",
      answer: "Google Assistant, Amazon Alexa ve Apple HomeKit ile tam entegrasyon sunuyoruz. 'Alexa, salondaki ışıkları kapat' gibi komutlarla cihazlarınızı kontrol edebilirsiniz.",
      isPopular: true
    },
    {
      category: 'API',
      question: "MQTT broker bilgilerine nasıl erişirim?",
      answer: "Geliştirici ayarlarından MQTT broker adresi, port, kullanıcı adı ve şifre bilgilerinize erişebilirsiniz. TLS/SSL sertifikalarını da aynı bölümden indirebilirsiniz.",
      isPopular: false
    },
    {
      category: 'Donanım',
      question: "OTA (Over-The-Air) güncelleme destekliyor mu?",
      answer: "Evet! Firmware güncellemelerini WiFi üzerinden uzaktan yapabilirsiniz. Cihazı sökmeden, yeni özellikleri ve güvenlik yamalarını yükleyebilirsiniz. Otomatik güncelleme seçeneği de mevcut.",
      isPopular: false
    },
    {
      category: 'Başlangıç',
      question: "Ücretsiz plan sınırlamaları nelerdir?",
      answer: "Ücretsiz plan ile 5 cihaz, temel otomasyon kuralları ve 30 günlük veri geçmişi kullanabilirsiniz. Ücretli planlarda cihaz sayısı, gelişmiş özellikler ve sınırsız veri geçmişi sunulmaktadır.",
      isPopular: false
    }
  ];

  const stats = [

    { label: 'Toplam Soru', value: '150+', icon: HelpCircle },
    { label: 'Ortalama Yanıt Süresi', value: '2 saat', icon: Clock },
    { label: 'Memnuniyet Oranı', value: '%98', icon: Star },
    { label: 'Aktif Kullanıcı', value: '50K+', icon: Users },
  ];

  const supportChannels = [

    {
      icon: MessageCircle,
      title: 'Canlı Destek',
      description: 'Anlık destek için chat başlatın',
      action: 'Sohbet Başlat',
      color: 'from-blue-500 to-cyan-500',
      available: '7/24 Aktif'
    },
    {
      icon: Mail,
      title: 'E-posta Destek',
      description: 'Detaylı sorularınız için',
      action: 'E-posta Gönder',
      color: 'from-purple-500 to-pink-500',
      available: '24 saat içinde yanıt'
    },
    {
      icon: Phone,
      title: 'Telefon Destek',
      description: 'Acil durumlar için arayın',
      action: '+90 850 123 45 67',
      color: 'from-green-500 to-emerald-500',
      available: '09:00 - 18:00'
    },
    {
      icon: Video,
      title: 'Video Görüşme',
      description: 'Uzaktan kurulum desteği',
      action: 'Randevu Al',
      color: 'from-orange-500 to-red-500',
      available: 'Randevu ile'
    },
  ];

  const resources = [

    {
      icon: BookOpen,
      title: 'Dokümantasyon',
      description: 'Detaylı teknik rehberler',
      count: '50+ Makale',
      link: '/guides'
    },
    {
      icon: Video,
      title: 'Video Eğitimler',
      description: 'Adım adım kurulum videoları',
      count: '30+ Video',
      link: '/videos'
    },
    {
      icon: Code,
      title: 'API Referansı',
      description: 'Geliştirici dokümantasyonu',
      count: '100+ Endpoint',
      link: '/api-docs'
    },
    {
      icon: Users,
      title: 'Topluluk Forum',
      description: 'Diğer kullanıcılarla etkileşim',
      count: '10K+ Üye',
      link: '/community'
    },
  ];

  const filteredFAQs = faqs.filter(faq => {

    const matchesCategory = activeCategory === 'Tümü' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleContactSubmit = (e) => {

    e.preventDefault();
    console.log('Form submitted:', contactForm);
  };

  return (

    <div className="bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white min-h-screen transition-colors duration-300">

      <section className="pt-32 pb-16 px-6 text-center relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-b from-blue-100 dark:from-blue-900/10 to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">

          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-bold border border-blue-200 dark:border-blue-500/20">

            <HelpCircle size={16} />
            Destek Merkezi

          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">Size Nasıl{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Yardımcı</span>{' '}Olabiliriz?</h1>
          <p className="text-gray-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">Sistem kurulumu, donanım uyumluluğu ve güvenlik protokollerimiz hakkında merak ettikleriniz.</p>

          <div className="max-w-2xl mx-auto mt-8">

            <div className="relative">

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400" size={20} />
              <input type="text" placeholder="Sorunuzu arayın..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-md dark:shadow-none"/>

            </div>

          </div>

        </div>

      </section>

      <section className="pb-12 px-6">

        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">

          {stats.map((stat, i) => ( <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 text-center hover:border-blue-500/30 transition-all shadow-lg dark:shadow-none">

            <stat.icon className="mx-auto mb-3 text-blue-600 dark:text-blue-400" size={24} />
            <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-sm text-gray-600 dark:text-slate-400">{stat.label}</div>

          </div> ))}

        </div>

      </section>

      <section className="pb-8 px-6 sticky top-0 bg-gray-50/95 dark:bg-slate-950/95 backdrop-blur-md z-30 border-b border-gray-200 dark:border-slate-900">

        <div className="max-w-4xl mx-auto">

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">

            {categories.map((cat) => ( <CategoryTab key={cat.name} icon={cat.icon} label={cat.name} count={cat.count} isActive={activeCategory === cat.name} onClick={() => setActiveCategory(cat.name)}/> ))}

          </div>

        </div>

      </section>

      <section className="pb-16 px-6">

        <div className="max-w-4xl mx-auto">

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{filteredFAQs.length} Soru Bulundu</h2>

            {searchQuery && ( <button onClick={() => setSearchQuery('')} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1">

              Aramayı Temizle
              <X size={16} />

            </button> )}

          </div>

          <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl dark:shadow-none">

            {filteredFAQs.length > 0 ? ( filteredFAQs.map((faq, index) => ( <FAQItem key={index} question={faq.question} answer={faq.answer} isPopular={faq.isPopular} /> )) ) : ( <div className="text-center py-12">

              <AlertCircle className="mx-auto mb-4 text-gray-300 dark:text-slate-600" size={48} />
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Sonuç Bulunamadı</h3>
              <p className="text-gray-600 dark:text-slate-400 mb-6">Aradığınız sorguyla eşleşen soru bulunamadı.</p>

              <button onClick={() => setSearchQuery('')} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition-colors text-white shadow-lg">
                Aramayı Temizle
              </button>

            </div> )}

          </div>

        </div>

      </section>

      <section className="pb-16 px-6 bg-white dark:bg-slate-900/20">

        <div className="max-w-7xl mx-auto py-16">

          <div className="text-center mb-12">

            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Destek Kanallarımız</h2>
            <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">Size en uygun iletişim kanalını seçin, uzman ekibimiz yardımcı olmaya hazır.</p>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {supportChannels.map((channel, i) => ( <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 hover:border-blue-500/30 transition-all group shadow-lg dark:shadow-none">

              <div className={`w-14 h-14 bg-gradient-to-br ${channel.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <channel.icon size={24} className="text-white" />
              </div>

              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{channel.title}</h3>
              <p className="text-gray-600 dark:text-slate-400 text-sm mb-4">{channel.description}</p>

              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-500 mb-4">

                <Clock size={12} />
                {channel.available}

              </div>

              <button className="w-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 text-gray-900 dark:text-white">

                {channel.action}
                <ArrowRight size={16} />

              </button>

            </div> ))}

          </div>

        </div>

      </section>

      <section className="pb-24 px-6 bg-gray-50 dark:bg-slate-950">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-12">

            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Ek Kaynaklar</h2>
            <p className="text-gray-600 dark:text-slate-400">Kendiniz keşfetmek isteyenler için</p>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {resources.map((resource, i) => ( <a key={i} href={resource.link} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 hover:border-blue-500/30 transition-all group text-center shadow-lg dark:shadow-none">

              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-500/20 transition-colors">
                <resource.icon size={28} className="text-blue-600 dark:text-blue-400" />
              </div>

              <h3 className="font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{resource.title}</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">{resource.description}</p>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{resource.count}</div>

            </a> ))}

          </div>

        </div>

      </section>

      <section className="pb-24 px-6 bg-white dark:bg-slate-900/20">

        <div className="max-w-3xl mx-auto py-16">

          <div className="text-center mb-12">

            <Sparkles className="mx-auto mb-4 text-blue-600 dark:text-blue-400" size={48} />
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Hala Yardıma İhtiyacınız Var mı?</h2>
            <p className="text-gray-600 dark:text-slate-400">Bizimle iletişime geçin, size yardımcı olmaktan mutluluk duyarız.</p>

          </div>

          <form onSubmit={handleContactSubmit} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl dark:shadow-none">

            <div className="grid md:grid-cols-2 gap-6">

              <div>

                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-400">Adınız</label>
                <input type="text" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Semih Cingitaş" required />

              </div>

              <div>

                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-400">E-posta</label>
                <input type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors" placeholder="ornek@mail.com" required />

              </div>

            </div>

            <div>

              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-400">Konu</label>
              <input type="text" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Konuyu kısaca özetleyin" required />

            </div>

            <div>

              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-400">Mesajınız</label>
              <textarea value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} rows="5" className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-none" placeholder="Detaylı olarak anlatın..." required></textarea>

            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 text-white">

              <Send size={20} />
              Mesajı Gönder

            </button>

          </form>

        </div>

      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-blue-100 dark:from-blue-600/10 to-purple-100 dark:to-purple-600/10 border-y border-gray-200 dark:border-slate-900">

        <div className="max-w-4xl mx-auto text-center">

          <Users className="mx-auto mb-6 text-blue-600 dark:text-blue-400" size={48} />
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Topluluğumuza Katılın</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">10,000+ kullanıcımız ile deneyim paylaşın, sorularınızı sorun ve en son güncellemelerden haberdar olun.</p>

          <div className="flex flex-wrap justify-center gap-4">

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2">
              <MessageCircle size={20} />
              Forum'a Katıl
            </button>

            <button className="bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 border border-gray-200 dark:border-slate-700 shadow-md dark:shadow-none">
              <Download size={20} />
              PDF Kılavuz İndir
            </button>

          </div>

        </div>

      </section>

    </div>
  );
};

export default FAQ;