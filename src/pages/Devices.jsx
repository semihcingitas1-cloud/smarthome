import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import Sidebar from '../../layout/Sidebar';
import { getMyDevices, updateDevice, deleteDevice, assignDeviceToRoom, toggleRelay, acknowledgeWaterAlarm, getLatestFirmware, sendOtaUpdate, updateOtaStatus, clearOtaStatus } from '../../redux/devicesSlice';

import { Plus, Search, SlidersHorizontal, Wifi, WifiOff, EllipsisVertical, Power, Thermometer, Droplets, Droplet, TriangleAlert, CircleCheck, Activity, SignalHigh, SignalMedium, SignalLow, BatteryFull, BatteryMedium, BatteryLow, Trash2, RefreshCw, X, Save, Zap, Cpu, ChevronUp, ChevronDown, Minus, Bluetooth, Sparkles, LoaderCircle, Router, Flame, Blinds, Wind, Footprints, Download, Pencil, Smartphone, House } from 'lucide-react';

// ───────────────────────── AYARLAR ─────────────────────────

const POLL_MS = 15000;      // arka planda liste yenileme
const OTA_POLL_MS = 5000;   // güncelleme sürerken daha sık
const OTA_TIMEOUT_MS = 5 * 60 * 1000;

// Tailwind sınıfları tam yazılmalı (dinamik birleştirme derlemede kaybolur)
const ACCENTS = {
  blue: { active: 'bg-blue-500/20 text-blue-500', hover: 'hover:border-blue-500/50 hover:shadow-blue-500/10', title: 'group-hover:text-blue-500 dark:group-hover:text-blue-400', button: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/40', channelOn: 'bg-gradient-to-br from-blue-600 to-blue-500 border-blue-500 shadow-lg shadow-blue-500/30', pill: 'bg-blue-500/15 text-blue-600 dark:text-blue-400', bar: 'from-blue-500 to-cyan-400' },
  indigo: { active: 'bg-indigo-500/20 text-indigo-500', hover: 'hover:border-indigo-500/50 hover:shadow-indigo-500/10', title: 'group-hover:text-indigo-500 dark:group-hover:text-indigo-400', button: 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-500/40', channelOn: 'bg-gradient-to-br from-indigo-600 to-indigo-500 border-indigo-500 shadow-lg shadow-indigo-500/30', pill: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400', bar: 'from-indigo-500 to-violet-400' },
  orange: { active: 'bg-orange-500/20 text-orange-500', hover: 'hover:border-orange-500/50 hover:shadow-orange-500/10', title: 'group-hover:text-orange-500 dark:group-hover:text-orange-400', button: 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white shadow-lg shadow-orange-500/40', channelOn: 'bg-gradient-to-br from-orange-600 to-orange-500 border-orange-500 shadow-lg shadow-orange-500/30', pill: 'bg-orange-500/15 text-orange-600 dark:text-orange-400', bar: 'from-orange-400 to-red-500' },
  purple: { active: 'bg-purple-500/20 text-purple-500', hover: 'hover:border-purple-500/50 hover:shadow-purple-500/10', title: 'group-hover:text-purple-500 dark:group-hover:text-purple-400', button: 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-500/40', channelOn: 'bg-gradient-to-br from-purple-600 to-purple-500 border-purple-500 shadow-lg shadow-purple-500/30', pill: 'bg-purple-500/15 text-purple-600 dark:text-purple-400', bar: 'from-purple-500 to-purple-300' },
  cyan: { active: 'bg-cyan-500/20 text-cyan-500', hover: 'hover:border-cyan-500/50 hover:shadow-cyan-500/10', title: 'group-hover:text-cyan-500 dark:group-hover:text-cyan-400', button: 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-lg shadow-cyan-500/40', channelOn: 'bg-gradient-to-br from-cyan-600 to-cyan-500 border-cyan-500 shadow-lg shadow-cyan-500/30', pill: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400', bar: 'from-blue-400 to-cyan-500' },
  amber: { active: 'bg-amber-500/20 text-amber-500', hover: 'hover:border-amber-500/50 hover:shadow-amber-500/10', title: 'group-hover:text-amber-500 dark:group-hover:text-amber-400', button: 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-lg shadow-amber-500/40', channelOn: 'bg-gradient-to-br from-amber-600 to-amber-500 border-amber-500 shadow-lg shadow-amber-500/30', pill: 'bg-amber-500/15 text-amber-600 dark:text-amber-400', bar: 'from-amber-400 to-orange-500' },
  emerald: { active: 'bg-emerald-500/20 text-emerald-500', hover: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10', title: 'group-hover:text-emerald-500 dark:group-hover:text-emerald-400', button: 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/40', channelOn: 'bg-gradient-to-br from-emerald-600 to-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30', pill: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', bar: 'from-emerald-400 to-teal-500' },
  sky: { active: 'bg-sky-500/20 text-sky-500', hover: 'hover:border-sky-500/50 hover:shadow-sky-500/10', title: 'group-hover:text-sky-500 dark:group-hover:text-sky-400', button: 'bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white shadow-lg shadow-sky-500/40', channelOn: 'bg-gradient-to-br from-sky-600 to-sky-500 border-sky-500 shadow-lg shadow-sky-500/30', pill: 'bg-sky-500/15 text-sky-600 dark:text-sky-400', bar: 'from-sky-400 to-blue-500' },
  red: { active: 'bg-red-500/20 text-red-500', hover: 'hover:border-red-500', title: 'group-hover:text-red-500 dark:group-hover:text-red-400', button: 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-500/40', channelOn: 'bg-gradient-to-br from-red-600 to-red-500 border-red-500 shadow-lg shadow-red-500/30', pill: 'bg-red-500/15 text-red-600 dark:text-red-400', bar: 'from-red-500 to-orange-400' },
};

// Mobildeki kart eşleşmesiyle aynı; listede olmayan tipler röle kartıyla açılır
const TYPE_META = {
  relay: { kind: 'relay', label: 'Akıllı Röle', icon: Zap, accent: 'blue' },
  getaway: { kind: 'relay', label: 'Ağ Geçidi', icon: Router, accent: 'indigo' },
  boiler: { kind: 'climate', label: 'Kombi', icon: Flame, accent: 'orange' },
  boiler_relay: { kind: 'climate', label: 'Kombi Rölesi', icon: Flame, accent: 'orange' },
  thermostat: { kind: 'climate', label: 'Termostat', icon: Thermometer, accent: 'orange' },
  curtain: { kind: 'curtain', label: 'Perde', icon: Blinds, accent: 'purple' },
  curtain_motor: { kind: 'curtain', label: 'Perde Motoru', icon: Blinds, accent: 'purple' },
  water_sensor: { kind: 'water', label: 'Su Sensörü', icon: Droplets, accent: 'cyan' },
  gas_sensor: { kind: 'gas', label: 'Gaz Sensörü', icon: Wind, accent: 'amber' },
  motion_sensor: { kind: 'motion', label: 'Hareket Sensörü', icon: Footprints, accent: 'emerald' },
  sensor: { kind: 'sensor', label: 'Sensör', icon: Thermometer, accent: 'sky' },
  temperature_sensor: { kind: 'sensor', label: 'Sıcaklık Sensörü', icon: Thermometer, accent: 'sky' },
};

const metaOf = (d) => TYPE_META[d?.type] ?? { kind: 'relay', label: d?.type || 'Cihaz', icon: Zap, accent: 'blue' };
const kindOf = (d) => metaOf(d).kind;

const STATUS_FILTERS = [
  { id: 'all', label: 'Tümü' },
  { id: 'on', label: 'Açık' },
  { id: 'off', label: 'Kapalı' },
  { id: 'offline', label: 'Çevrimdışı' },
  { id: 'alarm', label: 'Alarm' },
];

const CLIMATE_MODES = { heat: 'Isıtma', cool: 'Soğutma', auto: 'Otomatik', eco: 'Eko', off: 'Kapalı', manual: 'Manuel' };
const WATER_SOURCES = { both: 'İki prob', sensor1: '1. prob', sensor2: '2. prob', 1: '1. prob', 2: '2. prob' };

const READING_LABELS = {
  temperature: ['Sıcaklık', '°C'], humidity: ['Nem', '%'], currentTemp: ['Sıcaklık', '°C'], targetTemp: ['Hedef', '°C'],
  power: ['Anlık güç', 'W'], energy: ['Tüketim', 'kWh'], voltage: ['Gerilim', 'V'], current: ['Akım', 'A'],
  gasLevel: ['Gaz seviyesi', ''], gasValue: ['Gaz değeri', ''], ppm: ['Gaz', 'ppm'], lux: ['Işık', 'lx'], pressure: ['Basınç', 'hPa'],
};
const HIDDEN_READINGS = new Set(['battery', 'rssi', 'uptime', 'position', 'index', 'signal']);

// ───────────────────────── YARDIMCILAR ─────────────────────────

const idOf = (v) => (v && typeof v === 'object' ? v._id : v);
const sameId = (a, b) => a != null && b != null && String(idOf(a)) === String(idOf(b));
const errText = (e, fallback) => (typeof e === 'string' ? e : e?.message) || fallback;
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const formatNumber = (v) => Number(v).toLocaleString('tr-TR', { maximumFractionDigits: 1 });

const channelsOf = (d) => d?.data?.relayChannels ?? [];
const channelName = (ch) => ch?.label || `Kanal ${ch?.index}`;
const isPushChannel = (ch) => ['push', 'momentary', 'button', 'pulse'].includes(ch?.buttonType ?? ch?.buttonMode ?? ch?.mode ?? ch?.type);
const pendingKey = (device, channel) => `${device._id}:${channel ?? 'main'}`;

// Çok kanallı rölelerde herhangi bir kanal açıksa cihaz açık sayılır
const isDeviceOn = (d) => {
  const channels = channelsOf(d);
  if (channels.length) return channels.some(ch => ch.state === 'on');
  return d?.data?.relayState === 'on';
};

const countOnChannels = (d) => {
  const channels = channelsOf(d);
  if (channels.length) return channels.filter(ch => ch.state === 'on').length;
  return d?.data?.relayState === 'on' ? 1 : 0;
};

const isSwitchable = (d) => ['relay', 'climate'].includes(kindOf(d));

// true / false / null (bilinmiyor). Şemadaki alan adına göre gerekirse düzelt.
const onlineOf = (d) => {
  if (typeof d?.online === 'boolean') return d.online;
  if (typeof d?.isOnline === 'boolean') return d.isOnline;
  if (d?.status === 'offline') return false;
  if (d?.status === 'online') return true;
  return null;
};
const isOffline = (d) => onlineOf(d) === false;

const alarmText = (d) => {
  if (d?.type === 'water_sensor' && d?.data?.water === true) return 'su algıladı';
  if (d?.type === 'gas_sensor' && d?.data?.gas === true) return 'gaz algıladı';
  return null;
};

const firmwareOf = (d) => d?.firmwareVersion ?? d?.version ?? d?.data?.firmwareVersion ?? null;
const lastSeenOf = (d) => d?.lastSeen ?? d?.lastSeenAt ?? d?.data?.lastSeen ?? null;
const batteryOf = (d) => num(d?.data?.battery) ?? num(d?.battery);
const rssiOf = (d) => num(d?.data?.rssi) ?? num(d?.rssi);

const signalInfo = (rssi) => {
  if (rssi >= -60) return { label: 'Güçlü', icon: SignalHigh, className: 'text-green-500' };
  if (rssi >= -75) return { label: 'Orta', icon: SignalMedium, className: 'text-yellow-500' };
  return { label: 'Zayıf', icon: SignalLow, className: 'text-red-500' };
};

const batteryInfo = (level) => {
  if (level > 60) return { icon: BatteryFull, className: 'text-green-500' };
  if (level > 25) return { icon: BatteryMedium, className: 'text-yellow-500' };
  return { icon: BatteryLow, className: 'text-red-500' };
};

const formatAgo = (value) => {

  if (!value) return null;
  const t = new Date(value).getTime();
  if (Number.isNaN(t)) return null;

  const s = Math.max(0, (Date.now() - t) / 1000);
  if (s < 60) return 'az önce';
  if (s < 3600) return `${Math.floor(s / 60)} dk önce`;
  if (s < 86400) return `${Math.floor(s / 3600)} sa önce`;
  if (s < 7 * 86400) return `${Math.floor(s / 86400)} gün önce`;
  return new Date(t).toLocaleDateString('tr-TR');
};

const versionParts = (v) => String(v ?? '').replace(/^v/i, '').split(/[^0-9]+/).filter(Boolean).map(Number);

const compareVersions = (a, b) => {
  const x = versionParts(a);
  const y = versionParts(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const diff = (x[i] ?? 0) - (y[i] ?? 0);
    if (diff) return diff > 0 ? 1 : -1;
  }
  return 0;
};

// data içindeki sayısal ölçümler (pil, sinyal gibi meta alanlar hariç)
const readingsOf = (device, exclude = []) => Object.entries(device?.data ?? {})
  .filter(([k, v]) => num(v) !== null && !HIDDEN_READINGS.has(k) && !exclude.includes(k))
  .slice(0, 4)
  .map(([k, v]) => ({ key: k, label: READING_LABELS[k]?.[0] ?? k, unit: READING_LABELS[k]?.[1] ?? '', value: v }));

const homeOfDevice = (device, homes) => {
  if (device?.homeId) return homes.find(h => sameId(h._id, device.homeId)) ?? null;
  return homes.find(h => (h.rooms ?? []).some(r => sameId(r._id, device?.roomId))) ?? null;
};

const matchesStatus = (d, filter) => {
  if (filter === 'on') return isDeviceOn(d);
  if (filter === 'off') return isSwitchable(d) && !isDeviceOn(d);
  if (filter === 'offline') return isOffline(d);
  if (filter === 'alarm') return !!alarmText(d);
  return true;
};

// ───────────────────────── KÜÇÜK PARÇALAR ─────────────────────────

const StatChip = ({ label, value, sub, className }) => (

  <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 px-4 py-2 rounded-2xl shadow-sm min-w-[96px]">
    <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold">{label}</p>
    <p className={`text-lg font-bold ${className}`}>{value}{sub && <span className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 ml-1.5">{sub}</span>}</p>
  </div>
);

const InfoTile = ({ icon: Icon, iconClass, label, value }) => (

  <div className="bg-gray-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-gray-200 dark:border-slate-800/50 min-w-0">
    <div className="flex items-center gap-2 mb-1">
      <Icon size={14} className={iconClass} />
      <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold">{label}</p>
    </div>
    <p className="text-sm font-bold text-gray-900 dark:text-slate-200 truncate">{value}</p>
  </div>
);

const SettingsButton = ({ onClick, full }) => (

  <button type="button" onClick={onClick} className={`${full ? 'w-full' : 'flex-1'} bg-white dark:bg-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.08] text-gray-900 dark:text-white py-3 rounded-2xl text-xs font-bold border border-gray-200 dark:border-white/5 transition-all flex items-center justify-center gap-2`}>
    <SlidersHorizontal size={14} /> Ayarlar
  </button>
);

const PowerButton = ({ on, busy, accent, onClick, label }) => (

  <button type="button" aria-label={label} title={label} onClick={onClick} disabled={busy} className={`p-3 rounded-2xl transition-all transform hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 ${on ? accent.button : 'bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-500 border border-gray-300 dark:border-slate-700 hover:bg-gray-300 dark:hover:bg-slate-700'}`}>
    {busy ? <LoaderCircle size={20} className="animate-spin" /> : <Power size={20} />}
  </button>
);

const MenuItem = ({ icon: Icon, label, onClick, danger }) => (

  <button type="button" onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${danger ? 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10' : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-900'}`}>
    <Icon size={14} /> {label}
  </button>
);

const ReadingTiles = ({ readings }) => (

  <div className="grid grid-cols-2 gap-3 mb-5">
    {readings.map(r => (
      <div key={r.key} className="bg-gray-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-gray-200 dark:border-slate-800/50">
        <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold mb-1 truncate">{r.label}</p>
        <p className="text-xl font-bold text-gray-900 dark:text-slate-200">{formatNumber(r.value)}<span className="text-xs text-gray-500 dark:text-slate-500 ml-1">{r.unit}</span></p>
      </div>
    ))}
  </div>
);

// Kartın altındaki iki küçük bilgi kutusu
const MetaStrip = ({ device }) => {

  const rssi = rssiOf(device);
  const battery = batteryOf(device);
  const online = onlineOf(device);
  const lastSeen = formatAgo(lastSeenOf(device));

  const first = rssi !== null
    ? (() => { const s = signalInfo(rssi); return { icon: s.icon, iconClass: s.className, label: 'Sinyal', value: s.label }; })()
    : { icon: online === false ? WifiOff : Wifi, iconClass: online === false ? 'text-amber-500' : 'text-green-500', label: 'Bağlantı', value: online === true ? 'Çevrimiçi' : online === false ? (lastSeen ? `Son: ${lastSeen}` : 'Çevrimdışı') : (lastSeen ?? '—') };

  const second = battery !== null
    ? (() => { const b = batteryInfo(battery); return { icon: b.icon, iconClass: b.className, label: 'Pil', value: `%${battery}` }; })()
    : { icon: Cpu, iconClass: 'text-gray-400 dark:text-slate-500', label: 'Yazılım', value: firmwareOf(device) ?? '—' };

  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      <InfoTile {...first} />
      <InfoTile {...second} />
    </div>
  );
};

// ───────────────────────── KART GÖVDELERİ ─────────────────────────

const ChannelButton = ({ channel, accent, busy, onClick }) => {

  const on = channel.state === 'on';

  return (
    <button type="button" onClick={onClick} disabled={busy} className={`p-3 rounded-2xl border text-left transition-all active:scale-95 disabled:opacity-70 ${on ? accent.channelOn : 'bg-gray-50 dark:bg-slate-950/50 border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'}`}>
      <div className="flex items-center justify-between mb-2">
        {busy ? <LoaderCircle size={16} className={`animate-spin ${on ? 'text-white' : 'text-gray-400'}`} /> : <Power size={16} className={on ? 'text-white' : 'text-gray-400 dark:text-slate-500'} />}
        {isPushChannel(channel) && <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md ${on ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-400'}`}>Buton</span>}
      </div>
      <p className={`text-sm font-bold line-clamp-1 ${on ? 'text-white' : 'text-gray-900 dark:text-slate-200'}`}>{channelName(channel)}</p>
      <p className={`text-[10px] font-bold uppercase mt-0.5 ${on ? 'text-white/80' : 'text-gray-500 dark:text-slate-500'}`}>{on ? 'Açık' : 'Kapalı'}</p>
    </button>
  );
};

const PowerLine = ({ device }) => {

  const power = num(device.data?.power);
  const energy = num(device.data?.energy);
  if (power === null && energy === null) return null;

  return (
    <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-slate-500">
      {power !== null && <span className="flex items-center gap-1.5"><Zap size={12} className="text-yellow-500" /> {formatNumber(power)} W</span>}
      {energy !== null && <span>{formatNumber(energy)} kWh</span>}
    </div>
  );
};

const RelayBody = ({ device, accent, pending, onToggle, onAllOff }) => {

  const channels = channelsOf(device);

  if (channels.length > 1) {

    const onCount = channels.filter(c => c.state === 'on').length;

    return (
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500 dark:text-slate-500 uppercase font-bold">{onCount}/{channels.length} kanal açık</span>
          {onCount > 0 && <button type="button" onClick={onAllOff} className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors">Hepsini kapat</button>}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {channels.map(ch => (
            <ChannelButton key={ch.index} channel={ch} accent={accent} busy={!!pending[pendingKey(device, ch.index)]} onClick={() => onToggle(ch.index)} />
          ))}
        </div>
        <PowerLine device={device} />
      </div>
    );
  }

  const on = isDeviceOn(device);
  const uptime = num(device.data?.uptime);

  return (
    <div className="mb-5 p-4 bg-gray-50 dark:bg-slate-950/50 rounded-2xl border border-gray-200 dark:border-slate-800/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 dark:text-slate-500 uppercase font-bold line-clamp-1">{channels[0]?.label || 'Durum'}</span>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${on ? accent.pill : 'bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-500'}`}>{on ? 'AÇIK' : 'KAPALI'}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${on ? 'bg-blue-500 animate-pulse shadow-lg shadow-blue-500/50' : 'bg-gray-400 dark:bg-slate-600'}`} />
        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-500 bg-gradient-to-r ${accent.bar} ${on ? 'w-full' : 'w-0'}`} />
        </div>
        <span className="text-xs text-gray-500 dark:text-slate-500 font-mono">{uptime !== null ? `${Math.floor(uptime / 3600)}h` : '--'}</span>
      </div>
      <PowerLine device={device} />
    </div>
  );
};

const ClimateBody = ({ device, accent }) => {

  const data = device.data ?? {};
  const current = num(data.currentTemp) ?? num(data.temperature);
  const target = num(data.targetTemp) ?? num(data.setpoint);
  const on = isDeviceOn(device);

  return (
    <div className="mb-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-gray-200 dark:border-slate-800/50">
          <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold mb-1">Ortam</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-200">{current !== null ? `${formatNumber(current)}°` : '--'}</p>
        </div>
        <div className="bg-gray-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-gray-200 dark:border-slate-800/50">
          <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold mb-1">Hedef</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-200">{target !== null ? `${formatNumber(target)}°` : '--'}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${on ? accent.pill : 'bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-500'}`}>{on ? 'ÇALIŞIYOR' : 'KAPALI'}</span>
        {data.mode && <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">{CLIMATE_MODES[data.mode] ?? data.mode}</span>}
      </div>
    </div>
  );
};

const CurtainBody = ({ device }) => {

  // 0 = tamamen açık, 100 = tamamen kapalı, null = kalibre edilmemiş
  const position = num(device.data?.position);
  const calibrated = position !== null;

  return (
    <div className="mb-5">
      <div className="p-4 bg-gray-50 dark:bg-slate-950/50 rounded-2xl border border-gray-200 dark:border-slate-800/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500 dark:text-slate-500 uppercase font-bold">Açıklık</span>
          {calibrated
            ? <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-500/20 text-green-500">KALİBRE</span>
            : <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-600 dark:text-yellow-500">KALİBRASYON GEREKLİ</span>}
        </div>
        <div className="relative h-28 bg-gray-200 dark:bg-slate-800/50 rounded-xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-purple-500 to-purple-300 transition-all duration-700" style={{ height: `${calibrated ? position : 0}%` }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-900 dark:text-white drop-shadow-lg">{calibrated ? `%${100 - position}` : '--'}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3">
        {[{ icon: ChevronDown, label: 'Kapat' }, { icon: Minus, label: 'Dur' }, { icon: ChevronUp, label: 'Aç' }].map(({ icon: Icon, label }) => (
          <button key={label} type="button" disabled className="bg-gray-100 dark:bg-slate-800/60 text-gray-400 dark:text-slate-500 p-3 rounded-xl text-xs font-bold border border-gray-200 dark:border-slate-700 flex items-center justify-center gap-1 cursor-not-allowed">
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-gray-500 dark:text-slate-500 mt-2">Perde komutları henüz desteklenmiyor.</p>
    </div>
  );
};

const WaterBody = ({ device, acking, onAck }) => {

  const data = device.data ?? {};

  if (data.water === true) {

    const source = data.waterSource != null ? WATER_SOURCES[data.waterSource] ?? data.waterSource : null;
    const detected = formatAgo(data.lastDetectedAt ?? data.detectedAt);

    return (
      <div className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
        <div className="flex items-center gap-3 mb-3">
          <TriangleAlert size={20} className="text-red-500 animate-pulse shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-red-500">SU KAÇAĞI TESPİT EDİLDİ!</p>
            <p className="text-xs text-red-400/80 truncate">{[source && `Kaynak: ${source}`, detected].filter(Boolean).join(' · ') || 'Lütfen kontrol edin'}</p>
          </div>
        </div>
        <button type="button" onClick={onAck} disabled={acking} className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60">
          {acking ? <LoaderCircle size={14} className="animate-spin" /> : <CircleCheck size={14} />} Alarmı onayla
        </button>
      </div>
    );
  }

  const cleared = formatAgo(data.lastClearedAt);

  return (
    <div className="mb-5 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl flex items-center gap-3">
      <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500"><Droplet size={18} /></div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-gray-900 dark:text-slate-200">Kuru</p>
        <p className="text-xs text-gray-500 dark:text-slate-500 truncate">{cleared ? `Son alarm ${cleared} onaylandı` : 'Su algılanmadı'}</p>
      </div>
    </div>
  );
};

const GasBody = ({ device }) => {

  const alarm = device.data?.gas === true;
  const readings = readingsOf(device);

  return (
    <>
      {alarm ? (
        <div className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3">
          <TriangleAlert size={20} className="text-red-500 animate-pulse shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-500">GAZ ALGILANDI!</p>
            <p className="text-xs text-red-400/80">Ortamı havalandırın, gaz kaynağını kontrol edin.</p>
          </div>
        </div>
      ) : (
        <div className="mb-5 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500"><Wind size={18} /></div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-slate-200">Normal</p>
            <p className="text-xs text-gray-500 dark:text-slate-500">Gaz algılanmadı</p>
          </div>
        </div>
      )}
      {readings.length > 0 && <ReadingTiles readings={readings} />}
    </>
  );
};

const MotionBody = ({ device }) => {

  const motion = device.data?.motion === true;
  const last = formatAgo(device.data?.lastMotionAt ?? device.data?.lastMotion);

  return (
    <div className={`mb-5 p-4 rounded-2xl border flex items-center gap-3 ${motion ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-gray-50 dark:bg-slate-950/50 border-gray-200 dark:border-slate-800/50'}`}>
      <div className={`p-2.5 rounded-xl ${motion ? 'bg-emerald-500/20 text-emerald-500' : 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-500'}`}><Activity size={18} className={motion ? 'animate-pulse' : ''} /></div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-gray-900 dark:text-slate-200">{motion ? 'Hareket algılandı' : 'Hareket yok'}</p>
        <p className="text-xs text-gray-500 dark:text-slate-500 truncate">{last ? `Son hareket ${last}` : 'Henüz kayıt yok'}</p>
      </div>
    </div>
  );
};

const SensorBody = ({ device }) => {

  const temperature = num(device.data?.temperature);
  const humidity = num(device.data?.humidity);

  if (temperature === null && humidity === null) {
    const readings = readingsOf(device);
    return readings.length ? <ReadingTiles readings={readings} /> : <p className="mb-5 text-sm text-gray-500 dark:text-slate-500">Henüz ölçüm gelmedi.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 mb-5">

      <div className="bg-gray-50 dark:bg-slate-950/50 p-4 rounded-3xl border border-gray-200 dark:border-slate-800/50 relative overflow-hidden">
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer size={16} className="text-orange-500" />
            <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold">Sıcaklık</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-slate-200 mb-2">{temperature !== null ? `${formatNumber(temperature)}°C` : '--'}</p>
          <div className="h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500" style={{ width: `${Math.min(Math.max((temperature ?? 0) / 50 * 100, 0), 100)}%` }} />
          </div>
          <p className="text-[10px] text-gray-500 dark:text-slate-600 mt-1">{temperature === null ? '' : temperature < 15 ? 'Soğuk' : temperature < 25 ? 'Normal' : 'Sıcak'}</p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-slate-950/50 p-4 rounded-3xl border border-gray-200 dark:border-slate-800/50 relative overflow-hidden">
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Droplet size={16} className="text-blue-500" />
            <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold">Nem</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-slate-200 mb-2">{humidity !== null ? `%${formatNumber(humidity)}` : '--'}</p>
          <div className="h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 transition-all duration-500" style={{ width: `${Math.min(Math.max(humidity ?? 0, 0), 100)}%` }} />
          </div>
          <p className="text-[10px] text-gray-500 dark:text-slate-600 mt-1">{humidity === null ? '' : humidity < 30 ? 'Kuru' : humidity < 60 ? 'Normal' : 'Nemli'}</p>
        </div>
      </div>

    </div>
  );
};

// ───────────────────────── KART ─────────────────────────

const DeviceCard = ({ device, roomName, pending, acking, onToggle, onAllOff, onAck, onOpen, onDelete }) => {

  const [menuOpen, setMenuOpen] = useState(false);

  const meta = metaOf(device);
  const kind = meta.kind;
  const alarm = alarmText(device);
  const offline = isOffline(device);
  const accent = ACCENTS[alarm ? 'red' : meta.accent];
  const channels = channelsOf(device);
  const singleChannel = channels.length <= 1;
  const mainChannel = channels.length ? channels[0].index : undefined;
  const on = isDeviceOn(device);
  const active = alarm || on || (kind === 'motion' && device.data?.motion === true);
  const Icon = alarm ? TriangleAlert : meta.icon;

  const pick = (tab) => { setMenuOpen(false); onOpen(tab); };

  let body;
  let footer = <div className="flex gap-3"><SettingsButton full onClick={() => onOpen('general')} /></div>;

  if (kind === 'relay') {

    body = <RelayBody device={device} accent={accent} pending={pending} onToggle={onToggle} onAllOff={onAllOff} />;

    if (singleChannel) {
      footer = (
        <div className="flex gap-3">
          <SettingsButton onClick={() => onOpen('general')} />
          <PowerButton on={on} busy={!!pending[pendingKey(device, mainChannel)]} accent={accent} label={on ? 'Kapat' : 'Aç'} onClick={() => onToggle(mainChannel)} />
        </div>
      );
    }
  } else if (kind === 'climate') {

    body = <ClimateBody device={device} accent={accent} />;
    footer = (
      <div className="flex gap-3">
        <SettingsButton onClick={() => onOpen('general')} />
        <PowerButton on={on} busy={!!pending[pendingKey(device, mainChannel)]} accent={accent} label={on ? 'Kapat' : 'Aç'} onClick={() => onToggle(mainChannel)} />
      </div>
    );
  } else if (kind === 'curtain') {
    body = <CurtainBody device={device} />;
  } else if (kind === 'water') {
    body = <WaterBody device={device} acking={acking} onAck={onAck} />;
  } else if (kind === 'gas') {
    body = <GasBody device={device} />;
  } else if (kind === 'motion') {
    body = <MotionBody device={device} />;
  } else {
    body = <SensorBody device={device} />;
  }

  return (

    <div className={`group relative flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-950 border rounded-3xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl ${alarm ? 'border-red-500/50 hover:border-red-500 shadow-red-500/20' : `border-gray-200 dark:border-slate-800 ${accent.hover}`}`}>

      <div className="flex justify-between items-start mb-5">

        <div className={`p-4 rounded-2xl shadow-inner transition-all duration-300 ${active ? accent.active : 'bg-gray-100 dark:bg-slate-800/50 text-gray-400 dark:text-slate-500'}`}>
          <Icon size={28} className={alarm ? 'animate-pulse' : ''} />
        </div>

        <div className="flex items-center gap-1.5">

          {offline && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400"><WifiOff size={11} /> Çevrimdışı</span>
          )}

          <div className="relative">

            <button type="button" aria-label="Cihaz menüsü" onClick={() => setMenuOpen(o => !o)} className="p-2 text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all">
              <EllipsisVertical size={20} />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-2xl z-20 py-2">
                  <MenuItem icon={SlidersHorizontal} label="Ayarlar" onClick={() => pick('general')} />
                  {channels.length > 0 && <MenuItem icon={Pencil} label="Kanalları adlandır" onClick={() => pick('channels')} />}
                  <MenuItem icon={Download} label="Yazılım güncelleme" onClick={() => pick('firmware')} />
                  <MenuItem danger icon={Trash2} label="Cihazı sil" onClick={() => { setMenuOpen(false); onDelete(); }} />
                </div>
              </>
            )}

          </div>

        </div>

      </div>

      <button type="button" onClick={() => onOpen('general')} className="text-left mb-5">
        <h3 className={`text-xl font-bold text-gray-900 dark:text-white transition-colors line-clamp-1 ${accent.title}`}>{device.name}</h3>
        <p className="text-sm text-gray-500 dark:text-slate-500 mt-1 font-medium line-clamp-1">{roomName} • {meta.label}</p>
      </button>

      <div className="flex-1">{body}</div>

      <MetaStrip device={device} />

      {footer}

    </div>
  );
};

const SkeletonCard = () => (

  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 animate-pulse">
    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 mb-5" />
    <div className="h-5 w-2/3 rounded bg-gray-100 dark:bg-slate-800 mb-2" />
    <div className="h-4 w-1/3 rounded bg-gray-100 dark:bg-slate-800 mb-6" />
    <div className="h-20 rounded-2xl bg-gray-100 dark:bg-slate-800 mb-5" />
    <div className="h-11 rounded-2xl bg-gray-100 dark:bg-slate-800" />
  </div>
);

// ───────────────────────── MODAL ─────────────────────────

const Modal = ({ onClose, children, maxWidth = 'max-w-lg', z = 'z-50' }) => {

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className={`fixed inset-0 ${z} flex items-center justify-center p-4`}>
      <div className="absolute inset-0 bg-gray-900/80 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className={`relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 w-full ${maxWidth} max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300`}>
        {children}
      </div>
    </div>
  );
};

const ModalHeader = ({ icon: Icon, iconClass = 'bg-blue-500/10 text-blue-600 dark:text-blue-500', title, subtitle, onClose }) => (

  <div className="flex justify-between items-center gap-4 p-6 sm:p-8 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
    <div className="flex items-center gap-4 min-w-0">
      <div className={`p-3 rounded-2xl shrink-0 ${iconClass}`}><Icon size={24} /></div>
      <div className="min-w-0">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 dark:text-slate-500 truncate">{subtitle}</p>}
      </div>
    </div>
    <button type="button" aria-label="Kapat" onClick={onClose} className="p-2 text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-slate-800 rounded-full transition-all shrink-0">
      <X size={20} />
    </button>
  </div>
);

const FieldLabel = ({ children }) => <label className="block text-xs font-bold text-gray-600 dark:text-slate-500 uppercase ml-1 mb-2">{children}</label>;

const INPUT_CLASS = 'w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-2xl p-4 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all';

const InfoRow = ({ label, value, mono }) => (

  <div className="flex items-center justify-between gap-4 py-2.5 border-b border-gray-100 dark:border-slate-800/70 last:border-0">
    <span className="text-xs font-semibold text-gray-500 dark:text-slate-500">{label}</span>
    <span className={`text-sm text-gray-900 dark:text-slate-200 text-right truncate ${mono ? 'font-mono' : 'font-semibold'}`}>{value}</span>
  </div>
);

// ── Genel sekmesi: ad, ev / oda, cihaz bilgileri, silme ──

const GeneralTab = ({ device, homes, onClose, onDelete }) => {

  const dispatch = useDispatch();
  const currentHome = homeOfDevice(device, homes);

  const [name, setName] = useState(device.name ?? '');
  const [homeId, setHomeId] = useState(String(currentHome?._id ?? homes[0]?._id ?? ''));
  const [roomId, setRoomId] = useState(idOf(device.roomId) ? String(idOf(device.roomId)) : '');
  const [saving, setSaving] = useState(false);

  const rooms = homes.find(h => sameId(h._id, homeId))?.rooms ?? [];
  const trimmed = name.trim();
  const nameChanged = !!trimmed && trimmed !== device.name;
  const roomChanged = !!roomId && !sameId(roomId, device.roomId);
  const online = onlineOf(device);
  const rssi = rssiOf(device);
  const battery = batteryOf(device);

  const save = async () => {

    setSaving(true);

    try {

      if (nameChanged) await dispatch(updateDevice({ id: device._id, name: trimmed })).unwrap();
      if (roomChanged) await dispatch(assignDeviceToRoom({ deviceId: device._id, homeId, roomId })).unwrap();

      toast.success('Değişiklikler kaydedildi');
      onClose();
    } catch (e) {
      toast.error(errText(e, 'Kaydedilemedi.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">

        <div>
          <FieldLabel>Cihaz adı</FieldLabel>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} className={INPUT_CLASS} />
        </div>

        <div className={`grid gap-4 ${homes.length > 1 ? 'sm:grid-cols-2' : ''}`}>

          {homes.length > 1 && (
            <div>
              <FieldLabel>Ev</FieldLabel>
              <select value={homeId} onChange={(e) => { setHomeId(e.target.value); setRoomId(''); }} className={`${INPUT_CLASS} appearance-none`}>
                {homes.map(h => <option key={h._id} value={String(h._id)}>{h.name}</option>)}
              </select>
            </div>
          )}

          <div>
            <FieldLabel>Oda</FieldLabel>
            <select value={roomId} onChange={(e) => setRoomId(e.target.value)} className={`${INPUT_CLASS} appearance-none`} disabled={rooms.length === 0}>
              {rooms.length === 0 && <option value="">Bu evde oda tanımlı değil</option>}
              {rooms.length > 0 && !roomId && <option value="">Oda seçin...</option>}
              {rooms.map(r => <option key={r._id} value={String(r._id)}>{r.name}</option>)}
            </select>
          </div>

        </div>

        {typeof device.image === 'string' && device.image && (
          <img src={device.image} alt={device.name} className="w-full max-h-48 object-cover rounded-2xl border border-gray-200 dark:border-slate-800" />
        )}

        <div className="bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl px-4 py-1">
          <InfoRow label="Tür" value={metaOf(device).label} />
          <InfoRow label="Seri numarası" value={device.serialNumber ?? '—'} mono />
          <InfoRow label="Yazılım sürümü" value={firmwareOf(device) ?? '—'} mono />
          <InfoRow label="Bağlantı" value={online === true ? 'Çevrimiçi' : online === false ? 'Çevrimdışı' : '—'} />
          {lastSeenOf(device) && <InfoRow label="Son görülme" value={formatAgo(lastSeenOf(device))} />}
          {rssi !== null && <InfoRow label="Sinyal" value={`${signalInfo(rssi).label} (${rssi} dBm)`} />}
          {battery !== null && <InfoRow label="Pil" value={`%${battery}`} />}
          {device.createdAt && <InfoRow label="Eklenme" value={new Date(device.createdAt).toLocaleDateString('tr-TR')} />}
        </div>

      </div>

      <div className="p-6 sm:p-8 border-t border-gray-200 dark:border-slate-800 flex flex-wrap gap-3">

        <button type="button" onClick={() => onDelete(device)} className="px-4 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex items-center gap-2">
          <Trash2 size={16} /> Sil
        </button>

        <div className="flex-1" />

        <button type="button" onClick={onClose} className="px-6 py-4 rounded-2xl text-sm font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all">
          İptal
        </button>

        <button type="button" onClick={save} disabled={saving || (!nameChanged && !roomChanged)} className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all shadow-lg shadow-blue-600/30 disabled:opacity-40 disabled:cursor-not-allowed">
          {saving ? <LoaderCircle size={18} className="animate-spin" /> : <Save size={18} />} Kaydet
        </button>

      </div>
    </>
  );
};

// ── Kanallar sekmesi: kanal etiketleri ──

const ChannelsTab = ({ device, onClose }) => {

  const dispatch = useDispatch();
  const channels = channelsOf(device);

  const [labels, setLabels] = useState(() => Object.fromEntries(channels.map(c => [String(c.index), c.label ?? ''])));
  const [saving, setSaving] = useState(false);

  const changed = channels.some(c => (labels[String(c.index)] ?? '').trim() !== (c.label ?? ''));

  const save = async () => {

    setSaving(true);

    try {

      // Diğer kanal alanları (durum, buton tipi) aynen korunur
      const relayChannels = channels.map(c => ({ ...c, label: (labels[String(c.index)] ?? '').trim() || null }));
      await dispatch(updateDevice({ id: device._id, data: { ...device.data, relayChannels } })).unwrap();

      toast.success('Kanal adları kaydedildi');
      onClose();
    } catch (e) {
      toast.error(errText(e, 'Kaydedilemedi.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="p-6 sm:p-8 space-y-3 overflow-y-auto">

        {channels.map(c => (
          <div key={c.index} className="flex items-center gap-3">
            <span className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-sm font-bold ${c.state === 'on' ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'}`}>{c.index}</span>
            <input
              type="text"
              value={labels[String(c.index)] ?? ''}
              onChange={(e) => setLabels(l => ({ ...l, [String(c.index)]: e.target.value }))}
              maxLength={30}
              placeholder={`Kanal ${c.index}`}
              className={`${INPUT_CLASS} p-3`}
            />
            {isPushChannel(c) && <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 shrink-0">Buton</span>}
          </div>
        ))}

        <p className="text-xs text-gray-500 dark:text-slate-500 pt-2">Kanal adları cihaz kartlarında ve otomasyonlarda görünür. Boş bırakılan kanal numarasıyla gösterilir.</p>

      </div>

      <div className="p-6 sm:p-8 border-t border-gray-200 dark:border-slate-800 flex gap-3 justify-end">

        <button type="button" onClick={onClose} className="px-6 py-4 rounded-2xl text-sm font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all">
          İptal
        </button>

        <button type="button" onClick={save} disabled={saving || !changed} className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all shadow-lg shadow-blue-600/30 disabled:opacity-40 disabled:cursor-not-allowed">
          {saving ? <LoaderCircle size={18} className="animate-spin" /> : <Save size={18} />} Kaydet
        </button>

      </div>
    </>
  );
};

// ── Yazılım sekmesi: OTA güncelleme ──

const FirmwareTab = ({ device, onStartOta }) => {

  const dispatch = useDispatch();
  const latest = useSelector((state) => state.devices.latestFirmwareByType?.[device.type]);
  const ota = useSelector((state) => state.devices.otaBySerial?.[device.serialNumber]);

  useEffect(() => {
    if (device.type) dispatch(getLatestFirmware({ type: device.type }));
  }, [dispatch, device.type]);

  const current = firmwareOf(device);
  const offline = isOffline(device);
  const busy = ota?.status === 'downloading';
  const hasUpdate = !!latest?.version && !!latest?.url && (!current || compareVersions(latest.version, current) > 0);

  return (

    <div className="p-6 sm:p-8 space-y-5 overflow-y-auto">

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-gray-200 dark:border-slate-800/50">
          <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold mb-1">Yüklü sürüm</p>
          <p className="text-lg font-bold font-mono text-gray-900 dark:text-slate-200">{current ?? '—'}</p>
        </div>
        <div className="bg-gray-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-gray-200 dark:border-slate-800/50">
          <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold mb-1">En güncel</p>
          <p className="text-lg font-bold font-mono text-gray-900 dark:text-slate-200">{latest?.loading ? '...' : latest?.version ?? '—'}</p>
        </div>
      </div>

      {latest?.loading && <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-2"><LoaderCircle size={14} className="animate-spin" /> Sürüm bilgisi alınıyor...</p>}
      {latest?.error && <p className="text-sm text-red-500">{latest.error}</p>}
      {latest?.notFound && <p className="text-sm text-gray-500 dark:text-slate-400">Bu cihaz türü için yayınlanmış bir yazılım yok.</p>}

      {latest?.releaseNotes && (
        <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/10 p-4 rounded-2xl">
          <p className="text-xs font-bold text-blue-900 dark:text-blue-200 mb-1">Yenilikler{latest.publishedAt ? ` · ${new Date(latest.publishedAt).toLocaleDateString('tr-TR')}` : ''}</p>
          <p className="text-sm text-blue-800 dark:text-blue-300/80 whitespace-pre-line">{latest.releaseNotes}</p>
        </div>
      )}

      {busy && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
          <LoaderCircle size={18} className="text-blue-500 animate-spin shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700 dark:text-blue-300">Cihaz yeni yazılımı indiriyor. Bu birkaç dakika sürebilir; cihaz kendini yeniden başlatacak. Bu pencereyi kapatabilirsin, sonuç burada görünür.</p>
        </div>
      )}

      {ota?.status === 'success' && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
          <CircleCheck size={18} className="text-green-500 shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-400 flex-1">Güncelleme tamamlandı.</p>
          <button type="button" onClick={() => dispatch(clearOtaStatus(device.serialNumber))} className="text-xs font-bold text-green-700 dark:text-green-400">Tamam</button>
        </div>
      )}

      {ota?.status === 'no_update' && <p className="text-sm text-gray-500 dark:text-slate-400">Cihaz zaten güncel.</p>}

      {ota?.status === 'failed' && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
          <TriangleAlert size={18} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400 flex-1">{ota.error || ota.detail || 'Güncelleme başarısız oldu.'}</p>
          <button type="button" onClick={() => dispatch(clearOtaStatus(device.serialNumber))} className="text-xs font-bold text-red-600 dark:text-red-400">Kapat</button>
        </div>
      )}

      {!busy && !latest?.loading && latest?.version && !hasUpdate && ota?.status !== 'success' && (
        <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2"><CircleCheck size={16} /> Cihaz en güncel sürümü kullanıyor.</p>
      )}

      {hasUpdate && !busy && (
        <>
          {offline && <p className="text-sm text-amber-600 dark:text-amber-400">Cihaz çevrimdışı. Güncelleme için cihazın bağlı olması gerekiyor.</p>}
          <button type="button" onClick={() => onStartOta(device, latest)} disabled={offline} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all shadow-lg shadow-blue-600/30 disabled:opacity-40 disabled:cursor-not-allowed">
            <Download size={18} /> {latest.version} sürümüne güncelle
          </button>
          <p className="text-xs text-gray-500 dark:text-slate-500">Güncelleme sırasında cihazın elektriğini kesme.</p>
        </>
      )}

    </div>
  );
};

const DeviceModal = ({ device, homes, roomName, initialTab, onClose, onDelete, onStartOta }) => {

  const channels = channelsOf(device);
  const meta = metaOf(device);
  const tabs = [
    { id: 'general', label: 'Genel' },
    ...(channels.length ? [{ id: 'channels', label: 'Kanallar' }] : []),
    { id: 'firmware', label: 'Yazılım' },
  ];

  const [tab, setTab] = useState(tabs.some(t => t.id === initialTab) ? initialTab : 'general');

  return (

    <Modal onClose={onClose}>

      <ModalHeader icon={meta.icon} title={device.name} subtitle={`${roomName} • ${meta.label}`} onClose={onClose} />

      <div className="flex gap-2 px-6 sm:px-8 pt-5">
        {tabs.map(t => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-600 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'general' && <GeneralTab device={device} homes={homes} onClose={onClose} onDelete={onDelete} />}
      {tab === 'channels' && <ChannelsTab device={device} onClose={onClose} />}
      {tab === 'firmware' && <FirmwareTab device={device} onStartOta={onStartOta} />}

    </Modal>
  );
};

const ConfirmDeleteModal = ({ device, busy, onCancel, onConfirm }) => (

  <Modal onClose={onCancel} maxWidth="max-w-md" z="z-[60]">

    <div className="p-8 text-center">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-5"><Trash2 size={28} /></div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{device.name} silinsin mi?</h3>
      <p className="text-sm text-gray-500 dark:text-slate-400">Cihaz hesabından kaldırılır. Bu cihazı kullanan otomasyonlar çalışamaz hale gelir. Yeniden kullanmak için cihazı tekrar eşleştirmen gerekir.</p>
    </div>

    <div className="p-6 border-t border-gray-200 dark:border-slate-800 flex gap-3">
      <button type="button" onClick={onCancel} className="flex-1 py-4 rounded-2xl text-sm font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all">Vazgeç</button>
      <button type="button" onClick={onConfirm} disabled={busy} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold bg-red-600 hover:bg-red-500 text-white transition-all disabled:opacity-60">
        {busy ? <LoaderCircle size={18} className="animate-spin" /> : <Trash2 size={18} />} Sil
      </button>
    </div>

  </Modal>
);

const ADD_STEPS = [
  'Cihazı prize tak. Üzerindeki ışık yanıp sönmüyorsa eşleme butonuna 5 saniye basılı tut.',
  'Telefonunda TypusHOME uygulamasını aç, Ana sayfadaki + butonuna dokun.',
  'Bluetooth ya da Wi-Fi yöntemini seç, evinin Wi-Fi bilgilerini gir ve cihaza oda seç.',
  'Eklenen cihaz birkaç saniye içinde bu sayfada da görünür.',
];

const AddDeviceModal = ({ onClose }) => (

  <Modal onClose={onClose} z="z-[100]">

    <ModalHeader icon={Plus} iconClass="bg-gradient-to-br from-blue-600 to-purple-600 text-white" title="Yeni Cihaz Ekle" subtitle="Cihazlar mobil uygulamadan eklenir" onClose={onClose} />

    <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">

      <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/10">
        <Smartphone size={22} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-900 dark:text-blue-200">Eşleştirme sırasında telefon cihaza Bluetooth ya da cihazın kendi Wi-Fi ağı üzerinden bağlanıp ev ağının bilgilerini aktarır. Tarayıcılar buna izin vermediği için cihaz eklemeyi web sitesinden yapamıyoruz.</p>
      </div>

      <ol className="space-y-4">
        {ADD_STEPS.map((text, i) => (
          <li key={i} className="flex items-start gap-4">
            <span className="w-8 h-8 shrink-0 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
            <p className="text-sm text-gray-700 dark:text-slate-300 pt-1.5">{text}</p>
          </li>
        ))}
      </ol>

      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-500">
        <Bluetooth size={14} /> ESP32 cihazlar Bluetooth ile, ESP8266 cihazlar Wi-Fi ile eşleşir.
      </div>

    </div>

    <div className="p-6 sm:p-8 border-t border-gray-200 dark:border-slate-800">
      <button type="button" onClick={onClose} className="w-full py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all shadow-lg shadow-blue-600/30">Anladım</button>
    </div>

  </Modal>
);

// ───────────────────────── SAYFA ─────────────────────────

const Devices = () => {

  const dispatch = useDispatch();

  const { devices = [], loading, error, otaBySerial = {} } = useSelector((state) => state.devices);
  const { user } = useSelector((state) => state.user);
  const homes = useMemo(() => user?.user?.homes ?? [], [user]);

  const [selectedHomeId, setSelectedHomeId] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [detail, setDetail] = useState(null);           // { id, tab }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [pending, setPending] = useState({});
  const [ackingId, setAckingId] = useState(null);
  const [otaWatch, setOtaWatch] = useState({});         // serialNumber -> { version, startedAt }

  // ── Veri ──

  useEffect(() => {
    dispatch(getMyDevices());
  }, [dispatch]);

  // Arka planda yenileme: mobilde socket ile gelen durumlar burada düzenli çekilir
  const watchingOta = Object.keys(otaWatch).length > 0;

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') dispatch(getMyDevices({ silent: true }));
    }, watchingOta ? OTA_POLL_MS : POLL_MS);
    return () => clearInterval(timer);
  }, [dispatch, watchingOta]);

  // Güncelleme sonucu: cihaz yeni sürümle bağlanınca başarılı, süre dolarsa başarısız sayılır
  useEffect(() => {

    const serials = Object.keys(otaWatch);
    if (!serials.length) return;

    const finished = [];

    serials.forEach((serial) => {

      const watch = otaWatch[serial];
      const status = otaBySerial[serial]?.status;

      if (status && status !== 'downloading') {
        finished.push(serial);
        return;
      }

      const device = devices.find(d => d.serialNumber === serial);
      const version = firmwareOf(device);

      if (version && compareVersions(version, watch.version) >= 0) {
        dispatch(updateOtaStatus({ serialNumber: serial, status: 'success', firmwareVersion: version }));
        toast.success(`${device.name} güncellendi`);
        finished.push(serial);
      } else if (Date.now() - watch.startedAt > OTA_TIMEOUT_MS) {
        dispatch(updateOtaStatus({ serialNumber: serial, status: 'failed', detail: 'Cihazdan yeni sürüm bilgisi gelmedi. Cihazın açık ve bağlı olduğunu kontrol edip tekrar dene.' }));
        finished.push(serial);
      }
    });

    if (finished.length) {
      setOtaWatch(w => {
        const next = { ...w };
        finished.forEach(s => delete next[s]);
        return next;
      });
    }
  }, [devices, otaWatch, otaBySerial, dispatch]);

  // ── Ev ve odalar ──

  const hasMultipleHomes = homes.length > 1;
  const activeHome = homes.find(h => sameId(h._id, selectedHomeId)) ?? homes[0] ?? null;
  const homeRooms = activeHome?.rooms ?? [];

  const allRooms = useMemo(() => homes.flatMap(h => (h.rooms ?? []).map(r => ({ ...r, homeName: h.name }))), [homes]);
  const roomNameOf = useCallback((d) => allRooms.find(r => sameId(r._id, d.roomId))?.name ?? 'Oda atanmadı', [allRooms]);

  const belongsToHome = (d, home) => {
    if (!hasMultipleHomes || !home) return true; // tek ev varsa tüm cihazlar o evin
    if (d.homeId) return sameId(d.homeId, home._id);
    return (home.rooms ?? []).some(r => sameId(r._id, d.roomId));
  };

  const selectHome = (homeId) => {
    setSelectedHomeId(homeId);
    setSelectedRoom('all');
  };

  // ── Hesaplanan listeler ──

  const query = searchQuery.trim().toLocaleLowerCase('tr-TR');
  const matchesSearch = (d) => !query || d.name?.toLocaleLowerCase('tr-TR').includes(query) || roomNameOf(d).toLocaleLowerCase('tr-TR').includes(query);

  const homeDevices = devices.filter(d => belongsToHome(d, activeHome));
  const scopedDevices = homeDevices.filter(d => (selectedRoom === 'all' || sameId(d.roomId, selectedRoom)) && matchesSearch(d));
  const filteredDevices = scopedDevices.filter(d => matchesStatus(d, statusFilter));

  const onDeviceCount = homeDevices.filter(isDeviceOn).length;
  const onChannelCount = homeDevices.reduce((sum, d) => sum + countOnChannels(d), 0);
  const offlineDevices = homeDevices.filter(isOffline);

  // Alarm bilerek tüm evlerden: başka evdeki su kaçağı da görünmeli
  const alarmDevices = devices.filter(d => alarmText(d));

  const detailDevice = detail ? devices.find(d => d._id === detail.id) : null;

  // ── Komutlar ──

  const sendCommand = async (device, action, channel) => {

    const key = pendingKey(device, channel);
    setPending(p => ({ ...p, [key]: true }));

    try {
      await dispatch(toggleRelay({ serialNumber: device.serialNumber, action, channel })).unwrap();
    } catch (e) {
      toast.error(errText(e, 'Komut gönderilemedi.'), { id: `cmd-${device._id}` });
    } finally {
      setPending(p => {
        const next = { ...p };
        delete next[key];
        return next;
      });
    }
  };

  const toggleChannel = (device, channelIndex) => {

    const channels = channelsOf(device);
    const current = channels.length
      ? (channels.find(ch => Number(ch.index) === Number(channelIndex))?.state ?? 'off')
      : (device.data?.relayState ?? 'off');

    return sendCommand(device, current === 'on' ? 'off' : 'on', channels.length ? channelIndex : undefined);
  };

  const allOff = async (device) => {
    for (const ch of channelsOf(device).filter(c => c.state === 'on')) {
      await sendCommand(device, 'off', ch.index);
    }
  };

  const ackWater = async (device) => {

    setAckingId(device._id);

    try {
      await dispatch(acknowledgeWaterAlarm(device._id)).unwrap();
      toast.success('Alarm onaylandı');
    } catch (e) {
      toast.error(errText(e, 'Alarm onaylanamadı.'));
    } finally {
      setAckingId(null);
    }
  };

  const startOta = async (device, latest) => {

    try {
      await dispatch(sendOtaUpdate({ serialNumber: device.serialNumber, firmwareUrl: latest.url })).unwrap();
      setOtaWatch(w => ({ ...w, [device.serialNumber]: { version: latest.version, startedAt: Date.now() } }));
      toast.success('Güncelleme komutu gönderildi');
    } catch (e) {
      toast.error(errText(e, 'Güncelleme başlatılamadı.'));
    }
  };

  const confirmDelete = async () => {

    setDeleting(true);

    try {
      await dispatch(deleteDevice(deleteTarget._id)).unwrap();
      toast.success(`${deleteTarget.name} silindi`);
      if (detail?.id === deleteTarget._id) setDetail(null);
      setDeleteTarget(null);
    } catch (e) {
      toast.error(errText(e, 'Cihaz silinemedi.'));
    } finally {
      setDeleting(false);
    }
  };

  const openDetail = (id, tab = 'general') => setDetail({ id, tab });
  const closeDetail = useCallback(() => setDetail(null), []);
  const closeAdd = useCallback(() => setShowAdd(false), []);
  const cancelDelete = useCallback(() => setDeleteTarget(null), []);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRoom('all');
    setStatusFilter('all');
  };

  // ── Gövde ──

  const renderBody = () => {

    if (loading && devices.length === 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
        </div>
      );
    }

    if (error && devices.length === 0) {
      return (
        <div className="flex flex-col items-center text-center py-16">
          <div className="p-5 rounded-3xl bg-red-500/10 text-red-500 mb-4"><TriangleAlert size={32} /></div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">Cihazlar yüklenemedi</p>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">{String(error)}</p>
          <button type="button" onClick={() => dispatch(getMyDevices())} className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center gap-2"><RefreshCw size={16} /> Tekrar dene</button>
        </div>
      );
    }

    if (devices.length === 0) {
      return (
        <div className="flex flex-col items-center text-center py-16">
          <div className="p-5 rounded-3xl bg-blue-500/10 text-blue-500 mb-4"><House size={32} /></div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">Henüz cihaz yok</p>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">Akıllı evini kurmak için ilk cihazını mobil uygulamadan ekle.</p>
          <button type="button" onClick={() => setShowAdd(true)} className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30"><Plus size={16} /> Nasıl eklenir?</button>
        </div>
      );
    }

    if (filteredDevices.length === 0) {
      return (
        <div className="flex flex-col items-center text-center py-16">
          <div className="p-5 rounded-3xl bg-gray-100 dark:bg-slate-800 text-gray-400 mb-4"><Search size={28} /></div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">Sonuç bulunamadı</p>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">{query ? 'Aramanla eşleşen cihaz yok.' : 'Bu filtrede cihaz yok.'}</p>
          <button type="button" onClick={clearFilters} className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 text-sm font-bold">Filtreleri temizle</button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredDevices.map(device => (
          <DeviceCard
            key={device._id}
            device={device}
            roomName={roomNameOf(device)}
            pending={pending}
            acking={ackingId === device._id}
            onToggle={(channel) => toggleChannel(device, channel)}
            onAllOff={() => allOff(device)}
            onAck={() => ackWater(device)}
            onOpen={(tab) => openDetail(device._id, tab)}
            onDelete={() => setDeleteTarget(device)}
          />
        ))}
      </div>
    );
  };

  return (

    <div className="flex bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">

      <Sidebar />

      <main className="flex-1 lg:ml-0 overflow-x-hidden">

        <div className="p-6 space-y-6 animate-in fade-in duration-700 max-w-7xl mx-auto relative">

          {/* Başlık ve özet */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">

            <div className="space-y-2">

              <div className="inline-flex items-center gap-2 bg-blue-500/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-500/20 mb-2">
                <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Cihaz Yönetimi</span>
              </div>

              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Cihazlarınız</h2>
              <p className="text-gray-600 dark:text-slate-400">
                {hasMultipleHomes ? `${activeHome?.name ?? 'Seçili ev'} evinde ` : 'Sistem genelinde '}
                <span className="text-blue-600 dark:text-blue-400 font-semibold">{homeDevices.length}</span> cihaz tanımlı.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">
              <StatChip label="Açık" value={onDeviceCount} sub={onChannelCount > onDeviceCount ? `${onChannelCount} kanal` : null} className="text-green-600 dark:text-green-500" />
              <StatChip label="Çevrimdışı" value={offlineDevices.length} className={offlineDevices.length ? 'text-yellow-600 dark:text-yellow-500' : 'text-gray-400 dark:text-slate-500'} />
              <StatChip label="Alarm" value={alarmDevices.length} className={alarmDevices.length ? 'text-red-600 dark:text-red-500' : 'text-gray-400 dark:text-slate-500'} />
              <StatChip label="Toplam" value={homeDevices.length} className="text-gray-900 dark:text-white" />
            </div>

          </div>

          {/* Alarm bandı */}
          {alarmDevices.map(d => (
            <div key={d._id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2.5 bg-white/20 rounded-xl shrink-0"><TriangleAlert size={20} className="animate-pulse" /></div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/80">Alarm · {roomNameOf(d)}</p>
                  <p className="font-bold truncate">{d.name} {alarmText(d)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {d.type === 'water_sensor' && (
                  <button type="button" onClick={() => ackWater(d)} disabled={ackingId === d._id} className="px-4 py-2 rounded-xl bg-white text-red-600 text-xs font-bold flex items-center gap-1.5 hover:bg-red-50 transition-all disabled:opacity-70">
                    {ackingId === d._id ? <LoaderCircle size={14} className="animate-spin" /> : <CircleCheck size={14} />} Alarmı onayla
                  </button>
                )}
                <button type="button" onClick={() => openDetail(d._id)} className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold transition-all">Detay</button>
              </div>
            </div>
          ))}

          {/* Çevrimdışı bilgisi */}
          {offlineDevices.length > 0 && (
            <button type="button" onClick={() => setStatusFilter('offline')} className="w-full flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl px-4 py-3 text-left hover:border-amber-300 dark:hover:border-amber-500/50 transition-all">
              <WifiOff size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex-1 truncate">
                {offlineDevices.length === 1 ? `${offlineDevices[0].name} çevrimdışı` : `${offlineDevices.length} cihaz çevrimdışı`}
              </span>
              <span className="text-xs font-bold text-amber-700/70 dark:text-amber-400/70">Göster</span>
            </button>
          )}

          {/* Ev, oda, durum ve arama */}
          <div className="bg-white dark:bg-slate-900/30 p-4 rounded-3xl border border-gray-200 dark:border-slate-800/50 shadow-sm space-y-4">

            {(hasMultipleHomes || homeRooms.length > 0) && (
              <div className="flex gap-2 overflow-x-auto pb-1">

                {hasMultipleHomes && homes.map(home => {
                  const active = sameId(home._id, activeHome?._id);
                  const count = devices.filter(d => belongsToHome(d, home)).length;
                  return (
                    <button key={home._id} type="button" onClick={() => selectHome(String(home._id))} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${active ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-800/60 hover:bg-gray-200 dark:hover:bg-slate-800'}`}>
                      <House size={14} /> {home.name} <span className="text-xs opacity-60">{count}</span>
                    </button>
                  );
                })}

                {hasMultipleHomes && homeRooms.length > 0 && <div className="w-px bg-gray-200 dark:bg-slate-800 mx-1 shrink-0" />}

                {[{ _id: 'all', name: 'Tüm odalar' }, ...homeRooms].map(room => {
                  const roomId = String(room._id);
                  const active = selectedRoom === roomId;
                  const roomDevices = roomId === 'all' ? homeDevices : homeDevices.filter(d => sameId(d.roomId, roomId));
                  const roomOn = roomDevices.filter(isDeviceOn).length;
                  return (
                    <button key={roomId} type="button" onClick={() => setSelectedRoom(roomId)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${active ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/30' : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}>
                      {room.name} <span className={`text-xs ml-1 ${active ? 'text-white/80' : 'text-gray-400 dark:text-slate-500'}`}>{roomOn}/{roomDevices.length}</span>
                    </button>
                  );
                })}

              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

              <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                {STATUS_FILTERS.map(f => {
                  const count = f.id === 'all' ? scopedDevices.length : scopedDevices.filter(d => matchesStatus(d, f.id)).length;
                  if (f.id === 'alarm' && count === 0 && statusFilter !== 'alarm') return null;
                  return (
                    <button key={f.id} type="button" onClick={() => setStatusFilter(f.id)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${statusFilter === f.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-600 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800'}`}>
                      {f.label} <span className={`text-xs ml-0.5 ${statusFilter === f.id ? 'text-white/70' : 'text-gray-400 dark:text-slate-600'}`}>{count}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 w-full md:w-auto">

                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
                  <input type="text" placeholder="Cihaz ya da oda ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-2xl py-2.5 pl-10 pr-9 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                  {searchQuery && (
                    <button type="button" aria-label="Aramayı temizle" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"><X size={16} /></button>
                  )}
                </div>

                <button type="button" aria-label="Yenile" title="Yenile" onClick={() => dispatch(getMyDevices())} className="p-2.5 rounded-2xl border border-gray-300 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all">
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>

                <button type="button" aria-label="Cihaz ekle" title="Cihaz ekle" onClick={() => setShowAdd(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-2.5 rounded-2xl shadow-lg shadow-blue-600/30 active:scale-95 transition-all">
                  <Plus size={22} />
                </button>

              </div>

            </div>

          </div>

          {renderBody()}

          {detailDevice && (
            <DeviceModal
              key={`${detail.id}-${detail.tab}`}
              device={detailDevice}
              homes={homes}
              roomName={roomNameOf(detailDevice)}
              initialTab={detail.tab}
              onClose={closeDetail}
              onDelete={setDeleteTarget}
              onStartOta={startOta}
            />
          )}

          {deleteTarget && <ConfirmDeleteModal device={deleteTarget} busy={deleting} onCancel={cancelDelete} onConfirm={confirmDelete} />}

          {showAdd && <AddDeviceModal onClose={closeAdd} />}

        </div>

      </main>

    </div>
  );
};

export default Devices;
