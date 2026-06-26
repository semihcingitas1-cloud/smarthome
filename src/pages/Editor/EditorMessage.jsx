import React, { useState } from 'react';
import EditorSidebar from '../../layout/EditorSidebar';
import {
  Bell, Send, Users, User, Search, X, Check,
  AlertTriangle, Info, Settings, Cpu, Clock,
  ChevronDown, Filter, Megaphone, CheckCheck
} from 'lucide-react';

const mockUsers = [
  { id: '1', name: 'Semih Cingitaş', email: 'semih@example.com', online: true },
  { id: '2', name: 'Ahmet Yılmaz', email: 'ahmet@example.com', online: false },
  { id: '3', name: 'Ayşe Demir', email: 'ayse@example.com', online: true },
  { id: '4', name: 'Mehmet Kaya', email: 'mehmet@example.com', online: false },
  { id: '5', name: 'Zeynep Arslan', email: 'zeynep@example.com', online: true },
];

const mockHistory = [
  { id: 1, title: 'Sistem Bakımı', body: 'Gece 02:00\'de 10 dakika bakım yapılacak.', type: 'system', target: 'all', targetName: 'Tüm Kullanıcılar', sentAt: '2026-06-25T14:32:00', status: 'sent' },
  { id: 2, title: 'Cihaz Güncellemesi', body: 'Yeni firmware sürümü mevcut.', type: 'device', target: 'user', targetName: 'Semih Cingitaş', sentAt: '2026-06-24T10:15:00', status: 'sent' },
  { id: 3, title: 'Ödeme Hatırlatması', body: 'Aboneliğiniz 3 gün içinde sona erecek.', type: 'alert', target: 'user', targetName: 'Ahmet Yılmaz', sentAt: '2026-06-23T09:00:00', status: 'sent' },
  { id: 4, title: 'Hoş Geldiniz!', body: 'SmartHome ailesine hoş geldiniz.', type: 'info', target: 'user', targetName: 'Ayşe Demir', sentAt: '2026-06-22T16:45:00', status: 'sent' },
];

