import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { resetPassword } from '../redux/userSlice';

import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle, ShieldCheck, Sparkles, RefreshCw, Clock, KeyRound, Check, X } from 'lucide-react';

const ResetPassword = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationRules, setValidationRules] = useState({ minLength: false, hasUpperCase: false, hasLowerCase: false, hasNumber: false, hasSpecialChar: false });
  
  const { loading, error } = useSelector((state) => state.user);

  useEffect(() => {

    if (isSuccess && countdown > 0) {

      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isSuccess && countdown === 0) {

      navigate('/auth');
    }
  }, [isSuccess, countdown, navigate]);

  useEffect(() => {

    if (!token) {

      navigate('/forgot');
    }
  });

  const calculatePasswordStrength = (password) => {

    let strength = 0;

    const rules = {

      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    setValidationRules(rules);

    Object.values(rules).forEach(rule => {

      if (rule) strength += 20;
    });

    setPasswordStrength(strength);
    return strength;
  };

  const getStrengthColor = () => {

    if (passwordStrength <= 20) return 'bg-red-500';
    if (passwordStrength <= 40) return 'bg-orange-500';
    if (passwordStrength <= 60) return 'bg-yellow-500';
    if (passwordStrength <= 80) return 'bg-lime-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {

    if (passwordStrength <= 20) return 'Çok Zayıf';
    if (passwordStrength <= 40) return 'Zayıf';
    if (passwordStrength <= 60) return 'Orta';
    if (passwordStrength <= 80) return 'Güçlü';
    return 'Çok Güçlü';
  };

  const validateForm = () => {

    const newErrors = {};

    if (!formData.password) {

      newErrors.password = 'Şifre gereklidir';
    } else if (passwordStrength < 60) {

      newErrors.password = 'Şifre yeterince güçlü değil';
    }

    if (!formData.confirmPassword) {

      newErrors.confirmPassword = 'Şifre onayı gereklidir';
    } else if (formData.password !== formData.confirmPassword) {

      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      calculatePasswordStrength(value);
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {

      const result = await dispatch(resetPassword({ 

        token, 
        password: formData.password 
      })).unwrap();
      
      if (result.success) {

        setIsSuccess(true);
      }
    } catch (err) {

      console.error('Şifre sıfırlama hatası:', err);
    }
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

          <div className="absolute top-8 left-8"><Sparkles className={`dark:text-blue-400 text-blue-500 animate-pulse`} size={20} /></div>
          <div className="absolute top-8 right-8"><Sparkles className={`dark:text-purple-400 text-purple-500 animate-pulse delay-700`} size={16} /></div>

          <div className={`inline-flex items-center justify-center p-4 rounded-2xl mb-4 shadow-lg relative dark:bg-gradient-to-br dark:from-blue-600 dark:to-purple-600 dark:shadow-blue-900/50 bg-gradient-to-br from-blue-500 to-purple-500 shadow-blue-500/30`}>

            <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse" />
            <KeyRound size={32} className="text-white relative z-10" />

          </div>

          <h2 className={`text-3xl font-bold tracking-tight mb-3 dark:text-white text-slate-900`}>{isSuccess ? 'Şifre Başarıyla Değiştirildi!' : 'Yeni Şifre Oluştur'}</h2>
          <p className={`text-sm leading-relaxed max-w-sm mx-auto dark:text-slate-400 text-slate-600`}>{isSuccess ? 'Şifreniz güvenli bir şekilde güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.' : 'Güçlü ve unutamayacağınız yeni bir şifre belirleyin. Hesabınızın güvenliği için önemlidir.'}</p>

        </div>

        {error && !isSuccess && ( <div className="mx-8 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">

          <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1"><p className="text-red-500 text-sm font-medium">{error}</p></div>

        </div> )}

        {!isSuccess ? ( <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">

          <div className="space-y-2">

            <label className={`text-xs font-bold uppercase px-1 tracking-wider dark:text-slate-400 text-slate-600`}>Yeni Şifre</label>

            <div className="relative group">

              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors dark:text-slate-500 dark:group-focus-within:text-blue-400 text-slate-400 group-focus-within:text-blue-500`} size={18} />
              <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className={`w-full border rounded-xl py-3.5 pl-11 pr-12 focus:outline-none focus:ring-2 transition-all text-sm dark:bg-slate-800 dark:border-slate-700 bg-slate-50 border-slate-300 dark:text-white text-slate-900 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 focus:border-blue-400 focus:ring-blue-400/20 ${errors.password ? 'border-red-500 focus:ring-red-500/20' : ''}`} placeholder="••••••••" disabled={loading}/>

              <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors dark:text-slate-500 dark:hover:text-slate-300 text-slate-400 hover:text-slate-600`}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>

            {formData.password && ( <div className="space-y-3 mt-3">

              <div className="flex items-center justify-between text-xs">

                <span className={`font-medium dark:text-slate-400 text-slate-600`}>Şifre Gücü:</span>
                <span className={`font-bold ${passwordStrength <= 40 ? 'text-red-500' : passwordStrength <= 60 ? 'text-yellow-500' : 'text-green-500'}`}>{getStrengthText()}</span>

              </div>

              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">

                <div className={`h-full transition-all duration-300 ${getStrengthColor()}`} style={{ width: `${passwordStrength}%` }}/>

              </div>

            </div> )}

            {errors.password && ( <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.password}</p> )}

          </div>

          <div className={`rounded-xl p-4 border dark:bg-slate-800/50 dark:border-slate-700 bg-slate-50 border-slate-200`}>

            <h4 className={`text-xs font-bold mb-3 dark:text-white text-slate-900`}>Şifre Gereksinimleri:</h4>

            <ul className="space-y-2">

              {[
                { key: 'minLength', text: 'En az 8 karakter' },
                { key: 'hasUpperCase', text: 'En az bir büyük harf (A-Z)' },
                { key: 'hasLowerCase', text: 'En az bir küçük harf (a-z)' },
                { key: 'hasNumber', text: 'En az bir rakam (0-9)' },
                { key: 'hasSpecialChar', text: 'En az bir özel karakter (!@#$...)' }

              ].map((rule) => ( <li key={rule.key} className="flex items-center gap-2 text-xs">

                {validationRules[rule.key] ? ( <Check size={14} className="text-green-500 flex-shrink-0" /> ) : ( <X size={14} className={`flex-shrink-0 ${formData.password ? 'text-red-500' : 'dark:text-slate-600 text-slate-400'}`} /> )}
                <span className={validationRules[rule.key] ? 'text-green-500 font-medium' : 'dark:text-slate-400 text-slate-600'}>{rule.text}</span>

              </li> ))}

            </ul>

          </div>

          <div className="space-y-2">

            <label className={`text-xs font-bold uppercase px-1 tracking-wider dark:text-slate-400 text-slate-600`}>Şifre Onayı</label>

            <div className="relative group">

              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors dark:text-slate-500 dark:group-focus-within:text-blue-400 text-slate-400 group-focus-within:text-blue-500`} size={18} />
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`w-full border rounded-xl py-3.5 pl-11 pr-12 focus:outline-none focus:ring-2 transition-all text-sm dark:bg-slate-800 dark:border-slate-700 bg-slate-50 border-slate-300 dark:text-white text-slate-900 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 focus:border-blue-400 focus:ring-blue-400/20 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500/20' : ''}`} placeholder="••••••••" disabled={loading}/>

              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors dark:text-slate-500 dark:hover:text-slate-300 text-slate-400 hover:text-slate-600`}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              {formData.confirmPassword && formData.password === formData.confirmPassword && (<CheckCircle className="absolute right-12 top-1/2 -translate-y-1/2 text-green-500" size={18} />)}

            </div>

            {errors.confirmPassword && ( <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.confirmPassword}</p> )}

          </div>

          <button type="submit" disabled={loading || !formData.password || !formData.confirmPassword || passwordStrength < 60} className={`w-full font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group dark:bg-gradient-to-r dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-500 dark:hover:to-purple-500 dark:text-white dark:shadow-blue-900/40 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-blue-500/30`}>

            {loading ? ( <>

              <RefreshCw className="animate-spin" size={18} />
              <span>Kaydediliyor...</span>

            </> ) : ( <>

              <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
              <span>Şifreyi Kaydet</span>

            </> )}

          </button>

          <div className={`rounded-xl p-4 border dark:bg-blue-500/10 dark:border-blue-500/20 bg-blue-50 border-blue-200`}>

            <div className="flex items-start gap-3">

              <ShieldCheck className={`flex-shrink-0 dark:text-blue-400 text-blue-600`} size={18} />
              <p className={`text-xs dark:text-blue-300 text-blue-700`}>Şifreniz güvenli bir şekilde şifrelenir ve saklanır. Kimse, biz bile şifrenizi göremeyiz.</p>

            </div>

          </div>

        </form> ) : ( <div className="p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">

          <div className={`rounded-2xl p-8 border relative overflow-hidden dark:bg-green-500/10 dark:border-green-500/20 bg-green-50 border-green-200`}>

            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-emerald-400/5" />

            <div className="relative z-10">

              <div className={`inline-flex items-center justify-center p-4 rounded-2xl mb-4 dark:bg-green-500/20 bg-green-100`}>
                <CheckCircle size={48} className="text-green-500 animate-bounce" />
              </div>

              <h3 className={`font-bold text-xl mb-3 dark:text-green-400 text-green-700`}>Harika! Şifreniz Güncellendi</h3>
              <p className={`text-sm mb-4 dark:text-green-300/80 text-green-600`}>Yeni şifreniz başarıyla kaydedildi. Artık yeni şifrenizle güvenli bir şekilde giriş yapabilirsiniz.</p>

            </div>

          </div>

          <div className={`rounded-xl p-4 text-left border dark:bg-slate-800/50 dark:border-slate-700 bg-slate-50 border-slate-200`}>

            <h4 className={`font-bold text-sm mb-3 dark:text-white text-slate-900`}>Güvenlik İpuçları:</h4>

            <ul className={`space-y-2 text-xs dark:text-slate-400 text-slate-600`}>

              <li className="flex items-start gap-2">

                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">✓</span>
                <span>Şifrenizi kimseyle paylaşmayın</span>

              </li>

              <li className="flex items-start gap-2">

                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">✓</span>
                <span>Farklı hesaplar için farklı şifreler kullanın</span>

              </li>

              <li className="flex items-start gap-2">

                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">✓</span>
                <span>Şifrenizi düzenli olarak değiştirin</span>

              </li>

            </ul>

          </div>

          <div className={`flex items-center justify-center gap-2 text-xs dark:text-slate-400 text-slate-600`}>

            <Clock size={14} className="animate-pulse" />
            <span>{countdown} saniye sonra giriş sayfasına yönlendirileceksiniz...</span>

          </div>

        </div> )}

        <div className={`p-6 border-t text-center space-y-4 dark:bg-slate-800/30 dark:border-slate-800 bg-slate-50/50 border-slate-200`}>

          <button onClick={() => navigate('/auth')} className={`flex items-center justify-center gap-2 text-sm font-bold transition-colors w-full group dark:text-slate-400 dark:hover:text-white text-slate-600 hover:text-slate-900`}>

            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Giriş Sayfasına Dön

          </button>

          <div className={`flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold dark:text-slate-600 text-slate-400`}>

            <ShieldCheck size={12} />
            256-bit SSL Şifreleme

          </div>

        </div>

      </div>

    </div>
  );
};

export default ResetPassword;