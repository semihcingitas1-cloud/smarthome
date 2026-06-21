import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { logoutUser } from "../redux/userSlice";

import { Home, Settings, Bell, User, LogIn, Menu, X, ChevronDown, LogOut, Shield, Wifi, Sun, Moon, LayoutDashboard, Battery, Search, Zap, ShoppingCart, HelpCircle, Cpu, Check, AlertCircle } from "lucide-react";

const Header = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const userMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const searchRef = useRef(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [systemStatus, setSystemStatus] = useState({ cpu: 45, memory: 67, devices: 12, activeDevices: 10 });

  const { user, isAuth } = useSelector((state) => state.user);
  const { carts } = useSelector(state => state.cart);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Düşük Pil Seviyesi',
      message: 'Yatak odası sensörü pil seviyesi %15',
      time: '5 dakika önce',
      read: false,
      icon: Battery,
      color: 'orange'
    },
    {
      id: 2,
      type: 'success',
      title: 'Otomasyon Tamamlandı',
      message: 'Sabah rutini başarıyla tamamlandı',
      time: '1 saat önce',
      read: false,
      icon: Check,
      color: 'green'
    },
    {
      id: 3,
      type: 'info',
      title: 'Yeni Cihaz Eklendi',
      message: 'Akıllı termostat sisteme eklendi',
      time: '2 saat önce',
      read: true,
      icon: Zap,
      color: 'blue'
    },
    {
      id: 4,
      type: 'alert',
      title: 'Güvenlik Uyarısı',
      message: 'Ön kapı 5 dakika açık kaldı',
      time: '3 saat önce',
      read: true,
      icon: AlertCircle,
      color: 'red'
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {

    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {

    let ticking = false;

    const handleScroll = () => {

      if (!ticking) {

        window.requestAnimationFrame(() => {

          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {

    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsNotificationMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {

        setIsUserMenuOpen(false);
      }

      if (notificationMenuRef.current && !notificationMenuRef.current.contains(e.target)) {

        setIsNotificationMenuOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(e.target)) {

        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {

    const interval = setInterval(() => {

      setSystemStatus(prev => ({

        ...prev,
        cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.min(100, Math.max(0, prev.memory + (Math.random() - 0.5) * 5))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const navItems = useMemo(
    () => [
      {
        label: "Ana Sayfa",
        path: "/",
        icon: <Home size={14} />,
      },
      {
        label: "Dashboard",
        path: user?.user?.role == 'admin' ? "/admin/dashboard" : user?.user?.role == 'editor' ? "/editor/dashboard" : "/user/dashboard",
        icon: <LayoutDashboard size={14} />,
        authRequired: true,
      },
      {
        label: "Alışveriş",
        path: "/products",
        icon: <ShoppingCart size={14} />,
        authRequired: false,
      },
    ],
    [user]
  );

  const quickActions = useMemo(() => [

    { label: "Tüm Işıklar", icon: <Zap size={16} />, action: () => console.log("Toggle lights") },
    { label: "Güvenlik Modu", icon: <Shield size={16} />, action: () => console.log("Security mode") },
    { label: "Ev Modu", icon: <Home size={16} />, action: () => console.log("Home mode") },
  ], []);

  const userMenuItems = useMemo(
    () => [
      {
        label: "Profilim",
        path: "/user/userprofile",
        icon: <User size={16} />,
      },
      {
        label: "Ayarlar",
        path: "/user/settings",
        icon: <Settings size={16} />,
      },
      {
        label: "Güvenlik",
        path: "/user/security",
        icon: <Shield size={16} />,
      },
      {
        label: "Yardım",
        path: "/help",
        icon: <HelpCircle size={16} />,
      },
      {
        label: "Çıkış Yap",
        action: "logout",
        icon: <LogOut size={16} />,
        danger: true,
      },
    ],
    []
  );

  const isActivePath = (path) => location.pathname === path;

  const logout = () => {

    localStorage.removeItem("token");
    dispatch(logoutUser());
    navigate('/');
  };

  const handleUserMenuClick = (item) => {

    if (item.action === "logout") {

      logout();
    } else {

      navigate(item.path);
    }

    setIsUserMenuOpen(false);
  };

  const markAsRead = (id) => {

    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {

    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {

    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationColor = (color) => {

    const colors = {

      orange: 'from-orange-500 to-amber-500',
      green: 'from-green-500 to-emerald-500',
      blue: 'from-blue-500 to-cyan-500',
      red: 'from-red-500 to-rose-500'
    };
    return colors[color] || colors.blue;
  };

  const handleSearch = (e) => {

    e.preventDefault();
    console.log("Search:", searchQuery);
    setIsSearchOpen(false);
  };

  return (

    <header className={`w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl text-gray-900 dark:text-slate-100 border-b border-gray-200 dark:border-slate-800/50 sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-2xl shadow-black/10 dark:shadow-black/40" : "shadow-lg shadow-black/5 dark:shadow-black/20"}`}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex items-center justify-between h-16">

          <div onClick={() => navigate("/")} className="flex items-center space-x-2.5 cursor-pointer group flex-shrink-0">

            <div className="relative">

              <div className="absolute inset-0 bg-blue-500 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-2 rounded-xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-blue-500/30">
                <Home size={25} className="text-white" />
              </div>

            </div>

            <div>

              <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">SMART<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500">HUB</span></h1>
              {isAuth && (<p className="text-[9px] text-gray-500 dark:text-slate-500 uppercase tracking-wider leading-none font-semibold">Control Panel</p>)}

            </div>

          </div>

          {isAuth && ( <nav className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">

            <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800/40 px-2 py-1.5 rounded-full border border-gray-200 dark:border-slate-700/50 shadow-lg shadow-black/5 dark:shadow-black/10">

              {navItems.filter((item) => !item.authRequired || isAuth).map((item, index) => ( <button key={index} onClick={() => navigate(item.path)} className={`group relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${isActivePath(item.path) ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30" : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-700/50"}`}>

                {item.icon}
                <span>{item.label}</span>

              </button> ))}

            </div>

          </nav> )}

          <div className="flex items-center gap-2">

            {isAuth && ( <div ref={searchRef} className="relative">

              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="hidden md:flex p-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                <Search size={18} />
              </button>

              {isSearchOpen && ( <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800/95 backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">

                <form onSubmit={handleSearch} className="p-4">

                  <div className="relative">

                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400" size={18} />
                    <input type="text" placeholder="Cihaz, oda veya otomasyon ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors" autoFocus />

                  </div>

                </form>

                <div className="px-4 pb-4">

                  <p className="text-xs text-gray-500 dark:text-slate-500 uppercase font-semibold mb-3">Hızlı Erişim</p>

                  <div className="space-y-1">

                    {quickActions.map((action, i) => ( <button key={i} onClick={action.action} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors">

                      {action.icon}
                      {action.label}

                    </button> ))}

                  </div>

                </div>

              </div> )}

            </div> )}

            <button onClick={() => setIsDarkMode(!isDarkMode)} className="hidden md:flex p-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuth && ( <div ref={notificationMenuRef} className="relative">

              <button onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)} className="relative p-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                <Bell size={18} />
                {unreadCount > 0 && ( <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 animate-pulse">{unreadCount}</span> )}
              </button>

              {isNotificationMenuOpen && ( <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800/95 backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">

                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-700/50">

                  <div className="flex items-center gap-2">

                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Bildirimler</h3>
                    {unreadCount > 0 && ( <span className="px-2 py-0.5 bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full">{unreadCount} yeni</span> )}

                  </div>

                  {unreadCount > 0 && ( <button onClick={markAllAsRead} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                    Tümünü okundu işaretle
                  </button> )}

                </div>

                <div className="max-h-96 overflow-y-auto">

                  {notifications.length > 0 ? ( notifications.map((notification) => ( <div key={notification.id} className={`px-4 py-3 border-b border-gray-200 dark:border-slate-700/30 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors ${!notification.read ? 'bg-blue-50 dark:bg-blue-500/5' : ''}`}>

                    <div className="flex items-start gap-3">

                      <div className={`w-10 h-10 bg-gradient-to-br ${getNotificationColor(notification.color)} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                        <notification.icon size={18} className="text-white" />
                      </div>

                      <div className="flex-1 min-w-0">

                        <div className="flex items-start justify-between gap-2">

                          <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{notification.title}</h4>
                          {!notification.read && ( <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" /> )}

                        </div>

                        <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">{notification.message}</p>

                        <div className="flex items-center justify-between mt-2">

                          <span className="text-xs text-gray-500 dark:text-slate-500">{notification.time}</span>

                          <div className="flex gap-1">

                            {!notification.read && ( <button onClick={() => markAsRead(notification.id)} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                              Okundu
                            </button> )}

                            <button onClick={() => clearNotification(notification.id)} className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors ml-2">
                              Sil
                            </button>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div> )) ) : ( <div className="px-4 py-12 text-center">

                    <Bell size={48} className="mx-auto mb-4 text-gray-300 dark:text-slate-700" />
                    <p className="text-sm text-gray-500 dark:text-slate-400">Bildirim bulunmuyor</p>

                  </div> )}

                </div>

                {notifications.length > 0 && ( <div className="px-4 py-3 border-t border-gray-200 dark:border-slate-700/50">

                  <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-center">
                    Tüm bildirimleri görüntüle
                  </button>

                </div> )}

              </div> )}

            </div> )}

            <button onClick={() => navigate('/cart')} className="relative p-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors">

              <ShoppingCart size={16}/>
              {carts?.length > 0 && ( <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/50">{carts?.length}</span> )}

            </button>

            {isAuth ? ( <div ref={userMenuRef} className="hidden lg:block relative">

              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2.5 px-2 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors">

                <div className="text-right hidden xl:block">

                  <p className="text-xs font-semibold text-gray-900 dark:text-white">{user?.user?.name || "Kullanıcı"}</p>
                  <p className="text-[10px] text-gray-500 dark:text-slate-500">{user?.user?.role || "Üye"}</p>

                </div>

                <div className="relative">

                  <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md"><User size={18} className="text-white" /></div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />

                </div>

                <ChevronDown size={14} className={`text-gray-600 dark:text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}/>

              </button>

              {isUserMenuOpen && ( <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800/95 backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">

                <div className="px-4 py-4 border-b border-gray-200 dark:border-slate-700/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10">

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"><User size={24} className="text-white" /></div>

                    <div className="flex-1 min-w-0">

                      <p className="font-semibold text-sm truncate text-gray-900 dark:text-white">{user?.user?.name}</p>
                      <p className="text-xs text-gray-600 dark:text-slate-400 truncate">{user?.user?.email}</p>

                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">

                    <div className="bg-gray-100 dark:bg-slate-900/50 rounded-lg px-3 py-2">

                      <p className="text-xs text-gray-500 dark:text-slate-500">Cihazlar</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{systemStatus.devices}</p>

                    </div>

                    <div className="bg-gray-100 dark:bg-slate-900/50 rounded-lg px-3 py-2">

                      <p className="text-xs text-gray-500 dark:text-slate-500">Aktif</p>
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">{systemStatus.activeDevices}</p>

                    </div>

                  </div>

                </div>

                <div className="py-2">

                  {userMenuItems.map((item, index) => ( <button key={index} onClick={() => handleUserMenuClick(item)} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${item.danger ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10" : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700/50"}`}>

                    {item.icon}
                    <span className="flex-1 text-left">{item.label}</span>

                  </button> ))}

                </div>

              </div> )}

            </div> ) : ( <button onClick={() => navigate("/auth")} className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl font-semibold text-sm text-white shadow-lg shadow-blue-500/30 transition-all">

              <LogIn size={16} />
              <span className="hidden sm:inline">Giriş Yap</span>

            </button> )}

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>

        </div>

        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-[600px] opacity-100 py-4" : "max-h-0 opacity-0"}`}>

          {isAuth && ( <div className="mb-4">

            <form onSubmit={handleSearch}>

              <div className="relative">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400" size={18} />
                <input type="text" placeholder="Ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-100 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500"/>

              </div>

            </form>

          </div> )}

          <nav className="space-y-1 mb-4">

            {navItems.filter((item) => !item.authRequired || isAuth).map((item, index) => ( <button key={index} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActivePath(item.path) ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg" : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50"}`}>

              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>

            </button> ))}

          </nav>

          {isAuth && ( <div className="pt-4 border-t border-gray-200 dark:border-slate-800/50">

            <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-100 dark:bg-slate-800/40 rounded-xl">

              <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md"><User size={20} className="text-white" /></div>

              <div className="flex-1 min-w-0">

                <p className="font-semibold text-sm truncate text-gray-900 dark:text-white">{user?.user?.name}</p>
                <p className="text-xs text-gray-600 dark:text-slate-400 truncate">{user?.user?.email}</p>

              </div>

            </div>

            {userMenuItems.map((item, index) => ( <button key={index} onClick={() => handleUserMenuClick(item)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${item.danger ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10" : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50"}`}>

              {item.icon}
              {item.label}

            </button> ))}

          </div> )}

          {isAuth && ( <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-800/50">

            <div className="grid grid-cols-3 gap-2">

              <div className="bg-gray-100 dark:bg-slate-800/40 rounded-lg px-3 py-2 text-center">

                <Wifi size={16} className="mx-auto mb-1 text-green-500 dark:text-green-400" />
                <p className="text-xs text-gray-600 dark:text-slate-400">Online</p>

              </div>

              <div className="bg-gray-100 dark:bg-slate-800/40 rounded-lg px-3 py-2 text-center">

                <Zap size={16} className="mx-auto mb-1 text-blue-500 dark:text-blue-400" />
                <p className="text-xs text-gray-600 dark:text-slate-400">{systemStatus.activeDevices} Aktif</p>

              </div>

              <div className="bg-gray-100 dark:bg-slate-800/40 rounded-lg px-3 py-2 text-center">

                <Cpu size={16} className="mx-auto mb-1 text-purple-500 dark:text-purple-400" />
                <p className="text-xs text-gray-600 dark:text-slate-400">{Math.round(systemStatus.cpu)}%</p>

              </div>

            </div>

          </div> )}

        </div>

      </div>

    </header>
  );
};

export default Header;