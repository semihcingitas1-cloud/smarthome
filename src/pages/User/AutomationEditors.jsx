import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { createAutomation, updateAutomation, getAutomation } from '../../redux/automationSlice';

import { Modal, Chip, IconBox, Hint, DurationPicker, Spinner } from './AutomationUI';
import { TimeTriggerEditor, SunTriggerEditor, TariffTriggerEditor, DeviceCheckEditor, CountTriggerEditor, SequenceTriggerEditor, AnomalyTriggerEditor, GeofenceTriggerEditor, HomeModeTriggerEditor, TimeRangeEditor, SunConditionEditor, TariffConditionEditor, HomeModeConditionEditor, PresenceConditionEditor, RelayActionEditor, SceneActionEditor, NotifyActionEditor, ApprovalActionEditor, SetHomeModeActionEditor, PresenceActionEditor, ActionOptions, SimulationPanel, NOTIFY_LIMITS } from './AutomationEditor';
import { describeTrigger, describeCondition, describeAction, findDevice, needsChannel, getId, hasValue, uid, gradientStyle, useHomeExtras, GRADIENT_PRESETS, RELAY_COMMANDS, HHMM } from './automationShared';

import { X, Check, ChevronDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Plus, Trash2, AlertTriangle, Clock, Sunset, Gauge, Zap, Repeat, Workflow, Activity, MapPin, Home, Hand, Moon, Users, Power, Sparkles, Bell, Hourglass } from 'lucide-react';

// ───────────────────────── SEÇENEKLER ─────────────────────────

const RUN_MODES = [
  { id: 'SINGLE', label: 'Tek seferde bir', desc: 'Çalışırken gelen yeni tetiklenmeler yok sayılır.' },
  { id: 'RESTART', label: 'Baştan başlat', desc: 'Çalışırken yeniden tetiklenirse en baştan başlar. Hareketle yanan ışık için ideal.' },
  { id: 'QUEUED', label: 'Sıraya al', desc: 'Yeni tetiklenmeler sıraya girer, öncekiler bitince çalışır.' },
  { id: 'PARALLEL', label: 'Paralel', desc: 'Her tetiklenme ayrı ayrı, aynı anda çalışır.' },
];

const TRIGGER_OPTIONS = [
  { id: 'TIME', label: 'Saat', icon: Clock, color: '#3b82f6' },
  { id: 'SUN', label: 'Güneş', icon: Sunset, color: '#f97316' },
  { id: 'TARIFF', label: 'Tarife', icon: Gauge, color: '#14b8a6' },
  { id: 'DEVICE', label: 'Cihaz', icon: Zap, color: '#f59e0b' },
  { id: 'COUNT', label: 'Sayı', icon: Repeat, color: '#f59e0b' },
  { id: 'SEQUENCE', label: 'Sıra', icon: Workflow, color: '#0ea5e9' },
  { id: 'ANOMALY', label: 'Olağan dışı', icon: Activity, color: '#ef4444' },
  { id: 'GEOFENCE', label: 'Eve gelme / çıkma', icon: MapPin, color: '#22c55e' },
  { id: 'HOME_MODE', label: 'Ev modu', icon: Home, color: '#14b8a6' },
  { id: 'MANUAL', label: 'Manuel', icon: Hand, color: '#6366f1' },
];

const CONDITION_OPTIONS = [
  { id: 'TIME_RANGE', label: 'Saat aralığı', icon: Clock, color: '#0ea5e9' },
  { id: 'SUN', label: 'Gündüz / gece', icon: Moon, color: '#0ea5e9' },
  { id: 'TARIFF', label: 'Tarife dönemi', icon: Gauge, color: '#0ea5e9' },
  { id: 'HOME_MODE', label: 'Ev modu', icon: Home, color: '#0ea5e9' },
  { id: 'PRESENCE', label: 'Evde kim var', icon: Users, color: '#0ea5e9' },
  { id: 'DEVICE', label: 'Cihaz durumu', icon: Zap, color: '#0ea5e9' },
];

const ACTION_OPTIONS = [
  { id: 'DEVICE_COMMAND', label: 'Röle komutu', icon: Power, color: '#10b981' },
  { id: 'SCENE', label: 'Sahne', icon: Sparkles, color: '#ec4899' },
  { id: 'NOTIFY', label: 'Bildirim', icon: Bell, color: '#8b5cf6' },
  { id: 'ASK_APPROVAL', label: 'Onay iste', icon: Hand, color: '#0ea5e9' },
  { id: 'DELAY', label: 'Bekle', icon: Hourglass, color: '#f59e0b' },
  { id: 'SET_HOME_MODE', label: 'Ev modu', icon: Home, color: '#14b8a6' },
  { id: 'SET_PRESENCE', label: 'Evde varmış gibi', icon: Moon, color: '#6366f1' },
];

// Sunucu bildirim gönderirken bunları gerçek değerlerle değiştirir
const NOTIFY_TEMPLATE_VARS = [
  { key: '{{device.name}}', label: 'Cihaz adı', deviceOnly: true },
  { key: '{{value}}', label: 'Yeni değer', deviceOnly: true },
  { key: '{{oldValue}}', label: 'Önceki değer', deviceOnly: true },
  { key: '{{person.name}}', label: 'Gelen/çıkan kişi', geofenceOnly: true },
  { key: '{{automation.name}}', label: 'Otomasyon adı' },
];

