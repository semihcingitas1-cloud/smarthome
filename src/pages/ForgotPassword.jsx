import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { forgotPassword } from '../redux/userSlice';

import { Mail, ArrowLeft, Send, ShieldCheck, Home, CheckCircle, AlertCircle, Sun, Moon, Sparkles, Lock, RefreshCw, Clock } from 'lucide-react';

const ForgotPassword = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [emailError, setEmailError] = useState('');
  
  const { loading, error, success, message } = useSelector((state) => state.user);

  useEffect(() => {

    if (isSent && countdown > 0) {

      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isSent && countdown === 0) {

      navigate('/login');
    }
  }, [isSent, countdown, navigate]);

  const validateEmail = (email) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {

      setEmailError('E-posta adresi gereklidir');
      return false;
    }

    if (!emailRegex.test(email)) {

      setEmailError('Geçerli bir e-posta adresi giriniz');
      return false;
    }

    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    
    if (!validateEmail(email)) {

      return;
    }

    try {

      const result = await dispatch(forgotPassword({ email })).unwrap();
      
      if (result.success) {

        setIsSent(true);
      }
    } catch (err) {

      console.error('Şifre sıfırlama hatası:', err);
    }
  };

  const handleBackToLogin = () => {

    navigate('/login');
  };

  const handleTryAgain = () => {

    setIsSent(false);
    setEmail('');
    setCountdown(5);
  };

  return (

    <div className={`min-h-screen flex items-center justify-center p-4 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 bg-gradient-to-br from-blue-50 via-white to-purple-50 transition-all duration-500 relative overflow-hidden`}>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className={`absolute top-20 left-10 w-72 h-72 dark:bg-blue-500/10 bg-blue-400/20 rounded-full blur-3xl animate-pulse`} />
        <div className={`absolute bottom-20 right-10 w-96 h-96 dark:bg-purple-500/10 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 dark:bg-pink-500/5 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-2000`} />

      </div>

      <div className={`w-full max-w-md border rounded-3xl overflow-hidden relative z-10 dark:bg-slate-900 dark:border-slate-800 bg-white border-slate-200 shadow-2xl transition-all duration-500`}>

        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x" />

        <div className="p-8 pb-6 text-center relative">

          <div className="absolute top-8 left-8">
            <Sparkles className={`dark:text-blue-400 text-blue-500 animate-pulse`} size={20} />
          </div>

          <div className="absolute top-8 right-8">
            <Sparkles className={`dark:text-purple-400 text-purple-500 animate-pulse delay-700`} size={16} />
          </div>

          <div className={`inline-flex items-center justify-center p-4 rounded-2xl mb-4 shadow-lg relative dark:bg-gradient-to-br dark:from-blue-600 dark:to-purple-600 dark:shadow-blue-900/50 bg-gradient-to-br from-blue-500 to-purple-500 shadow-blue-500/30`}>
            <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse" />
            <Lock size={32} className="text-white relative z-10" />
          </div>

          <h2 className={`text-3xl font-bold tracking-tight mb-3 dark:text-white text-slate-900`}>Şifrenizi mi Unuttunuz?</h2>
          <p className={`text-sm leading-relaxed max-w-sm mx-auto dark:text-slate-400 text-slate-600`}>Endişelenmeyin! Kayıtlı e-posta adresinizi yazın, size güvenli bir sıfırlama bağlantısı gönderelim.</p>

        </div>

        {(error || emailError) && !isSent && ( <div className="mx-8 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">

          <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1"><p className="text-red-500 text-sm font-medium">{error || emailError}</p></div>

        </div> )}

        {!isSent ? ( <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">

          <div className="space-y-2">

            <label className={`text-xs font-bold uppercase px-1 tracking-wider dark:text-slate-400 text-slate-600`}>E-Posta Adresi</label>

            <div className="relative group">

              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors dark:text-slate-500 dark:group-focus-within:text-blue-400 text-slate-400 group-focus-within:text-blue-500`} size={18} />
              <input type="email" value={email} onChange={(e) => {setEmail(e.target.value); if (emailError) validateEmail(e.target.value);}} onBlur={(e) => validateEmail(e.target.value)} className={`w-full border rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 transition-all text-sm dark:bg-slate-800 dark:border-slate-700 bg-slate-50 border-slate-300 dark:text-white text-slate-900 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 focus:border-blue-400 focus:ring-blue-400/20 ${emailError ? 'border-red-500 focus:ring-red-500/20' : ''}`} placeholder="ornek@mail.com" disabled={loading}/>
              {email && !emailError && (<CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={18} />)}

            </div>

          </div>

          <button type="submit" disabled={loading || !email || emailError} className={`w-full font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group dark:bg-gradient-to-r dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-500 dark:hover:to-purple-500 dark:text-white dark:shadow-blue-900/40 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-blue-500/30`}>

            {loading ? ( <>

              <RefreshCw className="animate-spin" size={18} />
              <span>Gönderiliyor...</span>

            </> ) : ( <>

              <Send size={18} className="group-hover:translate-x-1 transition-transform" />
              <span>Sıfırlama Bağlantısı Gönder</span>

            </> )}

          </button>

          <div className={`rounded-xl p-4 border dark:bg-blue-500/10 dark:border-blue-500/20 bg-blue-50 border-blue-200`}>

            <div className="flex items-start gap-3">

              <ShieldCheck className={`flex-shrink-0 dark:text-blue-400 text-blue-600`} size={18} />
              <p className={`text-xs dark:text-blue-300 text-blue-700`}>Bağlantı 15 dakika geçerli olacaktır. E-posta 5 dakika içinde gelmezse spam klasörünü kontrol edin.</p>

            </div>

          </div>

        </form> ) : (

        <div className="p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">

          <div className={`rounded-2xl p-8 border relative overflow-hidden dark:bg-green-500/10 dark:border-green-500/20 bg-green-50 border-green-200`}>

            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-emerald-400/5" />

            <div className="relative z-10">

              <div className={`inline-flex items-center justify-center p-4 rounded-2xl mb-4 dark:bg-green-500/20 bg-green-100`}>
                <CheckCircle size={48} className="text-green-500 animate-bounce" />
              </div>

              <h3 className={`font-bold text-xl mb-3 dark:text-green-400 text-green-700}`}>E-posta Başarıyla Gönderildi!</h3>                
              <p className={`text-sm mb-4 dark:text-green-300/80 text-green-600`}>{message || 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'}</p>

              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium dark:bg-slate-800/50 dark:text-slate-300 bg-white text-slate-600`}>
                <Mail size={14} />
                {email}
              </div>

            </div>

          </div>

          <div className={`rounded-xl p-4 text-left border dark:bg-slate-800/50 dark:border-slate-700 bg-slate-50 border-slate-200`}>

            <h4 className={`font-bold text-sm mb-3 dark:text-white text-slate-900`}>Sonraki Adımlar:</h4>

            <ul className={`space-y-2 text-xs dark:text-slate-400 text-slate-600`}>

              <li className="flex items-start gap-2">

                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">1</span>
                <span>E-posta gelen kutunuzu kontrol edin</span>

              </li>

              <li className="flex items-start gap-2">

                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">2</span>
                <span>Sıfırlama bağlantısına tıklayın</span>

              </li>

              <li className="flex items-start gap-2">

                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">3</span>
                <span>Yeni şifrenizi oluşturun</span>

              </li>

            </ul>

          </div>

          <div className="space-y-3">

            <p className={`text-xs dark:text-slate-400 text-slate-600`}>E-posta gelmediyse:</p>

            <button onClick={handleTryAgain} className={`font-bold text-sm hover:underline flex items-center gap-2 mx-auto  dark:text-blue-400 dark:hover:text-blue-300 text-blue-600 hover:text-blue-700`}>
              <RefreshCw size={14} />
              Tekrar Gönder
            </button>

          </div>

          <div className={`flex items-center justify-center gap-2 text-xs dark:text-slate-400 text-slate-600`}>

            <Clock size={14} className="animate-pulse" />
            <span>{countdown} saniye sonra giriş sayfasına yönlendirileceksiniz...</span>

          </div>

        </div> )}

        <div className={`p-6 border-t text-center space-y-4 dark:bg-slate-800/30 dark:border-slate-800 bg-slate-50/50 border-slate-200`}>

          <button onClick={handleBackToLogin} className={`flex items-center justify-center gap-2 text-sm font-bold transition-colors w-full group dark:text-slate-400 dark:hover:text-white text-slate-600 hover:text-slate-900`}>

            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Giriş Sayfasına Dön

          </button>
          
          <div className={`flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold  dark:text-slate-600 text-slate-400`}>

            <ShieldCheck size={12} />
            SSL Güvenli İşlem

          </div>

        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;