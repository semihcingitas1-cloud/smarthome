import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Clock, Sunrise, Sunset, Gauge, Repeat, Workflow, ShieldAlert, Zap, MapPin, Home, Hand, Mic, Bell, Hourglass, Timer, ListChecks, GitBranch, GitFork, Sparkles, ToggleLeft, Layers, Power, Moon, Users, Lock, Film, Sun, Coffee, BedDouble, Tv, Lightbulb, BookOpen, Utensils, DoorOpen, PartyPopper } from 'lucide-react';

import { getHomeStateApi, getScenesApi, apiError } from '../../services/homeApi';

// ───────────────────────── TEMEL YARDIMCILAR ─────────────────────────

export const pad = (n) => String(n).padStart(2, '0');
export const hhmm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
export const getId = (v) => (v && typeof v === 'object' ? v._id : v);
export const uid = () => Math.random().toString(36).slice(2, 10);
export const hasValue = (v) => v !== undefined && v !== null && v !== '';
export const lastSegment = (path) => String(path || '').split('.').pop();
export const HHMM = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const formatDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '…' : `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
};

export const formatDuration = (sec) => {

  const s = Number(sec) || 0;
  if (s < 60) return `${s} sn`;
  if (s < 3600) return s % 60 ? `${Math.floor(s / 60)} dk ${s % 60} sn` : `${s / 60} dk`;

  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return m ? `${h} sa ${m} dk` : `${h} sa`;
};

// ───────────────────────── GÜNLER ─────────────────────────
// 0 = Pazar ... 6 = Cumartesi (JS getDay ile aynı). [] = her gün

export const TR_DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
export const SHORT_DAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

export const formatDays = (days, everyDay = 'Her gün') => {

  if (!days?.length || days.length === 7) return everyDay;

  const key = [...days].sort((a, b) => a - b).join(',');
  if (key === '1,2,3,4,5') return 'Hafta içi';
  if (key === '0,6') return 'Hafta sonu';

  return [...days].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7)).map(d => SHORT_DAYS[d]).join(', ');
};

// ───────────────────────── ZAMAN METİNLERİ ─────────────────────────

// Saatli tetikleyicinin bir sonraki zamanı (tarayıcının saatine göre, sunucu değeri yoksa)
const getNextRun = (trigger, now) => {

  if (trigger?.source !== 'TIME' || !trigger.time) return null;

  const [h, m] = trigger.time.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;

  const days = trigger.days?.length ? trigger.days : [0, 1, 2, 3, 4, 5, 6];

  for (let i = 0; i <= 7; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, h, m, 0, 0);
    if (d > now && days.includes(d.getDay())) return d;
  }

  return null;
};

// Önce sunucunun hesapladığı nextRunAt (güneş dahil), yoksa saat tetikleyicilerinden yerel hesap
const resolveNextRun = (raw, triggers, now) => {

  if (raw.nextRunAt) {
    const d = new Date(raw.nextRunAt);
    if (!Number.isNaN(d.getTime()) && d > now) return d;
  }

  return triggers.map(t => getNextRun(t, now)).filter(Boolean).sort((a, b) => a - b)[0] ?? null;
};

export const formatNextRunDay = (date, now = new Date()) => {

  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  if (isSameDay(date, now)) return 'Bugün';
  if (isSameDay(date, tomorrow)) return 'Yarın';
  return TR_DAYS[date.getDay()];
};

export const formatNextRun = (date, now = new Date()) => (date ? `${formatNextRunDay(date, now)} ${hhmm(date)}` : null);

export const formatLastRun = (iso, now = new Date()) => {

  if (!iso) return 'Henüz çalışmadı';

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Bilinmiyor';

  const diffMin = Math.floor((now - date) / 60000);
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

  if (diffMin < 1) return 'Az önce';
  if (diffMin < 60) return `${diffMin} dk önce`;
  if (isSameDay(date, now)) return `Bugün ${hhmm(date)}`;
  if (isSameDay(date, yesterday)) return `Dün ${hhmm(date)}`;
  return `${formatDate(date)} ${hhmm(date)}`;
};

export const friendlyError = (err) => {

  const e = String(err || '');
  if (e.startsWith('access_denied')) return 'Yetki yok';
  if (e === 'missing_device') return 'Cihaz bulunamadı';
  if (e === 'ack_timeout') return 'Cihaz yanıt vermedi';
  if (e === 'cancelled') return 'İptal edildi';
  return e || 'Bilinmeyen hata';
};

export const runStatusText = (a) => {

  if (a.lastRunStatus === 'FAILED') return `Hata: ${friendlyError(a.lastError)}`;
  if (a.lastRunStatus === 'PARTIAL') return `Kısmen başarılı · ${friendlyError(a.lastError)}`;
  if (a.lastRunStatus === 'SUCCESS') return 'Başarılı';
  return null;
};

// ───────────────────────── ETİKETLER ─────────────────────────

export const TARIFF_LABELS = { DAY: 'Gündüz', PEAK: 'Puant', NIGHT: 'Gece' };
export const HOME_MODE_LABELS = { HOME: 'Evde', AWAY: 'Dışarıda', NIGHT: 'Gece', VACATION: 'Tatil' };
export const MEMBER_PRESENCE_LABELS = { HOME: 'Evde', AWAY: 'Dışarıda', OFF: 'Konum kapalı', HIDDEN: 'Gizli' };
export const RUN_MODE_LABELS = { SINGLE: 'Çalışırken yeni tetiklenmeyi yok say', RESTART: 'Çalışırken baştan başlat', QUEUED: 'Sıraya al', PARALLEL: 'Paralel çalıştır' };
export const LOGIC_LABELS = { AND: 'hepsi sağlanmalı', OR: 'en az biri yeterli', NOT: 'hiçbiri sağlanmamalı' };
export const OP_SYMBOLS = { GT: '>', GTE: '≥', LT: '<', LTE: '≤', EQ: '=', NEQ: '≠' };

export const ANOMALY_MODES = [
  { id: 'VALUE', label: 'Değer', desc: 'Sensör değeri bu saat için normalin çok dışına çıkınca (sıcaklık, nem…)' },
  { id: 'ACTIVITY', label: 'Alışılmadık saat', desc: 'Bir olay, geçmişte neredeyse hiç olmadığı bir saatte olunca (gece 3\'te hareket…)' },
  { id: 'DURATION', label: 'Uzun çalışma', desc: 'Bir röle her zamankinden çok daha uzun açık kalınca (kombi, ısıtıcı…)' },
];

const PROPERTY_LABELS = { temperature: 'sıcaklık', humidity: 'nem', online: 'bağlantı', motion: 'hareket', alert: 'alarm', state: 'durum', gas: 'gaz', water: 'su', waterDetected: 'su', power: 'güç', battery: 'pil' };
const FIELD_NAMES = { temperature: 'Sıcaklık', humidity: 'Nem', gas: 'Gaz', water: 'Su', waterDetected: 'Su', motion: 'Hareket', alert: 'Alarm', power: 'Güç', battery: 'Pil', online: 'Bağlantı' };
const BOOL_LABELS = { state: ['kapalı', 'açık'], online: ['çevrimdışı', 'çevrimiçi'], motion: ['yok', 'var'] };
const UNITS = { temperature: '°C', humidity: '%', power: 'W', battery: '%' };

// ───────────────────────── RENKLER VE SAHNE SİMGELERİ ─────────────────────────

export const GRADIENT_PRESETS = [
  ['#3b82f6', '#06b6d4'],
  ['#8b5cf6', '#ec4899'],
  ['#f59e0b', '#ef4444'],
  ['#10b981', '#14b8a6'],
  ['#6366f1', '#a855f7'],
  ['#0ea5e9', '#22c55e'],
  ['#f43f5e', '#f97316'],
  ['#64748b', '#334155'],
];

export const safeColors = (c, i = 0) => (Array.isArray(c) && c.length >= 2 ? c : GRADIENT_PRESETS[i % 4]);
export const gradientStyle = (c) => ({ backgroundImage: `linear-gradient(135deg, ${c[0]}, ${c[1]})` });

const SCENE_ICONS = { sparkles: Sparkles, film: Film, moon: Moon, sun: Sun, coffee: Coffee, bed: BedDouble, tv: Tv, lightbulb: Lightbulb, book: BookOpen, utensils: Utensils, door: DoorOpen, party: PartyPopper, power: Power };
export const sceneIcon = (name) => SCENE_ICONS[name] ?? Sparkles;

// ───────────────────────── CİHAZLAR ─────────────────────────

export const RELAY_PROPERTY = 'data.relayChannels.state';

export const RELAY_COMMANDS = [
  { id: 'on', label: 'Aç', color: '#10b981' },
  { id: 'off', label: 'Kapat', color: '#ef4444' },
];

const RELAY_PRESETS = [
  { property: RELAY_PROPERTY, operator: 'EQ', value: 'on', label: 'Açılınca', conditionLabel: 'Açıksa' },
  { property: RELAY_PROPERTY, operator: 'EQ', value: 'off', label: 'Kapanınca', conditionLabel: 'Kapalıysa' },
  { property: RELAY_PROPERTY, operator: 'CHANGE', label: 'Değişince' },
];

export const findDevice = (devices, id) => (devices ?? []).find(d => String(d._id) === String(getId(id))) || null;
export const isRelay = (d) => d?.type === 'relay';
export const relayChannels = (d) => (isRelay(d) ? d.data?.relayChannels ?? [] : []);
export const needsChannel = (d) => relayChannels(d).length > 0;

export const channelLabel = (device, ch) => {
  if (ch == null) return null;
  return device?.data?.relayChannels?.find(c => Number(c.index) === Number(ch))?.label || `Kanal ${ch}`;
};

export const propertyLabel = (path) => PROPERTY_LABELS[lastSegment(path)] ?? lastSegment(path);
export const fieldName = (path) => FIELD_NAMES[lastSegment(path)] ?? lastSegment(path);

export const formatValue = (path, v) => {

  const key = lastSegment(path);
  if (typeof v === 'boolean') return (BOOL_LABELS[key] ?? ['hayır', 'evet'])[v ? 1 : 0];
  if (v === 'on') return 'açık';
  if (v === 'off') return 'kapalı';
  if (v == null || v === '') return '—';
  return UNITS[key] ? `${v}${UNITS[key]}` : String(v);
};

// Cihazın gerçekten gönderdiği sayı ve evet/hayır alanları (sensörler için)
export const deviceFields = (device) => {

  if (!device) return [];

  const fields = Object.entries(device.data ?? {})
    .filter(([k, v]) => k !== 'relayChannels' && (typeof v === 'number' || typeof v === 'boolean'))
    .map(([k, v]) => ({ path: `data.${k}`, kind: typeof v }));

  if (typeof device.online === 'boolean') fields.push({ path: 'online', kind: 'boolean' });
  return fields;
};

// Hazır durum seçenekleri: röleler için aç/kapa, sensörler için evet/hayır alanları
export const presetsFor = (device, forCondition = false) => {

  if (!device) return [];

  const list = isRelay(device)
    ? RELAY_PRESETS.map(p => ({ ...p, label: forCondition ? p.conditionLabel ?? p.label : p.label }))
    : deviceFields(device).filter(f => f.kind === 'boolean').flatMap(f => {

      if (lastSegment(f.path) === 'online') {
        return [
          { property: f.path, operator: 'EQ', value: false, label: forCondition ? 'Çevrimdışıysa' : 'Çevrimdışı olunca' },
          { property: f.path, operator: 'EQ', value: true, label: forCondition ? 'Çevrimiçiyse' : 'Çevrimiçi olunca' },
        ];
      }

      const name = fieldName(f.path);
      return [
        { property: f.path, operator: 'EQ', value: true, label: forCondition ? `${name} varsa` : `${name} algılanınca` },
        { property: f.path, operator: 'EQ', value: false, label: forCondition ? `${name} yoksa` : `${name} bitince` },
      ];
    });

  return forCondition ? list.filter(p => p.operator !== 'CHANGE') : list;
};

export const matchPreset = (presets, x) =>
  presets.find(p => p.property === x.property && p.operator === x.operator && String(p.value) === String(x.value)) || null;

// Cihaz tetikleyicisi, cihaz koşulu ve desen adımları için ortak metin
export const describeCheck = (x, devices, forCondition = false) => {

  if (!x?.deviceId) return 'Cihaz seçilmedi';

  const device = findDevice(devices, x.deviceId) || (typeof x.deviceId === 'object' ? x.deviceId : null);
  const subject = [device?.name || 'Cihaz', channelLabel(device, x.channel)].filter(Boolean).join(' · ');
  const preset = matchPreset(presetsFor(device, forCondition), x);
  const prop = propertyLabel(x.property);

  let what;
  if (preset) what = preset.label;
  else if (!x.property || !x.operator) what = 'durum seçilmedi';
  else if (x.operator === 'CHANGE') what = `${prop} değişince`;
  else if (x.operator === 'BETWEEN') what = `${prop} ${formatValue(x.property, x.value)}–${formatValue(x.property, x.valueTo)}`;
  else if (typeof x.value === 'boolean' && x.operator === 'EQ') what = `${prop} ${formatValue(x.property, x.value)}`;
  else what = `${prop} ${OP_SYMBOLS[x.operator] ?? x.operator} ${formatValue(x.property, x.value)}`;

  return `${subject}: ${what}${x.forSeconds ? ` (${formatDuration(x.forSeconds)} boyunca)` : ''}`;
};

// Koşulun neden tuttuğu / tutmadığı (geçmiş, prova ve test için)
export const traceLine = (t) => {

  const mark = t.result ? '✓' : '✗';
  if (t.note === 'not_supported') return `${mark} ${t.kind} koşulu henüz desteklenmiyor`;
  if (t.note === 'no_location') return `${mark} Konum tanımlı değil`;
  if (t.note === 'no_home') return `${mark} Otomasyon bir eve bağlı değil`;
  if (t.kind === 'DEVICE') return `${mark} ${propertyLabel(t.property)}: ${t.actual === undefined ? 'veri yok' : formatValue(t.property, t.actual)}`;
  if (t.kind === 'TIME_RANGE') return `${mark} Saat aralığı (${t.at})`;
  if (t.kind === 'TARIFF') return `${mark} Tarife dönemi (${TARIFF_LABELS[t.period] ?? t.period})`;
  if (t.kind === 'SUN') return `${mark} Gündüz / gece`;
  if (t.kind === 'HOME_MODE') return `${mark} Ev modu (şu an: ${HOME_MODE_LABELS[t.mode] ?? 'bilinmiyor'})`;
  if (t.kind === 'PRESENCE') return `${mark} Evde bulunma (evde ${t.homeCount ?? 0} kişi)`;
  if (t.kind === 'TRIGGERED_BY') return `${mark} Tetikleyici eşleşmesi`;
  return `${mark} ${t.kind}`;
};

// ───────────────────────── KİŞİLER ─────────────────────────

// Seçilen kişilerin adları; listede yoksa "Bir üye"
export const peopleNames = (userIds = [], members = []) => userIds.map((id) => {
  const m = members.find((x) => String(x.userId) === String(id));
  return m ? (m.isMe ? 'Sen' : m.name) : 'Bir üye';
});

const describeGeofence = (t, members) => {

  const names = peopleNames(t.userIds, members);

  switch (t.geofenceEvent) {
    case 'ENTER': return names.length ? `${names.join(' veya ')} eve gelince` : 'Eve geldiğimde';
    case 'LEAVE': return names.length ? `${names.join(' veya ')} evden çıkınca` : 'Evden çıktığımda';
    case 'FIRST_ARRIVED': return 'Eve ilk kişi gelince';
    case 'LAST_LEFT': return 'Evden son kişi çıkınca';
    default: return 'Eve gelme / çıkma';
  }
};

const describePresence = (c, members) => {

  const names = peopleNames(c.userIds, members);

  switch (c.presence) {
    case 'ANYONE_HOME': return 'Evde biri varsa';
    case 'NOBODY_HOME': return 'Evde kimse yoksa';
    case 'USERS_HOME': return names.length ? `${names.join(' ve ')} evdeyse` : 'Evdeysem';
    case 'USERS_AWAY': return names.length ? `${names.join(' ve ')} dışarıdaysa` : 'Dışarıdaysam';
    default: return 'Evde kim var';
  }
};

const RECIPIENT_LABELS = { OWNER: 'sadece sana', HOME_MEMBERS: 'tüm üyelere', USERS: 'seçilenlere' };

// ───────────────────────── OKUNUR METİNLER ─────────────────────────
// ctx: { devices, members, scenes, automationNames }

export const describeTrigger = (t, ctx = {}) => {

  const devices = ctx.devices ?? [];

  switch (t?.source) {

    case 'TIME':
      return { icon: Clock, color: '#3b82f6', label: `${formatDays(t.days)} ${t.time ?? '--:--'}`, subtitle: 'Saat' };

    case 'SUN': {
      const sunrise = t.sunEvent === 'SUNRISE';
      const base = sunrise ? 'Gün doğumu' : 'Gün batımı';
      const off = Number(t.offsetMinutes) || 0;
      const when = off ? `${base}ndan ${Math.abs(off)} dk ${off < 0 ? 'önce' : 'sonra'}` : base;
      return { icon: sunrise ? Sunrise : Sunset, color: '#f97316', label: when, subtitle: formatDays(t.days) };
    }

    case 'TARIFF':
      return { icon: Gauge, color: '#14b8a6', label: `${TARIFF_LABELS[t.tariffPeriod] ?? ''} tarifesi başlayınca`, subtitle: formatDays(t.days) };

    case 'COUNT':
      return { icon: Repeat, color: '#f59e0b', label: `${describeCheck(t.event ?? {}, devices)} · ${formatDuration(t.windowSeconds ?? 0)} içinde ${t.count ?? '?'} kez`, subtitle: 'Sayı' };

    case 'SEQUENCE':
      return {
        icon: Workflow,
        color: '#0ea5e9',
        label: (t.steps ?? []).map((s, i) => `${i > 0 && s.mode === 'ABSENT' ? `${formatDuration(s.withinSeconds)} boyunca olmazsa: ` : ''}${describeCheck(s, devices)}`).join(' → ') || 'Adım yok',
        subtitle: `${t.steps?.length ?? 0} adımlı sıra`,
      };

    case 'ANOMALY': {
      const what = {
        VALUE: `${propertyLabel(t.property)} normalin dışına çıkınca`,
        ACTIVITY: 'alışılmadık bir saatte olay olunca',
        DURATION: 'her zamankinden uzun açık kalınca',
      }[t.anomalyMode] ?? 'olağan dışı durumda';
      return { icon: ShieldAlert, color: '#ef4444', label: `${findDevice(devices, t.deviceId)?.name ?? (t.deviceId ? 'Cihaz' : 'Cihaz seçilmedi')}: ${what}`, subtitle: 'Olağan dışı' };
    }

    case 'DEVICE':
      return { icon: Zap, color: '#f59e0b', label: describeCheck(t, devices), subtitle: 'Cihaz durumu' };

    case 'GEOFENCE':
      return { icon: MapPin, color: '#22c55e', label: describeGeofence(t, ctx.members ?? []), subtitle: 'Konum' };

    case 'HOME_MODE':
      return { icon: Home, color: '#14b8a6', label: `Ev modu "${HOME_MODE_LABELS[t.homeMode] ?? t.homeMode}" olunca`, subtitle: 'Ev modu' };

    case 'MANUAL':
      return { icon: Hand, color: '#6366f1', label: 'Manuel çalıştırma', subtitle: 'Elle ya da başka bir otomasyondan' };

    case 'VOICE':
      return { icon: Mic, color: '#6366f1', label: t.phrases?.[0] ? `Sesli komut: "${t.phrases[0]}"` : 'Sesli komut', subtitle: 'Ses' };

    default:
      return { icon: Lock, color: '#64748b', label: 'Bilinmeyen tetikleyici', subtitle: t?.source };
  }
};

export const describeCondition = (c, ctx = {}) => {

  const devices = ctx.devices ?? [];
  const base = { icon: ListChecks, color: '#0ea5e9' };

  if (!c) return { ...base, label: '' };

  switch (c.kind) {

    case 'GROUP': {
      const parts = (c.items ?? []).map(i => describeCondition(i, ctx).label).filter(Boolean);
      if (c.logic === 'NOT') return { ...base, icon: Layers, label: parts.length ? `Şunlar olmasın: ${parts.join(', ')}` : 'Koşul grubu' };
      const joined = parts.join(c.logic === 'OR' ? ' veya ' : ' ve ');
      return { ...base, icon: Layers, label: parts.length > 1 ? `(${joined})` : joined || 'Koşul grubu' };
    }

    case 'TARIFF': return { ...base, icon: Gauge, label: `Tarife: ${(c.tariffPeriods ?? []).map(p => TARIFF_LABELS[p] ?? p).join(' / ')}` };
    case 'DEVICE': return { ...base, icon: Zap, label: describeCheck(c, devices, true) };
    case 'TIME_RANGE': return { ...base, icon: Clock, label: [formatDays(c.days, ''), `${c.after ?? '--:--'}–${c.before ?? '--:--'}`].filter(Boolean).join(' ') };
    case 'SUN': return { ...base, icon: c.sunState === 'NIGHT' ? Moon : Sunrise, label: c.sunState === 'NIGHT' ? 'Hava karanlıksa' : 'Hava aydınlıksa' };
    case 'HOME_MODE': return { ...base, icon: Home, label: `Ev modu: ${(c.homeModes ?? []).map(m => HOME_MODE_LABELS[m] ?? m).join(' / ')}` };
    case 'PRESENCE': return { ...base, icon: Users, label: describePresence(c, ctx.members ?? []) };
    case 'TRIGGERED_BY': return { ...base, label: 'Belirli bir tetikleyiciyle başladıysa' };
    default: return { ...base, icon: Lock, label: c.kind };
  }
};

const sceneName = (sceneId, scenes = []) => {
  if (sceneId === 'all-off') return 'Hepsini kapat';
  return scenes.find((s) => String(s._id) === String(sceneId))?.name ?? null;
};

export const describeAction = (a, ctx = {}) => {

  const kind = a.kind || 'DEVICE_COMMAND';
  const targetName = ctx.automationNames?.get(String(getId(a.automationId))) ?? null;

  switch (kind) {

    case 'DEVICE_COMMAND': {
      const device = findDevice(ctx.devices, a.deviceId) || (typeof a.deviceId === 'object' ? a.deviceId : null);
      const cmd = RELAY_COMMANDS.find(c => c.id === a.command)?.label ?? a.command;
      return {
        kind,
        icon: Power,
        color: a.command === 'off' ? '#ef4444' : '#10b981',
        title: a.deviceId ? `${device?.name || 'Cihaz'} → ${cmd}` : 'Cihaz seçilmedi',
        subtitle: channelLabel(device, a.channel ?? a.payload?.channel),
      };
    }

    case 'NOTIFY': {
      const n = a.notification ?? {};
      return { kind, icon: Bell, color: n.severity === 'critical' ? '#ef4444' : '#8b5cf6', title: 'Bildirim gönder', subtitle: [n.title?.trim(), RECIPIENT_LABELS[n.recipients ?? 'OWNER']].filter(Boolean).join(' · ') };
    }

    case 'ASK_APPROVAL': {
      const ap = a.approval ?? {};
      return { kind, icon: Hand, color: '#0ea5e9', title: 'Onay iste', subtitle: [ap.title?.trim(), RECIPIENT_LABELS[ap.recipients ?? 'OWNER']].filter(Boolean).join(' · ') };
    }

    case 'DELAY':
      return { kind, icon: Hourglass, color: '#f59e0b', title: `${formatDuration(a.delaySeconds)} bekle` };

    case 'WAIT_FOR': {
      const what = a.waitTrigger ? describeTrigger(a.waitTrigger, ctx).label : null;
      const limit = a.timeoutSeconds ? `en fazla ${formatDuration(a.timeoutSeconds)}` : null;
      return { kind, icon: Timer, color: '#f59e0b', title: 'Şunu bekle', subtitle: [what, limit].filter(Boolean).join(' · ') || null };
    }

    case 'CONDITION':
      return { kind, icon: ListChecks, color: '#0ea5e9', title: 'Devam koşulu', subtitle: describeCondition(a.condition, ctx).label };

    case 'IF_ELSE':
      return { kind, icon: GitBranch, color: '#0ea5e9', title: 'Eğer', subtitle: describeCondition(a.condition, ctx).label };

    case 'PARALLEL':
      return { kind, icon: GitFork, color: '#0ea5e9', title: 'Aynı anda çalıştır', subtitle: `${a.branches?.length ?? 0} dal` };

    case 'SCENE': {
      const scene = (ctx.scenes ?? []).find((s) => String(s._id) === String(a.sceneId));
      const name = sceneName(a.sceneId, ctx.scenes);
      return {
        kind,
        icon: a.sceneId === 'all-off' ? Power : sceneIcon(scene?.icon),
        color: scene?.color ?? (a.sceneId === 'all-off' ? '#ef4444' : '#ec4899'),
        title: a.sceneId ? `"${name ?? 'Sahne'}" sahnesini çalıştır` : 'Sahne seçilmedi',
      };
    }

    case 'SET_HOME_MODE':
      return { kind, icon: Home, color: '#14b8a6', title: `Ev modunu "${HOME_MODE_LABELS[a.homeMode] ?? a.homeMode}" yap` };

    case 'SET_PRESENCE':
      return { kind, icon: Moon, color: '#6366f1', title: a.enable === false ? '"Evde varmış gibi" modunu kapat' : '"Evde varmış gibi" modunu başlat' };

    case 'RUN_AUTOMATION':
      return { kind, icon: Workflow, color: '#6366f1', title: 'Otomasyonu çalıştır', subtitle: targetName };

    case 'TOGGLE_AUTOMATION':
      return {
        kind,
        icon: ToggleLeft,
        color: '#6366f1',
        title: a.enable === false ? 'Otomasyonu kapat' : a.enable ? 'Otomasyonu aç' : 'Otomasyonu aç/kapat',
        subtitle: targetName,
      };

    default:
      return { kind, icon: Layers, color: '#64748b', title: kind };
  }
};

// İç içe aksiyonları girintili düz listeye çevirir; path, çalışma geçmişindeki adımlarla eşleşir
export const flattenActions = (actions, ctx, depth = 0, out = [], basePath = 'actions') => {

  (actions ?? []).forEach((a, i) => {

    const path = `${basePath}.${i}`;
    out.push({ ...describeAction(a, ctx), depth, disabled: a.enabled === false, path });

    if (a.kind === 'IF_ELSE') {

      flattenActions(a.thenActions, ctx, depth + 1, out, `${path}.thenActions`);

      if (a.elseActions?.length) {
        out.push({ kind: 'ELSE', icon: GitBranch, color: '#64748b', title: 'Değilse', depth });
        flattenActions(a.elseActions, ctx, depth + 1, out, `${path}.elseActions`);
      }
    }

    if (a.kind === 'PARALLEL') flattenActions(a.branches, ctx, depth + 1, out, `${path}.branches`);
  });

  return out;
};

const TRIGGER_GROUP = { TIME: 'time', SUN: 'time', TARIFF: 'time', DEVICE: 'device', COUNT: 'device', SEQUENCE: 'device', ANOMALY: 'device' };
export const groupOf = (source) => TRIGGER_GROUP[source] ?? 'other';

const ADVANCED_KINDS = new Set(['DELAY', 'WAIT_FOR', 'CONDITION', 'IF_ELSE', 'PARALLEL', 'ASK_APPROVAL']);

// Sunucudan gelen kaydı sayfanın kullandığı şekle çevirir
export const toView = (raw, i, ctx, now = new Date()) => {

  const triggers = raw.triggers?.length
    ? raw.triggers
    : raw.trigger ? [{ ...raw.trigger, operator: raw.trigger.operator ?? raw.trigger.condition }] : [];

  const triggerItems = triggers.map(t => describeTrigger(t, ctx));
  const conditionSource = Array.isArray(raw.conditions) ? [] : raw.conditions?.items ?? [];
  const actionItems = flattenActions(raw.actions, ctx);

  return {
    id: raw._id || raw.id,
    version: raw.version ?? 1,
    name: raw.name,
    color: safeColors(raw.color, i),
    active: raw.isActive !== false,
    lastTriggeredAt: raw.lastTriggeredAt,
    lastRunStatus: raw.lastRunStatus,
    lastError: raw.lastError,
    failing: raw.lastRunStatus === 'FAILED' || raw.lastRunStatus === 'PARTIAL',
    runMode: raw.runMode || 'SINGLE',
    cooldownSeconds: raw.cooldownSeconds || 0,
    activeFrom: raw.activeFrom,
    activeUntil: raw.activeUntil,
    triggers,
    triggerItems,
    triggerIcon: triggerItems[0]?.icon ?? Clock,
    triggerLabel: triggerItems.length
      ? `${triggerItems[0].label}${triggerItems.length > 1 ? ` +${triggerItems.length - 1}` : ''}`
      : 'Tetikleyici yok',
    conditionLogic: raw.conditions?.logic || 'AND',
    conditionItems: conditionSource.map(c => describeCondition(c, ctx).label).filter(Boolean),
    actionItems,
    nextRun: resolveNextRun(raw, triggers, now),
    commandCount: actionItems.filter(x => x.kind === 'DEVICE_COMMAND' || x.kind === 'SCENE').length,
    hasNotify: actionItems.some(x => x.kind === 'NOTIFY'),
    hasLogic: actionItems.some(x => ADVANCED_KINDS.has(x.kind)),
  };
};

// Kopya pasif oluşturulur, kullanıcı inceleyip açar (iki otomasyon birden tetiklenmesin)
const DUPLICATE_FIELDS = [
  'description', 'homeId', 'icon', 'tags', 'triggers', 'conditions', 'actions',
  'runMode', 'maxQueued', 'cooldownSeconds', 'timezone', 'activeFrom', 'activeUntil',
];

export const buildDuplicatePayload = (raw) => ({
  name: `${raw.name} (kopya)`,
  isActive: false,
  color: Array.isArray(raw.color) && raw.color.length >= 2 ? raw.color : undefined,
  ...Object.fromEntries(DUPLICATE_FIELDS.filter(k => raw[k] != null).map(k => [k, raw[k]])),
  ...(!raw.triggers?.length && raw.trigger ? { trigger: raw.trigger } : {}),
});

// ───────────────────────── STORE'DAN OKUMA ─────────────────────────

const EMPTY = [];

// Web'deki cihaz slice'ının adı farklıysa yalnızca burayı değiştir
export const selectDevices = (state) => state.devices?.devices ?? state.device?.devices ?? EMPTY;

const selectStoreHomeId = (state) =>
  getId(state.home?.selectedHome)
  ?? getId(state.user?.user?.user?.homes?.[0])
  ?? getId(state.user?.user?.homes?.[0])
  ?? null;

// Seçili ev; store'da yoksa cihazların bağlı olduğu ev
export const useHomeId = (devices = EMPTY) => {
  const fromStore = useSelector(selectStoreHomeId);
  return fromStore ?? getId(devices.find(d => d.homeId)?.homeId) ?? null;
};

// Evin durumu (mod, üyeler, konum) ve sahneleri
export const useHomeExtras = (homeId) => {

  const [homeState, setHomeState] = useState(null);
  const [homeError, setHomeError] = useState(null);
  const [scenes, setScenes] = useState(EMPTY);

  const reload = useCallback(() => {

    if (!homeId) return;

    getHomeStateApi(homeId)
      .then((s) => { setHomeState(s); setHomeError(null); })
      .catch((e) => setHomeError(apiError(e, 'Ev bilgisi yüklenemedi.')));

    getScenesApi(homeId)
      .then((d) => setScenes(d.scenes ?? EMPTY))
      .catch(() => setScenes(EMPTY));
  }, [homeId]);

  useEffect(() => { reload(); }, [reload]);

  return { homeState, setHomeState, homeError, members: homeState?.members ?? EMPTY, scenes, reload };
};
