import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

import { getAutomationRuns, getAutomationVersions, restoreAutomationVersion, getTemplate, importTemplate } from '../../redux/automationSlice';

import { Modal, Spinner, Toggle, IconBox, SectionLabel, InfoRow, TextInput } from './AutomationUI';
import { formatLastRun, formatNextRun, formatDuration, formatDate, friendlyError, runStatusText, toView, traceLine, gradientStyle, relayChannels, RUN_MODE_LABELS, LOGIC_LABELS } from './automationShared';

import { X, Play, Pencil, Copy, Share2, Trash2, History, CalendarClock, CalendarRange, Repeat, Power, Layers, ListChecks, AlertTriangle, CheckCircle2, XCircle, SkipForward, Loader2, Ban, ChevronDown, RefreshCw, RotateCcw, WifiOff, BatteryLow, Unplug, Lock, MapPin, Workflow, Hand, QrCode } from 'lucide-react';

// ───────────────────────── SAĞLIK ─────────────────────────

const SEVERITY_COLORS = { CRITICAL: '#ef4444', WARNING: '#f59e0b', INFO: '#64748b' };

const ISSUE_ICONS = {
  OFFLINE: WifiOff,
  LOW_BATTERY: BatteryLow,
  MISSING_DEVICE: Unplug,
  MISSING_CHANNEL: Unplug,
  NO_ACCESS: Lock,
  NO_LOCATION: MapPin,
  TARGET_MISSING: Workflow,
  TARGET_INACTIVE: Workflow,
  FAILING: AlertTriangle,
};

// ───────────────────────── ÇALIŞMA GEÇMİŞİ ─────────────────────────

const RUN_STATUS_META = {
  SUCCESS: { label: 'Başarılı', color: '#10b981', icon: CheckCircle2 },
  PARTIAL: { label: 'Kısmen başarılı', color: '#f59e0b', icon: AlertTriangle },
  FAILED: { label: 'Başarısız', color: '#ef4444', icon: XCircle },
  SKIPPED: { label: 'Atlandı', color: '#64748b', icon: SkipForward },
  RUNNING: { label: 'Çalışıyor', color: '#3b82f6', icon: Loader2 },
  CANCELLED: { label: 'İptal edildi', color: '#64748b', icon: Ban },
};

const SKIP_REASON_LABELS = {
  CONDITION_FAILED: 'Koşullar sağlanmadı',
  COOLDOWN: 'Bekleme süresi dolmadı',
  BUSY: 'Zaten çalışıyordu',
  NO_PERMISSION: 'Yetki yok',
  OUT_OF_WINDOW: 'Geçerlilik tarihleri dışında',
};

const SOURCE_LABELS = {
  DEVICE: 'Cihaz', TIME: 'Saat', SUN: 'Güneş', TARIFF: 'Tarife', MANUAL: 'Manuel', AUTOMATION: 'Başka otomasyon',
  GEOFENCE: 'Konum', HOME_MODE: 'Ev modu', VOICE: 'Ses', COUNT: 'Sayı', SEQUENCE: 'Sıra', ANOMALY: 'Olağan dışı',
};

const STEP_STATUS_LABELS = { SUCCESS: 'Başarılı', FAILED: 'Başarısız', TIMEOUT: 'Zaman aşımı', SKIPPED: 'Atlandı' };
const STEP_STATUS_COLORS = { SUCCESS: '#10b981', FAILED: '#ef4444', TIMEOUT: '#f59e0b', SKIPPED: '#64748b' };

const formatMs = (ms) => {
  if (ms == null || Number.isNaN(ms)) return null;
  if (ms < 1000) return `${ms} ms`;
  return formatDuration(Math.round(ms / 1000));
};

const durationOf = (start, end) => (start && end ? new Date(end) - new Date(start) : null);

const runSummary = (run) => {

  if (run.status === 'SKIPPED') return SKIP_REASON_LABELS[run.skipReason] ?? 'Atlandı';

  const failed = run.steps?.find(s => s.status === 'FAILED' || s.status === 'TIMEOUT');

  return [
    RUN_STATUS_META[run.status]?.label ?? run.status,
    failed ? friendlyError(failed.error) : null,
    formatMs(durationOf(run.startedAt, run.finishedAt)),
  ].filter(Boolean).join(' · ');
};

