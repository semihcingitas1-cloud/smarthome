import React, { useState } from 'react';

import { CheckCircle, X, Zap, Shield, Users, Star, ArrowRight, CreditCard, Lock, Clock, Gift, Sparkles, Crown, Home, Building2, Briefcase, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {

  const navigate = useNavigate();

  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const pricingPlans = [
    {
      id: 1,
      name: 'Başlangıç',
      icon: Home,
      price: billingCycle === 'monthly' ? 0 : 0,
      period: billingCycle === 'monthly' ? '/ay' : '/yıl',
      description: 'Bireysel kullanıcılar ve küçük evler için',
      popular: true,
      color: 'from-gray-600 to-gray-800',
      features: [

        'Maksimum 5 Cihaz',
        '1 Ev Lokasyonu',
        'Temel Otomasyon',
        'Mobil Uygulama',
        'E-posta Destek',
        '7/24 İzleme',
        'Enerji Raporları',
        'Temel Güvenlik'
      ],
      buttonText: 'Başla',
      limits: {

        devices: '5 Cihaz',
        locations: '1 Lokasyon',
        users: '2 Kullanıcı'
      }
    },
    {
      id: 2,
      name: 'Profesyonel',
      icon: Building2,
      price: billingCycle === 'monthly' ? 299 : 2870,
      originalPrice: billingCycle === 'monthly' ? null : 3588,
      period: billingCycle === 'monthly' ? '/ay' : '/yıl',
      description: 'Büyük evler ve küçük işletmeler için',
      popular: false,
      color: 'from-blue-600 to-purple-600',
      features: [

        'Maksimum 40 Cihaz',
        '3 Ev Lokasyonu',
        'Gelişmiş Otomasyon',
        'AI Destekli Senaryolar',
        'Öncelikli Destek',
        'Sesli Asistan Entegrasyonu',
        'Detaylı Enerji Analizi',
        'Gelişmiş Güvenlik',
        'API Erişimi',
        'Özel Raporlar'
      ],
      buttonText: 'En Popüler',
      limits: {

        devices: 'Sınırsız',
        locations: '3 Lokasyon',
        users: '5 Kullanıcı'
      },
      badge: '%20 İndirim'
    },
    {
      id: 3,
      name: 'Kurumsal',
      icon: Briefcase,
      price: 'Özel',
      period: '',
      description: 'Büyük işletmeler ve özel ihtiyaçlar',
      popular: false,
      color: 'from-purple-600 to-pink-600',
      features: [

        'Sınırsız Her Şey',
        'Özel Entegrasyonlar',
        'Dedicated Sunucu',
        'White Label Çözümler',
        'SLA Garantisi',
        '7/24 Telefon Desteği',
        'Özel Eğitim',
        'Öncelikli Yeni Özellikler',
        'Özel API Limitleri',
        'Özel Güvenlik Denetimi',
        'Kurulum Desteği',
        'Account Manager'
      ],
      buttonText: 'İletişime Geç',
      limits: {

        devices: 'Sınırsız',
        locations: 'Sınırsız',
        users: 'Sınırsız'
      }
    }
  ];

  const features = [

    { icon: Shield, title: 'Güvenli Ödeme', description: '256-bit SSL şifreleme' },
    { icon: Clock, title: '14 Gün Para İade', description: 'Koşulsuz iade garantisi' },
    { icon: Gift, title: 'İlk Ay %50 İndirim', description: 'Yeni üyelerimize özel' },
    { icon: Lock, title: 'Gizlilik Garantisi', description: 'Verileriniz güvende' }
  ];

  const faqs = [
    {
      q: 'Planımı değiştirebilir miyim?',
      a: 'Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Fark ücret otomatik hesaplanır.'
    },
    {
      q: 'Ücretsiz deneme var mı?',
      a: '14 gün ücretsiz deneme süresi sunuyoruz. Kredi kartı bilgisi gerektirmez.'
    },
    {
      q: 'İptal politikası nedir?',
      a: 'İstediğiniz zaman iptal edebilirsiniz. 14 gün içinde tam para iadesi garantisi.'
    },
    {
      q: 'Kurumsal destek içeriği nedir?',
      a: '7/24 telefon desteği, özel hesap yöneticisi ve SLA garantisi dahildir.'
    }
  ];

  return (

    <div className="bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white min-h-screen transition-colors duration-300">

      <section className="relative pt-32 pb-20 px-6 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-b from-blue-100 dark:from-blue-900/10 to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto text-center relative z-10">

          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-bold border border-blue-200 dark:border-blue-500/20 mb-6">
            <Sparkles size={16} />
            Özel Kampanya - İlk Ay %50 İndirim
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900 dark:text-white">Size Uygun{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Planı Seçin</span></h1>
          <p className="text-gray-600 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-8">Her ölçekte işletme için esnek fiyatlandırma. İstediğiniz zaman yükseltebilir veya iptal edebilirsiniz.</p>

          <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-lg dark:shadow-none">

            <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-3 rounded-xl font-semibold transition-all ${billingCycle === 'monthly' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'}`}>
              Aylık
            </button>

            <button onClick={() => setBillingCycle('yearly')} className={`px-6 py-3 rounded-xl font-semibold transition-all relative ${billingCycle === 'yearly' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'}`}>
              Yıllık
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">%20 İndirim</span>
            </button>

          </div>

        </div>

      </section>

      <section className="pb-24 px-6 relative">

        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {pricingPlans.map((plan) => ( <div key={plan.id} className={`relative bg-white dark:bg-slate-900 border rounded-3xl p-8 transition-all duration-500 hover:scale-105 ${plan.popular ? 'border-blue-500 shadow-2xl shadow-blue-500/20 dark:shadow-blue-500/20' : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 shadow-lg dark:shadow-none'}`}>

              {plan.popular && ( <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                <Crown size={16} />
                En Popüler
              </div> )}

              <div className={`inline-flex p-4 bg-gradient-to-br ${plan.color} rounded-2xl mb-6 shadow-lg`}><plan.icon size={32} className="text-white" /></div>

              <div className="mb-8">

                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-4">{plan.description}</p>

                <div className="flex items-baseline gap-2 mb-2">

                  {plan.price === 'Özel' ? ( <span className="text-5xl font-bold text-gray-900 dark:text-white">Özel Fiyat</span> ) : ( <>

                    <span className="text-5xl font-bold text-gray-900 dark:text-white">₺{plan.price}</span>
                    <span className="text-gray-600 dark:text-slate-400">{plan.period}</span>

                  </> )}

                </div>

                {plan.originalPrice && ( <div className="flex items-center gap-2">

                  <span className="text-gray-500 dark:text-slate-500 line-through text-sm">₺{plan.originalPrice}</span>
                  <span className="bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 text-xs px-2 py-1 rounded-full font-bold">{plan.badge}</span>

                </div> )}

              </div>

              <div className="grid grid-cols-3 gap-2 mb-6 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">

                {Object.entries(plan.limits).map(([key, value]) => ( <div key={key} className="text-center">

                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase">{key === 'devices' ? 'Cihaz' : key === 'locations' ? 'Lokasyon' : 'Kullanıcı'}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{value}</p>

                </div> ))}

              </div>

              <ul className="space-y-3 mb-8">

                {plan.features.map((feature, idx) => ( <li key={idx} className="flex items-start gap-3 text-sm">

                  <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-slate-300">{feature}</span>

                </li> ))}

              </ul>

              <button onClick={() => setSelectedPlan(plan)} className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25' : 'bg-gray-900 dark:bg-slate-800 hover:bg-gray-800 dark:hover:bg-slate-700 text-white'}`}>
                {plan.buttonText}
                <ArrowRight size={18} />
              </button>

            </div> ))}

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">

            {features.map((feature, i) => ( <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 text-center hover:border-blue-500/30 transition-all shadow-md dark:shadow-none">

              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                <feature.icon size={24} className="text-blue-600 dark:text-blue-400" />
              </div>

              <h4 className="font-bold text-sm mb-1 text-gray-900 dark:text-white">{feature.title}</h4>
              <p className="text-xs text-gray-600 dark:text-slate-400">{feature.description}</p>

            </div> ))}

          </div>

        </div>

      </section>

      <section className="pb-24 px-6 bg-white dark:bg-slate-900/30">

        <div className="max-w-7xl mx-auto py-16">

          <div className="text-center mb-12">

            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Detaylı Karşılaştırma</h2>
            <p className="text-gray-600 dark:text-slate-400">Tüm planların özelliklerini detaylı inceleyin</p>

          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl dark:shadow-none">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 dark:bg-slate-800">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Özellik</th>
                    {pricingPlans.map((plan) => ( <th key={plan.id} className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">{plan.name}</th> ))}

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-slate-800">

                  {[
                    { feature: 'Cihaz Sayısı', values: ['5', '40', 'Sınırsız'] },
                    { feature: 'Lokasyon', values: ['1', '3', 'Sınırsız'] },
                    { feature: 'Kullanıcı', values: ['2', '5', 'Sınırsız'] },
                    { feature: 'AI Otomasyon', values: [false, true, true] },
                    { feature: 'API Erişimi', values: [false, true, true] },
                    { feature: 'Dedicated Sunucu', values: [false, false, true] },
                    { feature: 'SLA Garantisi', values: [false, false, true] }
                  ].map((row, i) => ( <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">

                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{row.feature}</td>

                    {row.values.map((value, idx) => ( <td key={idx} className="px-6 py-4 text-center">

                      {typeof value === 'boolean' ? ( value ? ( <CheckCircle size={20} className="mx-auto text-green-500" /> ) : ( <X size={20} className="mx-auto text-gray-400 dark:text-slate-600" /> ) ) : ( <span className="text-sm text-gray-700 dark:text-slate-300">{value}</span> )}

                    </td> ))}

                  </tr> ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </section>

      <section className="pb-24 px-6">

        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12">

            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Sıkça Sorulan Sorular</h2>
            <p className="text-gray-600 dark:text-slate-400">Fiyatlandırma hakkında merak ettikleriniz</p>

          </div>

          <div className="space-y-4">

            {faqs.map((faq, i) => ( <details key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 group shadow-md dark:shadow-none">

              <summary className="font-bold text-gray-900 dark:text-white cursor-pointer list-none flex items-center justify-between">

                {faq.q}
                <ChevronRight size={20} className="transform group-open:rotate-90 transition-transform text-gray-400 dark:text-slate-500" />

              </summary>

              <p className="mt-4 text-gray-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>

            </details> ))}

          </div>

        </div>

      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-blue-100 dark:from-blue-600/10 to-purple-100 dark:to-purple-600/10 border-y border-gray-200 dark:border-slate-900">

        <div className="max-w-4xl mx-auto text-center">

          <Star className="mx-auto mb-6 text-blue-600 dark:text-blue-400" size={48} />
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Hala Karar Veremediniz Mi?</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">14 gün ücretsiz deneme ile tüm özellikleri test edin. Kredi kartı gerektirmez, otomatik ücretlendirme yoktur.</p>

          <div className="flex flex-wrap justify-center gap-4">

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2">
              <Zap size={20} />
              Ücretsiz Deneyin
            </button>

            <button onClick={() => navigate('/contact')} className="bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold transition-all border border-gray-200 dark:border-slate-700 shadow-md dark:shadow-none flex items-center gap-2">
              <Users size={20} />
              Satış Ekibiyle Görüş
            </button>

          </div>

        </div>

      </section>

      {selectedPlan && ( <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">

        <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-8 relative shadow-2xl">

          <button onClick={() => setSelectedPlan(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <X size={24} />
          </button>

          <div className="text-center mb-6">

            <div className={`inline-flex p-4 bg-gradient-to-br ${selectedPlan.color} rounded-2xl mb-4`}><selectedPlan.icon size={32} className="text-white" /></div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedPlan.name} Planı</h3>
            <p className="text-gray-600 dark:text-slate-400">Ödeme bilgilerinizi girin</p>

          </div>

          <div className="space-y-4">

            <div>

              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-300">Kart Sahibi</label>
              <input type="text" className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" placeholder="Ahmet Yılmaz"/>

            </div>

            <div>

              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-300">Kart Numarası</label>
              <input type="text" className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" placeholder="1234 5678 9012 3456"/>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-300">Son Kullanma</label>
                <input type="text" className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" placeholder="MM/YY"/>

              </div>

              <div>

                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-300">CVV</label>
                <input type="text" className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" placeholder="123"/>

              </div>

            </div>

            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
              <CreditCard size={20} />
              Ödemeyi Tamamla
            </button>

            <p className="text-xs text-center text-gray-500 dark:text-slate-400">
              <Lock size={12} className="inline mr-1" />
              Ödeme bilgileriniz güvenli şekilde şifrelenir
            </p>

          </div>

        </div>

      </div> )}

    </div>
  );
};

export default PricingPage;