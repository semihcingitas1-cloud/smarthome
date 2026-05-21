import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AuthSuccess = () => {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {

    const token = searchParams.get('token');
    
    if (token) {

      localStorage.setItem('token', token);
      
      if (window.opener) {

        window.opener.postMessage( { type: 'oauth_success', token }, window.location.origin );
        window.close();
      } else {

        navigate('/user/dashboard');
      }
    } else {

      navigate('/auth');
    }
  }, [searchParams, navigate]);

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">

      <div className="text-center">

        <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-slate-400">Giriş yapılıyor...</p>

      </div>

    </div>
  );
};

export default AuthSuccess;