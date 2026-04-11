import React, { useState, useEffect, use } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Home, Settings, Bell, User, Power, Activity, LogIn } from 'lucide-react';

const Header = () => {

  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSystemOnline, setIsSystemOnline] = useState(true);

  const { user, isAuth } = useSelector((state) => state.user);

  useEffect(() => {

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (

    <header className="w-full bg-slate-900 text-slate-100 shadow-lg border-b border-slate-700 top-0 sticky z-50">

      <div className="max-w-7xl mx-auto px-4 h-auto flex items-center justify-between">
        
        <div onClick={() => navigate('/')} className="my-4 flex items-center space-x-3 cursor-pointer">

          <div className="bg-blue-600 p-2 rounded-lg"><Home size={24} className="text-white" /></div>

          <div>

            <h1 className="text-xl font-bold tracking-tight">SMART<span className="text-blue-500">HUB</span></h1>
            {isAuth && <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-none">Kontrol Paneli</p>}

          </div>

        </div>

        <div className='my-3 flex flex-col items-center space-y-3'>

          {isAuth && ( <div className="hidden md:flex items-center space-x-6 bg-slate-800/50 px-4 py-1.5 rounded-full border border-slate-700">

            <div className="flex items-center space-x-2">

              <Activity size={16} className={isSystemOnline ? "text-green-400" : "text-red-400"} />
              <span className="text-xs font-medium">Sistem: {isSystemOnline ? 'Çevrimiçi' : 'Bağlantı Yok'}</span>

            </div>

            <div className="h-4 w-[1px] bg-slate-600" />
            <div className="text-xs font-mono text-slate-300">{currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>

          </div> )}

          <nav>

            <ul className="flex space-x-6 text-sm font-medium">

              <li><button onClick={() => navigate('/dashboard')} className="hover:text-blue-500 transition-colors">Dashboard</button></li>
              <li><button onClick={() => navigate('/control-panel')} className="hover:text-blue-500 transition-colors">Kontrol Paneli</button></li>
              <li><button onClick={() => navigate('/energy')} className="hover:text-blue-500 transition-colors">Enerji Yönetimi</button></li>
              <li><button onClick={() => navigate('/settings')} className="hover:text-blue-500 transition-colors">Ayarlar</button></li>

            </ul>

          </nav>

        </div>

        {isAuth ? ( <div className="flex items-center space-x-4">

          <button className="relative p-2 text-slate-400 hover:text-white transition-colors">

            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>

          </button>

          <button className="p-2 text-slate-400 hover:text-white transition-colors"><Settings size={20} /></button>

          <div className="h-8 w-[1px] bg-slate-700 mx-2"></div>

          <div onClick={() => navigate('/userprofile')} className="flex items-center space-x-3 pl-2">

            <div className="text-right hidden sm:block">

              <p className="text-sm font-medium leading-none">{user?.user?.name}</p>
              <p className="text-xs text-slate-500 mt-1">{user?.user?.role}</p>

            </div>

            <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border border-slate-600">

              <User size={20} className="text-white" />

            </div>

          </div>

        </div> ) : (

        <div>

          <button onClick={() => navigate('/auth')} className='py-2 px-5 flex gap-2 items-center bg-blue-600 rounded-md text-slate-400 hover:text-white transition-colors'><LogIn size={20} />Giriş Yap</button>

        </div> )}

      </div>

    </header>

  );
};

export default Header;