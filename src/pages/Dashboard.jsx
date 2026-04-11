import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { profile } from '../redux/userSlice';

import Sidebar from '../layout/Sidebar';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Thermometer, Droplets, Zap, ShieldCheck, Activity, Cpu, Wifi, Fan, Lightbulb, Play, Power, AlertTriangle, Wind, ChevronRight } from 'lucide-react';

const data = [

  { time: '12:00', temp: 22, power: 400 },
  { time: '13:00', temp: 23, power: 450 },
  { time: '14:00', temp: 24, power: 300 },
  { time: '15:00', temp: 23.5, power: 500 },
  { time: '16:00', temp: 25, power: 700 },
  { time: '17:00', temp: 24, power: 600 },
];

const Dashboard = () => {

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  const [isAutoMode, setIsAutoMode] = useState(true);
  const [selectedHome, setSelectedHome] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const homes = user?.user?.homes || [];

  useEffect(() => {

    dispatch(profile());
  }, [dispatch]);

  useEffect(() => {

    if (homes.length > 0 && !selectedHome) {

      setSelectedHome(homes[0]);
    }
  }, [homes, selectedHome]);

  useEffect(() => {

    if (selectedHome?.rooms?.length > 0) {

      setSelectedRoom(selectedHome.rooms[0]);
    }
  }, [selectedHome]);

  const updateDevice = (roomId, deviceId, updates) => {

    const updatedHome = {

      ...selectedHome,
      rooms: selectedHome.rooms.map((room) =>
        room._id === roomId || room.id === roomId
          ? {
              ...room,
              devices: room.devices.map((device) =>
                device._id === deviceId || device.id === deviceId
                  ? { ...device, ...updates }
                  : device
              ),
            }
          : room
      ),
    };

    setSelectedHome(updatedHome);

    const updatedRoom = updatedHome.rooms.find(

      (room) => room._id === roomId || room.id === roomId
    );

    if (updatedRoom) {
      setSelectedRoom(updatedRoom);
    }
  };

  const getDeviceIcon = (type, active) => {

    const color = active ? 'text-blue-400' : 'text-slate-500';

    switch (type) {

      case 'light':
      return <Lightbulb size={24} className={color} />;

      case 'power':
      return <Zap size={24} className={color} />;

      case 'climate':
      return <Thermometer size={24} className={color} />;

      case 'sensor':
      return <Droplets size={24} className={color} />;

      default:
      return <Cpu size={24} className={color} />;
    }
  };

  return (

    <div className="flex bg-slate-950 min-h-screen">

      <Sidebar />

      <main className="flex-1 lg:ml-0 p-6 pb-28 lg:pb-6 overflow-x-hidden">

        <div className="p-2 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-700 bg-slate-900">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-4">

              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><Cpu size={24} /></div>

              <div>

                <p className="text-xs text-slate-500 font-bold uppercase">Ana Kontrolcü (ESP32-S3)</p>
                <p className="text-sm font-mono text-slate-200 underline underline-offset-4 decoration-blue-500">Uptime: 142 Saat</p>

              </div>

            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-4">

              <div className="p-3 bg-green-500/10 rounded-lg text-green-500"><Wifi size={24} /></div>

              <div>

                <p className="text-xs text-slate-500 font-bold uppercase">Bağlantı Gecikmesi</p>
                <p className="text-sm font-mono text-slate-200">12ms (MQTT Broker: Aktif)</p>

              </div>

            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center justify-between px-6">

              <div>

                <p className="text-xs text-slate-500 font-bold uppercase">Akıllı Mod</p>
                <p className="text-sm text-slate-200">{isAutoMode ? 'Yapay Zeka Aktif' : 'Manuel Kontrol'}</p>

              </div>

              <button onClick={() => setIsAutoMode(!isAutoMode)} className={`w-12 h-6 rounded-full relative transition-colors ${isAutoMode ? 'bg-blue-600' : 'bg-slate-700'}`}>

                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAutoMode ? 'right-1' : 'left-1'}`}/>

              </button>

            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            <div className="lg:col-span-8">

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">

                <div className="flex justify-between items-center mb-6">

                  <h3 className="font-bold text-slate-200 flex items-center gap-2"><Activity size={18} className="text-blue-500" />Enerji Tüketim Analizi (Watt)</h3>

                </div>

                <div className="h-[300px] w-full">

                  <ResponsiveContainer width="100%" height="100%">

                    <AreaChart data={data}>

                      <defs>

                        <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">

                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />

                        </linearGradient>

                      </defs>

                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="time" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip />
                      <Area type="monotone" dataKey="power" stroke="#3b82f6" fill="url(#colorPower)" strokeWidth={3}/>

                    </AreaChart>

                  </ResponsiveContainer>

                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="my-10 max-w-7xl mx-auto space-y-8">

          <div className="flex flex-col lg:flex-row justify-between gap-6">

            <div className="flex items-center gap-2 text-slate-500 text-sm">

              <span>Evlerim</span>
              <ChevronRight size={14} />
              <span>{selectedHome?.name || 'Seçilmedi'}</span>

            </div>

            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 gap-2">

              {homes.map((home) => ( <button key={home._id} onClick={() => setSelectedHome(home)} className={`px-6 py-2 rounded-xl ${selectedHome?._id === home._id ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
                {home.name}
              </button> ))}

            </div>

          </div>

          <div className="flex gap-3 overflow-x-auto">

            {selectedHome?.rooms?.map((room) => ( <button key={room._id} onClick={() => setSelectedRoom(room)} className={`px-5 py-2 rounded-xl ${selectedRoom?._id === room._id ? 'bg-white text-black' : 'text-slate-400 border border-slate-700'}`}>
              {room.name}
            </button> ))}

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

            {selectedRoom?.devices?.map((device) => ( <div key={device._id} className="bg-slate-900 p-6 rounded-3xl border border-slate-800">

              <div className="mb-4">{getDeviceIcon(device.type, device.status)}</div>
              <h3 className="text-lg font-bold text-white">{device.name}</h3>

              <button onClick={() => updateDevice(selectedRoom._id, device._id, {status: !device.status,})} className="mt-4 w-full bg-blue-600 py-3 rounded-xl text-white">
                {device.status ? 'Kapat' : 'Aç'}
              </button>

            </div> ))}

          </div>

        </div>

      </main>

    </div>

  );
};

export default Dashboard;