const NEW_TRIGGER = {
  TIME: () => ({ source: 'TIME', time: '07:00', days: [] }),
  SUN: () => ({ source: 'SUN', sunEvent: 'SUNSET', offsetMinutes: 0, days: [] }),
  TARIFF: () => ({ source: 'TARIFF', tariffPeriod: 'NIGHT', days: [] }),
  DEVICE: () => ({ source: 'DEVICE' }),
  COUNT: () => ({ source: 'COUNT', event: {}, count: 3, windowSeconds: 600 }),
  SEQUENCE: () => ({ source: 'SEQUENCE', steps: [{ mode: 'OCCURS' }, { mode: 'OCCURS', withinSeconds: 120 }] }),
  ANOMALY: () => ({ source: 'ANOMALY', anomalyMode: 'VALUE', sensitivity: 'MEDIUM', direction: 'BOTH' }),
  GEOFENCE: () => ({ source: 'GEOFENCE', geofenceEvent: 'ENTER', userIds: [] }),
  HOME_MODE: () => ({ source: 'HOME_MODE', homeMode: 'AWAY' }),
  MANUAL: () => ({ source: 'MANUAL' }),
};

const NEW_CONDITION = {
  TIME_RANGE: () => ({ kind: 'TIME_RANGE', after: '22:00', before: '06:00', days: [] }),
  SUN: () => ({ kind: 'SUN', sunState: 'NIGHT' }),
  TARIFF: () => ({ kind: 'TARIFF', tariffPeriods: ['NIGHT'] }),
  HOME_MODE: () => ({ kind: 'HOME_MODE', homeModes: ['AWAY'] }),
  PRESENCE: () => ({ kind: 'PRESENCE', presence: 'NOBODY_HOME' }),
  DEVICE: () => ({ kind: 'DEVICE' }),
};

const NEW_ACTION = {
  DEVICE_COMMAND: () => ({ kind: 'DEVICE_COMMAND', command: 'on' }),
  NOTIFY: (name) => ({ kind: 'NOTIFY', notification: { title: (name || '').trim().slice(0, NOTIFY_LIMITS.title), body: '', severity: 'info' } }),
  ASK_APPROVAL: (name) => ({
    kind: 'ASK_APPROVAL',
    approval: { title: `${(name || '').trim() || 'Otomasyon'} çalışsın mı?`.slice(0, 120), body: '', timeoutSeconds: 600, onTimeout: 'STOP', snoozeMinutes: 60 },
  }),
  DELAY: () => ({ kind: 'DELAY', delaySeconds: 60 }),
  SCENE: () => ({ kind: 'SCENE' }),
  SET_HOME_MODE: () => ({ kind: 'SET_HOME_MODE', homeMode: 'AWAY' }),
  SET_PRESENCE: () => ({ kind: 'SET_PRESENCE', enable: true }),
};

// ───────────────────────── DÜZENLENEMEYENLER ─────────────────────────
// Burada düzenlenemeyen öğeler kilitli kart olarak gösterilir, olduğu gibi geri gönderilir

const EDITABLE_TRIGGERS = new Set(['TIME', 'SUN', 'TARIFF', 'DEVICE', 'COUNT', 'SEQUENCE', 'ANOMALY', 'GEOFENCE', 'HOME_MODE', 'MANUAL']);
const EDITABLE_CONDITIONS = new Set(['TIME_RANGE', 'SUN', 'TARIFF', 'HOME_MODE', 'PRESENCE', 'DEVICE']);
const EDITABLE_ACTIONS = new Set(['NOTIFY', 'DELAY', 'SET_PRESENCE', 'ASK_APPROVAL', 'SET_HOME_MODE', 'SCENE']);

const isTriggerLocked = (t) => !EDITABLE_TRIGGERS.has(t.source);
const isConditionLocked = (c) => !EDITABLE_CONDITIONS.has(c.kind);

const isActionLocked = (a) => {
  const kind = a.kind || 'DEVICE_COMMAND';
  if (kind === 'DEVICE_COMMAND') return !!a.command && !RELAY_COMMANDS.some(c => c.id === a.command);
  return !EDITABLE_ACTIONS.has(kind);
};

// ───────────────────────── DOĞRULAMA ─────────────────────────

const isCheckValid = (x, devices, allowChange) => {

  if (!x.deviceId || !x.property || !x.operator) return false;
  if (needsChannel(findDevice(devices, x.deviceId)) && x.channel == null) return false;
  if (x.operator === 'CHANGE') return allowChange;
  if (x.operator === 'BETWEEN') return hasValue(x.value) && hasValue(x.valueTo);
  return hasValue(x.value);
};

