import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Send, Github, Twitter, Linkedin, Terminal, HelpCircle } from 'lucide-react';

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Gönderildi:", formState);
    // Form gönderme mantığı buraya gelecek
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen overflow-hidden">
      {/* Arka Plan Işık Efektleri */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <section className="relative pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Bizimle <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Bağlantı Kurun</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Sistem entegrasyonu, teknik destek veya iş birliği projeleri için ekibimizle iletişime geçin.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Sol Kolon: İletişim Bilgileri */}
            <div className="space-y-8">
              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Terminal size={20} className="text-blue-500" /> Kanallarımız
                </h3>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase font-bold">E-posta</p>
                    <p className="text-slate-200">destek@akilliev.io</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <MessageSquare className="text-purple-500" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase font-bold">Discord & Topluluk</p>
                    <p className="text-slate-200">Akıllı Ev Geliştiricileri</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="text-green-500" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase font-bold">Merkez</p>
                    <p className="text-slate-200">Teknopark İstanbul, Türkiye</p>
                  </div>
                </div>
              </div>

              {/* Sosyal Medya */}
              <div className="flex justify-between px-4">
                {[Github, Twitter, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center hover:border-blue-500/50 hover:text-blue-400 transition-all">
                    <Icon size={24} />
                  </a>
                ))}
              </div>
            </div>

            {/* Orta ve Sağ Kolon: İletişim Formu */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1">Adınız Soyadınız</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all"
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1">E-posta Adresiniz</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all"
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Konu</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all appearance-none"
                    onChange={(e) => setFormState({...formState, subject: e.target.value})}
                  >
                    <option>Teknik Destek</option>
                    <option>Cihaz Entegrasyonu</option>
                    <option>Kurumsal İş Birliği</option>
                    <option>Hata Bildirimi</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Mesajınız</label>
                  <textarea 
                    rows="5"
                    placeholder="Nasıl yardımcı olabiliriz?"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all resize-none"
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                  ></textarea>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/20 group">
                  Mesajı Gönder <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Alt Bilgi: Hızlı Yardım */}
      <section className="py-12 px-6 border-t border-slate-900 bg-slate-900/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
              <HelpCircle size={24} />
            </div>
            <div>
              <h4 className="font-bold">Hızlı bir cevaba mı ihtiyacınız var?</h4>
              <p className="text-sm text-slate-500">SSS sayfamızda en yaygın soruların yanıtlarını bulabilirsiniz.</p>
            </div>
          </div>
          <button className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-blue-500 hover:text-white transition-all">
            Sıkça Sorulan Sorular
          </button>
        </div>
      </section>
    </div>
  );
};

export default Contact;