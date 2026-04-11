import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, Cpu, ShieldCheck, Zap, MessageCircle } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-800 transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-blue-400' : 'text-slate-200 group-hover:text-white'}`}>
          {question}
        </span>
        <div className={`flex-shrink-0 ml-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? <Minus size={20} className="text-blue-400" /> : <Plus size={20} className="text-slate-500" />}
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-slate-400 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "Sistemi kullanmak için teknik bilgiye ihtiyacım var mı?",
      answer: "Hayır. Arayüzümüz, teknik detaylarla uğraşmadan cihazlarınızı yönetebilmeniz için tasarlandı. ESP32 tabanlı cihazınızı ağınıza bağladıktan sonra panel üzerinden otomatik olarak tanınacaktır."
    },
    {
      question: "Hangi donanımları destekliyor?",
      answer: "Öncelikle ESP32-S3 ve ESP32-C6 serisi işlemcileri destekliyoruz. Standart röle modülleri, DHT11/22 sıcaklık sensörleri ve MQ serisi gaz sensörleri ile tam uyumlu çalışmaktadır."
    },
    {
      question: "Verilerim ne kadar güvende?",
      answer: "Verileriniz uçtan uca AES-256 şifreleme ile korunur. MQTT protokolü üzerinden yapılan tüm iletişimler TLS/SSL sertifikalarıyla zırhlandırılmıştır."
    },
    {
      question: "İnternet kesildiğinde sistem çalışmaya devam eder mi?",
      answer: "Evet. Yerel ağ (LAN) üzerinden kontrol özelliğimiz sayesinde internetiniz olmasa bile ev içindeki Wi-Fi ağınız üzerinden cihazlarınıza komut gönderebilirsiniz."
    },
    {
      question: "Açık API desteği nasıl çalışıyor?",
      answer: "Geliştirici panelinden alacağınız API anahtarı ile kendi Python scriptlerinizi veya mobil uygulamalarınızı sisteme entegre edebilir, HTTP/Websocket üzerinden veri çekebilirsiniz."
    }
  ];

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-500/20">
            <HelpCircle size={16} /> Destek Merkezi
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold">Merak Edilenler</h1>
          <p className="text-slate-400 text-lg">
            Sistem kurulumu, donanım uyumluluğu ve güvenlik protokollerimiz hakkında en çok sorulan soruları yanıtladık.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-blue-500/30 transition-all">
            <Cpu className="text-blue-500 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Teknik Dökümantasyon</h3>
            <p className="text-slate-400 text-sm mb-4">ESP32 bağlantı şemaları ve kütüphane kurulumları için rehberimize göz atın.</p>
            <button className="text-blue-400 font-bold text-sm hover:underline">Dökümanları Oku →</button>
          </div>
          
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-green-500/30 transition-all">
            <ShieldCheck className="text-green-500 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Güvenlik Bildirimleri</h3>
            <p className="text-slate-400 text-sm mb-4">Veri gizliliği ve güvenlik güncellemeleri hakkında detaylı bilgi alın.</p>
            <button className="text-green-400 font-bold text-sm hover:underline">Güvenlik Merkezi →</button>
          </div>

          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-purple-500/30 transition-all">
            <MessageCircle className="text-purple-500 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Canlı Destek</h3>
            <p className="text-slate-400 text-sm mb-4">Sorunuzun cevabını bulamadınız mı? Teknik ekibimizle iletişime geçin.</p>
            <button className="text-purple-400 font-bold text-sm hover:underline">Bize Yazın →</button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600/5 border-t border-slate-900 text-center">
        <h2 className="text-2xl font-bold mb-6">Hala sorunuz mu var?</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all">
          Topluluğa Katıl
        </button>
      </section>
    </div>
  );
};

export default FAQ;