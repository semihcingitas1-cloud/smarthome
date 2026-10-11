import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

import { verifyEmailRequest } from "../api/emailVerification";

const VerifyEmail = () => {

  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  // React StrictMode geliştirmede effect'i iki kez çalıştırır; isteği tek sefer atmak için
  const calledRef = useRef(false);

  useEffect(() => {

    if (calledRef.current) return;
    calledRef.current = true;

    verifyEmailRequest(token)
      .then((data) => {

        setStatus("success");
        setMessage(data.message);
      })
      .catch((err) => {

        setStatus("error");
        setMessage(err.message);
      });
  }, [token]);

  return (

    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-gray-50 dark:bg-slate-950">

      <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-8">

        {status === "loading" && ( <>

          <Loader2 size={48} className="animate-spin text-typus mx-auto mb-4" aria-hidden="true" />
          <p className="text-gray-600 dark:text-slate-400">E-posta adresiniz doğrulanıyor...</p>

        </> )}

        {status === "success" && ( <>

          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">E-posta adresiniz doğrulandı</h1>
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-6">{message}</p>

          <button onClick={() => navigate("/auth")} className="px-5 py-2.5 bg-typus hover:bg-typus-dark rounded-lg text-sm font-semibold text-white transition-colors">
            Giriş yap
          </button>

        </> )}

        {status === "error" && ( <>

          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Doğrulama başarısız</h1>
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-6">{message}</p>

          <p className="text-xs text-gray-500 dark:text-slate-500 mb-4">Giriş ekranında e-posta ve şifrenizle denerseniz yeni bir doğrulama e-postası isteyebilirsiniz.</p>

          <Link to="/auth" className="inline-block px-5 py-2.5 bg-typus hover:bg-typus-dark rounded-lg text-sm font-semibold text-white transition-colors">
            Giriş ekranına git
          </Link>

        </> )}

      </div>

    </main>
  );
};

export default VerifyEmail;
