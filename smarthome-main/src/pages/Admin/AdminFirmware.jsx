import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";

import { getLatestFirmware, publishFirmware, resetPublishStatus } from "../../redux/admin/firmwareSlice";

import AdminSidebar from '../../layout/AdminSidebar';

import { Plus, Search, Filter, Eye, Cpu, CheckCircle, AlertTriangle, RefreshCw, LayoutGrid, LayoutList, Upload, X, Copy, Check, Zap, Columns, Thermometer, Droplets, Flame, Activity, Layers, Clock } from 'lucide-react';

// Backend'deki DEVICE_TYPES ile aynı sırada olmalı.
const DEVICE_TYPES = [
  { value: 'relay',         label: 'Röle',             icon: Zap },
  { value: 'curtain',       label: 'Perde',            icon: Columns },
  { value: 'boiler',        label: 'Kombi',            icon: Thermometer },
  { value: 'water_sensor',  label: 'Su Sensörü',       icon: Droplets },
  { value: 'gas_sensor',    label: 'Gaz Sensörü',      icon: Flame },
  { value: 'motion_sensor', label: 'Hareket Sensörü',  icon: Activity },
];

const TYPE_MAP = Object.fromEntries(DEVICE_TYPES.map(t => [t.value, t]));
const VERSION_REGEX = /^v?\d+\.\d+\.\d+$/;

const formatDate = (d) => d ? new Date(d).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

const StatCard = ({ icon: Icon, label, value, sub, accent }) => (

  <div className="rounded-2xl border p-5 flex items-start gap-4 transition-all hover:-translate-y-0.5 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700 bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md">

    <div className={`p-2.5 rounded-xl ${accent}`}><Icon size={20} className="text-white" /></div>

    <div className="min-w-0">

      <p className="text-xs font-semibold uppercase tracking-wider mb-1 dark:text-slate-500 text-slate-400">{label}</p>
      <p className="text-2xl font-black tracking-tight dark:text-white text-slate-900 truncate">{value}</p>
      {sub && <p className="text-xs mt-0.5 dark:text-slate-500 text-slate-400">{sub}</p>}

    </div>

  </div>
);

const StatusBadge = ({ published }) => {

  if (!published)

    return (

      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20"><AlertTriangle size={11} /> Yayınlanmadı</span>
    );

  return (

    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"><CheckCircle size={11} /> Yayında</span>
  );
};

const CopyButton = ({ text, className = '' }) => {

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error('Kopyalanamadı:', e);
    }
  };

  return (

    <button onClick={handleCopy} title="URL'yi kopyala" className={`p-2 rounded-xl transition-all dark:hover:bg-blue-500/10 dark:text-slate-500 dark:hover:text-blue-400 hover:bg-blue-50 text-slate-400 hover:text-blue-500 ${className}`}>
      {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
    </button>
  );
};

const inputClass = "w-full rounded-xl px-3.5 py-2.5 text-sm border outline-none transition-colors dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:placeholder:text-slate-600 dark:focus:border-blue-500/60 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400";

