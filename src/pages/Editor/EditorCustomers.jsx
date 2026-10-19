// src/pages/Editor/EditorCustomers.jsx
import React, { useEffect, useMemo, useState } from 'react';

import EditorSidebar from '../../layout/EditorSidebar';

import {
  Users, Sparkles, Search, X, Mail, Phone, MapPin, ShoppingBag, Wallet,
  UserPlus, BadgeCheck, Crown, Cpu, Calendar, StickyNote, Save, Inbox, CheckCircle2
} from 'lucide-react';

// ───────── ÖRNEK VERİLER (API'ye bağlarken burayı değiştir) ─────────
const CUSTOMERS = [
  {
    id: 'c1', name: 'Ahmet Yılmaz', email: 'ahmet@ornek.com', phone: '0532 111 22 33',
    city: 'Konya', joined: '2026-01-14', lastOrder: '2026-10-12', orders: 9, spent: 18450,
    verified: true, status: 'vip', devices: 14, note: 'Toplu alım yapıyor, kurumsal fatura isteyebilir.',
    addresses: [{ title: 'Ev', text: 'Selçuklu / Konya' }, { title: 'İş', text: 'Meram / Konya' }],
    recentOrders: [
      { no: 'SH-261012-482910', total: 3450, status: 'Kargoda', date: '2026-10-12' },
      { no: 'SH-260928-120344', total: 5200, status: 'Teslim Edildi', date: '2026-09-28' },
    ],
  },
  {
    id: 'c2', name: 'Elif Demir', email: 'elif@ornek.com', phone: '0533 222 33 44',
    city: 'İstanbul', joined: '2026-03-02', lastOrder: '2026-10-10', orders: 4, spent: 7320,
    verified: true, status: 'active', devices: 6, note: '',
    addresses: [{ title: 'Ev', text: 'Kadıköy / İstanbul' }],
    recentOrders: [
      { no: 'SH-261010-120344', total: 1890, status: 'Hazırlanıyor', date: '2026-10-10' },
      { no: 'SH-260905-774120', total: 2640, status: 'Teslim Edildi', date: '2026-09-05' },
    ],
  },
  {
    id: 'c3', name: 'Mehmet Kaya', email: 'mehmet@ornek.com', phone: '0535 333 44 55',
    city: 'Ankara', joined: '2026-05-21', lastOrder: '2026-09-30', orders: 3, spent: 9100,
    verified: true, status: 'active', devices: 8, note: 'Perde motoru montajı için arıyor.',
    addresses: [{ title: 'Ev', text: 'Çankaya / Ankara' }],
    recentOrders: [{ no: 'SH-260930-651203', total: 5200, status: 'Teslim Edildi', date: '2026-09-30' }],
  },
  {
    id: 'c4', name: 'Zeynep Arslan', email: 'zeynep@ornek.com', phone: '0536 444 55 66',
    city: 'İzmir', joined: '2026-10-08', lastOrder: '2026-10-09', orders: 1, spent: 980,
    verified: false, status: 'new', devices: 1, note: '',
    addresses: [{ title: 'Ev', text: 'Karşıyaka / İzmir' }],
    recentOrders: [{ no: 'SH-261009-330981', total: 980, status: 'Onaylandı', date: '2026-10-09' }],
  },
  {
    id: 'c5', name: 'Can Öztürk', email: 'can@ornek.com', phone: '0537 555 66 77',
    city: 'Bursa', joined: '2026-10-05', lastOrder: '2026-10-05', orders: 1, spent: 2640,
    verified: true, status: 'new', devices: 3, note: '',
    addresses: [{ title: 'Ev', text: 'Nilüfer / Bursa' }],
    recentOrders: [{ no: 'SH-261005-651203', total: 2640, status: 'Teslim Edildi', date: '2026-10-05' }],
  },
  {
    id: 'c6', name: 'Selin Aydın', email: 'selin@ornek.com', phone: '0538 666 77 88',
    city: 'Antalya', joined: '2026-02-11', lastOrder: '2026-04-18', orders: 2, spent: 3100,
    verified: true, status: 'inactive', devices: 4, note: 'Röle eşleştirme sorunu yaşamıştı.',
    addresses: [{ title: 'Ev', text: 'Muratpaşa / Antalya' }],
    recentOrders: [{ no: 'SH-260418-482910', total: 1550, status: 'Teslim Edildi', date: '2026-04-18' }],
  },
  {
    id: 'c7', name: 'Burak Şahin', email: 'burak@ornek.com', phone: '0539 777 88 99',
    city: 'Konya', joined: '2026-06-30', lastOrder: '2026-10-11', orders: 5, spent: 11800,
    verified: true, status: 'vip', devices: 12, note: '',
    addresses: [{ title: 'Ev', text: 'Karatay / Konya' }],
    recentOrders: [
      { no: 'SH-261011-120344', total: 4200, status: 'Hazırlanıyor', date: '2026-10-11' },
      { no: 'SH-260915-330981', total: 3300, status: 'Teslim Edildi', date: '2026-09-15' },
    ],
  },
  {
    id: 'c8', name: 'Ayşe Çelik', email: 'ayse@ornek.com', phone: '0530 888 99 00',
    city: 'Adana', joined: '2026-04-09', lastOrder: '2026-07-02', orders: 2, spent: 2750,
    verified: false, status: 'inactive', devices: 2, note: '',
    addresses: [{ title: 'Ev', text: 'Seyhan / Adana' }],
    recentOrders: [{ no: 'SH-260702-774120', total: 1400, status: 'Teslim Edildi', date: '2026-07-02' }],
  },
];

