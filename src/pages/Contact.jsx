import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Send, Github, Twitter, Linkedin, Terminal, HelpCircle, Phone, Clock, CheckCircle2, AlertCircle, Loader2, Instagram, Facebook, Youtube, Globe, Calendar, Building2, Users, Zap, Shield, HeadphonesIcon, MessageCircleMore, ArrowRight, Sparkles, Star, TrendingUp, Award, Target, Briefcase, FileText } from 'lucide-react';

const Contact = () => {

  const [formState, setFormState] = useState({

    name: '',
    email: '',
    phone: '',
    company: '',
    subject: 'Teknik Destek',
    message: '',
    acceptTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactInfo = [
    {
      icon: Mail,
      title: 'E-posta',
      value: 'destek@akilliev.io',
      subtext: '7/24 Destek',
      color: 'from-blue-500 to-cyan-500',
      link: 'mailto:destek@akilliev.io'
    },
    {
      icon: Phone,
      title: 'Telefon',
      value: '+90 850 123 45 67',
      subtext: '09:00 - 18:00',
      color: 'from-green-500 to-emerald-500',
      link: 'tel:+908501234567'
    },
    {
      icon: MessageSquare,
      title: 'Canlı Destek',
      value: 'Chat Başlat',
      subtext: 'Anında Yanıt',
      color: 'from-purple-500 to-pink-500',
      link: '#'
    },
    {
      icon: MapPin,
      title: 'Adres',
      value: 'Teknopark İstanbul',
      subtext: 'Pendik, İstanbul',
      color: 'from-orange-500 to-red-500',
      link: '#'
    }
  ];

  const socialLinks = [

    { icon: Github, label: 'GitHub', link: '/', color: 'hover:text-purple-400' },
    { icon: Twitter, label: 'Twitter', link: '/', color: 'hover:text-blue-400' },
    { icon: Linkedin, label: 'LinkedIn', link: '/', color: 'hover:text-blue-500' },
    { icon: Instagram, label: 'Instagram', link: '/', color: 'hover:text-pink-400' },
    { icon: Facebook, label: 'Facebook', link: '/', color: 'hover:text-blue-600' },
    { icon: Youtube, label: 'YouTube', link: '/', color: 'hover:text-red-500' }
  ];

  const subjects = [

    { value: 'Teknik Destek', icon: Terminal, description: 'Kurulum ve yapılandırma sorunları' },
    { value: 'Cihaz Entegrasyonu', icon: Zap, description: 'Yeni cihaz bağlantısı' },
    { value: 'Kurumsal İş Birliği', icon: Briefcase, description: 'B2B çözümler' },
    { value: 'Hata Bildirimi', icon: AlertCircle, description: 'Bug ve sorun raporlama' },
    { value: 'Satış & Fiyatlandırma', icon: Target, description: 'Paket bilgileri' },
    { value: 'Diğer', icon: MessageCircleMore, description: 'Genel sorular' }
  ];

  const officeHours = [

    { day: 'Pazartesi - Cuma', hours: '09:00 - 18:00', available: true },
    { day: 'Cumartesi', hours: '10:00 - 15:00', available: true },
    { day: 'Pazar', hours: 'Kapalı', available: false }
  ];

  const stats = [

    { label: 'Ortalama Yanıt Süresi', value: '2 saat', icon: Clock },
    { label: 'Memnuniyet Oranı', value: '%98', icon: Star },
    { label: 'Çözülen Talep', value: '10K+', icon: CheckCircle2 },
    { label: 'Destek Dili', value: '3', icon: Globe }
  ];

  const validateForm = () => {

    const newErrors = {};

    if (!formState.name.trim()) {

      newErrors.name = 'Ad Soyad gereklidir';
    }

    if (!formState.email.trim()) {

      newErrors.email = 'E-posta gereklidir';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {

      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    if (formState.phone && !/^[0-9]{10,11}$/.test(formState.phone.replace(/\s/g, ''))) {

      newErrors.phone = 'Geçerli bir telefon numarası giriniz';
    }

    if (!formState.message.trim()) {

      newErrors.message = 'Mesaj gereklidir';
    } else if (formState.message.trim().length < 10) {

      newErrors.message = 'Mesaj en az 10 karakter olmalıdır';
    }

    if (!formState.acceptTerms) {

      newErrors.acceptTerms = 'Gizlilik politikasını kabul etmelisiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) {

      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {

      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Form Gönderildi:", formState);
      
      setSubmitStatus('success');
      setFormState({

        name: '',
        email: '',
        phone: '',
        company: '',
        subject: 'Teknik Destek',
        message: '',
        acceptTerms: false
      });

      setErrors({});

      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {

      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {

      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {

    setFormState({ ...formState, [field]: value });

    if (errors[field]) {

      setErrors({ ...errors, [field]: '' });
    }
  };

  return (

    <div className="bg-slate-950 text-white min-h-screen overflow-hidden">

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

      {submitStatus && ( <div className={`fixed top-8 right-8 z-50 ${submitStatus === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in`}>

        {submitStatus === 'success' ? ( <>

          <CheckCircle2 size={24} />

          <div>

            <p className="font-bold">Başarılı!</p>
            <p className="text-sm">Mesajınız gönderildi, en kısa sürede dönüş yapacağız.</p>

          </div>

        </> ) : ( <>

          <AlertCircle size={24} />

          <div>

            <p className="font-bold">Hata!</p>
            <p className="text-sm">Bir sorun oluştu, lütfen tekrar deneyin.</p>

          </div>

        </> )}

      </div> )}

      <section className="relative pt-32 pb-16 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16 space-y-6">

            <div className="inline-flex items-center gap-2 bg-blue-600/10 backdrop-blur-sm text-blue-400 px-4 py-2 rounded-full text-sm font-bold border border-blue-500/20">

              <MessageSquare size={16} />
              <span>7/24 Destek</span>

            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Bizimle{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">İletişime Geçin</span></h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">Sistem entegrasyonu, teknik destek veya iş birliği projeleri için ekibimizle iletişime geçin. Size yardımcı olmaktan mutluluk duyarız.</p>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">

            {stats.map((stat, i) => ( <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center hover:border-blue-500/30 transition-all">

              <stat.icon className="mx-auto mb-3 text-blue-400" size={24} />
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>

            </div> ))}

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="space-y-6">

              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl space-y-6">

                <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><Terminal size={20} className="text-blue-500" />İletişim Kanalları</h3>

                {contactInfo.map((info, i) => ( <a key={i} href={info.link} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-800/50 transition-all group">

                  <div className={`w-12 h-12 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>

                    <info.icon className="text-white" size={20} />

                  </div>

                  <div className="flex-1">

                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">{info.title}</p>
                    <p className="text-slate-200 font-semibold mb-1">{info.value}</p>
                    <p className="text-xs text-slate-400">{info.subtext}</p>

                  </div>

                </a> ))}

              </div>

              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">

                <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><Clock size={20} className="text-blue-500" />Çalışma Saatleri</h3>

                <div className="space-y-3">

                  {officeHours.map((hour, i) => ( <div key={i} className="flex items-center justify-between py-2">

                    <span className="text-slate-400 text-sm">{hour.day}</span>
                    <span className={`text-sm font-semibold ${hour.available ? 'text-green-400' : 'text-slate-500'}`}>{hour.hours}</span>

                  </div> ))}

                </div>

              </div>

              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">

                <h3 className="text-xl font-bold mb-6">Sosyal Medya</h3>

                <div className="grid grid-cols-3 gap-3">

                  {socialLinks.map((social, i) => ( <a key={i} href={social.link} title={social.label} className={`w-full aspect-square bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center hover:border-blue-500/50 transition-all group ${social.color}`}>
                    <social.icon size={20} className="group-hover:scale-110 transition-transform" />
                  </a> ))}

                </div>

              </div>

              <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 p-6 rounded-3xl">

                <Sparkles className="text-blue-400 mb-3" size={24} />
                <h4 className="font-bold mb-2">Hızlı Yardım</h4>
                <p className="text-sm text-slate-400 mb-4">SSS sayfamızda yaygın soruların yanıtlarını bulabilirsiniz.</p>
                <a href="/faq" className="text-blue-400 font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all">Sıkça Sorulan Sorular<ArrowRight size={16} /></a>

              </div>

            </div>

            <div className="lg:col-span-2">

              <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl space-y-6">

                <div className="mb-8">

                  <h2 className="text-2xl font-bold mb-2">Bize Mesaj Gönderin</h2>
                  <p className="text-slate-400 text-sm">Formu doldurun, en kısa sürede size geri dönüş yapalım.</p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="space-y-2">

                    <label className="text-sm font-semibold text-slate-400 ml-1 flex items-center gap-2"><Users size={14} />Ad Soyad *</label>
                    <input type="text" placeholder="Ahmet Yılmaz" value={formState.name} onChange={(e) => handleChange('name', e.target.value)} className={`w-full bg-slate-950 border rounded-2xl px-6 py-4 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-slate-800 focus:border-blue-500'}`}/>

                    {errors.name && ( <p className="text-red-400 text-xs flex items-center gap-1 ml-1">

                      <AlertCircle size={12} />
                      {errors.name}

                    </p> )}

                  </div>

                  <div className="space-y-2">

                    <label className="text-sm font-semibold text-slate-400 ml-1 flex items-center gap-2"><Mail size={14} />E-posta *</label>
                    <input type="email" placeholder="ahmet@example.com" value={formState.email} onChange={(e) => handleChange('email', e.target.value)} className={`w-full bg-slate-950 border rounded-2xl px-6 py-4 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-slate-800 focus:border-blue-500'}`}/>

                    {errors.email && ( <p className="text-red-400 text-xs flex items-center gap-1 ml-1">

                      <AlertCircle size={12} />
                      {errors.email}

                    </p> )}

                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="space-y-2">

                    <label className="text-sm font-semibold text-slate-400 ml-1 flex items-center gap-2"><Phone size={14} />Telefon (Opsiyonel)</label>
                    <input type="tel" placeholder="551 133 54 10" value={formState.phone} onChange={(e) => handleChange('phone', e.target.value)} className={`w-full bg-slate-950 border rounded-2xl px-6 py-4 outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-slate-800 focus:border-blue-500'}`}/>

                    {errors.phone && ( <p className="text-red-400 text-xs flex items-center gap-1 ml-1">

                      <AlertCircle size={12} />
                      {errors.phone}

                    </p> )}

                  </div>

                  <div className="space-y-2">

                    <label className="text-sm font-semibold text-slate-400 ml-1 flex items-center gap-2"><Building2 size={14} />Şirket (Opsiyonel)</label>
                    <input type="text" placeholder="Şirket Adı" value={formState.company} onChange={(e) => handleChange('company', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all"/>

                  </div>

                </div>

                <div className="space-y-2">

                  <label className="text-sm font-semibold text-slate-400 ml-1 flex items-center gap-2"><FileText size={14} />Konu Seçin *</label>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                    {subjects.map((subject) => ( <button key={subject.value} type="button" onClick={() => handleChange('subject', subject.value)} className={`p-4 rounded-xl border transition-all text-left ${formState.subject === subject.value ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/25' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>

                      <subject.icon size={20} className="mb-2" />
                      <p className="font-semibold text-sm mb-1">{subject.value}</p>
                      <p className="text-xs text-slate-400">{subject.description}</p>

                    </button> ))}

                  </div>

                </div>

                <div className="space-y-2">

                  <label className="text-sm font-semibold text-slate-400 ml-1 flex items-center gap-2"><MessageSquare size={14} />Mesajınız *</label>
                  <textarea rows="6" placeholder="Detaylı olarak anlatın..." value={formState.message} onChange={(e) => handleChange('message', e.target.value)} className={`w-full bg-slate-950 border rounded-2xl px-6 py-4 outline-none transition-all resize-none ${errors.message ? 'border-red-500' : 'border-slate-800 focus:border-blue-500'}`}></textarea>

                  {errors.message && ( <p className="text-red-400 text-xs flex items-center gap-1 ml-1">

                    <AlertCircle size={12} />
                    {errors.message}

                  </p> )}

                  <p className="text-xs text-slate-500 ml-1">{formState.message.length} / 1000 karakter</p>

                </div>

                <div className="space-y-2">

                  <label className="flex items-start gap-3 cursor-pointer group">

                    <input type="checkbox" checked={formState.acceptTerms} onChange={(e) => handleChange('acceptTerms', e.target.checked)} className={`mt-1 w-5 h-5 rounded border bg-slate-950 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer ${errors.acceptTerms ? 'border-red-500' : 'border-slate-700'}`}/>

                    <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">

                      <a href="#" className="text-blue-400 hover:underline">Gizlilik Politikası</a>'nı ve{' '}
                      <a href="#" className="text-blue-400 hover:underline">Kullanım Koşulları</a>'nı okudum, kabul ediyorum.

                    </span>

                  </label>

                  {errors.acceptTerms && ( <p className="text-red-400 text-xs flex items-center gap-1 ml-1">

                    <AlertCircle size={12} />
                    {errors.acceptTerms}

                  </p> )}

                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/30 group disabled:opacity-50 disabled:cursor-not-allowed">

                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      Mesajı Gönder
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}

                </button>

                <p className="text-xs text-slate-500 text-center">Ortalama yanıt süresi: <span className="text-blue-400 font-semibold">2 saat</span></p>

              </form>

            </div>

          </div>

        </div>

      </section>

      <section className="py-16 px-6 bg-slate-900/20 border-t border-slate-900">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-12">

            <h2 className="text-3xl font-bold mb-4">Diğer Destek Seçenekleri</h2>
            <p className="text-slate-400">Size en uygun iletişim yöntemini seçin</p>

          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: HeadphonesIcon,
                title: 'Canlı Destek',
                description: 'Anlık yardım için sohbet başlatın',
                action: 'Sohbet Başlat',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Calendar,
                title: 'Görüşme Planla',
                description: 'Uzman ekibimizle randevu alın',
                action: 'Randevu Al',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: FileText,
                title: 'Dokümantasyon',
                description: 'Detaylı rehberlere göz atın',
                action: 'Rehberleri İncele',
                color: 'from-green-500 to-emerald-500'
              }
            ].map((option, i) => ( <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-blue-500/30 transition-all group text-center">

              <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${option.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <option.icon size={28} className="text-white" />
              </div>

              <h3 className="text-xl font-bold mb-2">{option.title}</h3>
              <p className="text-slate-400 text-sm mb-6">{option.description}</p>

              <button className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 mx-auto">

                {option.action}
                <ArrowRight size={16} />

              </button>

            </div> ))}

          </div>

        </div>

      </section>

      <section className="py-16 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">

            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">

              <div className="text-center">

                <MapPin size={48} className="mx-auto mb-4 text-blue-400" />
                <h3 className="text-xl font-bold mb-2">Ofis Konumumuz</h3>
                <p className="text-slate-400">Teknopark İstanbul, Pendik, İstanbul</p>

              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="py-16 px-6 border-t border-slate-900 bg-gradient-to-br from-blue-600/5 to-purple-600/5">

        <div className="max-w-4xl mx-auto">

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">

            <div className="flex items-center gap-4">

              <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500"><HelpCircle size={32} /></div>

              <div>

                <h4 className="text-xl font-bold mb-1">Hızlı cevap mı arıyorsunuz?</h4>
                <p className="text-sm text-slate-400">SSS sayfamızda en yaygın soruların yanıtlarını bulabilirsiniz.</p>

              </div>

            </div>

            <a href="/faq" className="px-8 py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-lg hover:scale-105 flex items-center gap-2">
              Sıkça Sorulan Sorular
              <ArrowRight size={18} />
            </a>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Contact;