const RunRow = ({ run, actionTitles, expanded, onToggle }) => {

  const meta = RUN_STATUS_META[run.status] ?? { label: run.status, color: '#64748b', icon: History };
  const Icon = meta.icon;
  const skipped = run.status === 'SKIPPED';
  const details = skipped ? (run.conditionTrace ?? []) : (run.steps ?? []);
  const canExpand = details.length > 0;

  return (

    <div className="border-b border-slate-800 last:border-b-0">

      <button type="button" onClick={canExpand ? onToggle : undefined} className={`w-full flex items-center gap-3 px-4 py-3 text-left ${canExpand ? 'hover:bg-slate-800/40' : 'cursor-default'}`}>

        <IconBox icon={Icon} color={meta.color} size="w-8 h-8" iconSize={15} />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {formatLastRun(run.startedAt)} · {SOURCE_LABELS[run.triggerSource] ?? run.triggerSource ?? '—'}
          </p>
          <p className="text-xs mt-0.5 truncate" style={{ color: meta.color }}>{runSummary(run)}</p>
        </div>

        {canExpand && <ChevronDown size={16} className={`text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />}

      </button>

      {expanded && canExpand && (

        <div className="pr-4 pb-3 pl-[60px] space-y-1">

          {skipped ? details.map((t, i) => (

            <p key={i} className="text-xs text-slate-400">{traceLine(t)}</p>

          )) : details.map((s, i) => (

            <div key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: STEP_STATUS_COLORS[s.status] ?? '#64748b' }} />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{actionTitles.get(s.path) ?? s.kind}</p>
                <p className="text-[11px] text-slate-500">
                  {[STEP_STATUS_LABELS[s.status] ?? s.status ?? 'Çalışıyor', s.error ? friendlyError(s.error) : null, formatMs(durationOf(s.startedAt, s.finishedAt))].filter(Boolean).join(' · ')}
                </p>
              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

const RunHistory = ({ automationId, actionTitles }) => {

  const dispatch = useDispatch();
  const entry = useSelector((state) => state.automation.runs?.[automationId]);
  const [expandedId, setExpandedId] = useState(null);

  const items = entry?.items ?? [];
  const loading = entry?.loading ?? false;

  const load = (before) => dispatch(getAutomationRuns({ id: automationId, before }));

  // Pencere açılınca ve manuel çalıştırmadan sonra tazele
  useEffect(() => { if (automationId) load(); }, [automationId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (automationId && entry?.stale) load(); }, [entry?.stale]); // eslint-disable-line react-hooks/exhaustive-deps

  return (

    <div>

      <SectionLabel right={(
        <button type="button" onClick={() => load()} disabled={loading} className="p-1 text-slate-500 hover:text-white transition-all">
          {loading ? <Spinner size={14} /> : <RefreshCw size={14} />}
        </button>
      )}>
        Son çalışmalar
      </SectionLabel>

      <div className="bg-slate-800/40 border border-slate-800 rounded-2xl overflow-hidden">

        {loading && !items.length ? (

          <div className="py-6 flex justify-center text-slate-500"><Spinner /></div>

        ) : entry?.error && !items.length ? (

          <InfoRow icon={AlertTriangle} iconColor="#ef4444" value="Geçmiş yüklenemedi" subtitle={entry.error} danger />

        ) : !items.length ? (

          <InfoRow icon={History} iconColor="#64748b" value="Henüz çalışma kaydı yok" />

        ) : items.map((run) => (

          <RunRow
            key={run._id}
            run={run}
            actionTitles={actionTitles}
            expanded={expandedId === run._id}
            onToggle={() => setExpandedId(prev => (prev === run._id ? null : run._id))}
          />
        ))}

        {entry?.hasMore && items.length > 0 && (
          <button type="button" onClick={() => load(items[items.length - 1].startedAt)} disabled={loading} className="w-full py-3 text-sm font-bold text-blue-400 hover:bg-slate-800/40 border-t border-slate-800 transition-all">
            {loading ? 'Yükleniyor…' : 'Daha fazla göster'}
          </button>
        )}

      </div>

    </div>
  );
};

// ───────────────────────── SÜRÜM GEÇMİŞİ ─────────────────────────

const FIELD_LABELS = {
  name: 'ad', description: 'açıklama', homeId: 'ev', isActive: 'durum', color: 'renk', icon: 'simge', tags: 'etiketler',
  triggers: 'tetikleyiciler', conditions: 'koşullar', actions: 'aksiyonlar', runMode: 'çalışma modu', maxQueued: 'kuyruk',
  cooldownSeconds: 'bekleme süresi', timezone: 'saat dilimi', activeFrom: 'geçerlilik', activeUntil: 'geçerlilik', templateKey: 'şablon',
};

const versionTitle = (v) => {

  switch (v.changeType) {
    case 'CREATE': return 'Oluşturuldu';
    case 'BASELINE': return 'Sürüm geçmişi öncesindeki hali';
    case 'TOGGLE': return v.snapshot?.isActive ? 'Aktif yapıldı' : 'Pasif yapıldı';
    case 'RESTORE': return `v${v.restoredFrom} sürümüne dönüldü`;
    default: return 'Düzenlendi';
  }
};

const versionMeta = (v) => {

  const who = v.source === 'AUTOMATION'
    ? 'başka bir otomasyon'
    : v.changedBy?.name || v.changedBy?.username || v.changedBy?.email;

  const fields = (v.changeType === 'UPDATE' || v.changeType === 'RESTORE') && v.changedFields?.length
    ? `değişen: ${[...new Set(v.changedFields.map(f => FIELD_LABELS[f] ?? f))].join(', ')}`
    : null;

  return [formatLastRun(v.createdAt), who, fields].filter(Boolean).join(' · ');
};

const VersionHistory = ({ automation, ctx }) => {

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [restoring, setRestoring] = useState(null);

  // Açılınca ve sürüm değişince (düzenleme / geri dönme) tazele
  useEffect(() => {

    if (!open) return;

    setLoading(true);
    setError(null);

    dispatch(getAutomationVersions({ id: automation.id })).unwrap()
      .then(setItems)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [open, automation.id, automation.version, dispatch]);

  const restore = async (v) => {

    if (!window.confirm(`v${v.version} sürümüne dönülecek. Şu anki hali de geçmişte saklanır, istersen tekrar dönebilirsin.`)) return;

    setRestoring(v.version);

    try {
      await dispatch(restoreAutomationVersion({ id: automation.id, version: v.version })).unwrap();
      setExpanded(null);
      toast.success(`v${v.version} sürümüne dönüldü.`);
    } catch {
      // Hata mesajı slice'taki error üzerinden gösteriliyor
    } finally {
      setRestoring(null);
    }
  };

  return (

    <div>

      <button type="button" onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between mb-2 group">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-300">Sürüm geçmişi · v{automation.version}</span>
        <ChevronDown size={14} className={`text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (

        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl overflow-hidden">

          {loading && !items.length ? (

            <div className="py-6 flex justify-center text-slate-500"><Spinner /></div>

          ) : error && !items.length ? (

            <InfoRow icon={AlertTriangle} iconColor="#ef4444" value="Sürüm geçmişi yüklenemedi" subtitle={error} danger />

          ) : !items.length ? (

            <InfoRow icon={History} iconColor="#64748b" value="Henüz sürüm kaydı yok" subtitle="Bir sonraki düzenlemede başlar." />

          ) : items.map((v) => {

            const isCurrent = v.version === automation.version;
            const isOpen = expanded === v.version;
            const view = isOpen ? toView(v.snapshot ?? {}, 0, ctx) : null;
            const tint = isCurrent ? '#3b82f6' : '#64748b';

            return (

              <div key={v._id} className="border-b border-slate-800 last:border-b-0">

                <button type="button" onClick={() => setExpanded(isOpen ? null : v.version)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-800/40">

                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0" style={{ backgroundColor: `${tint}1A`, color: tint }}>v{v.version}</div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{versionTitle(v)}{isCurrent ? ' · şu anki' : ''}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{versionMeta(v)}</p>
                  </div>

                  <ChevronDown size={16} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />

                </button>

                {isOpen && view && (

                  <div className="pr-4 pb-4 pl-[60px] text-xs text-slate-300 space-y-1">

                    <p>Ad: {view.name}</p>

                    <p className="text-[11px] font-bold text-slate-500 pt-1">Tetikleyiciler</p>
                    {view.triggerItems.map((t, j) => <p key={j}>• {t.label}</p>)}

                    {view.conditionItems.length > 0 && (
                      <>
                        <p className="text-[11px] font-bold text-slate-500 pt-1">Koşullar · {LOGIC_LABELS[view.conditionLogic] ?? ''}</p>
                        {view.conditionItems.map((c, j) => <p key={j}>• {c}</p>)}
                      </>
                    )}

                    <p className="text-[11px] font-bold text-slate-500 pt-1">Aksiyonlar</p>
                    {view.actionItems.map((a, j) => (
                      <p key={j} style={{ paddingLeft: a.depth * 12, opacity: a.disabled ? 0.5 : 1 }}>• {a.title}{a.subtitle ? ` (${a.subtitle})` : ''}</p>
                    ))}

                    <p className="text-[11px] text-slate-500 pt-1">
                      {RUN_MODE_LABELS[view.runMode] ?? view.runMode}
                      {view.cooldownSeconds ? ` · tekrar için ${formatDuration(view.cooldownSeconds)} bekler` : ''}
                    </p>

                    {!isCurrent && (
                      <button type="button" onClick={() => restore(v)} disabled={restoring != null} className="mt-2 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold hover:bg-blue-500/20 disabled:opacity-50 transition-all">
                        {restoring === v.version ? <Spinner size={14} /> : <RotateCcw size={14} />}
                        Bu sürüme dön
                      </button>
                    )}

                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

// ───────────────────────── DETAY PENCERESİ ─────────────────────────

export const DetailModal = ({ automation, ctx, onClose, onDelete, onToggle, onTrigger, onEdit, onDuplicate, onShare, triggering, duplicating, sharing }) => {

  const TriggerIcon = automation.triggerIcon;
  const nextRunLabel = automation.active ? formatNextRun(automation.nextRun) : null;
  const statusText = runStatusText(automation);
  const actionCount = automation.actionItems.filter(x => x.kind !== 'ELSE').length;
  const hasWindow = automation.activeFrom || automation.activeUntil;
  const actionTitles = new Map(automation.actionItems.filter(x => x.path).map(x => [x.path, x.title]));

  return (

    <Modal onClose={onClose}>

      {/* Başlık */}
      <div className="flex items-start gap-4 p-8 pb-6 border-b border-slate-800">

        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white flex-shrink-0" style={gradientStyle(automation.color)}>
          <TriggerIcon size={26} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold text-white break-words">{automation.name}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full ${automation.active ? 'bg-green-500' : 'bg-slate-500'}`} />
            <span className={`text-xs font-bold ${automation.active ? 'text-green-400' : 'text-slate-400'}`}>{automation.active ? 'Aktif' : 'Pasif'}</span>
          </div>
        </div>

        <button type="button" onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white">
          <X size={20} />
        </button>

      </div>

      <div className="overflow-y-auto p-8 space-y-6">

        {/* Sağlık */}
        {automation.health?.issues?.length > 0 && (
          <div>
            <SectionLabel>Sağlık · {automation.health.status === 'CRITICAL' ? 'çalışamayabilir' : automation.health.status === 'WARNING' ? 'dikkat' : 'bilgi'}</SectionLabel>
            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl overflow-hidden">
              {automation.health.issues.map((issue, i) => (
                <InfoRow key={i} icon={ISSUE_ICONS[issue.code] ?? AlertTriangle} iconColor={SEVERITY_COLORS[issue.severity] ?? '#64748b'} value={issue.message} />
              ))}
            </div>
          </div>
        )}

        {/* Genel */}
        <div>
          <SectionLabel>Genel</SectionLabel>
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl overflow-hidden">

            <InfoRow
              icon={automation.failing ? AlertTriangle : History}
              iconColor={automation.failing ? '#ef4444' : '#64748b'}
              label="Son çalışma"
              value={formatLastRun(automation.lastTriggeredAt)}
              subtitle={statusText}
              danger={automation.failing}
            />

            {nextRunLabel && <InfoRow icon={CalendarClock} iconColor="#0ea5e9" label="Sonraki çalışma" value={nextRunLabel} />}

            <InfoRow
              icon={Repeat}
              iconColor="#6366f1"
              label="Çalışma davranışı"
              value={RUN_MODE_LABELS[automation.runMode] ?? automation.runMode}
              subtitle={automation.cooldownSeconds ? `Tekrar çalışmadan önce ${formatDuration(automation.cooldownSeconds)} bekler` : null}
            />

            {hasWindow && (
              <InfoRow
                icon={CalendarRange}
                iconColor="#f59e0b"
                label="Geçerlilik"
                value={`${automation.activeFrom ? formatDate(automation.activeFrom) : '…'} – ${automation.activeUntil ? formatDate(automation.activeUntil) : '…'}`}
              />
            )}

            <InfoRow
              icon={Power}
              iconColor={automation.active ? '#10b981' : '#64748b'}
              value="Otomasyon aktif"
              right={<Toggle value={automation.active} onChange={() => onToggle(automation)} />}
            />

          </div>
        </div>

        {/* Tetikleyiciler */}
        <div>
          <SectionLabel>Tetikleyiciler{automation.triggerItems.length > 1 ? ' · herhangi biri' : ''}</SectionLabel>
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl overflow-hidden">
            {automation.triggerItems.length === 0
              ? <InfoRow icon={Layers} iconColor="#64748b" value="Tetikleyici yok" />
              : automation.triggerItems.map((t, i) => <InfoRow key={i} icon={t.icon} iconColor={t.color} value={t.label} />)}
          </div>
        </div>

        {/* Koşullar */}
        {automation.conditionItems.length > 0 && (
          <div>
            <SectionLabel>Koşullar · {LOGIC_LABELS[automation.conditionLogic] ?? ''}</SectionLabel>
            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl overflow-hidden">
              {automation.conditionItems.map((text, i) => <InfoRow key={i} icon={ListChecks} iconColor="#0ea5e9" value={text} />)}
            </div>
          </div>
        )}

        {/* Aksiyonlar */}
        <div>
          <SectionLabel>Aksiyonlar · {actionCount}</SectionLabel>
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl overflow-hidden">
            {automation.actionItems.length === 0
              ? <InfoRow icon={Layers} iconColor="#64748b" value="Aksiyon yok" />
              : automation.actionItems.map((item, i) => (
                <InfoRow key={i} icon={item.icon} iconColor={item.color} value={item.title} subtitle={item.disabled ? 'Devre dışı' : item.subtitle} depth={item.depth} muted={item.disabled} />
              ))}
          </div>
        </div>

        <RunHistory automationId={automation.id} actionTitles={actionTitles} />
        <VersionHistory automation={automation} ctx={ctx} />

      </div>

      {/* Butonlar */}
      <div className="p-6 border-t border-slate-800 space-y-3">

        <button type="button" onClick={() => onTrigger(automation)} disabled={triggering} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-xl transition-all font-bold disabled:opacity-50">
          {triggering ? <Spinner /> : <Play size={18} />} Şimdi Çalıştır
        </button>

        <div className="flex gap-3">

          <button type="button" onClick={() => onEdit(automation)} className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-xl transition-all font-bold">
            <Pencil size={18} /> Düzenle
          </button>

          <button type="button" onClick={() => onDuplicate(automation)} disabled={duplicating} className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-xl transition-all font-bold disabled:opacity-50">
            {duplicating ? <Spinner /> : <Copy size={18} />} Çoğalt
          </button>

          <button type="button" onClick={() => onShare(automation)} disabled={sharing} className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-xl transition-all font-bold disabled:opacity-50">
            {sharing ? <Spinner /> : <Share2 size={18} />} QR ile paylaş
          </button>

          <button type="button" onClick={() => onDelete(automation)} title="Otomasyonu sil" className="flex items-center justify-center bg-red-600/10 hover:bg-red-600/20 text-red-400 px-4 py-3 rounded-xl transition-all font-bold border border-red-500/20">
            <Trash2 size={18} />
          </button>

        </div>

      </div>

    </Modal>
  );
};

// ───────────────────────── PAYLAŞIM ─────────────────────────

const copyText = async (text, okMessage) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(okMessage);
  } catch {
    toast.error('Kopyalanamadı.');
  }
};

export const ShareModal = ({ data, onClose }) => (

  <Modal onClose={onClose} maxWidth="max-w-md">

    <div className="p-8 flex flex-col items-center text-center overflow-y-auto">

      <button type="button" onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
        <X size={20} />
      </button>

      <h3 className="text-xl font-bold text-white">{data.preview?.name}</h3>
      <p className="text-sm text-slate-400 mt-1">Karşı taraf QR'ı TypusHOME uygulamasıyla okutup kendi cihazlarını eşleştirir.</p>

      <div className="bg-white p-4 rounded-2xl mt-6">
        <QRCodeSVG value={data.link} size={200} />
      </div>

      <p className="text-3xl font-black tracking-[0.3em] text-white mt-5">{data.code}</p>
      <p className="text-xs text-slate-500 mt-1">{formatDate(data.expiresAt)} tarihine kadar geçerli</p>

      {data.preview?.removed?.length > 0 && (
        <p className="text-xs text-amber-400 mt-3">Başka otomasyonları ya da sahneleri çağıran adımlar şablona eklenmedi.</p>
      )}

      <div className="flex gap-3 mt-6 w-full">
        <button
          type="button"
          onClick={() => copyText(`TypusHOME otomasyon şablonu: "${data.preview?.name ?? ''}". Otomasyonlar ekranındaki QR simgesinden bu kodu gir: ${data.code}`, 'Paylaşım metni kopyalandı.')}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-all"
        >
          <Copy size={16} /> Kodu kopyala
        </button>
        <button type="button" onClick={onClose} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold transition-all">Kapat</button>
      </div>

    </div>

  </Modal>
);

// ───────────────────────── ŞABLONDAN EKLEME ─────────────────────────

const normalizeCode = (code) => String(code ?? '').replace(/[\s-]/g, '').toUpperCase();

export const ImportTemplateModal = ({ devices, homeId, onClose }) => {

  const dispatch = useDispatch();

  const [code, setCode] = useState('');
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapping, setMapping] = useState({});
  const [name, setName] = useState('');
  const [importing, setImporting] = useState(false);

  const slots = template?.slots ?? [];
  const allMapped = slots.every(s => mapping[s.key]?.deviceId);

  const load = async () => {

    const clean = normalizeCode(code);
    if (clean.length < 4) return;

    setLoading(true);

    try {
      const t = await dispatch(getTemplate(clean)).unwrap();
      setTemplate({ ...t, code: t.code ?? clean });
      setName(t.name ?? '');
      setMapping({});
    } catch (e) {
      toast.error(String(e));
    } finally {
      setLoading(false);
    }
  };

  // Şablondaki cihaz türüne uyan cihazlar; tür bilgisi yoksa hepsi
  const candidatesFor = (slot) => {
    const type = slot.deviceType ?? slot.type;
    const list = type ? devices.filter(d => d.type === type) : devices;
    return list.length ? list : devices;
  };

  const setSlot = (key, patch) => setMapping(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  const doImport = async () => {

    setImporting(true);

    try {
      const automation = await dispatch(importTemplate({ code: template.code, mapping, name: name.trim() || undefined, homeId })).unwrap();
      toast.success(`"${automation?.name ?? name}" pasif olarak eklendi. Kontrol edip açabilirsin.`);
      onClose();
    } catch (e) {
      toast.error(String(e));
    } finally {
      setImporting(false);
    }
  };

  return (

    <Modal onClose={onClose} maxWidth="max-w-lg">

      <div className="flex justify-between items-center p-8 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-2xl font-bold text-white">Şablondan ekle</h3>
          <p className="text-sm text-slate-400 mt-1">Paylaşılan 8 haneli kodu gir, kendi cihazlarınla eşleştir.</p>
        </div>
        <button type="button" onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"><X size={20} /></button>
      </div>

      <div className="overflow-y-auto p-8 space-y-5">

        <div className="flex gap-2">
          <TextInput
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => { if (e.key === 'Enter') load(); }}
            placeholder="Örn: KX7P2M9Q"
            className="font-mono tracking-widest text-base"
          />
          <button type="button" onClick={load} disabled={loading || normalizeCode(code).length < 4} className="px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold disabled:opacity-50 transition-all flex items-center gap-2">
            {loading ? <Spinner /> : <QrCode size={16} />} Aç
          </button>
        </div>

        {template && (

          <>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Otomasyon adı</label>
              <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Şablondaki ad kullanılır" />
            </div>

            {slots.length > 0 ? (

              <div className="space-y-3">

                <p className="text-sm font-bold text-slate-300">Cihazları eşleştir</p>

                {slots.map((slot) => {

                  const selected = devices.find(d => String(d._id) === String(mapping[slot.key]?.deviceId));
                  const channels = relayChannels(selected);

                  return (

                    <div key={slot.key} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-2">

                      <p className="text-sm font-semibold text-white">{slot.label ?? slot.name ?? slot.key}</p>
                      {(slot.deviceType ?? slot.type) && <p className="text-xs text-slate-500">Cihaz türü: {slot.deviceType ?? slot.type}</p>}

                      <select
                        value={mapping[slot.key]?.deviceId ?? ''}
                        onChange={(e) => setSlot(slot.key, { deviceId: e.target.value || undefined, channel: undefined })}
                        className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <option value="">Cihaz seçin...</option>
                        {candidatesFor(slot).map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                      </select>

                      {channels.length > 0 && (
                        <select
                          value={mapping[slot.key]?.channel ?? ''}
                          onChange={(e) => setSlot(slot.key, { channel: e.target.value === '' ? undefined : Number(e.target.value) })}
                          className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                          <option value="">Kanal (şablondaki gibi)</option>
                          {channels.map(ch => <option key={ch.index} value={ch.index}>{ch.label || `Kanal ${ch.index}`}</option>)}
                        </select>
                      )}

                    </div>
                  );
                })}

              </div>

            ) : (

              <p className="text-sm text-slate-400">Bu şablonda eşleştirilecek cihaz yok.</p>
            )}

            {template.removed?.length > 0 && (
              <p className="text-xs text-amber-400">Başka otomasyonları ya da sahneleri çağıran adımlar şablonda yok.</p>
            )}

            <p className="text-xs text-slate-500">Otomasyon pasif olarak eklenir; kontrol edip listeden açarsın.</p>

          </>
        )}

      </div>

      {template && (
        <div className="p-6 border-t border-slate-800">
          <button type="button" onClick={doImport} disabled={!allMapped || importing} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {importing ? <Spinner /> : null} Otomasyonu ekle
          </button>
        </div>
      )}

    </Modal>
  );
};

// ───────────────────────── ONAY BEKLEYENLER ─────────────────────────

const formatRemaining = (iso) => {

  const ms = new Date(iso) - Date.now();
  if (ms <= 0) return 'süresi doldu';

  const min = Math.ceil(ms / 60000);
  return min < 60 ? `${min} dk kaldı` : `${Math.floor(min / 60)} sa ${min % 60} dk kaldı`;
};

export const ApprovalCard = ({ approval, busy, onRespond }) => (

  <div className="bg-slate-900 border border-sky-500/20 rounded-2xl p-5">

    <div className="flex items-start gap-4">

      <IconBox icon={Hand} color="#0ea5e9" size="w-11 h-11" iconSize={18} />

      <div className="flex-1 min-w-0">
        <p className="font-bold text-white">{approval.title}</p>
        {approval.body ? <p className="text-sm text-slate-400 mt-0.5">{approval.body}</p> : null}
        <p className="text-xs text-slate-500 mt-1">
          {approval.automationId?.name ?? 'Otomasyon'}{!approval.isMine && approval.ownerName ? ` · ${approval.ownerName}` : ''} · {formatRemaining(approval.expiresAt)}
        </p>
        {approval.askedCount > 1 && <p className="text-[11px] text-slate-500 mt-0.5">{approval.askedCount} kişiye soruldu · ilk cevap geçerli</p>}
      </div>

      {busy && <Spinner className="text-sky-400" />}

    </div>

    <div className="flex gap-2 mt-4">
      <button type="button" onClick={() => onRespond('APPROVE')} disabled={busy} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm disabled:opacity-50 transition-all">Evet</button>
      <button type="button" onClick={() => onRespond('DENY')} disabled={busy} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm disabled:opacity-50 transition-all">Hayır</button>
      {approval.canSnooze && (
        <button type="button" onClick={() => onRespond('SNOOZE')} disabled={busy} className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm disabled:opacity-50 transition-all">Ertele</button>
      )}
    </div>

  </div>
);
