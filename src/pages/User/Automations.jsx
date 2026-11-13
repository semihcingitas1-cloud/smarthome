import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { getMyAutomations, getAutomation, getAutomationHealth, createAutomation, updateAutomation, deleteAutomation, triggerAutomation, shareAutomation, clearAutomationError } from '../../redux/automationSlice';
import { getMyDevices } from '../../redux/devicesSlice';
import { setHomeModeApi, getPendingApprovalsApi, respondToApprovalApi, apiError } from '../../services/homeApi';

import Sidebar from '../../layout/Sidebar';

import AutomationEditor from './AutomationEditor';
import { DetailModal, ShareModal, ImportTemplateModal, ApprovalCard } from './AutomationDetail';
import { Toggle, SectionLabel, Spinner } from './AutomationUI';
import { toView, groupOf, isSameDay, hhmm, formatLastRun, formatNextRun, formatNextRunDay, gradientStyle, buildDuplicatePayload, selectDevices, useHomeId, useHomeExtras, HOME_MODE_LABELS, MEMBER_PRESENCE_LABELS } from './automationShared';

import { Plus, Zap, Trash2, ChevronRight, AlertTriangle, Bell, ArrowRight, Activity, Search, Copy, Power, Clock, Layers, MapPin, GitBranch, ShieldAlert, CalendarClock, History, QrCode } from 'lucide-react';

const PRESENCE_DOT = { HOME: 'bg-emerald-500', AWAY: 'bg-amber-500' };

const TYPE_FILTERS = [
  { key: 'all', label: 'Tüm tetikleyiciler' },
  { key: 'time', label: 'Zaman' },
  { key: 'device', label: 'Cihaz' },
  { key: 'other', label: 'Diğer' },
];

const MetaChip = ({ icon: Icon, color, label }) => (

  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border" style={{ color, backgroundColor: `${color}14`, borderColor: `${color}33` }}>
    <Icon size={11} /> {label}
  </span>
);

