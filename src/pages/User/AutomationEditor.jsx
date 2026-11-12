import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { simulateAutomation, testAutomation, getAnomalyBaseline } from '../../redux/automationSlice';

import { Chip, FieldLabel, Hint, TextInput, ValueInput, ToggleRow, DurationPicker, TimeInput, DaysSelector, Bars, Spinner, parseNumber } from './AutomationUI';
import { findDevice, relayChannels, deviceFields, presetsFor, matchPreset, fieldName, formatValue, formatDuration, describeTrigger, traceLine, getId, hasValue, lastSegment, sceneIcon, isRelay, ANOMALY_MODES, TARIFF_LABELS, HOME_MODE_LABELS, RELAY_COMMANDS, RELAY_PROPERTY, SHORT_DAYS } from './automationShared';

import { Plus, Trash2, Activity, FlaskConical, Play, Power } from 'lucide-react';

// ───────────────────────── SEÇENEKLER ─────────────────────────

const OPERATORS = [
  { id: 'GT', label: '>' },
  { id: 'GTE', label: '≥' },
  { id: 'LT', label: '<' },
  { id: 'LTE', label: '≤' },
  { id: 'EQ', label: '=' },
  { id: 'NEQ', label: '≠' },
  { id: 'BETWEEN', label: 'Arasında' },
  { id: 'CHANGE', label: 'Değişince' },
];

const NUMERIC_OPS = new Set(['GT', 'GTE', 'LT', 'LTE']);
const SUN_OFFSETS = [-60, -30, -15, 0, 15, 30, 60];
const NUMERIC_SUGGESTIONS = ['data.temperature', 'data.humidity', 'data.gas', 'data.power'];
const SENSITIVITIES = [{ id: 'LOW', label: 'Düşük' }, { id: 'MEDIUM', label: 'Orta' }, { id: 'HIGH', label: 'Yüksek' }];
const DIRECTIONS = [{ id: 'HIGH', label: 'Yükselince' }, { id: 'LOW', label: 'Düşünce' }, { id: 'BOTH', label: 'İkisi de' }];
const APPROVAL_SNOOZES = [0, 15, 60, 180];

export const NOTIFY_LIMITS = { title: 120, body: 500 };

// 'critical' bilerek yok: sessiz saatleri ve kullanıcı tercihlerini deler
const NOTIFY_SEVERITIES = [
  { id: 'info', label: 'Bilgi', color: '#3b82f6' },
  { id: 'warning', label: 'Uyarı', color: '#f59e0b' },
];

const SELECT_CLASS = 'w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50';

// ───────────────────────── SAAT, GÜNEŞ, TARİFE ─────────────────────────

export const TimeTriggerEditor = ({ value, onChange }) => (

  <div>
    <FieldLabel first>Saat</FieldLabel>
    <TimeInput value={value.time} onChange={(time) => onChange({ ...value, time })} />
    <FieldLabel>Tekrar</FieldLabel>
    <DaysSelector value={value.days ?? []} onChange={(days) => onChange({ ...value, days })} />
  </div>
);

export const SunTriggerEditor = ({ value, onChange }) => (

  <div>

    <FieldLabel first>Olay</FieldLabel>
    <div className="flex gap-2">
      <Chip grow label="Gün doğumu" color="#f97316" active={value.sunEvent === 'SUNRISE'} onClick={() => onChange({ ...value, sunEvent: 'SUNRISE' })} />
      <Chip grow label="Gün batımı" color="#f97316" active={value.sunEvent === 'SUNSET'} onClick={() => onChange({ ...value, sunEvent: 'SUNSET' })} />
    </div>

    <FieldLabel>Zaman farkı</FieldLabel>
    <div className="flex flex-wrap gap-2">
      {SUN_OFFSETS.map(m => (
        <Chip key={m} color="#f97316" label={m === 0 ? 'Tam zamanında' : `${Math.abs(m)} dk ${m < 0 ? 'önce' : 'sonra'}`} active={(value.offsetMinutes ?? 0) === m} onClick={() => onChange({ ...value, offsetMinutes: m })} />
      ))}
    </div>

    <FieldLabel>Günler</FieldLabel>
    <DaysSelector color="#f97316" value={value.days ?? []} onChange={(days) => onChange({ ...value, days })} />

    <Hint>Gün doğumu ve batımı evin kayıtlı konumuna göre hesaplanır. Konum mobil uygulamada Otomasyonlar › Evde kim var bölümünden kaydedilir.</Hint>

  </div>
);

export const TimeRangeEditor = ({ value, onChange }) => (

  <div>

    <div className="flex flex-wrap gap-6">
      <div>
        <FieldLabel first>Başlangıç</FieldLabel>
        <TimeInput value={value.after} onChange={(after) => onChange({ ...value, after })} />
      </div>
      <div>
        <FieldLabel first>Bitiş</FieldLabel>
        <TimeInput value={value.before} onChange={(before) => onChange({ ...value, before })} />
      </div>
    </div>

    <FieldLabel>Günler</FieldLabel>
    <DaysSelector color="#0ea5e9" value={value.days ?? []} onChange={(days) => onChange({ ...value, days })} />

    <Hint>Bitiş başlangıçtan önceyse aralık gece yarısını geçer (ör. 22:00–06:00).</Hint>

  </div>
);

export const SunConditionEditor = ({ value, onChange }) => (

  <div className="flex gap-2">
    <Chip grow label="Hava aydınlıkken" color="#0ea5e9" active={value.sunState === 'DAY'} onClick={() => onChange({ ...value, sunState: 'DAY' })} />
    <Chip grow label="Hava karanlıkken" color="#0ea5e9" active={value.sunState === 'NIGHT'} onClick={() => onChange({ ...value, sunState: 'NIGHT' })} />
  </div>
);

const DEFAULT_TARIFF_STARTS = { DAY: '06:00', PEAK: '17:00', NIGHT: '22:00' };

const tariffRange = (period, starts) => {
  const order = ['DAY', 'PEAK', 'NIGHT'].sort((a, b) => (starts[a] < starts[b] ? -1 : 1));
  const i = order.indexOf(period);
  return `${starts[period]}–${starts[order[(i + 1) % 3]]}`;
};

