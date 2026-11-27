import React, { useState, useEffect, useCallback } from 'react';
import { Home, Layers, ChevronRight, Zap, CheckCircle, ShieldCheck, ShoppingCart, Plug, Droplets, Wind, Eye } from 'lucide-react';

const PRICES = { relay: 1200, waterSensor: 420, curtain: 3000, motion: 350 };

const DEVICE_CONFIG = [

  { key: 'relay', label: 'Akıllı Kontrol Rölesi', Icon: Plug },
  { key: 'waterSensor', label: 'Su Baskın Sensörü', Icon: Droplets },
  { key: 'curtain', label: 'Akıllı Perde Motoru', Icon: Wind },
  { key: 'motion', label: 'Hareket Sensörü', Icon: Eye },
];

const HOUSE_TYPES = {

  '1+1': ['Salon', 'Yatak Odası', 'Mutfak', 'Banyo'],
  '2+1': ['Salon', 'Yatak Odası', 'Çocuk Odası', 'Mutfak', 'Banyo'],
  '3+1': ['Salon', 'Ebeveyn Yatak Odası', 'Çocuk Odası', 'Misafir Odası', 'Mutfak', 'Banyo'],
  '4+1': ['Salon', 'Ebeveyn Yatak Odası', 'Çocuk Odası 1', 'Çocuk Odası 2', 'Misafir Odası', 'Mutfak', 'Banyo'],
};

const LAYOUTS = {

  '1+1': [
    { x: 16, y: 16, w: 260, h: 170, label: 'Salon' },
    { x: 16, y: 206, w: 260, h: 78, label: 'Mutfak' },
    { x: 296, y: 16, w: 168, h: 268, label: 'Yatak Odası' },
    { x: 484, y: 16, w: 140, h: 268, label: 'Banyo' },
  ],
  '2+1': [
    { x: 16, y: 16, w: 200, h: 160, label: 'Salon' },
    { x: 16, y: 196, w: 200, h: 88, label: 'Mutfak' },
    { x: 236, y: 16, w: 160, h: 130, label: 'Yatak Odası' },
    { x: 236, y: 166, w: 160, h: 118, label: 'Çocuk Odası' },
    { x: 416, y: 16, w: 208, h: 268, label: 'Banyo' },
  ],
  '3+1': [
    { x: 16, y: 16, w: 180, h: 268, label: 'Salon' },
    { x: 216, y: 16, w: 140, h: 130, label: 'Ebeveyn Yatak Odası' },
    { x: 216, y: 166, w: 140, h: 118, label: 'Çocuk Odası' },
    { x: 376, y: 16, w: 120, h: 130, label: 'Misafir Odası' },
    { x: 376, y: 166, w: 120, h: 60, label: 'Mutfak' },
    { x: 516, y: 16, w: 108, h: 268, label: 'Banyo' },
  ],
  '4+1': [
    { x: 16, y: 16, w: 160, h: 268, label: 'Salon' },
    { x: 196, y: 16, w: 120, h: 120, label: 'Ebeveyn Yatak Odası' },
    { x: 196, y: 156, w: 120, h: 128, label: 'Çocuk Odası 1' },
    { x: 336, y: 16, w: 110, h: 120, label: 'Çocuk Odası 2' },
    { x: 336, y: 156, w: 110, h: 128, label: 'Misafir Odası' },
    { x: 466, y: 16, w: 90, h: 120, label: 'Mutfak' },
    { x: 466, y: 156, w: 90, h: 128, label: 'Banyo' },
  ],
};

const ROOM_COLORS = ['#1A56DB', '#0891B2', '#7C3AED', '#059669', '#D97706', '#DC2626', '#9333EA'];
const ROOM_COLORS_LIGHT = ['#EEF2FF', '#ECFEFF', '#F5F3FF', '#ECFDF5', '#FFFBEB', '#FEF2F2', '#FAF5FF'];

const emptyRoom = () => ({ relay: 0, waterSensor: 0, curtain: 0, motion: 0 });

function getRoomColor(type, room) {

  const idx = HOUSE_TYPES[type].indexOf(room);
  return ROOM_COLORS[idx % ROOM_COLORS.length];
}

function getRoomColorLight(type, room) {

  const idx = HOUSE_TYPES[type].indexOf(room);
  return ROOM_COLORS_LIGHT[idx % ROOM_COLORS_LIGHT.length];
}

function roomDeviceCount(selections, room) {

  if (!selections[room]) return 0;
  return Object.values(selections[room]).reduce((a, b) => a + b, 0);
}

