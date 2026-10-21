import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { Loader2 } from 'lucide-react';

import { socialExchange } from '../../redux/userSlice';

const AuthCallback = () => {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const started = useRef(false);

  useEffect(() => {

    // StrictMode'da effect iki kez çalışır; kod tek kullanımlık olduğu için bir kez gönder
    if (started.current) return;
    started.current = true;

    const code = searchParams.get('code');

    // Kodu adres çubuğundan ve geçmişten hemen sil
    window.history.replaceState(null, '', '/auth/callback');

    if (!code) {
      navigate('/auth?error=exchange_expired', { replace: true });
      return;
    }

    // Başarı: Auth sayfası panele yönlendirir. 2FA: kod ekranı açılır. Hata: Auth sayfası hatayı gösterir.
    dispatch(socialExchange(code)).finally(() => navigate('/auth', { replace: true }));

  }, []);

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950">

      <div className="flex flex-col items-center gap-3 text-gray-600 dark:text-slate-400">
        <Loader2 size={32} className="animate-spin" />
        <p className="text-sm">Giriş tamamlanıyor...</p>
      </div>

    </div>
  );
};

export default AuthCallback;
