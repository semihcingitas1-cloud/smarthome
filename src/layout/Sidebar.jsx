import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { logoutUser } from '../redux/userSlice';

import { LayoutDashboard, Cpu, Zap, Mic2, User, School, LogOut, Home as HomeIcon, Tablet } from "lucide-react";

const Sidebar = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [

    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={25} /> },
    { name: 'Kontrol', path: '/controlpanel', icon: <Tablet size={25} /> },
    { name: 'Cihazlar', path: '/devices', icon: <Cpu size={25} /> },
    { name: 'Otomasyon', path: '/automations', icon: <Zap size={25} /> },
    { name: 'Sesli Komut', path: '/aivoiceconfig', icon: <Mic2 size={25} /> },
    { name: 'Mekan Yönetimi', path: '/spacemanager', icon: <School size={25} /> },
  ];

  const logout = () => {

    localStorage.removeItem("token");
    dispatch(logoutUser());
    navigate('/auth');
  };

  return (

    <div className="z-50">

      <div className="hidden lg:flex flex-col min-w-[280px] bg-slate-900 text-white sticky top-0 border-r border-slate-800">

        <div className="py-6 px-6 border-b border-slate-800 bg-slate-900">

          <div className="flex items-center gap-3">

            <div className="bg-blue-600 p-2 rounded-xl"><HomeIcon className="text-white" size={24} /></div>

            <div>

              <span className="text-xl font-black block tracking-tight">SMART<span className="text-blue-500">HUB</span></span>
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Yönetim Paneli</span>

            </div>

          </div>

        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">

          {menuItems.map((item) => ( <Link key={item.path} to={item.path} className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-medium ${location.pathname === item.path ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>

            <span className={location.pathname === item.path ? 'scale-110' : ''}>{item.icon}</span>{item.name}

          </Link> ))}

        </nav>

        <div className="p-4 mt-10 border-t border-slate-800">

          <div onClick={logout} className="flex items-center gap-4 text-slate-500 hover:text-red-400 p-4 cursor-pointer transition-all rounded-2xl hover:bg-red-500/5 group">

            <LogOut size={25} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold uppercase text-xs tracking-wider">Oturumu Kapat</span>

          </div>

        </div>

      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 flex items-center h-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">

        <nav className="flex-1 flex overflow-x-auto no-scrollbar scroll-smooth px-2 items-center h-full">

          {menuItems.map((item) => ( <Link key={item.path} to={item.path} className={`flex flex-col items-center justify-center min-w-[85px] h-full transition-all ${location.pathname === item.path ? 'text-blue-500' : 'text-slate-500'}`}>

            <span className={`transition-transform ${location.pathname === item.path ? 'scale-110 mb-1' : ''}`}>{item.icon}</span>
            <span className="text-[10px] font-bold mt-1 whitespace-nowrap uppercase tracking-tighter">{item.name}</span>
            {location.pathname === item.path && (<div className="w-1 h-1 bg-blue-500 rounded-full mt-1 animate-pulse" />)}

          </Link> ))}

        </nav>

        <div onClick={logout} className="flex flex-col items-center justify-center w-20 h-full bg-slate-950 border-l border-slate-800 text-red-500 active:bg-red-500/10 transition-colors">

          <LogOut size={24} />
          <span className="text-[10px] mt-1 font-black uppercase">Çıkış</span>

        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; } 
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

    </div>
  );
};

export default Sidebar;