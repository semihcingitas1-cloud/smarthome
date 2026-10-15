import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { logoutUser } from "../redux/userSlice";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification, clearNotifications } from "../redux/notificationSlice";

import { Home, Settings, Bell, User, LogIn, Menu, X, ChevronDown, LogOut, Shield, Wifi, Sun, Moon, LayoutDashboard, Battery, Search, Zap, ShoppingCart, HelpCircle, Cpu, Check, AlertCircle, Info } from "lucide-react";

const TYPE_CONFIG = {

  system: { icon: Settings, bg: 'bg-gray-500' },
  device: { icon: Cpu, bg: 'bg-typus' },
  alert: { icon: AlertCircle, bg: 'bg-red-500' },
  automation: { icon: Zap, bg: 'bg-orange-500' },
  security: { icon: Shield, bg: 'bg-green-500' },
  info: { icon: Info, bg: 'bg-blue-500' },
};

const timeAgo = (dateStr) => {

  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return 'Az önce';
  if (m < 60) return `${m} dk önce`;
  if (h < 24) return `${h} sa önce`;
  if (d < 7) return `${d} gün önce`;
  return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
};

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
  const { items: notifications, unreadCount, loading: notificationsLoading } = useSelector((state) => state.notifications);
  const { carts } = useSelector(state => state.cart);

  const role = user?.user?.role;

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

    window.addEventListener("scroll", handleScroll, { passive: true });
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

    const handleEscape = (e) => {

      if (e.key === "Escape") {

        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
        setIsNotificationMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {

      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Sistem durumu yalnızca görüntülendiği menüler açıkken güncellenir (gereksiz re-render olmasın)
  useEffect(() => {

    if (!isMobileMenuOpen && !isUserMenuOpen) return;

    const interval = setInterval(() => {

      setSystemStatus(prev => ({

        ...prev,
        cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.min(100, Math.max(0, prev.memory + (Math.random() - 0.5) * 5))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isMobileMenuOpen, isUserMenuOpen]);

  const navItems = useMemo(
    () => [
      {
        label: "Ana Sayfa",
        path: "/",
        icon: <Home size={14} />,
        authRequired: false,
      },
      {
        label: "Dashboard",
        path: role === 'admin' ? "/admin/dashboard" : role === 'editor' ? "/editor/dashboard" : "/user/dashboard",
        icon: <LayoutDashboard size={14} />,
        authRequired: true,
      },
      {
        label: "Alışveriş",
        path: "/products",
        icon: <ShoppingCart size={14} />,
        authRequired: false,
      },
    ], [role]
  );

  useEffect(() => {

    if (!isAuth) {

      dispatch(clearNotifications());
      return undefined;
    }

    const refresh = () => {

      if (document.visibilityState === "visible") dispatch(fetchNotifications({ limit: 20 }));
    };

    refresh();
    const interval = setInterval(refresh, 30000);
    document.addEventListener("visibilitychange", refresh);

    return () => {

      clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [isAuth, dispatch]);

  const visibleNavItems = useMemo(

    () => navItems.filter((item) => !item.authRequired || isAuth),
    [navItems, isAuth]
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

  // Ana sayfa yalnızca birebir eşleşir; diğerleri alt rotalarda da (/products/123 gibi) aktif kalır
  const isActivePath = (path) => {

    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const logout = () => {

    localStorage.removeItem("token");
    dispatch(clearNotifications());
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
    setIsMobileMenuOpen(false);
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

      orange: 'bg-orange-500',
      green: 'bg-green-500',
      blue: 'bg-typus',
      red: 'bg-red-500'
    };
    return colors[color] || colors.blue;
  };

  const toggleNotificationMenu = () => {

    const next = !isNotificationMenuOpen;
    setIsNotificationMenuOpen(next);
    if (next) dispatch(fetchNotifications({ limit: 20 }));
  };

  const handleNotificationClick = (n) => {

    if (!n.isRead) dispatch(markNotificationRead(n._id));

  // Backend bildirimi gönderirken data.webPath verirse o sayfaya gider
    if (n.data?.webPath) {

      setIsNotificationMenuOpen(false);
      navigate(n.data.webPath);
    }
  };

  const handleSearch = (e) => {

    e.preventDefault();
    console.log("Search:", searchQuery);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  const iconButtonClass = "p-2 text-gray-600 dark:text-slate-400 hover:text-typus-dark dark:hover:text-typus-light hover:bg-typus/10 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-typus";

  return (

    <header className={`w-full bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 border-b sticky top-0 z-50 transition-colors duration-200 ${scrolled ? "border-typus/40" : "border-gray-200 dark:border-slate-800"}`}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* lg+: 3 kolon (logo | ortalı nav | aksiyonlar) → nav artık absolute değil, logo/aksiyonlarla çakışmaz */}
        <div className="flex items-center justify-between h-16 lg:grid lg:grid-cols-[1fr_auto_1fr]">

          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0 lg:justify-self-start focus:outline-none focus-visible:ring-2 focus-visible:ring-typus rounded-lg" aria-label="TypusHome ana sayfa">

            <svg viewBox="-2 -1 64 60" className="h-9 w-9 transition-transform duration-300 group-hover:scale-110" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">

              <path d="M2 26 L30 3 L58 26" className="stroke-typus" strokeWidth="4.5" />
              <path d="M10 20 V54 H50 V20" className="stroke-typus" strokeWidth="4.5" />
              <path d="M23.6 39.6 A9 9 0 0 1 36.4 39.6" className="stroke-typus-light" strokeWidth="3.5" />
              <path d="M18 34 A17 17 0 0 1 42 34" className="stroke-typus-light" strokeWidth="3.5" />
              <circle cx="30" cy="46" r="3.2" className="fill-typus stroke-none" />

            </svg>

            <div>

              <h1 className="flex items-baseline leading-none select-none">

                <span className="text-[#5DB3EA] dark:text-[#85CBF0] text-[22px] tracking-[-0.06em]" style={{ fontFamily: "'Lexend Giga', sans-serif", fontWeight: 200 }}>Typus</span>
                <span className="text-[#0F2A47] dark:text-white text-[27px] tracking-[-0.04em]" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Home</span>

              </h1>

              {isAuth && ( <p className="mt-1.5 text-[9px] text-gray-500 dark:text-slate-500 uppercase tracking-wider leading-none font-semibold">Control Panel</p> )}

            </div>

          </Link>

          {/* Masaüstü nav: artık misafirler için de görünür (authRequired filtresi yeterli) */}
          <nav className="hidden lg:flex lg:justify-self-center" aria-label="Ana menü">

            <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-full">

              {visibleNavItems.map((item) => ( <button key={item.path} onClick={() => navigate(item.path)} aria-current={isActivePath(item.path) ? "page" : undefined} className={`group relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-typus ${isActivePath(item.path) ? "bg-typus text-white" : "text-gray-600 dark:text-slate-400 hover:text-typus-dark dark:hover:text-typus-light hover:bg-white dark:hover:bg-slate-700"}`}>

                {item.icon}
                <span>{item.label}</span>

              </button> ))}

            </div>

          </nav>

          <div className="flex items-center gap-2 lg:justify-self-end">

            {isAuth && ( <div ref={searchRef} className="relative">

              <button onClick={() => setIsSearchOpen(!isSearchOpen)} aria-label="Ara" aria-expanded={isSearchOpen} className={`hidden md:flex ${iconButtonClass}`}>
                <Search size={18} />
              </button>

              {isSearchOpen && ( <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">

                <form onSubmit={handleSearch} className="p-4">

                  <div className="relative">

                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400" size={18} />
                    <input type="text" placeholder="Cihaz, oda veya otomasyon ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:border-typus transition-colors" autoFocus />

                  </div>

                </form>

                <div className="px-4 pb-4">

                  <p className="text-xs text-gray-500 dark:text-slate-500 uppercase font-semibold mb-3">Hızlı Erişim</p>

                  <div className="space-y-1">

                    {quickActions.map((action, i) => ( <button key={i} onClick={action.action} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-typus/10 dark:hover:bg-slate-700 rounded-lg transition-colors">

                      {action.icon}
                      {action.label}

                    </button> ))}

                  </div>

                </div>

              </div> )}

            </div> )}

            <button onClick={() => setIsDarkMode(!isDarkMode)} aria-label={isDarkMode ? "Açık temaya geç" : "Koyu temaya geç"} className={`hidden md:flex ${iconButtonClass}`}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuth && ( <div ref={notificationMenuRef} className="sm:relative">

  <button onClick={toggleNotificationMenu} aria-label="Bildirimler" aria-expanded={isNotificationMenuOpen} className={`relative ${iconButtonClass}`}>

    <Bell size={18} />
    {unreadCount > 0 && ( <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount > 99 ? "99+" : unreadCount}</span> )}

  </button>

  {/* Mobilde ekrana sabitlenir (taşma yok), sm+ üstte butona hizalanır */}
  {isNotificationMenuOpen && ( <div className="fixed inset-x-4 top-[4.5rem] sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 sm:mt-2 sm:w-96 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">

    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-700/50">

      <div className="flex items-center gap-2">

        <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Bildirimler</h3>
        {unreadCount > 0 && ( <span className="px-2 py-0.5 bg-typus/15 text-typus-dark dark:text-typus-light text-xs font-semibold rounded-full">{unreadCount} yeni</span> )}

      </div>

      {unreadCount > 0 && ( <button onClick={() => dispatch(markAllNotificationsRead())} className="text-xs text-typus-dark dark:text-typus-light hover:underline">
        Tümünü okundu işaretle
      </button> )}

    </div>

    <div className="max-h-96 overflow-y-auto">

      {notificationsLoading && notifications.length === 0 ? ( <div className="px-4 py-12 text-center">

        <p className="text-sm text-gray-500 dark:text-slate-400">Yükleniyor...</p>

      </div> ) : notifications.length > 0 ? ( notifications.map((n) => {

        const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
        const Icon = config.icon;
        const critical = n.severity === "critical";

        return ( <div key={n._id} onClick={() => handleNotificationClick(n)} className={`px-4 py-3 border-b border-gray-200 dark:border-slate-700/30 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer ${critical && !n.isRead ? "bg-red-50 dark:bg-red-900/10" : !n.isRead ? "bg-typus/5 dark:bg-typus/10" : ""}`}>

          <div className="flex items-start gap-3">

            <div className={`w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} className="text-white" />
            </div>

            <div className="flex-1 min-w-0">

              <div className="flex items-start justify-between gap-2">

                <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{n.title}</h4>

                <div className="flex items-center gap-1.5 flex-shrink-0 mt-1">

                  {critical && ( <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">Acil</span> )}
                  {!n.isRead && ( <div className={`w-2 h-2 rounded-full ${critical ? "bg-red-500" : "bg-typus"}`} /> )}

                </div>

              </div>

              <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">{n.body}</p>

              <div className="flex items-center justify-between mt-2">

                <span className="text-xs text-gray-500 dark:text-slate-500">{timeAgo(n.createdAt)}</span>

                <div className="flex gap-1">

                  {!n.isRead && ( <button onClick={(e) => { e.stopPropagation(); dispatch(markNotificationRead(n._id)); }} className="text-xs text-typus-dark dark:text-typus-light hover:underline">
                    Okundu
                  </button> )}

                  <button onClick={(e) => { e.stopPropagation(); dispatch(deleteNotification(n._id)); }} className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors ml-2">
                    Sil
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div> );
      }) ) : ( <div className="px-4 py-12 text-center">

        <Bell size={48} className="mx-auto mb-4 text-gray-300 dark:text-slate-700" />
        <p className="text-sm text-gray-500 dark:text-slate-400">Bildirim bulunmuyor</p>

      </div> )}

    </div>

    {notifications.length > 0 && ( <div className="px-4 py-3 border-t border-gray-200 dark:border-slate-700/50">

      <button onClick={() => { setIsNotificationMenuOpen(false); navigate('/user/notifications'); }} className="w-full text-sm text-typus-dark dark:text-typus-light hover:underline text-center">
        Tüm bildirimleri görüntüle
      </button>

    </div> )}

  </div> )}

</div> )}

            <button onClick={() => navigate('/cart')} aria-label="Sepet" className={`relative ${iconButtonClass}`}>

              <ShoppingCart size={18} />
              {carts?.length > 0 && ( <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-typus text-white text-[10px] font-bold rounded-full flex items-center justify-center">{carts?.length}</span> )}

            </button>

            {isAuth ? ( <div ref={userMenuRef} className="hidden lg:block relative">

              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} aria-expanded={isUserMenuOpen} className="flex items-center gap-2.5 px-2 py-1 rounded-xl hover:bg-typus/10 dark:hover:bg-slate-800 transition-colors">

                <div className="text-right hidden xl:block">

                  <p className="text-xs font-semibold text-gray-900 dark:text-white">{user?.user?.name || "Kullanıcı"}</p>
                  <p className="text-[10px] text-gray-500 dark:text-slate-500">{role || "Üye"}</p>

                </div>

                <div className="relative">

                  <div className="w-9 h-9 bg-typus rounded-lg flex items-center justify-center"><User size={18} className="text-white" /></div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />

                </div>

                <ChevronDown size={14} className={`text-gray-600 dark:text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}/>

              </button>

              {isUserMenuOpen && ( <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">

                <div className="px-4 py-4 border-b border-gray-200 dark:border-slate-700/50 bg-typus/10">

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 bg-typus rounded-lg flex items-center justify-center"><User size={24} className="text-white" /></div>

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

                  {userMenuItems.map((item, index) => ( <button key={index} onClick={() => handleUserMenuClick(item)} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${item.danger ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10" : "text-gray-700 dark:text-slate-300 hover:bg-typus/10 dark:hover:bg-slate-700"}`}>

                    {item.icon}
                    <span className="flex-1 text-left">{item.label}</span>

                  </button> ))}

                </div>

              </div> )}

            </div> ) : ( <button onClick={() => navigate("/auth")} className="group flex items-center gap-2 px-5 py-2.5 bg-typus hover:bg-typus-dark rounded-lg font-semibold text-sm text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-typus focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900">

              <LogIn size={16} />
              <span className="hidden sm:inline">Giriş Yap</span>

            </button> )}

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label={isMobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"} aria-expanded={isMobileMenuOpen} aria-controls="mobile-menu" className={`lg:hidden ${iconButtonClass}`}>
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>

        </div>

        {/* Mobil menü: ekran yüksekliğini aşarsa kaydırılır, kapalıyken odaklanılamaz (invisible) */}
        <div id="mobile-menu" aria-hidden={!isMobileMenuOpen} className={`lg:hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-[calc(100vh-4rem)] overflow-y-auto opacity-100 py-4" : "max-h-0 overflow-hidden opacity-0 invisible"}`}>

          {isAuth && ( <div className="mb-4">

            <form onSubmit={handleSearch}>

              <div className="relative">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400" size={18} />
                <input type="text" placeholder="Ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-100 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:border-typus"/>

              </div>

            </form>

          </div> )}

          <nav className="space-y-1 mb-4" aria-label="Mobil menü">

            {visibleNavItems.map((item) => ( <button key={item.path} onClick={() => navigate(item.path)} aria-current={isActivePath(item.path) ? "page" : undefined} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActivePath(item.path) ? "bg-typus text-white" : "text-gray-700 dark:text-slate-300 hover:bg-typus/10 dark:hover:bg-slate-800"}`}>

              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>

            </button> ))}

            {/* Koyu tema butonu mobilde üst barda gizli (md:flex) olduğu için burada da var */}
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-typus/10 dark:hover:bg-slate-800 transition-all md:hidden">

              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
              <span className="flex-1 text-left">{isDarkMode ? "Açık tema" : "Koyu tema"}</span>

            </button>

          </nav>

          {isAuth && ( <div className="pt-4 border-t border-gray-200 dark:border-slate-800/50">

            <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-100 dark:bg-slate-800/40 rounded-xl">

              <div className="w-10 h-10 bg-typus rounded-lg flex items-center justify-center"><User size={20} className="text-white" /></div>

              <div className="flex-1 min-w-0">

                <p className="font-semibold text-sm truncate text-gray-900 dark:text-white">{user?.user?.name}</p>
                <p className="text-xs text-gray-600 dark:text-slate-400 truncate">{user?.user?.email}</p>

              </div>

            </div>

            {userMenuItems.map((item, index) => ( <button key={index} onClick={() => handleUserMenuClick(item)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${item.danger ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10" : "text-gray-700 dark:text-slate-300 hover:bg-typus/10 dark:hover:bg-slate-800"}`}>

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

                <Zap size={16} className="mx-auto mb-1 text-typus dark:text-typus-light" />
                <p className="text-xs text-gray-600 dark:text-slate-400">{systemStatus.activeDevices} Aktif</p>

              </div>

              <div className="bg-gray-100 dark:bg-slate-800/40 rounded-lg px-3 py-2 text-center">

                <Cpu size={16} className="mx-auto mb-1 text-typus-dark dark:text-typus-light" />
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
