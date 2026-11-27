// src/pages/Editor/EditorDashboard.jsx
import React, { useEffect, useState } from 'react';

import EditorSidebar from '../../layout/EditorSidebar';

import {
  LayoutDashboard, Sparkles, Package, Wallet, AlertTriangle, MessageSquare,
  Ticket, ShoppingBag, Plus, ArrowUpRight, TrendingUp, Clock, Mail
} from 'lucide-react';

// ───────── ÖRNEK VERİLER (API'ye bağlarken burayı değiştir) ─────────
const STATS = [
  { label: 'Bekleyen Sipariş', value: '12',      sub: '+3 bugün',          icon: Package,       color: 'from-amber-500 to-orange-500' },
  { label: 'Bugünkü Ciro',     value: '₺18.450', sub: '+12% dünden',       icon: Wallet,        color: 'from-emerald-500 to-teal-500' },
  { label: 'Düşük Stok',       value: '5',       sub: 'ürün azaldı',       icon: AlertTriangle, color: 'from-red-500 to-pink-500' },
  { label: 'Yeni Mesaj',       value: '8',       sub: '3 yanıt bekliyor',  icon: MessageSquare, color: 'from-blue-500 to-purple-500' },
];

const RECENT_ORDERS = [
  { no: 'SH-261013-482910', customer: 'Ahmet Yılmaz', total: 3450, status: 'pending' },
  { no: 'SH-261013-120344', customer: 'Elif Demir',   total: 1890, status: 'preparing' },
  { no: 'SH-261012-774120', customer: 'Mehmet Kaya',  total: 5200, status: 'shipped' },
  { no: 'SH-261012-330981', customer: 'Zeynep Arslan', total: 980,  status: 'delivered' },
  { no: 'SH-261012-651203', customer: 'Can Öztürk',   total: 2640, status: 'confirmed' },
];

const PRODUCTS = [
  { name: 'Mini Röle Tek Kanal',  stock: 4,   max: 100 },
  { name: 'Stor Perde Modülü',    stock: 9,   max: 100 },
  { name: 'Su Sensörü',           stock: 23,  max: 100 },
  { name: 'Mini Röle İki Kanal',  stock: 58,  max: 100 },
  { name: 'Akıllı Priz',          stock: 84,  max: 100 },
];

const COUPONS = [
  { code: 'AKILLIEV20',  percent: 20, used: 34, active: true },
  { code: 'SMARTHOME15', percent: 15, used: 21, active: true },
  { code: 'SMART10',     percent: 10, used: 67, active: false },
];

const MESSAGES = [
  { name: 'Selin Aydın',  text: 'Röle cihazım uygulamada görünmüyor, yardımcı olur musunuz?', time: '10 dk', unread: true },
  { name: 'Burak Şahin',  text: 'Siparişim ne zaman kargoya verilir?',                       time: '42 dk', unread: true },
  { name: 'Ayşe Çelik',   text: 'Fatura bilgilerimi güncellemek istiyorum.',                 time: '2 sa',  unread: false },
  { name: 'Emre Koç',     text: 'Kupon kodu çalışmıyor.',                                    time: '5 sa',  unread: false },
];