const isTriggerValid = (t, devices) => {

  if (isTriggerLocked(t)) return true;
  if (t.source === 'TIME') return HHMM.test(t.time || '');
  if (t.source === 'SUN') return !!t.sunEvent;
  if (t.source === 'TARIFF') return !!t.tariffPeriod;
  if (t.source === 'HOME_MODE') return !!t.homeMode;
  if (t.source === 'GEOFENCE') return !!t.geofenceEvent;
  if (t.source === 'DEVICE') return isCheckValid(t, devices, true);
  if (t.source === 'COUNT') return isCheckValid(t.event ?? {}, devices, true) && t.count >= 2 && t.windowSeconds >= 10;

  if (t.source === 'SEQUENCE') {
    const steps = t.steps ?? [];
    return steps.length >= 2
      && steps.every(s => isCheckValid(s, devices, true))
      && steps.slice(1).every(s => s.withinSeconds >= 1)
      && steps.every((s, i) => s.mode !== 'ABSENT' || (i > 0 && i === steps.length - 1));
  }

  if (t.source === 'ANOMALY') {
    if (!t.deviceId || !t.property) return false;
    if (t.anomalyMode === 'ACTIVITY') return isCheckValid(t, devices, true);
    if (t.anomalyMode === 'DURATION') return !needsChannel(findDevice(devices, t.deviceId)) || t.channel != null;
    return true;
  }

  return true;
};

const isConditionValid = (c, devices) => {

  if (isConditionLocked(c)) return true;
  if (c.kind === 'TIME_RANGE') return HHMM.test(c.after || '') && HHMM.test(c.before || '') && c.after !== c.before;
  if (c.kind === 'SUN') return !!c.sunState;
  if (c.kind === 'TARIFF') return (c.tariffPeriods?.length ?? 0) > 0;
  if (c.kind === 'HOME_MODE') return (c.homeModes?.length ?? 0) > 0;
  if (c.kind === 'PRESENCE') return !!c.presence;
  return isCheckValid(c, devices, false);
};

const isActionValid = (a) => {

  if (isActionLocked(a)) return true;

  const kind = a.kind || 'DEVICE_COMMAND';
  if (kind === 'DEVICE_COMMAND') return !!a.deviceId && !!a.command;
  if (kind === 'NOTIFY') return !!a.notification?.title?.trim() && (a.notification?.recipients !== 'USERS' || (a.notification?.userIds?.length ?? 0) > 0);
  if (kind === 'ASK_APPROVAL') return !!a.approval?.title?.trim() && Number(a.approval?.timeoutSeconds ?? 600) >= 60 && (a.approval?.recipients !== 'USERS' || (a.approval?.userIds?.length ?? 0) > 0);
  if (kind === 'DELAY') return Number(a.delaySeconds) >= 1;
  if (kind === 'SCENE') return !!a.sceneId;
  if (kind === 'SET_HOME_MODE') return !!a.homeMode;
  if (kind === 'SET_PRESENCE') return typeof a.enable === 'boolean';
  return true;
};

// ───────────────────────── GÖNDERİLECEK VERİ ─────────────────────────
// Tür değişince eski alanlar sunucuya gitmesin

const TRIGGER_FIELDS = {
  TIME: ['time', 'days'],
  SUN: ['sunEvent', 'offsetMinutes', 'days'],
  TARIFF: ['tariffPeriod', 'days'],
  DEVICE: ['deviceId', 'property', 'channel', 'operator', 'value', 'valueTo', 'forSeconds', 'hysteresis'],
  COUNT: ['event', 'count', 'windowSeconds'],
  SEQUENCE: ['steps'],
  ANOMALY: ['anomalyMode', 'sensitivity', 'direction', 'deviceId', 'property', 'channel', 'operator', 'value', 'valueTo'],
  GEOFENCE: ['geofenceEvent', 'userIds'],
  HOME_MODE: ['homeMode'],
  MANUAL: [],
};

const CONDITION_FIELDS = {
  TIME_RANGE: ['after', 'before', 'days'],
  SUN: ['sunState'],
  TARIFF: ['tariffPeriods'],
  HOME_MODE: ['homeModes'],
  PRESENCE: ['presence', 'userIds'],
  DEVICE: ['deviceId', 'property', 'channel', 'operator', 'value', 'valueTo', 'forSeconds'],
};

const ACTION_FIELDS = {
  DEVICE_COMMAND: ['deviceId', 'command', 'channel'],
  NOTIFY: ['notification'],
  ASK_APPROVAL: ['approval'],
  DELAY: ['delaySeconds'],
  SCENE: ['sceneId'],
  SET_HOME_MODE: ['homeMode'],
  SET_PRESENCE: ['enable'],
};

const pickDefined = (obj, keys) => Object.fromEntries(keys.filter(k => hasValue(obj[k])).map(k => [k, obj[k]]));
const stripKey = ({ _key, ...rest }) => rest;

const cleanTrigger = (t) => (isTriggerLocked(t)
  ? stripKey(t)
  : { ...pickDefined(t, ['_id', ...TRIGGER_FIELDS[t.source]]), source: t.source });

const cleanCondition = (c) => (isConditionLocked(c)
  ? stripKey(c)
  : { ...pickDefined(c, CONDITION_FIELDS[c.kind]), kind: c.kind });

