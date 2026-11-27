// src/pages/Editor/EditorReports.jsx
import React, { useEffect, useMemo, useState } from 'react';

import EditorSidebar from '../../layout/EditorSidebar';

import {
  FileText, Sparkles, CalendarDays, Package, LifeBuoy, Wallet, Send, Save,
  CheckCircle2, AlertCircle, MessageSquareWarning, Clock, Eye, PenLine
} from 'lucide-react';

// ───────── ÖRNEK VERİLER (API'ye bağlarken burayı değiştir) ─────────
const WEEK_STATS = [
  { label: 'İşlenen Sipariş', value: '47',      icon: Package,  color: 'from-amber-500 to-orange-500' },
  { label: 'Çözülen Talep',   value: '23',      icon: LifeBuoy, color: 'from-blue-500 to-purple-500' },
  { label: 'Haftalık Ciro',   value: '₺96.300', icon: Wallet,   color: 'from-emerald-500 to-teal-500' },
];

const INITIAL_REPORTS = [
  {
    id: 'R-2610-W2', weekLabel: '28 Eylül - 4 Ekim', status: 'approved', submittedAt: '4 Eki 2026',
    completed: 'Yeni röle modülü ürün sayfaları güncellendi. 41 sipariş zamanında kargolandı.',
    issues: 'Kargo firmasında iki gün gecikme yaşandı.',
    plan: 'Stok sayımı yapılacak, kupon kampanyası hazırlanacak.',
    notes: '',
    adminNote: 'Teşekkürler, kargo gecikmesini firmaya ilettik.',
  },
  {
    id: 'R-2610-W1', weekLabel: '21 - 27 Eylül', status: 'revision', submittedAt: '27 Eyl 2026',
    completed: 'Destek talepleri yanıtlandı.',
    issues: 'Bazı müşteriler cihaz eşleştirmede sorun yaşadı.',
    plan: 'Eşleştirme rehberi hazırlanacak.',
    notes: '',
    adminNote: 'Hangi cihaz modelinde sorun olduğunu ve kaç müşteriyi etkilediğini ekleyip tekrar gönderin.',
  },
  {
    id: 'R-2609-W4', weekLabel: '14 - 20 Eylül', status: 'submitted', submittedAt: '20 Eyl 2026',
    completed: '38 sipariş işlendi, 3 iade talebi sonuçlandırıldı.',
    issues: 'Yok.',
    plan: 'Yeni ürün fotoğrafları yüklenecek.',
    notes: 'Haftaya izinliyim.',
    adminNote: '',
  },
];