const STATUS_META = {
  pending:   { label: 'Bekliyor',     cls: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' },
  confirmed: { label: 'Onaylandı',    cls: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' },
  preparing: { label: 'Hazırlanıyor', cls: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400' },
  shipped:   { label: 'Kargoda',      cls: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400' },
  delivered: { label: 'Teslim Edildi', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
};

const money = (n) => Number(n).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });

const cardCls = 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm';

const CardTitle = ({ icon: Icon, title, action }) => (
  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-slate-800/60">
    <h3 className="text-base font-bold flex items-center gap-2"><Icon className="text-blue-500" size={18} /> {title}</h3>
    {action && (
      <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer">
        {action} <ArrowUpRight size={12} />
      </button>
    )}
  </div>
);

const EditorDashboard = () => {

  const [coupons, setCoupons] = useState(COUPONS);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleCoupon = (code) =>
    setCoupons((prev) => prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c)));

  const stockColor = (stock) =>
    stock <= 10 ? 'bg-red-500' : stock <= 30 ? 'bg-amber-500' : 'bg-emerald-500';

  const quickActions = [
    { label: 'Yeni Ürün',   icon: Plus },
    { label: 'Yeni Kupon',  icon: Ticket },
    { label: 'Siparişler',  icon: ShoppingBag },
    { label: 'Mesajlar',    icon: Mail },
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

              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl text-white shadow-md shadow-blue-500/20"><LayoutDashboard size={28} /></div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-1.5"><Sparkles size={12} className="animate-pulse" /> Editör Paneli</span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-0.5">Genel Bakış</h1>
              </div>

            </div>

            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm md:text-right">Siparişleri, ürünleri, kuponları ve müşteri mesajlarını tek ekrandan takip edin.</p>

          </div>

        </section>

        <section className="py-8 px-6 max-w-6xl mx-auto space-y-6">

          {/* İstatistik kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className={`${cardCls} flex items-center gap-4`}>
                <div className={`p-3 rounded-2xl text-white bg-gradient-to-br ${s.color} shadow-md`}><s.icon size={22} /></div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">{s.label}</div>
                  <div className="text-2xl font-black leading-tight">{s.value}</div>
                  <div className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1"><TrendingUp size={11} /> {s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Hızlı işlemler */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((a) => (
              <button
                key={a.label}
                className="flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/10 transition-all cursor-pointer"
              >
                <a.icon size={16} /> {a.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

            {/* Sol: siparişler + ürünler */}
            <div className="lg:col-span-2 space-y-6">

              <div className={cardCls}>
                <CardTitle icon={Package} title="Son Siparişler" action="Tümünü Gör" />
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wider text-gray-500 dark:text-slate-400">
                        <th className="pb-3 font-bold">Sipariş No</th>
                        <th className="pb-3 font-bold">Müşteri</th>
                        <th className="pb-3 font-bold">Tutar</th>
                        <th className="pb-3 font-bold">Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RECENT_ORDERS.map((o) => (
                        <tr key={o.no} className="border-t border-gray-50 dark:border-slate-800/40 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
                          <td className="py-3.5 pr-3 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">{o.no}</td>
                          <td className="py-3.5 pr-3 font-semibold whitespace-nowrap">{o.customer}</td>
                          <td className="py-3.5 pr-3 font-bold whitespace-nowrap">{money(o.total)}</td>
                          <td className="py-3.5">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${STATUS_META[o.status].cls}`}>{STATUS_META[o.status].label}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={cardCls}>
                <CardTitle icon={ShoppingBag} title="Ürün Stok Durumu" action="Ürünleri Yönet" />
                <div className="space-y-4">
                  {PRODUCTS.map((p) => (
                    <div key={p.name}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="font-semibold">{p.name}</span>
                        <span className={`text-xs font-bold ${p.stock <= 10 ? 'text-red-500' : 'text-gray-500 dark:text-slate-400'}`}>
                          {p.stock} adet {p.stock <= 10 && '• Kritik'}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                        <div className={`h-full rounded-full ${stockColor(p.stock)} transition-all`} style={{ width: `${(p.stock / p.max) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Sağ: kuponlar + mesajlar */}
            <div className="space-y-6">

              <div className={cardCls}>
                <CardTitle icon={Ticket} title="Kupon Kodları" action="Yönet" />
                <div className="space-y-3">
                  {coupons.map((c) => (
                    <div key={c.code} className="flex items-center justify-between gap-3 p-3.5 bg-gray-50 dark:bg-slate-800/40 rounded-2xl">
                      <div>
                        <div className="font-mono font-black text-sm tracking-wide">{c.code}</div>
                        <div className="text-xs text-gray-500 dark:text-slate-400">%{c.percent} indirim • {c.used} kullanım</div>
                      </div>
                      <button
                        onClick={() => toggleCoupon(c.code)}
                        aria-label={`${c.code} durumunu değiştir`}
                        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${c.active ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-slate-700'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${c.active ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={cardCls}>
                <CardTitle icon={MessageSquare} title="Müşteri Mesajları" action="Tümü" />
                <div className="space-y-3">
                  {MESSAGES.map((m) => (
                    <div key={m.name} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
                      <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-black flex items-center justify-center">
                        {m.name.split(' ').map((w) => w[0]).join('')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold truncate flex items-center gap-1.5">
                            {m.name}
                            {m.unread && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1 shrink-0"><Clock size={10} /> {m.time}</span>
                        </div>
                        <p className={`text-xs mt-0.5 line-clamp-2 ${m.unread ? 'text-gray-700 dark:text-slate-300 font-medium' : 'text-gray-500 dark:text-slate-400'}`}>{m.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
};

export default EditorDashboard;
