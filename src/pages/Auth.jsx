import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from 'react-redux';

import { login, register } from '../redux/userSlice';

import { Mail, Lock, User, Phone, LogIn, UserPlus, ShieldCheck, Home, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, Sparkles, Shield, Zap, Github, Chrome, Facebook, ArrowRight, Info } from 'lucide-react';

const Auth = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', acceptTerms: false });
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { loading, error, isAuth } = useSelector((state) => state.user);

  useEffect(() => {

    if (isAuth) {

      setShowSuccessMessage(true);
      setTimeout(() => {

        navigate('/user/dashboard');
      }, 1500);
    }
  }, [isAuth, navigate]);

  useEffect(() => {

    if (formData.password) {

      let strength = 0;
      if (formData.password.length >= 8) strength++;
      if (/[a-z]/.test(formData.password)) strength++;
      if (/[A-Z]/.test(formData.password)) strength++;
      if (/[0-9]/.test(formData.password)) strength++;
      if (/[^a-zA-Z0-9]/.test(formData.password)) strength++;
      setPasswordStrength(strength);
    } else {

      setPasswordStrength(0);
    }
  }, [formData.password]);

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;
    setFormData({

      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (validationErrors[name]) {

      setValidationErrors({ ...validationErrors, [name]: '' });
    }
  };

  const validateForm = () => {

    const errors = {};

    if (!isLogin) {

      if (!formData.name.trim()) {

        errors.name = 'Ad Soyad gereklidir';
      } else if (formData.name.length < 3) {

        errors.name = 'Ad Soyad en az 3 karakter olmalıdır';
      }

      if (!formData.phone.trim()) {

        errors.phone = 'Telefon numarası gereklidir';
      } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {

        errors.phone = 'Geçerli bir telefon numarası giriniz';
      }

      if (formData.password !== formData.confirmPassword) {

        errors.confirmPassword = 'Şifreler eşleşmiyor';
      }

      if (!formData.acceptTerms) {

        errors.acceptTerms = 'Kullanım koşullarını kabul etmelisiniz';
      }
    }

    if (!formData.email.trim()) {

      errors.email = 'E-posta gereklidir';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {

      errors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    if (!formData.password) {

      errors.password = 'Şifre gereklidir';
    } else if (formData.password.length < 6) {

      errors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!validateForm()) {

      return;
    }

    if (isLogin) {

      dispatch(login({ email: formData.email, password: formData.password }));
    } else {

      dispatch(register(formData));
    }
  };

{/*  singInWithGoogle = async () => {

    const provider = new GoogleAuthProvider();

    try {
      
    } catch (error) {

      console.log('Google ile giriş hatası:', error);
    }
  };
  singInWithGithub = async () => {};
  singInWithFacebook = async () => {};*/}

  const getPasswordStrengthColor = () => {

    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {

    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return 'Zayıf';
    if (passwordStrength <= 3) return 'Orta';
    if (passwordStrength <= 4) return 'Güçlü';
    return 'Çok Güçlü';
  };

  const switchMode = () => {

    setIsLogin(!isLogin);
    setFormData({

      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    });
    setValidationErrors({});
    setPasswordStrength(0);
  };

  return (

    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden transition-colors duration-300">

      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {showSuccessMessage && ( <div className="fixed top-8 right-8 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-slide-in">

        <CheckCircle2 size={24} />

        <div>

          <p className="font-bold">Başarılı!</p>
          <p className="text-sm">Yönlendiriliyorsunuz...</p>

        </div>

      </div> )}

      {error && ( <div className="fixed top-8 right-8 bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-slide-in">

        <AlertCircle size={24} />

        <div>

          <p className="font-bold">Hata!</p>
          <p className="text-sm">{error}</p>

        </div>

      </div> )}

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">

        <div className="hidden lg:block text-gray-900 dark:text-white space-y-8">

          <div className="space-y-4">

            <div className="inline-flex items-center gap-2 bg-blue-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-500/20">

              <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Yeni Nesil Akıllı Ev Sistemi</span>

            </div>

            <h1 className="text-5xl font-bold leading-tight text-gray-900 dark:text-white">Evinizi{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Geleceğe</span>{' '}Taşıyın</h1>
            <p className="text-gray-600 dark:text-slate-400 text-lg leading-relaxed">Akıllı ev teknolojileriyle hayatınızı kolaylaştırın. Güvenli, hızlı ve kullanıcı dostu arayüzümüzle evinizi uzaktan kontrol edin.</p>

          </div>

          <div className="space-y-4">

            {[
              { icon: Shield, title: 'Güvenli Erişim', description: 'End-to-end şifreleme ile korunan veriler' },
              { icon: Zap, title: 'Anlık Kontrol', description: 'Gerçek zamanlı cihaz yönetimi ve bildirimler' },
              { icon: ShieldCheck, title: '7/24 Destek', description: 'Teknik destek ekibimiz her zaman yanınızda' },
            ].map((feature, i) => ( <div key={i} className="flex items-start gap-4 bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm border border-gray-200 dark:border-slate-800 rounded-2xl p-4 hover:border-blue-500/30 transition-all shadow-md dark:shadow-none">

              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <feature.icon size={24} className="text-white" />
              </div>

              <div>

                <h3 className="font-bold mb-1 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">{feature.description}</p>

              </div>

            </div> ))}

          </div>

          <div className="flex items-center gap-8 pt-4">

            <div className="text-center">

              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">50K+</div>
              <div className="text-sm text-gray-500 dark:text-slate-500">Kullanıcı</div>

            </div>

            <div className="text-center">

              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">4.9</div>
              <div className="text-sm text-gray-500 dark:text-slate-500">Ortalama Puan</div>

            </div>

            <div className="text-center">

              <div className="text-3xl font-bold text-green-600 dark:text-green-400">99.9%</div>
              <div className="text-sm text-gray-500 dark:text-slate-500">Uptime</div>

            </div>

          </div>

        </div>

        <div className="w-full max-w-md mx-auto">

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">

            <div className="p-8 pb-6 text-center relative overflow-hidden">

              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
              
              <div className="relative z-10">

                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-900/50"><Home size={32} className="text-white" /></div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">{isLogin ? 'Tekrar Hoş Geldiniz' : 'Hesap Oluşturun'}</h2>                
                <p className="text-gray-600 dark:text-slate-400 text-sm">{isLogin ? 'Akıllı evinizi yönetmek için giriş yapın.' : 'Hemen başlamak için kayıt olun.'}</p>

              </div>

            </div>

            <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-5">

              {!isLogin && ( <div className="space-y-2">

                <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase px-1 flex items-center gap-2"><User size={12} />Ad Soyad</label>

                <div className="relative">

                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
                  <input type="text" onChange={handleChange} name="name" value={formData.name} className={`w-full bg-white dark:bg-slate-800 border rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none transition-all text-sm ${validationErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 dark:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`} placeholder="Semih Cingitaş"/>

                </div>

                {validationErrors.name && ( <p className="text-red-400 text-xs flex items-center gap-1 px-1"><AlertCircle size={12} />{validationErrors.name}</p>)}

              </div> )}

              {!isLogin && ( <div className="space-y-2">

                <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase px-1 flex items-center gap-2"><Phone size={12} />Telefon Numarası</label>

                <div className="relative">

                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
                  <input type="tel" onChange={handleChange} name="phone" value={formData.phone} className={`w-full bg-white dark:bg-slate-800 border rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none transition-all text-sm ${validationErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 dark:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`} placeholder="551 133 54 10"/>

                </div>

                {validationErrors.phone && ( <p className="text-red-400 text-xs flex items-center gap-1 px-1"><AlertCircle size={12} />{validationErrors.phone}</p>)}

              </div> )}

              <div className="space-y-2">

                <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase px-1 flex items-center gap-2"><Mail size={12} />E-Posta Adresi</label>

                <div className="relative">

                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
                  <input type="email" onChange={handleChange} name="email" value={formData.email} className={`w-full bg-white dark:bg-slate-800 border rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none transition-all text-sm ${validationErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 dark:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`} placeholder="ornek@mail.com"/>

                </div>

                {validationErrors.email && ( <p className="text-red-400 text-xs flex items-center gap-1 px-1"><AlertCircle size={12} />{validationErrors.email}</p> )}

              </div>

              <div className="space-y-2">

                <div className="flex justify-between px-1">

                  <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase flex items-center gap-2"><Lock size={12} />Şifre</label>

                  {isLogin && ( <button onClick={() => navigate('/forgot')} type="button" className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                    Şifremi Unuttum?
                  </button> )}

                </div>

                <div className="relative">

                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
                  <input type={showPassword ? 'text' : 'password'} onChange={handleChange} name="password" value={formData.password} className={`w-full bg-white dark:bg-slate-800 border rounded-xl py-3 pl-10 pr-12 text-gray-900 dark:text-white focus:outline-none transition-all text-sm ${validationErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 dark:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`} placeholder="••••••••"/>

                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                </div>

                {!isLogin && formData.password && ( <div className="space-y-1">

                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => ( <div key={level} className={`h-1 flex-1 rounded-full transition-all ${level <= passwordStrength ? getPasswordStrengthColor() : 'bg-gray-300 dark:bg-slate-700'}`} />))}
                  </div>

                  {passwordStrength > 0 && ( <p className="text-xs text-gray-600 dark:text-slate-400 px-1">
                    Şifre Gücü:{' '}
                    <span className={passwordStrength <= 2 ? 'text-red-400' : passwordStrength <= 3 ? 'text-yellow-400' : 'text-green-400'}>{getPasswordStrengthText()}</span>
                  </p> )}

                </div> )}

                {validationErrors.password && ( <p className="text-red-400 text-xs flex items-center gap-1 px-1"><AlertCircle size={12} />{validationErrors.password}</p> )}

              </div>

              {!isLogin && ( <div className="space-y-2">

                <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase px-1 flex items-center gap-2"><Lock size={12} />Şifre Tekrar</label>

                <div className="relative">

                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
                  <input type={showConfirmPassword ? 'text' : 'password'} onChange={handleChange} name="confirmPassword" value={formData.confirmPassword} className={`w-full bg-white dark:bg-slate-800 border rounded-xl py-3 pl-10 pr-12 text-gray-900 dark:text-white focus:outline-none transition-all text-sm ${validationErrors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 dark:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`} placeholder="••••••••"/>

                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                </div>

                {validationErrors.confirmPassword && ( <p className="text-red-400 text-xs flex items-center gap-1 px-1"><AlertCircle size={12} />{validationErrors.confirmPassword}</p> )}

              </div> )}

              {!isLogin && ( <div className="space-y-2">

                <label className="flex items-start gap-3 cursor-pointer group">

                  <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"/>

                  <span className="text-sm text-gray-600 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-slate-300 transition-colors">

                    <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">Kullanım Koşulları</a>'nı ve{' '}
                    <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">Gizlilik Politikası</a>'nı kabul ediyorum

                  </span>

                </label>

                {validationErrors.acceptTerms && ( <p className="text-red-400 text-xs flex items-center gap-1 px-1"><AlertCircle size={12} />{validationErrors.acceptTerms}</p> )}

              </div> )}

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-6 group">

                {loading ? ( <>

                  <Loader2 size={20} className="animate-spin" />
                  İşlem yapılıyor...

                </> ) : ( <>

                  {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                  {isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />

                </> )}

              </button>

              {isLogin && ( <div>

                <div className="relative my-6">

                  <div className="absolute inset-0 flex items-center">

                    <div className="w-full border-t border-gray-300 dark:border-slate-800" />

                  </div>

                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-slate-900 px-4 text-gray-500 dark:text-slate-500 font-semibold">veya</span>
                  </div>

                </div>

                <div className="grid grid-cols-3 gap-3">

                  <button type="button" className={`bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl py-3 flex items-center justify-center transition-all hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-500/30`} title={`Google ile giriş`}>
                    <Chrome size={20} className="text-gray-600 dark:text-slate-400" />
                  </button>

                  <button type="button" className={`bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl py-3 flex items-center justify-center transition-all hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:border-purple-500/30`} title={`GitHub ile giriş`}>
                    <Github size={20} className="text-gray-600 dark:text-slate-400" />
                  </button>

                  <button type="button" className={`bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl py-3 flex items-center justify-center transition-all hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-500/30`} title={`Facebook ile giriş`}>
                    <Facebook size={20} className="text-gray-600 dark:text-slate-400" />
                  </button>

                </div>

              </div> )}

            </form>

            <div className="p-6 bg-gray-50 dark:bg-slate-800/30 border-t border-gray-200 dark:border-slate-800 text-center space-y-4">

              <p className="text-gray-600 dark:text-slate-400 text-sm">

                {isLogin ? 'Henüz hesabınız yok mu?' : 'Zaten hesabınız var mı?'}

                <button onClick={switchMode} className="ml-2 text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
                </button>

              </p>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-slate-500">

                <ShieldCheck size={14} className="text-green-500" />
                <span>256-bit SSL Şifreleme ile Korunur</span>

              </div>

            </div>

          </div>

          <div className="mt-6 bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-4 flex items-start gap-3">

            <Info size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />

            <div className="text-sm text-gray-700 dark:text-slate-400">

              <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">Demo Hesap Bilgileri</p>
              <p className="text-xs">E-posta: demo@smarthome.com</p>
              <p className="text-xs">Şifre: demo123</p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Auth;