const TYPE_CONFIG = {
  system: { icon: Settings,      color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20', label: 'Sistem',  dot: 'bg-slate-400' },
  device: { icon: Cpu,           color: 'text-blue-400',  bg: 'bg-blue-500/10 border-blue-500/20',   label: 'Cihaz',   dot: 'bg-blue-400'  },
  alert:  { icon: AlertTriangle, color: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/20',     label: 'Uyarı',   dot: 'bg-red-400'   },
  info:   { icon: Info,          color: 'text-purple-400',bg: 'bg-purple-500/10 border-purple-500/20',label: 'Bilgi',   dot: 'bg-purple-400'},
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1)  return 'Az önce';
  if (m < 60) return `${m} dk önce`;
  if (h < 24) return `${h} sa önce`;
  return `${d} gün önce`;
};

const EditorNotification = () => {

  const [targetType, setTargetType] = useState('all'); // 'all' | 'user'
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearch, setUserSearch] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState('system');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [history, setHistory] = useState(mockHistory);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('compose'); // 'compose' | 'history'

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredHistory = history.filter(h =>
    historyFilter === 'all' || h.type === historyFilter
  );

  const canSend = title.trim() && body.trim() && (targetType === 'all' || selectedUser);

  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);

    // Simüle API çağrısı
    await new Promise(r => setTimeout(r, 1200));

    const newEntry = {
      id: Date.now(),
      title: title.trim(),
      body: body.trim(),
      type,
      target: targetType,
      targetName: targetType === 'all' ? 'Tüm Kullanıcılar' : selectedUser?.name,
      sentAt: new Date().toISOString(),
      status: 'sent',
    };

    setHistory(prev => [newEntry, ...prev]);
    setSending(false);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setTitle('');
      setBody('');
      setType('system');
      setSelectedUser(null);
      setTargetType('all');
      setActiveTab('history');
    }, 1500);
  };

  const TypeIcon = ({ t, size = 16 }) => {
    const config = TYPE_CONFIG[t];
    const Icon = config.icon;
    return <Icon size={size} className={config.color} />;
  };

  return (
    <div className="flex min-h-screen dark:bg-slate-950 bg-slate-50 dark:text-slate-100 text-slate-900 transition-colors duration-300">

      <EditorSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="sticky top-0 z-40 px-6 py-4 border-b backdrop-blur-md dark:bg-slate-950/80 dark:border-slate-800 bg-white/80 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-0.5 text-blue-500">
                <Bell size={12} /> Bildirim Yönetimi
              </div>
              <h1 className="text-xl font-black tracking-tight dark:text-white text-slate-900">
                Bildirim Gönder
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs dark:text-slate-500 text-slate-400 font-mono">{history.length} bildirim gönderildi</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">

          {/* Sol panel — Form */}
          <div className="w-full max-w-xl border-r dark:border-slate-800 border-slate-200 flex flex-col dark:bg-slate-900 bg-white overflow-y-auto">

            {/* Tab */}
            <div className="flex border-b dark:border-slate-800 border-slate-200">
              {[
                { key: 'compose', label: 'Yeni Bildirim', icon: Send },
                { key: 'history', label: 'Geçmiş', icon: Clock },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === key
                      ? 'border-blue-500 text-blue-500'
                      : 'border-transparent dark:text-slate-500 text-slate-400 dark:hover:text-slate-300 hover:text-slate-600'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>

            {activeTab === 'compose' ? (
              <div className="flex-1 p-6 space-y-5">

                {/* Hedef */}
                <div>
                  <label className="text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider mb-3 block">Alıcı</label>
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => { setTargetType('all'); setSelectedUser(null); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                        targetType === 'all'
                          ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                          : 'dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      <Users size={15} /> Tüm Kullanıcılar
                    </button>
                    <button
                      onClick={() => setTargetType('user')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                        targetType === 'user'
                          ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                          : 'dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      <User size={15} /> Belirli Kullanıcı
                    </button>
                  </div>

                  {/* Kullanıcı seçici */}
                  {targetType === 'user' && (
                    <div className="relative">
                      <button
                        onClick={() => setShowUserDropdown(p => !p)}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 bg-slate-50 border-slate-200 transition-colors"
                      >
                        {selectedUser ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                              {selectedUser.name.substring(0, 2)}
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-semibold dark:text-white text-slate-800">{selectedUser.name}</p>
                              <p className="text-xs dark:text-slate-400 text-slate-500">{selectedUser.email}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm dark:text-slate-500 text-slate-400">Kullanıcı seç...</span>
                        )}
                        <ChevronDown size={16} className="dark:text-slate-500 text-slate-400" />
                      </button>

                      {showUserDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 dark:bg-slate-800 bg-white border dark:border-slate-700 border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                          <div className="p-2 border-b dark:border-slate-700 border-slate-200">
                            <div className="relative">
                              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400" />
                              <input
                                type="text"
                                placeholder="Ara..."
                                value={userSearch}
                                onChange={e => setUserSearch(e.target.value)}
                                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg dark:bg-slate-700 dark:text-slate-200 bg-slate-100 text-slate-800 outline-none"
                              />
                            </div>
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {filteredUsers.map(user => (
                              <button
                                key={user.id}
                                onClick={() => { setSelectedUser(user); setShowUserDropdown(false); setUserSearch(''); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 dark:hover:bg-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                <div className="relative">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                    {user.name.substring(0, 2)}
                                  </div>
                                  {user.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 dark:border-slate-800 border-white rounded-full" />}
                                </div>
                                <div className="text-left">
                                  <p className="text-sm font-semibold dark:text-slate-200 text-slate-800">{user.name}</p>
                                  <p className="text-xs dark:text-slate-400 text-slate-500">{user.email}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Tür */}
                <div>
                  <label className="text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider mb-3 block">Bildirim Türü</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(TYPE_CONFIG).map(([key, config]) => {
                      const Icon = config.icon;
                      return (
                        <button
                          key={key}
                          onClick={() => setType(key)}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                            type === key
                              ? `${config.bg} ${config.color} border-current`
                              : 'dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 bg-slate-100 border-slate-200 text-slate-500'
                          }`}
                        >
                          <Icon size={15} />
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Başlık */}
                <div>
                  <label className="text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider mb-2 block">Başlık</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Bildirim başlığı..."
                    maxLength={80}
                    className="w-full px-4 py-3 rounded-xl border text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:placeholder-slate-500 bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                  />
                  <p className="text-right text-xs dark:text-slate-600 text-slate-400 mt-1">{title.length}/80</p>
                </div>

                {/* Mesaj */}
                <div>
                  <label className="text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider mb-2 block">Mesaj</label>
                  <textarea
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    placeholder="Bildirim içeriği..."
                    maxLength={300}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:placeholder-slate-500 bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors resize-none"
                  />
                  <p className="text-right text-xs dark:text-slate-600 text-slate-400 mt-1">{body.length}/300</p>
                </div>

                {/* Gönder */}
                <button
                  onClick={handleSend}
                  disabled={!canSend || sending || sent}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all ${
                    sent
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : canSend && !sending
                      ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98]'
                      : 'dark:bg-slate-800 dark:text-slate-600 bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {sent ? (
                    <><CheckCheck size={17} /> Gönderildi!</>
                  ) : sending ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Gönderiliyor...</>
                  ) : (
                    <><Send size={17} /> {targetType === 'all' ? 'Tüm Kullanıcılara Gönder' : 'Gönder'}</>
                  )}
                </button>

              </div>
            ) : (

              /* Geçmiş */
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b dark:border-slate-800 border-slate-200 flex items-center gap-2">
                  <Filter size={14} className="dark:text-slate-500 text-slate-400" />
                  <select
                    value={historyFilter}
                    onChange={e => setHistoryFilter(e.target.value)}
                    className="flex-1 text-sm rounded-xl px-3 py-2 border outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 bg-slate-100 border-slate-200 text-slate-800"
                  >
                    <option value="all">Tüm Türler</option>
                    <option value="system">Sistem</option>
                    <option value="device">Cihaz</option>
                    <option value="alert">Uyarı</option>
                    <option value="info">Bilgi</option>
                  </select>
                </div>

                <div className="flex-1 overflow-y-auto divide-y dark:divide-slate-800 divide-slate-100">
                  {filteredHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 dark:text-slate-600 text-slate-400">
                      <Bell size={36} strokeWidth={1.5} className="mb-3" />
                      <p className="text-sm font-medium">Bildirim bulunamadı</p>
                    </div>
                  ) : filteredHistory.map(item => {
                    const config = TYPE_CONFIG[item.type];
                    const Icon = config.icon;
                    return (
                      <div key={item.id} className="p-4 flex items-start gap-3 dark:hover:bg-slate-800/40 hover:bg-slate-50 transition-colors">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 ${config.bg}`}>
                          <Icon size={16} className={config.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-0.5">
                            <p className="text-sm font-bold dark:text-slate-200 text-slate-800 truncate">{item.title}</p>
                            <span className="text-[10px] dark:text-slate-500 text-slate-400 font-mono flex-shrink-0">{timeAgo(item.sentAt)}</span>
                          </div>
                          <p className="text-xs dark:text-slate-400 text-slate-500 line-clamp-2 mb-1.5">{item.body}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {item.target === 'all' ? <Users size={11} className="dark:text-slate-500 text-slate-400" /> : <User size={11} className="dark:text-slate-500 text-slate-400" />}
                              <span className="text-[10px] dark:text-slate-500 text-slate-400">{item.targetName}</span>
                            </div>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
                            <span className={`text-[10px] font-semibold ${config.color}`}>{config.label}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sağ panel — Önizleme */}
          <div className="flex-1 flex flex-col dark:bg-slate-950 bg-slate-50 p-8 overflow-y-auto">

            <div className="mb-6">
              <h2 className="text-sm font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider mb-1">Önizleme</h2>
              <p className="text-xs dark:text-slate-600 text-slate-400">Kullanıcının göreceği bildirim</p>
            </div>

            {/* Push notification önizleme */}
            <div className="mb-8">
              <p className="text-xs font-semibold dark:text-slate-500 text-slate-400 mb-3 flex items-center gap-1.5">
                <Bell size={12} /> Push Bildirim
              </p>
              <div className="dark:bg-slate-800 bg-white rounded-2xl p-4 border dark:border-slate-700 border-slate-200 shadow-xl max-w-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Megaphone size={18} color="#fff" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-bold dark:text-slate-300 text-slate-600">SmartHome</p>
                      <p className="text-[10px] dark:text-slate-500 text-slate-400 font-mono">Şimdi</p>
                    </div>
                    <p className="text-sm font-bold dark:text-white text-slate-900 mb-0.5">
                      {title || 'Bildirim Başlığı'}
                    </p>
                    <p className="text-xs dark:text-slate-400 text-slate-500 line-clamp-2">
                      {body || 'Bildirim içeriği burada görünecek...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* In-app önizleme */}
            <div>
              <p className="text-xs font-semibold dark:text-slate-500 text-slate-400 mb-3 flex items-center gap-1.5">
                <Bell size={12} /> Uygulama İçi Bildirim
              </p>
              <div className="dark:bg-slate-900 bg-white rounded-2xl border dark:border-slate-800 border-slate-200 overflow-hidden max-w-sm shadow-xl">
                {/* Fake header */}
                <div className="px-4 py-3 border-b dark:border-slate-800 border-slate-200 flex items-center justify-between">
                  <p className="text-sm font-black dark:text-white text-slate-900">Bildirimler</p>
                  <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">1 yeni</span>
                </div>
                {/* Fake date group */}
                <div className="px-4 py-2 dark:bg-slate-800/50 bg-slate-100">
                  <p className="text-[10px] font-bold dark:text-slate-500 text-slate-400 uppercase tracking-wide">Bugün</p>
                </div>
                {/* Bildirim satırı */}
                <div className="flex items-start gap-3 px-4 py-4 dark:bg-blue-900/10 bg-blue-50/60">
                  <div className="w-2 mt-1"><div className="w-2 h-2 rounded-full bg-blue-500" /></div>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 ${TYPE_CONFIG[type].bg}`}>
                    <TypeIcon t={type} size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-bold dark:text-white text-slate-900">{title || 'Başlık'}</p>
                      <p className="text-[10px] dark:text-slate-500 text-slate-400 font-mono">Az önce</p>
                    </div>
                    <p className="text-xs dark:text-slate-400 text-slate-500 leading-4">{body || 'Mesaj içeriği...'}</p>
                    <div className={`self-start mt-1.5 inline-flex px-2 py-0.5 rounded-full border text-[10px] font-semibold ${TYPE_CONFIG[type].bg} ${TYPE_CONFIG[type].color}`}>
                      {TYPE_CONFIG[type].label}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hedef özeti */}
            {(title || body) && (
              <div className="mt-8 dark:bg-slate-900 bg-white rounded-2xl border dark:border-slate-800 border-slate-200 p-4 max-w-sm">
                <p className="text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider mb-3">Gönderim Özeti</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs dark:text-slate-500 text-slate-400">Alıcı</span>
                    <span className="text-xs font-semibold dark:text-slate-200 text-slate-700 flex items-center gap-1">
                      {targetType === 'all' ? <><Users size={11} /> Tüm Kullanıcılar</> : <><User size={11} /> {selectedUser?.name || '—'}</>}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs dark:text-slate-500 text-slate-400">Tür</span>
                    <span className={`text-xs font-semibold ${TYPE_CONFIG[type].color}`}>{TYPE_CONFIG[type].label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs dark:text-slate-500 text-slate-400">Durum</span>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1"><Check size={11} /> Hazır</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditorNotification;