const cleanAction = (a) => {

  if (isActionLocked(a)) return stripKey(a);

  const kind = a.kind || 'DEVICE_COMMAND';
  const out = { ...pickDefined(a, ['_id', 'enabled', 'continueOnError', ...ACTION_FIELDS[kind]]), kind };

  // Kanalsız cihaz komutlarında ek veri varsa korunur
  if (kind === 'DEVICE_COMMAND' && a.channel == null && a.payload) out.payload = a.payload;
  return out;
};

const browserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Istanbul';
  } catch {
    return 'Europe/Istanbul';
  }
};

// ───────────────────────── LİSTE DURUMU ─────────────────────────

const useItemList = (initial = []) => {

  const [items, setItems] = useState(() => initial.map(i => ({ ...i, _key: uid() })));

  const add = (item) => {
    const key = uid();
    setItems(prev => [...prev, { ...item, _key: key }]);
    return key;
  };

  const update = (key, next) => setItems(prev => prev.map(i => (i._key === key ? { ...next, _key: key } : i)));
  const remove = (key) => setItems(prev => prev.filter(i => i._key !== key));

  const move = (key, dir) => setItems(prev => {
    const i = prev.findIndex(x => x._key === key);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= prev.length) return prev;
    const next = [...prev];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });

  const reset = (list) => setItems(list.map(i => ({ ...i, _key: uid() })));

  return { items, add, update, remove, move, reset };
};

// ───────────────────────── KART VE EKLEME DÜĞMELERİ ─────────────────────────

const ItemCard = ({ icon, color, title, subtitle, locked, invalid, muted, expanded, onToggle, onDelete, onMoveUp, onMoveDown, children }) => (

  <div className={`rounded-2xl border bg-slate-800/50 transition-all ${invalid && !expanded ? 'border-red-500/70' : expanded ? 'border-slate-600' : 'border-slate-700'}`}>

    <div className="flex items-center gap-1 p-4">

      <button type="button" onClick={locked ? undefined : onToggle} className={`flex-1 flex items-center gap-3 text-left min-w-0 ${locked ? 'cursor-default' : ''}`} style={{ opacity: muted ? 0.5 : 1 }}>

        <IconBox icon={icon} color={color} size="w-10 h-10" iconSize={18} />

        <div className="min-w-0">
          <p className="font-bold text-white break-words">{title}</p>
          {subtitle ? <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p> : null}
          {locked ? <p className="text-[11px] text-amber-400 mt-0.5">Burada düzenlenemiyor · olduğu gibi korunur</p> : null}
          {invalid && !locked ? <p className="text-[11px] text-red-400 mt-0.5">Eksik bilgi var</p> : null}
        </div>

      </button>

      {!locked && (
        <button type="button" onClick={onToggle} className="p-2 text-slate-500 hover:text-white rounded-lg">
          <ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )}

      {onMoveUp && <button type="button" onClick={onMoveUp} title="Yukarı taşı" className="p-2 text-slate-500 hover:text-white rounded-lg"><ArrowUp size={16} /></button>}
      {onMoveDown && <button type="button" onClick={onMoveDown} title="Aşağı taşı" className="p-2 text-slate-500 hover:text-white rounded-lg"><ArrowDown size={16} /></button>}

      <button type="button" onClick={onDelete} title="Sil" className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
        <Trash2 size={16} />
      </button>

    </div>

    {expanded && !locked ? <div className="px-5 pb-5 pt-4 border-t border-slate-700/60">{children}</div> : null}

  </div>
);

const AddButtons = ({ options, onAdd }) => (

  <div className="flex flex-wrap gap-2 pt-1">
    {options.map(({ id, label, icon: Icon, color, disabled }) => (
      <button
        key={id}
        type="button"
        onClick={() => onAdd(id)}
        disabled={disabled}
        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-dashed text-sm font-bold hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        style={{ borderColor: color, color }}
      >
        <Plus size={14} />
        <Icon size={14} />
        {label}
      </button>
    ))}
  </div>
);

// ───────────────────────── ANA PENCERE ─────────────────────────

const STEP_TITLES = ['', 'Ad ve görünüm', 'Tetikleyiciler', 'Koşullar', 'Aksiyonlar', 'Ayarlar ve özet'];
const LAST_STEP = 5;

