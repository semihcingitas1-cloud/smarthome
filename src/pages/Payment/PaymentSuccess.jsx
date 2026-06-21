import React, { useEffect, useState } from 'react';

import { CheckCircle, ArrowRight, Download, Home, Sparkles, Zap, Shield } from 'lucide-react';

const PaymentSuccess = () => {

  const [showConfetti, setShowConfetti] = useState(true);

  const order = {

    orderId: "SH-784923",
    planName: "Profesyonel Plan",
    amount: "₺299",
    period: "aylık",
    date: "12 Mart 2025",
    email: "kullanici@smarthub.com"
  };

  useEffect(() => {

    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-6 relative overflow-hidden">

      {showConfetti && ( <div className="absolute inset-0 pointer-events-none">

        {[...Array(60)].map((_, i) => ( <div key={i} className="absolute w-2 h-2 rounded-full animate-fall" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 4}s`, backgroundColor: ['#3b82f6', '#8b5cf6', '#22c55e', '#eab308'][Math.floor(Math.random() * 4)], opacity: Math.random() * 0.8 + 0.4 }}/> ))}

      </div> )}

      <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden">

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-10 text-center relative">

          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-xl"><CheckCircle size={64} className="text-green-500" /></div>
          
          <h1 className="text-4xl font-bold text-white mb-2">Ödemeniz Alındı!</h1>
          <p className="text-green-100 text-lg">Tebrikler! Aboneliğiniz başarıyla aktif edildi.</p>

          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 text-green-600 dark:text-green-400 text-sm font-bold px-6 py-2 rounded-2xl shadow-md border border-green-100 dark:border-green-500/20">
            Sipariş No: {order.orderId}
          </div>

        </div>

        <div className="p-8 space-y-8">

          <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6">

            <div className="flex justify-between items-center mb-4">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"><Sparkles size={22} className="text-white" /></div>

                <div>

                  <p className="font-semibold text-gray-900 dark:text-white">{order.planName}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Profesyonel Abonelik</p>

                </div>

              </div>

              <div className="text-right">

                <p className="text-2xl font-bold text-gray-900 dark:text-white">{order.amount}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">{order.period}</p>

              </div>

            </div>

            <div className="border-t border-dashed border-gray-300 dark:border-slate-700 pt-4 flex justify-between text-sm">

              <span className="text-gray-600 dark:text-slate-400">Ödeme Tarihi</span>
              <span className="font-medium text-gray-900 dark:text-white">{order.date}</span>

            </div>

          </div>

          <div className="text-center">

            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">Ödemeniz başarıyla alındı. Profesyonel planınız hemen aktif hale getirildi.<br />Artık tüm premium özelliklerden yararlanabilirsiniz.</p>

          </div>

          <div>

            <p className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-4 text-center">ŞİMDİ NE YAPABİLİRSİNİZ?</p>
            
            <div className="grid grid-cols-1 gap-3">

              <button onClick={() => window.location.href = '/user/dashboard'} className="flex items-center justify-between bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 p-4 rounded-2xl transition-all group">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-xl flex items-center justify-center"><Home size={22} className="text-blue-600 dark:text-blue-400" /></div>

                  <div className="text-left">

                    <p className="font-semibold text-gray-900 dark:text-white">Kontrol Paneline Git</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Cihazlarınızı yönetmeye başlayın</p>

                  </div>

                </div>

                <ArrowRight className="text-gray-400 group-hover:text-blue-500 transition-colors" />

              </button>

              <button onClick={() => window.location.href = '/user/devices'} className="flex items-center justify-between bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 p-4 rounded-2xl transition-all group">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/10 rounded-xl flex items-center justify-center"><Zap size={22} className="text-purple-600 dark:text-purple-400" /></div>

                  <div className="text-left">

                    <p className="font-semibold text-gray-900 dark:text-white">Cihaz Ekle</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">İlk cihazınızı sisteme bağlayın</p>

                  </div>

                </div>

                <ArrowRight className="text-gray-400 group-hover:text-purple-500 transition-colors" />

              </button>

            </div>

          </div>

          <div className="flex gap-3">

            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 dark:text-gray-300 py-4 rounded-2xl font-semibold transition-all">
              <Download size={18} />
              Fatura İndir
            </button>
            
            <button onClick={() => window.location.href = '/'} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold hover:brightness-105 transition-all flex items-center justify-center gap-2">
              Dashboard'a Dön
              <Home size={18} />
            </button>

          </div>

          <div className="text-center text-xs text-gray-500 dark:text-slate-500 flex items-center justify-center gap-2 mt-6">
            <Shield size={14} />
            <span>Ödemeniz güvenli bir şekilde alındı • Teşekkür ederiz!</span>
          </div>

        </div>

      </div>

      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(-100vh) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(720deg); }
        }
        .animate-fall {
          animation: fall 4s linear infinite;
          position: absolute;
        }
      `}</style>

    </div>
  );
};

export default PaymentSuccess;