const STATUS_META = {
  vip:      { label: 'VIP',     cls: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400' },
  active:   { label: 'Aktif',   cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
  new:      { label: 'Yeni',    cls: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' },
  inactive: { label: 'Pasif',   cls: 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-300' },
};

const SORTS = [
  { value: 'recent', label: 'Son siparişe göre' },
  { value: 'spent',  label: 'Toplam harcamaya göre' },
  { value: 'orders', label: 'Sipariş sayısına göre' },
  { value: 'name',   label: 'İsme göre (A-Z)' },
];

const money = (n) => Number(n || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });
const formatDate = (d) => (d ? new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) : '-');
const initials = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2);

const inputCls =
  'w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all';

const cardCls = 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-sm';

const StatusBadge = ({ status }) => (
  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${STATUS_META[status].cls}`}>
    {STATUS_META[status].label}
  </span>
);

const Avatar = ({ name, size = 'w-9 h-9 text-xs' }) => (
  <div className={`${size} shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-black flex items-center justify-center`}>
    {initials(name)}
  </div>
);

const EditorCustomers = () => {

  const [customers, setCustomers] = useState(CUSTOMERS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recent');
  const [selectedId, setSelectedId] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  const selected = customers.find((c) => c.id === selectedId) || null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (selected) {
      setNoteDraft(selected.note || '');
      setNoteSaved(false);
    }
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const stats = useMemo(() => {
    const total = customers.length;
    const newOnes = customers.filter((c) => c.status === 'new').length;
    const vip = customers.filter((c) => c.status === 'vip').length;
    const revenue = customers.reduce((sum, c) => sum + c.spent, 0);
    return [
      { label: 'Toplam Müşteri',  value: total,           sub: 'kayıtlı kullanıcı',   icon: Users,    color: 'from-blue-500 to-purple-500' },
      { label: 'Yeni Müşteri',    value: newOnes,         sub: 'son 14 günde',        icon: UserPlus, color: 'from-emerald-500 to-teal-500' },
      { label: 'VIP Müşteri',     value: vip,             sub: '10.000 ₺ üzeri',      icon: Crown,    color: 'from-amber-500 to-orange-500' },
      { label: 'Toplam Harcama',  value: money(revenue),  sub: 'tüm müşteriler',      icon: Wallet,   color: 'from-pink-500 to-red-500' },
    ];
  }, [customers]);

  const counts = useMemo(() => ({
    all: customers.length,
    vip: customers.filter((c) => c.status === 'vip').length,
    active: customers.filter((c) => c.status === 'active').length,
    new: customers.filter((c) => c.status === 'new').length,
    inactive: customers.filter((c) => c.status === 'inactive').length,
  }), [customers]);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = customers.filter((c) => {
      if (filter !== 'all' && c.status !== filter) return false;
      if (!q) return true;
      return [c.name, c.email, c.phone, c.city].some((v) => v.toLowerCase().includes(q));
    });
    const sorters = {
      recent: (a, b) => new Date(b.lastOrder) - new Date(a.lastOrder),
      spent:  (a, b) => b.spent - a.spent,
      orders: (a, b) => b.orders - a.orders,
      name:   (a, b) => a.name.localeCompare(b.name, 'tr'),
    };
    return [...filtered].sort(sorters[sort]);
  }, [customers, search, filter, sort]);

  const saveNote = () => {
    setCustomers((prev) => prev.map((c) => (c.id === selectedId ? { ...c, note: noteDraft.trim() } : c)));
    setNoteSaved(true);
  };

  const filterTabs = [
    { value: 'all', label: 'Tümü' },
    { value: 'vip', label: 'VIP' },
    { value: 'active', label: 'Aktif' },
    { value: 'new', label: 'Yeni' },
    { value: 'inactive', label: 'Pasif' },
  ];

  return (

    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white transition-colors duration-300">

      <EditorSidebar />

      <div className="flex-1 overflow-y-auto">

        {/* Başlık */}
        <section className="relative pt-8 pb-6 px-6 border-b border-gray-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/40">

          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />

          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">

            <div className="flex items-center gap-4">

              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl text-white shadow-md shadow-blue-500/20"><Users size={28} /></div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-1.5"><Sparkles size={12} className="animate-pulse" /> Müşteri Yönetimi</span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-0.5">Müşteriler</h1>
              </div>

            </div>

            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm md:text-right">Müşteri bilgilerini, sipariş geçmişlerini ve notları tek yerden görüntüleyin.</p>

          </div>

        </section>

        <section className="py-8 px-6 max-w-6xl mx-auto space-y-6">

          {/* Özet kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className={`${cardCls} p-5 flex items-center gap-4`}>
                <div className={`p-3 rounded-2xl text-white bg-gradient-to-br ${s.color} shadow-md`}><s.icon size={22} /></div>
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">{s.label}</div>
                  <div className="text-2xl font-black leading-tight truncate">{s.value}</div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filtreler */}
          <div className={`${cardCls} p-5 space-y-4`}>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="İsim, e-posta, telefon veya şehir ara"
                  className={`${inputCls} pl-10`}
                />
              </div>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className={`${inputCls} md:w-60 cursor-pointer font-medium`}>
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              {filterTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    filter === tab.value
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab.label} <span className="opacity-70">({counts[tab.value]})</span>
                </button>
              ))}
            </div>

          </div>

          {/* Tablo */}
          <div className={`${cardCls} overflow-hidden`}>

            {list.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-20 text-gray-400 dark:text-slate-500">
                <div className="p-4 bg-gray-50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-slate-800/50"><Inbox size={40} className="stroke-[1.2]" /></div>
                <p className="text-sm font-medium">Müşteri bulunamadı.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-gray-500 dark:text-slate-400 border-b border-gray-100 dark:border-slate-800/60">
                      <th className="px-5 py-3 font-bold">Müşteri</th>
                      <th className="px-5 py-3 font-bold">Şehir</th>
                      <th className="px-5 py-3 font-bold">Sipariş</th>
                      <th className="px-5 py-3 font-bold">Harcama</th>
                      <th className="px-5 py-3 font-bold">Son Sipariş</th>
                      <th className="px-5 py-3 font-bold">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedId(c.id)}
                        className="border-b border-gray-50 dark:border-slate-800/40 hover:bg-gray-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={c.name} />
                            <div className="min-w-0">
                              <div className="font-semibold flex items-center gap-1.5 whitespace-nowrap">
                                {c.name}
                                {c.verified && <BadgeCheck size={14} className="text-blue-500 shrink-0" />}
                              </div>
                              <div className="text-xs text-gray-400 dark:text-slate-500">{c.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-500 dark:text-slate-400 whitespace-nowrap">{c.city}</td>
                        <td className="px-5 py-4 font-bold">{c.orders}</td>
                        <td className="px-5 py-4 font-bold whitespace-nowrap">{money(c.spent)}</td>
                        <td className="px-5 py-4 text-gray-500 dark:text-slate-400 whitespace-nowrap">{formatDate(c.lastOrder)}</td>
                        <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="px-5 py-3 border-t border-gray-100 dark:border-slate-800/60 text-xs text-gray-500 dark:text-slate-400">
              {list.length} müşteri gösteriliyor
            </div>

          </div>

        </section>

      </div>

      {/* Detay penceresi */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedId(null)}>

          <div
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 p-5 border-b border-gray-100 dark:border-slate-800/60 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={selected.name} size="w-12 h-12 text-sm" />
                <div className="min-w-0">
                  <div className="font-black text-lg flex items-center gap-1.5 truncate">
                    {selected.name}
                    {selected.verified && <BadgeCheck size={16} className="text-blue-500 shrink-0" />}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1.5">
                    <Calendar size={11} /> {formatDate(selected.joined)} tarihinde katıldı
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={selected.status} />
                <button onClick={() => setSelectedId(null)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"><X size={18} /></button>
              </div>
            </div>

            <div className="p-5 md:p-6 space-y-6">

              {/* Mini istatistikler */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Sipariş', value: selected.orders, icon: ShoppingBag },
                  { label: 'Harcama', value: money(selected.spent), icon: Wallet },
                  { label: 'Cihaz', value: selected.devices, icon: Cpu },
                ].map((s) => (
                  <div key={s.label} className="p-3.5 bg-gray-50 dark:bg-slate-800/40 rounded-2xl text-center">
                    <s.icon size={16} className="mx-auto text-blue-500 mb-1" />
                    <div className="text-base font-black">{s.value}</div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* İletişim */}
              <div className="p-4 bg-gray-50 dark:bg-slate-800/40 rounded-2xl space-y-2 text-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">İletişim</h4>
                <a href={`mailto:${selected.email}`} className="flex items-center gap-2 hover:text-blue-500 transition-colors"><Mail size={14} className="text-gray-400" /> {selected.email}</a>
                <a href={`tel:${selected.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-blue-500 transition-colors"><Phone size={14} className="text-gray-400" /> {selected.phone}</a>
                <div className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> {selected.city}</div>
              </div>

              {/* Adresler */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-3">Kayıtlı Adresler</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selected.addresses.map((a, i) => (
                    <div key={i} className="p-3.5 border border-gray-100 dark:border-slate-800/60 rounded-2xl text-sm">
                      <div className="font-bold">{a.title}</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{a.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Son siparişler */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-3">Son Siparişler</h4>
                <div className="border border-gray-100 dark:border-slate-800/60 rounded-2xl divide-y divide-gray-100 dark:divide-slate-800/60">
                  {selected.recentOrders.map((o) => (
                    <div key={o.no} className="flex items-center justify-between gap-3 p-3.5 text-sm">
                      <div>
                        <div className="font-mono font-bold text-blue-600 dark:text-blue-400">{o.no}</div>
                        <div className="text-xs text-gray-400 dark:text-slate-500">{formatDate(o.date)} • {o.status}</div>
                      </div>
                      <div className="font-bold whitespace-nowrap">{money(o.total)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Not */}
              <div className="p-5 border border-gray-200 dark:border-slate-800 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold flex items-center gap-2"><StickyNote size={16} className="text-blue-500" /> Müşteri Notu</h4>
                <textarea
                  value={noteDraft}
                  onChange={(e) => { setNoteDraft(e.target.value); setNoteSaved(false); }}
                  rows={3}
                  maxLength={500}
                  placeholder="Bu müşteriyle ilgili iç not ekleyin (müşteri görmez)..."
                  className={inputCls}
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1.5">
                    {noteSaved ? <><CheckCircle2 size={12} className="text-emerald-500" /> Not kaydedildi</> : `${noteDraft.length}/500`}
                  </span>
                  <button
                    onClick={saveNote}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-md shadow-blue-500/10 cursor-pointer"
                  >
                    <Save size={15} /> Notu Kaydet
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default EditorCustomers;