function FloorPlan({ type, activeRoom, selections, onRoomSelect }) {

  const layout = LAYOUTS[type] || [];

  const splitLabel = (text, maxChars) => {

    const words = text.split(' ');
    const lines = [];
    let cur = '';

    words.forEach((w) => {

      if ((cur + ' ' + w).trim().length > maxChars && cur) {

        lines.push(cur.trim());
        cur = w;
      } else {

        cur = (cur + ' ' + w).trim();
      }
    });
    if (cur) lines.push(cur.trim());
    return lines;
  };

  return (

    <svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 6 }}>

      <rect x="8" y="8" width="624" height="284" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.12" />

      {layout.map((room) => {

        const isActive = room.label === activeRoom;
        const cnt = roomDeviceCount(selections, room.label);
        const col = getRoomColor(type, room.label);
        const maxChars = Math.floor(room.w / 8);
        const shortLabel = room.w < 80 ? room.label.split(' ').slice(-1)[0] : room.label;
        const lines = splitLabel(shortLabel, maxChars);
        const lineH = 13;
        const cx = room.x + room.w / 2;
        const cy = room.y + room.h / 2;
        const startY = cy - ((lines.length - 1) * lineH) / 2;
        const fontSize = room.w < 90 ? 9 : 11;

        return (

          <g key={room.label} style={{ cursor: 'pointer' }} onClick={() => onRoomSelect(room.label)}>

            <rect x={room.x} y={room.y} width={room.w} height={room.h} rx={4} fill={col} fillOpacity={isActive ? 0.15 : 0.04} stroke={isActive ? col : 'currentColor'} strokeWidth={isActive ? 2 : 1} strokeOpacity={isActive ? 1 : 0.2}/>
            {isActive && ( <rect x={room.x} y={room.y} width={room.w} height={3} rx={2} fill={col} fillOpacity={0.9} /> )}

            {lines.map((line, i) => ( <text key={i} x={cx} y={startY + i * lineH} textAnchor="middle" dominantBaseline="middle" style={{fontFamily: 'system-ui, sans-serif', fontSize, fontWeight: isActive ? 700 : 500, fill: col, fillOpacity: 0.9, pointerEvents: 'none' }}>
              {line}
            </text> ))}

            {cnt > 0 && ( <>
              <circle cx={room.x + room.w - 8} cy={room.y + 8} r={8} fill={col} fillOpacity={0.9} />

              <text x={room.x + room.w - 8} y={room.y + 8} textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: 'system-ui, sans-serif', fontSize: 9, fontWeight: 700, fill: '#fff', pointerEvents: 'none' }}>
                {cnt}
              </text>

            </> )}

            <rect x={room.x + 4} y={room.y + room.h - 3} width={20} height={3} rx={1.5} fill={col} fillOpacity={0.4} />

          </g>
        );
      })}
    </svg>
  );
}