const useTariffStarts = () => {
  const saved = useSelector((state) => state.energy?.settings?.periodStarts);
  return { ...DEFAULT_TARIFF_STARTS, ...(saved ?? {}) };
};

export const TariffTriggerEditor = ({ value, onChange }) => {

  const starts = useTariffStarts();

  return (

    <div>

      <FieldLabel first>Hangi dönem başlayınca?</FieldLabel>
      <div className="flex gap-2">
        {Object.entries(TARIFF_LABELS).map(([id, label]) => (
          <Chip key={id} grow label={label} color="#14b8a6" active={value.tariffPeriod === id} onClick={() => onChange({ ...value, tariffPeriod: id })} />
        ))}
      </div>

      {value.tariffPeriod && (
        <Hint>{TARIFF_LABELS[value.tariffPeriod]} dönemi: {tariffRange(value.tariffPeriod, starts)}. Otomasyon {starts[value.tariffPeriod]} olunca çalışır.</Hint>
      )}

      <FieldLabel>Günler</FieldLabel>
      <DaysSelector color="#14b8a6" value={value.days ?? []} onChange={(days) => onChange({ ...value, days })} />

      <Hint>Dönem saatleri Enerji ve tarife ekranından değiştirilebilir.</Hint>

    </div>
  );
};

export const TariffConditionEditor = ({ value, onChange }) => {

  const starts = useTariffStarts();
  const selected = value.tariffPeriods ?? [];

  const toggle = (id) => {
    const next = selected.includes(id) ? selected.filter(p => p !== id) : [...selected, id];
    if (next.length) onChange({ ...value, tariffPeriods: next }); // en az biri seçili kalsın
  };

  return (

    <div>

      <div className="flex gap-2">
        {Object.entries(TARIFF_LABELS).map(([id, label]) => (
          <Chip key={id} grow label={label} color="#0ea5e9" active={selected.includes(id)} onClick={() => toggle(id)} />
        ))}
      </div>

      <Hint>{selected.map(p => `${TARIFF_LABELS[p]} ${tariffRange(p, starts)}`).join(' · ')}</Hint>

    </div>
  );
};

// ───────────────────────── CİHAZ KONTROLÜ ─────────────────────────

const DeviceSelect = ({ devices, value, onChange, filter }) => (

  <select value={getId(value) ?? ''} onChange={(e) => onChange(e.target.value || undefined)} className={SELECT_CLASS}>
    <option value="">Cihaz seçin...</option>
    {(filter ? devices.filter(filter) : devices).map(d => (
      <option key={d._id} value={d._id}>{d.name}{d.type ? ` · ${d.type}` : ''}</option>
    ))}
  </select>
);

// Cihaz tetikleyicisi, cihaz koşulu ve desen adımları için ortak editör
export const DeviceCheckEditor = ({ value, onChange, devices, forCondition, simple }) => {

  const device = findDevice(devices, value.deviceId);
  const presets = presetsFor(device, forCondition);
  const channels = relayChannels(device);
  const fields = deviceFields(device);
  const color = forCondition ? '#0ea5e9' : '#f59e0b';

  const [custom, setCustom] = useState(() => !!value.property && !matchPreset(presets, value));
  const set = (patch) => onChange({ ...value, ...patch });

  if (devices.length === 0) return <Hint>Kullanılabilecek bir cihaz bulunamadı.</Hint>;

  const selectDevice = (id) => {

    // Hazır seçeneği olmayan sensörlerde doğrudan özel koşul açılır
    setCustom(!!id && presetsFor(findDevice(devices, id), forCondition).length === 0);
    onChange({ ...value, deviceId: id, property: undefined, operator: undefined, value: undefined, valueTo: undefined, channel: undefined, hysteresis: undefined });
  };

  const operators = forCondition ? OPERATORS.filter(o => o.id !== 'CHANGE') : OPERATORS;

  return (

    <div>

      <FieldLabel first>Cihaz</FieldLabel>
      <DeviceSelect devices={devices} value={value.deviceId} onChange={selectDevice} />

      {channels.length > 0 && (
        <>
          <FieldLabel>Kanal</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {channels.map(ch => (
              <Chip key={ch.index} label={ch.label || `Kanal ${ch.index}`} color={color} active={value.channel != null && Number(value.channel) === Number(ch.index)} onClick={() => set({ channel: ch.index })} />
            ))}
          </div>
        </>
      )}

      {device && (
        <>
          <FieldLabel>Durum</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {presets.map(p => (
              <Chip
                key={`${p.property}-${p.operator}-${String(p.value)}`}
                label={p.label}
                color={color}
                active={!custom && !!matchPreset([p], value)}
                onClick={() => { setCustom(false); set({ property: p.property, operator: p.operator, value: p.value, valueTo: undefined }); }}
              />
            ))}
            <Chip label="Özel koşul" color={color} active={custom} onClick={() => setCustom(true)} />
          </div>
        </>
      )}

      {device && custom && (
        <>

          <FieldLabel>Alan</FieldLabel>

          {fields.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {fields.map(f => (
                <Chip
                  key={f.path}
                  label={`${fieldName(f.path)} · şu an ${formatValue(f.path, f.path === 'online' ? device.online : device.data?.[lastSegment(f.path)])}`}
                  color={color}
                  active={value.property === f.path}
                  onClick={() => set({ property: f.path, value: undefined, valueTo: undefined })}
                />
              ))}
            </div>
          )}

          <TextInput value={value.property ?? ''} onChange={(e) => set({ property: e.target.value.trim() || undefined })} placeholder="Ya da alan yolu: data.temperature" />

          <FieldLabel>Karşılaştırma</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {operators.map(o => (
              <Chip key={o.id} label={o.label} color={color} active={value.operator === o.id} onClick={() => set({ operator: o.id })} />
            ))}
          </div>

          {value.operator && value.operator !== 'CHANGE' && (
            <>
              <FieldLabel>{value.operator === 'BETWEEN' ? 'Alt ve üst değer' : 'Değer'}</FieldLabel>
              <div className="flex gap-2 max-w-md" key={`${value.deviceId}-${value.property}`}>
                <ValueInput value={value.value} onChange={(v) => set({ value: v })} placeholder="Örn: 28" />
                {value.operator === 'BETWEEN' && <ValueInput value={value.valueTo} onChange={(v) => set({ valueTo: v })} placeholder="Örn: 30" />}
              </div>
              <Hint>Sayı, true / false ya da on / off yazabilirsin.</Hint>
            </>
          )}

        </>
      )}

      {!simple && device && value.operator && value.operator !== 'CHANGE' && (
        <>
          <FieldLabel>Bu durum en az ne kadar sürsün?</FieldLabel>
          <DurationPicker color={color} value={value.forSeconds ?? 0} onChange={(s) => set({ forSeconds: s || undefined })} presets={[0, 30, 60, 300, 600]} zeroLabel="Hemen" />
        </>
      )}

      {!simple && !forCondition && NUMERIC_OPS.has(value.operator) && (
        <>
          <FieldLabel>Histerezis (opsiyonel)</FieldLabel>
          <div className="max-w-[200px]">
            <ValueInput value={value.hysteresis} parse={parseNumber} onChange={(h) => set({ hysteresis: h })} placeholder="Örn: 0.5" inputMode="decimal" />
          </div>
          <Hint>Değer eşiğin bu kadar gerisine dönmeden otomasyon yeniden tetiklenmez. Eşik çevresinde titreyen sensörlerde tekrarı önler.</Hint>
        </>
      )}

    </div>
  );
};

