import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { logoutUser } from '../redux/userSlice'; 

import { LayoutDashboard, Users, Server, Activity, Settings, LogOut, ShieldCheck, CreditCard, ShoppingBag, QrCode } from "lucide-react";

const AdminSidebar = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [

    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={25} /> },
    { name: 'Ürünler', path: '/admin/product', icon: <ShoppingBag size={25} /> },
    { name: 'Kullanıcılar', path: '/admin/users', icon: <Users size={25} /> },
    { name: 'Sistem & Cihazlar', path: '/admin/devices', icon: <Server size={25} /> },
    { name: 'Finans / Lisans', path: '/admin/billing', icon: <CreditCard size={25} /> },
    { name: 'Sistem Logları', path: '/admin/logs', icon: <Activity size={25} /> },
    { name: 'Genel Ayarlar', path: '/admin/settings', icon: <Settings size={25} /> },
  ];

  const logout = () => {

    localStorage.removeItem("token");
    dispatch(logoutUser());
    navigate('/admin/login');
  };

  return (

    <div className="sticky top-10 z-10">

      <div className="hidden lg:flex flex-col min-w-[280px] bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-r border-gray-200 dark:border-slate-800 shadow-lg dark:shadow-none transition-colors duration-300">

        <div className="py-6 px-6 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">

          <div className="flex items-center gap-3">

            <div className="bg-gradient-to-br from-blue-600 to-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/30">
              <ShieldCheck className="text-white" size={24} />
            </div>

            <div>

              <span className="text-xl font-black block tracking-tight -mb-2 text-gray-900 dark:text-white">SMART<span className="text-blue-500">HUB</span></span>
              <span className="text-red-500 dark:text-red-400 text-[10px] uppercase font-bold tracking-widest">Admin Paneli</span>

            </div>

          </div>

        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">

          {menuItems.map((item) => ( <Link key={item.path} to={item.path} className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-medium ${location.pathname === item.path ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'}`}>

            <span className={location.pathname === item.path ? 'scale-110 transition-transform' : ''}>{item.icon}</span>
            {item.name}

          </Link> ))}

        </nav>

        <div className="p-4 mt-10 border-t border-gray-200 dark:border-slate-800">

          <div onClick={logout} className="flex items-center gap-4 text-gray-600 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 p-4 cursor-pointer transition-all rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/5 group">

            <LogOut size={25} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold uppercase text-xs tracking-wider">Sistemden Çık</span>

          </div>

        </div>

      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 z-50 flex items-center h-20 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.5)] transition-colors duration-300">

        <nav className="flex-1 flex overflow-x-auto no-scrollbar scroll-smooth px-2 items-center h-full">

          {menuItems.map((item) => ( <Link key={item.path} to={item.path} className={`flex flex-col items-center justify-center min-w-[85px] h-full transition-all ${location.pathname === item.path ? 'text-blue-500' : 'text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300'}`}>

            <span className={`transition-transform ${location.pathname === item.path ? 'scale-110 mb-1' : ''}`}>{item.icon}</span>
            <span className="text-[10px] font-bold mt-1 whitespace-nowrap uppercase tracking-tighter">{item.name}</span>
            {location.pathname === item.path && ( <div className="w-1 h-1 bg-blue-500 rounded-full mt-1 animate-pulse" /> )}

          </Link> ))}

        </nav>

        <div onClick={logout} lassName="flex flex-col items-center justify-center w-20 h-full bg-gray-50 dark:bg-slate-950 border-l border-gray-200 dark:border-slate-800 text-red-500 active:bg-red-50 dark:active:bg-red-500/10 transition-colors cursor-pointer">

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

export default AdminSidebar;