import React, { use, useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from 'react-redux';

import { login, register } from '../redux/userSlice';

import { Mail, Lock, User, Phone, LogIn, UserPlus, ShieldCheck, Home, Eye, EyeOff } from 'lucide-react';

const Auth = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, isAuth } = useSelector((state) => state.user);

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });

  useEffect(() => {

    if (isAuth) {

      navigate('/dashboard');
    }
  }, [isAuth, navigate]);

  const handleChange = (e) => {

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {

    e.preventDefault();
    
    if (isLogin) {

      dispatch(login({ email: formData.email, password: formData.password }));
    } else {

      dispatch(register(formData));
    }
  };

  return (

    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-800">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">

        <div className="p-8 pb-0 text-center">

          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-900/20"><Home size={32} className="text-white" /></div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{isLogin ? 'Tekrar Hoş Geldiniz' : 'Sisteme Kayıt Olun'}</h2>
          <p className="text-slate-400 text-sm mt-2">{isLogin ? 'Akıllı evinizi yönetmek için giriş yapın.' : 'Yeni bir yönetici hesabı oluşturun.'}</p>

        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">

          {!isLogin && ( <div className="space-y-2">

            <label className="text-xs font-bold text-slate-500 uppercase px-1">Ad Soyad</label>

            <div className="relative">

              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="text" onChange={handleChange} name="name" className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm" placeholder="Semih Cingitaş" required/>

            </div>

          </div> )}

          {!isLogin && ( <div className="space-y-2">

            <label className="text-xs font-bold text-slate-500 uppercase px-1">Telefon No:</label>

            <div className="relative">

              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="phone" onChange={handleChange} name="phone" className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm" placeholder="555 123 45 67" required/>

            </div>

          </div> )}

          <div className="space-y-2">

            <label className="text-xs font-bold text-slate-500 uppercase px-1">E-Posta</label>

            <div className="relative">

              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="email" onChange={handleChange} name="email" className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm" placeholder="ornek@mail.com" required />

            </div>

          </div>

          <div className="space-y-2">

            <div className="flex justify-between px-1">

              <label className="text-xs font-bold text-slate-500 uppercase">Şifre</label>

              {isLogin && ( <button onClick={() => navigate('/forgot')} type="button" className="text-[10px] text-blue-500 hover:underline">Şifremi Unuttum</button> )}

            </div>

            <div className="relative">

              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type={showPassword ? "text" : "password"} onChange={handleChange} name="password" className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm" placeholder="••••••••" required />
              {!showPassword ? <Eye onClick={() => setShowPassword(true)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} /> : <EyeOff onClick={() => setShowPassword(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />}

            </div>

          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all active:scale-[0.98] mt-4" >

            {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
            {loading ? 'İşlem yapılıyor...' : (isLogin ? 'Giriş Yap' : 'Hesap Oluştur')}

          </button>

        </form>

        <div className="p-6 bg-slate-800/30 border-t border-slate-800 text-center">

          <p className="text-slate-400 text-sm">

            {isLogin ? "Henüz bir hesabınız yok mu?" : "Zaten bir hesabınız var mı?"}
            <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-blue-500 font-bold hover:text-blue-400 transition-colors" >{isLogin ? 'Kayıt Ol' : 'Giriş Yap'}</button>

          </p>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
  
            <ShieldCheck size={12} />
            Uçtan Uca Şifreli Erişim
  
          </div>

        </div>

      </div>

    </div>

  );
};

export default Auth;