const PublishModal = ({ initialType, currentVersion, loading, error, onSubmit, onCancel }) => {

  const [deviceType, setDeviceType] = useState(initialType || DEVICE_TYPES[0].value);
  const [version, setVersion] = useState('');
  const [url, setUrl] = useState('');
  const [releaseNotes, setReleaseNotes] = useState('');
  const [localError, setLocalError] = useState('');

  const isHttps = url.trim().toLowerCase().startsWith('https://');

  const handleSubmit = () => {

    const v = version.trim();
    const u = url.trim();

    if (!v) return setLocalError('Sürüm gerekli.');
    if (!VERSION_REGEX.test(v)) return setLocalError('Sürüm formatı v1.4.0 gibi olmalı.');
    if (!u) return setLocalError('Firmware URL gerekli.');

    try {
      const parsed = new URL(u);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
    } catch {
      return setLocalError('Geçerli bir http:// veya https:// adresi girin.');
    }

    setLocalError('');
    onSubmit({ deviceType, version: v, url: u, releaseNotes: releaseNotes.trim() || null });
  };

  const labelClass = "block text-xs font-bold uppercase tracking-wider mb-1.5 dark:text-slate-500 text-slate-400";

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative rounded-2xl border p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto dark:bg-slate-900 dark:border-slate-700 bg-white border-slate-200">

        <div className="flex items-center justify-between mb-5">

          <div className="flex items-center gap-3">

            <div className="p-2 rounded-xl bg-blue-500/10"><Upload size={20} className="text-blue-500" /></div>
            <h3 className="font-bold text-base dark:text-white text-slate-900">Yeni Firmware Yayınla</h3>

          </div>

          <button onClick={onCancel} className="p-2 rounded-xl transition-colors dark:hover:bg-slate-800 dark:text-slate-400 hover:bg-slate-100 text-slate-500"><X size={18} /></button>

        </div>

        <div className="space-y-4">

          <div>

            <label className={labelClass}>Cihaz Tipi</label>

            <select value={deviceType} onChange={e => setDeviceType(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
              {DEVICE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>

            {currentVersion && (
              <p className="text-xs mt-1.5 dark:text-slate-500 text-slate-400">Şu anki yayındaki sürüm: <span className="font-mono font-bold dark:text-slate-300 text-slate-700">{currentVersion}</span></p>
            )}

          </div>

          <div>

            <label className={labelClass}>Sürüm</label>
            <input type="text" value={version} onChange={e => setVersion(e.target.value)} placeholder="v1.5.0" className={`${inputClass} font-mono`} />
            <p className="text-xs mt-1.5 dark:text-slate-500 text-slate-400">Cihazın bildirdiği <span className="font-mono">firmwareVersion</span> ile aynı biçimde yazın.</p>

          </div>

          <div>

            <label className={labelClass}>Firmware URL (.bin)</label>
            <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="http://sunucu/firmware/relay-v1.5.0.bin" className={`${inputClass} font-mono`} />

            {isHttps && (
              <p className="text-xs mt-1.5 text-amber-500 flex items-start gap-1.5"><AlertTriangle size={12} className="mt-0.5 shrink-0" /> Cihaz kodu şu an düz HTTP ile indiriyor. https:// adresi cihazda bağlantı hatası verir.</p>
            )}

          </div>

          <div>

            <label className={labelClass}>Sürüm Notları (opsiyonel)</label>
            <textarea rows={4} value={releaseNotes} onChange={e => setReleaseNotes(e.target.value)} placeholder="Bu sürümde neler değişti?" className={`${inputClass} resize-none`} />

          </div>

          {(localError || error) && (
            <div className="rounded-xl p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-500 flex items-start gap-2"><AlertTriangle size={15} className="mt-0.5 shrink-0" /> {localError || error}</div>
          )}

        </div>

        <div className="flex gap-2 mt-6">

          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200">
            İptal
          </button>

          <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <RefreshCw size={14} className="animate-spin" />} Yayınla
          </button>

        </div>

      </div>

    </div>
  );
};

const FirmwareDrawer = ({ item, onClose, onPublish }) => {

  if (!item) return null;

  const Icon = item.icon;

  return (

    <div className="fixed inset-0 z-50 flex justify-end">

      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md h-full overflow-y-auto shadow-2xl flex flex-col dark:bg-slate-900 dark:border-slate-800 bg-white border-l border-slate-200">

        <div className="sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between dark:bg-slate-900/90 dark:border-slate-800 bg-white/90 backdrop-blur border-slate-200">

          <h2 className="font-bold text-base dark:text-white text-slate-900">Firmware Detayı</h2>

          <button onClick={onClose} className="p-2 rounded-xl transition-colors dark:hover:bg-slate-800 dark:text-slate-400 hover:bg-slate-100 text-slate-500"><X size={18} /></button>

        </div>

        <div className="mx-6 mt-6 rounded-2xl overflow-hidden aspect-video flex items-center justify-center dark:bg-slate-950 dark:border-slate-800 bg-slate-50 border border-slate-200">
          <Icon size={40} className="dark:text-slate-700 text-slate-300" />
        </div>

        <div className="px-6 py-5 flex-1 space-y-5">

          <div>

            <span className="text-xs font-bold uppercase tracking-wider dark:text-slate-500 text-slate-400">Cihaz Tipi</span>
            <h3 className="mt-1 text-lg font-bold leading-snug dark:text-white text-slate-900">{item.label}</h3>

          </div>

          <div className="grid grid-cols-2 gap-3">

            {[
              { l: 'Tip Kodu', v: item.deviceType },
              { l: 'Sürüm', v: item.version || '—' },
            ].map(({ l, v }) => ( <div key={l} className="rounded-xl p-3 dark:bg-slate-800 bg-slate-50 border dark:border-slate-700 border-slate-200">

              <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5 dark:text-slate-500 text-slate-400">{l}</p>
              <p className="text-sm font-semibold font-mono truncate dark:text-slate-200 text-slate-800">{v}</p>

            </div> ))}

          </div>

          <div>

            <p className="text-xs font-bold uppercase tracking-wider mb-2 dark:text-slate-500 text-slate-400">Durum</p>
            <StatusBadge published={item.published} />

          </div>

          {item.published && ( <>

            <div>

              <p className="text-xs font-bold uppercase tracking-wider mb-2 dark:text-slate-500 text-slate-400">Yayın Tarihi</p>
              <p className="text-sm dark:text-slate-300 text-slate-700">{formatDate(item.publishedAt)}</p>

            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-wider mb-2 dark:text-slate-500 text-slate-400">Firmware URL</p>

              <div className="flex items-center gap-2 rounded-xl p-3 dark:bg-slate-800 bg-slate-50 border dark:border-slate-700 border-slate-200">
                <p className="text-xs font-mono break-all flex-1 dark:text-slate-300 text-slate-700">{item.url}</p>
                <CopyButton text={item.url} />
              </div>

            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-wider mb-2 dark:text-slate-500 text-slate-400">Sürüm Notları</p>
              <p className="text-sm leading-relaxed whitespace-pre-line dark:text-slate-400 text-slate-600">{item.releaseNotes || 'Not eklenmemiş.'}</p>

            </div>

          </> )}

          <button onClick={() => onPublish(item.deviceType)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20">
            <Upload size={16} /> Yeni Sürüm Yayınla
          </button>

        </div>

      </div>

    </div>
  );
};

const FirmwareCard = ({ item, onView, onPublish }) => {

  const Icon = item.icon;

  return (

    <div className="group rounded-2xl border overflow-hidden transition-all hover:-translate-y-0.5 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-blue-500/40 dark:hover:shadow-blue-500/5 bg-white border-slate-200 hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/10">

      <div className="relative aspect-video flex items-center justify-center overflow-hidden dark:bg-slate-950 bg-slate-50">

        <Icon size={32} className="dark:text-slate-700 text-slate-300 group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute top-2 right-2"><StatusBadge published={item.published} /></div>

      </div>

      <div className="p-4">

        <p className="font-bold text-sm leading-tight mb-1 group-hover:text-blue-500 transition-colors dark:text-slate-200 text-slate-800">{item.label}</p>
        <p className="text-[11px] font-mono mb-3 dark:text-slate-500 text-slate-400">{item.deviceType}</p>

        <div className="flex items-center justify-between">

          <span className="text-base font-black font-mono dark:text-white text-slate-900">{item.version || '—'}</span>

          <div className="flex items-center gap-1">

            <button onClick={() => onView(item)} title="İncele" className="p-1.5 rounded-lg transition-all dark:hover:bg-blue-500/10 dark:text-slate-500 dark:hover:text-blue-400 hover:bg-blue-50 text-slate-400 hover:text-blue-500">
              <Eye size={15} />
            </button>

            <button onClick={() => onPublish(item.deviceType)} title="Yeni sürüm yayınla" className="p-1.5 rounded-lg transition-all dark:hover:bg-amber-500/10 dark:text-slate-500 dark:hover:text-amber-400 hover:bg-amber-50 text-slate-400 hover:text-amber-500">
              <Upload size={15} />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

const AdminFirmware = () => {

  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortKey, setSortKey] = useState('label');
  const [sortDir, setSortDir] = useState('asc');
  const [viewTarget, setViewTarget] = useState(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishType, setPublishType] = useState(null);

  const { latestByType, publishLoading, publishError } = useSelector((state) => state.firmware);

  const fetchAll = () => Promise.all(DEVICE_TYPES.map(t => dispatch(getLatestFirmware(t.value))));

  useEffect(() => {

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {

    window.scrollTo(0, 0);
  }, []);

  const handleRefresh = async () => {

    setIsRefreshing(true);
    await fetchAll();
    await new Promise(r => setTimeout(r, 600));
    setIsRefreshing(false);
  };

  const handleSort = (key) => {

    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const openPublish = (type = null) => {

    dispatch(resetPublishStatus());
    setPublishType(type);
    setViewTarget(null);
    setPublishOpen(true);
  };

  const closePublish = () => {

    dispatch(resetPublishStatus());
    setPublishOpen(false);
  };

  const handlePublish = async (payload) => {

    try {
      await dispatch(publishFirmware(payload)).unwrap();
      closePublish();
    } catch (e) {
      // Hata mesajı slice'taki publishError üzerinden modalda gösterilir.
    }
  };

  // Backend'de "tüm firmware'ler" listesi uç noktası yok; her tip için en son kayıt gösteriliyor.
  const rows = DEVICE_TYPES.map(t => {

    const latest = latestByType[t.value];

    return {
      deviceType: t.value,
      label: t.label,
      icon: t.icon,
      published: !!latest,
      version: latest?.version || null,
      url: latest?.url || null,
      releaseNotes: latest?.releaseNotes || null,
      publishedAt: latest?.publishedAt || null,
    };
  });

  const filtered = rows.filter(r => {

    const q = searchTerm.toLowerCase();
    const matchSearch = r.label.toLowerCase().includes(q) || r.deviceType.toLowerCase().includes(q) || (r.version || '').toLowerCase().includes(q);
    const matchStatus = selectedStatus === 'all' ? true : selectedStatus === 'published' ? r.published : !r.published;
    return matchSearch && matchStatus;
  }).sort((a, b) => {

    let va = a[sortKey] ?? '', vb = b[sortKey] ?? '';
    if (typeof va === 'string') va = va.toLowerCase();
    if (typeof vb === 'string') vb = vb.toLowerCase();
    return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });

  const publishedCount = rows.filter(r => r.published).length;
  const missingCount = rows.length - publishedCount;
  const lastRelease = rows
    .filter(r => r.publishedAt)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))[0];

  const activeFilters = [selectedStatus !== 'all', searchTerm].filter(Boolean).length;

  const SortIcon = ({ col }) => (

    <button onClick={() => handleSort(col)} className={`ml-1 inline-flex items-center justify-center w-4 h-4 rounded transition-colors ${sortKey === col ? 'text-blue-400' : 'dark:text-slate-600 dark:hover:text-slate-400 text-slate-300 hover:text-slate-500'}`}>

      <svg width="8" height="12" viewBox="0 0 8 12" fill="none">

        <path d="M4 0L7 4H1L4 0Z" fill={sortKey === col && sortDir === 'asc' ? 'currentColor' : '#94a3b8'} />
        <path d="M4 12L1 8H7L4 12Z" fill={sortKey === col && sortDir === 'desc' ? 'currentColor' : '#94a3b8'} />

      </svg>

    </button>
  );

  return (

    <div className="flex min-h-screen dark:bg-slate-950 bg-slate-50 dark:text-slate-100 text-slate-900 transition-colors duration-300">

      <AdminSidebar />

      <div className="flex-1 min-h-screen flex flex-col overflow-x-hidden">

        <div className="sticky top-0 z-40 px-6 py-4 border-b backdrop-blur-md dark:bg-slate-950/80 dark:border-slate-800 bg-white/80 border-slate-200">

          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

            <div>

              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-0.5 text-blue-500"><Layers size={12} /> Cihaz Yönetimi</div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-2 dark:text-white text-slate-900">Firmware Listesi<span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold dark:bg-slate-800 dark:text-slate-400 bg-slate-100 text-slate-500">{filtered.length} kayıt</span></h1>

            </div>

            <div className="flex items-center gap-2">

              <div className="flex rounded-xl border overflow-hidden dark:border-slate-700 dark:bg-slate-800 border-slate-200 bg-slate-100">

                {[['table', LayoutList], ['grid', LayoutGrid]].map(([m, Icon]) => (
                  <button key={m} onClick={() => setViewMode(m)} className={`p-2.5 transition-all ${viewMode === m ? 'bg-blue-500 text-white' : 'dark:text-slate-400 dark:hover:text-slate-200 text-slate-500 hover:text-slate-700'}`}>
                    <Icon size={16} />
                  </button>
                ))}

              </div>

              <button onClick={handleRefresh} disabled={isRefreshing} className="p-2.5 rounded-xl border transition-all disabled:opacity-40 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800">
                <RefreshCw size={17} className={isRefreshing ? 'animate-spin' : ''} />
              </button>

              <button onClick={() => openPublish()} className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20">
                <Plus size={16} /> Yeni Firmware
              </button>

            </div>

          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 w-full flex-1 space-y-5">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

            <StatCard icon={Cpu} label="Cihaz Tipi" value={rows.length} sub="desteklenen tip" accent="bg-blue-500" />
            <StatCard icon={CheckCircle} label="Yayında" value={publishedCount} sub="tip için firmware var" accent="bg-emerald-500" />
            <StatCard icon={AlertTriangle} label="Yayınlanmamış" value={missingCount} sub="tip için firmware yok" accent="bg-amber-500" />
            <StatCard icon={Clock} label="Son Yayın" value={lastRelease ? lastRelease.version : '—'} sub={lastRelease ? `${lastRelease.label} · ${formatDate(lastRelease.publishedAt)}` : 'henüz yayın yok'} accent="bg-violet-500" />

          </div>

          <div className="rounded-2xl border p-4 dark:bg-slate-900 dark:border-slate-800 bg-white border-slate-200">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">

              <div className="relative lg:col-span-7">

                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="text" placeholder="Cihaz tipi veya sürüm..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`${inputClass} pl-10 pr-4`} />

                {searchTerm && ( <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  <X size={14} />
                </button> )}

              </div>

              <div className="relative lg:col-span-4">

                <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>

                  <option value="all">Tüm Durumlar</option>
                  <option value="published">Yayında</option>
                  <option value="missing">Yayınlanmadı</option>

                </select>

                <Filter size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />

              </div>

              <div className="lg:col-span-1 flex justify-end">

                {activeFilters > 0 && ( <button onClick={() => { setSearchTerm(''); setSelectedStatus('all'); }} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all whitespace-nowrap">
                  <X size={13} /> Temizle ({activeFilters})
                </button> )}

              </div>

            </div>

          </div>

          {viewMode === 'grid' ? ( <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">

            {filtered.length > 0 ? filtered.map(item => ( <FirmwareCard key={item.deviceType} item={item} onView={setViewTarget} onPublish={openPublish} /> )) : ( <div className="col-span-full py-20 flex flex-col items-center gap-3 text-slate-500">

              <Cpu size={44} className="dark:text-slate-700 text-slate-300" strokeWidth={1.5} />
              <p className="text-sm font-medium">Kriterlere uygun firmware bulunamadı.</p>

            </div> )}

          </div> ) : ( <div className="rounded-2xl border overflow-hidden dark:bg-slate-900 dark:border-slate-800 bg-white border-slate-200">

            <div className="overflow-x-auto">

              <table className="w-full text-left border-collapse">

                <thead>

                  <tr className="border-b text-[11px] font-bold uppercase tracking-widest dark:border-slate-800 dark:bg-slate-900/60 border-slate-100 bg-slate-50 dark:text-slate-400 text-slate-500">

                    <th className="py-3.5 px-5">Cihaz Tipi <SortIcon col="label" /></th>
                    <th className="py-3.5 px-4">Sürüm <SortIcon col="version" /></th>
                    <th className="py-3.5 px-4">Firmware URL</th>
                    <th className="py-3.5 px-4">Yayın Tarihi <SortIcon col="publishedAt" /></th>
                    <th className="py-3.5 px-4">Durum</th>
                    <th className="py-3.5 px-5 text-right">İşlemler</th>

                  </tr>

                </thead>

                <tbody className="divide-y text-sm dark:divide-slate-800 divide-slate-100 dark:text-slate-300 text-slate-700">

                  {filtered.length > 0 ? filtered.map(item => { const Icon = item.icon; return ( <tr key={item.deviceType} className="transition-colors group dark:hover:bg-slate-800/40 hover:bg-slate-50">

                    <td className="py-3 px-5">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border dark:bg-slate-950 dark:border-slate-800 bg-slate-50 border-slate-200">
                          <Icon size={18} className="dark:text-slate-500 text-slate-400" />
                        </div>

                        <div className="min-w-0">

                          <span className="block font-semibold text-sm truncate max-w-[200px] group-hover:text-blue-500 transition-colors dark:text-slate-200 text-slate-800">{item.label}</span>
                          <span className="block text-[11px] font-mono dark:text-slate-500 text-slate-400">{item.deviceType}</span>

                        </div>

                      </div>

                    </td>

                    <td className="py-3 px-4 font-mono font-black text-sm dark:text-white text-slate-900">{item.version || '—'}</td>

                    <td className="py-3 px-4">
                      <span className="block text-xs font-mono truncate max-w-[260px] dark:text-slate-400 text-slate-600" title={item.url || ''}>{item.url || '—'}</span>
                    </td>

                    <td className="py-3 px-4 text-xs dark:text-slate-400 text-slate-600 whitespace-nowrap">{formatDate(item.publishedAt)}</td>
                    <td className="py-3 px-4"><StatusBadge published={item.published} /></td>

                    <td className="py-3 px-5">

                      <div className="flex items-center justify-end gap-1">

                        <button onClick={() => setViewTarget(item)} title="İncele" className="p-2 rounded-xl transition-all dark:hover:bg-blue-500/10 dark:text-slate-500 dark:hover:text-blue-400 hover:bg-blue-50 text-slate-400 hover:text-blue-500">
                          <Eye size={15} />
                        </button>

                        {item.url && <CopyButton text={item.url} />}

                        <button onClick={() => openPublish(item.deviceType)} title="Yeni sürüm yayınla" className="p-2 rounded-xl transition-all dark:hover:bg-amber-500/10 dark:text-slate-500 dark:hover:text-amber-400 hover:bg-amber-50 text-slate-400 hover:text-amber-500">
                          <Upload size={15} />
                        </button>

                      </div>

                    </td>

                  </tr> ); }) : ( <tr>

                    <td colSpan="6" className="py-20">

                      <div className="flex flex-col items-center gap-3 text-slate-500">

                        <Cpu size={44} className="dark:text-slate-700 text-slate-300" strokeWidth={1.5} />
                        <p className="text-sm font-medium">Kriterlere uygun firmware bulunamadı.</p>
                        {activeFilters > 0 && ( <button onClick={() => { setSearchTerm(''); setSelectedStatus('all'); }} className="text-xs text-blue-400 hover:underline">Filtreleri temizle</button> )}

                      </div>

                    </td>

                  </tr> )}

                </tbody>

              </table>

            </div>

            <div className="px-5 py-3.5 border-t text-xs dark:border-slate-800 dark:bg-slate-900/40 border-slate-100 bg-slate-50/60 dark:text-slate-500 text-slate-400">
              Gösterilen <span className="font-bold dark:text-slate-300 text-slate-700">{filtered.length}</span> / Toplam <span className="font-bold dark:text-slate-300 text-slate-700">{rows.length}</span>
            </div>

          </div> )}

        </div>

      </div>

      {publishOpen && ( <PublishModal
        key={publishType || 'new'}
        initialType={publishType}
        currentVersion={publishType ? latestByType[publishType]?.version : null}
        loading={publishLoading}
        error={publishError}
        onSubmit={handlePublish}
        onCancel={closePublish}
      /> )}

      {viewTarget && ( <FirmwareDrawer item={viewTarget} onClose={() => setViewTarget(null)} onPublish={openPublish} /> )}

    </div>
  );
};

export default AdminFirmware;
