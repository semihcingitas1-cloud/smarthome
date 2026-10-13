// src/pages/Editor/EditorSupport.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';

import EditorSidebar from '../../layout/EditorSidebar';

import {
  LifeBuoy, Sparkles, Search, Send, Clock, User, Package, Zap, CheckCircle2, Inbox
} from 'lucide-react';

// ───────── ÖRNEK VERİLER (API'ye bağlarken burayı değiştir) ─────────
const INITIAL_TICKETS = [
  {
    id: 'TK-1042', customer: 'Selin Aydın', email: 'selin@ornek.com', subject: 'Röle cihazı uygulamada görünmüyor',
    status: 'open', priority: 'high', order: 'SH-261013-482910', time: '10 dk önce', unread: true,
    messages: [
      { from: 'customer', text: 'Merhaba, aldığım röle cihazını uygulamaya ekleyemiyorum. Bluetooth taramasında görünmüyor.', time: '14:02' },
      { from: 'customer', text: 'Cihazın LED\'i yanıp sönüyor, bu normal mi?', time: '14:04' },
    ],
  },
  {
    id: 'TK-1041', customer: 'Burak Şahin', email: 'burak@ornek.com', subject: 'Siparişim ne zaman kargoya verilir?',
    status: 'open', priority: 'medium', order: 'SH-261012-120344', time: '42 dk önce', unread: true,
    messages: [
      { from: 'customer', text: 'Üç gün önce sipariş verdim, hâlâ hazırlanıyor görünüyor.', time: '13:20' },
    ],
  },
  {
    id: 'TK-1039', customer: 'Ayşe Çelik', email: 'ayse@ornek.com', subject: 'Fatura bilgisi güncelleme',
    status: 'pending', priority: 'low', order: 'SH-261011-774120', time: '2 sa önce', unread: false,
    messages: [
      { from: 'customer', text: 'Fatura bilgilerimi şirket adına değiştirmek istiyorum.', time: '11:45' },
      { from: 'editor', text: 'Merhaba, vergi numaranızı ve unvanınızı paylaşırsanız güncelleyebiliriz.', time: '12:10' },
    ],
  },
  {
    id: 'TK-1036', customer: 'Emre Koç', email: 'emre@ornek.com', subject: 'Kupon kodu çalışmıyor',
    status: 'resolved', priority: 'low', order: '-', time: 'Dün', unread: false,
    messages: [
      { from: 'customer', text: 'SMART10 kodunu girince geçersiz diyor.', time: 'Dün 16:30' },
      { from: 'editor', text: 'Bu kupon süresi dolduğu için kapatılmıştı. AKILLIEV20 kodunu deneyebilirsiniz.', time: 'Dün 16:48' },
      { from: 'customer', text: 'Teşekkürler, çalıştı!', time: 'Dün 17:02' },
    ],
  },
];

const QUICK_REPLIES = [
  'Merhaba, talebinizi inceliyoruz, kısa süre içinde dönüş yapacağız.',
  'Sorunu çözmek için cihazın seri numarasını paylaşabilir misiniz?',
  'Siparişiniz bugün kargoya verilecektir, takip numarası SMS ile iletilecek.',
];