// ───────────────────────── SAYI, SIRA, OLAĞAN DIŞI ─────────────────────────

export const CountTriggerEditor = ({ value, onChange, devices }) => (

  <div>

    <DeviceCheckEditor value={value.event ?? {}} onChange={(event) => onChange({ ...value, event })} devices={devices} simple />

    <FieldLabel>Kaç kez?</FieldLabel>
    <div className="flex gap-2">
      {[2, 3, 5, 10].map(n => (
        <Chip key={n} grow label={`${n} kez`} color="#f59e0b" active={value.count === n} onClick={() => onChange({ ...value, count: n })} />
      ))}
    </div>

    <FieldLabel>Ne kadar süre içinde?</FieldLabel>
    <DurationPicker color="#f59e0b" value={value.windowSeconds ?? 600} onChange={(s) => onChange({ ...value, windowSeconds: s })} presets={[60, 300, 600, 1800, 3600]} />

    <Hint>Örnek: kapı 10 dakika içinde 3 kez açılırsa.</Hint>

  </div>
);

export const SequenceTriggerEditor = ({ value, onChange, devices }) => {

  const steps = value.steps ?? [];

  const replaceStep = (i, next) => onChange({ ...value, steps: steps.map((s, j) => (j === i ? next : s)) });
  const removeStep = (i) => onChange({ ...value, steps: steps.filter((_, j) => j !== i) });

  // Yeni adım eklenince önceki "olmazsa" adımı "olursa"ya döner (yalnızca son adım "olmazsa" olabilir)
  const addStep = () => onChange({ ...value, steps: [...steps.map(s => ({ ...s, mode: 'OCCURS' })), { mode: 'OCCURS', withinSeconds: 120 }] });

  return (

    <div className="space-y-3">

      {steps.map((step, i) => (

        <div key={i} className="border border-slate-700 rounded-xl p-4">

          <div className="flex items-center justify-between mb-2">
            <p className="font-bold text-white text-sm">{i + 1}. adım</p>
            {steps.length > 2 && (
              <button type="button" onClick={() => removeStep(i)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
            )}
          </div>

          {i > 0 && (
            <div className="mb-4">
              <div className="flex gap-2">
                <Chip grow label="Şu olursa" color="#0ea5e9" active={step.mode !== 'ABSENT'} onClick={() => replaceStep(i, { ...step, mode: 'OCCURS' })} />
                {i === steps.length - 1 && (
                  <Chip grow label="Şu olmazsa" color="#0ea5e9" active={step.mode === 'ABSENT'} onClick={() => replaceStep(i, { ...step, mode: 'ABSENT' })} />
                )}
              </div>
              <FieldLabel>{step.mode === 'ABSENT' ? 'Önceki adımdan sonra bu süre boyunca' : 'Önceki adımdan sonra en geç'}</FieldLabel>
              <DurationPicker color="#0ea5e9" value={step.withinSeconds ?? 120} onChange={(s) => replaceStep(i, { ...step, withinSeconds: s })} presets={[30, 60, 120, 300, 600]} />
            </div>
          )}

          <DeviceCheckEditor key={`step-${i}`} value={step} onChange={(next) => replaceStep(i, next)} devices={devices} simple />

        </div>
      ))}

      {steps.length < 6 && (
        <button type="button" onClick={addStep} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-sky-500 text-sky-400 text-sm font-bold hover:bg-sky-500/10 transition-all">
          <Plus size={14} /> Adım ekle
        </button>
      )}

      <Hint>Örnek: 1. adım kapı açıldı; 2. adım 2 dakika boyunca hareket olmazsa → kapı açık kaldı ama kimse girmedi.</Hint>

    </div>
  );
};

export const AnomalyTriggerEditor = ({ value, onChange, devices }) => {

  const dispatch = useDispatch();
  const [baseline, setBaseline] = useState(null);
  const [loading, setLoading] = useState(false);

  const mode = value.anomalyMode ?? 'VALUE';
  const device = findDevice(devices, value.deviceId);
  const channels = relayChannels(device);

  const set = (patch) => {
    setBaseline(null);
    onChange({ ...value, ...patch });
  };

  const changeMode = (id) => set({
    anomalyMode: id,
    deviceId: undefined,
    property: id === 'DURATION' ? RELAY_PROPERTY : undefined,
    channel: undefined,
    operator: undefined,
    value: undefined,
    valueTo: undefined,
  });

  const loadBaseline = async () => {

    setLoading(true);

    try {
      setBaseline(await dispatch(getAnomalyBaseline({ trigger: { ...value, anomalyMode: mode } })).unwrap());
    } catch (e) {
      toast.error(String(e));
    } finally {
      setLoading(false);
    }
  };

  const canPreview = !!value.deviceId && !!value.property && (mode !== 'ACTIVITY' || !!value.operator);

  return (

    <div>

      <FieldLabel first>Ne olağan dışı sayılsın?</FieldLabel>

      <div className="grid sm:grid-cols-3 gap-2">
        {ANOMALY_MODES.map(m => (
          <button
            key={m.id}
            type="button"
            onClick={() => changeMode(m.id)}
            className={`text-left rounded-xl p-3 border transition-all ${mode === m.id ? 'border-red-500 bg-red-500/10' : 'border-slate-700 bg-slate-800/60 hover:border-slate-600'}`}
          >
            <p className={`text-sm font-bold ${mode === m.id ? 'text-red-400' : 'text-slate-200'}`}>{m.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>
          </button>
        ))}
      </div>

      {mode === 'VALUE' && (
        <>
          <FieldLabel>Cihaz</FieldLabel>
          <DeviceSelect devices={devices} value={value.deviceId} onChange={(id) => set({ deviceId: id })} />

          <FieldLabel>Sayısal alan</FieldLabel>
          <div className="flex flex-wrap gap-2 mb-2">
            {[...new Set([...deviceFields(device).filter(f => f.kind === 'number').map(f => f.path), ...NUMERIC_SUGGESTIONS])].map(p => (
              <Chip key={p} label={fieldName(p)} color="#ef4444" active={value.property === p} onClick={() => set({ property: p })} />
            ))}
          </div>
          <TextInput value={value.property ?? ''} onChange={(e) => set({ property: e.target.value.trim() || undefined })} placeholder="Ya da alan yolu: data.temperature" />

          <FieldLabel>Yön</FieldLabel>
          <div className="flex gap-2">
            {DIRECTIONS.map(d => (
              <Chip key={d.id} grow label={d.label} color="#ef4444" active={(value.direction ?? 'BOTH') === d.id} onClick={() => set({ direction: d.id })} />
            ))}
          </div>
        </>
      )}

      {mode === 'ACTIVITY' && (
        <div className="mt-4">
          <DeviceCheckEditor value={value} onChange={(next) => set(next)} devices={devices} simple />
        </div>
      )}

      {mode === 'DURATION' && (
        <>
          <FieldLabel>Röle</FieldLabel>
          <DeviceSelect devices={devices} filter={isRelay} value={value.deviceId} onChange={(id) => set({ deviceId: id, channel: undefined, property: RELAY_PROPERTY })} />

          {channels.length > 0 && (
            <>
              <FieldLabel>Kanal</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {channels.map(ch => (
                  <Chip key={ch.index} label={ch.label || `Kanal ${ch.index}`} color="#ef4444" active={value.channel != null && Number(value.channel) === Number(ch.index)} onClick={() => set({ channel: ch.index })} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      <FieldLabel>Hassasiyet</FieldLabel>
      <div className="flex gap-2">
        {SENSITIVITIES.map(s => (
          <Chip key={s.id} grow label={s.label} color="#ef4444" active={(value.sensitivity ?? 'MEDIUM') === s.id} onClick={() => set({ sensitivity: s.id })} />
        ))}
      </div>
      <Hint>Yüksek hassasiyet daha küçük sapmalarda da tetikler; yanlış alarm ihtimali artar.</Hint>

      <button
        type="button"
        onClick={loadBaseline}
        disabled={!canPreview || loading}
        className="mt-4 w-full py-2.5 rounded-xl border border-red-500/60 text-red-400 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {loading ? <Spinner size={14} /> : <Activity size={14} />} Bu sensörün normalini gör
      </button>

      {baseline && (
        <div className="mt-3 bg-slate-950/60 border border-slate-800 rounded-xl p-4">

          {!baseline.ready ? (
            <p className="text-xs text-amber-400">
              Henüz yeterli veri yok ({baseline.days} gün{baseline.samples != null ? `, ${baseline.samples} örnek` : ''}). Tetikleyici veri biriktikçe kendiliğinden devreye girer.
            </p>
          ) : baseline.mode === 'VALUE' ? (
            <>
              <p className="text-xs text-slate-300 mb-2">Normal: {baseline.mean} ± {baseline.std} · son {baseline.days} günde {baseline.samples} ölçüm</p>
              <Bars values={baseline.hourly.map(v => v ?? 0)} labels={['00', '06', '12', '18', '23']} color="#ef4444" />
            </>
          ) : baseline.mode === 'ACTIVITY' ? (
            <>
              <p className="text-xs text-slate-300 mb-2">Son {baseline.days} günde {baseline.events} olay. Saat başına günde {baseline.rareBelow} altı olan saatler alışılmadık sayılır.</p>
              <Bars values={baseline.rates} labels={['00', '06', '12', '18', '23']} color="#ef4444" />
            </>
          ) : (
            <p className="text-xs text-slate-300">Genelde en fazla {baseline.usualMinutes} dk açık kalıyor; {baseline.limitMinutes} dakikayı geçerse tetiklenir.</p>
          )}

        </div>
      )}

    </div>
  );
};

// ───────────────────────── EV MODU VE KİŞİLER ─────────────────────────

const HomeModeChips = ({ selected, onPick, color, multi }) => (

  <div className="flex flex-wrap gap-2">
    {Object.entries(HOME_MODE_LABELS).map(([id, label]) => (
      <Chip key={id} label={label} color={color} active={multi ? selected.includes(id) : selected === id} onClick={() => onPick(id)} />
    ))}
  </div>
);

export const HomeModeTriggerEditor = ({ value, onChange }) => (

  <div>
    <FieldLabel first>Ev modu şuna geçince</FieldLabel>
    <HomeModeChips selected={value.homeMode} color="#14b8a6" onPick={(m) => onChange({ ...value, homeMode: m })} />
    <Hint>Mod, Otomasyonlar sayfasındaki seçiciden ya da başka bir otomasyondan değiştirilebilir.</Hint>
  </div>
);

export const HomeModeConditionEditor = ({ value, onChange }) => {

  const selected = value.homeModes ?? [];

  const toggle = (m) => {
    const next = selected.includes(m) ? selected.filter(x => x !== m) : [...selected, m];
    if (next.length) onChange({ ...value, homeModes: next }); // en az biri seçili kalsın
  };

  return (
    <div>
      <FieldLabel first>Ev modu bunlardan biriyse</FieldLabel>
      <HomeModeChips selected={selected} color="#0ea5e9" multi onPick={toggle} />
    </div>
  );
};

export const SetHomeModeActionEditor = ({ value, onChange }) => (

  <div>
    <FieldLabel first>Ev modunu şuna çevir</FieldLabel>
    <HomeModeChips selected={value.homeMode} color="#14b8a6" onPick={(m) => onChange({ ...value, homeMode: m })} />
    <Hint>Bu değişiklik, ev modu tetikleyicili diğer otomasyonları da çalıştırabilir.</Hint>
  </div>
);

export const PresenceActionEditor = ({ value, onChange }) => (

  <div>
    <div className="flex gap-2">
      <Chip grow label="Başlat" color="#6366f1" active={value.enable !== false} onClick={() => onChange({ ...value, enable: true })} />
      <Chip grow label="Durdur" color="#6366f1" active={value.enable === false} onClick={() => onChange({ ...value, enable: false })} />
    </div>
    <Hint>Işıklar, "Evde varmış gibi" ayarlarına göre yanar. Örneğin elle çalıştırdığın bir "Dışarı çıkıyorum" otomasyonuna ekleyebilirsin.</Hint>
  </div>
);

// Ev üyelerinden seçim. emptyMeansMe: boş liste = yalnızca otomasyonun sahibi (sen)
const PeoplePicker = ({ value = [], onChange, members, color, emptyMeansMe = true }) => {

  if (!members.length) return <Hint>Ev üyeleri yüklenemedi; kural yalnızca senin için kurulur.</Hint>;

  const me = members.find((m) => m.isMe);
  const myId = me ? String(me.userId) : null;
  const selected = value.length ? value.map(String) : (emptyMeansMe && myId ? [myId] : []);

  const toggle = (id) => {

    const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
    if (!next.length && emptyMeansMe) return; // en az bir kişi seçili kalsın

    // Yalnızca sen seçiliysen boş kaydedilir; şablon olarak paylaşılınca alan kişiye uyar
    onChange(emptyMeansMe && next.length === 1 && next[0] === myId ? [] : next);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {members.map((m) => (
        <Chip key={m.userId} label={m.isMe ? 'Ben' : m.name} color={color} active={selected.includes(String(m.userId))} onClick={() => toggle(String(m.userId))} />
      ))}
    </div>
  );
};

const GEOFENCE_EVENTS = [
  { id: 'ENTER', label: 'Eve gelince' },
  { id: 'LEAVE', label: 'Evden çıkınca' },
  { id: 'FIRST_ARRIVED', label: 'İlk kişi gelince' },
  { id: 'LAST_LEFT', label: 'Son kişi çıkınca' },
];

export const GeofenceTriggerEditor = ({ value, onChange, members }) => {

  const perPerson = value.geofenceEvent === 'ENTER' || value.geofenceEvent === 'LEAVE';

  const pick = (id) => onChange({ ...value, geofenceEvent: id, userIds: id === 'ENTER' || id === 'LEAVE' ? value.userIds ?? [] : undefined });

  return (

    <div>

      <FieldLabel first>Ne zaman?</FieldLabel>
      <div className="flex flex-wrap gap-2">
        {GEOFENCE_EVENTS.map((e) => (
          <Chip key={e.id} label={e.label} color="#22c55e" active={value.geofenceEvent === e.id} onClick={() => pick(e.id)} />
        ))}
      </div>

      {perPerson && (
        <>
          <FieldLabel>Kim?</FieldLabel>
          <PeoplePicker value={value.userIds ?? []} onChange={(userIds) => onChange({ ...value, userIds })} members={members} color="#22c55e" />
          <Hint>Birden fazla kişi seçersen herhangi biri gelince / çıkınca çalışır.</Hint>
        </>
      )}

      <Hint>Mobil uygulamada konum algılamasını açmış kişiler için çalışır. Evden çıkış, yanlış algılamalara karşı 3 dakika sonra kesinleşir.</Hint>

    </div>
  );
};

const PRESENCE_OPTIONS = [
  { id: 'NOBODY_HOME', label: 'Evde kimse yoksa' },
  { id: 'ANYONE_HOME', label: 'Evde biri varsa' },
  { id: 'USERS_HOME', label: 'Seçtiklerim evdeyse' },
  { id: 'USERS_AWAY', label: 'Seçtiklerim dışarıdaysa' },
];

export const PresenceConditionEditor = ({ value, onChange, members }) => {

  const perPerson = value.presence === 'USERS_HOME' || value.presence === 'USERS_AWAY';

  const pick = (id) => onChange({ ...value, presence: id, userIds: id === 'USERS_HOME' || id === 'USERS_AWAY' ? value.userIds ?? [] : undefined });

  return (

    <div>

      <div className="flex flex-wrap gap-2">
        {PRESENCE_OPTIONS.map((o) => (
          <Chip key={o.id} label={o.label} color="#0ea5e9" active={value.presence === o.id} onClick={() => pick(o.id)} />
        ))}
      </div>

      {perPerson && (
        <>
          <FieldLabel>Kimler?</FieldLabel>
          <PeoplePicker value={value.userIds ?? []} onChange={(userIds) => onChange({ ...value, userIds })} members={members} color="#0ea5e9" />
          <Hint>Seçtiğin herkes için geçerli olmalı: hepsi evde ya da hepsi dışarıda.</Hint>
        </>
      )}

      <Hint>Konum algılaması kapalı olan kişiler "dışarıda" sayılır.</Hint>

    </div>
  );
};

// ───────────────────────── AKSİYONLAR ─────────────────────────

export const RelayActionEditor = ({ value, onChange, devices }) => {

  const relayDevices = devices.filter(isRelay);

  if (relayDevices.length === 0) return <Hint>Sistemde kayıtlı röle cihazı bulunamadı.</Hint>;

  const isSelected = (device, channelIndex) =>
    String(getId(value.deviceId)) === String(device._id)
    && (channelIndex == null ? value.channel == null : Number(value.channel) === Number(channelIndex));

  const renderCommands = (device, channelIndex) => (
    <div className="flex gap-2">
      {RELAY_COMMANDS.map(cmd => (
        <Chip
          key={cmd.id}
          label={cmd.label}
          color={cmd.color}
          active={isSelected(device, channelIndex) && value.command === cmd.id}
          onClick={() => onChange({ ...value, deviceId: device._id, channel: channelIndex ?? undefined, command: cmd.id })}
        />
      ))}
    </div>
  );

  return (

    <div className="grid sm:grid-cols-2 gap-3">

      {relayDevices.map(device => {

        const channels = device.data?.relayChannels || [];

        return (

          <div key={device._id} className="border border-slate-700 rounded-xl p-4">

            <p className="font-bold text-white text-sm mb-2 flex items-center gap-2"><Power size={14} className="text-emerald-400" /> {device.name}</p>

            {channels.length === 0 ? renderCommands(device, null) : channels.map(ch => (
              <div key={ch.index} className="flex items-center justify-between gap-2 mt-2">
                <span className="text-sm text-slate-300 truncate">{ch.label || `Kanal ${ch.index}`}</span>
                {renderCommands(device, ch.index)}
              </div>
            ))}

          </div>
        );
      })}

    </div>
  );
};

export const SceneActionEditor = ({ value, onChange, scenes }) => {

  if (!scenes.length) return <Hint>Henüz sahne yok. Mobil uygulamada ana ekrandaki Sahneler bölümünden oluşturabilirsin.</Hint>;

  const missing = value.sceneId && !scenes.some((s) => String(s._id) === String(value.sceneId));

  return (

    <div>

      <FieldLabel first>Hangi sahne?</FieldLabel>

      <div className="flex flex-wrap gap-2">
        {scenes.map((s) => (
          <Chip key={s._id} icon={sceneIcon(s.icon)} label={s.name} color={s.color ?? '#ec4899'} active={String(value.sceneId) === String(s._id)} onClick={() => onChange({ ...value, sceneId: s._id })} />
        ))}
      </div>

      {missing && <p className="text-xs text-red-400 mt-2">Seçili sahne bulunamadı; silinmiş olabilir. Başka bir sahne seç.</p>}

      <Hint>Sahne senin yetkinle çalışır. Yetkin olmayan ya da silinmiş cihazlar atlanır, diğerleri çalışır. Sahneyi sonradan düzenlersen otomasyon yeni halini kullanır.</Hint>

    </div>
  );
};

const RecipientChips = ({ value, onPick, color }) => (

  <div className="flex gap-2 flex-wrap">
    <Chip grow label="Sadece bana" color={color} active={(value ?? 'OWNER') === 'OWNER'} onClick={() => onPick('OWNER')} />
    <Chip grow label="Tüm üyelere" color={color} active={value === 'HOME_MEMBERS'} onClick={() => onPick('HOME_MEMBERS')} />
    <Chip grow label="Seçtiklerime" color={color} active={value === 'USERS'} onClick={() => onPick('USERS')} />
  </div>
);

export const NotifyActionEditor = ({ value, onChange, templateVars, members }) => {

  const n = { title: '', body: '', severity: 'info', ...(value.notification || {}) };
  const set = (patch) => onChange({ ...value, notification: { ...n, ...patch } });

  // Değişkeni mesajın sonuna ekler
  const insertVar = (token) => {
    const sep = n.body && !n.body.endsWith(' ') ? ' ' : '';
    set({ body: (n.body + sep + token).slice(0, NOTIFY_LIMITS.body) });
  };

  return (

    <div>

      <div className="flex justify-between mb-1">
        <span className="text-xs font-bold text-slate-400">Başlık</span>
        <span className="text-xs text-slate-500">{n.title.length}/{NOTIFY_LIMITS.title}</span>
      </div>
      <TextInput value={n.title} onChange={(e) => set({ title: e.target.value.slice(0, NOTIFY_LIMITS.title) })} placeholder="Örn: Su kaçağı!" />

      <div className="flex justify-between mb-1 mt-4">
        <span className="text-xs font-bold text-slate-400">Mesaj (opsiyonel)</span>
        <span className="text-xs text-slate-500">{n.body.length}/{NOTIFY_LIMITS.body}</span>
      </div>
      <TextInput multiline value={n.body} onChange={(e) => set({ body: e.target.value.slice(0, NOTIFY_LIMITS.body) })} placeholder="Örn: {{device.name}} su algıladı." />

      {templateVars.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {templateVars.map(v => (
            <button key={v.key} type="button" onClick={() => insertVar(v.key)} className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition-all">
              + {v.label}
            </button>
          ))}
        </div>
      )}

      <FieldLabel>Kime</FieldLabel>
      <RecipientChips value={n.recipients} color="#8b5cf6" onPick={(r) => set({ recipients: r, userIds: r === 'USERS' ? n.userIds ?? [] : undefined })} />

      {n.recipients === 'USERS' && (
        <div className="mt-2">
          <PeoplePicker value={n.userIds ?? []} onChange={(userIds) => set({ userIds })} members={members} color="#8b5cf6" emptyMeansMe={false} />
        </div>
      )}

      <FieldLabel>Önem</FieldLabel>
      <div className="flex gap-2">
        {NOTIFY_SEVERITIES.map(s => (
          <Chip key={s.id} grow label={s.label} color={s.color} active={n.severity === s.id} onClick={() => set({ severity: s.id })} />
        ))}
      </div>

    </div>
  );
};

export const ApprovalActionEditor = ({ value, onChange, members }) => {

  const ap = { title: '', body: '', timeoutSeconds: 600, onTimeout: 'STOP', snoozeMinutes: 60, ...(value.approval || {}) };
  const set = (patch) => onChange({ ...value, approval: { ...ap, ...patch } });
  const recipients = ap.recipients ?? 'OWNER';

  return (

    <div>

      <FieldLabel first>Soru</FieldLabel>
      <TextInput value={ap.title} onChange={(e) => set({ title: e.target.value.slice(0, 120) })} placeholder="Örn: Kombi açılsın mı?" />

      <FieldLabel>Açıklama (opsiyonel)</FieldLabel>
      <TextInput multiline value={ap.body} onChange={(e) => set({ body: e.target.value.slice(0, 300) })} placeholder="Örn: {{device.name}} 18 °C'nin altına düştü." />

      <FieldLabel>Kime sorulsun?</FieldLabel>
      <RecipientChips value={recipients} color="#0ea5e9" onPick={(r) => set({ recipients: r, userIds: r === 'USERS' ? ap.userIds ?? [] : undefined })} />

      {recipients === 'USERS' && (
        <div className="mt-2">
          <PeoplePicker value={ap.userIds ?? []} onChange={(userIds) => set({ userIds })} members={members} color="#0ea5e9" emptyMeansMe={false} />
        </div>
      )}

      {recipients !== 'OWNER' && <Hint>İlk cevap veren karar verir; diğerlerine kimin ne dediği bildirilir. "Tüm üyelere" seçilince kısıtlı üyelere sorulmaz.</Hint>}

      <FieldLabel>Ne kadar beklensin?</FieldLabel>
      <DurationPicker color="#0ea5e9" value={ap.timeoutSeconds} onChange={(s) => set({ timeoutSeconds: Math.max(60, s) })} presets={[60, 300, 600, 1800, 3600]} />

      <FieldLabel>Cevap gelmezse</FieldLabel>
      <div className="flex gap-2">
        <Chip grow label="Durdur" color="#0ea5e9" active={ap.onTimeout !== 'CONTINUE'} onClick={() => set({ onTimeout: 'STOP' })} />
        <Chip grow label="Devam et" color="#0ea5e9" active={ap.onTimeout === 'CONTINUE'} onClick={() => set({ onTimeout: 'CONTINUE' })} />
      </div>

      <FieldLabel>Ertele butonu</FieldLabel>
      <div className="flex flex-wrap gap-2">
        {APPROVAL_SNOOZES.map(m => (
          <Chip key={m} label={m === 0 ? 'Yok' : formatDuration(m * 60)} color="#0ea5e9" active={(ap.snoozeMinutes ?? 60) === m} onClick={() => set({ snoozeMinutes: m })} />
        ))}
      </div>

      <Hint>Telefona Evet / Hayır{ap.snoozeMinutes ? ' / Ertele' : ''} butonlu bir bildirim gider ve otomasyon cevabı bekler. "Hayır" denirse sonraki aksiyonlar çalışmaz. Bildirim kaçırılırsa Otomasyonlar sayfasındaki "Onay bekleyenler" kartından da cevaplanabilir.</Hint>

    </div>
  );
};

export const ActionOptions = ({ value, onChange }) => (

  <div className="mt-5 pt-4 border-t border-slate-700 space-y-1">
    <ToggleRow label="Bu aksiyon etkin" value={value.enabled !== false} onChange={(v) => onChange({ ...value, enabled: v })} />
    <ToggleRow label="Hata olursa sonrakilere devam et" value={!!value.continueOnError} onChange={(v) => onChange({ ...value, continueOnError: v })} />
  </div>
);

// ───────────────────────── PROVA VE ŞİMDİ TEST ET ─────────────────────────

const SIM_SKIP_LABELS = { CONDITION_FAILED: 'koşul tutmadı', COOLDOWN: 'bekleme süresi dolmadı', OUT_OF_WINDOW: 'tarih aralığı dışında' };

const formatStamp = (iso) => {
  const d = new Date(iso);
  return `${SHORT_DAYS[d.getDay()]} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const warningText = (w, devices) => {
  if (w.code === 'NO_HISTORY') return `${findDevice(devices, w.deviceId)?.name ?? 'Bir cihaz'} için geçmiş veri yok; sonuç eksik olabilir.`;
  if (w.code === 'NO_LOCATION') return 'Güneş tetikleyicileri için evin konumu tanımlı değil.';
  if (w.code === 'UNSIMULATED_TRIGGER') return 'Manuel, konum ve sesli tetikleyiciler provaya dahil edilmez.';
  if (w.code === 'TOO_MUCH_DATA') return 'Veri çok fazla olduğu için prova kısaltıldı.';
  return w.code;
};

const ACTION_KIND_LABELS = { NOTIFY: 'Bildirim gönder', DELAY: 'Bekle', ASK_APPROVAL: 'Onay iste', SCENE: 'Sahne çalıştır', SET_HOME_MODE: 'Ev modunu değiştir', SET_PRESENCE: 'Evde varmış gibi' };

const actionPreviewText = (a) => {
  if (a.kind === 'DEVICE_COMMAND') {
    const cmd = RELAY_COMMANDS.find(c => c.id === a.command)?.label ?? a.command;
    return `${a.deviceName ?? 'Cihaz'} → ${cmd}${a.channelLabel ? ` · ${a.channelLabel}` : ''}`;
  }
  return ACTION_KIND_LABELS[a.kind] ?? a.kind;
};

export const SimulationPanel = ({ buildDraft, triggerItems, devices, enabled }) => {

  const dispatch = useDispatch();

  const [days, setDays] = useState(7);
  const [sim, setSim] = useState(null);
  const [simLoading, setSimLoading] = useState(false);
  const [simError, setSimError] = useState(null);
  const [showSamples, setShowSamples] = useState(false);

  const [testIndex, setTestIndex] = useState(0);
  const [testValue, setTestValue] = useState(undefined);
  const [test, setTest] = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState(null);

  const idx = Math.min(testIndex, Math.max(0, triggerItems.length - 1));
  const selected = triggerItems[idx];

  const runSim = async (d = days) => {

    setSimLoading(true);
    setSimError(null);

    try {
      setSim(await dispatch(simulateAutomation({ automation: buildDraft(), days: d })).unwrap());
    } catch (e) {
      setSimError(String(e));
    } finally {
      setSimLoading(false);
    }
  };

  const runTest = async () => {

    const override = selected?.source === 'DEVICE' && hasValue(testValue)
      ? { deviceId: getId(selected.deviceId), property: selected.property, channel: selected.channel, value: testValue }
      : undefined;

    setTestLoading(true);
    setTestError(null);

    try {
      setTest(await dispatch(testAutomation({ automation: buildDraft(), triggerIndex: idx, override })).unwrap());
    } catch (e) {
      setTestError(String(e));
    } finally {
      setTestLoading(false);
    }
  };

  const dayLabels = sim
    ? (sim.byDay.length <= 7
      ? sim.byDay.map(d => SHORT_DAYS[new Date(d.date).getDay()])
      : [sim.byDay[0].date.slice(5), sim.byDay[sim.byDay.length - 1].date.slice(5)])
    : null;

  return (

    <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-5">

      <p className="flex items-center gap-2 font-bold text-white"><FlaskConical size={16} className="text-purple-400" /> Prova</p>
      <p className="text-xs text-slate-400 mt-1 mb-4">Kuralı kaydetmeden önce evinin geçmiş verileriyle dene. Hiçbir cihaz çalıştırılmaz.</p>

      {!enabled && <p className="text-xs text-red-400 mb-3">Prova için önce eksik bilgileri tamamla.</p>}

      <div className="flex flex-wrap gap-2 items-center">

        {[3, 7, 14].map(d => (
          <Chip key={d} label={`${d} gün`} color="#8b5cf6" active={days === d} onClick={() => { setDays(d); if (sim && enabled) runSim(d); }} />
        ))}

        <button type="button" onClick={() => runSim()} disabled={!enabled || simLoading} className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          {simLoading ? <Spinner size={14} /> : <Play size={14} />} Geçen {days} güne karşı prova et
        </button>

      </div>

      {simError && <p className="text-xs text-red-400 mt-2">{simError}</p>}

      {sim && (

        <div className="mt-5">

          <p className="text-3xl font-black text-white">{sim.runs} kez</p>
          <p className="text-sm text-slate-400">çalışırdı · günde ortalama {sim.perDayAvg}{sim.nightRuns ? ` · ${sim.nightRuns} tanesi gece (00–06)` : ''}</p>

          {sim.skipped > 0 && (
            <p className="text-xs text-slate-400 mt-2">
              {sim.skipped} tetiklenme atlanırdı: {Object.entries(sim.skipReasons).map(([k, v]) => `${v} ${SIM_SKIP_LABELS[k] ?? k}`).join(', ')}
            </p>
          )}

          {sim.perDayAvg > 20 && <p className="text-xs text-amber-400 mt-2">Çok sık çalışıyor. Bekleme süresi ya da histerezis eklemeyi düşün.</p>}

          {sim.runs === 0 && !sim.warnings.some(w => w.code === 'NO_HISTORY') && (
            <p className="text-xs text-amber-400 mt-2">Bu dönemde hiç çalışmazdı. Eşikleri ve koşulları kontrol et.</p>
          )}

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div>
              <p className="text-xs font-bold text-slate-500 mb-2">Saatlere göre</p>
              <Bars values={sim.byHour} labels={['00', '06', '12', '18', '23']} color="#8b5cf6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-2">Günlere göre</p>
              <Bars values={sim.byDay.map(d => d.runs)} labels={dayLabels} color="#8b5cf6" />
            </div>
          </div>

          {sim.warnings.map((w, i) => <p key={i} className="text-xs text-amber-400 mt-2">• {warningText(w, devices)}</p>)}

          {sim.samples.length > 0 && (
            <>
              <button type="button" onClick={() => setShowSamples(s => !s)} className="mt-3 text-xs font-bold text-purple-400 hover:text-purple-300">
                {showSamples ? 'Olayları gizle' : `Son ${sim.samples.length} olayı göster`}
              </button>

              {showSamples && (
                <div className="mt-2 max-h-64 overflow-y-auto pr-1">
                  {sim.samples.map((s, i) => (
                    <div key={i} className="py-1.5 border-b border-slate-800">
                      <p className="text-xs font-semibold" style={{ color: s.status === 'RUN' ? '#10b981' : '#94a3b8' }}>
                        {formatStamp(s.at)} · {s.status === 'RUN' ? 'Çalışırdı' : `Atlanırdı (${SIM_SKIP_LABELS[s.skipReason] ?? s.skipReason})`}
                        {s.value !== undefined ? ` · değer: ${s.value}` : ''}
                      </p>
                      {s.trace?.filter(t => !t.result).map((t, j) => <p key={j} className="text-[11px] text-slate-500">{traceLine(t)}</p>)}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <p className="text-[11px] text-slate-500 mt-3">Aksiyonların süresi ve çalışma modu provada hesaba katılmaz.</p>

        </div>
      )}

      {/* Şimdi test et */}
      <div className="mt-6 pt-5 border-t border-purple-500/20">

        <p className="font-bold text-white">Şimdi test et</p>
        <p className="text-xs text-slate-400 mt-1 mb-3">Evin şu anki durumuyla koşulları ve yetkileri kontrol eder. Aksiyonlar çalışmaz.</p>

        {triggerItems.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {triggerItems.map((t, i) => (
              <Chip key={t._key} label={describeTrigger(t, { devices }).label} color="#8b5cf6" active={idx === i} onClick={() => { setTestIndex(i); setTestValue(undefined); setTest(null); }} />
            ))}
          </div>
        )}

        {selected?.source === 'DEVICE' && (
          <div className="mb-3 max-w-md" key={idx}>
            <p className="text-xs font-bold text-slate-400 mb-1.5">Test değeri ({fieldName(selected.property)}) · boş bırakırsan şu anki değer kullanılır</p>
            <ValueInput value={undefined} onChange={setTestValue} placeholder="Örn: 30" />
          </div>
        )}

        <button type="button" onClick={runTest} disabled={!enabled || testLoading} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-purple-500 text-purple-300 text-sm font-bold hover:bg-purple-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          {testLoading ? <Spinner size={14} /> : <FlaskConical size={14} />} Şimdi test et
        </button>

        {testError && <p className="text-xs text-red-400 mt-2">{testError}</p>}

        {test && (

          <div className="mt-4 space-y-1">

            <p className={`text-base font-black ${test.wouldRun ? 'text-emerald-400' : 'text-red-400'}`}>
              {test.wouldRun ? 'Şu an tetiklense çalışırdı' : 'Şu an tetiklense çalışmazdı'}
            </p>

            {test.trigger && (
              <p className="text-xs text-slate-400">{test.trigger.matches ? '✓' : '✗'} Tetikleyici · değer: {String(test.trigger.actual ?? 'veri yok')}</p>
            )}

            {test.trace.map((t, i) => <p key={i} className="text-xs text-slate-400">{traceLine(t)}</p>)}

            {test.actions.length > 0 && <p className="text-xs font-bold text-slate-500 pt-2">Aksiyonlar</p>}

            {test.actions.map((a, i) => (
              <p key={i} className={`text-xs ${a.allowed === false ? 'text-red-400' : a.enabled === false ? 'text-slate-500' : 'text-slate-300'}`}>
                {a.allowed === false ? '✗' : '✓'} {actionPreviewText(a)}
                {a.allowed === false ? ` — yetki yok${a.reason ? ` (${a.reason})` : ''}` : ''}
                {a.enabled === false ? ' (devre dışı)' : ''}
              </p>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};
    </Modal>
  );
};

export default AutomationEditor;
