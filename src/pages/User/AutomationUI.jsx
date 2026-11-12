import React, { useEffect, useState } from 'react';
import { ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';

import { formatDuration, WEEK_ORDER, SHORT_DAYS } from './automationShared';

// ───────────────────────── PENCERE ─────────────────────────

export const Modal = ({ onClose, children, maxWidth = 'max-w-2xl', closeOnBackdrop = true }) => {

  useEffect(() => {

    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (

    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">

      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={closeOnBackdrop ? onClose : undefined} />

      <div className={`relative bg-slate-900 border border-slate-800 w-full ${maxWidth} rounded-3xl max-h-[90vh] flex flex-col overflow-hidden`}>
        {children}
      </div>

    </div>
  );
};

// ───────────────────────── KÜÇÜK PARÇALAR ─────────────────────────

export const Spinner = ({ size = 18, className = '' }) => <Loader2 size={size} className={`animate-spin ${className}`} />;

export const Toggle = ({ value, onChange, disabled, size = 32 }) => (

  <button
    type="button"
    onClick={(e) => { e.stopPropagation(); onChange(!value); }}
    disabled={disabled}
    aria-pressed={value}
    className={`p-1 rounded-xl transition-all hover:bg-slate-800 disabled:opacity-50 ${value ? 'text-blue-500' : 'text-slate-600'}`}
  >
    {value ? <ToggleRight size={size} /> : <ToggleLeft size={size} />}
  </button>
);

export const IconBox = ({ icon: Icon, color, size = 'w-9 h-9', iconSize = 16 }) => (

  <div className={`${size} rounded-xl flex items-center justify-center flex-shrink-0`} style={{ backgroundColor: `${color}1A`, color }}>
    <Icon size={iconSize} />
  </div>
);

export const SectionLabel = ({ children, right }) => (

  <div className="flex items-center justify-between mb-2">
    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{children}</p>
    {right}
  </div>
);

export const FieldLabel = ({ children, first }) => (

  <p className={`text-xs font-bold text-slate-400 mb-2 ${first ? '' : 'mt-4'}`}>{children}</p>
);

export const Hint = ({ children }) => <p className="text-xs text-slate-500 mt-3 leading-relaxed">{children}</p>;

export const Chip = ({ label, active, onClick, color = '#3b82f6', grow, icon: Icon, disabled, title }) => (

  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${grow ? 'flex-1' : ''} ${active ? '' : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'}`}
    style={active ? { backgroundColor: `${color}1F`, borderColor: color, color } : undefined}
  >
    {Icon ? <Icon size={14} style={active ? undefined : { color }} /> : null}
    {label}
  </button>
);

const INPUT_CLASS = 'w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50';

export const TextInput = ({ multiline, className = '', ...props }) => (
  multiline
    ? <textarea rows={3} className={`${INPUT_CLASS} resize-none ${className}`} {...props} />
    : <input type="text" className={`${INPUT_CLASS} ${className}`} {...props} />
);

// "28" → 28, "true" → true, "on" → "on", "" → undefined
export const parseValue = (text) => {

  const s = String(text).trim();
  if (s === '') return undefined;
  if (s === 'true') return true;
  if (s === 'false') return false;

  const n = Number(s.replace(',', '.'));
  return Number.isNaN(n) ? s : n;
};

export const parseNumber = (text) => {

  const s = String(text).trim();
  const n = Number(s.replace(',', '.'));
  return s === '' || Number.isNaN(n) ? undefined : n;
};

// Yazarken "28." gibi ara değerler kaybolmasın diye metni kendisi tutar
export const ValueInput = ({ value, onChange, parse = parseValue, ...props }) => {

  const [text, setText] = useState(value === undefined || value === null ? '' : String(value));

  return <TextInput {...props} value={text} onChange={(e) => { setText(e.target.value); onChange(parse(e.target.value)); }} />;
};

export const ToggleRow = ({ label, value, onChange }) => (

  <div className="flex items-center justify-between gap-3">
    <span className="text-sm text-slate-300">{label}</span>
    <Toggle value={value} onChange={onChange} size={28} />
  </div>
);

// ───────────────────────── SÜRE ─────────────────────────

export const DurationPicker = ({ value = 0, onChange, presets, zeroLabel = 'Yok', color = '#3b82f6' }) => {

  const unitOf = (sec) => (sec && sec % 60 === 0 ? 'dk' : 'sn');
  const textOf = (sec, unit) => (sec ? String(unit === 'dk' ? sec / 60 : sec) : '');

  const [unit, setUnit] = useState(unitOf(value));
  const [text, setText] = useState(textOf(value, unitOf(value)));

  const emit = (t, u) => {
    const n = parseInt(t, 10);
    onChange(Number.isNaN(n) || n < 0 ? 0 : (u === 'dk' ? n * 60 : n));
  };

  const pick = (sec) => {
    const u = unitOf(sec);
    setUnit(u);
    setText(textOf(sec, u));
    onChange(sec);
  };

  return (

    <div>

      <div className="flex flex-wrap gap-2">
        {presets.map(sec => (
          <Chip key={sec} color={color} label={sec ? formatDuration(sec) : zeroLabel} active={value === sec} onClick={() => pick(sec)} />
        ))}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input
          type="number"
          min="0"
          value={text}
          onChange={(e) => { setText(e.target.value); emit(e.target.value, unit); }}
          placeholder="Özel süre"
          className={`${INPUT_CLASS} max-w-[160px]`}
        />
        {['sn', 'dk'].map(u => (
          <Chip key={u} color={color} label={u} active={unit === u} onClick={() => { setUnit(u); emit(text, u); }} />
        ))}
      </div>

    </div>
  );
};

// ───────────────────────── SAAT VE GÜNLER ─────────────────────────

export const TimeInput = ({ value, onChange }) => (

  <input
    type="time"
    value={value ?? ''}
    onChange={(e) => onChange(e.target.value)}
    className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-2xl font-black tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500/50 [color-scheme:dark]"
  />
);

const DAY_PRESETS = [
  { label: 'Her gün', value: [] },
  { label: 'Hafta içi', value: [1, 2, 3, 4, 5] },
  { label: 'Hafta sonu', value: [0, 6] },
];

const sameDays = (a, b) => a.length === b.length && a.every(d => b.includes(d));

export const DaysSelector = ({ value = [], onChange, color = '#3b82f6' }) => {

  const effective = value.length ? value : [0, 1, 2, 3, 4, 5, 6];

  const toggle = (id) => {
    const next = effective.includes(id) ? effective.filter(d => d !== id) : [...effective, id];
    if (next.length === 0) return; // en az bir gün seçili kalsın
    onChange(next.length === 7 ? [] : next.sort((a, b) => a - b));
  };

  return (

    <div className="space-y-3">

      <div className="flex gap-2">
        {DAY_PRESETS.map(p => (
          <Chip key={p.label} grow color={color} label={p.label} active={sameDays(value, p.value)} onClick={() => onChange(p.value)} />
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {WEEK_ORDER.map(d => {

          const active = effective.includes(d);

          return (
            <button
              key={d}
              type="button"
              onClick={() => toggle(d)}
              className={`w-11 h-11 rounded-full text-xs font-bold border transition-all ${active ? 'text-white' : 'bg-slate-800/60 border-slate-700 text-slate-500 hover:border-slate-600'}`}
              style={active ? { backgroundColor: color, borderColor: color } : undefined}
            >
              {SHORT_DAYS[d]}
            </button>
          );
        })}
      </div>

    </div>
  );
};

// ───────────────────────── BİLGİ SATIRI ─────────────────────────

export const InfoRow = ({ icon, iconColor, label, value, subtitle, right, depth = 0, muted, danger, onClick }) => (

  <div
    onClick={onClick}
    className={`flex items-center gap-3 pr-4 py-3 border-b border-slate-800 last:border-b-0 ${onClick ? 'cursor-pointer hover:bg-slate-800/40' : ''}`}
    style={{ paddingLeft: 16 + depth * 24, opacity: muted ? 0.45 : 1 }}
  >

    <IconBox icon={icon} color={iconColor} size="w-8 h-8" iconSize={15} />

    <div className="flex-1 min-w-0">
      {label ? <p className="text-[11px] text-slate-500">{label}</p> : null}
      <p className="text-sm font-semibold text-white break-words">{value}</p>
      {subtitle ? <p className={`text-xs mt-0.5 ${danger ? 'text-red-400' : 'text-slate-500'}`}>{subtitle}</p> : null}
    </div>

    {right}

  </div>
);

// Basit çubuk grafik (prova ve sensör normali için)
export const Bars = ({ values, labels, color, height = 56 }) => {

  const max = Math.max(1, ...values);

  return (

    <div>

      <div className="flex items-end gap-0.5" style={{ height }}>
        {values.map((v, i) => (
          <div key={i} className="flex-1 rounded-sm" title={String(v)} style={{ height: Math.max(2, (v / max) * height), backgroundColor: v ? color : '#334155' }} />
        ))}
      </div>

      {labels && (
        <div className="flex justify-between mt-1">
          {labels.map((l, i) => <span key={i} className="text-[10px] text-slate-500">{l}</span>)}
        </div>
      )}

    </div>
  );
};