const AutomationEditor = ({ automationId, homeId, devices, members: homeMembers, scenes: homeScenes, onClose }) => {

  const dispatch = useDispatch();
  const isEdit = !!automationId;

  const { createLoading, updateLoading } = useSelector((state) => state.automation);
  const existing = useSelector((state) => (automationId ? state.automation.automations.find(a => a._id === automationId) : null));

  const [hydrated, setHydrated] = useState(!isEdit);
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(isEdit ? LAST_STEP : 1);
  const [expandedKey, setExpandedKey] = useState(null);

  const [name, setName] = useState('');
  const [color, setColor] = useState(GRADIENT_PRESETS[0]);
  const triggers = useItemList(isEdit ? [] : [NEW_TRIGGER.TIME()]);
  const conditions = useItemList([]);
  const actions = useItemList([]);
  const [logic, setLogic] = useState('AND');
  const [runMode, setRunMode] = useState('SINGLE');
  const [cooldown, setCooldown] = useState(0);

  // Başka bir eve bağlı otomasyon düzenleniyorsa o evin üyeleri ve sahneleri kullanılır
  const automationHomeId = getId(existing?.homeId) ?? null;
  const otherHomeId = automationHomeId && String(automationHomeId) !== String(homeId) ? automationHomeId : null;
  const other = useHomeExtras(otherHomeId);
  const members = otherHomeId ? other.members : homeMembers;
  const scenes = otherHomeId ? other.scenes : homeScenes;

  // ── Sunucudan gelen kaydı düzenleme durumuna aktarma ──

  const hydrate = (a) => {

    setName(a.name ?? '');
    setColor(Array.isArray(a.color) && a.color.length >= 2 ? a.color : GRADIENT_PRESETS[0]);

    triggers.reset(a.triggers?.length
      ? a.triggers
      : a.trigger ? [{ ...a.trigger, operator: a.trigger.operator ?? a.trigger.condition }] : []);

    const root = a.conditions;

    if (Array.isArray(root)) {
      conditions.reset(root.map(c => ({ kind: 'DEVICE', deviceId: c.deviceId, property: c.property, operator: c.operator, value: c.value })));
      setLogic('AND');
    } else if (root?.logic === 'NOT') {
      conditions.reset([root]); // kök NOT grubu bütün olarak korunur
      setLogic('AND');
    } else {
      conditions.reset(root?.items ?? []);
      setLogic(root?.logic === 'OR' ? 'OR' : 'AND');
    }

    actions.reset((a.actions ?? []).map(x => ((x.kind ?? 'DEVICE_COMMAND') === 'DEVICE_COMMAND'
      ? { ...x, kind: 'DEVICE_COMMAND', deviceId: getId(x.deviceId), channel: x.channel ?? x.payload?.channel }
      : x)));

    setRunMode(a.runMode || 'SINGLE');
    setCooldown(a.cooldownSeconds || 0);
  };

  useEffect(() => {

    if (!isEdit || existing) return;

    dispatch(getAutomation(automationId)).unwrap().catch((message) => {
      toast.error(message || 'Otomasyon yüklenemedi.');
      onClose();
    });
  }, [automationId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {

    if (!isEdit || hydrated || !existing) return;
    hydrate(existing);
    setHydrated(true);
  }, [existing, hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Türetilmiş durum ──

  const ctx = { devices, members, scenes };

  const hasDeviceTrigger = triggers.items.some(t => t.source === 'DEVICE');
  const hasGeofenceTrigger = triggers.items.some(t => t.source === 'GEOFENCE');
  const templateVars = NOTIFY_TEMPLATE_VARS.filter(v => (!v.deviceOnly || hasDeviceTrigger) && (!v.geofenceOnly || hasGeofenceTrigger));

  const nameOk = name.trim().length > 0;
  const triggersOk = triggers.items.length > 0 && triggers.items.every(t => isTriggerValid(t, devices));
  const conditionsOk = conditions.items.every(c => isConditionValid(c, devices));
  const actionsOk = actions.items.length > 0 && actions.items.every(isActionValid);
  const allValid = nameOk && triggersOk && conditionsOk && actionsOk;
  const canNext = [null, nameOk, triggersOk, conditionsOk, actionsOk, allValid][step];
  const saving = createLoading || updateLoading;

  const lockedCount =
    triggers.items.filter(isTriggerLocked).length
    + conditions.items.filter(isConditionLocked).length
    + actions.items.filter(isActionLocked).length;

  // Kapatırken kaydedilmemiş değişiklik var mı
  const snapshot = () => JSON.stringify([name, color, triggers.items, conditions.items, actions.items, logic, runMode, cooldown]);
  const initialSnapshot = useRef(null);

  useEffect(() => {
    if (hydrated && initialSnapshot.current === null) initialSnapshot.current = snapshot();
  });

  const requestClose = () => {
    const dirty = initialSnapshot.current !== null && snapshot() !== initialSnapshot.current;
    if (dirty && !window.confirm('Kaydedilmemiş değişiklikler kaybolacak. Kapatılsın mı?')) return;
    onClose();
  };

  // ── Gezinme ──

  const goTo = (s) => {
    setStep(s);
    setMaxStep(m => Math.max(m, s));
    setExpandedKey(null);
  };

  const addItem = (list, item) => setExpandedKey(list.add(item));

  // ── Kaydetme ──

  const buildPayload = () => {

    const payload = {
      name: name.trim(),
      color,
      triggers: triggers.items.map(cleanTrigger),
      conditions: { kind: 'GROUP', logic, items: conditions.items.map(cleanCondition) },
      actions: actions.items.map(cleanAction),
      runMode,
      cooldownSeconds: cooldown,
    };

    // Düzenlemede ev ve saat dilimi olduğu gibi kalır
    if (!isEdit) Object.assign(payload, { homeId, timezone: browserTimezone(), isActive: true });

    // Eve bağlı olmayan eski otomasyonlar düzenlenince seçili eve bağlansın (ev modu ve aile bildirimi için)
    if (isEdit && !existing?.homeId && homeId) payload.homeId = homeId;

    return payload;
  };

  // Prova ve test için: düzenlemede de otomasyonun evi gönderilsin (ev modu koşulları buna bakar)
  const buildDraft = () => ({ ...buildPayload(), homeId: automationHomeId ?? homeId });

  const handleSave = async () => {

    if (!allValid || saving) return;

    try {
      if (isEdit) {
        await dispatch(updateAutomation({ id: automationId, data: { ...buildPayload(), baseVersion: existing?.version } })).unwrap();
        toast.success('Değişiklikler kaydedildi.');
      } else {
        await dispatch(createAutomation(buildPayload())).unwrap();
        toast.success('Otomasyon oluşturuldu.');
      }
      onClose();
    } catch {
      // Hata mesajı otomasyon sayfasında toast ile gösteriliyor
    }
  };

  // ── Liste çizimi ──

  const renderItems = (list, { summarize, renderEditor, isValid, isLocked, movable, isMuted }) => (

    <div className="space-y-3 mb-4">
      {list.items.map((item, idx) => {

        const s = summarize(item);
        const key = item._key;

        return (
          <ItemCard
            key={key}
            icon={s.icon}
            color={s.color}
            title={s.title}
            subtitle={s.subtitle}
            locked={isLocked(item)}
            invalid={!isValid(item)}
            muted={isMuted?.(item)}
            expanded={expandedKey === key}
            onToggle={() => setExpandedKey(expandedKey === key ? null : key)}
            onDelete={() => { list.remove(key); if (expandedKey === key) setExpandedKey(null); }}
            onMoveUp={movable && idx > 0 ? () => list.move(key, -1) : undefined}
            onMoveDown={movable && idx < list.items.length - 1 ? () => list.move(key, 1) : undefined}
          >
            {renderEditor(item, (next) => list.update(key, next))}
          </ItemCard>
        );
      })}
    </div>
  );

  const summarizeTrigger = (t) => {
    const d = describeTrigger(t, ctx);
    return { icon: d.icon, color: d.color, title: d.label, subtitle: d.subtitle };
  };

  const summarizeCondition = (c) => {
    const d = describeCondition(c, ctx);
    return { icon: d.icon, color: d.color, title: d.label };
  };

  const summarizeAction = (a) => describeAction(a, ctx);

  const renderTriggerEditor = (t, onChange) => {
    if (t.source === 'TIME') return <TimeTriggerEditor value={t} onChange={onChange} />;
    if (t.source === 'SUN') return <SunTriggerEditor value={t} onChange={onChange} />;
    if (t.source === 'TARIFF') return <TariffTriggerEditor value={t} onChange={onChange} />;
    if (t.source === 'HOME_MODE') return <HomeModeTriggerEditor value={t} onChange={onChange} />;
    if (t.source === 'GEOFENCE') return <GeofenceTriggerEditor value={t} onChange={onChange} members={members} />;
    if (t.source === 'DEVICE') return <DeviceCheckEditor value={t} onChange={onChange} devices={devices} />;
    if (t.source === 'COUNT') return <CountTriggerEditor value={t} onChange={onChange} devices={devices} />;
    if (t.source === 'SEQUENCE') return <SequenceTriggerEditor value={t} onChange={onChange} devices={devices} />;
    if (t.source === 'ANOMALY') return <AnomalyTriggerEditor value={t} onChange={onChange} devices={devices} />;
    return <Hint>Bu tetikleyicinin ayarı yok. Otomasyon yalnızca elle ya da başka bir otomasyondan çalıştırılır.</Hint>;
  };

  const renderConditionEditor = (c, onChange) => {
    if (c.kind === 'TIME_RANGE') return <TimeRangeEditor value={c} onChange={onChange} />;
    if (c.kind === 'SUN') return <SunConditionEditor value={c} onChange={onChange} />;
    if (c.kind === 'TARIFF') return <TariffConditionEditor value={c} onChange={onChange} />;
    if (c.kind === 'HOME_MODE') return <HomeModeConditionEditor value={c} onChange={onChange} />;
    if (c.kind === 'PRESENCE') return <PresenceConditionEditor value={c} onChange={onChange} members={members} />;
    return <DeviceCheckEditor value={c} onChange={onChange} devices={devices} forCondition />;
  };

  const renderActionEditor = (a, onChange) => (
    <>
      {a.kind === 'DEVICE_COMMAND' && <RelayActionEditor value={a} onChange={onChange} devices={devices} />}
      {a.kind === 'SCENE' && <SceneActionEditor value={a} onChange={onChange} scenes={scenes} />}
      {a.kind === 'NOTIFY' && <NotifyActionEditor value={a} onChange={onChange} templateVars={templateVars} members={members} />}
      {a.kind === 'ASK_APPROVAL' && <ApprovalActionEditor value={a} onChange={onChange} members={members} />}
      {a.kind === 'DELAY' && <DurationPicker color="#f59e0b" value={a.delaySeconds ?? 60} onChange={(s) => onChange({ ...a, delaySeconds: s })} presets={[10, 30, 60, 300, 900, 1800]} />}
      {a.kind === 'SET_HOME_MODE' && <SetHomeModeActionEditor value={a} onChange={onChange} />}
      {a.kind === 'SET_PRESENCE' && <PresenceActionEditor value={a} onChange={onChange} />}
      <ActionOptions value={a} onChange={onChange} />
    </>
  );

  return (

    <Modal onClose={requestClose} maxWidth="max-w-4xl" closeOnBackdrop={false}>

      {/* BAŞLIK */}
      <div className="flex justify-between items-center px-8 pt-7 pb-4">

        <div>
          <h3 className="text-2xl font-bold text-white">{isEdit ? 'Otomasyonu düzenle' : 'Yeni Otomasyon'}</h3>
          <p className="text-sm text-slate-400 mt-1">Adım {step}/{LAST_STEP} · {STEP_TITLES[step]}</p>
        </div>

        <div className="flex items-center gap-2">
          {isEdit && hydrated && (
            <button type="button" onClick={handleSave} disabled={!allValid || saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              {saving ? <Spinner size={16} /> : <Check size={16} />} Kaydet
            </button>
          )}
          <button type="button" onClick={requestClose} className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

      </div>

      {/* İLERLEME (ziyaret edilen adımlara tıklanarak geçilir) */}
      <div className="grid grid-cols-5 gap-2 px-8 pb-4 border-b border-slate-800">
        {[1, 2, 3, 4, 5].map(i => (
          <button key={i} type="button" onClick={() => i <= maxStep && goTo(i)} disabled={i > maxStep} className="text-left disabled:cursor-not-allowed group">
            <div className={`h-2 rounded-full transition-all ${i <= step ? 'bg-blue-500' : i <= maxStep ? 'bg-blue-500/30' : 'bg-slate-800'}`} />
            <p className={`hidden md:block text-[11px] font-bold mt-1.5 truncate ${i === step ? 'text-blue-400' : i <= maxStep ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-600'}`}>{STEP_TITLES[i]}</p>
          </button>
        ))}
      </div>

      {/* İÇERİK */}
      <div className="flex-1 overflow-y-auto px-8 py-6">

        {!hydrated ? (

          <div className="flex justify-center py-20 text-blue-500"><Spinner size={28} /></div>

        ) : (

          <>

            {/* 1 · Ad ve görünüm */}
            {step === 1 && (

              <div className="space-y-6">

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Otomasyon Adı *</label>
                  <input
                    autoFocus={!isEdit}
                    placeholder="örn: Sabah Rutini"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && nameOk) goTo(2); }}
                    className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">Renk</label>
                  <div className="flex gap-3 flex-wrap">
                    {GRADIENT_PRESETS.map((preset, i) => {
                      const active = Array.isArray(color) && color.join() === preset.join();
                      return (
                        <button key={i} type="button" onClick={() => setColor(preset)} className={`w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all ${active ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'hover:scale-105'}`} style={gradientStyle(preset)}>
                          {active && <Check size={18} strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* 2 · Tetikleyiciler */}
            {step === 2 && (

              <div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-5">
                  <p className="text-sm text-blue-400 font-bold">Tetikleyiciler</p>
                  <p className="text-xs text-slate-400 mt-1">Otomasyon ne zaman çalışsın?{triggers.items.length > 1 ? ' Bunlardan herhangi biri gerçekleşince çalışır.' : ''}</p>
                </div>

                {renderItems(triggers, {
                  summarize: summarizeTrigger,
                  renderEditor: renderTriggerEditor,
                  isValid: (t) => isTriggerValid(t, devices),
                  isLocked: isTriggerLocked,
                })}

                <AddButtons
                  options={TRIGGER_OPTIONS.map(o => ({ ...o, disabled: o.id === 'MANUAL' && triggers.items.some(t => t.source === 'MANUAL') }))}
                  onAdd={(id) => addItem(triggers, NEW_TRIGGER[id]())}
                />

              </div>
            )}

            {/* 3 · Koşullar */}
            {step === 3 && (

              <div>

                <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-4 mb-5">
                  <p className="text-sm text-sky-400 font-bold">Koşullar (opsiyonel)</p>
                  <p className="text-xs text-slate-400 mt-1">Tetiklendiğinde otomasyonun gerçekten çalışması için sağlanması gerekenler. Koşul yoksa her tetiklendiğinde çalışır.</p>
                </div>

                {conditions.items.length > 1 && (
                  <div className="flex gap-2 mb-4 max-w-md">
                    <Chip grow label="Hepsi sağlansın" color="#0ea5e9" active={logic === 'AND'} onClick={() => setLogic('AND')} />
                    <Chip grow label="Biri yeterli" color="#0ea5e9" active={logic === 'OR'} onClick={() => setLogic('OR')} />
                  </div>
                )}

                {renderItems(conditions, {
                  summarize: summarizeCondition,
                  renderEditor: renderConditionEditor,
                  isValid: (c) => isConditionValid(c, devices),
                  isLocked: isConditionLocked,
                })}

                <AddButtons options={CONDITION_OPTIONS} onAdd={(id) => addItem(conditions, NEW_CONDITION[id]())} />

              </div>
            )}

            {/* 4 · Aksiyonlar */}
            {step === 4 && (

              <div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-5">
                  <p className="text-sm text-green-400 font-bold">Aksiyonlar</p>
                  <p className="text-xs text-slate-400 mt-1">Otomasyon çalışınca ne olsun? Aksiyonlar yukarıdan aşağıya sırayla çalışır; araya bekleme ekleyebilirsin.</p>
                </div>

                {renderItems(actions, {
                  summarize: summarizeAction,
                  renderEditor: renderActionEditor,
                  isValid: isActionValid,
                  isLocked: isActionLocked,
                  isMuted: (a) => a.enabled === false,
                  movable: true,
                })}

                <AddButtons options={ACTION_OPTIONS} onAdd={(id) => addItem(actions, NEW_ACTION[id](name))} />

              </div>
            )}

            {/* 5 · Ayarlar ve özet */}
            {step === 5 && (

              <div className="space-y-6">

                <div className="rounded-2xl p-6 text-white" style={gradientStyle(color)}>

                  <p className="text-xs font-bold uppercase tracking-wider text-white/70">Otomasyon</p>
                  <p className="text-2xl font-black mb-4">{name}</p>

                  <div className="grid md:grid-cols-3 gap-5 text-sm">

                    <div>
                      <p className="text-xs font-bold text-white/70 mb-1">{triggers.items.length > 1 ? 'Şunlardan biri olunca' : 'Ne zaman'}</p>
                      {triggers.items.map(t => <p key={t._key} className="text-white/90">• {summarizeTrigger(t).title}</p>)}
                    </div>

                    <div>
                      <p className="text-xs font-bold text-white/70 mb-1">{conditions.items.length === 0 ? 'Koşul' : logic === 'OR' ? 'Şunlardan biri sağlanırsa' : 'Şunların hepsi sağlanırsa'}</p>
                      {conditions.items.length === 0
                        ? <p className="text-white/70">Koşul yok</p>
                        : conditions.items.map(c => <p key={c._key} className="text-white/90">• {summarizeCondition(c).title}</p>)}
                    </div>

                    <div>
                      <p className="text-xs font-bold text-white/70 mb-1">Sırayla yap</p>
                      {actions.items.map((a, i) => (
                        <p key={a._key} className="text-white/90" style={{ opacity: a.enabled === false ? 0.5 : 1 }}>{i + 1}. {summarizeAction(a).title}</p>
                      ))}
                    </div>

                  </div>

                </div>

                <div className="grid md:grid-cols-2 gap-6">

                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Çalışma modu</p>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
                      {RUN_MODES.map((m) => {
                        const active = runMode === m.id;
                        return (
                          <button key={m.id} type="button" onClick={() => setRunMode(m.id)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left border-b border-slate-700/60 last:border-b-0 hover:bg-slate-800/60 transition-all">
                            <div className="flex-1">
                              <p className={`text-sm font-bold ${active ? 'text-blue-400' : 'text-white'}`}>{m.label}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>
                            </div>
                            {active && <Check size={18} className="text-blue-400" strokeWidth={3} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Tekrar çalışmadan önce bekle</p>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                      <DurationPicker value={cooldown} onChange={setCooldown} presets={[0, 60, 300, 900, 3600]} />
                      <Hint>Bu süre dolmadan gelen tetiklenmeler atlanır. Sık tetiklenen sensörlerde bildirim yağmurunu önler.</Hint>
                    </div>
                  </div>

                </div>

                {lockedCount > 0 && (
                  <div className="flex gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                    <AlertTriangle size={18} className="text-amber-400 flex-shrink-0" />
                    <p className="text-xs text-amber-300 leading-relaxed">Bu otomasyonda burada düzenlenemeyen {lockedCount} öğe var. Kaydettiğinde olduğu gibi korunurlar.</p>
                  </div>
                )}

                {!allValid && <p className="text-xs text-red-400">Eksik bilgi olan adımlar var. Kırmızı çerçeveli kartları tamamla.</p>}

                <SimulationPanel buildDraft={buildDraft} triggerItems={triggers.items} devices={devices} enabled={allValid} />

              </div>
            )}

          </>
        )}

      </div>

      {/* ALT DÜĞMELER */}
      <div className="flex justify-between items-center px-8 py-5 border-t border-slate-800">

        {step > 1 ? (
          <button type="button" onClick={() => goTo(step - 1)} className="flex items-center gap-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-bold">
            <ChevronLeft size={18} /> Geri
          </button>
        ) : <span />}

        <button
          type="button"
          onClick={() => (step < LAST_STEP ? goTo(step + 1) : handleSave())}
          disabled={!hydrated || !canNext || saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Spinner /> : step === LAST_STEP ? <Check size={18} /> : null}
          {step === LAST_STEP ? (isEdit ? 'Değişiklikleri kaydet' : 'Kaydet ve aktif et') : 'Devam'}
          {step < LAST_STEP && <ChevronRight size={18} />}
        </button>

      </div>

    </Modal>
  );
};

export default AutomationEditor;