const STATUS_META = {
  draft:     { label: 'Taslak',          cls: 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-300' },
  submitted: { label: 'İncelemede',      cls: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' },
  approved:  { label: 'Onaylandı',       cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
  revision:  { label: 'Düzeltme İstendi', cls: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' },
};

const FIELDS = [
  { key: 'completed', label: 'Bu hafta yapılanlar',  placeholder: 'Tamamladığınız işleri yazın...', required: true,  rows: 4 },
  { key: 'issues',    label: 'Karşılaşılan sorunlar', placeholder: 'Yaşadığınız sorunlar, geciken işler (yoksa "Yok" yazın)...', required: true, rows: 3 },
  { key: 'plan',      label: 'Gelecek hafta planı',  placeholder: 'Önümüzdeki hafta yapmayı planladıklarınız...', required: true, rows: 3 },
  { key: 'notes',     label: 'Ek notlar (isteğe bağlı)', placeholder: 'İzin, talep, öneri gibi eklemek istedikleriniz...', required: false, rows: 2 },
];

const EMPTY_FORM = { completed: '', issues: '', plan: '', notes: '' };

const inputCls =
  'w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all';

const cardCls = 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-sm';

const StatusBadge = ({ status }) => (
  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${STATUS_META[status].cls}`}>
    {STATUS_META[status].label}
  </span>
);

// Haftanın pazartesi - pazar aralığı
const getWeekRange = (date = new Date()) => {
  const offset = (date.getDay() + 6) % 7;
  const start = new Date(date);
  start.setDate(date.getDate() - offset);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
};

const fmt = (d, withYear = false) =>
  d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', ...(withYear ? { year: 'numeric' } : {}) });

const EditorReports = () => {

  const { start, end } = useMemo(() => getWeekRange(), []);
  const currentWeekLabel = `${fmt(start)} - ${fmt(end)}`;
  const currentWeekId = `R-${start.toISOString().slice(0, 10)}`;

  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [form, setForm] = useState(EMPTY_FORM);
  const [viewingId, setViewingId] = useState(null); // null = bu haftanın formu
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState('');

  const viewing = reports.find((r) => r.id === viewingId) || null;
  const currentSubmitted = reports.find((r) => r.id === currentWeekId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const updateField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError('');
    setSavedAt('');
  };

  const timeNow = () => new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  const saveDraft = () => {
    setSavedAt(timeNow());
  };

  const submitReport = () => {
    const missing = FIELDS.find((f) => f.required && form[f.key].trim().length < 3);
    if (missing) {
      setError(`"${missing.label}" alanı boş bırakılamaz.`);
      return;
    }
    setReports((prev) => [
      {
        id: currentWeekId,
        weekLabel: currentWeekLabel,
        status: 'submitted',
        submittedAt: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }),
        ...form,
        adminNote: '',
      },
      ...prev,
    ]);
    setForm(EMPTY_FORM);
    setError('');
    setSavedAt('');
  };

  // Düzeltme istenen raporu forma geri yükle
  const reviseReport = (report) => {
    setForm({ completed: report.completed, issues: report.issues, plan: report.plan, notes: report.notes });
    setReports((prev) => prev.filter((r) => r.id !== report.id));
    setViewingId(null);
  };

  const filledCount = FIELDS.filter((f) => form[f.key].trim()).length;

  return (

    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white transition-colors duration-300">

      <EditorSidebar />

      <div className="flex-1 overflow-y-auto">

        {/* Başlık */}
        <section className="relative pt-8 pb-6 px-6 border-b border-gray-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/40">

          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />

          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">

            <div className="flex items-center gap-4">

              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl text-white shadow-md shadow-blue-500/20"><FileText size={28} /></div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-1.5"><Sparkles size={12} className="animate-pulse" /> Haftalık Raporlama</span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-0.5">Raporlarım</h1>
              </div>

            </div>

            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm md:text-right">Haftalık çalışma raporunuzu yazın, gönderin ve yönetici geri bildirimlerini takip edin.</p>

          </div>

        </section>

        <section className="py-8 px-6 max-w-6xl mx-auto space-y-6">

          {/* Haftalık otomatik özet */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {WEEK_STATS.map((s) => (
              <div key={s.label} className={`${cardCls} p-5 flex items-center gap-4`}>
                <div className={`p-3 rounded-2xl text-white bg-gradient-to-br ${s.color} shadow-md`}><s.icon size={22} /></div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">{s.label}</div>
                  <div className="text-2xl font-black leading-tight">{s.value}</div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">Bu hafta (otomatik)</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

            {/* Sol: form veya seçilen rapor */}
            <div className={`${cardCls} lg:col-span-3 p-5 md:p-6 space-y-5`}>

              {viewing ? (
                <>
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100 dark:border-slate-800/60">
                    <div>
                      <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{viewing.id}</div>
                      <h3 className="text-lg font-black flex items-center gap-2 mt-0.5"><CalendarDays size={18} className="text-blue-500" /> {viewing.weekLabel}</h3>
                      <div className="text-xs text-gray-400 dark:text-slate-500 mt-1">Gönderim: {viewing.submittedAt}</div>
                    </div>
                    <StatusBadge status={viewing.status} />
                  </div>

                  {viewing.adminNote && (
                    <div className={`flex items-start gap-2 p-4 rounded-2xl text-sm border ${
                      viewing.status === 'revision'
                        ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-400'
                        : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400'
                    }`}>
                      <MessageSquareWarning size={16} className="mt-0.5 shrink-0" />
                      <div><strong>Yönetici notu:</strong> {viewing.adminNote}</div>
                    </div>
                  )}

                  {FIELDS.map((f) => (
                    viewing[f.key] ? (
                      <div key={f.key}>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">{f.label}</h4>
                        <p className="text-sm leading-relaxed p-4 bg-gray-50 dark:bg-slate-800/40 rounded-2xl whitespace-pre-wrap">{viewing[f.key]}</p>
                      </div>
                    ) : null
                  ))}

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={() => setViewingId(null)}
                      className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition-all cursor-pointer"
                    >
                      Bu Haftanın Formuna Dön
                    </button>
                    {viewing.status === 'revision' && (
                      <button
                        onClick={() => reviseReport(viewing)}
                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 cursor-pointer"
                      >
                        <PenLine size={16} /> Düzelt ve Tekrar Gönder
                      </button>
                    )}
                  </div>
                </>
              ) : currentSubmitted ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl text-emerald-500"><CheckCircle2 size={40} className="stroke-[1.5]" /></div>
                  <h3 className="text-lg font-black">Bu haftanın raporu gönderildi</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 max-w-xs">{currentWeekLabel} haftası için raporunuz yönetici incelemesine alındı. Sağdaki listeden görüntüleyebilirsiniz.</p>
                  <button
                    onClick={() => setViewingId(currentSubmitted.id)}
                    className="mt-2 px-5 py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Eye size={16} /> Raporu Görüntüle
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100 dark:border-slate-800/60">
                    <div>
                      <h3 className="text-lg font-black flex items-center gap-2"><PenLine size={18} className="text-blue-500" /> Yeni Haftalık Rapor</h3>
                      <div className="text-xs text-gray-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                        <CalendarDays size={12} /> {fmt(start, true)} - {fmt(end, true)}
                      </div>
                    </div>
                    <StatusBadge status="draft" />
                  </div>

                  {FIELDS.map((f) => (
                    <div key={f.key}>
                      <label className="text-xs font-bold mb-2 text-gray-600 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>{f.label}{f.required && <span className="text-red-500"> *</span>}</span>
                        <span className="font-mono normal-case text-gray-400 dark:text-slate-500">{form[f.key].length}/1000</span>
                      </label>
                      <textarea
                        value={form[f.key]}
                        onChange={(e) => updateField(f.key, e.target.value)}
                        maxLength={1000}
                        rows={f.rows}
                        placeholder={f.placeholder}
                        className={inputCls}
                      />
                    </div>
                  ))}

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl text-xs text-red-700 dark:text-red-400">
                      <AlertCircle size={14} /> {error}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                    <span className="text-xs text-gray-400 dark:text-slate-500 sm:mr-auto flex items-center gap-1.5">
                      {savedAt ? <><CheckCircle2 size={12} className="text-emerald-500" /> Taslak {savedAt} saatinde kaydedildi</> : `${filledCount}/${FIELDS.length} alan dolu`}
                    </span>
                    <button
                      onClick={saveDraft}
                      className="sm:w-44 py-3 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Save size={16} /> Taslak Kaydet
                    </button>
                    <button
                      onClick={submitReport}
                      className="sm:w-44 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 cursor-pointer"
                    >
                      <Send size={16} /> Raporu Gönder
                    </button>
                  </div>
                </>
              )}

            </div>

            {/* Sağ: geçmiş raporlar */}
            <div className={`${cardCls} lg:col-span-2 overflow-hidden`}>

              <div className="p-5 border-b border-gray-100 dark:border-slate-800/60">
                <h3 className="text-base font-bold flex items-center gap-2"><Clock className="text-blue-500" size={18} /> Geçmiş Raporlar</h3>
              </div>

              <div className="max-h-[640px] overflow-y-auto divide-y divide-gray-50 dark:divide-slate-800/40">
                {reports.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setViewingId(r.id)}
                    className={`w-full text-left p-4 transition-colors cursor-pointer ${
                      r.id === viewingId ? 'bg-blue-50/70 dark:bg-blue-950/20' : 'hover:bg-gray-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold">{r.weekLabel}</span>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1.5 line-clamp-2">{r.completed}</p>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-400 dark:text-slate-500">
                      <span className="font-mono">{r.id}</span>
                      <span>{r.submittedAt}</span>
                    </div>
                    {r.status === 'revision' && (
                      <div className="mt-2 text-xs font-semibold text-red-500 flex items-center gap-1"><MessageSquareWarning size={12} /> Yönetici düzeltme istedi</div>
                    )}
                  </button>
                ))}
              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
};

export default EditorReports;