const Automation = () => {

  const dispatch = useDispatch();

  const { automations: rawAutomations, loading, error, triggerLoadingId } = useSelector((state) => state.automation);
  const healthById = useSelector((state) => state.automation.health);
  const devices = useSelector(selectDevices);

  const homeId = useHomeId(devices);
  const { homeState, setHomeState, homeError, members, scenes, reload: reloadHome } = useHomeExtras(homeId);

  const [activeTab, setActiveTab] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedId, setSelectedId] = useState(null);
  const [editor, setEditor] = useState(null); // { id } | { id: null }
  const [shareData, setShareData] = useState(null);
  const [importOpen, setImportOpen] = useState(false);

  // Anahtar anında değişsin diye: sunucu cevabı gelene kadar burada tutulur
  const [toggleOverrides, setToggleOverrides] = useState({});
  const [duplicatingId, setDuplicatingId] = useState(null);
  const [sharingId, setSharingId] = useState(null);

  const [approvals, setApprovals] = useState([]);
  const [respondingId, setRespondingId] = useState(null);
  const [modeBusy, setModeBusy] = useState(false);

  // ── Yükleme ──

  const loadApprovals = useCallback(() => {
    getPendingApprovalsApi().then(setApprovals).catch((e) => console.warn('Onay istekleri yüklenemedi:', e?.response?.status, e?.response?.data?.message ?? e?.message));
  }, []);

  useEffect(() => {

    dispatch(getMyAutomations());
    dispatch(getMyDevices());
    dispatch(getAutomationHealth());
    loadApprovals();

    const timer = setInterval(loadApprovals, 30000);
    return () => clearInterval(timer);
  }, [dispatch, loadApprovals]);

  useEffect(() => {

    if (error) {
      toast.error(error);
      dispatch(clearAutomationError());
    }
  }, [error, dispatch]);

  // ── Görünüm verisi ──

  const ctx = useMemo(() => ({
    devices,
    members,
    scenes,
    automationNames: new Map(rawAutomations.map(a => [String(a._id || a.id), a.name])),
  }), [rawAutomations, devices, members, scenes]);

  const automations = useMemo(() => {

    const now = new Date();

    return rawAutomations.map((raw, i) => {
      const view = toView(raw, i, ctx, now);
      return { ...view, active: toggleOverrides[view.id] ?? view.active, health: healthById?.[view.id] ?? null };
    });
  }, [rawAutomations, ctx, toggleOverrides, healthById]);

  const selectedAutomation = automations.find(a => a.id === selectedId) || null;
  const criticalAutomations = automations.filter(a => a.active && a.health?.status === 'CRITICAL');

  const now = new Date();
  const activeCount = automations.filter(a => a.active).length;
  const inactiveCount = automations.length - activeCount;
  const failingCount = automations.filter(a => a.active && a.failing).length;
  const ranTodayCount = automations.filter(a => a.lastTriggeredAt && isSameDay(new Date(a.lastTriggeredAt), now)).length;
  const nextUpcoming = automations.filter(a => a.active && a.nextRun).sort((a, b) => a.nextRun - b.nextRun)[0];

  const STATUS_TABS = [
    { key: 'all', label: 'Tümü', count: automations.length },
    { key: 'active', label: 'Aktif', count: activeCount },
    { key: 'inactive', label: 'Pasif', count: inactiveCount },
  ];

  const filteredAutomations = automations.filter(a => {
    const matchesSearch = a.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || (activeTab === 'active' ? a.active : !a.active);
    const matchesType = typeFilter === 'all' || a.triggers.some(t => groupOf(t.source) === typeFilter);
    return matchesSearch && matchesTab && matchesType;
  });

  // ── Ev modu ve onaylar ──

  const changeMode = async (mode) => {

    if (!homeId || !homeState || mode === homeState.mode) return;

    const previous = homeState.mode;
    setHomeState(s => ({ ...s, mode }));
    setModeBusy(true);

    try {
      await setHomeModeApi(homeId, mode);
      toast.success(`Ev modu: ${HOME_MODE_LABELS[mode]}`);
    } catch (e) {
      setHomeState(s => ({ ...s, mode: previous }));
      toast.error(apiError(e, 'Ev modu değiştirilemedi.'));
    } finally {
      setModeBusy(false);
    }
  };

  const handleRespond = async (approval, response) => {

    setRespondingId(approval._id);

    try {
      await respondToApprovalApi(approval._id, response);
      toast.success({ APPROVE: 'Onaylandı, otomasyon devam ediyor.', DENY: 'Reddedildi, otomasyon durduruldu.', SNOOZE: 'Ertelendi, biraz sonra tekrar sorulacak.' }[response]);
    } catch (e) {
      // Başka biri önce cevapladıysa sunucu kimin ne dediğini söyler
      toast.error(apiError(e, 'Cevap gönderilemedi.'));
    } finally {
      setRespondingId(null);
      loadApprovals();
    }
  };

  // ── Otomasyon işlemleri ──

  const handleToggle = async (automation) => {

    const next = !automation.active;
    setToggleOverrides(prev => ({ ...prev, [automation.id]: next }));

    try {
      await dispatch(updateAutomation({ id: automation.id, data: { isActive: next } })).unwrap();
      toast.success(next ? 'Otomasyon etkinleştirildi' : 'Otomasyon devre dışı bırakıldı');
    } catch {
      // Hata mesajı slice'taki error üzerinden gösteriliyor
    } finally {
      // Başarılıysa store zaten güncel, hatalıysa eski değere döner
      setToggleOverrides(prev => {
        const { [automation.id]: _removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleDelete = async (automation) => {

    if (!window.confirm(`"${automation.name}" kalıcı olarak silinecek. Emin misin?`)) return;

    try {
      await dispatch(deleteAutomation(automation.id)).unwrap();
      toast.success('Otomasyon silindi.');
      if (selectedId === automation.id) setSelectedId(null);
    } catch {
      // Hata mesajı slice'taki error üzerinden gösteriliyor
    }
  };

  const handleTrigger = async (automation) => {

    // Onay adımı varsa istek birkaç saniye içinde oluşur
    const early = setTimeout(loadApprovals, 3000);

    try {
      const res = await dispatch(triggerAutomation(automation.id)).unwrap();
      const ok = res?.success !== false;
      (ok ? toast.success : toast)(res?.message || `"${automation.name}" çalıştırıldı.`);
      dispatch(getAutomation(automation.id)); // son çalışma zamanı ve durumu güncellensin
    } catch {
      // Hata mesajı slice'taki error üzerinden gösteriliyor
    } finally {
      clearTimeout(early);
      loadApprovals();
    }
  };

  const handleDuplicate = async (automation) => {

    const raw = rawAutomations.find(a => (a._id || a.id) === automation.id);
    if (!raw) return;

    setDuplicatingId(automation.id);

    try {
      await dispatch(createAutomation(buildDuplicatePayload(raw))).unwrap();
      setSelectedId(null);
      toast.success(`"${automation.name} (kopya)" pasif olarak oluşturuldu. İnceleyip aktifleştirebilirsin.`);
    } catch {
      // Hata mesajı slice'taki error üzerinden gösteriliyor
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleShare = async (automation) => {

    setSharingId(automation.id);

    try {
      const data = await dispatch(shareAutomation(automation.id)).unwrap();
      setSelectedId(null); // iki pencere üst üste açılmasın
      setShareData(data);
    } catch {
      // Hata mesajı slice'taki error üzerinden gösteriliyor
    } finally {
      setSharingId(null);
    }
  };

  const openEditor = (id = null) => {
    setSelectedId(null);
    setEditor({ id });
  };

  const closeEditor = () => {
    setEditor(null);
    dispatch(getAutomationHealth());
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveTab('all');
    setTypeFilter('all');
  };

  const hasNoAutomations = automations.length === 0;
  const isFiltering = searchQuery || activeTab !== 'all' || typeFilter !== 'all';

  const stats = [
    { label: 'Aktif Senaryo', value: activeCount, sub: `${automations.length} otomasyondan`, icon: <Zap className="text-yellow-400" />, color: 'bg-yellow-500/10' },
    { label: 'Bugün Çalışan', value: ranTodayCount, sub: 'bugün en az bir kez çalıştı', icon: <History className="text-blue-400" />, color: 'bg-blue-500/10' },
    failingCount > 0
      ? { label: 'Hatalı', value: failingCount, sub: 'son çalışması başarısız', icon: <AlertTriangle className="text-red-400" />, color: 'bg-red-500/10' }
      : { label: 'Toplam Otomasyon', value: automations.length, sub: `${inactiveCount} pasif`, icon: <Activity className="text-purple-400" />, color: 'bg-purple-500/10' },
    nextUpcoming
      ? { label: 'Sıradaki', value: hhmm(nextUpcoming.nextRun), sub: `${formatNextRunDay(nextUpcoming.nextRun)} · ${nextUpcoming.name}`, icon: <CalendarClock className="text-green-400" />, color: 'bg-green-500/10', onClick: () => setSelectedId(nextUpcoming.id) }
      : { label: 'Sıradaki', value: '—', sub: 'saatli otomasyon yok', icon: <CalendarClock className="text-green-400" />, color: 'bg-green-500/10' },
  ];

  return (

    <div className="flex bg-slate-950 min-h-screen">

      <Sidebar />

      <main className="flex-1 lg:ml-0 overflow-x-hidden">

        <div className="p-6 space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">

          {/* BAŞLIK */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

            <div className="space-y-1">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Otomasyonlar</h2>
              <p className="text-slate-400">{hasNoAutomations ? 'Evin senin yerine kendini yönetsin.' : `${activeCount} otomasyon çalışıyor.`}</p>
            </div>

            <div className="flex gap-3 flex-wrap">

              <button type="button" onClick={() => setImportOpen(true)} className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition-all font-bold">
                <QrCode size={18} className="text-blue-400" /> Şablon kodu
              </button>

              <button type="button" onClick={() => openEditor(null)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all font-bold">
                <Plus size={20} /> Yeni Otomasyon
              </button>

            </div>

          </div>

          {/* EV DURUMU VE ONAYLAR */}
          {homeId && (homeState || homeError || approvals.length > 0) && (

            <div className={`grid grid-cols-1 gap-6 ${approvals.length > 0 ? 'lg:grid-cols-2' : ''}`}>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-5">

                {homeError && !homeState ? (

                  <div className="flex items-start gap-3 text-sm">
                    <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-300 font-bold">Ev bilgisi alınamadı</p>
                      <p className="text-slate-400 mt-0.5">{homeError}</p>
                      <button type="button" onClick={reloadHome} className="text-blue-400 font-bold mt-2 hover:text-blue-300">Tekrar dene</button>
                    </div>
                  </div>

                ) : homeState && (

                  <>

                    <div>
                      <SectionLabel>Ev modu</SectionLabel>
                      <div className="flex gap-1 p-1 bg-slate-950/60 rounded-xl border border-slate-800">
                        {Object.entries(HOME_MODE_LABELS).map(([id, label]) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => changeMode(id)}
                            disabled={modeBusy}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${homeState.mode === id ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <SectionLabel>Evde kim var</SectionLabel>

                      {members.length === 0 ? (
                        <p className="text-xs text-slate-500">Üye bilgisi yok.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {[...members].sort((a, b) => (b.isMe - a.isMe) || ((b.presence === 'HOME') - (a.presence === 'HOME'))).map((m) => (
                            <span key={m.userId} className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-full px-3 py-1.5 text-xs">
                              <span className={`w-2 h-2 rounded-full ${PRESENCE_DOT[m.presence] ?? 'bg-slate-600'}`} />
                              <span className="font-bold text-slate-200">{m.isMe ? 'Sen' : m.name}</span>
                              <span className="text-slate-500">· {MEMBER_PRESENCE_LABELS[m.presence] ?? m.presence}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {!homeState.location && (
                        <p className="text-xs text-amber-400 mt-3 flex items-start gap-1.5">
                          <MapPin size={13} className="flex-shrink-0 mt-0.5" />
                          Evin konumu henüz kaydedilmedi. Eve gelip gitme ve güneş otomasyonları için mobil uygulamada Otomasyonlar › Evde kim var bölümünden ekle.
                        </p>
                      )}
                    </div>

                  </>
                )}

              </div>

              {approvals.length > 0 && (
                <div className="space-y-3">
                  <SectionLabel>Onay bekleyenler · {approvals.length}</SectionLabel>
                  {approvals.map(ap => (
                    <ApprovalCard key={ap._id} approval={ap} busy={respondingId === ap._id} onRespond={(r) => handleRespond(ap, r)} />
                  ))}
                </div>
              )}

            </div>
          )}

          {/* İSTATİSTİKLER */}
          {!hasNoAutomations && (

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  onClick={stat.onClick}
                  className={`bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center justify-between hover:bg-slate-900/70 transition-all group ${stat.onClick ? 'cursor-pointer' : ''}`}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-1 truncate">{stat.sub}</p>
                  </div>
                  <div className={`p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform flex-shrink-0`}>{stat.icon}</div>
                </div>
              ))}
            </div>
          )}

          {/* SAĞLIK UYARISI */}
          {criticalAutomations.length > 0 && (

            <button type="button" onClick={() => setSelectedId(criticalAutomations[0].id)} className="w-full flex items-center gap-4 bg-red-500/10 border border-red-500/20 rounded-2xl p-5 text-left hover:bg-red-500/15 transition-all">
              <ShieldAlert size={22} className="text-red-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-red-300">{criticalAutomations.length} otomasyon şu an çalışamayabilir</p>
                <p className="text-sm text-red-400/80 mt-0.5 truncate">{criticalAutomations[0].health.issues[0]?.message}</p>
              </div>
              <ChevronRight size={18} className="text-red-400 ml-auto flex-shrink-0" />
            </button>
          )}

          {/* FİLTRELER VE ARAMA */}
          {!hasNoAutomations && (

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">

              <div className="flex gap-2 p-1 bg-slate-900/50 w-fit rounded-2xl border border-slate-800">
                {STATUS_TABS.map(({ key, label, count }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key)}
                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === key ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {label}
                    <span className={`text-xs ${activeTab === key ? 'text-blue-400' : 'text-slate-600'}`}>{count}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 w-full md:w-auto">

                <div className="relative flex-1 md:w-64">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Otomasyon ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {TYPE_FILTERS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
                </select>

              </div>

            </div>
          )}

          {/* YÜKLEME DURUMU */}
          {loading && hasNoAutomations && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
            </div>
          )}

          {/* OTOMASYON LİSTESİ */}
          {!hasNoAutomations && (

            <div className="grid grid-cols-1 gap-4">

              {filteredAutomations.map((rule) => {

                const TriggerIcon = rule.triggerIcon;
                const nextRunLabel = rule.active ? formatNextRun(rule.nextRun) : null;
                const firstAction = rule.actionItems.find(x => x.kind !== 'ELSE');
                const actionCount = rule.actionItems.filter(x => x.kind !== 'ELSE').length;

                return (

                  <div
                    key={rule.id}
                    className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800/40 hover:border-slate-700 transition-all cursor-pointer"
                    onClick={() => setSelectedId(rule.id)}
                  >

                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">

                      {/* SOL BÖLÜM */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">

                        <div className="p-3 rounded-2xl text-white flex-shrink-0" style={{ ...gradientStyle(rule.color), opacity: rule.active ? 1 : 0.45 }}>
                          <TriggerIcon size={20} />
                        </div>

                        <div className="flex-1 min-w-0">

                          <h4 className={`text-lg font-bold group-hover:text-blue-400 transition-colors truncate ${rule.active ? 'text-white' : 'text-slate-500'}`}>{rule.name}</h4>
                          <p className="text-sm text-slate-500 line-clamp-1">{rule.triggerLabel}</p>

                          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                            {rule.active && rule.health?.status === 'CRITICAL' && <MetaChip icon={ShieldAlert} color="#ef4444" label="Risk" />}
                            {rule.active && rule.health?.status === 'WARNING' && <MetaChip icon={AlertTriangle} color="#f59e0b" label="Uyarı" />}
                            {rule.active && rule.failing && !['CRITICAL', 'WARNING'].includes(rule.health?.status) && <MetaChip icon={AlertTriangle} color="#ef4444" label="Hata" />}
                            {rule.commandCount > 0 && <MetaChip icon={Power} color="#10b981" label={`${rule.commandCount} komut`} />}
                            {rule.hasNotify && <MetaChip icon={Bell} color="#8b5cf6" label="Bildirim" />}
                            {rule.hasLogic && <MetaChip icon={GitBranch} color="#0ea5e9" label="Akış" />}
                            {actionCount === 0 && <MetaChip icon={Layers} color="#64748b" label="Aksiyon yok" />}
                          </div>

                        </div>

                      </div>

                      {/* AKIŞ BÖLÜMÜ */}
                      <div className="flex items-center gap-3 bg-slate-950/50 px-5 py-3 rounded-2xl border border-slate-800/50 flex-[1.5] overflow-x-auto w-full lg:w-auto">

                        <div className="text-center min-w-[100px] max-w-[180px]">
                          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">EĞER</p>
                          <p className="text-xs text-white font-medium truncate">{rule.triggerLabel}</p>
                        </div>

                        <ArrowRight size={16} className="text-slate-700 flex-shrink-0" />

                        <div className="text-center min-w-[80px] max-w-[160px]">
                          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">KOŞUL</p>
                          <p className="text-xs text-blue-400 font-bold truncate">
                            {rule.conditionItems.length === 0 ? 'Yok' : rule.conditionItems.length === 1 ? rule.conditionItems[0] : `${rule.conditionItems.length} koşul`}
                          </p>
                        </div>

                        <ChevronRight size={20} className="text-slate-800 mx-1 flex-shrink-0" />

                        <div className="text-center min-w-[100px] max-w-[200px]">
                          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">AKSİYON</p>
                          <p className="text-xs text-green-400 font-bold truncate">{firstAction?.title ?? 'Yok'}</p>
                          {actionCount > 1 && <p className="text-[10px] text-slate-600">+{actionCount - 1} adım daha</p>}
                        </div>

                      </div>

                      {/* SAĞ BÖLÜM */}
                      <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">

                        <div className="text-right hidden xl:block">
                          {nextRunLabel ? (
                            <>
                              <p className="text-[10px] text-slate-500 font-bold uppercase">SONRAKİ</p>
                              <p className="text-xs text-sky-400 font-bold flex items-center gap-1 justify-end"><Clock size={11} /> {nextRunLabel}</p>
                            </>
                          ) : (
                            <>
                              <p className="text-[10px] text-slate-500 font-bold uppercase">SON ÇALIŞMA</p>
                              <p className={`text-xs ${rule.failing ? 'text-red-400' : 'text-slate-300'}`}>{formatLastRun(rule.lastTriggeredAt)}</p>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>

                          <Toggle value={rule.active} onChange={() => handleToggle(rule)} />

                          <button type="button" onClick={() => handleDuplicate(rule)} disabled={duplicatingId === rule.id} title="Çoğalt" className="p-2.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all disabled:opacity-50">
                            {duplicatingId === rule.id ? <Spinner /> : <Copy size={18} />}
                          </button>

                          <button type="button" onClick={() => handleDelete(rule)} title="Sil" className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-all">
                            <Trash2 size={18} />
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

          {/* BOŞ DURUM */}
          {!loading && (hasNoAutomations || filteredAutomations.length === 0) && (

            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">

              <div className="p-6 bg-slate-800/50 rounded-full text-slate-600">
                {hasNoAutomations ? <Zap size={40} /> : <Search size={40} />}
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">{hasNoAutomations ? 'Henüz Otomasyon Yok' : 'Sonuç Bulunamadı'}</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2">
                  {hasNoAutomations
                    ? 'Belirli bir saatte, gün batımında, eve gelince ya da bir cihazın durumu değişince ışıklar, röleler ve bildirimler kendiliğinden çalışsın.'
                    : 'Arama ya da filtrelerle eşleşen otomasyon yok.'}
                </p>
              </div>

              {hasNoAutomations ? (
                <button type="button" onClick={() => openEditor(null)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all">
                  <Plus size={18} /> İlk otomasyonunu oluştur
                </button>
              ) : isFiltering && (
                <button type="button" onClick={clearFilters} className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold transition-all">Filtreleri temizle</button>
              )}

            </div>
          )}

          {/* PENCERELER */}
          {selectedAutomation && (
            <DetailModal
              automation={selectedAutomation}
              ctx={ctx}
              onClose={() => setSelectedId(null)}
              onDelete={handleDelete}
              onToggle={handleToggle}
              onTrigger={handleTrigger}
              onEdit={(a) => openEditor(a.id)}
              onDuplicate={handleDuplicate}
              onShare={handleShare}
              triggering={triggerLoadingId === selectedAutomation.id}
              duplicating={duplicatingId === selectedAutomation.id}
              sharing={sharingId === selectedAutomation.id}
            />
          )}

          {editor && (
            <AutomationEditor
              automationId={editor.id}
              homeId={homeId}
              devices={devices}
              members={members}
              scenes={scenes}
              onClose={closeEditor}
            />
          )}

          {shareData && <ShareModal data={shareData} onClose={() => setShareData(null)} />}

          {importOpen && <ImportTemplateModal devices={devices} homeId={homeId} onClose={() => setImportOpen(false)} />}

        </div>

      </main>

    </div>
  );
};

export default Automation;