const STATUS_META = {
  open:     { label: 'Açık',     cls: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' },
  pending:  { label: 'Beklemede', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' },
  resolved: { label: 'Çözüldü',  cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
};

const PRIORITY_META = {
  high:   { label: 'Yüksek', cls: 'text-red-500' },
  medium: { label: 'Orta',   cls: 'text-amber-500' },
  low:    { label: 'Düşük',  cls: 'text-gray-400 dark:text-slate-500' },
};

const inputCls =
  'w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all';

const cardCls = 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-sm';

const StatusBadge = ({ status }) => (
  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${STATUS_META[status].cls}`}>
    {STATUS_META[status].label}
  </span>
);

const initials = (name) => name.split(' ').map((w) => w[0]).join('');

const EditorSupport = () => {

  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [selectedId, setSelectedId] = useState(INITIAL_TICKETS[0].id);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [reply, setReply] = useState('');

  const threadEndRef = useRef(null);

  const selected = tickets.find((t) => t.id === selectedId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [selectedId, selected?.messages.length]);

  const counts = useMemo(() => ({
    all: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    pending: tickets.filter((t) => t.status === 'pending').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
  }), [tickets]);

  const filtered = tickets.filter((t) => {
    if (filter !== 'all' && t.status !== filter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [t.id, t.customer, t.subject].some((v) => v.toLowerCase().includes(q));
  });

  const openTicket = (id) => {
    setSelectedId(id);
    setReply('');
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, unread: false } : t)));
  };

  const setStatus = (status) =>
    setTickets((prev) => prev.map((t) => (t.id === selectedId ? { ...t, status } : t)));

  const sendReply = () => {
    const text = reply.trim();
    if (!text) return;
    const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    setTickets((prev) => prev.map((t) =>
      t.id === selectedId
        ? { ...t, status: t.status === 'open' ? 'pending' : t.status, messages: [...t.messages, { from: 'editor', text, time: now }] }
        : t
    ));
    setReply('');
  };

  const filterTabs = [
    { value: 'all', label: 'Tümü' },
    { value: 'open', label: 'Açık' },
    { value: 'pending', label: 'Beklemede' },
    { value: 'resolved', label: 'Çözüldü' },
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

              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl text-white shadow-md shadow-blue-500/20"><LifeBuoy size={28} /></div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-1.5"><Sparkles size={12} className="animate-pulse" /> Müşteri Hizmetleri</span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-0.5">Destek Talepleri</h1>
              </div>

            </div>

            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm md:text-right">Müşteri taleplerini görüntüleyin, yanıtlayın ve çözüme kavuşturun.</p>

          </div>

        </section>

        <section className="py-8 px-6 max-w-6xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

            {/* Sol: talep listesi */}
            <div className={`${cardCls} lg:col-span-2 overflow-hidden`}>

              <div className="p-4 space-y-3 border-b border-gray-100 dark:border-slate-800/60">

                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Talep no, müşteri veya konu ara"
                    className={`${inputCls} pl-10`}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {filterTabs.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setFilter(tab.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
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

              <div className="max-h-[560px] overflow-y-auto divide-y divide-gray-50 dark:divide-slate-800/40">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-16 text-gray-400 dark:text-slate-500">
                    <Inbox size={36} className="stroke-[1.2]" />
                    <p className="text-sm font-medium">Talep bulunamadı.</p>
                  </div>
                ) : filtered.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => openTicket(t.id)}
                    className={`w-full text-left p-4 flex items-start gap-3 transition-colors cursor-pointer ${
                      t.id === selectedId ? 'bg-blue-50/70 dark:bg-blue-950/20' : 'hover:bg-gray-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-black flex items-center justify-center">
                      {initials(t.customer)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold truncate flex items-center gap-1.5">
                          {t.customer}
                          {t.unread && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-slate-500 shrink-0">{t.time}</span>
                      </div>
                      <p className={`text-xs mt-0.5 truncate ${t.unread ? 'font-semibold text-gray-800 dark:text-slate-200' : 'text-gray-500 dark:text-slate-400'}`}>{t.subject}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <StatusBadge status={t.status} />
                        <span className={`text-xs font-bold ${PRIORITY_META[t.priority].cls}`}>● {PRIORITY_META[t.priority].label}</span>
                        <span className="text-xs font-mono text-gray-400 dark:text-slate-500 ml-auto">{t.id}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

            </div>

            {/* Sağ: yazışma */}
            <div className={`${cardCls} lg:col-span-3 overflow-hidden flex flex-col`}>

              {selected ? (
                <>
                  {/* Talep başlığı */}
                  <div className="p-5 border-b border-gray-100 dark:border-slate-800/60 space-y-3">

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{selected.id}</div>
                        <h2 className="text-lg font-black leading-tight mt-0.5">{selected.subject}</h2>
                      </div>
                      <select
                        value={selected.status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={`${inputCls} sm:w-40 cursor-pointer font-medium`}
                      >
                        {Object.entries(STATUS_META).map(([value, m]) => (
                          <option key={value} value={value}>{m.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-gray-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5"><User size={13} /> {selected.customer} • {selected.email}</span>
                      <span className="flex items-center gap-1.5"><Package size={13} /> Sipariş: <span className="font-mono">{selected.order}</span></span>
                      <span className="flex items-center gap-1.5"><Clock size={13} /> {selected.time}</span>
                    </div>

                  </div>

                  {/* Mesajlar */}
                  <div className="p-5 space-y-3 max-h-[380px] overflow-y-auto bg-gray-50/50 dark:bg-slate-950/30">
                    {selected.messages.map((m, i) => (
                      <div key={i} className={`flex ${m.from === 'editor' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          m.from === 'editor'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md'
                            : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-bl-md'
                        }`}>
                          {m.text}
                          <div className={`text-[10px] mt-1 text-right ${m.from === 'editor' ? 'text-white/70' : 'text-gray-400 dark:text-slate-500'}`}>{m.time}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={threadEndRef} />
                  </div>

                  {/* Yanıt alanı */}
                  <div className="p-5 border-t border-gray-100 dark:border-slate-800/60 space-y-3">

                    <div className="flex flex-wrap gap-2">
                      {QUICK_REPLIES.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => setReply(q)}
                          title={q}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          <Zap size={12} className="text-blue-500" /> Hazır yanıt {i + 1}
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) sendReply(); }}
                      rows={3}
                      placeholder="Yanıtınızı yazın... (Ctrl + Enter ile gönder)"
                      className={inputCls}
                    />

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={sendReply}
                        disabled={!reply.trim()}
                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 cursor-pointer text-sm"
                      >
                        <Send size={16} /> Yanıtla
                      </button>
                      {selected.status !== 'resolved' && (
                        <button
                          onClick={() => setStatus('resolved')}
                          className="sm:w-48 py-3 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                        >
                          <CheckCircle2 size={16} /> Çözüldü İşaretle
                        </button>
                      )}
                    </div>

                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 py-24 text-gray-400 dark:text-slate-500">
                  <LifeBuoy size={40} className="stroke-[1.2]" />
                  <p className="text-sm font-medium">Soldan bir talep seçin.</p>
                </div>
              )}

            </div>

          </div>

        </section>

      </div>

    </div>
  );
};

export default EditorSupport;
