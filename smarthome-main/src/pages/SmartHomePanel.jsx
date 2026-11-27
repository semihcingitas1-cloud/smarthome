import React, { useState, useRef, useEffect } from 'react';

const SmartHomePanel = () => {
  const DATA = {
    homes: [
      { id: 1, name: 'Merkez Ev', rooms: [
        { id: 1, name: 'Oturma Odası' },
        { id: 2, name: 'Salon' },
        { id: 3, name: 'Mutfak' },
        { id: 4, name: 'Yatak Odası' }
      ]},
      { id: 2, name: 'Ofis', rooms: [
        { id: 1, name: 'Açık Alan' },
        { id: 2, name: 'Toplantı' }
      ]},
      { id: 3, name: 'Yazlık', rooms: [
        { id: 1, name: 'Balkon' },
        { id: 2, name: 'Oturma' }
      ]}
    ]
  };

  const WIDGET_DEFAULTS = {
    light: { name: 'Lamba', icon: '💡', bg: '#1a2a1a', status: true, brightness: 70 },
    power: { name: 'Priz', icon: '⚡', bg: '#1a1a2e', status: false, energy: 220 },
    climate: { name: 'Klima', icon: '🌡️', bg: '#1a2030', status: true, temp: 22 },
    sensor: { name: 'Sensör', icon: '💧', bg: '#001a2e', status: true },
    button: { name: 'Buton', icon: '🔘', bg: '#1a1020', status: false }
  };

  const [mode, setMode] = useState('edit');
  const [selectedHome, setSelectedHome] = useState(DATA.homes[0]);
  const [selectedRoom, setSelectedRoom] = useState(DATA.homes[0].rooms[0]);
  const [widgets, setWidgets] = useState({});
  const [widgetIdCounter, setWidgetIdCounter] = useState(0);
  const [dragType, setDragType] = useState(null);
  const [draggingPlaced, setDraggingPlaced] = useState(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const roomKey = () => `h${selectedHome.id}_r${selectedRoom.id}`;
  const getWidgets = () => widgets[roomKey()] || [];

  const handleSelectHome = (homeId) => {
    const home = DATA.homes.find(h => h.id === homeId);
    setSelectedHome(home);
    setSelectedRoom(home.rooms[0]);
  };

  const handleSelectRoom = (roomId) => {
    const room = selectedHome.rooms.find(r => r.id === roomId);
    setSelectedRoom(room);
  };

  const handleDragStart = (e, type) => {
    setDragType(type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!dragType) return;
    
    const zone = e.currentTarget;
    const rect = zone.getBoundingClientRect();
    const x = Math.max(0, e.clientX - rect.left - 70);
    const y = Math.max(0, e.clientY - rect.top - 40);
    
    addWidget(dragType, x, y);
    setDragType(null);
  };

  const addWidget = (type, x, y) => {
    const id = widgetIdCounter + 1;
    setWidgetIdCounter(id);
    
    const def = WIDGET_DEFAULTS[type];
    const key = roomKey();
    
    setWidgets(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), { id, type, x, y, ...JSON.parse(JSON.stringify(def)) }]
    }));
  };

  const removeWidget = (id) => {
    const key = roomKey();
    setWidgets(prev => ({
      ...prev,
      [key]: (prev[key] || []).filter(w => w.id !== id)
    }));
  };

  const toggleWidget = (id) => {
    const key = roomKey();
    setWidgets(prev => ({
      ...prev,
      [key]: (prev[key] || []).map(w => w.id === id ? { ...w, status: !w.status } : w)
    }));
  };

  const setBrightness = (id, val) => {
    const key = roomKey();
    setWidgets(prev => ({
      ...prev,
      [key]: (prev[key] || []).map(w => w.id === id ? { ...w, brightness: +val } : w)
    }));
  };

  const setTemp = (id, delta) => {
    const key = roomKey();
    setWidgets(prev => ({
      ...prev,
      [key]: (prev[key] || []).map(w => 
        w.id === id ? { ...w, temp: Math.max(16, Math.min(30, w.temp + delta)) } : w
      )
    }));
  };

  const startDragPlaced = (e, widget) => {
    if (mode !== 'edit') return;
    if (e.target.classList.contains('remove-btn')) return;
    
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    
    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    setDraggingPlaced(widget.id);
    e.preventDefault();
  };

  const movePlaced = (e) => {
    if (!draggingPlaced) return;
    
    const zone = document.getElementById('dropZone');
    if (!zone) return;
    
    const zRect = zone.getBoundingClientRect();
    const key = roomKey();
    
    setWidgets(prev => ({
      ...prev,
      [key]: (prev[key] || []).map(w => 
        w.id === draggingPlaced ? {
          ...w,
          x: Math.max(0, e.clientX - zRect.left - dragOffsetRef.current.x),
          y: Math.max(0, e.clientY - zRect.top - dragOffsetRef.current.y)
        } : w
      )
    }));
  };

  const stopDragPlaced = () => {
    setDraggingPlaced(null);
  };

  useEffect(() => {
    if (draggingPlaced) {
      document.addEventListener('mousemove', movePlaced);
      document.addEventListener('mouseup', stopDragPlaced);
      return () => {
        document.removeEventListener('mousemove', movePlaced);
        document.removeEventListener('mouseup', stopDragPlaced);
      };
    }
  }, [draggingPlaced]);

  const currentWidgets = getWidgets();

  return (
    <div style={styles.app}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: var(--font-sans); background: transparent; }
        .slider-wrap input[type=range] { width: 100%; height: 4px; accent-color: #2563eb; }
      `}</style>

      <div style={styles.topbar}>
        <div style={styles.topbarLeft}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span style={styles.topbarTitle}>Akıllı Ev Paneli</span>
        </div>
        
        <div style={styles.homeTabs}>
          {DATA.homes.map(h => (
            <button 
              key={h.id}
              style={{...styles.homeTab, ...(h.id === selectedHome.id ? styles.homeTabActive : {})}}
              onClick={() => handleSelectHome(h.id)}
            >
              {h.name}
            </button>
          ))}
        </div>
        
        <div style={styles.modeToggle}>
          <button 
            style={{...styles.modeBtn, ...(mode === 'edit' ? styles.modeBtnActive : {})}}
            onClick={() => setMode('edit')}
          >
            ✦ Yerleştir
          </button>
          <button 
            style={{...styles.modeBtn, ...(mode === 'use' ? styles.modeBtnActive : {})}}
            onClick={() => setMode('use')}
          >
            ▶ Kullan
          </button>
        </div>
      </div>

      <div style={styles.roomTabs}>
        {selectedHome.rooms.map(r => (
          <button 
            key={r.id}
            style={{...styles.roomTab, ...(r.id === selectedRoom.id ? styles.roomTabActive : {})}}
            onClick={() => handleSelectRoom(r.id)}
          >
            {r.name}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {mode === 'edit' && (
          <div style={styles.sidebar}>
            <div style={styles.sidebarTitle}>Bileşenler</div>
            
            {Object.entries(WIDGET_DEFAULTS).map(([type, def]) => (
              <div 
                key={type}
                style={styles.widgetItem}
                draggable
                onDragStart={(e) => handleDragStart(e, type)}
              >
                <div style={{...styles.widgetIcon, background: def.bg}}>{def.icon}</div>
                <span style={styles.widgetLabel}>{def.name}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{...styles.canvas, ...(mode === 'use' ? styles.canvasUseMode : {})}}>
          <div 
            id="dropZone"
            style={styles.dropZone}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {currentWidgets.length === 0 && (
              <div style={styles.canvasHint}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width: 48, height: 48, margin: '0 auto 8px', display: 'block', opacity: 0.5}}>
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
                <p>Bileşenleri buraya sürükleyin</p>
              </div>
            )}

            {currentWidgets.map(w => (
              <div 
                key={w.id}
                style={{
                  ...styles.placedWidget,
                  left: w.x,
                  top: w.y,
                  cursor: mode === 'edit' ? 'grab' : 'default',
                  opacity: draggingPlaced === w.id ? 0.5 : 1
                }}
                onMouseDown={(e) => startDragPlaced(e, w)}
              >
                {mode === 'edit' && (
                  <button 
                    className="remove-btn"
                    style={styles.removeBtn}
                    onClick={() => removeWidget(w.id)}
                  >
                    ✕
                  </button>
                )}
                
                <div style={styles.pwHeader}>
                  <div style={{...styles.pwIcon, background: w.bg}}>{w.icon}</div>
                  <span style={styles.pwName}>{w.name}</span>
                  <div style={{...styles.pwStatus, ...(w.status ? styles.pwStatusOn : styles.pwStatusOff)}} />
                </div>

                {w.type === 'light' && (
                  <>
                    <div className="slider-wrap" style={{marginTop: 8, ...(!mode === 'use' ? {pointerEvents: 'none', opacity: 0.6} : {})}}>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={w.brightness}
                        onChange={(e) => setBrightness(w.id, e.target.value)}
                        disabled={mode !== 'use'}
                      />
                      <div style={styles.sliderVal}>{w.brightness}%</div>
                    </div>
                    <button 
                      style={{...styles.toggleBtn, ...(w.status ? styles.toggleBtnOn : {}), ...(mode === 'edit' ? {opacity: 0.5, cursor: 'default'} : {})}}
                      onClick={() => mode === 'use' && toggleWidget(w.id)}
                    >
                      {w.status ? 'Kapat' : 'Aç'}
                    </button>
                  </>
                )}

                {w.type === 'climate' && (
                  <>
                    <div style={styles.tempDisplay}>{w.temp}°</div>
                    <div style={styles.tempControls}>
                      <button 
                        style={{...styles.tempBtn, ...(mode === 'edit' ? {opacity: 0.4} : {})}}
                        onClick={() => mode === 'use' && setTemp(w.id, -1)}
                      >
                        −
                      </button>
                      <button 
                        style={{...styles.tempBtn, ...(mode === 'edit' ? {opacity: 0.4} : {})}}
                        onClick={() => mode === 'use' && setTemp(w.id, +1)}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      style={{...styles.toggleBtn, ...(w.status ? styles.toggleBtnOn : {}), marginTop: 8, ...(mode === 'edit' ? {opacity: 0.5, cursor: 'default'} : {})}}
                      onClick={() => mode === 'use' && toggleWidget(w.id)}
                    >
                      {w.status ? 'Çalışıyor' : 'Durdur'}
                    </button>
                  </>
                )}

                {w.type === 'power' && (
                  <>
                    <div style={styles.energyVal}>{w.energy}W</div>
                    <div style={styles.energySub}>Anlık tüketim</div>
                    <button 
                      style={{...styles.toggleBtn, ...(w.status ? styles.toggleBtnOn : {}), marginTop: 8, ...(mode === 'edit' ? {opacity: 0.5, cursor: 'default'} : {})}}
                      onClick={() => mode === 'use' && toggleWidget(w.id)}
                    >
                      {w.status ? 'Kapat' : 'Aç'}
                    </button>
                  </>
                )}

                {w.type === 'sensor' && (
                  <div style={styles.sensorVal}>Güvende ✓</div>
                )}

                {w.type === 'button' && (
                  <button 
                    style={{...styles.toggleBtn, ...(w.status ? styles.toggleBtnOn : {}), fontSize: 14, padding: 12, ...(mode === 'edit' ? {opacity: 0.5, cursor: 'default'} : {})}}
                    onClick={() => mode === 'use' && toggleWidget(w.id)}
                  >
                    {w.status ? '● Aktif' : '○ Tetikle'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.editBar}>
        <span>
          {mode === 'edit' ? (
            <>
              <span style={styles.editBadge}>YERLEŞTIRME MODU</span> — Sol panelden bileşen sürükleyin
            </>
          ) : (
            <>
              <span style={{...styles.editBadge, background: '#052e16', color: '#4ade80'}}>KULLANIM MODU</span> — Bileşenler aktif
            </>
          )}
        </span>
        <span>{currentWidgets.length} bileşen</span>
      </div>
    </div>
  );
};

const styles = {
  app: {
    minHeight: 600,
    background: '#050810',
    borderRadius: 16,
    overflow: 'hidden',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column'
  },
  topbar: {
    background: '#0d1117',
    borderBottom: '1px solid #1e2433',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap'
  },
  topbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flex: 1
  },
  topbarTitle: {
    fontSize: 15,
    fontWeight: 500,
    color: '#e2e8f0'
  },
  modeToggle: {
    display: 'flex',
    background: '#1a2035',
    borderRadius: 10,
    padding: 3,
    gap: 2,
    marginLeft: 'auto'
  },
  modeBtn: {
    padding: '6px 14px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 500,
    transition: 'all .2s',
    background: 'transparent',
    color: '#64748b'
  },
  modeBtnActive: {
    background: '#2563eb',
    color: '#fff'
  },
  homeTabs: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap'
  },
  homeTab: {
    padding: '5px 12px',
    borderRadius: 8,
    border: '1px solid #1e2433',
    background: 'transparent',
    color: '#64748b',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all .2s'
  },
  homeTabActive: {
    background: '#1e3a5f',
    color: '#60a5fa',
    borderColor: '#2563eb'
  },
  roomTabs: {
    display: 'flex',
    gap: 6,
    padding: '10px 20px',
    background: '#080d18',
    borderBottom: '1px solid #1e2433',
    overflowX: 'auto',
    flexWrap: 'nowrap'
  },
  roomTab: {
    padding: '5px 14px',
    borderRadius: 20,
    border: '1px solid #1e2433',
    background: 'transparent',
    color: '#64748b',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all .2s',
    whiteSpace: 'nowrap'
  },
  roomTabActive: {
    background: '#fff',
    color: '#000',
    borderColor: '#fff'
  },
  content: {
    display: 'flex',
    flex: 1,
    minHeight: 500
  },
  sidebar: {
    width: 220,
    background: '#080d18',
    borderRight: '1px solid #1e2433',
    padding: 14,
    overflowY: 'auto',
    flexShrink: 0
  },
  sidebarTitle: {
    fontSize: 10,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '.1em',
    marginBottom: 10,
    fontWeight: 500
  },
  widgetItem: {
    background: '#111827',
    border: '1px solid #1e2433',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    cursor: 'grab',
    transition: 'all .2s',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    userSelect: 'none'
  },
  widgetIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    flexShrink: 0
  },
  widgetLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: 500
  },
  canvas: {
    flex: 1,
    padding: 16,
    position: 'relative',
    background: 'repeating-linear-gradient(0deg, transparent, transparent 39px, #0f172a 39px, #0f172a 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, #0f172a 39px, #0f172a 40px)'
  },
  canvasUseMode: {
    background: '#080d18'
  },
  dropZone: {
    minHeight: 460,
    position: 'relative'
  },
  canvasHint: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: '#1e2433',
    pointerEvents: 'none'
  },
  placedWidget: {
    position: 'absolute',
    background: '#111827',
    border: '1px solid #1e2433',
    borderRadius: 14,
    padding: 14,
    minWidth: 140,
    transition: 'border-color .2s',
    userSelect: 'none'
  },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: '#1e2433',
    border: 'none',
    color: '#475569',
    cursor: 'pointer',
    fontSize: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1
  },
  pwHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10
  },
  pwName: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: 500
  },
  pwStatus: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    flexShrink: 0,
    marginLeft: 'auto'
  },
  pwStatusOn: {
    background: '#22c55e'
  },
  pwStatusOff: {
    background: '#374151'
  },
  pwIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    flexShrink: 0
  },
  toggleBtn: {
    width: '100%',
    background: '#1e2433',
    border: 'none',
    borderRadius: 8,
    padding: 8,
    color: '#60a5fa',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all .2s',
    fontFamily: 'var(--font-sans)'
  },
  toggleBtnOn: {
    background: '#1e3a5f',
    color: '#93c5fd'
  },
  sliderVal: {
    fontSize: 11,
    color: '#60a5fa',
    textAlign: 'right',
    marginTop: 2
  },
  tempDisplay: {
    fontSize: 24,
    fontWeight: 500,
    color: '#fff',
    textAlign: 'center',
    margin: '4px 0'
  },
  tempControls: {
    display: 'flex',
    gap: 6,
    justifyContent: 'center'
  },
  tempBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    border: '1px solid #1e2433',
    background: '#1a2035',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sensorVal: {
    fontSize: 11,
    padding: '4px 10px',
    borderRadius: 20,
    background: '#052e16',
    color: '#4ade80',
    border: '1px solid #166534',
    textAlign: 'center',
    marginTop: 4
  },
  energyVal: {
    fontSize: 18,
    fontWeight: 500,
    color: '#fff',
    textAlign: 'center',
    margin: '4px 0'
  },
  energySub: {
    fontSize: 10,
    color: '#475569',
    textAlign: 'center'
  },
  editBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 20px',
    background: '#080d18',
    borderTop: '1px solid #1e2433',
    fontSize: 11,
    color: '#475569'
  },
  editBadge: {
    background: '#1e3a5f',
    color: '#60a5fa',
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 500
  }
};

export default SmartHomePanel;