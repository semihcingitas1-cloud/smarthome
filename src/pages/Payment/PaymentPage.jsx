import React, { useState } from 'react';
import { CreditCard, Building2, Lock, CheckCircle, ArrowLeft, AlertCircle, Shield, Zap, Calendar, User, Hash, ChevronRight, Info, Copy } from 'lucide-react';

const PaymentPage = () => {

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [toast, setToast] = useState(null);

  const [selectedPlan] = useState({

    name: 'Profesyonel',
    price: 299,
    period: '/ay',
    features: ['Sınırsız Cihaz', '3 Lokasyon', 'AI Otomasyon']
  });

  const banks = [

    { id: 1, name: 'Ziraat Bankası', iban: 'TR33 0001 1000 0000 0012 3456 78', logo: '🏦' },
    { id: 2, name: 'İş Bankası', iban: 'TR33 0006 4000 0011 2345 6789 01', logo: '🏛️' },
    { id: 3, name: 'Garanti BBVA', iban: 'TR33 0006 2000 0123 4567 8901 23', logo: '🏢' }
  ];

  const showToast = (message, type = 'success') => {

    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatCardNumber = (value) => {

    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {

      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {

    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');

    if (v.length >= 2) {

      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const getCardType = (number) => {

    const num = number.replace(/\s/g, '');
    if (num.startsWith('4')) return 'visa';
    if (num.startsWith('5')) return 'mastercard';
    if (num.startsWith('9792')) return 'troy';
    return 'generic';
  };

  const validateCardNumber = (number) => {

    const cleaned = number.replace(/\s/g, '');
    if (!cleaned) return 'Kart numarası gereklidir';
    if (cleaned.length !== 16) return 'Kart numarası 16 haneli olmalıdır';
    
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {

      let digit = parseInt(cleaned[i]);

      if (isEven) {

        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    if (sum % 10 !== 0) return 'Geçersiz kart numarası';
    return null;
  };

  const validateExpiry = (expiry) => {

    if (!expiry) return 'Son kullanma tarihi gereklidir';
    const [month, year] = expiry.split('/');
    if (!month || !year) return 'Geçersiz tarih formatı';
    
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) return 'Geçersiz ay';
    if (expYear < currentYear) return 'Kartın süresi dolmuş';
    if (expYear === currentYear && expMonth < currentMonth) return 'Kartın süresi dolmuş';
    
    return null;
  };

  const validateCVV = (cvv) => {

    if (!cvv) return 'CVV gereklidir';
    if (cvv.length !== 3) return 'CVV 3 haneli olmalıdır';
    return null;
  };

  const validateName = (name) => {

    if (!name) return 'Kart sahibinin adı gereklidir';
    if (name.length < 3) return 'İsim çok kısa';
    if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(name)) return 'İsim sadece harf içermelidir';
    return null;
  };

  const handleCardNumberChange = (e) => {

    const formatted = formatCardNumber(e.target.value);

    if (formatted.replace(/\s/g, '').length <= 16) {

      setCardData({ ...cardData, number: formatted });
      if (errors.number) {

        setErrors({ ...errors, number: null });
      }
    }
  };

  const handleExpiryChange = (e) => {

    const formatted = formatExpiry(e.target.value);

    if (formatted.replace('/', '').length <= 4) {

      setCardData({ ...cardData, expiry: formatted });

      if (errors.expiry) {

        setErrors({ ...errors, expiry: null });
      }
    }
  };

  const handleCvvChange = (e) => {

    const value = e.target.value.replace(/\D/g, '');

    if (value.length <= 3) {

      setCardData({ ...cardData, cvv: value });

      if (errors.cvv) {

        setErrors({ ...errors, cvv: null });
      }
    }
  };

  const handleNameChange = (e) => {

    const value = e.target.value.toUpperCase();
    setCardData({ ...cardData, name: value });

    if (errors.name) {

      setErrors({ ...errors, name: null });
    }
  };

  const handleCvvFocus = () => setIsFlipped(true);
  const handleCvvBlur = () => {

    setIsFlipped(false);
    const error = validateCVV(cardData.cvv);

    if (error && cardData.cvv) {

      setErrors({ ...errors, cvv: error });
    }
  };

  const copyToClipboard = async (text, bankName) => {

    try {

      await navigator.clipboard.writeText(text);
      showToast(`${bankName} IBAN numarası kopyalandı`, 'success');
    } catch (err) {

      showToast('Kopyalama başarısız', 'error');
    }
  };

  const handlePayment = async () => {

    if (!termsAccepted) {

      showToast('Lütfen kullanım koşullarını kabul edin', 'error');
      return;
    }

    if (paymentMethod === 'card') {

      const newErrors = {

        number: validateCardNumber(cardData.number),
        name: validateName(cardData.name),
        expiry: validateExpiry(cardData.expiry),
        cvv: validateCVV(cardData.cvv)
      };

      const hasErrors = Object.values(newErrors).some(error => error !== null);
      
      if (hasErrors) {

        setErrors(newErrors);
        showToast('Lütfen tüm alanları doğru doldurun', 'error');
        return;
      }

      setIsProcessing(true);
      
      setTimeout(() => {

        setIsProcessing(false);
        showToast('Ödeme başarılı! Yönlendiriliyorsunuz...', 'success');
      }, 2000);
    } else {

      showToast('Banka transfer bilgileri kaydedildi', 'success');
    }
  };

  const cardType = getCardType(cardData.number);
  const totalAmount = Math.round(selectedPlan.price * 1.2 * 0.5);

  return (

    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen py-12 px-4 transition-colors duration-300">
      
      {toast && ( <div className="fixed top-4 right-4 z-50 animate-slide-in">

        <div className={`rounded-xl shadow-2xl p-4 flex items-center gap-3 ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>

          {toast.type === 'success' ? ( <CheckCircle size={20} /> ) : ( <AlertCircle size={20} /> )}
          <span className="font-semibold">{toast.message}</span>

        </div>

      </div> )}

      <div className="max-w-6xl mx-auto">

        <div className="mb-8">

          <button className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4" onClick={() => window.history.back()}>
            <ArrowLeft size={20} />
            Geri Dön
          </button>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Ödeme Bilgileri</h1>
          <p className="text-gray-600 dark:text-slate-400">Güvenli ödeme için bilgilerinizi girin</p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg dark:shadow-none">

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ödeme Yöntemi</h2>

              <div className="grid grid-cols-2 gap-4">

                <button onClick={() => setPaymentMethod('card')} className={`p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`} aria-label="Kredi kartı ile öde">
                  <CreditCard size={24} className={`mx-auto mb-2 ${paymentMethod === 'card' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500'}`} />
                  <p className={`font-semibold text-sm ${paymentMethod === 'card' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-slate-300'}`}>Kredi Kartı</p>
                </button>

                <button onClick={() => setPaymentMethod('bank')} className={`p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'bank' ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`} aria-label="Banka transferi ile öde">
                  <Building2 size={24} className={`mx-auto mb-2 ${paymentMethod === 'bank' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500'}`} />
                  <p className={`font-semibold text-sm ${paymentMethod === 'bank' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-slate-300'}`}>Banka Transferi</p>
                </button>

              </div>

            </div>

            {paymentMethod === 'card' && ( <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg dark:shadow-none">
                
              <div className="mb-8 perspective-1000">

                <div className={`relative w-full h-56 transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

                  <div className={`absolute inset-0 backface-hidden ${isFlipped ? 'hidden' : ''}`}>

                    <div className="w-full h-full bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-2xl p-6 shadow-2xl relative overflow-hidden">

                      <div className="absolute inset-0 opacity-10">

                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full -ml-20 -mb-20" />

                      </div>

                      <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md mb-8 relative">

                        <div className="absolute inset-1 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-sm" />

                      </div>

                      <div className="mb-6">

                        <p className="text-white text-xl md:text-2xl font-mono tracking-wider">{cardData.number || '•••• •••• •••• ••••'}</p>

                      </div>

                      <div className="flex justify-between items-end">

                        <div>

                          <p className="text-white/60 text-xs uppercase mb-1">Kart Sahibi</p>
                          <p className="text-white font-semibold uppercase">{cardData.name || 'AD SOYAD'}</p>

                        </div>

                        <div className="text-right">

                          <p className="text-white/60 text-xs uppercase mb-1">Son Kullanma</p>
                          <p className="text-white font-semibold">{cardData.expiry || 'AA/YY'}</p>

                        </div>

                      </div>

                      <div className="absolute top-6 right-6">

                        {cardType === 'visa' && ( <div className="text-white font-bold text-2xl italic">VISA</div> )}

                        {cardType === 'mastercard' && ( <div className="flex gap-[-8px]">

                          <div className="w-8 h-8 bg-red-500 rounded-full opacity-80"></div>
                          <div className="w-8 h-8 bg-yellow-500 rounded-full -ml-4 opacity-80"></div>

                        </div> )}

                        {cardType === 'troy' && ( <div className="text-white font-bold text-xl">TROY</div> )}

                      </div>

                    </div>

                  </div>

                  <div className={`absolute inset-0 backface-hidden rotate-y-180 ${!isFlipped ? 'hidden' : ''}`}>

                    <div className="w-full h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden">

                      <div className="w-full h-12 bg-black mt-6" />

                      <div className="p-6">

                        <div className="bg-white rounded h-10 flex items-center justify-end px-4">

                          <span className="text-black font-mono text-lg">{cardData.cvv || '•••'}</span>

                        </div>

                        <p className="text-white/60 text-xs mt-2">CVV</p>

                      </div>

                      <div className="px-6">

                        <p className="text-white/40 text-xs italic">Bu kart güvenli ödeme sistemi ile korunmaktadır.</p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              <div className="space-y-4">

                <div>

                  <label className="text-sm font-semibold mb-2 text-gray-700 dark:text-slate-300 flex items-center gap-2"><Hash size={16} />Kart Numarası</label>
                  <input type="text" value={cardData.number} onChange={handleCardNumberChange} onBlur={() => {

                    const error = validateCardNumber(cardData.number);

                    if (error && cardData.number) {

                      setErrors({ ...errors, number: error });
                    } }}
                    className={`w-full bg-gray-50 dark:bg-slate-800 border ${errors.number ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'} rounded-xl px-4 py-3 text-gray-900 dark:text-white font-mono text-lg focus:outline-none focus:border-blue-500 transition-colors`}
                    placeholder="1234 5678 9012 3456"
                    aria-invalid={!!errors.number}
                    aria-describedby={errors.number ? "card-number-error" : undefined}
                  />

                  {errors.number && ( <p id="card-number-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">

                    <AlertCircle size={14} />
                    {errors.number}

                  </p> )}

                </div>

                <div>

                  <label className="text-sm font-semibold mb-2 text-gray-700 dark:text-slate-300 flex items-center gap-2"><User size={16} />Kart Üzerindeki İsim</label>
                  <input type="text" value={cardData.name} onChange={handleNameChange} onBlur={() => {

                    const error = validateName(cardData.name);

                    if (error && cardData.name) {

                      setErrors({ ...errors, name: error });
                    } }}
                    className={`w-full bg-gray-50 dark:bg-slate-800 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'} rounded-xl px-4 py-3 text-gray-900 dark:text-white uppercase focus:outline-none focus:border-blue-500 transition-colors`}
                    placeholder="AHMET YILMAZ"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "card-name-error" : undefined}
                  />

                  {errors.name && ( <p id="card-name-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">

                    <AlertCircle size={14} />
                    {errors.name}

                  </p> )}

                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>

                    <label className="text-sm font-semibold mb-2 text-gray-700 dark:text-slate-300 flex items-center gap-2"><Calendar size={16} />Son Kullanma Tarihi</label>
                    <input type="text" value={cardData.expiry} onChange={handleExpiryChange} onBlur={() => {

                      const error = validateExpiry(cardData.expiry);

                      if (error && cardData.expiry) {

                        setErrors({ ...errors, expiry: error });
                      } }}
                      className={`w-full bg-gray-50 dark:bg-slate-800 border ${errors.expiry ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'} rounded-xl px-4 py-3 text-gray-900 dark:text-white font-mono focus:outline-none focus:border-blue-500 transition-colors`}
                      placeholder="AA/YY"
                      aria-invalid={!!errors.expiry}
                    />

                    {errors.expiry && ( <p className="text-red-500 text-xs mt-1 flex items-center gap-1">

                      <AlertCircle size={12} />
                      {errors.expiry}

                    </p> )}

                  </div>

                  <div>

                    <label className="text-sm font-semibold mb-2 text-gray-700 dark:text-slate-300 flex items-center gap-2"><Lock size={16} />CVV</label>
                    <input type="text" value={cardData.cvv} onChange={handleCvvChange} onFocus={handleCvvFocus} onBlur={handleCvvBlur} className={`w-full bg-gray-50 dark:bg-slate-800 border ${errors.cvv ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'} rounded-xl px-4 py-3 text-gray-900 dark:text-white font-mono focus:outline-none focus:border-blue-500 transition-colors`} placeholder="123" aria-invalid={!!errors.cvv} />

                    {errors.cvv && ( <p className="text-red-500 text-xs mt-1 flex items-center gap-1">

                      <AlertCircle size={12} />
                      {errors.cvv}

                    </p> )}

                  </div>

                </div>

                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 flex items-start gap-3">

                  <Shield size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />

                  <div className="text-sm">

                    <p className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Güvenli Ödeme</p>
                    <p className="text-blue-700 dark:text-blue-400">Tüm ödeme bilgileriniz 256-bit SSL şifreleme ile korunmaktadır.</p>

                  </div>

                </div>

              </div>

            </div> )}

            {paymentMethod === 'bank' && ( <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg dark:shadow-none">

              <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-xl p-4 mb-6">

                <Info size={20} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />

                <div className="text-sm">

                  <p className="font-semibold text-yellow-900 dark:text-yellow-300 mb-1">Banka Transferi Bilgilendirmesi</p>
                  <p className="text-yellow-700 dark:text-yellow-400">Aşağıdaki hesaplardan birine ödemenizi gerçekleştirin. Açıklama kısmına sipariş numaranızı yazmayı unutmayın.</p>

                </div>

              </div>

              <div className="space-y-4">

                {banks.map((bank) => ( <div key={bank.id} className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all cursor-pointer group">

                  <div className="flex items-start gap-4">

                    <div className="text-4xl">{bank.logo}</div>

                    <div className="flex-1">

                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{bank.name}</h3>

                      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-3">

                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">IBAN</p>
                        <p className="font-mono text-sm text-gray-900 dark:text-white">{bank.iban}</p>

                      </div>

                    </div>

                    <button onClick={() => copyToClipboard(bank.iban, bank.name)} className="bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-500/20 transition-colors text-sm font-semibold flex items-center gap-2">
                      <Copy size={16} />
                      Kopyala
                    </button>

                  </div>

                </div> ))}

              </div>

              <div className="mt-6 bg-gray-50 dark:bg-slate-800 rounded-2xl p-6">

                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Transfer Sonrası Yapılacaklar</h4>

                <ol className="space-y-3">

                  {[

                    'Ödeme dekontunuzu kaydedin',
                    'Dekont fotoğrafını destek@smarthub.com adresine gönderin',
                    'Açıklama kısmına sipariş numaranızı yazın',
                    'Ödemeniz 1-2 iş günü içinde onaylanacaktır'
                  ].map((step, i) => ( <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-slate-300">

                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    {step}

                  </li> ))}

                </ol>

              </div>

            </div> )}

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg dark:shadow-none">

              <label className="flex items-start gap-3 cursor-pointer group">

                <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 w-5 h-5 rounded border-gray-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"/>

                <span className="text-sm text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">

                  <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">Kullanım Koşulları</a>'nı ve{' '}
                  <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">Gizlilik Politikası</a>'nı kabul ediyorum. 
                  Ödeme sonrası otomatik olarak abonelik başlatılacaktır.

                </span>

              </label>

            </div>

          </div>

          <div className="lg:col-span-1">

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg dark:shadow-none sticky top-6">
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Sipariş Özeti</h3>

              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">

                <div className="flex items-center gap-3 mb-4">

                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><Zap size={24} /></div>

                  <div>

                    <h4 className="font-bold text-lg">{selectedPlan.name}</h4>
                    <p className="text-white/80 text-sm">Plan</p>

                  </div>

                </div>
                
                <div className="space-y-2 mb-4">

                  {selectedPlan.features.map((feature, i) => ( <div key={i} className="flex items-center gap-2 text-sm">

                    <CheckCircle size={16} className="flex-shrink-0" />
                    {feature}

                  </div> ))}

                </div>

                <div className="pt-4 border-t border-white/20">

                  <div className="flex items-baseline justify-between">

                    <span className="text-white/80">Toplam</span>

                    <div className="flex items-baseline gap-1">

                      <span className="text-3xl font-bold">₺{selectedPlan.price}</span>
                      <span className="text-white/80">{selectedPlan.period}</span>

                    </div>

                  </div>

                </div>

              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-slate-800">

                <div className="flex justify-between text-sm">

                  <span className="text-gray-600 dark:text-slate-400">Paket Ücreti</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₺{selectedPlan.price}</span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-gray-600 dark:text-slate-400">KDV (%20)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₺{Math.round(selectedPlan.price * 0.2)}</span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-green-600 dark:text-green-400">İlk Ay İndirimi</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">-₺{Math.round(selectedPlan.price * 0.5)}</span>

                </div>

              </div>

              <div className="flex justify-between items-center mb-6">

                <span className="text-lg font-bold text-gray-900 dark:text-white">Ödenecek Tutar</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₺{totalAmount}</span>

              </div>

              <button onClick={handlePayment} disabled={isProcessing} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group">

                {isProcessing ? ( <>

                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  İşlem Yapılıyor...

                </> ) : ( <>

                  <Lock size={20} />
                  Güvenli Ödeme Yap
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />

                </> )}

              </button>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-800 space-y-3">

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">

                  <CheckCircle size={16} className="text-green-500" />
                  SSL Güvenli Ödeme

                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">

                  <CheckCircle size={16} className="text-green-500" />
                  14 Gün Para İade Garantisi

                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">

                  <CheckCircle size={16} className="text-green-500" />
                  7/24 Müşteri Desteği

                </div>

              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-800">

                <p className="text-xs text-gray-500 dark:text-slate-400 text-center mb-3">Kabul Edilen Kartlar</p>

                <div className="flex justify-center items-center gap-4 opacity-60">

                  <div className="text-2xl">💳</div>
                  <div className="font-bold text-sm">VISA</div>
                  <div className="font-bold text-sm">MC</div>
                  <div className="font-bold text-sm">TROY</div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <style jsx>{`

        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>

    </div>
  );
};

export default PaymentPage;