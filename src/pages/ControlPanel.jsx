import React, { useState, useEffect } from 'react';

import Sidebar from '../layout/Sidebar';

import { Cpu, Lightbulb, Zap, Thermometer, Droplets, Power, Activity, SignalHigh, SignalLow, Settings, Bell, Home as HomeIcon, ChevronRight } from 'lucide-react';

const ControlPanel = () => {

  const [homes, setHomes] = useState([

    { id: 1, name: 'Merkez Ev', rooms: [
      { id: 1, name: 'Oturma Odası', devices: [
        { id: 1, name: 'Tavan Lambası', type: 'light', status: true, brightness: 80 },
        { id: 2, name: 'Ana Priz', type: 'power', status: false, energy: 0 },
      ]},
      { id: 2, name: 'Salon', devices: [
        { id: 1, name: 'Tavan Lambası', type: 'light', status: true, brightness: 50 },
        { id: 2, name: 'Su Kaçak Sensörü', type: 'sensor', status: true },
      ]},
      { id: 3, name: 'Mutfak', devices: [
        { id: 1, name: 'Tavan Lambası', type: 'light', status: true, brightness: 20 },
        { id: 2, name: 'Su Kaçak Sensörü', type: 'sensor', status: true },
      ]},
      { id: 4, name: 'Yatak Odası', devices: [
        { id: 1, name: 'Tavan Lambası', type: 'light', status: true, brightness: 100 },
        { id: 2, name: 'Su Kaçak Sensörü', type: 'sensor', status: true },
      ]},
    ]},
    { id: 2, name: 'Ofis', rooms: [
      { id: 1, name: 'oda1', devices: [
        { id: 1, name: 'İş İstasyonu', type: 'power', status: true, energy: 450 },
        { id: 2, name: 'Klima', type: 'climate', status: true, temperature: 22 },
      ]}
    ]},
    { id: 3, name: 'Yazlık', rooms: [
      { id: 1, name: 'oda1', devices: [
        { id: 1, name: 'İş İstasyonu', type: 'power', status: true, energy: 450 },
        { id: 2, name: 'Klima', type: 'climate', status: true, temperature: 22 },
      ]},
      { id: 2, name: 'oda1', devices: [
        { id: 1, name: 'İş İstasyonu', type: 'power', status: true, energy: 450 },
        { id: 2, name: 'Klima', type: 'climate', status: true, temperature: 22 },
      ]}
    ]}
  ]);

  const [selectedHome, setSelectedHome] = useState(homes[0]);
  const [selectedRoom, setSelectedRoom] = useState(selectedHome.rooms[0]);

  useEffect(() => {

    setSelectedRoom(selectedHome.rooms[0]);
  }, [selectedHome]);

  const updateDevice = (roomId, deviceId, updates) => {
    const updatedHome = { ...selectedHome };
    updatedHome.rooms = updatedHome.rooms.map(room => {
      if (room.id === roomId) {
        room.devices = room.devices.map(d => d.id === deviceId ? { ...d, ...updates } : d );
      }
      return room;
    });
    setHomes(homes.map(h => h.id === updatedHome.id ? updatedHome : h));
    setSelectedHome(updatedHome);
  };

  const getDeviceIcon = (type, active) => {

    const color = active ? 'text-blue-400' : 'text-slate-500';

    switch(type){

      case 'light': return <Lightbulb size={24} className={color} />;
      case 'power': return <Zap size={24} className={color} />;
      case 'climate': return <Thermometer size={24} className={color} />;
      case 'sensor': return <Droplets size={24} className={color} />;
      default: return <Cpu size={24} className={color} />;
    }
  };

  const totalEnergy = selectedRoom.devices.reduce((sum, d) => sum + (d.energy || 0), 0);

  return (

    <div className="flex bg-[#050810] min-h-screen">

      <Sidebar />

      <main className="flex-1 lg:ml-0 overflow-x-hidden p-6 space-y-8 selection:bg-blue-500/30">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                <span>Evlerim</span> <ChevronRight size={14} /> <span>{selectedHome.name}</span>
              </div>
              <h1 className="text-3xl font-black text-white">Kontrol Paneli</h1>
            </div>
            
            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
              {homes.map(home => (
                <button 
                  key={home.id} 
                  onClick={() => setSelectedHome(home)} 
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${selectedHome.id === home.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'hover:bg-white/5 text-slate-400'}`}>
                  {home.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {selectedHome.rooms.map(room => (
              <button 
                key={room.id} 
                onClick={() => setSelectedRoom(room)}
                className={`px-5 py-2.5 rounded-xl whitespace-nowrap text-sm font-medium border transition-all duration-300 ${selectedRoom.id === room.id ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-slate-400 hover:border-white/30'}`}>
                {room.name}
              </button>
            ))}
          </div>

          {/* Cihaz Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {selectedRoom.devices.map(device => (
              <div 
                key={device.id} 
                className={`group relative overflow-hidden rounded-[2rem] p-6 transition-all duration-500 border ${device.status ? 'bg-slate-900 border-blue-500/50 shadow-2xl shadow-blue-500/10' : 'bg-slate-900/40 border-white/5'}`}>
                
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-2xl transition-colors duration-500 ${device.status ? 'bg-blue-500/10' : 'bg-slate-800'}`}>
                    {getDeviceIcon(device.type, device.status)}
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={`w-2 h-2 rounded-full mb-1 ${device.status ? 'bg-blue-500 animate-pulse' : 'bg-slate-600'}`} />
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{device.status ? 'Online' : 'Offline'}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{device.name}</h3>
                
                <div className="mb-8 min-h-[40px]">
                  {device.type === 'climate' && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-light text-white">{device.temperature}°</span>
                      <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-md uppercase">Hedef</span>
                    </div>
                  )}
                  {device.type === 'light' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Parlaklık</span>
                        <span>{device.brightness}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${device.brightness}%` }} />
                      </div>
                    </div>
                  )}
                  {device.type === 'power' && (
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-light text-white">{device.energy}</span>
                      <span className="text-xs text-slate-500">Watt</span>
                    </div>
                  )}
                  {device.type === 'sensor' && (
                    <span className="text-xs text-green-500 font-medium bg-green-500/10 px-3 py-1 rounded-full italic">Güvende</span>
                  )}
                </div>

                <button 
                  onClick={() => updateDevice(selectedRoom.id, device.id, { status: !device.status })} 
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold transition-all duration-300 ${device.status ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                  <Power size={18} />
                  <span>{device.status ? 'Kapat' : 'Çalıştır'}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Alt Bilgi Kartları */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <Activity className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-125 transition-transform duration-700" size={180} />
              <div className="relative z-10">
                <h4 className="text-white/80 font-medium mb-1">Anlık Güç Tüketimi</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black">{totalEnergy}</span>
                  <span className="text-xl font-light opacity-70">Watt / saat</span>
                </div>
                <div className="mt-6 flex gap-4">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                    <p className="text-[10px] uppercase font-bold text-white/60">Aktif Cihaz</p>
                    <p className="text-xl font-bold">{selectedRoom.devices.filter(d => d.status).length}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                    <p className="text-[10px] uppercase font-bold text-white/60">Verimlilik</p>
                    <p className="text-xl font-bold">%94</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-yellow-500/20 text-yellow-500 rounded-2xl">
                  <SignalHigh size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white">Sistem Durumu</h4>
                  <p className="text-sm text-slate-400">Tüm köprüler bağlı ve optimize edildi.</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-sm">MQTT Bağlantısı</span>
                  <span className="text-xs font-bold text-green-500">STABİL</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-sm">Gecikme (Latency)</span>
                  <span className="text-xs font-bold text-blue-400">24ms</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ControlPanel;