export default function QuoteCalculator() {

  const [selectedType, setSelectedType] = useState('2+1');
  const [activeRoom, setActiveRoom] = useState('Salon');
  const [selections, setSelections] = useState(() => {

    const s = {};
    HOUSE_TYPES['2+1'].forEach((r) => { s[r] = emptyRoom(); });
    return s;
  });

  useEffect(() => {

    const rooms = HOUSE_TYPES[selectedType];
    const s = {};
    rooms.forEach((r) => { s[r] = emptyRoom(); });
    setSelections(s);
    setActiveRoom(rooms[0]);
  }, [selectedType]);

  const changeQty = useCallback((dev, delta) => {

    setSelections((prev) => {

      const room = { ...(prev[activeRoom] || emptyRoom()) };
      room[dev] = Math.max(0, (room[dev] || 0) + delta);
      return { ...prev, [activeRoom]: room };
    });
  }, [activeRoom]);

  const calcTotal = () => {

    let price = 0, devices = 0;

    Object.values(selections).forEach((rd) => {

      Object.entries(rd).forEach(([d, q]) => { price += (PRICES[d] || 0) * q; devices += q; });
    });
    return { price, devices };
  };

  const { price: totalPrice, devices: totalDevices } = calcTotal();
  const currentRoom = selections[activeRoom] || emptyRoom();

  return (

    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">

      <div className="max-w-5xl mx-auto">

        <div className="mb-8">

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2"><Home size={22} className="text-blue-600" />Akıllı Ev Paket Tasarımcısı</h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Ev tipinizi seçin, oda planından oda seçin, cihaz miktarlarını belirleyin.</p>

        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm mb-3">

          <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-4 flex items-center gap-2"><Layers size={13} /> Kat Planı — Oda Seçin</p>
          <FloorPlan type={selectedType} activeRoom={activeRoom} selections={selections} onRoomSelect={setActiveRoom} />

        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm mb-5">

          <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3 flex items-center gap-2"><Home size={13} /> Ev Tipi</p>

          <div className="grid grid-cols-4 gap-3">

            {Object.keys(HOUSE_TYPES).map((t) => ( <button key={t} onClick={() => setSelectedType(t)} className={`py-3 rounded-xl font-bold text-sm border transition-all ${t === selectedType ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>{t}</button> ))}

          </div>

        </div>

        <div className="flex flex-wrap gap-2 mb-5">

          {HOUSE_TYPES[selectedType].map((room) => {

            const cnt = roomDeviceCount(selections, room);
            const col = getRoomColor(selectedType, room);
            const isActive = room === activeRoom;

            return (

              <button key={room} onClick={() => setActiveRoom(room)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${isActive ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} >

                <span style={{ width: 7, height: 7, borderRadius: 2, background: col, display: 'inline-block', flexShrink: 0 }} />
                {room}
                {cnt > 0 && ( <span style={{ color: col, fontFamily: 'monospace', fontSize: 10, fontWeight: 700 }}>{cnt}</span> )}

              </button>
            );
          })}

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          <div className="lg:col-span-3">

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">

              <div className="flex items-center gap-2 mb-4">

                <div className="w-2 h-5 rounded-sm" style={{ background: getRoomColor(selectedType, activeRoom) }} />
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{activeRoom} İhtiyaçları</h3>
                <span className="ml-auto text-xs text-slate-400">Bu oda için adet belirleyin</span>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {DEVICE_CONFIG.map(({ key, label, Icon }) => ( <div key={key} className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50/60 dark:bg-slate-800/30 flex justify-between items-center gap-3">

                  <div className="flex items-center gap-2 min-w-0">

                    <Icon size={15} className="text-blue-500 shrink-0" />

                    <div className="min-w-0">

                      <p className="text-sm font-semibold truncate">{label}</p>
                      <p className="text-xs text-slate-400 font-mono">{PRICES[key].toLocaleString('tr-TR')} ₺ / adet</p>

                    </div>

                  </div>

                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 overflow-hidden shrink-0">

                    <button onClick={() => changeQty(key, -1)} className="w-8 h-8 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center">−</button>
                    <span className="w-8 text-center text-sm font-bold font-mono">{currentRoom[key]}</span>
                    <button onClick={() => changeQty(key, 1)} className="w-8 h-8 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center">+</button>

                  </div>

                </div> ))}

              </div>

            </div>

          </div>

          <div className="lg:col-span-2">

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-md sticky top-6">

              <h3 className="text-sm font-bold mb-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2"><Zap size={15} className="text-amber-500" /> Anlık Fiyat Teklifi</h3>

              <div className="space-y-2 mb-4 min-h-[60px]">

                {HOUSE_TYPES[selectedType].map((room) => {

                  const cnt = roomDeviceCount(selections, room);
                  if (cnt === 0) return null;
                  const roomPrice = Object.entries(selections[room] || {}).reduce((sum, [d, q]) => sum + (PRICES[d] || 0) * q, 0);
                  const col = getRoomColor(selectedType, room);

                  return (

                    <div key={room} className="flex justify-between items-center text-xs">

                      <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">

                        <span style={{ width: 7, height: 7, borderRadius: 2, background: col, display: 'inline-block', flexShrink: 0 }} />
                        {room}
                        <span className="text-slate-300 dark:text-slate-600 font-mono">({cnt})</span>

                      </span>

                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">{roomPrice.toLocaleString('tr-TR')} ₺</span>

                    </div>
                  );
                })}

                {totalDevices === 0 && ( <p className="text-xs text-slate-400 text-center py-2">Henüz cihaz seçilmedi</p> )}

              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mb-4">

                <div className="flex justify-between items-baseline mb-1">

                  <span className="text-xs text-slate-500 dark:text-slate-400">Toplam Cihaz</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">{totalDevices} adet</span>

                </div>

                <div className="flex justify-between items-baseline">

                  <span className="text-sm font-bold">Tahmini Tutar</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">{totalPrice.toLocaleString('tr-TR')} ₺</span>

                </div>

                <p className="text-[10px] text-slate-400 text-right mt-0.5">%20 KDV ve kurulum hariçtir</p>

              </div>

              <ul className="space-y-1.5 mb-5">

                {[
                  'Odaya göre ön-konfigürasyon dahil',
                  'Zigbee Hub pakete ücretsiz eklenir',
                  'Her cihaz için kurulum rehberi',
                ].map((feat) => ( <li key={feat} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">

                  <CheckCircle size={13} className="text-green-500 shrink-0" />{feat}

                </li> ))}

              </ul>

              <button disabled={totalDevices === 0} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:dark:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm shadow-lg shadow-blue-600/10">

                <ShoppingCart size={15} />
                <span>Teklifi Sepete Ekle</span>
                <ChevronRight size={15} />

              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">

                <ShieldCheck size={13} className="text-emerald-500" />
                <span>3 Yıl Birebir Değişim Garantisi</span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}